import React from 'react';
import { ShoppingBag, Search, Heart, ReceiptText, Ticket, CalendarX } from 'lucide-react';

interface EmptyStateProps {
  type: 'cart' | 'search' | 'favorites' | 'orders' | 'vouchers' | 'reservations';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="w-12 h-12 text-brand-500" />;
      case 'search':
        return <Search className="w-12 h-12 text-slate-400" />;
      case 'favorites':
        return <Heart className="w-12 h-12 text-rose-400" />;
      case 'orders':
        return <ReceiptText className="w-12 h-12 text-amber-500" />;
      case 'vouchers':
        return <Ticket className="w-12 h-12 text-brand-400" />;
      case 'reservations':
        return <CalendarX className="w-12 h-12 text-indigo-400" />;
      default:
        return <ShoppingBag className="w-12 h-12 text-brand-500" />;
    }
  };

  const getDefaults = () => {
    switch (type) {
      case 'cart':
        return {
          title: 'Your food bag is empty',
          description: 'Explore verified kitchens in Dhaka and add delicious items to start your meal.',
          actionText: 'Explore Food',
        };
      case 'search':
        return {
          title: 'No dishes or kitchens found',
          description: 'Try checking your spelling or search for popular items like Biryani, Burgers, or Pizza.',
          actionText: 'Clear Filters',
        };
      case 'favorites':
        return {
          title: 'No saved favorites yet',
          description: 'Tap the heart icon on any restaurant or dish to quickly reorder your favorite meals.',
          actionText: 'Browse Top Rated',
        };
      case 'orders':
        return {
          title: 'No past orders',
          description: 'Once you place your first order, you can track it live and reorder anytime.',
          actionText: 'Find Something Delicious',
        };
      case 'vouchers':
        return {
          title: 'No active vouchers right now',
          description: 'Keep an eye out for seasonal festival discounts and promo deals on KHABAR.',
          actionText: 'View Deals',
        };
      case 'reservations':
        return {
          title: 'No table bookings found',
          description: 'Reserve a priority dine-in table at top restaurants like Sultan’s Dine and Star Kabab.',
          actionText: 'Book a Table',
        };
    }
  };

  const defaults = getDefaults();

  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 shadow-xs">
        {getIcon()}
      </div>
      <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-1.5">
        {title || defaults.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
        {description || defaults.description}
      </p>
      {actionText || defaults.actionText ? (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          {actionText || defaults.actionText}
        </button>
      ) : null}
    </div>
  );
};
