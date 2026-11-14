import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, FlaskConical, Info, RotateCcw, XCircle } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Dapur, Foam } from '../game/Dapur';
import { Ornate } from '../components/ui';
import { useStore } from '../store';
import { t } from '../i18n';

/* ====================== Lab Dapur: eksperimen bebas ====================== */

interface Setup {
  laru: boolean;
  disaring: boolean;
  diam: number; // jam nira dibiarkan sebelum dimasak
  api: number; // 0..100
  lama: number; // jam memasak, 0..5
}
const IDEAL: Setup = { laru: true, disaring: true, diam: 1, api: 55, lama: 4.5 };

const getPresets = (): { name: string; set: Setup }[] => [
  { name: t('Cara yang pas', 'The right way'), set: IDEAL },
  { name: t('Tanpa laru, didiamkan 5 jam', 'No laru, left 5 hours'), set: { ...IDEAL, laru: false, diam: 5 } },
  { name: t('Api terlalu besar', 'Fire too big'), set: { ...IDEAL, api: 95 } },
  { name: t('Dimasak kurang lama', 'Cooked too briefly'), set: { ...IDEAL, lama: 2 } },
  { name: t('Nira tidak disaring', 'Sap not filtered'), set: { ...IDEAL, disaring: false } },
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

  if (!s.laru && s.diam >= 2) out.push({ level: 'bad', text: t('Tanpa laru dan didiamkan lebih dari 2 jam, nira cenderung asam dan berubah menjadi arak.', 'With no laru and left more than 2 hours, the sap tends to sour and turn into arak (palm liquor).') });
  else if (!s.laru) out.push({ level: 'warn', text: t('Tanpa laru, nira lebih cepat asam. Penderes memberi laru alami dari kapur dan cangkang manggis.', 'Without laru, the sap sours faster. Tappers add a natural preservative of lime and mangosteen rind.') });
  else if (s.diam >= 4) out.push({ level: 'warn', text: t('Walau memakai laru, nira sebaiknya segera dimasak. Menunggu terlalu lama berisiko.', 'Even with laru, the sap should be cooked soon. Waiting too long is risky.') });
  else out.push({ level: 'ok', text: t('Nira dijaga dengan laru dan segera dimasak, jadi tetap segar.', 'The sap is protected with laru and cooked soon, so it stays fresh.') });

  if (!s.disaring) out.push({ level: 'bad', text: t('Tanpa penyaringan, bunga kelapa, lebah, dan semut ikut masuk wajan dan mengotori gula.', 'Without filtering, coconut flowers, bees, and ants end up in the wok and spoil the sugar.') });
  else out.push({ level: 'ok', text: t('Nira disaring dengan kain bersih, kotoran tertahan.', 'The sap is filtered through a clean cloth, so the dirt is held back.') });

  if (s.lama === 0) out.push({ level: 'bad', text: t('Belum dimasak sama sekali, nira masih berupa cairan.', 'Not cooked at all yet, the sap is still a liquid.') });
  else if (temp < 100) out.push({ level: 'warn', text: t(`Suhu ±${temp} °C belum sampai 105 sampai 110 °C. Pekatan masih encer, gula lembek dan kadar airnya tinggi.`, `At about ${temp} °C it has not reached 105 to 110 °C. The syrup is still thin, the sugar soft and high in moisture.`) });
  else if (temp <= 115) out.push({ level: 'ok', text: t(`Suhu ±${temp} °C, di rentang akhir pemasakan (sekitar 105 sampai 110 °C). Pekatan siap didinginkan dan dicetak.`, `At about ${temp} °C, within the end-of-cooking range (around 105 to 110 °C). The syrup is ready to cool and mold.`) });
  else if (temp <= 125) out.push({ level: 'warn', text: t(`Suhu ±${temp} °C agak tinggi. Pekatan mulai terlalu pekat dan warnanya terlalu gelap.`, `At about ${temp} °C it is a bit high. The syrup is getting too thick and too dark.`) });
  else out.push({ level: 'bad', text: t(`Suhu ±${temp} °C terlalu tinggi. Gula mudah gosong dan rasanya pahit.`, `At about ${temp} °C it is too high. The sugar burns easily and tastes bitter.`) });

  if (s.api >= 80 && s.lama > 0) out.push({ level: 'warn', text: t('Api besar membuat buih naik cepat dan mudah meluap. Api besar cocok di awal saja.', 'A big fire makes the foam rise fast and overflow easily. A big fire suits only the start.') });
  if (s.api <= 25 && s.lama > 0) out.push({ level: 'warn', text: t('Api sangat kecil membuat air lambat menguap, waktu memasak jadi sangat panjang.', 'A very small fire makes water evaporate slowly, so cooking takes very long.') });

  const bad = out.filter((o) => o.level === 'bad').length;
  const warn = out.filter((o) => o.level === 'warn').length;
  const verdict = bad ? { t: t('Gagal atau berisiko', 'Failed or risky'), c: 'text-[#9E4F37]' } : warn ? { t: t('Cukup, tapi belum pas', 'Fair, but not quite right'), c: 'text-caramel-dark' } : { t: t('Gula siap dicetak', 'Sugar ready to mold'), c: 'text-forest' };
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
        {t('Ubah pengaturan di bawah dan lihat akibatnya pada nira. Tidak ada skor dan tidak ada batas waktu, silakan bereksperimen.', 'Change the settings below and see what happens to the sap. There is no score and no time limit, so experiment freely.')}
      </p>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(to_right,transparent_0,#000_18px,#000_calc(100%-34px),transparent_100%)]">
        {getPresets().map((p) => (
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
        <span className="rounded-xl bg-coconut py-2 text-deep-forest">{t('Suhu', 'Temp')} ±{r.temp} °C</span>
        <span className={`rounded-xl bg-coconut py-2 ${r.verdict.c}`}>{r.verdict.t}</span>
      </div>

      <div className="mt-4 space-y-4 rounded-2xl bg-coconut p-4">
        <Toggle label={t('Laru di pongkor', 'Laru in the pongkor')} on={s.laru} onLabel={t('Pakai laru', 'With laru')} offLabel={t('Tanpa laru', 'No laru')} set={(v) => set({ laru: v })} />
        <Toggle label={t('Penyaringan', 'Filtering')} on={s.disaring} onLabel={t('Disaring', 'Filtered')} offLabel={t('Tidak disaring', 'Not filtered')} set={(v) => set({ disaring: v })} />
        <Slider label={t('Nira didiamkan sebelum dimasak', 'Sap left before cooking')} value={s.diam} min={0} max={6} step={0.5} unit={t('jam', 'h')} onChange={(n) => set({ diam: n })} />
        <Slider label={t('Besar api', 'Fire size')} value={s.api} min={0} max={100} step={5} unit="%" onChange={(n) => set({ api: n })} />
        <Slider label={t('Lama memasak', 'Cooking time')} value={s.lama} min={0} max={5} step={0.5} unit={t('jam', 'h')} onChange={(n) => set({ lama: n })} />
        <button
          type="button"
          onClick={() => setS(IDEAL)}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border-2 border-bamboo text-sm font-semibold text-deep-forest"
        >
          <RotateCcw className="h-4 w-4" /> {t('Kembali ke cara yang pas', 'Back to the right way')}
        </button>
      </div>

      <h3 className="mt-5 text-xl text-deep-forest">{t('Hasil eksperimenmu', 'Your experiment results')}</h3>
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
        {t('Simulasi sederhana dari jurnal dan liputan tentang gula kelapa Banyumas, bukan standar mutu. Angka perajin sebenarnya bisa berbeda.', 'A simple simulation drawn from journals and news about Banyumas coconut sugar, not a quality standard. Real artisans\' numbers may differ.')}
      </p>
      {tried >= 4 && <p className="mt-2 text-xs font-semibold text-forest">{t('Eksperimen selesai, XP sudah ditambahkan.', 'Experiment complete, XP added.')}</p>}
    </div>
  );
};

/* ====================== Peta Istilah: menautkan istilah dan fungsi ====================== */

const getPairs = () => [
  { id: 'pongkor', term: 'Pongkor', fn: t('Wadah bambu penampung nira dari mayang', 'Bamboo container that catches sap from the flower stalk') },
  { id: 'laru', term: 'Laru', fn: t('Kapur dan cangkang manggis agar nira tidak cepat asam', 'Lime and mangosteen rind so the sap does not sour quickly') },
  { id: 'kain', term: t('Kain saring', 'Filter cloth'), fn: t('Menahan kotoran sebelum nira masuk wajan', 'Holds back dirt before the sap enters the wok') },
  { id: 'jubung', term: 'Jubung', fn: t('Anyaman bambu untuk mengurangi buih saat memasak', 'Woven bamboo that reduces foam while cooking') },
  { id: 'bathok', term: 'Bathok', fn: t('Cetakan gula dari setengah tempurung kelapa', 'Sugar mold made from half a coconut shell') },
  { id: 'wajan', term: t('Wajan dan tungku', 'Wok and stove'), fn: t('Tempat memasak nira dengan api kayu', 'Where the sap is cooked over a wood fire') },
];

// urutan fungsi diacak tetap agar tidak sejajar dengan istilah
const FN_ORDER = [3, 0, 5, 2, 4, 1];

const PetaIstilah: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const PAIRS = getPairs();
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
        {t('Tautkan setiap istilah dengan fungsinya: ketuk istilah di kiri, lalu ketuk fungsi yang cocok di kanan.', 'Match each term with its function: tap a term on the left, then tap the matching function on the right.')}
      </p>
      <p role="status" className="mt-2 min-h-[24px] text-sm font-bold text-deep-forest">
        {done ? t(`Semua tertaut dalam ${tries} percobaan!`, `All matched in ${tries} tries!`) : term ? t(`Pilih fungsi untuk "${PAIRS.find((p) => p.id === term)?.term}"`, `Choose the function for "${PAIRS.find((p) => p.id === term)?.term}"`) : t(`${matched.length} dari ${PAIRS.length} tertaut`, `${matched.length} of ${PAIRS.length} matched`)}
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
          <p className="mt-1 text-base font-semibold text-deep-forest">{t('Peta istilahmu lengkap. XP sudah ditambahkan.', 'Your term map is complete. XP added.')}</p>
          <button
            type="button"
            onClick={() => {
              setMatched([]);
              setTries(0);
              setTerm(null);
            }}
            className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-bamboo px-5 text-sm font-semibold text-deep-forest"
          >
            <RotateCcw className="h-4 w-4" /> {t('Main lagi', 'Play again')}
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
      showToast(t(`+${xp} XP dari Lab Pengetahuan`, `+${xp} XP from the Knowledge Lab`));
    }
  };
  return (
    <div className="px-5 pb-8 pt-4">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> {t('Perjalanan', 'Journey')}
      </Link>
      <div className="mt-1 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-coconut">
          <FlaskConical className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-[28px] leading-tight text-deep-forest">{t('Lab Pengetahuan', 'Knowledge Lab')}</h1>
          <p className="text-sm text-ink-soft">{t('Eksperimen dan menautkan istilah', 'Experiments and term matching')}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
        {([
          ['dapur', t('Lab Dapur', 'Kitchen Lab')],
          ['istilah', t('Peta Istilah', 'Term Map')],
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
