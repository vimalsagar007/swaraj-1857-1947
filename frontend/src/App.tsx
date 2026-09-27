import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSequence } from './components/HeroSequence';
import { AskSwarajAI } from './components/AskSwarajAI';
import { FreedomFightersDirectory } from './components/FreedomFightersDirectory';
import { InteractiveTimeline } from './components/InteractiveTimeline';
import { InteractiveMap } from './components/InteractiveMap';
import { TributeSection } from './components/TributeSection';

export const App: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskAIWithPrompt = (promptText: string) => {
    scrollToSection('ask-swaraj');
    const inputEl = document.querySelector<HTMLInputElement>('#ask-swaraj input');
    if (inputEl) {
      inputEl.value = promptText;
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-parchment-100 flex flex-col font-sans">
      <Navbar onNavigate={scrollToSection} />

      <main className="flex-1">
        {/* Hero Experience */}
        <HeroSequence
          onExplore={() => scrollToSection('directory')}
          onAskAI={() => scrollToSection('ask-swaraj')}
        />

        {/* Ask Swaraj AI Engine */}
        <AskSwarajAI />

        {/* Freedom Fighters Directory */}
        <FreedomFightersDirectory onAskAIAboutPerson={handleAskAIWithPrompt} />

        {/* Interactive 1857-1947 Timeline */}
        <InteractiveTimeline />

        {/* Geographical Hotspots India Map */}
        <InteractiveMap onAskAIAboutLocation={handleAskAIWithPrompt} />

        {/* Homage & Tribute Section */}
        <TributeSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-charcoal-950 py-8 px-6 text-center text-xs text-gray-500 font-serif">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-gold-500 font-semibold tracking-widest uppercase">
            SWARAJ 1857–1947 | Cinematic Agentic AI Historical Platform
          </p>
          <p>
            Created as a digital tribute by <span className="text-parchment-200 font-medium">Vimal Sagar Yarraguntla</span>.
          </p>
          <p className="text-[11px] text-gray-600">
            Powered by RAG • MCP • A2A Multi-Agent Architecture • Google Gemini • Agent Runtime • Public Archives
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
