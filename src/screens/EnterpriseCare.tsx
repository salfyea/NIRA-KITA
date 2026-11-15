import React from 'react';
import { RoleMascot } from '../art/RoleMascot';
import { Nira } from '../art/Nira';
import { rupiah, PRICE } from '../lib/finance';
import { DEFAULT_VOUCHER, voucherSafety } from '../lib/voucher';
import { INSURANCE_FLOW, InsuranceStatus, useStore } from '../store';
import { t } from '../i18n';

const Head: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div>
    <h1 className="font-serif text-[30px] leading-tight text-deep-forest">{title}</h1>
    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
  </div>
);

const inputCls = 'mt-1 min-h-[48px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-cream px-3 text-base text-charcoal focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30';

/* ============================ Voucher ============================ */
export const EnterpriseVoucher: React.FC = () => {
  const { voucherConfig, voucherUsed, orders, setVoucherConfig, showToast } = useStore();
  const [c, setC] = React.useState(voucherConfig);
  const safety = voucherSafety(c);
  const used = orders.filter((o) => o.voucher);
  const given = used.reduce((a, o) => a + (o.discount ?? 0), 0);
  const set = (k: keyof typeof c) => (v: number | boolean) => setC((x) => ({ ...x, [k]: v }));
  const dirty = JSON.stringify(c) !== JSON.stringify(voucherConfig);

  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0">
      <Head title="Voucher" text={t('Voucher dibagikan di halaman terakhir QR kemasan sebagai alasan pembeli membukanya sampai habis, dan dipakai di Toko untuk pembelian berikutnya.', 'The voucher is given on the last page of the pack QR as a reason to open it to the end, and is used in the Shop for the next purchase.')} />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="space-y-4">
          <div className="surface rounded-3xl p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-bold text-deep-forest">{t('Pengaturan voucher', 'Voucher settings')}</p>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold text-deep-forest">
                <input type="checkbox" checked={c.active} onChange={(e) => set('active')(e.target.checked)} className="h-6 w-6 accent-[#234B3A]" />
                {c.active ? t('Aktif', 'Active') : t('Nonaktif', 'Off')}
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold text-deep-forest">{t('Diskon (%)', 'Discount (%)')}<input type="number" min={1} max={30} className={inputCls} value={c.percent} onChange={(e) => set('percent')(Number(e.target.value))} /></label>
              <label className="block text-sm font-semibold text-deep-forest">{t('Maks. potongan (Rp)', 'Max discount (Rp)')}<input type="number" min={1000} step={500} className={inputCls} value={c.capRp} onChange={(e) => set('capRp')(Number(e.target.value))} /></label>
              <label className="block text-sm font-semibold text-deep-forest">{t('Minimal beli (kg)', 'Minimum (kg)')}<input type="number" min={1} max={PRICE.resellerMinKg - 1} className={inputCls} value={c.minKg} onChange={(e) => set('minKg')(Number(e.target.value))} /></label>
              <label className="block text-sm font-semibold text-deep-forest">{t('Berlaku (hari)', 'Valid (days)')}<input type="number" min={7} max={90} className={inputCls} value={c.validDays} onChange={(e) => set('validDays')(Number(e.target.value))} /></label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={!dirty} onClick={() => { setVoucherConfig(c); showToast(t('Pengaturan voucher disimpan dan masuk audit.', 'Voucher settings saved and logged in the audit.')); }} className="btn-sticker min-h-[50px] rounded-[26px_30px_24px_30px] bg-caramel-dark px-6 text-sm font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">{t('Simpan', 'Save')}</button>
              <button type="button" onClick={() => setC(DEFAULT_VOUCHER)} className="min-h-[50px] rounded-full px-4 text-sm font-semibold text-deep-forest underline decoration-bamboo decoration-2 underline-offset-[5px]">{t('Kembalikan angka aman', 'Restore safe defaults')}</button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">{t('Voucher hanya berlaku untuk pembelian langsung (di bawah 30 kg). Margin reseller sudah tipis, jadi tidak diberi diskon tambahan.', 'Vouchers apply only to direct purchases (under 30 kg). The reseller margin is already thin, so it gets no extra discount.')}</p>
          </div>

          <div className="surface rounded-3xl p-5">
            <p className="text-base font-bold text-deep-forest">{t('Uji keamanan margin', 'Margin safety check')}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{t('Penjualan langsung, setelah harga beli, biaya per kg, dan dana pelestarian. Angka biaya masih asumsi.', 'Direct sales, after purchase price, cost per kg, and the preservation fund. Cost figures are still assumptions.')}</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="text-xs text-ink-soft">
                  <tr><th className="py-1 pr-3 font-semibold">{t('Pesanan', 'Order')}</th><th className="pr-3 font-semibold">{t('Potongan', 'Discount')}</th><th className="pr-3 font-semibold">{t('Margin tanpa voucher', 'Margin without voucher')}</th><th className="pr-3 font-semibold">{t('Margin dengan voucher', 'Margin with voucher')}</th><th className="font-semibold">{t('Tersita', 'Eaten')}</th></tr>
                </thead>
                <tbody>
                  {safety.rows.map((r) => (
                    <tr key={r.kg} className="border-t border-bamboo/60">
                      <td className="py-2 pr-3 font-semibold text-deep-forest">{r.kg} kg</td>
                      <td className="pr-3">{rupiah(r.off)}</td>
                      <td className="pr-3">{rupiah(r.full)}</td>
                      <td className={`pr-3 font-semibold ${r.margin > 0 ? 'text-forest' : 'text-[#9E4F37]'}`}>{rupiah(r.margin)}</td>
                      <td>{Math.round(r.eaten * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`mt-3 rounded-xl p-3 text-sm font-semibold leading-snug ${safety.safe ? 'bg-forest/10 text-forest' : 'bg-[#9E4F37]/10 text-[#9E4F37]'}`}>
              {safety.safe
                ? t(`Aman: margin tetap positif di semua ukuran pesanan, dan voucher paling banyak menyita ${Math.round(safety.worst.eaten * 100)}% margin satu pesanan (pada ${safety.worst.kg} kg). Pembelian ulang menutup sisanya.`, `Safe: the margin stays positive at every order size, and the voucher eats at most ${Math.round(safety.worst.eaten * 100)}% of one order's margin (at ${safety.worst.kg} kg). A repeat purchase covers the rest.`)
                : t('Tidak aman: margin habis atau voucher menyita lebih dari separuh margin pesanan terkecil. Turunkan diskon atau naikkan minimal beli.', 'Not safe: the margin runs out, or the voucher eats over half the margin of the smallest order. Lower the discount or raise the minimum.')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="surface rounded-3xl p-5">
            <p className="text-base font-bold text-deep-forest">{t('Pemakaian', 'Redemptions')}</p>
            <div className="mt-2 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-cream p-3"><p className="font-serif text-3xl text-deep-forest">{voucherUsed.length}</p><p className="text-xs text-ink-soft">{t('voucher dipakai', 'vouchers used')}</p></div>
              <div className="rounded-2xl bg-cream p-3"><p className="font-serif text-xl text-caramel-dark">{rupiah(given)}</p><p className="text-xs text-ink-soft">{t('total potongan', 'total discounts')}</p></div>
            </div>
            <ul className="mt-3 space-y-2">
              {used.slice(0, 6).map((o) => (
                <li key={o.id} className="rounded-xl bg-cream p-3 text-sm">
                  <p className="font-semibold text-deep-forest">{o.voucher}</p>
                  <p className="text-xs text-ink-soft">{o.id} · {o.buyer} · −{rupiah(o.discount ?? 0)}</p>
                </li>
              ))}
              {used.length === 0 && (
                <li className="flex flex-col items-center py-4 text-center">
                  <Nira mood="sleep" size={72} />
                  <p className="mt-1 text-sm text-ink-soft">{t('Belum ada voucher yang dipakai.', 'No voucher has been used yet.')}</p>
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-xl bg-bamboo/40 p-3 text-xs leading-relaxed text-deep-forest">
            {t('Prototipe: kode diverifikasi dari karakter pemeriksa dan tanggal di dalam kode, dan "sekali pakai" hanya ditegakkan di perangkat ini. Pada produksi, setiap kode dicatat di server supaya tidak bisa dipakai dua kali di perangkat berbeda.', 'Prototype: codes are verified from a check character and the date inside the code, and "single use" is only enforced on this device. In production, every code is recorded on a server so it cannot be used twice on different devices.')}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================ Perlindungan (asuransi) ============================ */
const NEXT = (s: InsuranceStatus) => ({ 'Belum ada': t('Tawarkan bantuan daftar', 'Offer help to register'), 'Dibantu daftar': t('Tandai sudah terdaftar', 'Mark as registered'), Terdaftar: '' })[s];
const LABEL = (s: InsuranceStatus) => ({ 'Belum ada': t('Belum ada', 'None yet'), 'Dibantu daftar': t('Sedang dibantu daftar', 'Being helped to register'), Terdaftar: t('Terdaftar', 'Registered') })[s];

export const EnterpriseCare: React.FC = () => {
  const { partners, setInsurance, showToast, session } = useStore();
  const members = partners.reduce((a, p) => a + p.members, 0);
  const insured = partners.reduce((a, p) => a + p.insured, 0);
  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0">
      <div className="flex items-center gap-4 rounded-[28px_36px_28px_36px] p-5" style={{ background: 'linear-gradient(120deg, #F7E6C9, #FBF1DC)' }}>
        <RoleMascot role="enterprise" size={88} mood="happy" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Perlindungan perajin', 'Artisan protection')}</p>
          <h1 className="font-serif text-[26px] leading-tight text-deep-forest">{t('Kerja berisiko, jadi perlu terlindungi', 'Risky work deserves protection')}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{session ? t('Kami membantu mitra mengecek dan mendaftar jaminan kerja.', 'We help partners check and register for work coverage.') : ''}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="surface rounded-[22px_28px_22px_28px] p-4"><p className="font-serif text-3xl text-deep-forest">{members}</p><p className="text-xs font-semibold text-ink-soft">{t('anggota mitra', 'partner members')}</p></div>
        <div className="surface rounded-[22px_28px_22px_28px] p-4"><p className="font-serif text-3xl text-forest">{insured}</p><p className="text-xs font-semibold text-ink-soft">{t('sudah terlindungi', 'already covered')}</p></div>
        <div className="surface rounded-[22px_28px_22px_28px] p-4"><p className="font-serif text-3xl text-caramel-dark">{members - insured}</p><p className="text-xs font-semibold text-ink-soft">{t('bisa dibantu', 'could be helped')}</p></div>
      </div>

      <h2 className="mt-6 text-xl text-deep-forest">{t('Pendampingan per kelompok', 'Support per group')}</h2>
      <ul className="mt-3 grid gap-3 lg:grid-cols-2">
        {partners.map((p) => (
          <li key={p.id} className="surface rounded-[22px_28px_22px_28px] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0"><p className="truncate text-base font-semibold text-deep-forest">{p.name}</p><p className="text-xs text-ink-soft">{p.members} {t('anggota', 'members')} · {p.insured} {t('terlindungi', 'covered')}</p></div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${p.insurance === 'Terdaftar' ? 'bg-forest/10 text-forest' : p.insurance === 'Dibantu daftar' ? 'bg-caramel/15 text-caramel-dark' : 'bg-bamboo/60 text-ink-soft'}`}>{LABEL(p.insurance)}</span>
            </div>
            <div className="mt-3 flex gap-1" aria-hidden>
              {INSURANCE_FLOW.map((s, i) => <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= INSURANCE_FLOW.indexOf(p.insurance) ? 'bg-forest' : 'bg-bamboo'}`} />)}
            </div>
            {p.insurance !== 'Terdaftar' && (
              <button
                type="button"
                onClick={() => {
                  const next = INSURANCE_FLOW[INSURANCE_FLOW.indexOf(p.insurance) + 1];
                  setInsurance(p.id, next, next === 'Terdaftar' ? p.members : undefined);
                  showToast(t(`${p.name}: ${LABEL(next)}.`, `${p.name}: ${LABEL(next)}.`));
                }}
                className="mt-3 min-h-[44px] rounded-full bg-forest px-5 text-sm font-semibold text-coconut"
              >
                {NEXT(p.insurance)}
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="surface mt-6 rounded-3xl p-5">
        <p className="text-base font-bold text-deep-forest">{t('Cara menyampaikannya: mengajak, bukan menjual', 'How we say it: invite, do not sell')}</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-charcoal">
          <li>{t('Tanyakan dulu apakah mereka sudah punya perlindungan kerja. Jangan berasumsi.', 'First ask whether they already have work coverage. Do not assume.')}</li>
          <li>{t('Kalau belum, tawarkan bantuan mendaftar. Keputusan tetap di tangan mereka.', 'If not, offer help to register. The decision stays with them.')}</li>
          <li>{t('Jangan menyebut produk atau perusahaan asuransi tertentu sebagai promosi. NIRA Enterprise hanya fasilitator, bukan agen asuransi.', 'Do not name a specific insurer or product as a promotion. NIRA Enterprise is only a facilitator, not an insurance agent.')}</li>
          <li>{t('Pelatihan dan mentoring tentang perlindungan kerja ada di Jejak Nira, Modul 3.', 'Training and mentoring about work protection is in Jejak Nira, Module 3.')}</li>
        </ul>
      </div>
      <p className="mt-3 text-xs text-ink-soft">{t('Jumlah anggota dan status pendampingan adalah data contoh sampai koperasi mulai mencatat sungguhan.', 'Member counts and support status are sample data until the cooperative starts recording for real.')}</p>
    </div>
  );
};
