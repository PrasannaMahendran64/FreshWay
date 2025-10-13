const express = require('express')

const { verifyToken, verifyPayment } = require('../MiddleWare/Auth')

const router = express.Router()

const UserController = require('../Controllers/UserController')

const ProductController = require("../Controllers/ProductController")

const categoryController = require("../Controllers/CategoryController")

const cartController =require("../Controllers/CartController")

const orderController =require("../Controllers/OrderController")

const ReviewController =require("../Controllers/ReviewController")

const adminController = require("../Controllers/AdminController")

const CouponController =require("../Controllers/CouponController")

const Upload = require('../MiddleWare/FIleStorage')
const { createRazorpayOrder, verifyRazorpayPayment } = require('../Controllers/RazorpayController')



//user
router.post("/register",UserController.userRegisterController)

router.post("/login",UserController.userLoginController)

router.post("/otplogin",UserController.userLoginwithotpController)

router.post("/verifyotp",UserController.userVerifyOtpController)

router.get("/profile",verifyToken,UserController.showProfileController)

router.post("/forget",UserController.forgetPasswordController)

router.post("/reset",UserController.resetPasswordController)

router.get("/user-order/:userId",UserController.getUserOrdersController)

router.get("/user-review/:userId",UserController.getUserReviewsController)

router.put("/change-password/:userId",UserController.changePasswordController)

router.put("/update-profile/:id",Upload.single("profileImage"),UserController.updateProfileController)



//Product

router.post("/create-product",Upload.single("image"),ProductController.createProduct)

router.get("/get-product/:id",ProductController.getProductById)

router.get("/get-product",ProductController.getProducts)

router.get("/products/category/:slug",ProductController.getProductByCategory)

router.get("/get-products/:slug",ProductController.getProductBySlug)

router.put("/update-product/:id",ProductController.updateProduct)

router.delete("/delete-product/:id",ProductController.deleteProduct)

//categories

router.post("/create-categories",Upload.single("image"),categoryController.createCategory)

router.get("/get-categories",categoryController.getCategories)

router.get("/get-categories/:id",categoryController.getCategoryById)

router.put("/update-categories/:id",categoryController.updateCategory)

router.delete("/delete-categories/:id",categoryController.deleteCategory)

//Cart

router.post("/create-cart",cartController.addToCart)

router.get("/get-cart/:id",cartController.getCart)

router.put("/update-cart/:id",cartController.updateCartItem)

router.delete("/delete-cart/:id",cartController.clearCart)

//order

router.post("/create-order/:userId",orderController.createOrder)

router.get("/get-orders",orderController.getAllOrders)


router.get("/get-order/:id",orderController.getOrderById)

router.put("/update-order/:id",orderController.updateOrderStatus)

router.delete("/delete-order/:id",orderController.deleteOrder)

router.post("/create/:orderId",createRazorpayOrder)

router.post("/verify",verifyRazorpayPayment)

//Review

router.post("/create-review", ReviewController.createReview);                
router.get("/get-reviews", ReviewController.getReviews);                   
router.get("/get-reviewbyid/:id", ReviewController.getReviewById);  
router.get("/product/:productId",ReviewController.getReviewsByProduct)         
router.put("/update-review/:id", ReviewController.updateReview);             
router.delete("/delete-review/:id", ReviewController.deleteReview);          


//admin

router.put("/update-admin/",adminController.makeUserAdmin)

router.put("/remove-admin",adminController.removeAdmin)

router.get("/get-users",adminController.getAllUsers)

//coupon


router.post("/createcoupon",Upload.single("image"),CouponController.createCoupon)

router.get("/getcoupon",CouponController.getAllCoupons)

router.get("/getcoupon/:code",CouponController.getCouponByCode)

router.put("/updatecoupon/:id",CouponController.updateCoupon)

router.delete("/deletecoupon/:id",CouponController.deleteCoupon)


module.exports = router