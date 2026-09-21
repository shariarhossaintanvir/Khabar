import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ArrowRight, Percent, Gift, Bike, ShieldCheck, Ticket } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { PROMO_COUPONS, BEST_DEALS, PromoCoupon, DealItem } from '../../data/khabarData';

export const OffersView: React.FC = () => {
  const { applyCoupon, navigateTo, openRestaurantDetail, showToast, formatBDT, restaurants } = useKhabar();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RESTAURANTS' | 'FOOD' | 'FREE_DELIVERY' | 'COUPONS'>('ALL');
  const [voucherStatusTab, setVoucherStatusTab] = useState<'AVAILABLE' | 'USED' | 'EXPIRED'>('AVAILABLE');

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Code ${code} copied & applied to bag!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const dealRestaurants = restaurants.filter((r) => r.offerText);
  const freeDeliveryRestaurants = restaurants.filter((r) => r.deliveryFee === 0 || r.freeDelivery);

  const filteredVouchers = PROMO_COUPONS.filter((c) => c.status === voucherStatusTab);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Percent className="w-4 h-4 text-brand-600" />
            <span>KHABAR Savings & Deals</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Offers, Coupons & Vouchers
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Get exclusive Bangladesh deals, free doorstep delivery vouchers, and promo codes for your favorite feasts.
          </p>
        </div>

        {/* Primary Filter Tabs */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto max-w-full hide-scrollbar">
            {[
              { id: 'ALL', label: 'All Deals' },
              { id: 'RESTAURANTS', label: 'Restaurant Deals' },
              { id: 'FOOD', label: 'Food Specials' },
              { id: 'FREE_DELIVERY', label: 'Free Delivery' },
              { id: 'COUPONS', label: 'Promo Vouchers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. VOUCHERS SECTION (Shown on ALL or COUPONS) */}
        {(activeTab === 'ALL' || activeTab === 'COUPONS') && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-brand-600" />
                  Promo Code Vouchers
                </h2>
                <p className="text-xs text-slate-500">
                  Tap any voucher to copy and apply directly to your active bag
                </p>
              </div>

              {/* Sub-tabs for voucher statuses */}
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold shrink-0">
                {(['AVAILABLE', 'USED', 'EXPIRED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setVoucherStatusTab(st)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      voucherStatusTab === st
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'AVAILABLE' && 'Available'}
                    {st === 'USED' && 'Used'}
                    {st === 'EXPIRED' && 'Expired'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredVouchers.map((coupon: PromoCoupon) => {
                const isCopied = copiedCode === coupon.code;
                const isUsable = coupon.status === 'AVAILABLE';
                return (
                  <div
                    key={coupon.code}
                    className={`bg-white rounded-2xl p-5 border border-dashed shadow-card flex flex-col justify-between relative overflow-hidden transition-all ${
                      isUsable
                        ? 'border-brand-300 hover:border-brand-500'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                            isUsable ? 'text-brand-600 bg-brand-50' : 'text-slate-500 bg-slate-100'
                          }`}
                        >
                          {coupon.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {coupon.validUntil}
                        </span>
                      </div>

                      <h3 className="font-display font-black text-xl text-slate-900 tracking-tight pt-1">
                        {coupon.code}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {coupon.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Min. {formatBDT(coupon.minOrder)}
                      </span>

                      {isUsable ? (
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 hover:bg-brand-600 text-white shadow-xs'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Use Offer</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          {coupon.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. RESTAURANT OFFERS SECTION */}
        {(activeTab === 'ALL' || activeTab === 'RESTAURANTS') && (
          <div className="space-y-4 pt-4">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-brand-600" />
              Kitchen Deals Near You
            </h2>

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
          </div>
        )}

        {/* 3. FREE DELIVERY RESTAURANTS */}
        {(activeTab === 'ALL' || activeTab === 'FREE_DELIVERY') && (
          <div className="space-y-4 pt-4">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-600" />
              100% Free Delivery Kitchens
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {freeDeliveryRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => openRestaurantDetail(rest.id)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
                >
                  <div className="relative h-36 w-full">
                    <img src={rest.coverImage} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded shadow-xs">
                      FREE DELIVERY
                    </span>
                  </div>
                  <div className="p-3.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                        {rest.name}
                      </h4>
                      <span className="text-xs font-bold text-amber-500">★ {rest.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500 block truncate mt-0.5">{rest.cuisine.join(' • ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
