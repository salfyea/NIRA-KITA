import React from 'react';

/**
 * Elemen visual organik untuk alur awal: garis alam, daun, tunas, dan tetesan nira.
 * Semuanya digambar sendiri sebagai SVG, tanpa set ikon generik.
 */

/** Tepi bergelombang di dasar ilustrasi, menggantikan sudut bulat yang kaku. */
export const WaveEdge: React.FC<{ color?: string; className?: string }> = ({ color = '#F7F3E9', className = '' }) => (
  <svg viewBox="0 0 390 40" preserveAspectRatio="none" aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-[-1px] h-9 w-full ${className}`}>
    <path d="M0 24 C38 8 76 6 118 18 C168 33 214 32 262 17 C306 3 348 5 390 20 V40 H0Z" fill={color} />
  </svg>
);

/** Pemisah: garis tipis dengan tunas kelapa di tengah. */
export const Frond: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 132 22" width="132" height="22" aria-hidden className={className}>
    <path d="M4 12 C20 9 34 14 52 11 M80 11 C98 14 112 9 128 12" stroke="#B87943" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.75" />
    <path d="M66 19 C66 14 66 10 66 5" stroke="#2F6A4B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M66 9 C59 2 50 3 45 8 C53 7 60 8 66 9Z" fill="#4E8C63" />
    <path d="M66 9 C73 2 82 3 87 8 C79 7 72 8 66 9Z" fill="#6CBF6B" />
    <circle cx="66" cy="4" r="1.6" fill="#B87943" />
  </svg>
);

/** Panah gambar tangan dengan ujung berbentuk daun. */
export const LeafArrow: React.FC<{ className?: string; flip?: boolean }> = ({ className = 'h-5 w-5', flip }) => (
  <svg viewBox="0 0 24 24" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden fill="none">
    <path d="M3 12.6 C8 11.4 13 13.4 20.5 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M14.6 6.4 C16.9 9 19 10.9 21.2 12.1 C19 13.3 16.9 15.2 14.8 17.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Satu tunas: batang dan dua daun. Ukuran naik dari tahap ke tahap supaya terasa tumbuh. */
const Seedling: React.FC<{ stage: 'ahead' | 'now' | 'past'; size: number }> = ({ stage, size }) => {
  const leaf = stage === 'now' ? '#2F6A4B' : stage === 'past' ? '#A9B7A0' : 'none';
  const leaf2 = stage === 'now' ? '#6CBF6B' : stage === 'past' ? '#C4CFB9' : 'none';
  const line = stage === 'ahead' ? '#CDBE9F' : stage === 'now' ? '#7A4F28' : '#B9AC90';
  return (
    <svg viewBox="0 0 24 28" width={size} height={size * 1.16} aria-hidden>
      <path d="M12 26 C12 19 12 14 12 8" stroke={line} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M12 12 C6 12 3 8 3.5 4.5 C8.5 4.5 12 7 12 12Z" fill={leaf} stroke={stage === 'ahead' ? '#CDBE9F' : 'none'} strokeWidth="1.3" />
      <path d="M12 10 C18 10 21 6 20.5 2.5 C15.5 2.5 12 5 12 10Z" fill={leaf2} stroke={stage === 'ahead' ? '#CDBE9F' : 'none'} strokeWidth="1.3" />
      {stage === 'now' && <circle cx="12" cy="26.5" r="1.4" fill="#B87943" />}
    </svg>
  );
};

/** Penanda halaman berupa tunas yang tumbuh. Tiap tunas tetap tombol yang bisa diketuk (target 44 px). */
export const SproutDots: React.FC<{ count: number; index: number; onSelect: (n: number) => void; label?: string }> = ({ count, index, onSelect, label = 'Slide' }) => (
  <div className="relative flex items-center" role="tablist" aria-label={label}>
    <svg className="pointer-events-none absolute inset-x-5 top-1/2 h-3 -translate-y-1/2" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden>
      <path d="M0 6 C16 1 30 11 50 6 S84 1 100 6" stroke="#DCCDB2" strokeWidth="1.6" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
    {Array.from({ length: count }, (_, n) => (
      <button key={n} type="button" role="tab" aria-selected={n === index} aria-label={`${label} ${n + 1}`} onClick={() => onSelect(n)} className="relative flex h-11 w-11 items-center justify-center">
        <Seedling stage={n === index ? 'now' : n < index ? 'past' : 'ahead'} size={21 + n * 4} />
      </button>
    ))}
  </div>
);

/** Tiga tetes nira jatuh bergantian, sebagai penanda memuat. */
export const SapDrops: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-end gap-3 ${className}`} role="status" aria-label="Memuat">
    {[0, 1, 2].map((i) => (
      <svg key={i} viewBox="0 0 14 20" width="12" height="17" aria-hidden style={{ animation: 'sap-fall 1.6s ease-in infinite', animationDelay: `${i * 0.32}s` }}>
        <path d="M7 1 C7 1 1.5 8.5 1.5 12.6 A5.5 5.5 0 0 0 12.5 12.6 C12.5 8.5 7 1 7 1Z" fill="#E0A04C" />
        <path d="M4.2 12 A3 3 0 0 0 7 15" stroke="#FFF3D2" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </svg>
    ))}
  </div>
);

/** Gelembung bicara organik: satu sudut meruncing menunjuk ke Nira. */
export const Bubble: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-[22px_26px_24px_6px] bg-coconut px-4 py-2.5 text-left text-[13.5px] font-semibold leading-snug text-deep-forest shadow-[0_10px_20px_-10px_rgba(16,38,30,0.65)] ${className}`}>{children}</div>
);

/** Garis bawah bergelombang untuk tab aktif. */
export const Swash: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-1 h-2 w-full ${className}`}>
    <path d="M2 5 C18 1 38 7 58 3 S90 5 98 3" stroke="#B87943" strokeWidth="2.6" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
  </svg>
);

/** Barisan helai rumput di dasar layar, supaya tanah tidak berupa blok hijau polos. */
export const GrassBlades: React.FC<{ className?: string }> = ({ className = '' }) => {
  const blades = Array.from({ length: 46 }, (_, i) => {
    const x = (i / 45) * 390;
    const h = 22 + ((i * 37) % 26);
    const lean = ((i * 53) % 21) - 10;
    const tone = ['#2F6A4B', '#3A7A57', '#285A41', '#4E8C63'][i % 4];
    return <path key={i} d={`M${x} 60 C${x + lean * 0.3} ${60 - h * 0.5} ${x + lean * 0.8} ${60 - h * 0.8} ${x + lean} ${60 - h}`} stroke={tone} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity="0.85" />;
  });
  return (
    <svg viewBox="0 0 390 60" preserveAspectRatio="none" aria-hidden className={`pointer-events-none absolute inset-x-0 h-14 w-full ${className}`}>
      {blades}
    </svg>
  );
};
