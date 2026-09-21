import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, MessageSquare, Sparkles } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { AddOnOption } from '../../data/khabarData';

export const FoodDetailModal: React.FC = () => {
  const { inspectingFood, closeFoodModal, addToCart, formatBDT } = useKhabar();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [sizeExtraPrice, setSizeExtraPrice] = useState(0);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (inspectingFood) {
      setQuantity(1);
      const defaultSize = inspectingFood.item.sizes?.[0];
      setSelectedSize(defaultSize ? defaultSize.name : 'Regular');
      setSizeExtraPrice(defaultSize ? defaultSize.extraPrice : 0);
      setSelectedSauces(inspectingFood.item.sauces?.slice(0, 1) || []);
      setSelectedAddOns([]);
      setInstructions('');
    }
  }, [inspectingFood]);

  if (!inspectingFood) return null;

  const { item, restaurant } = inspectingFood;

  const toggleSauce = (sauce: string) => {
    setSelectedSauces((prev) =>
      prev.includes(sauce) ? prev.filter((s) => s !== sauce) : [...prev, sauce]
    );
  };

  const toggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const singlePrice = item.price + sizeExtraPrice + addOnTotal;
  const totalPrice = singlePrice * quantity;

  const handleAdd = () => {
    addToCart(
      item,
      restaurant,
      quantity,
      selectedSize,
      selectedSauces,
      selectedAddOns,
      instructions
    );
  };

  // Fallback add-ons if none specified
  const effectiveAddOns = item.addOns && item.addOns.length > 0
    ? item.addOns
    : [
        { id: 'cheese', name: 'Extra Melted Cheese', price: 30 },
        { id: 'extra-meat', name: 'Extra Patty / Meat Portion', price: 80 },
        { id: 'fries', name: 'Crispy French Fries Side', price: 60 },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Mobile Bottom Sheet & Desktop Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Close Button */}
        <button
          onClick={closeFoodModal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md hover:bg-white text-slate-700 flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Image Banner */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-semibold bg-brand-600 px-2.5 py-1 rounded-full shadow">
              {restaurant.name}
            </span>
            {item.rating && (
              <span className="text-xs font-bold bg-white/95 text-slate-900 px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                ★ {item.rating}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Title & Description */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                  {item.name}
                </h3>
                <div className="font-bengali text-sm text-brand-600 font-semibold mt-0.5">
                  {item.bengaliName}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display font-black text-xl sm:text-2xl text-slate-900">
                  {formatBDT(item.price)}
                </span>
                {item.originalPrice && (
                  <span className="block text-xs text-slate-400 line-through">
                    {formatBDT(item.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {item.description}
            </p>

            {item.isSpicy && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md mt-2.5">
                <Flame className="w-3 h-3 text-amber-600" /> Spicy Desi Flavor
              </span>
            )}
          </div>

          {/* 1. Size Selection (if available or standard) */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                  Choose Size
                </h4>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Required</span>
              </div>
              <div className="space-y-2">
                {item.sizes.map((s) => (
                  <label
                    key={s.id}
                    onClick={() => {
                      setSelectedSize(s.name);
                      setSizeExtraPrice(s.extraPrice);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedSize === s.name
                        ? 'border-brand-500 bg-brand-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedSize === s.name
                            ? 'border-brand-600 bg-brand-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedSize === s.name && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">{s.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {s.extraPrice === 0 ? 'Standard' : `+${formatBDT(s.extraPrice)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 2. Sauce Selection (if available) */}
          {item.sauces && item.sauces.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                  Choose Sauce
                </h4>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Optional</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {item.sauces.map((sauce) => {
                  const isChecked = selectedSauces.includes(sauce);
                  return (
                    <button
                      type="button"
                      key={sauce}
                      onClick={() => toggleSauce(sauce)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{sauce}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Extra Add-ons & Toppings */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                Extra Toppings & Add-ons
              </h4>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Optional</span>
            </div>

            <div className="space-y-2">
              {effectiveAddOns.map((addon) => {
                const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                return (
                  <label
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {addon.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      +{formatBDT(addon.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Special Instructions */}
          <div className="border-t border-slate-100 pt-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Special Cooking Instructions</span>
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, keep sauce on the side, extra tissue..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Sticky Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0 flex items-center gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full shrink-0 border border-slate-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-white text-slate-700 disabled:opacity-40 flex items-center justify-center shadow-xs transition-transform active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-display font-black text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-xs transition-transform active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-brand hover:shadow-lg transition-all flex items-center justify-between active:scale-98"
          >
            <span>Add to Cart</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">
              {formatBDT(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
