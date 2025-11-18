import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useOutletContext, Link, useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [razorpayMethod, setRazorpayMethod] = useState("card"); // card or upi
  const [upiId, setUpiId] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const { cartItems, addToCart, decreaseFromCart, removeFromCart, setCartItems } = useOutletContext();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + shipping;

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // ✅ Load user & token
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const tokenStr = localStorage.getItem("token");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      setName(parsedUser.name || "");
      setEmail(parsedUser.email || "");
      setMobileNumber(parsedUser.mobilenumber || "");
    }
    if (tokenStr) setToken(tokenStr);
  }, []);

  // ✅ Clear Cart
  const clearCart = () => {
    localStorage.removeItem("cartItems");
    if (typeof setCartItems === "function") setCartItems([]);
  };

  // ✅ Handle Razorpay payment
  const handleRazorpayPayment = async (orderId) => {
    try {
      const { data } = await axios.post(`http://localhost:4000/create/${orderId}`);
      const { razorpay_order_id, amount, currency } = data.data;

      const options = {
        key:"", // ✅ from your .env
        amount,
        currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:4000/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            toast.success("✅ Payment successful & order confirmed!", { position: "top-right" });

            clearCart(); // 🧹 Clear cart after success
            navigate(`/order-invoice/${orderId}`);
          } catch (err) {
            console.error(err);
            toast.error("❌ Payment verification failed!", { position: "top-right" });
          }
        },
        prefill: {
          name,
          email,
          contact: mobilenumber,
          vpa: razorpayMethod === "upi" ? upiId : undefined,
        },
        method: {
          netbanking: true,
          card: razorpayMethod === "card",
          upi: razorpayMethod === "upi",
          wallet: false,
          emi: false,
        },
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to initiate payment!", { position: "top-right" });
    }
  };

  // ✅ Confirm Order
  const handleConfirmOrder = async () => {
    if (!name || !email || !mobilenumber || !address || !city || !country || !postalCode) {
      toast.error("❌ Please fill all fields!", { position: "top-right" });
      return;
    }
    if (cartItems.length === 0) {
      toast.error("❌ Cart is empty!", { position: "top-right" });
      return;
    }
    if (paymentMethod === "razorpay" && razorpayMethod === "upi" && !upiId) {
      toast.error("❌ Please enter your UPI ID!", { position: "top-right" });
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id || item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price,
      image: item.image || null,
    }));

    const orderData = {
      orderItems,
      shippingAddress: { address, city, country, postalCode },
      paymentMethod,
      shippingPrice: shipping,
      totalPrice: total,
    };

    try {
      const { data } = await axios.post(
        `http://localhost:4000/create-order/${user._id}`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = data.data._id;

      if (paymentMethod === "razorpay") {
        await handleRazorpayPayment(orderId);
      } else {
        toast.success("✅ Order placed successfully!", { position: "top-right" });
        clearCart(); // 🧹 clear cart for COD too
        navigate(`/order-invoice/${orderId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Order failed!", { position: "top-right" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-8">
      <ToastContainer autoClose={3000} />

      {/* Left Section */}
      <div className="flex-1 space-y-6">
        <h2 className="font-bold text-lg mb-4">01. Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="border p-2 rounded"/>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded col-span-2"/>
          <input value={mobilenumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Phone Number" className="border p-2 rounded col-span-2"/>
        </div>

        <h2 className="font-bold text-lg mt-6 mb-4">02. Shipping Details</h2>
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" className="border p-2 rounded w-full mb-3"/>
        <div className="grid grid-cols-3 gap-4">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="border p-2 rounded"/>
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="border p-2 rounded"/>
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Zip Code" className="border p-2 rounded"/>
        </div>

        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 border p-3 rounded cursor-pointer w-full">
            <input type="radio" name="shipping" onChange={() => setShipping(60)}/> UPS Today Delivery: ₹60
          </label>
          <label className="flex items-center gap-2 border p-3 rounded cursor-pointer w-full">
            <input type="radio" name="shipping" onChange={() => setShipping(20)}/> UPS 7 Days Delivery: ₹20
          </label>
        </div>

        <h2 className="font-bold text-lg mt-6 mb-4">03. Payment Method</h2>
        <div className="flex flex-col gap-3">
          <label><input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)}/> Cash on Delivery</label>
          <label><input type="radio" name="payment" value="razorpay" checked={paymentMethod === "razorpay"} onChange={(e) => setPaymentMethod(e.target.value)}/> Razorpay</label>

          {paymentMethod === "razorpay" && (
            <div className="mt-2 ml-6 flex flex-col gap-2">
              <label><input type="radio" name="razorpayMethod" value="card" checked={razorpayMethod === "card"} onChange={(e) => setRazorpayMethod(e.target.value)}/> Card</label>
              <label><input type="radio" name="razorpayMethod" value="upi" checked={razorpayMethod === "upi"} onChange={(e) => setRazorpayMethod(e.target.value)}/> UPI</label>
              {razorpayMethod === "upi" && (
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI ID" className="border p-2 rounded w-full"/>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Link to="/products" className="px-4 py-2 border rounded hover:bg-gray-200">Continue Shopping</Link>
          <button onClick={handleConfirmOrder} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Confirm Order</button>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full md:w-1/3 border p-6 rounded-lg shadow">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id || item.productId} className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Item Price ₹{item.price.toFixed(2)}</p>
                <p className="text-green-600 font-bold">₹{(item.price * item.qty).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decreaseFromCart(item._id || item.productId)} className="px-2 border rounded">-</button>
                <span>{item.qty}</span>
                <button onClick={() => addToCart(item)} className="px-2 border rounded">+</button>
                <Trash2 className="text-red-500 cursor-pointer" onClick={() => removeFromCart(item._id || item.productId)}/>
              </div>
            </div>
          ))
        )}
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping Cost</span><span>₹{shipping.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
