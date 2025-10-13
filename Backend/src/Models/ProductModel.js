const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String, unique: true },
  description: { type: String },
  price: { type: Number },
  image: { type: String }, // url
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // reference
  categoryName: { type: String }, // store category name directly (optional, useful for quick access)
  tags: [{ type: String }], // array of tags
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
   numReviews: { type: Number, default: 0 },
}, { timestamps: true, collection: "Product" });

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
