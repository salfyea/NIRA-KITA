import React, { useId } from 'react';
import { t } from '../i18n';

export type SceneKind =
  | 'splash'
  | 'penderes'
  | 'memudar'
  | 'bersama'
  | 'identitas'
  | 'kerajinan'
  | 'keselamatan'
  | 'keberlanjutan';

export const SLUG_SCENE: Record<string, SceneKind> = {
  'identitas-budaya-warisan-lokal': 'identitas',
  'kerajinan-tradisional-transfer-pengetahuan': 'kerajinan',
  'keselamatan-kerja-manajemen-risiko': 'keselamatan',
  'keberlanjutan-mata-pencaharian-kewirausahaan': 'keberlanjutan',
};

/**
 * Ilustrasi adegan bergaya buku cerita hangat. Satu komponen, satu bahasa visual:
 * langit bergradien, tiga lapis bukit, kabut, cahaya matahari, dan detail kecil.
 * Penderes hanya digambar sebagai siluet jauh tanpa wajah; tidak ada adegan memanjat untuk pelajar.
 */
export const Scene: React.FC<{ kind: SceneKind; className?: string; label?: string; svgProps?: React.SVGProps<SVGSVGElement> }> = ({
  kind,
  className = '',
  label,
  svgProps,
}) => {
  const id = useId().replace(/:/g, '');
  const u = (n: string) => `${n}${id}`;
  const ref = (n: string) => `url(#${u(n)})`;

  const sky: Record<SceneKind, [string, string, string]> = {
    splash: ['#F6D9A8', '#FBE9C9', '#F7F3E9'],
    penderes: ['#F4C98A', '#F9E2BC', '#F7F3E9'],
    memudar: ['#E4D9C2', '#EDE5D3', '#F1EBDD'],
    bersama: ['#F2B979', '#F8D9A8', '#FBEBCB'],
    identitas: ['#CFE3D2', '#EAF0DC', '#F7F3E9'],
    kerajinan: ['#F0C99A', '#F7E1C0', '#F7F3E9'],
    keselamatan: ['#C9E0DA', '#E6EEDC', '#F7F3E9'],
    keberlanjutan: ['#BFDCCB', '#E4EDD3', '#F7F3E9'],
  };
  const [s0, s1, s2] = sky[kind];
  const faded = kind === 'memudar';

  const defs = (
    <defs>
      <linearGradient id={u('sky')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={s0} />
        <stop offset="0.6" stopColor={s1} />
        <stop offset="1" stopColor={s2} />
      </linearGradient>
      <radialGradient id={u('sun')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFF6DC" />
        <stop offset="0.35" stopColor="#F7D08E" stopOpacity="0.95" />
        <stop offset="1" stopColor="#F7D08E" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={u('h1')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#CBC7A8" />
        <stop offset="1" stopColor="#B7BD9C" />
      </linearGradient>
      <linearGradient id={u('h2')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8DA882" />
        <stop offset="1" stopColor="#5F8268" />
      </linearGradient>
      <linearGradient id={u('h3')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3B6B4F" />
        <stop offset="1" stopColor="#1F4434" />
      </linearGradient>
      <linearGradient id={u('mist')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFDF8" stopOpacity="0" />
        <stop offset="1" stopColor="#FFFDF8" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id={u('soil')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8A5A2E" />
        <stop offset="1" stopColor="#5C3A1C" />
      </linearGradient>
      <radialGradient id={u('glow')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFD38A" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFD38A" stopOpacity="0" />
      </radialGradient>
      <pattern id={u('dots')} width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="0.9" fill="#18382C" opacity="0.07" />
        <circle cx="10" cy="10" r="0.7" fill="#18382C" opacity="0.05" />
      </pattern>
      <filter id={u('sepia')}>
        <feColorMatrix
          type="matrix"
          values="0.52 0.42 0.1 0 0.06  0.42 0.38 0.1 0 0.05  0.3 0.28 0.1 0 0.06  0 0 0 1 0"
        />
      </filter>
    </defs>
  );

  /* --- bagian kecil yang dipakai ulang --- */
  const Palm = ({ x, y, h = 90, s = 1, lean = 6, dark = false }: { x: number; y: number; h?: number; s?: number; lean?: number; dark?: boolean }) => {
    const topX = x + lean;
    const topY = y - h;
    const leaf = dark ? '#1F4434' : '#2F6A4B';
    const leaf2 = dark ? '#2B5A44' : '#4E8C63';
    return (
      <g>
        <path
          d={`M${x - 3 * s} ${y} Q${x + lean * 0.2} ${y - h * 0.5} ${topX - 2 * s} ${topY} L${topX + 2 * s} ${topY} Q${x + lean * 0.4 + 3 * s} ${y - h * 0.5} ${x + 3 * s} ${y}Z`}
          fill="#7A4F28"
        />
        <g transform={`translate(${topX} ${topY}) scale(${s})`}>
          <path d="M0 0 C-10 -14 -30 -16 -42 -6 C-28 -8 -14 -6 0 0Z" fill={leaf} />
          <path d="M0 0 C10 -14 30 -16 42 -6 C28 -8 14 -6 0 0Z" fill={leaf2} />
          <path d="M0 0 C-14 -4 -30 2 -38 14 C-24 8 -12 6 0 0Z" fill={leaf2} />
          <path d="M0 0 C14 -4 30 2 38 14 C24 8 12 6 0 0Z" fill={leaf} />
          <path d="M0 0 C-4 -12 -2 -24 6 -30 C8 -18 6 -8 0 0Z" fill={leaf2} />
          <circle cx="-3" cy="3" r="3" fill="#B87943" />
          <circle cx="3" cy="4" r="3" fill="#A0652F" />
        </g>
      </g>
    );
  };

  const Hills = ({ tone = 1 }: { tone?: number }) => (
    <g opacity={tone}>
      <path d="M0 150 C50 118 90 128 140 138 C200 108 260 120 320 132 C350 122 372 126 390 134 V210 H0Z" fill={ref('h1')} />
      <path d="M0 176 C60 146 120 160 180 168 C240 138 310 150 390 170 V230 H0Z" fill={ref('h2')} />
      <path d="M0 206 C70 184 130 196 200 204 C270 184 330 192 390 204 V300 H0Z" fill={ref('h3')} />
    </g>
  );

  const Mist = ({ y = 160, o = 1 }: { y?: number; o?: number }) => (
    <g className="mist-drift" opacity={o}>
      <ellipse cx="90" cy={y} rx="140" ry="16" fill={ref('mist')} />
      <ellipse cx="300" cy={y + 18} rx="130" ry="14" fill={ref('mist')} />
    </g>
  );

  const Sun = ({ x = 300, y = 96, r = 70 }: { x?: number; y?: number; r?: number }) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={ref('sun')} />
      <circle cx={x} cy={y} r={r * 0.28} fill="#FFF3D2" />
    </g>
  );

  const Pongkor = ({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x="-9" y="-44" width="18" height="44" rx="5" fill="#D9B16B" />
      <rect x="-9" y="-44" width="6" height="44" rx="3" fill="#F0D190" opacity="0.7" />
      <rect x="-9.5" y="-30" width="19" height="3" rx="1.5" fill="#9A6B34" />
      <rect x="-9.5" y="-14" width="19" height="3" rx="1.5" fill="#9A6B34" />
      <ellipse cx="0" cy="-44" rx="9" ry="3" fill="#7A4A20" />
      <ellipse cx="0" cy="-44" rx="6" ry="1.8" fill="#C8853F" />
    </g>
  );

  const Tungku = ({ x, y, s = 1, steam = true }: { x: number; y: number; s?: number; steam?: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="46" ry="7" fill="#18382C" opacity="0.18" />
      <path d="M-40 0 C-40 -26 -28 -34 0 -34 C28 -34 40 -26 40 0Z" fill="#A9693A" />
      <path d="M-40 0 C-40 -14 -34 -24 -22 -30 C-30 -18 -28 -6 -26 0Z" fill="#C98552" opacity="0.7" />
      <path d="M-13 0 C-13 -14 -8 -20 0 -20 C8 -20 13 -14 13 0Z" fill="#3A2412" />
      <path d="M-6 0 C-6 -8 -3 -12 0 -14 C3 -12 6 -8 6 0Z" fill="#F29A3B" />
      <path d="M-3 0 C-3 -5 -1 -8 0 -9 C1 -8 3 -5 3 0Z" fill="#FFD27A" />
      {/* wajan */}
      <path d="M-34 -34 C-30 -50 30 -50 34 -34 C20 -30 -20 -30 -34 -34Z" fill="#3B3F3A" />
      <path d="M-30 -39 C-14 -44 14 -44 30 -39 C14 -35 -14 -35 -30 -39Z" fill="#B8742E" />
      {steam && (
        <g fill="none" stroke="#FFFDF8" strokeWidth="4" strokeLinecap="round" opacity="0.8" className="mist-drift">
          <path d="M-14 -50 C-22 -60 -8 -66 -16 -78" />
          <path d="M2 -52 C-6 -64 10 -70 2 -86" />
          <path d="M18 -50 C10 -60 24 -66 16 -76" />
        </g>
      )}
    </g>
  );

  const Pack = ({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-18 0 L-20 -44 Q0 -50 20 -44 L18 0Z" fill="#FFFDF8" stroke="#DCCDB2" strokeWidth="1.5" />
      <path d="M-19 -40 Q0 -46 19 -40 V-32 Q0 -38 -19 -32Z" fill="#B87943" />
      <rect x="-10" y="-26" width="20" height="20" rx="2" fill="#FFFDF8" stroke="#18382C" strokeWidth="1" />
      <g fill="#18382C">
        <rect x="-8" y="-24" width="6" height="6" />
        <rect x="2" y="-24" width="6" height="6" />
        <rect x="-8" y="-14" width="6" height="6" />
        <rect x="0" y="-16" width="2" height="2" />
        <rect x="4" y="-12" width="4" height="2" />
        <rect x="-1" y="-11" width="2" height="4" />
      </g>
    </g>
  );

  /** Siluet orang bulat tanpa wajah, bahasa visual yang aman dan ramah. */
  const Person = ({ x, y, s = 1, color = '#2B5A44', hat = false }: { x: number; y: number; s?: number; color?: string; hat?: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="1" rx="13" ry="3" fill="#18382C" opacity="0.2" />
      <path d="M-12 0 C-12 -20 -8 -28 0 -28 C8 -28 12 -20 12 0Z" fill={color} />
      <circle cx="0" cy="-36" r="9" fill="#C68A52" />
      {hat && <path d="M-14 -39 C-6 -52 6 -52 14 -39 C6 -42 -6 -42 -14 -39Z" fill="#D9B16B" />}
    </g>
  );

  const Rumah = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-22" y="-26" width="44" height="26" fill="#E9D7B4" />
      <path d="M-28 -24 L0 -48 L28 -24Z" fill="#B9674C" />
      <rect x="-5" y="-16" width="10" height="16" rx="2" fill="#7A4A20" />
      <rect x="-18" y="-20" width="8" height="8" rx="1" fill="#F7D08E" />
      <rect x="10" y="-20" width="8" height="8" rx="1" fill="#F7D08E" />
    </g>
  );

  const Sparkle = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
    <path d={`M${x} ${y - 7 * s} L${x + 2 * s} ${y - 2 * s} L${x + 7 * s} ${y} L${x + 2 * s} ${y + 2 * s} L${x} ${y + 7 * s} L${x - 2 * s} ${y + 2 * s} L${x - 7 * s} ${y} L${x - 2 * s} ${y - 2 * s}Z`} fill="#FFF3D2" opacity="0.95" />
  );

  /** Kartu warisan kecil melayang. */
  const Card = ({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x="-22" y="-30" width="44" height="60" rx="6" fill="#FFFDF8" stroke="#B87943" strokeWidth="2" />
      <rect x="-16" y="-24" width="32" height="30" rx="4" fill="#E9D7B4" />
      <path d="M-16 6 C-8 -8 0 -2 6 -10 C10 -14 14 -10 16 -6 V6Z" fill="#6E9F78" />
      <circle cx="8" cy="-16" r="4" fill="#F2B24E" />
      <rect x="-14" y="12" width="28" height="3" rx="1.5" fill="#B87943" />
      <rect x="-14" y="19" width="18" height="3" rx="1.5" fill="#DCCDB2" />
      <rect x="-24" y="-32" width="5" height="5" fill="#B87943" transform="rotate(45 -21.5 -29.5)" />
      <rect x="19" y="27" width="5" height="5" fill="#B87943" transform="rotate(45 21.5 29.5)" />
    </g>
  );

  /* --- komposisi per adegan --- */
  let body: React.ReactNode;
  switch (kind) {
    case 'splash':
      body = (
        <>
          <Sun x={195} y={110} r={96} />
          <Hills />
          <Palm x={60} y={214} h={110} s={1.1} lean={-8} dark />
          <Palm x={330} y={212} h={120} s={1.2} lean={8} dark />
          <Palm x={110} y={196} h={70} s={0.8} lean={4} />
          <Palm x={290} y={196} h={66} s={0.75} lean={-4} />
          <Rumah x={230} y={198} s={0.7} />
          <Mist y={170} />
          <Sparkle x={70} y={60} s={1.2} />
          <Sparkle x={330} y={50} />
          <Sparkle x={150} y={36} s={0.8} />
        </>
      );
      break;
    case 'penderes':
      body = (
        <>
          <Sun x={300} y={110} r={84} />
          <Hills />
          <Mist y={166} />
          {/* siluet penderes dari jauh, tanpa wajah, di kebun seberang */}
          <g transform="translate(120 150)" fill="#2B4A3A" opacity="0.85">
            <path d="M0 0 Q4 -40 2 -76" stroke="#2B4A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="3" cy="-80" r="3.2" />
            <path d="M0 -76 q3 -2 6 0 l2 14 h-8Z" />
            <path d="M6 -70 q10 -2 14 -8" stroke="#2B4A3A" strokeWidth="2" fill="none" />
            <rect x="19" y="-90" width="4" height="12" rx="2" fill="#D9B16B" />
            <g transform="translate(0 -88) scale(0.55)">
              <path d="M0 0 C-10 -14 -30 -16 -42 -6 C-28 -8 -14 -6 0 0Z" />
              <path d="M0 0 C10 -14 30 -16 42 -6 C28 -8 14 -6 0 0Z" />
              <path d="M0 0 C-4 -12 -2 -24 6 -30 C8 -18 6 -8 0 0Z" />
            </g>
          </g>
          <Palm x={52} y={216} h={116} s={1.15} lean={-6} dark />
          <Palm x={338} y={214} h={126} s={1.25} lean={6} dark />
          <Palm x={250} y={196} h={72} s={0.8} lean={3} />
          {/* pongkor di tanah, tempat nira dikumpulkan dan diantar ke dapur */}
          <ellipse cx="190" cy="262" rx="58" ry="10" fill="#18382C" opacity="0.25" />
          <Pongkor x={168} y={262} s={1.5} rot={-4} />
          <Pongkor x={206} y={264} s={1.25} rot={5} />
          <g fill="#F2B24E">
            <ellipse cx="168" cy="196" rx="2.2" ry="4" />
            <ellipse cx="206" cy="208" rx="2" ry="3.6" />
          </g>
          <Sparkle x={90} y={54} s={1.2} />
          <Sparkle x={200} y={34} s={0.8} />
        </>
      );
      break;
    case 'memudar':
      body = (
        <>
          <g filter={ref('sepia')}>
            <Sun x={300} y={110} r={70} />
            <Hills tone={0.9} />
            <Palm x={52} y={216} h={116} s={1.15} lean={-6} dark />
            <Palm x={338} y={214} h={126} s={1.25} lean={6} dark />
            <Rumah x={210} y={200} s={0.8} />
            <Mist y={168} o={1.2} />
          </g>
          {/* alat dan pengetahuan yang memudar: garis putus-putus seperti kenangan */}
          <g fill="none" stroke="#7A4A20" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.7" strokeLinecap="round">
            <path d="M118 262 V222 Q118 216 124 216 H134 Q140 216 140 222 V262Z" />
            <path d="M200 262 C200 240 210 232 232 232 C254 232 264 240 264 262Z" />
            <path d="M212 232 C216 220 248 220 252 232" />
          </g>
          <g fill="#FFFDF8" opacity="0.8" className="mist-drift">
            <circle cx="150" cy="210" r="3" />
            <circle cx="170" cy="198" r="2" />
            <circle cx="284" cy="212" r="2.5" />
            <circle cx="300" cy="198" r="1.6" />
          </g>
          <rect width="390" height="300" fill="#EDE5D3" opacity="0.22" />
        </>
      );
      break;
    case 'bersama':
      body = (
        <>
          <Sun x={195} y={100} r={110} />
          <Hills />
          <Palm x={42} y={216} h={100} s={1.05} lean={-6} dark />
          <Palm x={352} y={216} h={104} s={1.1} lean={6} dark />
          <circle cx="195" cy="238" r="96" fill={ref('glow')} />
          <ellipse cx="195" cy="266" rx="150" ry="22" fill={ref('soil')} opacity="0.9" />
          <Person x={86} y={266} s={1.15} color="#B9674C" />
          <Person x={134} y={274} s={1.2} color="#2B5A44" hat />
          <Person x={256} y={274} s={1.2} color="#8F5A2C" />
          <Person x={306} y={266} s={1.1} color="#5E8068" hat />
          <Tungku x={195} y={270} s={1.35} />
          <Pack x={342} y={282} s={0.8} rot={6} />
          <Pongkor x={52} y={284} s={0.8} rot={-4} />
          <g fill="#FFD38A">
            <circle cx="150" cy="150" r="2" />
            <circle cx="240" cy="136" r="2.4" />
            <circle cx="208" cy="120" r="1.6" />
          </g>
          <Sparkle x={84} y={60} s={1.1} />
          <Sparkle x={320} y={70} s={0.9} />
        </>
      );
      break;
    case 'identitas':
      body = (
        <>
          <Sun x={90} y={80} r={60} />
          <Hills />
          <Palm x={330} y={212} h={104} s={1.1} lean={6} dark />
          <Palm x={60} y={206} h={84} s={0.95} lean={-6} />
          <Rumah x={150} y={206} s={1.1} />
          <Rumah x={250} y={212} s={0.85} />
          {/* gapura desa */}
          <g transform="translate(195 270)">
            <ellipse cx="0" cy="2" rx="70" ry="9" fill="#18382C" opacity="0.2" />
            <rect x="-56" y="-62" width="12" height="62" fill="#8F5A2C" />
            <rect x="44" y="-62" width="12" height="62" fill="#8F5A2C" />
            <path d="M-66 -62 H66 L54 -76 H-54Z" fill="#B9674C" />
            <rect x="-48" y="-58" width="96" height="14" fill="#E9D7B4" />
            <rect x="-30" y="-54" width="60" height="3" rx="1.5" fill="#8F5A2C" />
            <rect x="-22" y="-48" width="44" height="2.5" rx="1.2" fill="#B87943" />
          </g>
          <Card x={92} y={110} rot={-12} s={0.9} />
          <Card x={300} y={96} rot={10} s={0.8} />
          <Mist y={176} o={0.8} />
          <Sparkle x={196} y={70} s={1} />
        </>
      );
      break;
    case 'kerajinan':
      body = (
        <>
          <Sun x={86} y={84} r={62} />
          <Hills />
          <Palm x={348} y={212} h={100} s={1.1} lean={6} dark />
          <ellipse cx="195" cy="270" rx="170" ry="26" fill={ref('soil')} opacity="0.9" />
          <Tungku x={150} y={272} s={1.45} />
          {/* cetakan gula dan alat */}
          <g transform="translate(268 270)">
            <ellipse cx="0" cy="2" rx="50" ry="7" fill="#18382C" opacity="0.2" />
            <rect x="-44" y="-18" width="88" height="18" rx="4" fill="#9A6B34" />
            {[-30, -10, 10, 30].map((cx) => (
              <ellipse key={cx} cx={cx} cy="-14" rx="8" ry="3.4" fill="#C8853F" />
            ))}
            <path d="M-42 -22 L-10 -50" stroke="#7A4A20" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="-8" cy="-52" rx="9" ry="5" fill="#D9B16B" transform="rotate(-40 -8 -52)" />
          </g>
          <Pongkor x={344} y={282} s={0.95} rot={4} />
          <g fill="#FFD38A">
            <circle cx="120" cy="170" r="2" />
            <circle cx="186" cy="156" r="2.4" />
          </g>
          <Mist y={178} o={0.7} />
        </>
      );
      break;
    case 'keselamatan':
      body = (
        <>
          <Sun x={300} y={84} r={62} />
          <Hills />
          <Palm x={46} y={212} h={104} s={1.1} lean={-6} dark />
          {/* seluruh kegiatan di darat: pagar rendah, ember air, kayu bakar, sandal, rambu aman */}
          <ellipse cx="195" cy="270" rx="176" ry="26" fill={ref('soil')} opacity="0.9" />
          <g transform="translate(110 262)">
            <ellipse cx="0" cy="4" rx="44" ry="6" fill="#18382C" opacity="0.2" />
            <path d="M-36 -10 H36" stroke="#7A4A20" strokeWidth="5" strokeLinecap="round" />
            <path d="M-36 -26 H36" stroke="#7A4A20" strokeWidth="5" strokeLinecap="round" />
            {[-32, -10, 12, 34].map((x) => (
              <rect key={x} x={x - 3} y="-32" width="6" height="36" rx="3" fill="#9A6B34" />
            ))}
          </g>
          <g transform="translate(222 266)">
            <ellipse cx="0" cy="4" rx="26" ry="5" fill="#18382C" opacity="0.2" />
            <path d="M-18 -30 H18 L14 0 H-14Z" fill="#6FA5B8" />
            <path d="M-18 -30 H18 L17 -24 H-17Z" fill="#4F8499" />
            <path d="M-14 -34 Q0 -50 14 -34" stroke="#3B3F3A" strokeWidth="2.5" fill="none" />
            <path d="M-10 -14 q5 -4 10 0 q5 4 10 0" stroke="#EAF6FA" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g transform="translate(282 266)">
            <ellipse cx="0" cy="4" rx="30" ry="5" fill="#18382C" opacity="0.2" />
            {[-14, 0, 14].map((x) => (
              <rect key={x} x={x - 6} y="-12" width="12" height="12" rx="5" fill="#A9693A" />
            ))}
            <rect x="-10" y="-22" width="20" height="12" rx="5" fill="#B87943" />
          </g>
          <g transform="translate(340 270)">
            <rect x="-2" y="-62" width="4" height="62" fill="#7A4A20" />
            <path d="M-20 -88 H20 V-64 Q0 -52 -20 -64Z" fill="#2F6A4B" stroke="#FFFDF8" strokeWidth="2" />
            <path d="M-9 -76 L-3 -69 L10 -83" stroke="#FFFDF8" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Mist y={178} o={0.7} />
        </>
      );
      break;
    case 'keberlanjutan':
      body = (
        <>
          <Sun x={96} y={80} r={62} />
          <Hills />
          <Palm x={300} y={212} h={90} s={1} lean={5} dark />
          <Palm x={350} y={216} h={56} s={0.7} lean={3} />
          <ellipse cx="195" cy="272" rx="176" ry="26" fill={ref('soil')} opacity="0.9" />
          {/* bibit kelapa baru: regenerasi kebun */}
          {[60, 108, 156].map((x, i) => (
            <g key={x} transform={`translate(${x} 268) scale(${1 + i * 0.18})`}>
              <path d="M0 0 Q1 -14 0 -26" stroke="#4E8C63" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M0 -24 C-10 -34 -22 -32 -26 -24 C-16 -26 -8 -26 0 -24Z" fill="#4E8C63" />
              <path d="M0 -24 C10 -34 22 -32 26 -24 C16 -26 8 -26 0 -24Z" fill="#6AA878" />
              <ellipse cx="0" cy="2" rx="11" ry="3.5" fill="#5C3A1C" />
            </g>
          ))}
          <Pack x={236} y={278} s={1.3} rot={-4} />
          <Pack x={290} y={282} s={1} rot={6} />
          {/* koin kecil: penghasilan perajin */}
          <g transform="translate(330 262)">
            <circle r="13" fill="#E9B65A" stroke="#B87943" strokeWidth="2" />
            <path d="M-5 -2 Q0 -9 5 -2 Q0 8 -5 -2Z" fill="#B87943" />
          </g>
          <Sparkle x={200} y={90} s={1.1} />
          <Mist y={178} o={0.6} />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 390 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ?? t(`Ilustrasi adegan ${kind}`, `Scene illustration: ${kind}`)}
      className={className}
      {...svgProps}
    >
      {defs}
      <rect width="390" height="300" fill={ref('sky')} />
      <rect width="390" height="300" fill={ref('dots')} />
      {body}
    </svg>
  );
};
