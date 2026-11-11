/** Penyimpanan ringan di perangkat untuk pengunjung QR (tanpa akun). Semua akses dibungkus try/catch. */
const KEY = 'niraKita.visitor.v1';

export interface VisitorState {
  cards: string[];
  best: Record<string, number>;
}

export const loadVisitor = (): VisitorState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { cards: [], best: {}, ...JSON.parse(raw) };
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return { cards: [], best: {} };
};

export const saveVisitor = (s: VisitorState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* abaikan */
  }
};
