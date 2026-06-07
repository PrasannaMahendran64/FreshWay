import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { fetchWishlist, removeWishlistApi } from "../redux/slices/wishlistSlice";
import { addToCartApi } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    const resultAction = await dispatch(removeWishlistApi(productId));
    if (removeWishlistApi.fulfilled.match(resultAction)) {
      toast.success("✅ Removed from Wishlist!");
    } else {
      toast.error(resultAction.payload || "❌ Failed to remove product");
    }
  };

  const handleAddToCart = async (productId) => {
    const resultAction = await dispatch(addToCartApi({ productId, quantity: 1 }));
    if (addToCartApi.fulfilled.match(resultAction)) {
      toast.success("🛒 Added to Cart!");
    } else {
      toast.error(resultAction.payload || "❌ Failed to add to cart");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Heart className="text-red-500 fill-red-500" /> My Wishlist
      </h2>

      {loading && wishlistItems.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-white border border-gray-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center max-w-xl mx-auto">
          <Heart size={48} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-lg">Your wishlist is empty</h3>
          <p className="text-gray-400 text-sm mt-1">Explore our supermarket and add items to your wishlist!</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-3 bg-gray-50 rounded-2xl p-4 flex justify-center items-center h-40">
                  <img
                    src={product.image ? `/api/files/${product.image}` : "/no-image.png"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-2 right-2 p-1.5 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full border border-gray-100 shadow transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <Link to={`/product/${product.slug}`} className="hover:text-green-600">
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{product.name}</h4>
                </Link>
                <p className="text-xs text-gray-400 mt-1">{product.brand || "FreshWay Brand"}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block line-through">
                    {product.discount > 0 ? `₹${Math.round(product.price * (1 + product.discount/100))}` : ""}
                  </span>
                  <span className="text-base font-extrabold text-green-700">₹{product.price}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition shadow"
                >
                  <ShoppingCart size={13} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
