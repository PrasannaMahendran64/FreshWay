import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCards from "./Component/DashboardCards";
import Charts from "./Component/Charts";
import { RefreshCcw, Calendar } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Users", value: 0 },
    { title: "Products", value: 0 },
    { title: "Orders", value: 0 },
    { title: "Revenue", value: 0 },
  ]);

  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("monthly");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/dashboard-stats?range=${range}`);
      const { summary, salesTrend } = res.data;

      setStats([
        { title: "Users", value: summary.totalUsers },
        { title: "Products", value: summary.totalProducts },
        { title: "Orders", value: summary.totalOrders },
        { title: "Revenue", value: summary.totalRevenue },
      ]);

      setChartData(salesTrend || []);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
          <p className="text-gray-400 text-xs mt-1">Real-time statistics & business insights.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Range Selector */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {["daily", "weekly", "monthly", "yearly"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  range === r
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <DashboardCards data={stats} />
      
      <div className="mt-10 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-green-600" /> Sales Trend ({range} range)
        </h3>
        <Charts data={chartData} />
      </div>
    </div>
  );
}
