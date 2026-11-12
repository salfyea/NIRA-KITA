import React from 'react';
import { t } from '../i18n';

/** Logo penyelenggara kompetisi. Dipakai di halaman demo dan Profil (latar terang). */
export const PartnerLogos: React.FC<{ className?: string; height?: number }> = ({ className = '', height = 34 }) => (
  <div className={className}>
    <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Dibuat untuk', 'Made for')}</p>
    <div className="mt-2 flex items-center justify-center gap-5">
      <img src="/logos/idea-champion-3.png" alt="Idea Champion 3.0" style={{ height }} className="w-auto" />
      <img src="/logos/clc-uii.png" alt="CLC UII" style={{ height: height * 0.9 }} className="w-auto" />
    </div>
  </div>
);
