import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Nira } from '../art/Nira';
import { LeafArrow, Frond } from '../art/Organic';
import { COLORS, StackBar } from '../components/StackBar';
import { BUY_PRICE, PRESERVE_PCT, PRICE, channelOf, quote, rupiah } from '../lib/finance';
import { ORDER_FLOW, OrderStatus, useStore } from '../store';
import { LangToggle, t } from '../i18n';
import { PAYMENT, waLink } from '../data/payment';

const field =
  'mt-1 min-h-[50px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-coconut px-4 text-base text-charcoal shadow-[inset_0_2px_4px_rgba(24,56,44,0.06)] placeholder:text-ink-soft/80 focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30';

const STATUS_TEXT: Record<OrderStatus, () => string> = {
  Baru: () => t('Pesanan diterima koperasi', 'Order received by the cooperative'),
  Dikemas: () => t('Sedang dikemas', 'Being packed'),
  Dikirim: () => t('Dalam pengiriman', 'On its way'),
  Selesai: () => t('Pesanan selesai', 'Order complete'),
};

/** Toko pembeli: publik, tanpa login. Pesanan masuk ke tab Pesanan di ruang kerja Enterprise. */
export const Toko: React.FC = () => {
  const { addOrder, showToast } = useStore();
  const navigate = useNavigate();
  const [kg, setKg] = React.useState(5);
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [code, setCode] = React.useState('');
  const q = quote(kg);
  const ch = channelOf(kg);
  const unit = ch === 'reseller' ? PRICE.reseller : PRICE.direct;
  const total = kg * unit;
  const ok = name.trim() && contact.trim() && address.trim() && kg > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    const id = addOrder({ buyer: name.trim(), kg, contact: contact.trim(), address: address.trim(), source: 'toko' });
    showToast(t('Pesanan terkirim ke koperasi.', 'Order sent to the cooperative.'));
    navigate(`/toko/pesanan/${id}`);
  };

  return (
    <div className="grain relative min-h-full bg-cream pb-10">
      <div className="relative h-[230px] overflow-hidden">
        <img src="/media/dapur.jpg" alt={t('Dapur tradisional: wajan nira di atas tungku batu', 'A traditional kitchen: a wok of sap on a stone stove')} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/85 via-deep-forest/20 to-transparent" />
        <LangToggle tone="dark" className="absolute right-3 top-3" />
        <div className="absolute inset-x-5 bottom-4 text-coconut">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E7C79A]">Toko NIRA</p>
          <h1 className="font-serif text-[30px] leading-tight">{t('Gula Kelapa Cetak', 'Molded Coconut Sugar')}</h1>
          <p className="text-sm text-coconut/90">{t('Dari dapur tungku batu perajin Cilongok, Banyumas.', 'From the stone-stove kitchens of Cilongok, Banyumas.')}</p>
        </div>
      </div>

      <div className="relative z-10 -mt-3 space-y-5 px-5">
        {/* harga bertingkat */}
        <section className="surface rounded-[26px_34px_26px_34px] p-5">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className={`rounded-2xl p-3 ${ch === 'langsung' ? 'bg-forest text-coconut' : 'bg-cream text-deep-forest'}`}>
              <p className="text-xs font-semibold opacity-80">{t('Beli langsung', 'Buy direct')}</p>
              <p className="font-serif text-2xl">{rupiah(PRICE.direct)}</p>
              <p className="text-[11px] opacity-80">{t('per kg', 'per kg')}</p>
            </div>
            <div className={`rounded-2xl p-3 ${ch === 'reseller' ? 'bg-forest text-coconut' : 'bg-cream text-deep-forest'}`}>
              <p className="text-xs font-semibold opacity-80">Reseller</p>
              <p className="font-serif text-2xl">{rupiah(PRICE.reseller)}</p>
              <p className="text-[11px] opacity-80">{t(`per kg, mulai ${PRICE.resellerMinKg} kg`, `per kg, from ${PRICE.resellerMinKg} kg`)}</p>
            </div>
          </div>

          <label className="mt-5 block text-sm font-semibold text-deep-forest">
            {t('Berapa kilo?', 'How many kilos?')}
            <div className="mt-2 flex items-center gap-3">
              <button type="button" aria-label={t('Kurangi', 'Less')} onClick={() => setKg((v) => Math.max(1, v - 1))} className="h-12 w-12 shrink-0 rounded-full bg-cream text-2xl font-semibold text-deep-forest shadow-[0_2px_0_rgba(16,38,30,0.2)]">−</button>
              <input type="number" min={1} value={kg} onChange={(e) => setKg(Math.max(1, Number(e.target.value) || 1))} className="min-h-[52px] w-full rounded-2xl border border-bamboo bg-coconut text-center font-serif text-3xl text-deep-forest focus:border-caramel focus:outline-none" />
              <button type="button" aria-label={t('Tambah', 'More')} onClick={() => setKg((v) => v + 1)} className="h-12 w-12 shrink-0 rounded-full bg-cream text-2xl font-semibold text-deep-forest shadow-[0_2px_0_rgba(16,38,30,0.2)]">+</button>
            </div>
            <input type="range" min={1} max={60} value={Math.min(kg, 60)} onChange={(e) => setKg(Number(e.target.value))} aria-label={t('Jumlah kilo', 'Kilos')} className="mt-3 w-full accent-[#8F5A2C]" />
          </label>

          <div className="mt-3 rounded-2xl bg-cream p-3 text-sm leading-snug text-charcoal">
            <p className="flex items-baseline justify-between">
              <span>{kg} kg × {rupiah(unit)}</span>
              <b className="font-serif text-xl text-deep-forest">{rupiah(total)}</b>
            </p>
            {ch === 'reseller' ? (
              <p className="mt-1 font-semibold text-forest">{t('Harga reseller berlaku. Hemat', 'Reseller price applies. You save')} {rupiah(q.saving)}.</p>
            ) : (
              <p className="mt-1 text-caramel-dark">{t(`Tambah ${q.short} kg lagi untuk harga reseller ${rupiah(PRICE.reseller)}/kg.`, `Add ${q.short} kg more for the reseller price of ${rupiah(PRICE.reseller)}/kg.`)}</p>
            )}
          </div>
        </section>

        {/* ke mana uang pergi */}
        <section className="surface rounded-[26px_34px_26px_34px] p-5">
          <p className="font-serif text-xl text-deep-forest">{t('Ke mana uangmu pergi', 'Where your money goes')}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{t('Untuk setiap 1 kg.', 'For every 1 kg.')}</p>
          <div className="mt-3">
            <StackBar
              parts={[
                { label: t('Ke perajin', 'To artisans'), value: BUY_PRICE, color: COLORS.artisan },
                { label: t('Dana pelestarian pengetahuan', 'Knowledge preservation fund'), value: (unit * PRESERVE_PCT) / 100, color: COLORS.preserve },
                { label: t('Operasional dan margin', 'Operations and margin'), value: Math.max(0, unit - BUY_PRICE - (unit * PRESERVE_PCT) / 100), color: COLORS.rest },
              ]}
            />
          </div>
          <Link to="/p/NK-001" className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-forest underline decoration-caramel decoration-2 underline-offset-[5px]">
            {t('Lihat kisah di balik gula ini', 'See the story behind this sugar')} <LeafArrow className="h-5 w-5" />
          </Link>
        </section>

        {/* form pesan */}
        <form onSubmit={submit} className="surface space-y-3.5 rounded-[26px_34px_26px_34px] p-5">
          <div className="flex items-center gap-3">
            <Nira mood="cheer" size={64} float={false} />
            <div>
              <p className="font-serif text-xl leading-tight text-deep-forest">{t('Pesan sekarang', 'Order now')}</p>
              <Frond className="-ml-1 mt-0.5 scale-75 origin-left" />
            </div>
          </div>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Nama', 'Name')}
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Nama kamu atau tokomu', 'Your name or shop name')} />
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Kontak (WhatsApp atau telepon)', 'Contact (WhatsApp or phone)')}
            <input className={field} value={contact} onChange={(e) => setContact(e.target.value)} inputMode="tel" placeholder="08xx xxxx xxxx" />
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Alamat pengiriman', 'Delivery address')}
            <textarea className={`${field} py-3`} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('Jalan, kecamatan, kota', 'Street, district, city')} />
          </label>
          <button type="submit" disabled={!ok} className="btn-sticker flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[28px_32px_26px_32px] bg-caramel-dark text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
            {t('Kirim pesanan', 'Send order')} · {rupiah(total)} <LeafArrow className="h-5 w-5" />
          </button>
          <p className="text-xs leading-relaxed text-ink-soft">{t('Koperasi akan menghubungi kontakmu untuk mengonfirmasi pembayaran dan pengiriman. Prototipe: belum ada pembayaran sungguhan di aplikasi ini.', 'The cooperative will contact you to confirm payment and delivery. Prototype: there is no real payment in this app yet.')}</p>
        </form>

        {/* lacak pesanan */}
        <section className="text-center">
          <p className="text-sm font-semibold text-deep-forest">{t('Sudah memesan?', 'Already ordered?')}</p>
          <div className="mx-auto mt-2 flex max-w-[320px] gap-2">
            <input className={field + ' mt-0 uppercase'} value={code} onChange={(e) => setCode(e.target.value)} placeholder="ORD-006" aria-label={t('Kode pesanan', 'Order code')} />
            <button type="button" disabled={!code.trim()} onClick={() => navigate(`/toko/pesanan/${code.trim().toUpperCase()}`)} className="min-h-[50px] shrink-0 rounded-full bg-forest px-5 text-sm font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
              {t('Lacak', 'Track')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

/** Lacak pesanan: langkah Baru, Dikemas, Dikirim, Selesai. Status berubah saat koperasi memprosesnya. */
export const TokoPesanan: React.FC = () => {
  const { id } = useParams();
  const { orders } = useStore();
  const o = orders.find((x) => x.id === id);
  if (!id) return <Navigate to="/toko" replace />;
  const idx = o ? ORDER_FLOW.indexOf(o.status) : -1;
  return (
    <div className="grain min-h-full bg-cream px-6 pb-10 pt-4">
      <Link to="/toko" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-forest">
        <LeafArrow flip className="h-5 w-5" /> {t('Kembali ke toko', 'Back to the shop')}
      </Link>
      {!o ? (
        <div className="mt-6 flex flex-col items-center text-center">
          <Nira mood="think" size={100} />
          <h1 className="mt-3 font-serif text-2xl text-deep-forest">{t('Pesanan tidak ditemukan', 'Order not found')}</h1>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t('Kode yang kamu masukkan tidak ada di perangkat ini. Prototipe menyimpan pesanan di peramban yang sama dengan yang dipakai memesan.', 'The code you entered is not on this device. The prototype stores orders in the same browser used to place them.')}</p>
        </div>
      ) : (
        <>
          <div className="mt-3 text-center">
            <Nira mood={o.status === 'Selesai' ? 'cheer' : 'happy'} size={96} />
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{o.id}</p>
            <h1 className="font-serif text-[28px] leading-tight text-deep-forest">{STATUS_TEXT[o.status]()}</h1>
            <p className="mt-1 text-sm text-ink-soft">{o.buyer} · {o.kg} kg · {rupiah(o.kg * (o.channel === 'reseller' ? PRICE.reseller : PRICE.direct))}</p>
          </div>
          <ol className="surface mt-5 space-y-4 rounded-[26px_34px_26px_34px] p-5">
            {ORDER_FLOW.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i < idx ? 'bg-forest text-coconut' : i === idx ? 'bg-caramel-dark text-coconut' : 'bg-bamboo/60 text-ink-soft'}`}>{i < idx ? <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden fill="none"><path d="M4 10.5 C6 12 7.5 13.5 8.5 15 C11 10 13.5 7 16.5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}</span>
                <span className={`text-base ${i <= idx ? 'font-semibold text-deep-forest' : 'text-ink-soft'}`}>{STATUS_TEXT[s]()}</span>
              </li>
            ))}
          </ol>
          {(() => {
            const total = o.kg * (o.channel === 'reseller' ? PRICE.reseller : PRICE.direct);
            const msg = t(`Halo, saya ${o.buyer}. Pesanan ${o.id}: ${o.kg} kg gula kelapa cetak (${o.channel === 'reseller' ? 'harga reseller' : 'harga langsung'}), total ${rupiah(total)}. Alamat: ${o.address ?? '-'}. Mohon konfirmasi pembayaran dan pengiriman.`, `Hello, I am ${o.buyer}. Order ${o.id}: ${o.kg} kg molded coconut sugar (${o.channel === 'reseller' ? 'reseller price' : 'direct price'}), total ${rupiah(total)}. Address: ${o.address ?? '-'}. Please confirm payment and delivery.`);
            return (
              <section className="surface mt-4 rounded-[26px_34px_26px_34px] p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-serif text-xl text-deep-forest">{t('Pembayaran', 'Payment')}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.paid ? 'bg-forest/10 text-forest' : 'bg-caramel/15 text-caramel-dark'}`}>{o.paid ? t('Sudah dibayar', 'Paid') : t('Menunggu pembayaran', 'Awaiting payment')}</span>
                </div>
                {!o.paid && (
                  <>
                    <dl className="mt-3 space-y-1.5 text-sm text-charcoal">
                      <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Jumlah transfer', 'Amount to transfer')}</dt><dd className="font-bold text-deep-forest">{rupiah(total)}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Bank', 'Bank')}</dt><dd className="font-semibold">{PAYMENT.bank}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Nomor rekening', 'Account number')}</dt><dd className="font-semibold">{PAYMENT.account}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Atas nama', 'Account name')}</dt><dd className="text-right font-semibold">{PAYMENT.holder}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Berita transfer', 'Transfer note')}</dt><dd className="font-bold text-caramel-dark">{o.id}</dd></div>
                    </dl>
                    <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="btn-sticker mt-4 flex min-h-[54px] items-center justify-center gap-2 rounded-[28px_32px_26px_32px] bg-forest text-base font-semibold text-coconut">
                      {t('Konfirmasi lewat WhatsApp', 'Confirm on WhatsApp')} <LeafArrow className="h-5 w-5" />
                    </a>
                    <p className="mt-2 text-center text-xs text-ink-soft">{t(`Setelah transfer, kirim bukti lewat WhatsApp (${PAYMENT.whatsappLabel}). Koperasi menandai pesanan sudah dibayar.`, `After transferring, send the proof on WhatsApp (${PAYMENT.whatsappLabel}). The cooperative marks the order as paid.`)}</p>
                  </>
                )}
                <p className="mt-3 rounded-xl bg-bamboo/40 p-2.5 text-[11px] leading-snug text-deep-forest">{t('Nomor dan rekening di atas adalah CONTOH untuk prototipe. Pembayaran sungguhan lewat gateway adalah target produksi.', 'The number and account above are EXAMPLES for the prototype. Real payment through a gateway is a production target.')}</p>
              </section>
            );
          })()}
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">{t('Koperasi akan menghubungi kontakmu. Simpan kode pesanan ini untuk melacak.', 'The cooperative will contact you. Keep this order code to track it.')}</p>
        </>
      )}
    </div>
  );
};
