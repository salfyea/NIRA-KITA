import { NiraMood } from '../art/Nira';
import { t } from '../i18n';

/** Langkah tur untuk juri. Tiap langkah menautkan layar nyata dengan klaim di dokumen proposal. */
export interface TourStep {
  id: string;
  route: string;
  short: string;
  title: string;
  see: string;
  proves: string;
  tryIt: string;
  mood: NiraMood;
  /** Peran staf yang diperlukan layar ini (otomatis disiapkan oleh tur). */
  role?: 'mentor' | 'curator' | 'admin' | 'enterprise';
}

/** Dihitung saat dipanggil supaya mengikuti bahasa aktif. */
export const getTour = (): TourStep[] => [
  {
    id: 'qr',
    route: '/p/NK-001',
    short: t('Pembeli memindai QR', 'Buyer scans the QR'),
    title: t('Pembeli memindai kemasan', 'A buyer scans the package'),
    see: t(
      'Halaman web tanpa unduhan: asal desa dan kisah Pak Parmadi, dengan chip persetujuan kurator.',
      'A web page with no download: the village of origin and Pak Parmadi’s story, with the curator approval chip.',
    ),
    proves: t('QR Heritage Passport dan tata kelola persetujuan', 'QR Heritage Passport and consent governance'),
    tryIt: t('Gulir ke kisah lalu geser tiga kartu ceritanya.', 'Scroll to the story and swipe its three cards.'),
    mood: 'wave',
  },
  {
    id: 'game',
    route: '/p/NK-001#game',
    short: t('Belajar sambil main', 'Learn by playing'),
    title: t('Belajar lewat permainan', 'Learning through play'),
    see: t(
      'Game Dapur Gula: saring, jaga api, aduk, cetak. Setiap langkah ditutup fakta dari jurnal dan liputan.',
      'The Sugar Kitchen game: filter, tend the fire, stir, mold. Each step ends with a fact from journals and news reports.',
    ),
    proves: t('Pembelajaran gamifikasi dari proses yang nyata', 'Gamified learning built on the real process'),
    tryIt: t('Tekan Masuk dapur, lalu mainkan langkah pertama.', 'Press Enter the kitchen, then play the first step.'),
    mood: 'cheer',
  },
  {
    id: 'journey',
    route: '/learn',
    short: t('Jalur belajar', 'Learning path'),
    title: t('Perjalanan belajar pelajar', 'The learner’s journey'),
    see: t(
      'Empat modul di sebuah jalur, dipandu Nira. Semuanya berbasis darat, tidak ada kegiatan memanjat.',
      'Four modules along a path, guided by Nira. Everything is ground-based; there is no climbing.',
    ),
    proves: t('Kurikulum empat modul dan kuis misi', 'A four-module curriculum with quests and quizzes'),
    tryIt: t('Ketuk Modul 1, lalu Mulai bab.', 'Tap Module 1, then Start chapter.'),
    mood: 'happy',
  },
  {
    id: 'gerak',
    route: '/learn/bab/kerajinan-tradisional-transfer-pengetahuan?kartu=praktik',
    short: t('Praktik gerak (CV)', 'Movement practice (CV)'),
    title: t('Praktik gerak dalam modul', 'Movement practice inside modules'),
    see: t(
      'Kamera mengenali gerak tangan dan alatnya menempel di tanganmu: menuang, menjepit, mengaduk, dan mengukur irama. Modul keselamatan dan etika memakai skenario keputusan tanpa kamera. Diproses di perangkat; tidak ada video yang dikirim atau disimpan.',
      'The camera recognises hand movements and the tool attaches to your hand: pouring, pinching, stirring, and measuring rhythm. The safety and ethics modules use camera-free decision scenarios. It runs on the device; no video is sent or stored.',
    ),
    proves: t('Computer vision yang terintegrasi ke kurikulum, dengan privasi terjaga', 'Computer vision built into the curriculum, with privacy preserved'),
    tryIt: t('Pilih Tanpa kamera atau Nyalakan kamera, lalu coba gerakan mengaduk.', 'Choose No camera or Turn on camera, then try the stirring movement.'),
    mood: 'think',
  },
  {
    id: 'arsip',
    route: '/learn/arsip/mengaduk',
    short: t('Arsip Gerakan', 'Movement Archive'),
    title: t('Arsip Gerakan perajin', 'The artisans’ Movement Archive'),
    see: t(
      'Rekaman gerak perajin yang nyata. Tombol kerangka tangan menggambar pelacakan langsung di atas klip, di perangkatmu.',
      'Real recordings of artisans at work. The hand-skeleton button draws live tracking over the clip, on your device.',
    ),
    proves: t('Nira Motion Archive: pengetahuan di tangan perajin', 'Nira Motion Archive: knowledge held in the artisans’ hands'),
    tryIt: t('Tekan Tampilkan kerangka tangan, lalu Latih gerakan ini.', 'Press Show hand skeleton, then Practise this movement.'),
    mood: 'wave',
  },
  {
    id: 'lab',
    route: '/learn/lab',
    short: t('Lab pengetahuan', 'Knowledge lab'),
    title: t('Lab Pengetahuan', 'Knowledge Lab'),
    see: t(
      'Eksperimen bebas di dapur dan peta istilah. Coba tanpa laru atau api terlalu besar dan lihat akibatnya.',
      'Free experiments in the kitchen and a term map. Try no preservative or too much fire and see the consequences.',
    ),
    proves: t('Pengetahuan yang bisa diuji dan dihubungkan', 'Knowledge that can be tested and connected'),
    tryIt: t('Ketuk "Tanpa laru, didiamkan 5 jam".', 'Tap "No laru, left 5 hours".'),
    mood: 'think',
  },
  {
    id: 'map',
    route: '/learn/peta',
    short: t('Peta desa', 'Village map'),
    title: t('Peta desa (simulasi)', 'Village map (simulation)'),
    see: t(
      'Tiga desa dengan kartu warisan. Lokasi tingkat desa saja, tanpa pelacakan lokasi nyata.',
      'Three villages with heritage cards. Village-level locations only, with no real location tracking.',
    ),
    proves: t('Peta warisan yang menjaga privasi', 'A heritage map that protects privacy'),
    tryIt: t('Ketuk satu penanda desa.', 'Tap one village marker.'),
    mood: 'wave',
  },
  {
    id: 'collection',
    route: '/learn/koleksi',
    short: t('Koleksi dan glosarium', 'Collection and glossary'),
    title: t('Koleksi kartu dan glosarium', 'Card collection and glossary'),
    see: t(
      'Kartu hanya dari rekaman yang disetujui kurator, lengkap dengan atribusi narasumber.',
      'Cards come only from recordings the curator has approved, each with the source’s attribution.',
    ),
    proves: t('Heritage Archive di bawah kendali komunitas', 'A Heritage Archive under community control'),
    tryIt: t('Buka satu kartu atau tab Glosarium.', 'Open a card or the Glossary tab.'),
    mood: 'cheer',
  },
  {
    id: 'mentor',
    route: '/mentor',
    short: t('Mentor membawa pengetahuan', 'Mentor brings knowledge'),
    title: t('Tata kelola: mentor', 'Governance: the mentor'),
    see: t(
      'Mentor mengunggah rekaman dengan persetujuan narasumber, menandai teknik pada klip, dan memvalidasi pelajar. Rekaman baru otomatis Privat.',
      'Mentors upload recordings with the source’s consent, annotate techniques on clips, and validate learners. New recordings are Private by default.',
    ),
    proves: t('Izin direkam sejak awal, validasi dilakukan manusia', 'Consent is recorded from the start; validation is done by humans'),
    tryIt: t('Buka tab Validasi dan validasi satu pelajar.', 'Open the Validate tab and validate a learner.'),
    mood: 'wave',
    role: 'mentor',
  },
  {
    id: 'curator',
    route: '/kurator/REC-CLG-003',
    short: t('Kurator memutuskan', 'Curator decides'),
    title: t('Tata kelola: kurator', 'Governance: the curator'),
    see: t(
      'Antrean tinjauan: izin kontributor, checklist enam poin, dan pilihan siapa yang boleh melihat (Privat, Pelajar, Publik QR).',
      'The review queue: contributor consent, a six-point checklist, and a choice of who may see it (Private, Learner, Public QR).',
    ),
    proves: t('Pengetahuan dikendalikan komunitas, bukan diekstraksi', 'Knowledge controlled by the community, not extracted'),
    tryIt: t('Centang checklist, lalu coba pilih Publik. Lihat kenapa tidak bisa, dan setujui untuk Pelajar.', 'Tick the checklist, then try Public. See why it is locked, and approve for Learners.'),
    mood: 'think',
    role: 'curator',
  },
  {
    id: 'admin',
    route: '/admin',
    short: t('Admin dan batch QR', 'Admin and QR batches'),
    title: t('Admin: batch QR dan capaian', 'Admin: QR batches and progress'),
    see: t(
      'Capaian pilot, pembuat batch QR (hanya rekaman yang sudah disetujui), dan catatan audit semua keputusan.',
      'Pilot progress, a QR batch maker (approved recordings only), and an audit log of every decision.',
    ),
    proves: t('Jejak audit dan produk yang bisa dilacak', 'An audit trail and traceable products'),
    tryIt: t('Buka tab Audit, lalu Batch QR dan buat batch baru.', 'Open the Audit tab, then QR Batches and create a new batch.'),
    mood: 'cheer',
    role: 'admin',
  },
  {
    id: 'enterprise',
    route: '/enterprise',
    short: t('NIRA Enterprise', 'NIRA Enterprise'),
    title: t('NIRA Enterprise: keuangan yang menopang', 'NIRA Enterprise: finance that sustains'),
    see: t(
      'Mitra perajin, catatan pembelian adil (premi di atas harga acuan), harga kemasan yang tampil di halaman QR, dan simulasi yang menunjukkan bagaimana dana pembelajaran menopang Jejak Nira.',
      'Artisan partners, fair-purchase records (a premium over the reference price), the pack price shown on the QR page, and a simulation of how the learning fund sustains Jejak Nira.',
    ),
    proves: t('Model sosial-bisnis: pelestarian didanai oleh nilai produknya', 'A social-enterprise model: preservation funded by the value of the product'),
    tryIt: t('Buka tab Simulasi dan ubah volume atau harga, lalu lihat tab Harga QR.', 'Open the Simulation tab and change the volume or price, then see the QR price tab.'),
    mood: 'think',
    role: 'enterprise',
  },
];
