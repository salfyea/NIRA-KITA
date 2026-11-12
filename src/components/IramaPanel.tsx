import React from 'react';
import { Activity } from 'lucide-react';
import { Rhythm, regularityLabel, tempoVerdict } from '../lib/irama';
import { t } from '../i18n';

const regText = (r: number) => {
  const k = regularityLabel(r);
  return k === 'teratur' ? t('teratur', 'steady') : k === 'cukup' ? t('cukup teratur', 'fairly steady') : t('belum teratur', 'not steady yet');
};

/** Menampilkan irama gerak langsung: putaran per menit dan keteraturan, dibandingkan dengan irama acuan perajin bila ada. */
export const IramaPanel: React.FC<{ rhythm: Rhythm | null; reference?: { rpm: number; regularity: number }; moving: boolean; final?: boolean }> = ({ rhythm, reference, moving, final }) => {
  const verdict = rhythm && reference ? tempoVerdict(rhythm.rpm, reference.rpm) : null;
  return (
    <div className="mt-3 rounded-2xl border border-bamboo bg-cream p-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
        <Activity className="h-3.5 w-3.5" /> {final ? t('Irama tanganmu tadi', 'Your hand rhythm just now') : t('Irama tangan, langsung', 'Hand rhythm, live')}
      </p>
      <div className="mt-1 flex items-end gap-3">
        <p className="font-serif text-4xl leading-none text-deep-forest">{rhythm ? Math.round(rhythm.rpm) : '--'}</p>
        <p className="pb-1 text-sm font-semibold text-ink-soft">{t('putaran per menit', 'rounds per minute')}</p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-bamboo/60" role="progressbar" aria-valuenow={Math.round((rhythm?.regularity ?? 0) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={t('Keteraturan irama', 'Rhythm steadiness')}>
        <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${(rhythm?.regularity ?? 0) * 100}%` }} />
      </div>
      <p className="mt-1 text-sm font-semibold text-charcoal">
        {rhythm ? `${t('Keteraturan', 'Steadiness')}: ${Math.round(rhythm.regularity * 100)}% · ${regText(rhythm.regularity)}` : moving ? t('Menghitung irama... lanjutkan memutar.', 'Measuring rhythm... keep stirring.') : t('Putar tanganmu beberapa detik untuk mengukur irama.', 'Stir for a few seconds to measure your rhythm.')}
      </p>
      {reference ? (
        <p className="mt-2 rounded-xl bg-forest/10 p-2 text-sm leading-snug text-deep-forest">
          <b>{t('Irama acuan perajin', 'Artisan reference rhythm')}:</b> ±{Math.round(reference.rpm)} {t('putaran per menit', 'rounds per minute')}.{' '}
          {verdict === 'pas' && <b className="text-forest">{t('Tempomu pas.', 'Your tempo matches.')}</b>}
          {verdict === 'lambat' && <b className="text-caramel-dark">{t('Tempomu lebih lambat dari acuan.', 'Your tempo is slower than the reference.')}</b>}
          {verdict === 'cepat' && <b className="text-caramel-dark">{t('Tempomu lebih cepat dari acuan.', 'Your tempo is faster than the reference.')}</b>}
        </p>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">
          {t('Belum ada irama acuan dari perajin. Mentor merekamnya di Ruang Mentor, lalu kurator menyetujui, baru tampil di sini.', 'There is no artisan reference rhythm yet. A mentor records it in the Mentor room, the curator approves it, and only then it appears here.')}
        </p>
      )}
      <p className="mt-2 text-[11px] leading-snug text-ink-soft">{t('Ini ukuran gerak yang tidak bisa diberikan video biasa. Bukan penilaian teknik: teknik tetap divalidasi mentor.', 'This is a movement measure an ordinary video cannot give. It is not a technique grade: technique is still validated by a mentor.')}</p>
    </div>
  );
};
