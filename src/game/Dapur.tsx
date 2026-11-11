import React from 'react';

/** Interpolasi warna hex untuk perubahan warna nira saat dimasak. */
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const niraColor = (t: number) => {
  const stops = ['#F6E7B0', '#EBBB5B', '#C98530', '#8A4B1C', '#5B2E10'];
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = hex(stops[i]);
  const b = hex(stops[i + 1]);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`;
};

export interface Debris {
  id: number;
  x: number;
  y: number;
  kind: 'semut' | 'bunga' | 'lebah';
}
export interface Foam {
  id: number;
  x: number;
  y: number;
  r: number;
}
export interface Hotspot {
  id: string;
  x: number;
  y: number;
  seen: boolean;
}

export interface DapurProps {
  /** Tinggi cairan di wajan, 0..1. */
  level?: number;
  /** Tingkat kematangan nira (warna), 0..1. */
  cook?: number;
  /** Kekuatan api, 0..100. */
  heat?: number;
  foam?: Foam[];
  debris?: Debris[];
  cloth?: boolean;
  pour?: boolean;
  paddle?: number | null;
  moulds?: number[] | null;
  hotspots?: Hotspot[];
  onDebris?: (id: number) => void;
  onFoam?: (id: number) => void;
  onHotspot?: (id: string) => void;
  tilted?: boolean;
  /** Tampilkan pongkor berdiri dan kain saring terlipat (layar pengenalan). */
  tools?: boolean;
  className?: string;
}

const Flame: React.FC<{ heat: number }> = ({ heat }) => {
  const s = 0.35 + (heat / 100) * 0.95;
  const hot = heat > 78;
  return (
    <g transform={`translate(180 205) scale(${s})`}>
      <path d="M0 0 C-22 0 -22 -26 0 -52 C22 -26 22 0 0 0Z" fill={hot ? '#E0523A' : '#F29A3B'} />
      <path d="M-14 0 C-24 -8 -18 -22 -10 -30 C-8 -16 -6 -6 -14 0Z" fill="#F7B955" opacity="0.9" />
      <path d="M0 0 C-9 0 -9 -14 0 -28 C9 -14 9 0 0 0Z" fill="#FFD27A" />
    </g>
  );
};

/**
 * Panggung dapur tradisional (SVG): tungku kayu, wajan, kain saring, pongkor, bathok.
 * Dipakai bersama oleh semua langkah supaya nira terlihat berubah warna dan kental dari satu adegan yang sama.
 */
export const Dapur: React.FC<DapurProps> = ({
  level = 1,
  cook = 0,
  heat = 40,
  foam = [],
  debris = [],
  cloth = false,
  pour = false,
  paddle = null,
  moulds = null,
  hotspots,
  onDebris,
  onFoam,
  onHotspot,
  tilted = false,
  tools = false,
  className = '',
}) => {
  const liquid = niraColor(cook);
  const rx = 40 + 38 * level;
  const ry = 3 + 10 * level;
  return (
    <svg viewBox="0 0 360 250" className={className} role="img" aria-label="Dapur tradisional: tungku kayu, wajan, dan alat pembuat gula kelapa">
      <defs>
        <linearGradient id="dp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3DDB4" />
          <stop offset="1" stopColor="#DDB985" />
        </linearGradient>
        <linearGradient id="dp-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8A5A2E" />
          <stop offset="1" stopColor="#5C3A1C" />
        </linearGradient>
        <radialGradient id="dp-glow" cx="0.5" cy="0.8" r="0.7">
          <stop offset="0" stopColor="#FFB45A" stopOpacity={0.15 + (heat / 100) * 0.5} />
          <stop offset="1" stopColor="#FFB45A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* dinding anyaman bambu dan lantai */}
      <rect width="360" height="198" fill="url(#dp-wall)" />
      <g stroke="#C9A06A" strokeWidth="1.2" opacity="0.5">
        {Array.from({ length: 19 }).map((_, i) => (
          <path key={i} d={`M${i * 20} 0 V198`} />
        ))}
        <path d="M0 40 H360 M0 100 H360 M0 160 H360" />
      </g>
      <rect y="196" width="360" height="54" fill="url(#dp-floor)" />
      <ellipse cx="180" cy="150" rx="170" ry="90" fill="url(#dp-glow)" />

      {/* jendela terang dan jubung digantung */}
      <rect x="296" y="22" width="46" height="56" rx="4" fill="#FFF1C9" stroke="#9A6B34" strokeWidth="4" />
      <path d="M319 22 V78 M296 50 H342" stroke="#9A6B34" strokeWidth="3" />
      <g transform="translate(58 58)">
        <path d="M0 -26 V-10" stroke="#7A4A20" strokeWidth="3" />
        <ellipse cx="0" cy="6" rx="20" ry="18" fill="#D9B16B" stroke="#9A6B34" strokeWidth="2.5" />
        <path d="M-16 -2 H16 M-18 6 H18 M-16 14 H16 M-8 -12 V24 M0 -13 V25 M8 -12 V24" stroke="#9A6B34" strokeWidth="1.6" opacity="0.8" />
      </g>

      {/* tungku */}
      <ellipse cx="180" cy="206" rx="104" ry="9" fill="#18382C" opacity="0.28" />
      <path d="M96 206 C96 158 130 146 180 146 C230 146 264 158 264 206Z" fill="#A9693A" />
      <path d="M96 206 C96 172 110 156 134 150 C120 168 118 190 122 206Z" fill="#C98552" opacity="0.7" />
      <path d="M156 206 C156 184 166 176 180 176 C194 176 204 184 204 206Z" fill="#2E1B0D" />
      <Flame heat={heat} />
      <rect x="132" y="196" width="40" height="9" rx="4.5" fill="#6B4020" transform="rotate(-8 152 200)" />
      <rect x="190" y="198" width="44" height="9" rx="4.5" fill="#7A4A20" transform="rotate(6 212 202)" />

      {/* wajan */}
      <path d="M92 144 C98 178 262 178 268 144Z" fill="#3B3F3A" />
      <ellipse cx="180" cy="144" rx="88" ry="17" fill="#4A4E48" />
      <ellipse cx="180" cy="144" rx="80" ry="13" fill="#2B2E2A" />
      {level > 0.02 && <ellipse cx="180" cy="144" rx={rx} ry={ry} fill={liquid} style={{ transition: 'fill 0.4s' }} />}
      {level > 0.02 && <ellipse cx="170" cy={144 - ry * 0.3} rx={rx * 0.45} ry={ry * 0.28} fill="#FFFFFF" opacity="0.22" />}

      {/* kain saring */}
      {cloth && (
        <g>
          <ellipse cx="180" cy="139" rx="72" ry="11" fill="#F4EBD2" stroke="#C9B48A" strokeWidth="2" />
          <path d="M112 139 C140 150 220 150 248 139" fill="none" stroke="#DCCDB2" strokeWidth="2" />
        </g>
      )}

      {/* buih */}
      {foam.map((f) => (
        <g key={f.id}>
          <circle cx={f.x} cy={f.y} r={f.r} fill="#FFF9E8" stroke="#E9D7B4" strokeWidth="1.5" />
          <circle cx={f.x - f.r * 0.3} cy={f.y - f.r * 0.3} r={f.r * 0.25} fill="#FFFFFF" />
        </g>
      ))}

      {/* kotoran di kain saring */}
      {debris.map((d) => (
        <g key={d.id} transform={`translate(${d.x} ${d.y}) scale(1.7)`}>
          {d.kind === 'semut' && (
            <g fill="#2A1A10">
              <circle cx="-5" cy="0" r="3" />
              <circle cx="0" cy="0" r="3.4" />
              <circle cx="6" cy="0" r="4" />
              <path d="M-6 3 l-3 4 M0 3 l0 5 M6 3 l3 4" stroke="#2A1A10" strokeWidth="1.2" />
            </g>
          )}
          {d.kind === 'bunga' && (
            <g>
              <path d="M-9 0 C-6 -8 6 -8 9 0 C6 6 -6 6 -9 0Z" fill="#E6D9A0" stroke="#B9A76B" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="2" fill="#B9A76B" />
            </g>
          )}
          {d.kind === 'lebah' && (
            <g>
              <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#E9B13C" />
              <path d="M-3 -5 V5 M2 -5 V5" stroke="#2A1A10" strokeWidth="2" />
              <ellipse cx="-3" cy="-7" rx="5" ry="3" fill="#FFFFFF" opacity="0.7" />
            </g>
          )}
          <circle r="22" fill="transparent" style={{ cursor: 'pointer' }} onClick={() => onDebris?.(d.id)} aria-label={`Buang ${d.kind}`} role="button" />
        </g>
      ))}

      {/* pongkor menuang nira */}
      {pour !== undefined && cloth && (
        <g>
          <g transform="translate(262 52) rotate(-55)">
            <rect x="-11" y="-6" width="22" height="64" rx="6" fill="#D9B16B" />
            <rect x="-11" y="-6" width="7" height="64" rx="3.5" fill="#F0D190" opacity="0.7" />
            <rect x="-11.5" y="12" width="23" height="3" rx="1.5" fill="#9A6B34" />
            <rect x="-11.5" y="36" width="23" height="3" rx="1.5" fill="#9A6B34" />
            <ellipse cx="0" cy="-6" rx="11" ry="3.5" fill="#7A4A20" />
          </g>
          {pour && (
            <g>
              <path d="M234 76 C226 100 214 116 196 134" fill="none" stroke="#EBBB5B" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
              <circle cx="205" cy="124" r="2.5" fill="#EBBB5B" />
              <circle cx="219" cy="108" r="2" fill="#EBBB5B" />
            </g>
          )}
        </g>
      )}

      {/* uap */}
      {heat > 25 && level > 0.3 && (
        <g fill="none" stroke="#FFFDF8" strokeWidth="5" strokeLinecap="round" opacity={0.25 + heat / 200} className="mist-drift">
          <path d="M150 128 C140 114 160 106 150 90" />
          <path d="M182 126 C172 110 194 102 182 84" />
          <path d="M212 128 C204 114 222 106 212 94" />
        </g>
      )}

      {/* pengaduk kayu */}
      {paddle !== null && (
        <g>
          <path d="M180 144 L226 60" stroke="#7A4A20" strokeWidth="7" strokeLinecap="round" />
          <g transform={`translate(180 144) scale(1 0.2) rotate(${paddle})`}>
            <path d="M0 0 H66" stroke="#9A6B34" strokeWidth="11" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* wajan miring saat menuang ke cetakan */}
      {tilted && (
        <path d="M268 144 C276 150 296 160 316 168" fill="none" stroke={liquid} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      )}

      {/* cetakan bathok */}
      {moulds && (
        <g>
          {moulds.map((fill, i) => {
            const x = 52 + i * 64;
            return (
              <g key={i} transform={`translate(${x} 226)`}>
                <ellipse cx="0" cy="12" rx="26" ry="4" fill="#18382C" opacity="0.3" />
                <path d="M-26 0 C-26 26 26 26 26 0Z" fill="#7A4A20" />
                <path d="M-26 0 C-26 -5 26 -5 26 0 C26 3 -26 3 -26 0Z" fill="#5B3416" />
                <ellipse cx="0" cy="0" rx="22" ry="3.4" fill={liquid} opacity={0.2 + 0.8 * fill} />
                {fill > 0 && <path d={`M-22 0 C-22 ${4 + 14 * fill} 22 ${4 + 14 * fill} 22 0Z`} fill={liquid} opacity="0.95" />}
              </g>
            );
          })}
        </g>
      )}

      {tools && (
        <g>
          <g transform="translate(300 196)">
            <ellipse cx="0" cy="2" rx="18" ry="4" fill="#18382C" opacity="0.3" />
            <rect x="-11" y="-62" width="22" height="62" rx="6" fill="#D9B16B" />
            <rect x="-11" y="-62" width="7" height="62" rx="3.5" fill="#F0D190" opacity="0.7" />
            <rect x="-11.5" y="-44" width="23" height="3" rx="1.5" fill="#9A6B34" />
            <rect x="-11.5" y="-20" width="23" height="3" rx="1.5" fill="#9A6B34" />
            <ellipse cx="0" cy="-62" rx="11" ry="3.5" fill="#7A4A20" />
          </g>
          <g transform="translate(52 196)">
            <ellipse cx="0" cy="4" rx="30" ry="5" fill="#18382C" opacity="0.25" />
            <rect x="-28" y="-14" width="56" height="16" rx="6" fill="#F4EBD2" stroke="#C9B48A" strokeWidth="2" />
            <path d="M-22 -8 H22" stroke="#DCCDB2" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* area ketuk untuk pengenalan alat */}
      {hotspots?.map((h) => (
        <g key={h.id} style={{ cursor: 'pointer' }} onClick={() => onHotspot?.(h.id)} role="button" aria-label={`Kenali ${h.id}`}>
          <circle cx={h.x} cy={h.y} r="17" fill="#FFFDF8" opacity="0.92" />
          <circle cx={h.x} cy={h.y} r="17" fill="none" stroke={h.seen ? '#234B3A' : '#B87943'} strokeWidth="3" />
          {!h.seen && <circle cx={h.x} cy={h.y} r="17" fill="none" stroke="#B87943" strokeWidth="2" className="marker-ring" style={{ transformOrigin: `${h.x}px ${h.y}px` }} />}
          {h.seen ? (
            <path d={`M${h.x - 6} ${h.y} l4 5 l8 -10`} fill="none" stroke="#234B3A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <text x={h.x} y={h.y + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#8F5A2C" fontFamily="Inter, sans-serif">
              ?
            </text>
          )}
          <circle r="26" cx={h.x} cy={h.y} fill="transparent" />
        </g>
      ))}
    </svg>
  );
};
