import { HeritageRecord } from '../types/jejakNira';
import { t } from '../i18n';

/** Atribusi narasumber sesuai preferensi yang disetujui. */
export const attribution = (r: HeritageRecord): string => {
  if (r.attributionPreference === 'Anonim') return t('Narasumber komunitas (anonim)', 'Community source (anonymous)');
  if (r.attributionPreference === 'Tampilkan Inisial Komunitas') {
    const ini = r.contributorName
      .split(' ')
      .map((w) => w[0])
      .join('');
    return `${ini}, ${r.contributorRole}`;
  }
  return `${r.contributorName}, ${r.contributorRole}`;
};
