import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, HeartHandshake, Plus, Sprout, Store, TrendingUp } from 'lucide-react';
import { Ornate } from '../components/ui';
import { PRESETS, PRICE, Assumptions, Pricing, quote, rupiah, simulate, splitPack } from '../lib/finance';
import { useStore } from '../store';
import type { QrBatch } from '../data/batches';
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
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">{t('Pembelian langsung dari kelompok perajin, tanpa tengkulak.', 'Direct purchase from artisan groups, without middlemen.')}</p>
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
  const [price, setPrice] = React.useState(24000);
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
            <li key={p.id} className="rounded-xl surface p-3 text-sm">
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
  const [p, setP] = React.useState<Pricing>(batch.pricing ?? { pricePerPack: 17500, packGram: 500, artisanPerKg: 24000, preservePct: 8 });
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

/** Daftar harga saluran jual dan penghitung pesanan: reseller hanya berlaku mulai minimal order. */
const DaftarHarga: React.FC = () => {
  const [kg, setKg] = React.useState(30);
  const q = quote(kg);
  return (
    <Ornate className="p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Daftar harga jual', 'Selling price list')}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-cream p-3">
          <p className="text-xs font-semibold text-ink-soft">{t('Jual langsung', 'Direct sale')}</p>
          <p className="font-serif text-2xl text-deep-forest">{rupiah(PRICE.direct)}</p>
          <p className="text-[11px] text-ink-soft">{t('per kg, tanpa minimal', 'per kg, no minimum')}</p>
        </div>
        <div className="rounded-2xl bg-cream p-3">
          <p className="text-xs font-semibold text-ink-soft">Reseller</p>
          <p className="font-serif text-2xl text-deep-forest">{rupiah(PRICE.reseller)}</p>
          <p className="text-[11px] text-ink-soft">{t(`per kg, minimal ${PRICE.resellerMinKg} kg`, `per kg, minimum ${PRICE.resellerMinKg} kg`)}</p>
        </div>
      </div>
      <div className="mt-3">
        <Num label={t('Hitung pesanan', 'Price an order')} value={kg} onChange={setKg} suffix="kg" step={5} />
      </div>
      <p className="mt-2 text-sm text-charcoal">
        {t('Harga langsung', 'Direct price')}: <b>{rupiah(q.direct)}</b>
      </p>
      {q.eligible && q.reseller !== null ? (
        <p className="mt-1 rounded-xl bg-forest/10 p-2 text-sm font-semibold leading-snug text-forest">
          {t('Memenuhi minimal order reseller.', 'Meets the reseller minimum order.')} {t('Harga reseller', 'Reseller price')}: {rupiah(q.reseller)} ({t('hemat', 'saves')} {rupiah(q.saving)}).
        </p>
      ) : (
        <p className="mt-1 rounded-xl bg-caramel/15 p-2 text-sm font-semibold leading-snug text-caramel-dark">
          {t(`Belum memenuhi minimal order reseller: kurang ${q.short} kg lagi untuk harga reseller.`, `Below the reseller minimum order: ${q.short} kg more for the reseller price.`)}
        </p>
      )}
    </Ornate>
  );
};

