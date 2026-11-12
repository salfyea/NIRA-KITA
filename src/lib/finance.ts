/**
 * Hitungan keuangan NIRA Enterprise. Semua angka masukan adalah ASUMSI yang bisa diubah, bukan fakta:
 * prototipe memakai angka contoh dan menandainya ilustratif sampai koperasi mengisi angka sebenarnya.
 */
/** Daftar harga jual dari tim (per kg). Reseller wajib memesan minimal MIN_RESELLER_KG. */
export const PRICE = { direct: 35000, reseller: 30000, resellerMinKg: 30 };

export type Channel = 'langsung' | 'reseller';

/** Harga untuk jumlah pesanan tertentu: reseller hanya berlaku bila memenuhi minimal order. */
export const quote = (kg: number) => {
  const eligible = kg >= PRICE.resellerMinKg;
  const direct = kg * PRICE.direct;
  const reseller = eligible ? kg * PRICE.reseller : null;
  return { eligible, direct, reseller, saving: reseller === null ? 0 : direct - reseller, short: eligible ? 0 : PRICE.resellerMinKg - kg };
};

export const rupiah = (n: number): string => `Rp${Math.round(n).toLocaleString('id-ID')}`;

export interface Assumptions {
  kgPerMonth: number; // volume gula dibeli dari mitra per bulan
  buyPrice: number; // harga beli adil ke perajin, Rp per kg
  marketRef: number; // harga acuan pasar (tengkulak), Rp per kg
  directPrice: number; // harga jual langsung ke konsumen, Rp per kg
  resellerPrice: number; // harga untuk reseller, Rp per kg
  resellerShare: number; // persen volume yang lewat reseller
  resellerMinKg: number; // minimal order reseller, kg per pesanan
  opsPerKg: number; // biaya variabel (kemasan, QR, angkut), Rp per kg
  fixedCost: number; // biaya tetap per bulan, Rp
  preservePct: number; // dana pelestarian: persen dari OMZET (dipotong di depan, bukan dari sisa laba)
  mentorFee: number; // honorarium satu mentor per bulan, Rp
}

export interface Outcome {
  revenue: number;
  cogs: number;
  gross: number;
  ops: number;
  preserve: number;
  net: number;
  premium: number; // tambahan penghasilan perajin dibanding harga acuan
  mentorsFunded: number;
  marginPerKg: number;
  avgPrice: number; // harga jual rata-rata tertimbang saluran
  directMargin: number; // margin per kg saluran langsung (setelah biaya per kg dan dana pelestarian)
  resellerMargin: number;
  resellerKg: number;
  maxResellerOrders: number; // jumlah pesanan reseller bila semuanya tepat di minimal order
  breakEvenKg: number; // volume bulanan agar laba bersih 0 (Infinity bila margin per kg <= 0)
  artisanShare: number; // persen omzet yang sampai ke perajin
}

export const simulate = (a: Assumptions): Outcome => {
  const share = Math.min(100, Math.max(0, a.resellerShare)) / 100;
  const avgPrice = share * a.resellerPrice + (1 - share) * a.directPrice;
  const revenue = a.kgPerMonth * avgPrice;
  const cogs = a.kgPerMonth * a.buyPrice;
  const gross = revenue - cogs;
  const ops = a.kgPerMonth * a.opsPerKg + a.fixedCost;
  const preserve = (revenue * a.preservePct) / 100;
  const net = gross - ops - preserve;
  const marginAt = (price: number) => price - a.buyPrice - a.opsPerKg - (price * a.preservePct) / 100;
  const marginPerKg = marginAt(avgPrice);
  const resellerKg = a.kgPerMonth * share;
  return {
    revenue,
    cogs,
    gross,
    ops,
    preserve,
    net,
    premium: a.kgPerMonth * (a.buyPrice - a.marketRef),
    mentorsFunded: a.mentorFee > 0 ? preserve / a.mentorFee : 0,
    marginPerKg,
    avgPrice,
    directMargin: marginAt(a.directPrice),
    resellerMargin: marginAt(a.resellerPrice),
    resellerKg,
    maxResellerOrders: a.resellerMinKg > 0 ? Math.floor(resellerKg / a.resellerMinKg) : 0,
    breakEvenKg: marginPerKg > 0 ? a.fixedCost / marginPerKg : Infinity,
    artisanShare: revenue > 0 ? (cogs / revenue) * 100 : 0,
  };
};

const base = { buyPrice: 20000, marketRef: 16000, directPrice: PRICE.direct, resellerPrice: PRICE.reseller, resellerMinKg: PRICE.resellerMinKg, opsPerKg: 3000, preservePct: 8, mentorFee: 750000 };
export const PRESETS: { key: 'konservatif' | 'dasar' | 'tumbuh'; a: Assumptions }[] = [
  { key: 'konservatif', a: { ...base, kgPerMonth: 150, resellerShare: 30, fixedCost: 1500000 } },
  { key: 'dasar', a: { ...base, kgPerMonth: 400, resellerShare: 50, fixedCost: 2000000 } },
  { key: 'tumbuh', a: { ...base, kgPerMonth: 1000, resellerShare: 60, fixedCost: 3500000, opsPerKg: 2800 } },
];

/** Harga per kemasan dipecah: ke perajin, dana pelestarian, dan operasional serta margin (sisa). */
export interface Pricing {
  pricePerPack: number;
  packGram: number;
  artisanPerKg: number;
  preservePct: number;
}

export interface Split {
  artisan: number;
  preserve: number;
  rest: number;
  valid: boolean;
}

export const splitPack = (p: Pricing): Split => {
  const artisan = (p.artisanPerKg * p.packGram) / 1000;
  const preserve = (p.pricePerPack * p.preservePct) / 100;
  const rest = p.pricePerPack - artisan - preserve;
  return { artisan, preserve, rest, valid: p.pricePerPack > 0 && p.packGram > 0 && rest >= 0 };
};
