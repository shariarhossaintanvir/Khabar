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
  ArrowLeft,
  Users,
  Calendar,
  CreditCard,
  Star,
  Plus,
  Sliders,
  DollarSign,
  FileText,
  Lock,
  Compass,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  Trash2,
} from 'lucide-react';
import { useKhabar, OrderRecord } from '../../context/KhabarContext';
import {
  PendingRestaurant,
  RiderProfile,
  PaymentTransaction,
  Restaurant,
  MenuItem,
  PromoCoupon,
} from '../../data/khabarData';
import { AppShell, NavItemConfig } from '../shared/AppShell';
import { StatCard } from '../shared/StatCard';
import { ChartCard, ChartDataPoint } from '../shared/ChartCard';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { FilterBar } from '../shared/FilterBar';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';
import {
  GlobalSearchModal,
  AddRestaurantModal,
  AddFoodModal,
  CreateOfferModal,
} from '../admin/AdminModals';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    restaurants,
    pendingRestaurants,
    approveRestaurant,
    rejectRestaurant,
    requestChangesRestaurant,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    coupons,
    createCoupon,
    deleteCoupon,
    transactions,
    refundTransaction,
    riders,
    updateRiderStatus,
    assignRiderToOrder,
    reservations,
    supportTickets,
    updateOrderStatus,
    toggleRestaurantOpenStatus,
    toggleMenuItemAvailability,
    formatBDT,
    showToast,
  } = useKhabar();

  // Navigation State
  const [activeNav, setActiveNav] = useState<string>('overview');

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    isDestructive?: boolean;
    requireReason?: boolean;
    reasonPlaceholder?: string;
    onConfirm: (reason?: string) => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Selected filter states
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [restaurantSearch, setRestaurantSearch] = useState<string>('');
  const [foodSearch, setFoodSearch] = useState<string>('');
  const [selectedMetroZone, setSelectedMetroZone] = useState<string>('Dhaka All');
  const [dateRange, setDateRange] = useState<string>('7 Days');

  // Role Based Settings State
  const [activeRole, setActiveRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SUPPORT'>('SUPER_ADMIN');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // 14 Nav Items configuration
  const adminNavItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: orders.length,
      badgeColor: 'brand',
    },
    {
      id: 'restaurants',
      label: 'Restaurants',
      icon: <Store className="w-4 h-4" />,
      badge: restaurants.length,
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: pendingRestaurants.filter((p) => p.status === 'PENDING').length,
      badgeColor: 'amber',
    },
    { id: 'menu', label: 'Food & Menu', icon: <Tag className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    {
      id: 'riders',
      label: 'Riders Fleet',
      icon: <Bike className="w-4 h-4" />,
      badge: riders.filter((r) => r.status === 'ONLINE').length,
      badgeColor: 'emerald',
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: <Calendar className="w-4 h-4" />,
      badge: reservations.length,
    },
    { id: 'coupons', label: 'Offers & Coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    {
      id: 'support',
      label: 'Support Center',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: supportTickets.filter((t) => t.status === 'OPEN').length,
      badgeColor: 'rose',
    },
    { id: 'notifications', label: 'Alerts', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & RBAC', icon: <Sliders className="w-4 h-4" /> },
  ];

  // Key KPI calculations
  const totalRevenueNumber = 1284500 + orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const totalOrdersCount = 8492 + orders.length;
  const activeCustomersCount = 24580;
  const activeRestaurantsCount = restaurants.filter((r) => r.isOpen).length;
  const activeRidersCount = riders.filter((r) => r.status === 'ONLINE' || r.status === 'BUSY').length;

  // Chart Sample Data Points
  const revenueChartData: ChartDataPoint[] = [
    { label: 'Mon', value: 168400, formattedValue: '৳1,68,400' },
    { label: 'Tue', value: 184500, formattedValue: '৳1,84,500' },
    { label: 'Wed', value: 172900, formattedValue: '৳1,72,900' },
    { label: 'Thu', value: 215600, formattedValue: '৳2,15,600' },
    { label: 'Fri', value: 298400, formattedValue: '৳2,98,400' },
    { label: 'Sat', value: 312000, formattedValue: '৳3,12,000' },
    { label: 'Sun', value: 248000, formattedValue: '৳2,48,000' },
  ];

  const hourlyRushData: ChartDataPoint[] = [
    { label: '11 AM', value: 42 },
    { label: '12 PM', value: 115 },
    { label: '1 PM', value: 340 },
    { label: '2 PM', value: 280 },
    { label: '3 PM', value: 95 },
    { label: '5 PM', value: 65 },
    { label: '7 PM', value: 190 },
    { label: '8 PM', value: 410 },
    { label: '9 PM', value: 385 },
    { label: '10 PM', value: 160 },
  ];

  // Top performing restaurants
  const topRestaurants = restaurants.slice(0, 4);

  // Top foods
  const topFoods: MenuItem[] = restaurants.flatMap((r) => r.menuItems).slice(0, 4);

  // Header controls in topbar
  const headerControls = (
    <div className="flex items-center gap-2 w-full max-w-md">
      <button
        onClick={() => setIsSearchOpen(true)}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-xs text-slate-500 font-medium transition-colors border border-slate-200/60"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-brand-600" />
          <span>Search orders, restaurants, riders...</span>
        </div>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-400 rounded-md shadow-2xs border border-slate-200">
          ⌘K
        </kbd>
      </button>

      {/* Metro Zone Selector */}
      <select
        value={selectedMetroZone}
        onChange={(e) => {
          setSelectedMetroZone(e.target.value);
          showToast(`Filtered operations to ${e.target.value}`);
        }}
        className="hidden sm:block px-2.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden"
      >
        <option value="Dhaka All">Dhaka (All Zones)</option>
        <option value="Dhanmondi">Dhanmondi</option>
        <option value="Gulshan">Gulshan & Banani</option>
        <option value="Mirpur">Mirpur Circle</option>
        <option value="Uttara">Uttara Sectors</option>
        <option value="Chattogram">Chattogram</option>
      </select>
    </div>
  );

  return (
    <AppShell
      portal="admin"
      portalBadge="Control Center"
      portalTitle="KHABAR Operations"
      navItems={adminNavItems}
      activeNavId={activeNav}
      onNavSelect={setActiveNav}
      headerControls={headerControls}
    >
      {/* 1. OVERVIEW VIEW */}
      {activeNav === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Dashboard Header Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Good morning, Admin
                </h1>
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  Dhaka Operations Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Here's what's happening across KHABAR food delivery network today.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                {['Today', '7 Days', '30 Days'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDateRange(d)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      dateRange === d
                        ? 'bg-white text-slate-900 shadow-2xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Restaurant</span>
              </button>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <StatCard
              title="Total Revenue"
              value={`৳${(totalRevenueNumber / 100000).toFixed(2)} Lakh`}
              icon={<DollarSign className="w-5 h-5" />}
              trend={{ value: '+18.4%', isPositive: true }}
              sparkline={[12, 18, 14, 22, 28, 32, 38]}
              subtext="vs last 7 days"
              accent="brand"
            />
            <StatCard
              title="Total Orders"
              value={totalOrdersCount.toLocaleString()}
              icon={<ShoppingBag className="w-5 h-5" />}
              trend={{ value: '+12.8%', isPositive: true }}
              sparkline={[80, 95, 88, 110, 130, 145, 160]}
              subtext="99.2% fulfillment"
              accent="blue"
            />
            <StatCard
              title="Active Customers"
              value={activeCustomersCount.toLocaleString()}
              icon={<Users className="w-5 h-5" />}
              trend={{ value: '+8.6%', isPositive: true }}
              sparkline={[210, 218, 225, 230, 240, 248]}
              subtext="Dhaka Metropolitan"
              accent="emerald"
            />
            <StatCard
              title="Active Restaurants"
              value={activeRestaurantsCount.toString()}
              icon={<Store className="w-5 h-5" />}
              trend={{ value: '+5.2%', isPositive: true }}
              subtext={`${pendingRestaurants.filter((p) => p.status === 'PENDING').length} pending review`}
              accent="amber"
              onClick={() => setActiveNav('restaurants')}
            />
            <StatCard
              title="Active Riders Fleet"
              value={activeRidersCount.toString()}
              icon={<Bike className="w-5 h-5" />}
              trend={{ value: '+11.3%', isPositive: true }}
              subtext="Avg pickup 12 min"
              accent="emerald"
              onClick={() => setActiveNav('riders')}
            />
            <StatCard
              title="Cancelled Orders"
              value="2.1%"
              icon={<AlertCircle className="w-5 h-5" />}
              trend={{ value: '-0.8%', isPositive: true }}
              subtext="Lowest this month"
              accent="purple"
            />
          </div>

          {/* Revenue Analytics & Rush Hour Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ChartCard
                title="Platform Revenue Trend (BDT)"
                subtitle="Daily transaction volume processed through bKash, Nagad, and Cards"
                data={revenueChartData}
                type="area"
                height={220}
                timeframeOptions={['Today', '7 Days', '30 Days']}
                selectedTimeframe={dateRange}
                onTimeframeChange={setDateRange}
              />
            </div>
            <div className="lg:col-span-4">
              <ChartCard
                title="Hourly Order Rush"
                subtitle="Peak lunch & dinner hours in Dhaka"
                data={hourlyRushData}
                type="bar"
                height={220}
                valueSuffix=" orders"
              />
            </div>
          </div>

          {/* Live Operations Dispatch Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-display font-black text-lg tracking-tight">
                  Live Dispatch Ticker
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Updating real-time Dhaka telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  onClick={() => setActiveNav('orders')}
                  className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-400">#{o.id}</span>
                    <StatusBadge status={o.status} size="sm" />
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">{o.restaurantName}</h5>
                  <p className="text-[11px] text-slate-400">
                    Rider: {o.riderName || 'Assigning...'} • {o.deliveryArea}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Restaurants & Top Foods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Restaurants */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg text-slate-900 tracking-tight">
                  Top Performing Restaurants
                </h3>
                <button
                  onClick={() => setActiveNav('restaurants')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  View All ({restaurants.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {topRestaurants.map((r, i) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-4">0{i + 1}</span>
                      <img
                        src={r.logo}
                        alt={r.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                        <p className="text-[11px] text-slate-400">★ {r.rating} ({r.reviewsCount} orders)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900">৳84,200</span>
                      <p className="text-[10px] text-emerald-600 font-bold">+14.2%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Foods */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg text-slate-900 tracking-tight">
                  Top Selling Food Dishes
                </h3>
                <button
                  onClick={() => setActiveNav('menu')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  Manage Menu →
                </button>
              </div>

              <div className="space-y-3">
                {topFoods.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-4">0{i + 1}</span>
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{f.name}</h4>
                        <p className="text-[11px] text-slate-400">{f.restaurantName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900">৳{f.price}</span>
                      <p className="text-[10px] text-brand-600 font-bold">148 orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT VIEW */}
      {activeNav === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">Orders Management</h2>
              <p className="text-xs text-slate-500">Live order dispatch, tracking, and override pipeline</p>
            </div>
            <button
              onClick={() => showToast('Syncing Dhaka dispatch network...')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Orders</span>
            </button>
          </div>

          <FilterBar
            searchPlaceholder="Search order ID, customer name, restaurant..."
            searchValue={orderSearch}
            onSearchChange={setOrderSearch}
            activeChip={orderFilter}
            onChipSelect={setOrderFilter}
            filterChips={[
              { id: 'ALL', label: 'All Orders', count: orders.length },
              { id: 'CONFIRMED', label: 'New / Confirmed', count: orders.filter((o) => o.status === 'CONFIRMED').length },
              { id: 'PREPARING', label: 'In Kitchen', count: orders.filter((o) => o.status === 'PREPARING').length },
              { id: 'PICKED_UP', label: 'Rider Picked', count: orders.filter((o) => o.status === 'PICKED_UP').length },
              { id: 'ON_THE_WAY', label: 'En Route', count: orders.filter((o) => o.status === 'ON_THE_WAY').length },
              { id: 'DELIVERED', label: 'Delivered', count: orders.filter((o) => o.status === 'DELIVERED').length },
              { id: 'CANCELLED', label: 'Cancelled', count: orders.filter((o) => o.status === 'CANCELLED').length },
            ]}
          />

          <DataTable<OrderRecord>
            data={orders.filter((o) => {
              if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
              if (orderSearch) {
                const s = orderSearch.toLowerCase();
                return (
                  o.id.toLowerCase().includes(s) ||
                  o.customerName.toLowerCase().includes(s) ||
                  o.restaurantName.toLowerCase().includes(s) ||
                  o.deliveryArea.toLowerCase().includes(s)
                );
              }
              return true;
            })}
            keyExtractor={(o) => o.id}
            columns={[
              {
                header: 'Order',
                accessor: (o) => (
                  <div>
                    <strong className="font-mono font-bold text-slate-900">#{o.id}</strong>
                    <p className="text-[11px] text-slate-400">{o.placedAt}</p>
                  </div>
                ),
              },
              {
                header: 'Customer',
                accessor: (o) => (
                  <div>
                    <span className="font-bold text-slate-900">{o.customerName}</span>
                    <p className="text-[11px] text-slate-400">{o.deliveryArea}</p>
                  </div>
                ),
              },
              {
                header: 'Restaurant',
                accessor: (o) => <span className="font-semibold text-slate-800">{o.restaurantName}</span>,
              },
              {
                header: 'Items',
                accessor: (o) => (
                  <span className="text-slate-600 text-xs">
                    {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </span>
                ),
              },
              {
                header: 'Amount',
                accessor: (o) => <strong className="font-black text-slate-900">৳{o.total}</strong>,
              },
              {
                header: 'Payment',
                accessor: (o) => (
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {o.paymentMethod}
                  </span>
                ),
              },
              {
                header: 'Status',
                accessor: (o) => <StatusBadge status={o.status} size="sm" />,
              },
              {
                header: 'Action',
                align: 'right',
                accessor: (o) => (
                  <div className="flex items-center justify-end gap-1.5">
                    {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                      <button
                        onClick={() => {
                          const nextStatus: OrderRecord['status'] =
                            o.status === 'PLACED' || o.status === 'CONFIRMED'
                              ? 'PREPARING'
                              : o.status === 'PREPARING'
                              ? 'PICKED_UP'
                              : o.status === 'PICKED_UP'
                              ? 'ON_THE_WAY'
                              : 'DELIVERED';
                          updateOrderStatus(o.id, nextStatus);
                          showToast(`Updated Order #${o.id} to ${nextStatus}`, 'success');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors"
                      >
                        Advance
                      </button>
                    )}
                    {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: `Cancel Order #${o.id}?`,
                            description: 'Are you sure you want to cancel this order? This will inform customer and kitchen.',
                            confirmText: 'Cancel Order',
                            isDestructive: true,
                            onConfirm: () => {
                              updateOrderStatus(o.id, 'CANCELLED');
                              setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                              showToast(`Order #${o.id} cancelled.`, 'info');
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Cancel Order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            renderMobileCard={(o) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-brand-600">#{o.id}</span>
                  <StatusBadge status={o.status} size="sm" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{o.restaurantName}</h5>
                    <p className="text-[11px] text-slate-500">
                      Customer: {o.customerName} ({o.deliveryArea})
                    </p>
                  </div>
                  <strong className="text-xs font-black text-slate-900">৳{o.total}</strong>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                </p>
              </div>
            )}
          />
        </div>
      )}

      {/* 3. RESTAURANTS DIRECTORY */}
      {activeNav === 'restaurants' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">Restaurant Outlets</h2>
              <p className="text-xs text-slate-500">Manage all partnered kitchens across Dhaka metropolitan</p>
            </div>
            <button
              onClick={() => setIsAddRestaurantOpen(true)}
              className="px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Restaurant</span>
            </button>
          </div>

          <FilterBar
            searchPlaceholder="Search restaurant name, cuisine, address..."
            searchValue={restaurantSearch}
            onSearchChange={setRestaurantSearch}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants
              .filter(
                (r) =>
                  !restaurantSearch ||
                  r.name.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
                  r.cuisine.some((c) => c.toLowerCase().includes(restaurantSearch.toLowerCase()))
              )
              .map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Header */}
                    <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                      <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={r.isOpen ? 'ACTIVE' : 'CLOSED'} size="sm" />
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <img
                          src={r.logo}
                          alt={r.name}
                          className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs"
                        />
                        <div className="text-white">
                          <h4 className="font-display font-black text-sm drop-shadow-xs">{r.name}</h4>
                          <span className="text-[11px] font-bengali opacity-90">{r.bengaliName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>{r.cuisine.join(', ')}</span>
                        <span className="font-bold flex items-center gap-1 text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {r.rating} ({r.reviewsCount})
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>{r.address}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                        <span>Fee: ৳{r.deliveryFee}</span>
                        <span>{r.menuItems.length} Dishes</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => toggleRestaurantOpenStatus(r.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        r.isOpen
                          ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {r.isOpen ? 'Close Outlet' : 'Open Outlet'}
                    </button>

                    <button
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: `Delete ${r.name}?`,
                          description: 'Are you sure you want to remove this restaurant outlet from KHABAR directory?',
                          confirmText: 'Delete Restaurant',
                          isDestructive: true,
                          onConfirm: () => {
                            deleteRestaurant(r.id);
                            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Outlet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. RESTAURANT APPROVAL WORKFLOW */}
      {activeNav === 'approvals' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Partner Merchant Applications</h2>
            <p className="text-xs text-slate-500">
              Review and approve submitted restaurant onboarding documents, sanitation certifications, and trade licenses.
            </p>
          </div>

          <div className="space-y-4">
            {pendingRestaurants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.logo}
                      alt={app.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-black text-lg text-slate-900">{app.name}</h4>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500">
                        Owner: <strong>{app.ownerName}</strong> • Submitted: {app.submittedDate}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-500">
                    <p>Zone: <strong>{app.area}, {app.city}</strong></p>
                    <p>Contact: {app.phone}</p>
                  </div>
                </div>

                {/* Document Verification Pills */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Trade License</span>
                      <strong className="text-slate-800 font-mono text-[11px]">{app.tradeLicenseNumber}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">TIN Certificate</span>
                      <strong className="text-slate-800 font-mono text-[11px]">{app.tinNumber}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Address</span>
                      <span className="text-slate-700 truncate block">{app.address}</span>
                    </div>
                  </div>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                    <strong>Merchant Note:</strong> {app.notes}
                  </p>
                )}

                {/* Workflow Actions */}
                {app.status === 'PENDING' && (
                  <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: `Request Changes for ${app.name}?`,
                          description: 'Specify which documents or certificates need rectification.',
                          confirmText: 'Send Request',
                          isDestructive: false,
                          requireReason: true,
                          reasonPlaceholder: 'e.g. Please re-upload DSCC Trade License valid for 2026.',
                          onConfirm: (notes) => {
                            requestChangesRestaurant(app.id, notes || 'Please verify Trade License.');
                            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Request Changes
                    </button>

                    <button
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: `Reject Application for ${app.name}?`,
                          description: 'Are you sure you want to reject this restaurant partner application?',
                          confirmText: 'Reject Application',
                          isDestructive: true,
                          onConfirm: () => {
                            rejectRestaurant(app.id);
                            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => {
                        approveRestaurant(app.id);
                      }}
                      className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-brand transition-all"
                    >
                      Approve & Launch Outlet
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FOOD & MENU MANAGEMENT */}
      {activeNav === 'menu' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">Food & Menu Directory</h2>
              <p className="text-xs text-slate-500">Manage dishes, pricing, discounts, and availability toggles</p>
            </div>
            <button
              onClick={() => setIsAddFoodOpen(true)}
              className="px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Food Item</span>
            </button>
          </div>

          <FilterBar
            searchPlaceholder="Search food item name, restaurant, category..."
            searchValue={foodSearch}
            onSearchChange={setFoodSearch}
          />

          <DataTable<MenuItem>
            data={restaurants
              .flatMap((r) => r.menuItems)
              .filter(
                (item) =>
                  !foodSearch ||
                  item.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
                  item.category.toLowerCase().includes(foodSearch.toLowerCase()) ||
                  item.restaurantName.toLowerCase().includes(foodSearch.toLowerCase())
              )}
            keyExtractor={(item) => `${item.restaurantId}-${item.id}`}
            columns={[
              {
                header: 'Dish',
                accessor: (item) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h5>
                      <span className="text-[11px] text-slate-400 font-bengali">{item.bengaliName}</span>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Restaurant',
                accessor: (item) => <span className="font-semibold text-slate-800">{item.restaurantName}</span>,
              },
              {
                header: 'Category',
                accessor: (item) => (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {item.category}
                  </span>
                ),
              },
              {
                header: 'Price',
                accessor: (item) => (
                  <div className="flex items-center gap-1.5">
                    <strong className="font-black text-slate-900">৳{item.price}</strong>
                    {item.originalPrice && (
                      <span className="line-through text-slate-400 text-xs">৳{item.originalPrice}</span>
                    )}
                  </div>
                ),
              },
              {
                header: 'Availability',
                accessor: (item) => (
                  <button
                    onClick={() => toggleMenuItemAvailability(item.restaurantId, item.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                      item.isAvailable !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {item.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
                  </button>
                ),
              },
              {
                header: 'Action',
                align: 'right',
                accessor: (item) => (
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: `Delete ${item.name}?`,
                        description: `Remove this dish from ${item.restaurantName} menu?`,
                        confirmText: 'Delete Dish',
                        isDestructive: true,
                        onConfirm: () => {
                          deleteMenuItem(item.restaurantId, item.id);
                          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                        },
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* 6. CUSTOMER MANAGEMENT */}
      {activeNav === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Customer Accounts</h2>
            <p className="text-xs text-slate-500">Dhaka food delivery consumer registry and lifetime value</p>
          </div>

          <DataTable
            data={[
              { id: 'c-1', name: 'Shariar Hossain Tanvir', phone: '+880 1712-345678', orders: 48, spent: 34800, lastOrder: 'Today', zone: 'Mirpur DOHS', status: 'ACTIVE' },
              { id: 'c-2', name: 'Ayesha Siddika', phone: '+880 1819-223344', orders: 36, spent: 26400, lastOrder: 'Yesterday', zone: 'Dhanmondi', status: 'ACTIVE' },
              { id: 'c-3', name: 'Nafis Chowdhury', phone: '+880 1912-998877', orders: 22, spent: 18900, lastOrder: '3 days ago', zone: 'Gulshan 2', status: 'ACTIVE' },
              { id: 'c-4', name: 'Sabrina Noor', phone: '+880 1612-443322', orders: 19, spent: 14200, lastOrder: '5 days ago', zone: 'Banani', status: 'ACTIVE' },
              { id: 'c-5', name: 'Mahmudur Rahman', phone: '+880 1711-556677', orders: 54, spent: 42100, lastOrder: 'Today', zone: 'Uttara', status: 'ACTIVE' },
            ]}
            keyExtractor={(c) => c.id}
            columns={[
              {
                header: 'Customer',
                accessor: (c) => (
                  <div>
                    <strong className="font-bold text-slate-900">{c.name}</strong>
                    <p className="text-[11px] text-slate-400">{c.phone}</p>
                  </div>
                ),
              },
              {
                header: 'Delivery Zone',
                accessor: (c) => <span className="text-slate-600">{c.zone}</span>,
              },
              {
                header: 'Lifetime Orders',
                accessor: (c) => <span className="font-bold text-slate-800">{c.orders} orders</span>,
              },
              {
                header: 'Total Spent',
                accessor: (c) => <strong className="font-black text-slate-900">৳{c.spent.toLocaleString()}</strong>,
              },
              {
                header: 'Last Active',
                accessor: (c) => <span className="text-xs text-slate-500">{c.lastOrder}</span>,
              },
              {
                header: 'Status',
                accessor: (c) => <StatusBadge status={c.status} size="sm" />,
              },
            ]}
          />
        </div>
      )}

      {/* 7. RIDERS FLEET MANAGEMENT */}
      {activeNav === 'riders' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">Riders Courier Fleet</h2>
              <p className="text-xs text-slate-500">Dhaka delivery drivers, online availability, and daily payouts</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                ● {riders.filter((r) => r.status === 'ONLINE').length} Couriers Online
              </span>
            </div>
          </div>

          <DataTable<RiderProfile>
            data={riders}
            keyExtractor={(rd) => rd.id}
            columns={[
              {
                header: 'Courier',
                accessor: (rd) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={rd.avatar}
                      alt={rd.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{rd.name}</h5>
                      <p className="text-[11px] text-slate-400">{rd.phone}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Vehicle & Reg',
                accessor: (rd) => (
                  <div>
                    <span className="font-semibold text-slate-800">{rd.vehicleModel}</span>
                    <p className="font-mono text-[11px] text-slate-400">{rd.vehicleNumber}</p>
                  </div>
                ),
              },
              {
                header: 'Operating Zone',
                accessor: (rd) => <span className="text-slate-700 font-medium">{rd.zone}</span>,
              },
              {
                header: 'Rating & Trips',
                accessor: (rd) => (
                  <div>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {rd.rating}
                    </span>
                    <p className="text-[11px] text-slate-400">{rd.totalTrips} deliveries</p>
                  </div>
                ),
              },
              {
                header: "Today's Payout",
                accessor: (rd) => <strong className="font-black text-slate-900">৳{rd.todayEarnings}</strong>,
              },
              {
                header: 'Status',
                accessor: (rd) => <StatusBadge status={rd.status} size="sm" pulse />,
              },
              {
                header: 'Toggle',
                align: 'right',
                accessor: (rd) => (
                  <button
                    onClick={() => {
                      const next = rd.status === 'SUSPENDED' ? 'ONLINE' : 'SUSPENDED';
                      updateRiderStatus(rd.id, next);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                      rd.status === 'SUSPENDED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                    }`}
                  >
                    {rd.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* 8. RESERVATIONS MANAGEMENT */}
      {activeNav === 'reservations' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Dine-in Table Bookings</h2>
            <p className="text-xs text-slate-500">Reservations scheduled across Dhaka partner restaurants</p>
          </div>

          <DataTable
            data={reservations}
            keyExtractor={(r) => r.id}
            columns={[
              {
                header: 'Booking Pass',
                accessor: (r) => <strong className="font-mono text-slate-900">#{r.id}</strong>,
              },
              {
                header: 'Restaurant',
                accessor: (r) => <span className="font-bold text-slate-800">{r.restaurantName}</span>,
              },
              {
                header: 'Guest',
                accessor: (r) => (
                  <div>
                    <strong className="text-slate-900">{r.guestName}</strong>
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
                header: 'Party & Area',
                accessor: (r) => (
                  <span className="text-xs text-slate-600">
                    {r.guests} Guests • {r.seating}
                  </span>
                ),
              },
              {
                header: 'Status',
                accessor: (r) => <StatusBadge status={r.status} size="sm" />,
              },
            ]}
          />
        </div>
      )}

      {/* 9. OFFERS & COUPONS */}
      {activeNav === 'coupons' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">Campaigns & Coupons</h2>
              <p className="text-xs text-slate-500">Create promotional discount codes for platform campaigns</p>
            </div>
            <button
              onClick={() => setIsCreateOfferOpen(true)}
              className="px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Offer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base text-brand-600 tracking-wider bg-brand-50 px-2.5 py-1 rounded-xl border border-brand-100">
                      {c.code}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h4 className="font-display font-black text-lg text-slate-900 mt-3">{c.badge}</h4>
                  <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span>Min order: ৳{c.minOrder}</span>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="text-rose-600 hover:text-rose-700 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. PAYMENTS & FINANCE */}
      {activeNav === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Payments & Gateway Ledger</h2>
            <p className="text-xs text-slate-500">Direct digital settlement ledger across bKash, Nagad, Visa, and COD</p>
          </div>

          {/* Payment gateway breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
              <span className="text-[11px] font-bold text-pink-700 uppercase">bKash PGW</span>
              <h4 className="font-display font-black text-xl text-pink-900 mt-1">৳5,78,025</h4>
              <p className="text-[10px] text-pink-600">45% total volume</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <span className="text-[11px] font-bold text-orange-700 uppercase">Nagad Direct</span>
              <h4 className="font-display font-black text-xl text-orange-900 mt-1">৳3,21,120</h4>
              <p className="text-[10px] text-orange-600">25% total volume</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 uppercase">Cards (Visa/MC)</span>
              <h4 className="font-display font-black text-xl text-blue-900 mt-1">৳1,28,450</h4>
              <p className="text-[10px] text-blue-600">10% total volume</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Cash on Delivery</span>
              <h4 className="font-display font-black text-xl text-emerald-900 mt-1">৳2,56,905</h4>
              <p className="text-[10px] text-emerald-600">20% total volume</p>
            </div>
          </div>

          <DataTable<PaymentTransaction>
            data={transactions}
            keyExtractor={(t) => t.id}
            columns={[
              {
                header: 'Txn ID',
                accessor: (t) => (
                  <div>
                    <strong className="font-mono text-slate-900">{t.id}</strong>
                    <p className="text-[11px] text-slate-400 font-mono">Ref: {t.transactionReference}</p>
                  </div>
                ),
              },
              {
                header: 'Order',
                accessor: (t) => <span className="font-mono font-bold text-brand-600">#{t.orderId}</span>,
              },
              {
                header: 'Customer',
                accessor: (t) => (
                  <div>
                    <span className="font-bold text-slate-800">{t.customerName}</span>
                    <p className="text-[11px] text-slate-400">{t.customerPhone}</p>
                  </div>
                ),
              },
              {
                header: 'Gateway',
                accessor: (t) => (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {t.method}
                  </span>
                ),
              },
              {
                header: 'Amount',
                accessor: (t) => <strong className="font-black text-slate-900">৳{t.amount}</strong>,
              },
              {
                header: 'Status',
                accessor: (t) => <StatusBadge status={t.status} size="sm" />,
              },
              {
                header: 'Refund',
                align: 'right',
                accessor: (t) => (
                  <div>
                    {t.status === 'SUCCESS' ? (
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: `Issue Refund for ${t.id}?`,
                            description: `Are you sure you want to refund ৳${t.amount} back to ${t.customerName} via ${t.method}?`,
                            confirmText: 'Process Refund',
                            isDestructive: true,
                            requireReason: true,
                            reasonPlaceholder: 'e.g. Order cancelled due to weather delay.',
                            onConfirm: (reason) => {
                              refundTransaction(t.id, reason || 'Customer requested refund.');
                              setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                      >
                        Refund
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Refunded</span>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* 11. REVIEWS MODERATION */}
      {activeNav === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Ratings & Customer Reviews</h2>
            <p className="text-xs text-slate-500">Platform-wide customer sentiment and moderation</p>
          </div>

          <div className="space-y-3">
            {restaurants.flatMap((r) => r.reviews).slice(0, 6).map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{rev.userName}</h5>
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

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>

                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => showToast('Review flagged for content safety check.')}
                    className="px-3 py-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    Flag
                  </button>
                  <button
                    onClick={() => showToast('Review hidden from customer view.')}
                    className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold"
                  >
                    Hide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. SUPPORT CENTER */}
      {activeNav === 'support' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Customer Support Tickets</h2>
            <p className="text-xs text-slate-500">Resolve escalated order queries, payment issues, and rider complaints</p>
          </div>

          <div className="space-y-4">
            {supportTickets.map((tk) => (
              <div
                key={tk.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-xs text-brand-600">#{tk.id}</strong>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {tk.category}
                      </span>
                      <StatusBadge status={tk.status} size="sm" />
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 mt-1">{tk.subject}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{tk.createdAt}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {tk.message}
                </p>

                {tk.orderId && (
                  <p className="text-[11px] text-slate-400">
                    Linked to Order: <strong className="text-slate-800">#{tk.orderId}</strong>
                  </p>
                )}

                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => showToast(`Ticket #${tk.id} marked as resolved!`, 'success')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. ADMIN NOTIFICATIONS */}
      {activeNav === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">System Alerts & Notifications</h2>
            <p className="text-xs text-slate-500">Dhaka dispatch delays, merchant verification alerts, and system health</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'al-1', title: 'New Restaurant Onboarding', msg: 'Madchef Dhanmondi submitted trade license documents.', time: '10 min ago', priority: 'HIGH' },
              { id: 'al-2', title: 'Rain Delay Alert - Mirpur', msg: 'Heavy monsoon shower reported in Mirpur 10. ETA buffer extended by +15 min.', time: '25 min ago', priority: 'MEDIUM' },
              { id: 'al-3', title: 'bKash Gateway Settlement', msg: 'Batch payout of ৳4,80,000 reconciled successfully.', time: '1 hour ago', priority: 'INFO' },
              { id: 'al-4', title: 'High Order Volume in Dhanmondi', msg: 'Dinner rush exceeded 400 orders/hr in Zone 3.', time: '2 hours ago', priority: 'HIGH' },
            ].map((al) => (
              <div
                key={al.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{al.title}</h5>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        al.priority === 'HIGH'
                          ? 'bg-rose-50 text-rose-700'
                          : al.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {al.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{al.msg}</p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">{al.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. ADMIN SETTINGS & RBAC */}
      {activeNav === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
            <h2 className="font-display font-black text-xl text-slate-900">Admin Settings & Access Control</h2>
            <p className="text-xs text-slate-500">Role-based privileges, security protocols, and platform commissions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RBAC Role Switcher Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
              <h3 className="font-display font-black text-lg text-slate-900">Role-Based Access (RBAC)</h3>
              <p className="text-xs text-slate-500">Simulate admin view privileges across company divisions:</p>

              <div className="space-y-2">
                {[
                  { role: 'SUPER_ADMIN', title: 'Super Admin', desc: 'Unrestricted full access across all platform data & finances' },
                  { role: 'OPERATIONS', title: 'Operations Admin', desc: 'Dispatch control, rider assigning, and order escalation' },
                  { role: 'FINANCE', title: 'Finance Admin', desc: 'Gateway reconciliation, refunds, and merchant payouts' },
                  { role: 'SUPPORT', title: 'Customer Support Lead', desc: 'Ticket moderation, customer inquiries, and rating disputes' },
                ].map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setActiveRole(r.role as any);
                      showToast(`Switched active profile privileges to ${r.title}`);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      activeRole === r.role
                        ? 'bg-brand-50 border-brand-300 shadow-xs'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs sm:text-sm text-slate-900">{r.title}</strong>
                      {activeRole === r.role && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Parameters & Security */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
              <h3 className="font-display font-black text-lg text-slate-900">Platform Parameters</h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Platform Commission (%)</label>
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Standard Delivery Base Fee (৳)</label>
                  <input
                    type="number"
                    defaultValue={50}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 font-bold">Two-Factor Authentication (2FA)</strong>
                      <span className="text-slate-500">Require OTP code for administrative financial changes</span>
                    </div>
                    <button
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        showToast(twoFactorEnabled ? '2FA disabled.' : '2FA activated for admin session.');
                      }}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                        twoFactorEnabled ? 'bg-brand-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => showToast('Platform configuration saved successfully!', 'success')}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Save Platform Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        orders={orders}
        restaurants={restaurants}
        riders={riders}
        onSelectOrder={(o) => {
          setActiveNav('orders');
          setOrderSearch(o.id);
        }}
        onSelectRestaurant={(r) => {
          setActiveNav('restaurants');
          setRestaurantSearch(r.name);
        }}
        onSelectRider={(rd) => {
          setActiveNav('riders');
        }}
      />

      <AddRestaurantModal
        isOpen={isAddRestaurantOpen}
        onClose={() => setIsAddRestaurantOpen(false)}
        onSubmit={addRestaurant}
      />

      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        restaurantId={restaurants[0]?.id || 'takeout'}
        restaurantName={restaurants[0]?.name || 'Takeout'}
        onSubmit={(dish) => addMenuItem(restaurants[0]?.id || 'takeout', dish)}
      />

      <CreateOfferModal
        isOpen={isCreateOfferOpen}
        onClose={() => setIsCreateOfferOpen(false)}
        onSubmit={createCoupon}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        isDestructive={confirmDialog.isDestructive}
        requireReason={confirmDialog.requireReason}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </AppShell>
  );
};
