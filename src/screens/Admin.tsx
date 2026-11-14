import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Lock, Plus } from 'lucide-react';
import QRCode from 'qrcode';
import { Ornate, ProgressBar } from '../components/ui';
import { HeritageRecord } from '../types/jejakNira';
import { useStore } from '../store';
import { RoleMascot } from '../art/RoleMascot';
import { t } from '../i18n';
import { auditAction, auditNote, auditRole, auditStamp } from '../data/display';

/** Hanya rekaman yang disetujui, berizin publik, dan diizinkan tampil di QR yang boleh ditautkan ke batch. */
const eligible = (r: HeritageRecord) => r.reviewStatus === 'Approved' && r.visibility === 'public' && r.consent.publicQrPage;

const VILLAGES = ['Pernasidi', 'Panembangan', 'Karangtengah'];

const QrImage: React.FC<{ code: string; size?: number }> = ({ code, size = 160 }) => {
  const [src, setSrc] = React.useState('');
  const url = `${window.location.origin}/p/${code}`;
  React.useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: size * 2, color: { dark: '#18382C', light: '#FFFDF8' } })
      .then(setSrc)
      .catch(() => setSrc(''));
  }, [url, size]);
  return src ? <img src={src} alt={t(`Kode QR untuk ${url}`, `QR code for ${url}`)} width={size} height={size} className="rounded-lg border border-bamboo" /> : <div style={{ width: size, height: size }} className="rounded-lg bg-bamboo/40" />;
};

const Kpi: React.FC<{ label: string; value: number; target: number; note: string; live?: boolean }> = ({ label, value, target, note, live }) => (
  <Ornate className="p-4">
    <div className="flex items-baseline justify-between gap-2">
      <p className="text-sm font-semibold text-deep-forest">{label}</p>
      <p className="text-2xl font-bold text-deep-forest">
        {value}
        <span className="text-base font-semibold text-ink-soft"> / {target}</span>
      </p>
    </div>
    <ProgressBar value={(value / target) * 100} tone="forest" className="mt-2" />
    <p className="mt-2 text-xs leading-relaxed text-ink-soft">
      {live && <b className="text-forest">{t('Langsung dari data. ', 'Live from the data. ')}</b>}
      {note}
    </p>
  </Ornate>
);

