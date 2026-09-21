import React, { useState, useEffect } from 'react';
import {
  Clock,
  Check,
  Phone,
  MessageSquare,
  MapPin,
  Bike,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Send,
  X,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';

export const OrderTrackingView: React.FC = () => {
  const {
    activeTrackingOrder,
    orders,
    navigateTo,
    formatBDT,
    showToast,
    openReviewModal,
    updateOrderStatus,
  } = useKhabar();

  const [eta, setEta] = useState(24);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'rider' | 'me'; text: string; time: string }[]>([
    {
      sender: 'rider',
      text: 'Salam! I have picked up your warm food parcel from the kitchen. I am on my way to your location.',
      time: '2 mins ago',
    },
  ]);
  const [myInput, setMyInput] = useState('');

  const order = activeTrackingOrder || orders[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => Math.max(4, prev - 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display font-bold text-xl text-slate-900">No active orders to track</h2>
        <button
          onClick={() => navigateTo('restaurants')}
          className="mt-4 px-6 py-2 rounded-full bg-brand-600 text-white text-xs font-bold"
        >
          Explore Food
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'PLACED', title: 'Order Placed', bengali: 'অর্ডার গৃহীত', desc: 'Received by system' },
    { id: 'CONFIRMED', title: 'Restaurant Confirmed', bengali: 'রেস্তোরাঁ নিশ্চিত করেছে', desc: 'Order sent to kitchen' },
    { id: 'PREPARING', title: 'Preparing Food', bengali: 'রান্না চলছে', desc: 'Degh unsealed & freshly packed' },
    { id: 'PICKED_UP', title: 'Rider Picked Up', bengali: 'রাইডার খাবার নিয়েছে', desc: 'Stored in thermal heated box' },
    { id: 'ON_THE_WAY', title: 'On the Way', bengali: 'পথে রয়েছে', desc: 'Heading towards your location' },
    { id: 'DELIVERED', title: 'Delivered', bengali: 'ডেলিভারি সম্পন্ন', desc: 'Enjoy your hot meal!' },
  ];

  const statusOrder = ['PLACED', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
  const currentStepIndex = statusOrder.indexOf(order.status);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myInput.trim()) return;
    const newMsg = { sender: 'me' as const, text: myInput, time: 'Just now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setMyInput('');

    // Rider reply simulation
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'rider' as const,
          text: 'Got it sir! Arriving in 5 minutes at your gate.',
          time: 'Just now',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('orders')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Orders</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Order #{order.id}
          </span>
        </div>

        {/* 1. HERO STATUS CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE DELIVERY STATUS</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight pt-1">
              {order.status === 'DELIVERED' ? 'Order Delivered!' : `Estimated Arrival in ${eta} Mins`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Your order from <strong className="text-slate-900">{order.restaurantName}</strong> is en route.
            </p>

            {/* Stage simulation fast-forward buttons for demo review */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Simulate Status:</span>
              {(['PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => updateOrderStatus(order.id, st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.status === st ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shrink-0 shadow-inner">
            <Bike className="w-8 h-8 sm:w-10 sm:h-10 animate-subtle" />
          </div>
        </div>

        {/* 2. 2D VECTOR DHAKA ROUTE MAP VISUAL */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-card overflow-hidden relative">
          <div className="w-full h-56 sm:h-64 rounded-2xl bg-slate-100 relative overflow-hidden flex items-center justify-center border border-slate-200">
            {/* Map Roads & Waterway */}
            <svg viewBox="0 0 600 280" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="600" height="280" fill="#f8fafc" />

              {/* Road Grid */}
              <line x1="40" y1="70" x2="560" y2="70" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="6 4" />
              <line x1="40" y1="150" x2="560" y2="150" stroke="#e2e8f0" strokeWidth="6" />
              <line x1="40" y1="220" x2="560" y2="220" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="6 4" />
              <line x1="140" y1="20" x2="140" y2="260" stroke="#e2e8f0" strokeWidth="5" />
              <line x1="300" y1="20" x2="300" y2="260" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="460" y1="20" x2="460" y2="260" stroke="#e2e8f0" strokeWidth="5" />

              {/* Dhanmondi Lake representation */}
              <path d="M 230,20 Q 270,140 240,260" stroke="#bfdbfe" strokeWidth="16" strokeLinecap="round" />

              {/* Active Delivery Route Curve */}
              <path d="M 100,200 C 220,80 380,240 500,100" stroke="#ff4d2e" strokeWidth="5" strokeDasharray="8 5" />
            </svg>

            {/* Restaurant Origin Marker */}
            <div className="absolute left-[16%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                {order.restaurantName}
              </span>
            </div>

            {/* Destination Marker */}
            <div className="absolute left-[83%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                Your Delivery Address
              </span>
            </div>

            {/* Rider moving marker */}
            <div className="absolute left-[54%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-200">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow mt-1 whitespace-nowrap">
                Md. Rahim (En Route)
              </span>
            </div>
          </div>
        </div>

        {/* 3. TIMELINE STEPS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <h3 className="font-display font-bold text-base text-slate-900 mb-6">
            Delivery Progression Timeline
          </h3>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="relative pl-6">
                  {/* Step dot */}
                  <div
                    className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-brand-600 border-brand-600 text-white flex items-center justify-center'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-display font-bold text-sm ${
                            isCurrent ? 'text-brand-600 font-black' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="font-bengali text-xs text-slate-400">({step.bengali})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>

                    {isCurrent && (
                      <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full w-fit">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. RIDER CARD & REVIEW TRIGGER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rider Profile with Call & Chat */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                MR
              </div>
              <div>
                <span className="font-display font-bold text-sm text-slate-900 block">
                  {order.riderName || 'Md. Rahim Uddin'}
                </span>
                <span className="text-xs text-slate-500 block">
                  ★ 4.96 • {order.riderVehicle || 'Honda CG125'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  1,400+ successful Dhaka deliveries
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(`Connecting call to courier ${order.riderName || 'Md. Rahim Uddin'}: ${order.riderPhone || '+880 1819-223344'}...`, 'info');
                }}
                className="p-3 rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors shadow-2xs"
                title="Call Rider"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="p-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shadow-2xs"
                title="Message Rider"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery Details & Review */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between text-xs space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Delivering To:</span>
                <span className="font-semibold text-slate-900 text-right truncate max-w-[200px]">{order.deliveryAddress}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Payment:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-400">Total:</span>
                <span className="font-display font-black text-sm text-brand-600">{formatBDT(order.total)}</span>
              </div>
            </div>

            {order.status === 'DELIVERED' && (
              <button
                onClick={() => openReviewModal(order)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Rate & Review This Meal</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. LIVE CHAT MODAL WITH RIDER */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[480px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    MR
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                      Md. Rahim Uddin (Rider)
                    </h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online • On Motorbike
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-200/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'me'
                          ? 'bg-brand-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick responses */}
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto hide-scrollbar">
                {['Please call upon arrival', 'Leave at main gate', 'I am on the 5th floor'].map((txt) => (
                  <button
                    key={txt}
                    onClick={() => {
                      setChatMessages((prev) => [
                        ...prev,
                        { sender: 'me', text: txt, time: 'Just now' },
                      ]);
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium"
                  >
                    {txt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to rider..."
                  value={myInput}
                  onChange={(e) => setMyInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-100 rounded-xl focus:outline-none focus:bg-white border border-transparent focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
