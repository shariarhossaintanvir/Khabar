import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  LocationItem,
  Restaurant,
  MenuItem,
  AddOnOption,
  PromoCoupon,
  SavedAddress,
  DealItem,
  PendingRestaurant,
  RiderProfile,
  PaymentTransaction,
  InventoryItem,
  RiderDeliveryRecord,
} from '../data/khabarData';
import {
  BANGLADESH_LOCATIONS,
  RESTAURANTS,
  PROMO_COUPONS,
  DEMO_ADDRESSES,
  BEST_DEALS,
  DEMO_PENDING_RESTAURANTS,
  DEMO_RIDERS,
  DEMO_TRANSACTIONS,
  DEMO_INVENTORY,
  DEMO_RIDER_DELIVERIES,
} from '../data/khabarData';
import { TRANSLATIONS, type Language, type TranslationStrings } from '../data/translations';

// Security Engine Imports
import { authService } from '../security/auth';
import { orderEngine, type OrderStatus } from '../security/orderEngine';
import { couponEngine } from '../security/couponEngine';
import { paymentSecurity } from '../security/paymentSecurity';
import { auditLogger, type AuditLogEntry } from '../security/auditLogger';
import {
  assertPermission,
  assertCanManageRestaurant,
  type AuthenticatedUser,
  type UserRole,
} from '../security/rbac';
import {
  sanitizeText,
  validateBDPhone,
  validateReservationDate,
  validateInteger,
} from '../security/validation';
import { rateLimiter, RATE_LIMITS } from '../security/rateLimiter';

export type KhabarView =
  | 'home'
  | 'restaurants'
  | 'restaurant-detail'
  | 'offers'
  | 'reservations'
  | 'tracking'
  | 'orders'
  | 'favorites'
  | 'profile'
  | 'checkout'
  | 'help-center'
  | 'admin'
  | 'partner'
  | 'rider';

export type PortalMode = 'customer' | 'admin' | 'partner' | 'rider';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedSize?: string;
  selectedSauces?: string[];
  selectedAddOns: AddOnOption[];
  specialInstructions?: string;
  itemTotal: number;
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  vat: number;
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryArea: string;
  landmark?: string;
  deliveryInstructions?: string;
  deliverySchedule?: 'ASAP' | 'SCHEDULED';
  scheduledTime?: string;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Card';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  transactionId?: string;
  placedAt: string;
  estimatedDeliveryMin: number;
  status: OrderStatus;
  orderDeliveryOTP?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  rating?: number;
  hasReview?: boolean;
}

export interface ReservationRecord {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  date: string;
  time: string;
  guests: number;
  seating: 'Indoor AC' | 'Outdoor Terrace' | 'Private Dining';
  specialRequest?: string;
  guestName: string;
  guestPhone: string;
  createdAt: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryArea: string;
  landmark?: string;
  deliveryInstructions?: string;
  deliverySchedule?: 'ASAP' | 'SCHEDULED';
  scheduledTime?: string;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Card';
  idempotencyKey?: string;
}

export interface ReservationFormData {
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  seating: 'Indoor AC' | 'Outdoor Terrace' | 'Private Dining';
  specialRequest?: string;
  guestName: string;
  guestPhone: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'ORDER' | 'PROMO' | 'SYSTEM';
  actionView?: KhabarView;
}

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  orderId?: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  role?: UserRole;
  isLoggedIn: boolean;
}

interface KhabarContextType {
  // Localization
  language: Language;
  toggleLanguage: () => void;
  t: TranslationStrings;

  // Portal Role & Gate
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  roleGateState: { isOpen: boolean; targetRole: UserRole; pendingMode?: PortalMode };
  setRoleGateState: React.Dispatch<React.SetStateAction<{ isOpen: boolean; targetRole: UserRole; pendingMode?: PortalMode }>>;
  handleRoleGateSuccess: () => void;

  // Navigation
  currentView: KhabarView;
  navigateTo: (view: KhabarView, params?: { restaurantId?: string; categoryId?: string; orderId?: string }) => void;

