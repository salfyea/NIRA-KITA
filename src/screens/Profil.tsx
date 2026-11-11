import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Lock, LogOut, RotateCcw, UserCheck } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Ornate, ProgressBar } from '../components/ui';
import { useStore } from '../store';

export const Profil: React.FC = () => {
  const { session, level, nextLevel, xp, badges, reset, signOut, showToast } = useStore();
  const navigate = useNavigate();
  const toNext = nextLevel ? Math.round(((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100) : 100;

  return (
    <div className="px-5 pb-6 pt-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-28 w-28 items-end justify-center overflow-hidden rounded-full border-4 border-caramel bg-gradient-to-b from-[#FBE9C9] to-[#DCE6C4]">
          <Nira mood="happy" size={78} float={false} className="mb-1" />
        </div>
        <h1 className="mt-3 text-[28px] leading-tight text-deep-forest">{session?.name}</h1>
        <p className="text-sm font-semibold text-ink-soft">Pelajar · Level {level.level} {level.indonesianName}</p>
      </div>

      <Ornate className="mt-4 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-deep-forest">{xp} XP</p>
          <p className="text-xs text-ink-soft">{nextLevel ? `${nextLevel.minXp - xp} XP menuju ${nextLevel.indonesianName}` : 'Level tertinggi'}</p>
        </div>
        <ProgressBar value={toNext} className="mt-2" />
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{level.description}</p>
      </Ornate>

      <h2 className="mt-6 text-[22px] text-deep-forest">Lencana</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {badges.map((b) => {
          const mentor = b.validationType !== 'Penyelesaian Digital';
          return (
            <div key={b.id} className={`ornate p-3 ${b.unlocked ? '' : 'bg-bamboo/30'}`}>
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  b.unlocked ? 'bg-caramel text-coconut' : 'bg-deep-forest/15 text-deep-forest'
                }`}
              >
                {b.unlocked ? <Award className="h-5 w-5" /> : mentor ? <UserCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </span>
              <p className="mt-2 text-sm font-semibold leading-snug text-deep-forest">{b.indonesianTitle}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                {b.unlocked
                  ? `Diraih ${b.dateAchieved ?? ''}`
                  : mentor
                    ? 'Tervalidasi mentor: terbuka setelah mentor manusia memvalidasi.'
                    : 'Belum diraih'}
              </p>
            </div>
          );
        })}
      </div>

      <h2 className="mt-6 text-[22px] text-deep-forest">Tentang aplikasi</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        NIRA KITA adalah prototipe konsep untuk belajar dan melestarikan pengetahuan gula kelapa Cilongok, Banyumas. Data bersifat ilustratif,
        peta hanyalah simulasi tingkat desa, dan seluruh pembelajaran berbasis darat.
      </p>

      <div className="mt-6 grid gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            showToast('Progres demo disetel ulang.');
          }}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest"
        >
          <RotateCcw className="h-4 w-4" /> Setel ulang demo
        </button>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate('/masuk', { replace: true });
          }}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#9E4F37] text-base font-semibold text-coconut"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </div>
  );
};
