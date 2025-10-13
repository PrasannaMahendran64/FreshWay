import { ShoppingCart, Plus, Minus, Expand   , Star } from "lucide-react";
import { useState } from "react";
import ProductModal from "./ProductDetails";
import { Link } from "react-router";


const ProductCard = ({ product, cartItems, addToCart, decreaseFromCart }) => {
  if (!product) return null;

  const [openQuickView, setOpenQuickView] = useState(false);

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

  const productId = product._id || product.id;
  const itemInCart = cartItems.find((item) => item._id === productId);

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-md hover:border border-green-500 p-4 flex flex-col relative">
        {/* Product Image with Hover Quick View */}
        <div className="relative group">
          <div className="w-full h-40 overflow-hidden rounded-md">
            {product.image ? (
              <img
                src={`http://localhost:4000/files/${product.image}`}
                alt={product.name || "Product Image"}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-end justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setOpenQuickView(true)}
              className="flex flex-row gap-2 bottom-0 bg-white px-4 py-2 rounded-full shadow-md cursor-pointer hover:text-green-500 hover:bg-gray-100 
        transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
            >
              <Expand />
              Quick View
            </button>
          </div>
        </div>


        {/* Name */}
       <Link to={`/product/${product.slug}`}><h3 className="font-semibold hover:text-green-500 text-gray-800 mt-8">{product.name || "No Name"}</h3></Link> 

        {/* Rating */}
        <div>
        <p className="text-sm flex flex-row  text-gray-500">
           {renderStars(product.rating || 0)}
          
        </p>
        <p> {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} reviews)</p>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price || 0}</p>

        {/* Add to Cart / Counter */}
        <div className="mt-auto flex justify-end">
          {!itemInCart ? (
            <button
              onClick={() => addToCart && addToCart(product)}
              className="bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <button
                onClick={() => decreaseFromCart && decreaseFromCart(productId)}
                className="bg-green-600 text-white p-1 cursor-pointer rounded-full hover:bg-green-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-800">{itemInCart.qty}</span>
              <button
                onClick={() => addToCart && addToCart(product)}
                className="bg-green-600 text-white p-1 cursor-pointer rounded-full hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {openQuickView && (
        <ProductModal
          product={product}
          setOpenQuickView={setOpenQuickView}
          cartItems={cartItems}
          addToCart={addToCart}
          decreaseFromCart={decreaseFromCart}
        />
      )}
    </>
  );
};

export default ProductCard;
