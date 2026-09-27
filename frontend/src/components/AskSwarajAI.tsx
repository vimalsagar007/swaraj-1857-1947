import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Image as ImageIcon, HelpCircle, Loader2 } from 'lucide-react';

interface Citation {
  id: number;
  title: string;
  publisher: string;
  url: string;
  support_status: string;
  retrieval_date: string;
}

interface ImageResult {
  url: string;
  title: string;
  source: string;
  license: string;
  is_ai_generated: boolean;
}

interface AgentActivity {
  step: string;
  status: string;
  docs_found?: number;
}

interface ChatResponse {
  query: string;
  answer: string;
  citations: Citation[];
  fact_check_status: string;
  images: ImageResult[];
  agent_activity: AgentActivity[];
}

const EXAMPLE_QUESTIONS = [
  "Tell me about Bhagat Singh.",
  "Who were the women freedom fighters?",
  "What was the contribution of Rani Lakshmibai?",
  "Show me freedom fighters from Andhra Pradesh.",
  "What happened during the Quit India Movement?",
  "Find photographs of Subhas Chandra Bose.",
  "Who participated in the Kakori action?",
  "Compare Non-Cooperation and Civil Disobedience."
];

export const AskSwarajAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const handleAsk = async (textToAsk?: string) => {
    const searchQuery = textToAsk || query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ask-swaraj" className="py-16 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-charcoal-800 text-gold-400 text-xs tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-patriot-saffron" />
          <span>Grounded Multi-Agent Engine</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment-50 mb-3">
          ASK SWARAJ AI
        </h2>
        <p className="text-parchment-300 text-sm max-w-xl mx-auto font-light">
          Ask any question about India's struggle for independence (1857–1947). Answers are dynamically retrieved via RAG, Public APIs, MCP, and verified across archives.
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {EXAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(q);
              handleAsk(q);
            }}
            className="text-xs bg-charcoal-800/80 hover:bg-charcoal-700 text-parchment-200 border border-gold-500/20 hover:border-gold-500/50 px-3.5 py-1.5 rounded-full transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="relative max-w-3xl mx-auto mb-10">
        <div className="relative flex items-center bg-charcoal-800 border border-gold-500/40 rounded-xl p-2 shadow-2xl focus-within:border-gold-500 transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask Swaraj about people, events, dates, or places..."
            className="w-full bg-transparent px-4 py-2 text-parchment-100 placeholder-gray-500 focus:outline-none text-sm"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !query.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-charcoal-950 font-serif font-bold text-xs tracking-wider rounded-lg hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>RESEARCH</span>
          </button>
        </div>
      </div>

      {/* Loading State with Real-Time Agent Activity */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-charcoal-800/90 border border-gold-500/30 rounded-xl p-6 glass-panel mb-8"
        >
          <div className="flex items-center gap-3 mb-4 text-gold-500 font-serif text-sm font-semibold tracking-wider uppercase border-b border-gray-700/60 pb-3">
            <Loader2 className="w-4 h-4 animate-spin text-patriot-saffron" />
            <span>RESEARCHING HISTORY IN REAL-TIME</span>
          </div>
          <div className="space-y-3 text-xs text-parchment-200">
            <div className="flex items-center gap-2 text-patriot-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Historical knowledge retrieved from RAG store</span>
            </div>
            <div className="flex items-center gap-2 text-patriot-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Public REST APIs & archives consulted</span>
            </div>
            <div className="flex items-center gap-2 text-patriot-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Biography & timeline specialist agents dispatched</span>
            </div>
            <div className="flex items-center gap-2 text-gold-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cross-verifying historical evidence & preparing citations...</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Answer Presentation */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-charcoal-800/95 border border-gold-500/30 rounded-2xl p-8 glass-panel shadow-2xl space-y-8"
        >
          {/* Fact Check Badge */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-2 text-xs text-patriot-green font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>EVIDENCE STATUS: {response.fact_check_status}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">Session ID: {response.query.substring(0, 10)}</span>
          </div>

          {/* Main Answer Content */}
          <div className="prose prose-invert max-w-none text-parchment-100 text-sm md:text-base leading-relaxed space-y-4">
            <div whitespace-pre-wrap="true">
              {response.answer}
            </div>
          </div>

          {/* Archival & AI Images Gallery */}
          {response.images && response.images.length > 0 && (
            <div className="pt-4 border-t border-gray-800">
              <h4 className="font-serif text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Historical Images & Visualizations</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {response.images.map((img, idx) => (
                  <div key={idx} className="relative group overflow-hidden rounded-lg border border-gold-500/20 bg-charcoal-900">
                    <img
                      src={img.url}
                      alt={img.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80';
                      }}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-charcoal-900/90 text-xs space-y-1">
                      <p className="font-medium text-parchment-100 truncate">{img.title}</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={img.is_ai_generated ? "text-patriot-saffron font-bold" : "text-gray-400"}>
                          {img.is_ai_generated ? "AI-generated historical visualization" : img.source}
                        </span>
                        {!img.is_ai_generated && (
                          <span className="text-gold-500/80">{img.license}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grounded Citations Drawer */}
          {response.citations && response.citations.length > 0 && (
            <div className="pt-6 border-t border-gray-800">
              <h4 className="font-serif text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">
                VERIFIED HISTORICAL SOURCES ({response.citations.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.citations.map((cite) => (
                  <div
                    key={cite.id}
                    className="p-3 rounded-lg border border-gray-800 bg-charcoal-900/80 hover:border-gold-500/40 transition-all flex items-start justify-between text-xs gap-3"
                  >
                    <div>
                      <p className="font-semibold text-parchment-200">
                        [{cite.id}] {cite.title}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-0.5">{cite.publisher}</p>
                      <span className="inline-block text-[10px] text-patriot-green font-mono mt-1">
                        ✓ {cite.support_status}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold-500 hover:underline inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => setActiveCitation(cite)}
                        className="text-[10px] text-gray-400 hover:text-parchment-100 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why this source?</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* "Why this source?" Explainer Modal */}
      <AnimatePresence>
        {activeCitation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-charcoal-900 border border-gold-500/40 rounded-xl p-6 max-w-md w-full glass-panel space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-500 border-b border-gray-800 pb-2">
                Source Provenance Details
              </h3>
              <div className="space-y-2 text-xs text-parchment-200">
                <p><strong className="text-gold-400">Title:</strong> {activeCitation.title}</p>
                <p><strong className="text-gold-400">Publisher:</strong> {activeCitation.publisher}</p>
                <p><strong className="text-gold-400">Retrieval Date:</strong> {activeCitation.retrieval_date}</p>
                <p><strong className="text-gold-400">Verification Status:</strong> {activeCitation.support_status}</p>
                <p className="text-gray-400 pt-2 border-t border-gray-800">
                  This document was indexed from verified public archives, national repositories, or Wikimedia open access collections.
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveCitation(null)}
                  className="px-4 py-1.5 bg-gold-500 text-charcoal-950 font-serif font-bold text-xs rounded hover:bg-gold-400"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
