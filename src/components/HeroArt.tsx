import React from 'react';

/**
 * Ilustrasi hero SVG orisinal: lereng kebun kelapa dengan lapisan kabut, matahari pagi, dan penderes
 * yang digambar sebagai siluet dari kejauhan. Pengganti sementara sampai ada foto atau ilustrasi asli Cilongok.
 */
export const HeroArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 390 420"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    role="img"
    aria-label="Ilustrasi kebun kelapa di lereng bukit saat pagi"
  >
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F3E3C3" />
        <stop offset="0.55" stopColor="#F7E9D0" />
        <stop offset="1" stopColor="#F7F3E9" />
      </linearGradient>
      <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFF4D6" stopOpacity="1" />
        <stop offset="0.45" stopColor="#F2C98A" stopOpacity="0.9" />
        <stop offset="1" stopColor="#F2C98A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9C3A6" />
        <stop offset="1" stopColor="#B9BC9C" />
      </linearGradient>
      <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7F9B7B" />
        <stop offset="1" stopColor="#5E8068" />
      </linearGradient>
      <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2F5C48" />
        <stop offset="1" stopColor="#1C4031" />
      </linearGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFDF8" stopOpacity="0" />
        <stop offset="1" stopColor="#FFFDF8" stopOpacity="0.85" />
      </linearGradient>
      <g id="palm">
        <path d="M0 0 C-2 -40 -3 -80 -1 -118" stroke="#3C2A1B" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g fill="#1E4533">
          <path d="M-1 -118 C-30 -128 -58 -118 -74 -96 C-50 -108 -28 -110 -1 -118Z" />
          <path d="M-1 -118 C28 -130 58 -120 76 -96 C52 -110 28 -112 -1 -118Z" />
          <path d="M-1 -118 C-20 -146 -42 -154 -62 -150 C-42 -142 -24 -132 -1 -118Z" />
          <path d="M-1 -118 C20 -148 44 -156 66 -150 C44 -142 24 -132 -1 -118Z" />
          <path d="M-1 -118 C-4 -150 -2 -168 6 -180 C8 -160 6 -140 -1 -118Z" />
        </g>
      </g>
    </defs>

    <rect width="390" height="420" fill="url(#sky)" />
    <circle cx="260" cy="150" r="120" fill="url(#sun)" />
    <circle cx="260" cy="150" r="34" fill="#FBE7BC" opacity="0.95" />

    {/* kabut melayang */}
    <g className="mist-drift" opacity="0.7">
      <ellipse cx="90" cy="120" rx="110" ry="14" fill="#FFFDF8" opacity="0.7" />
      <ellipse cx="320" cy="96" rx="90" ry="10" fill="#FFFDF8" opacity="0.6" />
    </g>

    {/* gunung jauh */}
    <path d="M0 250 C50 200 90 190 140 222 C190 150 250 150 300 214 C340 190 370 200 390 220 L390 420 L0 420Z" fill="url(#hillFar)" />
    <path d="M0 290 C60 258 110 262 170 280 C230 262 300 258 390 290 L390 420 L0 420Z" fill="url(#hillMid)" />

    {/* petak sawah di lereng tengah */}
    <g opacity="0.55" stroke="#F7E9D0" strokeWidth="1.2" fill="none">
      <path d="M20 318 C90 306 170 304 250 312" />
      <path d="M0 338 C90 322 190 322 290 332" />
      <path d="M60 300 C80 330 76 350 66 372" />
      <path d="M180 296 C186 322 190 344 186 372" />
    </g>

    <rect x="0" y="330" width="390" height="90" fill="url(#mist)" opacity="0.55" />

    {/* kebun kelapa */}
    <use href="#palm" transform="translate(52 392) scale(0.82)" />
    <use href="#palm" transform="translate(128 372) scale(0.62)" opacity="0.9" />
    <use href="#palm" transform="translate(318 396) scale(0.95)" />
    <use href="#palm" transform="translate(262 370) scale(0.6)" opacity="0.9" />

    {/* punggung bukit terdekat */}
    <path d="M0 372 C70 350 150 352 220 372 C290 388 340 366 390 372 L390 420 L0 420Z" fill="url(#hillNear)" />
    <path d="M0 400 C90 384 200 392 390 392 L390 420 L0 420Z" fill="#163428" />

    {/* siluet penderes kecil di jalan setapak (digambar dari jauh, tanpa wajah) */}
    <g transform="translate(196 366)" fill="#1B2B22">
      <circle cx="0" cy="-17" r="3.2" />
      <path d="M-3.5 -13 h7 l1.4 14 h-9.8Z" />
      <path d="M-6 -14 l-9 -2" stroke="#1B2B22" strokeWidth="1.5" />
      <rect x="-19" y="-20" width="5" height="9" rx="1.5" />
    </g>
  </svg>
);
