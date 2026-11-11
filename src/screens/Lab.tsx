import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, FlaskConical, Info, RotateCcw, XCircle } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Dapur, Foam } from '../game/Dapur';
import { Ornate } from '../components/ui';
import { useStore } from '../store';

/* ====================== Lab Dapur: eksperimen bebas ====================== */

interface Setup {
  laru: boolean;
  disaring: boolean;
  diam: number; // jam nira dibiarkan sebelum dimasak
  api: number; // 0..100
  lama: number; // jam memasak, 0..5
}
const IDEAL: Setup = { laru: true, disaring: true, diam: 1, api: 55, lama: 4.5 };

const PRESETS: { name: string; set: Setup }[] = [
  { name: 'Cara yang pas', set: IDEAL },
  { name: 'Tanpa laru, didiamkan 5 jam', set: { ...IDEAL, laru: false, diam: 5 } },
  { name: 'Api terlalu besar', set: { ...IDEAL, api: 95 } },
  { name: 'Dimasak kurang lama', set: { ...IDEAL, lama: 2 } },
  { name: 'Nira tidak disaring', set: { ...IDEAL, disaring: false } },
];

type Level = 'ok' | 'warn' | 'bad';
interface Finding {
  level: Level;
  text: string;
}

/** Aturan sederhana dari jurnal dan liputan (lihat docs/proses-gula-kelapa.md). Ini simulasi, bukan standar mutu. */
const evaluate = (s: Setup) => {
  const cook = Math.min(1, s.lama / 4.5);
  const temp = Math.round(Math.max(30, Math.min(135, 32 + cook * 76 + (s.api - 55) * 0.35)));
  const out: Finding[] = [];

  if (!s.laru && s.diam >= 2) out.push({ level: 'bad', text: 'Tanpa laru dan didiamkan lebih dari 2 jam, nira cenderung asam dan berubah menjadi arak.' });
  else if (!s.laru) out.push({ level: 'warn', text: 'Tanpa laru, nira lebih cepat asam. Penderes memberi laru alami dari kapur dan cangkang manggis.' });
  else if (s.diam >= 4) out.push({ level: 'warn', text: 'Walau memakai laru, nira sebaiknya segera dimasak. Menunggu terlalu lama berisiko.' });
  else out.push({ level: 'ok', text: 'Nira dijaga dengan laru dan segera dimasak, jadi tetap segar.' });

  if (!s.disaring) out.push({ level: 'bad', text: 'Tanpa penyaringan, bunga kelapa, lebah, dan semut ikut masuk wajan dan mengotori gula.' });
  else out.push({ level: 'ok', text: 'Nira disaring dengan kain bersih, kotoran tertahan.' });

  if (s.lama === 0) out.push({ level: 'bad', text: 'Belum dimasak sama sekali, nira masih berupa cairan.' });
  else if (temp < 100) out.push({ level: 'warn', text: `Suhu ±${temp} °C belum sampai 105 sampai 110 °C. Pekatan masih encer, gula lembek dan kadar airnya tinggi.` });
  else if (temp <= 115) out.push({ level: 'ok', text: `Suhu ±${temp} °C, di rentang akhir pemasakan (sekitar 105 sampai 110 °C). Pekatan siap didinginkan dan dicetak.` });
  else if (temp <= 125) out.push({ level: 'warn', text: `Suhu ±${temp} °C agak tinggi. Pekatan mulai terlalu pekat dan warnanya terlalu gelap.` });
  else out.push({ level: 'bad', text: `Suhu ±${temp} °C terlalu tinggi. Gula mudah gosong dan rasanya pahit.` });

  if (s.api >= 80 && s.lama > 0) out.push({ level: 'warn', text: 'Api besar membuat buih naik cepat dan mudah meluap. Api besar cocok di awal saja.' });
  if (s.api <= 25 && s.lama > 0) out.push({ level: 'warn', text: 'Api sangat kecil membuat air lambat menguap, waktu memasak jadi sangat panjang.' });

  const bad = out.filter((o) => o.level === 'bad').length;
  const warn = out.filter((o) => o.level === 'warn').length;
  const verdict = bad ? { t: 'Gagal atau berisiko', c: 'text-[#9E4F37]' } : warn ? { t: 'Cukup, tapi belum pas', c: 'text-caramel-dark' } : { t: 'Gula siap dicetak', c: 'text-forest' };
  return { cook, temp, out, verdict };
};

const FOAM_SPOTS: Foam[] = [
  { id: 1, x: 150, y: 144, r: 10 },
  { id: 2, x: 182, y: 142, r: 12 },
  { id: 3, x: 212, y: 145, r: 9 },
  { id: 4, x: 166, y: 146, r: 8 },
  { id: 5, x: 198, y: 146, r: 8 },
];

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (n: number) => void }> = ({ label, value, min, max, step, unit, onChange }) => (
  <label className="block">
    <span className="flex items-baseline justify-between text-sm font-semibold text-deep-forest">
      {label}
      <span className="text-base font-bold text-caramel-dark">
        {step < 1 ? value.toFixed(1).replace('.', ',') : Math.round(value)} {unit}
      </span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="mt-1 h-11 w-full accent-[#8F5A2C]"
    />
  </label>
);

