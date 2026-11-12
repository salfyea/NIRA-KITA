import React from 'react';
import { Scene, SceneKind } from './Scene';
import { t } from '../i18n';

/**
 * Ilustrasi "Jalur Belajar": lanskap vektor dengan empat stasiun modul yang bisa diketuk.
 * Murni SVG supaya bisa diunduh sebagai poster (PNG atau SVG).
 */
export const JW = 390;
export const JROW = 172;
export const JTOP = 232;
export const JH = JTOP + 3 * JROW + 250;
const XS = [0.3, 0.7, 0.3, 0.7];
const SERIF = "'DM Serif Display', Georgia, 'Times New Roman', serif";
const SANS = "Inter, 'Segoe UI', system-ui, sans-serif";

export type Status = 'done' | 'active' | 'open' | 'locked';

export interface Station {
  id: string;
  slug: string;
  kind: SceneKind;
  number: string; // "MODUL 01"
  title: string;
  status: Status;
}

export const stationPoints = (n: number) => Array.from({ length: n }, (_, i) => ({ x: XS[i % XS.length] * JW, y: JTOP + i * JROW }));

export const pathFor = (n: number): string => {
  const pts = stationPoints(n);
  let d = `M${JW / 2} 120 C${JW / 2} 160 ${pts[0].x} 150 ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < n; i++) {
    const q = pts[i - 1];
    const p = pts[i];
    const my = (q.y + p.y) / 2;
    d += ` C${q.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
  }
  const last = pts[n - 1];
  d += ` C${last.x} ${last.y + 90} ${JW / 2} ${last.y + 70} ${JW / 2} ${last.y + 150}`;
  return d;
};

const PALMS: [number, number, number][] = [
  [40, 330, 1], [70, 352, 0.85], [350, 300, 1], [330, 330, 0.8], [36, 462, 0.95], [66, 480, 0.8], [352, 520, 1], [326, 548, 0.85],
  [44, 640, 1], [76, 664, 0.8], [350, 690, 0.95], [322, 716, 0.8], [40, 790, 0.9], [352, 800, 0.95], [70, 830, 0.8], [322, 836, 0.85],
  [30, 250, 0.8], [362, 230, 0.75],
].sort((a, b) => a[1] - b[1]) as [number, number, number][];

const Palm: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <use href="#jl-palm" x={x - 17 * s} y={y - 46 * s} width={34 * s} height={46 * s} />;

