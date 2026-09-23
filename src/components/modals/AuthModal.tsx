import React, { useState } from 'react';
import { X, Smartphone, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginWithPassword,
    registerCustomer,
    requestOTP,
    verifyOTP,
    showToast,
  } = useKhabar();

  const [identifier, setIdentifier] = useState('tanvir@khabar.com');
  const [password, setPassword] = useState('Khabar@2026');
  const [name, setName] = useState('Tanvir Ahmed');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your email or mobile number, and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await loginWithPassword(identifier, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user?.name}!`);
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage(result.error || 'Invalid credentials.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !identifier.trim() || !password.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    const result = await registerCustomer(name, identifier, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Account created successfully! Welcome to KHABAR.');
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your mobile number or email to receive OTP.');
      return;
    }

    const res = requestOTP(identifier);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to send verification code.');
      return;
    }

    setAuthMode('otp');
    if (res.otpPreview) {
      const digits = res.otpPreview.split('');
      setOtpCode(digits);
      showToast(`Verification code sent to ${identifier} (Code: ${digits.join(' ')})`, 'success');
    } else {
      showToast(res.message || `Verification code sent to ${identifier}`);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const fullOtp = otpCode.join('');

    if (fullOtp.length !== 4) {
      setErrorMessage('Please enter the complete 4-digit code.');
      return;
    }

    setIsSubmitting(true);
    const result = verifyOTP(identifier, fullOtp);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Mobile verified successfully! Welcome to KHABAR.');
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage(result.error || 'Verification failed. Please check the code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-display font-black text-sm">
              KH
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">
                {authMode === 'login' && 'Welcome Back to KHABAR'}
                {authMode === 'signup' && 'Create Your KHABAR Account'}
                {authMode === 'otp' && 'Enter Verification Code'}
              </h3>
              <p className="text-xs text-slate-500">
                {authMode === 'login' && 'Log in with verified PBKDF2 hashed credentials'}
                {authMode === 'signup' && 'Sign up in 30 seconds to enjoy 20% OFF first order'}
                {authMode === 'otp' && `Sent 4-digit OTP to ${identifier}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. tanvir@khabar.com or 01712-345678"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                    className="text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Log In to KHABAR'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Or One-Time Code
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Login with Dynamic OTP Code</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode('signup');
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Sign Up Free
                </button>
              </div>
            </form>
          )}

          {authMode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bangladeshi Mobile Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password (Min 8 chars, letters & numbers)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-brand-600 focus:ring-brand-500" />
                <span>
                  I agree to KHABAR's{' '}
                  <span className="text-brand-600 font-semibold underline">Terms of Service</span> and{' '}
                  <span className="text-brand-600 font-semibold underline">Privacy Policy</span>.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Securing Account...' : 'Create Account with PBKDF2'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode('login');
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {authMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <p className="text-xs text-slate-500">
                Enter the dynamic 4-digit code dispatched to your mobile.
              </p>

              <div className="flex justify-center gap-3 py-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otpCode];
                      next[idx] = val;
                      setOtpCode(next);
                    }}
                    className="w-12 h-12 text-center font-display font-black text-xl rounded-xl border-2 border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 bg-slate-50"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifying OTP...' : 'Confirm & Enter KHABAR'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setAuthMode('login');
                }}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Back to Standard Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
