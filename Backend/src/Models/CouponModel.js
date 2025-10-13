const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    default: "",
  },
  discount: {
    type: Number,
    required: true, // discount in ₹
  },
  image: {
    type: String, // store image filename
    default: "", 
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CouponModel = mongoose.model("Coupon", couponSchema);
module.exports = CouponModel
