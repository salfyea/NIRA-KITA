import { AchievementBadge, CurriculumModule, HeritageRecord, Quest } from '../types/jejakNira';

/**
 * Data ilustratif untuk prototipe. Semua istilah lokal masih "menunggu validasi komunitas".
 * Data peran lain (submissions, batches, audit logs) akan ditambahkan saat panel Mentor, Kurator,
 * dan Admin dipindahkan dari prototipe Figma Make.
 */

export const INITIAL_HERITAGE_RECORDS: HeritageRecord[] = [
  {
    id: 'REC-CLG-001',
    title: 'Pongkor dan Etika Menjaga Kesegaran Nira Pagi',
    localTerm: 'Pongkor',
    category: 'Alat produksi',
    exploreCategory: 'Kenali Peralatan',
    shortDescription:
      'Wadah penampung tetesan nira kelapa yang dibersihkan dan diasapi dengan cermat sebelum dipasang pada mayang.',
    culturalExplanation:
      'Dalam tradisi penderes di Cilongok, kebersihan wadah penampung nira menentukan kualitas gula kelapa yang dihasilkan. Sebelum digunakan, wadah dibersihkan dengan air panas dan pengasapan alami agar nira tidak cepat asam. Data ini disajikan sebagai contoh istilah dan fungsi yang menunggu validasi komunitas Cilongok.',
    contributorName: 'Pak Parmadi',
    contributorRole: 'Penderes Senior & Mentor Komunitas (32 Tahun Pengalaman)',
    attributionPreference: 'Tampilkan Nama Lengkap',
    language: 'Bahasa Jawa Banyumasan & Bahasa Indonesia',
    location: 'Desa Pernasidi, Cilongok, Banyumas',
    duration: '03:45',
    imageUrl:
      'https://images.unsplash.com/photo-1758352512404-46d67c2f1fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    audioTranscript:
      '"Nek nira pingin apik lan wangi gulane, wadahe kudu resik tenan. Ora mung dibilas banyu, nanging dirumat kaya ngrumat panguripan keluarga..." (Terjemahan Terverifikasi: Jika ingin nira tetap baik dan harum gulanya, wadahnya harus benar-benar bersih. Tidak sekadar dibilas air, melainkan dirawat seperti menjaga kehidupan keluarga.)',
    audioDurationSec: 225,
    consent: { internalLearning: true, publicQrPage: true, promotionalMaterial: true },
    reviewStatus: 'Approved',
    visibility: 'public',
    submittedDate: '12 Mei 2026',
    publishedDate: '14 Mei 2026',
    reviewerName: 'Nadia Kusuma (Kurator Budaya)',
    relatedModuleSlug: 'identitas-budaya-warisan-lokal',
    isIllustrativePlaceholder: true,
    bookmarked: true,
  },
  {
    id: 'REC-CLG-002',
    title: 'Membaca Kematangan Karamel di Atas Tungku Kayu',
    localTerm: 'Kawah & Pengadukan Nira',
    category: 'Tahapan proses',
    exploreCategory: 'Proses Tradisional',
    shortDescription:
      'Teknik mengenali perubahan buih, aroma, dan kekentalan nira saat dimasak perlahan di dapur pengolahan.',
    culturalExplanation:
      'Pengolahan nira menjadi gula cetak maupun gula semut terjadi sepenuhnya di darat (dapur produksi). Para pengolah membaca gelembung didih dan warna karamel tanpa termometer digital, mengandalkan kepekaan indra yang diwariskan lintas generasi.',
    contributorName: 'Ibu Warsini',
    contributorRole: 'Pengolah Gula Kelapa & Mentor Dapur Tradisional',
    attributionPreference: 'Tampilkan Nama Lengkap',
    language: 'Bahasa Jawa Banyumasan',
    location: 'Desa Panembangan, Cilongok, Banyumas',
    duration: '04:20',
    imageUrl:
      'https://images.unsplash.com/photo-1682996055064-599bec77fc62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    audioTranscript:
      '"Yen umobe wis alus lan ambune wangi legi, geni kudu dijaga aja kebanteren. Yen kasep sedhela wae, rasane bisa malih..." (Terjemahan Terverifikasi: Ketika didihannya sudah lembut dan aromanya manis harum, nyala api harus dijaga jangan terlalu besar. Terlambat sedikit saja, rasanya bisa berubah.)',
    audioDurationSec: 260,
    consent: { internalLearning: true, publicQrPage: true, promotionalMaterial: false },
    reviewStatus: 'Approved',
    visibility: 'public',
    submittedDate: '10 Mei 2026',
    publishedDate: '11 Mei 2026',
    reviewerName: 'Nadia Kusuma (Kurator Budaya)',
    relatedModuleSlug: 'kerajinan-tradisional-transfer-pengetahuan',
    isIllustrativePlaceholder: true,
    bookmarked: false,
  },
  {
    id: 'REC-CLG-003',
    title: 'Doa Pagi dan Filosofi Merawat Pohon Kelapa',
    localTerm: 'Ngopeni Glugu',
    category: 'Cerita lisan',
    exploreCategory: 'Kisah Para Perajin',
    shortDescription:
      'Tutur lisan mengenai hubungan timbal balik antara penderes dengan alam dan pohon kelapa yang menghidupi desa.',
    culturalExplanation:
      'Bagi masyarakat penderes di lereng selatan Gunung Slamet, pohon kelapa bukan sekadar komoditas ekonomi, melainkan mitra hidup yang dirawat dengan penuh rasa hormat dan kehati-hatian.',
    contributorName: 'Pak Parmadi',
    contributorRole: 'Penderes Senior & Mentor Komunitas (32 Tahun Pengalaman)',
    attributionPreference: 'Tampilkan Nama Lengkap',
    language: 'Bahasa Jawa Banyumasan',
    location: 'Desa Pernasidi, Cilongok, Banyumas',
    duration: '05:12',
    imageUrl:
      'https://images.unsplash.com/photo-1658249292505-873ec637075d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    audioTranscript:
      '"Wit klapa kuwi yen disayang, diopeni resike, dheweke uga aweh nira sing bening. Awake dhewe mung njaga titipane alam kanggo anak putu." (Terjemahan Terverifikasi: Pohon kelapa itu jika disayangi dan dijaga kebersihannya, ia juga memberikan nira yang jernih. Kita hanya menjaga titipan alam untuk anak cucu.)',
    audioDurationSec: 312,
    consent: { internalLearning: true, publicQrPage: false, promotionalMaterial: false },
    reviewStatus: 'In Review',
    visibility: 'private',
    submittedDate: '18 Mei 2026',
    relatedModuleSlug: 'identitas-budaya-warisan-lokal',
    isIllustrativePlaceholder: true,
    bookmarked: false,
  },
  {
    id: 'REC-CLG-004',
    title: 'Pemeriksaan Alat Pelindung dan Lingkungan Dapur di Darat',
    localTerm: 'Mitigasi Risiko Dasar',
    category: 'Teknik tradisional',
    exploreCategory: 'Cerita Cilongok',
    shortDescription:
      'Panduan pengenalan bahaya kerja di area pengolahan darat serta kesadaran keselamatan bagi generasi muda.',
    culturalExplanation:
      'Dokumentasi ini menekankan pentingnya mengenali risiko panas tungku, uap nira mendidih, ketajaman alat pembersih, serta kondisi cuaca sebelum kegiatan produksi berlangsung. Dalam program percontohan NIRA KITA, seluruh pembelajaran peserta dilakukan 100% di darat.',
    contributorName: 'Pak Ahmad Riyadi',
    contributorRole: 'Koordinator Keamanan Kerja & Mentor Komunitas',
    attributionPreference: 'Tampilkan Nama Lengkap',
    language: 'Bahasa Indonesia',
    location: 'Desa Karangtengah, Cilongok, Banyumas',
    duration: '03:18',
    imageUrl:
      'https://images.unsplash.com/photo-1716441255371-0e2918c0f549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    audioTranscript:
      '"Keselamatan adalah syarat utama keberlanjutan tradisi. Generasi muda belajar mengenali alat dan menjaga keselamatan di dapur pengolahan darat terlebih dahulu."',
    audioDurationSec: 198,
    consent: { internalLearning: true, publicQrPage: false, promotionalMaterial: false },
    reviewStatus: 'Approved',
    visibility: 'learner',
    submittedDate: '08 Mei 2026',
    publishedDate: '09 Mei 2026',
    reviewerName: 'Nadia Kusuma (Kurator Budaya)',
    relatedModuleSlug: 'keselamatan-kerja-manajemen-risiko',
    isIllustrativePlaceholder: true,
    bookmarked: false,
  },
  {
    id: 'REC-CLG-005',
    title: 'Istilah Takaran Cetak dan Mutu Gula Semut Organik',
    localTerm: 'Gandhu & Kristalisasi',
    category: 'Istilah lokal',
    exploreCategory: 'Bahasa dan Istilah Lokal',
    shortDescription:
      'Kosakata lokal dalam menilai tekstur, kadar air, dan warna gula kelapa untuk koperasi desa.',
    culturalExplanation:
      'Memahami istilah mutu tradisional membantu generasi muda menjembatani pengetahuan perajin senior dengan standar kualitas pasar modern yang berkeadilan.',
    contributorName: 'Ibu Warsini',
    contributorRole: 'Pengolah Gula Kelapa & Mentor Dapur Tradisional',
    attributionPreference: 'Tampilkan Inisial Komunitas',
    language: 'Bahasa Jawa Banyumasan & Bahasa Indonesia',
    location: 'Desa Panembangan, Cilongok, Banyumas',
    duration: '02:50',
    imageUrl:
      'https://images.unsplash.com/photo-1568657704598-602700bd9694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    audioTranscript:
      '"Gula sing tua lan garing kuwi suwe simpane. Bocah enom saiki bisa nggawa crita iki supaya regane gula penderes luwih diajeni."',
    audioDurationSec: 170,
    consent: { internalLearning: true, publicQrPage: false, promotionalMaterial: false },
    reviewStatus: 'Revision Requested',
    visibility: 'private',
    submittedDate: '15 Mei 2026',
    reviewerName: 'Nadia Kusuma (Kurator Budaya)',
    revisionNotes:
      'Mohon lengkapi pelafalan dialek Banyumasan pada menit 01:20 dan konfirmasi ulang preferensi atribusi bersama Ibu Warsini.',
    relatedModuleSlug: 'keberlanjutan-mata-pencaharian-kewirausahaan',
    isIllustrativePlaceholder: true,
    bookmarked: false,
  },
];

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'MOD-01',
    number: 'MODUL 01',
    slug: 'identitas-budaya-warisan-lokal',
    title: 'Identitas Budaya & Warisan Lokal',
    englishTitle: 'Cultural Identity & Local Heritage',
    subtitle: 'Sejarah, bahasa lokal, peralatan tradisional, dan sejarah lisan penderes Cilongok.',
    description:
      'Menelusuri akar budaya penderes gula kelapa di Cilongok, memahami nilai ekologis kebun kelapa rakyat, serta mendengarkan langsung rekaman sejarah lisan yang telah disetujui komunitas.',
    visualDirection: 'Storytelling dokumenter, potret perajin, dan media arsip komunitas.',
    duration: '45 Menit',
    completionPercent: 75,
    unlocked: true,
    imageUrl:
      'https://images.unsplash.com/photo-1658249292505-873ec637075d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    objectives: [
      'Memahami sejarah sosial dan ekologis tradisi gula kelapa di Cilongok, Banyumas.',
      'Mengenali kosakata dan istilah lokal yang telah tervalidasi komunitas.',
      'Mengidentifikasi fungsi peralatan tradisional secara menghormati konteks budaya.',
    ],
    lessons: [
      { id: 'L-101', title: 'Lanskap Kebun Kelapa Lereng Selatan Gunung Slamet', duration: '10 mnt', type: 'Artikel Visual', completed: true },
      { id: 'L-102', title: 'Suara Perajin: Doa Pagi dan Etika Menjaga Alam', duration: '12 mnt', type: 'Dokumentasi Audio', completed: true },
      { id: 'L-103', title: 'Mengenal Peralatan Tradisional dan Fungsinya di Darat', duration: '15 mnt', type: 'Diagram Proses', completed: true },
      { id: 'L-104', title: 'Refleksi Makna Warisan Hidup Antargenerasi', duration: '8 mnt', type: 'Skenario Darat', completed: false },
    ],
    associatedQuestId: 'QUEST-01',
  },
  {
    id: 'MOD-02',
    number: 'MODUL 02',
    slug: 'kerajinan-tradisional-transfer-pengetahuan',
    title: 'Kerajinan Tradisional & Transfer Pengetahuan',
    englishTitle: 'Traditional Craftsmanship & Knowledge Transfer',
    subtitle: 'Demonstrasi proses pengolahan, tahapan produksi darat, dan wawasan perajin senior.',
    description:
      'Mempelajari urutan pengolahan nira menjadi gula cetak dan gula semut melalui diagram beranotasi, rekaman demonstrasi mentor, serta kesempatan observasi terpandu di dapur pengolahan.',
    visualDirection: 'Fotografi dokumenter dan diagram tahapan proses beranotasi.',
    duration: '60 Menit',
    completionPercent: 40,
    unlocked: true,
    imageUrl:
      'https://images.unsplash.com/photo-1682996055064-599bec77fc62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    objectives: [
      'Menjelaskan tahapan berurutan dari penyaringan nira hingga pencetakan gula kelapa.',
      'Memahami indikator visual dan aroma saat nira dimasak di atas tungku.',
      'Menghubungkan pengetahuan lisan mentor dengan praktik dokumentasi yang akurat.',
    ],
    lessons: [
      { id: 'L-201', title: 'Penyaringan Nira Segar dan Penilaian Kualitas Awal', duration: '15 mnt', type: 'Diagram Proses', completed: true },
      { id: 'L-202', title: 'Membaca Titik Didih dan Karamelisasi Bersama Ibu Warsini', duration: '20 mnt', type: 'Dokumentasi Audio', completed: false },
      { id: 'L-203', title: 'Teknik Pengadukan, Pencetakan, dan Pendinginan Alami', duration: '25 mnt', type: 'Artikel Visual', completed: false },
    ],
    associatedQuestId: 'QUEST-02',
  },
  {
    id: 'MOD-03',
    number: 'MODUL 03',
    slug: 'keselamatan-kerja-manajemen-risiko',
    title: 'Keselamatan Kerja & Manajemen Risiko',
    englishTitle: 'Occupational Safety & Risk Management',
    subtitle: 'Identifikasi bahaya, skenario keselamatan berbasis darat, dan prinsip kerja aman.',
    description:
      'Membangun kesadaran keselamatan kerja secara menyeluruh. Seluruh aktivitas dalam modul ini dirancang berbasis simulasi dan observasi di darat tanpa melibatkan pemanjatan pohon.',
    visualDirection: 'Diagram keselamatan kerja yang jelas dan ilustrasi edukatif praktis.',
    duration: '50 Menit',
    completionPercent: 25,
    unlocked: true,
    safetyNotice:
      'BATAS KESELAMATAN PROGRAM: Selama tahap percontohan, peserta belajar TIDAK memanjat pohon kelapa dan TIDAK memanen nira di ketinggian. Seluruh pembelajaran berlangsung di darat di bawah pendampingan mentor.',
    imageUrl:
      'https://images.unsplash.com/photo-1716441255371-0e2918c0f549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    objectives: [
      'Mengidentifikasi faktor risiko fisik dan cuaca dalam ekosistem kerja gula kelapa.',
      'Menerapkan prosedur keselamatan kerja di dapur pengolahan berbasis darat.',
      'Memahami kesiapsiagaan darurat dan perlengkapan pelindung dasar.',
    ],
    lessons: [
      { id: 'L-301', title: 'Peta Risiko Lingkungan Kebun dan Cuaca Hujan', duration: '15 mnt', type: 'Skenario Darat', completed: true },
      { id: 'L-302', title: 'Keselamatan Tungku, Suhu Tinggi, dan Ergonomi Dapur Produksi', duration: '20 mnt', type: 'Diagram Proses', completed: false },
      { id: 'L-303', title: 'Prosedur Tanggap Darurat Komunitas Desa', duration: '15 mnt', type: 'Artikel Visual', completed: false },
    ],
    associatedQuestId: 'QUEST-03',
  },
  {
    id: 'MOD-04',
    number: 'MODUL 04',
    slug: 'keberlanjutan-mata-pencaharian-kewirausahaan',
    title: 'Keberlanjutan Mata Pencaharian & Kewirausahaan Budaya',
    englishTitle: 'Livelihood Sustainability & Cultural Entrepreneurship',
    subtitle: 'Rantai nilai gula kelapa, ekonomi kolektif, dan narasi budaya beretika.',
    description:
      'Mengembangkan inovasi ekonomi berbasis komunitas melalui penceritaan budaya (cultural storytelling), kemasan bertanda QR paspor warisan, dan koperasi pemuda-penderes.',
    visualDirection: 'Infografis editorial modern dan studi kasus kewirausahaan komunitas.',
    duration: '55 Menit',
    completionPercent: 0,
    unlocked: true,
    imageUrl:
      'https://images.unsplash.com/photo-1568657704598-602700bd9694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    objectives: [
      'Memetakan rantai nilai gula kelapa dari kebun rakyat hingga konsumen sadar budaya.',
      'Menyusun narasi produk berbasis persetujuan (consent) perajin melalui QR Paspor Warisan.',
      'Merancang model kolaborasi antargenerasi yang meningkatkan nilai tambah ekonomi keluarga penderes.',
    ],
    lessons: [
      { id: 'L-401', title: 'Anatomi Rantai Nilai dan Ekonomi Gula Kelapa Cilongok', duration: '20 mnt', type: 'Diagram Proses', completed: false },
      { id: 'L-402', title: 'Etika Cultural Storytelling dan Hak Kepemilikan Cerita Komunitas', duration: '20 mnt', type: 'Artikel Visual', completed: false },
      { id: 'L-403', title: 'Merancang QR Batch Produk Bersama Koperasi Desa', duration: '15 mnt', type: 'Skenario Darat', completed: false },
    ],
    associatedQuestId: 'QUEST-04',
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'QUEST-01',
    title: 'The Forgotten Stories',
    indonesianSubtitle: 'Jejak Suara dan Peralatan Warisan Cilongok',
    moduleTitle: 'Identitas Budaya & Warisan Lokal',
    moduleSlug: 'identitas-budaya-warisan-lokal',
    description:
      'Temukan cerita di balik tradisi gula kelapa melalui pengalaman para praktisi, kenali istilah lokal yang telah ditinjau komunitas, dan refleksikan maknanya.',
    duration: '15 Menit',
    xpReward: 150,
    badgeReward: 'The Heritage Listener',
    imageUrl:
      'https://images.unsplash.com/photo-1758352512404-46d67c2f1fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    completed: false,
    objectives: [
      'Mendengarkan rekaman suara asli praktisi yang telah disetujui kurator.',
      'Memahami istilah lokal beserta konteks budayanya.',
      'Mengidentifikasi fungsi peralatan tradisional dalam aktivitas berbasis darat.',
      'Menuliskan refleksi pembelajaran untuk ditinjau oleh mentor.',
    ],
    steps: [
      { id: 'STEP-1', title: 'Dengarkan Rekaman Praktisi', description: 'Simak penuturan Pak Parmadi mengenai perawatan wadah nira.', type: 'audio', completed: false },
      { id: 'STEP-2', title: 'Pelajari Istilah Lokal', description: 'Tinjau entri glosarium Pongkor dan etika kebersihan alat.', type: 'terminology', completed: false },
      { id: 'STEP-3', title: 'Identifikasi Peralatan Tradisional', description: 'Pilih fungsi alat yang sesuai dengan dokumentasi komunitas.', type: 'tool_challenge', completed: false },
      { id: 'STEP-4', title: 'Kirim Refleksi Pembelajaran', description: 'Tuliskan pemahamanmu untuk divalidasi oleh mentor komunitas.', type: 'reflection', completed: false },
    ],
  },
  {
    id: 'QUEST-02',
    title: 'The Alchemy of Warm Sap',
    indonesianSubtitle: 'Membaca Tahapan Dapur Pengolahan Gula',
    moduleTitle: 'Kerajinan Tradisional & Transfer Pengetahuan',
    moduleSlug: 'kerajinan-tradisional-transfer-pengetahuan',
    description:
      'Pelajari bagaimana nira segar disaring dan dimasak perlahan menjadi karamel gula kelapa berkualitas di dapur pengolahan darat.',
    duration: '20 Menit',
    xpReward: 180,
    badgeReward: 'The Knowledge Keeper',
    imageUrl:
      'https://images.unsplash.com/photo-1682996055064-599bec77fc62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    completed: false,
    objectives: [
      'Mengurutkan tahapan pengolahan nira di dapur produksi darat.',
      'Mengenali tanda perubahan buih dan aroma karamel nira.',
    ],
    steps: [
      { id: 'STEP-2-1', title: 'Simak Rekaman Dapur Ibu Warsini', description: 'Dengarkan cara mengenali kematangan nira di atas tungku.', type: 'audio', completed: false },
      { id: 'STEP-2-2', title: 'Refleksi Tahapan Produksi', description: 'Jelaskan urutan pengolahan dari penyaringan hingga pencetakan.', type: 'reflection', completed: false },
    ],
  },
  {
    id: 'QUEST-03',
    title: 'Safe Ground, Safe Hands',
    indonesianSubtitle: 'Mengenali Bahaya dan Kerja Aman dari Darat',
    moduleTitle: 'Keselamatan Kerja & Manajemen Risiko',
    moduleSlug: 'keselamatan-kerja-manajemen-risiko',
    description:
      'Kenali bahaya di dapur pengolahan dan lingkungan kebun dari darat: tungku panas, lantai licin, dan alat pelindung. Pelajar tidak pernah diminta memanjat pohon.',
    duration: '15 Menit',
    xpReward: 160,
    badgeReward: 'Ground-Based Heritage Milestone',
    imageUrl: '',
    completed: false,
    objectives: [
      'Mengenali bahaya umum di dapur pengolahan dari darat.',
      'Memahami fungsi alat pelindung dan kebiasaan kerja aman.',
    ],
    steps: [
      { id: 'STEP-3-1', title: 'Baca Panduan Pengenalan Bahaya', description: 'Tinjau rekaman pemeriksaan alat pelindung dan lingkungan dapur.', type: 'audio', completed: false },
      { id: 'STEP-3-2', title: 'Kenali Tanda Bahaya di Darat', description: 'Pilih tanda bahaya yang sesuai pada skenario dapur dan halaman.', type: 'tool_challenge', completed: false },
      { id: 'STEP-3-3', title: 'Refleksi Kerja Aman', description: 'Tuliskan satu kebiasaan aman yang akan kamu ingat.', type: 'reflection', completed: false },
    ],
  },
  {
    id: 'QUEST-04',
    title: 'Stories With Consent',
    indonesianSubtitle: 'Menceritakan Warisan dengan Izin Perajin',
    moduleTitle: 'Keberlanjutan Mata Pencaharian & Kewirausahaan Budaya',
    moduleSlug: 'keberlanjutan-mata-pencaharian-kewirausahaan',
    description:
      'Pelajari mengapa kisah perajin hanya boleh dipakai atas izin, bagaimana atribusi ditulis, dan apa yang tampil di Paspor Warisan pada kemasan.',
    duration: '15 Menit',
    xpReward: 140,
    badgeReward: 'Ethical Storyteller',
    imageUrl: '',
    completed: false,
    objectives: [
      'Memahami persetujuan dan atribusi dalam dokumentasi budaya.',
      'Menjelaskan isi Paspor Warisan pada kemasan gula kelapa.',
    ],
    steps: [
      { id: 'STEP-4-1', title: 'Pelajari Prinsip Persetujuan', description: 'Baca bagaimana izin publik, izin pelajar, dan privat dibedakan.', type: 'terminology', completed: false },
      { id: 'STEP-4-2', title: 'Refleksi Kisah yang Beretika', description: 'Jelaskan mengapa nama perajin hanya tampil sesuai preferensinya.', type: 'reflection', completed: false },
    ],
  },
];

