/* CepatPaham - pengujian otomatis (jalankan: node uji.js) */
'use strict';
const fs = require('fs');
const path = require('path');
const muat = (f) => require(path.join(__dirname, 'js', f));
muat('inti.js'); muat('peta.js');
if (fs.existsSync(path.join(__dirname, 'js', 'materi.js'))) muat('materi.js');
muat('sekolah.js'); muat('hitung.js'); muat('cerita.js'); muat('gambar.js'); muat('kelas7b.js'); muat('kelas10b.js');
const CP = globalThis.CP;

let lulus = 0, gagal = 0;
const daftarGagal = [];
function cek(kondisi, pesan) {
  if (kondisi) { lulus++; return true; }
  gagal++; if (daftarGagal.length < 60) daftarGagal.push(pesan); return false;
}
function bagian(nama) { console.log('\n== ' + nama); }

const BANYAK = parseInt(process.env.BANYAK || '1000', 10);
const aktif = CP.REG.filter((m) => m.status === 'aktif');
const hampir = (a, b) => Math.abs(a - b) < 1e-7;

function nilaiLangkah(v) { return typeof v === 'number' ? v : (v && typeof v === 'object' && 'n' in v ? v.n / v.d : v); }
function parseTeksAkar(t) {
  let m = /^(\d*)√(\d+)(?: \/ (\d+))?$/.exec(t);
  if (m) return ((m[1] === '' ? 1 : parseInt(m[1], 10)) * Math.sqrt(parseInt(m[2], 10))) / (m[3] ? parseInt(m[3], 10) : 1);
  m = /^(\d+)(?: \/ (\d+))?$/.exec(t);
  if (m) return parseInt(m[1], 10) / (m[2] ? parseInt(m[2], 10) : 1);
  return null;
}

/* ---------- 1. Generator: 1000 soal per level per konteks ---------- */
bagian('1. Generator (' + BANYAK + ' soal per level per konteks)');
let totalSoal = 0;
aktif.forEach((m) => {
  for (let level = 1; level <= m.level.length; level++) {
    ['umum', 'vokasi'].forEach((konteks) => {
      const rng = CP.buatRng(1000 * level + (konteks === 'umum' ? 1 : 2) + m.id.length * 7);
      const jenisAda = new Set();
      let rusak = 0;
      for (let i = 0; i < BANYAK; i++) {
        let s;
        try { s = m.generator(level, konteks, rng); } catch (e) { cek(false, m.id + ' L' + level + ' ' + konteks + ' melempar galat: ' + e.message); rusak++; if (rusak > 3) break; continue; }
        totalSoal++; jenisAda.add(s.jenis);
        const id = m.id + ' L' + level + ' ' + konteks + ' "' + String(s.teks).slice(0, 70) + '"';
        const bersih = (t) => !/undefined|NaN|\[object|\{[a-zA-Z]+\}/.test(t);
        let ok = true;
        const k = (kond, pesan) => { if (!cek(kond, id + ' -> ' + pesan)) ok = false; };
        k(typeof s.teks === 'string' && s.teks.length > 5 && bersih(s.teks), 'teks buruk');
        k(Array.isArray(s.langkah) && s.langkah.length >= 2 && s.langkah.every((x) => bersih(x.t)), 'langkah kosong/buruk');
        const akhir = s.langkah[s.langkah.length - 1];
        k(akhir && akhir.v !== undefined, 'langkah terakhir tanpa nilai v');
        if (s.tipe === 'pilihan') {
          k(s.pilihan.length === 4, 'opsi bukan 4');
          k(new Set(s.kunci).size === 4, 'kunci opsi tidak berbeda');
          k(new Set(s.pilihan).size === 4, 'teks opsi sama');
          if (typeof s.nilai[0] === 'number') {
            let beda = true;
            for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) if (hampir(s.nilai[a], s.nilai[b])) beda = false;
            k(beda, 'nilai opsi ada yang sama');
            s.pilihan.forEach((t, idx) => { const pv = parseTeksAkar(t); k(pv !== null && hampir(pv, s.nilai[idx]), 'teks opsi "' + t + '" tidak cocok nilai ' + s.nilai[idx]); });
            const nv = nilaiLangkah(akhir.v);
            k(typeof nv === 'number' && hampir(nv, s.nilai[s.benar]), 'langkah (' + nv + ') != opsi benar (' + s.nilai[s.benar] + ')');
          } else {
            k(akhir.v === s.pilihan[s.benar], 'langkah ("' + akhir.v + '") != opsi benar ("' + s.pilihan[s.benar] + '")');
          }
          k(CP.periksaJawaban(s, s.benar) && !CP.periksaJawaban(s, (s.benar + 1) % 4), 'pemeriksa pilihan');
        } else {
          const j = s.jawab;
          k(j && Number.isInteger(j.n) && Number.isInteger(j.d) && j.d > 0 && CP.gcd(j.n, j.d) === (j.n === 0 ? j.d : 1), 'jawab tidak tereduksi/bulat');
          const nv = nilaiLangkah(akhir.v);
          k(typeof nv === 'number' && hampir(nv, j.n / j.d), 'hasil langkah (' + nv + ') != jawaban (' + (j.n / j.d) + ')');
          k(CP.periksaJawaban(s, CP.pecahanStr(j)), 'jawaban benar ditolak pemeriksa: ' + CP.pecahanStr(j));
          if (!(s.izin && s.izin.minus)) k(j.n >= 0, 'jawaban negatif di topik non-negatif: ' + j.n + '/' + j.d);
          if (j.d !== 1 && s.tipe === 'angka') k(CP.desimalStr(j) !== null, 'angka non-desimal berhenti');
        }
        (s.dibagi || []).forEach((dv) => k(dv.b !== 0 && dv.a % dv.b === 0, 'pembagian tidak habis ' + dv.a + '/' + dv.b));
        if (s.gambar) { const svg = m.gambar(s); k(typeof svg === 'string' && svg.indexOf('<svg') === 0 && svg.indexOf('NaN') < 0 && svg.indexOf('undefined') < 0, 'SVG buruk'); }
        if (m.id === 'H3') k(!!s.gambar, 'H3 tanpa gambar');
        if (!ok && gagal > 50) break;
      }
      console.log('  ' + m.id + ' L' + level + ' ' + konteks + ': ' + jenisAda.size + ' jenis soal');
    });
  }
});
console.log('Total soal diuji: ' + totalSoal);

