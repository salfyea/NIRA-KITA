import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Nira } from '../art/Nira';
import { Scene } from '../art/Scene';
import { useStore } from '../store';
import { useTour } from '../tour/TourContext';
import { LangToggle, t } from '../i18n';

const field =
  'mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-coconut px-4 text-base text-charcoal placeholder:text-ink-soft focus:border-forest';

/** Masuk atau daftar (simulasi): menerima isian apa saja, kata sandi tidak disimpan. */
export const Masuk: React.FC = () => {
  const tt = t;
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
    <div className="flex min-h-full flex-col bg-cream">
      <div className="relative h-[200px] shrink-0 overflow-hidden rounded-b-[36px]">
        <Scene kind="splash" className="absolute inset-0 h-full w-full" />
        <LangToggle className="absolute right-3 top-3 z-10" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <Nira mood="wave" size={92} />
        </div>
      </div>
      <div className="flex-1 px-6 pb-8 pt-4">
        <h1 className="text-center text-[28px] text-deep-forest">{tab === 'masuk' ? t('Selamat datang kembali', 'Welcome back') : t('Gabung jadi Pelajar', 'Join as a Learner')}</h1>
        <div className="mx-auto mt-4 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {(['masuk', 'daftar'] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`min-h-[44px] rounded-full text-sm font-semibold ${tab === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}
            >
              {k === 'masuk' ? tt('Masuk', 'Sign in') : tt('Daftar', 'Sign up')}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-4 space-y-3">
          {tab === 'daftar' && (
            <label className="block text-sm font-semibold text-deep-forest">
              {tt('Nama', 'Name')}
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={tt('Nama panggilanmu', 'Your nickname')} autoComplete="name" />
            </label>
          )}
          <label className="block text-sm font-semibold text-deep-forest">
            Email
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tt('nama@contoh.id', 'name@example.com')} autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            {tt('Kata sandi', 'Password')}
            <input className={field} type="password" placeholder={tt('Isi apa saja', 'Anything works')} autoComplete="off" />
          </label>
          <button type="submit" className="min-h-[52px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut">
            {tab === 'masuk' ? tt('Masuk', 'Sign in') : tt('Daftar dan mulai', 'Sign up and start')}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-ink-soft">{tt('Simulasi: isian apa saja diterima dan kata sandi tidak disimpan.', 'Simulation: any input is accepted and no password is stored.')}</p>
        <div className="mt-4 text-center">
          <Link to="/kode-undangan" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-forest underline underline-offset-4">
            {tt('Punya kode undangan?', 'Have an invite code?')}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => tour.start(0)}
          className="mx-auto mt-2 flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark"
        >
          {tt('Juri atau tamu? Mulai tur 4 menit', 'Judge or guest? Start the 4-minute tour')}
        </button>
      </div>
    </div>
  );
};
