import React from 'react';
import { Clock, Flame, Hand, ShieldAlert, Sparkles, Thermometer, Wind } from 'lucide-react';
import { Nira, NiraMood } from '../art/Nira';
import { Dapur, Debris, Foam } from './Dapur';
import { t } from '../i18n';

/**
 * "Dapur Gula": simulasi pembuatan gula kelapa cetak dalam satu adegan dapur.
 * Isi diambil dari jurnal dan liputan (lihat docs/proses-gula-kelapa.md).
 * Semua kegiatan di darat; ini simulasi, bukan panduan memasak.
 */

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

type StepId = 'saring' | 'masak' | 'aduk' | 'cetak';

const getSteps = (): { id: StepId; title: string; hint: string; howto: string[]; timer?: string; fact: string }[] => [
  {
    id: 'saring',
    title: t('Saring nira', 'Filter the sap'),
    hint: t('Tuang nira ke kain saring. Ketuk kotoran yang tersangkut supaya tidak ikut masuk wajan.', 'Pour the sap through the cloth. Tap the debris caught on it so it does not end up in the wok.'),
    howto: [
      t('Ketuk pongkor bambu (atau tombol Tuang nira). Nira mengalir dari pongkor ke kain saring di atas wajan.', 'Tap the bamboo pongkor (or the Pour sap button). The sap flows from the pongkor onto the cloth over the wok.'),
      t('Sambil menuang, kotoran seperti semut, bunga kelapa, dan lebah akan tersangkut di kain. Ketuk kotoran itu untuk membuangnya.', 'While pouring, debris such as ants, coconut flowers, and bees gets caught on the cloth. Tap it to remove it.'),
      t('Bersihkan sebanyak mungkin sebelum wajan penuh. Makin bersih, makin tinggi skormu.', 'Clear as much as you can before the wok is full. The cleaner it is, the higher your score.'),
    ],
    timer: t('Ada pewaktu 40 detik. Kalau habis, langkah ini selesai dengan skor yang kamu dapat.', 'There is a 40-second timer. When it runs out, the step ends with the score you have.'),
    fact: t(
      'Nira ditampung di pongkor bambu yang diberi laru alami (kapur dan cangkang manggis) agar tidak cepat asam, lalu disaring dengan kain bersih untuk membuang bunga kelapa, lebah, dan semut. Penderes mengingatkan: nira jangan dibiarkan lama sebelum dimasak.',
      'The sap is collected in a bamboo pongkor treated with a natural preservative (lime and mangosteen rind) so it does not turn sour, then filtered through a clean cloth to remove coconut flowers, bees, and ants. Tappers remind us: do not leave the sap for long before cooking.',
    ),
  },
  {
    id: 'masak',
    title: t('Masak di tungku', 'Cook on the stove'),
    hint: t('Jaga api di zona yang sesuai dan ketuk buih untuk dibuang. Waktu dipadatkan dari ±4 jam jadi detik.', 'Keep the fire in the right zone and tap the foam to remove it. About 4 hours are compressed into seconds.'),
    howto: [
      t('Atur api dengan tombol Kipasi (api membesar) dan Kecilkan (api mengecil).', 'Control the fire with Fan (the fire grows) and Lower (the fire shrinks).'),
      t('Jaga penanda api tetap di zona hijau. Zonanya berubah: besar di awal, sedang di tengah, kecil di akhir.', 'Keep the fire marker in the green zone. The zone changes: high at the start, medium in the middle, low at the end.'),
      t('Buih putih akan muncul di wajan. Ketuk buih itu untuk membuangnya sebelum 10 detik berlalu.', 'White foam will appear in the wok. Tap it to remove it before 10 seconds pass.'),
    ],
    timer: t('Pewaktu 45 detik mewakili sekitar 4,5 jam memasak. Lihat jam dan termometer di bawah wajan.', 'The 45-second timer stands for about 4.5 hours of cooking. Watch the clock and thermometer below the wok.'),
    fact: t(
      'Api dibesarkan di awal supaya air cepat menguap, dan buih serta kotoran halus dibuang. Pemasakan berakhir sekitar 105–110 °C (sumber lain menyebut sampai 120 °C). Warna makin cokelat dan buih berkurang. Untuk 25–30 liter nira, prosesnya sekitar 4–5 jam.',
      'The fire is raised at the start so water evaporates quickly, and foam and fine dirt are skimmed off. Cooking ends at about 105–110 °C (other sources say up to 120 °C). The colour darkens and the foam fades. For 25–30 litres of sap the process takes about 4–5 hours.',
    ),
  },
  {
    id: 'aduk',
    title: t('Aduk sabar', 'Stir patiently'),
    hint: t('Ketuk Aduk saat penanda tepat di zona karamel. Lima kali.', 'Tap Stir when the marker is in the caramel zone. Five times.'),
    howto: [
      t('Penanda bulat bergerak ke kiri dan ke kanan di sepanjang bar.', 'A round marker moves left and right along the bar.'),
      t('Tekan tombol Aduk saat penanda berada di zona hijau.', 'Press the Stir button when the marker is in the green zone.'),
      t('Lakukan 5 kali. Makin tepat, makin lancar kayu pengaduk berputar.', 'Do it 5 times. The more accurate you are, the smoother the stirrer turns.'),
    ],
    fact: t(
      'Pekatan terus diaduk selama dimasak. Sebuah studi menyebut pengadukan manual yang tidak konsisten sebagai salah satu masalah mutu, jadi ritme yang sabar itu keahlian.',
      'The reduced sap is stirred continuously while it cooks. One study names inconsistent manual stirring as a quality problem, so a patient rhythm is a skill.',
    ),
  },
  {
    id: 'cetak',
    title: t('Tuang ke cetakan', 'Pour into the molds'),
    hint: t('Pekatan perlu turun suhunya. Ketuk Tuang saat termometer di zona hijau, sekitar 70 °C.', 'The syrup must cool. Tap Pour when the thermometer is in the green zone, around 70 °C.'),
    howto: [
      t('Pekatan gula mulai mendingin. Perhatikan penanda termometer yang bergerak turun.', 'The sugar syrup starts to cool. Watch the thermometer marker move down.'),
      t('Tekan Tuang ke cetakan saat penanda ada di zona hijau, sekitar 70 °C.', 'Press Pour into the molds when the marker is in the green zone, around 70 °C.'),
      t('Terlalu cepat berbahaya dan gula sulit mengeras. Terlalu lambat, pekatan jadi kental dan mengeras.', 'Too early is dangerous and the sugar will not set well. Too late, the syrup thickens and hardens.'),
    ],
    timer: t('Ada pewaktu 35 detik. Kalau habis, pekatan dituang otomatis dengan skor rendah.', 'There is a 35-second timer. When it runs out, the syrup is poured automatically with a low score.'),
    fact: t(
      'Saat suhu pekatan turun sekitar 70 °C, gula segera dituang ke cetakan, umumnya setengah tempurung kelapa (bathok), lalu dibiarkan dingin dan mengeras.',
      'When the syrup has cooled to about 70 °C, the sugar is poured into molds, usually half a coconut shell (bathok), then left to cool and set.',
    ),
  },
];

