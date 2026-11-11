import React from 'react';
import { Flame, Hand, Sparkles, Wind } from 'lucide-react';
import { Nira, NiraMood } from '../art/Nira';

/**
 * Simulasi sederhana "Masak Gula Kelapa Bareng Nira": empat langkah dapur, semuanya di darat.
 * Bukan panduan memasak. Setiap langkah ditutup satu fakta singkat dari materi NIRA KITA.
 */

type StepId = 'saring' | 'masak' | 'aduk' | 'cetak';

const STEPS: { id: StepId; title: string; hint: string; fact: string }[] = [
  {
    id: 'saring',
    title: 'Saring nira',
    hint: 'Ketuk Saring berulang kali sampai nira jernih.',
    fact: 'Nira segar disaring dulu sebelum dimasak. Wadah dan alat yang bersih membantu nira tetap segar.',
  },
  {
    id: 'masak',
    title: 'Jaga api tungku',
    hint: 'Jaga api di zona hijau selama 12 detik. Kipasi kalau dingin, kecilkan kalau terlalu panas.',
    fact: 'Perajin membaca kematangan nira dari perubahan buih dan aroma karamel di atas tungku kayu.',
  },
  {
    id: 'aduk',
    title: 'Aduk sabar',
    hint: 'Ketuk Aduk saat penanda tepat di zona karamel. Lima kali.',
    fact: 'Pengadukan adalah teknik tersendiri yang dipelajari dari perajin senior. Ritmenya butuh kesabaran.',
  },
  {
    id: 'cetak',
    title: 'Cetak gula',
    hint: 'Ketuk setiap cetakan dua kali sampai terisi penuh.',
    fact: 'Gula dicetak lalu didinginkan secara alami sampai mengeras.',
  },
];

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

/* ---------- langkah 1: saring ---------- */
const Saring: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [taps, setTaps] = React.useState(0);
  const start = React.useRef(Date.now());
  const need = 8;
  const tap = () => {
    const n = taps + 1;
    setTaps(n);
    if (n >= need) {
      const secs = (Date.now() - start.current) / 1000;
      onDone(Math.round(clamp(100 - 4 * Math.max(0, secs - 8), 60)));
    }
  };
  const level = (taps / need) * 100;
  return (
    <div className="text-center">
      <svg viewBox="0 0 160 120" className="mx-auto h-36" aria-hidden>
        <rect x="52" y="10" width="56" height="30" rx="6" fill="#D9B16B" />
        <path d="M44 44 H116 L100 70 H60Z" fill="#E9D7B4" stroke="#9A6B34" strokeWidth="3" />
        <rect x="58" y="76" width="44" height="40" rx="8" fill="#FFFDF8" stroke="#DCCDB2" strokeWidth="3" />
        <rect x="61" y={113 - (level / 100) * 34} width="38" height={(level / 100) * 34} rx="4" fill="#E7AE68" />
        <circle cx="80" cy="72" r="3" fill="#E7AE68" />
      </svg>
      <p className="mt-1 text-sm font-semibold text-ink-soft">
        {taps} / {need}
      </p>
      <button type="button" onClick={tap} className="mt-3 min-h-[56px] w-full rounded-full bg-forest text-lg font-semibold text-coconut">
        Saring!
      </button>
    </div>
  );
};

