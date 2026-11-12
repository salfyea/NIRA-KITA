/** Ekspor SVG ke berkas mandiri dan PNG resolusi tinggi (untuk poster). */
export const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

/** Salinan SVG tanpa atribut interaktif, dengan ukuran piksel eksplisit. */
export const standaloneSvg = (svg: SVGSVGElement, width: number, height: number): string => {
  const c = svg.cloneNode(true) as SVGSVGElement;
  c.setAttribute('width', String(width));
  c.setAttribute('height', String(height));
  c.removeAttribute('class');
  c.removeAttribute('role');
  c.querySelectorAll('[role=button]').forEach((g) => {
    g.removeAttribute('tabindex');
    g.removeAttribute('role');
    g.removeAttribute('style');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(c)}`;
};

export const svgToPng = async (svg: SVGSVGElement, w: number, h: number, scale: number): Promise<Blob | null> => {
  const blob = new Blob([standaloneSvg(svg, w * scale, h * scale)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('gagal memuat gambar'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
};

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
