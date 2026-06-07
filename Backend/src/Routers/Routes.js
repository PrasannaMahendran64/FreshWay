const express = require('express');
const router = express.Router();

// Middlewares
const { verifyToken } = require('../MiddleWare/Auth'); // legacy if needed
const authMiddleware = require('../MiddleWare/authMiddleware');
const adminMiddleware = require('../MiddleWare/adminMiddleware');
const Upload = require('../MiddleWare/FileStorage');

// Legacy Controllers (for compatibility)
const UserController = require('../Controllers/UserController');
const ProductController = require("../Controllers/ProductController");
const categoryController = require("../Controllers/CategoryController");
const cartController = require("../Controllers/CartController");
const orderController = require("../Controllers/OrderController");
const ReviewController = require("../Controllers/ReviewController");
const adminController = require("../Controllers/AdminController");
const CouponController = require("../Controllers/CouponController");
const { createRazorpayOrder, verifyRazorpayPayment } = require('../Controllers/RazorpayController');

// Secure / Rebuilt Controllers
const authController = require("../Controllers/authController");
const userProfileController = require("../Controllers/userProfileController");
const orderControllerSecure = require("../Controllers/orderControllerSecure");
const cartControllerSecure = require("../Controllers/cartControllerSecure");
const wishlistController = require("../Controllers/wishlistController");
const addressController = require("../Controllers/addressController");
const adminControllerSecure = require("../Controllers/adminControllerSecure");

// ==========================================
// 1️⃣ AUTHENTICATION ROUTES (New & Secure)
// ==========================================
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authMiddleware, authController.logout);
router.get("/auth/me", authMiddleware, authController.getMe);

// Legacy auth routes (for compatibility, secured or preserved)
router.post("/register", UserController.userRegisterController);
router.post("/login", UserController.userLoginController);
router.post("/otplogin", UserController.userLoginwithotpController);
router.post("/verifyotp", UserController.userVerifyOtpController);
router.post("/forget", UserController.forgetPasswordController);
router.post("/reset", UserController.resetPasswordController);

// ==========================================
// 2️⃣ USER MANAGEMENT ROUTES (New & Secure)
// ==========================================
router.get("/user/profile", authMiddleware, userProfileController.getProfile);
router.put("/user/profile", authMiddleware, Upload.single("profileImage"), userProfileController.updateProfile);

// Legacy user profile routes (secured)
router.get("/profile", authMiddleware, UserController.showProfileController);
router.put("/update-profile/:id", authMiddleware, Upload.single("profileImage"), UserController.updateProfileController);
router.put("/change-password/:userId", authMiddleware, UserController.changePasswordController);
router.get("/user-review/:userId", authMiddleware, UserController.getUserReviewsController);

// ==========================================
// 3️⃣ ORDER MANAGEMENT ROUTES (New & Secure)
// ==========================================
router.get("/orders/my-orders", authMiddleware, orderControllerSecure.getMyOrders);
router.get("/orders/:id", authMiddleware, orderControllerSecure.getSecureOrderById);
router.post("/orders", authMiddleware, orderControllerSecure.createSecureOrder);

// Legacy user orders route (secured and routed to secure implementation)
router.get("/user-order/:userId", authMiddleware, orderControllerSecure.getMyOrders);
router.post("/create-order/:userId", authMiddleware, orderControllerSecure.createSecureOrder);

// Razorpay payments (secured)
router.post("/create/:orderId", authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyRazorpayPayment);

// ==========================================
// 4️⃣ CART ROUTES (New & Secure)
// ==========================================
router.get("/cart", authMiddleware, cartControllerSecure.getCart);
router.post("/cart/add", authMiddleware, cartControllerSecure.addToCart);
router.put("/cart/update", authMiddleware, cartControllerSecure.updateCartItemQuantity);
router.delete("/cart/remove/:id", authMiddleware, cartControllerSecure.removeCartItem);
router.delete("/cart/clear", authMiddleware, cartControllerSecure.clearSecureCart);

// Legacy cart routes (secured)
router.post("/create-cart", authMiddleware, cartControllerSecure.addToCart);
router.get("/get-cart/:id", authMiddleware, cartControllerSecure.getCart);
router.put("/update-cart/:id", authMiddleware, cartControllerSecure.updateCartItemQuantity);
router.delete("/delete-cart/:id", authMiddleware, cartControllerSecure.clearSecureCart);

