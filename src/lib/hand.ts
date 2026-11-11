import { HandLandmarker } from '@mediapipe/tasks-vision';
import wasmJs from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmBin from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';

export { classifyPose } from './pose';
export type { Pose } from './pose';

let landmarker: Promise<HandLandmarker> | null = null;

/** Memuat model sekali (±7,8 MB, disajikan dari situs sendiri) dan menjalankannya di perangkat. */
export const loadHandLandmarker = (): Promise<HandLandmarker> => {
  if (!landmarker) {
    landmarker = HandLandmarker.createFromOptions(
      { wasmLoaderPath: wasmJs, wasmBinaryPath: wasmBin },
      {
        baseOptions: { modelAssetPath: '/models/hand_landmarker.task', delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      },
    ).catch(() =>
      // GPU tidak tersedia di semua perangkat: ulangi dengan CPU.
      HandLandmarker.createFromOptions(
        { wasmLoaderPath: wasmJs, wasmBinaryPath: wasmBin },
        { baseOptions: { modelAssetPath: '/models/hand_landmarker.task', delegate: 'CPU' }, runningMode: 'VIDEO', numHands: 1 },
      ),
    );
    landmarker.catch(() => {
      landmarker = null;
    });
  }
  return landmarker;
};

export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];
