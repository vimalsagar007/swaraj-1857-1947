import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Flag, Award } from 'lucide-react';
import { TricolorFlag } from './TricolorFlag';

export const TributeSection: React.FC = () => {
  return (
    <div id="tribute" className="py-20 px-6 max-w-5xl mx-auto text-center border-t border-gray-800/80 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="space-y-8 bg-charcoal-800/90 border border-gold-500/40 rounded-3xl p-8 sm:p-12 glass-panel shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-patriot-saffron/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl" />

        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold-500/40 bg-charcoal-900 text-gold-400 text-xs tracking-widest uppercase font-semibold">
          <TricolorFlag size="sm" />
          <span>A Tribute to the Immortals</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-parchment-50 leading-tight">
          HOMAGE TO THE HEROES OF INDIA
        </h2>

        <p className="text-parchment-200 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-light">
          "India's freedom was shaped by countless lives, voices, movements and sacrifices. This experience is dedicated to those who stood against colonial rule and contributed to India's journey toward independence."
        </p>

        <div className="my-8 py-6 border-y border-gold-500/30 max-w-2xl mx-auto space-y-3">
          <p className="font-serif italic text-gold-400 text-base sm:text-lg font-medium">
            "Created as a humble digital tribute to the freedom fighters of India, so that their courage, sacrifice and contribution may be remembered by future generations."
          </p>
          <div className="pt-2">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Created by</span>
            <p className="font-serif text-xl font-bold text-parchment-50 tracking-wider">
              Vimal Sagar Yarraguntla
            </p>
            <p className="text-xs text-gold-500 font-light italic mt-0.5">
              With respect and gratitude to the freedom fighters of India.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-xs font-serif">
          <div className="p-4 bg-charcoal-900/80 rounded-xl border border-gray-800">
            <p className="text-gold-500 font-bold uppercase mb-1">Remember</p>
            <p className="text-parchment-300 font-light">May we remember their courage.</p>
          </div>
          <div className="p-4 bg-charcoal-900/80 rounded-xl border border-gray-800">
            <p className="text-patriot-saffron font-bold uppercase mb-1">Understand</p>
            <p className="text-parchment-300 font-light">May we understand their sacrifices.</p>
          </div>
          <div className="p-4 bg-charcoal-900/80 rounded-xl border border-gray-800">
            <p className="text-patriot-green font-bold uppercase mb-1">Preserve</p>
            <p className="text-parchment-300 font-light">May we preserve their stories.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
