import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, ClipboardCheck, Film, Hand, Play } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Ornate } from '../components/ui';
import { getGerakan } from '../data/gerakan';
import { t } from '../i18n';
import { HAND_CONNECTIONS, loadHandLandmarker, prefetchHandAssets } from '../lib/hand';
import { useStore } from '../store';
import { IramaPanel } from '../components/IramaPanel';

const BAB_PRAKTIK = '/learn/bab/kerajinan-tradisional-transfer-pengetahuan?kartu=praktik';

/** Arsip Gerakan: rekaman gerak perajin. Pengetahuan yang ada di tangan lebih sulit ditulis daripada istilah. */
export const Arsip: React.FC = () => {
  const navigate = useNavigate();
  const GERAKAN = getGerakan();
  return (
    <div className="px-5 pb-8 pt-4">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> {t('Perjalanan', 'Journey')}
      </Link>
      <div className="relative overflow-hidden rounded-3xl">
        <img src="/media/dapur.jpg" alt={t('Dapur tradisional: wajan berisi nira mendidih di atas tungku batu', 'A traditional kitchen: a wok of boiling sap on a stone stove')} className="h-48 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E7C79A]">{t('Arsip Gerakan', 'Movement Archive')}</p>
          <h1 className="font-serif text-[26px] leading-tight text-coconut">{t('Pengetahuan yang ada di tangan perajin', 'Knowledge held in the artisans\' hands')}</h1>
        </div>
      </div>
      <p className="mt-3 text-base leading-relaxed text-charcoal">
        {t('Banyak keahlian tidak tertulis: cara memegang, ritme mengaduk, kapan menuang. Arsip ini merekamnya sebagai gerak, supaya bisa dipelajari generasi berikutnya.', 'Much of the skill is unwritten: how to hold, the rhythm of stirring, when to pour. This archive records it as movement so the next generation can learn it.')}
      </p>
      <p className="mt-2 flex gap-2 rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0" /> {t('Rekaman lapangan tim NIRA KITA. Anotasi mentor dan persetujuan kurator masih menunggu.', 'Field recordings by the NIRA KITA team. Mentor annotations and curator approval are still pending.')}
      </p>

      <ul className="mt-4 space-y-3">
        {GERAKAN.map((g) => (
          <li key={g.id}>
            <Ornate as="button" onClick={() => navigate(`/learn/arsip/${g.id}`)} className="flex gap-3 overflow-hidden p-0">
              <span className="relative block h-28 w-32 shrink-0 overflow-hidden bg-night">
                <video src={`${g.clip}#t=0.6`} preload="metadata" muted playsInline className="h-full w-full object-cover" aria-hidden />
                <span className="absolute inset-0 flex items-center justify-center bg-deep-forest/25">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coconut/90 text-deep-forest">
                    <Play className="h-5 w-5" />
                  </span>
                </span>
              </span>
              <span className="min-w-0 flex-1 py-3 pr-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-caramel-dark">{g.step}</span>
                <span className="block text-lg leading-snug text-deep-forest">{g.title}</span>
                {g.practice && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-bold text-forest">
                    <Hand className="h-3 w-3" /> {t('Bisa dilatih', 'Can be practised')}
                  </span>
                )}
              </span>
            </Ornate>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ArsipDetail: React.FC = () => {
  const { id } = useParams();
  const { annotations } = useStore();
  const g = getGerakan().find((x) => x.id === id);
  const note = g ? annotations[g.id] : undefined;
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const raf = React.useRef(0);
  const [skeleton, setSkeleton] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'searching' | 'found' | 'error'>('idle');

  React.useEffect(() => {
    if (!skeleton) {
      cancelAnimationFrame(raf.current);
      canvasRef.current?.getContext('2d')?.clearRect(0, 0, 9999, 9999);
      setState('idle');
      return;
    }
    let alive = true;
    let ever = false;
    setState('loading');
    prefetchHandAssets();
    // biarkan status "memuat" tergambar dulu sebelum inisialisasi model yang berat
    new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 50)))
      .then(() => loadHandLandmarker())
      .then((lm) => {
        if (!alive) return;
        setState('searching');
        const loop = () => {
          const v = videoRef.current;
          const c = canvasRef.current;
          if (!alive || !v || !c) return;
          if (v.readyState >= 2 && v.videoWidth) {
            const res = lm.detectForVideo(v, performance.now());
            const hand = res.landmarks?.[0];
            c.width = v.videoWidth;
            c.height = v.videoHeight;
            const ctx = c.getContext('2d')!;
            ctx.clearRect(0, 0, c.width, c.height);
            if (hand) {
              if (!ever) {
                ever = true;
                setState('found');
              }
              ctx.lineWidth = 4;
              ctx.strokeStyle = '#8FD05E';
              ctx.beginPath();
              HAND_CONNECTIONS.forEach(([a, b]) => {
                ctx.moveTo(hand[a].x * c.width, hand[a].y * c.height);
                ctx.lineTo(hand[b].x * c.width, hand[b].y * c.height);
              });
              ctx.stroke();
              ctx.fillStyle = '#FFFDF8';
              hand.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x * c.width, p.y * c.height, 4, 0, Math.PI * 2);
                ctx.fill();
              });
            }
          }
          raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
      })
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
      cancelAnimationFrame(raf.current);
    };
  }, [skeleton]);

  if (!g) return <Navigate to="/learn/arsip" replace />;
  return (
    <div className="px-5 pb-8 pt-4">
      <Link to="/learn/arsip" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> {t('Arsip Gerakan', 'Movement Archive')}
      </Link>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{g.step}</p>
      <h1 className="text-[26px] leading-tight text-deep-forest">{g.title}</h1>

      <div className="relative mt-3 overflow-hidden rounded-2xl bg-night">
        <video ref={videoRef} src={g.clip} controls loop muted playsInline autoPlay className="block w-full" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      </div>

      <button
        type="button"
        aria-pressed={skeleton}
        onClick={() => setSkeleton((v) => !v)}
        className={`mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full text-base font-semibold ${skeleton ? 'bg-forest text-coconut' : 'border-2 border-forest text-forest'}`}
      >
        <Camera className="h-5 w-5" /> {skeleton ? t('Kerangka tangan aktif', 'Hand skeleton on') : t('Tampilkan kerangka tangan', 'Show hand skeleton')}
      </button>
      {skeleton && (
        <p role="status" className="mt-2 text-sm font-semibold text-ink-soft">
          {state === 'loading' && t('Memuat model pelacak (diproses di perangkatmu)...', 'Loading the tracking model (processed on your device)...')}
          {state === 'searching' && t('Mencari tangan pada klip. Jika tangan tidak utuh atau tertutup uap, kerangka tidak muncul.', 'Looking for a hand in the clip. If the hand is partial or hidden by steam, no skeleton appears.')}
          {state === 'found' && t('Tangan terdeteksi. Kerangka digambar langsung di perangkatmu; video tidak dikirim ke mana pun.', 'Hand detected. The skeleton is drawn live on your device; the video is not sent anywhere.')}
          {state === 'error' && t('Model pelacak tidak bisa dimuat.', 'The tracking model could not be loaded.')}
        </p>
      )}

      <h2 className="mt-5 flex items-center gap-2 text-xl text-deep-forest">
        <Film className="h-5 w-5 text-caramel-dark" /> {t('Yang terlihat', 'What you see')}
      </h2>
      <p className="mt-1 text-base leading-relaxed text-charcoal">{g.see}</p>
      <h2 className="mt-4 text-xl text-deep-forest">{t('Mengapa penting', 'Why it matters')}</h2>
      <p className="mt-1 text-base leading-relaxed text-charcoal">{g.why}</p>

      <Ornate className="mt-4 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Catatan mentor', 'Mentor notes')}</p>
        {note ? (
          <>
            <p className="mt-1 text-base leading-relaxed text-charcoal">"{note.text}"</p>
            <p className={`mt-1 text-xs font-bold ${note.approved ? 'text-forest' : 'text-caramel-dark'}`}>
              {note.author} · {note.approved ? t('Disetujui kurator', 'Approved by the curator') : t('Menunggu persetujuan kurator', 'Awaiting curator approval')}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t('Belum ada anotasi. Mentor akan menandai teknik pada klip ini, lalu kurator menyetujui sebelum tampil sebagai materi.', 'No annotation yet. A mentor will mark the technique on this clip, and the curator approves it before it appears as learning material.')}</p>
        )}
      </Ornate>

      {(g.id === 'mengaduk' || g.id === 'pengaduk-kayu') && (
        <Ornate className="mt-4 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Irama tangan', 'Hand rhythm')}</p>
          {annotations['irama-aduk']?.approved && annotations['irama-aduk'].rhythm ? (
            <IramaPanel rhythm={annotations['irama-aduk'].rhythm as never} moving final />
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {t('Irama perajin belum bisa diukur dari klip ini: tangan terdeteksi di sekitar 10% frame saja (jauh dan tertutup uap). Irama acuan diambil dari rekaman dekat oleh mentor, disetujui kurator, lalu tampil di sini dan di latihan mengaduk.', 'The rhythm of the artisan cannot be measured reliably from this clip: the hand is detected in only about 10% of frames (far away and hidden by steam). The reference rhythm is taken from a close-up recording by a mentor, approved by the curator, and then shown here and in the stirring practice.')}
            </p>
          )}
        </Ornate>
      )}

      {g.practice && (
        <Link to={`${BAB_PRAKTIK}&tugas=${g.practice}`} className="mt-4 flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
          <Hand className="h-5 w-5" /> {t('Latih gerakan ini', 'Practise this movement')}
        </Link>
      )}
      <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
        <Nira mood="happy" size={44} float={false} />
        {t('Rekaman lapangan tim NIRA KITA.', 'Field recording by the NIRA KITA team.')}
      </div>
    </div>
  );
};
