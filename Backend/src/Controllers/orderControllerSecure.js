const OrderModel = require("../Models/OrderModel");
const ProductModel = require("../Models/ProductModel");
const mongoose = require("mongoose");
const orderSchema = require("../Validation/orderjoiSchema");

// 🔹 Get Logged-in User's Orders with Filters
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, startDate, endDate, search } = req.query;

    // Securely isolate to current user
    const query = { user: userId };

    if (status) {
      query.orderStatus = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of the day (23:59:59)
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (search) {
      // If it is a valid ObjectId, search by _id
      if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
      } else {
        // Otherwise search product name within the order
        query["orderItems.name"] = { $regex: search, $options: "i" };
      }
    }

    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name price image");

    res.status(200).json({ data: orders });
  } catch (err) {
    console.error("Get My Orders Error:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// 🔹 Get Specific Order Details (Isolated to User unless Admin)
const getSecureOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await OrderModel.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderUserId = order.user && order.user._id ? order.user._id.toString() : (order.user ? order.user.toString() : null);
    if (orderUserId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: You cannot view this order" });
    }

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
    res.status(500).json({ message: "Server error while fetching order details" });
  }
};

// 🔹 Create New Order (Isolated to Logged-in User)
const createSecureOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Enforce logged-in user
    const orderData = req.body;

    // Validate using Joi schema
    const { error, value } = orderSchema.validate(orderData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!value.orderItems || !Array.isArray(value.orderItems) || value.orderItems.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    const orderItems = [];
    for (const item of value.orderItems) {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
        image: product.image || null,
      });
    }

    const itemsPrice = orderItems.reduce((sum, i) => sum + i.qty * i.price, 0);
    const taxPrice = Math.round(itemsPrice * 0.1); // 10% tax
    const shippingPrice = 500; // Fixed shipping
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = new OrderModel({
      user: userId, // Set to authenticated user id
      orderItems,
      shippingAddress: value.shippingAddress,
      paymentMethod: value.paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus: "Pending",
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", data: order });
  } catch (err) {
    console.error("Create Secure Order Error:", err);
    res.status(500).json({ message: "Server error while creating order", error: err.message });
  }
};

module.exports = {
  getMyOrders,
  getSecureOrderById,
  createSecureOrder,
};
