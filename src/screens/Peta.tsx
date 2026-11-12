import React from 'react';
import { Download, X } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Scene, SLUG_SCENE } from '../art/Scene';
import { ApprovalChip } from '../components/ui';
import { isLearnerVisible, useStore } from '../store';
import { t } from '../i18n';

/** Posisi pada kanvas 390 x 640. Jarak hanya perkiraan kasar tingkat desa (simulasi). */
const VILLAGES = [
  { id: 'REC-CLG-001', village: 'Pernasidi', x: 105, y: 372, dist: 1 },
  { id: 'REC-CLG-002', village: 'Panembangan', x: 288, y: 332, dist: 3 },
  { id: 'REC-CLG-004', village: 'Karangtengah', x: 232, y: 488, dist: 5 },
];
const W = 390;
const H = 640;
const km = (n: number) => t(`sekitar ${n} km`, `about ${n} km`);

const SERIF = "'DM Serif Display', Georgia, 'Times New Roman', serif";
const SANS = "Inter, 'Segoe UI', system-ui, sans-serif";

/** Pohon kelapa kecil: dipakai berulang lewat <use>. */
const PALMS: [number, number, number][] = [
  [44, 262, 0.9], [72, 276, 1], [30, 300, 0.8], [58, 318, 1.05], [28, 340, 0.9], [150, 300, 0.85], [176, 288, 1], [206, 304, 0.8],
  [320, 280, 0.95], [350, 300, 1], [336, 330, 0.85], [356, 356, 0.9], [60, 410, 1], [34, 432, 0.9], [84, 440, 0.85],
  [150, 420, 0.8], [180, 470, 1], [196, 440, 0.85], [270, 520, 0.9], [300, 548, 1.05], [330, 520, 0.85], [346, 560, 0.95],
  [250, 400, 0.85], [322, 410, 1], [350, 440, 0.9], [120, 520, 1], [92, 500, 0.85], [60, 540, 0.95],
].sort((a, b) => a[1] - b[1]) as [number, number, number][];

/** Pohon yang menumpuk di belakang rumah dan label desa dibuang supaya nama desa terbaca. */
const CLEAR_PALMS = PALMS.filter(([x, y]) => !VILLAGES.some((v) => Math.abs(x - v.x) < 72 && y > v.y - 52 && y < v.y + 62));

const ROUTE = 'M105 372 C150 345 235 356 288 332 C331 379 287 459 232 488 C168 520 82 452 105 372Z';

const Palm: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <use href="#pt-palm" x={x - 17 * s} y={y - 46 * s} width={34 * s} height={46 * s} />;

/** Satu desa: gugus rumah, tiang penanda, dan label nama. Bisa diketuk (juga dengan papan ketik). */
const VillageMark: React.FC<{ v: (typeof VILLAGES)[number]; done: boolean; selected: boolean; onSelect: () => void }> = ({ v, done, selected, onSelect }) => {
  const label = v.village;
  const bw = label.length * 7.1 + 22;
  const dk = km(v.dist);
  const dw = dk.length * 5.6 + 16;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${t('Desa', 'Village')} ${v.village}, ${dk}${done ? t(', sudah terkumpul', ', collected') : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* rumah-rumah */}
      <use href="#pt-house" x={v.x - 46} y={v.y - 8} width={32} height={29} />
      <use href="#pt-house" x={v.x + 14} y={v.y - 10} width={36} height={32} />
      <use href="#pt-house" x={v.x - 16} y={v.y + 6} width={30} height={27} />
      {/* area ketuk */}
      <circle cx={v.x} cy={v.y - 28} r={34} fill="transparent" />
      {selected && (
        <circle cx={v.x} cy={v.y - 30} r={22} fill="none" stroke="#B87943" strokeWidth={3}>
          <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* tiang dan penanda */}
      <line x1={v.x} y1={v.y - 12} x2={v.x} y2={v.y + 2} stroke="#5C4023" strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={v.x} cy={v.y + 3} rx={9} ry={3} fill="#234B3A" opacity={0.28} />
      <circle cx={v.x} cy={v.y - 30} r={17} fill={done ? '#234B3A' : '#8F5A2E'} stroke="#FFFDF8" strokeWidth={3.5} />
      {done ? (
        <path d={`M${v.x - 7} ${v.y - 30} l5 5 l9 -10`} fill="none" stroke="#FFFDF8" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d={`M${v.x} ${v.y - 40} a8 8 0 0 1 8 8 c0 6 -8 14 -8 14 c0 0 -8 -8 -8 -14 a8 8 0 0 1 8 -8z`} fill="#FFFDF8" />
          <circle cx={v.x} cy={v.y - 32} r={3} fill="#8F5A2E" />
        </>
      )}
      {/* label */}
      <rect x={v.x - bw / 2} y={v.y + 14} width={bw} height={21} rx={10.5} fill="#FFFDF8" stroke="#B87943" strokeWidth={1.2} />
      <text x={v.x} y={v.y + 28.5} textAnchor="middle" fontFamily={SANS} fontSize={12.5} fontWeight={700} fill="#18382C">
        {label}
      </text>
      <rect x={v.x - dw / 2} y={v.y + 37} width={dw} height={16} rx={8} fill="#234B3A" opacity={0.9} />
      <text x={v.x} y={v.y + 48.5} textAnchor="middle" fontFamily={SANS} fontSize={10} fontWeight={600} fill="#FFFDF8">
        {dk}
      </text>
    </g>
  );
};

