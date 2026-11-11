import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, CameraOff, Check, Lock, ShieldCheck, Square } from 'lucide-react';
import { Nira } from '../art/Nira';
import { classifyPose, HAND_CONNECTIONS, loadHandLandmarker, Pose } from '../lib/hand';
import { useStore } from '../store';

/**
 * Cermin Gerak: latihan bentuk tangan lewat kamera. Model berjalan di perangkat (peramban);
 * tidak ada video yang dikirim atau disimpan. Ini alat bantu belajar, bukan penilaian teknik.
 */

const TARGETS: { pose: Exclude<Pose, 'none'>; title: string; hint: string; emoji: string }[] = [
  { pose: 'fist', title: 'Genggam', hint: 'Seperti memegang gagang pengaduk kayu.', emoji: '✊' },
  { pose: 'open', title: 'Buka telapak', hint: 'Tangan terbuka dan rileks, siap meraih alat.', emoji: '🖐️' },
  { pose: 'pinch', title: 'Jepit', hint: 'Temukan ujung jempol dan telunjuk, tiga jari lain tetap lurus.', emoji: '👌' },
];
const HOLD_MS = 1200;

type Phase = 'intro' | 'loading' | 'play' | 'done' | 'error';

export const Gerak: React.FC = () => {
  const { completeLab, labDone, showToast } = useStore();
  const [phase, setPhase] = React.useState<Phase>('intro');
  const [error, setError] = React.useState('');
  const [round, setRound] = React.useState(0);
  const [seen, setSeen] = React.useState<Pose>('none');
  const [progress, setProgress] = React.useState(0);
  const [handFound, setHandFound] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const raf = React.useRef(0);
  const holdStart = React.useRef<number | null>(null);
  const roundRef = React.useRef(0);
  const startedAt = React.useRef(0);

  const stopCamera = React.useCallback(() => {
    cancelAnimationFrame(raf.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  // Pastikan kamera mati saat meninggalkan halaman.
  React.useEffect(() => stopCamera, [stopCamera]);

  const finish = React.useCallback(() => {
    stopCamera();
    setPhase('done');
    if (!labDone.includes('cermin-gerak')) {
      completeLab('cermin-gerak', 40);
      showToast('+40 XP dari Cermin Gerak');
    }
  }, [completeLab, labDone, showToast, stopCamera]);

  const start = async () => {
    setPhase('loading');
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Peramban ini tidak mendukung kamera.');
      const [lm, stream] = await Promise.all([
        loadHandLandmarker(),
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }),
      ]);
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      roundRef.current = 0;
      setRound(0);
      holdStart.current = null;
      startedAt.current = Date.now();
      setPhase('play');

      const loop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;
        if (video.readyState >= 2) {
          const res = lm.detectForVideo(video, performance.now());
          const hand = res.landmarks?.[0];
          const ctx = canvas.getContext('2d')!;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const pose = classifyPose(hand);
          setHandFound(!!hand);
          setSeen((p) => (p === pose ? p : pose));
          if (hand) {
            const target = TARGETS[roundRef.current]?.pose;
            const ok = pose === target;
            ctx.lineWidth = 4;
            ctx.strokeStyle = ok ? '#8FD05E' : '#FFFDF8';
            ctx.beginPath();
            HAND_CONNECTIONS.forEach(([a, b]) => {
              ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
              ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            });
            ctx.stroke();
            ctx.fillStyle = ok ? '#4C9B45' : '#B87943';
            hand.forEach((p) => {
              ctx.beginPath();
              ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2);
              ctx.fill();
            });
            if (ok) {
              holdStart.current = holdStart.current ?? performance.now();
              const pr = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS);
              setProgress(pr);
              if (pr >= 1) {
                holdStart.current = null;
                setProgress(0);
                roundRef.current += 1;
                setRound(roundRef.current);
                if (roundRef.current >= TARGETS.length) {
                  finish();
                  return;
                }
              }
            } else {
              holdStart.current = null;
              setProgress(0);
            }
          } else {
            holdStart.current = null;
            setProgress(0);
          }
        }
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    } catch (e) {
      stopCamera();
      const msg = e instanceof Error ? e.message : String(e);
      setError(/denied|NotAllowed|Permission/i.test(msg) ? 'Izin kamera ditolak. Kamu bisa mengizinkannya di pengaturan peramban, atau lewati latihan ini.' : `Kamera atau model tidak bisa dimuat. ${msg}`);
      setPhase('error');
    }
  };

  const stop = () => {
    stopCamera();
    setPhase('intro');
  };
  const target = TARGETS[Math.min(round, TARGETS.length - 1)];
  const secs = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));

  return (
    <div className="px-5 pb-8 pt-4">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest" onClick={stopCamera}>
        <ArrowLeft className="h-4 w-4" /> Perjalanan
      </Link>
      <h1 className="text-[28px] leading-tight text-deep-forest">Cermin Gerak</h1>
      <p className="text-sm text-ink-soft">Latihan bentuk tangan dengan kamera</p>

      {/* video selalu ada di DOM supaya bisa dipasang kameranya; disembunyikan di luar fase main */}
      <div className={phase === 'play' ? 'mt-3' : 'hidden'}>
        <div className="relative overflow-hidden rounded-2xl bg-deep-forest">
          <video ref={videoRef} playsInline muted className="block w-full -scale-x-100" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />
          <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-deep-forest/85 px-3 py-1.5 text-xs font-bold text-coconut">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E0523A]" /> Kamera aktif · diproses di perangkat
          </div>
          {!handFound && <div className="absolute inset-x-3 bottom-3 rounded-xl bg-coconut/90 px-3 py-2 text-center text-sm font-semibold text-deep-forest">Tunjukkan satu tanganmu ke kamera</div>}
        </div>
        <div className="mt-3 rounded-2xl bg-coconut p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
            Gerakan {Math.min(round + 1, TARGETS.length)} dari {TARGETS.length}
          </p>
          <p className="mt-1 text-2xl text-deep-forest">
            <span aria-hidden>{target.emoji}</span> {target.title}
          </p>
          <p className="mt-1 text-base leading-relaxed text-charcoal">{target.hint}</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-bamboo/60" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Tahan bentuk tangan">
            <div className="h-full rounded-full bg-forest" style={{ width: `${progress * 100}%` }} />
          </div>
          <p role="status" className="mt-2 min-h-[24px] text-sm font-semibold text-ink-soft">
            {!handFound ? 'Belum ada tangan terlihat.' : seen === target.pose ? 'Bagus, tahan sebentar...' : 'Tangan terlihat. Bentuk sesuai contoh di atas.'}
          </p>
        </div>
        <button type="button" onClick={stop} className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
          <Square className="h-4 w-4" /> Matikan kamera
        </button>
      </div>

      {phase === 'intro' && (
        <div className="mt-4">
          <div className="text-center">
            <Nira mood="wave" size={96} className="mx-auto" />
            <p className="mt-2 text-base leading-relaxed text-charcoal">
              Pengetahuan perajin ada di tangan mereka. Di sini kamu berlatih tiga bentuk tangan dengan kamera, dan layar menggambar kerangka tanganmu secara langsung.
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            <li className="flex gap-3 rounded-2xl bg-coconut p-3 text-sm leading-relaxed text-charcoal">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
              <span>
                <b>Tetap di perangkatmu.</b> Pelacakan berjalan di dalam peramban. Tidak ada video yang dikirim ke server dan tidak ada yang disimpan.
              </span>
            </li>
            <li className="flex gap-3 rounded-2xl bg-coconut p-3 text-sm leading-relaxed text-charcoal">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
              <span>
                <b>Alat bantu belajar, bukan penilai.</b> Aplikasi hanya mengenali bentuk tangan. Teknik sesungguhnya divalidasi oleh mentor manusia di lapangan.
              </span>
            </li>
          </ul>
          <button type="button" onClick={start} className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-forest text-lg font-semibold text-coconut">
            <Camera className="h-5 w-5" /> Nyalakan kamera
          </button>
          <Link to="/learn" className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-full text-base font-semibold text-ink-soft">
            Lewati, tanpa kamera
          </Link>
          <p className="mt-2 text-center text-xs text-ink-soft">Model pelacak (±7,8 MB) dimuat sekali saat pertama kali dipakai.</p>
        </div>
      )}

      {phase === 'loading' && (
        <div className="mt-8 text-center" role="status">
          <Nira mood="think" size={96} className="mx-auto" />
          <p className="mt-3 text-base font-semibold text-deep-forest">Menyiapkan kamera dan model pelacak...</p>
          <p className="mt-1 text-sm text-ink-soft">Izinkan kamera saat diminta. Pertama kali bisa beberapa detik.</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="mt-6 text-center">
          <CameraOff className="mx-auto h-10 w-10 text-[#9E4F37]" />
          <p role="alert" className="mt-2 text-base leading-relaxed text-charcoal">{error}</p>
          <button type="button" onClick={start} className="mt-4 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
            Coba lagi
          </button>
          <Link to="/learn" className="mt-2 flex min-h-[52px] w-full items-center justify-center text-base font-semibold text-ink-soft">
            Kembali
          </Link>
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-6 text-center">
          <Nira mood="cheer" size={110} className="mx-auto" />
          <h2 className="mt-2 text-2xl text-deep-forest">Tiga gerakan selesai!</h2>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-base font-semibold text-forest">
            <Check className="h-5 w-5" /> Dalam sekitar {secs} detik
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">Kamera sudah dimatikan. Latihan ini hanya mengenali bentuk tangan; penilaian teknik tetap oleh mentor.</p>
          <button type="button" onClick={start} className="mt-4 min-h-[52px] w-full rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
            Main lagi
          </button>
          <Link to="/learn" className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-full bg-forest text-base font-semibold text-coconut">
            Kembali ke perjalanan
          </Link>
        </div>
      )}
    </div>
  );
};
