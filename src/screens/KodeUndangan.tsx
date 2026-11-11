import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Hammer } from 'lucide-react';
import { Nira } from '../art/Nira';
import { useStore } from '../store';
import { t } from '../i18n';

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
        <ArrowLeft className="h-4 w-4" /> {t('Kembali', 'Back')}
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
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Peran', 'Role')} {role}</p>
            <h1 className="mt-1 text-2xl text-deep-forest">{t('Tampilan peran ini sedang disiapkan', 'This role view is being prepared')}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {t('Kodenya valid. Untuk saat ini prototipe baru memperlihatkan pengalaman Pelajar. Tampilan', 'The code is valid. For now the prototype only shows the Learner experience. The')} {role} {t('akan hadir di tahap berikutnya.', 'view will come in a later stage.')}
            </p>
          </div>
          <Link to="/masuk" className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-forest px-6 text-base font-semibold text-coconut">
            {t('Kembali ke halaman masuk', 'Back to sign in')}
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <h1 className="text-[28px] leading-tight text-deep-forest">{t('Kode undangan', 'Invite code')}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t('Untuk Mentor, Kurator, dan Admin. Pelajar tidak perlu kode, cukup daftar dari halaman masuk.', 'For Mentors, Curators, and Admins. Learners do not need a code; just sign up from the sign-in page.')}
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block text-sm font-semibold text-deep-forest">
              {t('Kode', 'Code')}
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('Contoh: MENTOR-2026', 'Example: MENTOR-2026')}
                autoCapitalize="characters"
                aria-invalid={error}
                className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-coconut px-4 text-base uppercase text-charcoal placeholder:normal-case placeholder:text-ink-soft"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm font-semibold text-terracotta">
                {t('Kode tidak dikenali. Periksa lagi ya.', 'Code not recognised. Please check it again.')}
              </p>
            )}
            <button type="submit" className="min-h-[52px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut">
              {t('Gunakan kode', 'Use code')}
            </button>
          </form>
          <p className="mt-4 text-xs text-ink-soft">{t('Kode contoh untuk demo: MENTOR-2026, KURATOR-2026, ADMIN-2026.', 'Demo codes: MENTOR-2026, KURATOR-2026, ADMIN-2026.')}</p>
        </div>
      )}
    </div>
  );
};