export const JOURNEY_LEVELS = [
  { level: 1, name: 'The Explorer', indonesianName: 'Penjelajah Jejak', minXp: 0, description: 'Membuka mata dan telinga terhadap lanskap budaya gula kelapa Cilongok.', requiresHumanValidation: false },
  { level: 2, name: 'The Heritage Listener', indonesianName: 'Pendengar Warisan', minXp: 400, description: 'Menyimak sejarah lisan, istilah lokal, dan filosofi perajin dengan penuh hormat.', requiresHumanValidation: false },
  { level: 3, name: 'The Knowledge Keeper', indonesianName: 'Penjaga Pengetahuan', minXp: 700, description: 'Mendokumentasikan urutan proses darat dan prinsip keselamatan bersama mentor.', requiresHumanValidation: true },
  { level: 4, name: 'The Apprentice', indonesianName: 'Cantrik Budaya (Darat)', minXp: 1100, description: 'Terlibat aktif dalam observasi dapur pengolahan dan kolaborasi terpandu.', requiresHumanValidation: true },
  { level: 5, name: 'The Culture Bearer', indonesianName: 'Pewaris Makna', minXp: 1600, description: 'Menghubungkan warisan perajin dengan masa depan komunitas yang berkelanjutan.', requiresHumanValidation: true },
];

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'BADGE-01',
    name: 'The Explorer',
    indonesianTitle: 'Langkah Pertama di Cilongok',
    description: 'Menyelesaikan orientasi ekosistem NIRA KITA dan memahami komitmen keselamatan pembelajaran berbasis darat.',
    moduleTitle: 'Identitas Budaya & Warisan Lokal',
    dateAchieved: '04 Mei 2026',
    validationType: 'Penyelesaian Digital',
    unlocked: true,
    levelNumber: 1,
  },
  {
    id: 'BADGE-02',
    name: 'The Heritage Listener',
    indonesianTitle: 'Pendengar Suara Perajin',
    description: 'Menyelesaikan misi The Forgotten Stories: menyimak rekaman asli praktisi, mempelajari glosarium lokal, dan mengidentifikasi fungsi alat tradisional.',
    moduleTitle: 'Identitas Budaya & Warisan Lokal',
    dateAchieved: undefined,
    validationType: 'Penyelesaian Digital',
    unlocked: false,
    levelNumber: 2,
  },
  {
    id: 'BADGE-03',
    name: 'Ground-Based Heritage Milestone',
    indonesianTitle: 'Kompetensi Pengenalan Alat & Proses Darat',
    description: 'Divalidasi langsung oleh mentor komunitas atas pemahaman fungsi peralatan tradisional, urutan pengolahan, dan prinsip keselamatan kerja di darat.',
    moduleTitle: 'Kerajinan Tradisional & Keselamatan Kerja',
    dateAchieved: undefined,
    validationType: 'Tervalidasi Mentor (Dasar Darat)',
    unlocked: false,
    levelNumber: 3,
  },
  {
    id: 'BADGE-04',
    name: 'Ethical Storyteller',
    indonesianTitle: 'Penutur Warisan Beretika',
    description: 'Memahami prinsip persetujuan komunitas (consent) dan atribusi perajin dalam dokumentasi budaya.',
    moduleTitle: 'Keberlanjutan Mata Pencaharian & Kewirausahaan Budaya',
    dateAchieved: undefined,
    validationType: 'Penyelesaian Digital',
    unlocked: false,
    levelNumber: 4,
  },
];
