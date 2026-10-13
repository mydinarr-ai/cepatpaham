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
