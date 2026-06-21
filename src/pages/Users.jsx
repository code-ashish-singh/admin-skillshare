import { useState, useEffect, useCallback } from "react";
import { Eye, ShieldOff, ShieldCheck, Trash2, Loader } from "lucide-react";
import { adminService } from "../services/api";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { fmtDate } from "../utils/helpers";

export default function Users() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (statusFilter === "Blocked") params.status = "blocked";
      else if (statusFilter === "Active") params.status = "active";
      const res = await adminService.getUsers(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const delay = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(delay);
  }, [fetchUsers]);

  const toggleBlock = async (user) => {
    try {
      await adminService.blockUser(user._id);
      fetchUsers();
    } catch { alert("Action failed."); }
  };

  const deleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      fetchUsers();
    } catch { alert("Delete failed."); }
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          ["Total Users", pagination.total, "bg-blue-50 text-blue-600"],
          ["Active", data.filter(u => !u.isBlocked).length, "bg-green-50 text-green-600"],
          ["Blocked", data.filter(u => u.isBlocked).length, "bg-red-50 text-red-600"],
        ].map(([l, v, c]) => (
          <div key={l} className={`card text-center py-4 ${c.split(" ")[0]} border-0`}>
            <p className={`text-2xl font-bold ${c.split(" ")[1]}`}>{v}</p>
            <p className="text-sm text-gray-600 mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search users..." className="flex-1 max-w-xs" />
          <div className="flex gap-2">
            {["All", "Active", "Blocked"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader size={28} className="animate-spin text-primary" /></div>
          ) : data.length === 0 ? <EmptyState /> : (
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="th">User</th><th className="th">Email</th><th className="th">Join Date</th><th className="th">Location</th><th className="th">Status</th><th className="th">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar || "https://i.pravatar.cc/150"} className="w-9 h-9 rounded-xl object-cover" />
                        <div><p className="font-semibold text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.phone || "—"}</p></div>
                      </div>
                    </td>
                    <td className="td text-gray-500">{u.email}</td>
                    <td className="td text-gray-500">{fmtDate(u.createdAt)}</td>
                    <td className="td text-gray-500">{u.location || "—"}</td>
                    <td className="td"><Badge status={u.isBlocked ? "Blocked" : "Active"} /></td>
                    <td className="td">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(u)} title="View" className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all"><Eye size={15} /></button>
                        <button onClick={() => setConfirm({ id: u._id, type: "block", isBlocked: u.isBlocked })} className={`p-1.5 rounded-lg transition-all ${!u.isBlocked ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50" : "text-amber-500 hover:bg-amber-50"}`}>
                          {!u.isBlocked ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                        </button>
                        <button onClick={() => setConfirm({ id: u._id, type: "delete" })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
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

      {/* User Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="User Details">
        {selected && (
          <div>
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
              <img src={selected.avatar || "https://i.pravatar.cc/150"} className="w-16 h-16 rounded-2xl object-cover" />
              <div><h3 className="font-bold text-gray-900 text-lg">{selected.name}</h3><p className="text-gray-500">{selected.email}</p><Badge status={selected.isBlocked ? "Blocked" : "Active"} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["Phone", selected.phone || "—"], ["Location", selected.location || "—"], ["Join Date", fmtDate(selected.createdAt)], ["Bio", selected.bio || "—"], ["Verified", selected.isVerified ? "Yes" : "No"], ["Status", selected.isBlocked ? "Blocked" : "Active"]].map(([l, v]) => (
                <div key={l} className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 font-medium">{l}</p><p className="text-sm font-semibold text-gray-800 mt-0.5">{v}</p></div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => { if (confirm?.type === "delete") deleteUser(confirm.id); else toggleBlock({ _id: confirm.id, isBlocked: confirm.isBlocked }); setConfirm(null); }}
        title={confirm?.type === "delete" ? "Delete User" : confirm?.isBlocked ? "Unblock User" : "Block User"}
        message={confirm?.type === "delete" ? "User permanently delete ho jaayega." : confirm?.isBlocked ? "User ko restore kiya jaayega." : "User ko platform se block kiya jaayega."}
        confirmLabel={confirm?.type === "delete" ? "Delete" : confirm?.isBlocked ? "Unblock" : "Block"}
        danger={confirm?.type === "delete"}
      />
    </div>
  );
}
