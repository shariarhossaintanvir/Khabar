import React from 'react';
import { useKhabar } from '../../context/KhabarContext';
import { BANGLADESH_LOCATIONS, FOOD_CATEGORIES } from '../../data/khabarData';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, changeLocation } = useKhabar();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      {/* Value props banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white block">Lightning Fast</span>
            <span className="text-xs text-slate-400">Average 30-min doorstep delivery</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white block">100% Hygienic</span>
            <span className="text-xs text-slate-400">Tamper-proof thermal sealed packages</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white block">Top Rated Kitchens</span>
            <span className="text-xs text-slate-400">Vetted for authentic taste & safety</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white block">24/7 Care Hotline</span>
            <span className="text-xs text-slate-400">+880 9612-008800</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black text-lg">
              খ
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tight">
              KHABAR
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Bangladesh’s modern food delivery and table reservation ecosystem. 
            Connecting thousands of diners with authentic local biryani houses, artisan burger lounges, and top restaurants.
          </p>

          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Gulshan-2, Dhaka-1212, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>support@khabar.com.bd</span>
            </div>
          </div>
        </div>

        {/* Popular Locations */}
        <div>
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
            Top Locations
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {BANGLADESH_LOCATIONS.slice(0, 6).map((loc) => (
              <li key={loc.id}>
                <button
                  onClick={() => {
                    changeLocation(loc);
                    navigateTo('restaurants');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {loc.name} ({loc.bengaliName})
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Cuisines */}
        <div>
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
            Top Cuisines
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {FOOD_CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    navigateTo('restaurants', { categoryId: cat.id });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company & Legal */}
        <div>
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
            KHABAR Links
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('restaurants')} className="hover:text-white transition-colors">
                Browse Restaurants
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('offers')} className="hover:text-white transition-colors">
                Deals & Promo Codes
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('reservations')} className="hover:text-white transition-colors">
                Table Reservations
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('orders')} className="hover:text-white transition-colors">
                Track Live Order
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('profile')} className="hover:text-white transition-colors">
                My Account
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} KHABAR Technologies Ltd. All rights reserved. Made for Bangladesh.</p>
        <div className="flex items-center gap-4">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
          <span>•</span>
          <span>bKash & COD Supported</span>
        </div>
      </div>
    </footer>
  );
};
