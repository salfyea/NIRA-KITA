import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Nira } from '../art/Nira';
import { Scene } from '../art/Scene';
import { useStore } from '../store';

const field =
  'mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-coconut px-4 text-base text-charcoal placeholder:text-ink-soft focus:border-forest';

/** Masuk atau daftar (simulasi): menerima isian apa saja, kata sandi tidak disimpan. */
export const Masuk: React.FC = () => {
  const { session, signIn } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<'masuk' | 'daftar'>('masuk');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  if (session) return <Navigate to="/learn" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(name || email.split('@')[0]);
    navigate('/learn', { replace: true });
  };

  return (
    <div className="flex min-h-full flex-col bg-cream">
      <div className="relative h-[200px] shrink-0 overflow-hidden rounded-b-[36px]">
        <Scene kind="splash" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <Nira mood="wave" size={92} />
        </div>
      </div>
      <div className="flex-1 px-6 pb-8 pt-4">
        <h1 className="text-center text-[28px] text-deep-forest">{tab === 'masuk' ? 'Selamat datang kembali' : 'Gabung jadi Pelajar'}</h1>
        <div className="mx-auto mt-4 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {(['masuk', 'daftar'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`min-h-[44px] rounded-full text-sm font-semibold ${tab === t ? 'bg-forest text-coconut' : 'text-ink-soft'}`}
            >
              {t === 'masuk' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-4 space-y-3">
          {tab === 'daftar' && (
            <label className="block text-sm font-semibold text-deep-forest">
              Nama
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama panggilanmu" autoComplete="name" />
            </label>
          )}
          <label className="block text-sm font-semibold text-deep-forest">
            Email
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@contoh.id" autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            Kata sandi
            <input className={field} type="password" placeholder="Isi apa saja" autoComplete="off" />
          </label>
          <button type="submit" className="min-h-[52px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut">
            {tab === 'masuk' ? 'Masuk' : 'Daftar dan mulai'}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-ink-soft">Simulasi: isian apa saja diterima dan kata sandi tidak disimpan.</p>
        <div className="mt-4 text-center">
          <Link to="/kode-undangan" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-forest underline underline-offset-4">
            Punya kode undangan?
          </Link>
        </div>
      </div>
    </div>
  );
};
