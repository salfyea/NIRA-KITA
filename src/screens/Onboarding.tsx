import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scene, SceneKind } from '../art/Scene';
import { Nira, NiraMood } from '../art/Nira';
import { Frond, LeafArrow, SproutDots, WaveEdge } from '../art/Organic';
import { useStore } from '../store';
import { LangToggle, t } from '../i18n';

const getSlides = (): { kind: SceneKind; mood: NiraMood; title: string; text: string }[] => [
  {
    kind: 'penderes',
    mood: 'wave',
    title: t('Fajar di kebun kelapa', 'Dawn in the coconut grove'),
    text: t('Di Cilongok, Banyumas, penderes menyadap nira saat fajar. Dari tetes bening itulah gula kelapa lahir.', 'In Cilongok, Banyumas, tappers collect sap at dawn. From those clear drops, coconut sugar is born.'),
  },
  {
    kind: 'memudar',
    mood: 'think',
    title: t('Pengetahuan mulai memudar', 'Knowledge is starting to fade'),
    text: t('Alat, istilah, dan cara lama tidak selalu tertulis. Kalau tak diceritakan, perlahan ia hilang.', 'Tools, terms, and old ways are not always written down. If they are not told, they slowly disappear.'),
  },
  {
    kind: 'bersama',
    mood: 'cheer',
    title: t('Kita jaga bareng', 'We keep it together'),
    text: t('Pelajar, perajin, dan kurator belajar dan mencatat bersama, dengan izin dan nama narasumber dihormati.', 'Learners, artisans, and curators learn and record together, with the permission and names of sources respected.'),
  },
];

export const Onboarding: React.FC = () => {
  const SLIDES = getSlides();
  const [i, setI] = React.useState(0);
  const { finishOnboarding } = useStore();
  const navigate = useNavigate();
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  const done = () => {
    finishOnboarding();
    navigate('/masuk', { replace: true });
  };

  return (
    <div className="grain relative flex h-full min-h-[600px] flex-col bg-cream">
      <div className="relative h-[61%] min-h-[320px] overflow-hidden">
        <Scene key={slide.kind} kind={slide.kind} className="absolute inset-0 h-full w-full" />
        <LangToggle tone="text" className="absolute left-2 top-3 z-10" />
        <button type="button" onClick={done} className="absolute right-3 top-3 z-10 min-h-[44px] px-3 text-sm font-semibold text-deep-forest underline decoration-caramel decoration-2 underline-offset-[5px]">
          {t('Lewati', 'Skip')}
        </button>
        <WaveEdge />
        <div className="absolute bottom-3 left-5 z-10">
          <Nira mood={slide.mood} size={88} />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-7 pb-6 pt-2">
        <Frond className="-ml-1" />
        <h1 key={`t${i}`} className="mt-1 font-serif text-[29px] leading-tight text-deep-forest" style={{ animation: 'fade-up .4s both' }}>
          {slide.title}
        </h1>
        <p key={`p${i}`} className="mt-2 text-[16px] leading-relaxed text-ink-soft" style={{ animation: 'fade-up .4s .05s both' }}>
          {slide.text}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <SproutDots count={SLIDES.length} index={i} onSelect={setI} />
          <button type="button" onClick={() => (last ? done() : setI(i + 1))} className="btn-sticker flex min-h-[52px] items-center gap-2 rounded-[26px_30px_24px_30px] bg-forest px-6 text-base font-semibold text-coconut">
            {last ? t('Mulai', 'Start') : t('Lanjut', 'Next')} <LeafArrow className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
