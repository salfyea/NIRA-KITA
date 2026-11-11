import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, ClipboardCheck, Film, Hand, Play } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Ornate } from '../components/ui';
import { GERAKAN } from '../data/gerakan';
import { HAND_CONNECTIONS, loadHandLandmarker } from '../lib/hand';

const BAB_PRAKTIK = '/learn/bab/kerajinan-tradisional-transfer-pengetahuan?kartu=praktik';

/** Arsip Gerakan: rekaman gerak perajin. Pengetahuan yang ada di tangan lebih sulit ditulis daripada istilah. */
export const Arsip: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="px-5 pb-8 pt-4">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> Perjalanan
      </Link>
      <div className="relative overflow-hidden rounded-3xl">
        <img src="/media/dapur.jpg" alt="Dapur tradisional: wajan berisi nira mendidih di atas tungku batu" className="h-48 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E7C79A]">Arsip Gerakan</p>
          <h1 className="font-serif text-[26px] leading-tight text-coconut">Pengetahuan yang ada di tangan perajin</h1>
        </div>
      </div>
      <p className="mt-3 text-base leading-relaxed text-charcoal">
        Banyak keahlian tidak tertulis: cara memegang, ritme mengaduk, kapan menuang. Arsip ini merekamnya sebagai gerak, supaya bisa dipelajari generasi berikutnya.
      </p>
      <p className="mt-2 flex gap-2 rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0" /> Rekaman lapangan tim NIRA KITA. Anotasi mentor dan persetujuan kurator masih menunggu.
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
                    <Hand className="h-3 w-3" /> Bisa dilatih
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
  const g = GERAKAN.find((x) => x.id === id);
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
    loadHandLandmarker()
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
        <ArrowLeft className="h-4 w-4" /> Arsip Gerakan
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
        <Camera className="h-5 w-5" /> {skeleton ? 'Kerangka tangan aktif' : 'Tampilkan kerangka tangan'}
      </button>
      {skeleton && (
        <p role="status" className="mt-2 text-sm font-semibold text-ink-soft">
          {state === 'loading' && 'Memuat model pelacak (diproses di perangkatmu)...'}
          {state === 'searching' && 'Mencari tangan pada klip. Jika tangan tidak utuh atau tertutup uap, kerangka tidak muncul.'}
          {state === 'found' && 'Tangan terdeteksi. Kerangka digambar langsung di perangkatmu; video tidak dikirim ke mana pun.'}
          {state === 'error' && 'Model pelacak tidak bisa dimuat.'}
        </p>
      )}

      <h2 className="mt-5 flex items-center gap-2 text-xl text-deep-forest">
        <Film className="h-5 w-5 text-caramel-dark" /> Yang terlihat
      </h2>
      <p className="mt-1 text-base leading-relaxed text-charcoal">{g.see}</p>
      <h2 className="mt-4 text-xl text-deep-forest">Mengapa penting</h2>
      <p className="mt-1 text-base leading-relaxed text-charcoal">{g.why}</p>

      <Ornate className="mt-4 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Catatan mentor</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">Belum ada anotasi. Mentor akan menandai teknik pada klip ini, lalu kurator menyetujui sebelum tampil sebagai materi.</p>
      </Ornate>

      {g.practice && (
        <Link to={BAB_PRAKTIK} className="mt-4 flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
          <Hand className="h-5 w-5" /> Latih gerakan ini
        </Link>
      )}
      <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
        <Nira mood="happy" size={44} float={false} />
        Rekaman lapangan tim NIRA KITA.
      </div>
    </div>
  );
};
