import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useOutletContext } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import Categories from "./Categories";
import ProductList from "./ProductList";

const HeroSection = () => {
  const { cartItems, addToCart, decreaseFromCart, setDiscount } = useOutletContext();
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // Fetch coupons from backend
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getcoupon");
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleApplyCoupon = (coupon) => {
    const now = new Date();
    if (new Date(coupon.expiryDate) < now) return;
    setAppliedCoupon(coupon.code);
    setDiscount(coupon.discount || 0);
  };

  return (
    <div className="px-6 md:px-12 py-12 space-y-16 bg-gradient-to-b from-white to-gray-50">
      {/* Top Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            loop={true}
            className="rounded-3xl overflow-hidden shadow-2xl w-full"
          >
            {[
              "supermarket-banner-concept-with-ingredients.jpg",
              "supermarket-banner-concept-with-ingredients1.jpg",
              "flat-lay-vegetables-frame.jpg",
              "top-view-fresh-vegetables-with-copy-space.jpg",
              "top-view-fresh-vegetables-with-greens-blue-desk-snack-lunch-salad-vegetable-food.jpg",
            ].map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className="relative p-6 md:p-12 bg-cover bg-center rounded-3xl h-[320px] md:h-[420px] flex items-end group"
                  style={{ backgroundImage: `url('${img}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 rounded-3xl group-hover:from-black/90 transition"></div>
                  <div className="relative z-10 text-white max-w-xl space-y-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
                      Fresh & Organic Groceries
                    </h2>
                    <p className="text-gray-200 text-sm md:text-lg leading-relaxed">
                      Shop with us and experience fresh products with unbeatable discounts.
                    </p>
                    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 px-6 py-3 rounded-xl font-semibold shadow-lg text-white transition">
                      Shop Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Right: First 2 Coupons from backend */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col justify-between"
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 border-b pb-4 mb-6">
            🎟️ Latest Super Discount Coupons
          </h3>

          {coupons.length === 0 ? (
            <p className="text-center text-gray-500">No coupons available.</p>
          ) : (
            coupons.slice(0, 2).map((coupon, i) => {
              const isApplied = appliedCoupon === coupon.code;
              const isExpired = new Date(coupon.expiryDate) < new Date();
              return (
                <div
                  key={coupon._id || i}
                  className="flex items-center justify-between bg-white hover:shadow-lg hover:scale-[1.02] transition rounded-xl p-4 mb-5 last:mb-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        coupon.image
                          ? `http://localhost:4000/files/${coupon.image}`
                          : "https://i.ibb.co/3yB2JXp/default.png"
                      }
                      alt={coupon.title || coupon.code}
                      className="w-16 h-16 rounded-lg shadow-md"
                    />
                    <div>
                      <p className="font-bold text-green-600 text-lg leading-none">
                        ₹{coupon.discount} OFF
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

      {/* Middle Promo Section */}
      <div className="bg-gradient-to-r from-orange-300 via-orange-300 to-red-300 rounded-3xl px-8 py-3 flex flex-col md:flex-row justify-between items-center text-white shadow-xl">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-bold ">
            100% Natural Quality Organic Product
          </h1>
          <p className="text-orange-100">
            See our latest discounted products and get exclusive offers.
          </p>
        </div>
        <button className="mt-6 md:mt-0 bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold shadow-lg transition">
          Shop Now
        </button>
      </div>

      <Categories />
      <ProductList />
    </div>
  );
};

export default HeroSection;
