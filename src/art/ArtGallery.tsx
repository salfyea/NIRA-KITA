import React from 'react';
import { Scene, SceneKind } from './Scene';
import { Nira, NiraMood } from './Nira';

const KINDS: SceneKind[] = ['splash', 'penderes', 'memudar', 'bersama', 'identitas', 'kerajinan', 'keselamatan', 'keberlanjutan'];
const MOODS: NiraMood[] = ['happy', 'cheer', 'think', 'wave', 'sleep'];

/** Halaman bantu pengembang untuk memeriksa semua ilustrasi (/galeri-art). */
export const ArtGallery: React.FC = () => (
  <div className="paper min-h-dvh p-4">
    <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
      {KINDS.map((k) => (
        <figure key={k} className="overflow-hidden rounded-2xl border border-bamboo bg-coconut">
          <Scene kind={k} className="block aspect-[13/10] w-full" />
          <figcaption className="px-3 py-2 text-sm font-semibold text-deep-forest">{k}</figcaption>
        </figure>
      ))}
    </div>
    <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-end justify-center gap-6">
      {MOODS.map((m) => (
        <div key={m} className="text-center text-sm font-semibold text-deep-forest">
          <Nira mood={m} size={90} />
          {m}
        </div>
      ))}
    </div>
  </div>
);
