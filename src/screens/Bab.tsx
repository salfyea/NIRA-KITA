import React from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Quote, X } from 'lucide-react';
import { Scene, SceneKind, SLUG_SCENE } from '../art/Scene';
import { Nira } from '../art/Nira';
import { ApprovalChip } from '../components/ui';
import { CHAPTER_XP, getQuiz } from '../data/quiz';
import { getPraktik } from '../data/praktik';
import { t } from '../i18n';
import { GerakPraktik } from '../components/GerakPraktik';
import { attribution } from '../data/attribution';
import { isLearnerVisible, useStore } from '../store';

const CardShell: React.FC<{ kind: SceneKind; children: React.ReactNode; scene?: React.ReactNode }> = ({ kind, children, scene }) => (
  <section className="no-scrollbar h-full w-full shrink-0 snap-center overflow-y-auto">
    <div className="relative h-[40%] min-h-[220px] overflow-hidden rounded-b-[32px]">
      <Scene kind={kind} className="absolute inset-0 h-full w-full" />
      {scene}
    </div>
    <div className="px-6 pb-6 pt-4">{children}</div>
  </section>
);

/** Pembaca bab: kartu cerita yang bisa digeser, kuis mini, lalu hadiah. */
export const Bab: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { modules, records, collected, completeModule } = useStore();
  const mod = modules.find((m) => m.slug === slug);
  const scroller = React.useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [reward, setReward] = React.useState<{ xp: number; newTitles: string[] } | null>(null);

  // Tautan langsung ke kartu praktik (?kartu=praktik): kartu ketiga dari belakang.
  React.useEffect(() => {
    if (params.get('kartu') !== 'praktik') return;
    const t = setTimeout(() => {
      const el = scroller.current;
      if (el && el.children.length >= 3) el.scrollTo({ left: (el.children.length - 3) * el.clientWidth, behavior: 'smooth' });
    }, 500);
    return () => clearTimeout(t);
  }, [params]);

  if (!mod || !slug) return <Navigate to="/learn" replace />;
  const kind = SLUG_SCENE[slug] ?? 'identitas';
  const recs = records.filter((r) => r.relatedModuleSlug === slug && isLearnerVisible(r));
  const quiz = getQuiz(slug)!;
  const solved = picked === quiz.correct;

  // Urutan kartu: intro, rekaman, tujuan, kuis, hadiah.
  const hasPraktik = !!getPraktik(slug);
  const total = 1 + Math.max(recs.length, 1) + 1 + (hasPraktik ? 1 : 0) + 1 + 1;
  const praktikAt = hasPraktik ? total - 3 : -1;
  const quizAt = total - 2;
  const rewardAt = total - 1;

  const go = (n: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };
  const onScroll = () => {
    const el = scroller.current;
    if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  const finish = () => {
    const newTitles = recs.filter((r) => !collected.includes(r.id)).map((r) => r.title);
    const xp = mod.completionPercent >= 100 ? 0 : CHAPTER_XP;
    completeModule(slug, recs.map((r) => r.id), CHAPTER_XP);
    setReward({ xp, newTitles });
  };

  const canNext = idx !== quizAt || solved;

  return (
    <div className="flex h-full min-h-[600px] flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pb-2 pt-3">
        <button type="button" onClick={() => navigate('/learn')} aria-label={t('Tutup bab', 'Close chapter')} className="flex h-11 w-11 items-center justify-center rounded-full text-deep-forest">
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-1 gap-1.5" aria-label={t(`Kartu ${idx + 1} dari ${total}`, `Card ${idx + 1} of ${total}`)}>
          {Array.from({ length: total }).map((_, n) => (
            <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= idx ? 'bg-caramel' : 'bg-bamboo'}`} />
          ))}
        </div>
      </div>

      <div ref={scroller} onScroll={onScroll} className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto">
        <CardShell kind={kind} scene={<div className="absolute -bottom-2 right-4"><Nira mood="wave" size={78} /></div>}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{mod.number}</p>
          <h1 className="text-[28px] leading-tight text-deep-forest">{mod.title}</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">{mod.subtitle}</p>
          <p className="mt-3 text-sm text-ink-soft">{t('Geser kartu ke kanan, atau tekan Lanjut.', 'Swipe the card to the right, or press Next.')}</p>
        </CardShell>

        {recs.length === 0 ? (
          <CardShell kind="memudar">
            <h2 className="text-2xl text-deep-forest">{t('Cerita komunitas sedang ditinjau', 'Community stories are under review')}</h2>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              {t('Rekaman untuk bab ini belum disetujui kurator, jadi belum ditampilkan. Kami hanya menampilkan pengetahuan yang sudah mendapat izin.', 'The recordings for this chapter have not been approved by the curator yet, so they are not shown. We only show knowledge that has been given permission.')}
            </p>
          </CardShell>
        ) : (
          recs.map((r) => (
            <CardShell key={r.id} kind={kind === 'identitas' ? 'penderes' : kind}>
              <ApprovalChip record={r} />
              <h2 className="mt-2 text-2xl leading-tight text-deep-forest">{r.title}</h2>
              {r.localTerm && <p className="mt-1 text-sm font-semibold text-caramel-dark">{t('Istilah lokal', 'Local term')}: {r.localTerm}</p>}
              <p className="mt-2 text-base leading-relaxed text-charcoal">{r.culturalExplanation}</p>
              <p className="mt-3 flex items-start gap-2 text-sm text-ink-soft">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-caramel-dark" />
                <span>
                  {attribution(r)}
                  {r.isIllustrativePlaceholder && t(' · data ilustratif', ' · illustrative data')}
                </span>
              </p>
            </CardShell>
          ))
        )}

        <CardShell kind={kind}>
          <h2 className="text-2xl text-deep-forest">{t('Tujuan belajar', 'Learning goals')}</h2>
          <ul className="mt-3 space-y-3">
            {mod.objectives.map((o) => (
              <li key={o} className="flex gap-3 text-base leading-relaxed text-charcoal">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-coconut">
                  <Check className="h-3 w-3" />
                </span>
                {o}
              </li>
            ))}
          </ul>
          {mod.safetyNotice && <p className="mt-4 rounded-xl bg-bamboo/40 p-3 text-sm text-deep-forest">{mod.safetyNotice}</p>}
        </CardShell>

        {hasPraktik && (
          <CardShell kind={kind}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Praktik gerak', 'Movement practice')}</p>
            <h2 className="text-2xl leading-tight text-deep-forest">{t('Coba dengan tanganmu', 'Try it with your hands')}</h2>
            <GerakPraktik slug={slug} onDone={() => undefined} />
          </CardShell>
        )}

        <CardShell kind={kind} scene={<div className="absolute -bottom-2 left-4"><Nira mood={picked === null ? 'think' : solved ? 'cheer' : 'think'} size={78} /></div>}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Kuis mini', 'Mini quiz')}</p>
          <h2 className="mt-1 text-2xl leading-tight text-deep-forest">{quiz.question}</h2>
          <div className="mt-3 grid gap-2">
            {quiz.options.map((o, n) => {
              const state = picked === n ? (n === quiz.correct ? 'ok' : 'bad') : 'idle';
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => setPicked(n)}
                  className={`min-h-[52px] rounded-2xl border-2 px-4 py-2 text-left text-base font-semibold ${
                    state === 'ok'
                      ? 'border-forest bg-forest/10 text-forest'
                      : state === 'bad'
                        ? 'border-terracotta bg-terracotta/10 text-terracotta'
                        : 'border-bamboo bg-coconut text-deep-forest'
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <p role="status" className="mt-3 text-sm leading-relaxed text-ink-soft">
              {solved ? `${t('Tepat!', 'Correct!')} ${quiz.explanation}` : t('Belum tepat, coba pilihan lain ya.', 'Not quite, try another option.')}
            </p>
          )}
        </CardShell>

        <CardShell kind="bersama" scene={<div className="absolute -bottom-2 left-1/2 -translate-x-1/2"><Nira mood="cheer" size={92} /></div>}>
          <h2 className="text-center text-[28px] leading-tight text-deep-forest">{reward ? t('Bab selesai!', 'Chapter complete!') : t('Hampir selesai', 'Almost done')}</h2>
          {reward ? (
            <div className="mt-3 space-y-3 text-center">
              <p className="text-base font-semibold text-forest">{reward.xp > 0 ? `+${reward.xp} XP` : t('Bab ini sudah pernah selesai, tanpa XP tambahan.', 'You have already completed this chapter, so no extra XP.')}</p>
              {reward.newTitles.length > 0 ? (
                <div className="ornate p-3 text-left">
                  <span className="corner tl" />
                  <span className="corner tr" />
                  <span className="corner bl" />
                  <span className="corner br" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Kartu warisan baru', 'New heritage card')}</p>
                  {reward.newTitles.map((t) => (
                    <p key={t} className="mt-1 text-sm font-semibold text-deep-forest">{t}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft">{t('Tidak ada kartu baru kali ini.', 'No new cards this time.')}</p>
              )}
              <button type="button" onClick={() => navigate('/learn')} className="min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                {t('Kembali ke perjalanan', 'Back to the journey')}
              </button>
            </div>
          ) : (
            <div className="mt-3 text-center">
              <p className="text-base text-ink-soft">{t('Tandai bab ini selesai untuk mengambil hadiahmu.', 'Mark this chapter complete to claim your reward.')}</p>
              <button type="button" onClick={finish} className="mt-4 min-h-[52px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut">
                {t('Ambil hadiah', 'Claim reward')}
              </button>
            </div>
          )}
        </CardShell>
      </div>

      {idx !== rewardAt && (
        <div className="flex items-center justify-between px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            aria-label={t('Kartu sebelumnya', 'Previous card')}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-bamboo bg-coconut text-deep-forest disabled:opacity-40"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            disabled={!canNext}
            className="flex min-h-[48px] items-center gap-2 rounded-full bg-forest px-6 text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
          >
            {canNext ? t('Lanjut', 'Next') : t('Jawab dulu', 'Answer first')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
