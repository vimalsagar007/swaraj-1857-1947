import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    return localStorage.getItem('swaraj_music_enabled') === 'true';
  });
  const [volume, setVolume] = useState<number>(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    localStorage.setItem('swaraj_music_enabled', isPlaying.toString());

    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Create warm tanpura drone sound using web audio synthesizer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3 frequency - Indian classical drone pitch
        gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
      } catch (err) {
        console.warn('Audio Context initialization deferred:', err);
      }
    } else {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3 bg-charcoal-800/80 backdrop-blur border border-gold-500/30 rounded-full px-4 py-1.5 text-xs text-parchment-200 shadow-lg">
      <button
        onClick={toggleMusic}
        className="flex items-center gap-2 hover:text-gold-500 transition-colors focus:outline-none"
        title="Toggle Ambient Instrumental Soundscape"
      >
        <Music className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
        <span className="font-serif tracking-wider font-semibold">
          MUSIC {isPlaying ? 'ON' : 'OFF'}
        </span>
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-patriot-saffron" />
        ) : (
          <VolumeX className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isPlaying && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 accent-gold-500 cursor-pointer h-1 rounded"
          title="Adjust Volume"
        />
      )}
    </div>
  );
};
