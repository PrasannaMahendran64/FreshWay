import axios from "axios";
import { X, Plus, Minus, ShoppingCart, Star,Truck, Home, CreditCard, CornerUpLeft, XCircle, Sun, MapPin, Stars, StarIcon, } from "lucide-react";
import {  useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Link, useOutletContext, useParams } from "react-router";
import LoaderPage from "./Loaders/LoaderPage";


const ProductModal = ({ product, setOpenQuickView, cartItems, addToCart, decreaseFromCart }) => {
  if (!product) return null;

  const productId = product._id || product.id;
  const itemInCart = cartItems.find((item) => item._id === productId);

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setOpenQuickView(false)} // Close on backdrop
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
      >
        {/* Close button */}
        <button
          onClick={() => setOpenQuickView(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
            <img
              src={`http://localhost:4000/files/${product.image}`}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between w-full md:w-1/2">
            {/* Stock + Title */}
            <p className="text-sm text-green-600 font-medium">
              In stock: {product.countInStock || "N/A"}
            </p>
            <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{renderStars(product.rating || 0)}</div>
              <span className="text-sm text-gray-600">
                {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Price */}
            <p className="text-2xl font-bold text-gray-900 mt-4">₹{product.price}</p>

            {/* Cart Actions */}
            <div className="mt-6 flex items-center gap-4">
              {!itemInCart ? (
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-green-100 px-4 py-2 rounded-full">
                  <button
                    onClick={() => decreaseFromCart(productId)}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-gray-800">{itemInCart.qty}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => setOpenQuickView(false)}
                className="bg-gray-200 px-5 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>

            {/* Category + Tags */}
            <div className="mt-5">
              {product.category && (
                <p className="text-sm font-medium text-gray-700">
                  Category: <span className="font-normal">{product.categoryName}</span>
                </p>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;



export const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, addToCart, decreaseFromCart } = useOutletContext();
  const [activeTab, setActiveTab] = useState("reviews");

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const productId = product?._id || product?.id;
  const itemInCart = (cartItems || []).find(item => item._id === productId || item.id === productId);
  const checkoutActive = !!itemInCart; // Checkout button active only if item in cart

  useEffect(() => {
    if (!slug) return;
    axios.get(`http://localhost:4000/get-products/${slug}`)
      .then(res => {
        const productData = res.data.data;
        setProduct(productData);
        setLoading(false);

        axios.get(`http://localhost:4000/product/${productData._id}`)
          .then(res => setReviews(res.data.data))
          .catch(err => console.error("Error fetching reviews:", err));
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p className="text-center py-10"><LoaderPage/></p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!product) return <p className="text-center py-10">No product found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      
      {/* Left Column: Product Image + Tabs */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-2xl flex items-center justify-center p-6">
          <img
            src={`http://localhost:4000/files/${product.image}`}
            alt={product.name}
            className="w-full max-h-[400px] object-contain"
          />
        </div>

        <div className="overflow-y-auto">
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "reviews"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600"
              }`}
            >
              Customer Reviews
            </button>
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "description"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600"
              }`}
            >
              Description
            </button>
          </div>

          {activeTab === "reviews" ? (
            reviews.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {reviews.map(review => (
                  <div key={review._id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-gray-600 text-sm font-medium">{review.user}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                    <p className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Description</h3>
              <p className="text-gray-700 text-sm">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Main Product Info + Highlights + Social Share */}
      <div className="space-y-6">
        <p className="text-sm text-green-600 font-medium">In stock: {product.countInStock}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>

        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(product.rating || 0)}</div>
          <span className="text-gray-700 text-sm">
            {product.rating?.toFixed(1) || "0.0"}{" "}
            <span className="text-gray-500">({product.numReviews || 0} reviews)</span>
          </span>
        </div>

        <p className="text-xl sm:text-2xl font-semibold">${product.price}</p>

        {/* Cart Actions + Checkout */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 flex-wrap">
          {itemInCart ? (
            <div className="flex items-center gap-3 bg-green-100 px-4 py-2 rounded-full">
              <button
                onClick={() => decreaseFromCart(productId)}
                className="bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-800">{itemInCart.qty}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 cursor-pointer transition"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          )}

          <Link to="/checkout"
            disabled={!checkoutActive}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
              checkoutActive
                ? "bg-green-500 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => console.log("Go to Checkout")} 
          >
            Checkout
          </Link>
        </div>

        <p className="text-gray-600">
          Category: <span className="font-medium text-gray-800">{product.categoryName || product.category?.name}</span>
        </p>

        {/* Highlights */}
        <div className="border-t pt-6 mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Highlights</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-center gap-2"><Truck className="text-teal-500" /> Free shipping over €100</li>
            <li className="flex items-center gap-2"><Home className="text-teal-500" /> Home Delivery within 1 Hour</li>
            <li className="flex items-center gap-2"><CreditCard className="text-teal-500" /> Cash on Delivery Available</li>
            <li className="flex items-center gap-2"><CornerUpLeft className="text-teal-500" /> 7 Days returns guarantee</li>
            <li className="flex items-center gap-2"><XCircle className="text-red-500" /> Warranty not available</li>
            <li className="flex items-center gap-2"><Sun className="text-yellow-500" /> 100% organic products</li>
            <li className="flex items-center gap-2"><MapPin className="text-teal-500" /> Delivery from Boho One, Middlesbrough</li>
          </ul>
        </div>

        {/* Social Share */}
        <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Share your social network</h2>
            <p className="text-sm text-gray-500">Share this product to get more traffic</p>
          </div>
          <div className="flex gap-4 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:scale-110 transition"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:scale-110 transition"><FaXTwitter /></a>
          </div>
        </div>
      </div>
    </div>
  );
};
