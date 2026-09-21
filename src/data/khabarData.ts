export interface LocationItem {
  id: string;
  name: string;
  city: string;
  bengaliName: string;
  deliveryFee: number;
  deliveryTime: string;
  isPopular?: boolean;
}

export const BANGLADESH_LOCATIONS: LocationItem[] = [
  { id: 'mirpur', name: 'Mirpur (All Sections)', city: 'Dhaka', bengaliName: 'মিরপুর', deliveryFee: 50, deliveryTime: '25–35 min', isPopular: true },
  { id: 'dhanmondi', name: 'Dhanmondi', city: 'Dhaka', bengaliName: 'ধানমন্ডি', deliveryFee: 50, deliveryTime: '25–35 min', isPopular: true },
  { id: 'gulshan', name: 'Gulshan (1 & 2)', city: 'Dhaka', bengaliName: 'গুলশান', deliveryFee: 60, deliveryTime: '25–35 min', isPopular: true },
  { id: 'banani', name: 'Banani', city: 'Dhaka', bengaliName: 'বনানী', deliveryFee: 60, deliveryTime: '20–30 min', isPopular: true },
  { id: 'uttara', name: 'Uttara (Sectors 1–14)', city: 'Dhaka', bengaliName: 'উত্তরা', deliveryFee: 60, deliveryTime: '30–40 min', isPopular: true },
  { id: 'mohammadpur', name: 'Mohammadpur', city: 'Dhaka', bengaliName: 'মোহাম্মদপুর', deliveryFee: 50, deliveryTime: '25–35 min', isPopular: true },
  { id: 'bashundhara', name: 'Bashundhara R/A', city: 'Dhaka', bengaliName: 'বসুন্ধরা আ/এ', deliveryFee: 60, deliveryTime: '30–40 min', isPopular: true },
  { id: 'old-dhaka', name: 'Old Dhaka (Nazira Bazar, Lalbagh)', city: 'Dhaka', bengaliName: 'পুরান ঢাকা', deliveryFee: 60, deliveryTime: '30–40 min', isPopular: true },
  { id: 'farmgate', name: 'Farmgate & Tejgaon', city: 'Dhaka', bengaliName: 'ফার্মগেট', deliveryFee: 50, deliveryTime: '25–35 min' },
  { id: 'chattogram', name: 'GEC & Nasirabad', city: 'Chattogram', bengaliName: 'চট্টগ্রাম (জিইসি)', deliveryFee: 60, deliveryTime: '30–40 min' },
  { id: 'sylhet', name: 'Zindabazar & Upashahar', city: 'Sylhet', bengaliName: 'সিলেট (জিন্দাবাজার)', deliveryFee: 60, deliveryTime: '25–35 min' },
];

export interface FoodCategory {
  id: string;
  name: string;
  bengaliName: string;
  icon: string;
  image: string;
  count: number;
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'biryani',
    name: 'Biryani',
    bengaliName: 'বিরিয়ানি',
    icon: '🍛',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    count: 38,
  },
  {
    id: 'burger',
    name: 'Burger',
    bengaliName: 'বার্গার',
    icon: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    count: 26,
  },
  {
    id: 'pizza',
    name: 'Pizza',
    bengaliName: 'পিজ্জা',
    icon: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    count: 21,
  },
  {
    id: 'kacchi',
    name: 'Kacchi',
    bengaliName: 'কাচ্চি',
    icon: '🍖',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    count: 19,
  },
  {
    id: 'chinese',
    name: 'Chinese',
    bengaliName: 'চাইনিজ',
    icon: '🍜',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    count: 27,
  },
  {
    id: 'bangladeshi',
    name: 'Bangladeshi',
    bengaliName: 'দেশি খাবার',
    icon: '🍲',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    count: 34,
  },
  {
    id: 'chicken',
    name: 'Chicken',
    bengaliName: 'চিকেন ফ্রাই ও রোস্ট',
    icon: '🍗',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80',
    count: 42,
  },
  {
    id: 'bbq',
    name: 'BBQ & Kebab',
    bengaliName: 'বারবিকিউ ও কাবাব',
    icon: '🍢',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    count: 18,
  },
  {
    id: 'thai',
    name: 'Thai',
    bengaliName: 'থাই স্যুপ ও রাইস',
    icon: '🥣',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80',
    count: 16,
  },
  {
    id: 'indian',
    name: 'Indian',
    bengaliName: 'ইন্ডিয়ান',
    icon: '🥘',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80',
    count: 14,
  },
  {
    id: 'dessert',
    name: 'Desserts',
    bengaliName: 'মিষ্টি ও ডেজার্ট',
    icon: '🍰',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80',
    count: 22,
  },
  {
    id: 'drinks',
    name: 'Drinks',
    bengaliName: 'বোরহানি ও জুস',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    count: 29,
  },
  {
    id: 'snacks',
    name: 'Snacks & Fuchka',
    bengaliName: 'স্ন্যাক্স ও ফুচকা',
    icon: '🥟',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    count: 20,
  },
  {
    id: 'coffee',
    name: 'Coffee & Cafe',
    bengaliName: 'কফি ও ক্যাফে',
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
    count: 15,
  },
];

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  bengaliName: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVeg?: boolean;
  restaurantId: string;
  restaurantName: string;
  sizes?: { id: string; name: string; extraPrice: number }[];
  sauces?: string[];
  addOns?: AddOnOption[];
  isAvailable?: boolean;
}

