export interface MiniQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/** Satu soal per bab. Semua berbasis darat; pelajar tidak pernah diminta memanjat. */
export const QUIZ_BY_SLUG: Record<string, MiniQuiz> = {
  'identitas-budaya-warisan-lokal': {
    question: 'Apa fungsi pongkor bagi penderes?',
    options: ['Wadah bambu untuk menampung nira', 'Wajan untuk memasak gula', 'Cetakan gula kelapa'],
    correct: 0,
    explanation: 'Pongkor menampung nira. Menjaganya tetap bersih membantu nira pagi tetap segar.',
  },
  'kerajinan-tradisional-transfer-pengetahuan': {
    question: 'Apa yang diperhatikan perajin saat nira dimasak di atas tungku?',
    options: ['Perubahan buih dan aroma karamel', 'Warna kemasan', 'Jumlah penonton'],
    correct: 0,
    explanation: 'Buih dan aroma karamel membantu perajin mengenali kematangan nira.',
  },
  'keselamatan-kerja-manajemen-risiko': {
    question: 'Bagaimana pelajar mempelajari proses penyadapan di NIRA KITA?',
    options: ['Memanjat pohon bersama penderes', 'Dari darat, lewat cerita, rekaman, dan pendampingan', 'Sendirian di kebun saat hujan'],
    correct: 1,
    explanation: 'Seluruh pembelajaran berbasis darat. Pelajar tidak pernah diminta memanjat pohon.',
  },
  'keberlanjutan-mata-pencaharian-kewirausahaan': {
    question: 'Apa gunanya kode QR di kemasan gula kelapa?',
    options: ['Membuka kisah perajin, hanya dengan izin narasumber', 'Menggantikan label harga', 'Melacak lokasi pembeli'],
    correct: 0,
    explanation: 'QR membuka Paspor Warisan: kisah dan asal produk, yang ditampilkan atas izin perajin.',
  },
};

export const CHAPTER_XP = 60;
