import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../redux/slices/authSlice";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("❌ Please fill in all fields.");
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("✅ Login successful!");
      // Fetch cart and wishlist right away for the logged-in user
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      navigate("/");
    } else {
      toast.error(resultAction.payload || "❌ Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 px-4">
      <ToastContainer autoClose={3000} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Forgot password? <Link to="/forget" className="text-green-600 hover:underline">Reset here</Link>
          </p>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/signup" className="text-green-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
