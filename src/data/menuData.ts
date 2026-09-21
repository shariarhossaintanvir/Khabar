export interface AddOn {
  id: string;
  name: string;
  price: number; // in BDT (৳)
}

export interface IngredientHotspot {
  title: string;
  description: string;
  position: [number, number, number];
}

export interface MenuItem {
  id: string;
  name: string;
  banglaName: string;
  subtitle: string;
  category: 'BIRYANI' | 'MAIN COURSE' | 'SIDES' | 'DRINKS' | 'DESSERT';
  price: number; // in BDT (৳)
  rating: number;
  reviewsCount: number;
  calories: number;
  prepTime: string;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy' | 'Naga';
  isVegetarian?: boolean;
  isPopular?: boolean;
  description: string;
  culturalStory: string;
  visualType: 'kacchi' | 'kalabhuna' | 'ilish' | 'borhani' | 'firni' | 'generic';
  image: string;
  addOns: AddOn[];
  hotspots: IngredientHotspot[];
}

export const CATEGORIES = [
  'ALL',
  'BIRYANI',
  'MAIN COURSE',
  'SIDES',
  'DRINKS',
  'DESSERT',
] as const;

export type CategoryType = typeof CATEGORIES[number];

export interface DeliveryZone {
  id: string;
  name: string;
  bengaliName?: string;
  fee: number; // in BDT (৳)
  estimatedMin: string;
}

