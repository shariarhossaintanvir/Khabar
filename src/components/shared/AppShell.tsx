import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  ArrowLeft,
  ShoppingBag,
  ChefHat,
  Bike,
  Shield,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useKhabar, PortalMode } from '../../context/KhabarContext';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: 'brand' | 'amber' | 'emerald' | 'rose';
}

interface AppShellProps {
  portal: 'admin' | 'partner' | 'rider';
  portalBadge: string;
  portalTitle: string;
  navItems: NavItemConfig[];
  activeNavId: string;
  onNavSelect: (id: string) => void;
  headerControls?: React.ReactNode;
  mobileBottomNavItems?: NavItemConfig[];
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  portal,
  portalBadge,
  portalTitle,
  navItems,
  activeNavId,
  onNavSelect,
  headerControls,
  mobileBottomNavItems,
  children,
}) => {
  const {
    portalMode,
    setPortalMode,
    navigateTo,
    showToast,
    notifications,
    setIsNotificationDrawerOpen,
    unreadNotificationsCount,
    selectedLocation,
  } = useKhabar();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);

  const portals: { mode: PortalMode; label: string; icon: React.ReactNode; badge: string }[] = [
    { mode: 'customer', label: 'Customer App', icon: <ShoppingBag className="w-4 h-4 text-brand-600" />, badge: 'Live Order' },
    { mode: 'admin', label: 'Admin Panel', icon: <Shield className="w-4 h-4 text-purple-600" />, badge: 'Control Hub' },
    { mode: 'partner', label: 'Restaurant Partner', icon: <ChefHat className="w-4 h-4 text-amber-600" />, badge: 'Kitchen POS' },
    { mode: 'rider', label: 'Rider Delivery', icon: <Bike className="w-4 h-4 text-emerald-600" />, badge: 'Courier App' },
  ];

  const handleNavClick = (id: string) => {
    onNavSelect(id);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const portalTheme = {
    admin: {
      brandTag: 'bg-purple-50 text-purple-700 border-purple-200',
      activeItem: 'bg-slate-900 text-white shadow-sm font-bold',
      accentDot: 'bg-purple-500',
    },
    partner: {
      brandTag: 'bg-amber-50 text-amber-700 border-amber-200',
      activeItem: 'bg-brand-600 text-white shadow-sm font-bold',
      accentDot: 'bg-amber-500',
    },
    rider: {
      brandTag: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      activeItem: 'bg-emerald-600 text-white shadow-sm font-bold',
      accentDot: 'bg-emerald-500',
    },
  }[portal];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white pb-24 md:pb-8">
      {/* 1. TOP GLOBAL STRIP */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile menu button + KHABAR Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => setPortalMode('customer')}
              className="flex items-center gap-2 cursor-pointer group"
              title="Return to Customer App"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-display font-black text-lg shadow-brand group-hover:scale-105 transition-transform">
                খ
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-black text-lg text-slate-900 tracking-tight">
                  KHABAR
                </span>
                <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${portalTheme.brandTag}`}>
                  {portalBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Center / Portal specific header tools */}
          <div className="flex-1 flex items-center justify-center max-w-xl">
            {headerControls}
          </div>

          {/* Right Tools: Portal Selector Dropdown + Notifications + Exit to Customer */}
          <div className="flex items-center gap-2.5">
            {/* Quick Return to Customer App */}
            <button
              onClick={() => setPortalMode('customer')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>

            {/* Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPortalMenuOpen(!isPortalMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all shadow-xs"
              >
                <span className="capitalize">{portal}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isPortalMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Workspace Portal
                  </div>
                  <div className="py-1 space-y-1">
                    {portals.map((p) => (
                      <button
                        key={p.mode}
                        onClick={() => {
                          setPortalMode(p.mode);
                          setIsPortalMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                          portalMode === p.mode
                            ? 'bg-slate-100 text-slate-900 font-black'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {p.icon}
                          <span>{p.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{p.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Drawer Button */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY SHELL: SIDEBAR + MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6 items-start flex-1">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden md:block shrink-0 transition-all duration-200 bg-white rounded-3xl border border-slate-200/80 shadow-card p-3 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Collapse Toggle */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 px-2">
            {!isSidebarCollapsed && (
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                {portalTitle}
              </span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-auto"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? portalTheme.activeItem
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>

                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.badgeColor === 'amber'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-150">
          <div className="w-72 bg-white h-full p-4 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-display font-black text-sm">
                  খ
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-slate-900">KHABAR</h3>
                  <span className="text-[10px] font-bold text-slate-400">{portalTitle}</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1 hide-scrollbar">
              {navItems.map((item) => {
                const isActive = activeNavId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? portalTheme.activeItem : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setPortalMode('customer')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-50 text-brand-600 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Customer App</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />
        </div>
      )}

      {/* 4. MOBILE BOTTOM THUMB NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {(mobileBottomNavItems || navItems.slice(0, 5)).map((item) => {
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors relative ${
                isActive ? 'text-brand-600 font-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-brand-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
