import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, Users, TrendingUp, Activity, Star, Loader } from "lucide-react";
import ChartCard from "../components/common/ChartCard";
import StatsCard from "../components/common/StatsCard";
import { adminService } from "../services/api";
import { fmtCurrency } from "../utils/helpers";

const COLORS = ["#2563EB", "#22c55e", "#f59e0b", "#ef4444"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(res => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader size={36} className="animate-spin text-primary" />
    </div>
  );

  if (!data) return <p className="text-center text-red-500 py-20">Analytics load nahi hua.</p>;

  const { totalRevenue, totalCompletedBookings, avgBookingValue, bookingsByStatus, topProviders, skillsByCategory } = data;

  const pieData = (bookingsByStatus || []).map((b, i) => ({
    name: b._id,
    value: b.count,
    color: COLORS[i % COLORS.length],
  }));

  const skillsChart = (skillsByCategory || []).slice(0, 6).map(s => ({
    skill: s._id,
    bookings: s.bookings,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={DollarSign} label="Total Revenue" value={`₹${(totalRevenue || 0).toLocaleString("en-IN")}`} color="text-green-600" bg="bg-green-50" trend="Completed bookings" trendUp />
        <StatsCard icon={Activity} label="Avg Booking Value" value={`₹${(avgBookingValue || 0).toLocaleString("en-IN")}`} color="text-blue-600" bg="bg-blue-50" trend="Per booking" trendUp />
        <StatsCard icon={Users} label="Completed Bookings" value={totalCompletedBookings || 0} color="text-purple-600" bg="bg-purple-50" trend="Successfully done" trendUp />
        <StatsCard icon={TrendingUp} label="Total Categories" value={skillsByCategory?.length || 0} color="text-primary" bg="bg-primary-50" trend="Active categories" trendUp />
      </div>

      {/* Revenue + Booking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Skills by Category" subtitle="Completed projects per category">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={skillsChart} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Bar dataKey="bookings" fill="#2563EB" radius={[0, 6, 6, 0]} name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Booking Distribution" subtitle="By current status">
            {pieData.length > 0 ? (
              <>
                <div className="flex justify-center mb-4">
                  <PieChart width={160} height={160}>
                    <Pie data={pieData} cx={75} cy={75} innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
                  </PieChart>
                </div>
                <div className="space-y-2">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p className="text-center text-gray-400 py-8">No bookings yet.</p>}
          </ChartCard>
        </div>
      </div>

      {/* Top Providers */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-800">Top Performing Providers</h3>
            <p className="text-xs text-gray-400 mt-0.5">Ranked by total earnings</p>
          </div>
        </div>
        {topProviders?.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100">
                <th className="th">#</th><th className="th">Provider</th><th className="th">Completed</th><th className="th">Rating</th><th className="th">Earnings</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {(topProviders || []).map((p, i) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="td">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={p.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-semibold text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="td font-bold text-gray-700">{p.providerProfile?.completedProjects || 0}</td>
                    <td className="td">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-700">{(p.providerProfile?.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="td font-bold text-green-600">{fmtCurrency(p.providerProfile?.totalEarnings || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
