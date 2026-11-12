/** Mengukur panjang path hingga titik terdekat ke tiap y yang diminta (untuk mewarnai bagian jalan yang sudah dilalui). */
export const lengthsAtY = (d: string, ys: number[]): number[] => {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  try {
    const total = path.getTotalLength();
    const N = 600;
    const pts = Array.from({ length: N + 1 }, (_, i) => {
      const L = (i / N) * total;
      const p = path.getPointAtLength(L);
      return { L, y: p.y };
    });
    let from = 0;
    return ys.map((y) => {
      let best = from;
      let bd = Infinity;
      for (let i = from; i <= N; i++) {
        const dd = Math.abs(pts[i].y - y);
        if (dd < bd) {
          bd = dd;
          best = i;
        }
      }
      from = best;
      return pts[best].L;
    });
  } finally {
    svg.remove();
  }
};
