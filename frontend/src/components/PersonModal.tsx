import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Flag, ExternalLink, Sparkles, Quote, Shield } from 'lucide-react';

export interface PersonData {
  id: string;
  name: string;
  title?: string;
  birth_year?: string;
  death_year?: string;
  birthplace?: string;
  region?: string;
  category?: string;
  movements?: string[];
  organizations?: string[];
  biography?: string;
  early_life?: string;
  historical_context?: string;
  major_contributions?: string[];
  quotes?: string[];
  image_url?: string;
  image_source?: string;
  is_ai_generated?: boolean;
  sources?: Array<{ title: string; url: string; publisher: string }>;
}

interface PersonModalProps {
  person: PersonData | null;
  onClose: () => void;
  onAskAIAboutPerson: (personName: string) => void;
}

export const PersonModal: React.FC<PersonModalProps> = ({ person, onClose, onAskAIAboutPerson }) => {
  if (!person) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-charcoal-900 border border-gold-500/40 rounded-2xl overflow-hidden glass-panel shadow-2xl my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-charcoal-950/80 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-patriot-saffron" />
              <span className="font-serif text-xs text-gold-500 tracking-widest uppercase font-semibold">
                Archival Hero Profile
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-parchment-100 hover:bg-charcoal-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
            {/* Main Header & Image Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Portrait */}
              <div className="space-y-2">
                <div className="relative overflow-hidden rounded-xl border border-gold-500/30 bg-charcoal-800">
                  <img
                    src={person.image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80'}
                    alt={person.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80';
                    }}
                    className="w-full h-72 object-cover"
                  />
                  {person.is_ai_generated && (
                    <div className="absolute top-2 left-2 bg-patriot-saffron text-charcoal-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      AI Historical Visualization
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 text-center font-mono">
                  {person.image_source || 'Wikimedia Commons (Public Domain)'}
                </p>
              </div>

              {/* Title & Key Attributes */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-parchment-50">
                    {person.name}
                  </h2>
                  {person.title && (
                    <p className="text-gold-500 font-serif italic text-lg font-medium mt-1">
                      "{person.title}"
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-parchment-200">
                  <div className="flex items-center gap-1.5 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-gray-700">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <span>{person.birth_year} – {person.death_year}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-gray-700">
                    <MapPin className="w-4 h-4 text-patriot-saffron" />
                    <span>{person.region} ({person.birthplace})</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-gray-700">
                    <Flag className="w-4 h-4 text-patriot-green" />
                    <span>{person.category}</span>
                  </div>
                </div>

                {person.movements && person.movements.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Movements:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {person.movements.map((m, idx) => (
                        <span key={idx} className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/30 px-2.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ask AI CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onAskAIAboutPerson(`Tell me about ${person.name} and their role in the freedom movement.`);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-serif font-bold text-xs tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ASK SWARAJ AI ABOUT {person.name.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Biography & Early Life */}
            <div className="space-y-4 border-t border-gray-800 pt-6">
              <h3 className="font-serif text-lg font-bold text-gold-500 uppercase tracking-wider">
                Historical Biography
              </h3>
              <p className="text-parchment-200 text-sm leading-relaxed">
                {person.biography}
              </p>
              {person.early_life && (
                <div className="bg-charcoal-800/60 p-4 rounded-xl border border-gray-800 space-y-1">
                  <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Early Life & Influences</h4>
                  <p className="text-xs text-parchment-300 leading-relaxed">{person.early_life}</p>
                </div>
              )}
            </div>

            {/* Major Contributions */}
            {person.major_contributions && person.major_contributions.length > 0 && (
              <div className="space-y-3 border-t border-gray-800 pt-6">
                <h3 className="font-serif text-lg font-bold text-gold-500 uppercase tracking-wider">
                  Major Contributions to Swaraj
                </h3>
                <ul className="space-y-2 text-sm text-parchment-200">
                  {person.major_contributions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-patriot-saffron font-bold text-base">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verified Quotes */}
            {person.quotes && person.quotes.length > 0 && (
              <div className="border-t border-gray-800 pt-6">
                <div className="bg-gradient-to-r from-charcoal-800 via-charcoal-850 to-charcoal-800 border-l-4 border-gold-500 p-4 rounded-r-xl space-y-2">
                  <Quote className="w-6 h-6 text-gold-500 opacity-60" />
                  {person.quotes.map((q, idx) => (
                    <p key={idx} className="font-serif italic text-parchment-100 text-sm">
                      "{q}"
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Sources & Citations */}
            {person.sources && person.sources.length > 0 && (
              <div className="border-t border-gray-800 pt-6 space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Archival Provenance Sources</h4>
                <div className="flex flex-wrap gap-3">
                  {person.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gold-400 hover:text-gold-300 bg-charcoal-800 px-3 py-1.5 rounded border border-gray-700 flex items-center gap-1.5"
                    >
                      <span>{s.title} ({s.publisher})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
