// Pemeriksaan layar: tangkapan di 390x844 dan desktop, cek luapan horizontal, target sentuh kecil, dan galat konsol.
// Pakai: npm run build && npx vite preview --port 4173 (di terminal lain), lalu
//   node scripts/qa-screens.mjs [baseUrl] [outDir]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://127.0.0.1:4173';
const out = process.argv[3] ?? 'qa-out';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const problems = [];

const ROUTES = [
  ['splash', '/', false],
  ['onboarding', '/onboarding', false],
  ['masuk', '/masuk', false],
  ['kode', '/kode-undangan', false],
  ['paspor-publik', '/p/NK-001', false],
  ['perjalanan', '/learn', true],
  ['peta', '/learn/peta', true],
  ['koleksi', '/learn/koleksi', true],
  ['profil', '/learn/profil', true],
  ['misi', '/learn/misi/QUEST-03', true],
  ['bab', '/learn/bab/keselamatan-kerja-manajemen-risiko', true],
];

for (const [label, vp] of [
  ['mobile', { width: 390, height: 844 }],
  ['desktop', { width: 1280, height: 800 }],
]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: label === 'mobile' ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && problems.push(`[${label}] konsol: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`[${label}] galat halaman: ${e.message}`));

  const login = async () => {
    await page.goto(`${base}/masuk`);
    await page.getByRole('button', { name: 'Masuk', exact: true }).click();
    await page.waitForURL('**/learn');
  };

  for (const [name, path, needsSession] of ROUTES) {
    if (!needsSession) await page.evaluate(() => localStorage.clear()).catch(() => {});
    await page.goto(`${base}${path}`);
    await page.waitForTimeout(400); // beri waktu pengalihan sisi klien
    if (needsSession && page.url().endsWith('/masuk')) {
      await login();
      await page.goto(`${base}${path}`);
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(name === 'splash' ? 300 : 700);
    await page.screenshot({ path: `${out}/${label}-${name}.png` });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`[${label}] ${name}: luapan horizontal ${overflow}px`);

    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, a, input')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40) && !el.classList.contains('sr-only');
        })
        .map((el) => `${el.tagName.toLowerCase()}:"${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`),
    );
    if (small.length) problems.push(`[${label}] ${name}: target kecil -> ${small.join('; ')}`);
  }
  await ctx.close();
}

await browser.close();
console.log(problems.length ? problems.join('\n') : 'Tidak ada masalah ditemukan.');
process.exit(problems.length ? 1 : 0);
