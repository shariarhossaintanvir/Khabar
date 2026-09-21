import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Star,
  DollarSign,
  Shield,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  Restaurant,
  MenuItem,
  PromoCoupon,
  RiderProfile,
  PendingRestaurant,
  BANGLADESH_LOCATIONS,
  FOOD_CATEGORIES,
} from '../../data/khabarData';
import { OrderRecord } from '../../context/KhabarContext';
import { StatusBadge } from '../shared/StatusBadge';

// =========================================================================
// 1. GLOBAL COMMAND SEARCH MODAL
// =========================================================================
interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  restaurants: Restaurant[];
  riders: RiderProfile[];
  onSelectOrder: (order: OrderRecord) => void;
  onSelectRestaurant: (rest: Restaurant) => void;
  onSelectRider: (rider: RiderProfile) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  orders,
  restaurants,
  riders,
  onSelectOrder,
  onSelectRestaurant,
  onSelectRider,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const matchedOrders = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.restaurantName.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedRestaurants = q
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.bengaliName.includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  const matchedRiders = q
    ? riders.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.zone.toLowerCase().includes(q) ||
          r.phone.includes(q)
      ).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="relative border-b border-slate-100 p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across orders (#KH...), restaurants, foods, riders..."
            className="w-full text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="py-8 text-center text-xs text-slate-400">
              Type an Order ID (e.g. "KH-84920"), restaurant name, or rider to search platform wide.
            </div>
          )}

          {/* Orders */}
          {matchedOrders.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-2">
                Orders ({matchedOrders.length})
              </h5>
              {matchedOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    onSelectOrder(o);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-slate-900 font-mono">#{o.id}</strong>
                      <span className="text-xs text-slate-600 font-medium">• {o.restaurantName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Customer: {o.customerName} ({o.deliveryArea})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={o.status} size="sm" />
                    <span className="text-xs font-bold text-slate-900">৳{o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Restaurants */}
          {matchedRestaurants.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-2">
                Restaurants ({matchedRestaurants.length})
              </h5>
              {matchedRestaurants.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRestaurant(r);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.logo}
                      alt={r.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">{r.name}</h6>
                      <p className="text-[11px] text-slate-400">{r.cuisine.join(', ')} • {r.address}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.isOpen ? 'ACTIVE' : 'CLOSED'} size="sm" />
                </div>
              ))}
            </div>
          )}

          {/* Riders */}
          {matchedRiders.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-2">
                Active Riders ({matchedRiders.length})
              </h5>
              {matchedRiders.map((rd) => (
                <div
                  key={rd.id}
                  onClick={() => {
                    onSelectRider(rd);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={rd.avatar}
                      alt={rd.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">{rd.name}</h6>
                      <p className="text-[11px] text-slate-400">Zone: {rd.zone} • {rd.vehicleModel}</p>
                    </div>
                  </div>
                  <StatusBadge status={rd.status} size="sm" />
                </div>
              ))}
            </div>
          )}

          {q && !matchedOrders.length && !matchedRestaurants.length && !matchedRiders.length && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. ADD RESTAURANT MODAL
// =========================================================================
interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (restaurant: Omit<Restaurant, 'id'>) => void;
}

export const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [bengaliName, setBengaliName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [deliveryTime, setDeliveryTime] = useState('25–35 min');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
  );
  const [logo, setLogo] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      bengaliName: bengaliName || name,
      logo,
      coverImage,
      cuisine: cuisine.split(',').map((c) => c.trim()).filter(Boolean),
      rating: 4.8,
      reviewsCount: 1,
      deliveryTime,
      deliveryFee: Number(deliveryFee),
      minimumOrder: 150,
      distance: '1.2 km',
      isOpen: true,
      address,
      openingHours: '11:00 AM – 11:00 PM',
      aboutText: `${name} is dedicated to serving top-quality culinary meals in Dhaka.`,
      menuCategories: ['Popular', 'Main Course'],
      menuItems: [],
      reviews: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
            Add New Restaurant Outlet
          </h3>
          <p className="text-xs text-slate-500">
            Register and onboard a restaurant to the KHABAR merchant directory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name (English)</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sultan's Dine Banani"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bengali Name</label>
            <input
              type="text"
              value={bengaliName}
              onChange={(e) => setBengaliName(e.target.value)}
              placeholder="e.g. সুলতান'স ডাইন বনানী"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500 font-bengali"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cuisines (comma separated)</label>
              <input
                required
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="Biryani, Kebab, Bengali"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Fee (৳)</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Street Address</label>
            <input
              required
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Road 11, Block E, Banani, Dhaka"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-brand transition-all"
            >
              Save & Onboard Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 3. ADD / EDIT FOOD MODAL
// =========================================================================
interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
  onSubmit: (item: Omit<MenuItem, 'id'>) => void;
  initialItem?: MenuItem;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  onSubmit,
  initialItem,
}) => {
  const [name, setName] = useState(initialItem?.name || '');
  const [bengaliName, setBengaliName] = useState(initialItem?.bengaliName || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [price, setPrice] = useState(initialItem?.price || 350);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(initialItem?.originalPrice);
  const [category, setCategory] = useState(initialItem?.category || 'Biryani');
  const [image, setImage] = useState(
    initialItem?.image ||
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80'
  );
  const [isSpicy, setIsSpicy] = useState(initialItem?.isSpicy || false);
  const [isVeg, setIsVeg] = useState(initialItem?.isVeg || false);
  const [isPopular, setIsPopular] = useState<boolean>(initialItem?.isPopular ?? true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      bengaliName: bengaliName || name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      image,
      isSpicy,
      isVeg,
      isPopular,
      isAvailable: true,
      restaurantId,
      restaurantName,
      reviewsCount: 12,
      rating: 4.9,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
            {initialItem ? 'Edit Food Item' : 'Add Food Item'}
          </h3>
          <p className="text-xs text-slate-500">
            Publish or modify menu item for {restaurantName}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name (English)</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mutton Kacchi Basmati"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bengali Name</label>
              <input
                type="text"
                value={bengaliName}
                onChange={(e) => setBengaliName(e.target.value)}
                placeholder="e.g. খাসির কাচ্চি বাসমতি"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500 font-bengali"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh basmati rice layered with spiced tender mutton and potato."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500 bg-white"
              >
                {FOOD_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (৳)</label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (৳)</label>
              <input
                type="number"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Discount strikethrough"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          {/* Quick attribute tags */}
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isSpicy}
                onChange={(e) => setIsSpicy(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Spicy (ঝাল)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Vegetarian (নিরামিষ)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Chef's Choice / Popular</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-brand transition-all"
            >
              {initialItem ? 'Update Dish' : 'Save Dish to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 4. CREATE OFFER / COUPON MODAL
// =========================================================================
interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coupon: PromoCoupon) => void;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState('KHABAR');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FLAT' | 'FREE_DELIVERY'>('PERCENT');
  const [discountValue, setDiscountValue] = useState(20);
  const [minOrder, setMinOrder] = useState(300);
  const [maxDiscount, setMaxDiscount] = useState(150);
  const [description, setDescription] = useState('20% OFF up to ৳150 on orders above ৳300');
  const [validUntil, setValidUntil] = useState('2026-10-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrder: Number(minOrder),
      maxDiscount: Number(maxDiscount),
      description,
      badge: discountType === 'PERCENT' ? `${discountValue}% OFF` : `৳${discountValue} OFF`,
      validUntil,
      status: 'AVAILABLE',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
            Create Promotional Coupon
          </h3>
          <p className="text-xs text-slate-500">
            Publish discount campaigns for Dhaka customers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code</label>
            <input
              required
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. BIRYANI20"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 tracking-wider uppercase focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500 bg-white"
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FLAT">Flat BDT (৳)</option>
                <option value="FREE_DELIVERY">Free Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Order (৳)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Discount Cap (৳)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-brand transition-all"
            >
              Publish Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
