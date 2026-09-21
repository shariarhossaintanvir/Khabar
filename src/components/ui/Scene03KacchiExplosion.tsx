import React, { useState } from 'react';
import { Layers, ChevronRight, Info } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

interface ExplodedIngredient {
  id: string;
  name: string;
  bangla: string;
  detail: string;
  badge: string;
  positionClass: string;
}

export const Scene03KacchiExplosion: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const ingredients: ExplodedIngredient[] = [
    {
      id: 'beresta',
      name: 'CRISPY BERESTA',
      bangla: 'পেঁয়াজ বেরেস্তা',
      detail: 'Paper-thin red onions fried golden in pure ghee, lightly sprinkled with kewra and crushed mace.',
      badge: 'CROWNING GARNISH',
      positionClass: 'top-[12%] left-[8%] md:left-[16%]',
    },
    {
      id: 'basmati',
      name: 'AGED BASMATI RICE',
      bangla: 'সুগন্ধি বাসমতী',
      detail: 'Two-year aged Himalayan long-grain basmati. Each individual grain remains intact, fluffy, and aromatic.',
      badge: 'TOP RICE MOUND',
      positionClass: 'top-[25%] right-[8%] md:right-[15%]',
    },
    {
      id: 'spices',
      name: 'PREMIUM SPICES & SAFFRON',
      bangla: 'শাহী মশলা ও জাফরান',
      detail: 'Whole green cardamom, Ceylon cinnamon quills, cloves, and hand-plucked Iranian saffron threads.',
      badge: 'SHAHI BLEND',
      positionClass: 'top-[38%] left-[6%] md:left-[14%]',
    },
    {
      id: 'potato',
      name: 'DESI POTATO (ALOOR DUM)',
      bangla: 'শাহী আলু',
      detail: 'Locally grown Munshiganj potato simmered inside the meat stock until buttery soft and saffron-stained.',
      badge: 'THE DHAKA SOUL',
      positionClass: 'top-[52%] right-[6%] md:right-[13%]',
    },
    {
      id: 'mutton',
      name: 'SLOW-COOKED MUTTON',
      bangla: 'খাসির মাংস',
      detail: 'Grass-fed tender mutton marinated in raw papaya paste, shahi curd, and roasted cumin, meltingly tender.',
      badge: 'PRIME CUT',
      positionClass: 'top-[66%] left-[8%] md:left-[16%]',
    },
    {
      id: 'platter',
      name: 'HAND-HAMMERED BRASS THALI',
      bangla: 'কাঁসার থালা',
      detail: 'Traditional Bengali brass platter crafted by artisanal metal-smiths of Dhamrai, holding heat evenly.',
      badge: 'HERITAGE VESSEL',
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-brass/40 backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-terracotta" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold text-ivory-200">
            SCENE 03 — KACCHI ANATOMY
          </span>
        </div>

        <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-ivory-100 font-bold tracking-tight">
          Deconstructing The Legend
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-ivory-300 font-sans max-w-lg mx-auto leading-relaxed">
          The Kacchi Biryani elevates into independent floating layers. Click any culinary node to examine authentic Dhaka provenance.
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
                className="group flex items-center gap-3 px-3.5 py-2 rounded-full glass-panel border border-brass/40 hover:border-brass hover:bg-dark-900/90 transition-all focus:outline-none shadow-xl"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-terracotta hotspot-pulse" />
                <div className="text-left">
                  <span className="block text-[8px] tracking-widest-2xl text-brass font-sans font-bold">
                    {item.badge}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="block text-xs sm:text-sm font-serif font-bold text-ivory-100 group-hover:text-brass-light transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-bengali text-ivory-400">
                      ({item.bangla})
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-ivory-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Tooltip Card */}
              {isOpen && (
                <div className="mt-2 p-4 rounded-xl glass-panel-gold max-w-xs animate-in fade-in zoom-in-95 duration-200 z-30">
                  <div className="flex items-center gap-2 text-brass text-xs font-serif font-semibold mb-1">
                    <Info className="w-3.5 h-3.5 text-terracotta" />
                    Culinary Provenance
                  </div>
                  <p className="text-xs text-ivory-200 font-sans leading-relaxed">
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
