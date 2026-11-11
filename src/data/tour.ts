import { NiraMood } from '../art/Nira';

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
  role?: 'mentor' | 'curator' | 'admin';
}

export const TOUR: TourStep[] = [
  {
    id: 'qr',
    route: '/p/NK-001',
    short: 'Pembeli memindai QR',
    title: 'Pembeli memindai kemasan',
    see: 'Halaman web tanpa unduhan: asal desa dan kisah Pak Parmadi, dengan chip persetujuan kurator.',
    proves: 'QR Heritage Passport dan tata kelola persetujuan',
    tryIt: 'Gulir ke kisah lalu geser tiga kartu ceritanya.',
    mood: 'wave',
  },
  {
    id: 'game',
    route: '/p/NK-001#game',
    short: 'Belajar sambil main',
    title: 'Belajar lewat permainan',
    see: 'Game Dapur Gula: saring, jaga api, aduk, cetak. Setiap langkah ditutup fakta dari jurnal dan liputan.',
    proves: 'Pembelajaran gamifikasi dari proses yang nyata',
    tryIt: 'Tekan Masuk dapur, lalu mainkan langkah pertama.',
    mood: 'cheer',
  },
  {
    id: 'journey',
    route: '/learn',
    short: 'Jalur belajar',
    title: 'Perjalanan belajar pelajar',
    see: 'Empat modul di sebuah jalur, dipandu Nira. Semuanya berbasis darat, tidak ada kegiatan memanjat.',
    proves: 'Kurikulum empat modul dan kuis misi',
    tryIt: 'Ketuk Modul 1, lalu Mulai bab.',
    mood: 'happy',
  },
  {
    id: 'gerak',
    route: '/learn/bab/kerajinan-tradisional-transfer-pengetahuan?kartu=praktik',
    short: 'Praktik gerak (CV)',
    title: 'Praktik gerak dalam modul',
    see: 'Di tiap modul, kamera mengenali gerak tangan: menuang, menyaring, mengaduk, atau menilai situasi aman dan bahaya. Diproses di perangkat; tidak ada video yang dikirim atau disimpan.',
    proves: 'Computer vision yang terintegrasi ke kurikulum, dengan privasi terjaga',
    tryIt: 'Pilih Tanpa kamera atau Nyalakan kamera, lalu coba gerakan mengaduk.',
    mood: 'think',
  },
  {
    id: 'arsip',
    route: '/learn/arsip/mengaduk',
    short: 'Arsip Gerakan',
    title: 'Arsip Gerakan perajin',
    see: 'Rekaman gerak perajin yang nyata. Tombol kerangka tangan menggambar pelacakan langsung di atas klip, di perangkatmu.',
    proves: 'Nira Motion Archive: pengetahuan di tangan perajin',
    tryIt: 'Tekan Tampilkan kerangka tangan, lalu Latih gerakan ini.',
    mood: 'wave',
  },
  {
    id: 'lab',
    route: '/learn/lab',
    short: 'Lab pengetahuan',
    title: 'Lab Pengetahuan',
    see: 'Eksperimen bebas di dapur dan peta istilah. Coba tanpa laru atau api terlalu besar dan lihat akibatnya.',
    proves: 'Pengetahuan yang bisa diuji dan dihubungkan',
    tryIt: 'Ketuk "Tanpa laru, didiamkan 5 jam".',
    mood: 'think',
  },
  {
    id: 'map',
    route: '/learn/peta',
    short: 'Peta desa',
    title: 'Peta desa (simulasi)',
    see: 'Tiga desa dengan kartu warisan. Lokasi tingkat desa saja, tanpa pelacakan lokasi nyata.',
    proves: 'Peta warisan yang menjaga privasi',
    tryIt: 'Ketuk satu penanda desa.',
    mood: 'wave',
  },
  {
    id: 'collection',
    route: '/learn/koleksi',
    short: 'Koleksi dan glosarium',
    title: 'Koleksi kartu dan glosarium',
    see: 'Kartu hanya dari rekaman yang disetujui kurator, lengkap dengan atribusi narasumber.',
    proves: 'Heritage Archive di bawah kendali komunitas',
    tryIt: 'Buka satu kartu atau tab Glosarium.',
    mood: 'cheer',
  },
  {
    id: 'mentor',
    route: '/mentor',
    short: 'Mentor membawa pengetahuan',
    title: 'Tata kelola: mentor',
    see: 'Mentor mengunggah rekaman dengan persetujuan narasumber, menandai teknik pada klip, dan memvalidasi pelajar. Rekaman baru otomatis Privat.',
    proves: 'Izin direkam sejak awal, validasi dilakukan manusia',
    tryIt: 'Buka tab Validasi dan validasi akun demo, lalu lihat lencana di Profil.',
    mood: 'wave',
    role: 'mentor',
  },
  {
    id: 'curator',
    route: '/kurator/REC-CLG-003',
    short: 'Kurator memutuskan',
    title: 'Tata kelola: kurator',
    see: 'Antrean tinjauan: izin kontributor, checklist enam poin, dan pilihan siapa yang boleh melihat (Privat, Pelajar, Publik QR).',
    proves: 'Pengetahuan dikendalikan komunitas, bukan diekstraksi',
    tryIt: 'Centang checklist, lalu coba pilih Publik. Lihat kenapa tidak bisa, dan setujui untuk Pelajar.',
    mood: 'think',
    role: 'curator',
  },
  {
    id: 'admin',
    route: '/admin',
    short: 'Admin dan batch QR',
    title: 'Admin: batch QR dan capaian',
    see: 'Capaian pilot, pembuat batch QR (hanya rekaman yang sudah disetujui), dan catatan audit semua keputusan.',
    proves: 'Jejak audit dan produk yang bisa dilacak',
    tryIt: 'Buka tab Audit, lalu Batch QR dan buat batch baru.',
    mood: 'cheer',
    role: 'admin',
  },
];
