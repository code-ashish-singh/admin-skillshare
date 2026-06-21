import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard":"Dashboard", "/users":"User Management", "/providers":"Provider Management",
  "/bookings":"Booking Management", "/reviews":"Review Management", "/blogs":"Blog Management",
  "/reports":"Reports & Complaints", "/analytics":"Analytics", "/settings":"Settings",
};

export default function Navbar({ onMenuClick }) {
  const { admin } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"><Menu size={20}/></button>
        <div>
          <h1 className="font-bold text-gray-800 text-lg leading-none">{title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">SkillShare Super Admin</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input placeholder="Search anything..." className="input pl-9 h-9 w-52 text-sm bg-gray-50 border-gray-200"/>
        </div>
        <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell size={20}/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <img src={admin?.avatar} alt={admin?.name} className="w-8 h-8 rounded-xl object-cover"/>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">{admin?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
