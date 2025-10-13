    import { useEffect, useState } from "react";
import { getUserFromStorage } from "./ProtectedRoute";
import { toast } from "react-toastify";
import axios from "axios";
import { Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      toast.error("Please login first");
    } else {
      setUser(currentUser);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:4000/change-password/${user._id}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6 hover:shadow-xl transition"
      >
        <InputField
          icon={<Lock size={18} />}
          label="Current Password"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
        />
        <InputField
          icon={<Lock size={18} />}
          label="New Password"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
        />
        <InputField
          icon={<Lock size={18} />}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-600 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

const InputField = ({ icon, label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 text-sm mb-1">{label}</label>
    <div className="flex items-center gap-2 bg-green-50 p-3 rounded-xl border border-green-100 focus-within:ring-2 focus-within:ring-green-300 transition">
      {icon}
      <input
        {...props}
        className="bg-transparent flex-1 outline-none text-gray-800 placeholder-gray-400"
      />
    </div>
  </div>
);
