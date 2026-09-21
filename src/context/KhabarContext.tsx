import React, { createContext, useContext, useState, useEffect } from 'react';
import type { LocationItem, Restaurant, MenuItem, AddOnOption, PromoCoupon, SavedAddress, DealItem } from '../data/khabarData';
import { BANGLADESH_LOCATIONS, RESTAURANTS, PROMO_COUPONS, DEMO_ADDRESSES, BEST_DEALS } from '../data/khabarData';
import { TRANSLATIONS, type Language, type TranslationStrings } from '../data/translations';

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
  placedAt: string;
  estimatedDeliveryMin: number;
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
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
  isLoggedIn: boolean;
}

interface KhabarContextType {
  // Localization
  language: Language;
  toggleLanguage: () => void;
  t: TranslationStrings;

  // Portal Role
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;

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
  placeOrder: (formData: CheckoutFormData) => OrderRecord;
  reorder: (order: OrderRecord) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;

  // Table Reservations
  reservations: ReservationRecord[];
  makeReservation: (formData: ReservationFormData) => ReservationRecord;
  cancelReservation: (id: string) => void;

  // Favorites
  favoriteRestaurantIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  isRestaurantFavorited: (id: string) => boolean;

  // User Profile & Addresses
  user: UserProfile;
  loginUser: (phoneOrEmail: string, name?: string) => void;
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

  // Portal Mode
  const [portalMode, setPortalModeState] = useState<PortalMode>('customer');

