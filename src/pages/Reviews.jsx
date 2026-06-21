import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Trash2, Star, Loader } from "lucide-react";
import { adminService } from "../services/api";
import Badge from "../components/common/Badge";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { fmtDate } from "../utils/helpers";

export default function Reviews() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusF === "Hidden") params.status = "hidden";
      else if (statusF === "Visible") params.status = "visible";
      const res = await adminService.getReviews(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusF]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const filtered = data.filter(r =>
    !search ||
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.provider?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (id) => {
    try {
      await adminService.toggleReview(id);
      fetchReviews();
    } catch { alert("Action failed."); }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteReview(id);
      fetchReviews();
    } catch { alert("Delete failed."); }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          ["Total Reviews", pagination.total, "text-primary", "bg-primary-50"],
          ["Visible", data.filter(r => !r.adminHidden).length, "text-green-600", "bg-green-50"],
          ["Hidden", data.filter(r => r.adminHidden).length, "text-gray-600", "bg-gray-100"],
        ].map(([l, v, tc, bg]) => (
          <div key={l} className={`card ${bg} border-0 text-center py-4`}>
            <p className={`text-2xl font-bold ${tc}`}>{v}</p>
            <p className="text-sm text-gray-600 mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reviews..." className="flex-1 max-w-xs" />
          <div className="flex gap-2">
            {["All", "Visible", "Hidden"].map(s => (
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
                <th className="th">User</th><th className="th">Provider</th><th className="th">Rating</th><th className="th">Comment</th><th className="th">Date</th><th className="th">Status</th><th className="th">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={r.user?.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-semibold text-gray-800">{r.user?.name}</span>
                      </div>
                    </td>
                    <td className="td text-gray-600">{r.provider?.name}</td>
                    <td className="td">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />)}
                      </div>
                    </td>
                    <td className="td text-gray-500 max-w-[200px]"><p className="truncate text-xs">{r.comment}</p></td>
                    <td className="td text-gray-400 text-xs">{fmtDate(r.createdAt)}</td>
                    <td className="td"><Badge status={r.adminHidden ? "Hidden" : "Visible"} /></td>
                    <td className="td">
                      <div className="flex gap-1">
                        <button onClick={() => setConfirm({ id: r._id, type: "toggle", isHidden: r.adminHidden })} className={`p-1.5 rounded-lg transition-all ${!r.adminHidden ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50" : "text-green-500 hover:bg-green-50"}`}>
                          {!r.adminHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button onClick={() => setConfirm({ id: r._id, type: "delete" })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
                      </div>
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

      <ConfirmDialog
        isOpen={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => { if (confirm.type === "delete") handleDelete(confirm.id); else handleToggle(confirm.id); setConfirm(null); }}
        title={confirm?.type === "delete" ? "Delete Review" : confirm?.isHidden ? "Restore Review" : "Hide Review"}
        message={confirm?.type === "delete" ? "Review permanently delete ho jaayegi." : confirm?.isHidden ? "Review visible ho jaayegi." : "Review platform se hide ho jaayegi."}
        confirmLabel={confirm?.type === "delete" ? "Delete" : confirm?.isHidden ? "Restore" : "Hide"}
        danger={confirm?.type === "delete"}
      />
    </div>
  );
}
