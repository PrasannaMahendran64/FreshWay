const CartModel = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");

// 🔹 Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId)
      return res.status(400).json({ message: "UserId and ProductId are required" });

    // find or create cart
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, cart: [{ product: productId, quantity: quantity || 1 }] });
    } else {
      const itemIndex = cart.cart.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.cart[itemIndex].quantity += quantity || 1;
      } else {
        cart.cart.push({ product: productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", data: cart });
  } catch (err) {
    console.error("Add To Cart Error:", err);
    res.status(500).send("Server error");
  }
};


// 🔹 Get User Cart


const getCart = async (req, res) => {
  try {
    const userId = req.params.id; // ✅ get user ID from route param
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const cart = await CartModel.findOne({ user: userId }).populate("cart.product");

    if (!cart) return res.status(200).json({ data: [] });

    res.status(200).json({ data: cart });
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).send("Server error");
  }
};



// 🔹 Update Cart Item Quantity

const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId)
      return res.status(400).json({ message: "UserId and ProductId are required" });

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.cart.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated", data: cart });
  } catch (err) {
    console.error("Update Cart Error:", err);
    res.status(500).send("Server error");
  }
};

// 🔹 Remove Item from Cart
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", data: cart });
  } catch (err) {
    console.error("Remove Cart Item Error:", err);
    res.status(500).send("Server error");
  }
};

// 🔹 Clear Cart

const clearCart = async (req, res) => {
  try {
    const userId = req.params.id; // ✅ get userId from route parameter
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.cart = []; // clear all items
    await cart.save();

    res.status(200).json({ message: "Cart cleared", data: cart });
  } catch (err) {
    console.error("Clear Cart Error:", err);
    res.status(500).send("Server error");
  }
};
module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
