import React, { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Calendar,
  CreditCard,
  Plus,
  Trash2,
  Check,
  Tag,
  HelpCircle,
  LogOut,
  LogIn,
  Store,
  Bike,
  Shield,
  Edit2
} from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { EmptyState } from '../common/EmptyState';

export const ProfileView: React.FC = () => {
  const {
    user,
    loginUser,
    logoutUser,
    savedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    navigateTo,
    orders,
    reservations,
    favoriteRestaurantIds,
    setIsAuthModalOpen,
    setPortalMode,
    showToast,
    language
  } = useKhabar();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customLabel, setCustomLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newArea, setNewArea] = useState('Dhanmondi');
  const [isDefault, setIsDefault] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(editPhone || editEmail, editName);
    setIsEditingProfile(false);
    showToast('Profile information updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      showToast('Please enter full street address', 'error');
      return;
    }

    addSavedAddress({
      type: newLabel === 'Work' ? 'Office' : (newLabel as 'Home' | 'Office' | 'Other'),
      name: user.name || 'Tanvir Ahmed',
      phone: user.phone || '+880 1712-345678',
      address: newAddress,
      area: newArea,
      city: 'Dhaka',
      isDefault: isDefault
    });

    setNewAddress('');
    setCustomLabel('');
    setIsDefault(false);
    setIsAddingAddress(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4 sm:px-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-7">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-brand-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-5 z-10">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 ring-4 ring-brand-100">
              {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'KH'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  VIP Foodie
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-full border border-surface-200 text-xs font-bold text-slate-700 hover:bg-surface-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            {user.isLoggedIn ? (
              <button
                onClick={logoutUser}
                className="px-3.5 py-2 rounded-full border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-full bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit Profile Form Drawer */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 border border-brand-200 shadow-sm space-y-4 animate-fadeIn"
          >
            <h3 className="font-display font-bold text-base text-slate-900">Edit Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-brand-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Quick Nav Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => navigateTo('orders')}
            className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs hover:shadow-card hover:border-brand-200 transition-all flex flex-col justify-between text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-900 block group-hover:text-brand-500 transition-colors">
                My Orders
              </span>
              <span className="text-[11px] text-slate-400">{orders.length} total orders</span>
            </div>
          </button>

          <button
            onClick={() => navigateTo('reservations')}
            className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs hover:shadow-card hover:border-brand-200 transition-all flex flex-col justify-between text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-900 block group-hover:text-brand-500 transition-colors">
                Reservations
              </span>
              <span className="text-[11px] text-slate-400">{reservations.length} booked</span>
            </div>
          </button>

          <button
            onClick={() => navigateTo('favorites')}
            className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs hover:shadow-card hover:border-brand-200 transition-all flex flex-col justify-between text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-900 block group-hover:text-brand-500 transition-colors">
                Saved Places
              </span>
              <span className="text-[11px] text-slate-400">{favoriteRestaurantIds.length} saved</span>
            </div>
          </button>

          <button
            onClick={() => navigateTo('offers')}
            className="bg-white p-4 rounded-2xl border border-surface-200 shadow-2xs hover:shadow-card hover:border-brand-200 transition-all flex flex-col justify-between text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Tag className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-900 block group-hover:text-brand-500 transition-colors">
                My Vouchers
              </span>
              <span className="text-[11px] text-slate-400">Up to 30% OFF</span>
            </div>
          </button>
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-100">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-500" />
                {language === 'bn' ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Delivery Addresses'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage your home, office, and frequent delivery locations</p>
            </div>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100/70 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingAddress ? 'Cancel' : 'Add New'}</span>
            </button>
          </div>

          {/* Add Address Form */}
          {isAddingAddress && (
            <form
              onSubmit={handleAddAddress}
              className="p-5 rounded-2xl bg-surface-50 border border-surface-200 space-y-3.5 animate-fadeIn"
            >
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Delivery Address</h4>
              <div className="flex items-center gap-2">
                {(['Home', 'Work', 'Other'] as const).map((labelType) => (
                  <button
                    key={labelType}
                    type="button"
                    onClick={() => setNewLabel(labelType)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      newLabel === labelType
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-surface-200 text-slate-600 hover:bg-surface-100'
                    }`}
                  >
                    {labelType}
                  </button>
                ))}
              </div>

              {newLabel === 'Other' && (
                <input
                  type="text"
                  placeholder="Custom label name (e.g. Gym, Uncle's House)"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-surface-200 text-xs font-medium text-slate-900"
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Full street address (Flat, House, Road)"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-surface-200 text-xs font-medium text-slate-900"
                    required
                  />
                </div>
                <div>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-surface-200 text-xs font-medium text-slate-900"
                  >
                    <option value="Dhanmondi">Dhanmondi</option>
                    <option value="Gulshan-1">Gulshan-1</option>
                    <option value="Gulshan-2">Gulshan-2</option>
                    <option value="Banani">Banani</option>
                    <option value="Uttara">Uttara</option>
                    <option value="Mirpur-10">Mirpur-10</option>
                    <option value="Mohakhali DOHS">Mohakhali DOHS</option>
                    <option value="Baily Road">Baily Road</option>
                    <option value="Bashundhara R/A">Bashundhara R/A</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span>Set as default delivery address</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Addresses List */}
          {savedAddresses.length === 0 ? (
            <EmptyState
              type="orders"
              title="No saved addresses"
              description="Save your home, office, and regular hangouts for instant 1-tap checkout."
              actionText="Add Address"
              onAction={() => setIsAddingAddress(true)}
            />
          ) : (
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    addr.isDefault
                      ? 'border-brand-200 bg-brand-50/20'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-brand-600 bg-brand-100/70 px-2 py-0.5 rounded-md">
                          Default
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {addr.area}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{addr.address}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-brand-600 hover:bg-surface-100 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteSavedAddress(addr.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods & Digital Wallets */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-100">
            <div className="flex items-center gap-2 font-display font-bold text-base text-slate-900">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <span>Saved Payment Methods • পেমেন্ট মেথড</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-pink-200 bg-linear-to-br from-pink-50/50 to-pink-100/30 space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-700">bKash Account Linked</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <span className="text-slate-700 font-medium block">01712-345678</span>
              <span className="text-[10px] text-slate-500 block">Fast 1-tap PIN verification enabled</span>
            </div>

            <div className="p-4 rounded-2xl border border-surface-200 bg-surface-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                  Available
                </span>
              </div>
              <span className="text-slate-600 block">Dhaka Metropolitan Area</span>
              <span className="text-[10px] text-slate-400 block">Exact change recommended for rider</span>
            </div>
          </div>
        </div>

        {/* Support & Multi-Portal Switching Surface */}
        <div className="bg-linear-to-br from-charcoal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-display font-black text-lg text-white">Need Help or Portal Access?</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Reach out to our Dhaka support center or switch to business dashboards.
              </p>
            </div>
            <button
              onClick={() => navigateTo('help-center')}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <HelpCircle className="w-4 h-4 text-brand-400" />
              <span>Help Center & FAQ</span>
            </button>
          </div>

          <div>
            <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block mb-3">
              Explore KHABAR Partner Portals
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setPortalMode('admin')}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-brand-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="font-bold text-xs text-white group-hover:text-brand-400">Admin Dashboard</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Analytics, orders, and restaurants</span>
              </button>

              <button
                onClick={() => setPortalMode('partner')}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Store className="w-4 h-4" />
                  <span className="font-bold text-xs text-white group-hover:text-amber-400">Kitchen Partner POS</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Live order pipeline & stock management</span>
              </button>

              <button
                onClick={() => setPortalMode('rider')}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Bike className="w-4 h-4" />
                  <span className="font-bold text-xs text-white group-hover:text-emerald-400">Rider App</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Pickups, route navigation, and daily earnings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
