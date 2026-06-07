import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  RefreshCcw,
  Truck,
  CheckCircle,
  CreditCard,
  Calendar,
  Package,
  IndianRupee,
  Search,
  Filter,
  XCircle,
} from "lucide-react";
import { fetchMyOrders } from "../redux/slices/orderSlice";

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  // Filter states
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");

  const loadOrders = () => {
    dispatch(fetchMyOrders({ status, startDate, endDate, search }));
  };

  useEffect(() => {
    loadOrders();
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleResetFilters = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    setSearch("");
    dispatch(fetchMyOrders({ status: "", startDate: "", endDate: "", search: "" }));
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "text-yellow-700 bg-yellow-100/80 border border-yellow-200";
      case "shipped":
        return "text-blue-700 bg-blue-100/80 border border-blue-200";
      case "delivered":
        return "text-green-700 bg-green-100/80 border border-green-200";
      case "cancelled":
        return "text-red-700 bg-red-100/80 border border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <ShoppingCart className="text-green-600" size={28} /> My Orders
            </h2>
            <p className="text-gray-400 text-xs mt-1">Track and manage your supermarkets orders.</p>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition font-semibold"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Filter controls */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-1">
              <Filter size={18} className="text-green-600" /> Filter & Search Orders
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search order ID or product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              {/* Status select */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Start Date */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold whitespace-nowrap">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-600"
                />
              </div>

              {/* End Date */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold whitespace-nowrap">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-600"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold shadow"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white border border-gray-100 rounded-3xl animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center max-w-xl mx-auto">
            <XCircle size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700 text-lg">No orders found</h3>
            <p className="text-gray-400 text-sm mt-1">Try resetting the filters or place your first order now!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Order header */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400">
                      ORDER: <span className="font-mono text-gray-700">#{order._id.slice(-6).toUpperCase()}</span>
                    </p>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${getStatusStyle(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>

                  {/* Date & Payment */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 uppercase">
                      <CreditCard size={13} />
                      {order.paymentMethod || "COD"}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-gray-50/50 border border-gray-100/50 p-3 rounded-2xl mb-4">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                      <Package size={13} /> Products ({order.orderItems?.length || 0})
                    </h4>
                    {order.orderItems?.length > 0 ? (
                      <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {order.orderItems.map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center bg-white border border-gray-50 px-2 py-1.5 rounded-xl shadow-xs"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image ? `/api/files/${item.image}` : "/no-image.png"}
                                alt={item.name}
                                className="w-8 h-8 rounded-md object-contain border border-gray-100"
                              />
                              <span className="text-xs font-semibold text-gray-700 line-clamp-1">
                                {item.name || "Unnamed Product"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 font-bold">x{item.qty}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-xs italic">No items listed</p>
                    )}
                  </div>
                </div>

                {/* Total & Detail link */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block">Total Price</span>
                    <p className="text-base font-extrabold text-green-700 flex items-center">
                      <IndianRupee size={15} />
                      {order.totalPrice || 0}
                    </p>
                  </div>
                  <Link
                    to={`/order-invoice/${order._id}`}
                    className="text-xs font-bold text-green-600 hover:text-green-800 border border-green-100 hover:bg-green-50 px-3 py-1.5 rounded-xl transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
