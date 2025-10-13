import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { getUserFromStorage } from "./ProtectedRoute";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (currentUser) setUser(currentUser);
  }, []);

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={`http://localhost:4000/files/${user.profileImage}`|| "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-100 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h3>
          <p className="text-gray-500 mb-4">{user.email}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={<User size={18} />} label="Username" value={user.name || "N/A"} />
            <InfoCard icon={<Mail size={18} />} label="Email" value={user.email} />
            <InfoCard icon={<Phone size={18} />} label="Phone" value={user.mobilenumber || "N/A"} />
            <InfoCard icon={<Calendar size={18} />} label="Joined On" value={new Date(user.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-green-50 p-3 rounded-xl flex items-center gap-3 hover:shadow-md transition">
    <div className="bg-green-100 p-2 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  </div>
);
