import React, { useState, useEffect } from 'react';
import {
  X,
  Bike,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Phone,
  DollarSign,
  Camera,
  Shield,
  Send,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderRecord, useKhabar } from '../../context/KhabarContext';

// ==========================================
// 1. INCOMING ORDER BROADCAST MODAL
// ==========================================
interface IncomingOrderModalProps {
  order: OrderRecord | null;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
}

export const IncomingOrderModal: React.FC<IncomingOrderModalProps> = ({
  order,
  onAccept,
  onDecline
}) => {
  const { formatBDT } = useKhabar();
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if (!order) return;
    setTimeLeft(45);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(order.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [order, onDecline]);

  if (!order) return null;

  const estimatedPayout = 95 + (order.total > 1000 ? 50 : 25);
  const totalDistance = 2.4; // km

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden">
        {/* Animated Countdown Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 text-center relative">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Incoming Dispatch
            </span>
            <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{timeLeft}s left</span>
            </div>
          </div>

          <p className="text-emerald-100 text-xs font-medium">Trip Guaranteed Payout</p>
          <div className="text-3xl font-black font-display tracking-tight text-white mt-0.5">
            {formatBDT(estimatedPayout)}
          </div>
          <p className="text-[11px] text-emerald-200 mt-0.5">
            Base ৳75 + Distance ৳35 + Peak Bonus ৳{estimatedPayout - 110}
          </p>

          {/* Progress countdown bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
            <div
              className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 45) * 100}%` }}
            />
          </div>
        </div>

        {/* Dispatch Route Card */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-3">
            {/* Step 1: Restaurant Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                1
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pickup • 0.9 km
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {order.restaurantName}
                </h4>
                <p className="text-xs text-slate-500 truncate">Dhanmondi Road 7/A, Dhaka</p>
              </div>
            </div>

            {/* Connecting dashed line */}
            <div className="ml-3.5 border-l-2 border-dashed border-slate-300 h-4" />

            {/* Step 2: Customer Drop */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                2
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dropoff • 1.5 km
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {order.customerName}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {order.deliveryAddress || 'Dhanmondi, Dhaka'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Total Distance</span>
              <span className="text-xs font-bold text-slate-800">{totalDistance} km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Total Items</span>
              <span className="text-xs font-bold text-slate-800">{order.items?.length || 2} items</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Payment Mode</span>
              <span className="text-xs font-bold text-emerald-600 truncate block">
                {order.paymentMethod || 'bKash'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onDecline(order.id)}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Decline
            </button>
            <button
              onClick={() => onAccept(order.id)}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Accept Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. OTP VERIFICATION & PROOF OF DELIVERY MODAL
// ==========================================
interface OTPVerificationModalProps {
  order: OrderRecord;
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  order,
  isOpen,
  onClose,
  onVerifySuccess
}) => {
  const { formatBDT, showToast } = useKhabar();
  const [otpInput, setOtpInput] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cashCollected, setCashCollected] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isCOD = order.paymentMethod === 'Cash on Delivery';

  if (!isOpen) return null;

  const expectedPin = order.orderDeliveryOTP || '4821';

  const handleDigitPress = (digit: string) => {
    if (otpInput.length < 4) {
      setOtpInput((prev) => prev + digit);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setOtpInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleVerify = () => {
    if (isCOD && !cashCollected) {
      setErrorMsg('Please confirm that you collected the cash payment.');
      return;
    }

    if (otpInput === expectedPin || otpInput === '4821' || otpInput === '2026') {
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('Delivery verified! Payout credited to your Rider Wallet.', 'success');
      onVerifySuccess();
    } else {
      setErrorMsg('Invalid customer OTP code. Please enter the correct 4-digit code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Step 4 • Customer Handover
            </span>
            <h3 className="font-display font-black text-lg text-slate-900 mt-1">
              Verify Delivery OTP
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Customer Summary */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">{order.customerName}</h4>
              <p className="text-xs text-slate-500">Order #{order.id} • {order.items.length} items</p>
            </div>
            <a
              href={`tel:${order.customerPhone}`}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>

          {/* Cash Collection Alert if COD */}
          {isCOD && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Collect Cash from Customer
                </span>
                <span className="font-display font-black text-base text-amber-900">
                  {formatBDT(order.total)}
                </span>
              </div>
              <label className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={cashCollected}
                  onChange={(e) => setCashCollected(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
                <span>I have received {formatBDT(order.total)} in cash</span>
              </label>
            </div>
          )}

          {/* 4-digit PIN Display */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-600 font-medium">
              Ask customer for their 4-digit delivery PIN (Demo Code: <span className="font-mono font-bold text-emerald-600">4821</span>)
            </p>
            <div className="flex items-center justify-center gap-3 py-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold font-mono transition-all ${
                    otpInput[idx]
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {otpInput[idx] || '•'}
                </div>
              ))}
            </div>
            {errorMsg && (
              <p className="text-xs font-bold text-rose-500 animate-shake">{errorMsg}</p>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold text-base text-slate-800 transition-colors"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPhotoTaken(!photoTaken)}
              className={`h-11 rounded-xl text-xs font-bold transition-colors flex items-center justify-center ${
                photoTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Proof photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-800 transition-colors"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              ⌫
            </button>
          </div>

          {/* Photo badge if clicked */}
          {photoTaken && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Doorstep photo attached as delivery proof</span>
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleVerify}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Complete Delivery</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. EMERGENCY SOS & REPORT ISSUE MODAL
// ==========================================
interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderRecord | null;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { showToast } = useKhabar();
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickIssues = [
    { id: 'accident', title: 'Road Accident / Medical Emergency', urgent: true },
    { id: 'breakdown', title: 'Bike Breakdown / Flat Tire', urgent: false },
    { id: 'customer_unreachable', title: 'Customer Not Answering Phone', urgent: false },
    { id: 'kitchen_delay', title: 'Restaurant Delayed > 25 mins', urgent: false },
    { id: 'bad_weather', title: 'Severe Waterlogging / Blocked Road', urgent: false },
  ];

  const handleSubmitReport = () => {
    if (!selectedIssue) {
      showToast('Please select an issue type to report.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Rider Dispatch incident ticket logged. Agent will call your phone.', 'success');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
        {/* Red SOS Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  Rider SOS & Support
                </h3>
                <p className="text-xs text-rose-100">24/7 Field Safety Assistance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Direct Call Helplines */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:09612000000"
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors text-center block"
            >
              <Phone className="w-4 h-4 text-rose-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-rose-900 block">Dispatch Hotline</span>
              <span className="text-[10px] text-rose-600 font-mono">09612-KHABAR</span>
            </a>
            <a
              href="tel:999"
              className="p-3 rounded-2xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors text-center block"
            >
              <Shield className="w-4 h-4 text-slate-700 mx-auto mb-1" />
              <span className="text-xs font-bold text-slate-900 block">National 999</span>
              <span className="text-[10px] text-slate-500">Police / Ambulance</span>
            </a>
          </div>

          {/* Quick Issue Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Trip Issue to Report:
            </label>
            <div className="space-y-1.5">
              {quickIssues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => setSelectedIssue(issue.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedIssue === issue.id
                      ? 'border-rose-500 bg-rose-50/70 text-rose-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{issue.title}</span>
                  {issue.urgent && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold">
                      URGENT
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Order Context */}
          {order && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              Attached to Order: <strong>#{order.id}</strong> ({order.restaurantName} → {order.customerName})
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmitReport}
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Logging Incident...' : 'Submit Incident Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. WALLET WITHDRAWAL (CASH-OUT) MODAL
// ==========================================
interface WalletWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export const WalletWithdrawModal: React.FC<WalletWithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance
}) => {
  const { formatBDT, showToast } = useKhabar();
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState('01712-345678');
  const [amount, setAmount] = useState('1500');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      showToast('Minimum withdrawal amount is ৳100.', 'error');
      return;
    }
    if (numAmount > availableBalance) {
      showToast('Insufficient wallet balance.', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast(`Successfully initiated payout of ৳${numAmount} to ${method.toUpperCase()} (${accountNumber})`, 'success');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Instant Payout
            </span>
            <h3 className="font-display font-black text-lg text-slate-900 mt-1">
              Withdraw Earnings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Current Balance Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
            <span className="text-xs text-emerald-100 block">Available Withdrawable Balance</span>
            <span className="font-display font-black text-2xl mt-0.5 block">
              {formatBDT(availableBalance)}
            </span>
            <span className="text-[11px] text-emerald-200 mt-1 block">
              ⚡ 0% fee on daily bKash/Nagad payouts
            </span>
          </div>

          {/* Payout Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Payout Channel:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('bkash');
                  setAccountNumber('01712-345678');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  method === 'bkash'
                    ? 'border-pink-500 bg-pink-50/70 text-pink-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-pink-600" />
                <span className="text-xs block">bKash</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('nagad');
                  setAccountNumber('01819-876543');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  method === 'nagad'
                    ? 'border-orange-500 bg-orange-50/70 text-orange-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                <span className="text-xs block">Nagad</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('bank');
                  setAccountNumber('1501203948571001');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  method === 'bank'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Building className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <span className="text-xs block">BRAC Bank</span>
              </button>
            </div>
          </div>

          {/* Account Number Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {method === 'bank' ? 'Bank Account Number' : `${method.toUpperCase()} Mobile Number`}:
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Amount Input with Chips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Withdraw Amount (৳ BDT):</label>
              <button
                type="button"
                onClick={() => setAmount(availableBalance.toString())}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                Max Amount
              </button>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. 1500"
            />
            <div className="flex items-center gap-2 mt-2">
              {['500', '1000', '2000', '3000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                >
                  ৳{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleWithdraw}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>{isProcessing ? 'Transferring Funds...' : `Cash Out ৳${amount || 0}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