export interface RestaurantReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  foodQualityRating?: number;
  deliveryRating?: number;
  packagingRating?: number;
  valueRating?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  bengaliName: string;
  logo: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  distance: string;
  offerText?: string;
  freeDelivery?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isOpen: boolean;
  address: string;
  openingHours: string;
  aboutText: string;
  menuCategories: string[];
  menuItems: MenuItem[];
  reviews: RestaurantReview[];
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'takeout',
    name: 'Takeout',
    bengaliName: 'টেকআউট',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Burgers', 'Fast Food', 'Wings'],
    rating: 4.8,
    reviewsCount: 15200,
    deliveryTime: '25–35 min',
    deliveryFee: 49,
    minimumOrder: 150,
    distance: '1.4 km',
    offerText: '20% OFF',
    isFeatured: true,
    isPopular: true,
    isOpen: true,
    address: 'Navana Tower, Road 11, Banani, Dhaka',
    openingHours: '11:30 AM – 11:30 PM',
    aboutText: 'Dhaka’s premier burger brand pioneering gourmet beef and crispy chicken burgers with signature melted cheese and house sauces.',
    menuCategories: ['Popular', 'Chicken Burgers', 'Beef Burgers', 'Sides & Wings', 'Drinks'],
    reviews: [
      { id: 'tr1', userName: 'Shahriar Kabir', rating: 5, date: '2 days ago', comment: 'Best original burger in town! Patty was smoky and juicy.' },
      { id: 'tr2', userName: 'Nusrat Jahan', rating: 5, date: '1 week ago', comment: 'Crispy chicken fillet is always fresh and hot.' },
    ],
    menuItems: [
      {
        id: 'to-chicken-burger',
        name: 'Crispy Chicken Burger',
        bengaliName: 'ক্রিস্পি চিকেন বার্গার',
        description: 'Crispy chicken fillet, lettuce, melted cheddar cheese, and signature Takeout sauce in toasted brioche bun.',
        price: 265,
        originalPrice: 299,
        category: 'Chicken Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 4200,
        isPopular: true,
        restaurantId: 'takeout',
        restaurantName: 'Takeout',
        sizes: [
          { id: 'reg', name: 'Regular Fillet', extraPrice: 0 },
          { id: 'large', name: 'Double Fillet Feast', extraPrice: 110 },
        ],
        sauces: ['Signature Takeout Sauce', 'BBQ Smokey', 'Hot Garlic Mayo', 'Fiery Naga'],
        addOns: [
          { id: 'cheese', name: 'Extra Cheddar Cheese', price: 30 },
          { id: 'extra-chicken', name: 'Extra Crispy Fillet', price: 80 },
          { id: 'fries', name: 'French Fries Side', price: 60 },
          { id: 'jalapeno', name: 'Spicy Jalapenos', price: 25 },
        ],
      },
      {
        id: 'to-beef-cheese',
        name: 'Classic Beef Cheese Delight',
        bengaliName: 'ক্লাসিক বিফ চিজ ডিলাইট',
        description: 'Prime beef patty grilled over flame, double cheddar cheese slice, caramelized onions, and house burger sauce.',
        price: 310,
        originalPrice: 350,
        category: 'Beef Burgers',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        rating: 4.85,
        isPopular: true,
        restaurantId: 'takeout',
        restaurantName: 'Takeout',
        sizes: [
          { id: 'single', name: 'Single Patty', extraPrice: 0 },
          { id: 'double', name: 'Double Patty', extraPrice: 120 },
        ],
        sauces: ['House Mayo', 'BBQ', 'Spicy Garlic'],
        addOns: [
          { id: 'cheese', name: 'Extra Cheese', price: 30 },
          { id: 'fries', name: 'Fries', price: 60 },
        ],
      },
      {
        id: 'to-wings',
        name: 'Honey Mustard Wings (6 Pcs)',
        bengaliName: 'হানি মাস্টার্ড উইংস',
        description: 'Crispy deep-fried chicken wings glazed in sweet tangy honey mustard dressing.',
        price: 220,
        category: 'Sides & Wings',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        rating: 4.7,
        restaurantId: 'takeout',
        restaurantName: 'Takeout',
      },
    ],
  },
  {
    id: 'kacchi-bhai',
    name: 'Kacchi Bhai',
    bengaliName: 'কাচ্চি ভাই',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Bangladeshi', 'Biryani', 'Kacchi', 'Mughlai'],
    rating: 4.8,
    reviewsCount: 18400,
    deliveryTime: '25–35 min',
    deliveryFee: 0,
    freeDelivery: true,
    minimumOrder: 150,
    distance: '2.1 km',
    offerText: 'Free Delivery',
    isFeatured: true,
    isPopular: true,
    isOpen: true,
    address: 'House 54, Road 11, Dhanmondi, Dhaka',
    openingHours: '11:30 AM – 11:30 PM',
    aboutText: 'Famous for traditional Old Dhaka style Dum Kacchi Biryani made with succulent bone-in mutton, aromatic basmati rice, saffron, and slow-cooked potato.',
    menuCategories: ['Popular', 'Biryani', 'Chicken & Beef', 'Sides & Salads', 'Drinks & Desserts'],
    reviews: [
      { id: 'r1', userName: 'Tahsin Rahman', rating: 5, date: '2 days ago', comment: 'Best Kacchi in Dhanmondi! The mutton was so soft and potato had full flavor.' },
      { id: 'r2', userName: 'Nadia Islam', rating: 5, date: '1 week ago', comment: 'Borhani was ice cold and flavorful, packaging was leakproof.' },
    ],
    menuItems: [
      {
        id: 'kb-kacchi-regular',
        name: 'Bashmati Mutton Kacchi (Regular)',
        bengaliName: 'বাসমতী মাটন কাচ্চি (১:১)',
        description: 'Tender bone-in marinated mutton, long-grain basmati rice cooked in slow dum, desi potato, and beresta.',
        price: 330,
        originalPrice: 360,
        category: 'Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 9400,
        isPopular: true,
        restaurantId: 'kacchi-bhai',
        restaurantName: 'Kacchi Bhai',
        sizes: [
          { id: 'reg', name: 'Regular (1:1 with 2 Mutton Pcs)', extraPrice: 0 },
          { id: 'special', name: 'Special (1:1 with 3 Mutton Pcs + Kebab)', extraPrice: 120 },
        ],
        addOns: [
          { id: 'extra-potato', name: 'Extra Dum Aloor Dum', price: 30 },
          { id: 'extra-mutton', name: 'Extra Tender Mutton Piece', price: 140 },
          { id: 'borhani-cup', name: 'Clay Cup Borhani (250ml)', price: 60 },
          { id: 'boiled-egg', name: 'Fried Boiled Egg', price: 25 },
        ],
      },
      {
        id: 'kb-beef-tehari',
        name: 'Old Dhaka Mustard Beef Tehari',
        bengaliName: 'সরিষার তেলে পুরান ঢাকার বিফ তেহারী',
        description: 'Aromatic Chinigura rice cooked in pure cold-pressed mustard oil with tender diced beef chunks and green chilies.',
        price: 240,
        category: 'Biryani',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
        rating: 4.75,
        isPopular: true,
        restaurantId: 'kacchi-bhai',
        restaurantName: 'Kacchi Bhai',
        addOns: [
          { id: 'extra-egg', name: 'Boiled Egg', price: 25 },
          { id: 'tehari-beef', name: 'Extra Beef Chunks', price: 90 },
        ],
      },
      {
        id: 'kb-borhani',
        name: 'Nawab Special Borhani (250ml)',
        bengaliName: 'নবাব স্পেশাল বোরহানি',
        description: 'Traditional spiced yogurt digestive drink blended with fresh mint, coriander, roasted cumin, and black salt.',
        price: 60,
        category: 'Drinks & Desserts',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        restaurantId: 'kacchi-bhai',
        restaurantName: 'Kacchi Bhai',
      },
    ],
  },
  {
    id: 'sultans-dine',
    name: "Sultan's Dine",
    bengaliName: 'সুলতানস ডাইন',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Bangladeshi', 'Kacchi', 'Shahi Feast'],
    rating: 4.9,
    reviewsCount: 22100,
    deliveryTime: '30–40 min',
    deliveryFee: 60,
    minimumOrder: 250,
    distance: '3.2 km',
    offerText: '৳100 OFF',
    isFeatured: true,
    isPopular: true,
    isOpen: true,
    address: 'Green Akshay Plaza, Satmasjid Road, Dhanmondi, Dhaka',
    openingHours: '12:00 PM – 11:00 PM',
    aboutText: "The undisputed royal feast destination of Bangladesh. Famous for rich, melt-in-the-mouth mutton pieces and fragrant golden basmati.",
    menuCategories: ['Popular', 'Kacchi Platters', 'Curries', 'Sides', 'Desserts'],
    reviews: [
      { id: 'sr1', userName: 'Farhan Zaheed', rating: 5, date: 'Yesterday', comment: 'Always consistent. The mutton melts right off the bone!' },
    ],
    menuItems: [
      {
        id: 'sd-kacchi-special',
        name: 'Sultan Kacchi Platter with Roast',
        bengaliName: 'সুলতান কাচ্চি ও রোস্ট স্পেশাল প্ল্যাটার',
        description: 'Basmati mutton kacchi, tender chicken roast, aloo bukhara chutney, jali kebab, boiled egg, and Borhani cup.',
        price: 490,
        originalPrice: 550,
        category: 'Kacchi Platters',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        rating: 4.95,
        reviewsCount: 7800,
        isPopular: true,
        restaurantId: 'sultans-dine',
        restaurantName: "Sultan's Dine",
        addOns: [
          { id: 'sd-mutton', name: 'Extra Mutton (1 Pc)', price: 150 },
          { id: 'sd-potato', name: 'Extra Braised Potato', price: 30 },
          { id: 'sd-borhani', name: 'Borhani 500ml', price: 110 },
        ],
      },
      {
        id: 'sd-morog-polao',
        name: 'Traditional Shahi Morog Polao',
        bengaliName: 'ঐতিহ্যবাহী শাহী মোরগ পোলাও',
        description: 'Chinigura rice cooked in rich chicken stock and ghee, served with succulent golden fried chicken and boiled egg.',
        price: 340,
        category: 'Kacchi Platters',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
        rating: 4.85,
        isPopular: true,
        restaurantId: 'sultans-dine',
        restaurantName: "Sultan's Dine",
      },
    ],
  },
  {
    id: 'chillox',
    name: 'Chillox',
    bengaliName: 'চিলক্স',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Burgers', 'Naga Burgers', 'Fast Food'],
    rating: 4.7,
    reviewsCount: 16500,
    deliveryTime: '20–30 min',
    deliveryFee: 49,
    minimumOrder: 150,
    distance: '1.8 km',
    offerText: 'Buy 1 Get 1',
    isFeatured: true,
    isPopular: true,
    isOpen: true,
    address: 'Plot 12, Block D, Mirpur 2, Dhaka',
    openingHours: '12:00 PM – 11:30 PM',
    aboutText: 'Famous for extreme Naga spice burgers, double chicken cheese bursts, loaded french fries, and youth burger vibes.',
    menuCategories: ['Popular', 'Naga Series', 'Beef Burgers', 'Sides', 'Milkshakes'],
    reviews: [
      { id: 'ch1', userName: 'Abrar Fahim', rating: 5, date: '3 days ago', comment: 'Level 3 Naga burger is fire! Only for true spicy lovers.' },
    ],
    menuItems: [
      {
        id: 'cx-naga-burger',
        name: 'Smokey Naga Chicken Burger',
        bengaliName: 'স্মোকি নাগা চিকেন বার্গার',
        description: 'Crispy marinated chicken breast coated in fresh Sylhet naga chili glaze, lettuce, and cheese sauce.',
        price: 240,
        originalPrice: 280,
        category: 'Naga Series',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviewsCount: 3900,
        isPopular: true,
        isSpicy: true,
        restaurantId: 'chillox',
        restaurantName: 'Chillox',
        sizes: [
          { id: 'single', name: 'Single Patty', extraPrice: 0 },
          { id: 'double', name: 'Double Patty', extraPrice: 90 },
        ],
        addOns: [
          { id: 'cx-cheese', name: 'Extra Cheddar', price: 30 },
          { id: 'cx-fries', name: 'Peri Peri Fries', price: 70 },
        ],
      },
    ],
  },
  {
    id: 'pizza-burg',
    name: 'Pizza Burg',
    bengaliName: 'পিজ্জা বার্গ',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Pizza', 'Italian', 'Pasta', 'Fast Food'],
    rating: 4.8,
    reviewsCount: 14200,
    deliveryTime: '25–35 min',
    deliveryFee: 50,
    minimumOrder: 200,
    distance: '2.5 km',
    offerText: '20% OFF',
    isFeatured: true,
    isPopular: true,
    isOpen: true,
    address: 'Sector 3, Uttara & Mirpur 1, Dhaka',
    openingHours: '12:00 PM – 11:00 PM',
    aboutText: 'The most popular homegrown pizza chain in Bangladesh offering thick-crust cheesy pizzas loaded with seasoned meats at student-friendly prices.',
    menuCategories: ['Popular', 'Pizzas (Regular & Large)', 'Appetizers', 'Drinks'],
    reviews: [
      { id: 'pb1', userName: 'Sumaiya Akter', rating: 5, date: '1 day ago', comment: 'BBQ Temptation pizza is loaded with cheese and chicken. Best value in town!' },
    ],
    menuItems: [
      {
        id: 'pb-bbq-temptation',
        name: 'BBQ Temptation Pizza (10 inch)',
        bengaliName: 'বারবিকিউ টেম্পটেশন পিজ্জা',
        description: 'Shredded BBQ chicken, spicy beef sausage, mushrooms, black olives, onions, and double mozzarella.',
        price: 380,
        originalPrice: 420,
        category: 'Pizzas (Regular & Large)',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 5200,
        isPopular: true,
        restaurantId: 'pizza-burg',
        restaurantName: 'Pizza Burg',
        sizes: [
          { id: '10inch', name: '10 inch (Regular)', extraPrice: 0 },
          { id: '12inch', name: '12 inch (Large)', extraPrice: 190 },
        ],
        addOns: [
          { id: 'pb-extra-cheese', name: 'Extra Mozzarella Layer', price: 70 },
          { id: 'pb-dip', name: 'Garlic Mayo Dip', price: 30 },
        ],
      },
    ],
  },
  {
    id: 'rahman-biryani',
    name: 'Biryani House (Rahman Biryani)',
    bengaliName: 'রহমান বিরিয়ানি হাউস',
    logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Biryani', 'Bangladeshi', 'Budget Friendly'],
    rating: 4.8,
    reviewsCount: 9200,
    deliveryTime: '20–30 min',
    deliveryFee: 40,
    minimumOrder: 120,
    distance: '1.1 km',
    offerText: 'Special Price ৳180',
    isPopular: true,
    isOpen: true,
    address: 'Near City College, Dhanmondi, Dhaka',
    openingHours: '11:00 AM – 10:30 PM',
    aboutText: 'Famous budget-friendly traditional chicken biryani with huge portions, juicy chicken leg, and sweet aloo.',
    menuCategories: ['Popular', 'Chicken Biryani', 'Khichuri', 'Beverages'],
    reviews: [
      { id: 'rb1', userName: 'Miraz Hossain', rating: 5, date: '3 days ago', comment: 'Only ৳180 for Chicken Biryani and it tastes incredible. Order every week!' },
    ],
    menuItems: [
      {
        id: 'rb-chicken-biryani',
        name: 'Special Chicken Biryani',
        bengaliName: 'স্পেশাল চিকেন বিরিয়ানি',
        description: 'Authentic Chinigura rice biryani served with a tender braised chicken leg piece, sweet aloo, and boiled egg.',
        price: 180,
        originalPrice: 200,
        category: 'Chicken Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        rating: 4.85,
        reviewsCount: 3800,
        isPopular: true,
        restaurantId: 'rahman-biryani',
        restaurantName: 'Biryani House (Rahman Biryani)',
        addOns: [
          { id: 'egg', name: 'Extra Egg', price: 20 },
          { id: 'borhani', name: 'Borhani Cup', price: 40 },
        ],
      },
    ],
  },
  {
    id: 'tehari-ghar',
    name: 'Tehari Ghar',
    bengaliName: 'তেহারী ঘর',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Bangladeshi', 'Tehari', 'Mustard Oil Beef'],
    rating: 4.7,
    reviewsCount: 8400,
    deliveryTime: '20–30 min',
    deliveryFee: 45,
    minimumOrder: 150,
    distance: '1.9 km',
    offerText: '15% OFF',
    isPopular: true,
    isOpen: true,
    address: 'Chankharpool & Mirpur 10, Dhaka',
    openingHours: '11:00 AM – 11:00 PM',
    aboutText: 'Authentic mustard oil beef tehari slow cooked with fresh green chilies, baby potatoes, and tender meat chunks.',
    menuCategories: ['Popular', 'Beef Tehari', 'Sides', 'Drinks'],
    reviews: [
      { id: 'tg1', userName: 'Kazi Shakil', rating: 5, date: 'Yesterday', comment: 'Proper mustard oil punch! Loved the green chilies.' },
    ],
    menuItems: [
      {
        id: 'tg-mustard-tehari',
        name: 'Shorshe Beef Tehari (Half/Full)',
        bengaliName: 'সরিষার তেলে খাঁটি বিফ তেহারী',
        description: 'Piping hot Chinigura rice cooked in aromatic cold-pressed mustard oil with baby beef cubes and spicy green chili.',
        price: 220,
        category: 'Beef Tehari',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviewsCount: 2900,
        isPopular: true,
        restaurantId: 'tehari-ghar',
        restaurantName: 'Tehari Ghar',
      },
    ],
  },
  {
    id: 'star-kabab',
    name: 'Star Kabab & Restaurant',
    bengaliName: 'স্টার কাবাব',
    logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Kabab', 'BBQ', 'Naan', 'Bangladeshi'],
    rating: 4.7,
    reviewsCount: 24300,
    deliveryTime: '20–30 min',
    deliveryFee: 50,
    minimumOrder: 150,
    distance: '2.0 km',
    offerText: '15% OFF Combos',
    isPopular: true,
    isOpen: true,
    address: 'Road 2, Dhanmondi, Dhaka',
    openingHours: '6:30 AM – 11:30 PM',
    aboutText: 'Dhaka’s heritage culinary landmark famous since 1970 for mouth-watering Seekh Kababs, Boti, Mutton Leg Roast, and fluffy Butter Naan.',
    menuCategories: ['Popular', 'Kababs & Grills', 'Naan & Roti', 'Mains', 'Dessert & Falooda'],
    reviews: [
      { id: 'st1', userName: 'Zubair Hossain', rating: 5, date: '3 days ago', comment: 'Star Kabab beef sheekh with butter naan is an unmatched Dhaka emotion!' },
    ],
    menuItems: [
      {
        id: 'sk-beef-sheekh',
        name: 'Charcoal Beef Sheekh Kabab',
        bengaliName: 'বিফ শিক কাবাব',
        description: 'Minced lean beef blended with ginger, garlic, raw papaya, and Star signature garam masala, grilled over red-hot charcoal.',
        price: 130,
        category: 'Kababs & Grills',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 6100,
        isPopular: true,
        restaurantId: 'star-kabab',
        restaurantName: 'Star Kabab & Restaurant',
        addOns: [
          { id: 'naan-butter', name: 'Hot Butter Naan', price: 40 },
          { id: 'mint-chutney', name: 'Mint & Tamarind Chutney', price: 15 },
        ],
      },
      {
        id: 'sk-falooda',
        name: 'Star Special Royal Falooda',
        bengaliName: 'স্টার স্পেশাল রয়েল ফালুদা',
        description: 'Chilled vermicelli, sabja seeds, rose syrup, fresh fruits, and double scoops of rich ice cream.',
        price: 160,
        category: 'Dessert & Falooda',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
        rating: 4.85,
        isPopular: true,
        restaurantId: 'star-kabab',
        restaurantName: 'Star Kabab & Restaurant',
      },
    ],
  },
  {
    id: 'mezban-bari',
    name: 'Mezban Bari',
    bengaliName: 'মেজবান বাড়ি',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Bangladeshi', 'Chittagong Mezbeni', 'Beef Kala Bhuna'],
    rating: 4.8,
    reviewsCount: 11400,
    deliveryTime: '30–40 min',
    deliveryFee: 60,
    minimumOrder: 200,
    distance: '3.4 km',
    offerText: '10% OFF Thali',
    isPopular: true,
    isOpen: true,
    address: 'Plot 38, Road 27, Dhanmondi, Dhaka',
    openingHours: '12:00 PM – 11:00 PM',
    aboutText: 'Authentic taste of Chittagong traditional Mezban feast. Prepared with hot mustard oil, crushed red chilies, white sesame, and fragrant spices.',
    menuCategories: ['Popular', 'Mezban Specials', 'Daal & Nola', 'Rice & Bread', 'Drinks'],
    reviews: [
      { id: 'mb1', userName: 'Tanvir Hossain', rating: 5, date: '4 days ago', comment: 'Authentic Chittagong flavor! Spicy, aromatic, and perfectly tender.' },
    ],
    menuItems: [
      {
        id: 'mb-kala-bhuna',
        name: 'Traditional Beef Kala Bhuna',
        bengaliName: 'ঐতিহ্যবাহী গরুর কালা ভুনা',
        description: 'Deep caramelized black-roasted beef slow-simmered until tender and coated in thick, intensely flavorful dry masala.',
        price: 360,
        originalPrice: 400,
        category: 'Mezban Specials',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        rating: 4.95,
        reviewsCount: 4500,
        isPopular: true,
        restaurantId: 'mezban-bari',
        restaurantName: 'Mezban Bari',
        addOns: [
          { id: 'mb-polao', name: 'Fragrant White Polao', price: 110 },
          { id: 'mb-onion', name: 'Extra Beresta', price: 25 },
        ],
      },
    ],
  },
  {
    id: 'sweet-dreams',
    name: 'Sweet Dreams Mishti & Bakery',
    bengaliName: 'সুইট ড্রিমস মিষ্টি ও বেকারি',
    logo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Desserts', 'Bangladeshi', 'Sweets', 'Bakery'],
    rating: 4.8,
    reviewsCount: 7800,
    deliveryTime: '20–30 min',
    deliveryFee: 40,
    minimumOrder: 100,
    distance: '1.2 km',
    offerText: 'Fresh Daily',
    isPopular: true,
    isOpen: true,
    address: 'Central Road, Dhanmondi & Banani, Dhaka',
    openingHours: '8:00 AM – 10:30 PM',
    aboutText: 'Authentic Bangladeshi sweets made from pure cow milk chhana, ghee, and cardamom.',
    menuCategories: ['Popular', 'Traditional Mishti', 'Yogurt & Doi', 'Snacks'],
    reviews: [
      { id: 'sw1', userName: 'Anika Tabassum', rating: 5, date: '1 week ago', comment: 'Best Rasmalai and Bogura Doi in the area.' },
    ],
    menuItems: [
      {
        id: 'sw-rasmalai',
        name: 'Shahi Malai Rasmalai (4 Pcs)',
        bengaliName: 'শাহী মালাই রসমালাই',
        description: 'Soft cottage cheese dumplings soaked in chilled thickened cardamom saffron milk cream.',
        price: 240,
        category: 'Traditional Mishti',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 2400,
        isPopular: true,
        restaurantId: 'sweet-dreams',
        restaurantName: 'Sweet Dreams Mishti & Bakery',
      },
    ],
  },
];

