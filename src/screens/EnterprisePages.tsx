import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { RoleMascot } from '../art/RoleMascot';
import { Nira } from '../art/Nira';
import { LeafArrow } from '../art/Organic';
import { COLORS, StackBar } from '../components/StackBar';
import { BUY_PRICE, PRESERVE_PCT, PRICE, channelOf, quote, rupiah, unitPrice } from '../lib/finance';
import { ORDER_FLOW, Order, OrderStatus, useStore } from '../store';
import { t } from '../i18n';

const STATUS_LABEL = (s: OrderStatus) => ({ Baru: t('Baru', 'New'), Dikemas: t('Dikemas', 'Packing'), Dikirim: t('Dikirim', 'Shipped'), Selesai: t('Selesai', 'Done') })[s];
const NEXT_ACTION = (s: OrderStatus) => ({ Baru: t('Kemas pesanan', 'Pack the order'), Dikemas: t('Tandai dikirim', 'Mark as shipped'), Dikirim: t('Tandai selesai', 'Mark as done'), Selesai: '' })[s];
const orderTotal = (o: Order) => o.kg * unitPrice(o.channel);

/** Hitungan bersama untuk beranda: stok, omzet, dan dana pelestarian dari data langsung di aplikasi. */
export const useEnterpriseStats = () => {
  const { orders, purchases } = useStore();
  const bought = purchases.reduce((a, p) => a + p.kg, 0);
  const committed = orders.reduce((a, o) => a + o.kg, 0);
  const done = orders.filter((o) => o.status !== 'Baru');
  const revenue = done.reduce((a, o) => a + orderTotal(o), 0);
  const preserve = (revenue * PRESERVE_PCT) / 100;
  const artisan = done.reduce((a, o) => a + o.kg * BUY_PRICE, 0);
  const premium = purchases.reduce((a, p) => a + p.kg * (p.pricePerKg - p.marketRef), 0);
  return { bought, stock: bought - committed, revenue, preserve, artisan, rest: Math.max(0, revenue - preserve - artisan), premium, count: (s: OrderStatus) => orders.filter((o) => o.status === s).length };
};

const Tile: React.FC<{ to: string; n: number | string; label: string; hint?: string; warn?: boolean }> = ({ to, n, label, hint, warn }) => (
  <Link to={to} className="surface block rounded-[22px_28px_22px_28px] p-4 transition-transform active:scale-[0.98]">
    <span className={`block font-serif text-[34px] leading-none ${warn ? 'text-[#9E4F37]' : 'text-deep-forest'}`}>{n}</span>
    <span className="mt-1.5 block text-[13px] font-semibold leading-snug text-deep-forest">{label}</span>
    {hint && <span className="mt-0.5 block text-xs leading-snug text-ink-soft">{hint}</span>}
  </Link>
);

