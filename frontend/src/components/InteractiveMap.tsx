import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Sparkles, Compass, ChevronRight } from 'lucide-react';

interface LocationData {
  id: string;
  name: string;
  state: string;
  coordinates: { lat: number; lng: number };
  description: string;
  key_events: string[];
  key_figures: string[];
}

interface MapProps {
  onAskAIAboutLocation: (locationName: string) => void;
}

export const InteractiveMap: React.FC<MapProps> = ({ onAskAIAboutLocation }) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>(null);

  useEffect(() => {
    fetch('/data/locations.json')
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        if (data.length > 0) setSelectedLoc(data[0]);
      })
      .catch(err => console.error('Failed to load locations dataset:', err));
  }, []);

  return (
    <div id="map" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-charcoal-800 text-gold-400 text-xs tracking-wider uppercase mb-3">
          <Navigation className="w-3.5 h-3.5 text-patriot-saffron" />
          <span>Geographical Resistance Map</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment-50 mb-3">
          HISTORICAL HOTSPOTS OF FREEDOM
        </h2>
        <p className="text-parchment-300 text-sm max-w-2xl mx-auto font-light">
          Explore the epicenters of resistance across the Indian subcontinent from Meerut to Dandi, Champaran, Lahore, Chittagong, and Andhra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Location List Buttons */}
        <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 glass-panel space-y-3 max-h-[500px] overflow-y-auto">
          <h3 className="font-serif text-sm font-bold text-gold-500 uppercase tracking-wider mb-2">
            Historical Resistance Centers
          </h3>
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLoc(loc)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                selectedLoc?.id === loc.id
                  ? 'bg-gold-500 text-charcoal-950 border-gold-400 font-semibold shadow-lg'
                  : 'bg-charcoal-900/80 text-parchment-200 border-gray-800 hover:border-gold-500/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${selectedLoc?.id === loc.id ? 'text-charcoal-950' : 'text-patriot-saffron'}`} />
                <div>
                  <p className="font-serif text-sm">{loc.name}</p>
                  <p className={`text-[10px] ${selectedLoc?.id === loc.id ? 'text-charcoal-900' : 'text-gray-400'}`}>
                    {loc.state}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        {/* Selected Location Card & Map Display */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLoc && (
            <motion.div
              key={selectedLoc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal-800/90 border border-gold-500/30 rounded-2xl p-8 glass-panel shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between border-b border-gray-800 pb-4">
                <div>
                  <span className="text-xs uppercase text-gold-500 tracking-widest font-semibold">
                    {selectedLoc.state}
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-parchment-50">
                    {selectedLoc.name}
                  </h3>
                </div>
                <div className="text-right text-xs text-gray-400 font-mono">
                  GPS: {selectedLoc.coordinates.lat}°N, {selectedLoc.coordinates.lng}°E
                </div>
              </div>

              <p className="text-parchment-200 text-base leading-relaxed font-light">
                {selectedLoc.description}
              </p>

              {/* Connected Freedom Figures */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Associated Freedom Fighters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLoc.key_figures.map((fig, idx) => (
                    <span key={idx} className="text-xs bg-charcoal-900 border border-gold-500/30 text-parchment-100 px-3 py-1 rounded-full">
                      {fig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Invoke Agent Button */}
              <div className="pt-2">
                <button
                  onClick={() => onAskAIAboutLocation(`What happened in ${selectedLoc.name} during the freedom movement?`)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-charcoal-950 font-serif font-bold text-xs tracking-wider rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>RESEARCH {selectedLoc.name.toUpperCase()} WITH SWARAJ AI</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
