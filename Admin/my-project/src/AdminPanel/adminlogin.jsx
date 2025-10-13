import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router"; // ✅ should be react-router-dom, not react-router
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("❌ Fill all fields!", { position: "top-right" });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      // ✅ Assuming backend sends: { success, message, data: { user, token } }
      const user = data?.data?.user;
      const token = data?.data?.token;

      if (!user || !token) {
        toast.error("❌ Invalid login response from server!", {
          position: "top-right",
        });
        setLoading(false);
        return;
      }

      // ✅ Ensure only admins can log in
      if (!user.isAdmin) {
        toast.error("❌ Only admins can login!", { position: "top-right" });
        setLoading(false);
        return;
      }

      // Save admin info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("✅ Admin login successful!", { position: "top-right" });

      setTimeout(() => {
        navigate("/dashboard"); // redirect to dashboard
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Login failed!", {
        position: "top-right",
      });
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      <ToastContainer autoClose={3000} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
