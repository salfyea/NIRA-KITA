/**
 * Hitungan keuangan NIRA Enterprise. Semua angka masukan adalah ASUMSI yang bisa diubah, bukan fakta:
 * prototipe memakai angka contoh dan menandainya ilustratif sampai koperasi mengisi angka sebenarnya.
 */
/** Daftar harga jual dari tim (per kg). Reseller wajib memesan minimal MIN_RESELLER_KG. */
export const PRICE = { direct: 35000, reseller: 30000, resellerMinKg: 30 };

export type Channel = 'langsung' | 'reseller';

/** Bagian omzet untuk pembelajaran (Jejak Nira dan situs), sesuai deck: 7,2% dari omzet tahun 1. Masih asumsi tim. */
export const PRESERVE_PCT = 7.2;
/** Harga beli ke perajin per kg. Masih asumsi contoh. */
export const BUY_PRICE = 24000;

export const channelOf = (kg: number): Channel => (kg >= PRICE.resellerMinKg ? 'reseller' : 'langsung');
export const unitPrice = (c: Channel): number => (c === 'reseller' ? PRICE.reseller : PRICE.direct);

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
  sellThrough: number; // persen produksi yang terjual (deck: 95%)
  marketRef: number; // harga acuan pasar (tengkulak), Rp per kg
  directPrice: number; // harga jual langsung ke konsumen, Rp per kg
  resellerPrice: number; // harga untuk reseller, Rp per kg
  resellerShare: number; // persen volume yang lewat reseller
  resellerMinKg: number; // minimal order reseller, kg per pesanan
  opsPerKg: number; // biaya variabel (kemasan Rp2.000, QC Rp500, angkut Rp500), Rp per kg dibeli
  fixedCost: number; // biaya tetap per bulan, Rp (deck: pemasaran Rp100.000)
  preservePct: number; // dana pembelajaran: persen dari OMZET (dipotong di depan, bukan dari sisa laba)
  learningFloor: number; // lantai biaya pembelajaran per bulan, Rp (deck: Rp3,4 juta per tahun)
}

export interface Outcome {
  revenue: number;
  cogs: number;
  gross: number;
  ops: number;
  preserve: number;
  net: number;
  premium: number; // tambahan penghasilan perajin dibanding harga acuan
  floorCover: number; // berapa kali margin sebelum biaya pembelajaran menutup lantai pembelajaran
  marginPerKg: number;
  avgPrice: number; // harga jual rata-rata tertimbang saluran
  directMargin: number; // margin per kg saluran langsung (setelah biaya per kg dan dana pembelajaran)
  resellerMargin: number;
  resellerKg: number;
  maxResellerOrders: number; // jumlah pesanan reseller bila semuanya tepat di minimal order
  breakEvenKg: number; // volume bulanan agar laba bersih 0 (Infinity bila margin per kg <= 0)
  artisanShare: number; // persen omzet yang sampai ke perajin
}

export const simulate = (a: Assumptions): Outcome => {
  const share = Math.min(100, Math.max(0, a.resellerShare)) / 100;
  const avgPrice = share * a.resellerPrice + (1 - share) * a.directPrice;
  const st = Math.min(100, Math.max(0, a.sellThrough)) / 100;
  const soldKg = a.kgPerMonth * st;
  const revenue = soldKg * avgPrice;
  const cogs = a.kgPerMonth * a.buyPrice;
  const gross = revenue - cogs;
  const ops = a.kgPerMonth * a.opsPerKg + a.fixedCost;
  const preserve = (revenue * a.preservePct) / 100;
  const net = gross - ops - preserve;
  // margin per kg DIBELI: harga jual dikali bagian yang terjual, dikurangi pembelian, biaya, dan dana pembelajaran
  const marginAt = (price: number) => st * price * (1 - a.preservePct / 100) - a.buyPrice - a.opsPerKg;
  const marginPerKg = marginAt(avgPrice);
  const resellerKg = soldKg * share;
  return {
    revenue,
    cogs,
    gross,
    ops,
    preserve,
    net,
    premium: a.kgPerMonth * (a.buyPrice - a.marketRef),
    floorCover: a.learningFloor > 0 ? (gross - ops) / a.learningFloor : 0,
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

/**
 * Asumsi per tahun dari deck (slide 21 sampai 25): penderes bertambah 1 per tahun (2 di tahun 1, masing-masing 60 kg per bulan),
 * harga jual, harga beli, dan kemasan naik 3% per tahun, pemasaran naik 10% per tahun, 95% produksi terjual.
 * Dana pembelajaran = belanja Jejak Nira + situs dan administrasi, dibagi omzet tahun itu (tahun 1: 7,2%, slide 16).
 */
const LEARNING_COST_PER_YEAR = [3400000, 6430000, 8778000, 10529150, 13483608];
export const yearAssumptions = (y: number): Assumptions => {
  const f = Math.pow(1.03, y - 1);
  const tappers = 1 + y;
  const kg = 60 * tappers;
  const direct = Math.round(PRICE.direct * f);
  const reseller = Math.round(PRICE.reseller * f);
  const avg = 0.75 * direct + 0.25 * reseller;
  const revenueYear = kg * 12 * 0.95 * avg;
  const pct = y === 1 ? PRESERVE_PCT : Math.round((LEARNING_COST_PER_YEAR[y - 1] / revenueYear) * 1000) / 10;
  return {
    kgPerMonth: kg,
    buyPrice: Math.round(BUY_PRICE * f),
    sellThrough: 95,
    marketRef: Math.round(20000 * f),
    directPrice: direct,
    resellerPrice: reseller,
    resellerShare: 25,
    resellerMinKg: PRICE.resellerMinKg,
    opsPerKg: Math.round(2000 * f) + 1000,
    fixedCost: Math.round(100000 * Math.pow(1.1, y - 1)),
    preservePct: pct,
    learningFloor: Math.round(LEARNING_COST_PER_YEAR[y - 1] / 12),
  };
};

export type PresetKey = 'satu' | 'y1' | 'y2' | 'y3' | 'y4' | 'y5';
export const PRESETS: { key: PresetKey; a: Assumptions }[] = [
  { key: 'satu', a: { ...yearAssumptions(1), kgPerMonth: 60 } },
  { key: 'y1', a: yearAssumptions(1) },
  { key: 'y2', a: yearAssumptions(2) },
  { key: 'y3', a: yearAssumptions(3) },
  { key: 'y4', a: yearAssumptions(4) },
  { key: 'y5', a: yearAssumptions(5) },
];

/** Harga per kemasan dipecah: ke perajin, dana pembelajaran, dan operasional serta margin (sisa). */
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
