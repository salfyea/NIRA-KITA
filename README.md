# Jejak Nira (NIRA KITA)

Prototipe konsep ekosistem pembelajaran dan pelestarian pengetahuan gula kelapa Cilongok, Banyumas.
Stack: Vite + React 19 + TypeScript + Tailwind 4 + react-router-dom v7 + lucide-react.

## Alur
`/` splash (1,8 dtk) → `/onboarding` (3 slide) → `/masuk` (Masuk/Daftar, simulasi) → aplikasi Pelajar.

| Rute | Isi |
| --- | --- |
| `/learn` | **Perjalanan**: jalur berkelok, 4 bab, bottom sheet, kartu "segera hadir" |
| `/learn/bab/:slug` | Pembaca bab (kartu geser, kuis mini, hadiah), tanpa tab bar |
| `/learn/misi/:id` | Detail misi |
| `/learn/peta` | **Peta** miring bergaya game, check-in terpandu (simulasi) |
| `/learn/koleksi`, `/learn/koleksi/:id` | **Koleksi**: kartu dan glosarium, detail |
| `/learn/profil` | **Profil**: level, XP, lencana, setel ulang demo, keluar |
| `/kode-undangan` | Kode Mentor/Kurator/Admin (placeholder rapi) |
| `/p/:code` | Paspor Warisan publik dari QR (placeholder) |

`/learn/*` tanpa sesi diarahkan ke `/masuk`. Kode demo: `MENTOR-2026`, `KURATOR-2026`, `ADMIN-2026`.

## Jalankan
    npm install
    npm run dev
    npm run build

## Struktur singkat
- `src/art/`: `Nira` (maskot, mood happy/cheer/think/wave/sleep) dan `Scene` (8 adegan SVG).
- `src/store.tsx`: state lokal (localStorage, try/catch), termasuk `session` dan `onboarded`.
- `src/data/`: data awal, kuis mini, helper atribusi.

## Keputusan desain (yang ambigu, dipilih paling sederhana)
- Node bab: selesai = 100%; aktif = bab pertama yang belum selesai; terkunci = bab setelah yang aktif dan berprogres 0%. Bab lain terbuka.
- Penanda peta dipetakan ke rekaman menurut lokasi aslinya, dan hanya rekaman yang lolos `isLearnerVisible`.
- Kuis: satu soal per bab, harus benar untuk lanjut lewat tombol. XP bab (60) hanya sekali.
- Setel ulang demo mempertahankan sesi dan status onboarding.
- Kata sandi tidak pernah disimpan; sesi hanya menyimpan nama tampilan.
- Tombol "Misi" muncul hanya jika misinya ada di data (QUEST-03 dan 04 belum ada).

## Aturan konten dan etika
Pembelajaran berbasis darat, pelajar tidak pernah diminta memanjat; siluet penderes hanya dari jauh tanpa wajah.
Hanya konten `Approved` dengan visibilitas `learner`/`public` tampil. Peta hanya simulasi tingkat desa.
Lab Pengetahuan dan Arsip Gerakan berlabel "konsep visi". Data ilustratif.
Foto narasumber tidak dipakai sampai izinnya ada; saat ini ilustrasi.

## Deploy
Vercel (preset Vite). `vercel.json` berisi rewrite SPA. Push ke `main` = produksi; branch lain dan PR = preview.

## Belum ada
Tampilan Mentor, Kurator, Admin; halaman QR publik penuh; ilustrasi/foto asli (sebagian data masih menyimpan tautan Unsplash
yang tidak ditampilkan); izin foto narasumber perlu dikonfirmasi.

## Pemeriksaan layar (QA)
    npm run build && npx vite preview --port 4173      # terminal 1
    npm run qa -- http://127.0.0.1:4173 qa-out         # terminal 2
Mengambil tangkapan 390x844 dan desktop untuk semua rute, lalu melaporkan luapan horizontal, target sentuh < 40px, dan galat konsol.
Memakai Chrome yang terpasang lewat `playwright-core` (tanpa unduhan peramban). Folder `qa-out` diabaikan git.