export const DHAKA_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'gulshan', name: 'Gulshan 1 & 2', bengaliName: 'গুলশান', fee: 60, estimatedMin: '25–35 min' },
  { id: 'banani', name: 'Banani & Baridhara', bengaliName: 'বনানী ও বারিধারা', fee: 60, estimatedMin: '25–35 min' },
  { id: 'mohakhali', name: 'Mohakhali & DOHS', bengaliName: 'মহাখালী ও ডিওএইচএস', fee: 60, estimatedMin: '30–40 min' },
  { id: 'dhanmondi', name: 'Dhanmondi & Lalmatia', bengaliName: 'ধানমন্ডি ও লালমাটিয়া', fee: 80, estimatedMin: '35–45 min' },
  { id: 'bashundhara', name: 'Bashundhara R/A', bengaliName: 'বসুন্ধরা আ/এ', fee: 80, estimatedMin: '35–45 min' },
  { id: 'uttara', name: 'Uttara (Sectors 1–14)', bengaliName: 'উত্তরা', fee: 90, estimatedMin: '40–50 min' },
  { id: 'mirpur', name: 'Mirpur (All Sections)', bengaliName: 'মিরপুর', fee: 90, estimatedMin: '40–50 min' },
  { id: 'mohammadpur', name: 'Mohammadpur & Adabor', bengaliName: 'মোহাম্মদপুর ও আদাবর', fee: 80, estimatedMin: '35–45 min' },
  { id: 'old-dhaka', name: 'Old Dhaka (Nazira Bazar, Lalbagh)', bengaliName: 'পুরান ঢাকা', fee: 100, estimatedMin: '45–60 min' },
  { id: 'badda', name: 'Badda & Rampura', bengaliName: 'বাড্ডা ও রামপুরা', fee: 70, estimatedMin: '30–40 min' },
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. BIRYANI
  {
    id: 'kacchi-biryani',
    name: 'Shahi Kacchi Biryani',
    banglaName: 'শাহী কাচ্চি বিরিয়ানি',
    subtitle: 'Slow-Cooked Mutton, Aged Basmati & Desi Potato',
    category: 'BIRYANI',
    price: 380,
    rating: 4.98,
    reviewsCount: 1420,
    calories: 780,
    prepTime: '25–30 min',
    spiceLevel: 'Medium',
    isPopular: true,
    description: 'Raw tender mutton marinated overnight in cultured yogurt, mace, nutmeg, and shahi garam masala, layered with aromatic aged basmati rice and saffron-infused golden potato, dum-cooked sealed with dough in a heavy copper degh.',
    culturalStory: 'Rooted in the royal Nawabi kitchens of Old Dhaka, perfected over generations using slow wood-fire dum.',
    visualType: 'kacchi',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-mutton', name: 'Extra Slow-Cooked Mutton Piece (150g)', price: 140 },
      { id: 'extra-potato', name: 'Extra Saffron Desi Potato (Aloor Dum)', price: 30 },
      { id: 'extra-borhani', name: 'Traditional Clay Cup Borhani (250ml)', price: 60 },
      { id: 'extra-jali-kebab', name: 'Mutton Jali Kebab (1 pc)', price: 50 },
      { id: 'extra-salad', name: 'Green Chili & Lemon Onion Salad', price: 30 },
    ],
    hotspots: [
      { title: 'Aged Basmati Rice', description: 'Two-year matured Himalayan long-grain basmati infused with pure saffron strands and ghee.', position: [0, 0.45, 0.3] },
      { title: 'Slow-Cooked Mutton', description: 'Tender bone-in grass-fed mutton marinated in raw papaya and rich shahi aromatic spices.', position: [0, 0.2, 0.2] },
      { title: 'Saffron Desi Potato', description: 'Bengali aloo slow-braised until it absorbs the deep mutton stock and roasted cumin marrow.', position: [-0.35, 0.25, 0.25] },
      { title: 'Crispy Beresta', description: 'Golden fried thinly sliced onions sprinkled with rose water and whole green cardamom.', position: [0.35, 0.5, 0.15] },
    ],
  },
  {
    id: 'morog-polao',
    name: 'Dhaka Shahi Morog Polao',
    banglaName: 'মোরগ পোলাও',
    subtitle: 'Chinigura Rice with Quarter Spring Chicken & Beresta',
    category: 'BIRYANI',
    price: 340,
    rating: 4.92,
    reviewsCount: 680,
    calories: 720,
    prepTime: '20–25 min',
    spiceLevel: 'Mild',
    isPopular: true,
    description: 'Fragrant aromatic Chinigura rice simmered in rich chicken stock and homemade cow ghee, served with a velvety braised quarter chicken, golden raisins, and roasted cashews.',
    culturalStory: 'A celebrated centerpiece of traditional Bengali wedding feasts and joyous festive family reunions.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-chicken', name: 'Extra Quarter Braised Chicken', price: 120 },
      { id: 'extra-borhani', name: 'Clay Cup Borhani (250ml)', price: 60 },
      { id: 'shahi-egg', name: 'Boiled Egg Roast', price: 35 },
    ],
    hotspots: [
      { title: 'Chinigura Fragrant Rice', description: 'Small grain fragrant rice known for its delicate floral aroma.', position: [0, 0.3, 0] },
      { title: 'Spiced Chicken Leg', description: 'Braised in white poppy seed paste, mace, and golden onion gravy.', position: [0, 0.5, 0.1] },
    ],
  },
  {
    id: 'beef-tehari',
    name: 'Old Dhaka Beef Tehari',
    banglaName: 'পুরান ঢাকার বিফ তেহারি',
    subtitle: 'Mustard Oil Cooked Small-Bite Beef & Green Chilies',
    category: 'BIRYANI',
    price: 310,
    rating: 4.95,
    reviewsCount: 890,
    calories: 740,
    prepTime: '20–25 min',
    spiceLevel: 'Spicy',
    isPopular: true,
    description: 'Small tender boneless beef cubes pan-seared in pungent cold-pressed mustard oil, loaded with whole green chilies and tossed with fragrant rice.',
    culturalStory: 'The legendary midnight comfort food born in the bustling winding alleys of Chawkbazar and Nazira Bazar.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-beef', name: 'Extra Tehari Beef Cubes (100g)', price: 110 },
      { id: 'extra-borhani', name: 'Clay Cup Borhani (250ml)', price: 60 },
      { id: 'extra-chili', name: 'Pickled Green Chilies (Pair)', price: 15 },
    ],
    hotspots: [
      { title: 'Cold-Pressed Mustard Oil', description: 'Gives Old Dhaka tehari its iconic peppery aroma and golden sheen.', position: [0, 0.2, 0] },
      { title: 'Tender Beef Cubes', description: 'Bite-sized marbled beef cuts cooked until melt-in-the-mouth soft.', position: [0, 0.4, 0] },
    ],
  },
  {
    id: 'chicken-biryani',
    name: 'Dum Chicken Biryani',
    banglaName: 'চিকেন দম বিরিয়ানি',
    subtitle: 'Aromatic Spices, Basmati & Boiled Egg',
    category: 'BIRYANI',
    price: 290,
    rating: 4.88,
    reviewsCount: 450,
    calories: 680,
    prepTime: '20 min',
    spiceLevel: 'Medium',
    description: 'Succulent chicken thighs dum-cooked with long basmati rice, layered with roasted cumin, brown onion, and whole spiced egg.',
    culturalStory: 'Light and satisfying, prepared fresh daily for Dhaka lunch and dinner patrons.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-chicken-pc', name: 'Extra Chicken Piece', price: 90 },
      { id: 'extra-borhani', name: 'Clay Cup Borhani', price: 60 },
    ],
    hotspots: [
      { title: 'Dum Steam Infusion', description: 'Traps all aromatic spices inside the vessel.', position: [0, 0.3, 0] },
    ],
  },

  // 2. MAIN COURSE
  {
    id: 'beef-kala-bhuna',
    name: 'Chittagong Beef Kala Bhuna',
    banglaName: 'চট্টগ্রামের ঐতিহ্যবাহী গরুর কালা ভুনা',
    subtitle: 'Slow Dark Caramelized Prime Beef with Radhuni & Cloves',
    category: 'MAIN COURSE',
    price: 420,
    rating: 4.99,
    reviewsCount: 1650,
    calories: 640,
    prepTime: '25 min',
    spiceLevel: 'Spicy',
    isPopular: true,
    description: 'The crowning jewel of Mezban culinary art. Prime beef chunks slow-roasted over several hours in heavy iron karahi with fried whole spices, dark caramelized onion paste, roasted garlic cloves, and indigenous radhuni wild celery seed until deeply browned and packed with concentrated flavor.',
    culturalStory: 'Originating from the grand Mezban traditions of Chittagong, celebrated across the entire Bengal delta.',
    visualType: 'kalabhuna',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'plain-rice', name: 'Steamed Chinigura Plain Rice', price: 60 },
      { id: 'paratha', name: 'Flaky Tawa Paratha (2 pcs)', price: 50 },
      { id: 'dal', name: 'Slow-Cooked Cholar Dal', price: 80 },
    ],
    hotspots: [
      { title: 'Dark Maillard Crust', description: 'Not burnt, but deeply caramelized through gentle reduction over 4 hours.', position: [0, 0.3, 0] },
      { title: 'Wild Radhuni Seed', description: 'Indigenous Bengali spice providing a fragrant earthy citrus punch.', position: [0.2, 0.4, 0] },
    ],
  },
  {
    id: 'mutton-rezala',
    name: 'Shahi Mutton Rezala',
    banglaName: 'শাহী মাটন রেজালা',
    subtitle: 'Yogurt, Poppy Seed Gravy & Dried Red Chili',
    category: 'MAIN COURSE',
    price: 440,
    rating: 4.94,
    reviewsCount: 710,
    calories: 610,
    prepTime: '25 min',
    spiceLevel: 'Medium',
    description: 'Tender mutton chops cooked in a luxurious pale gravy of strained curd, cashew-poppy seed paste, fragrant kewra water, and whole dried button red chilies.',
    culturalStory: 'A regal Awadhi-Bengali masterpiece brought to Dhaka by Mughal culinary masters.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'paratha', name: 'Flaky Tawa Paratha (2 pcs)', price: 50 },
      { id: 'polao', name: 'Ghee Rice Polao', price: 90 },
    ],
    hotspots: [
      { title: 'White Poppy Gravy', description: 'Velvety smooth, mild and rich with subtle floral kewra notes.', position: [0, 0.3, 0] },
    ],
  },
  {
    id: 'shorshe-ilish',
    name: 'Padma Shorshe Ilish',
    banglaName: 'পদ্মার সর্ষে ইলিশ',
    subtitle: 'Wild River Hilsa in Fresh Yellow Mustard Gravy',
    category: 'MAIN COURSE',
    price: 580,
    rating: 4.97,
    reviewsCount: 1120,
    calories: 520,
    prepTime: '20 min',
    spiceLevel: 'Spicy',
    isPopular: true,
    description: 'Fresh wild Hilsa fish steak from the Padma River, gently poached in a pungent freshly ground yellow and black mustard paste, turmeric, raw mustard oil, and slit fresh green chilies.',
    culturalStory: 'The undisputed national pride of Bangladesh. Revered by fish connoisseurs for its rich silvery oils and distinct sweetness.',
    visualType: 'ilish',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-ilish-pc', name: 'Additional Hilsa Fish Steak', price: 380 },
      { id: 'plain-rice', name: 'Steamed Rice', price: 60 },
      { id: 'extra-chili', name: 'Fried Green Chilies', price: 15 },
    ],
    hotspots: [
      { title: 'Padma River Hilsa', description: 'Wild silver hilsa famed for natural omega oils and tender flaky texture.', position: [0, 0.25, 0] },
      { title: 'Stone-Ground Shorshe', description: 'Freshly ground mustard with a pinch of salt to prevent bitterness.', position: [0.3, 0.3, 0] },
    ],
  },
  {
    id: 'chingri-malai-curry',
    name: 'Golda Chingri Malai Curry',
    banglaName: 'গলদা চিংড়ি মালাই কারি',
    subtitle: 'Jumbo River Prawn in Creamy Coconut Milk & Cardamom',
    category: 'MAIN COURSE',
    price: 520,
    rating: 4.96,
    reviewsCount: 940,
    calories: 590,
    prepTime: '20 min',
    spiceLevel: 'Mild',
    isPopular: true,
    description: 'Freshwater jumbo golda tiger prawns with head intact, simmered in freshly extracted coconut milk, ginger juice, mild green cardamom, and homemade ghee.',
    culturalStory: 'A timeless Bengali celebration dish combining coastal coconut richness with freshwater harvest.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-prawn', name: 'Extra Jumbo Golda Prawn (1 pc)', price: 240 },
      { id: 'plain-rice', name: 'Steamed Rice', price: 60 },
    ],
    hotspots: [
      { title: 'Coconut Milk Reduction', description: 'Creamy, naturally sweet base infused with whole spices.', position: [0, 0.25, 0] },
    ],
  },
  {
    id: 'chicken-roast',
    name: 'Biye Barir Shahi Chicken Roast',
    banglaName: 'বিয়ে বাড়ির শাহী চিকেন রোস্ট',
    subtitle: 'Crisp Browned Chicken in Cashew & Mawa Gravy',
    category: 'MAIN COURSE',
    price: 220,
    rating: 4.93,
    reviewsCount: 780,
    calories: 540,
    prepTime: '20 min',
    spiceLevel: 'Mild',
    description: 'Golden shallow-fried quarter chicken leg smothered in an opulent sweet-and-savory gravy of reduced milk solids (mawa), yogurt, fried onions, and green cardamom.',
    culturalStory: 'No traditional Bengali wedding meal is considered complete without this beloved celebratory course.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-polao', name: 'Chinigura Ghee Polao', price: 90 },
      { id: 'extra-borhani', name: 'Clay Cup Borhani', price: 60 },
    ],
    hotspots: [
      { title: 'Crispy Skin Sear', description: 'Gently fried before simmering to lock in juices.', position: [0, 0.3, 0] },
    ],
  },
  {
    id: 'rui-bhuna',
    name: 'Desi Rui Macher Dopiaza',
    banglaName: 'দেশি রুই মাছের দোপেঁয়াজা',
    subtitle: 'Freshwater Carp Steaks with Caramelized Onions & Tomato',
    category: 'MAIN COURSE',
    price: 260,
    rating: 4.86,
    reviewsCount: 320,
    calories: 460,
    prepTime: '20 min',
    spiceLevel: 'Medium',
    description: 'Fresh local river Rui fish steak fried golden then simmered in caramelized onion gravy, tomatoes, coriander leaves, and green chilies.',
    culturalStory: 'A quintessential staple of everyday comfort dining in every Bengali home.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'plain-rice', name: 'Steamed Rice', price: 60 },
      { id: 'dal', name: 'Tok Dal', price: 70 },
    ],
    hotspots: [
      { title: 'Freshwater Sweetness', description: 'Locally sourced daily from natural river waters.', position: [0, 0.2, 0] },
    ],
  },

  // 3. SIDES
  {
    id: 'begun-bhaja',
    name: 'Gol Begun Bhaja',
    banglaName: 'গোল বেগুন ভাজা (২ পিস)',
    subtitle: 'Crisp Spiced Eggplant Discs with Mustard Oil & Turmeric',
    category: 'SIDES',
    price: 90,
    rating: 4.90,
    reviewsCount: 420,
    calories: 180,
    prepTime: '10 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    description: 'Thick round discs of sweet purple eggplant seasoned with turmeric, chili powder, and sea salt, pan-fried in sizzling mustard oil until creamy inside and crisp outside.',
    culturalStory: 'The timeless companion to Khichuri, Dal, and freshly steamed rice.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },
  {
    id: 'shahi-dal',
    name: 'Shahi Cholar Dal with Coconut',
    banglaName: 'নারিকেল দিয়ে শাহী ছোলার ডাল',
    subtitle: 'Bengal Gram Simmered with Coconut Flakes & Ghee Tarka',
    category: 'SIDES',
    price: 120,
    rating: 4.89,
    reviewsCount: 310,
    calories: 260,
    prepTime: '15 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    description: 'Split Bengal gram lentils cooked thick with tiny crunchy fried fresh coconut slivers, bay leaves, dry chilies, and a final sizzle of whole cumin in desi ghee.',
    culturalStory: 'A festive vegetarian favorite often enjoyed with hot luchi or paratha during celebrations.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },
  {
    id: 'jali-kebab',
    name: 'Shahi Mutton Jali Kebab',
    banglaName: 'শাহী মাটন জালি কাবাব (২ পিস)',
    subtitle: 'Lace-Coated Minced Mutton Patties',
    category: 'SIDES',
    price: 150,
    rating: 4.94,
    reviewsCount: 510,
    calories: 320,
    prepTime: '15 min',
    spiceLevel: 'Medium',
    description: 'Spiced minced mutton patties dipped in beaten seasoned egg net (jali) and shallow-fried golden, seasoned with crushed mint and shahi garam masala.',
    culturalStory: 'The indispensable companion to Shahi Kacchi Biryani and Morog Polao.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },
  {
    id: 'special-salad',
    name: 'Kacchi Special Onion-Chili Salad',
    banglaName: 'কাচ্চি স্পেশাল সালাদ',
    subtitle: 'Crisp Red Onion, Green Chilies & Fresh Lime Juice',
    category: 'SIDES',
    price: 60,
    rating: 4.85,
    reviewsCount: 220,
    calories: 45,
    prepTime: '5 min',
    spiceLevel: 'Spicy',
    isVegetarian: true,
    description: 'Sliced red onions, fresh coriander leaves, fiery green chilies, and squeezed Kagzi lemon juice with pink rock salt (bit laban).',
    culturalStory: 'Cleanses the palate and perfectly balances rich biryanis and roasted meats.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },

  // 4. DRINKS
  {
    id: 'shahi-borhani',
    name: 'Old Dhaka Shahi Borhani',
    banglaName: 'ঐতিহ্যবাহী শাহী বোরহানি',
    subtitle: 'Spiced Sour Curd Drink with Mint, Mustard & Black Salt',
    category: 'DRINKS',
    price: 90,
    rating: 4.99,
    reviewsCount: 1840,
    calories: 140,
    prepTime: '5 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    isPopular: true,
    description: 'Thick cultured sweet-and-sour curd churned with fresh green mint leaves, stone-ground white mustard seed, roasted cumin powder, black rock salt, and green chili essence. Served ice cold in traditional clay matir bati.',
    culturalStory: 'The legendary digestive drink without which no Old Dhaka Kacchi Biryani feast is complete.',
    visualType: 'borhani',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'bottle-size', name: 'Upgrade to 1 Litre Sharing Pitcher', price: 180 },
    ],
    hotspots: [
      { title: 'Fresh Mint & Mustard', description: 'Infuses a refreshing herbal tang that aids digestion.', position: [0, 0.4, 0] },
      { title: 'Cultured Desi Curd', description: 'Churned to velvety smoothness with rock salt.', position: [0, 0.1, 0] },
    ],
  },
  {
    id: 'badam-lassi',
    name: 'Kashmiri Badam Pista Lassi',
    banglaName: 'বাদাম পেস্তা লাচ্ছি',
    subtitle: 'Creamy Sweet Yogurt with Crushed Almonds & Malai',
    category: 'DRINKS',
    price: 110,
    rating: 4.91,
    reviewsCount: 460,
    calories: 220,
    prepTime: '5 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    description: 'Rich creamy whole milk curd churned with rose water, crushed almonds, pistachios, and topped with clotted cream (malai).',
    culturalStory: 'A refreshing sweet delight on warm Dhaka afternoons.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },
  {
    id: 'lemon-mint-sharbat',
    name: 'Kagzi Lemon Mint Sharbat',
    banglaName: 'কাগজি লেবু পুদিনা শরবত',
    subtitle: 'Local Fragrant Kagzi Lime, Mint & Bit Laban',
    category: 'DRINKS',
    price: 80,
    rating: 4.88,
    reviewsCount: 380,
    calories: 90,
    prepTime: '5 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    description: 'Freshly squeezed aromatic Kagzi lime juice, crushed garden mint, black salt, and chilled sugar syrup with crushed ice.',
    culturalStory: 'A timeless thirst-quencher across Bangladesh.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },

  // 5. DESSERT
  {
    id: 'matir-harir-firni',
    name: 'Shahi Matir Harir Firni',
    banglaName: 'মাটির হাঁড়ির শাহী ফিরনি',
    subtitle: 'Slow-Boiled Milk Pudding in Earthen Clay Shora',
    category: 'DESSERT',
    price: 120,
    rating: 4.98,
    reviewsCount: 1220,
    calories: 310,
    prepTime: '10 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    isPopular: true,
    description: 'Aromatic Chinigura rice slow-boiled in full cream milk reduced to half, scented with green cardamom, kewra water, and pure saffron. Set in an unglazed earthen clay pot (matir shora) and topped with edible silver leaf (vark) and slivered pistachios.',
    culturalStory: 'The clay earthenware absorbs excess moisture, yielding an incomparably dense, velvety cream texture.',
    visualType: 'firni',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    addOns: [
      { id: 'extra-firni-pot', name: 'Additional Clay Pot Firni', price: 100 },
    ],
    hotspots: [
      { title: 'Earthen Clay Pot', description: 'Imparts subtle porous earthiness and optimal cream density.', position: [0, 0.1, 0] },
      { title: 'Saffron & Silver Leaf', description: 'Garnished with royal 24k edible vark and Iranian saffron.', position: [0, 0.35, 0] },
    ],
  },
  {
    id: 'zafrani-jorda',
    name: 'Shahi Zafrani Jorda',
    banglaName: 'শাহী জাফরানি জর্দা',
    subtitle: 'Saffron Sweet Rice with Baby Gulab Jamun & Almonds',
    category: 'DESSERT',
    price: 110,
    rating: 4.90,
    reviewsCount: 520,
    calories: 340,
    prepTime: '10 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    description: 'Long-grain rice sweetened in spiced syrup, infused with orange peel and saffron, studded with mini soft gulab jamuns, candied murabba, and cashews.',
    culturalStory: 'A joyful sweet finale traditionally served at celebratory Bengali banquets.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },
  {
    id: 'chana-mishti',
    name: 'Traditional Chana Mishti & Roshogolla',
    banglaName: 'রসগোল্লা ও ছানার মিষ্টি থালি (৪ পিস)',
    subtitle: 'Hand-Rolled Cottage Cheese Spheres in Light Cardamom Syrup',
    category: 'DESSERT',
    price: 140,
    rating: 4.92,
    reviewsCount: 610,
    calories: 280,
    prepTime: '5 min',
    spiceLevel: 'Mild',
    isVegetarian: true,
    description: 'Fresh cow milk cottage cheese hand-kneaded and cooked in boiling sugar syrup until spongy, juicy, and aromatic.',
    culturalStory: 'The timeless symbol of Bengali hospitality and sweetness.',
    visualType: 'generic',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    addOns: [],
    hotspots: [],
  },
];

export interface RestaurantReview {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  accolade?: string;
}

export const RESTAURANT_REVIEWS: RestaurantReview[] = [
  {
    id: 'rev-1',
    author: 'Nafisa Rahman',
    role: 'Food Writer, The Daily Star',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'September 2026',
    comment: 'RASA has achieved the impossible: preserving the authentic soul of Old Dhaka Kacchi while executing it with world-class finesse. The potato is cooked to utter perfection.',
    accolade: '★ Best Kacchi in Dhaka 2026',
  },
  {
    id: 'rev-2',
    author: 'Tanvir Ahmed',
    role: 'Gastronomy Critic & Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'August 2026',
    comment: 'The Beef Kala Bhuna has that authentic Mezban charcoal depth you usually only find in Chittagong. Paired with a chilled clay-cup Borhani, it is unmatched.',
    accolade: 'Top Bangladeshi Dining Experience',
  },
  {
    id: 'rev-3',
    author: 'Farhana Chowdhury',
    role: 'Dhaka Culinary Society',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'July 2026',
    comment: 'From the online ordering to the steaming hot delivery arrival in Gulshan in under 30 minutes, RASA represents the pinnacle of modern Bangladeshi dining.',
    accolade: 'Gold Standard of Hospitality',
  },
];
