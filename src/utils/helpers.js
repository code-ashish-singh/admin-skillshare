export const fmt = (n) => n?.toLocaleString() || "0";
export const fmtCurrency = (n) => `$${(n || 0).toLocaleString()}`;
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "-";
export const truncate = (t, n=80) => t?.length > n ? t.slice(0,n)+"..." : t;

export const statusColors = {
  Active:"bg-green-50 text-green-600",
  Blocked:"bg-red-50 text-red-600",
  Suspended:"bg-orange-50 text-orange-600",
  Pending:"bg-amber-50 text-amber-600",
  Completed:"bg-green-50 text-green-600",
  Ongoing:"bg-blue-50 text-blue-600",
  Cancelled:"bg-red-50 text-red-600",
  Visible:"bg-green-50 text-green-600",
  Hidden:"bg-gray-100 text-gray-500",
  Published:"bg-green-50 text-green-600",
  Draft:"bg-gray-100 text-gray-500",
  Open:"bg-red-50 text-red-600",
  "Under Review":"bg-amber-50 text-amber-600",
  Resolved:"bg-green-50 text-green-600",
  Closed:"bg-gray-100 text-gray-500",
  Verified:"bg-green-50 text-green-600",
};