const getTools = (): Record<string, { name: string; text: string }> => ({
  pongkor: {
    name: t('Pongkor dan laru', 'Pongkor and laru'),
    text: t(
      'Pongkor adalah wadah bambu penampung nira. Penderes di Cilongok memberinya laru alami dari kapur dan cangkang manggis supaya nira tidak cepat berubah asam.',
      'The pongkor is the bamboo container that catches the sap. Tappers in Cilongok add a natural preservative of lime and mangosteen rind so the sap does not turn sour quickly.',
    ),
  },
  kain: {
    name: t('Kain saring', 'Filter cloth'),
    text: t(
      'Nira disaring dengan kain bersih untuk membuang kotoran seperti bunga kelapa, lebah, dan semut, lalu langsung ditampung di wajan.',
      'The sap is filtered through a clean cloth to remove dirt such as coconut flowers, bees, and ants, then goes straight into the wok.',
    ),
  },
  wajan: {
    name: t('Wajan dan tungku', 'Wok and stove'),
    text: t(
      'Nira dimasak di wajan besar di atas tungku kayu. Untuk 25–30 liter nira dibutuhkan sekitar 4–5 jam, dengan api yang diatur.',
      'The sap is cooked in a large wok over a wood stove. 25–30 litres of sap take about 4–5 hours, with the fire carefully controlled.',
    ),
  },
  jubung: {
    name: t('Jubung', 'Jubung'),
    text: t(
      'Anyaman bambu yang dipakai sebagian perajin untuk mengurangi buih saat pemasakan. Tidak semua perajin memakainya.',
      'Woven bamboo that some artisans use to reduce foam while cooking. Not every artisan uses it.',
    ),
  },
  bathok: {
    name: t('Cetakan bathok', 'Bathok mold'),
    text: t(
      'Gula kental dituang ke cetakan dari setengah tempurung kelapa (bathok), lalu didinginkan sampai mengeras.',
      'The thick sugar is poured into molds made from half a coconut shell (bathok), then cooled until it sets.',
    ),
  },
});

