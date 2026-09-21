import React, { useState } from 'react';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChefHat,
  Bike,
  Volume2,
  VolumeX,
  ArrowLeft,
  Search,
  Check,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';

export const RestaurantPartnerView: React.FC = () => {
  const {
    restaurants,
    orders,
    reservations,
    updateOrderStatus,
    toggleMenuItemAvailability,
    setPortalMode,
    formatBDT,
    showToast
  } = useKhabar();

  // Select first restaurant or allow switching
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(restaurants[0]?.id || 'rest-1');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'menu' | 'bookings'>('pipeline');

  const activeRest = restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  // Filter orders related to this restaurant (or show demo orders if none)
  const restOrders = orders.filter((o) => o.restaurantId === selectedRestaurantId || o.restaurantName.toLowerCase().includes(activeRest.name.toLowerCase()));

  // Categorize into Kanban stages
  const newOrders = restOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PLACED');
  const preparingOrders = restOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = restOrders.filter((o) => o.status === 'PICKED_UP');
  const transitOrders = restOrders.filter((o) => o.status === 'ON_THE_WAY');

  // Reservations for this restaurant
  const restReservations = reservations.filter((res) => res.restaurantId === selectedRestaurantId || res.restaurantName.includes(activeRest.name));

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'PREPARING');
    showToast(`Order #${orderId} accepted! Kitchen notified to start prep.`, 'success');
  };

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, 'PICKED_UP');
    showToast(`Order #${orderId} marked ready for rider pickup!`, 'success');
  };

  const handleHandoverRider = (orderId: string) => {
    updateOrderStatus(orderId, 'ON_THE_WAY');
    showToast(`Order #${orderId} handed over to rider!`, 'success');
  };

  return (
    <div className="min-h-screen bg-surface-100/70 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Kitchen Header Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-surface-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Kitchen Partner POS
                </h1>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Kitchen Live & Accepting Orders
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time kitchen display system (KDS) & order preparation pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Branch Switcher */}
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-50 border border-surface-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-brand-500"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.address.split(',')[0]})
                </option>
              ))}
            </select>

            {/* Sound alert toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? 'Kitchen order chime muted' : 'Kitchen order chime enabled');
              }}
              className={`p-2.5 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-surface-50 border-surface-200 text-slate-400'
              }`}
              title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Back to customer app */}
            <button
              onClick={() => setPortalMode('customer')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit POS</span>
            </button>
          </div>
        </div>

        {/* Daily Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-medium block">Today's Kitchen Orders</span>
            <span className="font-display font-black text-2xl text-slate-900 mt-1 block">
              {restOrders.length + 28}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> 100% on-time prep
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-medium block">Today's Kitchen Payout</span>
            <span className="font-display font-black text-2xl text-slate-900 mt-1 block">
              {formatBDT(32450)}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Settled daily to bank</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-medium block">Avg Preparation Time</span>
            <span className="font-display font-black text-2xl text-amber-600 mt-1 block">
              16.4 mins
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              Target: under 20 mins
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-medium block">Table Reservations</span>
            <span className="font-display font-black text-2xl text-blue-600 mt-1 block">
              {restReservations.length + 4}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">For tonight's service</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-surface-200 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white border border-surface-200 text-slate-600 hover:bg-surface-50'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Pipeline (KDS)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {newOrders.length + preparingOrders.length} active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white border border-surface-200 text-slate-600 hover:bg-surface-50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Stock & Menu Control</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {activeRest.menuItems.length} items
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white border border-surface-200 text-slate-600 hover:bg-surface-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Bookings</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {restReservations.length}
            </span>
          </button>
        </div>

        {/* Pipeline Tab (Kanban Display) */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: New Orders (Needs Acceptance) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-surface-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    New Incoming Orders
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-bold">
                  {newOrders.length}
                </span>
              </div>

              {newOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No pending incoming orders at this second.
                </div>
              ) : (
                <div className="space-y-3">
                  {newOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border-2 border-brand-500/40 bg-brand-50/20 space-y-3 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-brand-600">
                          Order #{ord.id}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Accept within 2m
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between font-medium text-slate-800">
                            <span>
                              {it.quantity}x {it.menuItem.name}
                            </span>
                            {it.selectedSize && <span className="text-slate-500">({it.selectedSize})</span>}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-brand-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {formatBDT(ord.total)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAcceptOrder(ord.id)}
                            className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Accept & Cook
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: In the Kitchen (Cooking) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-surface-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Preparing in Kitchen
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-bold">
                  {preparingOrders.length}
                </span>
              </div>

              {preparingOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  All accepted orders are packed and ready.
                </div>
              ) : (
                <div className="space-y-3">
                  {preparingOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-amber-800">
                          Order #{ord.id}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Cooking (~15m)
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between font-medium text-slate-800">
                            <span>
                              {it.quantity}x {it.menuItem.name}
                            </span>
                            <span className="text-slate-500">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Packed in thermal bag</span>
                        <button
                          onClick={() => handleMarkReady(ord.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Ready</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Ready for Rider Pickup */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-surface-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Ready for Rider Pickup
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {readyOrders.length}
                </span>
              </div>

              {readyOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No orders currently waiting on pickup counter.
                </div>
              ) : (
                <div className="space-y-3">
                  {readyOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-emerald-800">
                          Order #{ord.id}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Rider Arrived
                        </span>
                      </div>

                      <div className="text-xs text-slate-600">
                        <p className="font-medium text-slate-900">
                          Assigned Rider: {ord.riderName || 'Rider Rakib Hossain'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Vehicle: {ord.riderVehicle || 'Honda CG125 (Dhaka Metro-H-4421)'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {formatBDT(ord.total)}
                        </span>
                        <button
                          onClick={() => handleHandoverRider(ord.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Handover to Rider
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu & Stock Availability Tab */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-100">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Dish Stock & Real-Time Availability
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle items off instantly if ingredients run out during high demand rushes.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {activeRest.menuItems.filter((m) => m.isAvailable !== false).length} / {activeRest.menuItems.length} Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {activeRest.menuItems.map((dish) => {
                const isAvailable = dish.isAvailable !== false;
                return (
                  <div
                    key={dish.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isAvailable ? 'border-surface-200 bg-white' : 'border-rose-200 bg-rose-50/30 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-12 h-12 rounded-xl object-cover border border-surface-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                          {dish.name}
                        </h4>
                        <span className="font-display font-bold text-xs text-brand-600 block">
                          {formatBDT(dish.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMenuItemAvailability(activeRest.id, dish.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      {isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-100">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Dining Room Table Reservations
                </h3>
                <p className="text-xs text-slate-500">Upcoming reserved guest tables for {activeRest.name}</p>
              </div>
            </div>

            {restReservations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No upcoming table reservations booked for this location yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {restReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl border border-surface-200 bg-surface-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-900">
                        {res.guestName} ({res.guests} Guests)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {res.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p>
                        📅 Date: <strong className="text-slate-900">{res.date}</strong> at{' '}
                        <strong className="text-slate-900">{res.time}</strong>
                      </p>
                      <p>🪑 Seating Preference: {res.seating}</p>
                      <p>📞 Phone: {res.guestPhone}</p>
                      {res.specialRequest && (
                        <p className="italic text-slate-500">Note: "{res.specialRequest}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
