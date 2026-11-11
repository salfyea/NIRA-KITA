import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Scene } from '../art/Scene';

/** Paspor Warisan publik dari pemindaian QR kemasan. Placeholder rapi untuk tahap berikutnya. */
export const PasporPublik: React.FC = () => {
  const { code } = useParams();
  return (
    <div className="min-h-full bg-cream">
      <div className="relative h-[220px] overflow-hidden rounded-b-[36px]">
        <Scene kind="keberlanjutan" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="-mt-10 px-6 pb-8">
        <div className="ornate p-5 text-center">
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <QrCode className="mx-auto h-6 w-6 text-caramel-dark" />
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Paspor Warisan</p>
          <h1 className="mt-1 text-2xl text-deep-forest">Kemasan {code}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Halaman publik ini sedang disiapkan. Nanti kamu bisa melihat kisah perajin dan asal gula kelapa ini, hanya dengan izin narasumber.
          </p>
          <div className="mt-3 flex justify-center">
            <Nira mood="happy" size={80} />
          </div>
        </div>
        <Link to="/" className="mt-5 flex min-h-[48px] items-center justify-center rounded-full bg-forest text-base font-semibold text-coconut">
          Kenali NIRA KITA
        </Link>
      </div>
    </div>
  );
};
