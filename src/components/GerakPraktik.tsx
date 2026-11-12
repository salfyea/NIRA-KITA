import React from 'react';
import { Box, Camera, CameraOff, Check, EyeOff, Hand, Lock, ShieldCheck, Square, TriangleAlert } from 'lucide-react';
import { Nira } from '../art/Nira';
import { getPraktik, Task } from '../data/praktik';
import type { Live } from './Alat3D';
import { IramaPanel } from './IramaPanel';
import { RhythmMeter } from '../lib/irama';
import type { Rhythm } from '../lib/irama';
import { useStore } from '../store';
import { t } from '../i18n';
import { classifyPose, HAND_CONNECTIONS, loadHandLandmarker, PourTracker, prefetchHandAssets, rollDeg, StirTracker } from '../lib/hand';
import type { Pose } from '../lib/hand';

const HOLD_MS = 1100;

const poseLabel = (p: string): string | undefined =>
  ({ fist: t('Genggam', 'Fist'), open: t('Telapak terbuka', 'Open palm'), pinch: t('Jepit', 'Pinch'), point: t('Telunjuk', 'Point'), thumbsUp: t('Jempol ke atas', 'Thumbs up') } as Record<string, string>)[p];

const Alat3D = React.lazy(() => import('./Alat3D'));
const ARLayer = React.lazy(() => import('./ARLayer'));

/** Gerakan yang alatnya menempel di tangan pada gambar kamera (AR). */
const AR_TASKS = ['pegang-pongkor', 'tuang', 'jepit-kotoran', 'aduk', 'aduk-tetap'];

type Phase = 'intro' | 'loading' | 'play' | 'error' | 'done';

/**
 * Praktik gerak di dalam bab: tugas dari data/praktik.ts, dikenali lewat kamera (di perangkat)
 * atau dijalankan dengan ketukan bila kamera tidak dipakai. Bukan penilaian teknik.
 */
