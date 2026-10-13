/* CepatPaham - H3 Soal Cerita Model Bar + penggambar SVG balok */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd } = CP;
  const F = CP.angka, RP = CP.rp;

  /* ---------- Gambar balok (SVG dibuat dari data soal) ---------- */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // g = {tipe:'bar', alt, skala, baris:[{judul, brace, segs:[{w,t,c}]}], footer}
  CP.gambarSVG = function (g) {
    if (!g || g.tipe !== 'bar') return '';
    const LEBAR = 320, KIRI = 10, MAKS = 300, TINGGI_BARIS = 80;
    const total = (b) => b.segs.reduce((a, s) => a + s.w, 0);
    const skala = g.skala || Math.max(...g.baris.map(total));
    const unit = MAKS / skala;
    let y = 6; const out = [];
    g.baris.forEach((b) => {
      const w = total(b) * unit;
      if (b.brace) {
        out.push('<path d="M' + KIRI + ' ' + (y + 24) + ' v-6 h' + w.toFixed(1) + ' v6" class="bar-brace"/>');
        out.push('<text x="' + (KIRI + w / 2).toFixed(1) + '" y="' + (y + 13) + '" text-anchor="middle" class="bar-teks bar-tebal">' + esc(b.brace) + '</text>');
      }
      let x = KIRI; const by = y + 28;
      b.segs.forEach((s) => {
        const sw = s.w * unit;
        out.push('<rect x="' + x.toFixed(1) + '" y="' + by + '" width="' + sw.toFixed(1) + '" height="26" class="bar-' + (s.c || 'a') + '"/>');
        if (s.t !== undefined && s.t !== '' && sw >= 14) out.push('<text x="' + (x + sw / 2).toFixed(1) + '" y="' + (by + 17) + '" text-anchor="middle" class="bar-teks bar-isi">' + esc(s.t) + '</text>');
        x += sw;
      });
      if (b.judul) out.push('<text x="' + KIRI + '" y="' + (by + 44) + '" class="bar-teks bar-kecil">' + esc(b.judul) + '</text>');
      y += TINGGI_BARIS;
    });
    if (g.footer) { out.push('<text x="' + KIRI + '" y="' + (y - 4) + '" class="bar-teks bar-tebal">' + esc(g.footer) + '</text>'); y += 18; }
    return '<svg viewBox="0 0 ' + LEBAR + ' ' + y + '" class="gambar-bar" role="img" aria-label="' + esc(g.alt || 'Diagram balok') + '" xmlns="http://www.w3.org/2000/svg">' + out.join('') + '</svg>';
  };

  /* ---------- Templat cerita ---------- */
  const isi = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => (v[k] === undefined ? '{' + k + '}' : v[k]));
  const C = {};

  C.bagian = {
    umum: [
      '{A} membeli {a} butir telur dan {B} membeli {b} butir telur di pasar. Berapa butir telur yang mereka beli seluruhnya?',
      'Di perpustakaan sekolah, {A} meminjam {a} buku dan {B} meminjam {b} buku. Berapa buku yang dipinjam mereka berdua?',
      'Kelas VII-A mengumpulkan {a} botol plastik, sedangkan kelas VII-B mengumpulkan {b} botol. Berapa botol yang terkumpul dari kedua kelas?',
      '{A} punya {a} kelereng dan {B} punya {b} kelereng. Berapa kelereng mereka jika digabung?',
      'Pada hari Sabtu, sebuah warung menjual {a} gelas es teh. Hari Minggu terjual {b} gelas. Berapa gelas es teh yang terjual selama dua hari itu?',
      '{A} berlari sejauh {a} meter pada pagi hari dan {b} meter pada sore hari. Berapa meter jarak larinya hari itu?',
      'Dalam sebuah pertandingan, tim merah mencetak {a} poin dan tim biru mencetak {b} poin. Berapa jumlah poin kedua tim?',
      'Kebun {A} berisi {a} pohon jambu dan {b} pohon mangga. Berapa pohon di kebun itu seluruhnya?',
      'Sebuah bus membawa {a} penumpang dari terminal. Di halte berikutnya naik {b} penumpang lagi. Berapa penumpang bus sekarang?',
      '{A} mengumpulkan {a} stiker dari teman dan {b} stiker dari kakaknya. Berapa stiker yang ia miliki sekarang?',
      'Di kolam ada {a} ikan lele dan {b} ikan nila. Berapa ikan di kolam itu?',
      'Panitia pentas seni menjual {a} tiket pada minggu pertama dan {b} tiket pada minggu kedua. Berapa tiket yang terjual?'
    ],
    vokasi: [
      'Toko online milik {A} menerima {a} pesanan pada hari Senin dan {b} pesanan pada hari Selasa. Berapa total pesanan dua hari itu?',
      'Gudang menyimpan {a} kardus kemasan di rak A dan {b} kardus di rak B. Berapa stok kardus seluruhnya?',
      'Bengkel sekolah memotong {a} batang besi pada shift pagi dan {b} batang pada shift siang. Berapa batang besi yang dipotong hari itu?',
      'Bagian produksi roti menghasilkan {a} roti tawar dan {b} roti manis dalam sehari. Berapa roti yang dihasilkan?',
      'Kasir mencatat {a} transaksi tunai dan {b} transaksi non-tunai hari ini. Berapa jumlah transaksi hari ini?',
      'Tim penjualan {A} menjual {a} paket produk di bulan Januari dan {b} paket di bulan Februari. Berapa paket yang terjual dalam dua bulan?',
      'Laboratorium komputer memiliki {a} unit komputer di ruang 1 dan {b} unit di ruang 2. Berapa jumlah unit komputer seluruhnya?',
      'Pada pembuatan seragam, {A} menjahit {a} kemeja dan {B} menjahit {b} kemeja. Berapa kemeja yang selesai dijahit?'
    ]
  };
  C.selisih = {
    umum: [
      '{A} mengumpulkan {a} kartu bergambar. {B} mengumpulkan {d} kartu lebih banyak daripada {A}. Berapa kartu yang dikumpulkan mereka berdua?',
      'Di kantin, {A} memakan {a} tahu isi. {B} memakan {d} tahu lebih banyak daripada {A}. Berapa tahu isi yang mereka makan bersama?',
      'Kelas VII-A memiliki {a} siswa. Kelas VII-B memiliki {d} siswa lebih banyak daripada kelas VII-A. Berapa siswa di kedua kelas itu?',
      '{A} membaca {a} halaman novel kemarin. Hari ini {A} membaca {d} halaman lebih banyak daripada kemarin. Berapa halaman yang dibaca dalam dua hari?',
      'Toko kue menjual {a} donat pada pagi hari. Siang hari terjual {d} donat lebih banyak daripada pagi hari. Berapa donat yang terjual pagi dan siang?',
      '{A} memelihara {a} ekor ayam. {B} memelihara {d} ekor lebih banyak daripada {A}. Berapa ekor ayam milik mereka berdua?',
      'Kereta A membawa {a} penumpang, kereta B membawa {d} penumpang lebih banyak daripada kereta A. Berapa penumpang di kedua kereta?',
      '{A} menempuh {a} km dengan sepeda pada hari Sabtu. Hari Minggu {A} menempuh {d} km lebih jauh daripada hari Sabtu. Berapa km jarak yang ditempuh dua hari itu?',
      'Tim basket {A} mencetak {a} poin. Tim lawan mencetak {d} poin lebih banyak. Berapa total poin kedua tim?',
      'Pada pameran, stan lukisan dikunjungi {a} orang dan stan kerajinan dikunjungi {d} orang lebih banyak. Berapa total pengunjung kedua stan?',
      '{A} memiliki {a} lembar kertas origami. {B} memiliki {d} lembar lebih banyak daripada {A}. Berapa lembar kertas origami milik mereka berdua?',
      'Minggu lalu perpustakaan dikunjungi {a} siswa. Minggu ini dikunjungi {d} siswa lebih banyak. Berapa siswa yang berkunjung dalam dua minggu?'
    ],
    vokasi: [
      'Toko online {A} menjual {a} kaus pada Januari. Februari terjual {d} kaus lebih banyak. Berapa kaus yang terjual selama dua bulan?',
      'Mesin 1 memproduksi {a} komponen per shift. Mesin 2 memproduksi {d} komponen lebih banyak. Berapa komponen yang dihasilkan kedua mesin dalam satu shift?',
      'Gudang A menyimpan {a} karung semen. Gudang B menyimpan {d} karung lebih banyak. Berapa karung semen di kedua gudang?',
      'Kasir {A} melayani {a} pelanggan pagi hari dan {d} pelanggan lebih banyak di sore hari. Berapa pelanggan yang dilayani?',
      'Pada pelatihan menjahit, kelompok 1 menyelesaikan {a} baju. Kelompok 2 menyelesaikan {d} baju lebih banyak. Berapa baju yang selesai?',
      'Cabang toko Yogyakarta menjual {a} unit ponsel dan cabang Solo menjual {d} unit lebih banyak. Berapa unit ponsel yang terjual di kedua cabang?',
      'Bagian pengemasan membungkus {a} paket pada hari Senin dan {d} paket lebih banyak pada hari Selasa. Berapa paket yang dikemas dua hari itu?',
      'Montir {A} memperbaiki {a} motor minggu lalu. Minggu ini ia memperbaiki {d} motor lebih banyak. Berapa motor yang diperbaiki dalam dua minggu?'
    ]
  };
  // k: 'b' = tanya bagian pecahan, 's' = tanya sisa; rp: T berupa rupiah
  C.pecahan = {
    umum: [
      { k: 'b', s: '{A} memiliki {T} kelereng. Sebanyak {p}/{q} dari kelereng itu berwarna biru. Berapa kelereng yang berwarna biru?' },
      { k: 'b', s: 'Dari {T} siswa kelas VII-C, {p}/{q} bagian ikut ekstrakurikuler pramuka. Berapa siswa yang ikut pramuka?' },
      { k: 'b', s: 'Sebuah kebun memiliki {T} pohon. {p}/{q} dari pohon itu adalah pohon rambutan. Berapa pohon rambutan di kebun itu?' },
      { k: 'b', s: 'Pak {A} memiliki {T} ekor ayam, dan {p}/{q} di antaranya adalah ayam jantan. Berapa ekor ayam jantan?' },
      { k: 'b', s: 'Dalam sebuah buku {T} halaman, {p}/{q} bagian berisi gambar. Berapa halaman yang berisi gambar?' },
      { k: 'b', rp: 1, s: 'Uang saku {A} adalah {T}. Sebanyak {p}/{q} dari uang saku itu ditabung. Berapa rupiah yang ditabung?' },
      { k: 's', s: '{A} membawa {T} permen. Sebanyak {p}/{q} dari permen itu dibagikan kepada teman. Berapa permen yang tersisa?' },
      { k: 's', s: 'Sebuah tangki berisi {T} liter air. {p}/{q} bagian air dipakai untuk menyiram tanaman. Berapa liter air yang tersisa?' },
      { k: 's', s: 'Dari {T} tiket pertunjukan, {p}/{q} bagian sudah terjual. Berapa tiket yang belum terjual?' },
      { k: 's', s: 'Sebuah toko memiliki {T} kaus. {p}/{q} dari kaus itu terjual minggu ini. Berapa kaus yang masih ada?' },
      { k: 's', s: '{A} punya pita sepanjang {T} cm. Ia memakai {p}/{q} bagian untuk hiasan. Berapa cm pita yang tersisa?' },
      { k: 's', s: 'Dari {T} soal latihan, {A} sudah mengerjakan {p}/{q} bagian. Berapa soal yang belum dikerjakan?' }
    ],
    vokasi: [
      { k: 'b', s: 'Stok gudang {T} kardus. {p}/{q} dari stok itu sudah dipesan pelanggan. Berapa kardus yang sudah dipesan?' },
      { k: 'b', s: 'Target penjualan toko online bulan ini {T} paket. Sampai tanggal 15 tercapai {p}/{q} dari target. Berapa paket yang sudah terjual?' },
      { k: 'b', s: 'Kain sepanjang {T} meter dipakai {p}/{q} bagian untuk membuat seragam. Berapa meter kain yang terpakai?' },
      { k: 's', s: 'Dalam sehari bengkel menerima {T} kendaraan. {p}/{q} bagian sudah selesai diservis. Berapa kendaraan yang belum selesai?' },
      { k: 's', rp: 1, s: 'Anggaran pembelian bahan adalah {T}. Sebanyak {p}/{q} bagian sudah terpakai. Berapa rupiah sisa anggaran?' },
      { k: 'b', s: 'Sebuah drum bahan pelarut berisi {T} liter. {p}/{q} bagian dipakai untuk pengecatan. Berapa liter yang dipakai?' },
      { k: 's', s: 'Gudang toko memiliki {T} botol sirup. {p}/{q} bagian sudah dikirim ke pelanggan. Berapa botol yang masih di gudang?' },
      { k: 's', s: 'Dari {T} produk yang dibuat, {p}/{q} bagian cacat. Berapa produk yang tidak cacat?' }
    ]
  };
  // qb/qk: pertanyaan untuk bagian besar/kecil
  C.rasio = {
    umum: [
      { s: '{A} dan {B} memiliki {T} kelereng. Perbandingan kelereng {A} dan {B} adalah {a} : {b}.', qb: 'Berapa kelereng milik anak yang memiliki lebih banyak?', qk: 'Berapa kelereng milik anak yang memiliki lebih sedikit?' },
      { s: 'Sebuah kantong berisi {T} permen rasa jeruk dan rasa apel. Perbandingan permen jeruk dan apel adalah {a} : {b}.', qb: 'Berapa permen pada rasa yang lebih banyak?', qk: 'Berapa permen pada rasa yang lebih sedikit?' },
      { s: 'Di kelas terdapat {T} siswa. Perbandingan banyak siswa laki-laki dan perempuan adalah {a} : {b}.', qb: 'Berapa siswa pada kelompok yang lebih banyak?', qk: 'Berapa siswa pada kelompok yang lebih sedikit?' },
      { s: '{A} dan {B} membagi {T} stiker dengan perbandingan {a} : {b}.', qb: 'Berapa stiker pada bagian yang lebih besar?', qk: 'Berapa stiker pada bagian yang lebih kecil?' },
      { s: 'Sebuah toko roti membuat {T} roti cokelat dan roti keju dengan perbandingan {a} : {b}.', qb: 'Berapa roti pada jenis yang dibuat lebih banyak?', qk: 'Berapa roti pada jenis yang dibuat lebih sedikit?' },
      { s: 'Tali sepanjang {T} cm dipotong menjadi dua bagian dengan perbandingan {a} : {b}.', qb: 'Berapa cm panjang potongan yang lebih panjang?', qk: 'Berapa cm panjang potongan yang lebih pendek?' },
      { rp: 1, s: '{A} dan {B} mendapat hadiah uang {T} yang dibagi dengan perbandingan {a} : {b}.', qb: 'Berapa rupiah bagian yang lebih besar?', qk: 'Berapa rupiah bagian yang lebih kecil?' },
      { s: 'Dua ember berisi air sebanyak {T} liter dengan perbandingan isi {a} : {b}.', qb: 'Berapa liter isi ember yang lebih banyak?', qk: 'Berapa liter isi ember yang lebih sedikit?' },
      { s: 'Rak buku berisi {T} buku novel dan komik dengan perbandingan {a} : {b}.', qb: 'Berapa buku pada jenis yang lebih banyak?', qk: 'Berapa buku pada jenis yang lebih sedikit?' },
      { s: 'Panitia menjual {T} tiket kelas VIP dan reguler dengan perbandingan {a} : {b}.', qb: 'Berapa tiket pada kelas yang terjual lebih banyak?', qk: 'Berapa tiket pada kelas yang terjual lebih sedikit?' },
      { s: 'Kebun {A} ditanami {T} pohon cabai dan tomat dengan perbandingan {a} : {b}.', qb: 'Berapa pohon pada jenis yang lebih banyak?', qk: 'Berapa pohon pada jenis yang lebih sedikit?' },
      { s: 'Cat sebanyak {T} liter dicampur dari warna putih dan biru dengan perbandingan {a} : {b}.', qb: 'Berapa liter pada warna yang lebih banyak?', qk: 'Berapa liter pada warna yang lebih sedikit?' }
    ],
    vokasi: [
      { rp: 1, s: 'Laba usaha sebesar {T} dibagi untuk {A} dan {B} dengan perbandingan modal {a} : {b}.', qb: 'Berapa rupiah bagian yang lebih besar?', qk: 'Berapa rupiah bagian yang lebih kecil?' },
      { s: 'Gudang menyimpan {T} kemasan produk A dan B dengan perbandingan {a} : {b}.', qb: 'Berapa kemasan pada produk yang lebih banyak?', qk: 'Berapa kemasan pada produk yang lebih sedikit?' },
      { s: 'Pada produksi {T} komponen, perbandingan komponen kecil dan besar adalah {a} : {b}.', qb: 'Berapa komponen pada ukuran yang lebih banyak?', qk: 'Berapa komponen pada ukuran yang lebih sedikit?' },
      { s: 'Pesanan toko online sebanyak {T} paket dikirim lewat dua ekspedisi dengan perbandingan {a} : {b}.', qb: 'Berapa paket pada ekspedisi yang lebih banyak membawa?', qk: 'Berapa paket pada ekspedisi yang lebih sedikit membawa?' },
      { s: 'Bahan kain sepanjang {T} meter dibagi untuk seragam dan celemek dengan perbandingan {a} : {b}.', qb: 'Berapa meter bagian yang lebih panjang?', qk: 'Berapa meter bagian yang lebih pendek?' },
      { rp: 1, s: 'Anggaran promosi sebesar {T} dibagi untuk media sosial dan brosur dengan perbandingan {a} : {b}.', qb: 'Berapa rupiah bagian yang lebih besar?', qk: 'Berapa rupiah bagian yang lebih kecil?' },
      { s: 'Campuran semen dan pasir sebanyak {T} kg dibuat dengan perbandingan {a} : {b}.', qb: 'Berapa kg pada bahan yang lebih banyak?', qk: 'Berapa kg pada bahan yang lebih sedikit?' },
      { rp: 1, s: 'Komisi tim penjualan sebesar {T} dibagi antara {A} dan {B} dengan perbandingan {a} : {b}.', qb: 'Berapa rupiah bagian yang lebih besar?', qk: 'Berapa rupiah bagian yang lebih kecil?' }
    ]
  };
  // f: 1 = pecahan lalu tambah, 2 = selisih lalu rata-rata, 3 = rasio lalu selisih
  C.dua = {
    umum: [
      { f: 1, s: '{A} memiliki {T} butir telur. Sebanyak {p}/{q} bagian dijual, lalu {A} membeli lagi {u} butir. Berapa butir telur {A} sekarang?' },
      { f: 1, s: 'Sebuah bak berisi {T} liter air. {p}/{q} bagian dipakai untuk mandi, kemudian bak diisi lagi {u} liter. Berapa liter air di bak sekarang?' },
      { f: 1, s: '{A} mengumpulkan {T} kartu. Ia memberikan {p}/{q} bagian kepada adiknya, lalu mendapat {u} kartu dari temannya. Berapa kartu {A} sekarang?' },
      { f: 1, s: 'Perpustakaan memiliki {T} buku. {p}/{q} bagian sedang dipinjam, lalu datang {u} buku baru. Berapa buku yang ada di rak sekarang?' },
      { f: 2, s: '{A} memiliki {a} kelereng. {B} memiliki {d} kelereng lebih banyak daripada {A}. Semua kelereng digabung lalu dibagi sama banyak untuk mereka berdua. Berapa kelereng yang diterima masing-masing?' },
      { f: 2, s: 'Kelas VII-A mengumpulkan {a} kg sampah plastik dan kelas VII-B mengumpulkan {d} kg lebih banyak. Semua sampah ditimbang bersama lalu dibagi rata menjadi dua karung. Berapa kg isi tiap karung?' },
      { f: 2, s: 'Ayah membeli {a} jeruk, Ibu membeli {d} jeruk lebih banyak daripada Ayah. Jeruk dibagi rata untuk dua keranjang. Berapa jeruk dalam satu keranjang?' },
      { f: 2, s: '{A} menjual {a} kue pada hari pertama. Hari kedua terjual {d} kue lebih banyak. Berapa rata-rata kue terjual per hari?' },
      { f: 3, s: '{A} dan {B} memiliki {T} kelereng dengan perbandingan {a} : {b}. Berapa selisih kelereng mereka?' },
      { f: 3, rp: 1, s: 'Uang {T} dibagi untuk {A} dan {B} dengan perbandingan {a} : {b}. Berapa selisih uang yang mereka terima?' },
      { f: 3, s: 'Dalam pemilihan ketua kelas, {T} suara dibagi untuk {A} dan {B} dengan perbandingan {a} : {b}. Berapa selisih suara mereka?' },
      { f: 3, s: 'Dua kolam berisi {T} ikan dengan perbandingan {a} : {b}. Berapa selisih banyak ikan di kedua kolam?' }
    ],
    vokasi: [
      { f: 1, s: 'Gudang menyimpan {T} karung beras. {p}/{q} bagian dikirim ke pelanggan, lalu masuk kiriman baru {u} karung. Berapa karung beras di gudang sekarang?' },
      { f: 1, s: 'Toko {A} memiliki stok {T} kaus. {p}/{q} bagian terjual, lalu toko menambah stok {u} kaus. Berapa stok kaus sekarang?' },
      { f: 1, s: 'Bengkel memiliki {T} kaleng oli. {p}/{q} bagian terpakai, lalu dibeli lagi {u} kaleng. Berapa kaleng oli sekarang?' },
      { f: 2, s: 'Toko {A} menjual {a} paket pada hari Senin dan {d} paket lebih banyak pada hari Selasa. Berapa rata-rata paket terjual per hari?' },
      { f: 2, s: 'Mesin 1 menghasilkan {a} komponen dan mesin 2 menghasilkan {d} komponen lebih banyak. Berapa rata-rata komponen per mesin?' },
      { f: 2, s: 'Gudang A berisi {a} dus barang, gudang B berisi {d} dus lebih banyak. Stok dibagi rata ke kedua gudang. Berapa dus di tiap gudang?' },
      { f: 3, s: 'Penjualan {T} paket dari dua cabang toko dengan perbandingan {a} : {b}. Berapa selisih paket yang terjual kedua cabang?' },
      { f: 3, rp: 1, s: 'Laba {T} dibagi ke dua mitra usaha dengan perbandingan {a} : {b}. Berapa selisih laba mereka?' }
    ]
  };
  // k: bayar, diskon, untung, jual, komisi, pajak. {d} = persen, {H} = rupiah
  C.persen = {
    umum: [
      { k: 'bayar', s: 'Sebuah tas berharga {H}. Toko memberi diskon {d}%. Berapa rupiah yang harus dibayar?' },
      { k: 'bayar', s: 'Sepatu olahraga berharga {H} dan sedang diskon {d}%. Berapa harga setelah diskon?' },
      { k: 'diskon', s: 'Buku cerita berharga {H}. Pada pameran buku, ada potongan harga {d}%. Berapa rupiah potongan harganya?' },
      { k: 'bayar', s: '{A} membeli jaket seharga {H} dengan diskon {d}%. Berapa yang harus dibayar {A}?' },
      { k: 'bayar', s: 'Harga tiket wahana {H}. Pengunjung pelajar mendapat diskon {d}%. Berapa harga tiket pelajar?' },
      { k: 'diskon', s: 'Sebuah jam tangan berharga {H} diberi diskon {d}%. Berapa besar diskonnya dalam rupiah?' },
      { k: 'bayar', s: 'Dalam pasar murah, harga satu kardus mi instan {H} turun {d}%. Berapa harga sekarang?' },
      { k: 'bayar', s: 'Harga sepeda {H}. Karena akhir tahun, harganya didiskon {d}%. Berapa harga sepeda sekarang?' },
      { k: 'diskon', s: 'Toko alat tulis memberi potongan {d}% untuk pembelian dengan total {H}. Berapa rupiah potongannya?' },
      { k: 'bayar', s: 'Kaus favorit {A} berharga {H} dan diskon {d}%. Berapa yang dibayar?' },
      { k: 'bayar', s: 'Tas sekolah baru berharga {H}. Toko menjualnya dengan potongan {d}% di akhir pekan. Berapa harga akhirnya?' },
      { k: 'diskon', s: 'Raket bulu tangkis berharga {H}, diskon {d}%. Berapa rupiah penghematan {A}?' }
    ],
    vokasi: [
      { k: 'jual', s: 'Harga pokok sebuah kemeja {H}. {A} ingin untung {d}%. Berapa harga jualnya?' },
      { k: 'untung', s: 'Toko membeli tas dengan harga pokok {H} dan menjualnya dengan untung {d}%. Berapa rupiah untung tiap tas?' },
      { k: 'bayar', s: 'Harga mesin jahit {H} didiskon {d}%. Berapa harga setelah diskon?' },
      { k: 'komisi', s: 'Sales {A} mendapat komisi {d}% dari penjualan {H}. Berapa rupiah komisinya?' },
      { k: 'pajak', s: 'Harga barang {H} belum termasuk pajak {d}%. Berapa harga yang dibayar setelah pajak?' },
      { k: 'diskon', s: 'Toko online memberi diskon {d}% untuk pesanan {H}. Berapa rupiah potongannya?' },
      { k: 'jual', s: 'Modal pembuatan satu kue {H}. Bu {A} menjualnya dengan untung {d}%. Berapa harga jual kue?' },
      { k: 'komisi', s: 'Toko memberi komisi {d}% kepada reseller untuk setiap pesanan {H}. Berapa komisi reseller?' }
    ]
  };
  CP.CERITA = C;

  const pilihT = (r, daftar) => r.bulat(0, daftar.length - 1);
  const daftarT = (jenis, ctx) => (ctx.konteks === 'vokasi' ? C[jenis].vokasi : C[jenis].umum);
  const pecahDari = (r) => { const q = r.pilih([3, 4, 5, 6, 8, 10]); let p; do { p = r.bulat(1, q - 1); } while (gcd(p, q) !== 1); return [p, q]; };
  const rasioAB = (r) => { let a, b; do { a = r.bulat(1, 7); b = r.bulat(1, 7); } while (a === b || gcd(a, b) !== 1); return [a, b]; };
  const tebakNama = (r) => CP.dua(r);

  CP.aktifkan('H3', {
    level: [
      lv('Bagian-keseluruhan', '36 + 48 = 84', 'angka',
        (r, c) => ({ t: pilihT(r, daftarT('bagian', c)), n: tebakNama(r), a: r.bulat(12, 99), b: r.bulat(12, 99) }),
        ({ t, n, a, b }, ctx) => {
          const teks = isi(daftarT('bagian', ctx)[t], { A: n[0], B: n[1], a, b });
          return S.angka(teks, a + b, { jenis: 'bagian', langkah: [
            st('Gambar dua balok: satu bernilai ' + a + ' dan satu bernilai ' + b + '. Yang dicari panjang gabungannya.'),
            st(a + ' + ' + b + ' = ' + (a + b) + '.', a + b)],
          gambar: { tipe: 'bar', alt: 'Dua balok ' + a + ' dan ' + b + ' digabung', baris: [{ judul: n[0] + ' + ' + n[1], brace: '?', segs: [{ w: a, t: a, c: 'a' }, { w: b, t: b, c: 'b' }] }] } });
        }),
      lv('Selisih ("lebih banyak dari")', 'Ani 36, Budi 12 lebih banyak → jumlah 84', 'angka',
        (r, c) => ({ t: pilihT(r, daftarT('selisih', c)), n: tebakNama(r), a: r.bulat(12, 80), d: r.bulat(4, 30) }),
        ({ t, n, a, d }, ctx) => {
          const teks = isi(daftarT('selisih', ctx)[t], { A: n[0], B: n[1], a, d });
          return S.angka(teks, 2 * a + d, { jenis: 'selisih', langkah: [
            st('Balok pertama ' + a + '. Balok kedua sama panjang ditambah ' + d + ': ' + a + ' + ' + d + ' = ' + (a + d) + '.'),
            st('Jumlah keduanya: ' + a + ' + ' + (a + d) + ' = ' + (2 * a + d) + '.', a + (a + d))],
          gambar: { tipe: 'bar', alt: 'Dua balok, yang kedua lebih panjang ' + d, footer: 'Jumlah kedua balok = ?', baris: [
            { judul: n[0], segs: [{ w: a, t: a, c: 'a' }] }, { judul: n[1], segs: [{ w: a, t: a, c: 'a' }, { w: d, t: '+' + d, c: 'd' }] }] } });
        }),
      lv('Pecahan dari jumlah', '3/5 dari 40 → 24', 'angka',
        (r, c) => {
          const tt = pilihT(r, daftarT('pecahan', c)); const [p, q] = pecahDari(r);
          return { t: tt, n: tebakNama(r), p, q, m: r.bulat(2, 12), mr: r.bulat(2, 9) };
        },
        ({ t, n, p, q, m, mr }, ctx) => {
          const tpl = daftarT('pecahan', ctx)[t];
          const T = tpl.rp ? q * mr * 1000 : q * m;
          const satu = T / q, bag = satu * p, sisa = T - bag;
          const ans = tpl.k === 'b' ? bag : sisa;
          const f = (x) => (tpl.rp ? RP(x) : F(x));
          const teks = isi(tpl.s, { A: n[0], B: n[1], T: tpl.rp ? RP(T) : F(T), p, q });
          const s = S.angka(teks, ans, { jenis: 'pecahan' + tpl.k, awalan: tpl.rp ? 'Rp' : undefined, langkah: [
            st('Bagi balok menjadi ' + q + ' bagian sama besar: ' + f(T) + ' ÷ ' + q + ' = ' + f(satu) + ' tiap bagian.'),
            st(p + ' bagian = ' + p + ' × ' + f(satu) + ' = ' + f(bag) + '.', bag),
            ...(tpl.k === 's' ? [st('Sisanya = ' + f(T) + ' − ' + f(bag) + ' = ' + f(sisa) + '.', T - satu * p)] : [])],
          gambar: { tipe: 'bar', alt: 'Balok dibagi ' + q + ' bagian, ' + p + ' bagian diarsir', footer: p + '/' + q + ' dari ' + f(T) + (tpl.k === 's' ? '; sisa = ?' : ' = ?'), baris: [
            { brace: f(T), segs: Array.from({ length: q }, (_, i) => ({ w: 1, t: tpl.k === 'b' && i === 0 ? '?' : (tpl.k === 's' && i === p ? '?' : ''), c: i < p ? 'a' : 'k' })) }] } });
          s.dibagi = [{ a: T, b: q }];
          return s;
        }),
      lv('Rasio dengan total diketahui', 'Rasio 2 : 3, total 40 → bagian besar 24', 'angka',
        (r, c) => { const [a, b] = rasioAB(r); return { t: pilihT(r, daftarT('rasio', c)), n: tebakNama(r), a, b, m: r.bulat(2, 12), besar: r.bulat(0, 1) === 1 }; },
        ({ t, n, a, b, m, besar }, ctx) => {
          const tpl = daftarT('rasio', ctx)[t];
          const u = tpl.rp ? 1000 : 1, T = m * (a + b) * u, satu = m * u;
          const bag = (besar ? Math.max(a, b) : Math.min(a, b));
          const f = (x) => (tpl.rp ? RP(x) : F(x));
          const teks = isi(tpl.s, { A: n[0], B: n[1], a, b, T: tpl.rp ? RP(T) : F(T) }) + ' ' + (besar ? tpl.qb : tpl.qk);
          const s = S.angka(teks, bag * satu, { jenis: 'rasio' + (besar ? 'B' : 'K'), awalan: tpl.rp ? 'Rp' : undefined, langkah: [
            st('Jumlah bagian = ' + a + ' + ' + b + ' = ' + (a + b) + ' bagian sama besar.'),
            st('Satu bagian = ' + f(T) + ' ÷ ' + (a + b) + ' = ' + f(satu) + '.'),
            st('Bagian ' + (besar ? 'terbesar' : 'terkecil') + ' = ' + bag + ' × ' + f(satu) + ' = ' + f(bag * satu) + '.', bag * satu)],
          gambar: { tipe: 'bar', alt: 'Balok terbagi ' + (a + b) + ' bagian sama, rasio ' + a + ' : ' + b, footer: 'Rasio ' + a + ' : ' + b + ', total ' + f(T), baris: [
            { brace: f(T), segs: [...Array.from({ length: a }, () => ({ w: 1, t: '', c: 'a' })), ...Array.from({ length: b }, () => ({ w: 1, t: '', c: 'b' }))] }] } });
          s.dibagi = [{ a: T, b: a + b }];
          return s;
        }),
      lv('Dua langkah', 'Gabungan jenis di atas', 'angka',
        (r, c) => {
          const daftar = daftarT('dua', c);
          const t = c.jenis && /^F[123]$/.test(c.jenis) ? (() => { const f = parseInt(c.jenis.slice(1), 10); const idx = []; daftar.forEach((x, i) => { if (x.f === f) idx.push(i); }); return r.pilih(idx); })() : pilihT(r, daftar);
          const [p, q] = pecahDari(r); const [a, b] = rasioAB(r);
          return { t, n: tebakNama(r), p, q, m: r.bulat(2, 12), mr: r.bulat(2, 9), u: r.bulat(5, 40), a: r.bulat(10, 60), d: 2 * r.bulat(2, 15), ra: a, rb: b, rm: r.bulat(2, 12) };
        },
        (p, ctx) => {
          const tpl = daftarT('dua', ctx)[p.t];
          const f = (x) => (tpl.rp ? RP(x) : F(x));
          if (tpl.f === 1) {
            const T = p.q * p.m, satu = T / p.q, jual = satu * p.p, sisa = T - jual, ans = sisa + p.u;
            const s = S.angka(isi(tpl.s, { A: p.n[0], B: p.n[1], T, p: p.p, q: p.q, u: p.u }), ans, { jenis: 'F1', langkah: [
              st('Langkah 1: ' + p.p + '/' + p.q + ' dari ' + T + ' = ' + p.p + ' × (' + T + ' ÷ ' + p.q + ') = ' + p.p + ' × ' + satu + ' = ' + jual + '.'),
              st('Sisa = ' + T + ' − ' + jual + ' = ' + sisa + '.'),
              st('Langkah 2: ' + sisa + ' + ' + p.u + ' = ' + ans + '.', sisa + p.u)],
            gambar: { tipe: 'bar', alt: 'Balok pecahan lalu ditambah', footer: 'Hasil akhir = ?', baris: [
              { brace: String(T), segs: Array.from({ length: p.q }, (_, i) => ({ w: 1, t: '', c: i < p.p ? 'd' : 'a' })) },
              { judul: 'sisa + tambahan', segs: [{ w: Math.max(sisa, 1), t: sisa, c: 'a' }, { w: p.u, t: '+' + p.u, c: 'b' }] }] } });
            s.dibagi = [{ a: T, b: p.q }];
            return s;
          }
          if (tpl.f === 2) {
            const tot = 2 * p.a + p.d, ans = p.a + p.d / 2;
            const s = S.angka(isi(tpl.s, { A: p.n[0], B: p.n[1], a: p.a, d: p.d }), ans, { jenis: 'F2', langkah: [
              st('Langkah 1: balok kedua = ' + p.a + ' + ' + p.d + ' = ' + (p.a + p.d) + '. Jumlah = ' + p.a + ' + ' + (p.a + p.d) + ' = ' + tot + '.'),
              st('Langkah 2: dibagi rata untuk 2: ' + tot + ' ÷ 2 = ' + ans + '.', tot / 2)],
            gambar: { tipe: 'bar', alt: 'Dua balok digabung lalu dibagi dua', footer: 'Gabungan ÷ 2 = ?', baris: [
              { judul: p.n[0], segs: [{ w: p.a, t: p.a, c: 'a' }] }, { judul: p.n[1], brace: 'gabungan?', segs: [{ w: p.a, t: p.a, c: 'a' }, { w: p.d, t: '+' + p.d, c: 'd' }] }] } });
            s.dibagi = [{ a: tot, b: 2 }];
            return s;
          }
          const u = tpl.rp ? 1000 : 1, T = p.rm * (p.ra + p.rb) * u, satu = p.rm * u, ans = Math.abs(p.ra - p.rb) * satu;
          const s = S.angka(isi(tpl.s, { A: p.n[0], B: p.n[1], a: p.ra, b: p.rb, T: tpl.rp ? RP(T) : F(T) }), ans, { jenis: 'F3', awalan: tpl.rp ? 'Rp' : undefined, langkah: [
            st('Langkah 1: satu bagian = ' + f(T) + ' ÷ ' + (p.ra + p.rb) + ' = ' + f(satu) + '.'),
            st('Langkah 2: selisih bagian = ' + Math.abs(p.ra - p.rb) + ' × ' + f(satu) + ' = ' + f(ans) + '.', Math.abs(p.ra - p.rb) * satu)],
          gambar: { tipe: 'bar', alt: 'Balok rasio ' + p.ra + ' : ' + p.rb, footer: 'Selisih kedua bagian = ?', baris: [
            { brace: f(T), segs: [...Array.from({ length: p.ra }, () => ({ w: 1, t: '', c: 'a' })), ...Array.from({ length: p.rb }, () => ({ w: 1, t: '', c: 'b' }))] }] } });
          s.dibagi = [{ a: T, b: p.ra + p.rb }];
          return s;
        }),
      lv('Persen dan diskon', 'Rp80.000 diskon 25% → Rp60.000', 'angka',
        (r, c) => {
          const daftar = daftarT('persen', c); const t = pilihT(r, daftar); const k = daftar[t].k;
          const d = k === 'pajak' ? r.pilih([10, 11, 12]) : r.pilih([5, 10, 15, 20, 25, 30, 40, 50]);
          return { t, n: tebakNama(r), H: 20000 * r.bulat(1, 20), d };
        },
        ({ t, n, H, d }, ctx) => {
          const tpl = daftarT('persen', ctx)[t], k = tpl.k;
          const bag = (H * d) / 100;
          const ans = k === 'bayar' ? H - bag : k === 'jual' || k === 'pajak' ? H + bag : bag;
          const langkah = [st(d + '% dari ' + RP(H) + ' = ' + d + '/100 × ' + RP(H) + ' = ' + RP(bag) + '.')];
          let nama;
          if (k === 'bayar') { langkah.push(st('Harga setelah diskon = ' + RP(H) + ' − ' + RP(bag) + ' = ' + RP(H - bag) + '.', (H * (100 - d)) / 100)); nama = 'diskon'; }
          else if (k === 'jual' || k === 'pajak') { langkah.push(st((k === 'jual' ? 'Harga jual' : 'Harga setelah pajak') + ' = ' + RP(H) + ' + ' + RP(bag) + ' = ' + RP(H + bag) + '.', (H * (100 + d)) / 100)); nama = k === 'jual' ? 'untung' : 'pajak'; }
          else { langkah.push(st('Jadi ' + (k === 'diskon' ? 'potongan harganya' : k === 'untung' ? 'untungnya' : 'komisinya') + ' ' + RP(bag) + '.', (H * d) / 100)); nama = k; }
          const s = S.angka(isi(tpl.s, { A: n[0], B: n[1], H: RP(H), d }), ans, { jenis: 'persen:' + k, awalan: 'Rp', langkah,
            gambar: { tipe: 'bar', alt: 'Balok 100% dengan bagian ' + d + '%', footer: d + '% dari ' + RP(H) + ' = ' + RP(bag), baris: [
              { brace: RP(H) + ' = 100%', segs: k === 'bayar' ? [{ w: 100 - d, t: (100 - d) + '%', c: 'a' }, { w: d, t: d + '%', c: 'd' }] : k === 'jual' || k === 'pajak' ? [{ w: 100, t: '100%', c: 'a' }, { w: d, t: '+' + d + '%', c: 'd' }] : [{ w: 100 - d, t: '', c: 'k' }, { w: d, t: d + '%', c: 'd' }] }] } });
          return s;
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
