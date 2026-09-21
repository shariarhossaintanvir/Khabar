import React, { useState } from 'react';
import { Layers, ChevronRight, Info } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

interface ExplodedIngredient {
  id: string;
  name: string;
  detail: string;
  badge: string;
  positionClass: string; // Tailored responsive CSS positioning
}

export const Scene03ExplosionLabels: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const ingredients: ExplodedIngredient[] = [
    {
      id: 'bun-gold',
      name: '24K GOLD SESAME BRIOCHE',
      detail: 'Slow fermented 36 hours with Normandy butter, dusted with 24k Bavarian edible gold flakes.',
      badge: 'TOP BUN',
      positionClass: 'top-[12%] left-[8%] md:left-[16%]',
    },
    {
      id: 'truffle',
      name: 'TRUFFLE SAUCE & HERBS',
      detail: 'Umbrian winter black truffle emulsion with fresh plucked micro-chervil leaves.',
      badge: 'EMULSION',
      positionClass: 'top-[24%] right-[8%] md:right-[15%]',
    },
    {
      id: 'cheddar',
      name: 'AGED CHEDDAR',
      detail: 'Cave-aged for 24 months in Somerset, melted under high-heat salamander broilers.',
      badge: 'DAIRY',
      positionClass: 'top-[38%] left-[6%] md:left-[14%]',
    },
    {
      id: 'beef',
      name: 'SMOKED BEEF (A5 WAGYU)',
      detail: 'Dual 120g patties coarse ground with bone marrow, smoked over Japanese oak binchotan.',
      badge: 'CORE PATTY',
      positionClass: 'top-[52%] right-[6%] md:right-[13%]',
    },
    {
      id: 'tomato',
      name: 'CHARRED HEIRLOOM TOMATO',
      detail: 'Sun-ripened Sicilian heirloom, cold smoked and marinated in balsamic vinegar reduction.',
      badge: 'ORGANIC',
      positionClass: 'top-[66%] left-[8%] md:left-[16%]',
    },
    {
      id: 'onion',
      name: 'CARAMELIZED ONION',
      detail: 'Sweet Vidalia onions braised for 6 hours in port wine, thyme, and roasted shallot oil.',
      badge: 'CONFIT',
      positionClass: 'top-[80%] right-[8%] md:right-[15%]',
    },
  ];

  const handleLabelClick = (id: string) => {
    audioEngine.playClick();
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <section
      id="scene-explosion"
      className="relative min-h-[220vh] pointer-events-none select-none"
    >
      {/* Pinned Title Header */}
      <div className="sticky top-24 z-20 max-w-4xl mx-auto text-center px-6 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-gold-DEFAULT/30 backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-amber-DEFAULT" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold text-cream-200">
            SCENE 03 — INGREDIENT EXPLOSION
          </span>
        </div>

        <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-cream-100 font-bold tracking-tight">
          Deconstructed Perfection
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-cream-300 font-sans max-w-lg mx-auto">
          Every layer separates along the vertical axis. Touch or click any floating label to explore culinary provenance.
        </p>
      </div>

      {/* FLOATING 3D-ALIGNED LABELS */}
      <div className="absolute inset-0 z-10">
        {ingredients.map((item) => {
          const isOpen = activeTooltip === item.id;
          return (
            <div
              key={item.id}
              className={`absolute ${item.positionClass} pointer-events-auto transition-all duration-300`}
            >
              <button
                onClick={() => handleLabelClick(item.id)}
                className="group flex items-center gap-3 px-3.5 py-2 rounded-full glass-panel border border-gold-DEFAULT/40 hover:border-gold-DEFAULT hover:bg-dark-900/90 transition-all focus:outline-none shadow-xl"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-DEFAULT hotspot-pulse" />
                <div className="text-left">
                  <span className="block text-[8px] tracking-widest-2xl text-gold-DEFAULT font-sans font-bold">
                    {item.badge}
                  </span>
                  <span className="block text-xs sm:text-sm font-serif font-bold text-cream-100 group-hover:text-gold-light transition-colors">
                    {item.name}
                  </span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-cream-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Tooltip Card */}
              {isOpen && (
                <div className="mt-2 p-4 rounded-xl glass-panel-gold max-w-xs animate-in fade-in zoom-in-95 duration-200 z-30">
                  <div className="flex items-center gap-2 text-gold-DEFAULT text-xs font-serif font-semibold mb-1">
                    <Info className="w-3.5 h-3.5" />
                    Culinary Note
                  </div>
                  <p className="text-xs text-cream-200 font-sans leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
