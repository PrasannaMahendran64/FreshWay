const UserModel = require("../Models/UserModel");
const OrderModel = require("../Models/OrderModel");
const ProductModel = require("../Models/ProductModel");
const mongoose = require("mongoose");
const dayjs = require("dayjs");

// 🔹 Admin Dashboard Analytics
const getDashboardStats = async (req, res) => {
  try {
    const { range = "monthly", startDate, endDate } = req.query;

    let start = dayjs().subtract(30, "day").toDate();
    let end = dayjs().toDate();

    if (startDate) start = dayjs(startDate).toDate();
    if (endDate) {
      const e = dayjs(endDate);
      end = e.set("hour", 23).set("minute", 59).set("second", 59).toDate();
    } else if (range === "daily") {
      start = dayjs().startOf("day").toDate();
      end = dayjs().endOf("day").toDate();
    } else if (range === "weekly") {
      start = dayjs().subtract(7, "day").startOf("day").toDate();
    } else if (range === "monthly") {
      start = dayjs().subtract(30, "day").startOf("day").toDate();
    } else if (range === "yearly") {
      start = dayjs().subtract(365, "day").startOf("day").toDate();
    }

    // 1. Basic Stats
    const totalUsers = await UserModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();
    
    const orderStats = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const ordersCount = orderStats[0]?.count || 0;
    const totalRevenue = orderStats[0]?.revenue || 0;

    // 2. Sales Trend (group by day/month depending on range)
    let groupFormat = "%Y-%m-%d";
    if (range === "yearly") {
      groupFormat = "%Y-%m";
    }

    const salesTrend = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    // 3. Top Selling Products
    const topProducts = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          qty: { $sum: "$orderItems.qty" },
          revenue: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
    ]);

    // 4. Top Customers
    const topCustomers = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$user",
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "User",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          ordersCount: 1,
          totalSpent: 1,
          name: "$userInfo.name",
          email: "$userInfo.email",
        },
      },
    ]);

    res.status(200).json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders: ordersCount,
        totalRevenue,
      },
      salesTrend,
      topProducts,
      topCustomers,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error while generating dashboard stats" });
  }
};

// 🔹 Get All Orders (Admin with Advanced Filters)
const getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search, // Order ID or User name / email
      status, // Pending, Shipped, Delivered
      paymentMethod,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (minAmount || maxAmount) {
      query.totalPrice = {};
      if (minAmount) query.totalPrice.$gte = Number(minAmount);
      if (maxAmount) query.totalPrice.$lte = Number(maxAmount);
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    let ordersList = [];
    let total = 0;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // Handle search which requires population/lookup if searching by user details
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
      }

      // If search is not a valid ObjectId, we perform user lookup first
      const matchedUsers = await UserModel.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobilenumber: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchedUsers.map((u) => u._id);

      if (!query._id) {
        query.$or = [
          { user: { $in: userIds } },
          { "orderItems.name": { $regex: search, $options: "i" } },
        ];
      }
    }

    total = await OrderModel.countDocuments(query);
    ordersList = await OrderModel.find(query)
      .populate("user", "name email mobilenumber")
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const formatted = ordersList.map((order) => ({
      ...order.toObject(),
      orderItems: order.orderItems.map((item) => ({
        ...item.toObject(),
        image: item.product?.image || item.image || null,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
      })),
    }));

    res.status(200).json({
      data: formatted,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (err) {
    console.error("Admin Get Orders Error:", err);
    res.status(500).json({ message: "Server error while fetching admin orders" });
  }
};

// 🔹 Get All Users (Admin with Filters)
const getAdminUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search, // Name, email, phone number
      role, // "admin" or "user"
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (role === "admin") {
      query.isAdmin = true;
    } else if (role === "user") {
      query.isAdmin = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        // Since mobile is defined as Number, handle search check or string regex
        // We can do a string check or handle if search is convertable to number
        { mobilenumber: isNaN(search) ? undefined : Number(search) },
      ].filter((condition) => condition !== undefined && Object.values(condition)[0] !== undefined);

      if (query.$or.length === 0) {
        delete query.$or;
      }
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await UserModel.countDocuments(query);
    const users = await UserModel.find(query)
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      data: users,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ message: "Server error while fetching admin users" });
  }
};

module.exports = {
  getDashboardStats,
  getAdminOrders,
  getAdminUsers,
};
