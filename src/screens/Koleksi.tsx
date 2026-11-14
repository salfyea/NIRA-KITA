import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, Quote, ShieldCheck } from 'lucide-react';
import { Scene, SLUG_SCENE } from '../art/Scene';
import { Nira } from '../art/Nira';
import { ApprovalChip, Ornate } from '../components/ui';
import { attribution } from '../data/attribution';
import { HeritageRecord } from '../types/jejakNira';
import { isLearnerVisible, useStore } from '../store';
import { t } from '../i18n';
import { locLabel } from '../data/display';

const sceneOf = (r: HeritageRecord) => SLUG_SCENE[r.relatedModuleSlug] ?? 'identitas';

export const Koleksi: React.FC = () => {
  const { records, collected } = useStore();
  const [tab, setTab] = React.useState<'kartu' | 'glosarium'>('kartu');
  const navigate = useNavigate();
  // Hanya rekaman yang disetujui kurator dan boleh dilihat pelajar.
  const visible = records.filter(isLearnerVisible);
  const got = visible.filter((r) => collected.includes(r.id)).length;
  const glossary = visible.filter((r) => r.localTerm);

  return (
    <div className="px-5 pb-6 pt-6">
      <h1 className="text-[28px] leading-tight text-deep-forest">{t('Koleksi', 'Collection')}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {t(`${got} dari ${visible.length} kartu warisan terkumpul`, `${got} of ${visible.length} heritage cards collected`)}
      </p>

      <div className="mt-4 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
        {(['kartu', 'glosarium'] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-[44px] rounded-full text-sm font-semibold ${tab === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}
          >
            {k === 'kartu' ? t('Kartu', 'Cards') : t('Glosarium', 'Glossary')}
          </button>
        ))}
      </div>

      {tab === 'kartu' ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {visible.map((r) =>
            collected.includes(r.id) ? (
              <Ornate key={r.id} as="button" onClick={() => navigate(`/learn/koleksi/${r.id}`)} className="overflow-hidden p-0">
                <Scene kind={sceneOf(r)} className="block h-24 w-full" />
                <span className="block p-2.5">
                  <span className="line-clamp-3 text-sm font-semibold leading-snug text-deep-forest">{r.title}</span>
                  <span className="mt-1.5 block">
                    <ApprovalChip record={r} compact />
                  </span>
                </span>
              </Ornate>
            ) : (
              <div key={r.id} className="ornate flex min-h-[170px] flex-col items-center justify-center bg-bamboo/30 p-3 text-center">
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-forest/15 text-deep-forest">
                  <Lock className="h-5 w-5" />
                </span>
                <span className="mt-2 text-sm font-semibold text-deep-forest">{t('Kartu terkunci', 'Locked card')}</span>
                <span className="mt-0.5 text-xs text-ink-soft">{t('Temukan di peta atau bab', 'Find it on the map or in a chapter')}</span>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {glossary.map((r) => (
            <Ornate key={r.id} as="button" onClick={() => navigate(`/learn/koleksi/${r.id}`)} className="p-3.5">
              <span className="block text-xl text-deep-forest">{r.localTerm}</span>
              <span className="mt-0.5 line-clamp-2 block text-sm text-ink-soft">{r.shortDescription}</span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                <ApprovalChip record={r} />
              </span>
            </Ornate>
          ))}
          {glossary.length === 0 && <p className="text-sm text-ink-soft">{t('Belum ada istilah yang disetujui kurator.', 'No curator-approved terms yet.')}</p>}
        </div>
      )}
    </div>
  );
};

export const KoleksiDetail: React.FC = () => {
  const { id } = useParams();
  const { records } = useStore();
  const r = records.find((x) => x.id === id);
  if (!r || !isLearnerVisible(r)) return <Navigate to="/learn/koleksi" replace />;
  return (
    <div className="pb-6">
      <div className="relative h-56 overflow-hidden rounded-b-[32px]">
        <Scene kind={sceneOf(r)} className="absolute inset-0 h-full w-full" />
        <Link
          to="/learn/koleksi"
          aria-label={t('Kembali ke koleksi', 'Back to the collection')}
          className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-coconut/90 text-deep-forest"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute -bottom-2 right-4">
          <Nira mood="happy" size={72} />
        </div>
      </div>
      <div className="space-y-3 px-5 pt-4">
        <div className="flex flex-wrap gap-1.5">
          <ApprovalChip record={r} />
        </div>
        <h1 className="text-[28px] leading-tight text-deep-forest">{r.title}</h1>
        {r.localTerm && <p className="text-sm font-semibold text-caramel-dark">{t('Istilah lokal', 'Local term')}: {r.localTerm}</p>}
        <p className="text-base leading-relaxed text-charcoal">{r.culturalExplanation}</p>
        <Ornate className="space-y-2 p-3.5">
          <p className="flex items-start gap-2 text-sm text-deep-forest">
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-caramel-dark" />
            <span>
              <span className="block text-xs font-bold uppercase tracking-wider text-ink-soft">{t('Narasumber', 'Source')}</span>
              {attribution(r)}
            </span>
          </p>
          <p className="flex items-start gap-2 text-sm text-deep-forest">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
            <span>
              <span className="block text-xs font-bold uppercase tracking-wider text-ink-soft">{t('Kurator', 'Curator')}</span>
              {r.reviewerName ?? t('Tim kurator budaya', 'Cultural curator team')}
            </span>
          </p>
          <p className="text-xs text-ink-soft">
            {locLabel(r.location)}
          </p>
        </Ornate>
      </div>
    </div>
  );
};
