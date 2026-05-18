import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Package } from "lucide-react";
import toast from "react-hot-toast";
import { productAPI } from "@/api/productApi";
import ImageUpload from "@/features/admin/components/ImageUpload";

const CATEGORIES = [
  "Premium",
  "Health",
  "Regional",
  "Rice Bran",
  "Furfural",
  "Energy",
  "Other",
];

const emptyForm = {
  name: "",
  description: "",
  shortDescription: "",
  image: "",
  category: "Premium",
  weight: "",
  price: "",
  features: "",
  order: 0,
  isActive: true,
};

const ProductsAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getAllAdmin(
        filter !== "All" ? filter : null
      );
      setItems(data.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      ...emptyForm,
      category: filter !== "All" ? filter : "Premium",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      description: item.description,
      shortDescription: item.shortDescription || "",
      image: item.image || "",
      category: item.category,
      weight: item.weight || "",
      price: item.price || "",
      features: (item.features || []).join(", "),
      order: item.order,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("Name and description are required");
      return;
    }
    const payload = {
      ...formData,
      features: formData.features
        ? formData.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editing) {
        await productAPI.update(editing._id, payload);
        toast.success("Product updated");
      } else {
        await productAPI.create(payload);
        toast.success("Product created");
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await productAPI.delete(item._id);
      toast.success("Deleted");
      fetchItems();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-[#7b5a42] text-2xl md:text-3xl">
            Manage Products
          </h1>
          <p className="text-[#9a7c63] text-sm mt-1">
            {items.length} product{items.length !== 1 && "s"}
            {filter !== "All" && ` in "${filter}"`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#7b5a42] hover:bg-[#68452d] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 bg-white border border-[#e3d4c1] rounded-lg p-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === cat
                ? "bg-[#7b5a42] text-white"
                : "text-[#7b5a42] hover:bg-[#f8f3ec]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      {loading ? (
        <div className="bg-white border border-[#e3d4c1] rounded-xl p-12 text-center text-[#7b5a42]">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#e3d4c1] rounded-xl p-12 text-center text-[#9a7c63]">
          No products yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-[#e3d4c1] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="h-40 bg-[#f8f3ec] overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-[#c4a888]" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-serif text-[#6d513d] text-lg leading-tight">
                    {item.name}
                  </h3>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-sm text-[#7a6656] line-clamp-2 mb-3">
                  {item.shortDescription || item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#f3eadb] text-[#7b5a42] text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#e3d4c1] sticky top-0 bg-white">
              <h2 className="font-serif text-[#7b5a42] text-2xl">
                {editing ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-[#9a7c63]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[#6d513d] text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                />
              </div>

              <div>
                <label className="block text-[#6d513d] text-sm font-medium mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="One-line tagline"
                  className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                />
              </div>

              <div>
                <label className="block text-[#6d513d] text-sm font-medium mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 resize-none"
                />
              </div>

              <ImageUpload
                label="Product Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6d513d] text-sm font-medium mb-2">
                    Category *
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
                    Order
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6d513d] text-sm font-medium mb-2">
                    Weight / Size
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="1kg / 5kg / 25kg"
                    className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                  />
                </div>
                <div>
                  <label className="block text-[#6d513d] text-sm font-medium mb-2">
                    Price (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="₹250"
                    className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6d513d] text-sm font-medium mb-2">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="Aged 24 months, Extra-long grains, Pure basmati"
                  className="w-full px-4 py-3 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
                />
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
                  Active (visible on public site)
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
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
