import React, { useState } from 'react';
import { X, MapPin, Search, Check, Sparkles } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { BANGLADESH_LOCATIONS, LocationItem } from '../../data/khabarData';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, selectedLocation, changeLocation } = useKhabar();
  const [search, setSearch] = useState('');

  if (!isLocationModalOpen) return null;

  const filtered = BANGLADESH_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.bengaliName.includes(search)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-brand-600">
            <MapPin className="w-5 h-5" />
            <h3 className="font-display font-bold text-lg text-slate-900">Choose Delivery Location</h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search area or city (e.g. Dhanmondi, Gulshan, Uttara)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Popular pills */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Popular:
            </span>
            {BANGLADESH_LOCATIONS.filter((l) => l.isPopular).slice(0, 5).map((loc) => (
              <button
                key={loc.id}
                onClick={() => changeLocation(loc)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedLocation.id === loc.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Location List */}
        <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching locations found.
            </div>
          ) : (
            filtered.map((loc: LocationItem) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => changeLocation(loc)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors ${
                    isSelected ? 'bg-brand-50 text-brand-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{loc.name}</span>
                        <span className="text-xs text-slate-400">({loc.bengaliName})</span>
                      </div>
                      <span className="text-xs text-slate-500 block">
                        {loc.city} • Est. {loc.deliveryTime} • Delivery fee: ৳{loc.deliveryFee}
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-5 h-5 text-brand-600 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
