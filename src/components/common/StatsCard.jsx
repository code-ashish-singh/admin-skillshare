import { TrendingUp, TrendingDown } from "lucide-react";
export default function StatsCard({ icon: Icon, label, value, color="text-primary", bg="bg-primary-50", trend, trendUp=true, suffix="" }) {
  return (
    <div className="card flex items-center gap-4 hover:shadow-lg transition-all duration-200">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color}/>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}{suffix}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-0.5 text-xs font-semibold ${trendUp?"text-green-500":"text-red-500"}`}>
            {trendUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}{trend}
          </div>
        )}
      </div>
    </div>
  );
}