/* ---------- 1b. Templat cerita H3 ---------- */
bagian('1b. Templat cerita H3 (>=12 umum, >=8 vokasi per jenis)');
['bagian', 'selisih', 'pecahan', 'rasio', 'dua', 'persen'].forEach((j) => {
  cek(CP.CERITA[j].umum.length >= 12, 'H3 ' + j + ' umum < 12');
  cek(CP.CERITA[j].vokasi.length >= 8, 'H3 ' + j + ' vokasi < 8');
  console.log('  ' + j + ': ' + CP.CERITA[j].umum.length + ' umum, ' + CP.CERITA[j].vokasi.length + ' vokasi');
});

/* ---------- 2. Contoh tabel (kasus tetap) ---------- */
bagian('2. Contoh tetap dari tabel spesifikasi');
function contoh(id, level, param, jawaban, ket, konteks) {
  const m = CP.peta[id];
  let s;
  try { s = m.bangun(level, param, konteks || 'umum'); } catch (e) { cek(false, 'contoh ' + id + ' L' + level + ' ' + ket + ' galat ' + e.message); return; }
  if (s.tipe === 'pilihan') cek(s.pilihan[s.benar] === jawaban, 'contoh ' + id + ' L' + level + ' ' + ket + ': opsi benar "' + s.pilihan[s.benar] + '" != "' + jawaban + '"');
  else cek(CP.periksaJawaban(s, String(jawaban)), 'contoh ' + id + ' L' + level + ' ' + ket + ': jawaban ' + CP.pecahanStr(s.jawab) + ' != ' + jawaban);
  return s;
}
const NN = ['Ani', 'Budi'];
contoh('VII-1', 1, { jenis: 'kecil', x: [-8, -3] }, '-8', 'lebih kecil');
contoh('VII-1', 2, { a: -7, b: 12, op: '+' }, '5', '-7+12');
contoh('VII-1', 2, { a: 15, b: -6, op: '-' }, '21', '15-(-6)');
contoh('VII-1', 3, { a: -3, b: -4, op: '*' }, '12', '-3x-4');
contoh('VII-1', 3, { a: -36, b: 9, op: '/' }, '-4', '-36:9');
contoh('VII-1', 4, { f: 'tambahKali', a: -2, b: 3, c: -4 }, '-14', '-2+3x(-4)');
contoh('VII-1', 5, { a: 24, b: 36, tanya: 'fpb' }, '12', 'FPB');
contoh('VII-1', 5, { a: 4, b: 6, tanya: 'kpk' }, '12', 'KPK');
contoh('VII-1', 6, { jenis: 'suhu', awal: -5, d: 12, arah: 'naik', kota: 'Dieng' }, '7', 'suhu');
contoh('VII-2', 1, { jenis: 'sederhana', p: 3, q: 4, k: 6 }, '3/4', '18/24');
contoh('VII-2', 2, { jenis: 'pd', p: 3, q: 4 }, '0,75', '3/4=0,75');
contoh('VII-2', 2, { jenis: 'dp', p: 3, q: 4 }, '3/4', '0,75=3/4');
contoh('VII-2', 2, { jenis: 'pp', p: 3, q: 4 }, '75', '3/4=75%');
contoh('VII-2', 3, { arah: 'besar', a: [3, 5], b: [5, 8] }, '5/8', '3/5 vs 5/8');
contoh('VII-2', 4, { op: '+', a: [2, 3], b: [1, 4] }, '11/12', '2/3+1/4');
contoh('VII-2', 5, { op: '/', a: [1, 2], b: [1, 4] }, '2', '1/2:1/4');
contoh('VII-2', 5, { op: '*', a: [2, 3], b: [9, 10] }, '3/5', '2/3x9/10');
contoh('VII-2', 6, { jenis: 'potong', nama: 'Rina', p: 3, q: 4, m: 2, benda: 'pita' }, '6', 'pita');
contoh('VII-3', 1, { jenis: 'biasa', p: 2, q: 3, k: 6 }, '2 : 3', '12:18');
contoh('VII-3', 2, { jenis: 'kelereng', a: 2, b: 3, m: 8, tanya: 'pertama', nama: NN }, '16', 'bagian 1');
contoh('VII-3', 2, { jenis: 'kelereng', a: 2, b: 3, m: 8, tanya: 'kedua', nama: NN }, '24', 'bagian 2');
contoh('VII-3', 3, { jenis: 'petaKeReal', S: 200000, cm: 3 }, '6', 'skala');
contoh('VII-3', 4, { jenis: 'kecepatan', v: 60, t: 2, kend: 'mobil', n: 2, u: 1000, item: ['beras', 'kg'] }, '60', 'laju');
contoh('VII-3', 5, { jenis: 'harga', a: 3, b: 7, u: 5000, cc: 10, benda: 'buku tulis', kk: 30 }, '35000', 'senilai');
contoh('VII-3', 6, { jenis: 'pekerja', w1: 6, d1: 10, w2: 4 }, '15', 'berbalik');
contoh('X-1', 1, { jenis: 'pangkat', a: 2, n: 5 }, '32', '2^5');
contoh('X-1', 1, { jenis: 'nol', a: 5 }, '1', '5^0');
contoh('X-1', 2, { jenis: 'kali', a: 2, m: 3, n: 4 }, '128', '2^3x2^4');
contoh('X-1', 2, { jenis: 'bagi', a: 3, m: 6, n: 4 }, '9', '3^6:3^4');
contoh('X-1', 3, { jenis: 'pp', a: 3, m: 2, n: 3 }, '729', '(3^2)^3');
contoh('X-1', 3, { jenis: 'neg', a: 2, n: 3 }, '1/8', '2^-3');
contoh('X-1', 4, { k: 6, m: 2, s: 1 }, '6√2', 'V72');
contoh('X-1', 5, { jenis: 'tambah', m: 3, k1: 2, k2: 3, s: 1 }, '5√3', 'V12+V27');
contoh('X-1', 6, { m: 3, b: 1, a: 6, s: 1 }, '2√3', '6/V3');
contoh('X-2', 1, { jenis: 'arit', a: 3, b: 4 }, '19', 'pola 3,7,11,15');
contoh('X-2', 2, { a: 3, b: 4, n: 10 }, '39', 'U10');
contoh('X-2', 3, { a: 2, q: 3, n: 5 }, '162', 'U5 geometri');
contoh('X-2', 4, { a: 3, b: 4, n: 10 }, '210', 'S10');
contoh('X-2', 5, { M: 1000000, p: 5, t: 3, tanya: 'total', v: 0 }, '1150000', 'bunga tunggal');
contoh('X-2', 6, { M: 1000000, p: 10, t: 2, v: 0 }, '1210000', 'bunga majemuk');
contoh('X-2', 5, { M: 1000000, p: 5, t: 3, tanya: 'total', v: 1 }, '1150000', 'bunga tunggal vokasi', 'vokasi');
contoh('H1', 1, { op: '+', a: 48, b: 37 }, '85', '48+37');
contoh('H2', 1, { v: 'tambah', t: 5, e: 2, b: 37 }, '85', 'bulatkan');
contoh('H2', 2, { a: 46, b: 7 }, '322', 'pecah');
contoh('H2', 3, { a: 25, b: 18 }, '450', 'gandakan');
contoh('H2', 4, { k: 1, N: 240 }, '36', '15% dari 240');
contoh('H2', 5, { m: 50, d: 1 }, '2499', '49x51');
contoh('H3', 1, { t: 0, n: NN, a: 36, b: 48 }, '84', 'bagian');
contoh('H3', 2, { t: 0, n: NN, a: 36, d: 12 }, '84', 'selisih');
contoh('H3', 3, { t: 0, n: NN, p: 3, q: 5, m: 8, mr: 2 }, '24', '3/5 dari 40');
contoh('H3', 4, { t: 0, n: NN, a: 2, b: 3, m: 8, besar: true }, '24', 'rasio 2:3 total 40');
contoh('H3', 6, { t: 0, n: NN, H: 80000, d: 25 }, '60000', 'diskon 25%');
contoh('H4', 1, { n: 7 }, '5625', '75^2');
contoh('H4', 2, { x: 4, y: 8 }, '528', '48x11');
contoh('H4', 3, { t: 4, u: 3 }, '2021', '43x47');
contoh('H4', 4, { n: 673 }, '327', '1000-673');
contoh('H4', 5, { x: 3, y: 6 }, '9118', '97x94');
contoh('H4', 6, { a: 48, b: 42 }, '2016', '48x42');
contoh('H5', 1, { d: [5, 2, 3] }, '5753', '523x11');
contoh('H5', 2, { d: [2, 1, 3] }, '2556', '213x12');
contoh('H5', 3, { n: 468 }, '2340', '468x5');

