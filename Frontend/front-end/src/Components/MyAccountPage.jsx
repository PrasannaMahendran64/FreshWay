import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
  Grid,
  ShoppingCart,
  Star,
  User,
  Settings,
  Lock,
  LogOut,
} from "lucide-react";
import { getUserFromStorage } from "./ProtectedRoute";
import { toast } from "react-toastify";

export default function MyAccountLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  if (!user) return null;

  const sidebarItems = [
    { icon: <Grid size={16} />, text: "Dashboard", path: "/myaccount" },
    { icon: <ShoppingCart size={16} />, text: "My Orders", path: "/myaccount/myorders" },
    { icon: <Star size={16} />, text: "My Reviews", path: "/myaccount/myreviews" },
    { icon: <User size={16} />, text: "My Account", path: "/myaccount/myprofile" },
    { icon: <Settings size={16} />, text: "Update Profile", path: "/myaccount/myupdate-profile" },
    { icon: <Lock size={16} />, text: "Change Password", path: "/myaccount/change-password" },
    { icon: <LogOut size={16} />, text: "Logout", path: "/", danger: true, action: handleLogout },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-72 bg-white shadow-md p-6 border-r border-gray-100 overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src={`http://localhost:4000/files/${user.profileImage}`|| "/default-avatar.png"}
            alt="profile"
            className="h-20 w-20 rounded-full object-cover mb-3"
          />
          <h2 className="font-semibold text-lg">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
        </div>

        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item, idx) => (
            <SidebarItem
              key={idx}
              icon={item.icon}
              text={item.text}
              danger={item.danger}
              active={!item.danger && location.pathname === item.path}
              onClick={() => {
                if (item.action) item.action();
                else navigate(item.path);
              }}
            />
          ))}
        </nav>
      </div>

      {/* Main content */}
      
        <div className="flex-1 ">
          <Outlet />
        </div>
     
    </div>
  );
}

/* Sidebar item */
const SidebarItem = ({ icon, text, active, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition w-full text-left ${
      active
        ? "bg-green-100 text-green-700 font-medium"
        : danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {icon} {text}
  </button>
);
