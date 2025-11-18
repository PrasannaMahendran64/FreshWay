const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

let isConnected = false;

// Prevent Vercel from opening multiple MongoDB connections
async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}

// Vercel Serverless API handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);  // Express handles request/response
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
