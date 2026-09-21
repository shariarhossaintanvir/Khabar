import React, { useState } from 'react';
import {
  Clock,
  Check,
  RefreshCw,
  Bike,
  ShoppingBag,
  Star,
  HelpCircle,
  MapPin,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';
import { EmptyState } from '../common/EmptyState';

export const OrdersHistoryView: React.FC = () => {
  const {
    orders,
    navigateTo,
    reorder,
    cancelOrder,
    openReviewModal,
    formatBDT,
    language
  } = useKhabar();

  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (tab === 'ACTIVE') return o.status !== 'DELIVERED' && o.status !== 'CANCELLED';
    if (tab === 'COMPLETED') return o.status === 'DELIVERED';
    if (tab === 'CANCELLED') return o.status === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
            ✕ Cancelled
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4 sm:px-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'চলমান ডেলিভারি ট্র্যাক করুন অথবা পছন্দের খাবার দ্রুত রি-অর্ডার করুন।'
              : 'Track your ongoing deliveries or reorder your favourite Bangladeshi meals with 1-click.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-200 pb-3 overflow-x-auto no-scrollbar">
          {(['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all shrink-0 ${
                tab === t
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-surface-200 text-slate-600 hover:bg-surface-100'
              }`}
            >
              {t.toLowerCase()}
              <span className="ml-1.5 opacity-70 text-[10px]">
                (
                {
                  orders.filter((o) => {
                    if (t === 'ACTIVE') return o.status !== 'DELIVERED' && o.status !== 'CANCELLED';
                    if (t === 'COMPLETED') return o.status === 'DELIVERED';
                    if (t === 'CANCELLED') return o.status === 'CANCELLED';
                    return true;
                  }).length
                }
                )
              </span>
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No orders found"
            description="You haven't placed any orders in this category yet. Explore popular Dhaka restaurants and enjoy hot meals delivered fast."
            actionText="Order Food Now"
            onAction={() => navigateTo('restaurants')}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isActive = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
              const isDelivered = order.status === 'DELIVERED';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-surface-200 shadow-sm hover:border-surface-300 transition-all flex flex-col justify-between gap-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-surface-100">
                    <div className="flex items-center gap-3">
                      {order.restaurantLogo ? (
                        <img
                          src={order.restaurantLogo}
                          alt={order.restaurantName}
                          className="w-12 h-12 rounded-2xl object-cover border border-surface-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 font-bold flex items-center justify-center">
                          {order.restaurantName.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-base text-slate-900">
                            {order.restaurantName}
                          </h3>
                        </div>
                        <span className="text-xs text-slate-400">
                          Order #{order.id} • Placed {order.placedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2 text-xs text-slate-600 bg-surface-50/70 p-3.5 rounded-2xl border border-surface-100">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-surface-200">
                            {it.quantity}x
                          </span>
                          <span className="font-medium text-slate-800">{it.menuItem.name}</span>
                          {it.selectedSize && (
                            <span className="text-[10px] text-slate-400">({it.selectedSize})</span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {formatBDT(it.itemTotal)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-surface-200/60 flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {order.deliveryArea} • {order.deliveryAddress}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats & Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Total Amount ({order.paymentMethod})
                      </span>
                      <span className="font-display font-black text-lg text-slate-900">
                        {formatBDT(order.total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Help button for every order */}
                      <button
                        onClick={() => navigateTo('help-center')}
                        className="px-3 py-2 rounded-xl border border-surface-200 text-xs font-semibold text-slate-600 hover:bg-surface-100 transition-colors flex items-center gap-1"
                        title="Get help with this order"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden sm:inline">Support</span>
                      </button>

                      {/* Active order actions */}
                      {isActive && (
                        <>
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => navigateTo('tracking', { orderId: order.id })}
                            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Track Live</span>
                          </button>
                        </>
                      )}

                      {/* Delivered order actions */}
                      {isDelivered && (
                        <>
                          {order.hasReview ? (
                            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>Reviewed ({order.rating || 5}★)</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => openReviewModal(order)}
                              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100/70 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-600" />
                              <span>Rate & Review</span>
                            </button>
                          )}

                          <button
                            onClick={() => reorder(order)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </button>
                        </>
                      )}

                      {/* Cancelled order reorder */}
                      {order.status === 'CANCELLED' && (
                        <button
                          onClick={() => reorder(order)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
