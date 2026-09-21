import React, { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, Compass, Bike, UtensilsCrossed, Clock, Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { audioEngine } from '../../utils/audio';

export const DeliveryTrackerModal: React.FC = () => {
  const { activeOrder, isTrackingOpen, setIsTrackingOpen, formatBDT } = useStore();
  const [vehicleProgress, setVehicleProgress] = useState(0.25); // 0 to 1 along bezier path
  const [etaCountdown, setEtaCountdown] = useState(28);

  // Trigger celebration confetti on modal open
  useEffect(() => {
    if (isTrackingOpen && activeOrder) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#c85a32', '#fbf8f2', '#1b3b2b'],
      });
    }
  }, [isTrackingOpen, activeOrder]);

  // Animate courier vehicle progression along Dhaka route
  useEffect(() => {
    if (!isTrackingOpen) return;
    const interval = setInterval(() => {
      setVehicleProgress((prev) => {
        if (prev >= 0.92) return 0.92;
        return prev + 0.012;
      });
      setEtaCountdown((prev) => Math.max(6, prev - 1));
    }, 2200);
    return () => clearInterval(interval);
  }, [isTrackingOpen]);

  if (!isTrackingOpen || !activeOrder) return null;

  const timelineSteps = [
    { id: 'CONFIRMED', title: 'ORDER ACCEPTED', bengali: 'অর্ডার গৃহীত', desc: 'Received at RASA Gulshan-2 Kitchen' },
    { id: 'PREPARING', title: 'IN KITCHEN DUM', bengali: 'দম থেকে খোলা হচ্ছে', desc: 'Degh unsealed & packed in thermal clay pot' },
    { id: 'OUT_FOR_DELIVERY', title: 'ON DHAKA ROADS', bengali: 'ডেলিভারিতে রয়েছে', desc: 'Rider en route via Gulshan Avenue' },
    { id: 'DELIVERED', title: 'SERVED FRESH', bengali: 'ডেলিভারি সম্পন্ন', desc: 'Enjoy your authentic Bengali feast' },
  ];

  const currentStepIdx =
    activeOrder.status === 'CONFIRMED'
      ? 0
      : activeOrder.status === 'PREPARING'
      ? 1
      : activeOrder.status === 'OUT_FOR_DELIVERY'
      ? 2
      : 3;

  // Dhaka city route curve coordinates (RASA Gulshan-2 -> Destination)
  const p0 = { x: 60, y: 220 }; // RASA Gulshan 2
  const p1 = { x: 180, y: 90 };  // Gulshan-1 Circle
  const p2 = { x: 310, y: 270 }; // Mohakhali / Banani flyover
  const p3 = { x: 440, y: 100 }; // Customer Destination

  const t = vehicleProgress;
  const cx =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;
  const cy =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[820px] glass-panel-gold rounded-3xl overflow-hidden flex flex-col justify-between shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-brass/40">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setIsTrackingOpen(false);
          }}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-dark-900/80 border border-white/10 hover:border-brass text-ivory-200 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER: ORDER NUMBER & ETA */}
        <div className="p-6 sm:p-8 pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-dark-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-ping" />
              <span className="text-[10px] uppercase font-sans tracking-widest text-terracotta font-bold">
                LIVE DHAKA GPS COURIER TRACKING • লাইভ ট্র্যাকিং
              </span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-ivory-100 mt-1">
              Order #{activeOrder.id}
            </h3>
            <span className="text-xs text-ivory-300 font-sans">
              Delivery to {activeOrder.customerName} • {activeOrder.deliveryArea.name} ({formatBDT(activeOrder.total)})
            </span>
          </div>

          <div className="flex items-center gap-4 bg-dark-950 px-5 py-3 rounded-2xl border border-brass/30 shadow-inner">
            <Clock className="w-5 h-5 text-brass" />
            <div>
              <span className="text-[9px] uppercase font-sans tracking-widest text-ivory-400 block">
                Estimated Arrival In
              </span>
              <span className="font-serif text-2xl font-bold text-brass-light">
                {etaCountdown} MINS
              </span>
            </div>
          </div>
        </div>

        {/* 2.5D / 3D STYLIZED DHAKA CITY MAP & VEHICLE ANIMATION */}
        <div className="flex-1 relative overflow-hidden bg-radial from-dark-900 to-dark-950 flex items-center justify-center p-4">
          <div className="w-full max-w-lg aspect-[16/10] relative rounded-2xl bg-dark-950/95 border border-white/10 p-4 shadow-2xl overflow-hidden">
            {/* Background Map Grid & Dhaka Thoroughfares */}
            <svg
              viewBox="0 0 500 320"
              className="w-full h-full text-white/5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* City Roads Grid */}
              <line x1="20" y1="80" x2="480" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="160" x2="480" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="240" x2="480" y2="240" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="120" y1="20" x2="120" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="260" y1="20" x2="260" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="380" y1="20" x2="380" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

              {/* Gulshan Lake indication */}
              <path
                d="M 190,40 Q 220,150 200,280"
                stroke="#1b3b2b"
                strokeWidth="18"
                strokeOpacity="0.4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Glowing Dhaka Route Path Shadow */}
              <path
                d="M 60,220 C 180,90 310,270 440,100"
                stroke="#c85a32"
                strokeWidth="8"
                strokeOpacity="0.3"
                fill="none"
              />
              {/* Glowing Route Path Main */}
              <path
                d="M 60,220 C 180,90 310,270 440,100"
                stroke="#c5a059"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                className="animate-pulse"
                fill="none"
              />
            </svg>

            {/* RESTAURANT ORIGIN MARKER (RASA GULSHAN 2) */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${(p0.x / 500) * 100}%`, top: `${(p0.y / 320) * 100}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-dark-900 border-2 border-brass flex items-center justify-center text-brass shadow-[0_0_15px_rgba(197,160,89,0.8)]">
                <Flame className="w-4 h-4 text-terracotta" />
              </div>
              <span className="text-[8px] font-sans font-bold text-brass tracking-wider mt-1 bg-dark-950 px-1.5 py-0.5 rounded border border-brass/30 whitespace-nowrap">
                RASA GULSHAN 2
              </span>
            </div>

            {/* CUSTOMER DESTINATION MARKER */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${(p3.x / 500) * 100}%`, top: `${(p3.y / 320) * 100}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-dark-900 border-2 border-terracotta flex items-center justify-center text-terracotta shadow-[0_0_15px_rgba(200,90,50,0.8)]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-sans font-bold text-terracotta tracking-wider mt-1 bg-dark-950 px-1.5 py-0.5 rounded border border-terracotta/30 whitespace-nowrap">
                YOUR RESIDENCE
              </span>
            </div>

            {/* ANIMATED COURIER VEHICLE */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-10 flex flex-col items-center"
              style={{ left: `${(cx / 500) * 100}%`, top: `${(cy / 320) * 100}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-terracotta text-dark-950 flex items-center justify-center shadow-[0_0_20px_rgba(200,90,50,1)] ring-4 ring-terracotta/25">
                <Bike className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[8px] font-sans font-extrabold text-white bg-dark-950 px-2 py-0.5 rounded-full border border-brass mt-1 whitespace-nowrap shadow-md">
                Md. Rahim • Honda CG125
              </span>
            </div>
          </div>
        </div>

        {/* TIMELINE & RIDER INFO BAR */}
        <div className="p-6 sm:p-8 pt-4 border-t border-white/10 bg-dark-900/70 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Progress Timeline */}
          <div className="w-full md:flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timelineSteps.map((step, idx) => {
              const isPastOrCurrent = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-brass bg-brass/15 shadow-md'
                      : isPastOrCurrent
                      ? 'border-white/20 bg-dark-950'
                      : 'border-white/5 bg-transparent opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {isPastOrCurrent ? (
                      <Check className="w-3 h-3 text-brass stroke-[3]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-ivory-400" />
                    )}
                    <span className="text-[9px] uppercase font-sans font-bold text-ivory-100 tracking-wider">
                      {step.title}
                    </span>
                  </div>
                  <div className="font-bengali text-[10px] text-brass-light font-medium">{step.bengali}</div>
                  <p className="text-[10px] text-ivory-400 font-sans mt-0.5">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Courier Concierge Profile */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-brass/50 overflow-hidden bg-dark-850 flex items-center justify-center bg-terracotta/20 text-brass font-bold text-sm">
                MR
              </div>
              <div>
                <span className="block font-serif font-bold text-xs text-ivory-100">
                  Md. Rahim Uddin (রহিম ভাই)
                </span>
                <span className="block text-[10px] font-sans text-brass font-semibold">
                  ★ 4.96 • Honda CG125 (Thermal Heated Case)
                </span>
                <span className="block text-[9px] text-ivory-400 font-sans">
                  1,420+ successful Dhaka deliveries
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  alert('Calling RASA Dispatch Courier Md. Rahim at +880 1819-223344...');
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-brass hover:text-dark-950 text-ivory-200 transition-colors"
                title="Call Courier"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  alert('Opening direct WhatsApp messaging channel with courier...');
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-brass hover:text-dark-950 text-ivory-200 transition-colors"
                title="Message Courier"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
