import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Eye, Plus, Star, Clock, Flame, Check, Search, Filter, X } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../../data/menuData';
import type { CategoryType, MenuItem } from '../../data/menuData';
import { HeroKacchiModel } from '../canvas/HeroKacchiModel';
import { KalaBhunaModel, ShorsheIlishModel, ChingriMalaiModel, ClayBorhaniModel, ShahiFirniModel } from '../canvas/Menu3DObjects';
import { useStore } from '../../context/StoreContext';
import { audioEngine } from '../../utils/audio';

// Mini 3D preview component rendered inside card for items with visualType
const Mini3DPreview: React.FC<{ item: MenuItem }> = ({ item }) => {
  const is3D = item.visualType !== 'generic';

  if (!is3D) {
    return (
      <div className="w-full h-48 relative overflow-hidden rounded-2xl bg-dark-900 border border-white/5 group-hover:border-brass/30 transition-colors">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-dark-950/85 border border-white/10 text-[10px] font-sans text-ivory-300 backdrop-blur-sm flex items-center gap-1">
          <Clock className="w-3 h-3 text-brass" /> {item.prepTime}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-48 relative overflow-hidden rounded-2xl bg-dark-900/90 border border-white/5 group-hover:border-brass/40 transition-colors">
      <Canvas
        camera={{ position: [0, 1.4, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={2.2} color="#fff2db" />
        <pointLight position={[-2, 1, 2]} intensity={1.2} color="#e27a52" />

        {item.visualType === 'kacchi' && <HeroKacchiModel scale={0.65} interactiveRotation />}
        {item.visualType === 'kalabhuna' && <KalaBhunaModel scale={0.68} />}
        {item.visualType === 'ilish' && <ShorsheIlishModel scale={0.68} />}
        {item.visualType === 'borhani' && <ClayBorhaniModel scale={0.78} />}
        {item.visualType === 'firni' && <ShahiFirniModel scale={0.75} />}
      </Canvas>

      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-dark-950/85 border border-white/10 text-[9px] font-sans uppercase tracking-widest text-brass flex items-center gap-1 backdrop-blur-sm">
        <Sparkles className="w-2.5 h-2.5 text-terracotta" /> 3D Live
      </div>

      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-dark-950/85 border border-white/10 text-[10px] font-sans text-ivory-300 backdrop-blur-sm flex items-center gap-1">
        <Clock className="w-3 h-3 text-brass" /> {item.prepTime}
      </div>
    </div>
  );
};

export const Scene06MenuSection: React.FC = () => {
  const {
    openInspector,
    addToCart,
    formatBDT,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSpiceFilter,
    setSelectedSpiceFilter,
    isVegetarianFilter,
    setIsVegetarianFilter,
  } = useStore();

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Spice level filter
      if (selectedSpiceFilter !== 'ALL' && item.spiceLevel !== selectedSpiceFilter) {
        return false;
      }
      // Vegetarian filter
      if (isVegetarianFilter && !item.isVegetarian) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBangla = item.banglaName.includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesName || matchesBangla || matchesDesc || matchesCategory;
      }
      return true;
    });
  }, [selectedCategory, selectedSpiceFilter, isVegetarianFilter, searchQuery]);

  const handleCategoryClick = (cat: CategoryType) => {
    audioEngine.playClick();
    setSelectedCategory(cat);
  };

  return (
    <section id="scene-menu" className="relative min-h-screen py-32 px-6 md:px-12 max-w-7xl mx-auto z-10 select-none">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-brass/40 backdrop-blur-md mb-4">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold text-ivory-200">
            BANGLADESHI MENU & ONLINE DELIVERY
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl text-ivory-100 font-bold tracking-tight">
          Authentic Culinary Heritage
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed">
          Cooked fresh daily with pure mustard oil, Baghabari cow ghee, and hand-ground shahi spices. 
          Available for dine-in reservation or express climate-controlled delivery across Dhaka.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="max-w-4xl mx-auto mb-10 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-brass absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search Kacchi, Kala Bhuna, Ilish, Borhani, Firni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-dark-900/90 border border-white/10 text-xs font-sans text-ivory-100 placeholder:text-ivory-400/50 focus:outline-none focus:border-brass transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-ivory-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Secondary Filter Controls: Spice Filter & Veg Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="text-ivory-400 text-[11px] flex items-center gap-1 font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-terracotta" /> Spice Level:
            </span>
            {['ALL', 'Mild', 'Medium', 'Spicy', 'Naga'].map((spice) => (
              <button
                key={spice}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedSpiceFilter(spice);
                }}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedSpiceFilter === spice
                    ? 'bg-terracotta text-white font-bold'
                    : 'bg-white/5 text-ivory-300 hover:bg-white/10'
                }`}
              >
                {spice}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              audioEngine.playClick();
              setIsVegetarianFilter(!isVegetarianFilter);
            }}
            className={`px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
              isVegetarianFilter
                ? 'border-green-500 bg-green-950/40 text-green-300 font-bold'
                : 'border-white/10 bg-white/5 text-ivory-300 hover:border-white/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isVegetarianFilter ? 'bg-green-400' : 'bg-transparent border border-white/40'}`} />
            <span>Pure Vegetarian Only</span>
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-14">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 focus:outline-none ${
                isSelected
                  ? 'bg-brass text-dark-950 font-bold shadow-[0_0_25px_rgba(197,160,89,0.4)] scale-105'
                  : 'glass-panel text-ivory-300 hover:text-ivory-100 hover:border-brass/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* NO RESULTS STATE */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-dark-900/40 rounded-3xl border border-white/5 max-w-xl mx-auto">
          <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-ivory-100 mb-2">No dishes match your search</h3>
          <p className="text-xs text-ivory-400 font-sans mb-6">
            We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;. Try searching for Kacchi, Kala Bhuna, or Ilish.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSpiceFilter('ALL');
              setIsVegetarianFilter(false);
            }}
            className="px-6 py-2.5 rounded-full bg-brass text-dark-950 text-xs font-sans font-bold uppercase tracking-wider hover:bg-brass-light transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* FOOD CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => audioEngine.playHover()}
            className="group relative glass-panel rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(200,90,50,0.15)] flex flex-col justify-between border border-white/5 hover:border-brass/40"
          >
            <div>
              {/* Image or 3D live preview */}
              <Mini3DPreview item={item} />

              {/* Title, Bangla Name & Category */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest-xl font-sans text-brass font-bold">
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-ivory-200">
                  <Star className="w-3.5 h-3.5 text-brass fill-brass" />
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-ivory-400 text-[10px]">({item.reviewsCount})</span>
                </div>
              </div>

              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="font-serif text-2xl font-bold text-ivory-100 group-hover:text-brass-light transition-colors">
                  {item.name}
                </h3>
              </div>

              <span className="font-bengali text-xs text-brass block -mt-0.5 mb-1.5 font-medium">
                {item.banglaName}
              </span>

              <p className="text-xs text-ivory-400 font-sans line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-ivory-400 block font-sans uppercase tracking-wider">Price</span>
                <span className="font-serif text-2xl font-bold text-ivory-100 text-gold-gradient">
                  {formatBDT(item.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 3D / Detail Inspector Button */}
                <button
                  onClick={() => openInspector(item)}
                  className="p-2.5 rounded-full border border-white/15 bg-dark-900/60 hover:bg-white/10 text-ivory-200 hover:text-brass transition-colors focus:outline-none"
                  title="View Details & Add-ons"
                  aria-label="Inspect dish details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Quick Add To Order */}
                <button
                  onClick={() => addToCart(item, 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-light text-white text-xs font-sans font-bold tracking-wider uppercase transition-all duration-300 shadow-md focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
