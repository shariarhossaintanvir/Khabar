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
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Star,
  Users,
  Eye,
  Sliders,
  Sparkles,
  MapPin,
  Tag,
  MessageSquare,
  Package,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';
import { Restaurant, MenuItem, AddOnOption } from '../../data/khabarData';
import { AppShell, NavItemConfig } from '../shared/AppShell';
import { StatCard } from '../shared/StatCard';
import { ChartCard } from '../shared/ChartCard';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { FilterBar } from '../shared/FilterBar';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';
import { AddFoodModal, CreateOfferModal } from '../admin/AdminModals';
import { OrderDetailsModal, ReplyReviewModal } from '../partner/PartnerModals';

export const RestaurantPartnerView: React.FC = () => {
  const {
    restaurants,
    orders,
    reservations,
    updateOrderStatus,
    toggleMenuItemAvailability,
    toggleRestaurantOpenStatus,
    addMenuItem,
    deleteMenuItem,
    replyToReview,
    inventory,
    updateInventoryStock,
    formatBDT,
    showToast,
    authenticatedUser,
  } = useKhabar();

  // Selected branch/restaurant outlet with RBAC isolation
  const isSuperAdmin = authenticatedUser?.role === 'ADMIN';
  const authorizedOutletId = authenticatedUser?.restaurantId || 'takeout';
  const [selectedOutletId, setSelectedOutletId] = useState<string>(
    isSuperAdmin ? (restaurants[0]?.id || 'takeout') : authorizedOutletId
  );
  const availableOutlets = isSuperAdmin
    ? restaurants
    : restaurants.filter((r) => r.id === authorizedOutletId);
  const activeRest: Restaurant =
    availableOutlets.find((r) => r.id === selectedOutletId) || availableOutlets[0] || restaurants[0];

  // Navigation
  const [activeNav, setActiveNav] = useState<string>('kds');

  // Kitchen Sound Toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderRecord | null>(null);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [activeReplyReview, setActiveReplyReview] = useState<{ id: string; name: string; comment: string } | null>(null);

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Filter states
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('All');

  // Partner Nav Items
  const partnerNavItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    {
      id: 'kds',
      label: 'Live Kitchen KDS',
      icon: <ChefHat className="w-4 h-4" />,
      badge: orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PREPARING').length,
      badgeColor: 'brand',
    },
    { id: 'orders', label: 'Order History', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu Manager', icon: <Tag className="w-4 h-4" />, badge: activeRest?.menuItems.length },
    { id: 'inventory', label: 'Inventory & Stock', icon: <Package className="w-4 h-4" /> },
    { id: 'reservations', label: 'Table Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'reviews', label: 'Customer Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Layers className="w-4 h-4" /> },
    { id: 'profile', label: 'Outlet Profile & Preview', icon: <Store className="w-4 h-4" /> },
    { id: 'settings', label: 'Kitchen Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  // Orders filtered for this restaurant
  const restOrders = orders.filter(
    (o) => o.restaurantId === activeRest.id || o.restaurantName.toLowerCase().includes(activeRest.name.toLowerCase())
  );

  // KDS Stages
  const newOrders = restOrders.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED');
  const preparingOrders = restOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = restOrders.filter((o) => o.status === 'PICKED_UP');
  const transitOrders = restOrders.filter((o) => o.status === 'ON_THE_WAY');

  // Header Outlet Controls
  const headerControls = (
    <div className="flex items-center gap-3 w-full max-w-lg justify-center sm:justify-end">
      {/* Branch Selector */}
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200/80">
        <Store className="w-3.5 h-3.5 text-amber-600" />
        <select
          value={selectedOutletId}
          disabled={!isSuperAdmin && availableOutlets.length <= 1}
          onChange={(e) => {
            setSelectedOutletId(e.target.value);
            showToast(`Switched active branch to ${restaurants.find((r) => r.id === e.target.value)?.name}`);
          }}
          className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden disabled:opacity-90"
        >
          {availableOutlets.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} {!isSuperAdmin && '(Authorized)'}
            </option>
          ))}
        </select>
      </div>

      {/* Kitchen Open / Closed Toggle */}
      <button
        onClick={() => toggleRestaurantOpenStatus(activeRest.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border ${
          activeRest.isOpen
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            activeRest.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <span>{activeRest.isOpen ? 'Accepting Orders' : 'Kitchen Closed'}</span>
      </button>

      {/* Audio Bell Alert Toggle */}
      <button
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          showToast(soundEnabled ? 'Kitchen order chimes muted.' : 'Kitchen order chimes active.');
        }}
        className={`p-2 rounded-xl border transition-colors ${
          soundEnabled
            ? 'bg-amber-50 text-amber-600 border-amber-200'
            : 'bg-slate-100 text-slate-400 border-slate-200'
        }`}
        title={soundEnabled ? 'Mute Kitchen Audio' : 'Unmute Kitchen Audio'}
      >
        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <AppShell
      portal="partner"
      portalBadge="Restaurant POS"
      portalTitle={activeRest.name}
      navItems={partnerNavItems}
      activeNavId={activeNav}
      onNavSelect={setActiveNav}
      headerControls={headerControls}
    >
      {/* 1. OVERVIEW VIEW */}
      {activeNav === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Outlet Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={activeRest.logo}
                alt={activeRest.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                    Good afternoon, {activeRest.name}
                  </h1>
                  <StatusBadge status={activeRest.isOpen ? 'ACTIVE' : 'CLOSED'} size="sm" pulse />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Here is your kitchen and delivery operations overview today in {activeRest.address}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveNav('kds')}
                className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all"
              >
                <ChefHat className="w-4 h-4" />
                <span>Open Live Kitchen Board</span>
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Today's Orders"
              value="68 Orders"
              icon={<ShoppingBag className="w-5 h-5" />}
              trend={{ value: '+14.2%', isPositive: true }}
              sparkline={[20, 32, 28, 45, 52, 68]}
              accent="brand"
              onClick={() => setActiveNav('kds')}
            />
            <StatCard
              title="Today's Gross Sales"
              value="৳42,850"
              icon={<DollarSign className="w-5 h-5" />}
              trend={{ value: '+18.5%', isPositive: true }}
              sparkline={[140, 180, 220, 310, 380, 428]}
              accent="emerald"
            />
            <StatCard
              title="Average Order Value"
              value="৳630"
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: '+4.0%', isPositive: true }}
              accent="blue"
            />
            <StatCard
              title="Customer Rating"
              value={`★ ${activeRest.rating}`}
              icon={<Star className="w-5 h-5" />}
              subtext={`${activeRest.reviewsCount} customer reviews`}
              accent="amber"
              onClick={() => setActiveNav('reviews')}
            />
            <StatCard
              title="Pending In Kitchen"
              value={`${newOrders.length + preparingOrders.length} Active`}
              icon={<Clock className="w-5 h-5" />}
              subtext="Avg prep time: 18 min"
              accent="purple"
              onClick={() => setActiveNav('kds')}
            />
            <StatCard
              title="Dishes In Stock"
              value={`${activeRest.menuItems.filter((m) => m.isAvailable !== false).length} / ${activeRest.menuItems.length}`}
              icon={<Tag className="w-5 h-5" />}
              subtext="Full catalog active"
              accent="emerald"
              onClick={() => setActiveNav('menu')}
            />
          </div>

          {/* Analytics Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ChartCard
                title="Weekly Restaurant Revenue (BDT)"
                subtitle="Net kitchen sales after KHABAR merchant commission"
                data={[
                  { label: 'Mon', value: 32000, formattedValue: '৳32,000' },
                  { label: 'Tue', value: 38500, formattedValue: '৳38,500' },
                  { label: 'Wed', value: 35200, formattedValue: '৳35,200' },
                  { label: 'Thu', value: 41000, formattedValue: '৳41,000' },
                  { label: 'Fri', value: 58400, formattedValue: '৳58,400' },
                  { label: 'Sat', value: 62000, formattedValue: '৳62,000' },
                  { label: 'Sun', value: 42850, formattedValue: '৳42,850' },
                ]}
                type="area"
                height={220}
              />
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900">Bestselling Dishes</h3>
                  <p className="text-xs text-slate-400">Items driving highest revenue this week</p>

                  <div className="mt-4 space-y-3">
                    {activeRest.menuItems.slice(0, 4).map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 truncate max-w-[140px]">{item.name}</span>
                        </div>
                        <strong className="text-slate-900">৳{item.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav('menu')}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Manage Full Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE ORDER BOARD (KITCHEN DISPLAY SYSTEM - KDS) */}
      {activeNav === 'kds' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl text-slate-900">
                  Kitchen Display System (KDS)
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs text-slate-500">
                Move orders through live prep stages to coordinate with arriving riders
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Kitchen pipeline synced.')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Refresh KDS"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {/* Column 1: New / Confirmed */}
            <div className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-800">
                    1. New Incoming
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-black">
                  {newOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {newOrders.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400 italic">No new incoming orders</p>
                ) : (
                  newOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="font-mono text-xs text-brand-600 font-bold">#{o.id}</strong>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Placed {o.placedAt}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{o.customerName}</h5>
                        <p className="text-[11px] text-slate-500">{o.deliveryArea}</p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                        {o.items.map((i) => (
                          <div key={i.id} className="flex justify-between text-slate-700">
                            <span>
                              <strong>{i.quantity}x</strong> {i.menuItem.name}
                            </span>
                            <span className="font-semibold">৳{i.itemTotal}</span>
                          </div>
                        ))}
                      </div>

                      {o.deliveryInstructions && (
                        <p className="text-[10px] text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                          ⚠️ {o.deliveryInstructions}
                        </p>
                      )}

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            updateOrderStatus(o.id, 'PREPARING');
                            showToast(`Order #${o.id} accepted! Kitchen notified.`, 'success');
                          }}
                          className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Accept Order →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: Preparing In Kitchen */}
            <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-200/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-amber-900">
                    2. In Cooking
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
                  {preparingOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {preparingOrders.length === 0 ? (
                  <p className="text-center py-8 text-xs text-amber-700/60 italic">No dishes in prep</p>
                ) : (
                  preparingOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white rounded-2xl p-4 border border-amber-200 shadow-card hover:shadow-card-hover transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="font-mono text-xs text-brand-600">#{o.id}</strong>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-600" />
                          Cooking (14m)
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                        {o.items.map((i) => (
                          <div key={i.id} className="flex justify-between text-slate-800">
                            <span>
                              <strong>{i.quantity}x</strong> {i.menuItem.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Rider: {o.riderName || 'Dhaka Courier arriving'}</span>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            updateOrderStatus(o.id, 'PICKED_UP');
                            showToast(`Order #${o.id} packed and marked ready for pickup!`, 'success');
                          }}
                          className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Mark Ready ✓
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Ready For Pickup */}
            <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-200/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-blue-900">
                    3. Ready For Rider
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-xs font-black">
                  {readyOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {readyOrders.length === 0 ? (
                  <p className="text-center py-8 text-xs text-blue-700/60 italic">No packed bags waiting</p>
                ) : (
                  readyOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white rounded-2xl p-4 border border-blue-200 shadow-card hover:shadow-card-hover transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="font-mono text-xs text-brand-600">#{o.id}</strong>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          Thermal Bag Packed
                        </span>
                      </div>

                      <div className="text-xs text-slate-800">
                        <h5 className="font-bold">{o.customerName}</h5>
                        <p className="text-[11px] text-slate-400">Total: ৳{o.total}</p>
                      </div>

                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-emerald-900 block text-[11px]">{o.riderName || 'Rider Arrived'}</strong>
                          <span className="text-[10px] text-emerald-700">Waiting at pickup desk</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            updateOrderStatus(o.id, 'ON_THE_WAY');
                            showToast(`Order #${o.id} handed over to rider!`, 'success');
                          }}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Handover Rider →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 4: Picked Up / En Route */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-200/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-emerald-900">
                    4. En Route
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black">
                  {transitOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {transitOrders.length === 0 ? (
                  <p className="text-center py-8 text-xs text-emerald-700/60 italic">No orders in transit</p>
                ) : (
                  transitOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-card hover:shadow-card-hover transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="font-mono text-xs text-brand-600">#{o.id}</strong>
                        <StatusBadge status="ON_THE_WAY" size="sm" pulse />
                      </div>

                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{o.customerName}</h5>
                        <p className="text-[11px] text-slate-500">Destination: {o.deliveryArea}</p>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Courier: {o.riderName}</span>
                      </div>

                      <button
                        onClick={() => setSelectedOrderDetails(o)}
                        className="w-full py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MENU MANAGEMENT */}
      {activeNav === 'menu' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">
                Menu Management: {activeRest.name}
              </h2>
              <p className="text-xs text-slate-500">
                Update dish pricing, photos, ingredients, and toggle instant stock availability
              </p>
            </div>
            <button
              onClick={() => setIsAddFoodOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <FilterBar
            searchPlaceholder="Search dishes..."
            searchValue={menuSearch}
            onSearchChange={setMenuSearch}
            activeChip={selectedMenuCategory}
            onChipSelect={setSelectedMenuCategory}
            filterChips={['All', ...activeRest.menuCategories].map((cat) => ({
              id: cat,
              label: cat,
              count: cat === 'All' ? activeRest.menuItems.length : activeRest.menuItems.filter((m) => m.category === cat).length,
            }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeRest.menuItems
              .filter((item) => {
                const matchesSearch =
                  !menuSearch ||
                  item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                  item.bengaliName.includes(menuSearch);
                const matchesCat = selectedMenuCategory === 'All' || item.category === selectedMenuCategory;
                return matchesSearch && matchesCat;
              })
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-display font-black text-sm drop-shadow-xs">{item.name}</h4>
                        <span className="text-[11px] font-bengali opacity-90">{item.bengaliName}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <strong className="font-black text-base text-slate-900">৳{item.price}</strong>
                          {item.originalPrice && (
                            <span className="line-through text-xs text-slate-400">৳{item.originalPrice}</span>
                          )}
                        </div>

                        {/* Instant In-Stock Switch */}
                        <button
                          onClick={() => toggleMenuItemAvailability(activeRest.id, item.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                            item.isAvailable !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {item.isAvailable !== false ? 'Available' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: `Delete ${item.name}?`,
                          description: `Are you sure you want to permanently remove this dish from ${activeRest.name}?`,
                          confirmText: 'Delete Dish',
                          isDestructive: true,
                          onConfirm: () => {
                            deleteMenuItem(activeRest.id, item.id);
                            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. INVENTORY & STOCK TRACKING */}
      {activeNav === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Kitchen Pantry & Ingredient Stock</h2>
            <p className="text-xs text-slate-500">Live portion counts and automated low-stock warnings</p>
          </div>

          <DataTable
            data={inventory}
            keyExtractor={(i) => i.id}
            columns={[
              {
                header: 'Item / Dish',
                accessor: (i) => (
                  <div>
                    <strong className="font-bold text-slate-900 text-xs sm:text-sm">{i.foodName}</strong>
                    <p className="text-[11px] text-slate-400 font-bengali">{i.bengaliName}</p>
                  </div>
                ),
              },
              {
                header: 'Category',
                accessor: (i) => <span className="text-slate-600 font-medium">{i.category}</span>,
              },
              {
                header: 'Stock Count',
                accessor: (i) => (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={i.currentStock}
                      onChange={(e) => updateInventoryStock(i.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                    />
                    <span className="text-xs text-slate-500">{i.unit}</span>
                  </div>
                ),
              },
              {
                header: 'Status',
                accessor: (i) => <StatusBadge status={i.status} size="sm" />,
              },
              {
                header: 'Last Restocked',
                accessor: (i) => <span className="text-xs text-slate-400">{i.lastRestocked}</span>,
              },
            ]}
          />
        </div>
      )}

      {/* 5. TABLE RESERVATIONS */}
      {activeNav === 'reservations' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Dine-in Reservations</h2>
            <p className="text-xs text-slate-500">Table booking schedule for {activeRest.name}</p>
          </div>

          <DataTable
            data={reservations.filter((r) => r.restaurantId === activeRest.id || r.restaurantName.includes(activeRest.name))}
            keyExtractor={(r) => r.id}
            emptyMessage="No reservations booked yet"
            emptySubtext="New guest table bookings will appear here."
            columns={[
              {
                header: 'Pass ID',
                accessor: (r) => <strong className="font-mono text-slate-900">#{r.id}</strong>,
              },
              {
                header: 'Guest Name',
                accessor: (r) => (
                  <div>
                    <strong className="text-slate-800">{r.guestName}</strong>
                    <p className="text-[11px] text-slate-400">{r.guestPhone}</p>
                  </div>
                ),
              },
              {
                header: 'Date & Time',
                accessor: (r) => (
                  <div>
                    <span className="font-semibold text-slate-800">{r.date}</span>
                    <p className="text-[11px] text-brand-600 font-bold">{r.time}</p>
                  </div>
                ),
              },
              {
                header: 'Party Size',
                accessor: (r) => <span className="font-bold text-slate-800">{r.guests} Guests</span>,
              },
              {
                header: 'Seating',
                accessor: (r) => <span className="text-xs text-slate-600">{r.seating}</span>,
              },
              {
                header: 'Status',
                accessor: (r) => <StatusBadge status={r.status} size="sm" />,
              },
            ]}
          />
        </div>
      )}

      {/* 6. CUSTOMER REVIEWS & REPLIES */}
      {activeNav === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Customer Feedback & Reviews</h2>
            <p className="text-xs text-slate-500">
              Read verified customer reviews and post official restaurant replies.
            </p>
          </div>

          <div className="space-y-4">
            {activeRest.reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
                No customer reviews yet for this branch.
              </div>
            ) : (
              activeRest.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.userName}</h4>
                      <p className="text-[11px] text-slate-400">{rev.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    "{rev.comment}"
                  </p>

                  {/* Existing Reply if any */}
                  {rev.reply && (
                    <div className="bg-brand-50/70 p-3 rounded-xl border border-brand-100 text-xs text-brand-900 space-y-1">
                      <strong>Owner Response:</strong>
                      <p className="text-brand-800">{rev.reply}</p>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() =>
                        setActiveReplyReview({
                          id: rev.id,
                          name: rev.userName,
                          comment: rev.comment,
                        })
                      }
                      className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all"
                    >
                      {rev.reply ? 'Edit Reply' : 'Reply as Restaurant'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. OUTLET PROFILE & LIVE CUSTOMER APP PREVIEW */}
      {activeNav === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Outlet Profile & Live Preview</h2>
            <p className="text-xs text-slate-500">
              Preview how {activeRest.name} appears to foodies on the KHABAR Customer App
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Edit Info */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
              <h3 className="font-display font-black text-lg text-slate-900">Restaurant Information</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outlet Name</label>
                  <input
                    type="text"
                    defaultValue={activeRest.name}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bengali Name</label>
                  <input
                    type="text"
                    defaultValue={activeRest.bengaliName}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bengali"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    defaultValue={activeRest.address}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Hours</label>
                  <input
                    type="text"
                    defaultValue={activeRest.openingHours}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cuisines</label>
                  <input
                    type="text"
                    defaultValue={activeRest.cuisine.join(', ')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => showToast('Restaurant profile saved!', 'success')}
                    className="w-full py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Customer Card Simulation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <h4 className="font-display font-black text-sm text-slate-800">
                  Live Customer Experience Preview
                </h4>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
                <div className="relative h-48 w-full bg-slate-100">
                  <img src={activeRest.coverImage} alt={activeRest.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-xs">
                      ★ {activeRest.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 flex items-center gap-3 text-white">
                    <img
                      src={activeRest.logo}
                      alt={activeRest.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="font-display font-black text-lg drop-shadow-xs">{activeRest.name}</h4>
                      <p className="text-xs opacity-90">{activeRest.cuisine.join(' • ')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {activeRest.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5 text-slate-400" />
                      Delivery: ৳{activeRest.deliveryFee}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activeRest.distance}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      Menu Preview
                    </h5>
                    <div className="space-y-2">
                      {activeRest.menuItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <strong className="text-slate-900">৳{item.price}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <OrderDetailsModal
        order={selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        onAdvanceStatus={(orderId) => {
          const current = orders.find((o) => o.id === orderId);
          if (current) {
            const nextStatus: OrderRecord['status'] =
              current.status === 'PLACED' || current.status === 'CONFIRMED'
                ? 'PREPARING'
                : current.status === 'PREPARING'
                ? 'PICKED_UP'
                : 'ON_THE_WAY';
            updateOrderStatus(orderId, nextStatus);
            showToast(`Advanced Order #${orderId} to ${nextStatus}`, 'success');
          }
        }}
      />

      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        restaurantId={activeRest.id}
        restaurantName={activeRest.name}
        onSubmit={(dish) => addMenuItem(activeRest.id, dish)}
      />

      <ReplyReviewModal
        isOpen={!!activeReplyReview}
        onClose={() => setActiveReplyReview(null)}
        reviewId={activeReplyReview?.id || ''}
        customerName={activeReplyReview?.name || ''}
        comment={activeReplyReview?.comment || ''}
        onReply={(revId, text) => replyToReview(activeRest.id, revId, text)}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </AppShell>
  );
};
