// KPSP (Kuesioner Pra Skrining Perkembangan) Data
// ASQ (Ages and Stages Questionnaires) - Adapted for Indonesian use

const KPSP_DATA = {
  // Format: age range in months, questions array
  // Each question has: id, questionText, category
  ageGroups: [
    {
      minAge: 0,
      maxAge: 3,
      label: "0 - 3 bulan",
      questions: [
        { id: 1, text: "Apakah bayi dapat merespons suara dengan menoleh atau menjadi tenang?", category: "Komunikasi" },
        { id: 2, text: "Apakah bayi menatap wajah orang tua saat diajak berbicara?", category: "Komunikasi" },
        { id: 3, text: "Apakah bayi dapat menggerakkan kepala dari sisi ke sisi saat telentang?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah bayi dapat mengangkat kepala saat tengkurap?", category: "Motorik Kasar" },
        { id: 5, text: "Apakah bayi membuka dan mengepalkan tangan?", category: "Motorik Halus" },
        { id: 6, text: "Apakah bayi dapat memegang jari orang dewasa?", category: "Motorik Halus" },
        { id: 7, text: "Apakah bayi tenang saat digendong atau dipeluk?", category: "Sosialisasi" },
        { id: 8, text: "Apakah bayi menangis saat lapar atau merasa tidak nyaman?", category: "Sosialisasi" },
        { id: 9, text: "Apakah bayi merespons sentuhan dengan tenang?", category: "Sosialisasi" },
        { id: 10, text: "Apakah bayi membuat suara selain menangis (mendengus, bergumam)?", category: "Komunikasi" }
      ]
    },
    {
      minAge: 4,
      maxAge: 6,
      label: "4 - 6 bulan",
      questions: [
        { id: 1, text: "Apakah bayi tertawa terbahak-bahak?", category: "Komunikasi" },
        { id: 2, text: "Apakah bayi menatap benda kecil seukuran kacang?", category: "Motorik Halus" },
        { id: 3, text: "Apakah bayi dapat memegang mainan dan membawanya ke mulut?", category: "Motorik Halus" },
        { id: 4, text: "Apakah bayi dapat mengangkat kepala dan dada saat tengkurap?", category: "Motorik Kasar" },
        { id: 5, text: "Apakah bayi dapat berguling dari telentang ke tengkurap?", category: "Motorik Kasar" },
        { id: 6, text: "Apakah bayi mencoba meraih benda yang ada di dekatnya?", category: "Motorik Halus" },
        { id: 7, text: "Apakah bayi mengenali wajah orang tua dan merespons berbeda dengan orang asing?", category: "Sosialisasi" },
        { id: 8, text: "Apakah bayi merespons saat namanya dipanggil?", category: "Komunikasi" },
        { id: 9, text: "Apakah bayi membuat suara berulang seperti 'ba-ba' atau 'da-da'?", category: "Komunikasi" },
        { id: 10, text: "Apakah bayi menikmati bermain 'cilukba' (peek-a-boo)?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 7,
      maxAge: 9,
      label: "7 - 9 bulan",
      questions: [
        { id: 1, text: "Apakah bayi dapat duduk tanpa ditopang?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah bayi merangkak (bergerak dengan perut di lantai)?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah bayi dapat memindahkan benda dari satu tangan ke tangan lain?", category: "Motorik Halus" },
        { id: 4, text: "Apakah bayi menggunakan jari telunjuk untuk menunjuk/menarik benda?", category: "Motorik Halus" },
        { id: 5, text: "Apakah bayi mencari benda yang dijatuhkan atau disembunyikan?", category: "Kognitif" },
        { id: 6, text: "Apakah bayi merespons nama sendiri?", category: "Komunikasi" },
        { id: 7, text: "Apakah bayi memahami kata 'tidak' atau 'jangan'?", category: "Komunikasi" },
        { id: 8, text: "Apakah bayi membuat suara 'mama' atau 'papa' secara spesifik?", category: "Komunikasi" },
        { id: 9, text: "Apakah bayi memainkan 'cilukba' atau balik-balikkan benda?", category: "Sosialisasi" },
        { id: 10, text: "Apakah bayi menunjukkan ketakutan terhadap orang asing?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 10,
      maxAge: 12,
      label: "10 - 12 bulan",
      questions: [
        { id: 1, text: "Apakah bayi dapat berdiri dengan berpegangan?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah bayi dapat berjalan dengan berpegangan pada perabot?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah bayi dapat berdiri sejenak tanpa berpegangan?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah bayi dapat meminum dari cangkir yang dipegangkan orang dewasa?", category: "Motorik Halus" },
        { id: 5, text: "Apakah bayi dapat menggenggam benda dengan ibu jari dan jari telunjuk (pincher grip)?", category: "Motorik Halus" },
        { id: 6, text: "Apakah bayi mengikuti instruksi sederhana seperti 'berikan kepada ayah'?", category: "Kognitif" },
        { id: 7, text: "Apakah bayi mengetuk-ngetuk atau memukulkan dua benda bersamaan?", category: "Kognitif" },
        { id: 8, text: "Apakah bayi mengucapkan setidaknya satu kata yang jelas?", category: "Komunikasi" },
        { id: 9, text: "Apakah bayi memberikan benda saat diminta?", category: "Sosialisasi" },
        { id: 10, text: "Apakah bayi menunjuk dengan jari untuk meminta sesuatu?", category: "Komunikasi" }
      ]
    },
    {
      minAge: 13,
      maxAge: 15,
      label: "13 - 15 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berjalan sendiri tanpa berpegangan?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berdiri sendiri tanpa berpegangan?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat menunduk untuk mengambil benda tanpa jatuh?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menumpuk 2 blok atau kubus?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat memegang sendiri makanan dan memakannya?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak menunjuk pada benda yang dikenal saat ditanya?", category: "Komunikasi" },
        { id: 7, text: "Apakah anak mengikuti perintah sederhana tanpa gerakan isyarat?", category: "Kognitif" },
        { id: 8, text: "Apakah anak mengucapkan 3 kata atau lebih selain 'mama'/'papa'?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak meniru aktivitas sehari-hari (misal: menelpon)?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjuk minat pada anak lain?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 16,
      maxAge: 18,
      label: "16 - 18 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berjalan mundur?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berjalan naik tangga dengan bantuan?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat berlari meskipun masih tersandung-sandung?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menumpuk 3-4 blok?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat memasukkan benda ke dalam wadah melalui lubang?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak dapat melepas sepatu, kaos kaki, atau topi?", category: "Motorik Halus" },
        { id: 7, text: "Apakah anak dapat menunjukkan 3 bagian tubuh saat diminta?", category: "Kognitif" },
        { id: 8, text: "Apakah anak mengucapkan 6 kata atau lebih?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak menunjukkan keinginan dengan menunjuk dan bersuara?", category: "Komunikasi" },
        { id: 10, text: "Apakah anak meniru pekerjaan rumah tangga (sapu-sapu, masak-masakan)?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 19,
      maxAge: 21,
      label: "19 - 21 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berjalan naik tangga dengan satu tangan dituntun?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat menendang bola tanpa berpegangan?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat berlari dengan stabil?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menumpuk 4-6 blok?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat membalik halaman buku satu per satu?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak dapat menggunakan sendok sendiri?", category: "Motorik Halus" },
        { id: 7, text: "Apakah anak dapat menunjukkan 5 bagian tubuh?", category: "Kognitif" },
        { id: 8, text: "Apakah anak dapat mengikuti perintah dua langkah (ambil bola dan berikan ke ibu)?", category: "Kognitif" },
        { id: 9, text: "Apakah anak mengenal nama diri sendiri saat melihat foto?", category: "Kognitif" },
        { id: 10, text: "Apakah anak bermain make-believe (berpura-pura) sederhana?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 22,
      maxAge: 24,
      label: "22 - 24 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat melompat di tempat dengan kedua kaki?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berjalan di atas garis lurus?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat melepas pakaian sederhana (celana longgar, kaos)?", category: "Motorik Halus" },
        { id: 4, text: "Apakah anak dapat menumpuk 6-8 blok?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat menggambar garis vertikal?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak mengucapkan kalimat dua kata ('mau minum', 'itu bola')?", category: "Komunikasi" },
        { id: 7, text: "Apakah anak menunjuk benda dalam gambar saat ditanya?", category: "Komunikasi" },
        { id: 8, text: "Apakah anak mengikuti instruksi tanpa contoh (letakkan di meja)?", category: "Kognitif" },
        { id: 9, text: "Apakah anak menunjukkan minat pada anak lain dan bermain di samping mereka?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjukkan perilaku mandiri (ingin makan sendiri)?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 25,
      maxAge: 30,
      label: "25 - 30 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat melompat dari anak tangga terbawah?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berdiri dengan satu kaki sejenak sambil berpegangan?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat melempar bola ke arah seseorang?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat meniru menggambar garis horizontal?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat memakai kaos atau celana sendiri dengan sedikit bantuan?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak mengucapkan kalimat 3-4 kata?", category: "Komunikasi" },
        { id: 7, text: "Apakah anak dapat menyebutkan namanya sendiri?", category: "Komunikasi" },
        { id: 8, text: "Apakah anak mengikuti perintah majemuk (ambil sepatu dan letakkan di kotak)?", category: "Kognitif" },
        { id: 9, text: "Apakah anak bermain make-believe yang lebih kompleks (masak-masakan lengkap)?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjukkan emosi seperti marah, sedih, gembira dengan tepat?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 31,
      maxAge: 36,
      label: "31 - 36 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berjalan naik tanggal bergantian kaki dengan bantuan?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berdiri dengan satu kaki 2-3 detik tanpa berpegangan?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat berlari tanpa terjatuh dan menghindari rintangan?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat meniru menggambar lingkaran?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat memakai pakaian sendiri (kaos, celana, sepatu)?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak berbicara dalam kalimat lengkap yang dapat dimengerti orang lain?", category: "Komunikasi" },
        { id: 7, text: "Apakah anak dapat menyebutkan warna dasar (merah, biru, kuning)?", category: "Kognitif" },
        { id: 8, text: "Apakah anak mengetahui konsep 'satu' dan 'banyak'?", category: "Kognitif" },
        { id: 9, text: "Apakah anak bermain bersama anak lain (berbagi, bergiliran)?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjukkan empati terhadap anak lain yang menangis?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 37,
      maxAge: 42,
      label: "37 - 42 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berjalan naik tangga bergantian kaki tanpa bantuan?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berdiri dengan satu kaki 5 detik atau lebih?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat melompat dengan satu kaki?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat meniru menggambar salib (+)?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat menggunakan gunting anak untuk memotong?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak menggunakan kata ganti 'saya', 'aku', 'kamu' dengan tepat?", category: "Komunikasi" },
        { id: 7, text: "Apakah anak dapat menceritakan pengalaman sederhana (apa yang dilakukan hari ini)?", category: "Komunikasi" },
        { id: 8, text: "Apakah anak mengenal konsep lawan (besar-kecil, panjang-pendek)?", category: "Kognitif" },
        { id: 9, text: "Apakah anak bermain make-believe dengan skenario yang lebih kompleks?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak dapat mengikuti aturan permainan sederhana?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 43,
      maxAge: 48,
      label: "43 - 48 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat melompat tali atau hopscotch?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat menangkap bola dengan kedua tangan?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat berjalan mundur dan menyamping dengan mudah?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menggambar orang sederhana (kepala, badan, kaki)?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat menulis beberapa huruf?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak dapat menghitung sampai 10?", category: "Kognitif" },
        { id: 7, text: "Apakah anak memahami konsep 'kemarin', 'hari ini', 'besok'?", category: "Kognitif" },
        { id: 8, text: "Apakah anak berbicara jelas dan dapat dimengerti orang asing?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak bermain kooperatif dengan anak lain?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjukkan kemampuan menunda keinginan?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 49,
      maxAge: 54,
      label: "49 - 54 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berdiri dengan satu kaki 8-10 detik?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat melompat dengan kaki rapat?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat berjalan di garis lurus dengan mata terbuka/tutup?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menggambar dengan detail (wajah dengan mata, hidung, mulut)?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat memotong mengikuti garis dengan gunting?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak mengetahui beberapa huruf dan angka?", category: "Kognitif" },
        { id: 7, text: "Apakah anak dapat mengelompokkan benda berdasarkan warna, bentuk, ukuran?", category: "Kognitif" },
        { id: 8, text: "Apakah anak bertanya tentang arti kata?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak memahami konsep berbagi dan bergiliran tanpa protes?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjukkan preferensi teman bermain tertentu?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 55,
      maxAge: 60,
      label: "55 - 60 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat melompat tali atau berjalan dengan satu kaki 5 langkah?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat menendang bola dengan arah yang dituju?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat berjalan di atas balok rendah atau beam?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menulis namanya sendiri?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat menggambar bentuk geometri sederhana (segitiga, persegi)?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak dapat menghitung benda dan menunjukkan jumlah dengan jari?", category: "Kognitif" },
        { id: 7, text: "Apakah anak memahami konsep terbesar/terkecil dan membandingkan?", category: "Kognitif" },
        { id: 8, text: "Apakah anak menggunakan kalimat majemuk dan kata sambung ('karena', 'tetapi')?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak memahami peraturan dan mengikuti instruksi kelompok?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak menunjukkan kemampuan memimpin dan mengikuti dalam bermain?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 61,
      maxAge: 66,
      label: "61 - 66 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat berjalan dengan tumit ke jari kaki?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat berlari cepat dan berbelok dengan kontrol?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat memantulkan dan menangkap bola?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menggambar pemandangan dengan beberapa objek?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat menyalin kata-kata sederhana?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak dapat membaca beberapa kata sederhana?", category: "Kognitif" },
        { id: 7, text: "Apakah anak memahami konsep waktu (pagi, siang, malam, jam)?", category: "Kognitif" },
        { id: 8, text: "Apakah anak bercerita dengan urutan awal, tengah, dan akhir?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak memahami perbedaan nyata dan khayalan?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak dapat bekerja sama dalam kelompok untuk tugas sederhana?", category: "Sosialisasi" }
      ]
    },
    {
      minAge: 67,
      maxAge: 72,
      label: "67 - 72 bulan",
      questions: [
        { id: 1, text: "Apakah anak dapat melompat tali dengan lancar?", category: "Motorik Kasar" },
        { id: 2, text: "Apakah anak dapat mengayuh sepeda roda dua?", category: "Motorik Kasar" },
        { id: 3, text: "Apakah anak dapat bermain olahraga dengan aturan sederhana?", category: "Motorik Kasar" },
        { id: 4, text: "Apakah anak dapat menulis huruf kecil dan huruf kapital?", category: "Motorik Halus" },
        { id: 5, text: "Apakah anak dapat menggambar dengan proporsi yang lebih baik?", category: "Motorik Halus" },
        { id: 6, text: "Apakah anak dapat membaca kalimat sederhana?", category: "Kognitif" },
        { id: 7, text: "Apakah anak dapat menjumlah dan mengurangkan angka 1-10?", category: "Kognitif" },
        { id: 8, text: "Apakah anak dapat mengungkapkan pendapat dan perasaan dengan kata-kata?", category: "Komunikasi" },
        { id: 9, text: "Apakah anak memahami konsep adil dan tidak adil?", category: "Sosialisasi" },
        { id: 10, text: "Apakah anak dapat menyelesaikan konflik dengan cara yang sesuai?", category: "Sosialisasi" }
      ]
    }
  ],

  // Interpretation criteria
  interpretation: {
    normal: {
      minYes: 9,
      label: "Sesuai Usia",
      description: "Perkembangan anak sesuai dengan usianya. Lanjutkan stimulasi dan pemantauan rutin.",
      advice: "Teruskan stimulasi sesuai usia. Pantau tumbuh kembang secara berkala."
    },
    suspect: {
      minYes: 7,
      maxYes: 8,
      label: "Meragukan",
      description: "Perkembangan anak perlu diperhatikan lebih lanjut. Mungkin perlu pemeriksaan lanjutan.",
      advice: "Ulangi skrining dalam 2 minggu. Jika masih meragukan, rujuk ke fasilitas kesehatan untuk evaluasi lebih lanjut."
    },
    abnormal: {
      maxYes: 6,
      label: "Menyimpang",
      description: "Perkembangan anak menunjukkan penyimpangan. Perlu evaluasi dan intervensi segera.",
      advice: "Segera rujuk ke fasilitas kesehatan untuk pemeriksaan dan intervensi dini."
    }
  }
};

// Get age group for given age in months
function getAgeGroup(age) {
  return KPSP_DATA.ageGroups.find(group => age >= group.minAge && age <= group.maxAge);
}

// Calculate result based on yes answers
function calculateKPSPResult(yesCount) {
  const interp = KPSP_DATA.interpretation;
  if (yesCount >= interp.normal.minYes) {
    return interp.normal;
  } else if (yesCount >= interp.suspect.minYes) {
    return interp.suspect;
  } else {
    return interp.abnormal;
  }
}

// Get category summary
function getCategorySummary(answers) {
  const categories = {};
  const ageGroup = getAgeGroup(parseInt($('#kpsp-age').val()) || 0);
  
  if (!ageGroup) return categories;

  ageGroup.questions.forEach((q, idx) => {
    if (!categories[q.category]) {
      categories[q.category] = { total: 0, yes: 0 };
    }
    categories[q.category].total++;
    if (answers[idx] === 'yes') {
      categories[q.category].yes++;
    }
  });

  return categories;
}
