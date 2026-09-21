import React, { useState } from 'react';
import { Sparkles, Check, Send, Flame, MapPin, Phone, Mail } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      audioEngine.playClick();
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollTo = (id: string) => {
    audioEngine.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 select-none pt-24 pb-12 border-t border-white/10 bg-dark-950/95 backdrop-blur-xl">
      {/* SCENE 15 GRAND FINALE CALL TO ACTION */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-brass/30 backdrop-blur-md mb-6">
          <Flame className="w-3.5 h-3.5 text-terracotta" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold text-ivory-200">
            SCENE 15 — THE GRAND FINALE • সমাপনী
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-ivory-100 tracking-tight">
          Come back for another bite.
        </h2>
        <div className="font-bengali text-xl sm:text-2xl text-brass font-medium mt-2">
          রস-এর আতিথেয়তায় আবারও আমন্ত্রিত
        </div>
        <p className="mt-4 text-xs sm:text-sm text-ivory-300 font-sans max-w-xl mx-auto leading-relaxed">
          The culinary journey doesn’t end here. Whether reserving an intimate dawat evening 
          or orchestrating fresh handi delivery to your home in Dhaka, authenticity remains our heartbeat.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollTo('scene-menu')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-ivory-100 text-dark-950 text-xs font-sans font-bold tracking-widest uppercase hover:bg-brass transition-all shadow-[0_0_30px_rgba(197,160,89,0.35)] focus:outline-none"
          >
            EXPLORE MENU & ORDER
          </button>
          <button
            onClick={() => scrollTo('scene-reservation')}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-brass/40 bg-dark-900/70 text-ivory-100 text-xs font-sans font-semibold tracking-widest uppercase hover:border-brass hover:bg-brass/10 transition-all focus:outline-none"
          >
            BOOK A DAWAT TABLE
          </button>
        </div>
      </div>

      {/* EDITORIAL FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-white/10">
        {/* Col 1: Brand & Heritage */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-serif tracking-widest-xl text-3xl font-black text-ivory-100 uppercase block">
              RASA
            </span>
            <span className="font-bengali text-lg text-brass font-semibold">রস</span>
          </div>
          <p className="text-xs text-ivory-400 font-sans leading-relaxed">
            Authentic Bangladesh. Reimagined. Celebrating the culinary alchemy of 
            Old Dhaka degh masters and riverine Bengal traditions.
          </p>
          <div className="pt-2">
            <span className="inline-block text-[10px] tracking-widest uppercase font-sans font-bold text-brass bg-brass/10 px-3 py-1 rounded-full border border-brass/20">
              DHAKA CULINARY EXCELLENCE 2026
            </span>
          </div>
        </div>

        {/* Col 2: Sanctuaries */}
        <div className="space-y-3 text-xs font-sans">
          <h4 className="font-serif text-sm font-bold text-ivory-100 uppercase tracking-widest">
            Sanctuaries • শাখা
          </h4>
          <div className="text-ivory-400 leading-relaxed space-y-1">
            <strong className="text-ivory-200 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta" /> Flagship Gulshan-2
            </strong>
            <span>House 42, Road 11, Gulshan-2, Dhaka-1212</span>
          </div>
          <div className="text-ivory-400 leading-relaxed space-y-1 pt-1">
            <strong className="text-ivory-200 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta" /> Banani Sanctuary
            </strong>
            <span>Plot 74, Block D, Road 11, Banani, Dhaka-1213</span>
          </div>
          <div className="text-ivory-400 leading-relaxed space-y-1 pt-1">
            <strong className="text-ivory-200 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta" /> Old Dhaka Heritage Kitchen
            </strong>
            <span>14 Nazimuddin Road, Lalbagh, Dhaka-1100</span>
          </div>
        </div>

        {/* Col 3: Hours & Helpline */}
        <div className="space-y-3 text-xs font-sans">
          <h4 className="font-serif text-sm font-bold text-ivory-100 uppercase tracking-widest">
            Dining & Delivery Hours
          </h4>
          <div className="text-ivory-400 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-ivory-200">Lunch Dawat:</strong> 12:30 PM – 4:00 PM
            </p>
            <p>
              <strong className="text-ivory-200">Dinner Dum Feast:</strong> 7:00 PM – 11:30 PM
            </p>
            <p>
              <strong className="text-ivory-200">Dhaka Fast Delivery:</strong> 12:00 PM – 1:00 AM
            </p>
            <div className="pt-2 border-t border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-brass font-medium">
                <Phone className="w-3.5 h-3.5 text-terracotta" />
                <span>+880 1700-998877</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-400 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-brass" />
                <span>concierge@rasa-bangladesh.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-3 text-xs font-sans">
          <h4 className="font-serif text-sm font-bold text-ivory-100 uppercase tracking-widest">
            RASA Dawat Circle
          </h4>
          <p className="text-ivory-400 leading-relaxed">
            Subscribe for secret Friday degh unsealings, seasonal Ilish specials, and exclusive VIP dawat invitations.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-brass-light bg-brass/10 p-3 rounded-xl border border-brass/20">
              <Check className="w-4 h-4 text-brass" />
              <span>Welcome to the Shahi Circle! Use voucher <strong>RASA15</strong> for 15% off.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-brass"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brass text-dark-950 font-bold uppercase tracking-widest text-[10px] hover:bg-brass-light transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Join Guestlist</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* COPYRIGHT & CREDITS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-ivory-400 gap-4">
        <p>
          &copy; {new Date().getFullYear()} RASA Restaurant Group Ltd. All rights reserved. Dhaka, Bangladesh.
        </p>
        <div className="flex items-center gap-4 text-brass-light">
          <span>WebGL • Three.js • React Three Fiber</span>
          <span>•</span>
          <span>Designed with Bengali Culinary Pride</span>
        </div>
      </div>
    </footer>
  );
};
