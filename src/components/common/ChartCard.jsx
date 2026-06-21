export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div><h3 className="font-bold text-gray-800">{title}</h3>{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}</div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
