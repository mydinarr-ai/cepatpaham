# Panduan Pengembangan CepatPaham

Dokumen ini untuk sesi Claude Code berikutnya. Baca juga `spesifikasi-aplikasi-hitung-cepat.md` (bagian 3, 9, 13, 14).

## 1. Peta berkas

| Berkas | Isi |
|---|---|
| `index.html` | Tampilan (HTML + CSS + JavaScript layar). Tidak berisi soal. |
| `js/inti.js` | Konfigurasi (`CP.KONFIG`), acak ber-seed, matematika pecahan, format angka Indonesia, pemeriksa jawaban, mesin adaptif, registri, profil, penyimpanan, laporan orang tua, cadangan. |
| `js/peta.js` | **Registri semua bab semua kelas** (status `segera`). Judul bab diubah di sini. |
| `js/materi.js` | Materi mode Belajar per modul (`CP.MATERI`). |
| `js/sekolah.js` | Tahap 1: VII-1..3, X-1..2. |
| `js/kelas7b.js` | Tahap 2 Kelas VII: VII-4 (aljabar), VII-5 (kesebangunan), VII-6 (data). Juga mengekspor `CP.alj` dan `CP.gbr` untuk dipakai file lain. |
| `js/kelas10b.js` | Tahap 2 Kelas X: X-3 (trigonometri), X-4 (SPL), X-5 (kuadrat), X-6 (data), X-7 (peluang). |
| `js/kelas8.js` | Tahap 3 Kelas VIII: VIII-1 (aljabar), VIII-2 (SPLDV), VIII-3 (fungsi linear), VIII-4 (bangun geometri), VIII-5 (peluang). Memakai `CP.alj` (kelas7b) dan `CP.spl` (kelas10b). |
| `js/kelas9.js` | Kelas IX: IX-1 (SPLDV), IX-2 (bangun ruang), IX-3 (transformasi geometri), IX-4 (peluang dan sampel). Berisi penggambar bangun ruang dan bidang koordinat. |
| `js/kelas11.js` | Kelas XI Umum: XI-1 (komposisi dan invers fungsi), XI-2 (lingkaran), XI-3 (statistika: pencar, regresi, korelasi). |
| `js/gambar.js` | Penggambar SVG umum (`CP.gambarUmum`): persegi panjang, segitiga, parabola, diagram batang/lingkaran/kotak-garis dibuat dari daftar elemen (`CP.H`). Gambar balok H3 tetap di `cerita.js`. |
| `js/hitung.js` | Hitung Cepat H1, H2, H4, H5, H6. |
| `js/cerita.js` | H3 Soal Cerita Model Bar + penggambar SVG balok + templat cerita. |
| `sw.js` | Service worker (cache bernomor versi). |
| `manifest.json`, `ikon/` | PWA. `node buat-ikon.js` membuat ulang ikon PNG. |
| `uji.js` | Pengujian otomatis. Jalankan: `node uji.js` (cepat: `BANYAK=100 node uji.js`). |
| `serve.js` | Server lokal untuk mencoba: `node serve.js` lalu buka `http://localhost:5173`. |

Urutan muat skrip di `index.html` dan `uji.js` harus tetap: `inti` → `peta` → `materi` → `sekolah` → `hitung` → `cerita` → `gambar` → `kelas7b` → `kelas10b` → `kelas8` → `kelas9` → `kelas11`. File modul baru (mis. `kelas12.js`) ditambahkan **setelah** `kelas11.js` dan didaftarkan di tiga tempat: tag `<script>` di `index.html`, daftar `ASET` di `sw.js`, dan baris `muat(...)` di `uji.js`.

## 2. Cara mengaktifkan satu bab (langkah demi langkah)

Contoh: mengaktifkan `VII-4` (Bentuk Aljabar).

1. **Cek registri.** Bab sudah ada di `js/peta.js` dengan `status: 'segera'`. Jangan membuat bab baru dengan `CP.daftar`, kecuali bab itu memang belum terdaftar.
2. **Tulis modul** di file kelasnya (mis. `js/kelas-7.js` atau tambahkan ke `sekolah.js`):

