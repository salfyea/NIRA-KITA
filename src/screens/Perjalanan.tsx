import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FlaskConical, Hand, Lock, Sparkles } from 'lucide-react';
import { SLUG_SCENE, Scene } from '../art/Scene';
import { JalurArt, Station, pathFor, stationPoints } from '../art/JalurArt';
import { ProgressBar, Sheet } from '../components/ui';
import { lengthsAtY } from '../lib/pathLength';
import { isModuleLocked, useStore } from '../store';
import { LangToggle, t } from '../i18n';

export const Perjalanan: React.FC = () => {
  const { session, level, nextLevel, xp, modules, quests } = useStore();
  const navigate = useNavigate();
  const [openSlug, setOpenSlug] = React.useState<string | null>(null);

  const activeIdx = Math.max(
    0,
    modules.findIndex((m) => m.completionPercent < 100),
  );
  const status = (i: number): 'done' | 'active' | 'open' | 'locked' => {
    const m = modules[i];
    if (m.completionPercent >= 100) return 'done';
    if (i === activeIdx) return 'active';
    if (isModuleLocked(modules, i)) return 'locked';
    return 'open';
  };

  const stations: Station[] = modules.map((m, i) => ({ id: m.id, slug: m.slug, kind: SLUG_SCENE[m.slug] ?? 'identitas', number: m.number, title: m.title, status: status(i), percent: m.completionPercent }));

  // Bagian jalan yang sudah dilalui: sampai stasiun terakhir yang selesai atau sedang berjalan.
  const lastReached = stations.reduce((acc, st, i) => (st.status === 'done' || st.status === 'active' ? i : acc), -1);
  const doneLength = React.useMemo(() => {
    if (lastReached < 0) return null;
    const ys = stationPoints(modules.length).map((p) => p.y);
    return lengthsAtY(pathFor(modules.length), ys)[lastReached] ?? null;
  }, [lastReached, modules.length]);

  const sel = modules.find((m) => m.slug === openSlug);
  const selQuest = sel ? quests.find((q) => q.id === sel.associatedQuestId) : undefined;
  const selStatus = sel ? status(modules.indexOf(sel)) : 'open';
  const toNext = nextLevel ? Math.round(((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100) : 100;

  return (
    <div className="bg-cream">
      <header className="px-5 pb-1 pt-5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-ink-soft">{t('Halo,', 'Hello,')}</p>
            <p className="truncate font-serif text-[22px] leading-tight text-deep-forest">{session?.name}</p>
          </div>
          <LangToggle className="shrink-0" />
        </div>

        <div className="mt-4 rounded-3xl border border-bamboo bg-coconut p-4 shadow-[0_8px_22px_-14px_rgba(24,56,44,0.55)]">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Level', 'Level')} {level.level}</p>
              <p className="truncate text-base font-semibold leading-tight text-deep-forest">{level.indonesianName}</p>
            </div>
            <p className="shrink-0 text-right">
              <span className="font-serif text-2xl leading-none text-deep-forest">{xp}</span>
              <span className="ml-1 text-xs font-semibold text-ink-soft">XP</span>
            </p>
          </div>
          <ProgressBar value={toNext} className="mt-3" />
          <p className="mt-1.5 text-xs text-ink-soft">
            {nextLevel ? t(`${nextLevel.minXp - xp} XP lagi menuju ${nextLevel.indonesianName}`, `${nextLevel.minXp - xp} XP to ${nextLevel.indonesianName}`) : t('Level tertinggi tercapai', 'Top level reached')}
          </p>
          {modules[activeIdx] && (
            <button
              type="button"
              onClick={() => setOpenSlug(modules[activeIdx].slug)}
              className="mt-3 flex min-h-[52px] w-full items-center gap-3 rounded-2xl bg-forest px-4 text-left text-coconut"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#E7C79A]">{t('Lanjutkan', 'Continue')}</span>
                <span className="block truncate text-[15px] font-semibold leading-tight">
                  {modules[activeIdx].number.replace('MODUL ', t('Modul ', 'Module '))} · {modules[activeIdx].title.split(' & ')[0]}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </button>
          )}
        </div>
      </header>

      <div className="pt-1">
        <JalurArt stations={stations} doneLength={doneLength} onOpen={setOpenSlug} />
      </div>
      <div style={{ background: 'linear-gradient(#BBD1A2 0%, #A3C28B 40%, #86AB74 100%)' }}>
      <section className="space-y-3 px-5 pb-28 pt-2">
        <Link to="/learn/lab" className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-bamboo bg-coconut p-3 shadow-[0_6px_16px_-10px_rgba(24,56,44,0.5)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-coconut">
            <FlaskConical className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-deep-forest">{t('Lab Pengetahuan', 'Knowledge Lab')}</p>
            <p className="text-xs text-ink-soft">{t('Bereksperimen di dapur dan menautkan istilah.', 'Experiment in the kitchen and link terms together.')}</p>
          </div>
          <span className="shrink-0 rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-coconut">{t('Buka', 'Open')}</span>
        </Link>
        <Link to="/learn/arsip" className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-bamboo bg-coconut p-3 shadow-[0_6px_16px_-10px_rgba(24,56,44,0.5)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-caramel-dark text-coconut">
            <Hand className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-deep-forest">{t('Arsip Gerakan', 'Movement Archive')}</p>
            <p className="text-xs text-ink-soft">{t('Rekaman gerak perajin, dengan kerangka tangan.', 'Recordings of artisans at work, with hand tracking.')}</p>
          </div>
          <span className="shrink-0 rounded-full bg-caramel-dark px-3 py-1.5 text-xs font-bold text-coconut">{t('Buka', 'Open')}</span>
        </Link>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-deep-forest/80">
          <Sparkles className="h-3.5 w-3.5" /> {t('Data ilustratif. Seluruh pembelajaran berbasis darat.', 'Illustrative data. All learning is ground-based.')}
        </p>
      </section>
      </div>

      <Sheet open={!!sel} onClose={() => setOpenSlug(null)} title={sel?.title ?? ''}>
        {sel && (
          <div className="px-5 pt-4">
            <div className="overflow-hidden rounded-2xl">
              <Scene kind={SLUG_SCENE[sel.slug] ?? 'identitas'} className="h-36 w-full" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{sel.number}</p>
            <h2 className="text-2xl leading-tight text-deep-forest">{sel.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{sel.subtitle}</p>
            {selStatus === 'locked' ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-bamboo/40 p-3 text-sm font-semibold text-deep-forest">
                <Lock className="h-4 w-4" /> {t('Selesaikan bab sebelumnya untuk membuka bab ini.', 'Finish the previous chapter to unlock this one.')}
              </p>
            ) : (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <ProgressBar value={sel.completionPercent} className="flex-1" />
                  <span className="text-xs font-semibold text-ink-soft">{sel.completionPercent}% · {sel.duration}</span>
                </div>
                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/learn/bab/${sel.slug}`)}
                    className="min-h-[52px] rounded-full bg-forest text-base font-semibold text-coconut"
                  >
                    {sel.completionPercent >= 100 ? t('Baca lagi', 'Read again') : t('Mulai bab', 'Start chapter')}
                  </button>
                  {selQuest && (
                    <Link
                      to={`/learn/misi/${selQuest.id}`}
                      className="flex min-h-[52px] items-center justify-center rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark"
                    >
                      {t('Misi', 'Quest')}: {selQuest.title}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
};
