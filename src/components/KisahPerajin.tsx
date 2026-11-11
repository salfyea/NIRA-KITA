import React from 'react';
import { Droplets, Flame, Heart, MapPin, Quote, Timer } from 'lucide-react';
import { Scene } from '../art/Scene';
import { attribution } from '../data/attribution';
import { HeritageRecord } from '../types/jejakNira';
import { ApprovalChip } from './ui';

/** Foto narasumber ditaruh di public/tokoh/. Selama belum ada, tampil ilustrasi siluet tanpa wajah. */
const PORTRAITS: Record<string, string> = {
  'Pak Parmadi': '/tokoh/pak-parmadi.jpg',
};

const splitTranscript = (t: string) => {
  const m = t.match(/^"(.+?)"\s*\(Terjemahan[^:]*:\s*(.+)\)\s*$/s);
  return m ? { local: m[1].replace(/\.\.\.$/, '…'), id: m[2] } : { local: t, id: '' };
};

const years = (role: string) => role.match(/(\d+)\s*Tahun/i)?.[1];
const village = (loc: string) => loc.replace(/^Desa\s+/i, '').split(',')[0];

const Portrait: React.FC<{ name: string }> = ({ name }) => {
  const [broken, setBroken] = React.useState(false);
  const src = PORTRAITS[name];
  if (src && !broken) {
    return <img src={src} alt={`Foto ${name}`} onError={() => setBroken(true)} className="h-24 w-24 shrink-0 rounded-2xl border-2 border-coconut object-cover shadow-md" />;
  }
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-coconut shadow-md" aria-hidden>
      <Scene kind="penderes" className="absolute inset-0 h-full w-full" />
    </div>
  );
};

/** Kisah singkat dan menarik tentang orang di balik kemasan: profil, kutipan, tiga kartu, lalu jembatan ke produk. */
export const KisahPerajin: React.FC<{ record: HeritageRecord }> = ({ record: r }) => {
  const { local, id } = splitTranscript(r.audioTranscript);
  const sentences = r.culturalExplanation.split(/(?<=\.)\s+/).filter(Boolean);
  const yrs = years(r.contributorRole);
  const role = r.contributorRole.replace(/\s*\(.*?\)\s*/g, '').trim();

  const cards = [
    { Icon: Droplets, tone: 'bg-[#E3EFD6] text-forest', t: 'Kenapa bersih itu penting', d: sentences[0] },
    { Icon: Flame, tone: 'bg-[#F8E3C8] text-caramel-dark', t: 'Cara merawatnya', d: sentences[1] },
    { Icon: Heart, tone: 'bg-[#F5D9D2] text-[#9E4F37]', t: 'Dirawat seperti keluarga', d: id || sentences[2] },
  ].filter((c) => c.d);

  return (
    <div className="mt-3 space-y-4">
      {/* profil */}
      <div className="ornate p-4">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <div className="flex gap-4">
          <Portrait name={r.contributorName} />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Di balik gula ini</p>
            <h3 className="font-serif text-[28px] leading-none text-deep-forest">{r.contributorName}</h3>
            <p className="mt-1 text-sm leading-snug text-ink-soft">{role}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {yrs && (
            <span className="inline-flex items-center gap-1 rounded-full bg-caramel/15 px-3 py-1 text-xs font-bold text-caramel-dark">
              <Timer className="h-3.5 w-3.5" /> {yrs} tahun menderes
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
            <MapPin className="h-3.5 w-3.5" /> Desa {village(r.location)}
          </span>
        </div>
      </div>

      {/* kutipan */}
      <figure className="rounded-2xl border-l-4 border-caramel bg-coconut p-4">
        <Quote className="h-6 w-6 text-caramel" />
        <blockquote className="mt-1 font-serif text-xl italic leading-snug text-deep-forest">{local}</blockquote>
        {id && <p className="mt-2 text-sm leading-relaxed text-ink-soft">Artinya: {id}</p>}
        <figcaption className="mt-2 text-xs font-semibold text-ink-soft">{attribution(r)}</figcaption>
      </figure>

      {/* tiga kartu cerita */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Cerita dalam {cards.length} kartu · geser</p>
        <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1">
          {cards.map(({ Icon, tone, t, d }, i) => (
            <article key={t} className="w-[78%] shrink-0 snap-center rounded-2xl border border-bamboo bg-coconut p-4 shadow-[0_6px_16px_-10px_rgba(24,56,44,0.5)]">
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-xs font-bold text-ink-soft">
                {i + 1} / {cards.length}
              </p>
              <h4 className="mt-0.5 text-lg leading-tight text-deep-forest">{t}</h4>
              <p className="mt-1.5 text-base leading-relaxed text-charcoal">{d}</p>
            </article>
          ))}
        </div>
      </div>

      {/* jembatan ke produk */}
      <p className="rounded-2xl bg-forest px-4 py-3 text-base leading-relaxed text-coconut">
        Wadah yang dirawat dengan cermat itulah yang menjaga nira tetap segar sampai ke wajan. Dari nira inilah gula kelapa di tanganmu dibuat.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <ApprovalChip record={r} />
        {r.isIllustrativePlaceholder && <span className="text-xs text-ink-soft">Data ilustratif</span>}
      </div>
    </div>
  );
};
