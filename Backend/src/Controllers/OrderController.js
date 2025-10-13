const OrderModel = require("../Models/OrderModel");
const mongoose = require("mongoose");
const ProductModel = require("../Models/ProductModel");
const orderSchema = require("../Validation/orderjoiSchema");


// 🔹 Create Order
const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orderData = req.body;

    // Validate incoming order
    const { error, value } = orderSchema.validate(orderData);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (!value.orderItems || !Array.isArray(value.orderItems) || value.orderItems.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    // Build orderItems from validated data
    const orderItems = [];
    for (const item of value.orderItems) {
      const product = await ProductModel.findById(item.product);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.product}` });

      orderItems.push({
        product: product._id,
        name: product.name,
        qty: item.qty, // use qty from frontend
        price: product.price,
        image: product.image || null,
      });
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce((sum, i) => sum + i.qty * i.price, 0);
    const taxPrice = Math.round(itemsPrice * 0.1); // 10% tax
    const shippingPrice = 500; // fixed shipping
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order
    const order = new OrderModel({
      user: userId,
      orderItems,
      shippingAddress: value.shippingAddress,
      paymentMethod: value.paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    await order.save();
    console.log("Order saved successfully:", order._id);
    res.status(201).json({ message: "Order created successfully", data: order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price image");

    const formatted = orders.map((order) => ({
      ...order.toObject(),
      orderItems: order.orderItems.map((item) => ({
        ...item.toObject(),
        image: item.product?.image || item.image || null,
      })),
    }));

    res.status(200).json({ data: formatted });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get User Orders
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params; // <--- match the route
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Order ID" });

    const order = await OrderModel.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const formattedOrder = {
      ...order.toObject(),
      orderItems: order.orderItems.map((item) => ({
        ...item.toObject(),
        image: item.product?.image || item.image || null,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
      })),
    };

    res.status(200).json({ data: formattedOrder });
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// 🔹 Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body; // "Pending", "Shipped", "Delivered"
    if (!orderStatus) 
      return res.status(400).json({ message: "Order status is required" });

    // Build update object
    const updateData = { orderStatus };

    // Automatically update delivery flags if status is "Delivered"
    if (orderStatus === "Delivered") {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    } else {
      updateData.isDelivered = false;
      updateData.deliveredAt = null;
    }

    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate("user", "name email")
    .populate("orderItems.product", "name price image");

    if (!updated) return res.status(404).json({ message: "Order not found" });

    const formatted = {
      ...updated.toObject(),
      orderItems: updated.orderItems.map((item) => ({
        ...item.toObject(),
        image: item.product?.image || item.image || null,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
      })),
    };

    res.status(200).json({ message: "Order status updated", data: formatted });

  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete Order (Admin)
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", data: deletedOrder });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