/* ---- Tahap 2: contoh tetap ---- */
const AN = ['Ani', 'Budi'];
contoh('VII-4', 1, { jenis: 'tambah', a: 4, x: 3, b: 5 }, '17', '4x+5, x=3');
contoh('VII-4', 2, { t: [{ c: 3, v: 'x' }, { c: 5, v: 'y' }, { c: -1, v: 'x' }, { c: 2, v: 'y' }], s: 1 }, '2x + 7y', '3x+5y-x+2y');
contoh('VII-4', 3, { jenis: 'dist', a: 3, b: 2, cc: -4, s: 1 }, '6x − 12', '3(2x-4)');
contoh('VII-4', 3, { jenis: 'kuadrat', p: 3, q: 4, s: 1 }, 'x² + 7x + 12', '(x+3)(x+4)');
contoh('VII-4', 4, { jenis: 'dasar', a: 3, b: 5, x: 5 }, '5', '3x+5=20');
contoh('VII-4', 5, { a: 3, b: -5, t: 5, rel: '>', s: 1 }, 'x > 5', '3x-5>10');
contoh('VII-4', 6, { k: 0, a: 2, b: 6, x: 5, nama: 'Dina' }, '5', 'cerita tabungan');
contoh('VII-4', 6, { k: 1, a: 3, b: 4, x: 5, nama: 'Dina' }, '5', 'cerita vokasi', 'vokasi');
contoh('VII-5', 1, { p: 3, q: 2, m1: 2, m2: 3, arah: 'besar' }, '9', '4x6 ~ 6x?');
contoh('VII-5', 2, { t: [4, 5, 6], k: 2, tanya: 2, arah: 'besar' }, '12', 'segitiga 4,5,6 ~ 8,10,12');
contoh('VII-5', 3, { i: 2, j: 3, m: 1, n: 4, tanya: 'tinggi', k: 0 }, '8', 'tiang dan bayangan');
contoh('VII-5', 4, { a: 2, b: 3, n: 2, jenis: 'de' }, '4', 'DE // BC');
contoh('VII-5', 5, { p: 3, q: 2, m: 10, jenis: 'luas' }, '90', 'luas 40 -> 90');
contoh('VII-5', 6, { p: 5, q: 2, m1: 2, m2: 3, arah: 'besar', k: 0 }, '15', 'foto diperbesar');
contoh('VII-6', 1, { jenis: 'nilai', vals: [20, 35, 50, 25], i: 2, j: 0, sk: 0 }, '50', 'diagram batang');
contoh('VII-6', 2, { mu: 80, data: [70, 80, 90], k: 0 }, '80', 'mean');
contoh('VII-6', 3, { jenis: 'median', data: [5, 9, 7, 6], k: 0 }, '6,5', 'median genap');
contoh('VII-6', 3, { jenis: 'modus', data: [5, 6, 6, 7], k: 0 }, '6', 'modus');
contoh('VII-6', 4, { jenis: 'banyak', N: 120, cnt: [30, 40, 20, 30], i: 1, sk: 0 }, '40', 'diagram lingkaran');
contoh('VII-6', 5, { awal: 6, f: [2, 6, 2], sk: 0 }, '7', 'rata-rata frekuensi');
contoh('VII-6', 6, { jenis: 'baru', n: 4, m: 80, d: 2, sk: 0 }, '90', 'rata-rata baru');
contoh('X-3', 1, { t: [3, 4, 5], m: 1, fn: 'sin' }, '3/5', 'sin A 3-4-5');
contoh('X-3', 2, { fn: 'sin', sd: 30, s: 1 }, '1 / 2', 'sin 30');
contoh('X-3', 2, { fn: 'tan', sd: 60, s: 2 }, '√3', 'tan 60');
contoh('X-3', 3, { jenis: 'sin30', c: 10, d: 5 }, '5', 'sin 30 sisi');
contoh('X-3', 4, { t: [5, 12, 13], f1: 'sin', f2: 'cos' }, '12/13', 'sin 5/13 -> cos');
contoh('X-3', 5, { jenis: 'elevasi45', c: 10, d: 20, k: 0, u: 2, pair: [3, 4] }, '20', 'elevasi 45');
contoh('X-3', 6, { i: 0, j: 1, op: '+' }, '1', 'sin30+cos60');
contoh('X-4', 1, { x: 7, y: 3, tanya: 'x' }, '7', 'x+y=10, x-y=4');
contoh('X-4', 2, { x: 3, y: 1, a1: 2, b1: 1, a2: 1, b2: -1, tanya: 'x' }, '3', '2x+y=7, x-y=2');
contoh('X-4', 3, { x: 3, y: 2, a1: 2, b1: 3, a2: 4, b2: 1, k: 0, tanya: 'y', nama: 'Ani' }, '2000', 'harga');
contoh('X-4', 6, { V: [[0, 0], [4, 0], [2, 2], [0, 3]], a: 2, b: 3, k: 0, nm: 0 }, '10', 'nilai maksimum');
contoh('X-5', 1, { p: 3, q: 4, tanya: 'besar' }, '4', 'x2-7x+12');
contoh('X-5', 2, { a: 2, p: 2, q: 3, tanya: 'besar' }, '3', '2x2-10x+12');
contoh('X-5', 3, { a: 1, b: -6, cc: 5 }, '16', 'diskriminan');
contoh('X-5', 4, { a: 1, h: 3, k: -4, jenis: 'yp' }, '-4', 'puncak y');
contoh('X-5', 4, { a: 1, h: 3, k: -4, jenis: 'xp' }, '3', 'puncak x');
contoh('X-5', 5, { p: 2, q: 3, s: 1 }, 'f(x) = x² − 5x + 6', 'fungsi dari akar');
contoh('X-5', 6, { jenis: 'bola', A: 2, B: 5, K: 20, C: 3 }, '20', 'tinggi maksimum');
contoh('X-6', 1, { jenis: 'frek', awal: 41, f: [4, 6, 8, 5, 2], i: 2 }, '8', 'histogram');
contoh('X-6', 2, { awal: 41, f: [2, 2, 2, 2], k: 4 }, '60,5', 'mean berkelompok');
contoh('X-6', 3, { awal: 41, f: [3, 6, 10, 4, 2], m: 2, d1: 4, d2: 6 }, '64,5', 'modus berkelompok');
contoh('X-6', 4, { jenis: 'q1', data: [12, 15, 18, 20, 25, 28, 30] }, '15', 'Q1');
contoh('X-6', 5, { mi: 10, q1: 20, q2: 30, q3: 45, ma: 60, jenis: 'iqr' }, '25', 'IQR');
contoh('X-6', 6, { jenis: 'gabung3', n: [10, 20, 10], m: [70, 80, 90] }, '80', 'gabungan');
contoh('X-7', 1, { jenis: 'dadu', k: 0, m: [2, 3, 4] }, '1/2', 'dadu genap');
contoh('X-7', 2, { jenis: 'dadu2', n: 3, a: 2, b: 2, cc: 2 }, '36', '2 dadu');
contoh('X-7', 3, { jenis: 'harapan', n: 200, pr: 30, q: 4, pp: 1 }, '60', 'frekuensi harapan');
contoh('X-7', 4, { jenis: 'dadu', k: 0 }, '2/3', 'genap atau >4');
contoh('X-7', 5, { jenis: 'dua dadu', j: 7, m: 2, b: 2, h: 1 }, '1/6', 'jumlah 7');
contoh('X-7', 6, { jenis: 'satu', N: 20, cc: 5, pr: 10, n: 100, k: 0 }, '3/4', 'peluang tidak cacat');
// H3 tampil bentuk SVG
const sH3 = CP.peta.H3.bangun(1, { t: 0, n: NN, a: 36, b: 48 });
cek(CP.peta.H3.gambar(sH3).indexOf('<svg') === 0, 'gambar H3 contoh');

