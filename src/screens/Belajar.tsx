import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Circle, Lock, ShieldAlert } from 'lucide-react';
import { useStore } from '../store';
import { Ornate, Pill, ProgressBar, SectionTitle } from '../components/ui';

export const Back: React.FC<{ label?: string }> = ({ label = 'Kembali' }) => {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(-1)} className="flex items-center gap-1 px-5 pt-5 text-sm font-semibold text-deep-forest">
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
};

export const Belajar: React.FC = () => {
  const { modules, quests } = useStore();
  return (
    <div className="space-y-6 pb-6 pt-6">
      <div className="px-5">
        <h1 className="text-[30px] leading-tight text-deep-forest">Belajar</h1>
        <p className="mt-1 text-sm text-ink-soft">Empat modul dan misi bersama perajin Cilongok. Semua berbasis darat.</p>
      </div>
      <div className="space-y-3 px-5">
        {modules.map((m) => (
          <Link key={m.id} to={`/learn/belajar/${m.slug}`} className="block">
            <Ornate className="p-4">
              <div className="flex items-center justify-between">
                <Pill>Modul {m.number.replace(/^Modul\s*/i,"")}</Pill>
                <span className="text-xs font-semibold text-ink-soft">{m.duration}</span>
              </div>
              <h3 className="mt-2 text-lg leading-snug text-deep-forest">{m.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{m.subtitle}</p>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar value={m.completionPercent} tone="forest" />
                <span className="text-xs font-semibold text-deep-forest">{m.completionPercent}%</span>
              </div>
            </Ornate>
          </Link>
        ))}
      </div>
      <SectionTitle kicker="Praktik" title="Misi" />
      <div className="space-y-3 px-5">
        {quests.map((q) => (
          <Link key={q.id} to={`/learn/misi/${q.id}`} className="block">
            <Ornate className="p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-caramel-dark">
                {q.completed ? 'Selesai' : `+${q.xpReward} XP`}
              </p>
              <h3 className="text-lg text-deep-forest">{q.title}</h3>
              <p className="text-sm text-ink-soft">{q.indonesianSubtitle}</p>
            </Ornate>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const ModuleDetail: React.FC = () => {
  const { slug } = useParams();
  const { modules, toggleLesson } = useStore();
  const m = modules.find((x) => x.slug === slug);
  if (!m) return <Back />;
  return (
    <div className="space-y-5 pb-6">
      <Back label="Belajar" />
      <div className="space-y-2 px-5">
        <Pill>Modul {m.number.replace(/^Modul\s*/i,"")}</Pill>
        <h1 className="text-[28px] leading-tight text-deep-forest">{m.title}</h1>
        <p className="text-sm leading-relaxed text-ink-soft">{m.description}</p>
        {m.safetyNotice && (
          <div className="flex gap-2 rounded-xl border border-terracotta/30 bg-terracotta/10 p-3 text-sm text-deep-forest">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
            {m.safetyNotice}
          </div>
        )}
      </div>
      <SectionTitle title="Tujuan belajar" />
      <ul className="space-y-1.5 px-5 text-sm text-charcoal">
        {m.objectives.map((o) => (
          <li key={o} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />{o}</li>
        ))}
      </ul>
      <SectionTitle title="Pelajaran" />
      <div className="space-y-2 px-5">
        {m.unlocked ? (
          m.lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => toggleLesson(m.slug, l.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-bamboo bg-coconut p-3 text-left"
            >
              {l.completed ? <Check className="h-5 w-5 text-forest" /> : <Circle className="h-5 w-5 text-bamboo" />}
              <span className="flex-1">
                <span className="block text-sm font-semibold text-deep-forest">{l.title}</span>
                <span className="block text-xs text-ink-soft">{l.type} · {l.duration}</span>
              </span>
            </button>
          ))
        ) : (
          <p className="flex items-center gap-2 text-sm text-ink-soft"><Lock className="h-4 w-4" /> Modul terbuka setelah modul sebelumnya.</p>
        )}
      </div>
      <div className="px-5">
        <Link to={`/learn/misi/${m.associatedQuestId}`} className="block rounded-xl bg-forest py-3 text-center text-sm font-bold text-coconut">
          Mulai misi modul ini
        </Link>
      </div>
    </div>
  );
};

export const QuestDetail: React.FC = () => {
  const { id } = useParams();
  const { quests, completeQuest, showToast } = useStore();
  const q = quests.find((x) => x.id === id);
  if (!q) return <Back />;
  return (
    <div className="space-y-5 pb-6">
      <Back label="Belajar" />
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
          className="w-full rounded-xl bg-forest py-3 text-sm font-bold text-coconut disabled:bg-sage disabled:text-deep-forest"
        >
          {q.completed ? 'Misi selesai' : 'Simulasikan selesai'}
        </button>
        <p className="mt-2 text-xs text-ink-soft">Validasi kompetensi darat dilakukan manusia (mentor), bukan aplikasi.</p>
      </div>
    </div>
  );
};
