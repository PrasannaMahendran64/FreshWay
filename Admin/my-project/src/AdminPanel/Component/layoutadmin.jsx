import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiGrid,
  FiStar,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

export default function Layoutadmin() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiBarChart2 />, path: "/dashboard" },
    { name: "Users", icon: <FiUsers />, path: "/dashboard/users" },
    { name: "Products", icon: <FiBox />, path: "/dashboard/products" },
    { name: "Orders", icon: <FiShoppingCart />, path: "/dashboard/orders" },
    { name: "Categories", icon: <FiGrid />, path: "/dashboard/categories" },
    { name: "Reviews", icon: <FiStar />, path: "/dashboard/reviews" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          open ? "w-64" : "w-16"
        } overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span
            className={`font-bold text-xl text-green-600 transition-all duration-300 ${
              !open && "scale-0"
            }`}
          >
            Admin
          </span>
          <button
            onClick={() => setOpen(!open)}
            className={`text-gray-500 focus:outline-none text-2xl font-bold transform transition-transform duration-300 ${
              open ? "" : "rotate-180"
            }`}
          >
            ☰
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="mt-4 flex-1">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center p-4 mb-2 rounded-lg transition-all duration-300 group relative ${
                location.pathname === item.path
                  ? "bg-green-100 text-green-700 font-semibold shadow"
                  : "hover:bg-green-50 text-green-700"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span
                className={`ml-3 transition-all duration-300 ${
                  !open && "hidden"
                }`}
              >
                {item.name}
              </span>

              {/* Tooltip for collapsed sidebar */}
              {!open && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <Link
          className={`flex items-center p-4 mb-4 rounded-lg transition-all duration-300 hover:bg-green-50 text-red-700 group relative`}
          to="/"
        >
          <FiLogOut size={20} />
          <span className={`ml-3 ${!open && "hidden"}`}>Logout</span>

          {!open && (
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity duration-300">
              Logout
            </span>
          )}
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
