import React from 'react';
import { Download, WifiOff } from 'lucide-react';
import { t } from '../i18n';
import { OFFLINE_ASSETS } from './hand';

/** Mendaftarkan service worker setelah halaman selesai dimuat (hanya di produksi). */
export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
};

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Status koneksi untuk menampilkan pill "mode offline". */
export const useOnline = (): boolean => {
  const [on, setOn] = React.useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  React.useEffect(() => {
    const up = () => setOn(true);
    const down = () => setOn(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  return on;
};

export const OfflinePill: React.FC = () => {
  const on = useOnline();
  if (on) return null;
  return (
    <div role="status" className="pointer-events-none absolute inset-x-0 top-2 z-40 flex justify-center">
      <span className="flex items-center gap-1.5 rounded-full bg-deep-forest px-3 py-1.5 text-xs font-bold text-coconut shadow">
        <WifiOff className="h-3.5 w-3.5" /> {t('Mode offline: bagian yang sudah dibuka tetap bisa dipakai', 'Offline mode: parts you have already opened still work')}
      </span>
    </div>
  );
};

const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/** Kartu "Pasang di layar utama": tombol bila peramban mendukung, petunjuk manual untuk iPhone. */
export const InstallCard: React.FC = () => {
  const [ev, setEv] = React.useState<InstallEvent | null>(null);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setEv(e as InstallEvent);
    };
    window.addEventListener('beforeinstallprompt', h);
    window.addEventListener('appinstalled', () => setDone(true));
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  if (isStandalone() || done) {
    return <p className="mt-2 rounded-xl bg-forest/10 p-3 text-sm font-semibold text-forest">{t('Aplikasi sudah terpasang di perangkat ini.', 'The app is installed on this device.')}</p>;
  }
  return (
    <div className="mt-2 rounded-2xl bg-coconut p-4">
      <p className="text-sm leading-relaxed text-charcoal">
        {t('Pasang NIRA KITA di layar utama supaya terbuka seperti aplikasi, dan tetap bisa dipakai saat sinyal lemah.', 'Install NIRA KITA on your home screen so it opens like an app and keeps working when the signal is weak.')}
      </p>
      {ev ? (
        <button
          type="button"
          onClick={async () => {
            await ev.prompt();
            await ev.userChoice;
            setEv(null);
          }}
          className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-coconut"
        >
          <Download className="h-5 w-5" /> {t('Pasang aplikasi', 'Install the app')}
        </button>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">
          {isIos()
            ? t('Di iPhone: ketuk tombol Bagikan, lalu "Tambahkan ke Layar Utama".', 'On iPhone: tap the Share button, then "Add to Home Screen".')
            : t('Gunakan menu peramban (titik tiga) lalu "Pasang aplikasi" atau "Tambahkan ke layar utama".', 'Use the browser menu (three dots), then "Install app" or "Add to home screen".')}
        </p>
      )}
    </div>
  );
};

const CLIPS = ['pongkor', 'pohon-kelapa', 'wajan-nira', 'mengaduk', 'pengaduk-kayu'].map((n) => `/media/${n}.mp4`);

/** Menyiapkan model pelacak tangan dan klip arsip supaya Praktik gerak dan Arsip bisa dipakai tanpa sinyal. */
export const OfflineCard: React.FC = () => {
  const [state, setState] = React.useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [n, setN] = React.useState(0);
  const all = [...OFFLINE_ASSETS, ...CLIPS, '/media/dapur.jpg'];
  const run = async () => {
    setState('busy');
    setN(0);
    try {
      await Promise.all([import('../components/Alat3D'), import('../components/ARLayer')]); // potongan kode 3D ikut tersimpan
      for (const u of all) {
        const r = await fetch(u);
        if (!r.ok) throw new Error(u);
        await r.blob(); // memastikan terunduh penuh (service worker menyimpannya)
        setN((v) => v + 1);
      }
      setState('done');
    } catch {
      setState('error');
    }
  };
  return (
    <div className="mt-3 rounded-2xl bg-coconut p-4">
      <p className="text-sm font-semibold text-deep-forest">{t('Siapkan untuk offline', 'Prepare for offline')}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        {t('Unduh model pelacak tangan dan klip arsip (±27 MB, sekali saja) supaya Praktik gerak dan Arsip Gerakan jalan tanpa sinyal.', 'Download the hand-tracking model and archive clips (~27 MB, once) so Movement practice and the Movement Archive work without a signal.')}
      </p>
      <button
        type="button"
        disabled={state === 'busy' || state === 'done'}
        onClick={run}
        className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-caramel-dark text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
      >
        <Download className="h-4 w-4" />
        {state === 'busy' ? `${t('Mengunduh', 'Downloading')} ${n}/${all.length}` : state === 'done' ? t('Siap dipakai offline', 'Ready for offline use') : state === 'error' ? t('Gagal, coba lagi', 'Failed, try again') : t('Unduh untuk offline', 'Download for offline')}
      </button>
    </div>
  );
};
