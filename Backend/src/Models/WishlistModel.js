const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One wishlist per user
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    collection: "Wishlist",
  }
);

// Optimize querying wishlist by user
WishlistSchema.index({ user: 1 });

module.exports = mongoose.model("Wishlist", WishlistSchema);