const Medallion: React.FC<{ s: Station; x: number; y: number; poster: boolean; onOpen: () => void }> = ({ s, x, y, poster, onOpen }) => {
  const st: Status = poster ? 'open' : s.status;
  const R = 46;
  const ring = st === 'active' ? '#B87943' : st === 'done' ? '#234B3A' : poster ? '#B87943' : '#C9BC9C';
  const cid = `jl-clip-${s.id}`;
  const label = s.number.replace('MODUL ', t('MODUL ', 'MODULE '));
  const title = s.title.split(' & ')[0];
  const fs = title.length > 22 ? 10.5 : 13;
  const tw = Math.max(86, title.length * fs * 0.53 + 26);
  const cx = Math.min(JW - 34 - (tw / 2 + 8), Math.max(34 + (tw / 2 + 8), x));
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${s.title}${st === 'locked' ? t(', terkunci', ', locked') : ''}`}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <clipPath id={cid}>
        <circle cx={x} cy={y} r={R - 5} />
      </clipPath>
      <ellipse cx={x} cy={y + R + 5} rx={R * 0.9} ry={8} fill="#18382C" opacity="0.18" />
      {st === 'active' && (
        <circle cx={x} cy={y} r={R + 10} fill="none" stroke="#B87943" strokeWidth="3">
          <animate attributeName="r" values={`${R + 6};${R + 16};${R + 6}`} dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={R + 4} fill="#FFFDF8" />
      <circle cx={x} cy={y} r={R} fill={ring} />
      <g clipPath={`url(#${cid})`} filter={st === 'locked' ? 'url(#jl-grey)' : undefined} opacity={st === 'locked' ? 0.7 : 1}>
        <Scene kind={s.kind} svgProps={{ x: x - 62, y: y - 48, width: 124, height: 96, 'aria-hidden': true, role: undefined }} />
      </g>
      <circle cx={x} cy={y} r={R - 5} fill="none" stroke="#FFFDF8" strokeWidth="2.5" />
      {st === 'done' && (
        <g>
          <circle cx={x + 34} cy={y - 34} r={13} fill="#234B3A" stroke="#FFFDF8" strokeWidth="3" />
          <path d={`M${x + 28} ${y - 34} l4.5 4.5 l8 -9`} fill="none" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {st === 'locked' && (
        <g>
          <circle cx={x} cy={y} r={16} fill="#18382C" opacity="0.82" />
          <rect x={x - 6.5} y={y - 2.5} width={13} height={10} rx={2} fill="#FFFDF8" />
          <path d={`M${x - 4} ${y - 2.5} v-3.5 a4 4 0 0 1 8 0 v3.5`} fill="none" stroke="#FFFDF8" strokeWidth="2.2" />
        </g>
      )}
      {/* pita nama */}
      <path d={`M${cx - tw / 2 - 8} ${y + R + 12} h${tw + 16} l-7 13 l7 13 h-${tw + 16} l7 -13z`} fill="#234B3A" stroke="#B87943" strokeWidth="1.6" strokeLinejoin="round" />
      <text x={cx} y={y + R + 23.5} textAnchor="middle" fontFamily={SANS} fontSize="8.5" fontWeight="700" letterSpacing="1.6" fill="#E7C79A">
        {label}
      </text>
      <text x={cx} y={y + R + 36} textAnchor="middle" fontFamily={SERIF} fontSize={fs} fill="#FFFDF8">
        {title}
      </text>
    </g>
  );
};

export const JalurArt = React.forwardRef<SVGSVGElement, { stations: Station[]; poster: boolean; doneLength: number | null; onOpen: (slug: string) => void }>(({ stations, poster, doneLength, onOpen }, ref) => {
  const n = stations.length;
  const pts = stationPoints(n);
  const d = pathFor(n);
  const activeIdx = stations.findIndex((s) => s.status === 'active');
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${JW} ${JH}`} role="group" aria-label={t('Jalur belajar: empat modul', 'Learning path: four modules')} className="block h-auto w-full">
      <defs>
        <linearGradient id="jl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4C98A" />
          <stop offset="0.5" stopColor="#FBE3BB" />
          <stop offset="1" stopColor="#F4E8CB" />
        </linearGradient>
        <linearGradient id="jl-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C2D69B" />
          <stop offset="0.45" stopColor="#A9C48B" />
          <stop offset="1" stopColor="#86AB74" />
        </linearGradient>
        <linearGradient id="jl-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8BA68F" />
          <stop offset="1" stopColor="#BCC6A6" />
        </linearGradient>
        <radialGradient id="jl-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF6DC" />
          <stop offset="0.45" stopColor="#FFE9B8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE9B8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="jl-body" cx="0.38" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#E3EFC8" />
          <stop offset="0.5" stopColor="#B6CF8E" />
          <stop offset="1" stopColor="#7BA36A" />
        </radialGradient>
        <pattern id="jl-terrace" width="16" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">
          <rect width="16" height="7" fill="#CBDB82" />
          <path d="M0 5.5 Q4 3.5 8 5.5 T16 5.5" fill="none" stroke="#A7BD62" strokeWidth="1.4" />
          <path d="M0 1.8 Q4 0 8 1.8 T16 1.8" fill="none" stroke="#DBE79C" strokeWidth="1" />
        </pattern>
        <filter id="jl-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.2  0 0 0 0.09 0" />
        </filter>
        <filter id="jl-grey">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="jl-clip">
          <rect x="15" y="15" width={JW - 30} height={JH - 30} rx="12" />
        </clipPath>
        <symbol id="jl-palm" viewBox="-2 -4 40 52">
          <path d="M15 46 Q17 28 17 14 L19 14 Q19 28 21 46Z" fill="#7A4F28" />
          <path d="M18 14 C8 4 -2 6 -2 12 C6 10 12 11 18 14Z" fill="#2F6A4B" />
          <path d="M18 14 C28 4 38 6 38 12 C30 10 24 11 18 14Z" fill="#4E8C63" />
          <path d="M18 14 C12 10 12 2 18 -2 C24 2 24 10 18 14Z" fill="#3F7A57" />
          <circle cx="16" cy="16" r="2.5" fill="#B87943" />
          <circle cx="21" cy="17" r="2.5" fill="#A0652F" />
        </symbol>
        <symbol id="jl-house" viewBox="0 0 38 34">
          <rect x="5" y="14" width="28" height="18" fill="#EBDAB9" />
          <path d="M1 15 L19 1 L37 15Z" fill="#B9674C" />
          <rect x="16" y="20" width="7" height="12" rx="1.5" fill="#7A4A20" />
          <rect x="8" y="18" width="5" height="5" fill="#F7D08E" />
          <rect x="26" y="18" width="5" height="5" fill="#F7D08E" />
        </symbol>
        <symbol id="jl-nira" viewBox="6 0 52 64">
          <path d="M32 19C45 19 53 28 53 41C53 53 45 60 32 60C19 60 11 53 11 41C11 28 19 19 32 19Z" fill="url(#jl-body)" />
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

      <rect width={JW} height={JH} fill="#F4E8CB" />
      <rect width={JW} height={JH} filter="url(#jl-paper)" />

      <g clipPath="url(#jl-clip)">
        {/* langit */}
        <rect width={JW} height="330" fill="url(#jl-sky)" />
        <circle cx="318" cy="168" r="62" fill="url(#jl-sun)" />
        <circle cx="318" cy="168" r="17" fill="#FFF1CF" />
        <g fill="#FFFDF8" opacity="0.85">
          <ellipse cx="62" cy="150" rx="26" ry="7" />
          <ellipse cx="80" cy="144" rx="18" ry="7" />
          <ellipse cx="236" cy="132" rx="22" ry="6" />
          <ellipse cx="252" cy="127" rx="14" ry="6" />
        </g>
        {/* gunung di kejauhan */}
        <path d="M-10 262 L46 224 L96 200 L140 168 L176 196 L232 226 L292 214 L346 236 L400 252 V300 H-10Z" fill="url(#jl-mtn)" opacity="0.75" />
        <path d="M-10 278 L66 246 L130 218 L196 244 L268 232 L330 252 L400 268 V310 H-10Z" fill="#9DB596" opacity="0.8" />

        {/* daratan */}
        <path d="M-10 276 C60 262 130 286 200 274 C270 262 330 284 400 272 V1000 H-10Z" fill="url(#jl-land)" />
        <g fill="none" stroke="#DCE8BC" strokeWidth="1.2" opacity="0.6">
          <path d="M-10 300 C70 286 130 312 200 300 C270 288 340 312 400 298" />
          <path d="M-10 470 C60 458 120 484 190 474 C260 464 330 486 400 470" opacity="0.7" />
          <path d="M-10 640 C70 628 130 654 200 644 C270 634 340 656 400 640" opacity="0.6" />
          <path d="M-10 810 C70 798 130 824 200 814 C270 804 340 826 400 810" opacity="0.55" />
        </g>

        {/* sungai dan jembatan, tepat di tengah ruas modul 1 ke 2 */}
        <path d="M-10 338 C70 358 130 318 200 338 S320 362 400 344" fill="none" stroke="#7DB1B9" strokeWidth="18" strokeLinecap="round" />
        <path d="M-10 338 C70 358 130 318 200 338 S320 362 400 344" fill="none" stroke="#A9D3D6" strokeWidth="12" strokeLinecap="round" />
        <path d="M-10 338 C70 358 130 318 200 338 S320 362 400 344" fill="none" stroke="#E3F3F2" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5 7" />

        {/* sawah berteras */}
        <path d="M24 408 C48 396 92 400 112 412 L106 448 C84 460 48 458 24 446Z" fill="url(#jl-terrace)" stroke="#9DB35E" strokeWidth="1.2" />
        <path d="M296 572 C322 560 360 564 374 576 L370 608 C350 620 316 618 296 606Z" fill="url(#jl-terrace)" stroke="#9DB35E" strokeWidth="1.2" />
        <path d="M22 738 C46 726 90 730 110 742 L104 776 C82 788 46 786 22 774Z" fill="url(#jl-terrace)" stroke="#9DB35E" strokeWidth="1.2" />

        {/* kebun kelapa */}
        {PALMS.map(([x, y, s], i) => (
          <Palm key={i} x={x} y={y} s={s} />
        ))}

        {/* jalan */}
        <path d={d} fill="none" stroke="#B79A6B" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
        <path d={d} fill="none" stroke="#E9D8B2" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#F7EED6" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#B79A6B" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 11" opacity="0.8" />
        {/* bagian yang sudah dilalui */}
        {!poster && doneLength !== null && (
          <path d={d} fill="none" stroke="#B87943" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${doneLength} 100000`} opacity="0.95" />
        )}
        {/* jembatan */}
        <g transform="translate(229 342) rotate(33)">
          <rect x="-34" y="-17" width="68" height="34" rx="4" fill="#8A5A2B" />
          <rect x="-31" y="-14" width="62" height="28" rx="3" fill="#C99A5E" />
          {[-24, -12, 0, 12, 24].map((px) => (
            <line key={px} x1={px} y1="-14" x2={px} y2="14" stroke="#8A5A2B" strokeWidth="1.4" />
          ))}
          <line x1="-34" y1="-17" x2="34" y2="-17" stroke="#5C4023" strokeWidth="2.6" />
          <line x1="-34" y1="17" x2="34" y2="17" stroke="#5C4023" strokeWidth="2.6" />
        </g>

        {/* perlengkapan di sepanjang jalan: pongkor, wajan, tanda hati-hati, kemasan */}
        <g transform="translate(274 270)">
          <rect x="-7" y="-22" width="14" height="40" rx="5" fill="#C9B05F" stroke="#9C8540" strokeWidth="1.2" />
          <rect x="-8" y="-9" width="16" height="3" fill="#9C8540" />
          <rect x="-8" y="6" width="16" height="3" fill="#9C8540" />
          <ellipse cx="0" cy="-22" rx="7" ry="2.4" fill="#4A3A18" />
        </g>
        <g transform="translate(92 468)">
          <ellipse cx="0" cy="12" rx="22" ry="5" fill="#18382C" opacity="0.18" />
          <rect x="-17" y="-4" width="34" height="16" rx="5" fill="#8C8678" />
          <path d="M-20 -4 Q0 -22 20 -4Z" fill="#2C2C2F" />
          <ellipse cx="0" cy="-5" rx="19" ry="4" fill="#C98A3A" />
          <path d="M-5 -14 q-3 -8 1 -14 M4 -14 q-3 -8 1 -16" stroke="#FFFDF8" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
        <g transform="translate(296 640)">
          <path d="M0 -26 L24 14 H-24Z" fill="#F2B84B" stroke="#18382C" strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="-2.2" y="-12" width="4.4" height="14" rx="2" fill="#18382C" />
          <circle cx="0" cy="7.5" r="2.6" fill="#18382C" />
          <rect x="-1.6" y="14" width="3.2" height="22" fill="#7A4F28" />
        </g>
        <g transform="translate(86 806)">
          <rect x="-16" y="-24" width="32" height="42" rx="4" fill="#C9A26B" stroke="#8F6A3A" strokeWidth="1.4" />
          <rect x="-11" y="-14" width="22" height="22" fill="#FFFDF8" />
          <path d="M-8 -11 h6 v6 h-6z M2 -11 h6 v6 h-6z M-8 -1 h6 v6 h-6z M3 0 h3 v3 h-3z" fill="#18382C" />
        </g>

        {/* desa di ujung jalur */}
        <g>
          <use href="#jl-house" x={JW / 2 - 118} y={JTOP + 3 * JROW + 104} width="46" height="41" />
          <use href="#jl-house" x={JW / 2 + 56} y={JTOP + 3 * JROW + 98} width="52" height="46" />
        </g>
        <g transform={`translate(${JW / 2 + 22} ${JTOP + 3 * JROW + 196})`}>
          <rect x="-1.8" y="-52" width="3.6" height="56" fill="#5C4023" />
          <path d="M1.8 -52 h54 l-9 11 l9 11 h-54z" fill="#B87943" stroke="#FFFDF8" strokeWidth="1.6" strokeLinejoin="round" />
        </g>

        {/* stasiun modul */}
        {stations.map((s, i) => (
          <Medallion key={s.id} s={s} x={pts[i].x} y={pts[i].y} poster={poster} onOpen={() => onOpen(s.slug)} />
        ))}

        {/* Nira: di stasiun aktif, atau di awal jalur pada poster */}
        {(() => {
          const i = poster ? 0 : Math.max(0, activeIdx);
          const p = pts[i];
          const left = p.x > JW / 2;
          const nx = left ? p.x - 118 : p.x + 62;
          return <use href="#jl-nira" x={nx} y={p.y - 44} width="52" height="64" />;
        })()}
      </g>

      {/* judul */}
      <g>
        <path d="M46 30 H344 L332 56 L344 82 H46 L58 56Z" fill="#234B3A" stroke="#B87943" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M52 36 H338 L326 56 L338 76 H52 L64 56Z" fill="none" stroke="#E7C79A" strokeWidth="0.9" strokeLinejoin="round" />
        <text x={JW / 2} y="65" textAnchor="middle" fontFamily={SERIF} fontSize="26" letterSpacing="3" fill="#FFFDF8">
          {t('JEJAK BELAJAR', 'LEARNING PATH')}
        </text>
        <text x={JW / 2} y="103" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fontWeight="700" letterSpacing="2.4" fill="#8F5A2E">
          {t('EMPAT MODUL · JEJAK NIRA', 'FOUR MODULES · JEJAK NIRA')}
        </text>
      </g>

      {/* bingkai */}
      <rect x="6" y="6" width={JW - 12} height={JH - 12} rx="18" fill="none" stroke="#234B3A" strokeWidth="3.2" />
      <rect x="14" y="14" width={JW - 28} height={JH - 28} rx="12" fill="none" stroke="#B87943" strokeWidth="1.3" />
      {([[14, 14], [JW - 14, 14], [14, JH - 14], [JW - 14, JH - 14]] as const).map(([cx, cy]) => (
        <path key={`${cx}-${cy}`} d={`M${cx} ${cy - 7} L${cx + 7} ${cy} L${cx} ${cy + 7} L${cx - 7} ${cy}Z`} fill="#B87943" stroke="#FFFDF8" strokeWidth="1.4" />
      ))}
      <text x={JW / 2} y={JH - 24} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="12" fill="#234B3A">
        {t('Jejak pengetahuan, warisan masa depan', 'Trail of knowledge, heritage for the future')}
      </text>
    </svg>
  );
});
JalurArt.displayName = 'JalurArt';
