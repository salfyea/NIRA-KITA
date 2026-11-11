import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scene } from '../art/Scene';
import { Nira } from '../art/Nira';
import { useStore } from '../store';
import { LangToggle, t } from '../i18n';

/** Layar pembuka 1,8 detik, lalu ke onboarding (pertama kali), masuk, atau perjalanan. */
export const Splash: React.FC = () => {
  const { session, onboarded } = useStore();
  const navigate = useNavigate();
  const target = session ? '/learn' : onboarded ? '/masuk' : '/onboarding';

  React.useEffect(() => {
    const t = setTimeout(() => navigate(target, { replace: true }), 1800);
    return () => clearTimeout(t);
  }, [navigate, target]);

  return (
    <div className="relative h-full min-h-[600px] overflow-hidden bg-cream">
      <Scene kind="splash" className="absolute inset-0 h-full w-full" />
      <LangToggle className="absolute right-3 top-3 z-10" />
      <div className="absolute inset-x-0 top-[14%] flex flex-col items-center px-6 text-center">
        <h1 className="text-5xl leading-none text-deep-forest drop-shadow-[0_2px_0_rgba(255,253,248,0.6)]">NIRA KITA</h1>
        <p className="mt-2 text-sm font-semibold text-forest">{t('Jejak pengetahuan, warisan masa depan', 'Trail of knowledge, heritage for the future')}</p>
      </div>
      <div className="absolute inset-x-0 bottom-[14%] flex flex-col items-center">
        <Nira mood="wave" size={120} />
        <p className="mt-2 rounded-full bg-coconut/90 px-4 py-1.5 text-sm font-semibold text-deep-forest">{t('Halo, ayo belajar bareng Nira', 'Hi, let\'s learn with Nira')}</p>
      </div>
      <button type="button" className="sr-only" onClick={() => navigate(target, { replace: true })}>
        {t('Lanjut', 'Continue')}
      </button>
    </div>
  );
};