export const GerakPraktik: React.FC<{ slug: string; onDone: (correct: number, total: number) => void; startTask?: string }> = ({ slug, onDone, startTask }) => {
  const cfg = getPraktik(slug);
  const tasks = cfg?.tasks ?? [];
  const [phase, setPhase] = React.useState<Phase>('intro');
  const [tapMode, setTapMode] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [stage, setStage] = React.useState<'do' | 'why'>('do');
  const [verdict, setVerdict] = React.useState<null | boolean>(null);
  const [progress, setProgress] = React.useState(0);
  const [handFound, setHandFound] = React.useState(false);
  const [show3d, setShow3d] = React.useState(true);
  const [modelReady, setModelReady] = React.useState(false);
  const [rhythm, setRhythm] = React.useState<Rhythm | null>(null);
  const meter = React.useRef(new RhythmMeter());
  const rhythmAt = React.useRef(0);
  const lastRhythm = React.useRef<Rhythm | null>(null);
  const steadyMs = React.useRef(0);
  const steadyLast = React.useRef(0);
  const { annotations } = useStore();
  const refNote = annotations['irama-aduk'];
  const refRhythm = refNote?.approved ? refNote.rhythm : undefined;
  const [seen, setSeen] = React.useState<Pose>('none');
  const [error, setError] = React.useState('');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const raf = React.useRef(0);
  const idxRef = React.useRef(0);
  const stageRef = React.useRef<'do' | 'why'>('do');
  const holdStart = React.useRef<number | null>(null);
  const holdPose = React.useRef<string>('');
  const live = React.useRef<Live>({ ts: 0, roll: 0, stir: 0, progress: 0, done: false, lm: null });
  const setPr = (v: number) => {
    live.current.progress = v;
    setProgress(v);
  };
  const stir = React.useRef(new StirTracker());
  const pour = React.useRef(new PourTracker());
  const correct = React.useRef(0);

  const task: Task | undefined = tasks[Math.min(idx, tasks.length - 1)];

  // Pelacak dimuat di latar belakang begitu kartu praktik terlihat, supaya kamera siap lebih cepat.
  const introRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = introRef.current;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (!el || conn?.saveData || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          prefetchHandAssets();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stopCamera = React.useCallback(() => {
    cancelAnimationFrame(raf.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);
  React.useEffect(() => stopCamera, [stopCamera]);

  const resetTrackers = () => {
    stir.current.reset();
    pour.current.reset();
    holdStart.current = null;
    holdPose.current = '';
    live.current.done = false;
    live.current.stir = 0;
    meter.current.reset();
    steadyMs.current = 0;
    steadyLast.current = 0;
    lastRhythm.current = null;
    setRhythm(null);
    setPr(0);
  };

  const completeTask = React.useCallback((ok: boolean | null) => {
    live.current.done = true;
    if (ok === true) correct.current += 1;
    setVerdict(ok);
    stageRef.current = 'why';
    setStage('why');
    setPr(0);
  }, []);

  const next = () => {
    const n = idxRef.current + 1;
    if (n >= tasks.length) {
      stopCamera();
      setPhase('done');
      onDone(correct.current, tasks.filter((t) => t.kind === 'judge').length || tasks.length);
      return;
    }
    idxRef.current = n;
    stageRef.current = 'do';
    setIdx(n);
    setStage('do');
    setVerdict(null);
    resetTrackers();
  };

  const startCamera = async () => {
    setPhase('loading');
    setError('');
    setModelReady(false);
    // Unduhan berkas model berjalan selama pelajar memberi izin (tidak memblokir). Inisialisasi model
    // (berat, memblokir thread) baru dimulai setelah kamera tampil di layar.
    prefetchHandAssets();
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error(t('Peramban ini tidak mendukung kamera.', 'This browser does not support the camera.'));
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      const first = Math.max(0, tasks.findIndex((x) => x.id === startTask));
      idxRef.current = first;
      stageRef.current = 'do';
      correct.current = 0;
      setIdx(first);
      setStage('do');
      setVerdict(null);
      setTapMode(false);
      resetTrackers();
      setPhase('play');

      // beri peramban kesempatan menggambar kamera sebelum inisialisasi model yang berat
      await new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 50)));
      const lm = await loadHandLandmarker();
      if (!streamRef.current) return; // dimatikan saat model dimuat
      setModelReady(true);

      const loop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;
        if (video.readyState >= 2) {
          const now = performance.now();
          const res = lm.detectForVideo(video, now);
          const hand = res.landmarks?.[0];
          live.current.lm = hand ?? null;
          if (hand) {
            live.current.ts = now;
            live.current.roll = rollDeg(hand);
          }
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const pose = classifyPose(hand);
          setHandFound(!!hand);
          setSeen((p) => (p === pose ? p : pose));
          const t = tasks[idxRef.current];
          let active = false;
          if (hand && t && stageRef.current === 'do') {
            if (t.kind === 'pose') {
              active = pose === t.pose;
              if (active) {
                holdStart.current = holdStart.current ?? now;
                const pr = Math.min(1, (now - holdStart.current) / HOLD_MS);
                setPr(pr);
                if (pr >= 1) completeTask(null);
              } else {
                holdStart.current = null;
                setPr(0);
              }
            } else if (t.kind === 'stir' || t.kind === 'steady') {
              active = true;
              stir.current.push(now, hand[0].x, hand[0].y);
              live.current.stir = stir.current.angle;
              meter.current.push(now, ((hand[0].x + hand[9].x) / 2) * canvas.width, ((hand[0].y + hand[9].y) / 2) * canvas.height);
              if (now - rhythmAt.current > 400) {
                rhythmAt.current = now;
                const rr = meter.current.read();
                if (rr) lastRhythm.current = rr;
                setRhythm(rr);
              }
              let pr: number;
              if (t.kind === 'steady') {
                // Waktu terkumpul hanya saat irama teratur (>= 50%); kehilangan irama menahan kemajuan.
                const dt = steadyLast.current ? Math.min(250, now - steadyLast.current) : 0;
                steadyLast.current = now;
                const ok = !!lastRhythm.current && lastRhythm.current.regularity >= 0.5 && now - rhythmAt.current < 1200;
                steadyMs.current = ok ? steadyMs.current + dt : Math.max(0, steadyMs.current - dt * 0.5);
                pr = Math.min(1, steadyMs.current / (t.seconds * 1000));
              } else {
                pr = Math.min(1, stir.current.laps / t.laps);
              }
              setPr(pr);
              if (pr >= 1) completeTask(null);
            } else if (t.kind === 'pour') {
              if (pose === 'fist' || pose === 'thumbsUp') {
                active = true;
                pour.current.push(rollDeg(hand));
              }
              const pr = Math.min(1, (pour.current.count + (pour.current.isTilted ? 0.5 : 0)) / t.times);
              setPr(pr);
              if (pour.current.count >= t.times) completeTask(null);
            }
          } else if (!hand) {
            holdStart.current = null;
            setPr(0);
          }
          if (hand) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = active ? '#8FD05E' : '#FFFDF8';
            ctx.beginPath();
            HAND_CONNECTIONS.forEach(([a, b]) => {
              ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
              ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            });
            ctx.stroke();
            ctx.fillStyle = active ? '#4C9B45' : '#B87943';
            hand.forEach((p) => {
              ctx.beginPath();
              ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    } catch (e) {
      stopCamera();
      const msg = e instanceof Error ? e.message : String(e);
      setError(/denied|NotAllowed|Permission/i.test(msg) ? t('Izin kamera ditolak. Kamu bisa mengizinkannya di pengaturan peramban, atau lanjut tanpa kamera.', 'Camera permission was denied. You can allow it in the browser settings, or continue without the camera.') : `${t('Kamera atau model tidak bisa dimuat.', 'The camera or model could not be loaded.')} ${msg}`);
      setPhase('error');
    }
  };

  const startTap = () => {
    const first = Math.max(0, tasks.findIndex((x) => x.id === startTask));
    idxRef.current = first;
    stageRef.current = 'do';
    correct.current = 0;
    setIdx(first);
    setStage('do');
    setVerdict(null);
    setTapMode(true);
    setPhase('play');
  };

  // Kartu skenario tidak memakai kamera: langsung ke keputusan, tanpa layar pilih kamera.
  const scenarioMode = cfg?.mode === 'skenario';
  React.useEffect(() => {
    if (scenarioMode && phase === 'intro') startTap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioMode]);

  const stopAll = () => {
    stopCamera();
    setPhase('intro');
  };

  if (!cfg || !task) return null;

  const prop3d = task.prop;
  const arTask = !tapMode && !!prop3d && AR_TASKS.includes(task.id);
  const scenario = cfg.mode === 'skenario';
  const hintText = task.kind === 'judge' ? task.scenario : task.hint;
  const wantLabel = task.kind === 'pose' ? poseLabel(task.pose) : task.kind === 'steady' ? t(`Irama tetap ${task.seconds} detik`, `Steady rhythm for ${task.seconds} seconds`) : task.kind === 'stir' ? t(`${task.laps} putaran melingkar`, `${task.laps} circular rounds`) : task.kind === 'pour' ? t(`Miring dan tegak ${task.times} kali`, `Tilt and straighten ${task.times} times`) : '';

  return (
    <div ref={introRef}>
      {/* video selalu di DOM agar kamera bisa dipasang */}
      <div className={phase === 'play' && !tapMode ? 'mt-1' : 'hidden'}>
        <div className="relative overflow-hidden rounded-2xl bg-deep-forest">
          <video ref={videoRef} playsInline muted className="block w-full -scale-x-100" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />
          {arTask && show3d && prop3d && (
            <React.Suspense fallback={null}>
              <ARLayer prop={prop3d} live={live} className="pointer-events-none absolute inset-0 -scale-x-100" />
            </React.Suspense>
          )}
          {arTask && (
            <button type="button" aria-label={show3d ? t('Sembunyikan alat', 'Hide the tool') : t('Tampilkan alat', 'Show the tool')} onClick={() => setShow3d((v) => !v)} className="absolute right-2 top-2 flex min-h-[44px] items-center gap-1.5 rounded-full bg-deep-forest/85 px-3 text-xs font-bold text-coconut">
              {show3d ? <EyeOff className="h-4 w-4" /> : <Box className="h-4 w-4" />} {t('Alat', 'Tool')}
            </button>
          )}
          <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-deep-forest/85 px-3 py-1.5 text-xs font-bold text-coconut">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E0523A]" /> {t('Kamera aktif · di perangkat', 'Camera on · on device')}
          </div>
          {!modelReady ? (
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl bg-coconut/90 px-3 py-2 text-center text-sm font-semibold text-deep-forest">
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-forest border-t-transparent" />
              {t('Menyiapkan pelacak tangan (sekali saja)...', 'Preparing the hand tracker (one time)...')}
            </div>
          ) : (
            !handFound && <div className="absolute inset-x-3 bottom-3 rounded-xl bg-coconut/90 px-3 py-2 text-center text-sm font-semibold text-deep-forest">{t('Tunjukkan satu tanganmu ke kamera', 'Show one hand to the camera')}</div>
          )}
        </div>
      </div>

      {phase === 'intro' && (
        <div className="text-center">
          <Nira mood="wave" size={84} className="mx-auto" />
          <p className="mt-2 text-base leading-relaxed text-charcoal">{cfg.intro}</p>
          <ul className="mt-3 space-y-2 text-left">
            <li className="flex gap-3 rounded-2xl bg-coconut p-3 text-sm leading-relaxed text-charcoal">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
              <span>
                <b>{t('Tetap di perangkatmu.', 'Stays on your device.')}</b> {t('Pelacakan berjalan di peramban. Tidak ada video yang dikirim atau disimpan.', 'Tracking runs in the browser. No video is sent or stored.')}
              </span>
            </li>
            <li className="flex gap-3 rounded-2xl bg-coconut p-3 text-sm leading-relaxed text-charcoal">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
              <span>
                <b>{t('Alat bantu belajar, bukan penilai.', 'A learning aid, not a grader.')}</b> {t('Teknik sesungguhnya divalidasi mentor manusia.', 'Real technique is validated by a human mentor.')}
              </span>
            </li>
          </ul>
          <button type="button" onClick={startCamera} className="mt-3 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-forest text-lg font-semibold text-coconut">
            <Camera className="h-5 w-5" /> {t('Nyalakan kamera', 'Turn on camera')}
          </button>
          <button type="button" onClick={startTap} className="mt-1 min-h-[52px] w-full rounded-full text-base font-semibold text-ink-soft">
            {t('Tanpa kamera (jawab dengan ketukan)', 'No camera (answer by tapping)')}
          </button>
          <p className="text-xs text-ink-soft">{t('Model pelacak (±7,8 MB) dimuat sekali.', 'The tracking model (~7.8 MB) loads once.')}</p>
        </div>
      )}

      {phase === 'loading' && (
        <div className="py-6 text-center" role="status">
          <Nira mood="think" size={84} className="mx-auto" />
          <p className="mt-2 text-base font-semibold text-deep-forest">{t('Menunggu izin kamera...', 'Waiting for camera permission...')}</p>
          <p className="text-sm text-ink-soft">{t('Ketuk Izinkan pada jendela peramban. Kamera tampil begitu diizinkan.', 'Tap Allow in the browser prompt. The camera appears as soon as it is allowed.')}</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="text-center">
          <CameraOff className="mx-auto h-9 w-9 text-[#9E4F37]" />
          <p role="alert" className="mt-2 text-base leading-relaxed text-charcoal">{error}</p>
          <button type="button" onClick={startCamera} className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
            {t('Coba lagi', 'Try again')}
          </button>
          <button type="button" onClick={startTap} className="mt-1 min-h-[52px] w-full rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
            {t('Lanjut tanpa kamera', 'Continue without camera')}
          </button>
        </div>
      )}

      {phase === 'play' && prop3d && !arTask && (
        show3d ? (
          <div className={`relative mt-2 overflow-hidden rounded-2xl border border-bamboo ${tapMode ? 'h-56' : 'h-44'}`}>
            <React.Suspense fallback={<div className="flex h-full items-center justify-center bg-bamboo/30 text-sm text-ink-soft">{t('Memuat alat 3D...', 'Loading the 3D tool...')}</div>}>
              <Alat3D prop={prop3d} live={live} caption={tapMode} className="h-full w-full" />
            </React.Suspense>
            <button type="button" onClick={() => setShow3d(false)} className="absolute right-1.5 top-1.5 flex min-h-[44px] items-center gap-1.5 rounded-full bg-deep-forest/80 px-3 text-xs font-bold text-coconut">
              <EyeOff className="h-4 w-4" /> {t('Sembunyikan', 'Hide')}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setShow3d(true)} className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-bamboo text-sm font-semibold text-deep-forest">
            <Box className="h-4 w-4" /> {t('Tampilkan alat 3D', 'Show the 3D tool')}
          </button>
        )
      )}

      {phase === 'play' && (
        <div className="mt-3 rounded-2xl bg-coconut p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
              {scenario ? t('Situasi', 'Situation') : t('Gerakan', 'Movement')} {Math.min(idx + 1, tasks.length)} {t('dari', 'of')} {tasks.length}
            </p>
            <div className="flex gap-1" aria-hidden>
              {tasks.map((_, i) => (
                <span key={i} className={`h-1.5 w-6 rounded-full ${i < idx || (i === idx && stage === 'why') ? 'bg-forest' : i === idx ? 'bg-caramel' : 'bg-bamboo'}`} />
              ))}
            </div>
          </div>
          <h3 className="mt-1 text-2xl text-deep-forest">{task.title}</h3>

          {stage === 'do' ? (
            <>
              <p className={`mt-1 text-base leading-relaxed ${task.kind === 'judge' ? 'rounded-xl bg-cream p-3 font-semibold text-deep-forest' : 'text-charcoal'}`}>{hintText}</p>
              {task.kind !== 'judge' && (
                <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-caramel-dark">
                  <Hand className="h-4 w-4" /> {wantLabel}
                </p>
              )}
              {!tapMode && (
                <>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-bamboo/60" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={t('Kemajuan gerakan', 'Movement progress')}>
                    <div className="h-full rounded-full bg-forest" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <p role="status" className="mt-2 min-h-[24px] text-sm font-semibold text-ink-soft">
                    {!modelReady ? t('Pelacak sedang disiapkan, kamera sudah aktif.', 'The tracker is getting ready; the camera is already on.') : !handFound ? t('Belum ada tangan terlihat.', 'No hand visible yet.') : progress > 0 ? t('Bagus, lanjutkan...', 'Good, keep going...') : `${t('Terdeteksi', 'Detected')}: ${poseLabel(seen) ?? t('tangan', 'hand')}`}
                  </p>
                </>
              )}
              {!tapMode && (task.kind === 'stir' || task.kind === 'steady') && <IramaPanel rhythm={rhythm} reference={refRhythm} moving={handFound} />}
              {tapMode && task.kind === 'judge' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => completeTask(task.answer === 'aman')} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-coconut">
                    <ShieldCheck className="h-5 w-5" /> {cfg.yesLabel ?? t('Aman / boleh', 'Safe / allowed')}
                  </button>
                  <button type="button" onClick={() => completeTask(task.answer === 'bahaya')} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#9E4F37] text-base font-semibold text-coconut">
                    <TriangleAlert className="h-5 w-5" /> {cfg.noLabel ?? t('Bahaya / tidak', 'Unsafe / not allowed')}
                  </button>
                </div>
              )}
              {tapMode && task.kind !== 'judge' && (
                <button type="button" onClick={() => completeTask(null)} className="mt-3 min-h-[56px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                  {t('Sudah kucoba', 'I tried it')}
                </button>
              )}
            </>
          ) : (
            <div className="mt-2">
              {verdict !== null && (
                <p className={`flex items-center gap-1.5 text-lg font-bold ${verdict ? 'text-forest' : 'text-[#9E4F37]'}`}>
                  {verdict ? <Check className="h-5 w-5" /> : <Square className="h-4 w-4" />} {verdict ? t('Tepat!', 'Correct!') : t('Belum tepat', 'Not quite')}
                </p>
              )}
              {verdict === null && (
                <p className="flex items-center gap-1.5 text-lg font-bold text-forest">
                  <Check className="h-5 w-5" /> {scenario ? t('Dijawab', 'Answered') : t('Gerakan berhasil', 'Movement done')}
                </p>
              )}
              <div className="ornate mt-2 p-3">
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <p className="text-xs font-bold uppercase tracking-wider text-forest">{t('Mengapa', 'Why')}</p>
                <p className="mt-1 text-base leading-relaxed text-charcoal">{task.why}</p>
              </div>
              {(task.kind === 'stir' || task.kind === 'steady') && !tapMode && lastRhythm.current && <IramaPanel rhythm={lastRhythm.current} reference={refRhythm} moving final />}
              <button type="button" onClick={next} className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                {idx + 1 >= tasks.length ? t('Selesai', 'Finish') : scenario ? t('Situasi berikutnya', 'Next situation') : t('Gerakan berikutnya', 'Next movement')}
              </button>
            </div>
          )}

          {!tapMode && (
            <button type="button" onClick={stopAll} className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-ink-soft">
              <Square className="h-3.5 w-3.5" /> {t('Matikan kamera', 'Turn off camera')}
            </button>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="py-2 text-center">
          <Nira mood="cheer" size={96} className="mx-auto" />
          <p className="mt-2 text-xl font-semibold text-deep-forest">{scenario ? t('Skenario selesai', 'Scenarios complete') : t('Praktik gerak selesai', 'Movement practice complete')}</p>
          <p className="mt-1 text-sm text-ink-soft">{scenario ? t('Keselamatan dan etika dipelajari lewat keputusan, bukan lewat kamera.', 'Safety and ethics are learned through decisions, not through the camera.') : t('Kamera sudah dimatikan. Teknik sesungguhnya tetap divalidasi oleh mentor.', 'The camera is off. Real technique is still validated by a mentor.')}</p>
          <button type="button" onClick={() => setPhase('intro')} className="mt-2 inline-flex min-h-[44px] items-center rounded-full border-2 border-bamboo px-5 text-sm font-semibold text-deep-forest">
            {t('Ulangi', 'Repeat')}
          </button>
        </div>
      )}
    </div>
  );
};
