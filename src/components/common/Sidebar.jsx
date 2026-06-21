import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, Calendar, Star, BookOpen, BarChart2, PieChart, Settings, LogOut, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const nav = [
  { to:"/dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { to:"/users", icon:Users, label:"Users" },
  { to:"/providers", icon:Briefcase, label:"Providers" },
  { to:"/bookings", icon:Calendar, label:"Bookings" },
  { to:"/reviews", icon:Star, label:"Reviews" },
  { to:"/blogs", icon:BookOpen, label:"Blogs" },
  { to:"/reports", icon:BarChart2, label:"Reports" },
  { to:"/analytics", icon:PieChart, label:"Analytics" },
  { to:"/settings", icon:Settings, label:"Settings" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className={`${collapsed?"w-16":"w-64"} bg-white border-r border-gray-100 min-h-screen flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed?"justify-center":"justify-between"} p-4 border-b border-gray-100 h-16`}>
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0"><Zap size={14} className="text-white"/></div>
            <span className="tracking-tight">SkillShare</span>
          </div>
        )}
        {collapsed && <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><Zap size={14} className="text-white"/></div>}
        <button onClick={() => setCollapsed(!collapsed)} className={`p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors ${collapsed?"hidden":""}`}>
          <ChevronLeft size={18}/>
        </button>
      </div>

      {/* Admin info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={admin?.avatar} alt={admin?.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0"/>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{admin?.name}</p>
              <p className="text-xs text-primary font-medium">Super Admin</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed?"justify-center":""}
              ${isActive ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"}`
            }>
            <Icon size={18} className="flex-shrink-0"/>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mb-2 p-2 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronRight size={18}/></button>
      )}

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full ${collapsed?"justify-center":""}`}>
          <LogOut size={18} className="flex-shrink-0"/>
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
