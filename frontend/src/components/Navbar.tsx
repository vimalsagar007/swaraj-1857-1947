import React from 'react';
import { Shield, Compass, Clock, MapPin, Users, Heart } from 'lucide-react';
import { AudioController } from './AudioController';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-charcoal-950/90 backdrop-blur-md border-b border-gold-500/20 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('top')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-charcoal-950 font-serif font-black shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="text-left">
            <h1 className="font-serif text-lg font-black tracking-widest text-parchment-50 group-hover:text-gold-400 transition-colors">
              SWARAJ
            </h1>
            <p className="text-[10px] text-gold-500 font-mono tracking-widest -mt-1">
              1857 — 1947
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-serif font-semibold tracking-wider text-parchment-200">
          <button
            onClick={() => onNavigate('ask-swaraj')}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-patriot-saffron" />
            <span>ASK AI</span>
          </button>
          <button
            onClick={() => onNavigate('directory')}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-gold-400" />
            <span>HEROES</span>
          </button>
          <button
            onClick={() => onNavigate('timeline')}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-patriot-green" />
            <span>TIMELINE</span>
          </button>
          <button
            onClick={() => onNavigate('map')}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-patriot-saffron" />
            <span>MAP</span>
          </button>
          <button
            onClick={() => onNavigate('tribute')}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors text-gold-500"
          >
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>TRIBUTE</span>
          </button>
        </nav>

        {/* Audio Controller */}
        <AudioController />
      </div>
    </header>
  );
};
