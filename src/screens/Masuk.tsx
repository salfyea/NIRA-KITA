import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Nira } from '../art/Nira';
import { Scene } from '../art/Scene';
import { Frond, LeafArrow, Swash, WaveEdge } from '../art/Organic';
import { useStore } from '../store';
import { useTour } from '../tour/TourContext';
import { LangToggle, t } from '../i18n';

const field =
  'mt-1 min-h-[50px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-coconut px-4 text-base text-charcoal shadow-[inset_0_2px_4px_rgba(24,56,44,0.06)] placeholder:text-ink-soft/80 focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30';

/** Masuk atau daftar (simulasi): menerima isian apa saja, kata sandi tidak disimpan. */
export const Masuk: React.FC = () => {
  const { session, signIn } = useStore();
  const tour = useTour();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<'masuk' | 'daftar'>('masuk');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  if (session) return <Navigate to={session.role === 'curator' ? '/kurator' : session.role === 'mentor' ? '/mentor' : session.role === 'admin' ? '/admin' : session.role === 'enterprise' ? '/enterprise' : '/learn'} replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(name || email.split('@')[0]);
    navigate('/learn', { replace: true });
  };

  return (
    <div className="grain relative flex min-h-full flex-col bg-cream">
      <div className="relative h-[214px] shrink-0 overflow-hidden">
        <Scene kind="splash" className="absolute inset-0 h-full w-full" />
        <WaveEdge />
        <div className="absolute inset-x-0 bottom-1 z-10 flex justify-center">
          <Nira mood="wave" size={86} />
        </div>
      </div>

      <div className="relative z-10 flex-1 px-7 pb-8 pt-0">
        <div className="-mb-1 flex justify-end">
          <LangToggle tone="text" className="-mr-2" />
        </div>
        <h1 className="text-center font-serif text-[30px] leading-tight text-deep-forest">{tab === 'masuk' ? t('Selamat datang kembali', 'Welcome back') : t('Gabung jadi Pelajar', 'Join as a Learner')}</h1>
        <Frond className="mx-auto mt-1" />

        <div className="mt-2 flex justify-center gap-10" role="tablist">
          {(['masuk', 'daftar'] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`relative min-h-[44px] px-1 pb-2 text-base font-semibold ${tab === k ? 'text-deep-forest' : 'text-ink-soft'}`}>
              {k === 'masuk' ? t('Masuk', 'Sign in') : t('Daftar', 'Sign up')}
              {tab === k && <Swash />}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-3 space-y-3.5">
          {tab === 'daftar' && (
            <label className="block text-sm font-semibold text-deep-forest">
              {t('Nama', 'Name')}
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Nama panggilanmu', 'Your nickname')} />
            </label>
          )}
          <label className="block text-sm font-semibold text-deep-forest">
            Email
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('nama@contoh.id', 'name@example.com')} />
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Kata sandi', 'Password')}
            <input className={field} type="password" placeholder={t('Isi apa saja', 'Anything works')} autoComplete="off" />
          </label>
          <button type="submit" className="btn-sticker flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[28px_32px_26px_32px] bg-caramel-dark text-base font-semibold text-coconut">
            {tab === 'masuk' ? t('Masuk', 'Sign in') : t('Daftar dan mulai', 'Sign up and start')} <LeafArrow className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-3 text-center text-xs leading-snug text-ink-soft">{t('Simulasi: isian apa saja diterima dan kata sandi tidak disimpan.', 'Simulation: any input is accepted and no password is stored.')}</p>

        <div className="mt-3 text-center">
          <Link to="/kode-undangan" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-forest underline decoration-caramel decoration-2 underline-offset-[5px]">
            {t('Punya kode undangan?', 'Have an invite code?')}
          </Link>
        </div>

        <button type="button" onClick={() => tour.start(0)} className="mx-auto mt-1 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[30px_26px_32px_26px] border-2 border-dashed border-caramel-dark text-base font-semibold text-caramel-dark">
          {t('Juri atau tamu? Mulai tur 4 menit', 'Judge or guest? Start the 4-minute tour')}
        </button>
      </div>
    </div>
  );
};