/** Ilustrasi peta Cilongok: vektor murni supaya bisa diunduh untuk poster. */
const MapArt = React.forwardRef<SVGSVGElement, { collected: string[]; sel: string | null; onSelect: (id: string) => void }>(({ collected, sel, onSelect }, ref) => (
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} role="group" preserveAspectRatio="xMidYMid meet" aria-label={t('Peta ilustrasi Cilongok dengan tiga desa', 'Illustrated map of Cilongok with three villages')} className="block h-full w-full">
    <defs>
      <linearGradient id="pt-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F4C98A" />
        <stop offset="0.55" stopColor="#FBE3BB" />
        <stop offset="1" stopColor="#F4E8CB" />
      </linearGradient>
      <linearGradient id="pt-land" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C2D69B" />
        <stop offset="0.5" stopColor="#A9C48B" />
        <stop offset="1" stopColor="#8EB07A" />
      </linearGradient>
      <linearGradient id="pt-mtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7E9B86" />
        <stop offset="1" stopColor="#B5C0A0" />
      </linearGradient>
      <linearGradient id="pt-mtn2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#A7B79B" />
        <stop offset="1" stopColor="#CBD2B0" />
      </linearGradient>
      <radialGradient id="pt-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFF6DC" />
        <stop offset="0.45" stopColor="#FFE9B8" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFE9B8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pt-body" cx="0.38" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#E3EFC8" />
        <stop offset="0.5" stopColor="#B6CF8E" />
        <stop offset="1" stopColor="#7BA36A" />
      </radialGradient>
      <pattern id="pt-terrace" width="16" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">
        <rect width="16" height="7" fill="#CBDB82" />
        <path d="M0 5.5 Q4 3.5 8 5.5 T16 5.5" fill="none" stroke="#A7BD62" strokeWidth="1.4" />
        <path d="M0 1.8 Q4 0 8 1.8 T16 1.8" fill="none" stroke="#DBE79C" strokeWidth="1" />
      </pattern>
      <pattern id="pt-terrace2" width="14" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
        <rect width="14" height="6" fill="#B8CF7C" />
        <path d="M0 4.6 Q3.5 2.8 7 4.6 T14 4.6" fill="none" stroke="#93AE5A" strokeWidth="1.3" />
        <path d="M0 1.4 Q3.5 -0.4 7 1.4 T14 1.4" fill="none" stroke="#CBDD92" strokeWidth="0.9" />
      </pattern>
      <filter id="pt-paper" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.2  0 0 0 0.09 0" />
      </filter>
      <clipPath id="pt-clip">
        <rect x="15" y="15" width={W - 30} height={H - 30} rx="12" />
      </clipPath>
      {/* simbol */}
      <symbol id="pt-palm" viewBox="-2 -4 40 52">
        <path d="M15 46 Q17 28 17 14 L19 14 Q19 28 21 46Z" fill="#7A4F28" />
        <path d="M18 14 C8 4 -2 6 -2 12 C6 10 12 11 18 14Z" fill="#2F6A4B" />
        <path d="M18 14 C28 4 38 6 38 12 C30 10 24 11 18 14Z" fill="#4E8C63" />
        <path d="M18 14 C12 10 12 2 18 -2 C24 2 24 10 18 14Z" fill="#3F7A57" />
        <circle cx="16" cy="16" r="2.5" fill="#B87943" />
        <circle cx="21" cy="17" r="2.5" fill="#A0652F" />
      </symbol>
      <symbol id="pt-house" viewBox="0 0 38 34">
        <rect x="5" y="14" width="28" height="18" fill="#EBDAB9" />
        <path d="M1 15 L19 1 L37 15Z" fill="#B9674C" />
        <rect x="16" y="20" width="7" height="12" rx="1.5" fill="#7A4A20" />
        <rect x="8" y="18" width="5" height="5" fill="#F7D08E" />
        <rect x="26" y="18" width="5" height="5" fill="#F7D08E" />
      </symbol>
      <symbol id="pt-nira" viewBox="6 0 52 64">
        <path d="M32 19C45 19 53 28 53 41C53 53 45 60 32 60C19 60 11 53 11 41C11 28 19 19 32 19Z" fill="url(#pt-body)" />
        <ellipse cx="32" cy="20" rx="11" ry="4" fill="#F6F7DE" stroke="#8DB179" strokeWidth="1.6" />
        <ellipse cx="32" cy="20.6" rx="7.4" ry="2.4" fill="#E0A04C" />
        <path d="M32 19C32 13 32 10 32 6" stroke="#2B6E4A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M32 9C26 2 17 2 11 7C19 7 26 8 32 9Z" fill="#4FA56B" />
        <path d="M32 9C38 2 47 2 53 7C45 7 38 8 32 9Z" fill="#6CBF6B" />
        <ellipse cx="24.5" cy="41" rx="3.6" ry="4.4" fill="#2A1A10" />
        <ellipse cx="39.5" cy="41" rx="3.6" ry="4.4" fill="#2A1A10" />
        <circle cx="25.8" cy="39.4" r="1.4" fill="#FFFDF8" />
        <circle cx="40.8" cy="39.4" r="1.4" fill="#FFFDF8" />
        <ellipse cx="17.5" cy="48" rx="4" ry="2.6" fill="#FF7A8A" opacity="0.55" />
        <ellipse cx="46.5" cy="48" rx="4" ry="2.6" fill="#FF7A8A" opacity="0.55" />
        <path d="M27 48C29.5 52 34.5 52 37 48" stroke="#2A1A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </symbol>
    </defs>

    {/* kertas */}
    <rect width={W} height={H} fill="#F4E8CB" />
    <rect width={W} height={H} filter="url(#pt-paper)" />

    <g clipPath="url(#pt-clip)">
      {/* langit */}
      <rect x="0" y="0" width={W} height="230" fill="url(#pt-sky)" />
      <circle cx="318" cy="112" r="58" fill="url(#pt-sun)" />
      <circle cx="318" cy="112" r="17" fill="#FFF1CF" />
      {/* awan */}
      <g fill="#FFFDF8" opacity="0.85">
        <ellipse cx="70" cy="118" rx="26" ry="7" />
        <ellipse cx="88" cy="112" rx="18" ry="7" />
        <ellipse cx="238" cy="96" rx="22" ry="6" />
        <ellipse cx="254" cy="91" rx="14" ry="6" />
      </g>

      {/* Gunung Slamet (utara) */}
      <path d="M-10 214 L40 176 L84 156 L124 140 L160 112 L196 138 L236 154 L284 172 L340 190 L400 204 V232 H-10Z" fill="url(#pt-mtn2)" />
      <path d="M-10 222 L56 190 L110 168 L156 126 L168 120 L186 128 L232 168 L292 190 L346 206 L400 214 V240 H-10Z" fill="url(#pt-mtn)" />
      {/* punggungan */}
      <g fill="none" stroke="#5E7B68" strokeWidth="1.1" strokeLinecap="round" opacity="0.55">
        <path d="M158 128 L146 158 L134 186" />
        <path d="M164 124 L162 160 L158 196" />
        <path d="M172 126 L182 158 L196 190" />
        <path d="M178 132 L204 168 L226 200" />
        <path d="M150 138 L122 170 L100 200" />
        <path d="M184 134 L222 172 L262 204" />
      </g>
      {/* puncak: awan tipis dan kawah */}
      <ellipse cx="163" cy="116" rx="9" ry="3" fill="#EFE5CF" />
      <ellipse cx="205" cy="124" rx="24" ry="4.5" fill="#FFFDF8" opacity="0.75" />
      <g>
        <path d="M163 104 l4.5 8.5 h-9z" fill="#18382C" opacity="0.85" />
        <text x="173" y="112" fontFamily={SANS} fontSize="9" fontWeight="700" letterSpacing="1.3" fill="#18382C" opacity="0.85">
          {t('G. SLAMET', 'MT. SLAMET')}
        </text>
      </g>

      {/* daratan */}
      <path d="M-10 226 C50 214 110 238 180 228 C250 218 320 242 400 226 V660 H-10Z" fill="url(#pt-land)" />
      {/* garis kontur */}
      <g fill="none" stroke="#DCE8BC" strokeWidth="1.2" opacity="0.65">
        <path d="M-10 250 C60 236 120 262 190 252 C260 242 330 266 400 250" />
        <path d="M-10 272 C70 256 130 286 200 274 C270 262 340 288 400 272" />
        <path d="M-10 410 C60 398 110 424 180 414 C250 404 320 428 400 412" opacity="0.5" />
        <path d="M-10 560 C70 548 130 572 200 562 C270 552 340 574 400 560" opacity="0.45" />
      </g>

      {/* sungai */}
      <path d="M-10 252 C58 270 110 232 172 254 S292 292 400 300" fill="none" stroke="#7DB1B9" strokeWidth="14" strokeLinecap="round" />
      <path d="M-10 252 C58 270 110 232 172 254 S292 292 400 300" fill="none" stroke="#A9D3D6" strokeWidth="9" strokeLinecap="round" />
      <path d="M-10 252 C58 270 110 232 172 254 S292 292 400 300" fill="none" stroke="#E3F3F2" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5 7" />
      <text fontFamily={SERIF} fontStyle="italic" fontSize="10" fill="#3F7C86" opacity="0.9">
        <textPath href="#pt-river" startOffset="52%">
          {t('kali', 'river')}
        </textPath>
      </text>
      <path id="pt-river" d="M-10 252 C58 270 110 232 172 254 S292 292 400 300" fill="none" />

      {/* sawah berteras */}
      <path d="M30 392 C54 380 96 384 118 396 L112 432 C88 444 52 442 30 430Z" fill="url(#pt-terrace)" stroke="#9DB35E" strokeWidth="1.2" />
      <path d="M262 530 C290 516 340 520 366 536 L362 574 C334 588 292 584 264 568Z" fill="url(#pt-terrace2)" stroke="#8CA656" strokeWidth="1.2" />
      <path d="M168 336 C188 328 214 332 226 342 L220 366 C204 374 182 372 170 362Z" fill="url(#pt-terrace)" stroke="#9DB35E" strokeWidth="1" opacity="0.95" />

      {/* kebun kelapa */}
      {CLEAR_PALMS.map(([x, y, s], i) => (
        <Palm key={i} x={x} y={y} s={s} />
      ))}

      {/* jalur kunjungan */}
      <path d={ROUTE} fill="none" stroke="#F7F0DC" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ROUTE} fill="none" stroke="#B87943" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 6.5" />

      {/* desa */}
      {VILLAGES.map((v) => (
        <VillageMark key={v.id} v={v} done={collected.includes(v.id)} selected={sel === v.id} onSelect={() => onSelect(v.id)} />
      ))}

      {/* Nira, "kamu" */}
      <g>
        <use href="#pt-nira" x={166} y={316} width={44} height={54} />
        <rect x={172} y={368} width={32} height={15} rx={7.5} fill="#8F5A2E" />
        <text x={188} y={378.6} textAnchor="middle" fontFamily={SANS} fontSize="9.5" fontWeight="700" fill="#FFFDF8">
          {t('Kamu', 'You')}
        </text>
      </g>

      {/* legenda */}
      <g transform="translate(30 548)">
        <rect width="124" height="62" rx="10" fill="#FFFDF8" opacity="0.88" stroke="#B87943" strokeWidth="1" />
        <text x="10" y="15" fontFamily={SANS} fontSize="8.5" fontWeight="700" letterSpacing="1.2" fill="#8F5A2E">
          {t('KETERANGAN', 'LEGEND')}
        </text>
        <use href="#pt-palm" x="10" y="21" width="12" height="16" />
        <text x="28" y="32" fontFamily={SANS} fontSize="9.5" fill="#18382C">
          {t('Kebun kelapa', 'Coconut grove')}
        </text>
        <rect x="10" y="39" width="12" height="7" rx="1.5" fill="url(#pt-terrace)" stroke="#9DB35E" strokeWidth="0.8" />
        <text x="28" y="46" fontFamily={SANS} fontSize="9.5" fill="#18382C">
          {t('Sawah berteras', 'Terraced rice')}
        </text>
        <circle cx="16" cy="55" r="3.6" fill="#8F5A2E" />
        <text x="28" y="58.2" fontFamily={SANS} fontSize="9.5" fill="#18382C">
          {t('Desa dan kisahnya', 'Village and its story')}
        </text>
      </g>

      {/* kompas */}
      <g transform="translate(336 574)">
        <circle r="22" fill="#FFFDF8" opacity="0.9" stroke="#B87943" strokeWidth="1.2" />
        <path d="M0 -17 L4.5 0 L0 17 L-4.5 0Z" fill="#B87943" opacity="0.35" />
        <path d="M-17 0 L0 -4.5 L17 0 L0 4.5Z" fill="#B87943" opacity="0.35" />
        <path d="M0 -17 L4.5 0 L-4.5 0Z" fill="#234B3A" />
        <text x="0" y="-24" textAnchor="middle" fontFamily={SERIF} fontSize="12" fill="#234B3A">
          {t('U', 'N')}
        </text>
        <circle r="2" fill="#FFFDF8" />
      </g>

      {/* skala dan catatan */}
      <g transform="translate(178 604)" fontFamily={SANS} fill="#18382C">
        <line x1="0" y1="0" x2="54" y2="0" stroke="#18382C" strokeWidth="1.6" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#18382C" strokeWidth="1.6" />
        <line x1="27" y1="-2" x2="27" y2="2" stroke="#18382C" strokeWidth="1.2" />
        <line x1="54" y1="-3" x2="54" y2="3" stroke="#18382C" strokeWidth="1.6" />
        <text x="62" y="3.5" fontSize="9">
          ± 5 km {t('(perkiraan)', '(approx.)')}
        </text>
      </g>
    </g>

    {/* judul */}
    <g>
      <path d="M52 32 H338 L326 54 L338 76 H52 L64 54Z" fill="#234B3A" stroke="#B87943" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M58 37 H332 L322 54 L332 71 H58 L68 54Z" fill="none" stroke="#E7C79A" strokeWidth="0.9" strokeLinejoin="round" />
      <text x={W / 2} y="62" textAnchor="middle" fontFamily={SERIF} fontSize="25" letterSpacing="3" fill="#FFFDF8">
        PETA JEJAK NIRA
      </text>
      <text x={W / 2} y="93" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fontWeight="700" letterSpacing="2.4" fill="#8F5A2E">
        {t('CILONGOK · BANYUMAS · JAWA TENGAH', 'CILONGOK · BANYUMAS · CENTRAL JAVA')}
      </text>
    </g>

    {/* bingkai */}
    <rect x="6" y="6" width={W - 12} height={H - 12} rx="18" fill="none" stroke="#234B3A" strokeWidth="3.2" />
    <rect x="14" y="14" width={W - 28} height={H - 28} rx="12" fill="none" stroke="#B87943" strokeWidth="1.3" />
    {([[14, 14], [W - 14, 14], [14, H - 14], [W - 14, H - 14]] as const).map(([cx, cy]) => (
      <path key={`${cx}-${cy}`} d={`M${cx} ${cy - 7} L${cx + 7} ${cy} L${cx} ${cy + 7} L${cx - 7} ${cy}Z`} fill="#B87943" stroke="#FFFDF8" strokeWidth="1.4" />
    ))}
    <text x={W / 2} y={H - 18} textAnchor="middle" fontFamily={SANS} fontSize="7.5" letterSpacing="0.6" fill="#18382C" opacity="0.7">
      {t('Ilustrasi, bukan peta resmi. Lokasi tingkat desa, perkiraan kasar.', 'Illustration, not an official map. Village-level locations, rough estimate.')}
    </text>
  </svg>
));
MapArt.displayName = 'MapArt';

