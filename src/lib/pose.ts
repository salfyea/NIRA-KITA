import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

/** Bentuk tangan yang dikenali. Hanya geometri jari, bukan penilaian teknik. */
export type Pose = 'fist' | 'open' | 'pinch' | 'point' | 'thumbsUp' | 'none';

const d = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y, (a.z - b.z) * 0.5);

/** Jari lurus bila ujungnya lebih jauh dari pergelangan daripada sendi tengahnya. */
const extended = (l: NormalizedLandmark[], tip: number, pip: number) => d(l[tip], l[0]) > d(l[pip], l[0]) * 1.08;

/**
 * Klasifikasi sederhana dari 21 titik tangan MediaPipe.
 * 0 pergelangan, 4 ujung jempol, 8/12/16/20 ujung jari, 6/10/14/18 sendi tengah, 9 pangkal jari tengah.
 */
export const classifyPose = (l: NormalizedLandmark[] | undefined): Pose => {
  if (!l || l.length < 21) return 'none';
  const size = d(l[0], l[9]) || 1;
  const idx = extended(l, 8, 6);
  const mid = extended(l, 12, 10);
  const ring = extended(l, 16, 14);
  const pinky = extended(l, 20, 18);

  const pinchDist = d(l[4], l[8]) / size;
  if (pinchDist < 0.38 && mid && ring) return 'pinch';
  if (idx && !mid && !ring && !pinky) return 'point';
  if (!idx && !mid && !ring && !pinky) {
    // jempol mengacung ke atas, jauh di atas pangkal telunjuk
    const thumbUp = l[4].y < l[5].y - size * 0.35 && d(l[4], l[0]) > d(l[3], l[0]) * 1.05;
    return thumbUp ? 'thumbsUp' : 'fist';
  }
  if (idx && mid && ring && pinky) return 'open';
  return 'none';
};

/** Sudut miring tangan di bidang layar, 0 = tegak (pergelangan ke pangkal jari tengah). Dalam derajat. */
export const rollDeg = (l: NormalizedLandmark[]) => (Math.atan2(l[9].x - l[0].x, -(l[9].y - l[0].y)) * 180) / Math.PI;

/** Menghitung putaran gerakan melingkar pergelangan (mengaduk). */
export class StirTracker {
  private pts: { t: number; x: number; y: number }[] = [];
  private last: number | null = null;
  private total = 0;

  reset() {
    this.pts = [];
    this.last = null;
    this.total = 0;
  }

  push(t: number, x: number, y: number) {
    this.pts.push({ t, x, y });
    while (this.pts.length && t - this.pts[0].t > 2500) this.pts.shift();
    if (this.pts.length < 6) return;
    const cx = this.pts.reduce((a, p) => a + p.x, 0) / this.pts.length;
    const cy = this.pts.reduce((a, p) => a + p.y, 0) / this.pts.length;
    const r = this.pts.reduce((a, p) => a + Math.hypot(p.x - cx, p.y - cy), 0) / this.pts.length;
    const ang = Math.atan2(y - cy, x - cx);
    if (this.last !== null && r > 0.022) {
      let dA = ang - this.last;
      while (dA > Math.PI) dA -= 2 * Math.PI;
      while (dA < -Math.PI) dA += 2 * Math.PI;
      this.total += dA;
    }
    this.last = ang;
  }

  get laps() {
    return Math.abs(this.total) / (2 * Math.PI);
  }
}

/** Menghitung gerakan menuang: tangan miring lebih dari 55 derajat, lalu kembali tegak. */
export class PourTracker {
  count = 0;
  private tilted = false;

  reset() {
    this.count = 0;
    this.tilted = false;
  }

  push(roll: number) {
    const a = Math.abs(roll);
    if (!this.tilted && a > 55) this.tilted = true;
    else if (this.tilted && a < 25) {
      this.tilted = false;
      this.count += 1;
    }
  }

  get isTilted() {
    return this.tilted;
  }
}
