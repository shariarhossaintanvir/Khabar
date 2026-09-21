import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem, AddOn, DeliveryZone } from '../data/menuData';
import { DHAKA_DELIVERY_ZONES } from '../data/menuData';
import { audioEngine } from '../utils/audio';

export interface CartItem {
  id: string; // unique item instance id
  menuItem: MenuItem;
  quantity: number;
  selectedAddOns: AddOn[];
  specialInstructions?: string;
  itemTotal: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  vat: number; // 5% restaurant VAT in Bangladesh
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryArea: DeliveryZone;
  deliveryAddress: string;
  landmark?: string;
  deliveryInstructions?: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Card' | 'Cash on Delivery';
  paymentAccount?: string;
  placedAt: string;
  estimatedDeliveryMin: number;
  status: 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  seating: 'COURTYARD' | 'JAMDANI_LOUNGE' | 'BRASS_VAULT';
  specialRequest?: string;
  guestName: string;
  guestPhone: string;
  createdAt: string;
}

interface StoreContextType {
  // Currency Formatter
  formatBDT: (amount: number) => string;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedAddOns?: AddOn[], specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  vat: number;
  total: number;
  promoCode: string;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => boolean;
  selectedDeliveryZone: DeliveryZone;
  setSelectedDeliveryZone: (zone: DeliveryZone) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Toast Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSpiceFilter: string;
  setSelectedSpiceFilter: (spice: string) => void;
  isVegetarianFilter: boolean;
  setIsVegetarianFilter: (isVeg: boolean) => void;

  // Food Detail / Inspector Modal
  inspectingItem: MenuItem | null;
  openInspector: (item: MenuItem) => void;
  closeInspector: () => void;

  // Checkout
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  completeCheckout: (orderData: Omit<Order, 'id' | 'items' | 'subtotal' | 'discount' | 'deliveryFee' | 'vat' | 'total' | 'placedAt' | 'estimatedDeliveryMin' | 'status'>) => Order;

  // Active Order & Live Tracking
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;

  // Reservation
  activeReservation: Reservation | null;
  isReservationSuccessOpen: boolean;
  setIsReservationSuccessOpen: (open: boolean) => void;
  makeReservation: (resData: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;

  // Audio
  isMuted: boolean;
  toggleAudio: () => void;

  // Scene & Performance
  activeSceneIndex: number;
  setActiveSceneIndex: (idx: number) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  isLowPerformance: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [isReservationSuccessOpen, setIsReservationSuccessOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DeliveryZone>(DHAKA_DELIVERY_ZONES[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Search and Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSpiceFilter, setSelectedSpiceFilter] = useState('ALL');
  const [isVegetarianFilter, setIsVegetarianFilter] = useState(false);

  // Device capability check
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    if (isMobile || cores < 4) {
      setIsLowPerformance(true);
    }
  }, []);

  // Currency helper
  const formatBDT = (amount: number) => `৳ ${Math.round(amount).toLocaleString('en-IN')}`;

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);
  const discount = appliedPromo === 'RASA15' ? subtotal * 0.15 : appliedPromo === 'KACCHI' ? Math.min(subtotal, 100) : 0;
  // Free delivery for orders >= ৳ 1,500
  const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : selectedDeliveryZone.fee;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const vat = taxableSubtotal * 0.05; // 5% restaurant VAT
  const total = Math.max(0, subtotal - discount + deliveryFee + vat);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (
    menuItem: MenuItem,
    quantity = 1,
    selectedAddOns: AddOn[] = [],
    specialInstructions = ''
  ) => {
    audioEngine.playAddToCart();
    const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    const singleItemPrice = menuItem.price + addOnsTotal;
    const itemTotal = singleItemPrice * quantity;

    const newItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem,
      quantity,
      selectedAddOns,
      specialInstructions,
      itemTotal,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`${menuItem.name} added to your order.`);
  };

  const removeFromCart = (cartItemId: string) => {
    audioEngine.playClick();
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    audioEngine.playClick();
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const addOnsTotal = item.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
          const singlePrice = item.menuItem.price + addOnsTotal;
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: singlePrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const applyPromoCode = (code: string): boolean => {
    audioEngine.playClick();
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'RASA15' || trimmed === 'KACCHI') {
      setAppliedPromo(trimmed);
      setPromoCode(trimmed);
      showToast(`Voucher ${trimmed} applied!`);
      return true;
    }
    return false;
  };

  const openInspector = (item: MenuItem) => {
    audioEngine.playClick();
    setInspectingItem(item);
  };

  const closeInspector = () => {
    audioEngine.playClick();
    setInspectingItem(null);
  };

  const completeCheckout = (
    orderData: Omit<
      Order,
      'id' | 'items' | 'subtotal' | 'discount' | 'deliveryFee' | 'vat' | 'total' | 'placedAt' | 'estimatedDeliveryMin' | 'status'
    >
  ) => {
    audioEngine.playReservationSuccess();
    const orderId = `RASA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      vat,
      total,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryMin: 35,
      status: 'CONFIRMED',
    };

    setActiveOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
    showToast(`Order ${orderId} confirmed!`);

    // Simulated Dhaka delivery stages
    setTimeout(() => {
      setActiveOrder((prev) => (prev ? { ...prev, status: 'PREPARING' } : null));
    }, 10000);

    setTimeout(() => {
      setActiveOrder((prev) => (prev ? { ...prev, status: 'OUT_FOR_DELIVERY' } : null));
    }, 24000);

    return newOrder;
  };

  const makeReservation = (resData: Omit<Reservation, 'id' | 'createdAt'>) => {
    audioEngine.playReservationSuccess();
    const resId = `RASA-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const reservation: Reservation = {
      ...resData,
      id: resId,
      createdAt: new Date().toLocaleDateString(),
    };
    setActiveReservation(reservation);
    setIsReservationSuccessOpen(true);
    showToast(`Table confirmed! Reservation #${resId}`);
    return reservation;
  };

  const toggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <StoreContext.Provider
      value={{
        formatBDT,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        deliveryFee,
        vat,
        total,
        promoCode,
        appliedPromo,
        applyPromoCode,
        selectedDeliveryZone,
        setSelectedDeliveryZone,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSpiceFilter,
        setSelectedSpiceFilter,
        isVegetarianFilter,
        setIsVegetarianFilter,
        inspectingItem,
        openInspector,
        closeInspector,
        isCheckoutOpen,
        setIsCheckoutOpen,
        completeCheckout,
        activeOrder,
        setActiveOrder,
        isTrackingOpen,
        setIsTrackingOpen,
        activeReservation,
        isReservationSuccessOpen,
        setIsReservationSuccessOpen,
        makeReservation,
        isMuted,
        toggleAudio,
        activeSceneIndex,
        setActiveSceneIndex,
        scrollProgress,
        setScrollProgress,
        isLowPerformance,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
