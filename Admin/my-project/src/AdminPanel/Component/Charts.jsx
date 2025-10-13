import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Charts({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="font-semibold">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-6 text-gray-700">Revenue & Orders Trend</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontWeight: 500 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5, stroke: "#6366f1", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 7 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 5, stroke: "#f59e0b", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 7 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
