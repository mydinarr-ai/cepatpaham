/* CepatPaham - peta materi semua kelas (registri). Bab yang belum dikerjakan berstatus "segera".
   Untuk mengaktifkan bab: panggil CP.aktifkan(id, {...}) di file modul (lihat PANDUAN-PENGEMBANGAN.md). */
(function (G) {
  'use strict';
  const CP = G.CP;
  const SMA_SMK = ['SMA', 'SMK'];

  function tambah(kelas, jenjang, kategori, daftar, tahap, prefiks) {
    daftar.forEach((o, i) => {
      const judul = typeof o === 'string' ? o : o[0];
      const gambar = typeof o === 'string' ? false : !!o[1];
      CP.daftar({
        id: kelas + '-' + (prefiks ? prefiks + '-' : '') + (i + 1),
        judul, kelas, jenjang, kategori, tahap: typeof tahap === 'function' ? tahap(i) : tahap,
        perluGambar: gambar, level: [], status: 'segera'
      });
    });
  }

  /* ---- SMP ---- */
  tambah('VII', ['SMP'], 'umum', [['Bilangan Bulat'], ['Bilangan Rasional'], ['Rasio'], ['Bentuk Aljabar'], ['Kesebangunan', 1], ['Data dan Diagram', 1]], (i) => (i < 3 ? 1 : 2));
  tambah('VIII', ['SMP'], 'umum', [['Menyederhanakan Bentuk Aljabar'], ['Sistem Persamaan Linear Dua Variabel'], ['Fungsi Linear', 1], ['Sifat-Sifat Bangun Geometri', 1], ['Peluang']], 3);
  tambah('IX', ['SMP'], 'umum', [['Sistem Persamaan Linear Dua Variabel'], ['Bangun Ruang', 1], ['Transformasi Geometri', 1], ['Peluang dan Pengambilan Sampel']], 5);

  /* ---- SMA dan SMK: Matematika Umum ---- */
  tambah('X', SMA_SMK, 'umum', [['Eksponen dan Bentuk Akar'], ['Barisan, Deret, dan Bunga'], ['Perbandingan Trigonometri', 1], ['Sistem Persamaan dan Pertidaksamaan Linear'], ['Persamaan dan Fungsi Kuadrat', 1], ['Representasi dan Interpretasi Data', 1], ['Peluang']], (i) => (i < 2 ? 1 : 2));
  tambah('XI', SMA_SMK, 'umum', [['Komposisi Fungsi dan Fungsi Invers'], ['Lingkaran', 1], ['Statistika', 1]], 4);
  tambah('XII', SMA_SMK, 'umum', [['Transformasi Fungsi', 1], ['Busur dan Juring Lingkaran', 1], ['Kombinatorik']], 6);

  /* ---- SMA: Matematika Tingkat Lanjut ---- */
  tambah('XI', ['SMA'], 'lanjut', [['Bilangan Kompleks'], ['Polinomial'], ['Matriks'], ['Transformasi Geometri', 1], ['Fungsi dan Pemodelannya']], 7, 'TL');
  tambah('XII', ['SMA'], 'lanjut', [['Geometri Analitik', 1], ['Limit'], ['Turunan Fungsi'], ['Integral'], ['Analisis Data dan Peluang']], 8, 'TL');

  /* ---- Hitung Cepat ---- */
  const semua = ['SMP', 'SMA', 'SMK'];
  [['H0', 'Dasar Perkalian'], ['H1', 'Drill Berjenjang'], ['H2', 'Hitung Mental'], ['H3', 'Soal Cerita Model Bar'], ['H4', 'Vedic Math'], ['H5', 'Trachtenberg'], ['H6', 'Latihan Kecepatan']].forEach((x) => {
    CP.daftar({ id: x[0], judul: x[1], kelas: null, jenjang: semua, kategori: 'hitungCepat', tahap: 1, level: [], status: 'segera' });
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