/* ---------- 3. Pemeriksa jawaban ---------- */
bagian('3. Pemeriksa jawaban');
const tiga4 = CP.S.pecahan('x', CP.P(3, 4), { sederhana: false });
['0,75', '0.75', '3/4', '6/8', ' 3/4 '].forEach((x) => cek(CP.periksaJawaban(tiga4, x), '3/4 harus menerima "' + x + '"'));
['0,7', '2/3', '', 'abc', '3/0', '1,2,3'].forEach((x) => cek(!CP.periksaJawaban(tiga4, x), '3/4 harus menolak "' + x + '"'));
const sed = CP.S.pecahan('x', CP.P(3, 4));
cek(CP.periksaJawaban(sed, '3/4'), 'sederhana menerima 3/4');
cek(!CP.periksaJawaban(sed, '6/8'), 'sederhana menolak 6/8');
cek(!CP.periksaJawaban(sed, '0,75'), 'sederhana menolak 0,75');
const bil = CP.S.angka('x', -4, { izin: { minus: true } });
['-4', '−4', '-4,0', '-8/2'].forEach((x) => cek(CP.periksaJawaban(bil, x), '-4 harus menerima "' + x + '"'));
const ribu = CP.S.angka('x', 1250000);
['1250000', '1.250.000'].forEach((x) => cek(CP.periksaJawaban(ribu, x), 'ribuan "' + x + '"'));
const bulatSed = CP.S.pecahan('x', CP.P(2, 1));
cek(CP.periksaJawaban(bulatSed, '2') && CP.periksaJawaban(bulatSed, '4/2'), 'jawaban bulat pada soal pecahan');
cek(CP.desimalStr(CP.P(3, 4)) === '0,75' && CP.desimalStr(CP.P(1, 3)) === null && CP.desimalStr(CP.P(1250, 1)) === '1.250', 'desimalStr');
cek(CP.angka(1250000) === '1.250.000' && CP.angka(-5) === '−5' && CP.rp(15000) === 'Rp15.000', 'format angka Indonesia');