const FACT_MOOD: Record<StepId, NiraMood> = { saring: 'happy', masak: 'think', aduk: 'wave', cetak: 'cheer' };

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-3 overflow-hidden rounded-2xl border border-bamboo bg-[#E9D2A6]">{children}</div>
);


/** Papan "Cara main": dibaca dulu, permainan baru mulai setelah pemain menekan tombol. */
const Howto: React.FC<{ title: string; items: string[]; timer?: string; onStart: () => void }> = ({ title, items, timer, onStart }) => (
  <div className="mt-2 rounded-2xl bg-coconut p-4">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Cara main', 'How to play')}</p>
    <h3 className="mt-0.5 text-xl text-deep-forest">{title}</h3>
    <ol className="mt-3 space-y-2.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-base leading-snug text-charcoal">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-coconut">{i + 1}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
    {timer && (
      <p className="mt-3 flex items-center gap-2 rounded-xl bg-caramel/15 px-3 py-2 text-sm font-semibold text-caramel-dark">
        <Clock className="h-4 w-4 shrink-0" /> {timer}
      </p>
    )}
    <button type="button" onClick={onStart} className="mt-4 min-h-[56px] w-full rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
      {t('Mengerti, mulai', 'Got it, start')}
    </button>
  </div>
);

/** Hitung mundur 3-2-1 sebelum langkah berwaktu dimulai. */
const Countdown: React.FC<{ onGo: () => void }> = ({ onGo }) => {
  const [n, setN] = React.useState(3);
  React.useEffect(() => {
    if (n === 0) {
      onGo();
      return;
    }
    const t = setTimeout(() => setN((v) => v - 1), 800);
    return () => clearTimeout(t);
  }, [n, onGo]);
  return (
    <div className="mt-2 flex h-64 flex-col items-center justify-center rounded-2xl bg-coconut" role="status" aria-live="assertive">
      <p className="text-sm font-semibold text-ink-soft">{t('Bersiap...', 'Get ready...')}</p>
      <p className="font-serif text-8xl text-deep-forest">{n > 0 ? n : t('Mulai!', 'Go!')}</p>
    </div>
  );
};

/** Pewaktu terlihat: bar yang menyusut dan angka sisa detik. */
const TimerBar: React.FC<{ left: number; total: number; label?: string }> = ({ left, total, label = t('Sisa waktu', 'Time left') }) => {
  const low = left <= 8;
  return (
    <div className="mt-2" role="timer" aria-label={`${label} ${Math.ceil(left)} detik`}>
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-1 text-ink-soft"><Clock className="h-4 w-4" /> {label}</span>
        <span className={low ? 'text-terracotta' : 'text-deep-forest'}>{Math.ceil(left)} {t('dtk', 's')}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-bamboo/60">
        <div className={`h-full rounded-full ${low ? 'bg-terracotta' : 'bg-forest'}`} style={{ width: `${Math.max(0, (left / total) * 100)}%`, transition: 'width 0.3s linear' }} />
      </div>
    </div>
  );
};

