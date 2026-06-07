const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName: { type: String },
  tags: [{ type: String }],
  brand: { type: String, default: "" },
  sku: { type: String, unique: true, sparse: true },
  discount: { type: Number, default: 0 }, // percentage
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true, collection: "Product" });

// Indexes for optimized searching, sorting, and filtering
ProductSchema.index({ name: "text", description: "text" }); // Text index for search
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ createdAt: -1 });

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
