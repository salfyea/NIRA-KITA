import { t } from '../i18n';

/** Praktik gerak per modul. Isi pembelajaran ("mengapa") menaut ke materi dan sumber yang sudah ada. */
export type Prop3D = 'pongkor' | 'wajan' | 'kain' | 'pohon' | 'tungku' | 'kemasan';

export type Task =
  | { kind: 'pose'; id: string; prop?: Prop3D; title: string; hint: string; why: string; pose: 'fist' | 'open' | 'pinch' | 'point' | 'thumbsUp' }
  | { kind: 'stir'; id: string; prop?: Prop3D; title: string; hint: string; why: string; laps: number }
  | { kind: 'pour'; id: string; prop?: Prop3D; title: string; hint: string; why: string; times: number }
  | { kind: 'judge'; id: string; prop?: Prop3D; title: string; scenario: string; answer: 'aman' | 'bahaya'; why: string };

export interface Praktik {
  /** 'gerak': dikenali kamera. 'skenario': kartu keputusan tanpa kamera (jawaban ya/tidak tidak butuh CV). */
  mode: 'gerak' | 'skenario';
  intro: string;
  yesLabel?: string;
  noLabel?: string;
  tasks: Task[];
}

/** Dihitung saat dipanggil supaya mengikuti bahasa aktif. */
export const getPraktik = (slug: string): Praktik | undefined => {
  const all: Record<string, Praktik> = {
    'identitas-budaya-warisan-lokal': {
      mode: 'gerak',
      intro: t('Kenali alat dan istilahnya lewat gerak tangan, supaya kata-katanya melekat di ingatan.', 'Get to know the tools and their names through hand movements, so the words stick in your memory.'),
      tasks: [
        {
          kind: 'pose',
          id: 'tunjuk',
          prop: 'wajan',
          pose: 'point',
          title: t('Tunjuk dan sebut', 'Point and name'),
          hint: t('Acungkan telunjuk, lalu sebutkan satu alat yang kamu kenal: pongkor, wajan, atau bathok.', 'Raise your index finger and name a tool you know: pongkor, wajan (wok), or bathok (shell mold).'),
          why: t('Menyebut alat dengan nama aslinya adalah langkah pertama menjaga istilah lokal tetap hidup.', 'Naming a tool by its real name is the first step in keeping local terms alive.'),
        },
        {
          kind: 'pose',
          id: 'pegang-pongkor',
          prop: 'pongkor',
          pose: 'fist',
          title: t('Genggam seperti memegang pongkor', 'Grip as if holding a pongkor'),
          hint: t('Bayangkan memegang pongkor bambu: genggam dengan mantap, tetapi hati-hati.', 'Imagine holding a bamboo pongkor: grip it firmly, but carefully.'),
          why: t(
            'Pongkor adalah wadah bambu penampung nira. Wadah yang bersih membantu nira tetap segar, jadi perajin merawatnya dengan cermat.',
            'The pongkor is the bamboo container that catches the sap. A clean container helps keep the sap fresh, so artisans care for it carefully.',
          ),
        },
      ],
    },
    'kerajinan-tradisional-transfer-pengetahuan': {
      mode: 'gerak',
      intro: t('Tiga gerakan dapur: menuang, menyaring, mengaduk. Kamera mengenali gerakan tanganmu tanpa menyimpan video.', 'Three kitchen movements: pouring, filtering, stirring. The camera recognises your hand movements without storing any video.'),
      tasks: [
        {
          kind: 'pour',
          id: 'tuang',
          prop: 'pongkor',
          times: 2,
          title: t('Tuang nira', 'Pour the sap'),
          hint: t('Genggam, lalu miringkan tanganmu ke samping seperti menuang, dan tegakkan lagi. Dua kali.', 'Make a fist, tilt your hand to the side as if pouring, then straighten it again. Twice.'),
          why: t('Nira dituang ke kain saring di atas wajan. Menuang perlahan memberi waktu kain menahan kotoran.', 'The sap is poured through a cloth over the wok. Pouring slowly gives the cloth time to catch the dirt.'),
        },
        {
          kind: 'pose',
          id: 'jepit-kotoran',
          prop: 'kain',
          pose: 'pinch',
          title: t('Jepit kotoran dari kain', 'Pinch debris off the cloth'),
          hint: t('Temukan ujung jempol dan telunjuk seperti menjepit sesuatu yang kecil, tiga jari lain tetap lurus.', 'Bring your thumb and index fingertips together as if pinching something tiny, the other three fingers straight.'),
          why: t('Bunga kelapa, lebah, dan semut yang tersangkut di kain dibuang supaya tidak ikut masuk wajan.', 'Coconut flowers, bees, and ants caught in the cloth are removed so they do not end up in the wok.'),
        },
        {
          kind: 'stir',
          id: 'aduk',
          prop: 'wajan',
          laps: 3,
          title: t('Mengaduk di wajan', 'Stirring in the wok'),
          hint: t('Genggam gagang pengaduk khayalan, lalu putar tanganmu melingkar. Tiga putaran.', 'Grip an imaginary stirring handle, then move your hand in circles. Three rounds.'),
          why: t(
            'Pekatan nira terus diaduk selama dimasak. Pengadukan manual yang tidak konsisten disebut sebagai salah satu masalah mutu, jadi ritme yang sabar itu keahlian.',
            'The reduced sap is stirred continuously while it cooks. Inconsistent manual stirring is named as a quality problem, so a patient rhythm is a skill.',
          ),
        },
      ],
    },
    'keselamatan-kerja-manajemen-risiko': {
      mode: 'skenario',
      yesLabel: t('Aman', 'Safe'),
      noLabel: t('Bahaya', 'Unsafe'),
      intro: t('Baca situasinya, lalu putuskan: aman atau bahaya?', 'Read the situation, then decide: safe or unsafe?'),
      tasks: [
        {
          kind: 'judge',
          id: 's1',
          prop: 'pohon',
          answer: 'bahaya',
          title: t('Situasi 1', 'Situation 1'),
          scenario: t('Pelajar diminta memanjat pohon kelapa untuk melihat penyadapan dari dekat.', 'A learner is asked to climb a coconut tree to watch the tapping up close.'),
          why: t(
            'Bahaya. Kecelakaan kerja pada petani gula kelapa di Banyumas nyata. Karena itu di NIRA KITA pelajar tidak pernah memanjat; semua pembelajaran dilakukan dari darat.',
            'Unsafe. Work accidents among coconut sugar farmers in Banyumas are real. That is why NIRA KITA learners never climb; all learning is done from the ground.',
          ),
        },
        {
          kind: 'judge',
          id: 's2',
          prop: 'tungku',
          answer: 'aman',
          title: t('Situasi 2', 'Situation 2'),
          scenario: t('Pelajar duduk di jarak aman dari tungku sambil mendengarkan penjelasan perajin.', 'A learner sits at a safe distance from the stove while listening to the artisan explain.'),
          why: t('Aman. Mengamati dari jarak aman dengan pendampingan perajin adalah cara belajar yang kami pakai.', 'Safe. Observing from a safe distance with an artisan’s guidance is the way we learn.'),
        },
        {
          kind: 'judge',
          id: 's3',
          prop: 'tungku',
          answer: 'bahaya',
          title: t('Situasi 3', 'Situation 3'),
          scenario: t('Menyentuh gula yang baru dituang dari wajan karena penasaran.', 'Touching freshly poured sugar from the wok out of curiosity.'),
          why: t('Bahaya. Pekatan gula sangat panas saat dituang, sekitar 70 derajat Celsius atau lebih, dan bisa melukai kulit.', 'Unsafe. The sugar syrup is very hot when poured, around 70 degrees Celsius or more, and can burn skin.'),
        },
      ],
    },
    'keberlanjutan-mata-pencaharian-kewirausahaan': {
      mode: 'skenario',
      yesLabel: t('Boleh', 'Allowed'),
      noLabel: t('Tidak boleh', 'Not allowed'),
      intro: t('Baca situasinya, lalu putuskan: boleh atau tidak boleh?', 'Read the situation, then decide: allowed or not allowed?'),
      tasks: [
        {
          kind: 'judge',
          id: 'k1',
          prop: 'kemasan',
          answer: 'bahaya',
          title: t('Situasi 1', 'Situation 1'),
          scenario: t('Mencetak nama dan foto perajin di kemasan tanpa bertanya dulu kepadanya.', 'Printing an artisan’s name and photo on the package without asking them first.'),
          why: t('Tidak boleh. Nama dan cerita perajin hanya tampil atas izin mereka, dan dibatasi sesuai lingkup izin itu.', 'Not allowed. An artisan’s name and story appear only with their permission, and only within the scope of that permission.'),
        },
        {
          kind: 'judge',
          id: 'k2',
          prop: 'kemasan',
          answer: 'aman',
          title: t('Situasi 2', 'Situation 2'),
          scenario: t('Menampilkan kisah perajin di halaman QR setelah ada izin dan persetujuan kurator.', 'Showing an artisan’s story on the QR page after permission and curator approval.'),
          why: t('Boleh. Inilah alur NIRA KITA: izin kontributor, lalu persetujuan kurator, baru tampil ke pembeli.', 'Allowed. This is the NIRA KITA flow: contributor consent, then curator approval, and only then shown to buyers.'),
        },
        {
          kind: 'judge',
          id: 'k3',
          prop: 'kemasan',
          answer: 'bahaya',
          title: t('Situasi 3', 'Situation 3'),
          scenario: t('Mengubah cerita yang dianggap sakral oleh komunitas supaya lebih menarik dijual.', 'Altering a story the community considers sacred so it sells better.'),
          why: t('Tidak boleh. Makna yang dianggap sakral oleh komunitas tidak diubah demi pemasaran.', 'Not allowed. Meanings the community considers sacred are not changed for marketing.'),
        },
      ],
    },
  };
  return all[slug];
};
