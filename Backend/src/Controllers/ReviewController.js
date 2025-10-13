const ProductModel = require("../Models/ProductModel");
const ReviewModel = require("../Models/ReviewModel");

// 🔹 Create Review
const createReview = async (req, res) => {
  try {
    const { product, user, rating, comment } = req.body;

    if (!product || !user || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save review
    const review = new ReviewModel({ product, user, rating, comment });
    await review.save();

    // Recalculate product rating
    const reviews = await ReviewModel.find({ product });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    await ProductModel.findByIdAndUpdate(product, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Reviews
const getReviews = async (req, res) => {
  try {
    const { productId } = req.query; // optional query to filter by product
    let query = {};
    if (productId) query.product = productId;

    const reviews = await ReviewModel.find(query).populate("product", "name");
    res.status(200).json({ data: reviews });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get Review by Review ID
const getReviewById = async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id).populate("product", "name");
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ data: review });
  } catch (err) {
    console.error("Get Review By ID Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params; // product ID from URL
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const reviews = await ReviewModel.find({ product: productId }).populate("product", "name");
    res.status(200).json({ data: reviews });
  } catch (err) {
    console.error("Get Reviews By Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update Review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updateData = {};
    if (rating) updateData.rating = rating;
    if (comment) updateData.comment = comment;

    const updated = await ReviewModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review updated successfully", data: updated });
  } catch (err) {
    console.error("Update Review Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete Review
const deleteReview = async (req, res) => {
  try {
    const deleted = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully", data: deleted });
  } catch (err) {
    console.error("Delete Review Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};
