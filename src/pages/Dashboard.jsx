import { useEffect, useState } from "react";
import { Users, Briefcase, Calendar, CheckCircle, Clock, AlertTriangle, DollarSign, Activity, Loader } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import StatsCard from "../components/common/StatsCard";
import ChartCard from "../components/common/ChartCard";
import Badge from "../components/common/Badge";
import { adminService } from "../services/api";
import { fmtDate, fmtCurrency } from "../utils/helpers";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader size={36} className="animate-spin text-primary" />
    </div>
  );

  if (!data) return <p className="text-center text-red-500 py-20">Dashboard load nahi hua. Backend check karo.</p>;

  const { stats, recentBookings, recentUsers, monthlyRevenue, monthlyUsers } = data;

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers?.toLocaleString(), color: "text-blue-600", bg: "bg-blue-50", trend: "Registered seekers" },
    { icon: Briefcase, label: "Total Providers", value: stats.totalProviders?.toLocaleString(), color: "text-purple-600", bg: "bg-purple-50", trend: `${stats.activeProviders} active` },
    { icon: Clock, label: "Pending Approvals", value: stats.pendingProviders, color: "text-amber-600", bg: "bg-amber-50", trend: "Needs review", trendUp: false },
    { icon: Calendar, label: "Total Bookings", value: stats.totalBookings?.toLocaleString(), color: "text-primary", bg: "bg-primary-50", trend: "All time" },
    { icon: CheckCircle, label: "Completed Projects", value: stats.completedBookings?.toLocaleString(), color: "text-green-600", bg: "bg-green-50", trend: "Successfully done", trendUp: true },
    { icon: Activity, label: "Active Providers", value: stats.activeProviders, color: "text-teal-600", bg: "bg-teal-50", trend: "Not blocked" },
    { icon: DollarSign, label: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Completed bookings", trendUp: true },
    { icon: AlertTriangle, label: "Open Reports", value: stats.openReports, color: "text-red-600", bg: "bg-red-50", trend: "Needs attention", trendUp: false },
  ];

  // Format monthly revenue for chart
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revenueChartData = (monthlyRevenue || []).map(d => ({
    month: MONTHS[d._id.month - 1],
    revenue: d.revenue,
    bookings: d.bookings,
  }));

  // Format monthly users for chart
  const userChartMap = {};
  (monthlyUsers || []).forEach(d => {
    const key = `${MONTHS[d._id.month - 1]} ${d._id.year}`;
    if (!userChartMap[key]) userChartMap[key] = { month: MONTHS[d._id.month - 1], seekers: 0, providers: 0 };
    if (d._id.role === "skillSeeker") userChartMap[key].seekers = d.count;
    if (d._id.role === "skillProvider") userChartMap[key].providers = d.count;
  });
  const userChartData = Object.values(userChartMap);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Overview" subtitle="Monthly revenue — last 12 months">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString("en-IN")}`, ""]} contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#rev)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Monthly Bookings" subtitle="Bookings per month">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChartData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Bar dataKey="bookings" fill="#2563EB" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* User Growth Chart */}
      {userChartData.length > 0 && (
        <ChartCard title="User Growth" subtitle="Seekers vs Providers — monthly">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="seekers" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Seekers" />
              <Line type="monotone" dataKey="providers" stroke="#8B5CF6" strokeWidth={2.5} dot={false} name="Providers" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Latest Users</h3>
            <a href="/users" className="text-sm text-primary font-semibold hover:underline">View All</a>
          </div>
          <div className="space-y-3">
            {(recentUsers || []).map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <img src={u.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <Badge status={u.isBlocked ? "Blocked" : "Active"} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Latest Bookings</h3>
            <a href="/bookings" className="text-sm text-primary font-semibold hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100">
                <th className="th">Seeker</th><th className="th">Provider</th><th className="th">Skill</th><th className="th">Amount</th><th className="th">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {(recentBookings || []).map(b => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={b.seeker?.avatar || "https://i.pravatar.cc/150"} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-medium text-sm">{b.seeker?.name}</span>
                      </div>
                    </td>
                    <td className="td text-gray-500 text-sm">{b.provider?.name}</td>
                    <td className="td text-gray-500 text-sm">{b.skill?.title || "—"}</td>
                    <td className="td font-bold text-green-600">₹{b.amount?.toLocaleString("en-IN")}</td>
                    <td className="td"><Badge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
