import React, { useId } from 'react';

export type NiraMood = 'happy' | 'cheer' | 'think' | 'wave' | 'sleep';

/** Maskot Nira: tetes nira manis dengan tunas daun kelapa, pipi merah muda, dan tangan mungil. */
export const Nira: React.FC<{ size?: number; mood?: NiraMood; className?: string; float?: boolean }> = ({
  size = 96,
  mood = 'happy',
  className = '',
  float = true,
}) => {
  const id = useId().replace(/:/g, '');
  const up = mood === 'cheer';
  return (
    <svg
      width={size}
      height={size * 1.22}
      viewBox="0 0 140 170"
      role="img"
      aria-label="Nira, maskot NIRA KITA"
      className={`shrink-0 ${float ? 'mascot-float' : ''} ${className}`}
    >
      <defs>
        <linearGradient id={`b${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#E7AE68" />
          <stop offset="0.55" stopColor="#C8853F" />
          <stop offset="1" stopColor="#9A612C" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5E9A6E" />
          <stop offset="1" stopColor="#2B5A44" />
        </linearGradient>
        <radialGradient id={`g${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9B8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE9B8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* bayangan tanah */}
      <ellipse cx="70" cy="160" rx="34" ry="5" fill="#18382C" opacity="0.16" />

      {/* daun kelapa di puncak */}
      <path d="M70 34 C70 24 70 20 70 14" stroke="#2B5A44" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 18 C58 4 40 2 26 12 C40 12 56 14 70 18Z" fill={`url(#l${id})`} />
      <path d="M70 18 C82 2 102 0 116 10 C102 12 86 14 70 18Z" fill="#3F7A57" />
      <path d="M70 20 C64 8 62 -2 70 -8 C78 -2 76 8 70 20Z" fill="#74AE7E" transform="translate(0 6)" />

      {/* badan tetes */}
      <path d="M70 30 C70 30 20 88 20 120 a50 50 0 0 0 100 0 C120 88 70 30 70 30Z" fill={`url(#b${id})`} />
      <path d="M70 30 C70 30 120 88 120 120 a50 50 0 0 1 -34 47 C108 140 104 84 70 30Z" fill="#7A4A20" opacity="0.28" />
      <circle cx="70" cy="110" r="42" fill={`url(#g${id})`} opacity="0.35" />
      {/* kilau */}
      <ellipse cx="42" cy="100" rx="7" ry="15" fill="#FFF6E0" opacity="0.55" transform="rotate(14 42 100)" />
      <circle cx="50" cy="76" r="3.5" fill="#FFF6E0" opacity="0.7" />

      {/* tangan */}
      {mood === 'wave' ? (
        <>
          <ellipse cx="20" cy="124" rx="7" ry="10" fill="#B87943" transform="rotate(20 20 124)" />
          <ellipse cx="122" cy="96" rx="7" ry="11" fill="#B87943" transform="rotate(-35 122 96)" />
        </>
      ) : up ? (
        <>
          <ellipse cx="18" cy="96" rx="7" ry="11" fill="#B87943" transform="rotate(35 18 96)" />
          <ellipse cx="122" cy="96" rx="7" ry="11" fill="#B87943" transform="rotate(-35 122 96)" />
        </>
      ) : (
        <>
          <ellipse cx="20" cy="126" rx="7" ry="10" fill="#B87943" transform="rotate(18 20 126)" />
          <ellipse cx="120" cy="126" rx="7" ry="10" fill="#B87943" transform="rotate(-18 120 126)" />
        </>
      )}

      {/* wajah */}
      {mood === 'sleep' ? (
        <>
          <path d="M44 114 Q52 120 60 114" stroke="#2A1A10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M80 114 Q88 120 96 114" stroke="#2A1A10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="52" cy="114" rx="7.5" ry={up ? 8.5 : 9.5} fill="#2A1A10" />
          <ellipse cx="88" cy="114" rx="7.5" ry={up ? 8.5 : 9.5} fill="#2A1A10" />
          <circle cx="55" cy="110" r="2.8" fill="#FFFDF8" />
          <circle cx="91" cy="110" r="2.8" fill="#FFFDF8" />
          <circle cx="49.5" cy="118" r="1.4" fill="#FFFDF8" opacity="0.8" />
          <circle cx="85.5" cy="118" r="1.4" fill="#FFFDF8" opacity="0.8" />
        </>
      )}
      {mood === 'think' && (
        <>
          <path d="M42 100 Q52 95 60 99" stroke="#2A1A10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80 99 Q90 95 98 100" stroke="#2A1A10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="38" cy="130" rx="8" ry="4.5" fill="#E0685A" opacity="0.5" />
      <ellipse cx="102" cy="130" rx="8" ry="4.5" fill="#E0685A" opacity="0.5" />
      {(mood === 'happy' || mood === 'wave' || mood === 'sleep') && (
        <path d="M60 132 Q70 143 80 132" stroke="#2A1A10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {mood === 'cheer' && <path d="M58 130 Q70 150 82 130Z" fill="#2A1A10" />}
      {mood === 'cheer' && <path d="M63 138 Q70 144 77 138 Q70 135 63 138Z" fill="#E0685A" />}
      {mood === 'think' && <path d="M62 136 Q70 133 78 137" stroke="#2A1A10" strokeWidth="3.5" fill="none" strokeLinecap="round" />}

      {/* kaki */}
      <ellipse cx="54" cy="158" rx="11" ry="6" fill="#7A4A20" />
      <ellipse cx="86" cy="158" rx="11" ry="6" fill="#7A4A20" />
    </svg>
  );
};
