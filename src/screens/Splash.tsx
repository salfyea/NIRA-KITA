import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scene } from '../art/Scene';
import { Nira } from '../art/Nira';
import { Bubble, Frond, GrassBlades, SapDrops } from '../art/Organic';
import { useStore } from '../store';
import { LangToggle, t } from '../i18n';

/** Layar pembuka 1,8 detik, lalu ke onboarding (pertama kali), masuk, atau perjalanan. */
export const Splash: React.FC = () => {
  const { session, onboarded } = useStore();
  const navigate = useNavigate();
  const target = session ? '/learn' : onboarded ? '/masuk' : '/onboarding';

  React.useEffect(() => {
    const timer = setTimeout(() => navigate(target, { replace: true }), 1800);
    return () => clearTimeout(timer);
  }, [navigate, target]);

  return (
    <div className="grain relative h-full min-h-[600px] overflow-hidden bg-cream">
      <Scene kind="splash" className="absolute inset-0 h-full w-full" />
      <LangToggle tone="text" className="absolute right-3 top-3 z-10" />

      <div className="absolute inset-x-0 top-[12%] z-10 flex flex-col items-center px-6 text-center">
        <h1 className="font-serif text-[58px] leading-[0.92] tracking-[0.03em] text-deep-forest drop-shadow-[0_2px_0_rgba(255,243,210,0.7)]">NIRA KITA</h1>
        <Frond className="mt-3" />
        <p className="mt-0.5 font-serif text-[19px] italic leading-snug text-forest">{t('Jejak pengetahuan, warisan masa depan', 'Trail of knowledge, heritage for the future')}</p>
      </div>

      <div className="absolute inset-x-0 bottom-[17%] z-10 flex justify-center">
        <div className="relative">
          <Nira mood="wave" size={124} />
          <Bubble className="absolute left-[78%] top-[-6px] w-[132px]">{t('Halo, ayo belajar bareng Nira', 'Hi, let\'s learn with Nira')}</Bubble>
        </div>
      </div>

      <GrassBlades className="bottom-0" />
      <SapDrops className="absolute inset-x-0 bottom-7 z-10 justify-center" />

      <button type="button" className="sr-only" onClick={() => navigate(target, { replace: true })}>
        {t('Lanjut', 'Continue')}
      </button>
    </div>
  );
};
