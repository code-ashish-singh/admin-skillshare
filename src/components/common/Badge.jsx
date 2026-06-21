import { statusColors } from "../../utils/helpers";
export default function Badge({ status }) {
  return <span className={`badge ${statusColors[status] || "bg-gray-100 text-gray-500"}`}>{status}</span>;
}
