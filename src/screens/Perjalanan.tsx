import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Nira, NiraMood } from '../art/Nira';
import { LeafArrow } from '../art/Organic';
import { SLUG_SCENE, Scene } from '../art/Scene';
import { JalurArt, Station, pathFor, stationPoints } from '../art/JalurArt';
import { ProgressBar, Sheet } from '../components/ui';
import { lengthsAtY } from '../lib/pathLength';
import { isModuleLocked, useStore } from '../store';
import { LangToggle, t } from '../i18n';

/** Kartu tautan dengan Nira yang menyembul di sudut, menggantikan kartu ikon generik. */
const MascotCard: React.FC<{ to: string; mood: NiraMood; tint: string; title: string; text: string }> = ({ to, mood, tint, title, text }) => (
  <Link
    to={to}
    className="relative block min-h-[92px] rounded-[26px_34px_28px_34px] py-4 pl-[104px] pr-5 shadow-[0_14px_26px_-16px_rgba(16,38,30,0.65)]"
    style={{ background: tint }}
  >
    <span className="pointer-events-none absolute -top-6 left-3">
      <Nira mood={mood} size={84} float={false} />
    </span>
    <span className="block font-serif text-[21px] leading-tight text-deep-forest">{title}</span>
    <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{text}</span>
    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-forest">
      {t('Buka', 'Open')} <LeafArrow className="h-5 w-5" />
    </span>
  </Link>
);

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

        <div className="mt-4 rounded-3xl surface p-4">
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
      <section className="space-y-7 px-5 pb-28 pt-8">
        <MascotCard to="/learn/lab" mood="cheer" tint="#E7EFD3" title={t('Lab Pengetahuan', 'Knowledge Lab')} text={t('Bereksperimen di dapur dan menautkan istilah.', 'Experiment in the kitchen and link terms together.')} />
        <MascotCard to="/learn/arsip" mood="wave" tint="#FAE6C8" title={t('Arsip Gerakan', 'Movement Archive')} text={t('Rekaman gerak perajin, dengan kerangka tangan.', 'Recordings of artisans at work, with hand tracking.')} />
        <p className="text-center font-serif text-sm italic text-deep-forest/80">{t('Seluruh pembelajaran berbasis darat.', 'All learning is ground-based.')}</p>
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