// ==========================================
// 5️⃣ WISHLIST ROUTES (New & Secure)
// ==========================================
router.get("/wishlist", authMiddleware, wishlistController.getWishlist);
router.post("/wishlist/add", authMiddleware, wishlistController.addWishlist);
router.delete("/wishlist/remove/:id", authMiddleware, wishlistController.removeWishlist);

// ==========================================
// 6️⃣ ADDRESS ROUTES (New & Secure)
// ==========================================
router.get("/address", authMiddleware, addressController.getAddresses);
router.post("/address", authMiddleware, addressController.createAddress);
router.put("/address/:id", authMiddleware, addressController.updateAddress);
router.delete("/address/:id", authMiddleware, addressController.deleteAddress);

// ==========================================
// 7️⃣ PRODUCT ROUTES (Secure Product Management)
// ==========================================
router.get("/get-product", ProductController.getProducts); // public view
router.get("/get-product/:id", ProductController.getProductById); // public view
router.get("/get-products/:slug", ProductController.getProductBySlug); // public view
router.get("/products/category/:slug", ProductController.getProductByCategory); // public view

// Admin-only product management
router.post("/create-product", authMiddleware, adminMiddleware, Upload.single("image"), ProductController.createProduct);
router.put("/update-product/:id", authMiddleware, adminMiddleware, Upload.single("image"), ProductController.updateProduct);
router.delete("/delete-product/:id", authMiddleware, adminMiddleware, ProductController.deleteProduct);

// ==========================================
// 8️⃣ CATEGORY ROUTES (Secure Category Management)
// ==========================================
router.get("/get-categories", categoryController.getCategories);
router.get("/get-categories/:id", categoryController.getCategoryById);

// Admin-only category management
router.post("/create-categories", authMiddleware, adminMiddleware, Upload.single("image"), categoryController.createCategory);
router.put("/update-categories/:id", authMiddleware, adminMiddleware, Upload.single("image"), categoryController.updateCategory);
router.delete("/delete-categories/:id", authMiddleware, adminMiddleware, categoryController.deleteCategory);

// ==========================================
// 9️⃣ REVIEWS
// ==========================================
router.post("/create-review", authMiddleware, ReviewController.createReview);
router.get("/get-reviews", ReviewController.getReviews);
router.get("/get-reviewbyid/:id", ReviewController.getReviewById);
router.get("/product/:productId", ReviewController.getReviewsByProduct);
router.put("/update-review/:id", authMiddleware, ReviewController.updateReview);
router.delete("/delete-review/:id", authMiddleware, ReviewController.deleteReview);

// ==========================================
// 🔟 ADMIN PORTAL SPECIAL ENDPOINTS (New & Secure)
// ==========================================
router.get("/admin/dashboard-stats", authMiddleware, adminMiddleware, adminControllerSecure.getDashboardStats);
router.get("/admin/orders", authMiddleware, adminMiddleware, adminControllerSecure.getAdminOrders);
router.get("/admin/users", authMiddleware, adminMiddleware, adminControllerSecure.getAdminUsers);

// Legacy admin routes (secured)
router.get("/get-users", authMiddleware, adminMiddleware, adminControllerSecure.getAdminUsers);
router.get("/get-orders", authMiddleware, adminMiddleware, adminControllerSecure.getAdminOrders);
router.put("/update-order/:id", authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.delete("/delete-order/:id", authMiddleware, adminMiddleware, orderController.deleteOrder);
router.put("/update-admin", authMiddleware, adminMiddleware, adminController.makeUserAdmin);
router.put("/remove-admin", authMiddleware, adminMiddleware, adminController.removeAdmin);

// ==========================================
// 1️⃣1️⃣ COUPONS (Secure Coupon Management)
// ==========================================
router.get("/getcoupon", CouponController.getAllCoupons);
router.get("/getcoupon/:code", CouponController.getCouponByCode);

// Admin-only coupon management
router.post("/createcoupon", authMiddleware, adminMiddleware, Upload.single("image"), CouponController.createCoupon);
router.put("/updatecoupon/:id", authMiddleware, adminMiddleware, Upload.single("image"), CouponController.updateCoupon);
router.delete("/deletecoupon/:id", authMiddleware, adminMiddleware, CouponController.deleteCoupon);

module.exports = router;
