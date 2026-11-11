import React from 'react';
import { Check, MapPin, X } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Scene, SLUG_SCENE } from '../art/Scene';
import { ApprovalChip } from '../components/ui';
import { isLearnerVisible, useStore } from '../store';

/** Posisi dalam persen bidang peta. Jarak hanya perkiraan kasar tingkat desa (simulasi). */
const VILLAGES = [
  { id: 'REC-CLG-001', village: 'Pernasidi', x: 32, y: 52, dist: 'sekitar 1 km' },
  { id: 'REC-CLG-002', village: 'Panembangan', x: 72, y: 38, dist: 'sekitar 3 km' },
  { id: 'REC-CLG-004', village: 'Karangtengah', x: 60, y: 74, dist: 'sekitar 5 km' },
];

const TILT = 58;

/** Benda tegak di atas bidang miring: diputar balik supaya selalu menghadap pemain. */
const Billboard: React.FC<{ x: number; y: number; children: React.ReactNode; z?: number }> = ({ x, y, children, z }) => (
  <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transformStyle: 'preserve-3d', zIndex: z }}>
    <div style={{ transform: `translate(-50%, -100%) rotateX(-${TILT}deg)`, transformOrigin: '50% 100%' }}>{children}</div>
  </div>
);

const MiniPalm: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={34 * s} height={46 * s} viewBox="0 0 34 46" aria-hidden>
    <path d="M15 46 Q17 28 17 14 L19 14 Q19 28 21 46Z" fill="#7A4F28" />
    <path d="M18 14 C8 4 -2 6 -2 12 C6 10 12 11 18 14Z" fill="#2F6A4B" />
    <path d="M18 14 C28 4 38 6 38 12 C30 10 24 11 18 14Z" fill="#4E8C63" />
    <path d="M18 14 C12 10 12 2 18 -2 C24 2 24 10 18 14Z" fill="#3F7A57" transform="translate(0 4)" />
    <circle cx="16" cy="16" r="2.5" fill="#B87943" />
    <circle cx="21" cy="17" r="2.5" fill="#A0652F" />
  </svg>
);

const MiniHouse: React.FC = () => (
  <svg width="38" height="34" viewBox="0 0 38 34" aria-hidden>
    <rect x="5" y="14" width="28" height="18" fill="#E9D7B4" />
    <path d="M1 15 L19 1 L37 15Z" fill="#B9674C" />
    <rect x="16" y="20" width="7" height="12" rx="1.5" fill="#7A4A20" />
    <rect x="8" y="18" width="5" height="5" fill="#F7D08E" />
  </svg>
);

