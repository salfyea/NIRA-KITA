import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, HeartHandshake, Plus, Sprout, TrendingUp } from 'lucide-react';
import { Ornate } from '../components/ui';
import { PRESETS, Assumptions, Pricing, rupiah, simulate, splitPack } from '../lib/finance';
import { useStore } from '../store';
import type { QrBatch } from '../data/batches';
import { StaffBar } from './Kurator';
import { COLORS, StackBar } from '../components/StackBar';
import { t } from '../i18n';

const field = 'mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base text-charcoal';

const Num: React.FC<{ label: string; value: number; onChange: (n: number) => void; suffix?: string; step?: number; hint?: string }> = ({ label, value, onChange, suffix, step = 1, hint }) => (
  <label className="block text-sm font-semibold text-deep-forest">
    {label}
    <div className="relative">
      <input type="number" inputMode="decimal" min={0} step={step} value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(Number(e.target.value))} className={`${field} ${suffix ? 'pr-14' : ''}`} />
      {suffix && <span className="pointer-events-none absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-sm text-ink-soft">{suffix}</span>}
    </div>
    {hint && <span className="mt-0.5 block text-xs font-normal text-ink-soft">{hint}</span>}
  </label>
);

/* ============================ Mitra ============================ */
const Mitra: React.FC = () => {
  const { partners, purchases } = useStore();
  const active = partners.filter((p) => p.status === 'Mitra aktif');
  const kg = purchases.reduce((a, p) => a + p.kg, 0);
  const premium = purchases.reduce((a, p) => a + p.kg * (p.pricePerKg - p.marketRef), 0);
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          [String(active.length), t('mitra aktif', 'active partners')],
          [`${kg}`, t('kg dibeli', 'kg bought')],
          [rupiah(premium).replace('Rp', 'Rp '), t('premi ke perajin', 'premium to artisans')],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-coconut p-3 text-center">
            <p className="font-serif text-xl leading-tight text-deep-forest">{v}</p>
            <p className="mt-0.5 text-[11px] font-semibold leading-tight text-ink-soft">{l}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">{t('Pembelian langsung dari kelompok perajin, tanpa tengkulak. Angka di sini ilustratif sampai kelompok sungguhan terdaftar.', 'Direct purchase from artisan groups, without middlemen. Figures here are illustrative until real groups are registered.')}</p>
      <ul className="mt-3 space-y-3">
        {partners.map((p) => (
          <li key={p.id}>
            <Ornate className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-deep-forest">{p.name}</p>
                  <p className="text-xs text-ink-soft">
                    {t('Desa', 'Village')} {p.village} · {p.members} {t('anggota', 'members')}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${p.status === 'Mitra aktif' ? 'bg-forest/10 text-forest' : 'bg-caramel/15 text-caramel-dark'}`}>{p.status === 'Mitra aktif' ? t('Mitra aktif', 'Active partner') : t('Penjajakan', 'Exploring')}</span>
              </div>
              <p className="mt-2 text-sm text-charcoal">
                {t('Kapasitas', 'Capacity')}: <b>{p.capacityKg} kg</b> {t('per bulan', 'per month')}
              </p>
              <p className={`mt-1 text-xs font-semibold ${p.consentName ? 'text-forest' : 'text-[#9E4F37]'}`}>
                {p.consentName ? t('Nama kelompok boleh tampil di halaman QR', 'The group name may appear on the QR page') : t('Nama kelompok belum boleh tampil: izin belum ada', 'The group name may not appear yet: no consent')}
              </p>
            </Ornate>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ============================ Pembelian ============================ */
const Pembelian: React.FC = () => {
  const { partners, purchases, marketRef, addPurchase, setMarketRef, showToast } = useStore();
  const [partnerId, setPartnerId] = React.useState(partners[0]?.id ?? '');
  const [kg, setKg] = React.useState(50);
  const [price, setPrice] = React.useState(20000);
  const totalKg = purchases.reduce((a, p) => a + p.kg, 0);
  const totalPay = purchases.reduce((a, p) => a + p.kg * p.pricePerKg, 0);
  const premium = purchases.reduce((a, p) => a + p.kg * (p.pricePerKg - p.marketRef), 0);
  const ok = partnerId && kg > 0 && price > 0;
  return (
    <div className="mt-4">
      <Num label={t('Harga acuan pasar (tengkulak)', 'Market reference price (middleman)')} value={marketRef} onChange={setMarketRef} suffix="Rp/kg" step={500} hint={t('Pembanding untuk menghitung premi. Isi dengan harga yang berlaku di desa.', 'The comparison used to compute the premium. Enter the price that applies in the village.')} />

      <form
        className="mt-4 space-y-3 rounded-2xl bg-coconut p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ok) return;
          addPurchase({ partnerId, kg, pricePerKg: price });
          showToast(t('Pembelian dicatat dan masuk audit.', 'Purchase recorded and logged in the audit.'));
        }}
      >
        <p className="text-sm font-bold text-deep-forest">{t('Catat pembelian', 'Record a purchase')}</p>
        <label className="block text-sm font-semibold text-deep-forest">
          {t('Mitra', 'Partner')}
          <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)} className={field}>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Num label={t('Jumlah', 'Amount')} value={kg} onChange={setKg} suffix="kg" />
          <Num label={t('Harga beli', 'Purchase price')} value={price} onChange={setPrice} suffix="Rp/kg" step={500} />
        </div>
        <p className="text-sm text-charcoal">
          {t('Premi di atas acuan', 'Premium over reference')}: <b className={price >= marketRef ? 'text-forest' : 'text-[#9E4F37]'}>{rupiah((price - marketRef) * kg)}</b> ({price >= marketRef ? '+' : ''}
          {rupiah(price - marketRef)}/kg)
        </p>
        <button type="submit" disabled={!ok} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
          <Plus className="h-5 w-5" /> {t('Catat pembelian', 'Record purchase')}
        </button>
      </form>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          [`${totalKg} kg`, t('total dibeli', 'total bought')],
          [rupiah(totalPay), t('total dibayar', 'total paid')],
          [rupiah(premium), t('total premi', 'total premium')],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-cream p-2">
            <p className="text-sm font-bold text-deep-forest">{v}</p>
            <p className="text-[11px] text-ink-soft">{l}</p>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {purchases.map((p) => {
          const partner = partners.find((x) => x.id === p.partnerId);
          const diff = p.pricePerKg - p.marketRef;
          return (
            <li key={p.id} className="rounded-xl border border-bamboo bg-coconut p-3 text-sm">
              <div className="flex justify-between gap-2">
                <b className="text-deep-forest">{partner?.name ?? p.partnerId}</b>
                <span className="shrink-0 text-xs text-ink-soft">{p.date}</span>
              </div>
              <p className="text-charcoal">
                {p.kg} kg × {rupiah(p.pricePerKg)} = <b>{rupiah(p.kg * p.pricePerKg)}</b>
              </p>
              <p className={`text-xs font-semibold ${diff >= 0 ? 'text-forest' : 'text-[#9E4F37]'}`}>
                {diff >= 0 ? '+' : ''}
                {rupiah(diff)}/kg {t('dari acuan', 'vs reference')} · {p.id}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ============================ Harga kemasan ============================ */
const BatchPricing: React.FC<{ batch: QrBatch }> = ({ batch }) => {
  const { setBatchPricing, showToast } = useStore();
  const [p, setP] = React.useState<Pricing>(batch.pricing ?? { pricePerPack: 16000, packGram: 500, artisanPerKg: 20000, preservePct: 8 });
  const split = splitPack(p);
  const set = (k: keyof Pricing) => (n: number) => setP((v) => ({ ...v, [k]: n }));
  return (
    <Ornate className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-semibold text-deep-forest">
            {batch.code} · {batch.productName}
          </p>
          <p className="text-xs text-ink-soft">
            {t('Desa', 'Village')} {batch.village} · {batch.period}
          </p>
        </div>
        <Link to={`/p/${batch.code}`} className="flex min-h-[44px] shrink-0 items-center gap-1 text-xs font-bold text-caramel-dark">
          <ExternalLink className="h-3.5 w-3.5" /> {t('Lihat di QR', 'See on QR')}
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Num label={t('Harga kemasan', 'Pack price')} value={p.pricePerPack} onChange={set('pricePerPack')} suffix="Rp" step={500} />
        <Num label={t('Isi kemasan', 'Pack weight')} value={p.packGram} onChange={set('packGram')} suffix="g" step={50} />
        <Num label={t('Harga ke perajin', 'Paid to artisans')} value={p.artisanPerKg} onChange={set('artisanPerKg')} suffix="Rp/kg" step={500} />
        <Num label={t('Dana pelestarian', 'Preservation fund')} value={p.preservePct} onChange={set('preservePct')} suffix="%" step={1} />
      </div>
      <div className="mt-3">
        <StackBar
          parts={[
            { label: t('Ke perajin', 'To artisans'), value: split.artisan, color: COLORS.artisan },
            { label: t('Dana pelestarian (Jejak Nira)', 'Preservation fund (Jejak Nira)'), value: split.preserve, color: COLORS.preserve },
            { label: t('Operasional dan margin', 'Operations and margin'), value: Math.max(0, split.rest), color: COLORS.rest },
          ]}
        />
      </div>
      {!split.valid && <p role="alert" className="mt-2 text-xs font-semibold text-[#9E4F37]">{t('Bagian perajin dan dana pelestarian melebihi harga kemasan. Naikkan harga atau kurangi bagian.', 'The artisan and fund shares exceed the pack price. Raise the price or lower a share.')}</p>}
      <button
        type="button"
        disabled={!split.valid}
        onClick={() => {
          setBatchPricing(batch.code, p);
          showToast(t(`Harga ${batch.code} disimpan dan tampil di halaman QR.`, `Price for ${batch.code} saved and shown on the QR page.`));
        }}
        className="mt-3 min-h-[52px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
      >
        {batch.pricing ? t('Perbarui harga', 'Update price') : t('Simpan dan tampilkan di QR', 'Save and show on QR')}
      </button>
    </Ornate>
  );
};

const Harga: React.FC = () => {
  const { batches } = useStore();
  return (
    <div className="mt-4 space-y-3">
      <p className="rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        {t('Pembeli yang memindai kemasan melihat ke mana uangnya pergi: ke perajin, ke dana pelestarian Jejak Nira, dan ke operasional. Itulah nilai tambah produk ini.', 'A buyer who scans the package sees where the money goes: to the artisans, to the Jejak Nira preservation fund, and to operations. That is the added value of this product.')}
      </p>
      {batches.map((b) => (
        <BatchPricing key={`${b.code}-${b.pricing?.pricePerPack ?? 0}`} batch={b} />
      ))}
    </div>
  );
};

/* ============================ Simulasi ============================ */
const Simulasi: React.FC = () => {
  const [a, setA] = React.useState<Assumptions>(PRESETS[1].a);
  const [preset, setPreset] = React.useState<string>('dasar');
  const o = simulate(a);
  const set = (k: keyof Assumptions) => (n: number) => {
    setPreset('');
    setA((v) => ({ ...v, [k]: n }));
  };
  const presetName = { konservatif: t('Konservatif', 'Conservative'), dasar: t('Dasar', 'Base'), tumbuh: t('Tumbuh', 'Growth') };
  const covered = o.net >= 0;
  return (
    <div className="mt-4">
      <p className="rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        {t('Simulasi, bukan proyeksi. Semua angka adalah asumsi contoh yang bisa kamu ubah. Ganti dengan angka koperasi sebelum dipakai untuk keputusan.', 'A simulation, not a projection. Every number is an example assumption you can change. Replace them with the cooperative\'s real figures before using it for decisions.')}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={t('Skenario', 'Scenario')}>
        {PRESETS.map((pr) => (
          <button key={pr.key} type="button" aria-pressed={preset === pr.key} onClick={() => { setA(pr.a); setPreset(pr.key); }} className={`min-h-[44px] rounded-full text-sm font-semibold ${preset === pr.key ? 'bg-forest text-coconut' : 'border border-bamboo text-deep-forest'}`}>
            {presetName[pr.key]}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Num label={t('Volume dibeli', 'Volume bought')} value={a.kgPerMonth} onChange={set('kgPerMonth')} suffix="kg/bln" step={50} />
        <Num label={t('Harga beli adil', 'Fair purchase price')} value={a.buyPrice} onChange={set('buyPrice')} suffix="Rp/kg" step={500} />
        <Num label={t('Harga acuan pasar', 'Market reference')} value={a.marketRef} onChange={set('marketRef')} suffix="Rp/kg" step={500} />
        <Num label={t('Harga jual', 'Selling price')} value={a.sellPrice} onChange={set('sellPrice')} suffix="Rp/kg" step={500} />
        <Num label={t('Biaya per kg', 'Cost per kg')} value={a.opsPerKg} onChange={set('opsPerKg')} suffix="Rp/kg" step={250} hint={t('kemasan, QR, angkut', 'packaging, QR, transport')} />
        <Num label={t('Biaya tetap', 'Fixed costs')} value={a.fixedCost} onChange={set('fixedCost')} suffix="Rp/bln" step={100000} />
        <Num label={t('Dana pelestarian', 'Preservation fund')} value={a.preservePct} onChange={set('preservePct')} suffix="% omzet" step={1} hint={t('dipotong dari omzet, di depan', 'taken from revenue, up front')} />
        <Num label={t('Honor 1 mentor', 'One mentor\'s fee')} value={a.mentorFee} onChange={set('mentorFee')} suffix="Rp/bln" step={50000} />
      </div>

      <Ornate className="mt-4 p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">
          <TrendingUp className="h-3.5 w-3.5" /> {t('Hasil per bulan', 'Monthly result')}
        </p>
        <StackBar
          parts={[
            { label: t('Dibayar ke perajin', 'Paid to artisans'), value: o.cogs, color: COLORS.artisan },
            { label: t('Dana pelestarian', 'Preservation fund'), value: o.preserve, color: COLORS.preserve },
            { label: t('Biaya operasional', 'Operating costs'), value: o.ops, color: COLORS.rest },
            { label: t('Laba bersih', 'Net profit'), value: Math.max(0, o.net), color: '#234B3A' },
          ]}
        />
        <p className="mt-3 text-sm text-charcoal">
          {t('Omzet', 'Revenue')}: <b>{rupiah(o.revenue)}</b>
        </p>
        <p className={`mt-1 rounded-xl p-3 text-sm font-semibold leading-snug ${covered ? 'bg-forest/10 text-forest' : 'bg-[#9E4F37]/10 text-[#9E4F37]'}`}>
          {covered
            ? t(`Biaya tertutup. Laba bersih ${rupiah(o.net)} per bulan.`, `Costs are covered. Net profit is ${rupiah(o.net)} per month.`)
            : t(`Belum menutup biaya: kurang ${rupiah(-o.net)} per bulan. ${Number.isFinite(o.breakEvenKg) ? `Titik impas ±${Math.ceil(o.breakEvenKg)} kg per bulan.` : 'Margin per kg tidak positif: naikkan harga jual atau turunkan biaya.'}`, `Costs are not covered: short by ${rupiah(-o.net)} per month. ${Number.isFinite(o.breakEvenKg) ? `Break-even is about ${Math.ceil(o.breakEvenKg)} kg per month.` : 'The margin per kg is not positive: raise the price or cut costs.'}`)}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-charcoal">
          <li className="flex gap-2">
            <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
            <span>
              {t('Perajin menerima', 'Artisans receive')} <b>{o.artisanShare.toFixed(0)}%</b> {t('dari omzet', 'of revenue')}, {t('dan premi', 'plus a premium of')} <b>{rupiah(o.premium)}</b> {t('di atas harga acuan', 'over the reference price')}.
            </span>
          </li>
          <li className="flex gap-2">
            <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-caramel-dark" />
            <span>
              {t('Dana pelestarian', 'The preservation fund of')} <b>{rupiah(o.preserve)}</b> {t('mendanai', 'funds')} <b>{o.mentorsFunded.toFixed(1)}</b> {t('honorarium mentor per bulan.', 'mentor fee(s) per month.')}
            </span>
          </li>
        </ul>
        <p className="mt-3 text-[11px] leading-snug text-ink-soft">
          {t('Rumus: laba = omzet − pembelian − biaya operasional − dana pelestarian. Dana pelestarian dipotong dari omzet lebih dulu, jadi Jejak Nira terdanai walau laba tipis.', 'Formula: profit = revenue − purchases − operating costs − preservation fund. The fund is taken from revenue first, so Jejak Nira is funded even when profit is thin.')}
        </p>
      </Ornate>
    </div>
  );
};

export const Enterprise: React.FC = () => {
  const [tab, setTab] = React.useState<'mitra' | 'pembelian' | 'harga' | 'simulasi'>('mitra');
  const tabs = [
    ['mitra', t('Mitra', 'Partners')],
    ['pembelian', t('Pembelian', 'Purchases')],
    ['harga', t('Harga QR', 'QR price')],
    ['simulasi', t('Simulasi', 'Simulation')],
  ] as const;
  return (
    <div className="min-h-full bg-cream pb-10">
      <StaffBar current="enterprise" />
      <div className="px-5 pt-4">
        <h1 className="text-[28px] leading-tight text-deep-forest">NIRA Enterprise</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {t('Pemberdayaan ekonomi: kemitraan petani, pengadaan adil, produk bernilai budaya, dan margin yang menopang Jejak Nira.', 'Economic empowerment: farmer partnerships, fair procurement, culturally valuable products, and margin that sustains Jejak Nira.')}
        </p>
        <div className="mt-4 grid grid-cols-4 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {tabs.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[44px] rounded-full text-[13px] font-semibold ${tab === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'mitra' && <Mitra />}
        {tab === 'pembelian' && <Pembelian />}
        {tab === 'harga' && <Harga />}
        {tab === 'simulasi' && <Simulasi />}
      </div>
    </div>
  );
};
