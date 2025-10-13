import React from "react";
import { User, Package, ShoppingCart, DollarSign } from "lucide-react"; // icons

export default function DashboardCards({ data }) {
  const colors = [
    "from-purple-500 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-500",
    "from-pink-500 to-red-500",
  ];

  const icons = [<User size={24} />, <Package size={24} />, <ShoppingCart size={24} />, <DollarSign size={24} />];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {data.map((item, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-r ${colors[idx]} text-white shadow-lg rounded-xl p-5 transform hover:scale-105 transition duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            {icons[idx]}
          </div>
          <p className="text-3xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
