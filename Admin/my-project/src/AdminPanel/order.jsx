import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, X, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/get-orders");
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || "Pending");
    setModalOpen(true);
  };

  const updateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(`http://localhost:4000/update-order/${selectedOrder._id}`, { orderStatus: newStatus });
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
      await axios.delete(`http://localhost:4000/delete-order/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order deleted successfully!");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 px-3 py-1 rounded-full font-semibold text-sm";
      case "Shipped":
        return "bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 px-3 py-1 rounded-full font-semibold text-sm";
      case "Delivered":
        return "bg-gradient-to-r from-green-200 to-green-300 text-green-900 px-3 py-1 rounded-full font-semibold text-sm";
      default:
        return "bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm";
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Order ID", "User", "Total", "Status", "Date", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-green-50 transition-all duration-200"
                  >
                    <td className="py-2 px-4 font-mono">{order._id.slice(-6)}</td>
                    <td className="py-2 px-4">{order.user?.name || "N/A"}</td>
                    <td className="py-2 px-4 font-semibold">
                      ₹{(order.taxPrice + order.shippingPrice).toFixed(2)}
                    </td>
                    <td className="py-2 px-4">
                      <span className={getStatusClass(order.orderStatus || "Pending")}>
                        {order.orderStatus || "Pending"}
                      </span>
                    </td>
                    <td className="py-2 px-4">{dayjs(order.createdAt).format("DD/MM/YYYY")}</td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                        onClick={() => openModal(order)}
                        title="View / Edit"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                        onClick={() => handleDelete(order._id)}
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh] animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            <div className="mb-4 space-y-1">
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

            <h3 className="font-bold mb-2">Products</h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {["Name", "Qty", "Price", "Image"].map((h) => (
                      <th key={h} className="py-2 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-green-50 transition-all duration-200">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.qty}</td>
                      <td className="py-2 px-4">₹{item.price}</td>
                      <td className="py-2 px-4">
                        {item.image ? (
                          <img
                            src={`http://localhost:4000/files/${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-1">Update Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              onClick={updateStatus}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
