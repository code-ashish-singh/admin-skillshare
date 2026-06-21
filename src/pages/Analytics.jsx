import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, Users, TrendingUp, Activity, Star, Briefcase } from "lucide-react";
import ChartCard from "../components/common/ChartCard";
import StatsCard from "../components/common/StatsCard";
import { revenueData, userGrowthData, bookingStatusData, skillsData, topProviders } from "../data/analytics";
import { fmtCurrency } from "../utils/helpers";

export default function Analytics() {
  const totalRevenue = revenueData.reduce((a,b)=>a+b.revenue,0);
  const totalBookings = revenueData.reduce((a,b)=>a+b.bookings,0);
  const avgBookingValue = Math.round(totalRevenue/totalBookings);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={DollarSign} label="Total Revenue" value={fmtCurrency(totalRevenue)} color="text-green-600" bg="bg-green-50" trend="+9.3% vs last year" trendUp/>
        <StatsCard icon={Activity} label="Avg Booking Value" value={fmtCurrency(avgBookingValue)} color="text-blue-600" bg="bg-blue-50" trend="+4.1% this month" trendUp/>
        <StatsCard icon={Users} label="Active Users" value="1,240" color="text-purple-600" bg="bg-purple-50" trend="+14.5% this month" trendUp/>
        <StatsCard icon={TrendingUp} label="Platform Growth" value="38.4%" color="text-primary" bg="bg-primary-50" trend="Year over year" trendUp/>
      </div>

      {/* Revenue + Bookings Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Analytics" subtitle="Monthly revenue vs target — full year">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="tarA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                <Tooltip formatter={(v,n)=>[`$${v.toLocaleString()}`,n]} contentStyle={{borderRadius:"12px",border:"1px solid #E2E8F0",fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:12}}/>
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revA)" name="Revenue"/>
                <Area type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} fill="url(#tarA)" strokeDasharray="4 4" name="Target"/>
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Booking Distribution" subtitle="By current status">
            <div className="flex justify-center mb-4">
              <PieChart width={160} height={160}>
                <Pie data={bookingStatusData} cx={75} cy={75} innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {bookingStatusData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip formatter={(v,n)=>[v,n]} contentStyle={{borderRadius:"10px",fontSize:12}}/>
              </PieChart>
            </div>
            <div className="space-y-2">
              {bookingStatusData.map(item=>(
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:item.color}}/><span className="text-gray-600">{item.name}</span></div>
                  <span className="font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* User & Provider Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Growth" subtitle="Seekers vs Providers — monthly">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #E2E8F0",fontSize:12}}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Line type="monotone" dataKey="seekers" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Seekers"/>
              <Line type="monotone" dataKey="providers" stroke="#8B5CF6" strokeWidth={2.5} dot={false} name="Providers"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Popular Skills" subtitle="Bookings by skill category">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={skillsData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="skill" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} width={60}/>
              <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #E2E8F0",fontSize:12}}/>
              <Bar dataKey="bookings" fill="#2563EB" radius={[0,6,6,0]} name="Bookings"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Monthly Bookings Bar */}
      <ChartCard title="Monthly Booking Analytics" subtitle="Total bookings per month — full year">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #E2E8F0",fontSize:12}}/>
            <Bar dataKey="bookings" name="Bookings" radius={[6,6,0,0]}>
              {revenueData.map((_,i)=><Cell key={i} fill={`hsl(${217 + i*3}, ${80-i*2}%, ${50+i}%)`}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top Providers */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="font-bold text-gray-800">Top Performing Providers</h3><p className="text-xs text-gray-400 mt-0.5">Ranked by total earnings</p></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="th">#</th><th className="th">Provider</th><th className="th">Skill</th><th className="th">Bookings</th><th className="th">Rating</th><th className="th">Earnings</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {topProviders.map((p,i)=>(
                <tr key={p.name} className="hover:bg-gray-50/50">
                  <td className="td"><span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i===0?"bg-amber-400 text-white":i===1?"bg-gray-300 text-gray-700":i===2?"bg-amber-600 text-white":"bg-gray-100 text-gray-500"}`}>{i+1}</span></td>
                  <td className="td font-semibold text-gray-800">{p.name}</td>
                  <td className="td"><span className="badge bg-primary-50 text-primary">{p.skill}</span></td>
                  <td className="td font-bold text-gray-700">{p.bookings}</td>
                  <td className="td"><div className="flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400"/><span className="font-bold text-gray-700">{p.rating}</span></div></td>
                  <td className="td font-bold text-green-600 text-base">{fmtCurrency(p.earnings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
