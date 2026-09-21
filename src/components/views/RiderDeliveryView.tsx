import React, { useState, useEffect } from 'react';
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
  Power,
  Radio,
  Award,
  FileText,
  HelpCircle,
  RefreshCw,
  Smartphone,
  Laptop,
  Check,
  History,
  Sparkles,
  Star,
  AlertTriangle,
  ChevronDown,
  Camera,
  Layers,
  Map as MapIcon,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';
import { AppShell, NavItemConfig } from '../shared/AppShell';
import { StatCard } from '../shared/StatCard';
import { StatusBadge } from '../shared/StatusBadge';
import {
  IncomingOrderModal,
  OTPVerificationModal,
  EmergencySOSModal,
  WalletWithdrawModal
} from '../rider/RiderModals';

export const RiderDeliveryView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    setPortalMode,
    formatBDT,
    showToast,
    riderOnline,
    setRiderOnline,
    incomingDelivery,
    setIncomingDelivery,
    acceptDelivery,
    declineDelivery,
    activeRiderStep,
    setActiveRiderStep,
    completeDeliveryWithOTP,
    riderDeliveries,
    walletBalance,
  } = useKhabar();

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('mission');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'phone'>('desktop');

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [tripCelebration, setTripCelebration] = useState(false);

  // Active delivery order (or fallback to an active one in demo)
  const activeDelivery = orders.find(
    (o) => o.status === 'PREPARING' || o.status === 'PICKED_UP' || o.status === 'ON_THE_WAY'
  ) || null;

  // Sync step if active order exists
  useEffect(() => {
    if (!activeDelivery) {
      if (activeRiderStep !== 1 && !tripCelebration) {
        setActiveRiderStep(1);
      }
    }
  }, [activeDelivery, activeRiderStep, setActiveRiderStep, tripCelebration]);

  // Handle stepping through delivery mission
  const handleNextStep = () => {
    if (!activeDelivery) return;

    if (activeRiderStep === 1) {
      // Heading -> Arrived at restaurant
      setActiveRiderStep(2);
      showToast('Arrived at restaurant. Show Order ID at the counter.', 'info');
    } else if (activeRiderStep === 2) {
      // At Restaurant -> Collected & Heading to customer
      updateOrderStatus(activeDelivery.id, 'ON_THE_WAY');
      setActiveRiderStep(3);
      showToast('Order collected into thermal bag. GPS navigation started to customer address!', 'info');
    } else if (activeRiderStep === 3) {
      // Heading -> Arrived at customer doorstep
      setActiveRiderStep(4);
      showToast('Arrived at customer location. Call customer or ring doorbell.', 'info');
    } else if (activeRiderStep === 4) {
      // Open OTP modal for handover
      setIsOTPOpen(true);
    }
  };

  const handleVerifySuccess = () => {
    if (activeDelivery) {
      completeDeliveryWithOTP(activeDelivery.id, '4821');
    }
    setIsOTPOpen(false);
    setTripCelebration(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleResetForNextTrip = () => {
    setTripCelebration(false);
    setActiveRiderStep(1);
    showToast('Ready for next dispatch! Radar is scanning your zone.', 'success');
  };

  // Simulate receiving an incoming dispatch
  const handleSimulateIncomingOrder = () => {
    if (!riderOnline) {
      showToast('Please toggle your status to ONLINE first.', 'error');
      return;
    }
    const mockOrder: OrderRecord = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customerName: 'Tanvir Hossain',
      customerPhone: '+880 1712-449911',
      deliveryAddress: 'Flat 4B, House 28, Road 11, Dhanmondi',
      deliveryArea: 'Dhanmondi',
      restaurantId: 'rest-1',
      restaurantName: "Sultan's Dine",
      items: [
        {
          id: 'cart-sim-1',
          restaurantId: 'takeout',
          restaurantName: "Sultan's Dine",
          quantity: 2,
          selectedAddOns: [],
          itemTotal: 1160,
          menuItem: {
            id: 'm1',
            name: 'Kacchi Biryani Feast',
            bengaliName: 'কাচ্চি বিরিয়ানি',
            price: 580,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
            category: 'Biryani',
            description: 'Traditional mutton kacchi with aromatics',
            restaurantId: 'takeout',
            restaurantName: "Sultan's Dine",
            rating: 4.9,
            reviewsCount: 1400,
            isPopular: true,
            isAvailable: true,
          },
        },
        {
          id: 'cart-sim-2',
          restaurantId: 'takeout',
          restaurantName: "Sultan's Dine",
          quantity: 2,
          selectedAddOns: [],
          itemTotal: 240,
          menuItem: {
            id: 'm2',
            name: 'Special Borhani (500ml)',
            bengaliName: 'স্পেশাল বোরহানি',
            price: 120,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
            category: 'Drinks',
            description: 'Spiced traditional yogurt beverage',
            restaurantId: 'takeout',
            restaurantName: "Sultan's Dine",
            rating: 4.8,
            reviewsCount: 950,
            isPopular: true,
            isAvailable: true,
          },
        },
      ],
      subtotal: 1400,
      deliveryFee: 60,
      discount: 0,
      vat: 0,
      total: 1460,
      paymentMethod: 'bKash',
      status: 'PREPARING',
      placedAt: 'Just now',
      estimatedDeliveryMin: 25,
      deliveryInstructions: 'Call before reaching gate. Ring bell 4B.',
    };
    setIncomingDelivery(mockOrder);
  };

  // Navigation items for the Rider AppShell
  const navItems: NavItemConfig[] = [
    {
      id: 'mission',
      label: 'Live Mission',
      icon: <Navigation className="w-5 h-5" />,
      badge: activeDelivery ? 'ACTIVE' : undefined,
      badgeColor: 'emerald',
    },
    {
      id: 'requests',
      label: 'Nearby Dispatches',
      icon: <Bike className="w-5 h-5" />,
      badge: '3',
      badgeColor: 'brand',
    },
    {
      id: 'earnings',
      label: 'Wallet & Payouts',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'history',
      label: 'Trip History',
      icon: <History className="w-5 h-5" />,
    },
    {
      id: 'performance',
      label: 'Scorecard & Badges',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Courier & Bike Docs',
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  // Top header controls inside AppShell
  const headerControls = (
    <div className="flex items-center gap-2.5">
      {/* Device frame preview toggle */}
      <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setDeviceMode('desktop')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            deviceMode === 'desktop'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Widescreen Dashboard Layout"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => setDeviceMode('phone')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            deviceMode === 'phone'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Smartphone Handset Frame View"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone Frame</span>
        </button>
      </div>

      {/* SOS Emergency Button */}
      <button
        onClick={() => setIsSOSOpen(true)}
        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
        <span className="hidden sm:inline">SOS Help</span>
      </button>

      {/* Online / Offline Switch */}
      <button
        onClick={() => {
          setRiderOnline(!riderOnline);
          showToast(
            riderOnline
              ? 'You are now OFFLINE. No new dispatches will be assigned.'
              : 'You are now ONLINE! Scanning Dhanmondi for new food deliveries.',
            riderOnline ? 'info' : 'success'
          );
        }}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
          riderOnline
            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
            : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            riderOnline ? 'bg-white animate-ping' : 'bg-slate-500'
          }`}
        />
        <span>{riderOnline ? 'ONLINE' : 'OFFLINE'}</span>
      </button>
    </div>
  );

  // Render Inner Content
  const renderContent = () => (
    <div className="space-y-6">
      {/* 1. TOP RIDER SUMMARY STRIP */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-display font-black text-xl shadow-md shadow-emerald-600/20">
              RS
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 border-white absolute -bottom-0.5 -right-0.5 ${
                riderOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-lg text-slate-900">
                Rahim Sheikh
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                4.92 ★ (1,480 trips)
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                🥇 Gold Rider
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>📍 Dhanmondi Hub</span>
              <span>•</span>
              <span>🏍️ Honda CB Shine (Dhaka Metro-H-4412)</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Insured & Verified ✓</span>
            </p>
          </div>
        </div>

        {/* Quick Shift Counter */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
          <div className="px-3 border-r border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">TODAY</span>
            <span className="font-display font-black text-base text-slate-900">৳1,650</span>
          </div>
          <div className="px-3 border-r border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">TRIPS</span>
            <span className="font-display font-black text-base text-slate-900">9</span>
          </div>
          <div className="px-3 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">SHIFT</span>
            <span className="font-display font-black text-base text-emerald-600">5.2 hrs</span>
          </div>
        </div>
      </div>

      {/* 2. TAB: LIVE MISSION */}
      {activeTab === 'mission' && (
        <div className="space-y-6">
          {/* If Trip just completed successfully -> Celebration Screen */}
          {tripCelebration ? (
            <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-card text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Trip Completed Successfully!
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 mt-2">
                  ধন্যবাদ রহিম ভাই! ৳145 Earned
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Customer verified with 4-digit PIN. Base payout and tips have been immediately credited to your bKash Rider Wallet.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 max-w-sm mx-auto border border-slate-200/80 space-y-2 text-left">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Base Delivery Fare:</span>
                  <span className="font-bold text-slate-900">৳85</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Distance Bonus (2.4 km):</span>
                  <span className="font-bold text-slate-900">৳35</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Peak Rain Surge:</span>
                  <span className="font-bold text-emerald-600">+৳25</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Customer Tip (bKash):</span>
                  <span className="font-bold text-emerald-600">+৳50</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Wallet Credit:</span>
                  <span className="text-emerald-600">৳195</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetForNextTrip}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan for Next Delivery</span>
                </button>
              </div>
            </div>
          ) : activeDelivery ? (
            /* Active Trip Dispatch Card */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
              {/* Header with status */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                      TRIP #{activeDelivery.id}
                    </span>
                    <span className="text-xs text-slate-300">
                      • {activeDelivery.items.length} food items
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      • Collect {formatBDT(activeDelivery.total)} ({activeDelivery.paymentMethod})
                    </span>
                  </div>
                  <h3 className="font-display font-black text-xl text-white mt-1">
                    {activeRiderStep <= 2 ? activeDelivery.restaurantName : activeDelivery.customerName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {activeRiderStep <= 2
                        ? `${activeDelivery.restaurantName} • Road 7/A, Dhanmondi`
                        : `${activeDelivery.deliveryAddress}, ${activeDelivery.deliveryArea}`}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <a
                    href={`tel:${activeRiderStep <= 2 ? '+8801711002233' : activeDelivery.customerPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call {activeRiderStep <= 2 ? 'Kitchen' : 'Customer'}</span>
                  </a>
                  <button
                    onClick={() => setIsSOSOpen(true)}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                    title="Report Issue"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3">
                <div className="flex items-center justify-between text-xs font-bold gap-2 overflow-x-auto">
                  <div
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-xl transition-colors ${
                      activeRiderStep === 1
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : activeRiderStep > 1
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span className="whitespace-nowrap">To Restaurant</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

                  <div
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-xl transition-colors ${
                      activeRiderStep === 2
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : activeRiderStep > 2
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span className="whitespace-nowrap">Order Pickup</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

                  <div
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-xl transition-colors ${
                      activeRiderStep === 3
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : activeRiderStep > 3
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span className="whitespace-nowrap">On Delivery</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

                  <div
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-xl transition-colors ${
                      activeRiderStep === 4
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : activeRiderStep > 4
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      4
                    </span>
                    <span className="whitespace-nowrap">Customer OTP</span>
                  </div>
                </div>
              </div>

              {/* Simulated Interactive Dhaka GPS Map */}
              <div className="relative w-full h-64 sm:h-72 bg-slate-950 overflow-hidden border-b border-slate-200">
                <svg className="w-full h-full" viewBox="0 0 640 280" preserveAspectRatio="none">
                  {/* Dark Map Base */}
                  <rect width="640" height="280" fill="#0f172a" />

                  {/* Dhaka Road System */}
                  <line x1="0" y1="70" x2="640" y2="70" stroke="#1e293b" strokeWidth="8" />
                  <line x1="0" y1="140" x2="640" y2="140" stroke="#334155" strokeWidth="12" />
                  <line x1="0" y1="210" x2="640" y2="210" stroke="#1e293b" strokeWidth="8" />

                  <line x1="140" y1="0" x2="140" y2="280" stroke="#1e293b" strokeWidth="8" />
                  <line x1="320" y1="0" x2="320" y2="280" stroke="#334155" strokeWidth="12" />
                  <line x1="500" y1="0" x2="500" y2="280" stroke="#1e293b" strokeWidth="8" />

                  {/* Dhanmondi Lake Water Polygon */}
                  <path
                    d="M 180,90 Q 240,110 260,170 T 230,240 L 190,240 Z"
                    fill="#0284c7"
                    opacity="0.25"
                  />
                  <text x="210" y="170" fill="#0284c7" fontSize="11" opacity="0.6" fontWeight="bold">
                    Dhanmondi Lake
                  </text>

                  {/* Route Polyline */}
                  <path
                    d="M 90,140 L 220,140 L 320,140 L 320,210 L 530,210"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="8 8"
                    className="animate-pulse"
                  />

                  {/* 1. Restaurant Pin */}
                  <circle cx="90" cy="140" r="12" fill="#ff4d2e" />
                  <circle cx="90" cy="140" r="5" fill="#ffffff" />
                  <text x="90" y="118" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    🍴 Kitchen
                  </text>

                  {/* 2. Customer Pin */}
                  <circle cx="530" cy="210" r="12" fill="#3b82f6" />
                  <circle cx="530" cy="210" r="5" fill="#ffffff" />
                  <text x="530" y="238" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    🏠 Dropoff
                  </text>

                  {/* Moving Rider Bike Marker */}
                  <g
                    transform={`translate(${
                      activeRiderStep === 1
                        ? 105
                        : activeRiderStep === 2
                        ? 200
                        : activeRiderStep === 3
                        ? 380
                        : 510
                    }, ${activeRiderStep <= 2 ? 140 : 210})`}
                  >
                    <circle cx="0" cy="0" r="16" fill="#10b981" className="animate-pulse" />
                    <text x="0" y="5" fill="#ffffff" fontSize="14" textAnchor="middle">
                      🏍️
                    </text>
                  </g>
                </svg>

                {/* Turn Navigation HUD Overlay */}
                <div className="absolute top-3.5 left-3.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 text-white text-xs font-bold flex items-center gap-2.5 shadow-xl">
                  <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
                  <div>
                    <span className="block text-emerald-400 text-[10px] uppercase font-mono">
                      GPS Live Guidance
                    </span>
                    <span>
                      {activeRiderStep === 1 && 'Head north towards Road 7/A • 400m'}
                      {activeRiderStep === 2 && 'At Kitchen Counter • Collect sealed bag'}
                      {activeRiderStep === 3 && 'Turn right onto Satmasjid Road • 650m'}
                      {activeRiderStep === 4 && 'At Destination: House 28, Dhanmondi 11'}
                    </span>
                  </div>
                </div>

                {/* ETA Badge */}
                <div className="absolute bottom-3.5 right-3.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 text-right shadow-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Arrival</span>
                  <span className="text-sm font-black font-display text-emerald-400">
                    {activeRiderStep === 1 ? '4 mins' : activeRiderStep === 2 ? 'Waiting' : activeRiderStep === 3 ? '7 mins' : 'Arrived'}
                  </span>
                </div>
              </div>

              {/* Order Content & Instructions */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Specific Step Content */}
                {activeRiderStep <= 2 ? (
                  /* Restaurant Checklist */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Kitchen Checklist ({activeDelivery.items.length} items to collect):
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Order #{activeDelivery.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeDelivery.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                              {item.quantity}x
                            </span>
                            <span className="font-bold text-slate-800">{item.menuItem?.name || 'Item'}</span>
                          </div>
                          <span className="text-slate-500 font-mono">
                            {formatBDT((item.menuItem?.price || 0) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-500 bg-amber-50 p-3 rounded-2xl border border-amber-200/70 text-amber-800 font-medium">
                      ⚠️ Note: Ensure soup container and drinks are kept upright in the thermal backpack divider.
                    </p>
                  </div>
                ) : (
                  /* Customer Handover Details */
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 uppercase">
                          Customer Delivery Instructions
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-700">
                          {activeDelivery.customerPhone}
                        </span>
                      </div>
                      <p className="text-xs text-blue-800 font-medium leading-relaxed">
                        "{activeDelivery.deliveryInstructions || 'Please call when you reach the security guard. Flat 4B, 4th floor.'}"
                      </p>
                    </div>

                    {/* Payment Warning */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Payment Collection
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {activeDelivery.paymentMethod === 'Cash on Delivery'
                            ? `Collect Cash: ${formatBDT(activeDelivery.total)}`
                            : `Paid Online via ${activeDelivery.paymentMethod} (Collect ৳0)`}
                        </span>
                      </div>
                      <StatusBadge status={activeDelivery.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID'} />
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleNextStep}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-display font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {activeRiderStep === 1 && 'I Have Arrived at Restaurant'}
                      {activeRiderStep === 2 && 'Order Collected & Sealed • Start Delivery Ride'}
                      {activeRiderStep === 3 && 'I Have Arrived at Customer Doorstep'}
                      {activeRiderStep === 4 && 'Verify Customer 4-Digit OTP & Complete'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : riderOnline ? (
            /* ONLINE RADAR SCANNING STATE */
            <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-card text-center space-y-6">
              {/* Animated Radar Pulse */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                <div className="absolute inset-4 rounded-full bg-emerald-500/20 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30">
                  <Radio className="w-10 h-10 animate-spin" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Radar Active • Dhanmondi Sector
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 mt-2">
                  Waiting for Next Dispatch...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You are in high-priority dispatch range for Dhanmondi 7/A, 11, and Satmasjid Road restaurants. Stay near food hubs for faster matches.
                </p>
              </div>

              {/* Surge Bonus Alert */}
              <div className="inline-flex items-center gap-2 p-3 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Peak Surge Active: +৳25 extra bonus on every Dhanmondi delivery!</span>
              </div>

              {/* Fast dispatch test trigger */}
              <div className="pt-2">
                <button
                  onClick={handleSimulateIncomingOrder}
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Bike className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Incoming Dispatch Alert (Test 45s Broadcast)</span>
                </button>
              </div>
            </div>
          ) : (
            /* OFFLINE RESTING STATE */
            <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-card text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Power className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-slate-900">
                  You are Currently OFFLINE
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Turn on your rider toggle to receive incoming food dispatches, peak surge bonuses, and start earning today.
                </p>
              </div>
              <button
                onClick={() => {
                  setRiderOnline(true);
                  showToast('You are now ONLINE! Scanning for deliveries.', 'success');
                }}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center gap-2"
              >
                <Power className="w-4 h-4" />
                <span>Go Online Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB: NEARBY REQUESTS POOL */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">
                Nearby Dispatches Pool
              </h3>
              <p className="text-xs text-slate-500">Available trips within 3 km of Dhanmondi Hub</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              3 Available Now
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'DISP-891',
                restaurant: 'Takeout Dhanmondi',
                address: 'Road 11, Dhanmondi',
                dropArea: 'Kalabagan 1st Lane',
                distPickup: '0.6 km',
                distTotal: '1.9 km',
                payout: 95,
                bonus: 20,
                items: '2x Beef Burgers, 1x Fries',
                prepTime: 'Ready in 5 mins',
              },
              {
                id: 'DISP-892',
                restaurant: "Sultan's Dine",
                address: 'Road 7/A, Dhanmondi',
                dropArea: 'Lalmatia Block C',
                distPickup: '1.1 km',
                distTotal: '2.8 km',
                payout: 135,
                bonus: 30,
                items: '3x Kacchi, 3x Borhani',
                prepTime: 'Food is READY',
              },
              {
                id: 'DISP-893',
                restaurant: 'Chillox Banani',
                address: 'Road 11, Banani',
                dropArea: 'Gulshan 1 Circle',
                distPickup: '2.4 km',
                distTotal: '4.2 km',
                payout: 165,
                bonus: 35,
                items: '2x Burgers, 2x Shakes',
                prepTime: 'Ready in 8 mins',
              },
            ].map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-emerald-300"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-base text-slate-900">
                      {req.restaurant}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Pickup {req.distPickup} away
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {req.prepTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Deliver to: <strong className="text-slate-800">{req.dropArea}</strong> • Total {req.distTotal}
                  </p>
                  <p className="text-[11px] text-slate-400">📦 {req.items}</p>
                </div>

                <div className="flex items-center gap-4 sm:border-l sm:border-slate-100 sm:pl-5">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">TOTAL FARE</span>
                    <span className="font-display font-black text-xl text-emerald-600 block">
                      {formatBDT(req.payout + req.bonus)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      (Includes +৳{req.bonus} bonus)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Accepted trip from ${req.restaurant}! GPS navigation started.`, 'success');
                      setActiveTab('mission');
                    }}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap"
                  >
                    Accept Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: WALLET & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          {/* Wallet Balance Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Khabar Rider Wallet • রহিম শেখ
                </span>
                <div className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white mt-1">
                  {formatBDT(walletBalance)}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Available for instant cash-out to your bKash or Nagad wallet.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Withdraw to bKash / Nagad</span>
                </button>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <StatCard
              title="Today's Fare"
              value={formatBDT(1650)}
              icon={<DollarSign className="w-5 h-5" />}
              trend={{ value: '18%', isPositive: true }}
              subtext="14 completed trips"
              accent="emerald"
            />
            <StatCard
              title="Customer Tips"
              value={formatBDT(290)}
              icon={<Sparkles className="w-5 h-5" />}
              trend={{ value: '24%', isPositive: true }}
              subtext="100% kept by rider"
              accent="brand"
            />
            <StatCard
              title="Rain & Peak Bonus"
              value={formatBDT(250)}
              icon={<Award className="w-5 h-5" />}
              subtext="Dhaka peak hours"
              accent="amber"
            />
            <StatCard
              title="COD Cash in Hand"
              value={formatBDT(1840)}
              icon={<Shield className="w-5 h-5" />}
              subtext="To settle with hub"
              accent="blue"
            />
          </div>

          {/* Weekly Payout Ledger */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <h4 className="font-display font-black text-base text-slate-900">
              Weekly Payout Ledger • বিকাশ বা ব্যাংক উইথড্র হিস্ট্রি
            </h4>

            <div className="divide-y divide-slate-100">
              {[
                { day: 'Monday (Today)', trips: 9, base: 1450, tips: 200, status: 'Accumulating', time: 'Active' },
                { day: 'Sunday', trips: 18, base: 2180, tips: 310, status: 'Paid to bKash', time: '11:45 PM' },
                { day: 'Saturday', trips: 22, base: 2790, tips: 450, status: 'Paid to bKash', time: '11:30 PM' },
                { day: 'Friday (Dhaka Weekend Peak)', trips: 26, base: 3420, tips: 520, status: 'Paid to Nagad', time: '11:55 PM' },
                { day: 'Thursday', trips: 16, base: 1940, tips: 210, status: 'Paid to bKash', time: '11:15 PM' },
              ].map((p, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{p.day}</span>
                    <span className="text-slate-500 text-xs">
                      {p.trips} trips • {p.time}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-black text-base text-emerald-600 block">
                      {formatBDT(p.base + p.tips)}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      p.status.includes('Paid') ? 'text-emerald-700' : 'text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: TRIP HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">
                Completed Delivery Trips
              </h3>
              <p className="text-xs text-slate-500">Verified logs of recent deliveries</p>
            </div>
          </div>

          <div className="space-y-3">
            {riderDeliveries.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{trip.restaurantName}</span>
                    <span className="text-slate-400 text-xs">→</span>
                    <span className="font-semibold text-slate-700 text-sm">{trip.dropArea}</span>
                    <StatusBadge status="DELIVERED" />
                  </div>
                  <p className="text-xs text-slate-500">
                    📍 {trip.pickupArea} to {trip.dropArea} • {trip.distanceKm} km • Completed at {trip.completedAt}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Customer Rating: {trip.customerRating} ★ • Tip: ৳{trip.tip} • Bonus: ৳{trip.bonus}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">PAYOUT EARNED</span>
                  <span className="font-display font-black text-lg text-emerald-600">
                    {formatBDT(trip.fareEarned + trip.tip + trip.bonus)}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Order #{trip.orderId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB: SCORECARD & PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <StatCard
              title="Customer Satisfaction"
              value="4.92 ★"
              icon={<Star className="w-5 h-5" />}
              subtext="Out of 5.0 (98% 5-Star)"
              accent="amber"
            />
            <StatCard
              title="On-Time Delivery"
              value="97.4%"
              icon={<Clock className="w-5 h-5" />}
              subtext="Avg speed 18 mins"
              accent="emerald"
            />
            <StatCard
              title="Order Acceptance"
              value="99.1%"
              icon={<TrendingUp className="w-5 h-5" />}
              subtext="Top 5% in Dhanmondi"
              accent="brand"
            />
            <StatCard
              title="Safety & Compliance"
              value="100%"
              icon={<Shield className="w-5 h-5" />}
              subtext="Helmet & thermal bag verified"
              accent="blue"
            />
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <h4 className="font-display font-black text-base text-slate-900">
              Unlocked Courier Badges & Honours
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20">
                  ⚡
                </div>
                <div>
                  <h5 className="font-bold text-sm text-amber-900">Dhaka Speedster</h5>
                  <p className="text-[11px] text-amber-700">Completed 100+ trips under 22 mins</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20">
                  ★
                </div>
                <div>
                  <h5 className="font-bold text-sm text-emerald-900">5-Star Champion</h5>
                  <p className="text-[11px] text-emerald-700">Over 500 perfect 5.0 customer ratings</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-600/20">
                  🛡️
                </div>
                <div>
                  <h5 className="font-bold text-sm text-blue-900">Safety First Certified</h5>
                  <p className="text-[11px] text-blue-700">Zero traffic violations & safety compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB: COURIER & BIKE PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900">
                Courier Identity & Vehicle Documents
              </h3>
              <p className="text-xs text-slate-500">Khabar Logistics Partner Verification Details</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              VERIFIED ACTIVE ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rider Full Name</span>
              <span className="text-sm font-bold text-slate-900">Md. Rahim Sheikh</span>
              <span className="text-xs text-slate-500 block">NID: 19942691829000142</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Number</span>
              <span className="text-sm font-bold text-slate-900">+880 1711-223344</span>
              <span className="text-xs text-emerald-600 font-semibold block">OTP Verification Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Motorbike Details</span>
              <span className="text-sm font-bold text-slate-900">Honda CB Shine (125cc, 2022)</span>
              <span className="text-xs text-slate-500 block">Plate: Dhaka Metro-H-44-1290</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Driving License</span>
              <span className="text-sm font-bold text-slate-900">BRTA Professional (Motorcycle)</span>
              <span className="text-xs text-emerald-600 font-semibold block">Valid till: Dec 2028 ✓</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Thermal Bag & Gear</span>
              <span className="text-sm font-bold text-slate-900">Khabar 45L Insulated Backpack</span>
              <span className="text-xs text-emerald-600 font-semibold block">Inspected: 10 Sep 2026 ✓</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Designated Hub & Zone</span>
              <span className="text-sm font-bold text-slate-900">Dhanmondi Hub (Sector 11)</span>
              <span className="text-xs text-slate-500 block">Hub Lead: Tanvir Ahmed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Universal AppShell */}
      <AppShell
        portal="rider"
        portalBadge="Delivery Partner"
        portalTitle="Khabar Rider"
        navItems={navItems}
        activeNavId={activeTab}
        onNavSelect={(id) => setActiveTab(id)}
        headerControls={headerControls}
      >
        {/* If Phone frame mode is toggled, display in a 390px simulated smartphone handset */}
        {deviceMode === 'phone' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-[400px] bg-slate-900 p-3 rounded-[44px] shadow-2xl border-4 border-slate-800">
              {/* Smartphone Notch / Dynamic Island */}
              <div className="w-32 h-4 bg-black rounded-full mx-auto mb-3" />
              {/* Scrollable Screen */}
              <div className="bg-slate-50 rounded-[32px] overflow-y-auto max-h-[780px] p-4 text-slate-900">
                {renderContent()}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              📱 Smartphone preview mode active • Click "Desktop" in the top bar to expand to widescreen.
            </p>
          </div>
        ) : (
          renderContent()
        )}
      </AppShell>

      {/* RIDER MODALS */}
      {/* 1. Incoming Order Broadcast Modal */}
      <IncomingOrderModal
        order={incomingDelivery}
        onAccept={(id) => {
          acceptDelivery(id);
          setActiveTab('mission');
        }}
        onDecline={(id) => {
          declineDelivery(id);
        }}
      />

      {/* 2. OTP Verification Modal */}
      {activeDelivery && (
        <OTPVerificationModal
          order={activeDelivery}
          isOpen={isOTPOpen}
          onClose={() => setIsOTPOpen(false)}
          onVerifySuccess={handleVerifySuccess}
        />
      )}

      {/* 3. SOS & Safety Emergency Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        order={activeDelivery}
      />

      {/* 4. Wallet Withdrawal Cashout Modal */}
      <WalletWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={walletBalance}
      />
    </>
  );
};