export interface DealItem {
  id: string;
  badge: string;
  title: string;
  restaurantId: string;
  restaurantName: string;
  minOrder: number;
  validity: string;
  code: string;
  image: string;
  ctaText: string;
}

export const BEST_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    badge: '20% OFF',
    title: '20% OFF on Gourmet Burgers',
    restaurantId: 'takeout',
    restaurantName: 'Takeout',
    minOrder: 300,
    validity: 'Valid Today',
    code: 'TAKEOUT20',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    ctaText: 'Claim Deal',
  },
  {
    id: 'deal-2',
    badge: 'FREE DELIVERY',
    title: 'Free Delivery on Kacchi Feasts',
    restaurantId: 'kacchi-bhai',
    restaurantName: 'Kacchi Bhai',
    minOrder: 400,
    validity: 'Weekend Special',
    code: 'FREESHIP',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    ctaText: 'Order Free Ship',
  },
  {
    id: 'deal-3',
    badge: 'BUY 1 GET 1',
    title: 'Buy 1 Get 1 Naga Burgers',
    restaurantId: 'chillox',
    restaurantName: 'Chillox',
    minOrder: 350,
    validity: 'Limited Quantity',
    code: 'CHILLOXBOGO',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    ctaText: 'Claim BOGO',
  },
  {
    id: 'deal-4',
    badge: '৳100 OFF',
    title: 'Flat ৳100 OFF Shahi Feasts',
    restaurantId: 'sultans-dine',
    restaurantName: "Sultan's Dine",
    minOrder: 600,
    validity: 'Valid this Week',
    code: 'SULTAN100',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    ctaText: 'Claim ৳100',
  },
];

