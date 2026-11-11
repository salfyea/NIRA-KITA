import { t } from '../i18n';

export interface MiniQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/** Satu soal per bab. Semua berbasis darat; pelajar tidak pernah diminta memanjat. */
export const getQuiz = (slug: string): MiniQuiz | undefined =>
  ({
    'identitas-budaya-warisan-lokal': {
      question: t('Apa fungsi pongkor bagi penderes?', 'What is the pongkor used for by a tapper?'),
      options: [
        t('Wadah bambu untuk menampung nira', 'A bamboo container to catch the sap'),
        t('Wajan untuk memasak gula', 'A wok for cooking sugar'),
        t('Cetakan gula kelapa', 'A mold for coconut sugar'),
      ],
      correct: 0,
      explanation: t('Pongkor menampung nira. Menjaganya tetap bersih membantu nira pagi tetap segar.', 'The pongkor catches the sap. Keeping it clean helps the morning sap stay fresh.'),
    },
    'kerajinan-tradisional-transfer-pengetahuan': {
      question: t('Apa yang diperhatikan perajin saat nira dimasak di atas tungku?', 'What do artisans watch while the sap cooks on the stove?'),
      options: [t('Perubahan buih dan aroma karamel', 'Changes in the foam and the caramel aroma'), t('Warna kemasan', 'The colour of the packaging'), t('Jumlah penonton', 'The number of onlookers')],
      correct: 0,
      explanation: t('Buih dan aroma karamel membantu perajin mengenali kematangan nira.', 'Foam and caramel aroma help artisans recognise when the sap is ripe.'),
    },
    'keselamatan-kerja-manajemen-risiko': {
      question: t('Bagaimana pelajar mempelajari proses penyadapan di NIRA KITA?', 'How do learners study the tapping process at NIRA KITA?'),
      options: [
        t('Memanjat pohon bersama penderes', 'Climbing the tree with a tapper'),
        t('Dari darat, lewat cerita, rekaman, dan pendampingan', 'From the ground, through stories, recordings, and mentoring'),
        t('Sendirian di kebun saat hujan', 'Alone in the grove in the rain'),
      ],
      correct: 1,
      explanation: t('Seluruh pembelajaran berbasis darat. Pelajar tidak pernah diminta memanjat pohon.', 'All learning is ground-based. Learners are never asked to climb a tree.'),
    },
    'keberlanjutan-mata-pencaharian-kewirausahaan': {
      question: t('Apa gunanya kode QR di kemasan gula kelapa?', 'What is the QR code on the coconut sugar package for?'),
      options: [
        t('Membuka kisah perajin, hanya dengan izin narasumber', 'To open the artisan’s story, only with the source’s consent'),
        t('Menggantikan label harga', 'To replace the price label'),
        t('Melacak lokasi pembeli', 'To track the buyer’s location'),
      ],
      correct: 0,
      explanation: t('QR membuka Paspor Warisan: kisah dan asal produk, yang ditampilkan atas izin perajin.', 'The QR opens the Heritage Passport: the product’s story and origin, shown with the artisan’s permission.'),
    },
  } as Record<string, MiniQuiz>)[slug];

export const CHAPTER_XP = 60;
