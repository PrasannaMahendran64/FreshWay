const Razorpay = require("razorpay");
const crypto = require("crypto");
const OrderModel = require("../Models/OrderModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const options = {
      amount: order.totalPrice * 100, // in paise
      currency: "INR",
      receipt: order._id.toString(),
      payment_capture: 1,
    };

    const rzpOrder = await razorpay.orders.create(options);

    res.status(200).json({
      data: {
        razorpay_order_id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      },
    });
  } catch (err) {
  console.error("🔴 Razorpay order creation failed:", err.response?.data || err.message || err);
  res.status(500).json({
    message: "Razorpay order creation failed",
    error: err.response?.data || err.message || err,
  });
}

};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus: "Paid", paymentId: razorpay_payment_id },
      { new: true }
    );

    res.status(200).json({ message: "Payment verified", data: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
