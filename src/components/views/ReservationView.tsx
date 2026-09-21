import React, { useState } from 'react';
import { Calendar, Users, Clock, Sparkles, CheckCircle2, MapPin, X, Utensils } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { RESTAURANTS } from '../../data/khabarData';

export const ReservationView: React.FC = () => {
  const { reservations, makeReservation, cancelReservation, formatBDT, navigateTo } = useKhabar();

  const [restaurantId, setRestaurantId] = useState(RESTAURANTS[0].id);
  const [date, setDate] = useState('2026-09-26');
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(4);
  const [seating, setSeating] = useState<'Indoor AC' | 'Outdoor Terrace' | 'Private Dining'>('Indoor AC');
  const [guestName, setGuestName] = useState('Tanvir Ahmed');
  const [guestPhone, setGuestPhone] = useState('+880 1712-345678');
  const [specialRequest, setSpecialRequest] = useState('');

  const [justBooked, setJustBooked] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please enter your name and mobile number.');
      return;
    }

    const res = makeReservation({
      restaurantId,
      date,
      time,
      guests,
      seating,
      guestName,
      guestPhone,
      specialRequest,
    });
    setJustBooked(res);
  };

  const seatingOptions: { id: 'Indoor AC' | 'Outdoor Terrace' | 'Private Dining'; desc: string }[] = [
    { id: 'Indoor AC', desc: 'Air-conditioned main dining hall with soft family music' },
    { id: 'Outdoor Terrace', desc: 'Open garden terrace with fresh evening breeze' },
    { id: 'Private Dining', desc: 'Exclusive closed VIP chamber for family dawats' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Table Reservations • টেবিল বুকিং</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Reserve Your Dawat Table
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Skip the waiting queue. Reserve a premium dining table at top Bangladeshi restaurants across Dhaka for family gatherings and celebrations.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Partner Restaurant
              </label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
              >
                {RESTAURANTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.bengaliName}) — {r.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Atmosphere Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Seating Preference
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {seatingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSeating(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      seating === opt.id
                        ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-1 ring-brand-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-display font-bold text-sm text-slate-900 block mb-1">
                      {opt.id}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date, Time, Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" /> Time Slot
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value="12:30">12:30 PM (Lunch)</option>
                  <option value="14:00">02:00 PM (Friday Dawat)</option>
                  <option value="19:30">07:30 PM (Dinner)</option>
                  <option value="20:30">08:30 PM (Prime Hour)</option>
                  <option value="21:30">09:30 PM (Late Dinner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-600" /> Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  placeholder="e.g. Tanvir Ahmed Chowdhury"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Mobile Number (For Confirmation SMS)
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  placeholder="+880 1712-345678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Special Requests / Occasion
              </label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Anniversary dawat, extra beresta on biryani, baby chair requested..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Confirm Table Reservation • আসন নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>

        {/* Confirmation Success Modal / Card */}
        {justBooked && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-display font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Table Confirmed! Reservation #{justBooked.id}</span>
            </div>
            <p className="text-xs text-emerald-700">
              Your table at <strong>{justBooked.restaurantName}</strong> has been booked for {justBooked.guests} guests on {justBooked.date} at {justBooked.time}.
            </p>
            <button
              onClick={() => setJustBooked(null)}
              className="text-xs font-bold text-emerald-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Existing Reservations History */}
        {reservations.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Your Booked Reservations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-900">
                        {res.restaurantName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {res.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">
                      {res.date} at {res.time} • {res.guests} Guests ({res.seating})
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {res.restaurantAddress}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">Pass: {res.id}</span>
                    {res.status === 'CONFIRMED' && (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
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
