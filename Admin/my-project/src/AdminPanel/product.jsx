import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, X, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/get-product");
      setProducts(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/get-categories");
      setCategories(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setName(product?.name || "");
    setSlug(product?.slug || "");
    setPrice(product?.price || "");
    setCategoryId(product?.category?._id || "");
    setTags(product?.tags?.join(",") || "");
    setCountInStock(product?.countInStock || "");
    setDescription(product?.description || "");
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name || !price || !categoryId || !slug)
      return toast.error("Name, Price, Slug and Category are required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug.toLowerCase());
    formData.append("price", price);
    formData.append("category", categoryId);
    formData.append("description", description);
    formData.append("countInStock", countInStock);
    formData.append("tags", tags);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:4000/update-product/${editingProduct._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:4000/create-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:4000/delete-product/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Products</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
          onClick={() => openModal()}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Image", "Name", "Slug", "Price", "Category", "Stock", "Rating", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-green-50 transition">
                  <td className="py-2 px-4">
                    {p.image ? (
                      <img
                        src={`http://localhost:4000/files/${p.image}`}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">{p.name}</td>
                  <td className="py-2 px-4">{p.slug}</td>
                  <td className="py-2 px-4">₹{p.price}</td>
                  <td className="py-2 px-4">{p.categoryName || "N/A"}</td>
                  <td className="py-2 px-4">{p.countInStock}</td>
                  <td className="py-2 px-4 text-yellow-500">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = p.rating || 0;
                      if (i + 1 <= Math.floor(rating)) return <span key={i}>★</span>;
                      if (i < rating) return <span key={i}>⯪</span>;
                      return <span key={i}>☆</span>;
                    })}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                      onClick={() => openModal(p)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                      onClick={() => handleDelete(p._id)}
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
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Slug (editable)"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
