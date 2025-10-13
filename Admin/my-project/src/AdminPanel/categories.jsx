// src/pages/CategoriesPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: null });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/get-categories");
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setSelectedCategory(category);
    if (category) setFormData({ name: category.name, image: null });
    else setFormData({ name: "", image: null });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.image) data.append("image", formData.image);

      if (selectedCategory) {
        // Update
        await axios.put(`http://localhost:4000/update-categories/${selectedCategory._id}`, data);
        toast.success("Category updated");
      } else {
        // Create
        await axios.post("http://localhost:4000/create-categories", data);
        toast.success("Category added");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:4000/delete-categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => openModal()}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Slug</th>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{cat.name}</td>
                  <td className="py-2 px-4">{cat.slug}</td>
                  <td className="py-2 px-4">
                    {cat.image ? (
                      <img
                        src={`http://localhost:4000/files/${cat.image}`}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : "N/A"}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openModal(cat)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(cat._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {selectedCategory ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Image:</label>
                <input type="file" name="image" onChange={handleChange} />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {selectedCategory ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
