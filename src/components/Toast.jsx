import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${
          bgStyles[toast.type || 'info']
        } transition-all duration-300`}
      >
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm font-medium pr-2">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
