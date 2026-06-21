import { useState, useEffect, useCallback } from "react";
import { Eye, CheckCircle, XCircle, ShieldOff, ShieldCheck, Trash2, Star, Loader } from "lucide-react";
import { adminService } from "../services/api";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { fmtDate, fmtCurrency } from "../utils/helpers";

const verifications = ["All", "Verified", "Pending", "Rejected"];

export default function Providers() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [verifyF, setVerifyF] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (statusF === "Blocked") params.status = "blocked";
      else if (statusF === "Active") params.status = "active";
      if (verifyF !== "All") params.verification = verifyF;
      const res = await adminService.getProviders(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusF, verifyF]);

  useEffect(() => {
    const delay = setTimeout(() => fetchProviders(), 300);
    return () => clearTimeout(delay);
  }, [fetchProviders]);

  const handleAction = async (type, provider) => {
    try {
      if (type === "approve") await adminService.approveProvider(provider._id);
      else if (type === "reject") await adminService.rejectProvider(provider._id);
      else if (type === "block") await adminService.blockProvider(provider._id);
      else if (type === "delete") await adminService.deleteProvider(provider._id);
      fetchProviders();
    } catch { alert("Action failed."); }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Total", pagination.total, "text-primary", "bg-primary-50"],
          ["Active", data.filter(p => !p.isBlocked).length, "text-green-600", "bg-green-50"],
          ["Blocked", data.filter(p => p.isBlocked).length, "text-red-600", "bg-red-50"],
          ["Pending Verify", data.filter(p => p.providerProfile?.verificationStatus === "Pending").length, "text-amber-600", "bg-amber-50"],
        ].map(([l, v, tc, bg]) => (
          <div key={l} className={`card ${bg} border-0 text-center py-4`}><p className={`text-2xl font-bold ${tc}`}>{v}</p><p className="text-sm text-gray-600 mt-1">{l}</p></div>
        ))}
      </div>

      <div className="card p-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search providers..." className="flex-1 max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            {["All", "Active", "Blocked"].map(s => (
              <button key={s} onClick={() => { setStatusF(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusF === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
            ))}
            <div className="w-px bg-gray-200" />
            {verifications.map(v => (
              <button key={v} onClick={() => { setVerifyF(v); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${verifyF === v ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{v}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader size={28} className="animate-spin text-primary" /></div>
          ) : data.length === 0 ? <EmptyState /> : (
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="th">Provider</th><th className="th">Rating</th><th className="th">Projects</th><th className="th">Earnings</th><th className="th">Status</th><th className="th">Verified</th><th className="th">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(p => {
                  const profile = p.providerProfile || {};
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/50">
                      <td className="td">
                        <div className="flex items-center gap-2.5">
                          <img src={p.avatar || "https://i.pravatar.cc/150"} className="w-9 h-9 rounded-xl object-cover" />
                          <div><p className="font-semibold text-gray-800">{p.name}</p><p className="text-xs text-gray-400">{p.location || "—"}</p></div>
                        </div>
                      </td>
                      <td className="td"><span className="flex items-center gap-1 font-bold text-amber-500"><Star size={13} fill="currentColor" />{profile.rating?.toFixed(1) || "0.0"}</span></td>
                      <td className="td font-semibold text-gray-800">{profile.completedProjects || 0}</td>
                      <td className="td font-bold text-green-600">{fmtCurrency(profile.totalEarnings || 0)}</td>
                      <td className="td"><Badge status={p.isBlocked ? "Blocked" : "Active"} /></td>
                      <td className="td"><Badge status={profile.verificationStatus || "Pending"} /></td>
                      <td className="td">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(p)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg" title="View"><Eye size={15} /></button>
                          {profile.verificationStatus === "Pending" && <>
                            <button onClick={() => setConfirm({ type: "approve", provider: p })} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle size={15} /></button>
                            <button onClick={() => setConfirm({ type: "reject", provider: p })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Reject"><XCircle size={15} /></button>
                          </>}
                          <button onClick={() => setConfirm({ type: "block", provider: p })} className={`p-1.5 rounded-lg transition-all ${!p.isBlocked ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50" : "text-amber-500 hover:bg-amber-50"}`} title={p.isBlocked ? "Unblock" : "Block"}>
                            {!p.isBlocked ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                          </button>
                          <button onClick={() => setConfirm({ type: "delete", provider: p })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 pb-5">
          <Pagination page={pagination.page} total={pagination.total} perPage={8} onChange={p => setPage(p)} />
        </div>
      </div>

      {/* Provider Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Provider Details" size="lg">
        {selected && (() => {
          const profile = selected.providerProfile || {};
          return (
            <div>
              <div className="flex items-start gap-4 mb-5 pb-5 border-b border-gray-100">
                <img src={selected.avatar || "https://i.pravatar.cc/150"} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                  <p className="text-sm text-gray-500 mt-1">{selected.bio || "No bio"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {[["Rating", `${profile.rating?.toFixed(1) || 0}★`], ["Reviews", profile.totalReviews || 0], ["Completed", profile.completedProjects || 0], ["Ongoing", profile.ongoingProjects || 0], ["Pending", profile.pendingProjects || 0], ["Earnings", fmtCurrency(profile.totalEarnings || 0)]].map(([l, v]) => (
                  <div key={l} className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">{l}</p><p className="text-base font-bold text-gray-800 mt-0.5">{v}</p></div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100 flex-wrap">
                <span className="badge bg-gray-100 text-gray-600">{selected.location || "—"}</span>
                <span className="badge bg-gray-100 text-gray-600">Joined {fmtDate(selected.createdAt)}</span>
                <Badge status={selected.isBlocked ? "Blocked" : "Active"} />
                <Badge status={profile.verificationStatus || "Pending"} />
              </div>
            </div>
          );
        })()}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => { handleAction(confirm.type, confirm.provider); setConfirm(null); }}
        title={confirm?.type === "approve" ? "Approve Provider" : confirm?.type === "reject" ? "Reject Provider" : confirm?.type === "delete" ? "Delete Provider" : confirm?.provider?.isBlocked ? "Unblock Provider" : "Block Provider"}
        message={confirm?.type === "approve" ? "Provider verify ho jaayega aur bookings accept kar sakta hai." : confirm?.type === "reject" ? "Provider ko reject kar diya jaayega." : confirm?.type === "delete" ? "Provider permanently delete ho jaayega." : confirm?.provider?.isBlocked ? "Provider restore ho jaayega." : "Provider ko block kiya jaayega."}
        confirmLabel={confirm?.type === "approve" ? "Approve" : confirm?.type === "reject" ? "Reject" : confirm?.type === "delete" ? "Delete" : confirm?.provider?.isBlocked ? "Unblock" : "Block"}
        danger={confirm?.type === "reject" || confirm?.type === "delete"}
      />
    </div>
  );
}