export const Peta: React.FC = () => {
  const { records, collected, checkIn, session } = useStore();
  const [sel, setSel] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState<string | null>(null);

  const spot = VILLAGES.find((v) => v.id === sel);
  // Hanya rekaman yang disetujui kurator dan boleh dilihat pelajar.
  const rec = records.find((r) => r.id === sel && isLearnerVisible(r));
  const got = sel ? collected.includes(sel) : false;
  const reveal = records.find((r) => r.id === revealed);

  return (
    <div className="relative h-full min-h-[560px] overflow-hidden" style={{ background: 'linear-gradient(#F6D9A8 0%, #FBE9C9 22%, #DCE6C4 38%, #8FB07A 60%, #7FA56F 100%)' }}>
      {/* langit dan kabut di cakrawala */}
      <div className="absolute inset-x-0 top-0 h-[34%]">
        <div className="absolute right-10 top-8 h-16 w-16 rounded-full bg-[#FFF3D2] shadow-[0_0_60px_28px_rgba(247,208,142,0.8)]" />
        <svg viewBox="0 0 390 130" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-full w-full" aria-hidden>
          <path d="M0 96 C50 64 100 80 150 88 C210 56 290 70 390 92 V130 H0Z" fill="#B9BF9E" opacity="0.8" />
          <path d="M0 112 C70 88 140 104 210 108 C280 90 340 98 390 106 V130 H0Z" fill="#8FA884" />
        </svg>
      </div>

      {/* bidang peta miring */}
      <div className="absolute inset-x-0 bottom-0 top-[22%]" style={{ perspective: '1100px', perspectiveOrigin: '50% 0%' }}>
        <div
          className="absolute"
          style={{
            left: '-8%',
            right: '-8%',
            top: '0%',
            height: '115%',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 0%',
            transform: `rotateX(${TILT}deg)`,
          }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#A9C48B" />
                <stop offset="1" stopColor="#7FA56F" />
              </linearGradient>
              <pattern id="padi" width="3" height="2.4" patternUnits="userSpaceOnUse">
                <rect width="3" height="2.4" fill="#C6D87A" />
                <rect width="3" height="1" fill="#B2C766" />
              </pattern>
              <pattern id="padi2" width="2.6" height="2" patternUnits="userSpaceOnUse">
                <rect width="2.6" height="2" fill="#9DBE72" />
                <rect width="2.6" height="0.8" fill="#8CB064" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grass)" />
            {/* sawah */}
            <path d="M6 18 L36 14 L40 32 L8 36Z" fill="url(#padi)" stroke="#8CA55A" strokeWidth="0.5" />
            <path d="M44 48 L70 52 L66 68 L42 64Z" fill="url(#padi2)" stroke="#7D9B5A" strokeWidth="0.5" />
            <path d="M8 74 L30 70 L34 88 L10 92Z" fill="url(#padi)" stroke="#8CA55A" strokeWidth="0.5" />
            <path d="M78 62 L94 60 L94 84 L80 86Z" fill="url(#padi2)" stroke="#7D9B5A" strokeWidth="0.5" />
            {/* sungai */}
            <path d="M-4 40 C20 44 34 30 52 38 C72 46 80 28 104 34" fill="none" stroke="#8DBFC4" strokeWidth="6" strokeLinecap="round" />
            <path d="M-4 40 C20 44 34 30 52 38 C72 46 80 28 104 34" fill="none" stroke="#C8E6E8" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 4" />
            {/* jalan menghubungkan tiga desa */}
            <path d="M26 56 C40 62 48 44 72 38 C82 52 70 66 62 78 C50 88 36 84 26 56Z" fill="none" stroke="#E9D7B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26 56 C40 62 48 44 72 38 C82 52 70 66 62 78 C50 88 36 84 26 56Z" fill="none" stroke="#F7F3E9" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>

          {/* cincin pulsa di bawah Nira */}
          <div className="absolute" style={{ left: '48%', top: '58%' }}>
            <span className="absolute -left-10 -top-10 block h-20 w-20 rounded-full bg-coconut/60 ring-4 ring-caramel" />
            <span className="marker-ring absolute -left-10 -top-10 block h-20 w-20 rounded-full border-4 border-caramel-dark" />
          </div>

          {/* pohon kelapa dan rumah */}
          <Billboard x={14} y={44}><MiniPalm /></Billboard>
          <Billboard x={44} y={24}><MiniPalm s={0.9} /></Billboard>
          <Billboard x={88} y={46}><MiniPalm /></Billboard>
          <Billboard x={50} y={92}><MiniPalm s={1.1} /></Billboard>
          <Billboard x={84} y={92}><MiniPalm s={0.9} /></Billboard>
          <Billboard x={18} y={30}><MiniHouse /></Billboard>
          <Billboard x={56} y={66}><MiniHouse /></Billboard>
          <Billboard x={80} y={74}><MiniHouse /></Billboard>

          {/* avatar Nira */}
          <Billboard x={48} y={58} z={5}>
            <span className="flex flex-col items-center">
              <span style={{ filter: 'drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1.5px #fff) drop-shadow(0 2px 3px rgba(24,56,44,0.5))' }}>
                <Nira mood="wave" size={62} float={false} />
              </span>
              <span className="-mt-1 rounded-full bg-caramel-dark px-2.5 py-0.5 text-xs font-bold text-coconut shadow">Kamu</span>
            </span>
          </Billboard>

          {/* penanda desa */}
          {VILLAGES.map((v) => {
            const done = collected.includes(v.id);
            return (
              <Billboard key={v.id} x={v.x} y={v.y} z={10}>
                <button
                  type="button"
                  onClick={() => {
                    setSel(v.id);
                    setRevealed(null);
                  }}
                  aria-label={`Desa ${v.village}, ${v.dist}${done ? ', sudah terkumpul' : ''}`}
                  className="marker-bob flex min-h-[44px] min-w-[44px] flex-col items-center"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-coconut shadow-lg ${
                      done ? 'bg-forest text-coconut' : 'bg-caramel-dark text-coconut'
                    }`}
                  >
                    {done ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                  </span>
                  <span className="mt-1 whitespace-nowrap rounded-full bg-coconut px-2 py-0.5 text-xs font-bold text-deep-forest shadow">
                    {v.village}
                  </span>
                  <span className="mt-0.5 whitespace-nowrap rounded-full bg-deep-forest/85 px-2 py-0.5 text-[11px] font-semibold text-coconut">
                    {v.dist}
                  </span>
                </button>
              </Billboard>
            );
          })}
        </div>
      </div>

      {/* kabut di cakrawala */}
      <div className="mist-drift pointer-events-none absolute inset-x-0 top-[24%] h-16 bg-gradient-to-b from-transparent via-coconut/70 to-transparent" />

      {/* label permanen: peta hanyalah simulasi */}
      <p className="absolute inset-x-3 top-3 z-20 rounded-xl bg-coconut/95 px-3 py-2 text-center text-xs font-semibold leading-snug text-deep-forest shadow">
        Simulasi, lokasi kasar tingkat desa, bukan pelacakan langsung
      </p>
      <p className="absolute bottom-2 left-3 z-10 rounded-full bg-coconut/90 px-2.5 py-1 text-xs font-semibold text-ink-soft">
        {session?.name ?? 'Kamu'} · ketuk penanda desa
      </p>

      {/* bottom sheet desa */}
      {spot && (
        <div className="sheet-enter absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-cream p-5 shadow-[0_-12px_30px_-12px_rgba(16,38,30,0.5)]">
          <button
            type="button"
            onClick={() => {
              setSel(null);
              setRevealed(null);
            }}
            aria-label="Tutup"
            className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-deep-forest"
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
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Kartu warisan terbuka · +20 XP</p>
              <h3 className="text-xl leading-tight text-deep-forest">{reveal.title}</h3>
              <div className="mt-2 flex justify-center">
                <ApprovalChip record={reveal} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{reveal.shortDescription}</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
                Desa {spot.village} · {spot.dist}
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
                    {got ? 'Sudah terkumpul' : 'Check-in terpandu'}
                  </button>
                  <p className="mt-2 text-xs text-ink-soft">Check-in terpandu hanya simulasi di dalam aplikasi, tanpa membaca lokasi nyata.</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-ink-soft">Belum ada cerita yang disetujui kurator untuk desa ini.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