  const setPortalMode = (mode: PortalMode) => {
    setPortalModeState(mode);
    if (mode === 'admin') setCurrentView('admin');
    else if (mode === 'partner') setCurrentView('partner');
    else if (mode === 'rider') setCurrentView('rider');
    else setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation
  const [currentView, setCurrentView] = useState<KhabarView>('home');

  // Location
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(BANGLADESH_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'fastest' | 'price-asc' | 'price-desc'>('recommended');
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);

  // Restaurant Catalog & Live Management
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(RESTAURANTS[0]);

  const toggleRestaurantOpenStatus = (restaurantId: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r))
    );
    showToast('Restaurant operating hours status updated.');
  };

  const toggleMenuItemAvailability = (restaurantId: string, itemId: string) => {
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

  // Food Customization Modal
  const [inspectingFood, setInspectingFood] = useState<{ item: MenuItem; restaurant: Restaurant } | null>(null);

  // Cart Drawer
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('khabar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('khabar_user');
      return saved ? JSON.parse(saved) : { name: 'Tanvir Ahmed', phone: '+880 1712-345678', email: 'tanvir.ahmed@example.com', isLoggedIn: true };
    } catch {
      return { name: 'Tanvir Ahmed', phone: '+880 1712-345678', email: 'tanvir.ahmed@example.com', isLoggedIn: true };
    }
  });

  const loginUser = (phoneOrEmail: string, name = 'Tanvir Ahmed') => {
    const updated = {
      name,
      phone: phoneOrEmail.includes('@') ? '+880 1712-345678' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'tanvir.ahmed@example.com',
      isLoggedIn: true,
    };
    setUser(updated);
    try {
      localStorage.setItem('khabar_user', JSON.stringify(updated));
    } catch {}
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${name}! Logged in successfully.`);
  };

  const logoutUser = () => {
    const guest = { name: 'Guest Foodie', phone: '', email: '', isLoggedIn: false };
    setUser(guest);
    try {
      localStorage.setItem('khabar_user', JSON.stringify(guest));
    } catch {}
    showToast('Signed out of KHABAR.');
  };

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('khabar_addresses');
      return saved ? JSON.parse(saved) : DEMO_ADDRESSES;
    } catch {
      return DEMO_ADDRESSES;
    }
  });

  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = { ...addr, id: `addr-${Date.now()}` };
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

  // Orders History
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('khabar_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
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
        placedAt: '13:45',
        estimatedDeliveryMin: 25,
        status: 'ON_THE_WAY',
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
        placedAt: 'Yesterday, 19:20',
        estimatedDeliveryMin: 30,
        status: 'DELIVERED',
        rating: 5,
        hasReview: true,
      },
    ];
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderRecord | null>(orders[0] || null);

  // Table Reservations
  const [reservations, setReservations] = useState<ReservationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('khabar_reservations');
      return saved ? JSON.parse(saved) : [
        {
          id: 'RES-KH-8821',
          restaurantId: 'sultans-dine',
          restaurantName: "Sultan's Dine",
          restaurantAddress: 'Green Akshay Plaza, Satmasjid Road, Dhanmondi',
          date: 'Tonight',
          time: '8:30 PM',
          guests: 4,
          seating: 'Indoor AC',
          specialRequest: 'Window table if available',
          guestName: 'Tanvir Ahmed',
          guestPhone: '+880 1712-345678',
          createdAt: '21 Sep 2026',
          status: 'CONFIRMED',
        }
      ];
    } catch {
      return [];
    }
  });

  // Favorites
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('khabar_favorites');
      return saved ? JSON.parse(saved) : ['takeout', 'kacchi-bhai', 'pizza-burg'];
    } catch {
      return ['takeout', 'kacchi-bhai', 'pizza-burg'];
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Rider is on the way!',
      message: 'Md. Rahim Uddin is delivering your Takeout order. Arrival in ~12 mins.',
      time: 'Just now',
      isRead: false,
      type: 'ORDER',
      actionView: 'tracking',
    },
    {
      id: 'notif-2',
      title: 'Free Delivery Weekend is Live!',
      message: 'Use code FREESHIP on any order above ৳400 today.',
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

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

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

  const createSupportTicket = (category: string, subject: string, message: string, orderId?: string) => {
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      category,
      subject,
      orderId,
      message,
      status: 'OPEN',
      createdAt: 'Just now',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showToast(`Support Ticket #${newTicket.id} created. Our Dhaka team will respond shortly.`);
  };

  // Modals: Auth & Review
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrderTarget, setReviewOrderTarget] = useState<OrderRecord | null>(null);

  const openReviewModal = (order: OrderRecord) => {
    setReviewOrderTarget(order);
    setIsReviewModalOpen(true);
  };

  const submitReview = (rating: number, comment: string) => {
    if (!reviewOrderTarget) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === reviewOrderTarget.id ? { ...o, rating, hasReview: true } : o
      )
    );
    setIsReviewModalOpen(false);
    showToast('Thank you for reviewing your meal! 50 KHABAR points added.');
  };

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('khabar_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('khabar_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('khabar_reservations', JSON.stringify(reservations));
    } catch {}
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('khabar_favorites', JSON.stringify(favoriteRestaurantIds));
    } catch {}
  }, [favoriteRestaurantIds]);

  useEffect(() => {
    try {
      localStorage.setItem('khabar_addresses', JSON.stringify(savedAddresses));
    } catch {}
  }, [savedAddresses]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  };

  // Currency helper
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')}`;

  // Navigation Helper
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

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const isFreeDeliveryQualified = subtotal >= 600 || appliedCoupon?.discountType === 'FREE_DELIVERY';
  const deliveryFee = subtotal === 0 ? 0 : isFreeDeliveryQualified ? 0 : selectedLocation.deliveryFee;

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'FLAT') {
      discount = Math.min(subtotal, appliedCoupon.discountValue);
    } else if (appliedCoupon.discountType === 'PERCENT') {
      const rawDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      discount = appliedCoupon.maxDiscount ? Math.min(rawDiscount, appliedCoupon.maxDiscount) : rawDiscount;
    }
  }

  const taxableSubtotal = Math.max(0, subtotal - discount);
  const vat = taxableSubtotal > 0 ? taxableSubtotal * 0.05 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee + vat);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        `Your bag has items from "${cart[0].restaurantName}". Start a new bag with items from "${restaurant.name}"?`
      );
      if (!confirmReplace) return;
      setCart([]);
    }

    const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const singlePrice = item.price + addOnTotal;
    const itemTotal = singlePrice * quantity;

    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity,
      selectedSize,
      selectedSauces,
      selectedAddOns: addOns,
      specialInstructions: instructions,
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
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const singlePrice = item.itemTotal / item.quantity;
          return {
            ...item,
            quantity: newQty,
            itemTotal: singlePrice * newQty,
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
    const trimmed = code.trim().toUpperCase();
    const found = PROMO_COUPONS.find((c) => c.code === trimmed && c.status === 'AVAILABLE');
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code. Try KHABAR50 or FREESHIP.' };
    }
    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order of ${formatBDT(found.minOrder)} required for ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied! Saved discount.`, 'success');
    return { success: true, message: `Coupon applied: ${found.badge}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Place Order
  const placeOrder = (formData: CheckoutFormData) => {
    const orderId = `KH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      items: [...cart],
      restaurantId: cart[0]?.restaurantId || 'takeout',
      restaurantName: cart[0]?.restaurantName || 'Takeout',
      restaurantLogo: restaurants.find((r) => r.id === cart[0]?.restaurantId)?.logo,
      subtotal,
      discount,
      deliveryFee,
      vat,
      total,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.deliveryAddress,
      deliveryArea: formData.deliveryArea,
      landmark: formData.landmark,
      deliveryInstructions: formData.deliveryInstructions,
      deliverySchedule: formData.deliverySchedule || 'ASAP',
      scheduledTime: formData.scheduledTime,
      paymentMethod: formData.paymentMethod,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryMin: 28,
      status: 'CONFIRMED',
      riderName: 'Md. Rahim Uddin',
      riderPhone: '+880 1819-223344',
      riderVehicle: 'Honda CG125 (Thermal Heated Case)',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    navigateTo('tracking', { orderId: newOrder.id });
    showToast(`Order #${orderId} confirmed!`, 'success');

    // Progression simulation
    setTimeout(() => {
      updateOrderStatus(orderId, 'PREPARING');
    }, 8000);

    setTimeout(() => {
      updateOrderStatus(orderId, 'PICKED_UP');
    }, 18000);

    setTimeout(() => {
      updateOrderStatus(orderId, 'ON_THE_WAY');
    }, 30000);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setActiveTrackingOrder((curr) => (curr?.id === orderId ? { ...curr, status } : curr));
  };

  const reorder = (order: OrderRecord) => {
    const restaurant = restaurants.find((r) => r.id === order.restaurantId) || restaurants[0];
    setCart(order.items);
    setIsCartOpen(true);
    showToast(`Items from ${restaurant.name} added back to your bag.`);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );
    showToast(`Order #${orderId} was cancelled.`, 'info');
  };

  // Table Reservations
  const makeReservation = (formData: ReservationFormData) => {
    const targetRest = restaurants.find((r) => r.id === formData.restaurantId) || restaurants[0];
    const resId = `RES-KH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: ReservationRecord = {
      id: resId,
      restaurantId: targetRest.id,
      restaurantName: targetRest.name,
      restaurantAddress: targetRest.address,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      seating: formData.seating,
      specialRequest: formData.specialRequest,
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      createdAt: new Date().toLocaleDateString(),
      status: 'CONFIRMED',
    };

    setReservations((prev) => [newReservation, ...prev]);
    showToast(`Table confirmed at ${targetRest.name}! Pass #${resId}`, 'success');
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

  return (
    <KhabarContext.Provider
      value={{
        language,
        toggleLanguage,
        t,
        portalMode,
        setPortalMode,
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
        loginUser,
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
