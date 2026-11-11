import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, Clock, Film } from 'lucide-react';
import { isLearnerVisible, useStore } from '../store';
import { ApprovalChip, Mascot, Ornate, Pill } from '../components/ui';
import { Back } from './Belajar';

export const Jelajahi: React.FC = () => {
  const { records } = useStore();
  const [tab, setTab] = useState<'glosarium' | 'gerakan'>('glosarium');
  const list = records.filter(isLearnerVisible);
  return (
    <div className="space-y-4 pb-6 pt-6">
      <div className="px-5">
        <h1 className="text-[30px] leading-tight text-deep-forest">Jelajahi</h1>
        <p className="mt-1 text-sm text-ink-soft">Hanya konten yang sudah disetujui kurator dan diizinkan untuk pelajar.</p>
      </div>
      <div className="mx-5 grid grid-cols-2 rounded-xl bg-bamboo/50 p-1 text-sm font-semibold">
        {(['glosarium', 'gerakan'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-2 capitalize ${tab === t ? 'bg-coconut text-deep-forest shadow-sm' : 'text-ink-soft'}`}>
            {t === 'glosarium' ? 'Glosarium' : 'Gerakan'}
          </button>
        ))}
      </div>
      {tab === 'glosarium' ? (
        <div className="space-y-3 px-5">
          {list.map((r) => (
            <Link key={r.id} to={`/learn/jelajah/${r.id}`} className="block">
              <Ornate className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <ApprovalChip record={r} />
                  {r.bookmarked && <Bookmark className="h-4 w-4 fill-caramel text-caramel" />}
                </div>
                <h3 className="mt-2 text-lg leading-snug text-deep-forest">{r.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{r.shortDescription}</p>
              </Ornate>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-5">
          <Ornate className="flex flex-col items-center gap-3 p-6 text-center">
            <Mascot size={64} mood="think" />
            <Pill>Konsep visi</Pill>
            <h3 className="text-xl text-deep-forest">Arsip Gerakan</h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Pustaka gerakan penderes hanya akan menampilkan video yang sudah disetujui kurator dan diizinkan penderes.
              Belum ada video pada prototipe ini. Pelajar tidak pernah diminta memanjat pohon.
            </p>
            <Film className="h-5 w-5 text-caramel-dark" />
          </Ornate>
        </div>
      )}
    </div>
  );
};

export const RecordDetail: React.FC = () => {
  const { id } = useParams();
  const { records, toggleBookmark } = useStore();
  const r = records.find((x) => x.id === id);
  if (!r || !isLearnerVisible(r)) return <Back />;
  return (
    <div className="space-y-4 pb-6">
      <Back label="Jelajahi" />
      <div className="space-y-3 px-5">
        <ApprovalChip record={r} />
        <h1 className="text-[28px] leading-tight text-deep-forest">{r.title}</h1>
        {r.localTerm && (
          <p className="text-sm text-ink-soft">
            Istilah lokal: <b className="text-deep-forest">{r.localTerm}</b>{' '}
            <span className="ml-1 rounded-full bg-caramel/15 px-2 py-0.5 text-[11px] font-semibold text-caramel-dark">Menunggu validasi komunitas</span>
          </p>
        )}
        <p className="flex items-center gap-1 text-xs text-ink-soft"><Clock className="h-3 w-3" /> {r.duration} · {r.location}</p>
        <p className="text-sm leading-relaxed text-charcoal">{r.culturalExplanation}</p>
        <Ornate className="p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-caramel-dark">Atribusi</p>
          <p className="text-sm text-deep-forest">{r.contributorName}, {r.contributorRole}</p>
          <p className="text-xs text-ink-soft">Disetujui oleh {r.reviewerName ?? 'kurator budaya'}</p>
        </Ornate>
        <button onClick={() => toggleBookmark(r.id)} className="w-full rounded-xl border border-forest py-3 text-sm font-bold text-forest">
          {r.bookmarked ? 'Tersimpan' : 'Simpan ke koleksi'}
        </button>
      </div>
    </div>
  );
};
