import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, CreditCard, ShieldCheck, MapPin, User, Sparkles, Smartphone, Banknote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DHAKA_DELIVERY_ZONES } from '../../data/menuData';
import { audioEngine } from '../../utils/audio';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    completeCheckout,
    total,
    subtotal,
    discount,
    deliveryFee,
    vat,
    cart,
    formatBDT,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('Tanvir Ahmed');
  const [customerEmail, setCustomerEmail] = useState('tanvir.ahmed@dhaka.net');
  const [customerPhone, setCustomerPhone] = useState('+880 1712-345678');

  const [houseRoad, setHouseRoad] = useState('Apartment 6B, House 24, Road 11');
  const [landmark, setLandmark] = useState('Opposite Gulshan Club, near Lake Park');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Handle with care; keep hot biryani degh upright.');

  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Card' | 'Cash on Delivery'>('bKash');
  const [bkashNumber, setBkashNumber] = useState('01712345678');
  const [bkashPin, setBkashPin] = useState('');
  const [isBkashSimulating, setIsBkashSimulating] = useState(false);

  const [cardNumber, setCardNumber] = useState('4123 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('421');

  if (!isCheckoutOpen) return null;

  const handleNext = () => {
    audioEngine.playClick();
    if (step === 1 && (!customerName || !customerPhone)) {
      alert('Please fill in your name and phone number for delivery updates.');
      return;
    }
    if (step === 2 && !houseRoad) {
      alert('Please provide your street and apartment address.');
      return;
    }
    if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    audioEngine.playClick();
    if (step > 1) setStep((step - 1) as 1 | 2 | 3 | 4);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'bKash' && !bkashPin) {
      // Simulate quick bKash PIN verification
      setIsBkashSimulating(true);
      setTimeout(() => {
        setIsBkashSimulating(false);
        finalizeOrder();
      }, 1200);
      return;
    }
    finalizeOrder();
  };

  const finalizeOrder = () => {
    const fullAddress = `${houseRoad}, ${selectedDeliveryZone.name}, Dhaka${landmark ? ` (Landmark: ${landmark})` : ''}`;
    completeCheckout({
      customerName,
      customerEmail,
      customerPhone,
      deliveryArea: selectedDeliveryZone,
      deliveryAddress: fullAddress,
      landmark,
      deliveryInstructions,
      paymentMethod,
      paymentAccount: paymentMethod === 'bKash' ? bkashNumber : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl glass-panel-gold rounded-3xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden border border-brass/30 max-h-[92vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setIsCheckoutOpen(false);
          }}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-dark-900/80 border border-white/10 hover:border-brass text-ivory-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP PROGRESS BAR */}
        <div>
          <div className="flex items-center justify-between mb-8">
            {['Guest Details', 'Dhaka Address', 'Payment', 'Review'].map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans font-bold transition-all ${
                      isCompleted
                        ? 'bg-brass text-dark-950'
                        : isActive
                        ? 'border border-brass text-brass ring-4 ring-brass/20'
                        : 'border border-white/20 text-ivory-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                  </div>
                  <span className={`hidden sm:inline text-xs font-sans uppercase tracking-wider ${isActive ? 'text-ivory-100 font-bold' : 'text-ivory-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* STEP 1: CUSTOMER */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-brass mb-2">
                <User className="w-4 h-4 text-terracotta" />
                <span className="text-xs uppercase tracking-widest font-sans font-bold">
                  Step 01 — Recipient Details • গ্রাহকের বিবরণ
                </span>
              </div>
              <div>
                <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                  Full Name • পূর্ণ নাম
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass"
                  placeholder="e.g. Tanvir Ahmed Chowdhury"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass"
                    placeholder="name@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                    Dhaka Mobile Number • মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass"
                    placeholder="+880 1712-345678"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY ADDRESS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-brass mb-2">
                <MapPin className="w-4 h-4 text-terracotta" />
                <span className="text-xs uppercase tracking-widest font-sans font-bold">
                  Step 02 — Dhaka Delivery Destination • ডেলিভারি ঠিকানা
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                  Delivery Zone • এলাকা
                </label>
                <select
                  value={selectedDeliveryZone.id}
                  onChange={(e) => {
                    const found = DHAKA_DELIVERY_ZONES.find((z) => z.id === e.target.value);
                    if (found) setSelectedDeliveryZone(found);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass"
                >
                  {DHAKA_DELIVERY_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id} className="bg-dark-950 text-ivory-100">
                      {zone.name} ({zone.bengaliName}) — Fee: {formatBDT(zone.fee)} • {zone.estimatedMin} mins
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                  House, Apartment & Road • বাড়ি, ফ্ল্যাট ও সড়ক
                </label>
                <input
                  type="text"
                  value={houseRoad}
                  onChange={(e) => setHouseRoad(e.target.value)}
                  placeholder="e.g. Flat 6B, House 24, Road 11, Block D"
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                  Nearby Landmark • ল্যান্ডমার্ক (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Banani Lake Park / Opposite Gulshan Club"
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-sans text-ivory-300 mb-1.5 font-bold">
                  Special Delivery Instructions • বিশেষ নির্দেশনা
                </label>
                <textarea
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Please ring bell twice, thermal box with mutton handi upright..."
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-xs font-sans text-ivory-100 focus:outline-none focus:border-brass resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-brass mb-2">
                <CreditCard className="w-4 h-4 text-terracotta" />
                <span className="text-xs uppercase tracking-widest font-sans font-bold">
                  Step 03 — Select Payment Method • পেমেন্ট পদ্ধতি
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {[
                  { id: 'bKash', label: 'bKash', icon: Smartphone, color: 'text-pink-400' },
                  { id: 'Nagad', label: 'Nagad', icon: Smartphone, color: 'text-orange-400' },
                  { id: 'Card', label: 'Card / Visa', icon: CreditCard, color: 'text-blue-400' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, color: 'text-emerald-400' },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        audioEngine.playClick();
                        setPaymentMethod(opt.id as 'bKash' | 'Nagad' | 'Card' | 'Cash on Delivery');
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-sans tracking-wide transition-all ${
                        isSelected
                          ? 'border-brass bg-brass/20 text-ivory-100 font-bold ring-1 ring-brass'
                          : 'border-white/10 bg-dark-900 text-ivory-400 hover:border-white/20'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${opt.color}`} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* bKash Panel */}
              {paymentMethod === 'bKash' && (
                <div className="p-4 rounded-2xl bg-dark-950 border border-pink-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" /> bKash Direct Checkout (বিকাশ)
                    </span>
                    <span className="text-[10px] text-ivory-400 font-sans">Merchant: RASA FOODS</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-sans text-ivory-400 mb-1">
                      bKash Mobile Account
                    </label>
                    <input
                      type="text"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs font-mono text-ivory-100 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-sans text-ivory-400 mb-1">
                      Simulated 5-Digit bKash PIN (Enter any 5 digits)
                    </label>
                    <input
                      type="password"
                      maxLength={5}
                      value={bkashPin}
                      onChange={(e) => setBkashPin(e.target.value)}
                      placeholder="•••••"
                      className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs font-mono text-ivory-100 focus:outline-none focus:border-pink-500 tracking-widest text-center"
                    />
                  </div>
                  <p className="text-[10px] text-ivory-400 italic">
                    Safe testing mode: Enter your PIN or leave blank for instant simulated verification.
                  </p>
                </div>
              )}

              {/* Nagad Panel */}
              {paymentMethod === 'Nagad' && (
                <div className="p-4 rounded-2xl bg-dark-950 border border-orange-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" /> Nagad Payment (নগদ)
                    </span>
                    <span className="text-[10px] text-ivory-400 font-sans">Merchant: RASA FOODS</span>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-sans text-ivory-400 mb-1">
                      Nagad Account Number
                    </label>
                    <input
                      type="text"
                      defaultValue="01712345678"
                      className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs font-mono text-ivory-100 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Card Panel */}
              {paymentMethod === 'Card' && (
                <div className="p-4 rounded-2xl bg-dark-950 border border-white/10 space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-sans text-ivory-400 mb-1">
                      Card Number (Visa / Mastercard)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs font-mono text-ivory-100 focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-sans text-ivory-400 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs font-mono text-ivory-100 focus:outline-none focus:border-brass"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-sans text-ivory-400 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs font-mono text-ivory-100 focus:outline-none focus:border-brass"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Panel */}
              {paymentMethod === 'Cash on Delivery' && (
                <div className="p-4 rounded-2xl bg-dark-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Banknote className="w-4 h-4" />
                    <span>Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                  </div>
                  <p className="text-xs text-ivory-300 font-sans leading-relaxed">
                    Pay the courier in exact cash when your steaming hot food arrives at your door. 
                    Our delivery rider carries change for up to ৳ 1,000 notes.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-[10px] text-ivory-400 font-sans mt-2">
                <ShieldCheck className="w-4 h-4 text-brass" />
                <span>SSLCommerz & bKash PGW 256-bit encrypted authentication.</span>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-brass mb-2">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <span className="text-xs uppercase tracking-widest font-sans font-bold">
                  Step 04 — Order Verification • চূড়ান্ত যাচাইকরণ
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950 border border-white/10 font-sans text-xs space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-ivory-400">Recipient:</span>
                  <span className="text-ivory-100 font-bold">{customerName} ({customerPhone})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-ivory-400">Deliver To:</span>
                  <span className="text-ivory-100 text-right max-w-xs">{houseRoad}, {selectedDeliveryZone.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-ivory-400">Payment:</span>
                  <span className="text-brass font-semibold">{paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-ivory-400">Subtotal:</span>
                  <span className="text-ivory-200">{formatBDT(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between border-b border-white/5 pb-2 text-brass">
                    <span>Discount:</span>
                    <span>-{formatBDT(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-ivory-400">Delivery Fee:</span>
                  <span className="text-ivory-200">{deliveryFee === 0 ? 'FREE' : formatBDT(deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-[11px] text-ivory-400">
                  <span>Govt. VAT (5%):</span>
                  <span>{formatBDT(vat)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-ivory-300 font-bold">Total Amount Payable:</span>
                  <span className="text-brass-light font-serif text-lg font-bold">{formatBDT(total)}</span>
                </div>
              </div>

              <div className="text-[11px] text-ivory-400 font-sans">
                Ordered dishes: {cart.map((c) => `${c.quantity}x ${c.menuItem.name}`).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* STEP BUTTONS */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-full border border-white/15 text-ivory-300 hover:text-white text-xs font-sans uppercase tracking-wider flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-7 py-3 rounded-full bg-ivory-100 text-dark-950 hover:bg-brass text-xs font-sans font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={isBkashSimulating}
              onClick={handlePlaceOrder}
              className="px-8 py-3.5 rounded-full bg-brass text-dark-950 hover:bg-brass-light text-xs font-sans font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(197,160,89,0.4)] transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {isBkashSimulating ? (
                <span>Processing with bKash...</span>
              ) : (
                <span>Confirm & Place Order ({formatBDT(total)})</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
