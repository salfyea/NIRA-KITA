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
| `/learn` | **Jalur Belajar**: lanskap vektor dengan empat stasiun modul yang bisa diketuk (selesai, aktif, terkunci), jalan yang berwarna sesuai progres, dan unduhan poster PNG/SVG yang selalu tampil lengkap berwarna |
| `/learn/peta` | **Peta** miring bergaya game, check-in terpandu (simulasi) |
| `/learn/koleksi`, `/learn/koleksi/:id` | **Koleksi**: kartu dan glosarium, detail |
| `/learn/profil` | **Profil**: level, XP, lencana, setel ulang demo, keluar |
| `/learn/arsip`, `/learn/arsip/:id` | **Arsip Gerakan**: klip lapangan perajin, tombol kerangka tangan (MediaPipe di perangkat), tautan ke latihan |
| `/learn/bab/:slug` (kartu Praktik gerak) | Praktik gerak per modul (menuang, menjepit, mengaduk dengan alat AR di tangan; Modul 3 dan 4 memakai kartu skenario tanpa kamera) |
| `/learn/peta` | Peta ilustrasi vektor Cilongok (Gunung Slamet, sungai, sawah berteras, kebun kelapa, tiga desa) yang bisa diketuk, dengan unduhan PNG 2340x3840 dan SVG untuk poster |
| `/learn/lab` | **Lab Pengetahuan**: Lab Dapur (eksperimen bebas) dan Peta Istilah (mencocokkan istilah dan fungsi), +40 XP sekali per eksperimen |
| `/kode-undangan` | Kode `KURATOR-2026` membuka `/kurator`, `ADMIN-2026` membuka `/admin`, `MENTOR-2026` membuka `/mentor` |
| `/mentor` | **Mentor** (`MENTOR-2026`): unggah rekaman dengan izin narasumber, validasi pelajar (satu-satunya yang membuka lencana mentor), anotasi klip |
| `/enterprise` | **NIRA Enterprise** (`ENTERPRISE-2026`): mitra perajin, pencatatan pembelian adil (premi di atas harga acuan, masuk audit), harga kemasan yang tampil di halaman QR, simulasi keuangan |
| `/kurator`, `/kurator/:id` | **Kurator**: antrean tinjauan, izin kontributor, checklist 6 poin, visibilitas (Privat, Pelajar, Publik QR), keputusan tercatat di audit |
| `/admin` | **Admin**: capaian pilot (KPI), pembuat batch QR (kode QR nyata, unduh PNG), catatan audit |
| `/tur` | Tur 9 langkah untuk juri (akun demo otomatis) |
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

## Modul berurutan
Modul hanya terbuka bila semua modul sebelumnya selesai (`isModuleLocked` di `src/store.tsx`, satu sumber kebenaran). Berlaku di Jalur Belajar, tautan langsung `/learn/bab/:slug` (dialihkan dengan pesan), dan tombol "Latih gerakan ini" di Arsip. Tur juri boleh melompat. Data tersimpan lama yang tidak konsisten dirapikan saat dimuat.

## NIRA Enterprise
Sayap ekonomi dari model sosial-bisnis NIRA KITA: Jejak Nira (pelestarian dan pembelajaran) didanai oleh nilai produknya. `src/lib/finance.ts` berisi hitungan simulasi (omzet, laba, premi, titik impas, honor mentor yang terdanai) dan pembagian harga kemasan; harga jual dari tim (langsung Rp35.000/kg; reseller Rp30.000/kg, minimal 30 kg), sedangkan harga beli, harga acuan, biaya, porsi reseller, dan dana pelestarian masih ASUMSI contoh yang bisa diubah dan ditandai ilustratif sampai koperasi mengisi angka sebenarnya. Dana pelestarian dipotong dari omzet lebih dulu (bukan dari sisa laba). Pembelian dan pengaturan harga masuk catatan audit.

## Irama Tangan
`src/lib/irama.ts`: mengukur irama gerak berulang (putaran/menit dan keteraturan) dari lintasan tangan dengan autokorelasi. Diuji dengan data sintetis (galat <2% untuk 30 sampai 90 rpm; menolak gerak acak, diam, atau terlalu pendek). Klip lapangan yang ada TIDAK cukup andal (tangan terdeteksi di 10%, 0%, 0% frame), jadi irama acuan harus direkam mentor dari perajin dengan kamera, disetujui kurator, lalu tampil di Arsip dan latihan mengaduk.

## PWA (pasang dan offline)
`public/manifest.webmanifest` + `public/sw.js` (ditulis tangan, tanpa pustaka). Cangkang aplikasi disimpan saat pemasangan; halaman jaringan-dulu; berkas besar (model tangan, WASM, klip, font) disimpan saat pertama dipakai. Di Profil ada tombol Pasang aplikasi dan "Siapkan untuk offline" (±27 MB). Tidak ada data pengguna atau video kamera yang disimpan. Uji: `qa-out` (lihat riwayat PR #20).

## Dua bahasa (ID/EN)
`src/i18n.tsx`: `t('teks Indonesia', 'English text')`, toggle ID/EN (tersimpan di perangkat), dan subtree dimuat ulang saat bahasa berganti. Data awal diterjemahkan lewat `src/data/en.ts`, konten game/tur/praktik lewat fungsi `get...()` di `src/data/`. Terjemahan dibuat dengan bantuan AI dan perlu ditinjau kurator atau penutur asli; istilah budaya (pongkor, laru, bathok, jubung) dipertahankan dengan penjelasan.

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
Arsip Gerakan masih berlabel "konsep visi" (belum ada datanya). Data ilustratif.
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
