// src/pages/ReviewsPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

// Reusable StarRating component
const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-2xl cursor-pointer ${
            i < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => editable && setRating(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    user: "",
    rating: 1,
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/get-reviews");
      setReviews(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/get-product");
      setProducts(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const openModal = (review = null) => {
    setSelectedReview(review);
    if (review) {
      setFormData({
        product: review.product._id || review.product,
        user: review.user,
        rating: review.rating,
        comment: review.comment,
      });
    } else {
      setFormData({ product: "", user: "", rating: 1, comment: "" });
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReview) {
        await axios.put(
          `http://localhost:4000/update-review/${selectedReview._id}`,
          formData
        );
        toast.success("Review updated");
      } else {
        await axios.post("http://localhost:4000/create-review", formData);
        toast.success("Review added");
      }
      setModalOpen(false);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`http://localhost:4000/delete-review/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => openModal()}
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Rating</th>
                <th className="py-2 px-4">Comment</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{rev.product?.name || "N/A"}</td>
                  <td className="py-2 px-4">{rev.user}</td>
                  <td className="py-2 px-4">
                    <StarRating rating={rev.rating} editable={false} />
                  </td>
                  <td className="py-2 px-4">{rev.comment}</td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openModal(rev)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(rev._id)}
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
              {selectedReview ? "Edit Review" : "Add Review"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Product:</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">User:</label>
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Rating:</label>
                <StarRating
                  rating={formData.rating}
                  setRating={(val) =>
                    setFormData({ ...formData, rating: val })
                  }
                  editable={true}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Comment:</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {selectedReview ? "Update Review" : "Add Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
