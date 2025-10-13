import { ShoppingBag, Trash } from "lucide-react";
import { Link } from "react-router";

const CartWidget = ({ open, setOpen, cartItems, removeFromCart }) => {
  // calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  // calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Floating cart box (desktop only) */}
      <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden md:block">
        <div
          className="bg-indigo-50 border rounded-lg w-40 cursor-pointer shadow-lg"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col items-center justify-center py-3">
            <ShoppingBag className="w-6 h-6 text-green-600" />
            <p className="text-gray-700 text-sm">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </p>
          </div>
          <div className="bg-green-700 text-white text-center py-2 font-semibold rounded-b-lg">
            ₹{subtotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-full sm:w-96 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-indigo-50">
              <h2 className="flex items-center gap-2 font-semibold text-lg">
                <ShoppingBag className="w-5 h-5" /> Shopping Cart
              </h2>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">
                  Your cart is empty
                </p>
              ) : (
                cartItems.map((item) => {
                  const productId = item._id || item.id;
                  return (
                    <div
                      key={productId}
                      className="flex justify-between items-center mb-4"
                    >
                      <img
                        src={
                          item.image
                            ? `http://localhost:4000/files/${item.image}`
                            : "/no-image.png"
                        }
                        alt={item.name}
                        className="w-14 h-14 object-contain border rounded"
                      />
                      <div className="flex-1 ml-3">
                        <h4 className="font-semibold text-gray-700">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.qty}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 border rounded-md py-2">
                  View Cart
                </button>
                <Link to="/checkout" className="flex-1 bg-green-600 text-center text-white rounded-md py-2">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartWidget;
