/** Praktik gerak per modul. Isi pembelajaran ("mengapa") menaut ke materi dan sumber yang sudah ada. */
export type Task =
  | { kind: 'pose'; id: string; title: string; hint: string; why: string; pose: 'fist' | 'open' | 'pinch' | 'point' | 'thumbsUp' }
  | { kind: 'stir'; id: string; title: string; hint: string; why: string; laps: number }
  | { kind: 'pour'; id: string; title: string; hint: string; why: string; times: number }
  | { kind: 'judge'; id: string; title: string; scenario: string; answer: 'aman' | 'bahaya'; why: string };

export const PRAKTIK: Record<string, { intro: string; tasks: Task[] }> = {
  'identitas-budaya-warisan-lokal': {
    intro: 'Kenali alat dan istilahnya lewat gerak tangan, supaya kata-katanya melekat di ingatan.',
    tasks: [
      {
        kind: 'pose',
        id: 'tunjuk',
        pose: 'point',
        title: 'Tunjuk dan sebut',
        hint: 'Acungkan telunjuk, lalu sebutkan satu alat yang kamu kenal: pongkor, wajan, atau bathok.',
        why: 'Menyebut alat dengan nama aslinya adalah langkah pertama menjaga istilah lokal tetap hidup.',
      },
      {
        kind: 'pose',
        id: 'pegang-pongkor',
        pose: 'fist',
        title: 'Genggam seperti memegang pongkor',
        hint: 'Bayangkan memegang pongkor bambu: genggam dengan mantap, tetapi hati-hati.',
        why: 'Pongkor adalah wadah bambu penampung nira. Wadah yang bersih membantu nira tetap segar, jadi perajin merawatnya dengan cermat.',
      },
    ],
  },
  'kerajinan-tradisional-transfer-pengetahuan': {
    intro: 'Tiga gerakan dapur: menuang, menyaring, mengaduk. Kamera mengenali gerakan tanganmu tanpa menyimpan video.',
    tasks: [
      {
        kind: 'pour',
        id: 'tuang',
        times: 2,
        title: 'Tuang nira',
        hint: 'Genggam, lalu miringkan tanganmu ke samping seperti menuang, dan tegakkan lagi. Dua kali.',
        why: 'Nira dituang ke kain saring di atas wajan. Menuang perlahan memberi waktu kain menahan kotoran.',
      },
      {
        kind: 'pose',
        id: 'jepit-kotoran',
        pose: 'pinch',
        title: 'Jepit kotoran dari kain',
        hint: 'Temukan ujung jempol dan telunjuk seperti menjepit sesuatu yang kecil, tiga jari lain tetap lurus.',
        why: 'Bunga kelapa, lebah, dan semut yang tersangkut di kain dibuang supaya tidak ikut masuk wajan.',
      },
      {
        kind: 'stir',
        id: 'aduk',
        laps: 3,
        title: 'Mengaduk di wajan',
        hint: 'Genggam gagang pengaduk khayalan, lalu putar tanganmu melingkar. Tiga putaran.',
        why: 'Pekatan nira terus diaduk selama dimasak. Pengadukan manual yang tidak konsisten disebut sebagai salah satu masalah mutu, jadi ritme yang sabar itu keahlian.',
      },
    ],
  },
  'keselamatan-kerja-manajemen-risiko': {
    intro: 'Nilai tiap situasi dengan gerak tangan: jempol ke atas untuk AMAN, telapak terbuka (stop) untuk BAHAYA.',
    tasks: [
      {
        kind: 'judge',
        id: 's1',
        answer: 'bahaya',
        title: 'Situasi 1',
        scenario: 'Pelajar diminta memanjat pohon kelapa untuk melihat penyadapan dari dekat.',
        why: 'Bahaya. Kecelakaan kerja pada petani gula kelapa di Banyumas nyata. Karena itu di NIRA KITA pelajar tidak pernah memanjat; semua pembelajaran dilakukan dari darat.',
      },
      {
        kind: 'judge',
        id: 's2',
        answer: 'aman',
        title: 'Situasi 2',
        scenario: 'Pelajar duduk di jarak aman dari tungku sambil mendengarkan penjelasan perajin.',
        why: 'Aman. Mengamati dari jarak aman dengan pendampingan perajin adalah cara belajar yang kami pakai.',
      },
      {
        kind: 'judge',
        id: 's3',
        answer: 'bahaya',
        title: 'Situasi 3',
        scenario: 'Menyentuh gula yang baru dituang dari wajan karena penasaran.',
        why: 'Bahaya. Pekatan gula sangat panas saat dituang, sekitar 70 derajat Celsius atau lebih, dan bisa melukai kulit.',
      },
    ],
  },
  'keberlanjutan-mata-pencaharian-kewirausahaan': {
    intro: 'Putuskan dengan gerak tangan: jempol ke atas untuk BOLEH, telapak terbuka (stop) untuk TIDAK BOLEH.',
    tasks: [
      {
        kind: 'judge',
        id: 'k1',
        answer: 'bahaya',
        title: 'Situasi 1',
        scenario: 'Mencetak nama dan foto perajin di kemasan tanpa bertanya dulu kepadanya.',
        why: 'Tidak boleh. Nama dan cerita perajin hanya tampil atas izin mereka, dan dibatasi sesuai lingkup izin itu.',
      },
      {
        kind: 'judge',
        id: 'k2',
        answer: 'aman',
        title: 'Situasi 2',
        scenario: 'Menampilkan kisah perajin di halaman QR setelah ada izin dan persetujuan kurator.',
        why: 'Boleh. Inilah alur NIRA KITA: izin kontributor, lalu persetujuan kurator, baru tampil ke pembeli.',
      },
      {
        kind: 'judge',
        id: 'k3',
        answer: 'bahaya',
        title: 'Situasi 3',
        scenario: 'Mengubah cerita yang dianggap sakral oleh komunitas supaya lebih menarik dijual.',
        why: 'Tidak boleh. Makna yang dianggap sakral oleh komunitas tidak diubah demi pemasaran.',
      },
    ],
  },
};
