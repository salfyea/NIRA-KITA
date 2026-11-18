import { BUY_PRICE, PRESERVE_PCT, PRICE } from './finance';

/**
 * Voucher pembelian berikutnya yang dibagikan di halaman terakhir Paspor Warisan (QR kemasan).
 * Kode bisa diverifikasi tanpa server lewat karakter pemeriksa dan tanggal terbit yang tertanam di kode.
 * Prototipe: "satu kali pakai" hanya ditegakkan di perangkat yang sama; produksi butuh server.
 */
export interface VoucherConfig {
  active: boolean;
  percent: number; // diskon, % dari harga
  capRp: number; // batas potongan maksimum
  minKg: number; // minimal pembelian
  validDays: number; // masa berlaku sejak terbit
}

/** Nilai awal yang dipilih agar aman terhadap margin (lihat voucherSafety). Hanya untuk saluran langsung. */
export const DEFAULT_VOUCHER: VoucherConfig = { active: true, percent: 5, capRp: 7500, minKg: 3, validDays: 30 };

const EPOCH = Date.UTC(2026, 0, 1);
const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // tanpa 0/O/1/I agar mudah dibaca
const SALT = 'nira-kita-v1';

const dayNow = () => Math.floor((Date.now() - EPOCH) / 86400000);
const b32 = (n: number, len: number) => {
  let s = '';
  for (let i = 0; i < len; i++) {
    s = ABC[n % 32] + s;
    n = Math.floor(n / 32);
  }
  return s;
};
const unb32 = (s: string) => [...s].reduce((a, c) => a * 32 + ABC.indexOf(c), 0);
const check = (body: string) => {
  let h = 7;
  for (const c of body + SALT) h = (h * 31 + c.charCodeAt(0)) % 1000003;
  return ABC[h % 32];
};

/** Membuat kode unik untuk satu batch kemasan: NK001-DDD-RRR-C. */
export const makeVoucherCode = (batchCode: string): string => {
  const batch = batchCode.replace('-', '');
  const rnd = b32(Math.floor(Math.random() * 32768), 3);
  const body = `${batch}-${b32(dayNow(), 3)}-${rnd}`;
  return `${body}-${check(body)}`;
};

export type VoucherCheck = { ok: true; batch: string; daysLeft: number } | { ok: false; reason: 'format' | 'checksum' | 'expired' };

export const verifyVoucher = (raw: string, cfg: VoucherConfig): VoucherCheck => {
  const code = raw.trim().toUpperCase();
  const m = code.match(/^(NK\d{3})-([A-Z2-9]{3})-([A-Z2-9]{3})-([A-Z2-9])$/);
  if (!m) return { ok: false, reason: 'format' };
  const body = `${m[1]}-${m[2]}-${m[3]}`;
  if (check(body) !== m[4]) return { ok: false, reason: 'checksum' };
  const left = unb32(m[2]) + cfg.validDays - dayNow();
  if (left < 0) return { ok: false, reason: 'expired' };
  return { ok: true, batch: m[1], daysLeft: left };
};

/** Potongan untuk pembelian tertentu. Hanya saluran langsung dan hanya bila memenuhi minimal pembelian. */
export const voucherDiscount = (cfg: VoucherConfig, kg: number): number => {
  if (!cfg.active || kg < cfg.minKg || kg >= PRICE.resellerMinKg) return 0;
  return Math.min(cfg.capRp, Math.round((kg * PRICE.direct * cfg.percent) / 100 / 500) * 500);
};

/** Margin per kg saluran langsung setelah biaya per kg (asumsi Rp3.000) dan dana pembelajaran. */
const OPS_PER_KG = 3000;
const directMargin = (price: number) => price - BUY_PRICE - OPS_PER_KG - (price * PRESERVE_PCT) / 100;

/** Uji keamanan: berapa persen margin pesanan terkecil dan terbesar yang tersita voucher, dan titik pulang pokoknya. */
export const voucherSafety = (cfg: VoucherConfig) => {
  const at = (kg: number) => {
    const off = voucherDiscount(cfg, kg);
    const revenue = kg * PRICE.direct - off;
    const margin = revenue - kg * BUY_PRICE - kg * OPS_PER_KG - (revenue * PRESERVE_PCT) / 100;
    const full = kg * directMargin(PRICE.direct);
    return { kg, off, margin, full, eaten: full > 0 ? (full - margin) / full : 1 };
  };
  const rows = [cfg.minKg, 5, 10, PRICE.resellerMinKg - 1].map(at);
  const worst = rows.reduce((a, r) => (r.margin < a.margin ? r : a), rows[0]);
  return { rows, worst, safe: rows.every((r) => r.margin > 0) && rows[0].eaten <= 0.5 };
};
