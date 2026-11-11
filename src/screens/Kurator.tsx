import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, Lock, LogOut, Mic, QrCode, ShieldCheck, Users, X } from 'lucide-react';
import { Ornate } from '../components/ui';
import { attribution } from '../data/attribution';
import { CuratorChecklist, HeritageRecord, VisibilityScope } from '../types/jejakNira';
import { useStore } from '../store';
import { t } from '../i18n';
import { locLabel } from '../data/display';

/** Bilah atas area staf: berpindah antara Kurator dan Admin, plus keluar. */
export const StaffBar: React.FC<{ current: 'mentor' | 'kurator' | 'admin' }> = ({ current }) => {
  const { session, signOut } = useStore();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 border-b border-bamboo bg-cream/95 px-5 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Area staf · prototipe', 'Staff area · prototype')}</p>
          <p className="truncate text-sm font-semibold text-deep-forest">{session?.name}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate('/masuk', { replace: true });
          }}
          className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-bamboo px-4 text-sm font-semibold text-ink-soft"
        >
          <LogOut className="h-4 w-4" /> {t('Keluar', 'Sign out')}
        </button>
      </div>
      <nav className="mt-2 grid grid-cols-3 rounded-full border border-bamboo bg-coconut p-1" aria-label={t('Area staf', 'Staff area')}>
        {([
          ['mentor', '/mentor', 'Mentor', Mic],
          ['kurator', '/kurator', t('Kurator', 'Curator'), ShieldCheck],
          ['admin', '/admin', 'Admin', Users],
        ] as const).map(([k, to, label, Icon]) => (
          <Link
            key={k}
            to={to}
            aria-current={current === k ? 'page' : undefined}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-full text-sm font-semibold ${current === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

/** Hanya peran staf (kurator atau admin) yang boleh masuk. */
export const RequireStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useStore();
  return session && session.role !== 'learner' ? <>{children}</> : <Navigate to="/kode-undangan" replace />;
};

const statusLabel = (s: string): string =>
  ({ Approved: t('Disetujui', 'Approved'), 'In Review': t('Menunggu tinjauan', 'Awaiting review'), 'Revision Requested': t('Perlu revisi', 'Needs revision'), Rejected: t('Ditolak', 'Rejected'), Draft: t('Draf', 'Draft'), Archived: t('Diarsipkan', 'Archived') } as Record<string, string>)[s] ?? s;
const statusTone = (s: string) =>
  s === 'Approved' ? 'bg-forest/10 text-forest border-forest/25' : s === 'In Review' ? 'bg-caramel/15 text-caramel-dark border-caramel/30' : 'bg-[#9E4F37]/10 text-[#9E4F37] border-[#9E4F37]/30';

const scopeLabel = (v: VisibilityScope) => (v === 'public' ? t('Publik (halaman QR)', 'Public (QR page)') : v === 'learner' ? t('Akses Pelajar', 'Learner access') : t('Privat', 'Private'));

/* ============================== Antrean ============================== */

export const Kurator: React.FC = () => {
  const { records, annotations, approveAnnotation, showToast } = useStore();
  const navigate = useNavigate();
  const pendingNotes = Object.entries(annotations).filter(([, a]) => !a.approved);
  const [f, setF] = React.useState<'tunggu' | 'setuju' | 'semua'>('tunggu');
  const pending = records.filter((r) => r.reviewStatus === 'In Review' || r.reviewStatus === 'Revision Requested');
  const approved = records.filter((r) => r.reviewStatus === 'Approved');
  const list = f === 'tunggu' ? pending : f === 'setuju' ? approved : records;
  return (
    <div className="min-h-full bg-cream pb-8">
      <StaffBar current="kurator" />
      <div className="px-5 pt-4">
        <h1 className="text-[28px] leading-tight text-deep-forest">{t('Antrean tinjauan', 'Review queue')}</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {t('Kurator memeriksa izin kontributor dan konteks budaya, lalu menentukan siapa yang boleh melihat setiap rekaman. Tidak ada yang tampil ke pelajar atau publik tanpa persetujuan di sini.', 'Curators check contributor consent and cultural context, then decide who may see each recording. Nothing reaches learners or the public without approval here.')}
        </p>
        <div className="mt-4 grid grid-cols-3 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {([
            ['tunggu', t(`Menunggu (${pending.length})`, `Pending (${pending.length})`)],
            ['setuju', t(`Disetujui (${approved.length})`, `Approved (${approved.length})`)],
            ['semua', t('Semua', 'All')],
          ] as const).map(([k, t]) => (
            <button key={k} type="button" role="tab" aria-selected={f === k} onClick={() => setF(k)} className={`min-h-[44px] rounded-full text-xs font-bold ${f === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}>
              {t}
            </button>
          ))}
        </div>
        {pendingNotes.length > 0 && (
          <div className="mt-3 rounded-2xl border border-caramel/40 bg-coconut p-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Anotasi mentor menunggu', 'Mentor annotations pending')} ({pendingNotes.length})</p>
            {pendingNotes.map(([clip, a]) => (
              <div key={clip} className="mt-2 border-t border-bamboo/60 pt-2">
                <p className="text-sm font-semibold text-deep-forest">{t('Klip', 'Clip')}: {clip}</p>
                <p className="text-sm leading-relaxed text-charcoal">"{a.text}"</p>
                <p className="text-xs text-ink-soft">{t('Oleh', 'By')} {a.author}</p>
                <button type="button" onClick={() => { approveAnnotation(clip); showToast(t('Anotasi disetujui dan tampil di Arsip Gerakan.', 'Annotation approved and shown in the Movement Archive.')); }} className="mt-2 min-h-[44px] rounded-full bg-forest px-5 text-sm font-semibold text-coconut">
                  {t('Setujui anotasi', 'Approve annotation')}
                </button>
              </div>
            ))}
          </div>
        )}
        <ul className="mt-3 space-y-3">
          {list.map((r) => (
            <li key={r.id}>
              <Ornate as="button" onClick={() => navigate(`/kurator/${r.id}`)} className="p-4">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-ink-soft">{r.id}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(r.reviewStatus)}`}>{statusLabel(r.reviewStatus)}</span>
                </span>
                <span className="mt-1 block text-lg leading-snug text-deep-forest">{r.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {r.contributorName} · {locLabel(r.location.replace(', Cilongok, Banyumas', ''))}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
                  <span className={`rounded-full px-2 py-0.5 ${r.consent.internalLearning ? 'bg-forest/10 text-forest' : 'bg-bamboo/60 text-ink-soft'}`}>{t('Izin pelajar', 'Learner permission')} {r.consent.internalLearning ? '✓' : '✗'}</span>
                  <span className={`rounded-full px-2 py-0.5 ${r.consent.publicQrPage ? 'bg-forest/10 text-forest' : 'bg-bamboo/60 text-ink-soft'}`}>{t('Izin QR publik', 'Public QR permission')} {r.consent.publicQrPage ? '✓' : '✗'}</span>
                  <span className="rounded-full bg-coconut px-2 py-0.5 text-deep-forest ring-1 ring-bamboo">{scopeLabel(r.visibility)}</span>
                </span>
              </Ornate>
            </li>
          ))}
          {list.length === 0 && <li className="rounded-2xl bg-coconut p-4 text-sm text-ink-soft">{t('Tidak ada rekaman di daftar ini.', 'No recordings in this list.')}</li>}
        </ul>
      </div>
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
    <div className="min-h-full bg-cream pb-10">
      <StaffBar current="kurator" />
      <div className="px-5 pt-3">
        <Link to="/kurator" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
          <ArrowLeft className="h-4 w-4" /> {t('Antrean', 'Queue')}
        </Link>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-ink-soft">{r.id}</p>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(r.reviewStatus)}`}>{statusLabel(r.reviewStatus)}</span>
        </div>
        <h1 className="text-[26px] leading-tight text-deep-forest">{r.title}</h1>
        <p className="mt-2 text-base leading-relaxed text-charcoal">{r.culturalExplanation}</p>
        <p className="mt-2 text-sm text-ink-soft">
          {attribution(r)} · {locLabel(r.location)}
        </p>
        {r.revisionNotes && r.reviewStatus === 'Revision Requested' && (
          <p className="mt-3 rounded-xl bg-[#9E4F37]/10 p-3 text-sm leading-relaxed text-[#9E4F37]">
            <b>{t('Catatan revisi sebelumnya:', 'Previous revision note:')}</b> {r.revisionNotes}
          </p>
        )}

        {/* izin kontributor */}
        <h2 className="mt-6 text-[20px] text-deep-forest">1. {t('Izin dari kontributor', 'Contributor consent')}</h2>
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

        <label className="mt-5 block text-sm font-semibold text-deep-forest">
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
      </div>
    </div>
  );
};