export const Admin: React.FC<{ view: 'ringkasan' | 'batch' | 'audit' | 'pengguna' }> = ({ view }) => {
  const { records, batches, audit, submissions, modules, addBatch, showToast } = useStore();
  const validated = submissions.filter((x) => x.status === 'Tervalidasi Mentor').length;
  const tab = view;
  const [product, setProduct] = React.useState('Gula Kelapa Cetak');
  const [village, setVillage] = React.useState(VILLAGES[0]);
  const [period, setPeriod] = React.useState('Nov 2026');
  const [linked, setLinked] = React.useState<string[]>([]);
  const approved = records.filter((r) => r.reviewStatus === 'Approved').length;
  const sorted = React.useMemo(() => [...records].sort((a, b) => Number(eligible(b)) - Number(eligible(a))), [records]);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const b = addBatch({ productName: product, village, period, linkedRecordIds: linked });
    setLinked([]);
    showToast(t(`Batch ${b.code} dibuat. QR siap dicetak.`, `Batch ${b.code} created. The QR is ready to print.`));
  };
  const download = async (code: string) => {
    const url = await QRCode.toDataURL(`${window.location.origin}/p/${code}`, { margin: 2, width: 800, color: { dark: '#18382C', light: '#FFFFFF' } });
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${code}.png`;
    a.click();
  };

  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0">
      <div>
        <h1 className="font-serif text-[30px] leading-tight text-deep-forest">{{ ringkasan: t('Capaian pilot', 'Pilot progress'), batch: t('Batch QR', 'QR batches'), audit: t('Catatan audit', 'Audit log'), pengguna: t('Pengguna dan peran', 'Users and roles') }[view]}</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{{ ringkasan: t('Pantau capaian terhadap target pilot 12 minggu.', 'Track progress against the 12-week pilot target.'), batch: t('Buat batch kemasan dengan kode QR yang bisa dipindai, hanya dari rekaman yang sudah disetujui.', 'Create packaging batches with scannable QR codes, from approved recordings only.'), audit: t('Setiap keputusan tata kelola tercatat di sini.', 'Every governance decision is logged here.'), pengguna: t('Siapa yang punya akses ke ruang kerja mana.', 'Who has access to which workspace.') }[view]}</p>
      </div>
        {tab === 'ringkasan' && (
          <div className="mt-4 space-y-3">
            <div className="surface flex items-center gap-4 rounded-[28px_36px_28px_36px] p-5">
              <RoleMascot role="admin" size={84} mood="think" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Pilot 12 minggu', '12-week pilot')}</p>
                <p className="font-serif text-[26px] leading-tight text-deep-forest">{t('Belum dimulai', 'Not started yet')}</p>
                <p className="text-sm text-ink-soft">{t('Angka di bawah berasal dari aplikasi ini, bukan dari lapangan.', 'The figures below come from this app, not from the field.')}</p>
              </div>
            </div>
            <div className="surface rounded-3xl p-5">
              <p className="text-sm font-bold text-deep-forest">{t('Corong pelajar (dari aplikasi ini)', 'Learner funnel (from this app)')}</p>
              {[
                [t('Modul selesai', 'Modules completed'), modules.filter((m) => m.completionPercent >= 100).length, modules.length],
                [t('Refleksi dikirim ke mentor', 'Reflections sent to a mentor'), submissions.length, Math.max(submissions.length, 1)],
                [t('Divalidasi mentor', 'Validated by a mentor'), validated, Math.max(submissions.length, 1)],
              ].map(([label, n, of]) => (
                <div key={String(label)} className="mt-3">
                  <div className="flex justify-between text-sm"><span className="text-charcoal">{label}</span><b className="text-deep-forest">{n}</b></div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-bamboo/50"><div className="h-full rounded-full bg-forest" style={{ width: `${Math.min(100, (Number(n) / Number(of)) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
            <Kpi label={t('Rekaman warisan tervalidasi', 'Validated heritage recordings')} value={approved} target={15} live note={t('Target pilot 12 minggu: minimal 15 rekaman yang disetujui kurator.', '12-week pilot target: at least 15 curator-approved recordings.')} />
            <Kpi label={t('Pelajar mencapai milestone mentor', 'Learners reaching the mentor milestone')} value={validated} target={6} live note={t('Hanya validasi mentor manusia yang dihitung. Angka ini berasal dari alur Mentor di aplikasi; pilot lapangan belum berjalan.', 'Only human mentor validation counts. This number comes from the Mentor flow in the app; the field pilot has not started.')} />
            <Kpi label={t('Pelajar dalam pilot', 'Learners in the pilot')} value={10} target={10} note={t('Angka rencana (usia 18 sampai 29).', 'Planned figure (ages 18 to 29).')} />
            <Kpi label={t('Mentor penderes', 'Tapper mentors')} value={2} target={2} note={t('Angka rencana.', 'Planned figure.')} />
            </div>
            <p className="rounded-xl bg-bamboo/40 p-3 text-xs leading-relaxed text-deep-forest">
              {t('Pilot belum berjalan. Hanya jumlah rekaman yang dihitung langsung dari aplikasi ini; angka lain adalah rencana dari proposal dan tidak mengklaim hasil.', 'The pilot has not started. Only the recording count is computed live from this app; the other figures are plans from the proposal and claim no results.')}
            </p>
          </div>
        )}

        {tab === 'batch' && (
          <div className="mt-4">
            <ul className="space-y-3">
              {batches.map((b) => (
                <li key={b.code}>
                  <Ornate className="flex gap-3 p-3">
                    <QrImage code={b.code} size={96} />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold text-deep-forest">{b.code}</p>
                      <p className="text-sm text-charcoal">{b.productName}</p>
                      <p className="text-xs text-ink-soft">
                        {t('Desa', 'Village')} {b.village} · {b.period}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">{t('Rekaman', 'Recordings')}: {b.linkedRecordIds.length ? b.linkedRecordIds.join(', ') : t('belum ada', 'none yet')}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link to={`/p/${b.code}`} className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-bamboo px-3 text-xs font-bold text-deep-forest">
                          <ExternalLink className="h-3.5 w-3.5" /> {t('Buka', 'Open')}
                        </Link>
                        <button type="button" onClick={() => download(b.code)} className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-forest px-3 text-xs font-bold text-coconut">
                          <Download className="h-3.5 w-3.5" /> PNG
                        </button>
                      </div>
                    </div>
                  </Ornate>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-[20px] text-deep-forest">{t('Buat batch baru', 'Create a new batch')}</h2>
            <form onSubmit={create} className="mt-2 space-y-3 rounded-2xl bg-coconut p-4">
              <label className="block text-sm font-semibold text-deep-forest">
                {t('Produk', 'Product')}
                <input value={product} onChange={(e) => setProduct(e.target.value)} required className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base" />
              </label>
              <label className="block text-sm font-semibold text-deep-forest">
                {t('Desa asal', 'Village of origin')}
                <select value={village} onChange={(e) => setVillage(e.target.value)} className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base">
                  {VILLAGES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-deep-forest">
                {t('Periode produksi', 'Production period')}
                <input value={period} onChange={(e) => setPeriod(e.target.value)} required className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base" />
              </label>
              <fieldset>
                <legend className="text-sm font-semibold text-deep-forest">{t('Rekaman yang ditampilkan di halaman QR', 'Recordings shown on the QR page')}</legend>
                <p className="text-xs text-ink-soft">{t('Hanya yang disetujui kurator dengan izin publik dan izin QR dari kontributor.', 'Only those approved by the curator with public and QR permission from the contributor.')}</p>
                <ul className="mt-2 space-y-1.5">
                  {sorted.map((r) => {
                    const ok = eligible(r);
                    return (
                      <li key={r.id}>
                        <label className={`flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2 text-sm leading-snug ${ok ? 'cursor-pointer bg-cream' : 'bg-bamboo/30 text-ink-soft'}`}>
                          {ok ? (
                            <input type="checkbox" checked={linked.includes(r.id)} onChange={() => setLinked((l) => (l.includes(r.id) ? l.filter((x) => x !== r.id) : [...l, r.id]))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
                          ) : (
                            <Lock className="h-5 w-5 shrink-0" />
                          )}
                          <span>
                            {r.title}
                            {!ok && <span className="block text-xs">{t('Belum boleh: menunggu persetujuan kurator atau izin publik.', 'Not yet allowed: awaiting curator approval or public permission.')}</span>}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
              <button type="submit" className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
                <Plus className="h-5 w-5" /> {t('Buat batch dan QR', 'Create batch and QR')}
              </button>
            </form>
          </div>
        )}

        {tab === 'pengguna' && (
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {([
              ['mentor', 'Mentor', 'MENTOR-2026', t('Unggah rekaman dengan izin, validasi pelajar, anotasi klip.', 'Upload recordings with consent, validate learners, annotate clips.')],
              ['curator', t('Kurator', 'Curator'), 'KURATOR-2026', t('Menyetujui rekaman dan menentukan visibilitas.', 'Approves recordings and sets visibility.')],
              ['enterprise', 'Enterprise', 'ENTERPRISE-2026', t('Mitra, pesanan, harga QR, dan keuangan.', 'Partners, orders, QR price, and finance.')],
              ['admin', 'Admin', 'ADMIN-2026', t('Super admin: capaian, batch QR, audit, dan pengguna.', 'Super admin: progress, QR batches, audit, and users.')],
            ] as const).map(([role, label, code, text]) => (
              <li key={code} className="surface flex items-center gap-4 rounded-[22px_28px_22px_28px] p-4">
                <RoleMascot role={role} size={72} />
                <div className="min-w-0">
                  <p className="font-serif text-xl text-deep-forest">{label}</p>
                  <p className="text-sm leading-snug text-ink-soft">{text}</p>
                  <p className="mt-1 text-xs font-bold text-caramel-dark">{t('Kode undangan demo', 'Demo invite code')}: {code}</p>
                </div>
              </li>
            ))}
            <li className="rounded-xl bg-bamboo/40 p-3 text-xs leading-relaxed text-deep-forest lg:col-span-2">
              {t('Prototipe: peran disimulasikan lewat kode undangan. Pada produksi, undangan dikirim per orang dan bisa dinonaktifkan oleh super admin.', 'Prototype: roles are simulated with invite codes. In production, invitations are sent per person and can be deactivated by the super admin.')}
            </li>
          </ul>
        )}

        {tab === 'audit' && (
          <ol className="mt-4 space-y-2">
            {audit.map((a) => (
              <li key={a.id} className="rounded-2xl bg-coconut p-3">
                <p className="text-xs font-semibold text-ink-soft">
                  {auditStamp(a.timestamp)} · {auditRole(a.role)}
                </p>
                <p className="mt-0.5 text-base font-semibold text-deep-forest">
                  {auditAction(a.action)} <span className="text-caramel-dark">{a.target}</span>
                </p>
                <p className="text-sm text-ink-soft">
                  {a.actor} · {auditNote(a.visibilityNote)}
                </p>
              </li>
            ))}
          </ol>
        )}
    </div>
  );
};
