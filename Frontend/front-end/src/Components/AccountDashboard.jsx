import { ShoppingCart, RefreshCcw, Truck, CheckCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserFromStorage } from "./ProtectedRoute";

export default function AccountDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(false);

  const user = getUserFromStorage();

  useEffect(() => {
    if (user) fetchStats(user._id);
  }, []);

  const fetchStats = async (userId) => {
    try {
      setLoading(true);

      // Fetch orders for the user
      const ordersRes = await axios.get(`http://localhost:4000/user-order/${userId}`);
      const orders = ordersRes.data?.data || [];

      // Count by orderStatus
      const pending = orders.filter((o) => o.orderStatus === "Pending").length;
      const processing = orders.filter((o) => o.orderStatus === "Processing").length;
      const completed = orders.filter((o) => o.orderStatus === "Delivered").length;
      const cancelled = orders.filter((o) => o.orderStatus === "Cancelled").length;

      // Fetch user reviews
      const reviewsRes = await axios.get(`http://localhost:4000/user-review/${userId}`);
      const reviews = reviewsRes.data?.data || [];

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        processingOrders: processing,
        completedOrders: completed,
        cancelledOrders: cancelled,
        totalReviews: reviews.length,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={() => user && fetchStats(user._id)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="text-red-500" />}
          bg="bg-red-50"
        />
        <DashboardCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<RefreshCcw className="text-yellow-500" />}
          bg="bg-yellow-50"
        />
        <DashboardCard
          title="Processing Orders"
          value={stats.processingOrders}
          icon={<Truck className="text-blue-500" />}
          bg="bg-blue-50"
        />
        <DashboardCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={<CheckCircle className="text-green-500" />}
          bg="bg-green-50"
        />
        <DashboardCard
          title="Cancelled Orders"
          value={stats.cancelledOrders}
          icon={<RefreshCcw className="text-gray-500" />}
          bg="bg-gray-50"
        />
      </div>

      {/* Reviews Stats */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">My Reviews</h3>
        <div className="flex flex-wrap gap-6">
          <ReviewCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<Star className="text-yellow-500" />}
          />
        </div>
      </div>
    </div>
  );
}

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, bg }) => (
  <div className="bg-white shadow-sm rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
    <div className={`p-4 rounded-full mb-3 ${bg} flex items-center justify-center w-16 h-16`}>
      {icon}
    </div>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

// Review Card Component
const ReviewCard = ({ title, value, icon }) => (
  <div className="bg-yellow-50 p-4 rounded-2xl shadow-sm flex items-center gap-3 hover:shadow-md transition-all duration-300">
    <div className="p-3 bg-yellow-100 rounded-full flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);