/* ---------- langkah 2: masak ---------- */
const Masak: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [temp, setTemp] = React.useState(35);
  const [secs, setSecs] = React.useState(12);
  const inZone = React.useRef(0);
  const ticks = React.useRef(0);
  const tempRef = React.useRef(35);
  const done = React.useRef(false);
  const ZONE: [number, number] = [45, 65];

  React.useEffect(() => {
    const id = setInterval(() => {
      tempRef.current = clamp(tempRef.current + (Math.random() - 0.35) * 5);
      ticks.current += 1;
      if (tempRef.current >= ZONE[0] && tempRef.current <= ZONE[1]) inZone.current += 1;
      setTemp(tempRef.current);
      setSecs(Math.max(0, 12 - Math.floor(ticks.current / 10)));
      if (ticks.current >= 120 && !done.current) {
        done.current = true;
        clearInterval(id);
        onDone(Math.round((inZone.current / ticks.current) * 100));
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bump = (d: number) => {
    tempRef.current = clamp(tempRef.current + d);
    setTemp(tempRef.current);
  };
  const state = temp < ZONE[0] ? 'Nira masih dingin, kipasi apinya' : temp > ZONE[1] ? 'Terlalu panas! Kecilkan api' : 'Buih naik, aroma karamel mulai tercium';
  const ok = temp >= ZONE[0] && temp <= ZONE[1];
  return (
    <div className="text-center">
      <div className="relative mx-auto mt-1 h-40 w-full max-w-[260px]">
        <div className="absolute inset-y-0 left-0 w-8 overflow-hidden rounded-full border-2 border-bamboo bg-coconut">
          <div className="absolute inset-x-0 bg-forest/25" style={{ bottom: `${ZONE[0]}%`, height: `${ZONE[1] - ZONE[0]}%` }} />
          <div className="absolute inset-x-0 h-1.5 bg-caramel-dark" style={{ bottom: `calc(${temp}% - 3px)` }} />
        </div>
        <svg viewBox="0 0 160 130" className="absolute inset-y-0 left-12 right-0 h-full w-[calc(100%-3rem)]" aria-hidden>
          <path d="M20 128 C20 98 36 90 80 90 C124 90 140 98 140 128Z" fill="#A9693A" />
          <path d="M14 90 C20 66 140 66 146 90 C128 98 32 98 14 90Z" fill="#3B3F3A" />
          <ellipse cx="80" cy="82" rx="58" ry="9" fill="#B8742E" />
          <g transform={`translate(80 118) scale(${0.5 + temp / 90})`}>
            <path d="M0 0 C-14 0 -14 -18 0 -34 C14 -18 14 0 0 0Z" fill={temp > ZONE[1] ? '#E0523A' : '#F29A3B'} />
            <path d="M0 0 C-6 0 -6 -10 0 -18 C6 -10 6 0 0 0Z" fill="#FFD27A" />
          </g>
          <g fill="#FFFDF8" opacity={ok ? 0.95 : 0.4}>
            <circle cx="58" cy="76" r="6" />
            <circle cx="82" cy="72" r="7" />
            <circle cx="104" cy="77" r="5" />
          </g>
        </svg>
      </div>
      <p role="status" className={`mt-2 min-h-[44px] text-sm font-semibold ${ok ? 'text-forest' : 'text-terracotta'}`}>
        {state} · {secs} dtk
      </p>
      <div className="mt-1 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => bump(10)} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-caramel-dark text-base font-semibold text-coconut">
          <Wind className="h-5 w-5" /> Kipasi
        </button>
        <button type="button" onClick={() => bump(-12)} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-coconut">
          <Flame className="h-5 w-5" /> Kecilkan
        </button>
      </div>
    </div>
  );
};

/* ---------- langkah 3: aduk ---------- */
const Aduk: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [pos, setPos] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [last, setLast] = React.useState<string | null>(null);
  const posRef = React.useRef(0);
  const dir = React.useRef(1);
  const scores = React.useRef<number[]>([]);
  const ZONE: [number, number] = [40, 62];
  const rounds = 5;

  React.useEffect(() => {
    const id = setInterval(() => {
      posRef.current += dir.current * 2.6;
      if (posRef.current >= 100 || posRef.current <= 0) {
        dir.current *= -1;
        posRef.current = clamp(posRef.current);
      }
      setPos(posRef.current);
    }, 30);
    return () => clearInterval(id);
  }, []);

  const tap = () => {
    const p = posRef.current;
    const dist = p < ZONE[0] ? ZONE[0] - p : p > ZONE[1] ? p - ZONE[1] : 0;
    const s = dist === 0 ? 100 : dist < 14 ? 60 : 20;
    scores.current.push(s);
    setLast(s === 100 ? 'Pas!' : s === 60 ? 'Hampir' : 'Meleset');
    const n = round + 1;
    setRound(n);
    if (n >= rounds) onDone(Math.round(scores.current.reduce((a, b) => a + b, 0) / rounds));
  };

  return (
    <div className="text-center">
      <div className="relative mx-auto mt-4 h-10 w-full rounded-full border-2 border-bamboo bg-coconut">
        <div className="absolute inset-y-0 rounded-full bg-caramel/35" style={{ left: `${ZONE[0]}%`, width: `${ZONE[1] - ZONE[0]}%` }} />
        <div className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-caramel-dark shadow" style={{ left: `${pos}%` }} />
      </div>
      <p role="status" className="mt-3 min-h-[28px] text-base font-semibold text-deep-forest">
        {last ?? 'Siap?'} · {round} / {rounds}
      </p>
      <button type="button" onClick={tap} className="mt-2 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-forest text-lg font-semibold text-coconut">
        <Hand className="h-5 w-5" /> Aduk!
      </button>
    </div>
  );
};

/* ---------- langkah 4: cetak ---------- */
const Cetak: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [fill, setFill] = React.useState([0, 0, 0, 0]);
  const tap = (i: number) => {
    const next = fill.map((f, n) => (n === i ? Math.min(2, f + 1) : f));
    setFill(next);
    if (next.every((f) => f >= 2)) onDone(100);
  };
  return (
    <div className="text-center">
      <div className="mt-3 grid grid-cols-4 gap-2 rounded-2xl bg-[#9A6B34] p-3">
        {fill.map((f, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            aria-label={`Cetakan ${i + 1}, terisi ${f} dari 2`}
            className="relative h-16 overflow-hidden rounded-xl border-2 border-[#7A4A20] bg-[#7A4A20]"
          >
            <span className="absolute inset-x-0 bottom-0 bg-[#E7AE68] transition-all" style={{ height: `${(f / 2) * 100}%` }} />
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink-soft">{fill.filter((f) => f >= 2).length} / 4 cetakan penuh</p>
    </div>
  );
};

const FACT_MOOD: Record<StepId, NiraMood> = { saring: 'happy', masak: 'think', aduk: 'wave', cetak: 'cheer' };

export const MasakGula: React.FC<{ onFinish: (stars: 1 | 2 | 3, avg: number) => void }> = ({ onFinish }) => {
  const [step, setStep] = React.useState(-1); // -1 = layar mulai
  const [fact, setFact] = React.useState(false);
  const scores = React.useRef<number[]>([]);

  const finishStep = (score: number) => {
    scores.current[step] = score;
    setFact(true);
  };
  const next = () => {
    setFact(false);
    if (step + 1 >= STEPS.length) {
      const avg = Math.round(scores.current.reduce((a, b) => a + b, 0) / STEPS.length);
      onFinish(avg >= 80 ? 3 : avg >= 55 ? 2 : 1, avg);
    } else setStep(step + 1);
  };

  if (step === -1) {
    return (
      <div className="text-center">
        <Nira mood="cheer" size={96} className="mx-auto" />
        <p className="mt-2 text-base leading-relaxed text-charcoal">
          Bantu Nira memasak gula kelapa di dapur, lewat 4 langkah singkat. Semuanya dari darat, tanpa memanjat.
        </p>
        <button type="button" onClick={() => setStep(0)} className="mt-4 min-h-[56px] w-full rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
          Mulai masak
        </button>
        <p className="mt-2 text-xs text-ink-soft">Simulasi sederhana, bukan panduan memasak.</p>
      </div>
    );
  }

  const s = STEPS[step];
  return (
    <div>
      <div className="flex gap-1.5" aria-label={`Langkah ${step + 1} dari ${STEPS.length}`}>
        {STEPS.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-caramel' : 'bg-bamboo'}`} />
        ))}
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
        Langkah {step + 1} · {s.title}
      </p>
      {fact ? (
        <div className="mt-2 text-center">
          <Nira mood={FACT_MOOD[s.id]} size={84} className="mx-auto" />
          <div className="ornate mt-3 p-3 text-left">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-forest">
              <Sparkles className="h-3.5 w-3.5" /> Tahukah kamu
            </p>
            <p className="mt-1 text-base leading-relaxed text-charcoal">{s.fact}</p>
          </div>
          <button type="button" onClick={next} className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
            {step + 1 >= STEPS.length ? 'Lihat hasil' : 'Langkah berikutnya'}
          </button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.hint}</p>
          {s.id === 'saring' && <Saring key="s" onDone={finishStep} />}
          {s.id === 'masak' && <Masak key="m" onDone={finishStep} />}
          {s.id === 'aduk' && <Aduk key="a" onDone={finishStep} />}
          {s.id === 'cetak' && <Cetak key="c" onDone={finishStep} />}
        </>
      )}
    </div>
  );
};
