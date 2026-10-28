import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-sm w-full transform transition-all duration-300 scale-95 opacity-0 animate-modal-in border border-slate-100"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-red-100 rounded-full mb-4 text-red-600 shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button 
            type="button"
            onClick={onClose} 
            className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 text-slate-800 font-bold text-sm rounded-xl hover:bg-slate-200 active:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
          >
            إلغاء
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className="w-full min-h-[44px] px-4 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-sm"
          >
            تأكيد الحذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;