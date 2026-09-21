import React, { useState, useEffect } from 'react';
import { ShoppingBag, Volume2, VolumeX, Menu as MenuIcon, X, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { audioEngine } from '../../utils/audio';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, isMuted, toggleAudio, searchQuery, setSearchQuery } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    audioEngine.playClick();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToSection('scene-menu');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3.5 bg-dark-950/85 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* BRAND LOGO */}
        <button
          onClick={() => scrollToSection('scene-hero')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="text-terracotta text-2xl transition-transform duration-500 group-hover:rotate-45">
            ✦
          </span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif tracking-widest-xl text-2xl font-bold text-ivory-100 uppercase transition-colors group-hover:text-brass-light">
                RASA
              </span>
              <span className="font-bengali text-xs text-brass font-medium">
                খাঁটি স্বাদ
              </span>
            </div>
            <span className="block text-[8px] tracking-widest-2xl text-ivory-400 uppercase -mt-0.5 font-sans">
              DHAKA • BANGLADESH
            </span>
          </div>
        </button>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-widest uppercase font-sans text-ivory-300">
          <button
            onClick={() => scrollToSection('scene-kacchi-reveal')}
            className="hover:text-brass transition-colors py-1 relative group focus:outline-none"
          >
            The Kacchi
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brass transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('scene-explosion')}
            className="hover:text-brass transition-colors py-1 relative group focus:outline-none"
          >
            Anatomy
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brass transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('scene-menu')}
            className="hover:text-brass transition-colors py-1 relative group focus:outline-none"
          >
            Bangladeshi Menu
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brass transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('scene-story')}
            className="hover:text-brass transition-colors py-1 relative group focus:outline-none"
          >
            Our Story
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brass transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('scene-reservation')}
            className="hover:text-brass transition-colors py-1 relative group focus:outline-none"
          >
            Reserve Table
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brass transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        {/* RIGHT CONTROLS: SEARCH, AUDIO, CART */}
        <div className="flex items-center gap-3.5">
          {/* Search Toggle / Input */}
          <div className="relative hidden md:block">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search Kacchi, Kala Bhuna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 px-3 py-1.5 rounded-full bg-dark-900 border border-brass/40 text-xs font-sans text-ivory-100 placeholder:text-ivory-400/50 focus:outline-none focus:w-60 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-1.5 p-1 text-ivory-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setIsSearchOpen(true);
                }}
                className="p-2 rounded-full border border-white/10 bg-dark-900/60 hover:border-brass/40 text-ivory-300 hover:text-brass transition-colors focus:outline-none"
                title="Search Bangladeshi Dishes"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sound toggle button */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-dark-900/60 hover:border-brass/50 transition-all text-xs tracking-wider text-ivory-200 focus:outline-none"
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-ivory-400" />
                <span className="hidden sm:inline text-[10px] uppercase font-sans">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-terracotta animate-pulse" />
                <span className="hidden sm:inline text-[10px] uppercase font-sans text-terracotta">Sound On</span>
              </>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsCartOpen(true);
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-full border border-brass/40 bg-dark-900/80 hover:bg-brass hover:text-dark-950 transition-all duration-300 focus:outline-none group shadow-lg"
            aria-label="View food order"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-terracotta text-white font-sans text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-ivory-200 hover:text-brass focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-dark-950/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 text-sm font-sans tracking-widest uppercase">
          {/* Mobile Search */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search dishes (e.g. Kacchi, Kala Bhuna)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-ivory-100 focus:border-brass focus:outline-none"
            />
          </div>
          <button
            onClick={() => scrollToSection('scene-hero')}
            className="text-left py-2 hover:text-brass border-b border-white/5"
          >
            Home Experience
          </button>
          <button
            onClick={() => scrollToSection('scene-kacchi-reveal')}
            className="text-left py-2 hover:text-brass border-b border-white/5"
          >
            Shahi Kacchi Biryani
          </button>
          <button
            onClick={() => scrollToSection('scene-explosion')}
            className="text-left py-2 hover:text-brass border-b border-white/5"
          >
            3D Kacchi Anatomy
          </button>
          <button
            onClick={() => scrollToSection('scene-menu')}
            className="text-left py-2 hover:text-brass border-b border-white/5"
          >
            Bangladeshi Menu
          </button>
          <button
            onClick={() => scrollToSection('scene-story')}
            className="text-left py-2 hover:text-brass border-b border-white/5"
          >
            Our Story & Heritage
          </button>
          <button
            onClick={() => scrollToSection('scene-reservation')}
            className="text-left py-2 text-terracotta font-semibold"
          >
            Reserve A Table (Dhaka)
          </button>
        </div>
      )}
    </header>
  );
};