/** Beranda Enterprise, gaya Seller Centre: yang perlu ditindak dulu, lalu angka ringkas dan ke mana uang pergi. */
export const EnterpriseHome: React.FC = () => {
  const { session, orders } = useStore();
  const s = useEnterpriseStats();
  const lowStock = s.stock < 100;
  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0">
      <div className="flex items-center gap-4 rounded-[28px_36px_28px_36px] p-5" style={{ background: 'linear-gradient(120deg, #F7E6C9, #FBF1DC)' }}>
        <RoleMascot role="enterprise" size={92} mood="cheer" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Beranda', 'Home')}</p>
          <h1 className="font-serif text-[28px] leading-tight text-deep-forest">{t('Halo', 'Hello')}, {session?.name?.split(' (')[0]}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{t('Ini yang perlu kamu tindak hari ini.', 'Here is what needs your attention today.')}</p>
        </div>
      </div>

      <h2 className="mt-6 text-xl text-deep-forest">{t('Perlu tindakan', 'Needs action')}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile to="/enterprise/pesanan?status=Baru" n={s.count('Baru')} label={t('Pesanan baru', 'New orders')} hint={t('Belum dikemas', 'Not packed yet')} warn={s.count('Baru') > 0} />
        <Tile to="/enterprise/pesanan?status=Dikemas" n={s.count('Dikemas')} label={t('Siap dikirim', 'Ready to ship')} hint={t('Sudah dikemas', 'Already packed')} />
        <Tile to="/enterprise/mitra" n={`${s.stock} kg`} label={t('Stok tersedia', 'Stock available')} hint={lowStock ? t('Menipis: catat pembelian baru', 'Running low: record a new purchase') : t('Cukup', 'Enough')} warn={lowStock} />
        <Tile to="/enterprise/pesanan?status=Dikirim" n={s.count('Dikirim')} label={t('Dalam pengiriman', 'In transit')} hint={t('Menunggu diterima', 'Awaiting delivery')} />
      </div>

      <h2 className="mt-8 text-xl text-deep-forest">{t('Ringkasan', 'Overview')}</h2>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="surface rounded-3xl p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Omzet pesanan berjalan', 'Revenue from active orders')}</p>
          <p className="mt-1 font-serif text-[30px] leading-none text-deep-forest">{rupiah(s.revenue)}</p>
          <p className="mt-1 text-xs text-ink-soft">{t('Pesanan yang sudah dikemas, dikirim, atau selesai.', 'Orders that are packed, shipped, or done.')}</p>
        </div>
        <div className="surface rounded-3xl p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Premi ke perajin', 'Premium to artisans')}</p>
          <p className="mt-1 font-serif text-[30px] leading-none text-forest">{rupiah(s.premium)}</p>
          <p className="mt-1 text-xs text-ink-soft">{t(`Dari ${s.bought} kg yang dibeli di atas harga acuan.`, `From ${s.bought} kg bought above the reference price.`)}</p>
        </div>
        <div className="surface rounded-3xl p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Dana pelestarian terkumpul', 'Preservation fund collected')}</p>
          <p className="mt-1 font-serif text-[30px] leading-none text-caramel-dark">{rupiah(s.preserve)}</p>
          <p className="mt-1 text-xs text-ink-soft">{t(`${PRESERVE_PCT}% dari omzet (persentase masih asumsi). Mendanai Jejak Nira.`, `${PRESERVE_PCT}% of revenue (the share is still an assumption). Funds Jejak Nira.`)}</p>
        </div>
      </div>

      <div className="surface mt-3 rounded-3xl p-5">
        <p className="text-sm font-bold text-deep-forest">{t('Ke mana uang pesanan ini pergi', 'Where the money from these orders goes')}</p>
        <div className="mt-3">
          <StackBar
            parts={[
              { label: t('Ke perajin', 'To artisans'), value: s.artisan, color: COLORS.artisan },
              { label: t('Dana pelestarian', 'Preservation fund'), value: s.preserve, color: COLORS.preserve },
              { label: t('Operasional dan margin (perkiraan)', 'Operations and margin (estimate)'), value: s.rest, color: COLORS.rest },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/enterprise/pesanan?baru=1" className="btn-sticker flex min-h-[52px] items-center gap-2 rounded-[28px_32px_26px_32px] bg-caramel-dark px-6 text-base font-semibold text-coconut">
          <Plus className="h-5 w-5" /> {t('Catat pesanan', 'Record an order')}
        </Link>
        <Link to="/enterprise/mitra" className="flex min-h-[52px] items-center gap-2 rounded-[30px_26px_32px_26px] border-2 border-dashed border-caramel-dark px-6 text-base font-semibold text-caramel-dark">
          {t('Catat pembelian dari mitra', 'Record a partner purchase')} <LeafArrow className="h-5 w-5" />
        </Link>
      </div>
      <p className="mt-4 text-xs text-ink-soft">{t(`${orders.length} pesanan tercatat. Pesanan, stok, dan dana ini data contoh sampai koperasi mulai mencatat sungguhan.`, `${orders.length} orders recorded. Orders, stock, and funds here are sample data until the cooperative starts recording for real.`)}</p>
    </div>
  );
};

/** Pesanan: tab status ala Seller Centre, tombol aksi berikutnya per pesanan, dan form catat pesanan. */
export const EnterpriseOrders: React.FC = () => {
  const { orders, addOrder, advanceOrder, showToast } = useStore();
  const [params, setParams] = useSearchParams();
  const status = (params.get('status') as OrderStatus | null) ?? null;
  const [buyer, setBuyer] = React.useState('');
  const [kg, setKg] = React.useState(10);
  const q = quote(kg);
  const list = status ? orders.filter((o) => o.status === status) : orders;
  const tabs: [OrderStatus | null, string][] = [[null, t('Semua', 'All')], ...ORDER_FLOW.map((s) => [s, STATUS_LABEL(s)] as [OrderStatus, string])];

  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0">
      <h1 className="font-serif text-[30px] leading-tight text-deep-forest">{t('Pesanan', 'Orders')}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t(`Jual langsung ${rupiah(PRICE.direct)}/kg. Reseller ${rupiah(PRICE.reseller)}/kg dengan minimal ${PRICE.resellerMinKg} kg.`, `Direct ${rupiah(PRICE.direct)}/kg. Reseller ${rupiah(PRICE.reseller)}/kg with a ${PRICE.resellerMinKg} kg minimum.`)}</p>

      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-bamboo" role="tablist">
        {tabs.map(([k, label]) => {
          const n = k ? orders.filter((o) => o.status === k).length : orders.length;
          const on = status === k;
          return (
            <button key={label} type="button" role="tab" aria-selected={on} onClick={() => (k ? setParams({ status: k }) : setParams({}))} className={`relative min-h-[46px] shrink-0 px-4 text-sm font-semibold ${on ? 'text-deep-forest' : 'text-ink-soft'}`}>
              {label} <span className="text-xs">({n})</span>
              {on && <span className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-caramel-dark" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
        <ul className="space-y-3">
          {list.map((o) => (
            <li key={o.id} className="surface rounded-[22px_28px_22px_28px] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-deep-forest">{o.buyer}</p>
                  <p className="text-xs text-ink-soft">{o.id} · {o.date}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${o.status === 'Selesai' ? 'bg-forest/10 text-forest' : o.status === 'Baru' ? 'bg-[#9E4F37]/10 text-[#9E4F37]' : 'bg-caramel/15 text-caramel-dark'}`}>{STATUS_LABEL(o.status)}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal">
                <span className="rounded-full bg-bamboo/50 px-2.5 py-0.5 text-xs font-bold text-deep-forest">{o.channel === 'reseller' ? 'Reseller' : t('Langsung', 'Direct')}</span>
                <span>{o.kg} kg × {rupiah(unitPrice(o.channel))}</span>
                <b className="text-deep-forest">{rupiah(orderTotal(o))}</b>
              </div>
              {o.status !== 'Selesai' && (
                <button type="button" onClick={() => { advanceOrder(o.id); showToast(t(`${o.id}: ${NEXT_ACTION(o.status)}.`, `${o.id}: ${NEXT_ACTION(o.status)}.`)); }} className="mt-3 min-h-[44px] rounded-full bg-forest px-5 text-sm font-semibold text-coconut">
                  {NEXT_ACTION(o.status)}
                </button>
              )}
            </li>
          ))}
          {list.length === 0 && (
            <li className="surface flex flex-col items-center rounded-3xl p-8 text-center">
              <Nira mood="sleep" size={88} />
              <p className="mt-2 font-serif text-xl text-deep-forest">{t('Belum ada pesanan di sini', 'No orders here yet')}</p>
              <p className="mt-1 text-sm text-ink-soft">{t('Pesanan dengan status ini akan muncul di sini.', 'Orders with this status will show up here.')}</p>
            </li>
          )}
        </ul>

        <form
          id="catat"
          className="surface space-y-3 rounded-3xl p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!buyer.trim() || kg <= 0) return;
            addOrder({ buyer: buyer.trim(), kg });
            setBuyer('');
            showToast(t('Pesanan dicatat dan masuk audit.', 'Order recorded and logged in the audit.'));
          }}
        >
          <p className="text-base font-bold text-deep-forest">{t('Catat pesanan', 'Record an order')}</p>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Pembeli', 'Buyer')}
            <input value={buyer} onChange={(e) => setBuyer(e.target.value)} placeholder={t('Nama pembeli atau toko', 'Buyer or shop name')} className="mt-1 min-h-[48px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-cream px-3 text-base focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30" />
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Jumlah (kg)', 'Amount (kg)')}
            <input type="number" min={1} value={kg} onChange={(e) => setKg(Number(e.target.value))} className="mt-1 min-h-[48px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-cream px-3 text-base focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30" />
          </label>
          <p className="rounded-xl bg-cream p-3 text-sm leading-snug text-charcoal">
            {channelOf(kg) === 'reseller' ? (
              <>
                <b className="text-forest">Reseller</b> · {rupiah(q.reseller ?? 0)} <span className="text-xs text-ink-soft">({t('hemat', 'saves')} {rupiah(q.saving)})</span>
              </>
            ) : (
              <>
                <b className="text-deep-forest">{t('Langsung', 'Direct')}</b> · {rupiah(q.direct)} <span className="block text-xs text-ink-soft">{t(`Kurang ${q.short} kg lagi untuk harga reseller.`, `${q.short} kg more for the reseller price.`)}</span>
              </>
            )}
          </p>
          <button type="submit" disabled={!buyer.trim() || kg <= 0} className="btn-sticker min-h-[52px] w-full rounded-[28px_32px_26px_32px] bg-caramel-dark text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
            {t('Catat pesanan', 'Record order')}
          </button>
        </form>
      </div>
    </div>
  );
};
