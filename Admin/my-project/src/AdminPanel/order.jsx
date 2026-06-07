import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, X, Trash2, Search, Filter, RefreshCcw } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");

  // Filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (paymentMethod) params.append("paymentMethod", paymentMethod);
      if (minAmount) params.append("minAmount", minAmount);
      if (maxAmount) params.append("maxAmount", maxAmount);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axios.get(`/api/admin/orders?${params.toString()}`);
      setOrders(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, paymentMethod]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentMethod("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    // Directly query with empty parameters
    axios.get("/api/admin/orders?page=1&limit=10").then((res) => {
      setOrders(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    });
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || "Pending");
    setModalOpen(true);
  };

  const updateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(`/api/update-order/${selectedOrder._id}`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success("Order status updated successfully!");
      setModalOpen(false);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/api/delete-order/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order deleted successfully!");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold text-xs border border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-xs border border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-xs border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs";
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Orders</h1>
          <p className="text-gray-400 text-xs mt-1">Manage and filter all supermarket sales.</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Admin Order Filters */}
      <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm mb-6">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
            <Filter size={16} className="text-green-600" /> Filter Orders
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search ID/User/Email</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Order ID, User name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700"
              >
                <option value="">All Methods</option>
                <option value="cod">Cash On Delivery</option>
                <option value="razorpay">Razorpay</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Min / Max Price (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-1/2 border border-gray-200 px-2 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-1/2 border border-gray-200 px-2 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-50 font-bold text-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow"
            >
              Filter Orders
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white border border-gray-100 shadow rounded-3xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50/75 border-b border-gray-100">
                <tr>
                  {["Order ID", "User Name", "Email", "Total", "Status", "Date", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="py-3 px-5 text-left text-gray-600 font-extrabold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 font-semibold">
                      No orders found matching filters.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 hover:bg-green-50/20 transition duration-200"
                    >
                      <td className="py-3 px-5 font-mono text-xs font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-5 font-semibold text-gray-700">{order.user?.name || "N/A"}</td>
                      <td className="py-3 px-5 text-gray-500 text-xs">{order.user?.email || "N/A"}</td>
                      <td className="py-3 px-5 font-extrabold text-green-700">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="py-3 px-5">
                        <span className={getStatusClass(order.orderStatus || "Pending")}>
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-gray-500 text-xs">{dayjs(order.createdAt).format("DD/MM/YYYY")}</td>
                      <td className="py-3 px-5 flex gap-2.5">
                        <button
                          className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                          onClick={() => openModal(order)}
                          title="View / Edit"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                          onClick={() => handleDelete(order._id)}
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-bold">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            <div className="mb-6 space-y-1 bg-gray-50 p-4 rounded-2xl text-sm text-gray-600">
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p>
                <strong>User:</strong> {selectedOrder.user?.name || "N/A"} ({selectedOrder.user?.email || "N/A"})
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusClass(newStatus)}>{newStatus}</span>
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.shippingAddress?.address},{" "}
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.postalCode},{" "}
                {selectedOrder.shippingAddress?.country}
              </p>
            </div>

            <h3 className="font-bold mb-2 text-gray-700">Products</h3>
            <div className="overflow-x-auto mb-6 border border-gray-100 rounded-2xl">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Qty", "Price", "Image"].map((h) => (
                      <th key={h} className="py-2.5 px-4 text-left text-gray-500 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-green-50/10">
                      <td className="py-2 px-4 font-semibold text-gray-700">{item.name}</td>
                      <td className="py-2 px-4 font-bold text-gray-500">{item.qty}</td>
                      <td className="py-2 px-4 font-extrabold text-green-700">₹{item.price}</td>
                      <td className="py-2 px-4">
                        {item.image ? (
                          <img
                            src={`/api/files/${item.image}`}
                            alt={item.name}
                            className="w-8 h-8 object-contain rounded"
                          />
                        ) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              onClick={updateStatus}
              className="w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 font-bold shadow transition transform hover:scale-101"
            >
              Update Order Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
