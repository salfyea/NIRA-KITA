import { t } from '../i18n';

/** Entri Arsip Gerakan: rekaman lapangan tim NIRA KITA. Deskripsi hanya memuat apa yang terlihat di klip. */
export interface Gerakan {
  id: string;
  title: string;
  step: string;
  clip: string;
  see: string;
  why: string;
  /** Tugas latihan terkait di bab Kerajinan, bila ada. */
  practice?: string;
}

export const getGerakan = (): Gerakan[] => [
  {
    id: 'mengaduk',
    title: t('Mengaduk pekatan nira', 'Stirring the reduced sap'),
    step: t('Pemasakan', 'Cooking'),
    clip: '/media/mengaduk.mp4',
    see: t(
      'Tangan perajin menggerakkan pengaduk kayu panjang di dalam wajan yang berisi pekatan nira mendidih. Uap tebal naik dan api kayu menyala di bawah tungku batu.',
      'An artisan’s hand moves a long wooden stirrer in a wok of boiling reduced sap. Thick steam rises and a wood fire burns under the stone stove.',
    ),
    why: t(
      'Pekatan terus diaduk selama dimasak. Studi menyebut pengadukan manual yang tidak konsisten sebagai salah satu masalah mutu, jadi ritme tangan adalah bagian dari keahlian.',
      'The sap is stirred continuously while it cooks. One study names inconsistent manual stirring as a quality problem, so the rhythm of the hand is part of the skill.',
    ),
    practice: 'aduk',
  },
  {
    id: 'pengaduk-kayu',
    title: t('Pengaduk kayu di wajan', 'The wooden stirrer in the wok'),
    step: t('Pemasakan', 'Cooking'),
    clip: '/media/pengaduk-kayu.mp4',
    see: t(
      'Pengaduk kayu panjang bersandar dan bergerak di wajan. Pekatan berwarna keemasan dengan buih dan uap, di atas tungku batu.',
      'A long wooden stirrer rests and moves in the wok. The golden reduced sap has foam and steam, over a stone stove.',
    ),
    why: t(
      'Warna pekatan makin cokelat dan buihnya berkurang seiring waktu memasak. Perajin membaca perubahan ini bersama aroma karamel.',
      'The sap darkens and the foam fades as cooking goes on. Artisans read these changes together with the caramel aroma.',
    ),
    practice: 'aduk',
  },
  {
    id: 'wajan-nira',
    title: t('Nira di wajan di atas tungku', 'Sap in the wok over the stove'),
    step: t('Pemasakan', 'Cooking'),
    clip: '/media/wajan-nira.mp4',
    see: t(
      'Wajan besar berisi nira di atas tungku batu. Batang kayu melintang di atas wajan dan sebuah mangkuk diletakkan di tepinya. Bara dan kayu bakar terlihat di mulut tungku.',
      'A large wok of sap on a stone stove. Wooden rods lie across the wok and a bowl rests on its edge. Embers and firewood show at the stove mouth.',
    ),
    why: t(
      'Nira dimasak di wajan besar di atas tungku kayu. Untuk 25 sampai 30 liter nira, prosesnya memakan sekitar 4 sampai 5 jam.',
      'Sap is cooked in a large wok over a wood stove. For 25 to 30 litres of sap, the process takes about 4 to 5 hours.',
    ),
  },
  {
    id: 'pongkor',
    title: t('Pongkor berjajar di tanah', 'Pongkor lined up on the ground'),
    step: t('Penampungan nira', 'Collecting the sap'),
    clip: '/media/pongkor.mp4',
    see: t(
      'Deretan pongkor bambu berdiri di tanah, sebagian berisi cairan. Tali anyaman terlihat di antara wadah.',
      'A row of bamboo pongkor stands on the ground, some holding liquid. Woven cord can be seen among the containers.',
    ),
    why: t(
      'Pongkor adalah wadah bambu penampung nira. Penderes memberinya laru alami (kapur dan cangkang manggis) agar nira tidak cepat asam.',
      'The pongkor is the bamboo container that catches the sap. Tappers add a natural preservative (laru: lime and mangosteen rind) so the sap does not turn sour quickly.',
    ),
    practice: 'tuang',
  },
  {
    id: 'pohon-kelapa',
    title: t('Pohon kelapa penghasil nira', 'The coconut tree that gives the sap'),
    step: t('Sumber nira', 'Source of the sap'),
    clip: '/media/pohon-kelapa.mp4',
    see: t('Pohon kelapa dilihat dari bawah, dari darat.', 'A coconut tree seen from below, from the ground.'),
    why: t(
      'Nira disadap oleh penderes terlatih dari mayang kelapa. Di NIRA KITA pelajar tidak pernah memanjat; semua pembelajaran dilakukan dari darat.',
      'Sap is tapped by trained tappers from the coconut flower stalk. At NIRA KITA learners never climb; all learning is done from the ground.',
    ),
  },
];
