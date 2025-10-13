import { useEffect, useState } from "react";
import { getUserFromStorage } from "./ProtectedRoute";
import { toast } from "react-toastify";
import axios from "axios";
import { User, Mail, Lock, MapPin } from "lucide-react";

export default function UpdateProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        password: "",
        address: currentUser.address || "",
        profileImage: null,
      });
      setPreviewImage(currentUser.profileImage || "/default-avatar.png");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }

      const res = await axios.put(`http://localhost:4000/update-profile/${user._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      setUser(res.data);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6 hover:shadow-xl transition"
      >
        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-32 h-32">
            <img
              src={`http://localhost:4000/files/${user.profileImage}` || "/default-avatar.png"}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
            />
          </div>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="text-sm text-gray-600 mt-2"
          />
        </div>

        {/* Form Fields */}
        <InputField
          icon={<User size={18} />}
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <InputField
          icon={<Mail size={18} />}
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <InputField
          icon={<User size={18} />}
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
       
        <InputField
          icon={<MapPin size={18} />}
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-600 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
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