const Toggle: React.FC<{ label: string; on: boolean; onLabel: string; offLabel: string; set: (v: boolean) => void }> = ({ label, on, onLabel, offLabel, set }) => (
  <div>
    <p className="text-sm font-semibold text-deep-forest">{label}</p>
    <div className="mt-1 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" role="group" aria-label={label}>
      {[
        [true, onLabel],
        [false, offLabel],
      ].map(([v, t]) => (
        <button
          key={String(v)}
          type="button"
          aria-pressed={on === v}
          onClick={() => set(v as boolean)}
          className={`min-h-[44px] rounded-full text-sm font-semibold ${on === v ? 'bg-forest text-coconut' : 'text-ink-soft'}`}
        >
          {t as string}
        </button>
      ))}
    </div>
  </div>
);

const LabDapur: React.FC<{ onTried: () => void }> = ({ onTried }) => {
  const [s, setS] = React.useState<Setup>(IDEAL);
  const [tried, setTried] = React.useState(0);
  const r = evaluate(s);
  const set = (p: Partial<Setup>) => {
    setS((v) => ({ ...v, ...p }));
    setTried((n) => n + 1);
  };
  React.useEffect(() => {
    if (tried >= 4) onTried();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tried >= 4]);
  const foamN = s.lama === 0 ? 0 : s.api >= 75 ? 5 : s.api >= 50 ? 3 : s.api >= 25 ? 2 : 0;
  const sour = (!s.laru && s.diam >= 2) || !s.disaring;
  return (
    <div>
      <p className="text-sm leading-relaxed text-ink-soft">
        Ubah pengaturan di bawah dan lihat akibatnya pada nira. Tidak ada skor dan tidak ada batas waktu, silakan bereksperimen.
      </p>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setS(p.set);
              setTried((n) => n + 1);
            }}
            className="min-h-[44px] shrink-0 rounded-full border border-bamboo bg-coconut px-4 text-sm font-semibold text-deep-forest"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-bamboo bg-[#E9D2A6]">
        <Dapur
          level={s.lama === 0 ? 1 : 1 - r.cook * 0.35}
          cook={sour ? Math.min(1, r.cook + 0.1) : r.cook}
          heat={s.lama === 0 ? 12 : s.api}
          foam={FOAM_SPOTS.slice(0, foamN)}
          className="block w-full"
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm font-bold">
        <span className="rounded-xl bg-coconut py-2 text-deep-forest">Suhu ±{r.temp} °C</span>
        <span className={`rounded-xl bg-coconut py-2 ${r.verdict.c}`}>{r.verdict.t}</span>
      </div>

      <div className="mt-4 space-y-4 rounded-2xl bg-coconut p-4">
        <Toggle label="Laru di pongkor" on={s.laru} onLabel="Pakai laru" offLabel="Tanpa laru" set={(v) => set({ laru: v })} />
        <Toggle label="Penyaringan" on={s.disaring} onLabel="Disaring" offLabel="Tidak disaring" set={(v) => set({ disaring: v })} />
        <Slider label="Nira didiamkan sebelum dimasak" value={s.diam} min={0} max={6} step={0.5} unit="jam" onChange={(n) => set({ diam: n })} />
        <Slider label="Besar api" value={s.api} min={0} max={100} step={5} unit="%" onChange={(n) => set({ api: n })} />
        <Slider label="Lama memasak" value={s.lama} min={0} max={5} step={0.5} unit="jam" onChange={(n) => set({ lama: n })} />
        <button
          type="button"
          onClick={() => setS(IDEAL)}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border-2 border-bamboo text-sm font-semibold text-deep-forest"
        >
          <RotateCcw className="h-4 w-4" /> Kembali ke cara yang pas
        </button>
      </div>

      <h3 className="mt-5 text-xl text-deep-forest">Hasil eksperimenmu</h3>
      <ul className="mt-2 space-y-2" aria-live="polite">
        {r.out.map((f, i) => (
          <li key={i} className="flex gap-2.5 rounded-xl bg-coconut p-3 text-sm leading-relaxed text-charcoal">
            {f.level === 'ok' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
            ) : f.level === 'warn' ? (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caramel-dark" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9E4F37]" />
            )}
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Simulasi sederhana dari jurnal dan liputan tentang gula kelapa Banyumas, bukan standar mutu. Angka perajin sebenarnya bisa berbeda.
      </p>
      {tried >= 4 && <p className="mt-2 text-xs font-semibold text-forest">Eksperimen selesai, XP sudah ditambahkan.</p>}
    </div>
  );
};

/* ====================== Peta Istilah: menautkan istilah dan fungsi ====================== */

const PAIRS = [
  { id: 'pongkor', term: 'Pongkor', fn: 'Wadah bambu penampung nira dari mayang' },
  { id: 'laru', term: 'Laru', fn: 'Kapur dan cangkang manggis agar nira tidak cepat asam' },
  { id: 'kain', term: 'Kain saring', fn: 'Menahan kotoran sebelum nira masuk wajan' },
  { id: 'jubung', term: 'Jubung', fn: 'Anyaman bambu untuk mengurangi buih saat memasak' },
  { id: 'bathok', term: 'Bathok', fn: 'Cetakan gula dari setengah tempurung kelapa' },
  { id: 'wajan', term: 'Wajan dan tungku', fn: 'Tempat memasak nira dengan api kayu' },
];

// urutan fungsi diacak tetap agar tidak sejajar dengan istilah
const FN_ORDER = [3, 0, 5, 2, 4, 1];

const PetaIstilah: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [term, setTerm] = React.useState<string | null>(null);
  const [matched, setMatched] = React.useState<string[]>([]);
  const [wrong, setWrong] = React.useState<string | null>(null);
  const [tries, setTries] = React.useState(0);
  const done = matched.length === PAIRS.length;

  React.useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pickFn = (fnId: string) => {
    if (!term || matched.includes(fnId)) return;
    setTries((n) => n + 1);
    if (term === fnId) {
      setMatched((m) => [...m, fnId]);
      setTerm(null);
      setWrong(null);
    } else {
      setWrong(fnId);
      setTimeout(() => setWrong(null), 700);
    }
  };

  return (
    <div>
      <p className="text-sm leading-relaxed text-ink-soft">
        Tautkan setiap istilah dengan fungsinya: ketuk istilah di kiri, lalu ketuk fungsi yang cocok di kanan.
      </p>
      <p role="status" className="mt-2 min-h-[24px] text-sm font-bold text-deep-forest">
        {done ? `Semua tertaut dalam ${tries} percobaan!` : term ? `Pilih fungsi untuk "${PAIRS.find((p) => p.id === term)?.term}"` : `${matched.length} dari ${PAIRS.length} tertaut`}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {PAIRS.map((p) => {
            const ok = matched.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={ok}
                  aria-pressed={term === p.id}
                  onClick={() => setTerm(p.id)}
                  className={`flex min-h-[64px] w-full items-center justify-between gap-1 rounded-2xl border-2 px-3 text-left text-base font-semibold ${
                    ok ? 'border-forest bg-forest/10 text-forest' : term === p.id ? 'border-caramel-dark bg-caramel/15 text-deep-forest' : 'border-bamboo bg-coconut text-deep-forest'
                  }`}
                >
                  {p.term}
                  {ok && <Check className="h-5 w-5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-2">
          {FN_ORDER.map((i) => {
            const p = PAIRS[i];
            const ok = matched.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={ok || !term}
                  onClick={() => pickFn(p.id)}
                  className={`flex min-h-[64px] w-full items-center gap-1 rounded-2xl border-2 px-3 py-2 text-left text-sm leading-snug ${
                    ok ? 'border-forest bg-forest/10 text-forest' : wrong === p.id ? 'border-[#9E4F37] bg-[#9E4F37]/10 text-[#9E4F37]' : 'border-bamboo bg-coconut text-charcoal'
                  } ${!term && !ok ? 'opacity-80' : ''}`}
                >
                  {p.fn}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {done && (
        <div className="mt-4 text-center">
          <Nira mood="cheer" size={90} className="mx-auto" />
          <p className="mt-1 text-base font-semibold text-deep-forest">Peta istilahmu lengkap. XP sudah ditambahkan.</p>
          <button
            type="button"
            onClick={() => {
              setMatched([]);
              setTries(0);
              setTerm(null);
            }}
            className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-bamboo px-5 text-sm font-semibold text-deep-forest"
          >
            <RotateCcw className="h-4 w-4" /> Main lagi
          </button>
        </div>
      )}
    </div>
  );
};

/* ====================== Halaman Lab ====================== */

export const Lab: React.FC = () => {
  const { completeLab, labDone, showToast } = useStore();
  const [tab, setTab] = React.useState<'dapur' | 'istilah'>('dapur');
  const award = (id: string, xp: number) => {
    if (!labDone.includes(id)) {
      completeLab(id, xp);
      showToast(`+${xp} XP dari Lab Pengetahuan`);
    }
  };
  return (
    <div className="px-5 pb-8 pt-4">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> Perjalanan
      </Link>
      <div className="mt-1 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-coconut">
          <FlaskConical className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-[28px] leading-tight text-deep-forest">Lab Pengetahuan</h1>
          <p className="text-sm text-ink-soft">Eksperimen dan menautkan istilah</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
        {([
          ['dapur', 'Lab Dapur'],
          ['istilah', 'Peta Istilah'],
        ] as const).map(([k, t]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-[44px] rounded-full text-sm font-semibold ${tab === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <Ornate className="mt-4 p-4">{tab === 'dapur' ? <LabDapur onTried={() => award('lab-dapur', 40)} /> : <PetaIstilah onDone={() => award('lab-istilah', 40)} />}</Ornate>
    </div>
  );
};
