
const UserModel = require("../Models/UserModel");


// ✅ Promote a user to admin

const makeUserAdmin = async (req, res) => {
  try {
    const { email } = req.body; // get email from request body

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.isAdmin = true;
    await user.save();

    res.status(200).json({
      message: "User promoted to admin successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Make User Admin Error:", error);
    res.status(500).json({ message: "Error making user admin", error: error.message });
  }
};

// ✅ Remove admin rights
const removeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    let user;

    // Find by userId if provided
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      user = await UserModel.findById(userId);
    } 
    // Otherwise, find by email
    else if (email) {
      user = await UserModel.findOne({ email });
    } 
    else {
      return res.status(400).json({ message: "Please provide userId or email" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ message: "User is not an admin" });
    }

    // Remove admin rights
    user.isAdmin = false;
    await user.save();

    res.status(200).json({
      message: "Admin rights removed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Remove Admin Error:", error);
    res.status(500).json({ message: "Error removing admin rights", error: error.message });
  }
};

// ✅ Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); // hide password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = { makeUserAdmin, removeAdmin, getAllUsers };
