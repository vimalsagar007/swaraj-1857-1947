import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Flame, Shield, ArrowRight } from 'lucide-react';
import { TricolorFlag } from './TricolorFlag';

interface HeroSequenceProps {
  onExplore: () => void;
  onAskAI: () => void;
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({ onExplore, onAskAI }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 2200);
    const timer2 = setTimeout(() => setStep(2), 4600);
    const timer3 = setTimeout(() => setStep(3), 7000);
    const timer4 = setTimeout(() => setStep(4), 9400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-charcoal-950 overflow-hidden bg-grain-pattern">
      {/* Cinematic Ambient Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-950 opacity-95" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-patriot-saffron/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-gold-500 rounded-full animate-ping" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-patriot-saffron rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-parchment-200 rounded-full animate-bounce" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2 }}
              className="space-y-4"
            >
              <span className="text-gold-500 tracking-[0.4em] uppercase text-sm font-semibold">Archival Chronicle</span>
              <h1 className="font-serif text-7xl md:text-9xl font-black text-parchment-100 tracking-wider gold-border-glow inline-block px-8 py-4 border border-gold-500/20 bg-charcoal-900/60 rounded-lg">
                1857
              </h1>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="space-y-4"
            >
              <Flame className="w-12 h-12 text-patriot-saffron mx-auto animate-pulse" />
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-widest text-parchment-100 uppercase">
                The First Great Sparks of Resistance
              </h2>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2 }}
              className="space-y-4"
            >
              <span className="text-patriot-green tracking-[0.4em] uppercase text-sm font-semibold">Triumph of Sovereign Spirit</span>
              <h1 className="font-serif text-7xl md:text-9xl font-black text-gold-500 tracking-wider border border-gold-500/30 inline-block px-8 py-4 bg-charcoal-900/80 rounded-lg">
                1947
              </h1>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="space-y-4"
            >
              <Sparkles className="w-12 h-12 text-gold-500 mx-auto" />
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-widest text-parchment-100 uppercase">
                The Dawn of Independence
              </h2>
            </motion.div>
          )}

          {step >= 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold-500/40 bg-charcoal-800/80 text-gold-400 text-xs tracking-widest uppercase font-semibold shadow-xl">
                <TricolorFlag size="sm" />
                <span>Agentic AI Freedom Struggle Platform</span>
              </div>

              <div>
                <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tight text-parchment-50 mb-2 flex items-center justify-center gap-4">
                  SWARAJ <TricolorFlag size="lg" className="inline-block shadow-2xl" />
                </h1>
                <p className="font-serif text-2xl md:text-4xl text-gold-500 tracking-widest font-semibold">
                  1857 — 1947
                </p>
              </div>

              <p className="max-w-2xl mx-auto text-parchment-300 text-base md:text-lg leading-relaxed font-light italic">
                "India's freedom was not achieved by one person. It was built through generations of courage, sacrifice, resistance, organization and leadership."
              </p>

              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Remember the struggle. Discover the heroes. Understand the history.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={onExplore}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-charcoal-950 font-serif font-bold tracking-widest text-sm rounded-lg hover:brightness-110 transition-all shadow-xl hover:shadow-gold-500/20 flex items-center justify-center gap-3 group"
                >
                  <span>EXPLORE THE JOURNEY</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onAskAI}
                  className="w-full sm:w-auto px-8 py-4 bg-charcoal-800/90 hover:bg-charcoal-700 text-parchment-100 border border-gold-500/40 font-serif font-semibold tracking-widest text-sm rounded-lg transition-all flex items-center justify-center gap-3"
                >
                  <Compass className="w-4 h-4 text-patriot-saffron" />
                  <span>ASK SWARAJ AI</span>
                </button>
              </div>

              <div className="pt-8 text-xs text-gray-500 font-serif border-t border-gray-800/60 max-w-md mx-auto">
                Dedicated homage by <span className="text-gold-500 font-medium">Vimal Sagar Yarraguntla</span> to India's freedom fighters.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
