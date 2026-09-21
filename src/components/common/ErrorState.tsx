import React from 'react';
import { AlertCircle, RefreshCw, WifiOff, Store } from 'lucide-react';

interface ErrorStateProps {
  type?: 'network' | 'payment' | 'closed' | 'generic';
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  message,
  onRetry,
  retryText = 'Try Again',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff className="w-12 h-12 text-rose-500" />;
      case 'closed':
        return <Store className="w-12 h-12 text-amber-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-rose-500" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Interrupted';
      case 'payment':
        return 'Payment Verification Failed';
      case 'closed':
        return 'Kitchen Currently Closed';
      default:
        return 'Something Went Wrong';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'network':
        return 'Please check your internet connection or mobile data and try again.';
      case 'payment':
        return 'We could not process your transaction. No funds were debited. Please retry or choose Cash on Delivery.';
      case 'closed':
        return 'This restaurant is outside its operational hours. You can pre-order for opening time.';
      default:
        return 'An unexpected issue occurred while fetching the food catalog. Please reload.';
    }
  };

  return (
    <div className="p-8 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="font-display font-bold text-lg text-slate-900 mb-1.5">
        {title || getDefaultTitle()}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
        {message || getDefaultMessage()}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
};
