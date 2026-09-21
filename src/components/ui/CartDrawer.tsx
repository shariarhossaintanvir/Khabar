import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DHAKA_DELIVERY_ZONES } from '../../data/menuData';
import { audioEngine } from '../../utils/audio';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    deliveryFee,
    vat,
    total,
    appliedPromo,
    applyPromoCode,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    formatBDT,
    setIsCheckoutOpen,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 3000);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    audioEngine.playClick();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-dark-950/75 backdrop-blur-md animate-in fade-in duration-300">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container */}
      <div className="w-full max-w-md h-full bg-dark-900 border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brass" />
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory-100">Your Dining Bag</h3>
                <span className="font-bengali text-xs text-brass-light block -mt-0.5">আপনার খাবারের ঝুড়ি</span>
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsCartOpen(false);
              }}
              className="p-2 rounded-full text-ivory-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="mt-5 max-h-[42vh] overflow-y-auto space-y-3.5 pr-1">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-ivory-400 font-sans text-xs">
                <ShoppingBag className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p>Your culinary bag is currently empty.</p>
                <p className="font-bengali text-brass mt-1 text-sm">মেন্যু থেকে পছন্দের খাবার নির্বাচন করুন</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-dark-950/70 border border-white/5 flex items-start justify-between gap-3 shadow-inner"
                >
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-sm text-ivory-100 leading-snug">
                      {item.menuItem.name}
                    </h4>
                    <div className="font-bengali text-xs text-brass font-medium">
                      {item.menuItem.banglaName}
                    </div>

                    <span className="text-[11px] text-brass-light font-sans block mt-1">
                      {formatBDT(item.menuItem.price)} base
                    </span>

                    {/* Selected Add-ons */}
                    {item.selectedAddOns.length > 0 && (
                      <div className="mt-2 space-y-0.5 bg-dark-900/60 p-2 rounded-lg border border-white/5">
                        {item.selectedAddOns.map((addon) => (
                          <div key={addon.id} className="text-[10px] text-ivory-300 font-sans flex justify-between">
                            <span>+ {addon.name}</span>
                            <span className="text-brass font-semibold">+{formatBDT(addon.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-terracotta italic mt-1.5 font-sans">
                        &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    {/* Quantity Stepper */}
                    <div className="mt-3 flex items-center gap-2.5">
                      <div className="flex items-center gap-2 bg-dark-900 border border-white/15 px-2.5 py-1 rounded-full text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-ivory-300 hover:text-brass transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold font-sans text-ivory-100 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-ivory-300 hover:text-brass transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-ivory-400 hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <span className="font-serif font-bold text-base text-brass-light text-right">
                    {formatBDT(item.itemTotal)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SUMMARY & CHECKOUT ACTIONS */}
        <div className="pt-4 border-t border-white/10 space-y-3.5">
          {/* Dhaka Delivery Zone Selector */}
          {cart.length > 0 && (
            <div className="bg-dark-950/80 p-3 rounded-xl border border-white/10">
              <label className="text-[10px] uppercase font-sans tracking-widest text-ivory-400 flex items-center gap-1.5 mb-1.5 font-bold">
                <MapPin className="w-3 h-3 text-terracotta" />
                Dhaka Delivery Area • ডেলিভারি এলাকা
              </label>
              <select
                value={selectedDeliveryZone.id}
                onChange={(e) => {
                  const found = DHAKA_DELIVERY_ZONES.find((z) => z.id === e.target.value);
                  if (found) setSelectedDeliveryZone(found);
                }}
                className="w-full bg-dark-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-ivory-100 font-sans focus:outline-none focus:border-brass"
              >
                {DHAKA_DELIVERY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id} className="bg-dark-950 text-ivory-100">
                    {zone.name} ({zone.bengaliName}) — {formatBDT(zone.fee)} • {zone.estimatedMin}m
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Promo code form */}
          {cart.length > 0 && (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-brass absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="PROMO CODE (Try: RASA15 or KACCHI)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-950/80 border border-white/10 text-xs text-ivory-100 font-sans focus:outline-none focus:border-brass uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-brass hover:text-dark-950 text-xs font-sans font-bold uppercase transition-colors text-ivory-100"
              >
                Apply
              </button>
            </form>
          )}

          {promoError && (
            <p className="text-[10px] text-red-400 font-sans -mt-1">
              Invalid code. Try <strong>RASA15</strong> (15% off) or <strong>KACCHI</strong> (৳100 off).
            </p>
          )}

          {appliedPromo && (
            <div className="flex items-center gap-1.5 text-[11px] font-sans text-brass-light bg-brass/10 px-3 py-1.5 rounded-lg border border-brass/20">
              <Sparkles className="w-3 h-3 text-brass" />
              <span>Promo <strong>{appliedPromo}</strong> applied successfully!</span>
            </div>
          )}

          {/* Pricing Totals */}
          <div className="space-y-1.5 text-xs font-sans text-ivory-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-ivory-100 font-medium">{formatBDT(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brass">
                <span>Promotional Discount</span>
                <span>-{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                Dhaka Delivery ({selectedDeliveryZone.name})
              </span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-brass font-bold text-[11px] bg-brass/10 px-2 py-0.5 rounded border border-brass/20">
                    FREE (OVER ৳1,500)
                  </span>
                ) : (
                  formatBDT(deliveryFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-ivory-400">
              <span>Govt. Restaurant VAT (5%)</span>
              <span>{formatBDT(vat)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 font-serif text-lg font-bold text-ivory-100">
              <span>Total Payable • সর্বমোট</span>
              <span className="text-brass-light">{formatBDT(total)}</span>
            </div>
          </div>

          {/* Payment hints */}
          <div className="flex items-center justify-between text-[10px] text-ivory-400 font-sans pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-brass" /> bKash • Nagad • Card • COD
            </span>
            <span className="text-terracotta font-medium">Warm Clay Handi Packaging</span>
          </div>

          {/* Checkout Button */}
          <button
            disabled={cart.length === 0}
            onClick={handleProceedCheckout}
            className="w-full py-3.5 rounded-full bg-ivory-100 text-dark-950 font-sans text-xs font-bold tracking-widest uppercase hover:bg-brass disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2 focus:outline-none"
          >
            <span>Proceed to Fast Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
