import { useEffect, useState } from "react";
import { Star, User, Settings, Lock, LogOut, Grid } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserFromStorage } from "./ProtectedRoute";
import axios from "axios";
import { toast } from "react-toastify";

export default function MyReviewsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      fetchReviews(currentUser._id);
    }
  }, [navigate]);

  const fetchReviews = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4000/user-review/${id}`);
      setReviews(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  if (!user || loading) return <p className="text-center mt-10">Loading reviews...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">

      {/* Reviews Content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition">
                <p className="font-semibold mb-1">
                  Product: {review.product?.name || "Unknown"}
                </p>
                <p className="text-yellow-500 mb-1">Rating: {review.rating || 0} ⭐</p>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
}

// Sidebar item component
const SidebarItem = ({ icon, text, active, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-green-100 text-green-700 font-medium" : danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"
      }`}
  >
    {icon} {text}
  </button>
);
