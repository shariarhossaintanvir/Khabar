export type Language = 'en' | 'bn';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  deliverTo: string;
  searchPlaceholder: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroSubtitle: string;
  findFood: string;
  popularRightNow: string;
  exploreCategories: string;
  exploreCategoriesSub: string;
  popularNearYou: string;
  popularNearYouSub: string;
  bestDealsToday: string;
  bestDealsTodaySub: string;
  popularFoodTitle: string;
  popularFoodSub: string;
  recommendedTitle: string;
  freeDeliveryTitle: string;
  topRatedTitle: string;
  budgetFriendlyTitle: string;
  under150: string;
  under250: string;
  under350: string;
  viewAll: string;
  seeAllRestaurants: string;
  minDelivery: string;
  fee: string;
  freeDelivery: string;
  addToBag: string;
  addedToBag: string;
  proceedToCheckout: string;
  bag: string;
  emptyBagTitle: string;
  emptyBagSub: string;
  exploreFood: string;
  orderSummary: string;
  subtotal: string;
  deliveryFee: string;
  vatTax: string;
  discount: string;
  total: string;
  applyCoupon: string;
  couponApplied: string;
  enterPromoCode: string;
  stepAddress: string;
  stepDeliveryTime: string;
  stepPayment: string;
  placeOrder: string;
  cashOnDelivery: string;
  bKashPayment: string;
  nagadPayment: string;
  cardPayment: string;
  orderConfirmed: string;
  trackOrder: string;
  orderStatusConfirmed: string;
  orderStatusPreparing: string;
  orderStatusPickedUp: string;
  orderStatusOnTheWay: string;
  orderStatusDelivered: string;
  reserveTable: string;
  myReservations: string;
  favoritesTitle: string;
  myOrders: string;
  helpCenter: string;
  profile: string;
  switchPortal: string;
  customerMode: string;
  adminMode: string;
  kitchenMode: string;
  riderMode: string;
  bangla: string;
  english: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    appName: 'KHABAR',
    tagline: 'Your Craving. Your Choice.',
    deliverTo: 'Deliver to',
    searchPlaceholder: 'Search for restaurants, dishes or cuisines (e.g. Kacchi, Burger, Pizza)...',
    heroHeadingLine1: 'What are you',
    heroHeadingLine2: 'craving today?',
    heroSubtitle: 'Order from top Dhaka kitchens and get authentic Biryani, Burgers, Pizzas, and Traditional Feasts delivered piping hot.',
    findFood: 'Find Food',
    popularRightNow: 'Popular right now:',
    exploreCategories: 'Browse Categories',
    exploreCategoriesSub: 'Tap a category to discover verified kitchens and curated dishes',
    popularNearYou: 'Popular Near You',
    popularNearYouSub: 'Highest rated restaurants delivering quickly in your neighborhood',
    bestDealsToday: 'Best Deals Today',
    bestDealsTodaySub: 'Exclusive discounts, Buy 1 Get 1, and free delivery vouchers',
    popularFoodTitle: 'Popular Food Items',
    popularFoodSub: 'Dhaka’s most loved dishes ordered right now',
    recommendedTitle: 'Recommended For You',
    freeDeliveryTitle: 'Free Doorstep Delivery',
    topRatedTitle: 'Top Rated Kitchens (4.8+ ★)',
    budgetFriendlyTitle: 'Budget Friendly Picks',
    under150: 'Under ৳150',
    under250: 'Under ৳250',
    under350: 'Under ৳350',
    viewAll: 'View All',
    seeAllRestaurants: 'See All Restaurants',
    minDelivery: 'min',
    fee: 'fee',
    freeDelivery: 'Free Delivery',
    addToBag: '+ Add',
    addedToBag: 'Added to Bag',
    proceedToCheckout: 'Proceed to Checkout',
    bag: 'Food Bag',
    emptyBagTitle: 'Your food bag is waiting for something delicious',
    emptyBagSub: 'Explore our top restaurants and add your favorite dishes to begin.',
    exploreFood: 'Explore Food',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    vatTax: 'Govt VAT / Tax (5%)',
    discount: 'Discount',
    total: 'Total Amount',
    applyCoupon: 'Apply',
    couponApplied: 'Applied',
    enterPromoCode: 'Enter voucher code (e.g. KHABAR50)',
    stepAddress: 'Delivery Address',
    stepDeliveryTime: 'Delivery Schedule',
    stepPayment: 'Payment Method',
    placeOrder: 'Place Order Now',
    cashOnDelivery: 'Cash on Delivery (COD)',
    bKashPayment: 'bKash Online Payment',
    nagadPayment: 'Nagad Mobile Banking',
    cardPayment: 'Debit / Credit Card (Visa/Mastercard)',
    orderConfirmed: 'Order Placed Successfully!',
    trackOrder: 'Track Live Order',
    orderStatusConfirmed: 'Order Confirmed',
    orderStatusPreparing: 'Preparing in Kitchen',
    orderStatusPickedUp: 'Order Picked Up',
    orderStatusOnTheWay: 'Rider on the Way',
    orderStatusDelivered: 'Delivered',
    reserveTable: 'Reserve a Table',
    myReservations: 'My Table Passes',
    favoritesTitle: 'Saved Favorites',
    myOrders: 'My Orders',
    helpCenter: 'Help Center & Support',
    profile: 'My Account',
    switchPortal: 'Portal View',
    customerMode: 'Customer App',
    adminMode: 'Admin Dashboard',
    kitchenMode: 'Restaurant Partner',
    riderMode: 'Rider Delivery App',
    bangla: 'বাংলা',
    english: 'English',
  },
  bn: {
    appName: 'খাবার',
    tagline: 'আপনার ক্ষুধা, আপনার পছন্দ।',
    deliverTo: 'ডেলিভারি ঠিকানা',
    searchPlaceholder: 'রেস্তোরাঁ, খাবার বা কুজিন খুঁজুন (যেমন: কাচ্চি, বার্গার, পিজ্জা)...',
    heroHeadingLine1: 'আজ আপনার কি',
    heroHeadingLine2: 'খেতে ইচ্ছে করছে?',
    heroSubtitle: 'ঢাকার সেরা রেস্তোরাঁ থেকে খাঁটি বিরিয়ানি, বার্গার, পিজ্জা এবং ঐতিহ্যবাহী মেজবানি খাবার গরম গরম পৌঁছে নিন ঘরে বসেই।',
    findFood: 'খাবার খুঁজুন',
    popularRightNow: 'জনপ্রিয় খাবারসমূহ:',
    exploreCategories: 'খাবারের ক্যাটাগরি',
    exploreCategoriesSub: 'পছন্দের ক্যাটাগরি বেছে নিন এবং সেরা কিচেন খুঁজে নিন',
    popularNearYou: 'আপনার আশেপাশের জনপ্রিয় রেস্তোরাঁ',
    popularNearYouSub: 'দ্রুততম ডেলিভারি ও সর্বোচ্চ রেটিং পাওয়া খাবারের জায়গা',
    bestDealsToday: 'আজকের সেরা অফার ও ডিসকাউন্ট',
    bestDealsTodaySub: 'বিশেষ ছাড়, ১টি কিনলে ১টি ফ্রি এবং ফ্রি ডেলিভারি ভাউচার',
    popularFoodTitle: 'জনপ্রিয় পছন্দের খাবার',
    popularFoodSub: 'ভোজনরসিকদের সবচেয়ে বেশি অর্ডার করা মজাদার পদগুলো',
    recommendedTitle: 'আপনার জন্য বিশেষ পছন্দ',
    freeDeliveryTitle: 'ফ্রি ডেলিভারি অফার',
    topRatedTitle: 'শীর্ষ রেটিং পাওয়া রেস্তোরাঁ (৪.৮+ ★)',
    budgetFriendlyTitle: 'বাজেট ফ্রেন্ডলি খাবার',
    under150: '৳১৫০ এর নিচে',
    under250: '৳২৫০ এর নিচে',
    under350: '৳৩৫০ এর নিচে',
    viewAll: 'সব দেখুন',
    seeAllRestaurants: 'সব রেস্তোরাঁ দেখুন',
    minDelivery: 'মিনিট',
    fee: 'চার্জ',
    freeDelivery: 'ফ্রি ডেলিভারি',
    addToBag: '+ যোগ করুন',
    addedToBag: 'ব্যাগে যোগ হয়েছে',
    proceedToCheckout: 'চেকআউটে এগিয়ে যান',
    bag: 'খাবারের ব্যাগ',
    emptyBagTitle: 'আপনার ব্যাগটি একদম খালি!',
    emptyBagSub: 'পছন্দের রেস্তোরাঁ থেকে সুস্বাদু খাবার যোগ করে অর্ডার শুরু করুন।',
    exploreFood: 'খাবার আবিষ্কার করুন',
    orderSummary: 'অর্ডারের বিবরণ',
    subtotal: 'খাবারের মূল্য',
    deliveryFee: 'ডেলিভারি চার্জ',
    vatTax: 'ভ্যাট / ট্যাক্স (৫%)',
    discount: 'বিশেষ ছাড়',
    total: 'সর্বমোট টাকা',
    applyCoupon: 'প্রয়োগ করুন',
    couponApplied: 'প্রযুক্ত হয়েছে',
    enterPromoCode: 'ভাউচার কোড লিখুন (যেমন: KHABAR50)',
    stepAddress: 'ডেলিভারি ঠিকানা',
    stepDeliveryTime: 'ডেলিভারি সময়সূচি',
    stepPayment: 'পেমেন্ট মাধ্যম',
    placeOrder: 'অর্ডার নিশ্চিত করুন',
    cashOnDelivery: 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)',
    bKashPayment: 'বিকাশ অনলাইন পেমেন্ট',
    nagadPayment: 'নগদ ডিজিটাল পেমেন্ট',
    cardPayment: 'ডেবিট / ক্রেডিট কার্ড (ভিসা/মাস্টারকার্ড)',
    orderConfirmed: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
    trackOrder: 'লাইভ অর্ডার ট্র্যাক করুন',
    orderStatusConfirmed: 'অর্ডার গৃহীত হয়েছে',
    orderStatusPreparing: 'রান্নাঘরে খাবার তৈরি হচ্ছে',
    orderStatusPickedUp: 'রাইডার খাবার সংগ্রহ করেছেন',
    orderStatusOnTheWay: 'রাইডার আপনার ঠিকানায় আসছেন',
    orderStatusDelivered: 'খাবার পৌঁছে দেওয়া হয়েছে',
    reserveTable: 'টেবিল বুকিং করুন',
    myReservations: 'আমার টেবিল রিজার্ভেশন',
    favoritesTitle: 'সংরক্ষিত পছন্দের তালিকা',
    myOrders: 'আমার সকল অর্ডার',
    helpCenter: 'সাহায্য ও সাপোর্ট সেন্টার',
    profile: 'প্রোফাইল অ্যাকাউন্ট',
    switchPortal: 'পোর্টাল নির্বাচন',
    customerMode: 'কাস্টমার অ্যাপ',
    adminMode: 'অ্যাডমিন ড্যাশবোর্ড',
    kitchenMode: 'রেস্তোরাঁ পার্টনার',
    riderMode: 'রাইডার ডেলিভারি অ্যাপ',
    bangla: 'বাংলা',
    english: 'English',
  },
};