  // Location
  selectedLocation: LocationItem;
  changeLocation: (loc: LocationItem) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Search & Global Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'recommended' | 'rating' | 'fastest' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'recommended' | 'rating' | 'fastest' | 'price-asc' | 'price-desc') => void;
  cuisineFilters: string[];
  toggleCuisineFilter: (cuisine: string) => void;
  minRatingFilter: number;
  setMinRatingFilter: (rating: number) => void;
  freeDeliveryOnly: boolean;
  setFreeDeliveryOnly: (only: boolean) => void;
  budgetFilter: number | null;
  setBudgetFilter: (budget: number | null) => void;

  // Restaurant Detail & Live Management
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  openRestaurantDetail: (restaurantId: string) => void;
  toggleRestaurantOpenStatus: (restaurantId: string) => void;
  toggleMenuItemAvailability: (restaurantId: string, itemId: string) => void;

  // Food Customization Modal
  inspectingFood: { item: MenuItem; restaurant: Restaurant } | null;
  openFoodModal: (item: MenuItem, restaurant: Restaurant) => void;
  closeFoodModal: () => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    item: MenuItem,
    restaurant: Restaurant,
    quantity?: number,
    selectedSize?: string,
    selectedSauces?: string[],
    addOns?: AddOnOption[],
    instructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  vat: number;
  total: number;
  appliedCoupon: PromoCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders & Live Tracking
  orders: OrderRecord[];
  activeTrackingOrder: OrderRecord | null;
  setActiveTrackingOrder: (order: OrderRecord | null) => void;
  placeOrder: (formData: CheckoutFormData) => OrderRecord | null;
  reorder: (order: OrderRecord) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;

  // Table Reservations
  reservations: ReservationRecord[];
  makeReservation: (formData: ReservationFormData) => ReservationRecord | null;
  cancelReservation: (id: string) => void;

  // Favorites
  favoriteRestaurantIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  isRestaurantFavorited: (id: string) => boolean;

  // User Profile & Addresses
  user: UserProfile;
  authenticatedUser: AuthenticatedUser | null;
  loginUser: (phoneOrEmail: string, name?: string) => void;
  loginWithPassword: (identifier: string, pass: string) => Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }>;
  loginWithRoleCredentials: (identifier: string, pass: string, targetRole: UserRole) => Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }>;
  registerCustomer: (name: string, phone: string, pass: string) => Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }>;
  requestOTP: (identifier: string) => { success: boolean; error?: string; message?: string; otpPreview?: string };
  verifyOTP: (identifier: string, code: string) => { success: boolean; user?: AuthenticatedUser; error?: string };
  logoutUser: () => void;
  savedAddresses: SavedAddress[];
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Authentication Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'otp';
  setAuthMode: (mode: 'login' | 'signup' | 'otp') => void;

  // Post-Order Review Modal
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewOrderTarget: OrderRecord | null;
  openReviewModal: (order: OrderRecord) => void;
  submitReview: (rating: number, comment: string, foodQuality: number, delivery: number, packaging: number, value: number) => void;

  // Notifications Drawer
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Help Center & Support Tickets
  supportTickets: SupportTicket[];
  createSupportTicket: (category: string, subject: string, message: string, orderId?: string) => void;

  // Toast
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Currency & Formats
  formatBDT: (amount: number) => string;

  // Admin Ecosystem
  pendingRestaurants: PendingRestaurant[];
  approveRestaurant: (id: string) => void;
  rejectRestaurant: (id: string, reason?: string) => void;
  requestChangesRestaurant: (id: string, notes: string) => void;
  addRestaurant: (rest: Omit<Restaurant, 'id'>) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;

  // Food & Menu Management
  addMenuItem: (restaurantId: string, item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (restaurantId: string, itemId: string) => void;

  // Offers & Coupons
  coupons: PromoCoupon[];
  createCoupon: (coupon: PromoCoupon) => void;
  deleteCoupon: (code: string) => void;

  // Payments & Finance
  transactions: PaymentTransaction[];
  refundTransaction: (transactionId: string, reason: string) => void;

  // Riders & Fleet
  riders: RiderProfile[];
  updateRiderStatus: (riderId: string, status: RiderProfile['status']) => void;
  assignRiderToOrder: (orderId: string, riderName: string, riderPhone: string) => void;

  // Restaurant Partner Operations
  activePartnerRestaurantId: string;
  setActivePartnerRestaurantId: (id: string) => void;
  inventory: InventoryItem[];
  updateInventoryStock: (itemId: string, currentStock: number) => void;
  replyToReview: (restaurantId: string, reviewId: string, replyText: string) => void;

  // Rider Courier Operations
  riderOnline: boolean;
  setRiderOnline: (online: boolean) => void;
  incomingDelivery: OrderRecord | null;
  setIncomingDelivery: (order: OrderRecord | null) => void;
  acceptDelivery: (orderId: string) => void;
  declineDelivery: (orderId: string) => void;
  activeRiderStep: number;
  setActiveRiderStep: (step: number) => void;
  completeDeliveryWithOTP: (orderId: string, otp: string) => boolean;
  riderDeliveries: RiderDeliveryRecord[];
  walletBalance: number;

  // Audit Logs (Admin)
  auditLogs: AuditLogEntry[];
}

const KhabarContext = createContext<KhabarContextType | undefined>(undefined);

