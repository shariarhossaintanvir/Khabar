import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { RESTAURANTS } from '../../data/khabarData';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToCart,
    subtotal,
    discount,
    deliveryFee,
    vat,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    formatBDT,
    selectedLocation,
  } = useKhabar();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
      setTimeout(() => setCouponError(''), 4000);
    } else {
      setCouponInput('');
      setCouponError('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const restaurantName = cart[0]?.restaurantName || 'Selected Restaurant';
  const targetRestaurant = RESTAURANTS.find((r) => r.id === cart[0]?.restaurantId) || RESTAURANTS[0];

  // Free delivery threshold: ৳600
  const freeDeliveryThreshold = 600;
  const amountNeededForFreeShip = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeShipPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  // Quick add-on suggestions ("Complete your meal")
  const quickAddOns = [
    { name: 'Clay Cup Borhani (250ml)', price: 60, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&auto=format&fit=crop&q=80' },
    { name: 'Zafrani Shahi Firni', price: 70, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&auto=format&fit=crop&q=80' },
    { name: 'French Fries', price: 60, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Slide Drawer */}
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between relative border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-900 leading-tight">
                Your Food Bag
              </h3>
              {cart.length > 0 && (
                <span className="text-xs text-slate-500 font-medium block truncate max-w-[220px]">
                  From {restaurantName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded transition-colors"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress Bar */}
        {cart.length > 0 && (
          <div className="bg-brand-50/60 border-b border-brand-100 px-4 py-2.5 text-xs">
            <div className="flex justify-between items-center mb-1">
              {amountNeededForFreeShip > 0 ? (
                <span className="text-slate-700 font-medium">
                  Add <strong className="text-brand-600">{formatBDT(amountNeededForFreeShip)}</strong> more for <strong>Free Delivery!</strong>
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You unlocked 100% Free Delivery!
                </span>
              )}
              <span className="font-bold text-slate-500 text-[11px]">{Math.round(freeShipPercent)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${freeShipPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Your bag is empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore delicious biryani, burgers, and traditional feasts and add your favorite dishes!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('restaurants');
                }}
                className="mt-5 px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {item.menuItem.name}
                    </h4>

                    {item.selectedSize && (
                      <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded mr-1">
                        {item.selectedSize}
                      </span>
                    )}

                    {item.selectedSauces && item.selectedSauces.length > 0 && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mr-1">
                        {item.selectedSauces.join(', ')}
                      </span>
                    )}

                    {/* Add-ons */}
                    {item.selectedAddOns.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.selectedAddOns.map((addon) => (
                          <span
                            key={addon.id}
                            className="inline-block text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mr-1"
                          >
                            + {addon.name} ({formatBDT(addon.price)})
                          </span>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-slate-400 italic mt-0.5">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-full px-2 py-0.5 bg-slate-50 text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-brand-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-slate-800 px-2 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-brand-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="font-display font-black text-sm text-slate-900 shrink-0">
                    {formatBDT(item.itemTotal)}
                  </span>
                </div>
              ))}

              {/* Complete Your Meal section */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="font-display font-bold text-xs text-slate-900 block mb-2">
                  Complete Your Meal
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {quickAddOns.map((addon, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 w-36 p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                    >
                      <img src={addon.image} alt={addon.name} className="w-full h-16 object-cover rounded-lg mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-900 line-clamp-1">{addon.name}</span>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60">
                        <span className="text-xs font-black text-brand-600">{formatBDT(addon.price)}</span>
                        <button
                          onClick={() => {
                            addToCart(
                              {
                                id: `addon-${idx}`,
                                name: addon.name,
                                bengaliName: addon.name,
                                description: addon.name,
                                price: addon.price,
                                category: 'Sides',
                                image: addon.image,
                                restaurantId: targetRestaurant.id,
                                restaurantName: targetRestaurant.name,
                              },
                              targetRestaurant,
                              1
                            );
                          }}
                          className="px-2 py-0.5 rounded bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px]"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Summary and Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3.5 shrink-0">
            {/* Coupon field */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.badge})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-rose-600 font-bold px-1.5 py-0.5 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. KHABAR50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs uppercase font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatBDT(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Voucher Discount</span>
                  <span>-{formatBDT(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Doorstep Delivery ({selectedLocation.name})</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    formatBDT(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Govt VAT / Service Tax (5%)</span>
                <span>{formatBDT(vat)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="font-display font-bold text-sm">Total Amount</span>
                <span className="font-display font-black text-lg text-slate-950">
                  {formatBDT(total)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-brand hover:shadow-lg transition-all flex items-center justify-between active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-2">
                <span className="font-black bg-white/20 px-2.5 py-0.5 rounded-full text-xs">
                  {formatBDT(total)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
