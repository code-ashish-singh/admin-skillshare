import { useState, useEffect, useCallback } from "react";
import { Eye, Loader } from "lucide-react";
import { adminService } from "../services/api";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import { fmtDate, fmtCurrency } from "../utils/helpers";

const statuses = ["All", "Pending", "Accepted", "Completed", "Cancelled"];
const STATUS_COLORS = {
  Pending: "text-amber-600 bg-amber-50",
  Accepted: "text-blue-600 bg-blue-50",
  Completed: "text-green-600 bg-green-50",
  Cancelled: "text-red-600 bg-red-50",
};

export default function Bookings() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusF !== "All") params.status = statusF;
      const res = await adminService.getBookings(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusF]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Client-side search on loaded data
  const filtered = data.filter(b =>
    !search ||
    b.seeker?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.provider?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b._id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statuses.slice(1).map(s => {
          const cnt = data.filter(b => b.status === s).length;
          const [tc, bg] = STATUS_COLORS[s].split(" ");
          return (
            <div key={s} className={`card ${bg} border-0 text-center py-4 cursor-pointer`} onClick={() => { setStatusF(s); setPage(1); }}>
              <p className={`text-2xl font-bold ${tc}`}>{cnt}</p>
              <p className="text-sm text-gray-600 mt-1">{s}</p>
            </div>
          );
        })}
      </div>

      <div className="card p-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="Search bookings..." className="flex-1 max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => { setStatusF(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusF === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader size={28} className="animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? <EmptyState /> : (
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="th">Booking ID</th><th className="th">Seeker</th><th className="th">Provider</th><th className="th">Skill</th><th className="th">Plan</th><th className="th">Amount</th><th className="th">Date</th><th className="th">Status</th><th className="th">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="td font-mono text-xs text-gray-400">{b._id?.slice(-8).toUpperCase()}</td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={b.seeker?.avatar || "https://i.pravatar.cc/150"} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-medium text-gray-800">{b.seeker?.name}</span>
                      </div>
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={b.provider?.avatar || "https://i.pravatar.cc/150"} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-gray-600">{b.provider?.name}</span>
                      </div>
                    </td>
                    <td className="td text-gray-500 text-xs">{b.skill?.title || "—"}</td>
                    <td className="td"><span className="badge bg-gray-100 text-gray-600">{b.plan?.name || "—"}</span></td>
                    <td className="td font-bold text-green-600">{fmtCurrency(b.amount)}</td>
                    <td className="td text-gray-500">{fmtDate(b.createdAt)}</td>
                    <td className="td"><Badge status={b.status} /></td>
                    <td className="td">
                      <button onClick={() => setSelected(b)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all"><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 pb-5">
          <Pagination page={pagination.page} total={pagination.total} perPage={8} onChange={p => setPage(p)} />
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Booking Details">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-400">{selected._id}</span>
              <Badge status={selected.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Seeker</p>
                <div className="flex items-center gap-2">
                  <img src={selected.seeker?.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full" />
                  <div><p className="font-semibold text-gray-800">{selected.seeker?.name}</p><p className="text-xs text-gray-400">{selected.seeker?.email}</p></div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Provider</p>
                <div className="flex items-center gap-2">
                  <img src={selected.provider?.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full" />
                  <div><p className="font-semibold text-gray-800">{selected.provider?.name}</p><p className="text-xs text-gray-400">{selected.provider?.email}</p></div>
                </div>
              </div>
            </div>
            {[["Skill", selected.skill?.title || "—"], ["Plan", selected.plan?.name || "—"], ["Amount", fmtCurrency(selected.amount)], ["Booked On", fmtDate(selected.createdAt)], ["Requirements", selected.requirements || "None"]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                <span className="text-gray-500">{l}</span><span className="font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
