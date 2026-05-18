import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, X, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { contactAPI } from "@/api/contactApi";

const STATUSES = ["all", "new", "read", "replied", "archived"];

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-700",
  replied: "bg-green-100 text-green-800",
  archived: "bg-amber-100 text-amber-800",
};

const ContactsAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await contactAPI.getAll(filter === "all" ? null : filter);
      setContacts(data.data || []);
    } catch (err) {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await contactAPI.update(id, { status });
      toast.success(`Marked as ${status}`);
      fetchContacts();
      if (selected && selected._id === id) {
        setSelected({ ...selected, status });
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      await contactAPI.delete(id);
      toast.success("Contact deleted");
      setSelected(null);
      fetchContacts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openContact = async (contact) => {
    setSelected(contact);
    if (contact.status === "new") {
      await updateStatus(contact._id, "read");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-[#7b5a42] text-2xl md:text-3xl">
            Contact Messages
          </h1>
          <p className="text-[#9a7c63] text-sm mt-1">
            {contacts.length} message{contacts.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#e3d4c1] rounded-lg p-1">
          <Filter size={16} className="text-[#7b5a42] ml-2" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition ${
                filter === s
                  ? "bg-[#7b5a42] text-white"
                  : "text-[#7b5a42] hover:bg-[#f8f3ec]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white border border-[#e3d4c1] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7b5a42]">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-[#9a7c63]">
            No contact messages found
          </div>
        ) : (
          <div className="divide-y divide-[#e3d4c1]">
            {contacts.map((contact) => (
              <button
                key={contact._id}
                onClick={() => openContact(contact)}
                className="w-full text-left p-5 hover:bg-[#fdfaf3] transition flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#7b5a42] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {contact.name[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-medium text-[#6d513d]">
                        {contact.name}
                      </p>
                      <p className="text-sm text-[#9a7c63]">{contact.email}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[contact.status]
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#7a6656] mt-2 line-clamp-2">
                    {contact.message}
                  </p>
                  <p className="text-xs text-[#9a7c63] mt-2">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#e3d4c1] sticky top-0 bg-white">
              <h2 className="font-serif text-[#7b5a42] text-2xl">
                Message Details
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-[#9a7c63] hover:text-[#7b5a42]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-1">
                    Name
                  </p>
                  <p className="text-[#6d513d] font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[selected.status]
                    }`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-[#7b5a42] font-medium hover:underline flex items-center gap-2"
                >
                  <Mail size={16} />
                  {selected.email}
                </a>
              </div>

              {selected.phone && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-1">
                    Phone
                  </p>
                  <a
                    href={`tel:${selected.phone}`}
                    className="text-[#7b5a42] font-medium hover:underline flex items-center gap-2"
                  >
                    <Phone size={16} />
                    {selected.phone}
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-2">
                  Message
                </p>
                <div className="bg-[#f8f3ec] p-4 rounded-lg text-[#6d513d] leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-1">
                  Received
                </p>
                <p className="text-[#7a6656]">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="pt-4 border-t border-[#e3d4c1]">
                <p className="text-xs uppercase tracking-wider text-[#9a7c63] mb-3">
                  Change Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {["new", "read", "replied", "archived"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selected._id, status)}
                      disabled={selected.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selected.status === status
                          ? "bg-[#7b5a42] text-white cursor-not-allowed"
                          : "border border-[#e3d4c1] text-[#7b5a42] hover:bg-[#f8f3ec]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDelete(selected._id)}
                className="w-full py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsAdmin;
