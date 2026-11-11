import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../store';
import { Ornate, Pill } from '../components/ui';

/** Detail misi. Penyelesaian di sini simulasi; validasi kompetensi darat dilakukan mentor manusia. */
export const QuestDetail: React.FC = () => {
  const { id } = useParams();
  const { quests, completeQuest, showToast } = useStore();
  const q = quests.find((x) => x.id === id);
  if (!q) return <Navigate to="/learn" replace />;
  return (
    <div className="space-y-5 pb-6">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 px-5 pt-4 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> Perjalanan
      </Link>
      <div className="space-y-2 px-5">
        <Pill tone="forest">+{q.xpReward} XP</Pill>
        <h1 className="text-[28px] leading-tight text-deep-forest">{q.title}</h1>
        <p className="text-sm text-ink-soft">{q.description}</p>
      </div>
      <div className="space-y-2 px-5">
        {q.steps.map((s, i) => (
          <Ornate key={s.id} className="flex gap-3 p-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.completed ? 'bg-forest text-coconut' : 'bg-bamboo/60 text-deep-forest'}`}>
              {s.completed ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-deep-forest">{s.title}</p>
              <p className="text-xs text-ink-soft">{s.description}</p>
            </div>
          </Ornate>
        ))}
      </div>
      <div className="px-5">
        <button
          disabled={q.completed}
          onClick={() => {
            completeQuest(q.id);
            showToast(`Misi selesai! +${q.xpReward} XP. Lencana tervalidasi mentor tetap menunggu mentor.`);
          }}
          className="min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
        >
          {q.completed ? 'Misi selesai' : 'Simulasikan selesai'}
        </button>
        <p className="mt-2 text-xs text-ink-soft">Validasi kompetensi darat dilakukan manusia (mentor), bukan aplikasi.</p>
      </div>
    </div>
  );
};
