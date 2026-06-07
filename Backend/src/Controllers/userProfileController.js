const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// 🔹 Get User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobilenumber, address, password } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobilenumber) user.mobilenumber = mobilenumber;
    if (address) user.address = address;

    if (password) {
      // Securely hash password on update
      user.password = await bcrypt.hash(password, 10);
    }

    // Profile photo upload handling
    if (req.file) {
      // Delete old profile image if it exists
      if (user.profileImage) {
        const oldPath = path.join(__dirname, "..", "Uploads", user.profileImage);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.error("Failed to delete old profile image:", e);
          }
        }
      }
      user.profileImage = req.file.filename;
    }

    await user.save();

    const updatedUser = await UserModel.findById(userId).select("-password -otp -otpExpiry");
    
    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
