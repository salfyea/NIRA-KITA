/**
 * "Irama Tangan": mengukur irama gerak berulang (mengaduk) dari lintasan tangan.
 * Memakai autokorelasi, jadi berlaku untuk gerak melingkar maupun bolak-balik.
 * - rpm: siklus per menit
 * - regularity: 0..1, seberapa mirip tiap siklus dengan siklus sebelumnya (keteraturan)
 * Ini ukuran gerak, bukan penilaian teknik: teknik yang sah tetap dinyatakan mentor manusia.
 */
export interface Sample {
  t: number; // milidetik
  x: number;
  y: number;
}

export interface Rhythm {
  rpm: number;
  period: number; // detik
  regularity: number; // 0..1
}

const HZ = 30;

/** Menyeragamkan sampel tak beraturan menjadi 30 Hz dengan interpolasi linear. */
const resample = (s: Sample[]) => {
  const t0 = s[0].t;
  const dur = (s[s.length - 1].t - t0) / 1000;
  const n = Math.floor(dur * HZ);
  const xs = new Float64Array(n);
  const ys = new Float64Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const tt = t0 + (i / HZ) * 1000;
    while (j < s.length - 2 && s[j + 1].t < tt) j++;
    const a = s[j];
    const b = s[j + 1];
    const f = b.t === a.t ? 0 : Math.min(1, Math.max(0, (tt - a.t) / (b.t - a.t)));
    xs[i] = a.x + (b.x - a.x) * f;
    ys[i] = a.y + (b.y - a.y) * f;
  }
  return { xs, ys, n };
};

const smooth = (a: Float64Array) => {
  const o = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) o[i] = ((a[i - 1] ?? a[i]) + 2 * a[i] + (a[i + 1] ?? a[i])) / 4;
  return o;
};

const detrend = (a: Float64Array, win: number) => {
  // kurangi rata-rata bergerak supaya hanyutan lambat (tangan bergeser) tidak dianggap irama
  const o = new Float64Array(a.length);
  let sum = 0;
  const q: number[] = [];
  for (let i = 0; i < a.length; i++) {
    q.push(a[i]);
    sum += a[i];
    if (q.length > win) sum -= q.shift()!;
  }
  // gunakan jendela terpusat sederhana
  for (let i = 0; i < a.length; i++) {
    const lo = Math.max(0, i - (win >> 1));
    const hi = Math.min(a.length - 1, i + (win >> 1));
    let m = 0;
    for (let k = lo; k <= hi; k++) m += a[k];
    o[i] = a[i] - m / (hi - lo + 1);
  }
  return o;
};

/** Mengembalikan null bila tidak ada irama yang jelas atau data terlalu sedikit. */
export const analyzeRhythm = (samples: Sample[], minRegularity = 0.3): Rhythm | null => {
  if (samples.length < 20) return null;
  const span = (samples[samples.length - 1].t - samples[0].t) / 1000;
  if (span < 2.2) return null;
  const { xs, ys, n } = resample(samples);
  if (n < 60) return null;
  const x = detrend(smooth(xs), HZ * 2);
  const y = detrend(smooth(ys), HZ * 2);

  const dot = (k: number) => {
    let s = 0;
    for (let i = 0; i + k < n; i++) s += x[i] * x[i + k] + y[i] * y[i + k];
    return s / (n - k);
  };
  const r0 = dot(0);
  if (r0 < 1e-9) return null;
  const kmin = Math.round(0.35 * HZ);
  const kmax = Math.min(Math.round(2.6 * HZ), Math.floor(n * 0.6));
  const r: number[] = [];
  for (let k = 0; k <= kmax + 1; k++) r.push(dot(k) / r0);
  // Kumpulkan puncak lokal, lalu pilih yang PERTAMA yang cukup kuat. Memilih yang tertinggi akan
  // salah ke kelipatan periode (2x, 3x), sehingga tempo terbaca setengah atau sepertiga.
  const peaks: number[] = [];
  let top = -Infinity;
  for (let k = kmin; k <= kmax; k++) {
    if (r[k] > r[k - 1] && r[k] >= r[k + 1]) {
      peaks.push(k);
      if (r[k] > top) top = r[k];
    }
  }
  const best = peaks.find((k) => r[k] >= top * 0.85) ?? -1;
  const bestV = best < 0 ? 0 : r[best];
  if (best < 0 || bestV < minRegularity) return null;
  // interpolasi parabola untuk periode yang lebih halus
  const a = r[best - 1];
  const b = r[best];
  const c = r[best + 1];
  const denom = a - 2 * b + c;
  const off = denom === 0 ? 0 : (0.5 * (a - c)) / denom;
  const period = (best + off) / HZ;
  return { rpm: 60 / period, period, regularity: Math.max(0, Math.min(1, bestV)) };
};

export const regularityLabel = (r: number): 'teratur' | 'cukup' | 'tidak-teratur' => (r >= 0.7 ? 'teratur' : r >= 0.45 ? 'cukup' : 'tidak-teratur');

/** Penampung lintasan tangan 6 detik terakhir untuk pengukuran irama langsung. */
export class RhythmMeter {
  private s: Sample[] = [];

  reset() {
    this.s = [];
  }

  push(t: number, x: number, y: number) {
    this.s.push({ t, x, y });
    const cut = t - 6000;
    while (this.s.length && this.s[0].t < cut) this.s.shift();
  }

  read(minRegularity = 0.3): Rhythm | null {
    return analyzeRhythm(this.s, minRegularity);
  }

  /** Salinan seluruh sampel (untuk perekaman irama acuan). */
  all() {
    return this.s.slice();
  }
}

/** Irama acuan dari perajin yang sudah disetujui kurator: toleransi 25% dari rpm acuan. */
export const tempoVerdict = (rpm: number, ref: number): 'lambat' | 'pas' | 'cepat' => (rpm < ref * 0.75 ? 'lambat' : rpm > ref * 1.25 ? 'cepat' : 'pas');
