import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Gamepad2, MapPin, Quote, Star } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Scene, SLUG_SCENE } from '../art/Scene';
import { ApprovalChip, Ornate } from '../components/ui';
import { MasakGula } from '../game/MasakGula';
import { attribution } from '../data/attribution';
import { findBatch, QR_BATCHES } from '../data/batches';
import { INITIAL_HERITAGE_RECORDS } from '../data/initialData';
import { loadVisitor, saveVisitor } from '../lib/visitor';
import { HeritageRecord } from '../types/jejakNira';

/** Hanya rekaman yang disetujui, berizin publik, dan diizinkan tampil di halaman QR. */
const isPublicQr = (r: HeritageRecord) => r.reviewStatus === 'Approved' && r.visibility === 'public' && r.consent.publicQrPage;

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/** Paspor Warisan publik: halaman web dari QR kemasan, tanpa aplikasi dan tanpa login. */
export const PasporPublik: React.FC = () => {
  const { code } = useParams();
  const batch = findBatch(code);
  const [result, setResult] = React.useState<{ stars: 1 | 2 | 3; avg: number } | null>(null);
  const [round, setRound] = React.useState(0);
  const [visitor, setVisitor] = React.useState(loadVisitor);

  if (!batch) {
    return (
      <div className="flex min-h-full flex-col items-center bg-cream px-6 pt-16 text-center">
        <Nira mood="think" size={110} className="mx-auto" />
        <h1 className="mt-4 text-2xl text-deep-forest">Kode kemasan tidak dikenali</h1>
        <p className="mt-2 text-sm text-ink-soft">Periksa lagi QR-nya, atau coba contoh di bawah.</p>
        <div className="mt-4 grid w-full gap-2">
          {QR_BATCHES.map((b) => (
            <Link key={b.code} to={`/p/${b.code}`} className="flex min-h-[48px] items-center justify-center rounded-full bg-forest text-base font-semibold text-coconut">
              Contoh kemasan {b.code}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const records = batch.linkedRecordIds
    .map((id) => INITIAL_HERITAGE_RECORDS.find((r) => r.id === id))
    .filter((r): r is HeritageRecord => !!r && isPublicQr(r));
  const story = records[0];
  const sceneKind = story ? (SLUG_SCENE[story.relatedModuleSlug] ?? 'kerajinan') : 'kerajinan';

  const onFinish = (stars: 1 | 2 | 3, avg: number) => {
    setResult({ stars, avg });
    const next = {
      cards: Array.from(new Set([...visitor.cards, ...records.map((r) => r.id)])),
      best: { ...visitor.best, [batch.code]: Math.max(visitor.best[batch.code] ?? 0, stars) },
    };
    setVisitor(next);
    saveVisitor(next);
  };

  return (
    <div className="bg-cream pb-10">
      {/* 1. konsep */}
      <header className="relative">
        <div className="relative h-[300px] overflow-hidden rounded-b-[36px]">
          <Scene kind="kerajinan" className="absolute inset-0 h-full w-full" />
          <div className="absolute right-3 top-3 rounded-full bg-coconut/90 px-3 py-1.5 text-xs font-bold text-deep-forest">Paspor Warisan · {batch.code}</div>
          <div className="absolute -bottom-3 right-4">
            <Nira mood="wave" size={96} />
          </div>
        </div>
        <div className="px-6 pt-5">
          <h1 className="text-[30px] leading-tight text-deep-forest">Gula kelapa di tanganmu punya cerita</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            Dari kebun kelapa Cilongok, lewat tungku kayu perajin, sampai ke kemasanmu. Kenalan sambil main, tidak perlu unduh apa pun.
          </p>
        </div>
      </header>

      {/* pilih cara kenalan */}
      <section className="mt-5 px-6" aria-labelledby="pilih">
        <h2 id="pilih" className="text-[22px] text-deep-forest">
          Mau kenalan lewat apa?
        </h2>
        <div className="mt-3 grid gap-2">
          {[
            { id: 'asal', Icon: MapPin, t: 'Lihat asal-usulnya', d: '10 detik' },
            { id: 'kisah', Icon: BookOpen, t: 'Dengar kisahnya', d: '1 menit' },
            { id: 'game', Icon: Gamepad2, t: 'Masak bareng Nira', d: 'Game, ±90 detik' },
          ].map(({ id, Icon, t, d }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-bamboo bg-coconut px-4 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel/15 text-caramel-dark">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-base font-semibold text-deep-forest">{t}</span>
                <span className="block text-xs text-ink-soft">{d}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. dibuat di mana */}
      <section id="asal" className="mt-8 scroll-mt-4 px-6">
        <h2 className="text-[22px] text-deep-forest">Dibuat di mana?</h2>
        <Ornate className="mt-3 overflow-hidden p-0">
          <Scene kind="identitas" className="block h-32 w-full" />
          <div className="space-y-1 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{batch.productName}</p>
            <p className="text-xl text-deep-forest">Desa {batch.village}, Cilongok, Banyumas</p>
            <p className="text-sm text-ink-soft">Batch {batch.code} · {batch.period}</p>
            <p className="pt-1 text-xs text-ink-soft">Lokasi tingkat desa. Data ilustratif.</p>
          </div>
        </Ornate>
      </section>

      {/* 3. kisah */}
      <section id="kisah" className="mt-8 scroll-mt-4 px-6">
        <h2 className="text-[22px] text-deep-forest">Kisah di balik kemasan</h2>
        {story ? (
          <Ornate className="mt-3 space-y-2 p-4">
            <ApprovalChip record={story} />
            <h3 className="text-xl leading-tight text-deep-forest">{story.title}</h3>
            <p className="text-base leading-relaxed text-charcoal">{story.culturalExplanation}</p>
            <p className="flex items-start gap-2 text-sm text-ink-soft">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-caramel-dark" />
              <span>
                {attribution(story)}
                {story.isIllustrativePlaceholder && ' · data ilustratif'}
              </span>
            </p>
          </Ornate>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">Kisah untuk kemasan ini masih menunggu persetujuan kurator dan perajin.</p>
        )}
      </section>

      {/* 4. game */}
      <section id="game" className="mt-8 scroll-mt-4 px-6">
        <h2 className="text-[22px] text-deep-forest">Masak bareng Nira</h2>
        <Ornate className="mt-3 p-4">
          {result ? (
            <div className="text-center" role="status">
              <Nira mood="cheer" size={100} className="mx-auto" />
              <div className="mt-1 flex justify-center gap-1" aria-label={`${result.stars} dari 3 bintang`}>
                {[1, 2, 3].map((n) => (
                  <Star key={n} className={`h-8 w-8 ${n <= result.stars ? 'fill-caramel text-caramel' : 'text-bamboo'}`} />
                ))}
              </div>
              <p className="mt-1 text-lg font-semibold text-deep-forest">
                {result.stars === 3 ? 'Gulamu manis sempurna!' : result.stars === 2 ? 'Hampir sempurna!' : 'Awal yang baik, coba lagi ya'}
              </p>
              {story && (
                <div className="ornate mt-3 p-3 text-left">
                  <span className="corner tl" />
                  <span className="corner tr" />
                  <span className="corner bl" />
                  <span className="corner br" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Kartu warisan terbuka</p>
                  <p className="mt-1 text-sm font-semibold text-deep-forest">{story.title}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Tersimpan di perangkat ini. {visitor.cards.length} kartu terkumpul.</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setRound((n) => n + 1);
                }}
                className="mt-3 min-h-[52px] w-full rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark"
              >
                Main lagi
              </button>
            </div>
          ) : (
            <MasakGula key={round} onFinish={onFinish} />
          )}
        </Ornate>
      </section>

      {/* 5. ajakan lembut */}
      <section className="mt-8 px-6">
        <div className="rounded-3xl bg-forest p-5 text-coconut">
          <h2 className="text-[22px]">Mau belajar lebih dalam?</h2>
          <p className="mt-1 text-sm leading-relaxed text-coconut">
            NIRA KITA punya perjalanan belajar, peta desa, dan koleksi kartu warisan. Gratis dan boleh dilewati.
          </p>
          <Link to="/masuk" className="mt-3 flex min-h-[52px] items-center justify-center rounded-full bg-caramel-dark text-base font-semibold text-coconut">
            Buka NIRA KITA
          </Link>
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
          Tidak ada pelacakan lokasi. Kisah perajin hanya tampil atas izin dan persetujuan kurator.
        </p>
      </section>
    </div>
  );
};
