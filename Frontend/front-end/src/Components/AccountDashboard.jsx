import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  RefreshCcw,
  Truck,
  CheckCircle,
  Heart,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Package,
} from "lucide-react";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { fetchAddresses } from "../redux/slices/addressSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";
import { Link } from "react-router";

export default function AccountDashboard() {
  const dispatch = useDispatch();

  // Load from Redux
  const { user } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  const { addresses, loading: addressesLoading } = useSelector((state) => state.address);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyOrders());
      dispatch(fetchAddresses());
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Calculations for stats card
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "Processing").length;
  const completedOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled").length;

  const recentOrders = orders.slice(0, 3); // Get last 3 orders
  const primaryAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Welcome banner */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.profileImage ? `/api/files/${user.profileImage}` : "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-green-100 shadow"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-gray-800">Hello, {user?.name}!</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back to your FreshWay account dashboard.</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1"><Mail size={14} className="text-green-600" /> {user?.email}</span>
            <span className="flex items-center gap-1"><Phone size={14} className="text-green-600" /> {user?.mobilenumber || "N/A"}</span>
            <span className="flex items-center gap-1"><Calendar size={14} className="text-green-600" /> Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <h3 className="text-lg font-bold text-gray-700 mb-4">Orders Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <DashboardCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="text-green-600" size={20} />}
          bg="bg-green-50"
        />
        <DashboardCard
          title="Pending"
          value={pendingOrders}
          icon={<RefreshCcw className="text-yellow-600" size={20} />}
          bg="bg-yellow-50"
        />
        <DashboardCard
          title="Processing"
          value={processingOrders}
          icon={<Truck className="text-blue-600" size={20} />}
          bg="bg-blue-50"
        />
        <DashboardCard
          title="Completed"
          value={completedOrders}
          icon={<CheckCircle className="text-emerald-600" size={20} />}
          bg="bg-emerald-50"
        />
        <DashboardCard
          title="Wishlist Items"
          value={wishlistItems.length}
          icon={<Heart className="text-red-600" size={20} />}
          bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders section */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
              <Package size={20} className="text-green-600" /> Recent Orders
            </h4>
            <Link to="/myaccount/myorders" className="text-green-600 hover:underline text-xs font-semibold">
              View All
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              <div className="h-12 bg-gray-100 animate-pulse rounded-lg"></div>
              <div className="h-12 bg-gray-100 animate-pulse rounded-lg"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">You have not placed any orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl hover:bg-gray-100/50 transition">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">₹{order.totalPrice}</p>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      order.orderStatus === "Delivered" ? "bg-green-100 text-green-700" :
                      order.orderStatus === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Address section */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                <MapPin size={20} className="text-green-600" /> Default Address
              </h4>
              <Link to="/myaccount/address" className="text-green-600 hover:underline text-xs font-semibold">
                Manage
              </Link>
            </div>

            {addressesLoading ? (
              <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : !primaryAddress ? (
              <p className="text-gray-400 text-sm text-center py-6">No saved addresses found.</p>
            ) : (
              <div className="bg-green-50/40 border border-green-100/50 p-4 rounded-2xl">
                <p className="font-bold text-gray-800 text-sm">{primaryAddress.name} <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-semibold ml-2">Default</span></p>
                <p className="text-xs text-gray-500 mt-1">{primaryAddress.addressLine1}</p>
                {primaryAddress.addressLine2 && <p className="text-xs text-gray-500">{primaryAddress.addressLine2}</p>}
                <p className="text-xs text-gray-500">{primaryAddress.city}, {primaryAddress.state} - {primaryAddress.postalCode}</p>
                <p className="text-xs text-gray-600 font-medium mt-2">📞 {primaryAddress.mobilenumber}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Need help with your account?</span>
            <Link to="/contact-us" className="text-green-600 hover:underline font-semibold">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, bg }) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition">
    <div className={`p-3 rounded-xl ${bg} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-xs font-semibold">{title}</p>
      <p className="text-lg font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);
