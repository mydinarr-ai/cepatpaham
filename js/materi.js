/* CepatPaham - materi mode Belajar (Konsep -> Contoh -> Coba sendiri -> Kenapa ini bekerja).
   Contoh diambil dari generator dengan seed tetap, jadi langkahnya selalu benar.
   Format: { konsep:[{judul, teks}], contoh:{level, seed}, cobaMaks, kenapa } */
(function (G) {
  'use strict';
  const CP = (G.CP = G.CP || {});
  CP.MATERI = {
    'VII-1': {
      konsep: [
        { judul: 'Bilangan bulat di garis bilangan', teks: 'Bilangan bulat: …, −3, −2, −1, 0, 1, 2, 3, …\nDi garis bilangan, makin ke kanan makin besar. Jadi −3 lebih besar dari −8, dan semua bilangan negatif lebih kecil dari 0.' },
        { judul: 'Menjumlah dan mengurang', teks: 'Tanda sama: jumlahkan, tanda tetap. Contoh −4 + (−5) = −9.\nTanda berbeda: kurangkan, lalu ikuti tanda bilangan yang nilai mutlaknya lebih besar. Contoh −7 + 12 = 5.\nMengurangi sama dengan menambah lawannya: 15 − (−6) = 15 + 6 = 21.' },
        { judul: 'Kali, bagi, urutan, FPB, KPK', teks: 'Tanda sama → hasil positif. Tanda berbeda → hasil negatif. Contoh −3 × (−4) = 12 dan −36 ÷ 9 = −4.\nUrutan operasi: kurung dulu, lalu × dan ÷, terakhir + dan −.\nFPB = faktor persekutuan terbesar. KPK = kelipatan persekutuan terkecil. Keduanya dicari lewat faktor prima.' }
      ],
      contoh: { level: 2, seed: 11 }, cobaMaks: 3,
      kenapa: 'Mengurangi bilangan negatif sama dengan menambah, karena menghapus sebuah "utang" membuat kekayaanmu bertambah.'
    },
    'VII-2': {
      konsep: [
        { judul: 'Pecahan senilai', teks: 'Mengalikan atau membagi pembilang dan penyebut dengan bilangan yang sama tidak mengubah nilai.\nContoh 18/24: bagi keduanya dengan FPB 6, jadi 3/4 (bentuk paling sederhana).' },
        { judul: 'Pecahan, desimal, persen', teks: 'Persen artinya per seratus. 3/4 = 75/100 = 0,75 = 75%.\nUntuk mengubah pecahan ke desimal, buat penyebut 10, 100, atau 1000.' },
        { judul: 'Operasi pecahan', teks: 'Tambah dan kurang: samakan penyebut dulu (pakai KPK). 2/3 + 1/4 = 8/12 + 3/12 = 11/12.\nKali: pembilang × pembilang, penyebut × penyebut. Bagi: kalikan dengan kebalikan, 1/2 ÷ 1/4 = 1/2 × 4 = 2.\nMembandingkan pecahan: samakan penyebut, lalu bandingkan pembilangnya.' }
      ],
      contoh: { level: 4, seed: 23 }, cobaMaks: 3,
      kenapa: 'Pecahan hanya bisa dijumlahkan jika potongannya sama besar, makanya penyebut harus disamakan lebih dulu.'
    },
    'VII-3': {
      konsep: [
        { judul: 'Rasio', teks: 'Rasio membandingkan dua besaran. 12 : 18 disederhanakan dengan membagi keduanya dengan FPB 6, hasilnya 2 : 3.\nSatuan harus sama sebelum dibandingkan.' },
        { judul: 'Membagi menurut rasio dan skala', teks: 'Total 40 dengan rasio 2 : 3: jumlah bagian 5, satu bagian = 40 ÷ 5 = 8, jadi 16 dan 24.\nSkala 1 : 200.000 artinya 1 cm di peta = 200.000 cm = 2 km sebenarnya.' },
        { judul: 'Senilai dan berbalik nilai', teks: 'Senilai: makin banyak, makin besar hasilnya. Cari nilai satuan dulu. 3 buku Rp15.000 → 1 buku Rp5.000.\nBerbalik nilai: hasil kali tetap. 6 pekerja × 10 hari = 60; dengan 4 pekerja, 60 ÷ 4 = 15 hari.' }
      ],
      contoh: { level: 2, seed: 7 }, cobaMaks: 3,
      kenapa: 'Pada perbandingan berbalik nilai, total "beban kerja" tetap sama, jadi kalau pekerja berkurang, waktunya bertambah.'
    },
    'X-1': {
      konsep: [
        { judul: 'Eksponen', teks: 'aⁿ berarti a dikali dirinya sendiri n kali. 2⁵ = 2 × 2 × 2 × 2 × 2 = 32.\nSemua bilangan tak nol yang dipangkatkan 0 bernilai 1: 5⁰ = 1.' },
        { judul: 'Sifat pangkat', teks: 'Dikali, pangkat dijumlahkan: 2³ × 2⁴ = 2⁷.\nDibagi, pangkat dikurangkan: 3⁶ ÷ 3⁴ = 3².\nPangkat dari pangkat, dikalikan: (3²)³ = 3⁶.\nPangkat negatif: 2⁻³ = 1/2³ = 1/8.' },
        { judul: 'Bentuk akar', teks: 'Sederhanakan dengan mencari faktor kuadrat sempurna: √72 = √(36 × 2) = 6√2.\nAkar sejenis boleh dijumlah: √12 + √27 = 2√3 + 3√3 = 5√3.\nMerasionalkan penyebut: 6/√3 = 6√3/3 = 2√3.' }
      ],
      contoh: { level: 4, seed: 5 }, cobaMaks: 3,
      kenapa: 'Pangkat dijumlahkan saat dikali karena kita hanya menghitung total faktor yang sama: 2³ × 2⁴ punya 3 + 4 = 7 faktor 2.'
    },
    'X-2': {
      konsep: [
        { judul: 'Barisan aritmetika dan geometri', teks: 'Aritmetika: selisih tiap suku tetap (beda b). Uₙ = a + (n − 1)b.\nGeometri: perbandingan tiap suku tetap (rasio r). Uₙ = a × rⁿ⁻¹.\nContoh 3, 7, 11, 15, … beda 4, suku berikutnya 19.' },
        { judul: 'Deret aritmetika', teks: 'Deret adalah jumlah suku-suku barisan.\nSₙ = n/2 × (a + Uₙ).\nContoh 3 + 7 + 11 + … (10 suku): U₁₀ = 39, S₁₀ = 5 × (3 + 39) = 210.' },
        { judul: 'Bunga tunggal dan majemuk', teks: 'Bunga tunggal: bunga selalu dihitung dari modal awal. Rp1.000.000, 5% per tahun, 3 tahun → bunga Rp150.000, total Rp1.150.000.\nBunga majemuk: bunga dihitung dari saldo tahun sebelumnya. Rp1.000.000, 10%, 2 tahun → 1.100.000 → 1.210.000.' }
      ],
      contoh: { level: 4, seed: 3 }, cobaMaks: 3,
      kenapa: 'Rumus Sₙ bekerja karena suku pertama dan terakhir, suku kedua dan kedua dari belakang, dan seterusnya selalu berjumlah sama; ada n/2 pasangan.'
    },
    'VII-4': {
      konsep: [
        { judul: 'Variabel, suku, koefisien', teks: 'Bentuk aljabar memakai huruf (variabel) untuk bilangan yang belum diketahui. Pada 3x + 5: 3 adalah koefisien, x variabel, 5 konstanta.\nMenghitung nilai: ganti variabel dengan bilangan. Jika x = 4, maka 3x + 5 = 3 × 4 + 5 = 17.' },
        { judul: 'Suku sejenis dan perkalian', teks: 'Suku sejenis punya variabel yang sama dan boleh dijumlahkan: 3x + 5y − x + 2y = 2x + 7y.\nSifat distributif: 3(2x − 4) = 6x − 12.\nDua kurung: (x + 3)(x + 4) = x² + 4x + 3x + 12 = x² + 7x + 12.' },
        { judul: 'Persamaan dan pertidaksamaan', teks: 'Persamaan: lakukan hal yang sama di kedua ruas. 3x + 5 = 20 → 3x = 15 → x = 5.\nPertidaksamaan diselesaikan sama, tetapi jika dikali atau dibagi bilangan negatif, tanda dibalik: −2x < 6 → x > −3.' }
      ],
      contoh: { level: 4, seed: 3 }, cobaMaks: 3,
      kenapa: 'Persamaan seperti timbangan seimbang: jika kedua sisi ditambah, dikurangi, atau dikali hal yang sama, timbangan tetap seimbang. Dikali bilangan negatif membalik urutan, itu sebabnya tanda pertidaksamaan dibalik.'
    },
    'VII-5': {
      konsep: [
        { judul: 'Bangun sebangun', teks: 'Dua bangun sebangun jika bentuknya sama (sudut-sudut bersesuaian sama besar) dan sisi-sisi bersesuaian berbanding sama.\nContoh: persegi panjang 4 × 6 sebangun dengan 6 × 9, faktor skala 6/4 = 9/6 = 3/2.' },
        { judul: 'Segitiga sebangun', teks: 'Pada segitiga sebangun, perbandingan sisi bersesuaian sama.\nBenda tegak dan bayangannya pada waktu yang sama membentuk segitiga yang sebangun, jadi tinggi : bayangan sama.\nJika DE sejajar BC pada segitiga ABC, maka AD/AB = DE/BC.' },
        { judul: 'Keliling dan luas', teks: 'Jika perbandingan sisi k, maka perbandingan keliling juga k, sedangkan perbandingan luas k².\nContoh sisi 2 : 3 → luas 4 : 9.' }
      ],
      contoh: { level: 3, seed: 5 }, cobaMaks: 3,
      kenapa: 'Memperbesar gambar dengan faktor k memperpanjang semua sisi k kali, sehingga keliling ikut k kali. Luas adalah panjang kali lebar, jadi bertambah k × k = k² kali.'
    },
    'VII-6': {
      konsep: [
        { judul: 'Membaca diagram', teks: 'Diagram batang menunjukkan nilai tiap kategori lewat tinggi batang. Diagram lingkaran menunjukkan bagian dari keseluruhan lewat sudut juring (total 360°).\nBanyak data pada juring = sudut ÷ 360 × total.' },
        { judul: 'Mean, median, modus', teks: 'Mean = jumlah data ÷ banyak data.\nMedian = nilai tengah setelah data diurutkan (jika genap, rata-rata dua nilai tengah).\nModus = nilai yang paling sering muncul.' },
        { judul: 'Rata-rata dari tabel dan gabungan', teks: 'Tabel frekuensi: rata-rata = jumlah (nilai × frekuensi) ÷ jumlah frekuensi.\nRata-rata gabungan = jumlah seluruh nilai ÷ banyak seluruh data, bukan rata-rata dari dua rata-rata.' }
      ],
      contoh: { level: 4, seed: 2 }, cobaMaks: 3,
      kenapa: 'Rata-rata gabungan memperhitungkan banyak data tiap kelompok (bobot). Kelompok yang lebih banyak anggotanya lebih besar pengaruhnya pada rata-rata gabungan.'
    },
    'X-3': {
      konsep: [
        { judul: 'Sinus, kosinus, tangen', teks: 'Pada segitiga siku-siku dengan sudut lancip α:\nsin α = depan / miring, cos α = samping / miring, tan α = depan / samping.\nSisi miring adalah sisi di depan sudut siku-siku.' },
        { judul: 'Sudut istimewa', teks: 'sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2.\ncos 30° = √3/2, cos 45° = √2/2, cos 60° = 1/2.\ntan 30° = √3/3, tan 45° = 1, tan 60° = √3.' },
        { judul: 'Sudut elevasi', teks: 'Sudut elevasi adalah sudut antara garis pandang ke atas dan garis mendatar.\nTinggi = jarak × tan sudut elevasi. Tripel Pythagoras 3-4-5, 5-12-13, 8-15-17 membantu mencari sisi ketiga.' }
      ],
      contoh: { level: 3, seed: 4 }, cobaMaks: 3,
      kenapa: 'Perbandingan sisi pada segitiga siku-siku hanya bergantung pada besar sudut, bukan ukuran segitiganya, karena segitiga dengan sudut yang sama selalu sebangun.'
    },
    'X-4': {
      konsep: [
        { judul: 'Sistem dua persamaan', teks: 'Cari x dan y yang memenuhi dua persamaan sekaligus.\nEliminasi: samakan koefisien salah satu variabel lalu kurangkan atau jumlahkan persamaan agar variabel itu hilang. Substitusi hasilnya ke persamaan lain.' },
        { judul: 'Soal cerita', teks: 'Beri nama pada hal yang dicari, misalnya x = harga 1 pensil dan y = harga 1 buku. Tulis dua persamaan dari dua kalimat, lalu selesaikan.' },
        { judul: 'Pertidaksamaan dan daerah layak', teks: 'Titik memenuhi ax + by ≤ c jika setelah disubstitusi hasilnya ≤ c. Daerah yang memenuhi beberapa pertidaksamaan sekaligus disebut daerah penyelesaian. Nilai maksimum bentuk objektif terjadi di titik pojok daerah itu.' }
      ],
      contoh: { level: 2, seed: 8 }, cobaMaks: 3,
      kenapa: 'Eliminasi bekerja karena menjumlahkan atau mengurangkan dua persamaan yang benar menghasilkan persamaan yang juga benar, dan kita pilih operasi yang menghilangkan satu variabel.'
    },
    'X-5': {
      konsep: [
        { judul: 'Akar dengan pemfaktoran', teks: 'Persamaan x² − 7x + 12 = 0: cari dua bilangan yang berjumlah 7 dan berhasil kali 12, yaitu 3 dan 4. Maka (x − 3)(x − 4) = 0, x = 3 atau x = 4.\nJika a bukan 1, bagi seluruh persamaan dengan a.' },
        { judul: 'Diskriminan', teks: 'Untuk ax² + bx + c = 0, diskriminan D = b² − 4ac.\nD > 0: dua akar berbeda. D = 0: satu akar kembar. D < 0: tidak ada akar real.' },
        { judul: 'Grafik parabola', teks: 'Sumbu simetri x = −b / (2a). Titik puncak (x, f(x)) pada sumbu itu.\nJika a > 0 terbuka ke atas (puncak adalah nilai minimum). Jika a < 0 terbuka ke bawah (puncak adalah nilai maksimum).' }
      ],
      contoh: { level: 4, seed: 6 }, cobaMaks: 3,
      kenapa: 'Hasil kali dua bilangan sama dengan nol hanya jika salah satunya nol. Karena itu (x − 3)(x − 4) = 0 berarti x − 3 = 0 atau x − 4 = 0.'
    },
    'X-6': {
      konsep: [
        { judul: 'Histogram dan data berkelompok', teks: 'Data dikelompokkan dalam kelas, misalnya 41-50, 51-60. Tinggi batang histogram adalah frekuensi kelas.\nRata-rata data berkelompok memakai titik tengah kelas: jumlah (f × titik tengah) ÷ jumlah f.' },
        { judul: 'Kuartil', teks: 'Urutkan data. Q2 = median. Q1 = median setengah bawah, Q3 = median setengah atas (jika banyak data ganjil, data tengah tidak ikut).\nJangkauan = maks − min. Jangkauan antarkuartil = Q3 − Q1.' },
        { judul: 'Diagram kotak garis dan ragam', teks: 'Diagram kotak garis menampilkan min, Q1, median, Q3, maks.\nRagam = rata-rata kuadrat selisih data terhadap rata-rata: Σ(x − rata-rata)² ÷ n.' }
      ],
      contoh: { level: 4, seed: 7 }, cobaMaks: 3,
      kenapa: 'Titik tengah mewakili semua data dalam satu kelas. Karena data asli di dalam kelas tidak diketahui, rata-rata berkelompok adalah pendekatan terbaik.'
    },
    'X-7': {
      konsep: [
        { judul: 'Peluang kejadian', teks: 'Peluang = banyak kejadian yang diinginkan ÷ banyak semua kemungkinan (ruang sampel).\nPeluang bernilai 0 sampai 1. Peluang kejadian tidak terjadi = 1 − peluang terjadi.' },
        { judul: 'Aturan perkalian dan frekuensi harapan', teks: 'Jika ada 3 baju dan 2 celana, ada 3 × 2 = 6 cara berpakaian. Dua dadu: 6 × 6 = 36 pasangan.\nFrekuensi harapan = banyak percobaan × peluang.' },
        { judul: 'Gabungan dan dua pengambilan', teks: 'P(A atau B) = P(A) + P(B) − P(A dan B). Jika saling lepas, P(A dan B) = 0.\nDua pengambilan: dengan pengembalian, jumlah benda tetap; tanpa pengembalian, jumlah benda berkurang satu.' }
      ],
      contoh: { level: 4, seed: 9 }, cobaMaks: 3,
      kenapa: 'Pada P(A atau B), kejadian yang ada di A dan di B terhitung dua kali bila hanya dijumlahkan, jadi harus dikurangi sekali.'
    },
    'VIII-1': {
      konsep: [
        { judul: 'Menjumlah dan mengurang', teks: 'Hapus kurung lebih dulu. Kurung yang didahului tanda minus membalik tanda semua suku di dalamnya.\n(3x + 2y − 5) − (x − 4y + 7) = 3x + 2y − 5 − x + 4y − 7 = 2x + 6y − 12.' },
        { judul: 'Perkalian dan pembagian', teks: 'Perkalian dua kurung: kalikan tiap suku dengan tiap suku. (2x + 3)(x − 4) = 2x² − 8x + 3x − 12 = 2x² − 5x − 12.\nPembagian suku: bagi koefisien, kurangkan pangkat variabel yang sama. 12x³y² ÷ 4xy = 3x²y.' },
        { judul: 'Faktorisasi', teks: 'Faktor persekutuan: 6x + 9 = 3(2x + 3).\nx² + 7x + 10: cari dua bilangan berjumlah 7 dan berhasil kali 10 (2 dan 5) → (x + 2)(x + 5).\nSelisih kuadrat: x² − 9 = (x − 3)(x + 3).' }
      ],
      contoh: { level: 2, seed: 3 }, cobaMaks: 3,
      kenapa: 'Faktorisasi adalah kebalikan dari perkalian. Jika kita jabarkan (x + 2)(x + 5), kita kembali ke x² + 7x + 10, sehingga hasil faktorisasi selalu bisa dicek.'
    },
    'VIII-2': {
      konsep: [
        { judul: 'Substitusi', teks: 'Jika satu persamaan sudah berbentuk y = …, masukkan ke persamaan lain. y = 2x + 1 dan 3x + 2y = 16 → 3x + 2(2x + 1) = 16 → 7x + 2 = 16 → x = 2, lalu y = 5.' },
        { judul: 'Eliminasi', teks: 'Samakan koefisien salah satu variabel, lalu jumlahkan atau kurangkan kedua persamaan agar variabel itu hilang. Setelah dapat satu variabel, substitusi untuk mencari yang lain.' },
        { judul: 'Banyak penyelesaian dan cerita', teks: 'Dua garis bisa berpotongan (satu penyelesaian), sejajar (tidak ada), atau berimpit (tak hingga).\nSoal cerita: misalkan dua hal yang dicari dengan x dan y, tulis dua persamaan, selesaikan. Titik impas terjadi saat pendapatan sama dengan biaya.' }
      ],
      contoh: { level: 2, seed: 4 }, cobaMaks: 3,
      kenapa: 'Penyelesaian sistem adalah titik yang berada di kedua garis sekaligus. Itu sebabnya pasangan (x, y) harus memenuhi kedua persamaan, dan itu juga cara memeriksa jawaban.'
    },
    'VIII-3': {
      konsep: [
        { judul: 'Fungsi linear dan gradien', teks: 'Fungsi linear f(x) = mx + n. m adalah gradien (kemiringan), n adalah nilai f saat x = 0.\nGradien dari dua titik: m = (y₂ − y₁) ÷ (x₂ − x₁).' },
        { judul: 'Persamaan garis dan titik potong', teks: 'Garis dengan gradien m melalui (x₁, y₁): y − y₁ = m(x − x₁).\nMemotong sumbu y di x = 0, memotong sumbu x di y = 0.' },
        { judul: 'Sejajar dan tegak lurus', teks: 'Garis sejajar punya gradien sama. Garis tegak lurus punya gradien m₁ × m₂ = −1, jadi gradien 3/4 tegak lurus dengan −4/3.\nDalam cerita, n adalah biaya tetap dan m adalah tarif per satuan.' }
      ],
      contoh: { level: 2, seed: 6 }, cobaMaks: 3,
      kenapa: 'Gradien menyatakan seberapa cepat y berubah ketika x bertambah 1. Karena garis lurus, perubahan itu selalu sama di mana pun, sehingga dua titik sudah cukup menentukan garis.'
    },
    'VIII-4': {
      konsep: [
        { judul: 'Sudut dan segitiga', teks: 'Berpelurus: berjumlah 180°. Berpenyiku: berjumlah 90°. Bertolak belakang: sama besar.\nJumlah sudut dalam segitiga 180°. Sudut luar = jumlah dua sudut dalam yang tidak bersebelahan.' },
        { judul: 'Segi banyak dan segiempat', teks: 'Jumlah sudut dalam segi-n = (n − 2) × 180°. Segi-n beraturan: tiap sudut dalam = jumlah ÷ n; tiap sudut luar = 360° ÷ n.\nLuas: jajargenjang = alas × tinggi; belah ketupat dan layang-layang = ½ × d₁ × d₂; trapesium = ½ × (a + b) × t.' },
        { judul: 'Teorema Pythagoras', teks: 'Pada segitiga siku-siku, a² + b² = c² dengan c sisi miring.\nTripel yang sering muncul: 3-4-5, 5-12-13, 8-15-17, 7-24-25 (dan kelipatannya).' }
      ],
      contoh: { level: 4, seed: 5 }, cobaMaks: 3,
      kenapa: 'Dua segitiga siku-siku yang sama dapat disusun menjadi persegi besar bersisi (a + b); dari kedua cara menghitung luasnya kita memperoleh a² + b² = c².'
    },
    'VIII-5': {
      konsep: [
        { judul: 'Ruang sampel', teks: 'Ruang sampel adalah semua hasil yang mungkin. Dua koin: AA, AG, GA, GG, jadi 4 hasil. Dua dadu: 6 × 6 = 36 hasil. Diagram pohon membantu mendaftar semua hasil.' },
        { judul: 'Peluang teoretis dan empiris', teks: 'Peluang teoretis = banyak hasil yang diinginkan ÷ banyak seluruh hasil.\nFrekuensi relatif (peluang empiris) = banyak muncul ÷ banyak percobaan. Perkiraan kejadian = banyak percobaan × peluang.' },
        { judul: 'Komplemen dan saling bebas', teks: 'Peluang tidak terjadi = 1 − peluang terjadi.\nJika dua kejadian saling bebas, peluang keduanya = peluang pertama × peluang kedua.' }
      ],
      contoh: { level: 4, seed: 7 }, cobaMaks: 3,
      kenapa: 'Makin banyak percobaan, frekuensi relatif cenderung mendekati peluang teoretis. Itu sebabnya hasil survei besar bisa dipakai untuk memperkirakan kejadian berikutnya.'
    },
    'IX-1': {
      konsep: [
        { judul: 'Penyelesaian sebagai titik potong', teks: 'Penyelesaian sistem dua persamaan linear adalah titik potong kedua garisnya. Jika y = 2x + 1 dan y = −x + 4, samakan: 2x + 1 = −x + 4 → 3x = 3 → x = 1, y = 3.' },
        { judul: 'Eliminasi dan substitusi', teks: 'Eliminasi: kalikan agar koefisien salah satu variabel sama, lalu kurangkan atau jumlahkan. Substitusi: nyatakan satu variabel dari persamaan lain lalu masukkan.\nPersamaan berpecahan: kalikan seluruh persamaan dengan KPK penyebut lebih dulu.' },
        { judul: 'Memodelkan soal cerita', teks: 'Misalkan dua hal yang dicari dengan x dan y, tulis satu persamaan untuk tiap kalimat. Jika ada konstanta yang belum diketahui, gunakan penyelesaian yang sudah diberikan untuk mencarinya.' }
      ],
      contoh: { level: 2, seed: 3 }, cobaMaks: 3,
      kenapa: 'Titik yang memenuhi kedua persamaan harus berada di kedua garis sekaligus, sehingga hanya titik potongnya yang cocok.'
    },
    'IX-2': {
      konsep: [
        { judul: 'Volume dan luas permukaan', teks: 'Kubus: V = s³, luas = 6s². Balok: V = p × l × t, luas = 2(pl + pt + lt).\nPrisma: V = luas alas × tinggi. Limas: V = ⅓ × luas alas × tinggi.' },
        { judul: 'Bangun sisi lengkung', teks: 'Dengan π = 22/7: tabung V = πr²t, selimut = 2πrt. Kerucut V = ⅓πr²t, selimut = πrs. Bola V = 4/3 πr³, luas = 4πr².\nGaris pelukis kerucut s = √(r² + t²).' },
        { judul: 'Satuan dan gabungan', teks: '1 liter = 1.000 cm³ = 1 dm³. Untuk bangun gabungan, hitung tiap bagian lalu jumlahkan. Pilih r atau t yang membuat 22/7 habis dibagi (kelipatan 7).' }
      ],
      contoh: { level: 3, seed: 5 }, cobaMaks: 3,
      kenapa: 'Volume prisma dan tabung sama dengan luas alas × tinggi karena bangun itu tersusun dari lapisan-lapisan alas yang identik. Limas dan kerucut muat tepat tiga kali dalam prisma atau tabung yang alas dan tingginya sama.'
    },
    'IX-3': {
      konsep: [
        { judul: 'Translasi dan refleksi', teks: 'Translasi T(a, b): (x, y) → (x + a, y + b).\nRefleksi: sumbu x → (x, −y); sumbu y → (−x, y); y = x → (y, x); y = −x → (−y, −x).' },
        { judul: 'Rotasi dan dilatasi', teks: 'Rotasi pusat O berlawanan arah jarum jam: 90° → (−y, x); 180° → (−x, −y); 270° → (y, −x).\nDilatasi pusat O faktor k: (x, y) → (kx, ky). Untuk pusat (a, b): (a + k(x − a), b + k(y − b)).' },
        { judul: 'Komposisi dan luas', teks: 'Komposisi: kerjakan transformasi satu per satu sesuai urutan.\nDilatasi faktor k memperbesar panjang k kali dan luas k² kali. Translasi, refleksi, dan rotasi tidak mengubah ukuran.' }
      ],
      contoh: { level: 2, seed: 4 }, cobaMaks: 3,
      kenapa: 'Luas dikalikan k² karena dilatasi memperbesar panjang dan lebar masing-masing k kali, lalu keduanya dikalikan.'
    },
    'IX-4': {
      konsep: [
        { judul: 'Populasi dan sampel', teks: 'Populasi: seluruh objek yang diteliti. Sampel: sebagian populasi yang diamati dan harus mewakili populasi.\nSistematis: ambil setiap k-an, k = N ÷ n. Berstrata: jumlah sampel tiap kelompok sebanding dengan ukuran kelompoknya.' },
        { judul: 'Peluang tanpa pengembalian', teks: 'Tanpa pengembalian, jumlah benda berkurang satu pada pengambilan berikutnya.\nContoh 3 merah, 2 biru: P(dua merah) = 3/5 × 2/4 = 3/10.' },
        { judul: 'Paling sedikit satu dan perkiraan', teks: 'P(paling sedikit satu) = 1 − P(tidak ada).\nPerkiraan populasi = proporsi sampel × banyak populasi. Frekuensi harapan = banyak percobaan × peluang.' }
      ],
      contoh: { level: 3, seed: 6 }, cobaMaks: 3,
      kenapa: 'Sampel acak yang cukup besar cenderung memiliki proporsi mendekati populasi, sehingga proporsi sampel dapat dipakai untuk memperkirakan populasi.'
    },
    H1: {
      konsep: [
        { judul: 'Pecah per tempat', teks: 'Pisahkan puluhan dan satuan. 48 + 37 = (40 + 30) + (8 + 7) = 70 + 15 = 85.\nKerjakan dari bagian besar dulu supaya mudah dicek.' },
        { judul: 'Bilangan ramah', teks: 'Beberapa bilangan mudah dikali: 10, 20, 25, 30, 40, 50.\n25 × 16: kali 100 lalu bagi 4 (karena 25 = 100/4) = 1.600 ÷ 4 = 400.' }
      ],
      contoh: { level: 5, seed: 4 }, cobaMaks: 3,
      kenapa: 'Memecah bilangan memakai sifat distributif: a × (b + c) = a × b + a × c. Hasilnya sama, hanya langkahnya lebih ringan.'
    },
    H2: {
      konsep: [
        { judul: 'Bulatkan lalu koreksi', teks: '48 + 37: bulatkan 48 jadi 50, hitung 50 + 37 = 87, lalu kurangi 2 yang tadi kelebihan: 85.' },
        { judul: 'Pecah dan gandakan', teks: 'Pecah angka: 46 × 7 = 40 × 7 + 6 × 7 = 280 + 42 = 322.\nGandakan dan bagi dua: 25 × 18 = 50 × 9 = 450.' },
        { judul: 'Persen dan selisih kuadrat', teks: 'Persen cepat: 15% = 10% + 5%. 10% dari 240 = 24, 5% = 12, jadi 36.\nPola (m − d)(m + d) = m² − d². 49 × 51 = 50² − 1 = 2.499.' }
      ],
      contoh: { level: 3, seed: 9 }, cobaMaks: 3,
      kenapa: 'Semua trik ini menukar soal sulit dengan beberapa soal mudah yang hasil akhirnya sama persis.'
    },
    H3: {
      konsep: [
        { judul: 'Membaca soal cerita dengan balok', teks: 'Gambar tiap besaran sebagai balok. Panjang balok mewakili banyaknya. Yang ditanyakan ditandai "?".\nBalok membantu melihat apakah kita perlu menjumlah, mengurangi, atau membagi.' },
        { judul: 'Pecahan, rasio, persen', teks: 'Pecahan: bagi balok menjadi bagian sama besar, ambil bagian yang diminta.\nRasio: jumlah bagian dulu, lalu nilai satu bagian.\nPersen: 100% = seluruh balok; diskon 25% berarti sisa 75%.' }
      ],
      contoh: { level: 4, seed: 6 }, cobaMaks: 3,
      kenapa: 'Dengan balok, kita mengubah cerita menjadi gambar yang menampakkan hubungan antar bilangan, sehingga langkah hitungnya jadi jelas.'
    },
    H4: {
      konsep: [
        { judul: 'Kuadrat berakhiran 5 dan kali 11', teks: '75²: angka depan 7, kalikan dengan 8 = 56, tulis 25 → 5.625.\n48 × 11: tulis 4 | (4 + 8) | 8; 12 lebih dari 9, simpan 1 → 528.' },
        { judul: 'Dua pola cantik', teks: 'Puluhan sama, satuan berjumlah 10: 43 × 47 → 4 × 5 = 20 | 3 × 7 = 21 → 2.021.\n1000 − 673: 9−6, 9−7, 10−3 → 327.' },
        { judul: 'Basis 100 dan silang', teks: '97 × 94: kurangnya 3 dan 6. 97 − 6 = 91 | 3 × 6 = 18 → 9.118.\nSilang 2 digit: satuan × satuan, silang, puluhan × puluhan, bawa simpanannya.' }
      ],
      contoh: { level: 3, seed: 2 }, cobaMaks: 4,
      kenapa: 'Trik ini berasal dari aljabar. (10n + 5)² = 100n(n + 1) + 25, itulah sebabnya "n × (n+1) disusul 25" selalu benar.'
    },
    H5: {
      konsep: [
        { judul: 'Kali 11 dan 12', teks: '× 11: jumlahkan tiap angka dengan tetangga kanannya. 523 × 11 → 3 | 2+3=5 | 5+2=7 | 5 → 5.753.\n× 12: gandakan tiap angka lalu tambah tetangga kanannya. 213 × 12 → 6 | 2+3=5 | 4+1=5 | 2 → 2.556.' },
        { judul: 'Kali 5 dan simpanan', teks: '× 5: kali 10 lalu bagi 2. 468 × 5 = 4.680 ÷ 2 = 2.340.\nJika hasil suatu posisi lebih dari 9, tulis satuannya dan simpan puluhannya ke posisi kiri.' }
      ],
      contoh: { level: 1, seed: 8 }, cobaMaks: 3,
      kenapa: 'N × 11 = N × 10 + N. Menjumlahkan tiap angka dengan tetangganya adalah cara menuliskan penjumlahan itu per tempat.'
    },
    H6: {
      konsep: [
        { judul: 'Latihan kecepatan', teks: 'Di sini semua trik Vedic dan Trachtenberg yang sudah kamu pelajari bercampur, dengan batas waktu per soal.\nJika waktu habis, soal dihitung salah. Fokus: tepat dulu, baru cepat.' }
      ],
      contoh: { level: 2, seed: 12 }, cobaMaks: 2,
      kenapa: 'Kecepatan datang dari mengenali pola. Makin sering kamu melihat polanya, makin singkat waktu yang dibutuhkan.'
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
