import React from 'react';
import { useKhabar } from '../../context/KhabarContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useKhabar();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-white text-slate-800 shadow-lg',
    error: 'border-rose-200 bg-white text-slate-800 shadow-lg',
    info: 'border-blue-200 bg-white text-slate-800 shadow-lg',
  };

  const type = toast.type || 'success';

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[999] animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium ${bgStyles[type]}`}
      >
        {icons[type]}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
