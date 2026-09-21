import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, Clock, Bike, Star, X, Check, ArrowUpDown } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { Restaurant } from '../../data/khabarData';
import { EmptyState } from '../common/EmptyState';

export const RestaurantsView: React.FC = () => {
  const {
    selectedLocation,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    cuisineFilters,
    toggleCuisineFilter,
    minRatingFilter,
    setMinRatingFilter,
    freeDeliveryOnly,
    setFreeDeliveryOnly,
    openRestaurantDetail,
    toggleFavoriteRestaurant,
    isRestaurantFavorited,
    formatBDT,
    restaurants,
  } = useKhabar();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [fastDeliveryFilter, setFastDeliveryFilter] = useState(false);
  const [offersOnlyFilter, setOffersOnlyFilter] = useState(false);
  const [under200Filter, setUnder200Filter] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);

  // Available cuisine tags
  const allCuisines = ['Bangladeshi', 'Biryani', 'Kacchi', 'Burgers', 'Fast Food', 'Pizza', 'Italian', 'Kabab', 'BBQ', 'Chinese', 'Desserts'];

  // Filter & Sort Logic
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rest.name.toLowerCase().includes(q) || rest.bengaliName.includes(q);
        const matchesCuisine = rest.cuisine.some((c) => c.toLowerCase().includes(q));
        const matchesItem = rest.menuItems.some((m) => m.name.toLowerCase().includes(q) || m.bengaliName.includes(q));
        if (!matchesName && !matchesCuisine && !matchesItem) return false;
      }

      // Category match
      if (selectedCategory !== 'all') {
        const catMap: Record<string, string[]> = {
          biryani: ['Biryani', 'Kacchi', 'Bangladeshi'],
          burger: ['Burgers', 'Fast Food'],
          pizza: ['Pizza', 'Italian'],
          kacchi: ['Kacchi', 'Biryani'],
          chicken: ['Chicken', 'Wings', 'Fast Food'],
          bangladeshi: ['Bangladeshi', 'Tehari', 'Mezbeni', 'Biryani'],
          chinese: ['Chinese', 'Asian'],
          bbq: ['BBQ', 'Kabab'],
          dessert: ['Desserts', 'Bakery', 'Sweets'],
          drinks: ['Drinks', 'Borhani'],
        };
        const targets = catMap[selectedCategory] || [];
        const hasMatch = rest.cuisine.some((c) => targets.includes(c));
        if (!hasMatch) return false;
      }

      // Cuisines filter
      if (cuisineFilters.length > 0) {
        const matchesSelectedCuisine = rest.cuisine.some((c) => cuisineFilters.includes(c));
        if (!matchesSelectedCuisine) return false;
      }

      // Rating filter
      if (minRatingFilter > 0 && rest.rating < minRatingFilter) {
        return false;
      }

      // Free delivery
      if (freeDeliveryOnly && rest.deliveryFee > 0 && !rest.freeDelivery) {
        return false;
      }

      // Fast delivery (<= 30 min)
      if (fastDeliveryFilter && parseInt(rest.deliveryTime) > 30) {
        return false;
      }

      // Offers only
      if (offersOnlyFilter && !rest.offerText) {
        return false;
      }

      // Under ৳200 minimum order
      if (under200Filter && rest.minimumOrder > 200) {
        return false;
      }

      // Open now
      if (openNowOnly && !rest.isOpen) {
        return false;
      }

      // Popular only
      if (popularOnly && !rest.isPopular) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fastest') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      if (sortBy === 'price-asc') return a.minimumOrder - b.minimumOrder;
      if (sortBy === 'price-desc') return b.minimumOrder - a.minimumOrder;
      return 0; // recommended
    });
  }, [
    searchQuery,
    selectedCategory,
    cuisineFilters,
    minRatingFilter,
    freeDeliveryOnly,
    fastDeliveryFilter,
    offersOnlyFilter,
    under200Filter,
    openNowOnly,
    popularOnly,
    sortBy,
    restaurants,
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinRatingFilter(0);
    setFreeDeliveryOnly(false);
    setFastDeliveryFilter(false);
    setOffersOnlyFilter(false);
    setUnder200Filter(false);
    setOpenNowOnly(false);
    setPopularOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    minRatingFilter > 0 ||
    freeDeliveryOnly ||
    fastDeliveryFilter ||
    offersOnlyFilter ||
    under200Filter ||
    openNowOnly ||
    popularOnly ||
    cuisineFilters.length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Restaurants in {selectedLocation.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredRestaurants.length} verified kitchens delivering right now
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search restaurant or dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 shadow-2xs shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer font-semibold text-slate-800"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="fastest">Fastest Delivery</option>
                <option value="price-asc">Lowest Min. Order</option>
                <option value="price-desc">Highest Min. Order</option>
              </select>
            </div>

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar">
          <button
            onClick={clearAllFilters}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              !hasActiveFilters
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFastDeliveryFilter(!fastDeliveryFilter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              fastDeliveryFilter
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
            }`}
          >
            ⚡ Fast Delivery (≤30 min)
          </button>

          <button
            onClick={() => setMinRatingFilter(minRatingFilter === 4.5 ? 0 : 4.5)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              minRatingFilter === 4.5
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
            }`}
          >
            ★ Rating 4.5+
          </button>

          <button
            onClick={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              freeDeliveryOnly
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
            }`}
          >
            🛵 Free Delivery
          </button>

          <button
            onClick={() => setOffersOnlyFilter(!offersOnlyFilter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              offersOnlyFilter
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
            }`}
          >
            🏷️ Offers & Discounts
          </button>

          <button
            onClick={() => setUnder200Filter(!under200Filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              under200Filter
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
            }`}
          >
            ৳ Under ৳200
          </button>

          <button
            onClick={() => setPopularOnly(!popularOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              popularOnly
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
            }`}
          >
            🔥 Popular
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-brand-600 hover:text-brand-700 font-bold shrink-0 ml-2"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Main Content Layout: Sidebar on Desktop + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs self-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-brand-600 hover:underline font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Cuisines */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Cuisines
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {allCuisines.map((cuisine) => {
                  const isChecked = cuisineFilters.includes(cuisine);
                  return (
                    <label
                      key={cuisine}
                      onClick={() => toggleCuisineFilter(cuisine)}
                      className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer p-1 rounded hover:bg-slate-50"
                    >
                      <span>{cuisine}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Minimum Order */}
            <div className="border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Minimum Order
              </span>
              <div className="space-y-1.5 text-xs">
                {[
                  { label: 'All Minimums', val: false },
                  { label: 'Under ৳150', val: true },
                ].map((opt, i) => (
                  <label
                    key={i}
                    onClick={() => setUnder200Filter(opt.val)}
                    className="flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="minOrderDesktop"
                      checked={under200Filter === opt.val}
                      onChange={() => {}}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Restaurant Grid: 4-col layout on desktop without sidebar, or 3-col with sidebar */}
          <main className="lg:col-span-9">
            {filteredRestaurants.length === 0 ? (
              <EmptyState
                type="search"
                title="No restaurants found"
                description="We couldn't find any kitchen matching your current filter combination. Try resetting your filters."
                actionText="Reset All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredRestaurants.map((restaurant: Restaurant) => {
                  const isFav = isRestaurantFavorited(restaurant.id);
                  return (
                    <div
                      key={restaurant.id}
                      onClick={() => openRestaurantDetail(restaurant.id)}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 food-card-shadow flex flex-col justify-between"
                    >
                      {/* Cover Image & Badges */}
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
                        {(restaurant.deliveryFee === 0 || restaurant.freeDelivery) && (
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
                            {restaurant.deliveryFee === 0 || restaurant.freeDelivery
                              ? 'Free Delivery'
                              : `${formatBDT(restaurant.deliveryFee)} fee`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Advanced Filter Drawer for Mobile */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs h-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-base text-slate-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Cuisines
                </span>
                <div className="space-y-2">
                  {allCuisines.map((cuisine) => {
                    const isChecked = cuisineFilters.includes(cuisine);
                    return (
                      <label
                        key={cuisine}
                        onClick={() => toggleCuisineFilter(cuisine)}
                        className="flex items-center justify-between text-xs text-slate-700 cursor-pointer"
                      >
                        <span>{cuisine}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
