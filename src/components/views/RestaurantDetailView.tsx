import React, { useState } from 'react';
import {
  Star,
  Clock,
  Bike,
  MapPin,
  Heart,
  Share2,
  Plus,
  Search,
  Check,
  ShieldCheck,
  Flame,
  Calendar,
  Sparkles,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { MenuItem, RESTAURANTS } from '../../data/khabarData';

export const RestaurantDetailView: React.FC = () => {
  const {
    activeRestaurant,
    openFoodModal,
    addToCart,
    toggleFavoriteRestaurant,
    isRestaurantFavorited,
    formatBDT,
    showToast,
    navigateTo,
    restaurants,
  } = useKhabar();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState('');

  const restaurant = activeRestaurant || restaurants[0] || RESTAURANTS[0];
  const isFav = isRestaurantFavorited(restaurant.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Restaurant link copied to clipboard!');
  };

  // Filter items by category & search
  const filteredMenuItems = restaurant.menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.bengaliName.includes(menuSearch) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = activeCategory === 'All' || item.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const allCategories = ['All', ...restaurant.menuCategories];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. RESTAURANT HEADER BANNER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Cover Photo */}
          <div className="relative h-56 sm:h-72 w-full bg-slate-100 overflow-hidden sm:rounded-b-3xl">
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Back button */}
            <button
              onClick={() => navigateTo('restaurants')}
              className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-slate-800 hover:bg-white shadow transition-transform active:scale-95"
            >
              ← Back
            </button>

            {/* Quick Actions (Share & Favorite) */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md text-slate-700 hover:bg-white flex items-center justify-center shadow transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleFavoriteRestaurant(restaurant.id)}
                className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-600 flex items-center justify-center shadow transition-colors"
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-brand-600 text-brand-600' : ''}`} />
              </button>
            </div>

            {/* Offer badge on cover */}
            {restaurant.offerText && (
              <div className="absolute bottom-4 left-4 sm:left-8">
                <span className="text-xs sm:text-sm font-black text-white bg-brand-600 px-3.5 py-1 rounded-xl shadow-md">
                  🎉 {restaurant.offerText}
                </span>
              </div>
            )}
          </div>

          {/* Details Bar */}
          <div className="px-4 sm:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                  {restaurant.name}
                </h1>
                <span className="font-bengali text-sm text-brand-600 font-bold bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
                  {restaurant.bengaliName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    restaurant.isOpen
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {restaurant.isOpen ? 'OPEN NOW' : 'CLOSED'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {restaurant.aboutText}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {restaurant.rating} ★ · {(restaurant.reviewsCount / 1000).toFixed(1)}K+ reviews
                </span>
                <span>•</span>
                <span className="font-medium text-slate-700">
                  {restaurant.cuisine.join(', ')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {restaurant.address}
                </span>
              </div>
            </div>

            {/* Delivery Stats & Dine-in Reservation CTA */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 shrink-0">
              <div className="text-center px-2 sm:px-3 border-r border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Time</span>
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {restaurant.deliveryTime}
                </span>
              </div>

              <div className="text-center px-2 sm:px-3 border-r border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Fee</span>
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bike className="w-3.5 h-3.5 text-slate-500" />
                  {restaurant.deliveryFee === 0 || restaurant.freeDelivery ? 'Free' : formatBDT(restaurant.deliveryFee)}
                </span>
              </div>

              <button
                onClick={() => navigateTo('reservations', { restaurantId: restaurant.id })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Book Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY CATEGORY NAV & MENU SEARCH */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Horizontal Category Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search inside menu */}
          <div className="relative w-44 sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search in menu..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 rounded-full border border-transparent focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. MENU DISHES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-xl text-slate-900">
              {activeCategory === 'All' ? 'Full Menu & Specials' : activeCategory}
            </h2>
            <span className="text-xs text-slate-500">
              {filteredMenuItems.length} dishes available
            </span>
          </div>
        </div>

        {filteredMenuItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No menu items matching your search. Try another query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item: MenuItem) => (
              <div
                key={item.id}
                onClick={() => openFoodModal(item, restaurant)}
                className="group cursor-pointer bg-white rounded-2xl p-4 border border-slate-200/80 food-card-shadow flex justify-between gap-4 transition-all"
              >
                {/* Left Food Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.isPopular && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          POPULAR
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-rose-500" /> SPICY
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="font-bengali text-xs text-slate-500 font-medium line-clamp-1">
                      {item.bengaliName}
                    </div>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="font-display font-black text-sm sm:text-base text-slate-900">
                        {formatBDT(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {formatBDT(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Food Photo & Add Button */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFoodModal(item, restaurant);
                    }}
                    className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-brand-600 hover:text-white transition-all flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. RESTAURANT REVIEWS SECTION */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">
                Customer Ratings & Reviews
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified reviews from real diners who ordered from {restaurant.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Rating Summary Box */}
            <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-center text-center">
              <span className="font-display font-black text-5xl text-slate-900">
                {restaurant.rating}
              </span>
              <div className="flex justify-center gap-1 text-amber-400 text-lg my-1.5">
                ★ ★ ★ ★ ★
              </div>
              <span className="text-xs text-slate-500">
                Based on {restaurant.reviewsCount.toLocaleString()} verified ratings
              </span>

              <div className="mt-4 space-y-1.5 text-left text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold">5 ★</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-2 rounded-full w-[85%]" />
                  </div>
                  <span className="w-8 text-right font-semibold">85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold">4 ★</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-2 rounded-full w-[11%]" />
                  </div>
                  <span className="w-8 text-right font-semibold">11%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold">3 ★</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-2 rounded-full w-[3%]" />
                  </div>
                  <span className="w-8 text-right font-semibold">3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold">2 ★</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-2 rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-right font-semibold">1%</span>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="md:col-span-8 space-y-3">
              {restaurant.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-display font-bold text-xs sm:text-sm text-slate-900 block">
                          {rev.userName}
                        </span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                      <span>★</span>
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
