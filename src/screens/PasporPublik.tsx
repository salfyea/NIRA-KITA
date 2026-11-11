import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BookOpen, Gamepad2, MapPin, Quote, Sparkles, Star } from 'lucide-react';
import { Nira } from '../art/Nira';
import { Scene, SLUG_SCENE } from '../art/Scene';
import { Vignette } from '../art/Vignette';
import { KisahPerajin } from '../components/KisahPerajin';
import { ApprovalChip, Ornate } from '../components/ui';
import { MasakGula } from '../game/MasakGula';
import { attribution } from '../data/attribution';
import { useStore } from '../store';
import { loadVisitor, saveVisitor } from '../lib/visitor';
import { LangToggle, t } from '../i18n';
import { HeritageRecord } from '../types/jejakNira';

/** Hanya rekaman yang disetujui, berizin publik, dan diizinkan tampil di halaman QR. */
const isPublicQr = (r: HeritageRecord) => r.reviewStatus === 'Approved' && r.visibility === 'public' && r.consent.publicQrPage;

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/** Paspor Warisan publik: halaman web dari QR kemasan, tanpa aplikasi dan tanpa login. */
export const PasporPublik: React.FC = () => {
  const { code } = useParams();
  const { hash } = useLocation();
  const { batches, records: allRecords } = useStore();
  const batch = batches.find((b) => b.code.toLowerCase() === (code ?? '').toLowerCase());
  const [result, setResult] = React.useState<{ stars: 1 | 2 | 3; avg: number } | null>(null);
  const [round, setRound] = React.useState(0);
  const [visitor, setVisitor] = React.useState(loadVisitor);

  React.useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
    return () => clearTimeout(t);
  }, [hash]);

  if (!batch) {
    return (
      <div className="flex min-h-full flex-col items-center bg-cream px-6 pt-16 text-center">
        <Nira mood="think" size={110} className="mx-auto" />
        <h1 className="mt-4 text-2xl text-deep-forest">{t('Kode kemasan tidak dikenali', 'Package code not recognised')}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t('Periksa lagi QR-nya, atau coba contoh di bawah.', 'Check the QR again, or try the examples below.')}</p>
        <div className="mt-4 grid w-full gap-2">
          {batches.slice(0, 3).map((b) => (
            <Link key={b.code} to={`/p/${b.code}`} className="flex min-h-[48px] items-center justify-center rounded-full bg-forest text-base font-semibold text-coconut">
              {t('Contoh kemasan', 'Sample package')} {b.code}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const records = batch.linkedRecordIds
    .map((id) => allRecords.find((r) => r.id === id))
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
          <div className="absolute right-3 top-3 rounded-full bg-coconut/90 px-3 py-1.5 text-xs font-bold text-deep-forest">{t('Paspor Warisan', 'Heritage Passport')} · {batch.code}</div>
          <LangToggle className="absolute left-3 top-3" />
          <div className="absolute -bottom-3 right-4">
            <Nira mood="wave" size={96} />
          </div>
        </div>
        <div className="px-6 pt-5">
          <h1 className="text-[30px] leading-tight text-deep-forest">{t('Gula kelapa di tanganmu punya cerita', 'The coconut sugar in your hands has a story')}</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            {t('Dari kebun kelapa Cilongok, lewat tungku kayu perajin, sampai ke kemasanmu. Kenalan sambil main, tidak perlu unduh apa pun.', 'From the coconut groves of Cilongok, over the artisans\' wood stoves, to your package. Get to know it by playing, no download needed.')}
          </p>
        </div>
      </header>

      {/* pilih cara kenalan */}
      <section className="mt-5 px-6" aria-labelledby="pilih">
        <h2 id="pilih" className="text-[22px] text-deep-forest">
          {t('Mau kenalan lewat apa?', 'How would you like to get to know it?')}
        </h2>
        <button
          type="button"
          onClick={() => scrollTo('game')}
          className="relative mt-3 block min-h-[150px] w-full overflow-hidden rounded-3xl text-left shadow-[0_10px_24px_-12px_rgba(24,56,44,0.6)]"
        >
          <Scene kind="bersama" className="absolute inset-0 h-full w-full" />
          <span className="absolute inset-0 bg-gradient-to-r from-deep-forest via-deep-forest/90 to-deep-forest/10" />
          <span className="relative block max-w-[62%] p-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-caramel px-2.5 py-1 text-xs font-bold text-deep-forest">
              <Sparkles className="h-3.5 w-3.5" /> {t('Paling seru', 'Most fun')}
            </span>
            <span className="mt-2 block font-serif text-2xl leading-tight text-coconut">{t('Masak bareng Nira', 'Cook with Nira')}</span>
            <span className="mt-1 block text-sm text-coconut">{t('Game ±3 menit. Menangkan kartu warisan.', 'A ~3-minute game. Win a heritage card.')}</span>
            <span className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-coconut px-4 text-sm font-bold text-deep-forest">
              <Gamepad2 className="h-4 w-4" /> {t('Main sekarang', 'Play now')}
            </span>
          </span>
          <span className="pointer-events-none absolute -bottom-1 right-1">
            <Nira mood="cheer" size={78} />
          </span>
        </button>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { id: 'asal', Icon: MapPin, t: t('Lihat asal-usulnya', 'See where it comes from'), d: t('10 detik', '10 seconds'), kind: 'asal' as const },
            { id: 'kisah', Icon: BookOpen, t: t('Dengar kisahnya', 'Hear the story'), d: t('1 menit', '1 minute'), kind: 'kisah' as const },
          ].map(({ id, Icon, t, d, kind }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="overflow-hidden rounded-2xl border border-bamboo bg-coconut text-left shadow-[0_6px_16px_-10px_rgba(24,56,44,0.5)]"
            >
              <Vignette kind={kind} className="block h-20 w-full" />
              <span className="block p-3">
                <span className="flex items-center gap-1.5 text-base font-semibold leading-tight text-deep-forest">
                  <Icon className="h-4 w-4 shrink-0 text-caramel-dark" /> {t}
                </span>
                <span className="mt-1 block text-xs font-semibold text-ink-soft">{d}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. dibuat di mana */}
      <section id="asal" className="mt-8 scroll-mt-4 px-6">
        <h2 className="text-[22px] text-deep-forest">{t('Dibuat di mana?', 'Where is it made?')}</h2>
        <Ornate className="mt-3 overflow-hidden p-0">
          <Scene kind="identitas" className="block h-32 w-full" />
          <div className="space-y-1 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{batch.productName}</p>
            <p className="text-xl text-deep-forest">{t('Desa', 'Village')} {batch.village}, Cilongok, Banyumas</p>
            <p className="text-sm text-ink-soft">{t('Batch', 'Batch')} {batch.code} · {batch.period}</p>
            <p className="pt-1 text-xs text-ink-soft">{t('Lokasi tingkat desa. Data ilustratif.', 'Village-level location. Illustrative data.')}</p>
          </div>
        </Ornate>
      </section>

      {/* 3. kisah */}
      <section id="kisah" className="mt-8 scroll-mt-4 px-6">
        <h2 className="text-[22px] text-deep-forest">{t('Kisah di balik kemasan', 'The story behind the package')}</h2>
        {story ? (
          <KisahPerajin record={story} />
        ) : (
          <p className="mt-3 text-sm text-ink-soft">{t('Kisah untuk kemasan ini masih menunggu persetujuan kurator dan perajin.', 'The story for this package is still waiting for curator and artisan approval.')}</p>
        )}
      </section>

      {/* 4. game */}
      <section id="game" className="mt-8 scroll-mt-4 px-6">
        <h2 className="text-[22px] text-deep-forest">{t('Masak bareng Nira', 'Cook with Nira')}</h2>
        <Ornate className="mt-3 p-4">
          {result ? (
            <div className="text-center" role="status">
              <Nira mood="cheer" size={100} className="mx-auto" />
              <div className="mt-1 flex justify-center gap-1" aria-label={t(`${result.stars} dari 3 bintang`, `${result.stars} of 3 stars`)}>
                {[1, 2, 3].map((n) => (
                  <Star key={n} className={`h-8 w-8 ${n <= result.stars ? 'fill-caramel text-caramel' : 'text-bamboo'}`} />
                ))}
              </div>
              <p className="mt-1 text-lg font-semibold text-deep-forest">
                {result.stars === 3 ? t('Gulamu manis sempurna!', 'Your sugar is perfectly sweet!') : result.stars === 2 ? t('Hampir sempurna!', 'Almost perfect!') : t('Awal yang baik, coba lagi ya', 'A good start, try again')}
              </p>
              {story && (
                <div className="ornate mt-3 p-3 text-left">
                  <span className="corner tl" />
                  <span className="corner tr" />
                  <span className="corner bl" />
                  <span className="corner br" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Kartu warisan terbuka', 'Heritage card unlocked')}</p>
                  <p className="mt-1 text-sm font-semibold text-deep-forest">{story.title}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{t('Tersimpan di perangkat ini.', 'Saved on this device.')} {visitor.cards.length} {t('kartu terkumpul.', 'card(s) collected.')}</p>
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
                {t('Main lagi', 'Play again')}
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
          <h2 className="text-[22px]">{t('Mau belajar lebih dalam?', 'Want to learn more?')}</h2>
          <p className="mt-1 text-sm leading-relaxed text-coconut">
            {t('NIRA KITA punya perjalanan belajar, peta desa, dan koleksi kartu warisan. Gratis dan boleh dilewati.', 'NIRA KITA has a learning journey, a village map, and a collection of heritage cards. Free, and you can skip it.')}
          </p>
          <Link to="/masuk" className="mt-3 flex min-h-[52px] items-center justify-center rounded-full bg-caramel-dark text-base font-semibold text-coconut">
            {t('Buka NIRA KITA', 'Open NIRA KITA')}
          </Link>
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
          {t('Tidak ada pelacakan lokasi. Kisah perajin hanya tampil atas izin dan persetujuan kurator.', 'No location tracking. Artisans\' stories appear only with their permission and curator approval.')}
        </p>
      </section>
    </div>
  );
};
