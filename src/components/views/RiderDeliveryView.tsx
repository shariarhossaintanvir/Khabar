import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  Phone,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  ArrowLeft,
  ChevronRight,
  Compass,
  AlertCircle,
  ExternalLink,
  Power
} from 'lucide-react';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';

export const RiderDeliveryView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    setPortalMode,
    formatBDT,
    showToast
  } = useKhabar();

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'active' | 'requests' | 'earnings'>('active');

  // Find active delivery order or fallback to first active
  const activeDelivery = orders.find(
    (o) => o.status === 'PREPARING' || o.status === 'PICKED_UP' || o.status === 'ON_THE_WAY'
  ) || orders[0];

  // Rider stepper state
  const getStepNumber = (status?: OrderRecord['status']) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PREPARING':
        return 1; // Heading to restaurant
      case 'PICKED_UP':
        return 2; // At restaurant / picked up
      case 'ON_THE_WAY':
        return 3; // En route to customer
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber(activeDelivery?.status);

  const handleNextStep = () => {
    if (!activeDelivery) return;

    if (currentStep === 1) {
      updateOrderStatus(activeDelivery.id, 'PICKED_UP');
      showToast('Status updated: Arrived at restaurant & collected thermal bag.', 'info');
    } else if (currentStep === 2) {
      updateOrderStatus(activeDelivery.id, 'ON_THE_WAY');
      showToast('Status updated: On the way to customer delivery address!', 'info');
    } else if (currentStep === 3) {
      updateOrderStatus(activeDelivery.id, 'DELIVERED');
      showToast(`Order #${activeDelivery.id} successfully delivered! Payout added to wallet.`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Rider Top Navigation Bar */}
        <div className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-display font-black text-lg">
                RH
              </div>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 border-slate-800 absolute -bottom-0.5 -right-0.5 ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg text-white">Rakib Hossain</h1>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-700/80 px-2 py-0.5 rounded">
                  ★ 4.92 (1,420 trips)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zone: Dhanmondi-11 • Honda CB Shine (Dhaka-H-4412)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Duty toggle */}
            <button
              onClick={() => {
                setIsOnline(!isOnline);
                showToast(isOnline ? 'You are now OFFLINE' : 'You are now ONLINE and receiving dispatches', 'info');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            {/* Back to customer app */}
            <button
              onClick={() => setPortalMode('customer')}
              className="px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Rider App</span>
            </button>
          </div>
        </div>

        {/* Quick Shift Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl text-center">
            <span className="text-[11px] text-slate-400 block">Today's Earnings</span>
            <span className="font-display font-black text-xl text-emerald-400 mt-1 block">
              {formatBDT(1650)}
            </span>
            <span className="text-[10px] text-slate-400">+৳240 tips</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl text-center">
            <span className="text-[11px] text-slate-400 block">Completed Trips</span>
            <span className="font-display font-black text-xl text-white mt-1 block">14</span>
            <span className="text-[10px] text-emerald-400 font-semibold">100% acceptance</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl text-center">
            <span className="text-[11px] text-slate-400 block">Active Shift</span>
            <span className="font-display font-black text-xl text-amber-400 mt-1 block">5h 20m</span>
            <span className="text-[10px] text-slate-400">Peak bonus active</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Active Trip</span>
            {activeDelivery && activeDelivery.status !== 'DELIVERED' && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Nearby Requests (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'earnings'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Payout History</span>
          </button>
        </div>

        {/* Active Trip Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeDelivery && activeDelivery.status !== 'DELIVERED' ? (
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                {/* Header status */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/70">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Assigned Delivery • Order #{activeDelivery.id}
                    </span>
                    <h3 className="font-display font-black text-xl text-white mt-0.5">
                      {activeDelivery.restaurantName} → {activeDelivery.deliveryArea}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Payout</span>
                    <span className="font-display font-black text-lg text-emerald-400">
                      {formatBDT(85 + (activeDelivery.total > 1000 ? 35 : 15))}
                    </span>
                  </div>
                </div>

                {/* Simulated GPS Route Map */}
                <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                  <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                    {/* Dhaka Road grid */}
                    <rect width="600" height="240" fill="#0b1120" />
                    <line x1="0" y1="60" x2="600" y2="60" stroke="#1e293b" strokeWidth="6" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#1e293b" strokeWidth="8" />
                    <line x1="0" y1="180" x2="600" y2="180" stroke="#1e293b" strokeWidth="6" />
                    <line x1="120" y1="0" x2="120" y2="240" stroke="#1e293b" strokeWidth="6" />
                    <line x1="280" y1="0" x2="280" y2="240" stroke="#1e293b" strokeWidth="8" />
                    <line x1="440" y1="0" x2="440" y2="240" stroke="#1e293b" strokeWidth="6" />

                    {/* Dhanmondi Lake water feature */}
                    <path
                      d="M 160,80 Q 220,100 240,160 T 210,230 L 170,230 Z"
                      fill="#0369a1"
                      opacity="0.2"
                    />

                    {/* Navigation route line */}
                    <path
                      d="M 80,120 L 200,120 L 280,120 L 280,180 L 480,180"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="6 6"
                      className="animate-pulse"
                    />

                    {/* Restaurant marker */}
                    <circle cx="80" cy="120" r="10" fill="#ff4d2e" />
                    <text x="80" y="105" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Kitchen
                    </text>

                    {/* Customer marker */}
                    <circle cx="480" cy="180" r="10" fill="#3b82f6" />
                    <text x="480" y="205" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Customer
                    </text>

                    {/* Moving Rider Icon */}
                    <circle cx={currentStep === 1 ? 90 : currentStep === 2 ? 180 : 380} cy={currentStep <= 2 ? 120 : 180} r="14" fill="#10b981" />
                    <text
                      x={currentStep === 1 ? 90 : currentStep === 2 ? 180 : 380}
                      y={currentStep <= 2 ? 124 : 184}
                      fill="#ffffff"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      🏍️
                    </text>
                  </svg>

                  {/* Route HUD overlay */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>Turn Right on Satmasjid Road • 650m</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-emerald-400">
                    ETA: 8 mins
                  </div>
                </div>

                {/* Pickup & Dropoff Detail Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Restaurant Pickup */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/80 space-y-2">
                    <div className="flex items-center gap-2 text-brand-400 text-xs font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>1. RESTAURANT PICKUP</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{activeDelivery.restaurantName}</h4>
                    <p className="text-xs text-slate-400">
                      Show Order ID #{activeDelivery.id} at kitchen counter
                    </p>
                    <div className="pt-1 text-[11px] text-slate-300">
                      📦 {activeDelivery.items.length} items to collect (Verify sealed packaging)
                    </div>
                  </div>

                  {/* Customer Dropoff */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>2. CUSTOMER DELIVERY</span>
                      </div>
                      <a
                        href={`tel:${activeDelivery.customerPhone}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-[11px] font-bold flex items-center gap-1 hover:bg-blue-500/30 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                    <h4 className="font-bold text-white text-sm">{activeDelivery.customerName}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeDelivery.deliveryAddress}, {activeDelivery.deliveryArea}
                    </p>
                    <div className="pt-1 text-[11px] text-amber-300">
                      Payment: <strong>{activeDelivery.paymentMethod}</strong> (Collect {formatBDT(activeDelivery.total)})
                    </div>
                  </div>
                </div>

                {/* Delivery Progress Action Stepper */}
                <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="font-bold">Progress:</span>
                    <span className={`px-2 py-0.5 rounded ${currentStep >= 1 ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-500'}`}>
                      1. To Kitchen
                    </span>
                    <span>→</span>
                    <span className={`px-2 py-0.5 rounded ${currentStep >= 2 ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-500'}`}>
                      2. Food Collected
                    </span>
                    <span>→</span>
                    <span className={`px-2 py-0.5 rounded ${currentStep >= 3 ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-500'}`}>
                      3. Handover
                    </span>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {currentStep === 1 && 'Confirm: Arrived at Restaurant'}
                      {currentStep === 2 && 'Confirm: Order Picked Up & Start Ride'}
                      {currentStep === 3 && 'Confirm: Delivered to Customer & Paid'}
                      {currentStep >= 4 && 'Trip Completed ✓'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/60 rounded-3xl p-12 text-center border border-slate-700 space-y-3">
                <Bike className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="font-bold text-base text-white">No Active Delivery Right Now</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You are online in the Dhanmondi zone. Nearby incoming pickup dispatches will appear here automatically.
                </p>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                >
                  View Available Requests
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nearby Requests Queue */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {[
              {
                id: 'REQ-104',
                restaurant: 'Takeout Dhanmondi',
                dropArea: 'Kalabagan 1st Lane',
                dist: '1.4 km',
                payout: 95,
                items: 3,
                time: '18 mins',
              },
              {
                id: 'REQ-105',
                restaurant: "Sultan's Dine",
                dropArea: 'Lalmatia Block C',
                dist: '2.1 km',
                payout: 120,
                items: 5,
                time: '24 mins',
              },
              {
                id: 'REQ-106',
                restaurant: 'Chillox Banani',
                dropArea: 'Gulshan 1 Circle',
                dist: '3.0 km',
                payout: 145,
                items: 2,
                time: '28 mins',
              },
            ].map((req) => (
              <div
                key={req.id}
                className="bg-slate-800/70 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{req.restaurant}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      {req.dist} away
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Deliver to: <strong className="text-slate-200">{req.dropArea}</strong> • {req.items} items • {req.time}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-lg text-emerald-400">
                    {formatBDT(req.payout)}
                  </span>
                  <button
                    onClick={() => {
                      showToast(`Accepted trip from ${req.restaurant}! GPS navigation started.`, 'success');
                      setActiveTab('active');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Accept Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payout & Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Weekly Payout Ledger • বিকাশ বা ব্যাংক উইথড্র
            </h3>

            <div className="space-y-2.5">
              {[
                { day: 'Monday (Today)', trips: 14, earned: 1650, tip: 240, status: 'Processing' },
                { day: 'Sunday', trips: 18, earned: 2180, tip: 310, status: 'Paid to bKash' },
                { day: 'Saturday', trips: 22, earned: 2790, tip: 450, status: 'Paid to bKash' },
                { day: 'Friday (Dhaka Weekend Peak)', trips: 26, earned: 3420, tip: 520, status: 'Paid to bKash' },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{p.day}</span>
                    <span className="text-slate-400 text-[11px]">{p.trips} completed deliveries</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-emerald-400 block">
                      {formatBDT(p.earned + p.tip)}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
