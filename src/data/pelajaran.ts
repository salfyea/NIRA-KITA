import { t } from '../i18n';

/**
 * Isi kartu pelajaran per id (L-101 dst.). Hanya memuat hal yang sudah ada di sumber proyek
 * (rekaman, catatan proses di docs/proses-gula-kelapa.md, dan prinsip izin). Angka proses masih
 * menunggu validasi perajin dan ditulis sebagai rentang.
 */
export const getLessonBody = (id: string): string =>
  ({
    'L-101': t(
      'Kelapa di Cilongok banyak tumbuh di kebun rakyat berskala kecil. Dari mayang kelapa itulah nira disadap setiap hari, jadi kebun yang terawat berarti penghasilan keluarga penderes yang terjaga.',
      'Coconut in Cilongok mostly grows in small community groves. Sap is tapped from the coconut flower stalk every day, so a well-kept grove means a steady income for a tapper\'s family.',
    ),
    'L-102': t(
      'Pak Parmadi, penderes dengan 32 tahun pengalaman, menyebut pohon kelapa sebagai titipan alam untuk anak cucu. Dengarkan rekamannya lagi, lalu perhatikan kata-kata yang ia pilih untuk merawat pohon dan wadahnya.',
      'Pak Parmadi, a tapper with 32 years of experience, calls the coconut tree nature\'s trust for the next generations. Listen to the recording again and notice the words he chooses for caring for the tree and its container.',
    ),
    'L-103': t(
      'Pongkor menampung nira. Kain saring menahan kotoran. Wajan dan tungku memasaknya. Bathok (setengah tempurung kelapa) mencetak gula. Sebagian perajin juga memakai jubung untuk mengurangi buih. Setiap alat punya nama dan fungsi yang layak dijaga.',
      'The pongkor catches the sap. The filter cloth holds back dirt. The wok and stove cook it. The bathok (half a coconut shell) molds the sugar. Some artisans also use a jubung to reduce foam. Every tool has a name and a role worth keeping.',
    ),
    'L-104': t(
      'Pengetahuan hidup bila diteruskan. Tanyakan pada dirimu: alat atau istilah mana yang belum pernah kamu dengar sebelum modul ini, dan siapa di sekitarmu yang masih mengingatnya?',
      'Knowledge lives only when it is passed on. Ask yourself: which tool or term had you never heard before this module, and who around you still remembers it?',
    ),
    'L-201': t(
      'Nira ditampung di pongkor yang diberi laru alami (kapur dan cangkang manggis) agar tidak cepat asam, lalu disaring dengan kain bersih untuk membuang bunga kelapa, lebah, dan semut sebelum masuk wajan.',
      'Sap is kept in a pongkor treated with a natural preservative (lime and mangosteen rind) so it does not sour quickly, then filtered through a clean cloth to remove coconut flowers, bees, and ants before it enters the wok.',
    ),
    'L-202': t(
      'Perajin membaca gelembung didih, buih, dan aroma karamel, bukan termometer. Dalam rekaman Ibu Warsini, api dijaga jangan terlalu besar saat didihan sudah lembut dan harum. Pemasakan berakhir sekitar 105 sampai 110 °C menurut sebagian sumber; angka ini masih menunggu validasi perajin.',
      'Artisans read the boiling bubbles, the foam, and the caramel aroma, not a thermometer. In Ibu Warsini\'s recording, the fire is kept from getting too big once the boil is gentle and fragrant. Cooking ends at about 105 to 110 °C according to some sources; this figure still awaits artisan validation.',
    ),
    'L-203': t(
      'Pekatan terus diaduk selama dimasak, dan pengadukan manual yang tidak konsisten disebut sebagai salah satu masalah mutu. Saat suhunya turun sekitar 70 °C, gula dituang ke cetakan bathok lalu dibiarkan dingin dan mengeras.',
      'The reduced sap is stirred continuously while it cooks, and inconsistent manual stirring is named as a quality problem. When it has cooled to about 70 °C, the sugar is poured into bathok molds and left to cool and set.',
    ),
    'L-301': t(
      'Risiko di sekitar kebun dan dapur: tanah licin saat hujan, pohon yang tinggi, alat tajam, dan api. Karena itu di NIRA KITA pelajar tidak memanjat dan selalu belajar dari darat.',
      'Risks around the grove and kitchen: slippery ground in the rain, tall trees, sharp tools, and fire. That is why at NIRA KITA learners never climb and always learn from the ground.',
    ),
    'L-302': t(
      'Wajan, uap, dan gula yang baru dituang sangat panas. Pekatan dituang sekitar 70 °C atau lebih. Duduklah di jarak aman, dan jangan menyentuh wajan atau cetakan yang baru terisi.',
      'The wok, the steam, and freshly poured sugar are very hot. The syrup is poured at about 70 °C or more. Sit at a safe distance and never touch the wok or a freshly filled mold.',
    ),
    'L-303': t(
      'Kenali lebih dulu siapa yang harus dihubungi saat ada kejadian: mentor atau koordinator keselamatan. Jangan menolong sendiri di tempat yang berbahaya. Prosedur tanggap darurat desa disusun bersama mentor sebelum pilot berjalan.',
      'Know in advance who to contact when something happens: the mentor or the safety coordinator. Do not try to help alone in a dangerous place. The village emergency procedure is drawn up with the mentors before the pilot starts.',
    ),
    'L-401': t(
      'Nira menjadi gula cetak, dibeli dari kelompok perajin, dikemas dengan QR, lalu sampai ke pembeli. Setiap tahap bisa menambah nilai, dan bisa pula mengambilnya bila perajin tidak ikut menentukan harga.',
      'Sap becomes molded sugar, is bought from artisan groups, packed with a QR, and reaches the buyer. Every stage can add value, and can also take it away if the artisans have no say in the price.',
    ),
    'L-402': t(
      'Cerita perajin hanya tampil atas izin mereka, dengan atribusi sesuai pilihan mereka, dan setelah disetujui kurator. Makna yang dianggap sakral oleh komunitas tidak diubah demi pemasaran.',
      'An artisan\'s story is shown only with their permission, with attribution as they choose, and after curator approval. Meanings the community holds sacred are not changed for marketing.',
    ),
    'L-403': t(
      'Satu batch kemasan menaut ke desa asal dan hanya ke rekaman yang disetujui kurator dengan izin QR. Pembeli yang memindai melihat kisah, game, dan ke mana uang kemasan pergi.',
      'One packaging batch links to its village of origin and only to recordings the curator approved with QR permission. A buyer who scans sees the story, the game, and where the money from the pack goes.',
    ),
  } as Record<string, string>)[id] ?? '';
