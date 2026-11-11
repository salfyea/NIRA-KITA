import React, { useId } from 'react';

export type NiraMood = 'happy' | 'cheer' | 'think' | 'wave' | 'sleep';

/**
 * Maskot Nira: kelapa hijau muda yang imut, pucuk daun kelapa di atas, dan setetes nira manis di bukaannya.
 * Pipi merah muda, mata besar berkilau, tangan dan kaki mungil.
 */
export const Nira: React.FC<{ size?: number; mood?: NiraMood; className?: string; float?: boolean }> = ({
  size = 96,
  mood = 'happy',
  className = '',
  float = true,
}) => {
  const id = useId().replace(/:/g, '');
  const up = mood === 'cheer';
  const arm = '#5DAF4A';
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
        <radialGradient id={`b${id}`} cx="0.38" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#D6F08E" />
          <stop offset="0.45" stopColor="#8FD05E" />
          <stop offset="1" stopColor="#4C9B45" />
        </radialGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6CBF6B" />
          <stop offset="1" stopColor="#2B6E4A" />
        </linearGradient>
        <linearGradient id={`n${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6C777" />
          <stop offset="1" stopColor="#C8853F" />
        </linearGradient>
      </defs>

      {/* bayangan tanah */}
      <ellipse cx="70" cy="163" rx="36" ry="5" fill="#18382C" opacity="0.18" />

      {/* kaki */}
      <ellipse cx="52" cy="158" rx="12" ry="6.5" fill="#3F8A3C" />
      <ellipse cx="88" cy="158" rx="12" ry="6.5" fill="#3F8A3C" />

      {/* tangan (di belakang badan) */}
      {mood === 'wave' ? (
        <>
          <ellipse cx="17" cy="124" rx="8" ry="11" fill={arm} transform="rotate(18 17 124)" />
          <ellipse cx="124" cy="92" rx="8" ry="12" fill={arm} transform="rotate(-38 124 92)" />
        </>
      ) : up ? (
        <>
          <ellipse cx="16" cy="88" rx="8" ry="12" fill={arm} transform="rotate(38 16 88)" />
          <ellipse cx="124" cy="88" rx="8" ry="12" fill={arm} transform="rotate(-38 124 88)" />
        </>
      ) : (
        <>
          <ellipse cx="17" cy="126" rx="8" ry="11" fill={arm} transform="rotate(16 17 126)" />
          <ellipse cx="123" cy="126" rx="8" ry="11" fill={arm} transform="rotate(-16 123 126)" />
        </>
      )}

      {/* badan: kelapa hijau muda yang bulat */}
      <path
        d="M70 40 C102 40 126 62 126 102 C126 140 102 162 70 162 C38 162 14 140 14 102 C14 62 38 40 70 40Z"
        fill={`url(#b${id})`}
      />
      {/* alur sabut kelapa */}
      <g fill="none" stroke="#3F8A3C" strokeWidth="2.4" strokeLinecap="round" opacity="0.35">
        <path d="M70 48 C58 70 54 92 56 112" />
        <path d="M70 48 C82 70 86 92 84 112" />
        <path d="M44 56 C30 80 26 104 32 126" />
        <path d="M96 56 C110 80 114 104 108 126" />
      </g>
      {/* kilau */}
      <ellipse cx="38" cy="78" rx="8" ry="16" fill="#FFFFFF" opacity="0.5" transform="rotate(28 38 78)" />
      <circle cx="52" cy="58" r="3.6" fill="#FFFFFF" opacity="0.75" />

      {/* bukaan atas: daging kelapa dan setetes nira */}
      <ellipse cx="70" cy="42" rx="25" ry="9" fill="#EAF3C4" />
      <ellipse cx="70" cy="42" rx="25" ry="9" fill="none" stroke="#5DAF4A" strokeWidth="3" />
      <ellipse cx="70" cy="43" rx="17" ry="5.5" fill={`url(#n${id})`} />
      <ellipse cx="64" cy="41.5" rx="5" ry="1.6" fill="#FFF3D6" opacity="0.85" />

      {/* tunas daun kelapa */}
      <path d="M70 40 C70 28 70 22 70 14" stroke="#2B6E4A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 20 C58 4 38 2 24 14 C40 14 56 16 70 20Z" fill={`url(#l${id})`} />
      <path d="M70 20 C82 4 102 2 116 14 C100 14 84 16 70 20Z" fill="#4FA56B" />
      <path d="M70 22 C64 10 62 0 70 -6 C78 0 76 10 70 22Z" fill="#8ED18F" transform="translate(0 6)" />

      {/* wajah */}
      {mood === 'sleep' ? (
        <>
          <path d="M42 104 Q51 112 60 104" stroke="#2A1A10" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M80 104 Q89 112 98 104" stroke="#2A1A10" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="104" rx="9" ry={up ? 10 : 11.5} fill="#2A1A10" />
          <ellipse cx="90" cy="104" rx="9" ry={up ? 10 : 11.5} fill="#2A1A10" />
          <circle cx="53.5" cy="99" r="3.6" fill="#FFFDF8" />
          <circle cx="93.5" cy="99" r="3.6" fill="#FFFDF8" />
          <circle cx="46.5" cy="109" r="1.8" fill="#FFFDF8" opacity="0.85" />
          <circle cx="86.5" cy="109" r="1.8" fill="#FFFDF8" opacity="0.85" />
        </>
      )}
      {mood === 'think' && (
        <>
          <path d="M38 88 Q50 82 61 87" stroke="#2A1A10" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M79 87 Q90 82 102 88" stroke="#2A1A10" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="32" cy="124" rx="9" ry="5.5" fill="#FF7A8A" opacity="0.55" />
      <ellipse cx="108" cy="124" rx="9" ry="5.5" fill="#FF7A8A" opacity="0.55" />
      {(mood === 'happy' || mood === 'wave' || mood === 'sleep') && (
        <path d="M57 124 Q70 140 83 124" stroke="#2A1A10" strokeWidth="3.8" fill="none" strokeLinecap="round" />
      )}
      {mood === 'cheer' && <path d="M54 122 Q70 148 86 122Z" fill="#2A1A10" />}
      {mood === 'cheer' && <path d="M61 134 Q70 142 79 134 Q70 130 61 134Z" fill="#FF7A8A" />}
      {mood === 'think' && <path d="M62 132 Q70 128 78 133" stroke="#2A1A10" strokeWidth="3.8" fill="none" strokeLinecap="round" />}
    </svg>
  );
};
