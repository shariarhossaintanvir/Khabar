import React from 'react';
import { Compass, Sparkles, Utensils } from 'lucide-react';

export const Scene04InteriorTransition: React.FC = () => {
  return (
    <section
      id="scene-interior"
      className="relative min-h-[150vh] flex flex-col justify-center px-6 md:px-16 pointer-events-none select-none"
    >
      <div className="max-w-xl pointer-events-auto bg-dark-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 text-brass mb-3">
          <Compass className="w-4 h-4 text-terracotta" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold">
            SCENE 04 & 05 — THE RASA DINING ROOM
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl text-ivory-100 font-bold leading-tight">
          Enter The Sanctuary of Warmth & Brass
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed">
          The steaming Kacchi thali comes to rest upon polished Chittagong teak wood. 
          Flickering brass oil lamps cast warm golden reflections against terracotta textures and lush tropical foliage. 
          Contemporary dining, profoundly rooted in Bangladeshi hospitality.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
          <div>
            <span className="block font-serif text-lg font-bold text-ivory-100">Dhamrai</span>
            <span className="text-[9px] uppercase tracking-widest text-ivory-400 font-sans">Artisanal Brass</span>
          </div>
          <div>
            <span className="block font-serif text-lg font-bold text-brass">100% Ghee</span>
            <span className="text-[9px] uppercase tracking-widest text-ivory-400 font-sans">Baghhabari Pure</span>
          </div>
          <div>
            <span className="block font-serif text-lg font-bold text-terracotta flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 4.9★
            </span>
            <span className="text-[9px] uppercase tracking-widest text-ivory-400 font-sans">Dhaka Critics</span>
          </div>
        </div>
      </div>
    </section>
  );
};
