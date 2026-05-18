import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { faqAPI } from "@/api/faqApi";

const CATEGORIES = ["General", "Products", "Shipping", "Quality", "Company"];

const FAQsAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    order: 0,
    isActive: true,
  });

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data } = await faqAPI.getAllAdmin();
      setFaqs(data.data || []);
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const openCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "General",
      order: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isActive: faq.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error("Question and answer are required");
      return;
    }
    try {
      if (editingFaq) {
        await faqAPI.update(editingFaq._id, formData);
        toast.success("FAQ updated successfully");
      } else {
        await faqAPI.create(formData);
        toast.success("FAQ created successfully");
      }
      setShowModal(false);
      fetchFAQs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (faq) => {
    if (!confirm(`Delete "${faq.question.slice(0, 50)}..."?`)) return;
    try {
      await faqAPI.delete(faq._id);
      toast.success("FAQ deleted");
      fetchFAQs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (faq) => {
    try {
      await faqAPI.update(faq._id, { isActive: !faq.isActive });
      toast.success(faq.isActive ? "FAQ hidden" : "FAQ activated");
      fetchFAQs();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-[#7b5a42] text-2xl md:text-3xl">
            Manage FAQs
          </h1>
          <p className="text-[#9a7c63] text-sm mt-1">
            {faqs.length} total · {faqs.filter((f) => f.isActive).length} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#7b5a42] hover:bg-[#68452d] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Add New FAQ
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#e3d4c1] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7b5a42]">Loading...</div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-[#9a7c63]">
            No FAQs yet. Click "Add New FAQ" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f3ec] border-b border-[#e3d4c1]">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 text-xs uppercase tracking-wider text-[#7b5a42] font-semibold">
                    Question
                  </th>
                  <th className="text-left px-4 md:px-6 py-3 text-xs uppercase tracking-wider text-[#7b5a42] font-semibold hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 md:px-6 py-3 text-xs uppercase tracking-wider text-[#7b5a42] font-semibold hidden lg:table-cell">
                    Order
                  </th>
                  <th className="text-left px-4 md:px-6 py-3 text-xs uppercase tracking-wider text-[#7b5a42] font-semibold">
                    Status
                  </th>
                  <th className="text-right px-4 md:px-6 py-3 text-xs uppercase tracking-wider text-[#7b5a42] font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3d4c1]">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-[#fdfaf3]">
                    <td className="px-4 md:px-6 py-4">
                      <p className="text-[#6d513d] font-medium line-clamp-2 max-w-md">
                        {faq.question}
                      </p>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                      <span className="px-3 py-1 bg-[#f3eadb] text-[#7b5a42] text-xs font-medium rounded-full">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden lg:table-cell text-[#7a6656]">
                      {faq.order}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          faq.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {faq.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(faq)}
                          className="p-2 text-[#7b5a42] hover:bg-[#f8f3ec] rounded transition"
                          title={faq.isActive ? "Hide" : "Show"}
                        >
                          {faq.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => openEdit(faq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#e3d4c1] sticky top-0 bg-white">
              <h2 className="font-serif text-[#7b5a42] text-2xl">
                {editingFaq ? "Edit FAQ" : "New FAQ"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9a7c63] hover:text-[#7b5a42]"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[#6d513d] text-sm font-medium mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="What makes your rice special?"
                  className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 focus:border-[#7b5a42]"
                />
              </div>

              <div>
                <label className="block text-[#6d513d] text-sm font-medium mb-2">
                  Answer *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={6}
                  placeholder="Provide a detailed answer..."
                  className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 focus:border-[#7b5a42] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6d513d] text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#6d513d] text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#7b5a42]"
                />
                <span className="text-[#6d513d] text-sm">
                  Active (visible on public FAQs page)
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-[#e3d4c1] text-[#7b5a42] rounded-lg font-medium hover:bg-[#f8f3ec] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7b5a42] hover:bg-[#68452d] text-white rounded-lg font-medium transition"
                >
                  {editingFaq ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQsAdmin;
