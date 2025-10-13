import { Outlet } from "react-router"; // ✅ should be react-router-dom
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartWidget from "./Cart";

const Layout = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add product to cart
  const addToCart = (product) => {
    const productId = product._id || product.id;
    if (!productId) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === productId);
      if (existing) {
        return prev.map((item) =>
          item._id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, _id: productId, qty: 1 }];
    });
  };

  // ✅ Decrease product qty
  const decreaseFromCart = (productId) => {
    if (!productId) return;
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ✅ Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Navbar with cart trigger */}
      <Navbar cartItems={cartItems} onCartClick={() => setCartOpen(true)} />

      {/* Main content with shared cart state via Outlet */}
      <div className="flex-1">
        <Outlet
          context={{
            cartItems,
            addToCart,
            decreaseFromCart,
            removeFromCart,
          }}
        />
      </div>

      <Footer />

      {/* Global Cart Drawer */}
      <CartWidget
        open={cartOpen}
        setOpen={setCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />
    </div>
  );
};

export default Layout;
