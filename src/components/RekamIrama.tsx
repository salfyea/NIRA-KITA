import React from 'react';
import { Camera, CircleDot, RotateCcw } from 'lucide-react';
import { HAND_CONNECTIONS, loadHandLandmarker, prefetchHandAssets } from '../lib/hand';
import { analyzeRhythm, Rhythm, Sample } from '../lib/irama';
import { IramaPanel } from './IramaPanel';
import { t } from '../i18n';

const SECS = 10;

type Step = 'idle' | 'asking' | 'ready' | 'rec' | 'result' | 'error';

interface Result {
  rhythm: Rhythm | null;
  coverage: number;
}

/**
 * Perekam irama acuan untuk mentor: perajin mengaduk di depan kamera selama 10 detik, pelacak tangan mengukur
 * putaran per menit dan keteraturannya. Hasilnya dikirim ke kurator, dan baru jadi acuan bagi pelajar setelah disetujui.
 * Video tidak disimpan: hanya angka irama yang dikirim.
 */
export const RekamIrama: React.FC<{ onSave: (r: Rhythm) => void }> = ({ onSave }) => {
  const [step, setStep] = React.useState<Step>('idle');
  const [modelReady, setModelReady] = React.useState(false);
  const [left, setLeft] = React.useState(SECS);
  const [result, setResult] = React.useState<Result | null>(null);
  const [error, setError] = React.useState('');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const raf = React.useRef(0);
  const rec = React.useRef<{ on: boolean; start: number; samples: Sample[]; frames: number; withHand: number }>({ on: false, start: 0, samples: [], frames: 0, withHand: 0 });
  const finishRef = React.useRef<() => void>(() => undefined);

  const stop = React.useCallback(() => {
    cancelAnimationFrame(raf.current);
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);
  React.useEffect(() => stop, [stop]);

  const finish = React.useCallback(() => {
    const r = rec.current;
    r.on = false;
    stop();
    const coverage = r.frames ? r.withHand / r.frames : 0;
    setResult({ rhythm: coverage >= 0.5 ? analyzeRhythm(r.samples, 0.5) : null, coverage });
    setStep('result');
  }, [stop]);
  finishRef.current = finish;

  const start = async () => {
    setStep('asking');
    setError('');
    setModelReady(false);
    setResult(null);
    prefetchHandAssets();
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error(t('Peramban ini tidak mendukung kamera.', 'This browser does not support the camera.'));
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      setStep('ready');
      await new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 50)));
      const lm = await loadHandLandmarker();
      if (!streamRef.current) return;
      setModelReady(true);
      const loop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;
        if (video.readyState >= 2) {
          const now = performance.now();
          const hand = lm.detectForVideo(video, now).landmarks?.[0];
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const r = rec.current;
          if (r.on) {
            r.frames++;
            if (hand) {
              r.withHand++;
              r.samples.push({ t: now, x: ((hand[0].x + hand[9].x) / 2) * canvas.width, y: ((hand[0].y + hand[9].y) / 2) * canvas.height });
            }
            const secs = (now - r.start) / 1000;
            setLeft(Math.max(0, Math.ceil(SECS - secs)));
            if (secs >= SECS) {
              finishRef.current();
              return;
            }
          }
          if (hand) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = r.on ? '#E0523A' : '#8FD05E';
            ctx.beginPath();
            HAND_CONNECTIONS.forEach(([a, b]) => {
              ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
              ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            });
            ctx.stroke();
          }
        }
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    } catch (e) {
      stop();
      const msg = e instanceof Error ? e.message : String(e);
      setError(/denied|NotAllowed|Permission/i.test(msg) ? t('Izin kamera ditolak. Izinkan kamera di pengaturan peramban.', 'Camera permission was denied. Allow the camera in the browser settings.') : msg);
      setStep('error');
    }
  };

  const record = () => {
    rec.current = { on: true, start: performance.now(), samples: [], frames: 0, withHand: 0 };
    setLeft(SECS);
    setStep('rec');
  };

  const good = result?.rhythm && result.rhythm.regularity >= 0.5;

  return (
    <div className="mt-3 rounded-2xl border border-caramel/40 bg-coconut p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Irama acuan perajin', 'Artisan reference rhythm')}</p>
      <p className="mt-1 text-sm leading-relaxed text-charcoal">
        {t('Minta perajin mengaduk di depan kamera selama 10 detik, dengan tangan terlihat jelas. Kamera mengukur putaran per menit dan keteraturannya. Video tidak disimpan, hanya angkanya.', 'Ask the artisan to stir in front of the camera for 10 seconds with the hand clearly visible. The camera measures rounds per minute and steadiness. No video is stored, only the numbers.')}
      </p>

      <div className={step === 'ready' || step === 'rec' ? 'relative mt-2 overflow-hidden rounded-xl bg-deep-forest' : 'hidden'}>
        <video ref={videoRef} playsInline muted className="block w-full -scale-x-100" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />
        {step === 'rec' && (
          <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-[#E0523A] px-3 py-1.5 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> {t('Merekam', 'Recording')} · {left} {t('dtk', 's')}
          </div>
        )}
        {!modelReady && (
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 rounded-lg bg-coconut/90 px-2 py-1.5 text-xs font-semibold text-deep-forest">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-forest border-t-transparent" /> {t('Menyiapkan pelacak tangan...', 'Preparing the hand tracker...')}
          </div>
        )}
      </div>

      {step === 'idle' && (
        <button type="button" onClick={start} className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-caramel-dark text-base font-semibold text-coconut">
          <Camera className="h-5 w-5" /> {t('Nyalakan kamera', 'Turn on camera')}
        </button>
      )}
      {step === 'asking' && <p role="status" className="mt-3 text-sm font-semibold text-ink-soft">{t('Menunggu izin kamera...', 'Waiting for camera permission...')}</p>}
      {step === 'ready' && (
        <button type="button" disabled={!modelReady} onClick={record} className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#9E4F37] text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
          <CircleDot className="h-5 w-5" /> {modelReady ? t('Mulai rekam 10 detik', 'Start 10-second recording') : t('Tunggu pelacak siap', 'Wait for the tracker')}
        </button>
      )}
      {step === 'error' && (
        <div className="mt-3">
          <p role="alert" className="text-sm font-semibold text-[#9E4F37]">{error}</p>
          <button type="button" onClick={start} className="mt-2 min-h-[48px] w-full rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
            {t('Coba lagi', 'Try again')}
          </button>
        </div>
      )}

      {step === 'result' && result && (
        <div className="mt-3">
          <p className="text-xs text-ink-soft">
            {t('Tangan terlihat di', 'Hand visible in')} {Math.round(result.coverage * 100)}% {t('frame.', 'of frames.')}
          </p>
          {result.rhythm ? (
            <IramaPanel rhythm={result.rhythm} moving final />
          ) : (
            <p role="alert" className="mt-2 rounded-xl bg-[#9E4F37]/10 p-3 text-sm leading-relaxed text-[#7d3a25]">
              {result.coverage < 0.5
                ? t('Tangan terlalu sering tidak terlihat, jadi irama tidak bisa diukur. Dekatkan kamera, perbaiki cahaya, dan pastikan tangan tidak tertutup.', 'The hand was out of view too often, so the rhythm could not be measured. Move the camera closer, improve the light, and keep the hand uncovered.')
                : t('Tidak ada irama berulang yang jelas. Minta perajin mengaduk dengan tempo tetap, lalu ulangi.', 'No clear repeating rhythm. Ask the artisan to stir at a steady tempo, then try again.')}
            </p>
          )}
          {result.rhythm && !good && <p className="mt-2 text-xs text-[#9E4F37]">{t('Keteraturan di bawah 50%: ulangi sebelum dikirim, supaya acuannya andal.', 'Steadiness is below 50%: repeat before sending so the reference is reliable.')}</p>}
          <div className="mt-2 grid gap-2">
            {good && result.rhythm && (
              <button type="button" onClick={() => onSave(result.rhythm!)} className="min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                {t('Kirim ke kurator sebagai irama acuan', 'Send to the curator as the reference rhythm')}
              </button>
            )}
            <button type="button" onClick={start} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
              <RotateCcw className="h-4 w-4" /> {t('Rekam ulang', 'Record again')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
