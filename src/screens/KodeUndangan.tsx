import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nira } from '../art/Nira';
import { Frond, LeafArrow } from '../art/Organic';
import { useStore } from '../store';
import { t } from '../i18n';

/** Kode undangan staf. Setiap kode membuka akun demo peran yang sesuai. */
const ROLES: Record<string, [name: string, role: 'mentor' | 'curator' | 'admin' | 'enterprise', to: string]> = {
  'MENTOR-2026': ['Pak Parmadi (mentor demo)', 'mentor', '/mentor'],
  'KURATOR-2026': ['Kurator Budaya (demo)', 'curator', '/kurator'],
  'ADMIN-2026': ['Admin Program (demo)', 'admin', '/admin'],
  'ENTERPRISE-2026': ['Koperasi NIRA (demo)', 'enterprise', '/enterprise'],
};

export const KodeUndangan: React.FC = () => {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState(false);
  const { signIn } = useStore();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const hit = ROLES[code.trim().toUpperCase()];
    if (!hit) {
      setError(true);
      return;
    }
    signIn(hit[0], hit[1]);
    navigate(hit[2], { replace: true });
  };

  return (
    <div className="grain relative min-h-full bg-cream px-7 pb-8 pt-3">
      <Link to="/masuk" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-forest">
        <LeafArrow flip className="h-5 w-5" /> {t('Kembali', 'Back')}
      </Link>

      <div className="mt-2 flex flex-col items-center text-center">
        <Nira mood="think" size={92} />
        <h1 className="mt-3 font-serif text-[30px] leading-tight text-deep-forest">{t('Kode undangan', 'Invite code')}</h1>
        <Frond className="mt-1" />
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('Untuk Mentor, Kurator, Admin, dan Enterprise. Pelajar tidak perlu kode, cukup daftar dari halaman masuk.', 'For Mentors, Curators, Admins, and Enterprise. Learners do not need a code; just sign up from the sign-in page.')}</p>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3.5">
        <label className="block text-sm font-semibold text-deep-forest">
          {t('Kode', 'Code')}
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder={t('Contoh: MENTOR-2026', 'Example: MENTOR-2026')}
            autoCapitalize="characters"
            aria-invalid={error}
            className="mt-1 min-h-[50px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-coconut px-4 text-base uppercase tracking-wide text-charcoal shadow-[inset_0_2px_4px_rgba(24,56,44,0.06)] placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-soft/80 focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm font-semibold text-terracotta">
            {t('Kode tidak dikenali. Periksa lagi ya.', 'Code not recognised. Please check it again.')}
          </p>
        )}
        <button type="submit" className="btn-sticker flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[28px_32px_26px_32px] bg-caramel-dark text-base font-semibold text-coconut">
          {t('Gunakan kode', 'Use code')} <LeafArrow className="h-5 w-5" />
        </button>
      </form>
      <p className="mt-4 text-center text-xs leading-snug text-ink-soft">{t('Kode contoh untuk demo: MENTOR-2026, KURATOR-2026, ADMIN-2026, ENTERPRISE-2026.', 'Demo codes: MENTOR-2026, KURATOR-2026, ADMIN-2026, ENTERPRISE-2026.')}</p>
    </div>
  );
};