```js
CP.aktifkan('VII-4', {
  negatif: false,                     // opsional, hanya penanda
  level: [
    CP.lv('Judul level 1', 'Contoh singkat', 'angka',
      (r, c) => ({ /* parameter acak, pakai r.bulat(a,b), r.pilih(arr), r.kocok(arr) */ }),
      (p, ctx) => CP.S.angka('Teks soal', jawabanBenar, {
        jenis: 'nama-jenis',                           // dipakai untuk soal ulangan 20%
        satuan: 'cm', awalan: 'Rp',                    // opsional
        izin: { minus: false, koma: false, garis: false }, // tombol keypad yang aktif
        langkah: [CP.st('Langkah 1...'), CP.st('Langkah akhir', nilaiHasilLangkah)],
        dibagi: [{ a: 36, b: 9 }],                     // semua pembagian di soal (harus habis)
        gambar: { tipe: 'bar', ... }                   // opsional, SVG otomatis
      })),
    // ... total 6 level
  ]
});
```

Aturan penting:
- `acak(r, c)` hanya membuat **parameter**. `bangun(p, ctx)` membuat soal dari parameter itu. Keduanya murni (tanpa efek samping) supaya contoh tabel bisa diuji dengan parameter tetap (`CP.peta[id].bangun(level, param)`).
- `c.konteks` bernilai `"umum"` atau `"vokasi"` (profil SMK). Generator soal cerita **wajib** memberi konteks vokasi: harga pokok/jual, untung-rugi, diskon, pajak, komisi, stok, biaya produksi, ukuran bahan, target penjualan.
- Tipe jawaban: `CP.S.angka` (bilangan bulat/desimal), `CP.S.pecahan` (otomatis meminta "bentuk paling sederhana"; matikan dengan `{sederhana:false}`), `CP.S.pilihan` (pilihan ganda 4 opsi lewat `CP.rakitPilihan`).
- Pilihan ganda: opsi salah harus berasal dari **kesalahan umum siswa**. Setiap opsi punya `kunci` (nilai) yang berbeda; `uji.js` memeriksa keempat nilai berbeda.
- **Langkah penyelesaian** harus dihitung lewat jalur berbeda dari rumus jawaban (`uji.js` membandingkan nilai `v` langkah terakhir dengan jawaban).
- Negatif hanya boleh muncul bila `izin.minus` true. Pembagian bilangan bulat wajib habis dan didaftarkan di `dibagi`.
- Pilihan ganda berbentuk teks aljabar memakai `CP.alj` (`rend`, `kunciAlj`, `opsiAlj`); `kunci` = koefisien kanonik sehingga dua opsi setara tidak muncul bersamaan.
- Jangan menyalin soal dari buku/ujian. Jangan memakai nama merek (Kumon, Sakamoto, Sempoa).
3. **Materi Belajar**: tambah entri `CP.MATERI['VII-4']` di `js/materi.js` (`konsep[]`, `contoh:{level,seed}`, `cobaMaks`, `kenapa`). Contoh dibuat dari generator dengan seed tetap, jadi langkahnya pasti benar.
4. **Bab bertanda [gambar]**: tambahkan `gambar: {tipe:'gambar', tinggi, el:[...]}` pada soal, disusun dengan pembantu `CP.H` (`H.r`, `H.p`, `H.l`, `H.t`, `H.o`, `H.d`; lihat contoh di `kelas7b.js` dan `kelas10b.js`). `uji.js` memeriksa SVG tidak memuat NaN/undefined. Periksa juga teks tidak terpotong (mis. lewat `getBBox()` di browser).
5. **Tambahkan kasus tetap** (contoh di tabel spesifikasi) ke bagian 2 `uji.js`, lalu jalankan `node uji.js` sampai **GAGAL: 0**. Ubah juga angka yang sengaja dikunci di `uji.js` (jumlah modul aktif, `level.length`).
6. **Naikkan versi**: `CACHE` di `sw.js` (mis. `cepatpaham-v1.1.0`) dan `K.versiApp`/`CP.KONFIG.versiApp` di `js/inti.js`. Jika **format data** berubah, naikkan `versiData` dan tulis langkah migrasi di `CP.migrasi` supaya progres lama tidak hilang.
7. **Terbitkan** (bagian 5) di alamat yang sama.