/* ---------- 4. Mesin adaptif ---------- */
bagian('4. Mesin adaptif');
const rw = (arr) => arr.map((x) => ({ b: x[0], w: x[1] }));
cek(CP.evaluasiLevel(rw([[1, 5], [1, 5], [1, 5], [1, 5], [0, 5]]), 2, 10).aksi === 'naik', '4 benar cepat -> naik');
cek(CP.evaluasiLevel(rw([[1, 5], [1, 5], [1, 5], [1, 5], [1, 5]]), 2, 10).level === 3, 'level naik jadi 3');
cek(CP.evaluasiLevel(rw([[1, 15], [1, 15], [1, 15], [1, 15], [1, 15]]), 2, 10).aksi === 'tetap', '4+ benar tapi lambat -> tetap');
cek(CP.evaluasiLevel(rw([[0, 5], [1, 5], [0, 5], [0, 5], [1, 5]]), 3, 10).aksi === 'turun', '2 benar -> turun');
cek(CP.evaluasiLevel(rw([[0, 5], [0, 5], [0, 5], [0, 5], [0, 5]]), 1, 10).aksi === 'tetap', 'level 1 tidak turun');
cek(CP.evaluasiLevel(rw([[1, 5], [1, 5], [0, 5], [0, 5], [1, 5]]), 3, 10).aksi === 'tetap', '3 benar -> tetap');
cek(CP.evaluasiLevel(rw([[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]]), 6, 10).aksi === 'tetap', 'level 6 tidak naik lagi');
cek(CP.evaluasiLevel(rw([[1, 1], [1, 1], [1, 1]]), 2, 10).aksi === 'tetap', 'kurang dari 5 jawaban -> tetap');
cek(CP.evaluasiLevel(rw([[0, 5], [0, 5], [0, 5], [1, 5], [0, 5], [1, 5], [0, 5], [1, 5]]), 2, 10).aksi === 'tetap', 'hanya 5 terakhir yang dihitung (3 benar -> tetap)');
{ // rangkaian simulasi lewat catatJawaban
  const rec = CP.catatBaru();
  for (let i = 0; i < 12; i++) CP.catatJawaban(rec, { benar: true, detik: 3, jenis: 'x', level: 1 }, '2026-01-01');
  cek(rec.riwayat.length === 10 && rec.n === 12, 'riwayat 10 jawaban terakhir');
  const e = CP.evaluasiLevel(rec.riwayat, rec.level, 10);
  cek(e.aksi === 'naik', 'simulasi naik');
  CP.catatJawaban(rec, { benar: false, detik: 3, jenis: 'j1', level: 1 }, '2026-01-01');
  cek(rec.salah.length === 1 && rec.salah[0].jenis === 'j1', 'jenis salah tercatat');
  CP.catatJawaban(rec, { benar: true, detik: 3, jenis: 'j1', level: 1, ulangan: true }, '2026-01-01');
  cek(rec.salah.length === 0, 'jenis salah hilang jika ulangan dijawab benar');
}
{ // sesi: 20% ulangan
  const m = CP.peta['VII-1']; const rec = CP.catatBaru(); rec.salah = [{ jenis: 'kali', level: 3 }]; rec.level = 3;
  const sesi = CP.susunSesi(m, rec, CP.buatRng(5), 'umum');
  cek(sesi.length === 10 && sesi.filter((s) => s.ulangan).length === 2, 'sesi 10 soal, 2 ulangan (20%)');
  cek(sesi.filter((s) => s.ulangan).every((s) => s.jenis === 'kali'), 'ulangan memakai jenis yang pernah salah');
  const rec2 = CP.catatBaru();
  cek(CP.susunSesi(m, rec2, CP.buatRng(5), 'umum').filter((s) => s.ulangan).length === 0, 'tanpa riwayat salah tidak ada ulangan');
}
{ // streak
  const h = { '2026-03-01': 1, '2026-03-02': 2, '2026-03-03': 1 };
  cek(CP.hitungStreak(h, '2026-03-03') === 3, 'streak 3 hari');
  cek(CP.hitungStreak(h, '2026-03-04') === 3, 'streak bertahan sampai hari berganti');
  cek(CP.hitungStreak(h, '2026-03-05') === 0, 'streak putus');
  cek(CP.geserHari('2026-03-01', -1) === '2026-02-28' && CP.selisihHari('2026-02-28', '2026-03-03') === 3, 'hitungan hari');
}

