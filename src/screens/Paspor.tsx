import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Lock, Map } from 'lucide-react';
import { useStore } from '../store';
import { Mascot, Ornate, SectionTitle } from '../components/ui';

export const Paspor: React.FC = () => {
  const { badges, records, collected, level, xp } = useStore();
  const cards = records.filter((r) => collected.includes(r.id));
  return (
    <div className="space-y-6 pb-6 pt-6">
      <div className="flex items-center gap-3 px-5">
        <Mascot size={56} mood="cheer" />
        <div>
          <h1 className="text-[28px] leading-tight text-deep-forest">Paspor Warisan</h1>
          <p className="text-sm text-ink-soft">{level.indonesianName} · {xp} XP</p>
        </div>
      </div>
      <div className="px-5">
        <Link to="/learn/peta" className="flex items-center gap-3 rounded-2xl bg-forest p-4 text-coconut">
          <Map className="h-6 w-6" />
          <div className="flex-1">
            <p className="font-serif text-lg leading-tight">Jelajahi Peta</p>
            <p className="text-xs text-sage">{cards.length} kartu terkumpul · simulasi</p>
          </div>
        </Link>
      </div>
      <SectionTitle title="Lencana" />
      <div className="grid grid-cols-2 gap-3 px-5">
        {badges.map((b) => (
          <Ornate key={b.id} className={`p-3 ${b.unlocked ? '' : 'bg-bamboo/20'}`}>
            {b.unlocked ? <Award className="h-6 w-6 text-caramel-dark" /> : <Lock className="h-6 w-6 text-ink-soft" />}
            <p className="mt-1 text-sm font-semibold leading-tight text-deep-forest">{b.indonesianTitle}</p>
            <p className="mt-1 text-[11px] text-ink-soft">
              {b.unlocked ? b.dateAchieved : b.validationType === 'Tervalidasi Mentor (Dasar Darat)' ? 'Menunggu mentor' : 'Terkunci'}
            </p>
          </Ornate>
        ))}
      </div>
      <SectionTitle title="Kartu terkumpul" />
      <div className="space-y-3 px-5">
        {cards.map((r) => (
          <Link key={r.id} to={`/learn/jelajah/${r.id}`} className="block">
            <Ornate className="p-4">
              <h3 className="text-lg leading-snug text-deep-forest">{r.title}</h3>
              <p className="text-xs text-ink-soft">{r.location}</p>
            </Ornate>
          </Link>
        ))}
      </div>
    </div>
  );
};
