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

export const GERAKAN: Gerakan[] = [
  {
    id: 'mengaduk',
    title: 'Mengaduk pekatan nira',
    step: 'Pemasakan',
    clip: '/media/mengaduk.mp4',
    see: 'Tangan perajin menggerakkan pengaduk kayu panjang di dalam wajan yang berisi pekatan nira mendidih. Uap tebal naik dan api kayu menyala di bawah tungku batu.',
    why: 'Pekatan terus diaduk selama dimasak. Studi menyebut pengadukan manual yang tidak konsisten sebagai salah satu masalah mutu, jadi ritme tangan adalah bagian dari keahlian.',
    practice: 'aduk',
  },
  {
    id: 'pengaduk-kayu',
    title: 'Pengaduk kayu di wajan',
    step: 'Pemasakan',
    clip: '/media/pengaduk-kayu.mp4',
    see: 'Pengaduk kayu panjang bersandar dan bergerak di wajan. Pekatan berwarna keemasan dengan buih dan uap, di atas tungku batu.',
    why: 'Warna pekatan makin cokelat dan buihnya berkurang seiring waktu memasak. Perajin membaca perubahan ini bersama aroma karamel.',
    practice: 'aduk',
  },
  {
    id: 'wajan-nira',
    title: 'Nira di wajan di atas tungku',
    step: 'Pemasakan',
    clip: '/media/wajan-nira.mp4',
    see: 'Wajan besar berisi nira di atas tungku batu. Batang kayu melintang di atas wajan dan sebuah mangkuk diletakkan di tepinya. Bara dan kayu bakar terlihat di mulut tungku.',
    why: 'Nira dimasak di wajan besar di atas tungku kayu. Untuk 25 sampai 30 liter nira, prosesnya memakan sekitar 4 sampai 5 jam.',
  },
  {
    id: 'pongkor',
    title: 'Pongkor berjajar di tanah',
    step: 'Penampungan nira',
    clip: '/media/pongkor.mp4',
    see: 'Deretan pongkor bambu berdiri di tanah, sebagian berisi cairan. Tali anyaman terlihat di antara wadah.',
    why: 'Pongkor adalah wadah bambu penampung nira. Penderes memberinya laru alami (kapur dan cangkang manggis) agar nira tidak cepat asam.',
    practice: 'tuang',
  },
  {
    id: 'pohon-kelapa',
    title: 'Pohon kelapa penghasil nira',
    step: 'Sumber nira',
    clip: '/media/pohon-kelapa.mp4',
    see: 'Pohon kelapa dilihat dari bawah, dari darat.',
    why: 'Nira disadap oleh penderes terlatih dari mayang kelapa. Di NIRA KITA pelajar tidak pernah memanjat; semua pembelajaran dilakukan dari darat.',
  },
];
