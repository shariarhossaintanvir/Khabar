import React, { useState } from 'react';
import {
  Search,
  Flame,
  ArrowRight,
  Heart,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Percent,
  Plus,
  ThumbsUp,
  Tag,
  Award,
} from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import {
  FOOD_CATEGORIES,
  BEST_DEALS,
  PROMO_BANNERS,
  FoodCategory,
  Restaurant,
  MenuItem,
  DealItem,
} from '../../data/khabarData';

export const HomeView: React.FC = () => {
  const {
    selectedLocation,
    searchQuery,
    setSearchQuery,
    navigateTo,
    openRestaurantDetail,
    toggleFavoriteRestaurant,
    isRestaurantFavorited,
    formatBDT,
    openFoodModal,
    addToCart,
    t,
    restaurants,
  } = useKhabar();

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [budgetTab, setBudgetTab] = useState<150 | 250 | 350>(250);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('restaurants');
    }
  };

  const handleCategoryClick = (category: FoodCategory) => {
    navigateTo('restaurants', { categoryId: category.id });
  };

  const featuredBanner = PROMO_BANNERS[activeBannerIdx] || PROMO_BANNERS[0];

  // Section collections
  const popularRestaurants = restaurants.filter((r) => r.isPopular).slice(0, 8);
  const freeDeliveryRestaurants = restaurants.filter((r) => r.deliveryFee === 0 || r.freeDelivery).slice(0, 4);
  const topRatedRestaurants = restaurants.filter((r) => r.rating >= 4.8).slice(0, 4);

  // Popular Food Items (dish level cards)
  const popularFoodItems: MenuItem[] = restaurants.flatMap((r) => r.menuItems).filter((m) => m.isPopular).slice(0, 8);

  // Budget friendly items
  const budgetItems = restaurants
    .flatMap((r) => r.menuItems)
    .filter((m) => m.price <= budgetTab)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white via-surface-warm to-slate-100/60 pt-6 sm:pt-12 pb-10 sm:pb-16 px-4 sm:px-6 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold shadow-xs">
              <Flame className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>Doorstep Delivery in {selectedLocation.name}, {selectedLocation.city}</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
              {t.heroHeadingLine1} <br className="hidden sm:inline" />
              <span className="text-brand-600 underline decoration-brand-300 decoration-wavy underline-offset-8">
                {t.heroHeadingLine2}
              </span>
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Main Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto lg:mx-0 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 sm:p-2 bg-white rounded-2xl sm:rounded-full shadow-lg border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <div className="flex-1 flex items-center gap-3 px-3 py-1.5 sm:py-0">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl sm:rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>{t.findFood}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick search tags */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 flex-wrap text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">{t.popularRightNow}</span>
              {['Kacchi Biryani', 'Crispy Burger', 'Beef Tehari', 'BBQ Pizza', 'Kala Bhuna'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    navigateTo('restaurants');
                  }}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-colors shadow-2xs text-[11px] font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80"
                alt="Shahi Kacchi Biryani"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating review card */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                  ★
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">4.9/5 Rating</span>
                  <span className="text-[11px] text-slate-500">From 18,000+ happy foodies</span>
                </div>
              </div>

              {/* Floating bottom badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-sm block">Authentic Kacchi & Tehari</span>
                  <span className="text-[11px] text-slate-300">Fresh slow dum degh everyday</span>
                </div>
                <span className="text-xs font-bold text-brand-400 bg-brand-500/20 px-2.5 py-1 rounded-lg border border-brand-500/30">
                  25–35 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BROWSE CATEGORIES (Horizontal scroll) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              {t.exploreCategories}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.exploreCategoriesSub}
            </p>
          </div>
          <button
            onClick={() => navigateTo('restaurants')}
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 hide-scrollbar">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="shrink-0 w-24 sm:w-28 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-card-hover transition-all text-center group flex flex-col items-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-2 bg-slate-100 group-hover:scale-105 transition-transform relative shadow-2xs">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-xs filter drop-shadow">
                  {cat.icon}
                </span>
              </div>
              <span className="font-display font-bold text-xs text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {cat.count}+ places
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PROMO CAROUSEL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-100 bg-gradient-to-r from-brand-900 to-slate-900 text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Left promo info */}
            <div className="md:col-span-7 p-6 sm:p-10 space-y-4">
              <span className="inline-block text-xs font-black uppercase tracking-wider bg-brand-600 text-white px-3 py-1 rounded-full shadow">
                {featuredBanner.discountBadge}
              </span>

              <h2 className="font-display font-black text-2xl sm:text-4xl leading-tight">
                {featuredBanner.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                {featuredBanner.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    if (featuredBanner.restaurantId) {
                      openRestaurantDetail(featuredBanner.restaurantId);
                    } else {
                      navigateTo('offers');
                    }
                  }}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>{featuredBanner.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <span className="text-xs text-brand-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Use Code: <strong>KHABAR50</strong>
                </span>
              </div>

              {/* Dots navigation */}
              <div className="flex items-center gap-2 pt-2">
                {PROMO_BANNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      activeBannerIdx === i ? 'w-6 bg-brand-500' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right promo photo */}
            <div className="md:col-span-5 h-52 sm:h-72 w-full overflow-hidden relative">
              <img
                src={featuredBanner.image}
                alt="Promo Food"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEST DEALS TODAY (Horizontal Deal Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-brand-600" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {t.bestDealsToday}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.bestDealsTodaySub}
            </p>
          </div>
          <button
            onClick={() => navigateTo('offers')}
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All Offers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BEST_DEALS.map((deal: DealItem) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                    {deal.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{deal.validity}</span>
                </div>

                <div className="flex gap-3 items-center mb-3">
                  <img src={deal.image} alt={deal.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                      {deal.title}
                    </h3>
                    <span className="text-xs text-slate-500 block truncate">
                      At {deal.restaurantName}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Min order: {formatBDT(deal.minOrder)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {deal.code}
                </span>
                <button
                  onClick={() => openRestaurantDetail(deal.restaurantId)}
                  className="px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors"
                >
                  {deal.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR FOOD ITEMS (Food-level cards with direct Add button) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {t.popularFoodTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.popularFoodSub}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularFoodItems.map((food) => {
            const parentRest = restaurants.find((r) => r.id === food.restaurantId) || restaurants[0];
            return (
              <div
                key={food.id}
                onClick={() => openFoodModal(food, parentRest)}
                className="group cursor-pointer bg-white rounded-2xl p-3.5 border border-slate-200/80 food-card-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {food.restaurantName}
                    </span>
                    {food.rating && (
                      <span className="absolute top-2 right-2 text-[11px] font-bold bg-white/95 text-slate-900 px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                        ★ {food.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-1">
                    {food.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {food.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-display font-black text-sm text-slate-950 block">
                      {formatBDT(food.price)}
                    </span>
                    {food.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatBDT(food.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFoodModal(food, parentRest);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-bold text-xs border border-brand-200 hover:border-brand-600 transition-all flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. POPULAR NEAR YOU (Restaurant-level Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {t.popularNearYou}
              </h2>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                {selectedLocation.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.popularNearYouSub}
            </p>
          </div>

          <button
            onClick={() => navigateTo('restaurants')}
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>{t.seeAllRestaurants}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-column desktop, 2-column tablet, 1-column mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularRestaurants.map((restaurant: Restaurant) => {
            const isFav = isRestaurantFavorited(restaurant.id);
            return (
              <div
                key={restaurant.id}
                onClick={() => openRestaurantDetail(restaurant.id)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/70 food-card-shadow flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Offer badge */}
                  {restaurant.offerText && (
                    <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-brand-600 px-2.5 py-0.5 rounded-lg shadow-xs">
                      {restaurant.offerText}
                    </span>
                  )}

                  {/* Free delivery badge */}
                  {restaurant.deliveryFee === 0 && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded shadow-xs">
                      FREE DELIVERY
                    </span>
                  )}

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteRestaurant(restaurant.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-brand-600 flex items-center justify-center shadow-md transition-transform active:scale-90"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-brand-600 text-brand-600' : ''}`} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-1">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded shrink-0">
                        <span>★</span>
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {restaurant.cuisine.join(' • ')}
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {restaurant.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5 text-slate-400" />
                      {restaurant.deliveryFee === 0 ? 'Free' : `${formatBDT(restaurant.deliveryFee)} fee`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BUDGET FRIENDLY DISHES (Under ৳150 / ৳250 / ৳350) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {t.budgetFriendlyTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Delicious meals that keep your wallet happy
            </p>
          </div>

          {/* Budget filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl shrink-0">
            {([150, 250, 350] as const).map((budget) => (
              <button
                key={budget}
                onClick={() => setBudgetTab(budget)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  budgetTab === budget
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Under ৳{budget}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetItems.map((item) => {
            const parentRest = restaurants.find((r) => r.id === item.restaurantId) || restaurants[0];
            return (
              <div
                key={item.id}
                onClick={() => openFoodModal(item, parentRest)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase truncate">
                    {item.restaurantName}
                  </span>
                  <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <span className="font-display font-black text-sm text-brand-600 block mt-1">
                    {formatBDT(item.price)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFoodModal(item, parentRest);
                  }}
                  className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs shrink-0 active:scale-95"
                >
                  + Add
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. HERITAGE CULINARY CULTURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3 text-left">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
              Heritage Culinary Masters
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Craving Traditional Old Dhaka & Chittagong Feasts?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              From slow-simmered bone-in Shahi Kacchi Biryani and black-roasted Beef Kala Bhuna to Chittagong Mezbeni Gosht and fresh Shorshe Ilish, KHABAR brings Bangladesh’s royal culinary masters directly to your home.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('Biryani');
                  navigateTo('restaurants');
                }}
                className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-colors active:scale-95 shadow-md"
              >
                Order Bangladeshi Specials
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80"
              alt="Kacchi"
              className="rounded-2xl h-36 w-full object-cover shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80"
              alt="Kala Bhuna"
              className="rounded-2xl h-36 w-full object-cover shadow-sm mt-3"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
