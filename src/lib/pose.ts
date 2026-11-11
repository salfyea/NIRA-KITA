import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

/** Bentuk tangan yang dikenali. Hanya geometri jari, bukan penilaian teknik. */
export type Pose = 'fist' | 'open' | 'pinch' | 'none';

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
  if (!idx && !mid && !ring && !pinky) return 'fist';
  if (idx && mid && ring && pinky) return 'open';
  return 'none';
};
