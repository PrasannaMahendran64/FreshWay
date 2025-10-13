const CouponModel = require("../Models/CouponModel");

// ✅ Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate, minPurchaseAmount } = req.body;
    const image = req.file ? req.file.filename : "";

    if (!code || !discount || !expiryDate) {
      return res.status(400).json({ message: "Code, discount and expiryDate are required" });
    }

    const existingCoupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const newCoupon = await CouponModel.create({
      code: code.toUpperCase(),
      discount,
      expiryDate,
      minPurchaseAmount: minPurchaseAmount || 0,
      image,
    });

    res.status(201).json({ message: "Coupon created successfully", data: newCoupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create coupon" });
  }
};

// ✅ Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    res.status(200).json({ data: coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

// ✅ Get coupon by code
const getCouponByCode = async (req, res) => {
  try {
    const coupon = await CouponModel.findOne({ code: req.params.code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    const now = new Date();
    if (coupon.expiryDate < now) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    res.status(200).json({ data: coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch coupon" });
  }
};

// ✅ Update a coupon by ID
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expiryDate, minPurchaseAmount } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateData = {
      ...(code && { code: code.toUpperCase() }),
      ...(discount && { discount }),
      ...(expiryDate && { expiryDate }),
      ...(minPurchaseAmount !== undefined && { minPurchaseAmount }),
      ...(image && { image }),
    };

    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json({ message: "Coupon updated successfully", data: updatedCoupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update coupon" });
  }
};

// ✅ Delete a coupon by ID
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await CouponModel.findByIdAndDelete(id);

    if (!deletedCoupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
};
