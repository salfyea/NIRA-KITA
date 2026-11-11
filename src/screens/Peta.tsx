import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, MapPin } from 'lucide-react';
import { useStore } from '../store';
import { Ornate } from '../components/ui';

const SPOTS = [
  { id: 'REC-CLG-002', village: 'Pernasidi', x: 28, y: 58 },
  { id: 'REC-CLG-003', village: 'Panembangan', x: 66, y: 44 },
  { id: 'REC-CLG-005', village: 'Karangtengah', x: 46, y: 76 },
];

export const Peta: React.FC = () => {
  const { records, collected, checkIn, showToast } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const spot = SPOTS.find((s) => s.id === sel);
  const rec = records.find((r) => r.id === sel);
  const got = sel ? collected.includes(sel) : false;
  return (
    <div className="relative h-full min-h-full overflow-hidden bg-[#cfd9b8]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, #dbe5c4, #b7c99d 60%, #9fb887)' }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M0 70 C25 60 40 80 100 55" stroke="#f7f3e9" strokeWidth="1.6" fill="none" />
        <path d="M20 0 C30 30 50 40 45 100" stroke="#e8d9b5" strokeWidth="1" fill="none" />
        <path d="M0 20 C40 30 70 10 100 25" stroke="#8fb5b0" strokeWidth="1.4" fill="none" />
      </svg>
      <Link to="/learn/paspor" className="absolute left-4 top-5 z-10 flex items-center gap-1 rounded-full bg-coconut/90 px-3 py-2 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> Paspor
      </Link>
      <p className="absolute right-4 top-5 z-10 max-w-[150px] rounded-xl bg-coconut/90 px-3 py-2 text-[11px] leading-snug text-ink-soft">
        Simulasi. Lokasi kasar tingkat desa, bukan pelacakan langsung.
      </p>
      {SPOTS.map((s) => {
        const done = collected.includes(s.id);
        return (
          <button key={s.id} onClick={() => setSel(s.id)} aria-label={`Desa ${s.village}`} className="absolute z-10 -translate-x-1/2 -translate-y-full" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <span className="marker-bob flex flex-col items-center">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-coconut shadow-lg ${done ? 'bg-forest text-coconut' : 'bg-caramel text-coconut'}`}>
                {done ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
              </span>
              <span className="mt-1 rounded-full bg-coconut/90 px-2 py-0.5 text-[11px] font-semibold text-deep-forest">{s.village}</span>
            </span>
          </button>
        );
      })}
      {sel && spot && rec && (
        <div className="sheet-enter absolute inset-x-0 bottom-0 z-20 p-4">
          <Ornate className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-caramel-dark">Desa {spot.village}</p>
            <h3 className="text-lg leading-snug text-deep-forest">{rec.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{rec.shortDescription}</p>
            <div className="mt-3 flex gap-2">
              <button
                disabled={got}
                onClick={() => { checkIn(rec.id); showToast('Kartu warisan terbuka! +20 XP'); }}
                className="flex-1 rounded-xl bg-forest py-3 text-sm font-bold text-coconut disabled:bg-sage disabled:text-deep-forest"
              >
                {got ? 'Sudah terkumpul' : 'Check-in terpandu'}
              </button>
              <button onClick={() => setSel(null)} className="rounded-xl border border-bamboo px-4 text-sm font-semibold text-deep-forest">Tutup</button>
            </div>
          </Ornate>
        </div>
      )}
    </div>
  );
};
