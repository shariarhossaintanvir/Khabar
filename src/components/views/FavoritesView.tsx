import React, { useState } from 'react';
import { Heart, Clock, Bike, Star, ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { Restaurant, MenuItem } from '../../data/khabarData';
import { EmptyState } from '../common/EmptyState';

export const FavoritesView: React.FC = () => {
  const {
    favoriteRestaurantIds,
    toggleFavoriteRestaurant,
    openRestaurantDetail,
    openFoodModal,
    navigateTo,
    formatBDT,
    restaurants,
  } = useKhabar();

  const [activeTab, setActiveTab] = useState<'RESTAURANTS' | 'FOODS'>('RESTAURANTS');

  const favoriteRestaurants = restaurants.filter((r) =>
    favoriteRestaurantIds.includes(r.id)
  );

  // Favorite foods list from favorite restaurants
  const favoriteFoods: MenuItem[] = favoriteRestaurants
    .flatMap((r) => r.menuItems)
    .filter((m) => m.isPopular);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Saved Favorites
            </h1>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
              {activeTab === 'RESTAURANTS' ? favoriteRestaurants.length : favoriteFoods.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your handpicked dining sanctuaries and go-to biryani houses for 1-click reordering.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('RESTAURANTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'RESTAURANTS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Favorite Kitchens ({favoriteRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('FOODS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FOODS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Favorite Dishes ({favoriteFoods.length})
          </button>
        </div>

        {activeTab === 'RESTAURANTS' && (
          <>
            {favoriteRestaurants.length === 0 ? (
              <EmptyState
                type="favorites"
                title="No saved restaurants"
                description="Browse Dhaka kitchens and tap the heart icon on any restaurant to save it here."
                actionText="Explore Restaurants"
                onAction={() => navigateTo('restaurants')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {favoriteRestaurants.map((restaurant: Restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => openRestaurantDetail(restaurant.id)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 food-card-shadow flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Remove Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteRestaurant(restaurant.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-brand-600 flex items-center justify-center shadow transition-transform active:scale-90"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-brand-600" />
                      </button>

                      {restaurant.offerText && (
                        <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-brand-600 px-2.5 py-0.5 rounded-lg shadow-xs">
                          {restaurant.offerText}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-1">
                            {restaurant.name}
                          </h3>
                          <span className="text-xs font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded shrink-0">
                            ★ {restaurant.rating}
                          </span>
                        </div>

                        <span className="text-xs text-slate-500 block mt-1 line-clamp-1">
                          {restaurant.cuisine.join(' • ')}
                        </span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {restaurant.deliveryTime}
                        </span>
                        <span className="text-xs font-bold text-brand-600 group-hover:underline flex items-center gap-1">
                          <span>Order Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'FOODS' && (
          <>
            {favoriteFoods.length === 0 ? (
              <EmptyState
                type="favorites"
                title="No saved dishes"
                description="Save your favorite dishes to reorder anytime with one tap."
                actionText="Explore Dishes"
                onAction={() => navigateTo('home')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteFoods.map((food) => {
                  const parentRest = restaurants.find((r) => r.id === food.restaurantId) || restaurants[0];
                  return (
                    <div
                      key={food.id}
                      onClick={() => openFoodModal(food, parentRest)}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <img src={food.image} alt={food.name} className="w-full h-36 rounded-xl object-cover mb-2" />
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          {food.restaurantName}
                        </span>
                        <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                          {food.name}
                        </h4>
                        <span className="font-display font-black text-sm text-brand-600 block mt-1">
                          {formatBDT(food.price)}
                        </span>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRestaurantDetail(parentRest.id);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                        >
                          View Kitchen
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFoodModal(food, parentRest);
                          }}
                          className="px-3 py-1.5 rounded-full bg-brand-600 text-white font-bold text-xs shadow-xs flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
