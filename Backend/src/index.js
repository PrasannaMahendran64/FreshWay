const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

let isConnected = false;

// MongoDB connection (prevents duplicate reconnects in Vercel)
async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URL);
  isConnected = true;
  console.log("MongoDB connected");
}

// Vercel Serverless API handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res); // Express handles the request
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