## 3. Menambah kelas atau modul ujian (TKA, UTBK)

Semua kelas sudah terdaftar di `peta.js`. Modul baru (mis. `TKA-SMP-1`) cukup didaftarkan dengan `CP.daftar({...})` lalu diaktifkan dengan `CP.aktifkan`. Tampilan Beranda per kelas memakai `CP.modulUntukProfil(profil)`; untuk kategori baru (mis. `"ujian"`) tambahkan satu bagian di `layarBeranda` pada `index.html`. Sebelum mengerjakan TKA/UTBK, cek format dan cakupan terbaru dari sumber resmi.

## 4. Algoritma adaptif (ringkas)

- Simpan 10 jawaban terakhir per topik. Evaluasi di akhir sesi memakai 5 jawaban terakhir.
- Naik jika ≥4 benar **dan** rata-rata waktu < target level. Turun jika ≤2 benar (minimal level 1). Selain itu tetap.
- Target waktu ada di `CP.KONFIG.targetDetik` (Hitung Cepat 10-30 detik, Materi Sekolah 30-90 detik). Modul bisa menimpa dengan `target: [...]`; H6 juga punya `batasWaktu: [...]` (soal otomatis salah bila waktu habis).
- 20% soal sesi (2 dari 10) berasal dari `jenis` yang pernah salah. `jenis` setiap soal wajib konsisten, karena soal ulangan dibuat dengan mengulang generator sampai `soal.jenis` cocok.

## 5. Menerbitkan (GitHub Pages)

Aplikasi diterbitkan dari cabang `main`, folder akar, di `https://<username>.github.io/cepatpaham/`. **Alamat ini tidak boleh berubah** (progres siswa tersimpan per alamat).

```bash
node uji.js                       # semua harus lulus
git add -A && git commit -m "Tahap N: ..."
git push
```

GitHub Pages memperbarui dalam 1-2 menit. File `.nojekyll` sudah ada. Setelah mendorong, buka alamat aplikasi, pastikan versi baru muncul (Pengaturan → Tentang).

## 6. Keputusan desain yang perlu diketahui

- Desimal: koma. Titik ribuan (`1.250.000`) diterima sebagai ribuan, bukan desimal. Input `0.75` dan `0,75` sama-sama diterima.
- Soal "bentuk paling sederhana" menolak pecahan senilai yang belum sederhana dan menolak desimal. Soal lain menerima pecahan senilai.
- Opsi pilihan ganda tidak memuat bentuk yang **bernilai sama** dengan jawaban benar (mis. 3√8 tidak dipakai sebagai pengecoh untuk 6√2), supaya hanya ada satu jawaban benar.
- Progres Hitung Cepat (H1-H6) bersifat per profil, bukan per kelas, sehingga ikut terbawa saat "Naik kelas". Progres bab sekolah disimpan per id bab (`VII-1`, `X-2`, dst.).
- H6 memakai level H4/H5 profil sebagai batas atas soal ("yang sudah dilewati"), lewat `opsi.cap`.
- Mode Orang Tua dan data anak berada di `localStorage` HP yang sama; PIN hanya pengaman sederhana, bukan enkripsi.
- Spesifikasi (`spesifikasi-aplikasi-hitung-cepat.md`) sengaja tidak ikut diunggah ke repositori publik (lihat `.gitignore`); simpan di folder lokal proyek.

## 7. Urutan pengerjaan

Atas permintaan pemilik, bab dikerjakan **berurutan menurut kelas (VII → XII)**, bukan menurut nomor tahap di spesifikasi. Selesai: VII, VIII, IX, X, XI Umum. Berikutnya: XII Umum, lalu Tingkat Lanjut XI dan XII, lalu modul TKA/UTBK dan akun online.
