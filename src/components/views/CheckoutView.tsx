import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
  Check,
  Clock,
  Calendar,
  Navigation,
} from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { BANGLADESH_LOCATIONS, SavedAddress } from '../../data/khabarData';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    deliveryFee,
    vat,
    total,
    appliedCoupon,
    placeOrder,
    navigateTo,
    selectedLocation,
    formatBDT,
    savedAddresses,
    user,
    t,
    showToast,
  } = useKhabar();

  // Form states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || 'addr-1');
  const [customerName, setCustomerName] = useState(user.name || 'Tanvir Ahmed');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+880 1712-345678');
  const [deliveryArea, setDeliveryArea] = useState(`${selectedLocation.name}, ${selectedLocation.city}`);
  const [deliveryAddress, setDeliveryAddress] = useState(savedAddresses[0]?.address || 'House 42, Flat 5B, Road 11');
  const [landmark, setLandmark] = useState('Near Dhanmondi Lake & Mosque');
  const [deliveryInstructions, setDeliveryInstructions] = useState(savedAddresses[0]?.instructions || 'Ring the bell twice, lift is on the right.');

  // Delivery options: ASAP or Schedule
  const [deliveryOption, setDeliveryOption] = useState<'ASAP' | 'SCHEDULED'>('ASAP');
  const [scheduledSlot, setScheduledSlot] = useState('7:30 PM – 8:00 PM Tonight');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad' | 'Card'>('bKash');
  const [bkashNumber, setBkashNumber] = useState('01712345678');
  const [bkashPin, setBkashPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-xl text-slate-900">Your food bag is currently empty</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Please add dishes from our restaurants before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('restaurants')}
          className="mt-5 px-6 py-2.5 rounded-full bg-brand-600 text-white font-bold text-xs shadow-md hover:bg-brand-700"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setCustomerName(addr.name);
    setCustomerPhone(addr.phone);
    setDeliveryAddress(addr.address);
    setDeliveryArea(`${addr.area}, ${addr.city}`);
    if (addr.instructions) setDeliveryInstructions(addr.instructions);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      showToast('Please fill in your recipient name, contact phone, and delivery address.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customerName,
        customerPhone,
        deliveryArea,
        deliveryAddress: `${deliveryAddress}, ${deliveryArea}`,
        landmark,
        deliveryInstructions,
        deliverySchedule: deliveryOption,
        scheduledTime: deliveryOption === 'SCHEDULED' ? scheduledSlot : undefined,
        paymentMethod,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const restaurantName = cart[0]?.restaurantName || 'Restaurant';

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigateTo('restaurants')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dining</span>
        </button>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Secure Checkout • {t.stepAddress}
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Address Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <span>Step 1: Delivery Address in Dhaka</span>
                </div>
                <span className="text-xs text-brand-600 font-bold">Step 1 of 3</span>
              </div>

              {/* Saved Address Pills */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Saved Delivery Locations</span>
                <div className="grid grid-cols-3 gap-2">
                  {savedAddresses.map((addr) => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold block">{addr.type}</span>
                        {selectedAddressId === addr.id && (
                          <Check className="w-3.5 h-3.5 text-brand-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                        {addr.address}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number (Active)
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Area / Thana
                </label>
                <select
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-brand-500"
                >
                  {BANGLADESH_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={`${loc.name}, ${loc.city}`}>
                      {loc.name}, {loc.city} ({loc.bengaliName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House / Flat / Road Address
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Flat 5B, House 42, Road 11"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Map Preview Simulation */}
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <Navigation className="w-4 h-4 text-brand-600 animate-pulse" />
                  <span>GPS Coordinates Locked: {selectedLocation.name} (23.7808° N, 90.4152° E)</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  High Accuracy
                </span>
              </div>
            </div>

            {/* 2. Delivery Schedule Options */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
                  <Clock className="w-5 h-5 text-brand-600" />
                  <span>Step 2: Delivery Schedule</span>
                </div>
                <span className="text-xs text-brand-600 font-bold">Step 2 of 3</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryOption('ASAP')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliveryOption === 'ASAP'
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">ASAP Delivery</span>
                    {deliveryOption === 'ASAP' && <Check className="w-4 h-4 text-brand-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500 block">Deliver in 25–35 minutes</span>
                </label>

                <label
                  onClick={() => setDeliveryOption('SCHEDULED')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliveryOption === 'SCHEDULED'
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Schedule for Later</span>
                    {deliveryOption === 'SCHEDULED' && <Check className="w-4 h-4 text-brand-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500 block">Pre-order for specific time</span>
                </label>
              </div>

              {deliveryOption === 'SCHEDULED' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Delivery Window</label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                  >
                    <option value="7:30 PM – 8:00 PM Tonight">7:30 PM – 8:00 PM Tonight</option>
                    <option value="8:30 PM – 9:00 PM Tonight">8:30 PM – 9:00 PM Tonight</option>
                    <option value="1:00 PM – 1:30 PM Tomorrow Lunch">1:00 PM – 1:30 PM Tomorrow Lunch</option>
                  </select>
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
                  <Banknote className="w-5 h-5 text-brand-600" />
                  <span>Step 3: Bangladesh Payment Method</span>
                </div>
                <span className="text-xs text-brand-600 font-bold">Step 3 of 3</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bKash')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'bKash'
                      ? 'border-[#E2136E] bg-[#E2136E]/5 text-slate-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-[#E2136E]">bKash Payment</span>
                    {paymentMethod === 'bKash' && <Check className="w-4 h-4 text-[#E2136E]" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Instant 1-Click Verification</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-600 bg-brand-50/50 text-slate-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                    {paymentMethod === 'Cash on Delivery' && <Check className="w-4 h-4 text-brand-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Pay cash to rider at door</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'border-[#F7931E] bg-[#F7931E]/5 text-slate-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-[#F7931E]">Nagad Digital</span>
                    {paymentMethod === 'Nagad' && <Check className="w-4 h-4 text-[#F7931E]" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Postal Mobile Financial</span>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Visa / Mastercard</span>
                    {paymentMethod === 'Card' && <Check className="w-4 h-4 text-slate-900" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">All Bangladesh bank cards</span>
                </button>
              </div>

              {/* bKash Simulated Payment Panel */}
              {paymentMethod === 'bKash' && (
                <div className="p-4 rounded-2xl bg-[#E2136E]/5 border border-[#E2136E]/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E2136E]">
                    <Smartphone className="w-4 h-4" />
                    <span>bKash Payment Gateway Demo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">bKash Account Number</span>
                      <input
                        type="tel"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Demo PIN</span>
                      <input
                        type="password"
                        placeholder="••••"
                        defaultValue="1234"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {cart.length} item{cart.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="text-xs font-semibold text-brand-600 bg-brand-50 p-2.5 rounded-xl border border-brand-100 flex items-center justify-between">
                <span>Kitchen: {restaurantName}</span>
                <span className="text-[10px] text-slate-500">{selectedLocation.name}</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.selectedSize && (
                        <span className="block text-[10px] text-slate-500">{item.selectedSize}</span>
                      )}
                      {item.selectedAddOns.length > 0 && (
                        <span className="block text-[10px] text-slate-400">
                          +{item.selectedAddOns.map((a) => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatBDT(item.itemTotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
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
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatBDT(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Govt VAT / Service Tax (5%)</span>
                  <span>{formatBDT(vat)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <span className="font-display font-bold text-sm">Total Payable</span>
                  <span className="font-display font-black text-xl text-brand-600">
                    {formatBDT(total)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-brand hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>{isSubmitting ? 'Confirming with Kitchen...' : `Place Order • ${formatBDT(total)}`}</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                By clicking Place Order you agree to KHABAR's delivery terms and contactless guarantee.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
