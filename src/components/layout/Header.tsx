import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingBag,
  Heart,
  Calendar,
  Percent,
  Store,
  ChevronDown,
  User,
  Bell,
  Globe,
  LayoutDashboard,
  ChefHat,
  Bike,
  ShieldCheck,
} from 'lucide-react';
import { useKhabar, PortalMode } from '../../context/KhabarContext';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    selectedLocation,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    cartCount,
    total,
    setIsCartOpen,
    favoriteRestaurantIds,
    formatBDT,
    language,
    toggleLanguage,
    t,
    portalMode,
    setPortalMode,
    user,
    setIsAuthModalOpen,
    setIsNotificationDrawerOpen,
    unreadNotificationsCount,
    restaurants,
    openRestaurantDetail,
  } = useKhabar();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);

  // Live quick search matches
  const searchResults = searchQuery.trim()
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.bengaliName.includes(searchQuery) ||
          r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
          r.menuItems.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('restaurants');
      setIsSearchFocused(false);
    }
  };

  const portalOptions: { mode: PortalMode; label: string; icon: React.ReactNode; badge: string }[] = [
    { mode: 'customer', label: 'Customer App', icon: <ShoppingBag className="w-4 h-4 text-brand-600" />, badge: 'Live UI' },
    { mode: 'partner', label: 'Restaurant Partner', icon: <ChefHat className="w-4 h-4 text-amber-600" />, badge: 'Kitchen POS' },
    { mode: 'rider', label: 'Rider Delivery', icon: <Bike className="w-4 h-4 text-emerald-600" />, badge: 'Rider App' },
    { mode: 'admin', label: 'Admin Management', icon: <LayoutDashboard className="w-4 h-4 text-purple-600" />, badge: 'Control Hub' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-card">
      {/* Top micro bar for location & portal selector */}
      <div className="bg-slate-50 border-b border-slate-100/80 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          {/* Deliver to address */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 font-medium hover:text-brand-600 transition-colors group shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 hidden sm:inline">{t.deliverTo}:</span>
            <strong className="text-slate-900 underline decoration-dotted decoration-brand-400 underline-offset-2">
              {selectedLocation.name}, {selectedLocation.city}
            </strong>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-brand-600 transition-colors" />
          </button>

          {/* Right micro tools: Language toggle & Multi-portal switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-600 transition-colors font-semibold text-[11px]"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white hover:bg-black transition-all font-semibold text-[11px] shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Portal:</span>
                <span className="capitalize">{portalMode}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPortalDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch App Surface
                  </div>
                  {portalOptions.map((opt) => (
                    <button
                      key={opt.mode}
                      onClick={() => {
                        setPortalMode(opt.mode);
                        setIsPortalDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                        portalMode === opt.mode
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                        {opt.badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black text-xl tracking-tight shadow-md group-hover:bg-brand-700 transition-colors">
              খ
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-black text-2xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  KHABAR
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-600 mb-2"></span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 block -mt-1 font-sans">
                {t.tagline}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentView === 'home'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('restaurants')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentView === 'restaurants' || currentView === 'restaurant-detail'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => navigateTo('offers')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                currentView === 'offers'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-brand-600" />
              <span>Offers</span>
            </button>
            <button
              onClick={() => navigateTo('reservations')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                currentView === 'reservations'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Dine-in Pass</span>
            </button>
          </nav>
        </div>

        {/* Center Search Bar (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 rounded-full border border-transparent focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          </form>

          {/* Live Search Autocomplete Popover */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <span className="text-[11px] font-bold text-slate-400 px-3 py-1 block uppercase tracking-wider">
                Matching Kitchens & Foods
              </span>
              {searchResults.map((rest) => (
                <button
                  key={rest.id}
                  onClick={() => {
                    openRestaurantDetail(rest.id);
                    setIsSearchFocused(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <img src={rest.logo} alt={rest.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-bold text-xs text-slate-900 block truncate">
                      {rest.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {rest.cuisine.join(' • ')} • {rest.deliveryTime}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-500">★ {rest.rating}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2 rounded-full text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Favorites (Desktop) */}
          <button
            onClick={() => navigateTo('favorites')}
            className="hidden sm:flex p-2 rounded-full text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors relative"
            title="Favorites"
          >
            <Heart className="w-5 h-5" />
            {favoriteRestaurantIds.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>

          {/* User Profile / Login */}
          {user.isLoggedIn ? (
            <button
              onClick={() => navigateTo('profile')}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all"
            >
              Sign In
            </button>
          )}

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{formatBDT(total)}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-brand-700 font-black text-[11px] flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
