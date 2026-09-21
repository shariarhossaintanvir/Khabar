import React, { useState } from 'react';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, Download, MapPin, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { audioEngine } from '../../utils/audio';

export const Scene10ReservationSection: React.FC = () => {
  const { makeReservation, activeReservation, isReservationSuccessOpen, setIsReservationSuccessOpen } = useStore();

  const [date, setDate] = useState('2026-09-26');
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(4);
  const [seating, setSeating] = useState<'COURTYARD' | 'JAMDANI_LOUNGE' | 'BRASS_VAULT'>('COURTYARD');
  const [specialRequest, setSpecialRequest] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const seatingOptions: {
    id: 'COURTYARD' | 'JAMDANI_LOUNGE' | 'BRASS_VAULT';
    bengaliTitle: string;
    englishTitle: string;
    desc: string;
    feature: string;
  }[] = [
    {
      id: 'COURTYARD',
      bengaliTitle: 'ঐতিহ্য চত্বর',
      englishTitle: 'Heritage Courtyard',
      desc: 'Handcrafted terracotta walls, central reflection pool, and fragrant night jasmine.',
      feature: 'Live Shehnai & Sitar Ambiance',
    },
    {
      id: 'JAMDANI_LOUNGE',
      bengaliTitle: 'জামদানি লাউঞ্জ',
      englishTitle: 'Jamdani Silk Lounge',
      desc: 'Semi-private woven silk canopies with warm brass pradip lamp glow overlooking Gulshan.',
      feature: 'Garden Terrace Breeze',
    },
    {
      id: 'BRASS_VAULT',
      bengaliTitle: 'শাহী ভল্ট',
      englishTitle: 'Shahi Brass Vault',
      desc: 'Exclusive heirloom chamber with antique Old Dhaka brass kacchi serveware and personal butler.',
      feature: 'Dedicated Table Concierge',
    },
  ];

  const timeSlots = [
    { value: '12:30', label: '12:30 PM — Afternoon Dawat' },
    { value: '14:00', label: '02:00 PM — Friday Lunch Feast' },
    { value: '19:30', label: '07:30 PM — Sunset Dining' },
    { value: '20:30', label: '08:30 PM — Prime Dawat Hour' },
    { value: '21:30', label: '09:30 PM — Late Night Dum Feast' },
    { value: '22:30', label: '10:30 PM — Midnight Shahi Service' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর প্রদান করুন (Please provide your name and phone number).');
      return;
    }

    makeReservation({
      date,
      time,
      guests,
      seating,
      specialRequest,
      guestName,
      guestPhone,
    });
  };

  return (
    <section
      id="scene-reservation"
      className="relative min-h-screen py-32 px-6 md:px-12 max-w-5xl mx-auto z-10 select-none"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-brass/30 backdrop-blur-md mb-4">
          <Calendar className="w-3.5 h-3.5 text-terracotta" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold text-ivory-200">
            SCENE 10 — VIP TABLE RESERVATION • টেবিল বুকিং
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl text-ivory-100 font-bold tracking-tight">
          Reserve Your Royal Dawat
        </h2>
        <div className="font-bengali text-lg text-brass font-medium mt-1">
          গুলশান-২ ফ্ল্যাগশিপ শাখায় আপনার আসন নিশ্চিত করুন
        </div>
        <p className="mt-3 text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed">
          The 3D camera glides over hand-carved teakwood and glowing brass oil lamps. 
          Book your private dining table at RASA to experience the timeless hospitality of Bengal.
        </p>
      </div>

      {/* RESERVATION CONSOLE FORM */}
      <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 shadow-2xl border border-brass/30">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seating Zone Cards */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-3">
              1. Select Dining Atmosphere • পরিবেশ নির্বাচন
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seatingOptions.map((opt) => {
                const isSelected = seating === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => {
                      audioEngine.playClick();
                      setSeating(opt.id);
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brass bg-brass/15 text-ivory-100 shadow-lg scale-[1.02] ring-1 ring-brass/40'
                        : 'border-white/10 bg-dark-900/50 text-ivory-300 hover:border-brass/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-serif font-bold text-sm text-ivory-100 block">
                          {opt.englishTitle}
                        </span>
                        <span className="font-bengali text-xs text-brass-light font-medium">
                          {opt.bengaliTitle}
                        </span>
                      </div>
                      {isSelected && <Sparkles className="w-4 h-4 text-brass" />}
                    </div>
                    <p className="text-[11px] text-ivory-400 font-sans mt-2 leading-relaxed">
                      {opt.desc}
                    </p>
                    <span className="inline-block mt-3 text-[10px] font-sans text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full border border-terracotta/20">
                      {opt.feature}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Time & Guests Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brass" />
                Date • তারিখ
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-white/10 text-ivory-100 text-xs font-sans focus:outline-none focus:border-brass transition-colors"
                required
              />
            </div>

            {/* Guests Counter */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brass" />
                Dawat Party Size • অতিথি সংখ্যা
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-white/10 text-ivory-100 text-xs font-sans focus:outline-none focus:border-brass transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((num) => (
                  <option key={num} value={num} className="bg-dark-950 text-ivory-100">
                    {num} {num === 1 ? 'Guest (Solo Tasting)' : num <= 4 ? 'Guests (Intimate Table)' : 'Guests (Family Dawat Banquet)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brass" />
                Dining Time • সময়সূচি
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-white/10 text-ivory-100 text-xs font-sans focus:outline-none focus:border-brass transition-colors"
              >
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value} className="bg-dark-950 text-ivory-100">
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-2">
                Guest Full Name • আপনার পূর্ণ নাম
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvir Ahmed Chowdhury"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-white/10 text-ivory-100 text-xs font-sans placeholder:text-ivory-400/40 focus:outline-none focus:border-brass transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-2">
                Dhaka Mobile Number • মোবাইল নম্বর
              </label>
              <input
                type="tel"
                placeholder="+880 1712-345678"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-white/10 text-ivory-100 text-xs font-sans placeholder:text-ivory-400/40 focus:outline-none focus:border-brass transition-colors"
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-sans font-bold text-ivory-300 mb-2">
              Special Dawat Requests & Dietary Notes • বিশেষ অনুরোধ
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Birthday celebration, extra beresta on Kacchi, mild spice for grandparents, traditional Chilimchi handwashing basin requested..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-white/10 text-ivory-100 text-xs font-sans placeholder:text-ivory-400/40 focus:outline-none focus:border-brass transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-ivory-100 text-dark-950 font-sans text-xs font-bold tracking-widest uppercase hover:bg-brass transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.35)] hover:shadow-[0_0_50px_rgba(197,160,89,0.55)] focus:outline-none transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-terracotta" />
              <span>Confirm RASA Table Reservation • রিজার্ভেশন নিশ্চিত করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {isReservationSuccessOpen && activeReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="glass-panel-gold rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl border border-brass/40">
            <div className="w-16 h-16 rounded-full bg-brass/20 border border-brass mx-auto flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(197,160,89,0.4)]">
              <CheckCircle2 className="w-8 h-8 text-brass" />
            </div>

            <span className="text-[10px] uppercase font-sans tracking-widest text-terracotta font-bold block mb-1">
              DAWAT RESERVATION CONFIRMED • বুকিং সফল হয়েছে
            </span>
            <h3 className="font-serif text-3xl font-bold text-ivory-100 mb-1">
              Your Table Is Prepared
            </h3>
            <p className="font-bengali text-sm text-brass mb-3">
              স্বাগতম! রস-এর পরিবার আপনার অপেক্ষায় রয়েছে
            </p>
            <p className="text-xs text-ivory-300 font-sans mb-6 leading-relaxed">
              The flickering brass oil lamp on your handcrafted teak table has been lit. 
              Our maître d’ will welcome you at the Gulshan-2 sanctuary entrance.
            </p>

            {/* Voucher Card */}
            <div className="bg-dark-950/95 border border-white/10 rounded-2xl p-5 text-left font-sans text-xs space-y-2.5 mb-6 shadow-inner">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ivory-400">Pass Voucher ID:</span>
                <span className="text-brass font-mono font-bold tracking-wider">{activeReservation.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ivory-400">Dawat Host:</span>
                <span className="text-ivory-100 font-semibold">{activeReservation.guestName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ivory-400">Date & Slot:</span>
                <span className="text-ivory-100">{activeReservation.date} at {activeReservation.time}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ivory-400">Atmosphere:</span>
                <span className="text-brass-light font-medium">
                  {activeReservation.seating === 'COURTYARD'
                    ? 'Heritage Courtyard (ঐতিহ্য চত্বর)'
                    : activeReservation.seating === 'JAMDANI_LOUNGE'
                    ? 'Jamdani Silk Lounge (জামদানি লাউঞ্জ)'
                    : 'Shahi Brass Vault (শাহী ভল্ট)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory-400">Location:</span>
                <span className="text-ivory-200 flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-terracotta" />
                  House 42, Road 11, Gulshan-2, Dhaka
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  alert(`Calendar invite saved for Dawat Pass #${activeReservation.id} at RASA Gulshan-2!`);
                }}
                className="w-full py-3 rounded-full border border-brass/40 bg-white/5 hover:bg-brass/15 text-brass-light text-xs font-sans tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Add To Google Calendar
              </button>

              <button
                onClick={() => setIsReservationSuccessOpen(false)}
                className="w-full py-3 rounded-full bg-ivory-100 text-dark-950 text-xs font-sans font-bold tracking-widest uppercase hover:bg-brass transition-colors"
              >
                Return to Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