export interface PromoCoupon {
  code: string;
  discountType: 'PERCENT' | 'FLAT' | 'FREE_DELIVERY';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  badge: string;
  validUntil: string;
  status: 'AVAILABLE' | 'USED' | 'EXPIRED';
}

export const PROMO_COUPONS: PromoCoupon[] = [
  {
    code: 'KHABAR50',
    discountType: 'FLAT',
    discountValue: 50,
    minOrder: 300,
    description: 'Get ৳50 OFF on orders above ৳300 across all kitchens',
    badge: '৳50 OFF',
    validUntil: '31 Dec 2026',
    status: 'AVAILABLE',
  },
  {
    code: 'FIRSTORDER',
    discountType: 'PERCENT',
    discountValue: 20,
    minOrder: 250,
    maxDiscount: 150,
    description: 'Special 20% discount (up to ৳150) for your first delicious order',
    badge: '20% OFF',
    validUntil: 'Valid for New Users',
    status: 'AVAILABLE',
  },
  {
    code: 'FREESHIP',
    discountType: 'FREE_DELIVERY',
    discountValue: 0,
    minOrder: 400,
    description: '100% Free doorstep delivery on orders above ৳400',
    badge: 'FREE DELIVERY',
    validUntil: 'Today Only',
    status: 'AVAILABLE',
  },
  {
    code: 'BIRYANI100',
    discountType: 'FLAT',
    discountValue: 100,
    minOrder: 600,
    description: 'Save ৳100 on Kacchi Biryani & traditional feasts above ৳600',
    badge: '৳100 OFF',
    validUntil: 'Weekend Special',
    status: 'AVAILABLE',
  },
  {
    code: 'EIDSPECIAL',
    discountType: 'PERCENT',
    discountValue: 25,
    minOrder: 500,
    maxDiscount: 200,
    description: 'Eid Celebration feast coupon',
    badge: '25% OFF',
    validUntil: 'Used on 15 Aug 2026',
    status: 'USED',
  },
  {
    code: 'WELCOME30',
    discountType: 'FLAT',
    discountValue: 30,
    minOrder: 200,
    description: 'Early bird registration coupon',
    badge: '৳30 OFF',
    validUntil: 'Expired 01 Sep 2026',
    status: 'EXPIRED',
  },
];

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  image: string;
  ctaText: string;
  categoryFilter?: string;
  restaurantId?: string;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'b1',
    title: "20% OFF on your first order",
    subtitle: "Welcome to KHABAR! Enjoy up to ৳150 discount with fast doorstep delivery across Dhaka.",
    discountBadge: "20% OFF FIRST ORDER",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80",
    ctaText: "Explore Biryani",
    categoryFilter: "biryani",
    restaurantId: "kacchi-bhai",
  },
  {
    id: 'b2',
    title: "Free Delivery Weekend",
    subtitle: "Zero delivery fee on all popular burger lounges and Italian pizzerias.",
    discountBadge: "FREE DELIVERY",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    ctaText: "Order Burgers",
    categoryFilter: "burger",
    restaurantId: "takeout",
  },
  {
    id: 'b3',
    title: "Craving Authentic Biryani?",
    subtitle: "Steaming hot Shahi Mutton Dum Kacchi delivered straight from degh to your door in 30 mins.",
    discountBadge: "ROYAL FEAST",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
    ctaText: "View Sultan's Dine",
    categoryFilter: "kacchi",
    restaurantId: "sultans-dine",
  },
  {
    id: 'b4',
    title: "Late Night Cravings Covered",
    subtitle: "Hot crispy wings, loaded fries, and smoky beef burgers available till 2:00 AM.",
    discountBadge: "OPEN LATE",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=80",
    ctaText: "Late Night Deals",
    categoryFilter: "burger",
    restaurantId: "chillox",
  },
];

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Office' | 'Other';
  name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  instructions?: string;
  isDefault?: boolean;
}

