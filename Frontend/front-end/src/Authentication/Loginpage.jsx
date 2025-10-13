import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    toast.error("❌ Please fill in all fields.");
    return;
  }

  setLoading(true);

  try {
    const { data } = await axios.post("http://localhost:4000/login", { email, password });

    // ✅ Updated condition to handle different backend responses
    if (data) {
      const user = data.user || data?.data?.user; // handle nested response
      const token = data.token || data?.data?.token;

      if (user && token) {
        // Persist login
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        // Dispatch event for Navbar update
        window.dispatchEvent(new Event("login"));

        toast.success("✅ Login successful!");
        navigate("/"); // Redirect to homepage
      } else {
        // Backend returned data but no user/token
        toast.error(data?.message || "❌ Login failed! No user/token returned.");
      }
    } else {
      // No data returned
      toast.error("❌ Login failed! No response from server.");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "❌ Login failed!");
  } finally {
    setLoading(false);
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
