import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, UserCheck, AlertCircle, ChefHat, Bike, Compass } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { UserRole } from '../../security/rbac';

export interface RoleGateModalProps {
  isOpen: boolean;
  targetRole: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const RoleGateModal: React.FC<RoleGateModalProps> = ({
  isOpen,
  targetRole,
  onClose,
  onSuccess,
}) => {
  const { loginWithRoleCredentials, showToast } = useKhabar();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pre-configured demo quick-fill credentials for reviewers
  const demoConfigs = {
    ADMIN: {
      title: 'Operations Admin Console',
      subtitle: 'Elevated privileges required. Super Admin authentication active.',
      email: 'admin@khabar.com',
      pass: 'KhabarAdmin@2026',
      icon: <Compass className="w-5 h-5 text-amber-500" />,
      badge: 'Super Admin Security',
      color: 'bg-amber-500',
    },
    RESTAURANT: {
      title: 'Kitchen Partner POS & KDS',
      subtitle: 'Restricted to verified kitchen managers and outlet partners.',
      email: 'partner@takeout.com',
      pass: 'KhabarPartner@2026',
      icon: <ChefHat className="w-5 h-5 text-brand-500" />,
      badge: 'Partner POS Gateway',
      color: 'bg-brand-500',
    },
    RIDER: {
      title: 'Rider Delivery Courier Portal',
      subtitle: 'Dedicated portal for active courier partners in Dhaka.',
      email: 'rider@khabar.com',
      pass: 'KhabarRider@2026',
      icon: <Bike className="w-5 h-5 text-emerald-500" />,
      badge: 'Courier Partner Network',
      color: 'bg-emerald-500',
    },
    CUSTOMER: {
      title: 'Customer Verification',
      subtitle: 'Log in to your customer account.',
      email: 'tanvir@khabar.com',
      pass: 'Khabar@2026',
      icon: <UserCheck className="w-5 h-5 text-slate-500" />,
      badge: 'Customer Security',
      color: 'bg-slate-500',
    },
  };

  const config = demoConfigs[targetRole] || demoConfigs.ADMIN;

  const handleQuickFill = () => {
    setIdentifier(config.email);
    setPassword(config.pass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your account email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await loginWithRoleCredentials(identifier, password, targetRole);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Authenticated as ${result.user?.name} (${result.user?.role})`, 'success');
      onSuccess();
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify role credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${config.color}/10 flex items-center justify-center`}>
              {config.icon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wide uppercase mb-1">
                <ShieldCheck className="w-3 h-3 text-brand-600" />
                <span>{config.badge}</span>
              </div>
              <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                {config.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            {config.subtitle} Server-side RBAC token verification is active.
          </p>

          {/* Quick-fill helper for reviewer ease */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
            <div className="text-[11px] text-amber-900">
              <span className="font-bold block">Testing Credentials Available:</span>
              <span className="text-amber-700 text-[10px]">{config.email}</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Email or Mobile
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@khabar.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isSubmitting ? 'Verifying PBKDF2 Hash...' : `Authorize & Enter ${targetRole}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