export const DEMO_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    type: 'Home',
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    address: 'House 42, Flat 5B, Road 11',
    area: 'Dhanmondi',
    city: 'Dhaka',
    instructions: 'Ring the bell twice, lift is on the right.',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'Office',
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    address: 'Simpletree Anarkali, Level 7, Plot 3',
    area: 'Gulshan (1 & 2)',
    city: 'Dhaka',
    instructions: 'Leave at reception desk with security.',
    isDefault: false,
  },
  {
    id: 'addr-3',
    type: 'Other',
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    address: 'Avenue 4, Road 12, Mirpur DOHS',
    area: 'Mirpur (All Sections)',
    city: 'Dhaka',
    instructions: 'Call upon arrival at the gate.',
    isDefault: false,
  },
];

export interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export const FAQS: FAQItem[] = [
  {
    category: 'Order issue',
    q: 'How can I track my food order in real-time?',
    a: 'Once your order is placed, go to the Live Order Tracking screen where you can view live stage progression (Confirmed → Preparing → Picked Up → On the Way → Delivered) and track the rider’s bike on the animated map.',
  },
  {
    category: 'Payment issue',
    q: 'What payment methods does KHABAR support in Bangladesh?',
    a: 'We support Cash on Delivery (COD), bKash direct digital payment, Nagad mobile banking, and Visa/Mastercard credit/debit cards.',
  },
  {
    category: 'Refund',
    q: 'What is KHABAR’s refund policy for missing or damaged items?',
    a: 'If any item is missing or damaged, tap "Report a Problem" on your order card or open a Help Center ticket. Our customer support team will instantly credit your wallet or reverse the bKash payment within 15 minutes.',
  },
  {
    category: 'Late delivery',
    q: 'What happens if my delivery is delayed?',
    a: 'We guarantee timely delivery. If weather or traffic causes severe delay, you automatically receive a ৳50 apology voucher on your next order.',
  },
];
