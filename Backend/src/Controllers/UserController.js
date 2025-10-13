const { generateToken } = require("../MiddleWare/Auth");
const UserModel = require("../Models/UserModel");
const generateOTP =require("../utils/otpGeneration")
const mail =require("../utils/MailServices")
const bcrypt = require("bcrypt");
const ReviewModel = require("../Models/ReviewModel");
const OrderModel = require("../Models/OrderModel");


const userRegisterController = async (req, res) => {
  try {
    const { name, email, mobilenumber, password } = req.body;

    if (!name || !email || !mobilenumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { mobilenumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      mobilenumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Register Error:", error); // <-- Check this in console
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, mobilenumber, password } = req.body;

    if (!email && !mobilenumber) {
      return res.status(400).json({ message: "Email or Mobile number is required" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { mobilenumber }],
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = generateToken(existingUser);

    return res.status(200).json({
      message: "Login successful",
      data: { user: existingUser, token },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message });
  }
};


const userLoginwithotpController = async (req,res)=>{
    try {
        const {email}=req.body

        const exitUser = await UserModel.findOne({email:email})

        if(!exitUser){
            return res.status(404).send({message:"You are not registered"})
        }

        const otp = await generateOTP()

        exitUser.otp = otp;
        exitUser.otpExpiry = new Date(Date.now()+5*60*1000)

        await exitUser.save()

        const sendOTP = await mail(email,otp)

        return res.status(201).send({message:"User login successfully"})
    } catch (error) {
        return res.status(500).send("Error when creating user")
    }
}

const userVerifyOtpController = async (req,res)=>{
    try {

        const {email,otp} = req.body;


        const exitUser = await UserModel.findOne({email:email})

        if(!exitUser){
            return res.status(404).send({message:"You are not registered"})
        }
        if(exitUser.otp !== otp){
            return res.status(400).send({message:"Incorrect otp"})
        }

        if(Date.now() > exitUser.otpExpiry){
            return res.status(400).send({message:"otp expired"})
        }


        const token = await generateToken(exitUser._id)

        return res.status(201).send({message:"OTP verified successfully",data:{token:token}})
        
    } catch (error) {
         return res.status(500).send("Error when verify otp", error)
    }
}

const forgetPasswordController = async (req,res)=>{
    try {
        const {email} = req.body 

        const users =await UserModel.findOne({email:email})

        if(!users){
            return res.status(404).send({message: "User not found"})
        }

        const otp = await generateOTP()

        users.otp = otp
        users.otpExpiry = new Date(Date.now()+5*60*1000) 
        await users.save()
        await mail(email,otp)

        return res.status(201).send({message: "Password reset OTP sent to your email"})
    } catch (error) {
        return res.status(500).send({ message: "Error while sending reset OTP" });
    }
}




const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // 1️⃣ Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 3️⃣ Check OTP expiry
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 4️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // 5️⃣ Clear OTP and expiry
    user.otp = null;
    user.otpExpiry = null;

    // 6️⃣ Save user
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Error when resetting password" });
  }
};


const showProfileController = async (req,res) =>{
    try {
        const userId = req.user.id
        const showuser = await UserModel.findById(userId).select({password:0})
        return res.status(201).send({message:"User profile get successfully",data:showuser})
    } catch (error) {
         return res.status(500).send("Error when showing user")
        
    }
  }


  const getUserOrdersController = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await OrderModel.find({ id }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(200).json({ message: "No orders found", data: [] });
    }

    return res.status(200).json({ message: "User orders fetched successfully", data: orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res.status(500).json({ message: "Error fetching user orders" });
  }
};

const getUserReviewsController = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await ReviewModel.find({ userId: id }).populate("product", "name")
      
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(200).json({ message: "No reviews found", data: [] });
    }

    return res.status(200).json({
      message: "User reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.error("Get User Reviews Error:", error); // ✅ This will now show full details
    return res.status(500).json({ message: "Error fetching user reviews", error: error.message });
  }
};
const updateProfileController = async (req, res) => {
    try {
        const { name, email, mobilenumber, address, password } = req.body;
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (mobilenumber) user.mobilenumber = mobilenumber;
        if (address) user.address = address;
        if (password) user.password = password; // hash in production

        // Profile image upload
        if (req.file) {
            // delete old image if exists
            if (user.profileImage) {
                const oldPath = path.join(__dirname, "..", "uploads/profile", user.profileImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            user.profileImage = req.file.filename;
        }

        await user.save();
        const updatedUser = await UserModel.findById(req.params.id).select("-password -otp -otpExpiry");
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update profile" });
    }
};


const changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Initialize Razorpay instance (use your own keys)



module.exports = {
  userRegisterController,
  userLoginController,
  userLoginwithotpController,
  userVerifyOtpController,
  forgetPasswordController,
  resetPasswordController,
  showProfileController,
  getUserOrdersController,
  getUserReviewsController,
  updateProfileController,
  changePasswordController,


};
