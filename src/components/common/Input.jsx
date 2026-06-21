export default function Input({ label, error, icon: Icon, className="", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input className={`input ${Icon ? "pl-10" : ""} ${error ? "border-red-400" : ""}`} {...props} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
