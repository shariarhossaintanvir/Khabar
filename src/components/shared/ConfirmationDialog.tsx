import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  requireReason = false,
  reasonPlaceholder = 'Please specify reason...',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 relative space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-brand-50 text-brand-600 border border-brand-100'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1 pr-6">
            <h3 className="font-display font-black text-lg text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {requireReason && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Reason / Note:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
        )}

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            onClick={handleCancel}
            type="button"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-transform active:scale-95 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
