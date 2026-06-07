const WishlistModel = require("../Models/WishlistModel");
const ProductModel = require("../Models/ProductModel");

// 🔹 Get User Wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    let wishlist = await WishlistModel.findOne({ user: userId }).populate("products");

    if (!wishlist) {
      wishlist = new WishlistModel({ user: userId, products: [] });
      await wishlist.save();
    }

    res.status(200).json({ data: wishlist });
  } catch (err) {
    console.error("Get Wishlist Error:", err);
    res.status(500).json({ message: "Server error while fetching wishlist" });
  }
};

// 🔹 Add Product to Wishlist
const addWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await WishlistModel.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new WishlistModel({ user: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist", data: wishlist });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    const populated = await WishlistModel.findById(wishlist._id).populate("products");
    res.status(200).json({ message: "Product added to wishlist", data: populated });
  } catch (err) {
    console.error("Add Wishlist Error:", err);
    res.status(500).json({ message: "Server error while adding to wishlist" });
  }
};

// 🔹 Remove Product from Wishlist
const removeWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id; // product ID

    let wishlist = await WishlistModel.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    const populated = await WishlistModel.findById(wishlist._id).populate("products");
    res.status(200).json({ message: "Product removed from wishlist", data: populated });
  } catch (err) {
    console.error("Remove Wishlist Error:", err);
    res.status(500).json({ message: "Server error while removing from wishlist" });
  }
};

module.exports = {
  getWishlist,
  addWishlist,
  removeWishlist,
};