const Harga: React.FC = () => {
  const { batches } = useStore();
  return (
    <div className="mt-4 space-y-3">
      <DaftarHarga />
      <p className="rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        {t('Pembagian harga tiap batch dipakai koperasi untuk menghitung bagian perajin dan dana pelestarian. Pembeli melihat harga dan jumlah di Toko.', 'The price split of each batch is used by the cooperative to work out the artisan share and the preservation fund. Buyers see the price and amount in the Shop.')}
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
        {t('Simulasi, bukan proyeksi. Harga jual (langsung Rp35.000, reseller Rp30.000, minimal 30 kg) dari tim. Harga beli, harga acuan, biaya, porsi reseller, dan dana pelestarian masih angka contoh yang bisa kamu ubah.', 'A simulation, not a projection. Selling prices (direct Rp35,000, reseller Rp30,000, minimum 30 kg) come from the team. The purchase price, reference price, costs, reseller share, and preservation fund are still example figures you can change.')}
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
        <Num label={t('Harga jual langsung', 'Direct selling price')} value={a.directPrice} onChange={set('directPrice')} suffix="Rp/kg" step={500} />
        <Num label={t('Harga reseller', 'Reseller price')} value={a.resellerPrice} onChange={set('resellerPrice')} suffix="Rp/kg" step={500} />
        <Num label={t('Porsi lewat reseller', 'Share via resellers')} value={a.resellerShare} onChange={set('resellerShare')} suffix="% volume" step={5} />
        <Num label={t('Minimal order reseller', 'Reseller minimum order')} value={a.resellerMinKg} onChange={set('resellerMinKg')} suffix="kg" step={5} />
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
          {t('Omzet', 'Revenue')}: <b>{rupiah(o.revenue)}</b> · {t('harga rata-rata', 'average price')} {rupiah(o.avgPrice)}/kg
        </p>
        <p className={`mt-1 rounded-xl p-3 text-sm font-semibold leading-snug ${covered ? 'bg-forest/10 text-forest' : 'bg-[#9E4F37]/10 text-[#9E4F37]'}`}>
          {covered
            ? t(`Biaya tertutup. Laba bersih ${rupiah(o.net)} per bulan.`, `Costs are covered. Net profit is ${rupiah(o.net)} per month.`)
            : t(`Belum menutup biaya: kurang ${rupiah(-o.net)} per bulan. ${Number.isFinite(o.breakEvenKg) ? `Titik impas ±${Math.ceil(o.breakEvenKg)} kg per bulan.` : 'Margin per kg tidak positif: naikkan harga jual atau turunkan biaya.'}`, `Costs are not covered: short by ${rupiah(-o.net)} per month. ${Number.isFinite(o.breakEvenKg) ? `Break-even is about ${Math.ceil(o.breakEvenKg)} kg per month.` : 'The margin per kg is not positive: raise the price or cut costs.'}`)}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-charcoal">
          <li className="flex gap-2">
            <Store className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" />
            <span>
              {t('Margin per kg:', 'Margin per kg:')} {t('langsung', 'direct')} <b className={o.directMargin >= 0 ? 'text-forest' : 'text-[#9E4F37]'}>{rupiah(o.directMargin)}</b>, reseller <b className={o.resellerMargin >= 0 ? 'text-forest' : 'text-[#9E4F37]'}>{rupiah(o.resellerMargin)}</b>. {t(`Pesanan reseller: ±${o.maxResellerOrders} per bulan bila tiap pesanan tepat ${a.resellerMinKg} kg.`, `Reseller orders: up to ${o.maxResellerOrders} per month if each order is exactly ${a.resellerMinKg} kg.`)}
            </span>
          </li>
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

const Head: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div>
    <h1 className="font-serif text-[30px] leading-tight text-deep-forest">{title}</h1>
    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
  </div>
);

export const EnterprisePartners: React.FC = () => (
  <div className="px-4 pt-4 lg:px-0 lg:pt-0">
    <Head title={t('Mitra dan pembelian', 'Partners and purchases')} text={t('Kelompok perajin yang bermitra dan pembelian langsung dari mereka, dengan premi di atas harga acuan.', 'The artisan groups you partner with and direct purchases from them, with a premium over the reference price.')} />
    <Mitra />
    <h2 className="mt-8 text-xl text-deep-forest">{t('Catatan pembelian', 'Purchase records')}</h2>
    <Pembelian />
  </div>
);

export const EnterprisePrice: React.FC = () => (
  <div className="px-4 pt-4 lg:px-0 lg:pt-0">
    <Head title={t('Harga dan kemasan', 'Pricing and packaging')} text={t('Daftar harga jual dan pembagian harga tiap batch yang tampil ke pembeli di halaman QR.', 'The selling price list and the price split of each batch shown to buyers on the QR page.')} />
    <Harga />
  </div>
);

export const EnterpriseFinance: React.FC = () => (
  <div className="px-4 pt-4 lg:px-0 lg:pt-0">
    <Head title={t('Keuangan', 'Finance')} text={t('Simulasi yang menunjukkan bagaimana dana pelestarian menopang Jejak Nira.', 'A simulation of how the preservation fund sustains Jejak Nira.')} />
    <Simulasi />
  </div>
);
