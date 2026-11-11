import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Lock, Plus } from 'lucide-react';
import QRCode from 'qrcode';
import { Ornate, ProgressBar } from '../components/ui';
import { HeritageRecord } from '../types/jejakNira';
import { useStore } from '../store';
import { StaffBar } from './Kurator';

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
  return src ? <img src={src} alt={`Kode QR untuk ${url}`} width={size} height={size} className="rounded-lg border border-bamboo" /> : <div style={{ width: size, height: size }} className="rounded-lg bg-bamboo/40" />;
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
      {live && <b className="text-forest">Langsung dari data. </b>}
      {note}
    </p>
  </Ornate>
);

export const Admin: React.FC = () => {
  const { records, batches, audit, submissions, addBatch, showToast } = useStore();
  const validated = submissions.filter((x) => x.status === 'Tervalidasi Mentor').length;
  const [tab, setTab] = React.useState<'ringkasan' | 'batch' | 'audit'>('ringkasan');
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
    showToast(`Batch ${b.code} dibuat. QR siap dicetak.`);
  };
  const download = async (code: string) => {
    const url = await QRCode.toDataURL(`${window.location.origin}/p/${code}`, { margin: 2, width: 800, color: { dark: '#18382C', light: '#FFFFFF' } });
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${code}.png`;
    a.click();
  };

  return (
    <div className="min-h-full bg-cream pb-10">
      <StaffBar current="admin" />
      <div className="px-5 pt-4">
        <h1 className="text-[28px] leading-tight text-deep-forest">Koordinasi program</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">Pantau capaian pilot, buat batch QR untuk kemasan, dan tinjau catatan audit tata kelola.</p>
        <div className="mt-4 grid grid-cols-3 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {([
            ['ringkasan', 'Capaian'],
            ['batch', 'Batch QR'],
            ['audit', 'Audit'],
          ] as const).map(([k, t]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[44px] rounded-full text-sm font-semibold ${tab === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'ringkasan' && (
          <div className="mt-4 space-y-3">
            <Kpi label="Rekaman warisan tervalidasi" value={approved} target={15} live note="Target pilot 12 minggu: minimal 15 rekaman yang disetujui kurator." />
            <Kpi label="Pelajar mencapai milestone mentor" value={validated} target={6} live note="Hanya validasi mentor manusia yang dihitung. Angka ini berasal dari alur Mentor di aplikasi; pilot lapangan belum berjalan." />
            <Kpi label="Pelajar dalam pilot" value={10} target={10} note="Angka rencana (usia 18 sampai 29). Data ilustratif." />
            <Kpi label="Mentor penderes" value={2} target={2} note="Angka rencana. Data ilustratif." />
            <p className="rounded-xl bg-bamboo/40 p-3 text-xs leading-relaxed text-deep-forest">
              Pilot belum berjalan. Hanya jumlah rekaman yang dihitung langsung dari aplikasi ini; angka lain adalah rencana dari proposal dan tidak mengklaim hasil.
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
                        Desa {b.village} · {b.period}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">Rekaman: {b.linkedRecordIds.length ? b.linkedRecordIds.join(', ') : 'belum ada'}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link to={`/p/${b.code}`} className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-bamboo px-3 text-xs font-bold text-deep-forest">
                          <ExternalLink className="h-3.5 w-3.5" /> Buka
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

            <h2 className="mt-6 text-[20px] text-deep-forest">Buat batch baru</h2>
            <form onSubmit={create} className="mt-2 space-y-3 rounded-2xl bg-coconut p-4">
              <label className="block text-sm font-semibold text-deep-forest">
                Produk
                <input value={product} onChange={(e) => setProduct(e.target.value)} required className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base" />
              </label>
              <label className="block text-sm font-semibold text-deep-forest">
                Desa asal
                <select value={village} onChange={(e) => setVillage(e.target.value)} className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base">
                  {VILLAGES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-deep-forest">
                Periode produksi
                <input value={period} onChange={(e) => setPeriod(e.target.value)} required className="mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base" />
              </label>
              <fieldset>
                <legend className="text-sm font-semibold text-deep-forest">Rekaman yang ditampilkan di halaman QR</legend>
                <p className="text-xs text-ink-soft">Hanya yang disetujui kurator dengan izin publik dan izin QR dari kontributor.</p>
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
                            {!ok && <span className="block text-xs">Belum boleh: menunggu persetujuan kurator atau izin publik.</span>}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
              <button type="submit" className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-caramel-dark text-lg font-semibold text-coconut">
                <Plus className="h-5 w-5" /> Buat batch dan QR
              </button>
            </form>
          </div>
        )}

        {tab === 'audit' && (
          <ol className="mt-4 space-y-2">
            {audit.map((a) => (
              <li key={a.id} className="rounded-2xl bg-coconut p-3">
                <p className="text-xs font-semibold text-ink-soft">
                  {a.timestamp} · {a.role}
                </p>
                <p className="mt-0.5 text-base font-semibold text-deep-forest">
                  {a.action} <span className="text-caramel-dark">{a.target}</span>
                </p>
                <p className="text-sm text-ink-soft">
                  {a.actor} · {a.visibilityNote}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};