const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

/** Menyalin SVG menjadi berkas mandiri (tanpa penanda interaktif), siap dipakai pembuat poster. */
const standaloneSvg = (svg: SVGSVGElement): string => {
  const c = svg.cloneNode(true) as SVGSVGElement;
  c.setAttribute('width', String(W * 4));
  c.setAttribute('height', String(H * 4));
  c.removeAttribute('class');
  c.removeAttribute('role');
  c.querySelectorAll('[role=button]').forEach((g) => {
    g.removeAttribute('tabindex');
    g.removeAttribute('role');
    g.removeAttribute('style');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(c)}`;
};

export const Peta: React.FC = () => {
  const { records, collected, checkIn } = useStore();
  const [sel, setSel] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const spot = VILLAGES.find((v) => v.id === sel);
  // Hanya rekaman yang disetujui kurator dan boleh dilihat pelajar.
  const rec = records.find((r) => r.id === sel && isLearnerVisible(r));
  const got = sel ? collected.includes(sel) : false;
  const reveal = records.find((r) => r.id === revealed);

  const saveSvg = () => {
    if (!svgRef.current) return;
    download(new Blob([standaloneSvg(svgRef.current)], { type: 'image/svg+xml' }), 'peta-jejak-nira.svg');
  };

  const savePng = async () => {
    if (!svgRef.current || busy) return;
    setBusy(true);
    try {
      const scale = 6; // 2340 x 3840 px
      const svgBlob = new Blob([standaloneSvg(svgRef.current).replace(`width="${W * 4}" height="${H * 4}"`, `width="${W * scale}" height="${H * scale}"`)], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error('gagal memuat gambar'));
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
      if (blob) download(blob, 'peta-jejak-nira.png');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-[560px] flex-col overflow-hidden bg-[#F4E8CB]">
      <div className="min-h-0 flex-1 px-2 pt-2">
        <MapArt
          ref={svgRef}
          collected={collected}
          sel={sel}
          onSelect={(id) => {
            setSel(id);
            setRevealed(null);
          }}
        />
      </div>

      <div className="shrink-0 px-3 pb-2 pt-1.5">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={savePng} disabled={busy} className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-forest text-[13px] font-semibold text-coconut disabled:opacity-60">
            <Download className="h-4 w-4" /> {busy ? t('Menyiapkan...', 'Preparing...') : t('Poster PNG', 'Poster PNG')}
          </button>
          <button type="button" onClick={saveSvg} className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border-2 border-bamboo text-[13px] font-semibold text-deep-forest">
            <Download className="h-4 w-4" /> {t('Vektor SVG', 'Vector SVG')}
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] leading-tight text-ink-soft">{t('Ketuk desa untuk membuka kisahnya · simulasi, bukan pelacakan langsung', 'Tap a village to open its story · a simulation, not live tracking')}</p>
      </div>

      {/* bottom sheet desa */}
      {spot && (
        <div className="sheet-enter absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-cream p-5 shadow-[0_-12px_30px_-12px_rgba(16,38,30,0.5)]">
          <button
            type="button"
            onClick={() => {
              setSel(null);
              setRevealed(null);
            }}
            aria-label={t('Tutup', 'Close')}
            className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream/90 text-deep-forest"
          >
            <X className="h-5 w-5" />
          </button>
          {reveal ? (
            <div className="text-center">
              <div className="relative mx-auto h-28 overflow-hidden rounded-2xl">
                <Scene kind={SLUG_SCENE[reveal.relatedModuleSlug] ?? 'identitas'} className="h-full w-full" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Nira mood="cheer" size={64} />
                </div>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Kartu warisan terbuka · +20 XP', 'Heritage card unlocked · +20 XP')}</p>
              <h3 className="text-xl leading-tight text-deep-forest">{reveal.title}</h3>
              <div className="mt-2 flex justify-center">
                <ApprovalChip record={reveal} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{reveal.shortDescription}</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
                {t('Desa', 'Village')} {spot.village} · {km(spot.dist)}
              </p>
              {rec ? (
                <>
                  <h3 className="mt-1 pr-10 text-xl leading-tight text-deep-forest">{rec.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{rec.shortDescription}</p>
                  <button
                    type="button"
                    disabled={got}
                    onClick={() => {
                      checkIn(rec.id);
                      setRevealed(rec.id);
                    }}
                    className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
                  >
                    {got ? t('Sudah terkumpul', 'Already collected') : t('Check-in terpandu', 'Guided check-in')}
                  </button>
                  <p className="mt-2 text-xs text-ink-soft">{t('Check-in terpandu hanya simulasi di dalam aplikasi, tanpa membaca lokasi nyata.', 'The guided check-in is only a simulation inside the app, with no real location reading.')}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-ink-soft">{t('Belum ada cerita yang disetujui kurator untuk desa ini.', 'No curator-approved story for this village yet.')}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
