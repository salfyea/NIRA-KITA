import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, Lock, LogOut, QrCode, ShieldCheck, Users, X } from 'lucide-react';
import { Ornate } from '../components/ui';
import { attribution } from '../data/attribution';
import { CuratorChecklist, HeritageRecord, VisibilityScope } from '../types/jejakNira';
import { useStore } from '../store';

/** Bilah atas area staf: berpindah antara Kurator dan Admin, plus keluar. */
export const StaffBar: React.FC<{ current: 'kurator' | 'admin' }> = ({ current }) => {
  const { session, signOut } = useStore();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 border-b border-bamboo bg-cream/95 px-5 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Area staf · prototipe</p>
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
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
      <nav className="mt-2 grid grid-cols-2 rounded-full border border-bamboo bg-coconut p-1" aria-label="Area staf">
        {([
          ['kurator', '/kurator', 'Kurator', ShieldCheck],
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

const STATUS_LABEL: Record<string, string> = {
  Approved: 'Disetujui',
  'In Review': 'Menunggu tinjauan',
  'Revision Requested': 'Perlu revisi',
  Rejected: 'Ditolak',
  Draft: 'Draf',
  Archived: 'Diarsipkan',
};
const statusTone = (s: string) =>
  s === 'Approved' ? 'bg-forest/10 text-forest border-forest/25' : s === 'In Review' ? 'bg-caramel/15 text-caramel-dark border-caramel/30' : 'bg-[#9E4F37]/10 text-[#9E4F37] border-[#9E4F37]/30';

const scopeLabel = (v: VisibilityScope) => (v === 'public' ? 'Publik (halaman QR)' : v === 'learner' ? 'Akses Pelajar' : 'Privat');

/* ============================== Antrean ============================== */

export const Kurator: React.FC = () => {
  const { records } = useStore();
  const navigate = useNavigate();
  const [f, setF] = React.useState<'tunggu' | 'setuju' | 'semua'>('tunggu');
  const pending = records.filter((r) => r.reviewStatus === 'In Review' || r.reviewStatus === 'Revision Requested');
  const approved = records.filter((r) => r.reviewStatus === 'Approved');
  const list = f === 'tunggu' ? pending : f === 'setuju' ? approved : records;
  return (
    <div className="min-h-full bg-cream pb-8">
      <StaffBar current="kurator" />
      <div className="px-5 pt-4">
        <h1 className="text-[28px] leading-tight text-deep-forest">Antrean tinjauan</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Kurator memeriksa izin kontributor dan konteks budaya, lalu menentukan siapa yang boleh melihat setiap rekaman. Tidak ada yang tampil ke pelajar atau publik tanpa persetujuan di sini.
        </p>
        <div className="mt-4 grid grid-cols-3 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {([
            ['tunggu', `Menunggu (${pending.length})`],
            ['setuju', `Disetujui (${approved.length})`],
            ['semua', 'Semua'],
          ] as const).map(([k, t]) => (
            <button key={k} type="button" role="tab" aria-selected={f === k} onClick={() => setF(k)} className={`min-h-[44px] rounded-full text-xs font-bold ${f === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}>
              {t}
            </button>
          ))}
        </div>
        <ul className="mt-3 space-y-3">
          {list.map((r) => (
            <li key={r.id}>
              <Ornate as="button" onClick={() => navigate(`/kurator/${r.id}`)} className="p-4">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-ink-soft">{r.id}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(r.reviewStatus)}`}>{STATUS_LABEL[r.reviewStatus]}</span>
                </span>
                <span className="mt-1 block text-lg leading-snug text-deep-forest">{r.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {r.contributorName} · {r.location.replace(', Cilongok, Banyumas', '')}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
                  <span className={`rounded-full px-2 py-0.5 ${r.consent.internalLearning ? 'bg-forest/10 text-forest' : 'bg-bamboo/60 text-ink-soft'}`}>Izin pelajar {r.consent.internalLearning ? '✓' : '✗'}</span>
                  <span className={`rounded-full px-2 py-0.5 ${r.consent.publicQrPage ? 'bg-forest/10 text-forest' : 'bg-bamboo/60 text-ink-soft'}`}>Izin QR publik {r.consent.publicQrPage ? '✓' : '✗'}</span>
                  <span className="rounded-full bg-coconut px-2 py-0.5 text-deep-forest ring-1 ring-bamboo">{scopeLabel(r.visibility)}</span>
                </span>
              </Ornate>
            </li>
          ))}
          {list.length === 0 && <li className="rounded-2xl bg-coconut p-4 text-sm text-ink-soft">Tidak ada rekaman di daftar ini.</li>}
        </ul>
      </div>
    </div>
  );
};

/* ============================== Detail ============================== */

const CHECKS: [keyof CuratorChecklist, string][] = [
  ['permissionVerified', 'Izin kontributor terverifikasi (rekaman persetujuan)'],
  ['attributionConfirmed', 'Atribusi sesuai preferensi kontributor'],
  ['culturalContextReviewed', 'Konteks budaya sudah ditinjau'],
  ['terminologyChecked', 'Istilah dan terjemahan sudah diperiksa'],
  ['mediaSuitabilityChecked', 'Media layak tampil (tidak sakral, tidak berbahaya)'],
  ['intendedAudienceConfirmed', 'Audiens tujuan sudah dikonfirmasi'],
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
    toast(status === 'Approved' ? 'Rekaman disetujui dan dicatat di audit.' : status === 'Revision Requested' ? 'Revisi diminta dan dicatat di audit.' : 'Rekaman ditolak dan dicatat di audit.');
  };

  const options: { v: VisibilityScope; t: string; d: string; ok: boolean; why?: string }[] = [
    { v: 'private', t: 'Privat', d: 'Hanya tim internal.', ok: true },
    { v: 'learner', t: 'Akses Pelajar', d: 'Tampil di aplikasi pelajar.', ok: r.consent.internalLearning, why: 'Kontributor belum mengizinkan penggunaan untuk pembelajaran.' },
    { v: 'public', t: 'Publik (halaman QR)', d: 'Tampil untuk pembeli yang memindai kemasan.', ok: r.consent.publicQrPage, why: 'Kontributor belum mengizinkan tampil di halaman QR publik.' },
  ];

  return (
    <div className="min-h-full bg-cream pb-10">
      <StaffBar current="kurator" />
      <div className="px-5 pt-3">
        <Link to="/kurator" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
          <ArrowLeft className="h-4 w-4" /> Antrean
        </Link>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-ink-soft">{r.id}</p>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(r.reviewStatus)}`}>{STATUS_LABEL[r.reviewStatus]}</span>
        </div>
        <h1 className="text-[26px] leading-tight text-deep-forest">{r.title}</h1>
        <p className="mt-2 text-base leading-relaxed text-charcoal">{r.culturalExplanation}</p>
        <p className="mt-2 text-sm text-ink-soft">
          {attribution(r)} · {r.location}
        </p>
        {r.revisionNotes && r.reviewStatus === 'Revision Requested' && (
          <p className="mt-3 rounded-xl bg-[#9E4F37]/10 p-3 text-sm leading-relaxed text-[#9E4F37]">
            <b>Catatan revisi sebelumnya:</b> {r.revisionNotes}
          </p>
        )}

        {/* izin kontributor */}
        <h2 className="mt-6 text-[20px] text-deep-forest">1. Izin dari kontributor</h2>
        <ul className="mt-2 space-y-1.5">
          {([
            ['internalLearning', 'Pembelajaran di aplikasi'],
            ['publicQrPage', 'Halaman QR publik'],
            ['promotionalMaterial', 'Materi promosi'],
          ] as const).map(([k, t]) => (
            <li key={k} className="flex items-center gap-2 rounded-xl bg-coconut px-3 py-2.5 text-sm font-semibold text-deep-forest">
              {r.consent[k] ? <Check className="h-5 w-5 text-forest" /> : <X className="h-5 w-5 text-[#9E4F37]" />}
              {t}
              <span className={`ml-auto text-xs ${r.consent[k] ? 'text-forest' : 'text-[#9E4F37]'}`}>{r.consent[k] ? 'Diizinkan' : 'Belum diizinkan'}</span>
            </li>
          ))}
        </ul>

        {/* checklist */}
        <h2 className="mt-6 flex items-baseline justify-between text-[20px] text-deep-forest">
          2. Checklist kurator <span className="text-sm font-bold text-ink-soft">{checked}/6</span>
        </h2>
        <ul className="mt-2 space-y-1.5">
          {CHECKS.map(([k, t]) => (
            <li key={k}>
              <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl bg-coconut px-3 py-2 text-sm leading-snug text-charcoal">
                <input type="checkbox" checked={check[k]} onChange={() => setCheck((c) => ({ ...c, [k]: !c[k] }))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
                {t}
              </label>
            </li>
          ))}
        </ul>

        {/* visibilitas */}
        <h2 className="mt-6 text-[20px] text-deep-forest">3. Siapa yang boleh melihat?</h2>
        <div className="mt-2 space-y-2" role="radiogroup" aria-label="Visibilitas">
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
          Catatan untuk kontributor atau mentor
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Wajib diisi bila meminta revisi atau menolak"
            className="mt-1 w-full rounded-xl border border-bamboo bg-coconut p-3 text-base text-charcoal placeholder:text-ink-soft"
          />
        </label>

        {done ? (
          <Ornate className="mt-5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">Keputusan tercatat</p>
            <p className="mt-1 text-lg text-deep-forest">{done === 'Approved' ? 'Disetujui' : done === 'Revision Requested' ? 'Revisi diminta' : 'Ditolak'}</p>
            {done === 'Approved' ? (
              <ul className="mt-2 space-y-1.5 text-sm font-semibold">
                <li className={`flex items-center gap-2 ${vis !== 'private' ? 'text-forest' : 'text-ink-soft'}`}>
                  <Eye className="h-4 w-4" /> Aplikasi pelajar: {vis !== 'private' ? 'tampil' : 'tidak tampil'}
                </li>
                <li className={`flex items-center gap-2 ${vis === 'public' ? 'text-forest' : 'text-ink-soft'}`}>
                  <QrCode className="h-4 w-4" /> Halaman QR publik: {vis === 'public' ? 'tampil' : 'tidak tampil'}
                </li>
              </ul>
            ) : (
              <p className="mt-1 text-sm text-ink-soft">Tidak tampil ke pelajar maupun publik.</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/kurator" className="inline-flex min-h-[44px] items-center rounded-full bg-forest px-5 text-sm font-semibold text-coconut">
                Kembali ke antrean
              </Link>
              <Link to="/admin" className="inline-flex min-h-[44px] items-center rounded-full border-2 border-bamboo px-5 text-sm font-semibold text-deep-forest">
                Lihat di audit
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
              {allChecked ? 'Setujui' : `Lengkapi checklist (${checked}/6) untuk menyetujui`}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!note.trim()}
                onClick={() => decide('Revision Requested')}
                className="min-h-[52px] rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark disabled:opacity-40"
              >
                Minta revisi
              </button>
              <button
                type="button"
                disabled={!note.trim()}
                onClick={() => decide('Rejected')}
                className="min-h-[52px] rounded-full border-2 border-[#9E4F37] text-base font-semibold text-[#9E4F37] disabled:opacity-40"
              >
                Tolak
              </button>
            </div>
            {!note.trim() && <p className="text-center text-xs text-ink-soft">Isi catatan untuk bisa meminta revisi atau menolak.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
