import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";
export default function ConfirmDialog({ isOpen, onClose, onConfirm, title="Confirm Action", message="Are you sure?", confirmLabel="Confirm", danger=false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${danger?"bg-red-50":"bg-amber-50"}`}>
          <AlertTriangle size={26} className={danger?"text-red-500":"text-amber-500"}/>
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="ghost" className="flex-1 border border-gray-200" onClick={onClose}>Cancel</Button>
          <Button variant={danger?"danger":"primary"} className="flex-1" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