/* ---------- pengenalan alat ---------- */
const Kenali: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [seen, setSeen] = React.useState<string[]>([]);
  const [cur, setCur] = React.useState<string | null>(null);
  const spots = [
    { id: 'jubung', x: 58, y: 58 },
    { id: 'pongkor', x: 300, y: 150 },
    { id: 'kain', x: 52, y: 168 },
    { id: 'wajan', x: 180, y: 118 },
    { id: 'bathok', x: 244, y: 222 },
  ];
  const open = (id: string) => {
    setCur(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  const TOOLS = getTools();
  const info = cur ? TOOLS[cur] : null;
  return (
    <div>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t('Ketuk tanda', 'Tap the')} <b>?</b> {t('untuk mengenali alat di dapur. Kenali minimal 3.', 'marks to get to know the tools in the kitchen. Learn at least 3.')}</p>
      <Stage>
        <Dapur
          tools
          level={0.8}
          cook={0.2}
          heat={30}
          moulds={[0, 0, 0, 0, 0]}
          hotspots={spots.map((s) => ({ ...s, seen: seen.includes(s.id) }))}
          onHotspot={open}
          className="block w-full"
        />
      </Stage>
      <div className="mt-3 min-h-[96px] rounded-2xl bg-coconut p-3" role="status">
        {info ? (
          <>
            <p className="text-base font-semibold text-deep-forest">{info.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-charcoal">{info.text}</p>
          </>
        ) : (
          <p className="text-sm text-ink-soft">{t('Belum ada alat yang dipilih.', 'No tool selected yet.')}</p>
        )}
      </div>
      <button
        type="button"
        disabled={seen.length < 3}
        onClick={onDone}
        className="mt-3 min-h-[56px] w-full rounded-full bg-forest text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
      >
        {seen.length < 3 ? t(`Kenali ${3 - seen.length} alat lagi`, `Learn ${3 - seen.length} more tool(s)`) : t('Mulai memasak', 'Start cooking')}
      </button>
    </div>
  );
};

/* ---------- langkah 1: saring ---------- */
const SARING_TIME = 40;
const Saring: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [level, setLevel] = React.useState(0);
  const [pouring, setPouring] = React.useState(false);
  const [debris, setDebris] = React.useState<Debris[]>([]);
  const [left, setLeft] = React.useState(SARING_TIME);
  const removed = React.useRef(0);
  const total = React.useRef(0);
  const lv = React.useRef(0);
  const nextSpawn = React.useRef(0.12);
  const idc = React.useRef(0);
  const done = React.useRef(false);
  const elapsed = React.useRef(0);

  // Pewaktu berjalan terus supaya pemain sadar waktunya terbatas.
  React.useEffect(() => {
    const id = setInterval(() => {
      elapsed.current += 0.1;
      setLeft(Math.max(0, SARING_TIME - elapsed.current));
      if (lv.current >= 1 || elapsed.current >= SARING_TIME) {
        if (!done.current) {
          done.current = true;
          clearInterval(id);
          setPouring(false);
          const t = Math.max(1, total.current);
          const clean = removed.current / t;
          // Wajan yang belum penuh juga mengurangi skor.
          onDone(Math.round(clean * 100 * (0.5 + 0.5 * lv.current)));
        }
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!pouring) return;
    const id = setInterval(() => {
      lv.current = Math.min(1, lv.current + 0.005);
      if (lv.current >= nextSpawn.current && total.current < 7) {
        nextSpawn.current += 0.13;
        idc.current += 1;
        total.current += 1;
        const d: Debris = { id: idc.current, x: rand(132, 230), y: rand(135, 143), kind: (['semut', 'bunga', 'lebah'] as const)[Math.floor(Math.random() * 3)] };
        setDebris((a) => [...a, d]);
      }
      setLevel(lv.current);
    }, 50);
    return () => clearInterval(id);
  }, [pouring]);

  const kick = (id: number) => {
    removed.current += 1;
    setDebris((d) => d.filter((x) => x.id !== id));
  };
  return (
    <div>
      <TimerBar left={left} total={SARING_TIME} />
      <Stage>
        <Dapur cloth pour={pouring} level={level} cook={0.02} heat={20} debris={debris} onDebris={kick} onPongkor={() => setPouring((v) => !v)} className="block w-full" />
      </Stage>
      <p role="status" className="mt-2 min-h-[44px] text-center text-sm font-semibold text-deep-forest">
        {debris.length > 0
          ? t(`Ada ${debris.length} kotoran di kain. Ketuk untuk membuangnya!`, `${debris.length} bit(s) of debris on the cloth. Tap to remove them!`)
          : pouring
            ? t('Nira mengalir... awasi kainnya.', 'The sap is flowing... watch the cloth.')
            : level > 0
              ? t('Tekan lanjut menuang.', 'Press to keep pouring.')
              : t('Ketuk pongkor bambu atau tekan tombol untuk mulai menuang nira.', 'Tap the bamboo pongkor or press the button to start pouring the sap.')}{' '}
        {t('Wajan terisi', 'Wok filled')} {Math.round(level * 100)}%.
      </p>
      <button type="button" onClick={() => setPouring((p) => !p)} className="mt-1 min-h-[56px] w-full rounded-full bg-forest text-lg font-semibold text-coconut">
        {pouring ? t('Berhenti sebentar', 'Pause') : level > 0 ? t('Lanjut menuang', 'Keep pouring') : t('Tuang nira', 'Pour sap')}
      </button>
    </div>
  );
};

/* ---------- langkah 2: masak ---------- */
const DURATION = 45; // detik permainan, mewakili ±4,5 jam
const Masak: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [heat, setHeat] = React.useState(55);
  const [p, setP] = React.useState(0);
  const [foam, setFoam] = React.useState<(Foam & { born: number })[]>([]);
  const heatRef = React.useRef(55);
  const ticks = React.useRef(0);
  const inZone = React.useRef(0);
  const spawned = React.useRef(0);
  const skimmed = React.useRef(0);
  const nextFoam = React.useRef(30);
  const idc = React.useRef(0);
  const done = React.useRef(false);

  const zoneAt = (prog: number): [number, number, string] =>
    prog < 0.3 ? [60, 90, t('Api besar di awal supaya air cepat menguap', 'A big fire at the start so water evaporates quickly')] : prog < 0.75 ? [42, 74, t('Api sedang, buih terus dibuang', 'Medium fire, keep skimming the foam')] : [30, 62, t('Api kecil, nira makin pekat dan cokelat', 'A small fire, the sap thickens and browns')];

  React.useEffect(() => {
    const id = setInterval(() => {
      ticks.current += 1;
      const prog = ticks.current / (DURATION * 10);
      heatRef.current = clamp(heatRef.current + (Math.random() - 0.52) * 1.6);
      const [lo, hi] = zoneAt(prog);
      if (heatRef.current >= lo && heatRef.current <= hi) inZone.current += 1;
      setHeat(heatRef.current);
      setP(Math.min(1, prog));

      if (ticks.current >= nextFoam.current && prog < 0.9) {
        nextFoam.current += prog < 0.4 ? 50 : prog < 0.7 ? 70 : 100;
        idc.current += 1;
        spawned.current += 1;
        const f = { id: idc.current, x: rand(130, 232), y: rand(141, 147), r: rand(9, 13), born: ticks.current };
        setFoam((a) => [...a, f]);
      }
      // buih yang dibiarkan 10 detik dianggap terlewat
      setFoam((a) => a.filter((x) => ticks.current - x.born < 100));

      if (ticks.current >= DURATION * 10 && !done.current) {
        done.current = true;
        clearInterval(id);
        const zoneScore = (inZone.current / ticks.current) * 100;
        const foamScore = spawned.current ? (skimmed.current / spawned.current) * 100 : 100;
        onDone(Math.round(zoneScore * 0.65 + foamScore * 0.35));
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bump = (d: number) => {
    heatRef.current = clamp(heatRef.current + d);
    setHeat(heatRef.current);
  };
  const skim = (id: number) => {
    skimmed.current += 1;
    setFoam((a) => a.filter((x) => x.id !== id));
  };
  const [lo, hi, label] = zoneAt(p);
  const ok = heat >= lo && heat <= hi;
  const temp = Math.round(32 + p * 76);
  const hours = (p * 4.5).toFixed(1).replace('.', ',');
  return (
    <div>
      <TimerBar left={DURATION * (1 - p)} total={DURATION} />
      <Stage>
        <Dapur level={1 - p * 0.35} cook={p} heat={heat} foam={foam} onFoam={skim} className="block w-full" />
      </Stage>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-ink-soft">
        <span className="flex items-center justify-center gap-1 rounded-xl bg-coconut py-2">
          <Clock className="h-3.5 w-3.5" /> {t('Jam ke-', 'Hour ')}{hours}
        </span>
        <span className="flex items-center justify-center gap-1 rounded-xl bg-coconut py-2">
          <Thermometer className="h-3.5 w-3.5" /> {temp} °C
        </span>
        <span className="flex items-center justify-center gap-1 rounded-xl bg-coconut py-2">
          <Flame className="h-3.5 w-3.5" /> {t('Api', 'Fire')} {Math.round(heat)}
        </span>
      </div>
      <div className="relative mt-2 h-4 overflow-hidden rounded-full border border-bamboo bg-coconut" aria-hidden>
        <div className="absolute inset-y-0 bg-forest/30" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
        <div className="absolute inset-y-0 w-1.5 bg-caramel-dark" style={{ left: `calc(${heat}% - 3px)` }} />
      </div>
      <p role="status" className={`mt-1 min-h-[40px] text-sm font-semibold ${ok ? 'text-forest' : 'text-terracotta'}`}>
        {ok ? label : heat < lo ? t('Api kurang besar, tekan Kipasi!', 'The fire is too small, press Fan!') : t('Terlalu panas, tekan Kecilkan!', 'Too hot, press Lower!')}
        {foam.length > 0 && ` · ${foam.length} ${t('buih menunggu dibuang', 'foam bubble(s) waiting to be skimmed')}`}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => bump(10)} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-caramel-dark text-base font-semibold text-coconut">
          <Wind className="h-5 w-5" /> {t('Kipasi', 'Fan')}
        </button>
        <button type="button" onClick={() => bump(-12)} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-coconut">
          <Flame className="h-5 w-5" /> {t('Kecilkan', 'Lower')}
        </button>
      </div>
    </div>
  );
};

/* ---------- langkah 3: aduk ---------- */
const Aduk: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [pos, setPos] = React.useState(0);
  const [angle, setAngle] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [last, setLast] = React.useState<string | null>(null);
  const posRef = React.useRef(0);
  const dir = React.useRef(1);
  const ang = React.useRef(0);
  const speed = React.useRef(4);
  const scores = React.useRef<number[]>([]);
  const ZONE: [number, number] = [37, 65];
  const rounds = 5;

  React.useEffect(() => {
    const id = setInterval(() => {
      posRef.current += dir.current * 1.5;
      if (posRef.current >= 100 || posRef.current <= 0) {
        dir.current *= -1;
        posRef.current = clamp(posRef.current);
      }
      ang.current = (ang.current + speed.current) % 360;
      setPos(posRef.current);
      setAngle(ang.current);
    }, 30);
    return () => clearInterval(id);
  }, []);

  const tap = () => {
    const x = posRef.current;
    const dist = x < ZONE[0] ? ZONE[0] - x : x > ZONE[1] ? x - ZONE[1] : 0;
    const s = dist === 0 ? 100 : dist < 14 ? 60 : 20;
    scores.current.push(s);
    speed.current = s === 100 ? 8 : s === 60 ? 5 : 2.5;
    setLast(s === 100 ? t('Pas! Pengadukan lancar', 'Spot on! Smooth stirring') : s === 60 ? t('Hampir pas', 'Almost') : t('Meleset, adukan tersendat', 'Missed, the stirring stalls'));
    const n = round + 1;
    setRound(n);
    if (n >= rounds) onDone(Math.round(scores.current.reduce((a, b) => a + b, 0) / rounds));
  };

  return (
    <div>
      <p className="mt-2 text-center text-sm font-semibold text-ink-soft">{t('Tidak ada batas waktu. Tunggu penanda masuk zona hijau.', 'No time limit. Wait for the marker to enter the green zone.')}</p>
      <Stage>
        <Dapur level={0.62} cook={0.82} heat={45} paddle={angle} className="block w-full" />
      </Stage>
      <div className="relative mt-3 h-10 w-full rounded-full border-2 border-bamboo bg-coconut" aria-hidden>
        <div className="absolute inset-y-0 rounded-full bg-forest/30" style={{ left: `${ZONE[0]}%`, width: `${ZONE[1] - ZONE[0]}%` }} />
        <div className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-caramel-dark shadow" style={{ left: `${pos}%` }} />
      </div>
      <p role="status" className="mt-2 min-h-[28px] text-center text-base font-semibold text-deep-forest">
        {last ?? t('Siap?', 'Ready?')} · {round} / {rounds}
      </p>
      <button type="button" onClick={tap} className="mt-1 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-forest text-lg font-semibold text-coconut">
        <Hand className="h-5 w-5" /> {t('Aduk!', 'Stir!')}
      </button>
    </div>
  );
};

/* ---------- langkah 4: cetak ---------- */
const CETAK_TIME = 35;
const Cetak: React.FC<{ onDone: (score: number) => void }> = ({ onDone }) => {
  const [temp, setTemp] = React.useState(108);
  const [left, setLeft] = React.useState(CETAK_TIME);
  const [moulds, setMoulds] = React.useState([0, 0, 0, 0, 0]);
  const [phase, setPhase] = React.useState<'wait' | 'pour'>('wait');
  const [msg, setMsg] = React.useState('');
  const tmp = React.useRef(108);
  const elapsed = React.useRef(0);
  const score = React.useRef(0);
  const ZONE: [number, number] = [62, 78];

  const startPour = React.useCallback(
    (sc: number) => {
      score.current = sc;
      setPhase('pour');
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setMoulds((m) => m.map((v, k) => (k === i - 1 ? 1 : v)));
        if (i >= 5) {
          clearInterval(id);
          setTimeout(() => onDone(score.current), 700);
        }
      }, 600);
    },
    [onDone],
  );

  React.useEffect(() => {
    if (phase !== 'wait') return;
    const id = setInterval(() => {
      elapsed.current += 0.1;
      tmp.current = Math.max(45, 108 - (elapsed.current / CETAK_TIME) * 63);
      setTemp(Math.round(tmp.current));
      setLeft(Math.max(0, CETAK_TIME - elapsed.current));
      if (elapsed.current >= CETAK_TIME) {
        clearInterval(id);
        setMsg(t('Waktu habis. Pekatan sudah mulai mengeras, gula jadi kurang halus.', 'Time is up. The syrup has started to harden, so the sugar is less smooth.'));
        startPour(25);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, startPour]);

  const pour = () => {
    const x = tmp.current;
    if (x > 85) {
      setMsg(t('Terlalu panas! Dalam keadaan nyata ini berbahaya, dan gulanya sulit mengeras.', 'Too hot! In real life this is dangerous, and the sugar will not set well.'));
      startPour(30);
    } else if (x >= ZONE[0] && x <= ZONE[1]) {
      setMsg(t('Tepat! Gula dituang saat suhunya sekitar 70 °C.', 'Spot on! The sugar was poured at about 70 °C.'));
      startPour(100);
    } else if (x > ZONE[1]) {
      setMsg(t('Sedikit terlalu cepat, tapi masih bisa.', 'A little early, but it will do.'));
      startPour(65);
    } else {
      setMsg(t('Sedikit terlambat, pekatan mulai kental.', 'A little late, the syrup is thickening.'));
      startPour(65);
    }
  };
  const inZone = temp >= ZONE[0] && temp <= ZONE[1];
  return (
    <div>
      {phase === 'wait' ? <TimerBar left={left} total={CETAK_TIME} label={t('Pekatan mendingin', 'Syrup cooling')} /> : <p className="mt-2 text-center text-sm font-semibold text-ink-soft">{t('Menuang ke cetakan...', 'Pouring into the molds...')}</p>}
      <Stage>
        <Dapur level={0.45} cook={0.92} heat={8} moulds={moulds} tilted={phase === 'pour'} className="block w-full" />
      </Stage>
      <div className="relative mt-3 h-4 overflow-hidden rounded-full border border-bamboo bg-coconut" aria-hidden>
        <div className="absolute inset-y-0 bg-forest/30" style={{ left: `${((ZONE[0] - 45) / 65) * 100}%`, width: `${((ZONE[1] - ZONE[0]) / 65) * 100}%` }} />
        <div className="absolute inset-y-0 w-1.5 bg-caramel-dark" style={{ left: `calc(${((temp - 45) / 65) * 100}% - 3px)` }} />
      </div>
      <p className={`mt-1 flex items-center justify-center gap-1.5 text-base font-semibold ${inZone && phase === 'wait' ? 'text-forest' : 'text-deep-forest'}`}>
        <Thermometer className="h-4 w-4" /> {temp} °C {inZone && phase === 'wait' ? t('· ZONA HIJAU, tuang sekarang!', '· GREEN ZONE, pour now!') : ''}
      </p>
      <p role="status" className="min-h-[44px] text-center text-sm text-ink-soft">
        {phase === 'pour'
          ? msg
          : temp > 85
            ? t('Pekatan masih sangat panas. Tunggu penanda turun ke zona hijau.', 'The syrup is still very hot. Wait for the marker to drop into the green zone.')
            : inZone
              ? t('Sekarang! Tekan Tuang selagi suhunya pas.', 'Now! Press Pour while the temperature is right.')
              : t('Penanda sudah lewat zona hijau, tuang secepatnya.', 'The marker has passed the green zone, pour as soon as you can.')}
      </p>
      <button
        type="button"
        disabled={phase === 'pour'}
        onClick={pour}
        className="mt-1 min-h-[56px] w-full rounded-full bg-caramel-dark text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
      >
        {phase === 'pour' ? t('Menuang...', 'Pouring...') : t('Tuang ke cetakan', 'Pour into molds')}
      </button>
    </div>
  );
};

export const MasakGula: React.FC<{ onFinish: (stars: 1 | 2 | 3, avg: number) => void }> = ({ onFinish }) => {
  const STEPS = getSteps();
  const [step, setStep] = React.useState(-2); // -2 = layar mulai, -1 = kenali alat
  const [fact, setFact] = React.useState(false);
  const [phase, setPhase] = React.useState<'howto' | 'count' | 'play'>('howto');
  const scores = React.useRef<number[]>([]);

  const finishStep = (score: number) => {
    scores.current[step] = score;
    setFact(true);
  };
  const next = () => {
    setFact(false);
    setPhase('howto');
    if (step + 1 >= STEPS.length) {
      const avg = Math.round(scores.current.reduce((a, b) => a + b, 0) / STEPS.length);
      onFinish(avg >= 80 ? 3 : avg >= 55 ? 2 : 1, avg);
    } else setStep(step + 1);
  };

  if (step === -2) {
    return (
      <div className="text-center">
        <Nira mood="cheer" size={96} className="mx-auto" />
        <p className="mt-2 text-base leading-relaxed text-charcoal">
          {t('Masuk ke dapur perajin dan buat gula kelapa cetak dari nira, langkah demi langkah, sesuai cara tradisional di Banyumas.', 'Step into the artisan\'s kitchen and make molded coconut sugar from sap, step by step, the traditional Banyumas way.')}
        </p>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-bamboo/40 p-3 text-left text-sm text-deep-forest">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {t('Wajan dan gula yang dimasak sangat panas. Ini simulasi untuk belajar, jangan ditiru tanpa pendampingan perajin.', 'The wok and the cooking sugar are very hot. This is a simulation for learning; do not copy it without an artisan\'s guidance.')}
        </p>
        <button type="button" onClick={() => setStep(-1)} className="mt-4 min-h-[56px] w-full rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
          {t('Masuk dapur', 'Enter the kitchen')}
        </button>
        <p className="mt-2 text-xs text-ink-soft">{t('Isi proses berasal dari jurnal dan liputan tentang gula kelapa Banyumas.', 'The process content comes from journals and news about Banyumas coconut sugar.')}</p>
      </div>
    );
  }

  if (step === -1) return <Kenali onDone={() => { setPhase('howto'); setStep(0); }} />;

  const s = STEPS[step];
  return (
    <div>
      <div className="flex gap-1.5" aria-label={t(`Langkah ${step + 1} dari ${STEPS.length}`, `Step ${step + 1} of ${STEPS.length}`)}>
        {STEPS.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-caramel' : 'bg-bamboo'}`} />
        ))}
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
        {t('Langkah', 'Step')} {step + 1} · {s.title}
      </p>
      {fact ? (
        <div className="mt-2 text-center">
          <Nira mood={FACT_MOOD[s.id]} size={84} className="mx-auto" />
          <p className="mt-2 text-lg font-semibold text-deep-forest">
            {t('Skor langkah ini', 'This step\'s score')}: {scores.current[step] ?? 0}% {(scores.current[step] ?? 0) >= 80 ? t('· Mantap!', '· Excellent!') : (scores.current[step] ?? 0) >= 55 ? t('· Lumayan', '· Not bad') : t('· Coba lagi lain kali', '· Try again next time')}
          </p>
          <div className="ornate mt-3 p-3 text-left">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-forest">
              <Sparkles className="h-3.5 w-3.5" /> {t('Tahukah kamu', 'Did you know')}
            </p>
            <p className="mt-1 text-base leading-relaxed text-charcoal">{s.fact}</p>
            <p className="mt-2 text-xs text-ink-soft">{t('Sumber: jurnal dan liputan tentang gula kelapa Banyumas.', 'Source: journals and news about Banyumas coconut sugar.')}</p>
          </div>
          <button type="button" onClick={next} className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
            {step + 1 >= STEPS.length ? t('Lihat hasil', 'See results') : t('Langkah berikutnya', 'Next step')}
          </button>
        </div>
      ) : (
        <>
          {phase === 'howto' && <Howto title={s.title} items={s.howto} timer={s.timer} onStart={() => setPhase(s.timer ? 'count' : 'play')} />}
          {phase === 'count' && <Countdown onGo={() => setPhase('play')} />}
          {phase === 'play' && (
            <>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.hint}</p>
              {s.id === 'saring' && <Saring key="s" onDone={finishStep} />}
              {s.id === 'masak' && <Masak key="m" onDone={finishStep} />}
              {s.id === 'aduk' && <Aduk key="a" onDone={finishStep} />}
              {s.id === 'cetak' && <Cetak key="c" onDone={finishStep} />}
            </>
          )}
        </>
      )}
    </div>
  );
};
