import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audio';
import { useStore } from '../../context/StoreContext';
import { MENU_ITEMS } from '../../data/menuData';

export const Scene01Awakening: React.FC = () => {
  const { openInspector } = useStore();

  const handleExplore = () => {
    audioEngine.playClick();
    const target = document.getElementById('scene-food-reveal');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderNow = () => {
    audioEngine.playClick();
    const heroBurger = MENU_ITEMS[0];
    openInspector(heroBurger);
  };

  return (
    <section
      id="scene-awakening"
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-6 pt-36 pb-12 select-none"
    >
      {/* Top Subtle Brand Tag */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-DEFAULT/25 bg-dark-900/50 backdrop-blur-md animate-pulse-subtle">
        <Sparkles className="w-3.5 h-3.5 text-amber-DEFAULT" />
        <span className="text-[11px] tracking-widest-2xl uppercase font-sans text-cream-300">
          TOKYO — PARIS — NEW YORK
        </span>
      </div>

      {/* Main Hero Titles */}
      <div className="max-w-4xl mx-auto my-auto py-12 flex flex-col items-center">
        <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl font-extrabold tracking-widest-xl text-gold-gradient uppercase drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
          NOIRÉ
        </h1>

        <p className="mt-4 sm:mt-6 font-serif italic text-xl sm:text-2xl md:text-3xl text-cream-200 tracking-wide max-w-2xl leading-relaxed">
          &ldquo;Taste Beyond Ordinary.&rdquo;
        </p>

        <p className="mt-3 text-xs sm:text-sm uppercase tracking-widest-xl text-cream-400 font-sans max-w-lg">
          A multisensory culinary choreography where Japanese precision encounters French haute tradition.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 pointer-events-auto">
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-cream-100 text-dark-950 font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-DEFAULT transition-all duration-300 shadow-[0_0_30px_rgba(243,239,230,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transform hover:-translate-y-0.5 focus:outline-none"
          >
            EXPLORE EXPERIENCE
          </button>

          <button
            onClick={handleOrderNow}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-gold-DEFAULT/40 bg-dark-900/60 text-cream-100 font-sans text-xs font-semibold tracking-widest uppercase hover:border-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-all duration-300 backdrop-blur-md focus:outline-none"
          >
            ORDER NOW
          </button>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="flex flex-col items-center gap-3 cursor-pointer group pointer-events-auto" onClick={handleExplore}>
        <span className="text-[10px] tracking-widest-2xl uppercase font-sans text-cream-400 group-hover:text-gold-DEFAULT transition-colors">
          SCROLL TO EXPLORE
        </span>
        <div className="w-8 h-12 rounded-full border border-white/20 flex items-start justify-center p-2 group-hover:border-gold-DEFAULT transition-colors">
          <ArrowDown className="w-4 h-4 text-amber-DEFAULT animate-bounce" />
        </div>
      </div>
    </section>
  );
};
