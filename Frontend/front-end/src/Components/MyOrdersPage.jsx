import { useEffect, useState } from "react";
import {
  ShoppingCart,
  RefreshCcw,
  Truck,
  CheckCircle,
  CreditCard,
  Calendar,
  Package,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router";
import { getUserFromStorage } from "./ProtectedRoute";
import axios from "axios";
import { toast } from "react-toastify";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      fetchOrders(currentUser._id);
    }
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/user-order/${userId}`);
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!user || loading)
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading your orders...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="text-green-600" size={26} /> My Orders
          </h2>
          <button
            onClick={() => fetchOrders(user._id)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition"
          >
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <p className="text-gray-500 mt-10 text-center text-lg">
            You haven’t placed any orders yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-100 shadow-md rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Order:</span>{" "}
                    {order._id.slice(-6)}
                  </p>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus || "Pending"}
                  </span>
                </div>

                {/* Date & Payment */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={15} />{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard size={15} /> {order.paymentMethod || "N/A"}
                  </div>
                </div>

                {/* Products */}
                <div className="bg-gray-50 p-3 rounded-xl mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Package size={15} /> Products
                  </h4>
                  {order.orderItems?.length > 0 ? (
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                      {order.orderItems.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-white px-2 py-1 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                item.image
                                  ? `http://localhost:4000/files/${item.image}`
                                  : "https://via.placeholder.com/40?text=No+Image"
                              }
                              alt={item.name}
                              className="w-10 h-10 rounded-md border"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {item.name || "Unnamed Product"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">x{item.qty}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      No product information available
                    </p>
                  )}
                </div>

                {/* Total + Status Icon */}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-green-700 flex items-center gap-1">
                    <IndianRupee size={17} />
                    {order.totalPrice || 0}
                  </p>

                  {order.orderStatus === "Delivered" ? (
                    <CheckCircle
                      size={26}
                      className="text-green-600 drop-shadow-sm"
                    />
                  ) : order.orderStatus === "Shipped" ? (
                    <Truck size={26} className="text-blue-500" />
                  ) : order.orderStatus === "Pending" ? (
                    <RefreshCcw
                      size={24}
                      className="text-yellow-500 animate-spin-slow"
                    />
                  ) : order.orderStatus === "Cancelled" ? (
                    <ShoppingCart size={24} className="text-red-500" />
                  ) : (
                    <ShoppingCart size={24} className="text-gray-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