/* ---------- 5. Registri ---------- */
bagian('5. Registri');
const harapan = { VII: 6, VIII: 5, IX: 4 };
Object.keys(harapan).forEach((k) => cek(CP.REG.filter((m) => m.kelas === k && m.kategori === 'umum').length === harapan[k], 'jumlah bab kelas ' + k));
cek(CP.REG.filter((m) => m.kelas === 'X' && m.kategori === 'umum').length === 7, 'bab X');
cek(CP.REG.filter((m) => m.kelas === 'XI' && m.kategori === 'umum').length === 3, 'bab XI umum');
cek(CP.REG.filter((m) => m.kelas === 'XII' && m.kategori === 'umum').length === 3, 'bab XII umum');
cek(CP.REG.filter((m) => m.kelas === 'XI' && m.kategori === 'lanjut').length === 5, 'bab XI TL');
cek(CP.REG.filter((m) => m.kelas === 'XII' && m.kategori === 'lanjut').length === 5, 'bab XII TL');
cek(CP.REG.filter((m) => m.kategori === 'hitungCepat').length === 6, 'H1-H6');
cek(new Set(CP.REG.map((m) => m.id)).size === CP.REG.length, 'id modul unik');
CP.KONFIG.urutKelas.forEach((kelas) => {
  ['SMP', 'SMA', 'SMK'].forEach((jenjang) => {
    if (CP.KONFIG.jenjang[jenjang].kelas.indexOf(kelas) < 0) return;
    const { sekolah } = CP.modulUntukProfil({ jenjang, kelas, tl: false });
    cek(sekolah.length > 0, 'ada bab untuk ' + jenjang + ' ' + kelas);
  });
});
cek(CP.modulUntukProfil({ jenjang: 'SMA', kelas: 'XI', tl: true }).sekolah.length === 8, 'SMA XI + TL = 8 bab');
cek(CP.modulUntukProfil({ jenjang: 'SMA', kelas: 'XI', tl: false }).sekolah.length === 3, 'SMA XI umum = 3 bab');
cek(CP.modulUntukProfil({ jenjang: 'SMK', kelas: 'XI', tl: true }).sekolah.length === 3, 'SMK tidak punya TL');
cek(CP.modulUntukProfil({ jenjang: 'SMP', kelas: 'VII', tl: false }).sekolah.length === 6, 'SMP VII = 6 bab');
const BAB_SEGERA = CP.REG.filter((m) => m.status === 'segera');
BAB_SEGERA.forEach((m) => { cek(typeof m.generator !== 'function', 'bab segera tidak boleh punya generator: ' + m.id); });
cek(['VII-1', 'VII-2', 'VII-3', 'X-1', 'X-2', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].every((id) => CP.peta[id].status === 'aktif'), 'bab Tahap 1 aktif');
cek(CP.REG.filter((m) => m.status === 'aktif').length === 19, 'tepat 19 modul aktif (Tahap 1 + Tahap 2)');
cek(['VII-4', 'VII-5', 'VII-6', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7'].every((id) => CP.peta[id].status === 'aktif'), 'bab Tahap 2 aktif');
cek(CP.REG.filter((m) => m.status === 'aktif').every((m) => m.level.length === 6 || (m.id === 'H5' && m.level.length === 4)), 'level tiap modul');
cek(CP.peta['VIII-1'].status === 'segera' && CP.peta['XI-TL-3'].judul === 'Matriks', 'bab segera terdaftar dengan judul');
cek(CP.peta['XII-TL-2'].judul === 'Limit' && CP.peta['IX-2'].perluGambar === true, 'detail registri');
try { CP.peta['VIII-1'].generator(1); cek(false, 'bab segera dapat dilatih'); } catch (e) { cek(true, ''); }
cek(CP.targetModul(CP.peta.H1, 1) === 10 && CP.targetModul(CP.peta.H1, 6) === 30 && CP.targetModul(CP.peta['VII-1'], 1) === 30 && CP.targetModul(CP.peta['VII-1'], 6) === 90, 'target waktu awal');

/* ---------- 6. Profil dan naik kelas ---------- */
bagian('6. Profil');
function memStore() { const o = {}; return { getItem: (k) => (k in o ? o[k] : null), setItem: (k, v) => { o[k] = v; }, _o: o }; }
{
  const data = CP.dataBaru();
  cek(CP.validasiUsername('Dina_7') && !CP.validasiUsername('ab') && !CP.validasiUsername('a b c') && !CP.validasiUsername('namayangsangatpanjang'), 'validasi username');
  const pr = CP.buatProfil(data, { username: 'Dina_7', jenjang: 'SMP', kelas: 'VII' });
  cek(pr.kelas === 'VII' && data.aktif === 'Dina_7', 'profil dibuat');
  let galat = false; try { CP.buatProfil(data, { username: 'Dina_7', jenjang: 'SMP', kelas: 'VII' }); } catch (e) { galat = true; }
  cek(galat, 'username ganda ditolak');
  galat = false; try { CP.buatProfil(data, { username: 'Budi', jenjang: 'SMP', kelas: 'X' }); } catch (e) { galat = true; }
  cek(galat, 'kelas tidak cocok ditolak');
  cek(CP.buatProfil(data, { username: 'Eko', jenjang: 'SMA', kelas: 'XI', tl: true }).tl === true, 'SMA XI boleh Tingkat Lanjut');
  cek(CP.buatProfil(data, { username: 'Fira', jenjang: 'SMK', kelas: 'XI', tl: true }).tl === false, 'SMK tidak boleh Tingkat Lanjut');
  cek(CP.buatProfil(data, { username: 'Gani', jenjang: 'SMA', kelas: 'X', tl: true }).tl === false, 'SMA X tidak Tingkat Lanjut');
  // progres
  const rec = CP.catatBaru(); rec.level = 3; for (let i = 0; i < 12; i++) CP.catatJawaban(rec, { benar: i % 3 !== 0, detik: 20, jenis: 'x', level: 3 }, '2026-04-01');
  pr.topik['VII-1'] = rec; CP.catatSesi(pr, { modul: 'VII-1', level: 3, n: 10, b: 7, rata: 20 }, '2026-04-01');
  const salinan = JSON.stringify(pr.topik);
  CP.naikKelas(pr);
  cek(pr.kelas === 'VIII' && pr.jenjang === 'SMP', 'naik ke VIII');
  cek(JSON.stringify(pr.topik) === salinan && pr.riwayatKelas.length === 1 && pr.riwayatKelas[0].kelas === 'VII', 'progres lama dipertahankan');
  cek(CP.modulUntukProfil(pr).sekolah.some((m) => m.id === 'VIII-1') && pr.topik['VII-1'].level === 3, 'bab kelas baru muncul, level lama utuh');
  CP.naikKelas(pr); cek(pr.kelas === 'IX', 'naik ke IX');
  const nx = CP.kelasBerikut(pr); cek(nx.pilihJenjang && nx.pilihJenjang.length === 2, 'dari IX harus pilih SMA/SMK');
  galat = false; try { CP.naikKelas(pr); } catch (e) { galat = true; } cek(galat, 'naik dari IX tanpa pilih jenjang ditolak');
  CP.naikKelas(pr, 'SMK'); cek(pr.jenjang === 'SMK' && pr.kelas === 'X' && pr.riwayatKelas.length === 3 && pr.topik['VII-1'].n === 12, 'IX -> SMK X, progres utuh');
  CP.naikKelas(pr); CP.naikKelas(pr); galat = false; try { CP.naikKelas(pr); } catch (e) { galat = true; } cek(galat && pr.kelas === 'XII', 'berhenti di XII');
  // penyimpanan + gagal
  const st = new CP.Simpan(memStore()); const d = st.muat(); CP.buatProfil(d, { username: 'Uji_1', jenjang: 'SMP', kelas: 'VII' }); st.simpan();
  const st2 = new CP.Simpan(st.store); cek(st2.muat().profil.Uji_1.kelas === 'VII', 'simpan dan muat');
  const rusak = new CP.Simpan({ getItem() { throw new Error('x'); }, setItem() { throw new Error('penuh'); } });
  const dm = rusak.muat(); cek(rusak.bermasalah && dm.versi === 1, 'localStorage gagal: pakai memori + tandai bermasalah');
  cek(rusak.simpan() === false && rusak.bermasalah, 'simpan gagal tidak melempar galat');
  const korup = new CP.Simpan({ getItem: () => '{bukan json', setItem() {} }); cek(korup.muat().versi === 1, 'data korup -> data baru');
  const lama = new CP.Simpan({ getItem: () => JSON.stringify({ profil: { A_1: { username: 'A_1' } } }), setItem() {} }); cek(lama.muat().versi === 1 && lama.mem.ortu, 'migrasi data tanpa versi');
}

/* ---------- 7. Laporan orang tua ---------- */
bagian('7. Laporan orang tua');
const prLap = (() => {
  const data = CP.dataBaru();
  const p = CP.buatProfil(data, { username: 'Dina_7', jenjang: 'SMP', kelas: 'VII' });
  ['VII-1', 'VII-2', 'H1'].forEach((id, i) => {
    const rec = CP.catatBaru(); rec.level = 2 + i;
    for (let j = 0; j < 14; j++) CP.catatJawaban(rec, { benar: j % (i + 2) !== 0, detik: 12 + i, jenis: 'x', level: rec.level }, '2026-05-10');
    p.topik[id] = rec;
  });
  CP.catatSesi(p, { modul: 'VII-1', level: 2, n: 10, b: 8, rata: 12 }, '2026-05-09');
  CP.catatSesi(p, { modul: 'VII-2', level: 3, n: 10, b: 6, rata: 14 }, '2026-05-10');
  return p;
})();
{
  const lap = CP.buatLaporan(prLap, '2026-05-10');
  cek(lap.u === 'Dina_7' && lap.s === 2 && lap.m === 20 && lap.tp.length === 3, 'isi laporan (streak, soal minggu ini, topik)');
  const teks = CP.teksLaporan(lap);
  cek(/CP1:/.test(teks) && /Streak: 2 hari/.test(teks) && /Akurasi: \d+%/.test(teks), 'ringkasan teks + kode CP1');
  const wa = '[10.05, 19.30] Dina: Halo Ayah, ini laporanku!\n' + teks + '\nSampai ketemu di rumah :)\n[10.06] Ayah: oke';
  const hasil = CP.bacaLaporan(wa);
  cek(hasil.lap && JSON.stringify(hasil.lap) === JSON.stringify(lap), 'kode terbaca dari pesan WhatsApp lengkap');
  cek(CP.bacaLaporan('halo tanpa kode').galat && CP.bacaLaporan('CP1:@@@').galat && CP.bacaLaporan('CP1:' + CP.b64e('{"v":2}')).galat, 'kode salah ditolak dengan pesan');
  const unik = CP.buatLaporan(Object.assign({}, prLap, { username: 'Aku_é' }), '2026-05-10');
  cek(CP.bacaLaporan(CP.teksLaporan(unik)).lap.u === 'Aku_é', 'karakter non-ASCII aman');
  const data = CP.dataBaru();
  CP.terimaLaporan(data, lap, '2026-05-10');
  cek(data.ortu.laporan.Dina_7.sebelumnya === null && CP.bandingLaporan(data.ortu.laporan.Dina_7) === null, 'laporan pertama tanpa pembanding');
  const lap2 = Object.assign({}, lap, { t: '2026-05-17', a: lap.a + 5, m: lap.m + 15, s: 4 });
  CP.terimaLaporan(data, lap2, '2026-05-17');
  const rec = data.ortu.laporan.Dina_7;
  cek(rec.terbaru.t === '2026-05-17' && rec.sebelumnya.t === '2026-05-10', 'laporan baru menggantikan yang lama');
  const b = CP.bandingLaporan(rec); cek(b.akurasi === 5 && b.soal === 15 && b.streak === 2, 'perbandingan naik/turun');
  CP.setPin(data, '1234'); cek(CP.cekPin(data, '1234') && !CP.cekPin(data, '1235') && data.ortu.pin !== '1234', 'PIN 4 angka tersimpan sebagai hash');
  let g = false; try { CP.setPin(data, '12a4'); } catch (e) { g = true; } cek(g, 'PIN harus 4 angka');
}

/* ---------- 8. Cadangan ---------- */
bagian('8. Cadangan');
{
  const data = CP.dataBaru();
  data.profil.Dina_7 = prLap; data.aktif = 'Dina_7';
  CP.terimaLaporan(data, CP.buatLaporan(prLap, '2026-05-10'), '2026-05-10'); CP.setPin(data, '4321');
  const kode = CP.buatCadangan(data);
  cek(kode.indexOf('CPB1:') === 0, 'kode diawali CPB1:');
  const pulih = CP.pulihkan('Cadangan saya:\n' + kode + '\n');
  cek(pulih.data && JSON.stringify(pulih.data) === JSON.stringify(data), 'salin lalu tempel mengembalikan data persis sama');
  cek(CP.pulihkan('tidak ada').galat && CP.pulihkan('CPB1:xyz!').galat && CP.pulihkan('CPB1:' + CP.b64e('[1,2]')).galat, 'cadangan salah ditolak');
  console.log('  ukuran kode cadangan contoh: ' + kode.length + ' karakter');
}

/* ---------- ringkasan ---------- */
console.log('\n=============================');
console.log('LULUS: ' + lulus + '   GAGAL: ' + gagal);
if (gagal) { console.log('\nContoh kegagalan (maks 60):'); daftarGagal.forEach((x) => console.log(' - ' + x)); process.exitCode = 1; }
else console.log('Semua pengujian lulus.');
