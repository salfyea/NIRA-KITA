import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Hammer } from 'lucide-react';
import { Nira } from '../art/Nira';
import { useStore } from '../store';

const ROLES: Record<string, string> = {
  'MENTOR-2026': 'Mentor',
  'KURATOR-2026': 'Kurator',
  'ADMIN-2026': 'Admin',
};

/** Kode undangan untuk Mentor, Kurator, dan Admin. Tampilan peran masih placeholder yang rapi. */
export const KodeUndangan: React.FC = () => {
  const [code, setCode] = React.useState('');
  const [role, setRole] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);
  const { signIn } = useStore();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = ROLES[code.trim().toUpperCase()];
    if (r === 'Mentor' || r === 'Kurator' || r === 'Admin') {
      const map = { Mentor: ['Pak Parmadi (mentor demo)', 'mentor', '/mentor'], Kurator: ['Kurator Budaya (demo)', 'curator', '/kurator'], Admin: ['Admin Program (demo)', 'admin', '/admin'] } as const;
      const [nm, role, to] = map[r];
      signIn(nm, role);
      navigate(to, { replace: true });
      return;
    }
    setRole(r ?? null);
    setError(!r);
  };

  return (
    <div className="min-h-full bg-cream px-6 pb-8 pt-4">
      <Link to="/masuk" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-forest">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      {role ? (
        <div className="mt-6 flex flex-col items-center text-center">
          <Nira mood="think" size={110} />
          <div className="ornate mt-6 w-full p-5">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <Hammer className="mx-auto h-6 w-6 text-caramel-dark" />
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Peran {role}</p>
            <h1 className="mt-1 text-2xl text-deep-forest">Tampilan peran ini sedang disiapkan</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Kodenya valid. Untuk saat ini prototipe baru memperlihatkan pengalaman Pelajar. Tampilan {role} akan hadir di tahap berikutnya.
            </p>
          </div>
          <Link to="/masuk" className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-forest px-6 text-base font-semibold text-coconut">
            Kembali ke halaman masuk
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <h1 className="text-[28px] leading-tight text-deep-forest">Kode undangan</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Untuk Mentor, Kurator, dan Admin. Pelajar tidak perlu kode, cukup daftar dari halaman masuk.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block text-sm font-semibold text-deep-forest">
              Kode
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Contoh: MENTOR-2026"
                autoCapitalize="characters"
                aria-invalid={error}
                className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-coconut px-4 text-base uppercase text-charcoal placeholder:normal-case placeholder:text-ink-soft"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm font-semibold text-terracotta">
                Kode tidak dikenali. Periksa lagi ya.
              </p>
            )}
            <button type="submit" className="min-h-[52px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut">
              Gunakan kode
            </button>
          </form>
          <p className="mt-4 text-xs text-ink-soft">Kode contoh untuk demo: MENTOR-2026, KURATOR-2026, ADMIN-2026.</p>
        </div>
      )}
    </div>
  );
};
