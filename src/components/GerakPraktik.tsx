import React from 'react';
import { Camera, CameraOff, Check, Hand, Lock, ShieldCheck, Square, ThumbsUp } from 'lucide-react';
import { Nira } from '../art/Nira';
import { getPraktik, Task } from '../data/praktik';
import { t } from '../i18n';
import { classifyPose, HAND_CONNECTIONS, loadHandLandmarker, PourTracker, rollDeg, StirTracker } from '../lib/hand';
import type { Pose } from '../lib/hand';

const HOLD_MS = 1100;

const poseLabel = (p: string): string | undefined =>
  ({ fist: t('Genggam', 'Fist'), open: t('Telapak terbuka', 'Open palm'), pinch: t('Jepit', 'Pinch'), point: t('Telunjuk', 'Point'), thumbsUp: t('Jempol ke atas', 'Thumbs up') } as Record<string, string>)[p];

type Phase = 'intro' | 'loading' | 'play' | 'error' | 'done';

/**
 * Praktik gerak di dalam bab: tugas dari data/praktik.ts, dikenali lewat kamera (di perangkat)
 * atau dijalankan dengan ketukan bila kamera tidak dipakai. Bukan penilaian teknik.
 */
export const GerakPraktik: React.FC<{ slug: string; onDone: (correct: number, total: number) => void }> = ({ slug, onDone }) => {
  const cfg = getPraktik(slug);
  const tasks = cfg?.tasks ?? [];
  const [phase, setPhase] = React.useState<Phase>('intro');
  const [tapMode, setTapMode] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [stage, setStage] = React.useState<'do' | 'why'>('do');
  const [verdict, setVerdict] = React.useState<null | boolean>(null);
  const [progress, setProgress] = React.useState(0);
  const [handFound, setHandFound] = React.useState(false);
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
  const stir = React.useRef(new StirTracker());
  const pour = React.useRef(new PourTracker());
  const correct = React.useRef(0);

  const task: Task | undefined = tasks[Math.min(idx, tasks.length - 1)];

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
    setProgress(0);
  };

  const completeTask = React.useCallback((ok: boolean | null) => {
    if (ok === true) correct.current += 1;
    setVerdict(ok);
    stageRef.current = 'why';
    setStage('why');
    setProgress(0);
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
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error(t('Peramban ini tidak mendukung kamera.', 'This browser does not support the camera.'));
      const [lm, stream] = await Promise.all([
        loadHandLandmarker(),
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }),
      ]);
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      idxRef.current = 0;
      stageRef.current = 'do';
      correct.current = 0;
      setIdx(0);
      setStage('do');
      setVerdict(null);
      setTapMode(false);
      resetTrackers();
      setPhase('play');

      const loop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;
        if (video.readyState >= 2) {
          const now = performance.now();
          const res = lm.detectForVideo(video, now);
          const hand = res.landmarks?.[0];
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
                setProgress(pr);
                if (pr >= 1) completeTask(null);
              } else {
                holdStart.current = null;
                setProgress(0);
              }
            } else if (t.kind === 'stir') {
              active = true;
              stir.current.push(now, hand[0].x, hand[0].y);
              const pr = Math.min(1, stir.current.laps / t.laps);
              setProgress(pr);
              if (pr >= 1) completeTask(null);
            } else if (t.kind === 'pour') {
              if (pose === 'fist' || pose === 'thumbsUp') {
                active = true;
                pour.current.push(rollDeg(hand));
              }
              const pr = Math.min(1, (pour.current.count + (pour.current.isTilted ? 0.5 : 0)) / t.times);
              setProgress(pr);
              if (pour.current.count >= t.times) completeTask(null);
            } else if (t.kind === 'judge') {
              const choice = pose === 'thumbsUp' ? 'aman' : pose === 'open' ? 'bahaya' : '';
              active = !!choice;
              if (choice) {
                if (holdPose.current !== choice) {
                  holdPose.current = choice;
                  holdStart.current = now;
                }
                const pr = Math.min(1, (now - (holdStart.current ?? now)) / HOLD_MS);
                setProgress(pr);
                if (pr >= 1) completeTask(choice === t.answer);
              } else {
                holdPose.current = '';
                holdStart.current = null;
                setProgress(0);
              }
            }
          } else if (!hand) {
            holdStart.current = null;
            setProgress(0);
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
    idxRef.current = 0;
    stageRef.current = 'do';
    correct.current = 0;
    setIdx(0);
    setStage('do');
    setVerdict(null);
    setTapMode(true);
    setPhase('play');
  };

  const stopAll = () => {
    stopCamera();
    setPhase('intro');
  };

  if (!cfg || !task) return null;

  const hintText = task.kind === 'judge' ? task.scenario : task.hint;
  const wantLabel = task.kind === 'pose' ? poseLabel(task.pose) : task.kind === 'stir' ? t(`${task.laps} putaran melingkar`, `${task.laps} circular rounds`) : task.kind === 'pour' ? t(`Miring dan tegak ${task.times} kali`, `Tilt and straighten ${task.times} times`) : t('Jempol ke atas (aman) atau telapak terbuka (bahaya)', 'Thumbs up (safe) or open palm (unsafe)');

  return (
    <div>
      {/* video selalu di DOM agar kamera bisa dipasang */}
      <div className={phase === 'play' && !tapMode ? 'mt-1' : 'hidden'}>
        <div className="relative overflow-hidden rounded-2xl bg-deep-forest">
          <video ref={videoRef} playsInline muted className="block w-full -scale-x-100" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />
          <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-deep-forest/85 px-3 py-1.5 text-xs font-bold text-coconut">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E0523A]" /> {t('Kamera aktif · diproses di perangkat', 'Camera on · processed on the device')}
          </div>
          {!handFound && <div className="absolute inset-x-3 bottom-3 rounded-xl bg-coconut/90 px-3 py-2 text-center text-sm font-semibold text-deep-forest">{t('Tunjukkan satu tanganmu ke kamera', 'Show one hand to the camera')}</div>}
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
          <p className="mt-2 text-base font-semibold text-deep-forest">{t('Menyiapkan kamera dan model...', 'Preparing the camera and model...')}</p>
          <p className="text-sm text-ink-soft">{t('Izinkan kamera saat diminta.', 'Allow the camera when asked.')}</p>
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

      {phase === 'play' && (
        <div className="mt-3 rounded-2xl bg-coconut p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
              {t('Gerakan', 'Movement')} {Math.min(idx + 1, tasks.length)} {t('dari', 'of')} {tasks.length}
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
              <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-caramel-dark">
                <Hand className="h-4 w-4" /> {wantLabel}
              </p>
              {!tapMode && (
                <>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-bamboo/60" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={t('Kemajuan gerakan', 'Movement progress')}>
                    <div className="h-full rounded-full bg-forest" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <p role="status" className="mt-2 min-h-[24px] text-sm font-semibold text-ink-soft">
                    {!handFound ? t('Belum ada tangan terlihat.', 'No hand visible yet.') : progress > 0 ? t('Bagus, lanjutkan...', 'Good, keep going...') : `${t('Terdeteksi', 'Detected')}: ${poseLabel(seen) ?? t('tangan', 'hand')}`}
                  </p>
                </>
              )}
              {tapMode && task.kind === 'judge' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => completeTask(task.answer === 'aman')} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-coconut">
                    <ThumbsUp className="h-5 w-5" /> {t('Aman / boleh', 'Safe / allowed')}
                  </button>
                  <button type="button" onClick={() => completeTask(task.answer === 'bahaya')} className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#9E4F37] text-base font-semibold text-coconut">
                    <Hand className="h-5 w-5" /> {t('Bahaya / tidak', 'Unsafe / not allowed')}
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
                  <Check className="h-5 w-5" /> {t('Gerakan berhasil', 'Movement done')}
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
              <button type="button" onClick={next} className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                {idx + 1 >= tasks.length ? t('Selesai', 'Finish') : t('Gerakan berikutnya', 'Next movement')}
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
          <p className="mt-2 text-xl font-semibold text-deep-forest">{t('Praktik gerak selesai', 'Movement practice complete')}</p>
          <p className="mt-1 text-sm text-ink-soft">{t('Kamera sudah dimatikan. Teknik sesungguhnya tetap divalidasi oleh mentor.', 'The camera is off. Real technique is still validated by a mentor.')}</p>
          <button type="button" onClick={() => setPhase('intro')} className="mt-2 inline-flex min-h-[44px] items-center rounded-full border-2 border-bamboo px-5 text-sm font-semibold text-deep-forest">
            {t('Ulangi', 'Repeat')}
          </button>
        </div>
      )}
    </div>
  );
};
