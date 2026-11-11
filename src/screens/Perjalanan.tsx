import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, FlaskConical, Hand, Lock, Sparkles } from 'lucide-react';
import { Scene, SLUG_SCENE } from '../art/Scene';
import { Nira } from '../art/Nira';
import { ProgressBar, Sheet } from '../components/ui';
import { useStore } from '../store';

const W = 390;
const ROW = 200;
const TOP = 110;
const XS = [0.3, 0.68, 0.32, 0.66];

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
    if (i > activeIdx && m.completionPercent === 0) return 'locked';
    return 'open';
  };

  const H = TOP + (modules.length - 1) * ROW + 190;
  const pts = modules.map((_, i) => ({ x: XS[i % XS.length] * W, y: TOP + i * ROW + 60 }));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${W / 2} 0 C${W / 2} 40 ${p.x} 30 ${p.x} ${p.y}`;
    const q = pts[i - 1];
    const my = (q.y + p.y) / 2;
    return `${acc} C${q.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
  }, '');

  const sel = modules.find((m) => m.slug === openSlug);
  const selQuest = sel ? quests.find((q) => q.id === sel.associatedQuestId) : undefined;
  const selStatus = sel ? status(modules.indexOf(sel)) : 'open';
  const toNext = nextLevel ? Math.round(((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100) : 100;

  return (
    <div className="bg-cream">
      <header className="relative overflow-hidden px-5 pb-4 pt-6">
        <p className="text-sm font-semibold text-ink-soft">Halo, {session?.name}</p>
        <h1 className="text-[28px] leading-tight text-deep-forest">Perjalananmu</h1>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-bamboo bg-coconut px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-caramel/15 text-sm font-bold text-caramel-dark">
            {level.level}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-semibold text-deep-forest">{level.indonesianName}</p>
              <p className="shrink-0 text-xs font-semibold text-ink-soft">{xp} XP</p>
            </div>
            <ProgressBar value={toNext} className="mt-1.5" />
          </div>
        </div>
      </header>

      <div className="relative mx-auto" style={{ width: '100%', aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={d} fill="none" stroke="#DCCDB2" strokeWidth="16" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 12" />
          {pts.map((p, i) =>
            i % 2 === 0 ? (
              <g key={i} opacity="0.9">
                <circle cx={p.x < W / 2 ? W - 44 : 44} cy={p.y + 20} r="6" fill="#A9B7A0" />
                <circle cx={p.x < W / 2 ? W - 56 : 56} cy={p.y + 26} r="4" fill="#A9B7A0" />
              </g>
            ) : null,
          )}
        </svg>

        {modules.map((m, i) => {
          const st = status(i);
          const p = pts[i];
          const kind = SLUG_SCENE[m.slug] ?? 'identitas';
          return (
            <div
              key={m.id}
              className="absolute -translate-x-1/2 text-center"
              style={{ left: `${(p.x / W) * 100}%`, top: `calc(${(p.y / H) * 100}% - 42px)` }}
            >
              <button
                type="button"
                onClick={() => setOpenSlug(m.slug)}
                aria-label={`${m.number}: ${m.title}${st === 'locked' ? ', terkunci' : ''}`}
                className={`relative flex h-[84px] w-[84px] items-center justify-center rounded-full p-1 shadow-lg ${
                  st === 'active' ? 'bg-caramel' : st === 'done' ? 'bg-forest' : 'bg-bamboo'
                }`}
              >
                {st === 'active' && <span className="marker-ring absolute inset-0 rounded-full border-2 border-caramel" />}
                <span className={`block h-full w-full overflow-hidden rounded-full border-2 border-coconut ${st === 'locked' ? 'opacity-50 grayscale' : ''}`}>
                  <Scene kind={kind} className="h-full w-full" />
                </span>
                {st === 'done' && (
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-coconut ring-2 ring-cream">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {st === 'locked' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-forest/80 text-coconut">
                      <Lock className="h-4 w-4" />
                    </span>
                  </span>
                )}
              </button>
              <p className={`mx-auto mt-1.5 w-[120px] text-xs font-bold ${st === 'locked' ? 'text-ink-soft' : 'text-deep-forest'}`}>
                {m.number.replace('MODUL ', 'Modul ')}
                <span className="block text-[12px] font-semibold leading-tight text-ink-soft">{m.title.split(' & ')[0]}</span>
              </p>
              {st === 'active' && (
                <div className="pointer-events-none absolute left-1/2 -top-1.5" style={{ marginLeft: p.x < W / 2 ? 50 : -114 }}>
                  <Nira mood="wave" size={64} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <section className="space-y-3 px-5 pb-6">
        <Link to="/learn/lab" className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-bamboo bg-coconut p-3 shadow-[0_6px_16px_-10px_rgba(24,56,44,0.5)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-coconut">
            <FlaskConical className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-deep-forest">Lab Pengetahuan</p>
            <p className="text-xs text-ink-soft">Bereksperimen di dapur dan menautkan istilah.</p>
          </div>
          <span className="shrink-0 rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-coconut">Buka</span>
        </Link>
        <Link to="/learn/arsip" className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-bamboo bg-coconut p-3 shadow-[0_6px_16px_-10px_rgba(24,56,44,0.5)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-caramel-dark text-coconut">
            <Hand className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-deep-forest">Arsip Gerakan</p>
            <p className="text-xs text-ink-soft">Rekaman gerak perajin, dengan kerangka tangan.</p>
          </div>
          <span className="shrink-0 rounded-full bg-caramel-dark px-3 py-1.5 text-xs font-bold text-coconut">Buka</span>
        </Link>
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <Sparkles className="h-3.5 w-3.5" /> Data ilustratif. Seluruh pembelajaran berbasis darat.
        </p>
      </section>

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
                <Lock className="h-4 w-4" /> Selesaikan bab sebelumnya untuk membuka bab ini.
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
                    {sel.completionPercent >= 100 ? 'Baca lagi' : 'Mulai bab'}
                  </button>
                  {selQuest && (
                    <Link
                      to={`/learn/misi/${selQuest.id}`}
                      className="flex min-h-[52px] items-center justify-center rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark"
                    >
                      Misi: {selQuest.title}
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
