import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { audioEngine } from '../../utils/audio';

export const ToastNotification: React.FC = () => {
  const { toastMessage, setIsCartOpen } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-dark-900/95 border border-terracotta/40 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(200,90,50,0.2)] text-ivory-100">
        <div className="w-8 h-8 rounded-full bg-terracotta/20 border border-terracotta flex items-center justify-center text-terracotta">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-xs font-sans">
          <span className="font-semibold block text-ivory-50">{toastMessage}</span>
          <span className="text-[10px] text-ivory-400">Freshly prepared in Dhaka</span>
        </div>
        <button
          onClick={() => {
            audioEngine.playClick();
            setIsCartOpen(true);
          }}
          className="ml-2 px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-light text-white text-[11px] font-sans font-bold flex items-center gap-1 transition-colors"
        >
          <span>Bag</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
