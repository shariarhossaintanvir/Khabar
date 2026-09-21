import React from 'react';
import { ArrowDown, Flame, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audio';
import { useStore } from '../../context/StoreContext';
import { MENU_ITEMS } from '../../data/menuData';

export const Scene01Hero: React.FC = () => {
  const { openInspector } = useStore();

  const handleExploreMenu = () => {
    audioEngine.playClick();
    const target = document.getElementById('scene-menu');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderNow = () => {
    audioEngine.playClick();
    const heroKacchi = MENU_ITEMS[0];
    openInspector(heroKacchi);
  };

  const handleScrollToReveal = () => {
    audioEngine.playClick();
    const target = document.getElementById('scene-kacchi-reveal');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="scene-hero"
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-6 pt-36 pb-12 select-none"
    >
      {/* Top Heritage Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-brass/30 bg-dark-900/60 backdrop-blur-md animate-pulse-subtle">
        <Flame className="w-3.5 h-3.5 text-terracotta" />
        <span className="text-[11px] tracking-widest-2xl uppercase font-sans text-ivory-200">
          DHAKA • BANGLADESH
        </span>
      </div>

      {/* Main Brand Title & Taglines */}
      <div className="max-w-4xl mx-auto my-auto py-12 flex flex-col items-center">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl font-black tracking-widest-xl text-ivory-100 uppercase drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
            RASA
          </h1>
        </div>

        <div className="font-bengali text-lg sm:text-2xl text-brass font-semibold tracking-wider mt-1">
          রস • খাঁটি স্বাদ, নতুন উপস্থাপনা
        </div>

        <p className="mt-4 sm:mt-5 font-serif italic text-2xl sm:text-3xl md:text-4xl text-brass-light tracking-wide max-w-2xl leading-relaxed">
          &ldquo;Authentic Bangladesh. Reimagined.&rdquo;
        </p>

        <p className="mt-3 text-xs sm:text-sm uppercase tracking-widest-xl text-ivory-300 font-sans max-w-xl leading-relaxed">
          Slow-dum Kacchi Biryani, Chittagong Mezban Kala Bhuna, and freshwater Padma Hilsa. 
          Culinary heritage elevated into a modern sensory dining journey.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 pointer-events-auto">
          <button
            onClick={handleOrderNow}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-terracotta text-white font-sans text-xs font-bold tracking-widest uppercase hover:bg-terracotta-light transition-all duration-300 shadow-[0_0_35px_rgba(200,90,50,0.5)] transform hover:-translate-y-0.5 focus:outline-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-brass-light" />
            <span>ORDER NOW (৳ 380)</span>
          </button>

          <button
            onClick={handleExploreMenu}
            className="w-full sm:w-auto px-9 py-4 rounded-full border border-brass/50 bg-dark-900/70 text-ivory-100 font-sans text-xs font-semibold tracking-widest uppercase hover:border-brass hover:bg-brass/15 transition-all duration-300 backdrop-blur-md focus:outline-none"
          >
            EXPLORE MENU
          </button>
        </div>
      </div>

      {/* SCROLL TO EXPLORE INDICATOR */}
      <div
        className="flex flex-col items-center gap-2.5 cursor-pointer group pointer-events-auto"
        onClick={handleScrollToReveal}
      >
        <span className="text-[10px] tracking-widest-2xl uppercase font-sans text-ivory-400 group-hover:text-brass transition-colors">
          SCROLL TO EXPLORE
        </span>
        <div className="w-8 h-12 rounded-full border border-white/20 flex items-start justify-center p-2 group-hover:border-brass transition-colors">
          <ArrowDown className="w-4 h-4 text-terracotta animate-bounce" />
        </div>
      </div>
    </section>
  );
};
