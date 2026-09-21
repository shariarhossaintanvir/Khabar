import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { X, Plus, Minus, Check, Sparkles, Info, ShoppingBag, Flame, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { AddOn } from '../../data/menuData';
import { HeroKacchiModel } from '../canvas/HeroKacchiModel';
import { KalaBhunaModel, ShorsheIlishModel, ChingriMalaiModel, ClayBorhaniModel, ShahiFirniModel } from '../canvas/Menu3DObjects';
import { audioEngine } from '../../utils/audio';

export const ProductInspectorModal: React.FC = () => {
  const { inspectingItem, closeInspector, addToCart, formatBDT } = useStore();
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Reset local state on item change
  React.useEffect(() => {
    setSelectedAddOns([]);
    setQuantity(1);
    setSpecialInstructions('');
    setActiveHotspot(null);
  }, [inspectingItem]);

  if (!inspectingItem) return null;

  const toggleAddOn = (addOn: AddOn) => {
    audioEngine.playClick();
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const dynamicUnitPrice = inspectingItem.price + addOnsTotal;
  const totalPrice = dynamicUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(inspectingItem, quantity, selectedAddOns, specialInstructions);
    closeInspector();
  };

  const is3D = inspectingItem.visualType !== 'generic';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark-950/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[840px] glass-panel-gold rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
        {/* CLOSE BUTTON */}
        <button
          onClick={closeInspector}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-dark-900/80 border border-white/10 hover:border-brass hover:text-brass flex items-center justify-center transition-colors text-ivory-200 focus:outline-none"
          aria-label="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D VIEWPORT OR HIGH-RES PHOTO */}
        <div className="w-full lg:w-3/5 h-1/2 lg:h-full relative bg-radial from-dark-900 to-dark-950 flex items-center justify-center overflow-hidden">
          {is3D ? (
            <>
              <Canvas
                camera={{ position: [0, 1.2, 4.0], fov: 42 }}
                gl={{ alpha: true, antialias: true }}
              >
                <ambientLight intensity={0.7} />
                <spotLight position={[5, 7, 5]} intensity={2.5} angle={0.5} penumbra={0.8} color="#fff2db" />
                <pointLight position={[-4, 2, -2]} intensity={1.8} color="#e27a52" />
                <pointLight position={[0, -2, 2]} intensity={1.2} color="#c5a059" />

                {inspectingItem.visualType === 'kacchi' && (
                  <HeroKacchiModel scale={1.1} interactiveRotation />
                )}
                {inspectingItem.visualType === 'kalabhuna' && <KalaBhunaModel scale={1.2} />}
                {inspectingItem.visualType === 'ilish' && <ShorsheIlishModel scale={1.15} />}
                {inspectingItem.visualType === 'borhani' && <ClayBorhaniModel scale={1.35} />}
                {inspectingItem.visualType === 'firni' && <ShahiFirniModel scale={1.3} />}

                <OrbitControls enablePan={false} minDistance={2.5} maxDistance={6.0} />
              </Canvas>

              {/* Interaction Hint */}
              <div className="absolute bottom-4 left-6 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-900/80 border border-white/10 backdrop-blur-md text-[10px] font-sans uppercase tracking-widest text-ivory-300">
                <Sparkles className="w-3 h-3 text-brass" />
                <span>Drag to rotate 360° • Pinch / Scroll to zoom</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full relative">
              <img
                src={inspectingItem.image}
                alt={inspectingItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />
            </div>
          )}
        </div>

        {/* DETAILS & CUSTOMIZATION PANEL */}
        <div className="w-full lg:w-2/5 h-1/2 lg:h-full p-6 sm:p-8 overflow-y-auto flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-dark-900/50">
          <div>
            {/* Meta Tags: Category, Prep Time, Spice Level */}
            <div className="flex flex-wrap items-center gap-2 text-brass mb-2">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest-xl">
                {inspectingItem.category}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] font-sans text-ivory-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-brass" /> {inspectingItem.prepTime}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] font-sans text-terracotta flex items-center gap-1 font-semibold">
                <Flame className="w-3 h-3" /> {inspectingItem.spiceLevel}
              </span>
            </div>

            <h3 className="font-serif text-3xl font-bold text-ivory-100">{inspectingItem.name}</h3>
            <span className="font-bengali text-sm text-brass block font-medium mt-0.5 mb-1">
              {inspectingItem.banglaName}
            </span>
            <p className="font-serif italic text-brass-light text-xs mb-3">{inspectingItem.subtitle}</p>

            <p className="text-xs text-ivory-300 font-sans leading-relaxed">
              {inspectingItem.description}
            </p>

            {/* Cultural Heritage Note */}
            <div className="mt-3 p-3 rounded-xl bg-dark-950/70 border border-white/5 text-[11px] font-sans text-ivory-300 leading-relaxed">
              <strong className="text-brass block font-serif mb-0.5">Heritage Provenance:</strong>
              {inspectingItem.culturalStory}
            </div>

            {/* CULINARY HOTSPOTS */}
            {inspectingItem.hotspots.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-400 font-bold block mb-2">
                  Key Ingredients (Click to Inspect):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingItem.hotspots.map((hs) => {
                    const isActive = activeHotspot === hs.title;
                    return (
                      <button
                        key={hs.title}
                        onClick={() => {
                          audioEngine.playClick();
                          setActiveHotspot(isActive ? null : hs.title);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                          isActive
                            ? 'border-brass bg-brass/20 text-brass-light'
                            : 'border-white/15 bg-white/5 text-ivory-300 hover:border-brass/40'
                        }`}
                      >
                        <Info className="w-3 h-3 text-terracotta" />
                        <span>{hs.title}</span>
                      </button>
                    );
                  })}
                </div>

                {activeHotspot && (
                  <div className="mt-2.5 p-3 rounded-xl bg-dark-950 border border-brass/30 text-xs text-ivory-200 font-sans leading-relaxed animate-in fade-in duration-200">
                    {inspectingItem.hotspots.find((h) => h.title === activeHotspot)?.description}
                  </div>
                )}
              </div>
            )}

            {/* BESPOKE ADD-ONS */}
            {inspectingItem.addOns.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-400 font-bold">
                    Custom Add-Ons:
                  </span>
                  <span className="text-[10px] text-brass font-sans">Dynamic Total</span>
                </div>
                <div className="flex flex-col gap-2">
                  {inspectingItem.addOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-sans transition-all text-left ${
                          isSelected
                            ? 'border-brass bg-brass/15 text-ivory-100 shadow-sm'
                            : 'border-white/10 bg-white/5 text-ivory-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? 'bg-brass border-brass text-dark-950'
                                : 'border-white/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{addOn.name}</span>
                        </div>
                        <span className="font-semibold text-brass-light">+{formatBDT(addOn.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SPECIAL INSTRUCTIONS */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <label className="block text-[10px] font-sans uppercase tracking-widest text-ivory-400 font-bold mb-1.5">
                Special Kitchen Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Less oil, extra green chilies, separate gravy..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-brass"
              />
            </div>
          </div>

          {/* FOOTER ACTIONS: QUANTITY & ADD TO BAG */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {/* Stepper */}
              <div className="flex items-center gap-3 bg-dark-950 border border-white/15 px-3 py-1.5 rounded-full">
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="text-ivory-300 hover:text-brass p-1 focus:outline-none"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-sans font-bold text-sm text-ivory-100 w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setQuantity(quantity + 1);
                  }}
                  className="text-ivory-300 hover:text-brass p-1 focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Price */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-sans text-ivory-400 block">Total</span>
                <span className="font-serif text-2xl font-bold text-gold-gradient">
                  {formatBDT(totalPrice)}
                </span>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-terracotta hover:bg-terracotta-light text-white font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(200,90,50,0.35)] flex items-center justify-center gap-2 focus:outline-none transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} to Order • {formatBDT(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
