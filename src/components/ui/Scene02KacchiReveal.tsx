import React from 'react';
import { Flame, Award, Clock } from 'lucide-react';

export const Scene02KacchiReveal: React.FC = () => {
  return (
    <section
      id="scene-kacchi-reveal"
      className="relative min-h-[140vh] flex items-center justify-between px-6 md:px-16 pointer-events-none select-none"
    >
      {/* Left Editorial Text Block */}
      <div className="max-w-md pointer-events-auto bg-dark-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 text-terracotta mb-2">
          <Award className="w-4 h-4" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold">
            SCENE 02 — THE KACCHI REVEAL
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-ivory-100 font-bold leading-tight">
          Slow-Dum Mutton. Aromatic Saffron Basmati.
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed">
          Sealed with dough in hand-hammered degh vessels over smoldering tamarind wood coals. 
          As the camera orbits, witness the tender, bone-in mutton falling away from the bone, 
          glistening saffron-stained potato, and aromatic beresta.
        </p>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-sans text-ivory-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brass" /> 6-HOUR DUM PROCESS
          </span>
          <span className="text-brass font-semibold">DHAKA HERITAGE</span>
        </div>
      </div>

      {/* Right Flavor Profile Cards */}
      <div className="hidden lg:flex flex-col gap-4 pointer-events-auto">
        <div className="glass-panel p-5 rounded-2xl max-w-xs border-l-2 border-l-terracotta">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-ivory-100">
            <Flame className="w-4 h-4 text-terracotta" />
            The Desi Aloor Dum
          </div>
          <p className="mt-1 text-xs text-ivory-300 font-sans leading-relaxed">
            Whole golden potato slow-braised until it absorbs the deep mutton marrow and ghee essence.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl max-w-xs border-l-2 border-l-brass">
          <span className="text-[10px] uppercase tracking-widest text-brass font-bold block mb-1">
            ROYAL SPICE CHOREOGRAPHY
          </span>
          <p className="mt-1 text-xs text-ivory-300 font-sans leading-relaxed">
            Mace, green cardamom, roasted cumin, and pure Kashmir saffron strands.
          </p>
        </div>
      </div>
    </section>
  );
};
