import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ChevronUp, Eye, Hand, ShieldCheck, X } from 'lucide-react';
import { Nira } from '../art/Nira';
import { TOUR } from '../data/tour';
import { useTour } from './TourContext';

/**
 * Pemandu tur untuk juri. Tidak memblokir aplikasi: kartu bisa dilipat menjadi pil kecil
 * supaya juri bebas mencoba layar yang sedang dilihat, lalu menekan Lanjut kapan saja.
 */
export const TourOverlay: React.FC = () => {
  const { active, step, open, next, prev, stop, setOpen } = useTour();
  const { pathname } = useLocation();
  const [host, setHost] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setHost(document.getElementById('phone-overlay')), []);
  if (!active || !host) return null;

  const s = TOUR[step];
  const last = step === TOUR.length - 1;
  const hasTabs = pathname.startsWith('/learn') && !pathname.startsWith('/learn/bab');

  return createPortal(
    <>
      {open ? (
        <section
          role="dialog"
          aria-label={`Tur juri, langkah ${step + 1} dari ${TOUR.length}`}
          className="sheet-enter pointer-events-auto absolute inset-x-0 bottom-0 rounded-t-[28px] bg-cream px-5 pb-5 pt-3 shadow-[0_-18px_40px_-14px_rgba(16,38,30,0.55)]"
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-bamboo" />
          <div className="mt-3 flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-caramel bg-gradient-to-b from-[#FBE9C9] to-[#DCE6C4]">
              <span className="absolute inset-x-0 -bottom-1 flex justify-center">
                <Nira mood={s.mood} size={44} float={false} />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Tur juri · {step + 1} dari {TOUR.length}</p>
              <h2 className="font-serif text-xl leading-tight text-deep-forest">{s.title}</h2>
            </div>
            <button type="button" onClick={stop} aria-label="Akhiri tur" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2 flex gap-1" aria-hidden>
            {TOUR.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-caramel' : 'bg-bamboo'}`} />
            ))}
          </div>

          <p className="mt-3 flex gap-2 text-base leading-snug text-charcoal">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-forest" /> {s.see}
          </p>
          <p className="mt-2 flex gap-2 text-sm font-semibold leading-snug text-forest">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /> Membuktikan: {s.proves}
          </p>
          <p className="mt-2 flex gap-2 rounded-xl bg-caramel/15 p-2.5 text-sm font-semibold leading-snug text-caramel-dark">
            <Hand className="mt-0.5 h-4 w-4 shrink-0" /> Coba: {s.tryIt}
          </p>

          <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="min-h-[52px] rounded-full border-2 border-bamboo px-5 text-base font-semibold text-deep-forest disabled:opacity-40"
            >
              Kembali
            </button>
            <button type="button" onClick={() => setOpen(false)} className="min-h-[52px] rounded-full bg-forest text-base font-semibold text-coconut">
              Coba sekarang
            </button>
          </div>
        </section>
      ) : (
        <div
          className="pointer-events-auto absolute inset-x-3 flex items-center gap-2 rounded-full bg-deep-forest p-1.5 pl-2 text-coconut shadow-[0_10px_26px_-8px_rgba(16,38,30,0.7)]"
          style={{ bottom: hasTabs ? 84 : 14 }}
        >
          <button type="button" onClick={() => setOpen(true)} className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 text-left" aria-label="Buka panduan tur">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FBE9C9]">
              <span className="mt-2">
                <Nira mood={s.mood} size={28} float={false} />
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#E7C79A]">Tur juri {step + 1}/{TOUR.length}</span>
              <span className="block truncate text-sm font-semibold">{s.short}</span>
            </span>
            <ChevronUp className="h-4 w-4 shrink-0 text-[#E7C79A]" />
          </button>
          <button type="button" onClick={next} className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-caramel px-4 text-sm font-bold text-deep-forest">
            {last ? 'Selesai' : 'Lanjut'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>,
    host,
  );
};
