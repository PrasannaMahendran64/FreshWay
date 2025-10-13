import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderInvoicePage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/get-order/${orderId}`);
      setOrder(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order!");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

   const handleDownloadPDF = () => {
  if (!order) return;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Order Invoice", 14, 22);

  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id || "N/A"}`, 14, 32);
  doc.text(`Customer Name: ${order.user?.name || "N/A"}`, 14, 40);
  doc.text(`Email: ${order.user?.email || "N/A"}`, 14, 48);
  doc.text(
    order.shippingAddress
      ? `Shipping Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
      : "Shipping Address: N/A",
    14,
    56
  );
  doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`, 14, 64);

  // Table
  const tableColumn = ["Product", "Qty", "Price", "Total"];
  const tableRows = order.orderItems.map(item => [
    item.name || "N/A",
    item.qty || 0,
    `₹${item.price?.toFixed(2) || "0.00"}`,
    `₹${((item.qty || 0) * (item.price || 0)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 75,
    head: [tableColumn],
    body: tableRows,
  });

  const finalY = doc.lastAutoTable?.finalY || 75;

  doc.text(`Subtotal: ₹${order.itemsPrice?.toFixed(2) || "0.00"}`, 14, finalY + 10);
  doc.text(`Tax: ₹${order.taxPrice?.toFixed(2) || "0.00"}`, 14, finalY + 18);
  doc.text(`Shipping: ₹${order.shippingPrice?.toFixed(2) || "0.00"}`, 14, finalY + 26);
  doc.text(`Total: ₹${order.totalPrice?.toFixed(2) || "0.00"}`, 14, finalY + 34);

  doc.save(`invoice_${order._id || "unknown"}.pdf`);
};

  if (!order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto border rounded shadow space-y-4">
      <h1 className="text-2xl font-bold mb-4">Order Invoice</h1>

      <div ref={invoiceRef} className="space-y-2 mb-6">
        <p><strong>Order ID:</strong> {order._id || "N/A"}</p>
        <p><strong>Name:</strong> {order.user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
        <p>
          <strong>Address:</strong>{" "}
          {order.shippingAddress
            ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
            : "N/A"}
        </p>
        <p><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</p>

        <table className="w-full border-collapse border mt-4">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-2 text-left">Image</th>
              <th className="py-2 px-2 text-left">Product</th>
              <th className="py-2 px-2 text-center">Qty</th>
              <th className="py-2 px-2 text-center">Price</th>
              <th className="py-2 px-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <tr key={item._id || index} className="border-b">
                  <td className="py-2 px-2 text-center">
                    {item.image ? (
                      <img src={`http://localhost:4000/files/${item.image}`} alt={item.name} className="w-12 h-12 object-cover mx-auto" />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-2">{item.name || "N/A"}</td>
                  <td className="py-2 px-2 text-center">{item.qty || 0}</td>
                  <td className="py-2 px-2 text-center">₹{item.price?.toFixed(2) || "0.00"}</td>
                  <td className="py-2 px-2 text-center">₹{((item.qty || 0) * (item.price || 0)).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-2">No items found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-right font-bold mt-4 space-y-1">
          <p>Subtotal: ₹{order.itemsPrice?.toFixed(2) || "0.00"}</p>
          <p>Tax: ₹{order.taxPrice?.toFixed(2) || "0.00"}</p>
          <p>Shipping: ₹{order.shippingPrice?.toFixed(2) || "0.00"}</p>
          <p>Total: ₹{order.totalPrice?.toFixed(2) || "0.00"}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF Invoice
        </button>

        <Link
          to="/"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Explore More
        </Link>
      </div>
    </div>
  );
}
