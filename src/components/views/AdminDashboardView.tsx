import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Bike,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Tag,
  MessageSquare,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';
import { PROMO_COUPONS } from '../../data/khabarData';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    restaurants,
    toggleRestaurantOpenStatus,
    updateOrderStatus,
    supportTickets,
    setPortalMode,
    formatBDT,
    showToast
  } = useKhabar();

  const [activeTab, setActiveTab] = useState<'orders' | 'restaurants' | 'coupons' | 'tickets'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate live KPI metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0) + 482500;
  const totalOrdersCount = orders.length + 1380;
  const activeOrdersCount = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length + 42;
  const openRestaurantsCount = restaurants.filter((r) => r.isOpen).length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.restaurantName.toLowerCase().includes(q) ||
        o.deliveryArea.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-700/80 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                  KHABAR Admin Console
                </h1>
                <span className="text-[10px] font-bold text-brand-300 bg-brand-500/20 border border-brand-500/30 px-2 py-0.5 rounded-md uppercase">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dhaka Metropolitan Dispatch & Partner Management Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast('Syncing live Dhaka telemetry...')}
              className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPortalMode('customer')}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Customer App</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Today's Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-display font-black text-2xl text-white">
              {totalOrdersCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% vs yesterday</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Gross Merchandise Value</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-display font-black text-2xl text-white">
              {formatBDT(totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.5% this week</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Kitchens</span>
              <Store className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-display font-black text-2xl text-white">
              {openRestaurantsCount} <span className="text-sm font-medium text-slate-400">/ {restaurants.length}</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-2">
              Across 8 Dhaka Hubs
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Dispatches</span>
              <Bike className="w-4 h-4 text-brand-400" />
            </div>
            <div className="font-display font-black text-2xl text-white">
              {activeOrdersCount}
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-2">
              Avg Delivery: 28 mins
            </div>
          </div>
        </div>

        {/* Analytics Chart SVG Section */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Dhaka Hourly Order Volume • আজকের অর্ডার গ্রাফ
              </h3>
              <p className="text-xs text-slate-400">Real-time demand surges across lunch and dinner peak hours</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <span className="text-slate-300">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="text-slate-400">Yesterday</span>
              </div>
            </div>
          </div>

          {/* SVG Line / Bar Chart */}
          <div className="w-full h-48 sm:h-56 pt-4">
            <svg className="w-full h-full" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d2e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff4d2e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#334155" strokeDasharray="3 3" />

              {/* Yesterday's line */}
              <path
                d="M 20,150 Q 80,140 140,120 T 260,70 T 380,110 T 500,50 T 620,65 T 680,120"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Today's Area & Line */}
              <path
                d="M 20,155 Q 80,135 140,105 T 260,50 T 380,95 T 500,30 T 620,45 T 680,90 L 680,170 L 20,170 Z"
                fill="url(#adminChartGrad)"
              />
              <path
                d="M 20,155 Q 80,135 140,105 T 260,50 T 380,95 T 500,30 T 620,45 T 680,90"
                fill="none"
                stroke="#ff4d2e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak Dots */}
              <circle cx="260" cy="50" r="5" fill="#ff4d2e" className="animate-pulse" />
              <circle cx="500" cy="30" r="5" fill="#ff4d2e" className="animate-pulse" />
            </svg>
            <div className="flex justify-between text-[11px] text-slate-400 px-2 mt-2">
              <span>9:00 AM</span>
              <span>12:00 PM</span>
              <span className="text-brand-400 font-bold">1:30 PM (Lunch Surge)</span>
              <span>4:00 PM</span>
              <span>7:00 PM</span>
              <span className="text-brand-400 font-bold">9:00 PM (Dinner Peak)</span>
              <span>11:30 PM</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'Live Orders Dispatch', icon: ShoppingBag, count: orders.length },
            { id: 'restaurants', label: 'Dhaka Kitchen Partners', icon: Store, count: restaurants.length },
            { id: 'coupons', label: 'Vouchers & Campaigns', icon: Tag, count: PROMO_COUPONS.length },
            { id: 'tickets', label: 'Support Tickets', icon: MessageSquare, count: supportTickets.length },
          ].map((tb) => {
            const Icon = tb.icon;
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tb.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {tb.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Live Orders */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {(['ALL', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all shrink-0 ${
                        orderFilter === st
                          ? 'bg-slate-700 text-brand-400 border border-brand-500/40'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by Order ID, Customer, Area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 w-full sm:w-64 focus:outline-hidden focus:border-brand-500"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase font-bold border-b border-slate-700/60">
                  <tr>
                    <th className="py-3.5 px-4">Order ID & Time</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Restaurant</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status & Dispatch</th>
                    <th className="py-3.5 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-white block">#{o.id}</span>
                        <span className="text-[10px] text-slate-400">{o.placedAt}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{o.customerName}</span>
                        <span className="text-[10px] text-slate-400">{o.deliveryArea}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{o.restaurantName}</span>
                        <span className="text-[10px] text-slate-400">{o.items.length} items</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {formatBDT(o.total)}
                        <span className="text-[10px] font-normal text-slate-400 block">{o.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-brand-400 focus:outline-hidden"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="PICKED_UP">PICKED_UP</option>
                          <option value="ON_THE_WAY">ON_THE_WAY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => showToast(`Rider dispatched for order #${o.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 font-bold text-[11px] transition-colors"
                        >
                          Assign Rider
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Restaurants */}
        {activeTab === 'restaurants' && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <h3 className="font-display font-bold text-base text-white">
                Dhaka Restaurant Partner Status
              </h3>
              <span className="text-xs text-slate-400">
                {openRestaurantsCount} open / {restaurants.length} registered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-900/70 border border-slate-700/70 p-4 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.logo || r.coverImage}
                      alt={r.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{r.name}</h4>
                      <span className="text-[11px] text-slate-400 block">{r.cuisine.join(', ')}</span>
                      <span className="text-[10px] text-amber-400 font-bold">★ {r.rating} ({r.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRestaurantOpenStatus(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      r.isOpen
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-emerald-500/20 hover:text-emerald-300'
                    }`}
                  >
                    {r.isOpen ? 'OPEN' : 'CLOSED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Coupons */}
        {activeTab === 'coupons' && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <h3 className="font-display font-bold text-base text-white">
                Active Promotional Campaigns & Promo Vouchers
              </h3>
              <button
                onClick={() => showToast('Campaign creation modal ready')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold"
              >
                + Create Promo Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROMO_COUPONS.map((cpn) => (
                <div
                  key={cpn.code}
                  className="bg-slate-900/80 border border-slate-700 p-4 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/40 font-mono font-bold text-xs text-brand-300">
                        {cpn.code}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{cpn.description}</p>
                    <p className="text-[11px] text-slate-400">
                      Min Spend: ৳{cpn.minOrder} • Max Discount: ৳{cpn.maxDiscount || 'No Limit'}
                    </p>
                  </div>

                  <span className="font-display font-black text-lg text-white shrink-0">
                    {cpn.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <h3 className="font-display font-bold text-base text-white">
                Customer Support Escalation Queue
              </h3>
              <span className="text-xs text-slate-400">
                {supportTickets.filter((t) => t.status === 'OPEN').length} pending response
              </span>
            </div>

            <div className="space-y-3">
              {supportTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-400">{tkt.id}</span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                        {tkt.category}
                      </span>
                      <span className="text-xs font-bold text-white">{tkt.subject}</span>
                    </div>
                    <p className="text-xs text-slate-300">{tkt.message}</p>
                    <span className="text-[10px] text-slate-500 block">Submitted {tkt.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tkt.status === 'OPEN'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {tkt.status}
                    </span>
                    <button
                      onClick={() => showToast(`Ticket ${tkt.id} resolved.`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      Resolve
                    </button>
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
