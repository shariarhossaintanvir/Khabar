import React from 'react';
import { Quote, Sparkles, Star, Award } from 'lucide-react';
import { RESTAURANT_REVIEWS } from '../../data/menuData';

export const Scene09StorySection: React.FC = () => {
  return (
    <section
      id="scene-story"
      className="relative min-h-[160vh] py-32 px-6 md:px-16 flex flex-col justify-center select-none"
    >
      {/* KINETIC TYPOGRAPHY MANIFESTO STATEMENTS */}
      <div className="max-w-6xl mx-auto w-full mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-brass/30 backdrop-blur-md mb-8">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" />
          <span className="text-[10px] tracking-widest-2xl uppercase font-sans font-bold text-ivory-200">
            SCENE 09 — THE RASA MANIFESTO
          </span>
        </div>

        {/* Short, powerful kinetic typography lines */}
        <div className="space-y-6 sm:space-y-8">
          <div className="overflow-hidden">
            <h2 className="font-serif text-4xl sm:text-7xl md:text-8xl font-black text-ivory-100 tracking-tight transition-transform duration-700 hover:translate-x-3">
              FROM OUR KITCHEN.
            </h2>
          </div>

          <div className="overflow-hidden pl-3 sm:pl-16">
            <h2 className="font-serif italic text-4xl sm:text-7xl md:text-8xl font-light text-brass tracking-tight transition-transform duration-700 hover:translate-x-3">
              ROOTED IN BANGLADESH.
            </h2>
          </div>

          <div className="overflow-hidden pl-2 sm:pl-28">
            <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-widest-xl text-terracotta-glow transition-transform duration-700 hover:translate-x-3">
              CRAFTED FOR TODAY.
            </h2>
          </div>

          <div className="overflow-hidden pl-4 sm:pl-36">
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl font-light text-ivory-300 uppercase tracking-wider transition-transform duration-700 hover:translate-x-3">
              MADE WITH INGREDIENTS WE TRUST.
            </h2>
          </div>
        </div>
      </div>

      {/* CULINARY DIRECTOR'S STATEMENT */}
      <div className="max-w-4xl mx-auto w-full glass-panel-gold rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl mb-24">
        <Quote className="absolute top-6 right-6 w-24 h-24 text-brass/10 pointer-events-none" />
        <div className="relative z-10">
          <p className="font-serif italic text-xl sm:text-3xl text-ivory-100 leading-relaxed max-w-2xl">
            &ldquo;Bangladeshi food is not merely curry and rice. It is an extraordinary convergence of 
            freshwater delta bounty, ancestral dum patience, and aromatic mustard oils. At RASA, we honor our grandmothers&apos; recipes with contemporary culinary mastery.&rdquo;
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-brass/40 overflow-hidden bg-dark-850">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80"
                alt="Ustadh Mahbubur Rahman"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="block font-serif font-bold text-base text-ivory-100">Ustadh Mahbubur Rahman</span>
              <span className="block text-[10px] uppercase tracking-widest font-sans text-brass">
                Master Chef • 40 Years Old Dhaka Dum Heritage
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* REPUTATION & REVIEWS */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] uppercase font-sans tracking-widest text-brass font-bold block mb-1">
              GUEST EXPERIENCES
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
              Celebrated Across Dhaka
            </h3>
          </div>

          <div className="flex items-center gap-3 bg-dark-900/80 px-5 py-2.5 rounded-2xl border border-white/10">
            <div className="text-right">
              <span className="block font-serif text-2xl font-bold text-brass leading-none">4.9 / 5</span>
              <span className="text-[9px] uppercase font-sans text-ivory-400">2,480+ Verified Reviews</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-brass/20 flex items-center justify-center text-brass">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESTAURANT_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-brass/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-brass fill-brass" />
                    ))}
                  </div>
                  {rev.accolade && (
                    <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-brass bg-brass/10 px-2.5 py-0.5 rounded-full border border-brass/20">
                      {rev.accolade}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-ivory-200 font-sans leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div>
                  <span className="block font-serif font-bold text-xs text-ivory-100">{rev.author}</span>
                  <span className="block text-[10px] text-ivory-400 font-sans">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
