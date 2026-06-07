const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_secret = process.env.JWT_SECRET || "secretkey";

// ✅ Generate token helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    jwt_secret,
    { expiresIn: "20h" }
  );
};

// 🔹 Register
const register = async (req, res) => {
  try {
    const { name, email, mobilenumber, password } = req.body;

    if (!name || !email || !mobilenumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { mobilenumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or mobile number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      mobilenumber,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    // Don't return password in response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      data: { user: userResponse, token },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;

    return res.status(200).json({
      message: "Login successful",
      data: { user: userResponse, token },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Logout
const logout = async (req, res) => {
  try {
    // Client-side should clear the token, backend returns success
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Get Current User Details (/me)
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  generateToken, // Exported for use in OTP verification if needed
};
