import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, Sparkles } from 'lucide-react';
import { useStore, isLearnerVisible } from '../store';
import { HeroArt } from '../components/HeroArt';
import { ApprovalChip, Mascot, Ornate, ProgressBar, SectionTitle } from '../components/ui';

export const Beranda: React.FC = () => {
  const { level, nextLevel, xp, modules, quests, records } = useStore();
  const next = modules.find((m) => m.completionPercent < 100 && m.unlocked) ?? modules[0];
  const quest = quests.find((q) => !q.completed) ?? quests[0];
  const featured = records.filter(isLearnerVisible).slice(0, 3);
  const pct = nextLevel ? ((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100 : 100;

  return (
    <div className="pb-6">
      <div className="relative h-[230px] overflow-hidden">
        <HeroArt className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
          <span className="rounded-full bg-coconut/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-deep-forest backdrop-blur">
            Nira Kita
          </span>
          <span className="rounded-full bg-coconut/80 px-3 py-1 text-xs font-semibold text-deep-forest backdrop-blur">{xp} XP</span>
        </div>
      </div>

      <div className="space-y-6 px-5 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Cilongok, Banyumas</p>
          <h1 className="mt-1 text-[30px] leading-[1.05] text-deep-forest">Sugeng enjang, Penjelajah.</h1>
        </div>
        <Ornate className="p-4">
          <div className="flex items-center gap-3">
            <Mascot size={52} mood="happy" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-caramel-dark">Level {level.level}</p>
              <p className="font-serif text-xl leading-tight text-deep-forest">{level.indonesianName}</p>
              <ProgressBar value={pct} className="mt-2" />
              <p className="mt-1 text-xs text-ink-soft">
                {nextLevel ? `${nextLevel.minXp - xp} XP menuju ${nextLevel.indonesianName}` : 'Level tertinggi tercapai'}
              </p>
            </div>
          </div>
        </Ornate>

        <section className="space-y-3">
          <SectionTitle flush kicker="Lanjutkan" title="Belajar hari ini" />
          <div>
            <div>
              <Link to={`/learn/belajar/${next.slug}`} className="block">
                <Ornate className="overflow-hidden">
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Modul {next.number.replace(/^Modul\s*/i,"")}</p>
                    <h3 className="mt-1 text-xl leading-snug text-deep-forest">{next.title}</h3>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar value={next.completionPercent} tone="forest" />
                      <span className="text-xs font-semibold text-deep-forest">{next.completionPercent}%</span>
                    </div>
                  </div>
                </Ornate>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <Link to={`/learn/misi/${quest.id}`} className="block">
            <div className="flex items-center gap-3 rounded-2xl bg-forest p-4 text-coconut">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-caramel/30">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-sage">Misi aktif · +{quest.xpReward} XP</p>
                <p className="font-serif text-lg leading-tight">{quest.title}</p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </section>

        <section>
          <Link to="/learn/peta" className="block">
            <div className="flex items-center gap-3 rounded-2xl border border-bamboo bg-coconut p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-caramel/15 text-caramel-dark">
                <Map className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-serif text-lg leading-tight text-deep-forest">Jelajahi Peta Warisan</p>
                <p className="text-xs text-ink-soft">Simulasi · kunjungi desa, buka kartu warisan</p>
              </div>
              <ArrowRight className="h-5 w-5 text-ink-soft" />
            </div>
          </Link>
        </section>

        <section className="space-y-3">
          <SectionTitle flush kicker="Disetujui kurator" title="Warisan terbaru" />
          <div className="space-y-3">
            {featured.map((r) => (
              <Link key={r.id} to={`/learn/jelajah/${r.id}`} className="block">
                <Ornate className="p-4">
                  <ApprovalChip record={r} />
                  <h3 className="mt-2 text-lg leading-snug text-deep-forest">{r.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{r.contributorName} · {r.location}</p>
                </Ornate>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
