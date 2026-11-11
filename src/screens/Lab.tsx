import React from 'react';
import { GitBranch, Layers, NotebookPen, Users } from 'lucide-react';
import { Ornate, Pill } from '../components/ui';

const ITEMS = [
  { Icon: GitBranch, title: 'Graf Pengetahuan', desc: 'Hubungan antar alat, istilah, dan tahapan proses.' },
  { Icon: Layers, title: 'Variasi Praktik', desc: 'Perbedaan cara antar desa, dicatat tanpa menilai.' },
  { Icon: Users, title: 'Co-creation', desc: 'Pelajar dan perajin menyusun cerita bersama.' },
  { Icon: NotebookPen, title: 'Jurnal Belajar', desc: 'Catatan refleksi pribadi untuk mentor.' },
];

export const Lab: React.FC = () => (
  <div className="space-y-4 px-5 pb-6 pt-6">
    <div>
      <h1 className="text-[30px] leading-tight text-deep-forest">Lab</h1>
      <p className="mt-1 text-sm text-ink-soft">Ruang eksplorasi lanjutan. Semua kartu di bawah masih konsep visi.</p>
    </div>
    {ITEMS.map(({ Icon, title, desc }) => (
      <Ornate key={title} className="flex items-start gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-coconut"><Icon className="h-5 w-5" /></span>
        <div className="flex-1">
          <h3 className="text-lg leading-tight text-deep-forest">{title}</h3>
          <p className="mb-2 text-sm text-ink-soft">{desc}</p>
          <Pill>Konsep visi</Pill>
        </div>
      </Ornate>
    ))}
  </div>
);
