import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, ExternalLink, Calendar, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  location: string;
  region: string;
  category: string;
  description: string;
  key_figures: string[];
  impact: string;
  image_url: string;
  image_source: string;
}

export const InteractiveTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    fetch('/data/timeline_events.json')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        if (data.length > 0) setActiveEvent(data[0]);
      })
      .catch(err => console.error('Failed to load timeline dataset:', err));
  }, []);

  return (
    <div id="timeline" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-charcoal-800 text-gold-400 text-xs tracking-wider uppercase mb-3">
          <Clock className="w-3.5 h-3.5 text-patriot-saffron" />
          <span>Chronological Freedom Journey</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment-50 mb-3">
          1857 — 1947 HISTORICAL TIMELINE
        </h2>
        <p className="text-parchment-300 text-sm max-w-2xl mx-auto font-light">
          Traverse ninety years of fierce resistance, mass satyagraha movements, revolutionary actions, and national liberation.
        </p>
      </div>

      {/* Horizontal Year Selector Track */}
      <div className="relative mb-12 overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex items-center gap-4 min-w-max px-4">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setActiveEvent(ev)}
              className={`flex flex-col items-center px-5 py-3 rounded-xl border transition-all font-serif ${
                activeEvent?.id === ev.id
                  ? 'bg-gold-500 text-charcoal-950 border-gold-400 font-bold scale-105 shadow-xl'
                  : 'bg-charcoal-800/80 text-parchment-200 border-gray-800 hover:border-gold-500/40'
              }`}
            >
              <span className="text-lg font-black">{ev.year}</span>
              <span className="text-[10px] uppercase tracking-wider truncate max-w-[100px]">
                {ev.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Event Showcase Card */}
      {activeEvent && (
        <motion.div
          key={activeEvent.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal-800/90 border border-gold-500/30 rounded-2xl p-6 sm:p-10 glass-panel shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          {/* Event Image */}
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-gold-500/30 bg-charcoal-900 h-80">
              <img
                src={activeEvent.image_url}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-patriot-saffron text-charcoal-950 font-bold font-serif text-xs px-3 py-1 rounded shadow">
                {activeEvent.year}
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-center font-mono">
              {activeEvent.image_source}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold">
                {activeEvent.category} • {activeEvent.date}
              </span>
              <h3 className="font-serif text-3xl font-bold text-parchment-50 mt-1">
                {activeEvent.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-patriot-saffron mt-2">
                <MapPin className="w-4 h-4" />
                <span>{activeEvent.location} ({activeEvent.region})</span>
              </div>
            </div>

            <p className="text-parchment-200 text-sm leading-relaxed font-light">
              {activeEvent.description}
            </p>

            {/* Key Figures */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gold-400" />
                <span>Key Historical Figures</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeEvent.key_figures.map((fig, idx) => (
                  <span key={idx} className="text-xs bg-charcoal-900 border border-gold-500/30 text-parchment-100 px-3 py-1 rounded-full">
                    {fig}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="bg-charcoal-900/80 p-4 rounded-xl border border-gray-800 space-y-1">
              <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Historical Impact</h4>
              <p className="text-xs text-parchment-300 leading-relaxed">{activeEvent.impact}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
