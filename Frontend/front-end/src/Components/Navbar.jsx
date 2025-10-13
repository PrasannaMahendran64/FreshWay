import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Home,
  LayoutGrid,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { getUserFromStorage } from "./ProtectedRoute";

const Navbar = ({ cartItems, onCartClick }) => {
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const categories = [
    { name: "Fish & Meat", icon: "🐟", slug: "fish-meat" },
    { name: "Fruits & Vegetable", icon: "🥬", slug: "fruits-vegetable" },
    { name: "Cooking Essentials", icon: "🍳", slug: "cooking-essentials" },
    { name: "Biscuits & Cakes", icon: "🍪", slug: "biscuits-cakes" },
    { name: "Household Tools", icon: "🧴", slug: "household-tools" },
    { name: "Pet Care", icon: "🐕", slug: "pet-care" },
    { name: "Beauty & Healths", icon: "💄", slug: "beauty-healths" },
    { name: "Jam & Jelly", icon: "🍯", slug: "jam-jelly" },
    { name: "Milk & Dairy", icon: "🥛", slug: "milk-dairy" },
    { name: "Drinks", icon: "🥤", slug: "drinks" },
  ];

  const [open, setOpen] = useState(false); // for desktop categories
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // for user dropdown
  const [user, setUser] = useState(null);

  const userDropdownRef = useRef(null);

  useEffect(() => {
    const updateUser = () => setUser(getUserFromStorage());
    window.addEventListener("login", updateUser);
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("login", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  const handleCategoryClick = (slug) => {
    setOpen(false);
    setMobileCategoriesOpen(false);
    navigate(`/categories/${slug}`);
  };

  return (
    <>
      {/* Navbar fixed at top */}
      <header className="w-full border-b fixed top-0 left-0 right-0 z-50 bg-white shadow">
        {/* Main navbar */}
        <div className="bg-green-600 flex justify-between items-center px-4 md:px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/">
            <img src="logo.png" className="h-11 w-auto" alt="logo" /></Link>
          </div>

          {/* Search bar */}
          <div className="flex w-1/2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 bg-white rounded-l-lg focus:outline-none text-sm"
            />
            <button className="bg-gray-100 px-3 rounded-r-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-white">
            {/* Cart */}
            <div className="relative cursor-pointer hidden sm:block" onClick={onCartClick}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <Bell className="w-6 h-6 cursor-pointer hidden sm:block" />

            {/* User dropdown */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-full shadow hover:shadow-md transition"
                >
                  <User className="w-6 h-6 text-green-600" />
                  <span className="hidden sm:inline font-medium">{user.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-2xl rounded-xl py-2 transition-all duration-300 z-50 ring-1 ring-gray-200 animate-slide-down">
                    <Link
                      to="/myaccount"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition transform hover:translate-x-1"
                    >
                      <User className="w-5 h-5 text-green-600" /> My Account
                    </Link>
                    <Link
                      to="/myaccount/myorders"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition transform hover:translate-x-1"
                    >
                      <ShoppingCart className="w-5 h-5 text-blue-600" /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition transform hover:translate-x-1"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              >
                <User className="w-6 h-6" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop bottom nav */}
        <div className="hidden md:flex justify-between items-center px-6 py-3 text-sm bg-white">
          <div className="flex gap-6">
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 font-medium hover:text-green-600"
              >
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              {open && (
                <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="flex w-full text-left items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/" className="font-medium hover:text-green-600">Home</Link>
            <Link to="/about-us" className="font-medium hover:text-green-600">About Us</Link>
            <Link to="/contact-us" className="font-medium hover:text-green-600">Contact Us</Link>

            <div className="font-serif">
              <marquee behavior="scroll" direction="left">
                Attention: Our Grocery Store Is New Products With Exciting Offers!
              </marquee>
            </div>

            <Link to="/offers"
              
              className="text-red-600 bg-red-300 px-2 py-2 rounded-md shadow-lg animate-[zoomInOut_1.5s_ease-in-out_infinite] relative"
            >
              Offers
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
          </div>

          <div className="flex gap-6">
            <Link to="/privacy-policy" className="font-medium hover:text-green-600">Privacy Policy</Link>
            <Link to="/terms-condition" className="font-medium hover:text-green-600">Terms & Conditions</Link>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[130px] md:h-[160px]"></div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-green-600 border-t shadow-md sm:hidden z-50">
        <div className="flex justify-around items-center py-2 text-xs text-white">
          <button
            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
            className="flex flex-col items-center"
          >
            <LayoutGrid className="w-6 h-6" />
            <span>Categories</span>
          </button>

          {mobileCategoriesOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
              <div className="bg-white w-3/4 sm:w-1/2 h-full shadow-lg p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-3">
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="flex w-full text-left items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setMobileCategoriesOpen(false)}
                  className="mt-6 bg-green-600 text-white w-full py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
              <div className="flex-1" onClick={() => setMobileCategoriesOpen(false)} />
            </div>
          )}

          <Link to="/" className="flex flex-col items-center">
            <Home className="w-6 h-6" />
            <span>Home</span>
          </Link>

          <div className="relative cursor-pointer" onClick={onCartClick}>
            <ShoppingCart className="w-6 h-6" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {user ? (
            <button onClick={handleLogout} className="flex flex-col items-center">
              <LogOut className="w-6 h-6" />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login" className="flex flex-col items-center">
              <User className="w-6 h-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
