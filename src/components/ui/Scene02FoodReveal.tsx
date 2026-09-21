import React from 'react';
import { Flame, Award } from 'lucide-react';

export const Scene02FoodReveal: React.FC = () => {
  return (
    <section
      id="scene-food-reveal"
      className="relative min-h-[140vh] flex items-center justify-between px-6 md:px-16 pointer-events-none select-none"
    >
      {/* Left Editorial Text Block */}
      <div className="max-w-md pointer-events-auto bg-dark-900/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 text-amber-DEFAULT mb-3">
          <Award className="w-4 h-4" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-semibold">
            SCENE 02 — THE FOOD REVEAL
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-cream-100 font-bold leading-tight">
          Double Miyazaki Wagyu. Cave-Aged Reserve.
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
          Every contour seared at 650°F over Japanese binchotan charcoal. As you scroll, the camera orbits
          the dish to reveal its caramelized maillard glaze, 24k gold leaf speckles, and melted aged cheddar.
        </p>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-sans text-cream-400">
          <span>ORIGIN: MIYAZAKI, JAPAN</span>
          <span className="text-gold-DEFAULT font-semibold">GRADE: A5 BMS 11</span>
        </div>
      </div>

      {/* Right Flavor Profile Badge */}
      <div className="hidden lg:flex flex-col gap-4 pointer-events-auto">
        <div className="glass-panel p-5 rounded-xl max-w-xs border-l-2 border-l-amber-DEFAULT">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-cream-100">
            <Flame className="w-4 h-4 text-amber-DEFAULT" />
            Umami Matrix
          </div>
          <p className="mt-1 text-xs text-cream-300 font-sans">
            Smoked duck fat and black truffle reduction caramelizing against toasted brioche.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl max-w-xs border-l-2 border-l-gold-DEFAULT">
          <span className="text-[10px] uppercase tracking-widest text-gold-DEFAULT font-bold">
            TEXTURE ARCHITECTURE
          </span>
          <p className="mt-1 text-xs text-cream-300 font-sans">
            Crisp exterior crust yielding to buttery, velvet-smooth interior marbling.
          </p>
        </div>
      </div>
    </section>
  );
};
