import React, { useId } from 'react';

/**
 * Vinyet kecil untuk kartu pilihan: komposisi dan palet sengaja berbeda satu sama lain
 * (peta desa berwarna sage-teal, kisah lisan berwarna hangat) supaya tidak terkesan seragam.
 */
export const Vignette: React.FC<{ kind: 'asal' | 'kisah'; className?: string }> = ({ kind, className = '' }) => {
  const id = useId().replace(/:/g, '');
  if (kind === 'asal') {
    return (
      <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
        <defs>
          <linearGradient id={`a${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D5E8DA" />
            <stop offset="1" stopColor="#9CC4B4" />
          </linearGradient>
        </defs>
        <rect width="200" height="100" fill={`url(#a${id})`} />
        <g opacity="0.35" stroke="#FFFFFF" strokeWidth="1">
          <path d="M0 25 H200 M0 50 H200 M0 75 H200 M40 0 V100 M80 0 V100 M120 0 V100 M160 0 V100" />
        </g>
        {/* lembar peta */}
        <g transform="rotate(-6 100 52)">
          <rect x="28" y="12" width="144" height="78" rx="8" fill="#FBF3DF" stroke="#C9B48A" strokeWidth="2" />
          <path d="M28 40 C60 30 80 56 112 44 C140 34 156 46 172 40 V52 C156 58 140 46 112 56 C80 68 60 42 28 52Z" fill="#9CCBD0" />
          <path d="M40 78 C62 62 80 76 104 62 C124 52 140 62 160 48" fill="none" stroke="#B9674C" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" />
          <g fill="#6AA878">
            <rect x="44" y="20" width="22" height="12" rx="2" />
            <rect x="124" y="64" width="24" height="14" rx="2" />
          </g>
          <circle cx="50" cy="78" r="4" fill="#B87943" />
        </g>
        {/* pin desa */}
        <g transform="translate(142 30)">
          <ellipse cx="0" cy="30" rx="10" ry="3" fill="#18382C" opacity="0.2" />
          <path d="M0 28 C-14 12 -14 -4 0 -4 C14 -4 14 12 0 28Z" fill="#B9674C" stroke="#FFFDF8" strokeWidth="2" />
          <circle cx="0" cy="6" r="5" fill="#FFFDF8" />
        </g>
        {/* kompas */}
        <g transform="translate(26 24)">
          <circle r="11" fill="#FFFDF8" stroke="#234B3A" strokeWidth="2" />
          <path d="M0 -8 L3 0 L0 8 L-3 0Z" fill="#234B3A" />
          <path d="M0 -8 L3 0 L-3 0Z" fill="#B9674C" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`k${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6CBA9" />
          <stop offset="1" stopColor="#E59E7A" />
        </linearGradient>
      </defs>
      <rect width="200" height="100" fill={`url(#k${id})`} />
      <circle cx="170" cy="18" r="22" fill="#FFE3BD" opacity="0.7" />
      <rect y="78" width="200" height="22" fill="#B9674C" opacity="0.55" />
      {/* tetua bertopi caping, siluet tanpa wajah */}
      <g transform="translate(58 82)">
        <path d="M-17 0 C-17 -28 -11 -38 0 -38 C11 -38 17 -28 17 0Z" fill="#7A4A20" />
        <circle cx="0" cy="-47" r="10" fill="#C68A52" />
        <path d="M-22 -50 C-12 -66 12 -66 22 -50 C10 -54 -10 -54 -22 -50Z" fill="#D9B16B" />
      </g>
      {/* anak yang mendengarkan */}
      <g transform="translate(132 82)">
        <path d="M-12 0 C-12 -20 -8 -28 0 -28 C8 -28 12 -20 12 0Z" fill="#2B5A44" />
        <circle cx="0" cy="-35" r="8" fill="#C68A52" />
      </g>
      {/* gelembung cerita berisi pongkor */}
      <g transform="translate(92 14)">
        <rect x="-2" y="0" width="68" height="36" rx="14" fill="#FFFDF8" />
        <path d="M6 32 L-6 46 L18 36Z" fill="#FFFDF8" />
        <rect x="14" y="7" width="12" height="22" rx="4" fill="#D9B16B" />
        <rect x="13.5" y="14" width="13" height="2" fill="#9A6B34" />
        <rect x="13.5" y="22" width="13" height="2" fill="#9A6B34" />
        <g fill="none" stroke="#B9674C" strokeWidth="2.5" strokeLinecap="round">
          <path d="M36 12 V24" />
          <path d="M43 8 V28" />
          <path d="M50 13 V23" />
        </g>
      </g>
    </svg>
  );
};
