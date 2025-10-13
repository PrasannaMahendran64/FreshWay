import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

export default function OffersPage() {
  const { cartItems, setDiscount } = useOutletContext();
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // Fetch available coupons from backend
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getcoupon");
      setCoupons(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coupons!");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleApplyCoupon = (coupon) => {
    const now = new Date();
    if (new Date(coupon.expiryDate) < now) {
      toast.error("Coupon has expired!");
      return;
    }
    setAppliedCoupon(coupon.code);
    setDiscount(coupon.discount || 0);
    toast.success(`Coupon applied! You saved ₹${coupon.discount}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Latest Coupons & Offers</h1>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col"
      >
        {coupons.length === 0 ? (
          <p className="text-center text-gray-500">No coupons available.</p>
        ) : (
          coupons.map((coupon, i) => {
            const isApplied = appliedCoupon === coupon.code;
            const isExpired = new Date(coupon.expiryDate) < new Date();
            const colorClass =
              coupon.color || "green"; // default color

            return (
              <div
                key={coupon._id || i}
                className="flex items-center justify-between bg-white hover:shadow-lg hover:scale-[1.02] transition rounded-xl p-4 mb-5 last:mb-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:4000/files/${coupon.image}` || "https://i.ibb.co/3yB2JXp/default.png"}
                    alt={coupon.title || coupon.code}
                    className="w-16 h-16 rounded-lg shadow-md"
                  />
                  <div>
                    <p className={`font-bold text-${colorClass}-500 text-lg leading-none`}>
                      {coupon.discount} OFF
                    </p>
                    <p className="text-sm text-gray-600">{coupon.title || "Special Offer"}</p>
                    <span
                      className={`text-xs font-medium ${
                        isExpired ? "text-gray-400" : "text-green-600"
                      }`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-green-600 font-semibold text-sm shadow">
                    {coupon.code}
                  </div>
                  {!isApplied && !isExpired && (
                    <button
                      onClick={() => handleApplyCoupon(coupon)}
                      className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                    >
                      Apply
                    </button>
                  )}
                  {isApplied && <span className="text-blue-600 font-semibold text-sm">Applied</span>}
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
