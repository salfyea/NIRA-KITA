import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, Lock, LogOut, Mic, QrCode, ShieldCheck, Store, Users, X } from 'lucide-react';
import { Ornate } from '../components/ui';
import { attribution } from '../data/attribution';
import { CuratorChecklist, HeritageRecord, VisibilityScope } from '../types/jejakNira';
import { useStore } from '../store';
import { t } from '../i18n';
import { locLabel } from '../data/display';
import { Nira } from '../art/Nira';
import { RoleMascot } from '../art/RoleMascot';

/** Bilah atas area staf: berpindah antara Kurator dan Admin, plus keluar. */
const statusLabel = (s: string): string =>
  ({ Approved: t('Disetujui', 'Approved'), 'In Review': t('Menunggu tinjauan', 'Awaiting review'), 'Revision Requested': t('Perlu revisi', 'Needs revision'), Rejected: t('Ditolak', 'Rejected'), Draft: t('Draf', 'Draft'), Archived: t('Diarsipkan', 'Archived') } as Record<string, string>)[s] ?? s;
const statusTone = (s: string) =>
  s === 'Approved' ? 'bg-forest/10 text-forest border-forest/25' : s === 'In Review' ? 'bg-caramel/15 text-caramel-dark border-caramel/30' : 'bg-[#9E4F37]/10 text-[#9E4F37] border-[#9E4F37]/30';

const scopeLabel = (v: VisibilityScope) => (v === 'public' ? t('Publik (halaman QR)', 'Public (QR page)') : v === 'learner' ? t('Akses Pelajar', 'Learner access') : t('Privat', 'Private'));

/* ============================== Antrean ============================== */

const MONTHS: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 };
/** Tanggal acuan data contoh. Pada pemakaian nyata ini diganti tanggal hari ini. */
const DEMO_TODAY = Date.UTC(2026, 4, 22);
const daysWaiting = (d: string): number => {
  if (d === 'Hari ini') return 0;
  const m = d.match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (!m || MONTHS[m[2].slice(0, 3)] === undefined) return 0;
  return Math.max(0, Math.round((DEMO_TODAY - Date.UTC(Number(m[3]), MONTHS[m[2].slice(0, 3)], Number(m[1]))) / 86400000));
};

const Head: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div>
    <h1 className="font-serif text-[30px] leading-tight text-deep-forest">{title}</h1>
    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
  </div>
);

