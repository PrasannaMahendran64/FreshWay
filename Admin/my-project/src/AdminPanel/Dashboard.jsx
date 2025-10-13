import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import DashboardCards from "./Component/DashboardCards";
import Charts from "./Component/Charts";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Users", value: 0 },
    { title: "Products", value: 0 },
    { title: "Orders", value: 0 },
    { title: "Revenue", value: 0 },
  ]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const users = await axios.get("http://localhost:4000/get-users");
      const products = await axios.get("http://localhost:4000/get-product");
      const orders = await axios.get("http://localhost:4000/get-orders");

      const revenue = orders.data.data?.reduce((acc, o) => acc + o.totalPrice, 0);

      setStats([
        { title: "Users", value: users.data.length },
        { title: "Products", value: products.data.data.length },
        { title: "Orders", value: orders.data.data.length },
        { title: "Revenue", value: revenue || 0 },
      ]);

      // Format chart data (group by day)
      const grouped = {};
      orders.data.data.forEach(order => {
        const date = dayjs(order.createdAt).format("YYYY-MM-DD");
        if (!grouped[date]) grouped[date] = { date, orders: 0, revenue: 0 };
        grouped[date].orders += 1;
        grouped[date].revenue += order.totalPrice;
      });

      setChartData(Object.values(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Dashboard</h1>
      <DashboardCards data={stats} />
      <div className="mt-10">
        <Charts data={chartData} />
      </div>
    </div>
  );
}