export const KhabarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('khabar_lang');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'bn' : 'en';
      try {
        localStorage.setItem('khabar_lang', next);
      } catch {}
      return next;
    });
  };

  const t = TRANSLATIONS[language];

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3600);
  }, []);

  // Authentication State
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>({
    id: 'user-customer-1',
    name: 'Tanvir Ahmed',
    email: 'tanvir@khabar.com',
    phone: '+8801712345678',
    role: 'CUSTOMER',
  });

  const [user, setUser] = useState<UserProfile>({
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    email: 'tanvir@khabar.com',
    role: 'CUSTOMER',
    isLoggedIn: true,
  });

  // Portal Mode & Role Gate State
  const [portalMode, setPortalModeState] = useState<PortalMode>('customer');
  const [roleGateState, setRoleGateState] = useState<{
    isOpen: boolean;
    targetRole: UserRole;
    pendingMode?: PortalMode;
  }>({
    isOpen: false,
    targetRole: 'ADMIN',
  });

  // Navigation
  const [currentView, setCurrentView] = useState<KhabarView>('home');

  // Role Gate Enforcement on Portal Switch
  const setPortalMode = (mode: PortalMode) => {
    if (mode === 'customer') {
      setPortalModeState('customer');
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Role requirements for privileged portals
    if (mode === 'admin') {
      if (authenticatedUser?.role === 'ADMIN') {
        setPortalModeState('admin');
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setRoleGateState({ isOpen: true, targetRole: 'ADMIN', pendingMode: 'admin' });
      }
      return;
    }

    if (mode === 'partner') {
      if (authenticatedUser?.role === 'RESTAURANT' || authenticatedUser?.role === 'ADMIN') {
        setPortalModeState('partner');
        setCurrentView('partner');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setRoleGateState({ isOpen: true, targetRole: 'RESTAURANT', pendingMode: 'partner' });
      }
      return;
    }

    if (mode === 'rider') {
      if (authenticatedUser?.role === 'RIDER' || authenticatedUser?.role === 'ADMIN') {
        setPortalModeState('rider');
        setCurrentView('rider');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setRoleGateState({ isOpen: true, targetRole: 'RIDER', pendingMode: 'rider' });
      }
      return;
    }
  };

  const handleRoleGateSuccess = () => {
    const targetMode = roleGateState.pendingMode || 'customer';
    setRoleGateState({ isOpen: false, targetRole: 'CUSTOMER' });
    setPortalModeState(targetMode);
    setCurrentView(targetMode === 'customer' ? 'home' : targetMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Location
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(BANGLADESH_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'fastest' | 'price-asc' | 'price-desc'>('recommended');
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);

  // Restaurant Catalog
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(RESTAURANTS[0]);

  // Food Inspection Modal
  const [inspectingFood, setInspectingFood] = useState<{ item: MenuItem; restaurant: Restaurant } | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(DEMO_ADDRESSES);

  // Active Partner Restaurant Outlet (Strict tenant isolation for RESTAURANT role)
  const [activePartnerRestaurantId, setActivePartnerRestaurantIdState] = useState<string>('takeout');

  const setActivePartnerRestaurantId = (id: string) => {
    // If user is RESTAURANT partner, they cannot manage any other outlet
    if (authenticatedUser?.role === 'RESTAURANT' && authenticatedUser.restaurantId !== id) {
      showToast('Access Denied: You may only manage your authorized restaurant outlet.', 'error');
      return;
    }
    setActivePartnerRestaurantIdState(id);
  };

  // Orders State (Seeded with initial demo orders)
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'KH-10248',
      items: [
        {
          id: 'demo-1',
          menuItem: RESTAURANTS[0].menuItems[0],
          restaurantId: RESTAURANTS[0].id,
          restaurantName: RESTAURANTS[0].name,
          quantity: 2,
          selectedSize: 'Regular Fillet',
          selectedSauces: ['Signature Takeout Sauce'],
          selectedAddOns: [{ id: 'cheese', name: 'Extra Cheddar Cheese', price: 30 }],
          itemTotal: 590,
        },
      ],
      restaurantId: RESTAURANTS[0].id,
      restaurantName: RESTAURANTS[0].name,
      restaurantLogo: RESTAURANTS[0].logo,
      subtotal: 590,
      discount: 50,
      deliveryFee: 49,
      vat: 27,
      total: 616,
      customerName: 'Tanvir Ahmed',
      customerPhone: '+880 1712-345678',
      deliveryAddress: 'House 42, Flat 5B, Road 11',
      deliveryArea: 'Dhanmondi, Dhaka',
      paymentMethod: 'bKash',
      paymentStatus: 'PAID',
      transactionId: 'BKH-INIT-10248',
      placedAt: '13:45',
      estimatedDeliveryMin: 25,
      status: 'ON_THE_WAY',
      orderDeliveryOTP: '4821',
      riderName: 'Md. Rahim Uddin',
      riderPhone: '+880 1819-223344',
      riderVehicle: 'Honda CG125 (Thermal Heated Case)',
    },
    {
      id: 'KH-9842',
      items: [
        {
          id: 'demo-2',
          menuItem: RESTAURANTS[1].menuItems[0],
          restaurantId: RESTAURANTS[1].id,
          restaurantName: RESTAURANTS[1].name,
          quantity: 1,
          selectedAddOns: [{ id: 'borhani-cup', name: 'Clay Cup Borhani (250ml)', price: 60 }],
          itemTotal: 390,
        },
      ],
      restaurantId: RESTAURANTS[1].id,
      restaurantName: RESTAURANTS[1].name,
      restaurantLogo: RESTAURANTS[1].logo,
      subtotal: 390,
      discount: 0,
      deliveryFee: 0,
      vat: 19.5,
      total: 409.5,
      customerName: 'Tanvir Ahmed',
      customerPhone: '+880 1712-345678',
      deliveryAddress: 'House 42, Flat 5B, Road 11',
      deliveryArea: 'Dhanmondi, Dhaka',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PAID',
      transactionId: 'COD-INIT-9842',
      placedAt: 'Yesterday, 19:20',
      estimatedDeliveryMin: 30,
      status: 'DELIVERED',
      orderDeliveryOTP: '9912',
      rating: 5,
      hasReview: true,
    },
  ]);

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderRecord | null>(orders[0] || null);

  // Reservations
  const [reservations, setReservations] = useState<ReservationRecord[]>([
    {
      id: 'RES-KH-1024',
      restaurantId: RESTAURANTS[1].id,
      restaurantName: RESTAURANTS[1].name,
      restaurantAddress: RESTAURANTS[1].address,
      date: '2026-09-28',
      time: '20:30',
      guests: 4,
      seating: 'Indoor AC',
      specialRequest: 'Corner family table with high chairs.',
      guestName: 'Tanvir Ahmed',
      guestPhone: '+880 1712-345678',
      createdAt: '24 Sep 2026',
      status: 'CONFIRMED',
    },
  ]);

  // Favorites
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>([RESTAURANTS[0].id, RESTAURANTS[1].id]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Order Confirmed (#KH-10248)',
      message: 'Takeout kitchen has received your burger order and started preparation.',
      time: '12 mins ago',
      isRead: false,
      type: 'ORDER',
      actionView: 'tracking',
    },
    {
      id: 'notif-2',
      title: '20% OFF Midnight Biryani',
      message: 'Use voucher code KHABAR50 to get ৳50 flat discount on orders above ৳400.',
      time: '1 hour ago',
      isRead: false,
      type: 'PROMO',
      actionView: 'offers',
    },
    {
      id: 'notif-3',
      title: 'Table Reserved at Sultan’s Dine',
      message: 'Your table for 4 guests is confirmed for tonight at 8:30 PM.',
      time: '3 hours ago',
      isRead: true,
      type: 'SYSTEM',
      actionView: 'reservations',
    },
  ]);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-201',
      category: 'Delivery issue',
      subject: 'Query on contactless delivery protocol',
      message: 'Can the rider leave the food parcel with the security guard at Dhanmondi?',
      status: 'RESOLVED',
      createdAt: 'Yesterday',
    },
  ]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrderTarget, setReviewOrderTarget] = useState<OrderRecord | null>(null);

  // Admin Ecosystem State
  const [pendingRestaurants, setPendingRestaurants] = useState<PendingRestaurant[]>(DEMO_PENDING_RESTAURANTS);
  const [coupons, setCoupons] = useState<PromoCoupon[]>(PROMO_COUPONS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(DEMO_TRANSACTIONS);
  const [riders, setRiders] = useState<RiderProfile[]>(DEMO_RIDERS);

  // Partner State
  const [inventory, setInventory] = useState<InventoryItem[]>(DEMO_INVENTORY);

  // Rider State
  const [riderOnline, setRiderOnline] = useState<boolean>(true);
  const [incomingDelivery, setIncomingDelivery] = useState<OrderRecord | null>(orders[0] || null);
  const [activeRiderStep, setActiveRiderStep] = useState<number>(1);
  const [riderDeliveries, setRiderDeliveries] = useState<RiderDeliveryRecord[]>(DEMO_RIDER_DELIVERIES);
  const [walletBalance, setWalletBalance] = useState<number>(3450);

  // Audit Logs Live Feed
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => auditLogger.getRecentLogs(100));

  // Sync audit logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAuditLogs(auditLogger.getRecentLogs(100));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Currency Formatter
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')}`;

  // Navigation
  const navigateTo = (view: KhabarView, params?: { restaurantId?: string; categoryId?: string; orderId?: string }) => {
    if (params?.restaurantId) {
      const found = restaurants.find((r) => r.id === params.restaurantId);
      if (found) setActiveRestaurant(found);
    }
    if (params?.categoryId) {
      setSelectedCategory(params.categoryId);
    }
    if (params?.orderId) {
      const foundOrder = orders.find((o) => o.id === params.orderId);
      if (foundOrder) setActiveTrackingOrder(foundOrder);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeLocation = (loc: LocationItem) => {
    setSelectedLocation(loc);
    setIsLocationModalOpen(false);
    showToast(`Delivering to ${loc.name}, ${loc.city}`);
  };

  const openRestaurantDetail = (restaurantId: string) => {
    const found = restaurants.find((r) => r.id === restaurantId);
    if (found) {
      setActiveRestaurant(found);
      navigateTo('restaurant-detail');
    }
  };

  const openFoodModal = (item: MenuItem, restaurant: Restaurant) => {
    setInspectingFood({ item, restaurant });
  };

  const closeFoodModal = () => {
    setInspectingFood(null);
  };

  const toggleCuisineFilter = (cuisine: string) => {
    setCuisineFilters((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  // Authoritative Dynamic Cart Calculations
  const authoritativeComputation = orderEngine.calculateOrderFinancials(
    cart,
    appliedCoupon?.code,
    selectedLocation.deliveryFee,
    user.phone
  );

  const subtotal = authoritativeComputation.success && authoritativeComputation.totals
    ? authoritativeComputation.totals.subtotal
    : cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const discount = authoritativeComputation.success && authoritativeComputation.totals
    ? authoritativeComputation.totals.discount
    : 0;

  const deliveryFee = authoritativeComputation.success && authoritativeComputation.totals
    ? authoritativeComputation.totals.deliveryFee
    : (subtotal >= 600 ? 0 : selectedLocation.deliveryFee);

  const vat = authoritativeComputation.success && authoritativeComputation.totals
    ? authoritativeComputation.totals.vat
    : Math.round(Math.max(0, subtotal - discount) * 0.05);

  const total = authoritativeComputation.success && authoritativeComputation.totals
    ? authoritativeComputation.totals.total
    : Math.max(0, subtotal - discount + deliveryFee + vat);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Mutators
  const addToCart = (
    item: MenuItem,
    restaurant: Restaurant,
    quantity = 1,
    selectedSize?: string,
    selectedSauces: string[] = [],
    addOns: AddOnOption[] = [],
    instructions?: string
  ) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurant.id) {
      const confirmReplace = window.confirm(
        `Your bag has dishes from "${cart[0].restaurantName}". Start a fresh bag with items from "${restaurant.name}"?`
      );
      if (!confirmReplace) return;
      setCart([]);
    }

    const safeQty = Math.max(1, Math.min(50, Math.floor(quantity)));
    const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const singlePrice = item.price + addOnTotal;
    const itemTotal = singlePrice * safeQty;

    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity: safeQty,
      selectedSize,
      selectedSauces,
      selectedAddOns: addOns,
      specialInstructions: sanitizeText(instructions, 200),
      itemTotal,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${item.name} to bag`);
    closeFoodModal();
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const safeQty = Math.min(50, Math.floor(newQty));
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const singlePrice = item.itemTotal / item.quantity;
          return {
            ...item,
            quantity: safeQty,
            itemTotal: singlePrice * safeQty,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const rateCheck = rateLimiter.checkLimit('coupon:check', RATE_LIMITS.COUPON_CHECK.max, RATE_LIMITS.COUPON_CHECK.windowMs);
    if (!rateCheck.allowed) {
      return { success: false, message: `Too many coupon attempts. Please wait ${rateCheck.retryAfterSeconds}s.` };
    }

    const result = couponEngine.validateCoupon(code, subtotal, user.phone);
    if (!result.isValid || !result.coupon) {
      return { success: false, message: result.error || 'Invalid or ineligible coupon code.' };
    }

    setAppliedCoupon(result.coupon);
    showToast(`Coupon ${result.coupon.code} applied! Saved discount.`, 'success');
    return { success: true, message: `Coupon applied: ${result.coupon.badge}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Place Order (Server-Authoritative Price Calculation & Fraud Defense)
  const placeOrder = (formData: CheckoutFormData): OrderRecord | null => {
    // 1. Rate Limiting Check
    const rateCheck = rateLimiter.checkLimit('order:create', RATE_LIMITS.ORDER_CREATE.max, RATE_LIMITS.ORDER_CREATE.windowMs);
    if (!rateCheck.allowed) {
      showToast(`Order submission rate limit exceeded. Please wait ${rateCheck.retryAfterSeconds}s.`, 'error');
      return null;
    }

    // 2. Validate Customer Inputs
    const phoneValidation = validateBDPhone(formData.customerPhone);
    if (!phoneValidation.isValid) {
      showToast(phoneValidation.error || 'Invalid mobile number.', 'error');
      return null;
    }

    const cleanName = sanitizeText(formData.customerName, 80);
    const cleanAddress = sanitizeText(formData.deliveryAddress, 250);
    const cleanInstructions = sanitizeText(formData.deliveryInstructions, 250);

    if (!cleanName || !cleanAddress) {
      showToast('Recipient name and delivery address are mandatory.', 'error');
      return null;
    }

    // 3. Authoritative Order Recalculation
    const calculation = orderEngine.calculateOrderFinancials(
      cart,
      appliedCoupon?.code,
      selectedLocation.deliveryFee,
      phoneValidation.normalized
    );

    if (!calculation.success || !calculation.totals) {
      showToast(calculation.error || 'Order recalculation failed.', 'error');
      return null;
    }

    const authoritativeTotals = calculation.totals;
    const orderId = `KH-${Math.floor(10000 + Math.random() * 90000)}`;

    // 4. Payment Verification (Idempotent)
    const idempotencyKey = formData.idempotencyKey || `idem-${orderId}-${Date.now()}`;
    const paymentResult = paymentSecurity.verifyPaymentTransaction(
      idempotencyKey,
      orderId,
      authoritativeTotals.total,
      formData.paymentMethod,
      phoneValidation.normalized
    );

    // 5. Commit Coupon Redemption
    if (authoritativeTotals.appliedCouponCode && authoritativeTotals.discount > 0) {
      couponEngine.recordRedemption(
        authoritativeTotals.appliedCouponCode,
        phoneValidation.normalized,
        orderId,
        authoritativeTotals.discount
      );
    }

    // 6. Build Immutable Order Record
    const verifiedOrder: OrderRecord = {
      id: orderId,
      items: authoritativeTotals.verifiedItems,
      restaurantId: cart[0]?.restaurantId || 'takeout',
      restaurantName: cart[0]?.restaurantName || 'Takeout',
      restaurantLogo: restaurants.find((r) => r.id === cart[0]?.restaurantId)?.logo,
      subtotal: authoritativeTotals.subtotal,
      discount: authoritativeTotals.discount,
      deliveryFee: authoritativeTotals.deliveryFee,
      vat: authoritativeTotals.vat,
      total: authoritativeTotals.total,
      customerName: cleanName,
      customerPhone: phoneValidation.normalized,
      deliveryAddress: cleanAddress,
      deliveryArea: sanitizeText(formData.deliveryArea, 100),
      landmark: sanitizeText(formData.landmark, 100),
      deliveryInstructions: cleanInstructions,
      deliverySchedule: formData.deliverySchedule || 'ASAP',
      scheduledTime: formData.scheduledTime,
      paymentMethod: formData.paymentMethod,
      paymentStatus: paymentResult.paymentStatus,
      transactionId: paymentResult.transactionId,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryMin: 28,
      status: 'CONFIRMED',
      orderDeliveryOTP: authoritativeTotals.orderDeliveryOTP,
      riderName: 'Md. Rahim Uddin',
      riderPhone: '+880 1819-223344',
      riderVehicle: 'Honda CG125 (Thermal Heated Case)',
    };

    setOrders((prev) => [verifiedOrder, ...prev]);
    setActiveTrackingOrder(verifiedOrder);
    clearCart();
    setIsCartOpen(false);
    navigateTo('tracking', { orderId: verifiedOrder.id });
    showToast(`Order #${orderId} verified and confirmed! (Delivery OTP: ${verifiedOrder.orderDeliveryOTP})`, 'success');

    auditLogger.log({
      actorId: user.phone || 'guest',
      actorName: cleanName,
      actorRole: 'CUSTOMER',
      action: 'CUSTOMER_PLACED_ORDER',
      resourceType: 'order',
      resourceId: orderId,
      status: 'SUCCESS',
      severity: 'INFO',
      details: {
        total: verifiedOrder.total,
        paymentMethod: verifiedOrder.paymentMethod,
        transactionId: verifiedOrder.transactionId || 'none',
      },
    });

    // Progression simulation strictly respecting order lifecycle
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId && o.status === 'CONFIRMED' ? { ...o, status: 'PREPARING' } : o))
      );
    }, 8000);

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId && o.status === 'PREPARING' ? { ...o, status: 'PICKED_UP' } : o))
      );
    }, 18000);

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId && o.status === 'PICKED_UP' ? { ...o, status: 'ON_THE_WAY' } : o))
      );
    }, 30000);

    return verifiedOrder;
  };

  // Order State Machine with RBAC Verification
  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      showToast('Target order not found.', 'error');
      return;
    }

    const check = orderEngine.validateStatusTransition(targetOrder.status, status, authenticatedUser, targetOrder);
    if (!check.allowed) {
      showToast(check.error || 'Unauthorized order status transition.', 'error');
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setActiveTrackingOrder((curr) => (curr?.id === orderId ? { ...curr, status } : curr));

    auditLogger.log({
      actorId: authenticatedUser?.id || 'system',
      actorName: authenticatedUser?.name || 'Automated Stepper',
      actorRole: authenticatedUser?.role || 'SYSTEM',
      action: 'ORDER_STATUS_CHANGED',
      resourceType: 'order',
      resourceId: orderId,
      status: 'SUCCESS',
      severity: 'INFO',
      details: { fromStatus: targetOrder.status, toStatus: status },
    });

    showToast(`Order #${orderId} is now ${status}.`);
  };

  const reorder = (order: OrderRecord) => {
    const restaurant = restaurants.find((r) => r.id === order.restaurantId) || restaurants[0];
    setCart(order.items);
    setIsCartOpen(true);
    showToast(`Items from ${restaurant.name} added back to your bag.`);
  };

  const cancelOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status !== 'PLACED' && targetOrder.status !== 'CONFIRMED') {
      showToast('Order cannot be cancelled after the kitchen has started cooking.', 'error');
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );
    showToast(`Order #${orderId} was cancelled.`, 'info');

    auditLogger.log({
      actorId: user.phone || 'customer',
      actorName: user.name,
      actorRole: 'CUSTOMER',
      action: 'CUSTOMER_CANCELLED_ORDER',
      resourceType: 'order',
      resourceId: orderId,
      status: 'SUCCESS',
      severity: 'INFO',
    });
  };

  // Table Reservations with Input Validation
  const makeReservation = (formData: ReservationFormData): ReservationRecord | null => {
    const rateCheck = rateLimiter.checkLimit('reservation:create', RATE_LIMITS.RESERVATION.max, RATE_LIMITS.RESERVATION.windowMs);
    if (!rateCheck.allowed) {
      showToast(`Reservation rate limit reached. Please wait ${rateCheck.retryAfterSeconds}s.`, 'error');
      return null;
    }

    const dateCheck = validateReservationDate(formData.date);
    if (!dateCheck.isValid) {
      showToast(dateCheck.error || 'Invalid reservation date.', 'error');
      return null;
    }

    const phoneCheck = validateBDPhone(formData.guestPhone);
    if (!phoneCheck.isValid) {
      showToast(phoneCheck.error || 'Invalid phone number.', 'error');
      return null;
    }

    const guestsCheck = validateInteger(formData.guests, 1, 25, 'Guest count');
    if (!guestsCheck.isValid) {
      showToast(guestsCheck.error || 'Invalid party size.', 'error');
      return null;
    }

    const cleanGuestName = sanitizeText(formData.guestName, 80);
    const cleanRequest = sanitizeText(formData.specialRequest, 250);

    const targetRest = restaurants.find((r) => r.id === formData.restaurantId) || restaurants[0];
    const resId = `RES-KH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReservation: ReservationRecord = {
      id: resId,
      restaurantId: targetRest.id,
      restaurantName: targetRest.name,
      restaurantAddress: targetRest.address,
      date: formData.date,
      time: formData.time,
      guests: guestsCheck.parsedValue,
      seating: formData.seating,
      specialRequest: cleanRequest,
      guestName: cleanGuestName,
      guestPhone: phoneCheck.normalized,
      createdAt: new Date().toLocaleDateString(),
      status: 'CONFIRMED',
    };

    setReservations((prev) => [newReservation, ...prev]);
    showToast(`Table confirmed at ${targetRest.name}! Pass #${resId}`, 'success');

    auditLogger.log({
      actorId: phoneCheck.normalized,
      actorName: cleanGuestName,
      actorRole: 'CUSTOMER',
      action: 'RESERVATION_CREATED',
      resourceType: 'reservation',
      resourceId: resId,
      status: 'SUCCESS',
      severity: 'INFO',
    });

    return newReservation;
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
    );
    showToast(`Reservation #${id} has been cancelled.`, 'info');
  };

  // Favorites
  const toggleFavoriteRestaurant = (id: string) => {
    setFavoriteRestaurantIds((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(isFav ? 'Removed from favorites' : 'Saved to favorites');
      return updated;
    });
  };

  const isRestaurantFavorited = (id: string) => favoriteRestaurantIds.includes(id);

  // Authentication Handlers
  const loginUser = (phoneOrEmail: string, name = 'Tanvir Ahmed') => {
    const updated = {
      name: sanitizeText(name, 60),
      phone: phoneOrEmail.includes('@') ? '+880 1712-345678' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'tanvir.ahmed@example.com',
      role: 'CUSTOMER' as UserRole,
      isLoggedIn: true,
    };
    setUser(updated);
    setAuthenticatedUser({
      id: 'user-customer-1',
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: 'CUSTOMER',
    });
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${updated.name}!`);
  };

  const loginWithPassword = async (identifier: string, pass: string) => {
    const result = await authService.loginWithPassword(identifier, pass);
    if (result.success && result.user) {
      setAuthenticatedUser(result.user);
      setUser({
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: result.user.role,
        isLoggedIn: true,
      });
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const loginWithRoleCredentials = async (identifier: string, pass: string, targetRole: UserRole) => {
    const result = await authService.loginWithPassword(identifier, pass);
    if (result.success && result.user) {
      if (result.user.role !== targetRole && result.user.role !== 'ADMIN') {
        return {
          success: false,
          error: `Credentials authorized for role ${result.user.role}, but ${targetRole} is required.`,
        };
      }
      setAuthenticatedUser(result.user);
      setUser({
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: result.user.role,
        isLoggedIn: true,
      });
    }
    return result;
  };

  const registerCustomer = async (name: string, phone: string, pass: string) => {
    const result = await authService.registerCustomer(name, phone, pass);
    if (result.success && result.user) {
      setAuthenticatedUser(result.user);
      setUser({
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: 'CUSTOMER',
        isLoggedIn: true,
      });
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const requestOTP = (identifier: string) => {
    return authService.requestOTP(identifier);
  };

  const verifyOTP = (identifier: string, code: string) => {
    const result = authService.verifyOTP(identifier, code);
    if (result.success && result.user) {
      setAuthenticatedUser(result.user);
      setUser({
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: 'CUSTOMER',
        isLoggedIn: true,
      });
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const logoutUser = () => {
    authService.logout(authenticatedUser?.token);
    const guest = { name: 'Guest Foodie', phone: '', email: '', role: 'CUSTOMER' as UserRole, isLoggedIn: false };
    setUser(guest);
    setAuthenticatedUser(null);
    setPortalModeState('customer');
    setCurrentView('home');
    showToast('Signed out of KHABAR.');
  };

  // Saved Addresses
  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      name: sanitizeText(addr.name, 60),
      address: sanitizeText(addr.address, 200),
      instructions: sanitizeText(addr.instructions, 200),
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [newAddr, ...prev]);
    showToast(`Added address (${addr.type})`);
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed.');
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Default delivery address updated.');
  };

  // Reviews with Delivered Order Verification & Anti-Fake Review Defense
  const openReviewModal = (order: OrderRecord) => {
    if (order.status !== 'DELIVERED') {
      showToast('You can only review an order after it has been delivered to your doorstep.', 'error');
      return;
    }
    if (order.hasReview) {
      showToast('You have already submitted a review for this completed order.', 'info');
      return;
    }
    setReviewOrderTarget(order);
    setIsReviewModalOpen(true);
  };

  const submitReview = (
    rating: number,
    comment: string,
    foodQuality = 5,
    delivery = 5,
    packaging = 5,
    value = 5
  ) => {
    if (!reviewOrderTarget) return;

    if (reviewOrderTarget.status !== 'DELIVERED') {
      showToast('Review rejected: order has not been completed.', 'error');
      setIsReviewModalOpen(false);
      return;
    }

    if (reviewOrderTarget.hasReview) {
      showToast('Review already exists for this order.', 'error');
      setIsReviewModalOpen(false);
      return;
    }

    const cleanComment = sanitizeText(comment, 500) || 'Food was freshly prepared and delivered warm!';
    const safeRating = Math.max(1, Math.min(5, Math.round(rating)));

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: reviewOrderTarget.customerName || user.name || 'Verified Foodie',
      rating: safeRating,
      date: 'Today',
      comment: cleanComment,
      foodQualityRating: Math.max(1, Math.min(5, foodQuality)),
      deliveryRating: Math.max(1, Math.min(5, delivery)),
      packagingRating: Math.max(1, Math.min(5, packaging)),
      valueRating: Math.max(1, Math.min(5, value)),
    };

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === reviewOrderTarget.restaurantId) {
          const updatedReviews = [newRev, ...r.reviews];
          const newAvg = Number(
            (updatedReviews.reduce((sum, item) => sum + item.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...r,
            rating: newAvg,
            reviewsCount: r.reviewsCount + 1,
            reviews: updatedReviews,
          };
        }
        return r;
      })
    );

    setActiveRestaurant((prev) => {
      if (!prev || prev.id !== reviewOrderTarget.restaurantId) return prev;
      const updatedReviews = [newRev, ...prev.reviews];
      const newAvg = Number(
        (updatedReviews.reduce((sum, item) => sum + item.rating, 0) / updatedReviews.length).toFixed(1)
      );
      return {
        ...prev,
        rating: newAvg,
        reviewsCount: prev.reviewsCount + 1,
        reviews: updatedReviews,
      };
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === reviewOrderTarget.id ? { ...o, rating: safeRating, hasReview: true } : o
      )
    );

    setIsReviewModalOpen(false);
    showToast('Thank you for reviewing your meal! 50 KHABAR points added.', 'success');

    auditLogger.log({
      actorId: user.phone || 'customer',
      actorName: user.name,
      actorRole: 'CUSTOMER',
      action: 'REVIEW_SUBMITTED',
      resourceType: 'restaurant_review',
      resourceId: reviewOrderTarget.restaurantId,
      status: 'SUCCESS',
      severity: 'INFO',
    });
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Support Tickets
  const createSupportTicket = (category: string, subject: string, message: string, orderId?: string) => {
    const cleanSubject = sanitizeText(subject, 120);
    const cleanMessage = sanitizeText(message, 600);

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      category: sanitizeText(category, 50),
      subject: cleanSubject,
      orderId: orderId ? sanitizeText(orderId, 30) : undefined,
      message: cleanMessage,
      status: 'OPEN',
      createdAt: 'Just now',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showToast(`Support Ticket #${newTicket.id} created. Our Dhaka team will respond shortly.`);
  };

  // Admin Ecosystem Actions (Protected by RBAC & Audit Logging)
  const approveRestaurant = (id: string) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_APPROVE_RESTAURANT', 'admin_restaurant')) {
      showToast('Unauthorized: Admin privilege required to approve restaurants.', 'error');
      return;
    }

    const target = pendingRestaurants.find((p) => p.id === id);
    if (!target) return;

    setPendingRestaurants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p))
    );

    const newRestId = `rest-appr-${Date.now()}`;
    const newRest: Restaurant = {
      id: newRestId,
      name: target.name,
      bengaliName: target.bengaliName,
      logo: target.logo,
      coverImage: target.coverImage,
      rating: 4.8,
      reviewsCount: 1,
      cuisine: target.cuisine,
      deliveryFee: 50,
      deliveryTime: '25–35 min',
      distance: '1.5 km',
      minimumOrder: 150,
      address: target.address,
      openingHours: '11:00 AM – 11:00 PM',
      aboutText: `Authentic ${target.cuisine.join(', ')} served fresh at ${target.name}.`,
      isOpen: true,
      isFeatured: true,
      menuCategories: ['Featured', 'Specials'],
      menuItems: [
        {
          id: `dish-sample-${Date.now()}`,
          name: `${target.name} Signature Platter`,
          bengaliName: 'সিগনেচার প্ল্যাটার',
          description: 'House specialty prepared fresh with premium authentic spices and ingredients.',
          price: 480,
          image: target.coverImage,
          category: 'Specials',
          isPopular: true,
          isAvailable: true,
          restaurantId: newRestId,
          restaurantName: target.name,
        },
      ],
      reviews: [],
    };

    setRestaurants((prev) => [newRest, ...prev]);
    showToast(`Approved ${target.name}! Active on KHABAR.`, 'success');

    auditLogger.log({
      actorId: authenticatedUser.id,
      actorName: authenticatedUser.name,
      actorRole: 'ADMIN',
      action: 'ADMIN_APPROVED_RESTAURANT',
      resourceType: 'restaurant',
      resourceId: newRestId,
      status: 'SUCCESS',
      severity: 'INFO',
    });
  };

  const rejectRestaurant = (id: string, reason?: string) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_REJECT_RESTAURANT', 'admin_restaurant')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setPendingRestaurants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'REJECTED', notes: sanitizeText(reason, 200) || 'Application rejected.' } : p))
    );
    showToast('Restaurant application rejected.', 'info');
  };

  const requestChangesRestaurant = (id: string, notes: string) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_ALL_RESTAURANTS', 'admin_restaurant')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setPendingRestaurants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'NEEDS_CHANGES', notes: sanitizeText(notes, 250) } : p))
    );
    showToast('Requested changes sent to applicant.', 'info');
  };

  const addRestaurant = (restData: Omit<Restaurant, 'id'>) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_ALL_RESTAURANTS', 'admin_restaurant')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    const newRest: Restaurant = {
      ...restData,
      id: `rest-${Date.now()}`,
    };
    setRestaurants((prev) => [newRest, ...prev]);
    showToast(`Added ${newRest.name} to KHABAR!`, 'success');
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_ALL_RESTAURANTS', 'admin_restaurant')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    showToast('Restaurant details updated.', 'success');
  };

  const deleteRestaurant = (id: string) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_ALL_RESTAURANTS', 'admin_restaurant')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    showToast('Restaurant removed from platform.', 'info');
  };

  const toggleRestaurantOpenStatus = (restaurantId: string) => {
    if (!assertCanManageRestaurant(authenticatedUser, restaurantId)) {
      showToast('Unauthorized: You do not have permission to modify this restaurant.', 'error');
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r))
    );
    showToast('Restaurant operating hours updated.');
  };

  const toggleMenuItemAvailability = (restaurantId: string, itemId: string) => {
    if (!assertCanManageRestaurant(authenticatedUser, restaurantId)) {
      showToast('Unauthorized: You do not have permission to modify this menu item.', 'error');
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        return {
          ...r,
          menuItems: r.menuItems.map((item) =>
            item.id === itemId ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
          ),
        };
      })
    );
    showToast('Menu item stock status updated.');
  };

  const addMenuItem = (restaurantId: string, itemData: Omit<MenuItem, 'id'>) => {
    if (!assertCanManageRestaurant(authenticatedUser, restaurantId)) {
      showToast('Unauthorized: You do not have permission to add dishes to this restaurant.', 'error');
      return;
    }

    const targetRest = restaurants.find((r) => r.id === restaurantId);
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      restaurantId,
      restaurantName: targetRest?.name || 'Restaurant',
      isAvailable: true,
    };
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        const exists = r.menuCategories.includes(newItem.category);
        return {
          ...r,
          menuCategories: exists ? r.menuCategories : [...r.menuCategories, newItem.category],
          menuItems: [newItem, ...r.menuItems],
        };
      })
    );
    showToast(`Added ${newItem.name} to menu!`, 'success');
  };

  const updateMenuItem = (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => {
    if (!assertCanManageRestaurant(authenticatedUser, restaurantId)) {
      showToast('Unauthorized: You do not have permission to update this dish.', 'error');
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        return {
          ...r,
          menuItems: r.menuItems.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        };
      })
    );
    showToast('Menu item updated successfully.', 'success');
  };

  const deleteMenuItem = (restaurantId: string, itemId: string) => {
    if (!assertCanManageRestaurant(authenticatedUser, restaurantId)) {
      showToast('Unauthorized: You do not have permission to delete this dish.', 'error');
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        return {
          ...r,
          menuItems: r.menuItems.filter((item) => item.id !== itemId),
        };
      })
    );
    showToast('Menu item deleted.', 'info');
  };

  const createCoupon = (newCoupon: PromoCoupon) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_COUPONS', 'admin_coupon')) {
      showToast('Unauthorized: Admin privilege required to create vouchers.', 'error');
      return;
    }

    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} published!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_COUPONS', 'admin_coupon')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast('Coupon removed.', 'info');
  };

  const refundTransaction = (transactionId: string, reason: string) => {
    if (!paymentSecurity.assertCanRefund(authenticatedUser)) {
      showToast('Unauthorized: Super Admin credentials required to refund transactions.', 'error');
      return;
    }

    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId
          ? { ...txn, status: 'REFUNDED', refundReason: sanitizeText(reason, 200) }
          : txn
      )
    );
    showToast(`Transaction ${transactionId} refunded successfully.`, 'success');

    auditLogger.log({
      actorId: authenticatedUser?.id || 'admin',
      actorName: authenticatedUser?.name || 'Super Admin',
      actorRole: 'ADMIN',
      action: 'PAYMENT_REFUNDED',
      resourceType: 'transaction',
      resourceId: transactionId,
      status: 'SUCCESS',
      severity: 'WARNING',
      details: { reason: sanitizeText(reason, 200) },
    });
  };

  const updateRiderStatus = (riderId: string, status: RiderProfile['status']) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_MANAGE_RIDERS', 'admin_rider')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status } : r))
    );
    showToast(`Rider status updated to ${status}.`, 'info');
  };

  const assignRiderToOrder = (orderId: string, riderName: string, riderPhone: string) => {
    if (!assertPermission(authenticatedUser, 'ADMIN_OVERRIDE_ORDERS', 'admin_orders')) {
      showToast('Unauthorized: Admin privilege required.', 'error');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, riderName, riderPhone, status: o.status === 'PLACED' ? 'PREPARING' : o.status }
          : o
      )
    );
    showToast(`Assigned ${riderName} to Order #${orderId}`, 'success');
  };

  // Partner Operations
  const updateInventoryStock = (itemId: string, currentStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        let status: InventoryItem['status'] = 'IN_STOCK';
        if (currentStock <= 0) status = 'OUT_OF_STOCK';
        else if (currentStock <= item.lowStockThreshold) status = 'LOW_STOCK';
        return { ...item, currentStock, status, lastRestocked: 'Just now' };
      })
    );
    showToast('Inventory stock updated.', 'info');
  };

  const replyToReview = (restaurantId: string, reviewId: string, replyText: string) => {
    if (!assertCanManageRestaurant(authenticatedUser, restaurantId)) {
      showToast('Unauthorized: You may only reply to reviews for your restaurant outlet.', 'error');
      return;
    }

    const cleanReply = sanitizeText(replyText, 400);

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        return {
          ...r,
          reviews: r.reviews.map((rev) =>
            rev.id === reviewId ? { ...rev, reply: cleanReply, repliedAt: 'Just now' } : rev
          ),
        };
      })
    );
    setActiveRestaurant((prev) => {
      if (!prev || prev.id !== restaurantId) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((rev) =>
          rev.id === reviewId ? { ...rev, reply: cleanReply, repliedAt: 'Just now' } : rev
        ),
      };
    });
    showToast('Reply posted to customer review.', 'success');
  };

  // Rider Courier Operations
  const acceptDelivery = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId) || orders[0];
    if (targetOrder) {
      updateOrderStatus(targetOrder.id, 'PICKED_UP');
      setActiveTrackingOrder(targetOrder);
      setActiveRiderStep(1);
      setIncomingDelivery(null);
      showToast(`Accepted Delivery #${targetOrder.id}! Navigate to kitchen.`, 'success');
    }
  };

  const declineDelivery = (orderId: string) => {
    setIncomingDelivery(null);
    showToast(`Declined delivery request #${orderId}.`, 'info');
  };

  const completeDeliveryWithOTP = (orderId: string, otp: string): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      showToast('Order not found.', 'error');
      return false;
    }

    // Verify OTP: checks targetOrder.orderDeliveryOTP or fallback demo OTP
    const cleanOtp = otp.trim();
    const expectedOtp = targetOrder.orderDeliveryOTP || '2026';

    if (cleanOtp !== expectedOtp && cleanOtp !== '2026') {
      showToast('Incorrect customer delivery OTP. Verification failed.', 'error');
      return false;
    }

    // Advance status to DELIVERED
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' } : o))
    );
    setActiveTrackingOrder((curr) => (curr?.id === orderId ? { ...curr, status: 'DELIVERED' } : curr));
    setWalletBalance((prev) => prev + 120);

    const newRecord: RiderDeliveryRecord = {
      id: `trip-${Date.now()}`,
      orderId,
      restaurantName: targetOrder.restaurantName || "Sultan's Dine",
      pickupArea: 'Dhanmondi 8A',
      dropArea: targetOrder.deliveryArea || 'Dhanmondi',
      fareEarned: 80,
      tip: 20,
      bonus: 20,
      distanceKm: 1.8,
      durationMin: 18,
      completedAt: 'Just now',
      status: 'COMPLETED',
      customerRating: 5,
    };

    setRiderDeliveries((prev) => [newRecord, ...prev]);
    showToast(`Order #${orderId} delivered! ৳120 payout credited to wallet.`, 'success');

    auditLogger.log({
      actorId: authenticatedUser?.id || 'rider-1',
      actorName: authenticatedUser?.name || 'Md. Rahim Uddin',
      actorRole: 'RIDER',
      action: 'RIDER_DELIVERY_COMPLETED',
      resourceType: 'delivery',
      resourceId: orderId,
      status: 'SUCCESS',
      severity: 'INFO',
    });

    return true;
  };

  return (
    <KhabarContext.Provider
      value={{
        language,
        toggleLanguage,
        t,
        portalMode,
        setPortalMode,
        roleGateState,
        setRoleGateState,
        handleRoleGateSuccess,
        currentView,
        navigateTo,
        selectedLocation,
        changeLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        cuisineFilters,
        toggleCuisineFilter,
        minRatingFilter,
        setMinRatingFilter,
        freeDeliveryOnly,
        setFreeDeliveryOnly,
        budgetFilter,
        setBudgetFilter,
        restaurants,
        activeRestaurant,
        openRestaurantDetail,
        toggleRestaurantOpenStatus,
        toggleMenuItemAvailability,
        inspectingFood,
        openFoodModal,
        closeFoodModal,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        deliveryFee,
        vat,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        placeOrder,
        reorder,
        cancelOrder,
        updateOrderStatus,
        reservations,
        makeReservation,
        cancelReservation,
        favoriteRestaurantIds,
        toggleFavoriteRestaurant,
        isRestaurantFavorited,
        user,
        authenticatedUser,
        loginUser,
        loginWithPassword,
        loginWithRoleCredentials,
        registerCustomer,
        requestOTP,
        verifyOTP,
        logoutUser,
        savedAddresses,
        addSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isReviewModalOpen,
        setIsReviewModalOpen,
        reviewOrderTarget,
        openReviewModal,
        submitReview,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        notifications,
        markAllNotificationsRead,
        unreadNotificationsCount,
        supportTickets,
        createSupportTicket,
        toast,
        showToast,
        formatBDT,

        // Admin Ecosystem
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

        // Restaurant Partner Operations
        activePartnerRestaurantId,
        setActivePartnerRestaurantId,
        inventory,
        updateInventoryStock,
        replyToReview,

        // Rider Courier Operations
        riderOnline,
        setRiderOnline,
        incomingDelivery,
        setIncomingDelivery,
        acceptDelivery,
        declineDelivery,
        activeRiderStep,
        setActiveRiderStep,
        completeDeliveryWithOTP,
        riderDeliveries,
        walletBalance,

        // Audit Logs
        auditLogs,
      }}
    >
      {children}
    </KhabarContext.Provider>
  );
};

export const useKhabar = () => {
  const context = useContext(KhabarContext);
  if (!context) {
    throw new Error('useKhabar must be used within a KhabarProvider');
  }
  return context;
};
