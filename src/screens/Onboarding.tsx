import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Scene, SceneKind } from '../art/Scene';
import { Nira, NiraMood } from '../art/Nira';
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
    <div className="flex h-full min-h-[600px] flex-col bg-cream">
      <div className="relative h-[52%] min-h-[280px] overflow-hidden rounded-b-[36px]">
        <Scene key={slide.kind} kind={slide.kind} className="absolute inset-0 h-full w-full" />
        <LangToggle className="absolute left-4 top-4 z-10" />
        <button
          type="button"
          onClick={done}
          className="absolute right-4 top-4 min-h-[44px] rounded-full bg-coconut/90 px-4 text-sm font-semibold text-deep-forest"
        >
          {t('Lewati', 'Skip')}
        </button>
        <div className="absolute -bottom-2 left-5">
          <Nira mood={slide.mood} size={84} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <h1 key={`t${i}`} className="text-[28px] leading-tight text-deep-forest" style={{ animation: 'fade-up .4s both' }}>
          {slide.title}
        </h1>
        <p key={`p${i}`} className="mt-2 text-base leading-relaxed text-ink-soft" style={{ animation: 'fade-up .4s .05s both' }}>
          {slide.text}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex gap-1" role="tablist" aria-label="Slide">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={`Slide ${n + 1}`}
                onClick={() => setI(n)}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-caramel' : 'w-2 bg-bamboo'}`} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => (last ? done() : setI(i + 1))}
            className="flex min-h-[48px] items-center gap-2 rounded-full bg-forest px-6 text-base font-semibold text-coconut"
          >
            {last ? t('Mulai', 'Start') : t('Lanjut', 'Next')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
