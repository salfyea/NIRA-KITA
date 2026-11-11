/* Service worker NIRA KITA: aplikasi tetap terbuka saat sinyal lemah atau mati.
 * - Cangkang aplikasi (HTML, JS, CSS) disimpan saat pemasangan.
 * - Halaman: jaringan dulu, cadangan dari simpanan (SPA jatuh ke index.html).
 * - Berkas besar (model pelacak tangan, WASM, klip, gambar, font): disimpan saat pertama dipakai.
 * Tidak ada data pengguna atau video kamera yang disimpan di sini. */
const VERSION = 'nira-v2';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      const res = await fetch('/index.html', { cache: 'reload' });
      const html = await res.clone().text();
      await cache.put('/index.html', res);
      // JS dan CSS ber-hash yang dirujuk halaman
      const urls = new Set(['/', '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png']);
      for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) urls.add(m[1]);
      await Promise.all([...urls].map((u) => cache.add(new Request(u, { cache: 'reload' })).catch(() => undefined)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

const isStatic = (url) =>
  url.origin === self.location.origin &&
  (url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/models/') ||
    url.pathname.startsWith('/media/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/tokoh/') ||
    /\.(png|jpe?g|svg|webp|woff2?|wasm|mp4|task)$/.test(url.pathname));

const isFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname === '/sw.js') return;

  // Halaman (navigasi): jaringan dulu, lalu simpanan, lalu cangkang SPA.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(SHELL);
          cache.put('/index.html', fresh.clone()).catch(() => undefined);
          return fresh;
        } catch {
          const cache = await caches.open(SHELL);
          return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error();
        }
      })(),
    );
    return;
  }

  // Video memakai permintaan rentang (Range): sajikan potongan dari salinan penuh bila ada,
  // dan simpan salinan penuh di latar belakang saat pertama diputar.
  if (url.origin === self.location.origin && /\.mp4$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        const full = await cache.match(url.pathname, { ignoreVary: true });
        if (full) {
          const range = req.headers.get('range');
          if (!range) return full;
          const buf = await full.arrayBuffer();
          const m = /bytes=(\d+)-(\d*)/.exec(range);
          const start = m ? Number(m[1]) : 0;
          const end = m && m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
          return new Response(buf.slice(start, end + 1), {
            status: 206,
            statusText: 'Partial Content',
            headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(end - start + 1), 'Content-Range': `bytes ${start}-${end}/${buf.byteLength}` },
          });
        }
        event.waitUntil(cache.add(new Request(url.pathname)).catch(() => undefined));
        return fetch(req);
      })(),
    );
    return;
  }

  // Berkas statis dan font: simpanan dulu, lalu jaringan, lalu simpan.
  if (isStatic(url) || isFont(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        // ignoreVary: skrip dimuat dengan atau tanpa header Origin; berkas yang sama tetap harus cocok
        const hit = await cache.match(req, { ignoreVary: true });
        if (hit) return hit;
        try {
          const res = await fetch(req);
          // klip video memakai permintaan rentang: jangan simpan respons parsial
          if (res.ok && res.status === 200) cache.put(req, res.clone()).catch(() => undefined);
          else if (res.type === 'opaque') cache.put(req, res.clone()).catch(() => undefined);
          return res;
        } catch {
          return hit || Response.error();
        }
      })(),
    );
  }
});