const RecordCard: React.FC<{ r: HeritageRecord; onOpen: () => void }> = ({ r, onOpen }) => {
  const waiting = r.reviewStatus === 'In Review' || r.reviewStatus === 'Revision Requested' ? daysWaiting(r.submittedDate) : null;
  const missing = !r.consent.internalLearning;
  return (
    <li>
      <Ornate as="button" onClick={onOpen} className="p-4">
        <span className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold text-ink-soft">{r.id}</span>
          <span className="flex gap-1.5">
            {missing && <span className="rounded-full bg-[#9E4F37]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#9E4F37]">{t('Izin belum lengkap', 'Consent incomplete')}</span>}
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(r.reviewStatus)}`}>{statusLabel(r.reviewStatus)}</span>
          </span>
        </span>
        <span className="mt-1 block text-lg leading-snug text-deep-forest">{r.title}</span>
        <span className="mt-1 block text-sm text-ink-soft">
          {r.contributorName} · {locLabel(r.location.replace(', Cilongok, Banyumas', ''))}
          {waiting !== null && <b className="ml-2 text-caramel-dark">{t(`menunggu ${waiting} hari`, `waiting ${waiting} days`)}</b>}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className={`rounded-full px-2 py-0.5 ${r.consent.internalLearning ? 'bg-forest/10 text-forest' : 'bg-bamboo/60 text-ink-soft'}`}>{t('Izin pelajar', 'Learner permission')} {r.consent.internalLearning ? t('ya', 'yes') : t('belum', 'not yet')}</span>
          <span className={`rounded-full px-2 py-0.5 ${r.consent.publicQrPage ? 'bg-forest/10 text-forest' : 'bg-bamboo/60 text-ink-soft'}`}>{t('Izin QR publik', 'Public QR permission')} {r.consent.publicQrPage ? t('ya', 'yes') : t('belum', 'not yet')}</span>
          <span className="rounded-full bg-coconut px-2 py-0.5 text-deep-forest ring-1 ring-bamboo">{scopeLabel(r.visibility)}</span>
        </span>
      </Ornate>
    </li>
  );
};

const NotesBlock: React.FC = () => {
  const { annotations, approveAnnotation, showToast } = useStore();
  const pendingNotes = Object.entries(annotations).filter(([, a]) => !a.approved);
  if (pendingNotes.length === 0)
    return (
      <div className="surface mt-4 flex flex-col items-center rounded-3xl p-8 text-center">
        <Nira mood="cheer" size={92} />
        <p className="mt-2 font-serif text-xl text-deep-forest">{t('Tidak ada anotasi yang menunggu', 'No annotations waiting')}</p>
        <p className="mt-1 text-sm text-ink-soft">{t('Anotasi dari mentor akan muncul di sini untuk kamu setujui.', 'Annotations from mentors will appear here for you to approve.')}</p>
      </div>
    );
  return (
    <ul className="mt-4 space-y-3">
      {pendingNotes.map(([clip, a]) => (
        <li key={clip} className="surface rounded-[22px_28px_22px_28px] p-4">
          <p className="text-sm font-semibold text-deep-forest">{clip === 'irama-aduk' ? t('Irama acuan mengaduk (hasil ukur kamera)', 'Stirring reference rhythm (camera measurement)') : `${t('Klip', 'Clip')}: ${clip}`}</p>
          <p className="mt-1 text-sm leading-relaxed text-charcoal">"{a.text}"</p>
          <p className="text-xs text-ink-soft">{t('Oleh', 'By')} {a.author}</p>
          <button type="button" onClick={() => { approveAnnotation(clip); showToast(t('Anotasi disetujui dan tampil di Arsip Gerakan.', 'Annotation approved and shown in the Movement Archive.')); }} className="mt-3 min-h-[44px] rounded-full bg-forest px-5 text-sm font-semibold text-coconut">
            {t('Setujui anotasi', 'Approve annotation')}
          </button>
        </li>
      ))}
    </ul>
  );
};

export const Kurator: React.FC<{ view: 'inbox' | 'anotasi' | 'arsip' }> = ({ view }) => {
  const { records, annotations, session } = useStore();
  const navigate = useNavigate();
  const [f, setF] = React.useState<'setuju' | 'semua'>('setuju');
  const pending = records.filter((r) => r.reviewStatus === 'In Review');
  const revision = records.filter((r) => r.reviewStatus === 'Revision Requested');
  const approved = records.filter((r) => r.reviewStatus === 'Approved');
  const notes = Object.values(annotations).filter((a) => !a.approved).length;
  const inbox = [...pending, ...revision].sort((a, b) => daysWaiting(b.submittedDate) - daysWaiting(a.submittedDate));
  const list = f === 'setuju' ? approved : records;

  if (view === 'anotasi')
    return (
      <div className="px-4 pt-4 lg:px-0 lg:pt-0">
        <Head title={t('Anotasi mentor', 'Mentor annotations')} text={t('Catatan teknik dan irama acuan dari mentor. Baru tampil ke pelajar setelah kamu setujui.', 'Technique notes and reference rhythms from mentors. They reach learners only after you approve them.')} />
        <NotesBlock />
      </div>
    );

  if (view === 'arsip')
    return (
      <div className="px-4 pt-4 lg:px-0 lg:pt-0">
        <Head title={t('Arsip rekaman', 'Recording archive')} text={t('Semua rekaman yang sudah kamu putuskan, beserta visibilitasnya.', 'Every recording you have decided on, with its visibility.')} />
        <div className="mt-4 flex gap-1 border-b border-bamboo" role="tablist">
          {([['setuju', t(`Disetujui (${approved.length})`, `Approved (${approved.length})`)], ['semua', t(`Semua (${records.length})`, `All (${records.length})`)]] as const).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={f === k} onClick={() => setF(k)} className={`relative min-h-[46px] px-4 text-sm font-semibold ${f === k ? 'text-deep-forest' : 'text-ink-soft'}`}>
              {label}
              {f === k && <span className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-forest" />}
            </button>
          ))}
        </div>
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {list.map((r) => <RecordCard key={r.id} r={r} onOpen={() => navigate(`/kurator/${r.id}`)} />)}
        </ul>
      </div>
    );

  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0">
      <div className="flex items-center gap-4 rounded-[28px_36px_28px_36px] p-5" style={{ background: 'linear-gradient(120deg, #DDEBDD, #F2F6E8)' }}>
        <RoleMascot role="curator" size={92} mood="happy" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest">{t('Kotak masuk tinjauan', 'Review inbox')}</p>
          <h1 className="font-serif text-[28px] leading-tight text-deep-forest">{t('Halo', 'Hello')}, {session?.name?.split(' (')[0]}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{t('Tidak ada yang tampil ke pelajar atau publik tanpa persetujuanmu.', 'Nothing reaches learners or the public without your approval.')}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[[pending.length, t('Menunggu', 'Waiting')], [revision.length, t('Perlu revisi', 'Needs revision')], [notes, t('Anotasi', 'Annotations')]].map(([n, l]) => (
          <div key={String(l)} className="surface rounded-[22px_28px_22px_28px] p-4 text-center">
            <p className="font-serif text-[32px] leading-none text-deep-forest">{n}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{l}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-6 text-xl text-deep-forest">{t('Perlu ditinjau', 'To review')}</h2>
      <p className="text-xs text-ink-soft">{t('Diurutkan dari yang paling lama menunggu.', 'Sorted by longest waiting.')}</p>
      {inbox.length === 0 ? (
        <div className="surface mt-3 flex flex-col items-center rounded-3xl p-8 text-center">
          <Nira mood="cheer" size={92} />
          <p className="mt-2 font-serif text-xl text-deep-forest">{t('Kotak masuk kosong', 'Inbox is empty')}</p>
          <p className="mt-1 text-sm text-ink-soft">{t('Semua rekaman sudah kamu tinjau. Terima kasih sudah menjaga izin perajin.', 'You have reviewed every recording. Thank you for guarding the artisans\' consent.')}</p>
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 lg:grid-cols-2">
          {inbox.map((r) => <RecordCard key={r.id} r={r} onOpen={() => navigate(`/kurator/${r.id}`)} />)}
        </ul>
      )}
    </div>
  );
};

/* ============================== Detail ============================== */

const getChecks = (): [keyof CuratorChecklist, string][] => [
  ['permissionVerified', t('Izin kontributor terverifikasi (rekaman persetujuan)', 'Contributor consent verified (consent recording)')],
  ['attributionConfirmed', t('Atribusi sesuai preferensi kontributor', 'Attribution matches the contributor\'s preference')],
  ['culturalContextReviewed', t('Konteks budaya sudah ditinjau', 'Cultural context has been reviewed')],
  ['terminologyChecked', t('Istilah dan terjemahan sudah diperiksa', 'Terms and translation have been checked')],
  ['mediaSuitabilityChecked', t('Media layak tampil (tidak sakral, tidak berbahaya)', 'Media is fit to show (not sacred, not hazardous)')],
  ['intendedAudienceConfirmed', t('Audiens tujuan sudah dikonfirmasi', 'Intended audience confirmed')],
];
const EMPTY: CuratorChecklist = {
  permissionVerified: false,
  attributionConfirmed: false,
  culturalContextReviewed: false,
  terminologyChecked: false,
  mediaSuitabilityChecked: false,
  intendedAudienceConfirmed: false,
};

export const KuratorDetail: React.FC = () => {
  const { id } = useParams();
  const { records, reviewRecord, showToast } = useStore();
  const r = records.find((x) => x.id === id);
  if (!r) return <Navigate to="/kurator" replace />;
  return <Detail key={r.id} r={r} onSave={reviewRecord} toast={showToast} />;
};

const Detail: React.FC<{
  r: HeritageRecord;
  onSave: ReturnType<typeof useStore>['reviewRecord'];
  toast: (m: string) => void;
}> = ({ r, onSave, toast }) => {
  const [check, setCheck] = React.useState<CuratorChecklist>(r.checklist ?? EMPTY);
  const [vis, setVis] = React.useState<VisibilityScope>(r.visibility === 'private' && r.reviewStatus !== 'Approved' ? (r.consent.internalLearning ? 'learner' : 'private') : r.visibility);
  const [note, setNote] = React.useState(r.revisionNotes ?? '');
  const [done, setDone] = React.useState<null | 'Approved' | 'Revision Requested' | 'Rejected'>(null);
  const allChecked = Object.values(check).every(Boolean);
  const checked = Object.values(check).filter(Boolean).length;

  const decide = (status: 'Approved' | 'Revision Requested' | 'Rejected') => {
    onSave(r.id, { status, visibility: vis, checklist: check, note });
    setDone(status);
    toast(status === 'Approved' ? t('Rekaman disetujui dan dicatat di audit.', 'Recording approved and logged in the audit.') : status === 'Revision Requested' ? t('Revisi diminta dan dicatat di audit.', 'Revision requested and logged in the audit.') : t('Rekaman ditolak dan dicatat di audit.', 'Recording rejected and logged in the audit.'));
  };

  const options: { v: VisibilityScope; t: string; d: string; ok: boolean; why?: string }[] = [
    { v: 'private', t: t('Privat', 'Private'), d: t('Hanya tim internal.', 'Internal team only.'), ok: true },
    { v: 'learner', t: t('Akses Pelajar', 'Learner access'), d: t('Tampil di aplikasi pelajar.', 'Shown in the learner app.'), ok: r.consent.internalLearning, why: t('Kontributor belum mengizinkan penggunaan untuk pembelajaran.', 'The contributor has not allowed use for learning.') },
    { v: 'public', t: t('Publik (halaman QR)', 'Public (QR page)'), d: t('Tampil untuk pembeli yang memindai kemasan.', 'Shown to buyers who scan the package.'), ok: r.consent.publicQrPage, why: t('Kontributor belum mengizinkan tampil di halaman QR publik.', 'The contributor has not allowed display on the public QR page.') },
  ];

  return (
    <div className="px-4 pt-3 lg:px-0 lg:pt-0">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start lg:gap-8">
        <div className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-32px)] lg:self-start lg:overflow-y-auto lg:pr-1">
        <Link to="/kurator" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
          <ArrowLeft className="h-4 w-4" /> {t('Kotak masuk', 'Inbox')}
        </Link>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-ink-soft">{r.id}</p>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(r.reviewStatus)}`}>{statusLabel(r.reviewStatus)}</span>
        </div>
        <h1 className="text-[26px] leading-tight text-deep-forest">{r.title}</h1>
        <div className="surface mt-3 rounded-3xl p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Pratinjau: begini tampilannya', 'Preview: how it will look')}</p>
          <div className="mt-2 flex gap-3">
            <RoleMascot role="curator" size={64} mood="happy" />
            <div className="min-w-0">
              <p className="text-base font-semibold leading-snug text-deep-forest">{r.title}</p>
              <p className="mt-0.5 text-sm leading-snug text-ink-soft">{r.shortDescription}</p>
              <p className="mt-1 text-xs font-semibold text-caramel-dark">{r.attributionPreference === 'Anonim' ? t('Narasumber komunitas (anonim)', 'Community source (anonymous)') : r.attributionPreference === 'Tampilkan Inisial Komunitas' ? t('Narasumber komunitas', 'Community source') : r.contributorName}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-soft">{t('Tampil di aplikasi pelajar bila Akses Pelajar, dan di halaman QR pembeli bila Publik.', 'Shown in the learner app with Learner access, and on the buyer QR page when Public.')}</p>
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          {attribution(r)} · {locLabel(r.location)}
        </p>
        <div className="surface mt-4 rounded-3xl p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Bahan yang ditinjau', 'Material under review')}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-charcoal">{r.culturalExplanation}</p>
          {r.audioTranscript ? (
            <blockquote className="mt-3 rounded-2xl bg-cream p-4 text-[15px] italic leading-relaxed text-deep-forest">
              {r.audioTranscript}
              {r.audioDurationSec > 0 && <span className="mt-2 block text-xs not-italic text-ink-soft">{t('Durasi', 'Duration')} {Math.floor(r.audioDurationSec / 60)}:{String(r.audioDurationSec % 60).padStart(2, '0')}</span>}
            </blockquote>
          ) : (
            <p className="mt-3 rounded-2xl bg-cream p-4 text-sm text-ink-soft">{t('Belum ada transkrip atau media pada rekaman ini. Berkas dari mentor dicatat saat pengiriman.', 'There is no transcript or media on this recording yet. Files from the mentor are noted at submission.')}</p>
          )}
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-ink-soft">{t('Bahasa', 'Language')}</dt><dd className="font-semibold text-deep-forest">{r.language}</dd>
            <dt className="text-ink-soft">{t('Diajukan', 'Submitted')}</dt><dd className="font-semibold text-deep-forest">{r.submittedDate === 'Hari ini' ? t('Hari ini', 'Today') : r.submittedDate}</dd>
            <dt className="text-ink-soft">{t('Modul terkait', 'Related module')}</dt><dd className="font-semibold text-deep-forest">{r.relatedModuleSlug.split('-')[0]}</dd>
          </dl>
        </div>
        {r.revisionNotes && r.reviewStatus === 'Revision Requested' && (
          <p className="mt-3 rounded-xl bg-[#9E4F37]/10 p-3 text-sm leading-relaxed text-[#9E4F37]">
            <b>{t('Catatan revisi sebelumnya:', 'Previous revision note:')}</b> {r.revisionNotes}
          </p>
        )}

        </div>

        <aside className="min-w-0" aria-label={t('Keputusan', 'Decision')}>
        {/* izin kontributor */}
        <h2 className="mt-6 text-[20px] text-deep-forest lg:mt-0">1. {t('Izin dari kontributor', 'Contributor consent')}</h2>
        <ul className="mt-2 space-y-1.5">
          {([
            ['internalLearning', t('Pembelajaran di aplikasi', 'Learning in the app')],
            ['publicQrPage', t('Halaman QR publik', 'Public QR page')],
            ['promotionalMaterial', t('Materi promosi', 'Promotional material')],
          ] as const).map(([k, label]) => (
            <li key={k} className="flex items-center gap-2 rounded-xl bg-coconut px-3 py-2.5 text-sm font-semibold text-deep-forest">
              {r.consent[k] ? <Check className="h-5 w-5 text-forest" /> : <X className="h-5 w-5 text-[#9E4F37]" />}
              {label}
              <span className={`ml-auto text-xs ${r.consent[k] ? 'text-forest' : 'text-[#9E4F37]'}`}>{r.consent[k] ? t('Diizinkan', 'Allowed') : t('Belum diizinkan', 'Not allowed')}</span>
            </li>
          ))}
        </ul>

        {/* checklist */}
        <h2 className="mt-6 flex items-baseline justify-between text-[20px] text-deep-forest">
          2. {t('Checklist kurator', 'Curator checklist')} <span className="text-sm font-bold text-ink-soft">{checked}/6</span>
        </h2>
        <ul className="mt-2 space-y-1.5">
          {getChecks().map(([k, label]) => (
            <li key={k}>
              <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl bg-coconut px-3 py-2 text-sm leading-snug text-charcoal">
                <input type="checkbox" checked={check[k]} onChange={() => setCheck((c) => ({ ...c, [k]: !c[k] }))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
                {label}
              </label>
            </li>
          ))}
        </ul>

        {/* visibilitas */}
        <h2 className="mt-6 text-[20px] text-deep-forest">3. {t('Siapa yang boleh melihat?', 'Who may see this?')}</h2>
        <div className="mt-2 space-y-2" role="radiogroup" aria-label={t('Visibilitas', 'Visibility')}>
          {options.map((o) => (
            <button
              key={o.v}
              type="button"
              role="radio"
              aria-checked={vis === o.v}
              disabled={!o.ok}
              onClick={() => setVis(o.v)}
              className={`flex min-h-[60px] w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left ${
                vis === o.v ? 'border-forest bg-forest/10' : 'border-bamboo bg-coconut'
              } ${!o.ok ? 'opacity-70' : ''}`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${vis === o.v ? 'border-forest bg-forest text-coconut' : 'border-bamboo'}`}>
                {vis === o.v && <Check className="h-3.5 w-3.5" />}
                {!o.ok && vis !== o.v && <Lock className="h-3 w-3 text-ink-soft" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-deep-forest">{o.t}</span>
                <span className="block text-xs leading-snug text-ink-soft">{o.ok ? o.d : o.why}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5" aria-label={t('Alasan siap pakai', 'Ready-made reasons')}>
          {[
            [t('Izin belum lengkap', 'Consent incomplete'), t('Izin narasumber belum lengkap. Mohon lampirkan rekaman persetujuan.', 'The source\'s consent is incomplete. Please attach the consent recording.')],
            [t('Istilah perlu dicek', 'Terms need checking'), t('Mohon konfirmasi istilah dan terjemahan dengan narasumber.', 'Please confirm the terms and translation with the source.')],
            [t('Konteks sakral', 'Sacred context'), t('Ada konteks yang mungkin sakral. Mohon konfirmasi batas tampil dengan komunitas.', 'There may be sacred context. Please confirm the limits of display with the community.')],
          ].map(([chip, text]) => (
            <button key={chip} type="button" onClick={() => setNote((n) => (n ? n + ' ' + text : text))} className="min-h-[40px] rounded-full bg-cream px-3 text-xs font-semibold text-deep-forest">
              + {chip}
            </button>
          ))}
        </div>
        <label className="mt-2 block text-sm font-semibold text-deep-forest">
          {t('Catatan untuk kontributor atau mentor', 'Note for the contributor or mentor')}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={t('Wajib diisi bila meminta revisi atau menolak', 'Required when requesting revision or rejecting')}
            className="mt-1 w-full rounded-xl border border-bamboo bg-coconut p-3 text-base text-charcoal placeholder:text-ink-soft"
          />
        </label>

        {done ? (
          <Ornate className="mt-5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Keputusan tercatat', 'Decision recorded')}</p>
            <p className="mt-1 text-lg text-deep-forest">{done === 'Approved' ? t('Disetujui', 'Approved') : done === 'Revision Requested' ? t('Revisi diminta', 'Revision requested') : t('Ditolak', 'Rejected')}</p>
            {done === 'Approved' ? (
              <ul className="mt-2 space-y-1.5 text-sm font-semibold">
                <li className={`flex items-center gap-2 ${vis !== 'private' ? 'text-forest' : 'text-ink-soft'}`}>
                  <Eye className="h-4 w-4" /> {t('Aplikasi pelajar', 'Learner app')}: {vis !== 'private' ? t('tampil', 'visible') : t('tidak tampil', 'not visible')}
                </li>
                <li className={`flex items-center gap-2 ${vis === 'public' ? 'text-forest' : 'text-ink-soft'}`}>
                  <QrCode className="h-4 w-4" /> {t('Halaman QR publik', 'Public QR page')}: {vis === 'public' ? t('tampil', 'visible') : t('tidak tampil', 'not visible')}
                </li>
              </ul>
            ) : (
              <p className="mt-1 text-sm text-ink-soft">{t('Tidak tampil ke pelajar maupun publik.', 'Not shown to learners or the public.')}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/kurator" className="inline-flex min-h-[44px] items-center rounded-full bg-forest px-5 text-sm font-semibold text-coconut">
                {t('Kembali ke antrean', 'Back to the queue')}
              </Link>
              <Link to="/admin" className="inline-flex min-h-[44px] items-center rounded-full border-2 border-bamboo px-5 text-sm font-semibold text-deep-forest">
                {t('Lihat di audit', 'See in the audit')}
              </Link>
            </div>
          </Ornate>
        ) : (
          <div className="mt-5 space-y-2">
            <button
              type="button"
              disabled={!allChecked}
              onClick={() => decide('Approved')}
              className="min-h-[56px] w-full rounded-full bg-forest text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
            >
              {allChecked ? t('Setujui', 'Approve') : t(`Lengkapi checklist (${checked}/6) untuk menyetujui`, `Complete the checklist (${checked}/6) to approve`)}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!note.trim()}
                onClick={() => decide('Revision Requested')}
                className="min-h-[52px] rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark disabled:opacity-40"
              >
                {t('Minta revisi', 'Request revision')}
              </button>
              <button
                type="button"
                disabled={!note.trim()}
                onClick={() => decide('Rejected')}
                className="min-h-[52px] rounded-full border-2 border-[#9E4F37] text-base font-semibold text-[#9E4F37] disabled:opacity-40"
              >
                {t('Tolak', 'Reject')}
              </button>
            </div>
            {!note.trim() && <p className="text-center text-xs text-ink-soft">{t('Isi catatan untuk bisa meminta revisi atau menolak.', 'Add a note to request a revision or reject.')}</p>}
          </div>
        )}
        </aside>
      </div>
    </div>
  );
};
