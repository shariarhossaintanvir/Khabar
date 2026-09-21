import React from 'react';
import { Home, Search, Clock, Heart, User, ShoppingBag } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigateTo, cartCount, total, setIsCartOpen, orders, favoriteRestaurantIds, formatBDT } = useKhabar();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  ).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Floating Sticky Cart Bar for Mobile */}
      {cartCount > 0 && currentView !== 'checkout' && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
                {cartCount}
              </span>
              <span>View Your Bag</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatBDT(total)}</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            currentView === 'home' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => navigateTo('restaurants')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            currentView === 'restaurants' || currentView === 'restaurant-detail'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Browse</span>
        </button>

        <button
          onClick={() => navigateTo('orders')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative transition-colors ${
            currentView === 'orders' || currentView === 'tracking'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-5 h-5" />
          {activeOrdersCount > 0 && (
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          )}
          <span className="text-[10px]">Orders</span>
        </button>

        <button
          onClick={() => navigateTo('favorites')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative transition-colors ${
            currentView === 'favorites' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-5 h-5" />
          {favoriteRestaurantIds.length > 0 && (
            <span className="absolute top-0 right-2 text-[9px] font-black w-3.5 h-3.5 rounded-full bg-brand-600 text-white flex items-center justify-center">
              {favoriteRestaurantIds.length}
            </span>
          )}
          <span className="text-[10px]">Saved</span>
        </button>

        <button
          onClick={() => navigateTo('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            currentView === 'profile' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </button>
      </nav>
    </div>
  );
};
