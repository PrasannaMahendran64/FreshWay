const CartModel = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");

// 🔹 Get User Cart (Isolated to Logged-in User)
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await CartModel.findOne({ user: userId }).populate("cart.product");

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new CartModel({ user: userId, cart: [] });
      await cart.save();
    }

    res.status(200).json({ data: cart });
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
};

// 🔹 Add / Update Quantity of Item in Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({
        user: userId,
        cart: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.cart.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // If item already exists, we can either overwrite quantity or add it depending on the request.
        // Let's add it (Standard ecommerce behavior)
        cart.cart[itemIndex].quantity += quantity || 1;
      } else {
        cart.cart.push({ product: productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    const populatedCart = await CartModel.findById(cart._id).populate("cart.product");
    res.status(200).json({ message: "Cart updated successfully", data: populatedCart });
  } catch (err) {
    console.error("Add To Cart Error:", err);
    res.status(500).json({ message: "Server error while updating cart" });
  }
};

// 🔹 Update Specific Cart Item Quantity
const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body;
    const productId = req.body.productId || req.params.id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "ProductId and quantity are required" });
    }

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.cart.splice(itemIndex, 1);
    } else {
      cart.cart[itemIndex].quantity = quantity;
    }

    await cart.save();
    const populatedCart = await CartModel.findById(cart._id).populate("cart.product");
    res.status(200).json({ message: "Cart item quantity updated", data: populatedCart });
  } catch (err) {
    console.error("Update Cart Item Qty Error:", err);
    res.status(500).json({ message: "Server error while updating quantity" });
  }
};

// 🔹 Remove Item from Cart (DELETE /api/cart/remove/:id where id is ProductId)
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id; // product ID

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cart = cart.cart.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populatedCart = await CartModel.findById(cart._id).populate("cart.product");
    res.status(200).json({ message: "Item removed from cart", data: populatedCart });
  } catch (err) {
    console.error("Remove Cart Item Error:", err);
    res.status(500).json({ message: "Server error while removing item" });
  }
};

// 🔹 Clear Cart
const clearSecureCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cart = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", data: cart });
  } catch (err) {
    console.error("Clear Cart Error:", err);
    res.status(500).json({ message: "Server error while clearing cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearSecureCart,
};
