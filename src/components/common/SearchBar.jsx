import { Search } from "lucide-react";
export default function SearchBar({ value, onChange, placeholder="Search...", className="" }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input pl-10 h-10 w-full" />
    </div>
  );
}
