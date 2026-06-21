import { useState, useEffect, useCallback } from "react";
import { Eye, CheckCircle, XCircle, Trash2, Loader } from "lucide-react";
import { adminService } from "../services/api";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { fmtDate } from "../utils/helpers";

const statuses = ["All", "Open", "Under Review", "Resolved", "Closed"];
const STATUS_COLORS = {
  Open: "text-red-600 bg-red-50",
  "Under Review": "text-amber-600 bg-amber-50",
  Resolved: "text-green-600 bg-green-50",
  Closed: "text-gray-600 bg-gray-100",
};

export default function Reports() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusF !== "All") params.status = statusF;
      const res = await adminService.getReports(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusF]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const filtered = data.filter(r =>
    !search ||
    r.reporter?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.reportedProvider?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.reason?.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id, status, adminNotes = "") => {
    try {
      await adminService.updateReport(id, { status, adminNotes });
      fetchReports();
      setSelected(null);
    } catch { alert("Update failed."); }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteReport(id);
      fetchReports();
    } catch { alert("Delete failed."); }
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statuses.slice(1).map(s => {
          const cnt = data.filter(r => r.status === s).length;
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search reports..." className="flex-1 max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => { setStatusF(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusF === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader size={28} className="animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? <EmptyState icon="📋" title="No reports found" /> : (
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="th">Reported By</th><th className="th">Against Provider</th><th className="th">Reason</th><th className="th">Date</th><th className="th">Status</th><th className="th">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={r.reporter?.avatar || "https://i.pravatar.cc/150"} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-medium text-gray-800">{r.reporter?.name}</span>
                      </div>
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <img src={r.reportedProvider?.avatar || "https://i.pravatar.cc/150"} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-gray-600">{r.reportedProvider?.name}</span>
                      </div>
                    </td>
                    <td className="td"><span className="badge bg-red-50 text-red-600">{r.reason}</span></td>
                    <td className="td text-gray-400 text-xs">{fmtDate(r.createdAt)}</td>
                    <td className="td"><Badge status={r.status} /></td>
                    <td className="td">
                      <div className="flex gap-1">
                        <button onClick={() => setSelected(r)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all" title="View"><Eye size={15} /></button>
                        {(r.status === "Open" || r.status === "Under Review") && (
                          <button onClick={() => setConfirm({ id: r._id, type: "resolve" })} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all" title="Resolve"><CheckCircle size={15} /></button>
                        )}
                        {r.status !== "Closed" && (
                          <button onClick={() => setConfirm({ id: r._id, type: "close" })} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="Close"><XCircle size={15} /></button>
                        )}
                        <button onClick={() => setConfirm({ id: r._id, type: "delete" })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={15} /></button>
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

      {/* Report Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Report Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-400">{selected._id?.slice(-10).toUpperCase()}</span>
              <Badge status={selected.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Reported By</p>
                <div className="flex items-center gap-2">
                  <img src={selected.reporter?.avatar || "https://i.pravatar.cc/150"} className="w-9 h-9 rounded-full" />
                  <div><p className="font-semibold text-gray-800">{selected.reporter?.name}</p><p className="text-xs text-gray-400">{selected.reporter?.email}</p></div>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Against Provider</p>
                <div className="flex items-center gap-2">
                  <img src={selected.reportedProvider?.avatar || "https://i.pravatar.cc/150"} className="w-9 h-9 rounded-full" />
                  <div><p className="font-semibold text-gray-800">{selected.reportedProvider?.name}</p><p className="text-xs text-gray-400">{selected.reportedProvider?.email}</p></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reason</p>
              <p className="font-semibold text-gray-800">{selected.reason}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
            </div>
            {selected.adminNotes && (
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Admin Notes</p>
                <p className="text-sm text-gray-700">{selected.adminNotes}</p>
              </div>
            )}
            <p className="text-xs text-gray-400">Filed on {fmtDate(selected.createdAt)}</p>
            {(selected.status === "Open" || selected.status === "Under Review") && (
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button onClick={() => updateStatus(selected._id, "Resolved")} className="btn-primary flex-1">Mark Resolved</button>
                <button onClick={() => updateStatus(selected._id, "Closed")} className="btn-ghost flex-1 border border-gray-200">Close Report</button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => { if (confirm.type === "delete") handleDelete(confirm.id); else updateStatus(confirm.id, confirm.type === "resolve" ? "Resolved" : "Closed"); setConfirm(null); }}
        title={confirm?.type === "delete" ? "Delete Report" : confirm?.type === "resolve" ? "Resolve Report" : "Close Report"}
        message={confirm?.type === "delete" ? "Report permanently delete ho jaayega." : confirm?.type === "resolve" ? "Report resolved mark ho jaayega." : "Report close ho jaayega."}
        confirmLabel={confirm?.type === "delete" ? "Delete" : confirm?.type === "resolve" ? "Resolve" : "Close"}
        danger={confirm?.type === "delete"}
      />
    </div>
  );
}
