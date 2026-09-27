import React from 'react';

interface TricolorFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TricolorFlag: React.FC<TricolorFlagProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'w-5 h-3.5',
    md: 'w-7 h-5',
    lg: 'w-10 h-7'
  }[size];

  return (
    <div
      className={`inline-flex flex-col justify-between overflow-hidden rounded border border-gold-500/40 shadow-md ${dimensions} ${className}`}
      title="National Flag of India (Tiranga)"
    >
      {/* Saffron Band */}
      <div className="h-1/3 w-full bg-[#FF9933]"></div>
      
      {/* White Band with Ashoka Chakra */}
      <div className="h-1/3 w-full bg-white flex items-center justify-center relative">
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#000080]">
          <circle cx="12" cy="12" r="9" fill="none" stroke="#000080" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="1.5" fill="#000080" />
          {/* 24 Spokes */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="12"
              y1="12"
              x2={12 + 8.5 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={12 + 8.5 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#000080"
              strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>

      {/* India Green Band */}
      <div className="h-1/3 w-full bg-[#138808]"></div>
    </div>
  );
};
