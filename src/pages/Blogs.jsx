import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Eye, Loader } from "lucide-react";
import { adminService } from "../services/api";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { fmtDate } from "../utils/helpers";

const CATS = ["Hiring Tips", "Design", "Development", "Business", "Marketing", "Guide", "News"];
const empty = { title: "", coverImage: "", category: "Design", excerpt: "", content: "", status: "Draft" };

export default function Blogs() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusF !== "All") params.status = statusF;
      if (search) params.search = search;
      const res = await adminService.getBlogs(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusF, search]);

  useEffect(() => {
    const delay = setTimeout(() => fetchBlogs(), 300);
    return () => clearTimeout(delay);
  }, [fetchBlogs]);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (b) => { setEditing(b._id); setForm({ title: b.title, coverImage: b.coverImage, category: b.category, excerpt: b.excerpt, content: b.content, status: b.status }); setModal(true); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing) await adminService.updateBlog(editing, form);
      else await adminService.createBlog(form);
      setModal(false);
      fetchBlogs();
    } catch { alert("Save failed."); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteBlog(id);
      fetchBlogs();
    } catch { alert("Delete failed."); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          ["Total Blogs", pagination.total, "text-primary", "bg-primary-50"],
          ["Published", data.filter(b => b.status === "Published").length, "text-green-600", "bg-green-50"],
          ["Drafts", data.filter(b => b.status === "Draft").length, "text-gray-600", "bg-gray-100"],
        ].map(([l, v, tc, bg]) => (
          <div key={l} className={`card ${bg} border-0 text-center py-4`}>
            <p className={`text-2xl font-bold ${tc}`}>{v}</p>
            <p className="text-sm text-gray-600 mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 flex-wrap">
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search blogs..." className="max-w-xs w-full" />
            <div className="flex gap-2">
              {["All", "Published", "Draft"].map(s => (
                <button key={s} onClick={() => { setStatusF(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusF === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
              ))}
            </div>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 flex-shrink-0"><Plus size={15} />New Blog</button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader size={28} className="animate-spin text-primary" /></div>
          ) : data.length === 0 ? <EmptyState icon="📝" title="No blogs yet" description="Create your first blog post." /> : (
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="th">Blog</th><th className="th">Category</th><th className="th">Author</th><th className="th">Date</th><th className="th">Views</th><th className="th">Status</th><th className="th">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        {b.coverImage && <img src={b.coverImage} alt={b.title} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-[200px]">{b.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{b.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td"><span className="badge bg-primary-50 text-primary">{b.category}</span></td>
                    <td className="td text-gray-500">{b.author?.name || "Admin"}</td>
                    <td className="td text-gray-400 text-xs">{fmtDate(b.createdAt)}</td>
                    <td className="td text-gray-500">{b.views || 0}</td>
                    <td className="td"><Badge status={b.status} /></td>
                    <td className="td">
                      <div className="flex gap-1">
                        <button onClick={() => setViewModal(b)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all"><Eye size={15} /></button>
                        <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit size={15} /></button>
                        <button onClick={() => setConfirm({ id: b._id })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
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

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? "Edit Blog Post" : "Create New Blog Post"} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Blog post title..." className="input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="input">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} className="input">
                <option>Draft</option><option>Published</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
              <input value={form.coverImage} onChange={e => set("coverImage", e.target.value)} placeholder="https://..." className="input" />
              {form.coverImage && <img src={form.coverImage} alt="cover" className="mt-2 h-24 w-full object-cover rounded-xl" />}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
              <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2} placeholder="Short description..." className="input resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label>
              <textarea value={form.content} onChange={e => set("content", e.target.value)} rows={5} placeholder="Write your blog content here..." className="input resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button onClick={() => setModal(false)} className="btn-ghost border border-gray-200">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? "Saving..." : editing ? "Update Post" : "Publish Post"}</button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Blog Preview" size="lg">
        {viewModal && (
          <div>
            {viewModal.coverImage && <img src={viewModal.coverImage} alt={viewModal.title} className="w-full h-48 object-cover rounded-xl mb-4" />}
            <div className="flex items-center gap-2 mb-3"><span className="badge bg-primary-50 text-primary">{viewModal.category}</span><Badge status={viewModal.status} /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{viewModal.title}</h2>
            <p className="text-sm text-gray-400 mb-3">By {viewModal.author?.name || "Admin"} · {fmtDate(viewModal.createdAt)} · {viewModal.views || 0} views</p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">{viewModal.excerpt}</p>
            <p className="text-gray-700 text-sm leading-relaxed">{viewModal.content}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { handleDelete(confirm.id); setConfirm(null); }} title="Delete Blog Post" message="Blog post permanently delete ho jaayega." confirmLabel="Delete" danger />
    </div>
  );
}
