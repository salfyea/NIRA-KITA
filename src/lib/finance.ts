/**
 * Hitungan keuangan NIRA Enterprise. Semua angka masukan adalah ASUMSI yang bisa diubah, bukan fakta:
 * prototipe memakai angka contoh dan menandainya ilustratif sampai koperasi mengisi angka sebenarnya.
 */
export const rupiah = (n: number): string => `Rp${Math.round(n).toLocaleString('id-ID')}`;

export interface Assumptions {
  kgPerMonth: number; // volume gula dibeli dari mitra per bulan
  buyPrice: number; // harga beli adil ke perajin, Rp per kg
  marketRef: number; // harga acuan pasar (tengkulak), Rp per kg
  sellPrice: number; // harga jual rata-rata, Rp per kg
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
  breakEvenKg: number; // volume bulanan agar laba bersih 0 (Infinity bila margin per kg <= 0)
  artisanShare: number; // persen omzet yang sampai ke perajin
}

export const simulate = (a: Assumptions): Outcome => {
  const revenue = a.kgPerMonth * a.sellPrice;
  const cogs = a.kgPerMonth * a.buyPrice;
  const gross = revenue - cogs;
  const ops = a.kgPerMonth * a.opsPerKg + a.fixedCost;
  const preserve = (revenue * a.preservePct) / 100;
  const net = gross - ops - preserve;
  const marginPerKg = a.sellPrice - a.buyPrice - a.opsPerKg - (a.sellPrice * a.preservePct) / 100;
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
    breakEvenKg: marginPerKg > 0 ? a.fixedCost / marginPerKg : Infinity,
    artisanShare: revenue > 0 ? (cogs / revenue) * 100 : 0,
  };
};

export const PRESETS: { key: 'konservatif' | 'dasar' | 'tumbuh'; a: Assumptions }[] = [
  { key: 'konservatif', a: { kgPerMonth: 150, buyPrice: 20000, marketRef: 16000, sellPrice: 30000, opsPerKg: 3000, fixedCost: 1500000, preservePct: 8, mentorFee: 750000 } },
  { key: 'dasar', a: { kgPerMonth: 400, buyPrice: 20000, marketRef: 16000, sellPrice: 32000, opsPerKg: 3000, fixedCost: 2000000, preservePct: 8, mentorFee: 750000 } },
  { key: 'tumbuh', a: { kgPerMonth: 1000, buyPrice: 21000, marketRef: 16000, sellPrice: 34000, opsPerKg: 2800, fixedCost: 3500000, preservePct: 8, mentorFee: 750000 } },
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
