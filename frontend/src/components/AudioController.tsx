import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { TricolorFlag } from './TricolorFlag';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    return localStorage.getItem('swaraj_music_enabled') === 'true';
  });
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      // Primary local path with fallback to Internet Archive stream
      audio.src = '/audio/vande_mataram.mp3';
      audio.loop = true;
      audio.volume = volume;

      audio.onerror = () => {
        console.warn('Local Vande Mataram audio failed, using streaming fallback');
        audio.src = 'https://archive.org/download/ar-rahman-vande-mataram-1997/01.%20A.R.%20Rahman%20-%20Maa%20Tujhe%20Salaam.mp3';
      };

      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('swaraj_music_enabled', isPlaying.toString());

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay blocked by browser policy. Click play to listen.', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3 bg-charcoal-800/90 backdrop-blur-md border border-gold-500/40 rounded-full px-4 py-2 text-xs text-parchment-200 shadow-xl hover:border-gold-500 transition-all">
      <TricolorFlag size="sm" />
      
      <button
        onClick={toggleMusic}
        className="flex items-center gap-2 hover:text-gold-500 transition-colors focus:outline-none"
        title="Toggle A.R. Rahman - Vande Mataram"
      >
        <Music className={`w-3.5 h-3.5 text-patriot-saffron ${isPlaying ? 'animate-spin' : ''}`} />
        <span className="font-serif tracking-wider font-bold text-parchment-100 flex items-center gap-1.5">
          VANDE MATARAM <span className="text-[10px] opacity-75 font-sans font-normal">(A.R. RAHMAN)</span>
        </span>
        {isPlaying ? (
          <div className="flex items-center gap-1 text-patriot-saffron">
            <Pause className="w-3.5 h-3.5 fill-current" />
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-400">
            <Play className="w-3.5 h-3.5 fill-current" />
            <VolumeX className="w-4 h-4" />
          </div>
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
          className="w-16 accent-gold-500 cursor-pointer h-1 rounded bg-charcoal-700"
          title="Adjust Volume"
        />
      )}
    </div>
  );
};
