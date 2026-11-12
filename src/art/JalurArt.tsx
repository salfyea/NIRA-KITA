import React from 'react';
import { Scene, SceneKind } from './Scene';
import { t } from '../i18n';

/**
 * Jalur belajar: jalan berkelok di atas latar krem dengan empat medali modul yang bisa diketuk.
 * Tampil bersih tanpa bingkai.
 */
export const JW = 390;
export const JROW = 172;
export const JTOP = 232;
export const JH = JTOP + 3 * JROW + 250;
/** Batas atas tampilan: bagian atas kanvas (ruang kosong di atas awal jalan) dipotong. */
export const VIEW_TOP_APP = 132;
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
  percent: number;
}

export const stationPoints = (n: number) => Array.from({ length: n }, (_, i) => ({ x: XS[i % XS.length] * JW, y: JTOP + i * JROW }));

export const pathFor = (n: number): string => {
  const pts = stationPoints(n);
  let d = `M${JW / 2} 100 C${JW / 2} 160 ${pts[0].x} 150 ${pts[0].x} ${pts[0].y}`;
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

/** Pohon kelapa di tepi saja, supaya jalan dan medali tetap lega. */
const PALMS: [number, number, number][] = [
  [30, 196, 0.8], [362, 176, 0.75], [34, 392, 0.95], [356, 330, 0.9], [36, 566, 0.9], [366, 548, 0.95], [34, 746, 0.95], [360, 690, 0.85], [354, 900, 0.9],
].sort((a, b) => a[1] - b[1]) as [number, number, number][];

const Palm: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <use href="#jl-palm" x={x - 17 * s} y={y - 46 * s} width={34 * s} height={46 * s} />;

const Medallion: React.FC<{ s: Station; x: number; y: number; onOpen: () => void }> = ({ s, x, y, onOpen }) => {
  const st: Status = s.status;
  const R = 44;
  // Satu aturan warna: hijau = selesai, cokelat = sedang dipelajari, pucat = terkunci.
  const rim = st === 'done' ? '#234B3A' : st === 'locked' ? '#E3D8BE' : '#FFFDF8';
  const cid = `jl-clip-${s.id}`;
  const label = s.number.replace('MODUL ', t('MODUL ', 'MODULE '));
  const title = s.title.split(' & ')[0];
  const fs = title.length > 22 ? 12.5 : 14.5;
  const showPct = st !== 'locked' && s.percent > 0 && s.percent < 100;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${s.title}${st === 'locked' ? t(', terkunci', ', locked') : showPct ? `, ${s.percent}%` : ''}`}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <clipPath id={cid}>
        <circle cx={x} cy={y} r={R - 4} />
      </clipPath>
      <ellipse cx={x} cy={y + R + 4} rx={R * 0.85} ry={7} fill="#18382C" opacity="0.14" />
      {/* denyut: cincin tipis yang membesar dan memudar, hanya pada modul aktif */}
      {st === 'active' && (
        <circle cx={x} cy={y} r={R + 10} fill="none" stroke="#B87943" strokeWidth="2.5">
          <animate attributeName="r" values={`${R + 10};${R + 22};${R + 10}`} dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}
      {/* kemajuan: satu busur cokelat di atas jalur pucat, tanpa cincin lain */}
      {showPct && (
        <>
          <circle cx={x} cy={y} r={R + 7} fill="none" stroke="#EADFC8" strokeWidth="5" />
          <circle cx={x} cy={y} r={R + 7} fill="none" stroke="#B87943" strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray={`${s.percent} 100`} transform={`rotate(-90 ${x} ${y})`} />
        </>
      )}
      <circle cx={x} cy={y} r={R} fill={rim} />
      <g clipPath={`url(#${cid})`} filter={st === 'locked' ? 'url(#jl-grey)' : undefined} opacity={st === 'locked' ? 0.6 : 1}>
        <Scene kind={s.kind} svgProps={{ x: x - 60, y: y - 46, width: 120, height: 92, 'aria-hidden': true, role: undefined }} />
      </g>
      {st === 'done' && (
        <g>
          <circle cx={x + 33} cy={y - 33} r={12.5} fill="#234B3A" stroke="#FFFDF8" strokeWidth="3" />
          <path d={`M${x + 27.5} ${y - 33} l4.3 4.3 l7.6 -8.6`} fill="none" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {showPct && (
        <g>
          <rect x={x + 18} y={y + 24} width={32} height={17} rx={8.5} fill="#8F5A2C" stroke="#FFFDF8" strokeWidth="2.4" />
          <text x={x + 34} y={y + 36.4} textAnchor="middle" fontFamily={SANS} fontSize="10" fontWeight="700" fill="#FFFDF8">
            {s.percent}%
          </text>
        </g>
      )}
      {st === 'locked' && (
        <g>
          <circle cx={x} cy={y} r={16} fill="#18382C" opacity="0.8" />
          <rect x={x - 6.5} y={y - 2.5} width={13} height={10} rx={2} fill="#FFFDF8" />
          <path d={`M${x - 4} ${y - 2.5} v-3.5 a4 4 0 0 1 8 0 v3.5`} fill="none" stroke="#FFFDF8" strokeWidth="2.2" />
        </g>
      )}
      {/* nama modul */}
      <text x={x} y={y + R + 24} textAnchor="middle" fontFamily={SANS} fontSize="9.5" fontWeight="700" letterSpacing="2" fill={st === 'locked' ? '#8A8F86' : '#B87943'}>
        {label}
      </text>
      <text x={x} y={y + R + 42} textAnchor="middle" fontFamily={SERIF} fontSize={fs} fill={st === 'locked' ? '#7C8279' : '#18382C'}>
        {title}
      </text>
    </g>
  );
};

export const JalurArt = React.forwardRef<SVGSVGElement, { stations: Station[]; doneLength: number | null; onOpen: (slug: string) => void }>(({ stations, doneLength, onOpen }, ref) => {
  const n = stations.length;
  const pts = stationPoints(n);
  const d = pathFor(n);
  const activeIdx = stations.findIndex((s) => s.status === 'active');
  const top = VIEW_TOP_APP;
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 ${top} ${JW} ${JH - top}`} role="group" aria-label={t('Jalur belajar: empat modul', 'Learning path: four modules')} className="block h-auto w-full">
      <defs>
        <radialGradient id="jl-body" cx="0.38" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#E3EFC8" />
          <stop offset="0.5" stopColor="#B6CF8E" />
          <stop offset="1" stopColor="#7BA36A" />
        </radialGradient>
        <filter id="jl-grey">
          <feColorMatrix type="saturate" values="0" />
        </filter>
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

      {/* bukit lembut di dasar halaman */}
      <path d={`M-10 ${JH - 190} C70 ${JH - 230} 150 ${JH - 170} 230 ${JH - 205} S350 ${JH - 230} 400 ${JH - 200} V${JH + 10} H-10Z`} fill="#D3E0BC" />
      <path d={`M-10 ${JH - 120} C80 ${JH - 150} 170 ${JH - 100} 260 ${JH - 130} S360 ${JH - 140} 400 ${JH - 118} V${JH + 10} H-10Z`} fill="#BBD1A2" />

      {/* kebun kelapa di tepi */}
      {PALMS.map(([x, y, s], i) => (
        <Palm key={i} x={x} y={y} s={s} />
      ))}

      {/* jalan */}
      <path d={d} fill="none" stroke="#D3C3A2" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#E9DDC3" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#FFFDF8" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="2 12" />
      {/* bagian yang sudah dilalui */}
      {doneLength !== null && (
        <>
          <path d={d} fill="none" stroke="#C99A5E" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${doneLength} 100000`} opacity="0.55" />
          <path d={d} fill="none" stroke="#FFFDF8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${doneLength} 100000`} />
        </>
      )}

      {/* perlengkapan tiap modul, kecil dan di tepi jalan */}
      <g transform="translate(300 232)">
        <rect x="-7" y="-22" width="14" height="40" rx="5" fill="#C9B05F" stroke="#9C8540" strokeWidth="1.2" />
        <rect x="-8" y="-9" width="16" height="3" fill="#9C8540" />
        <rect x="-8" y="6" width="16" height="3" fill="#9C8540" />
        <ellipse cx="0" cy="-22" rx="7" ry="2.4" fill="#4A3A18" />
      </g>
      <g transform="translate(88 456)">
        <ellipse cx="0" cy="12" rx="22" ry="5" fill="#18382C" opacity="0.15" />
        <rect x="-17" y="-4" width="34" height="16" rx="5" fill="#8C8678" />
        <path d="M-20 -4 Q0 -22 20 -4Z" fill="#2C2C2F" />
        <ellipse cx="0" cy="-5" rx="19" ry="4" fill="#C98A3A" />
        <path d="M-5 -14 q-3 -8 1 -14 M4 -14 q-3 -8 1 -16" stroke="#C9C2B0" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9" />
      </g>
      <g transform="translate(304 610)">
        <path d="M0 -26 L24 14 H-24Z" fill="#F2B84B" stroke="#18382C" strokeWidth="2.4" strokeLinejoin="round" />
        <rect x="-2.2" y="-12" width="4.4" height="14" rx="2" fill="#18382C" />
        <circle cx="0" cy="7.5" r="2.6" fill="#18382C" />
        <rect x="-1.6" y="14" width="3.2" height="22" fill="#7A4F28" />
      </g>
      <g transform="translate(86 790)">
        <rect x="-16" y="-24" width="32" height="42" rx="4" fill="#C9A26B" stroke="#8F6A3A" strokeWidth="1.4" />
        <rect x="-11" y="-14" width="22" height="22" fill="#FFFDF8" />
        <path d="M-8 -11 h6 v6 h-6z M2 -11 h6 v6 h-6z M-8 -1 h6 v6 h-6z M3 0 h3 v3 h-3z" fill="#18382C" />
      </g>

      {/* desa dan bendera di ujung jalan */}
      <use href="#jl-house" x={JW / 2 - 118} y={JTOP + 3 * JROW + 104} width="46" height="41" />
      <use href="#jl-house" x={JW / 2 + 56} y={JTOP + 3 * JROW + 98} width="52" height="46" />
      <g transform={`translate(${JW / 2 + 22} ${JTOP + 3 * JROW + 196})`}>
        <rect x="-1.8" y="-52" width="3.6" height="56" fill="#5C4023" />
        <path d="M1.8 -52 h54 l-9 11 l9 11 h-54z" fill="#B87943" stroke="#FFFDF8" strokeWidth="1.6" strokeLinejoin="round" />
      </g>

      {/* medali modul */}
      {stations.map((s, i) => (
        <Medallion key={s.id} s={s} x={pts[i].x} y={pts[i].y} onOpen={() => onOpen(s.slug)} />
      ))}

      {/* Nira menemani di stasiun aktif */}
      {(() => {
        const i = Math.max(0, activeIdx);
        const p = pts[i];
        const left = p.x > JW / 2;
        const nx = left ? p.x - 118 : p.x + 60;
        return <use href="#jl-nira" x={nx} y={p.y - 44} width="52" height="64" />;
      })()}

    </svg>
  );
});
JalurArt.displayName = 'JalurArt';
