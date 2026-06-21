import { ChevronLeft, ChevronRight } from "lucide-react";
export default function Pagination({ page, total, perPage=10, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">Showing {Math.min((page-1)*perPage+1, total)}–{Math.min(page*perPage, total)} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page-1)} disabled={page===1} className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronLeft size={16}/></button>
        {[...Array(totalPages)].map((_,i) => (
          <button key={i} onClick={() => onChange(i+1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page===i+1?"bg-primary text-white":"border border-gray-200 hover:bg-gray-50 text-gray-600"}`}>{i+1}</button>
        ))}
        <button onClick={() => onChange(page+1)} disabled={page===totalPages} className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronRight size={16}/></button>
      </div>
    </div>
  );
}
