import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, Users, Sparkles, ChevronRight } from 'lucide-react';
import { PersonData, PersonModal } from './PersonModal';

interface DirectoryProps {
  onAskAIAboutPerson: (personName: string) => void;
}

const CATEGORIES = [
  'All',
  'National Leaders',
  'Revolutionaries',
  'Women Leaders',
  'Tribal Leaders',
  'Military Leaders',
  'Social Reformers',
  'Regional Leaders'
];

export const FreedomFightersDirectory: React.FC<DirectoryProps> = ({ onAskAIAboutPerson }) => {
  const [fighters, setFighters] = useState<PersonData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  useEffect(() => {
    // Load dataset from backend API or local JSON fallback
    fetch('/data/freedom_fighters.json')
      .then(res => res.json())
      .then(data => setFighters(data))
      .catch(err => {
        console.error('Failed to fetch dataset:', err);
      });
  }, []);

  const filteredFighters = fighters.filter(ff => {
    const matchesCategory = selectedCategory === 'All' || ff.category === selectedCategory;
    const matchesSearch =
      ff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ff.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ff.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="directory" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-charcoal-800 text-gold-400 text-xs tracking-wider uppercase mb-3">
          <Users className="w-3.5 h-3.5 text-patriot-saffron" />
          <span>Freedom Fighter Directory</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment-50 mb-3">
          HEROES OF THE FREEDOM STRUGGLE
        </h2>
        <p className="text-parchment-300 text-sm max-w-2xl mx-auto font-light">
          Discover the courageous leaders, revolutionaries, women, tribal warriors, and reformers who gave India its freedom.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-6 mb-10 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, region (e.g. Punjab, Andhra, Bengal), or movement..."
            className="w-full bg-charcoal-800/90 border border-gold-500/30 rounded-xl pl-12 pr-4 py-3 text-parchment-100 placeholder-gray-500 focus:outline-none focus:border-gold-500 text-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full font-serif transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-lg'
                  : 'bg-charcoal-800 text-parchment-200 border border-gray-700 hover:border-gold-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Freedom Fighter Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFighters.map((ff) => (
          <motion.div
            key={ff.id}
            whileHover={{ y: -6 }}
            className="bg-charcoal-800/80 border border-gold-500/20 hover:border-gold-500/60 rounded-xl overflow-hidden glass-panel flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="relative h-56 overflow-hidden bg-charcoal-900">
                <img
                  src={ff.image_url}
                  alt={ff.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-2 text-[10px] bg-charcoal-950/90 border border-gold-500/30 text-gold-400 font-serif px-2.5 py-0.5 rounded uppercase">
                  {ff.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-bold text-parchment-50 group-hover:text-gold-400 transition-colors">
                  {ff.name}
                </h3>
                {ff.title && (
                  <p className="text-xs text-gold-500 italic font-serif">"{ff.title}"</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <span>{ff.birth_year}–{ff.death_year}</span>
                  <span className="text-patriot-saffron font-medium">{ff.region}</span>
                </div>
                <p className="text-xs text-parchment-300 line-clamp-2 pt-1 font-light">
                  {ff.biography}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedPerson(ff)}
                className="w-full py-2 bg-charcoal-700/80 hover:bg-gold-500 hover:text-charcoal-950 border border-gold-500/30 text-gold-400 font-serif font-semibold text-xs tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>VIEW ARCHIVAL PROFILE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Person Profile Modal */}
      <PersonModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onAskAIAboutPerson={onAskAIAboutPerson}
      />
    </div>
  );
};
