/* CepatPaham - modul Hitung Cepat (Tahap 1): H1, H2, H4, H5, H6 (H3 ada di cerita.js) */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd } = CP;
  const F = CP.angka, O = CP.op, MIN = CP.MIN;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const dua = (n) => (n < 10 ? '0' + n : String(n));
  const digit = (n) => String(n).split('').map(Number);
  const dariDigit = (d) => d.reduce((a, x) => a * 10 + x, 0);
  // gabungkan komponen digit (kiri ke kanan) dengan simpanan, kembalikan angka
  function gabung(komp) {
    let c = 0; const out = [];
    for (let i = komp.length - 1; i >= 0; i--) { const v = komp[i] + c; out.unshift(v % 10); c = Math.floor(v / 10); }
    if (c > 0) out.unshift(c);
    return dariDigit(out);
  }

  /* ================= H1 DRILL BERJENJANG ================= */
  const h1 = [];
  h1[0] = lv('Penjumlahan dan pengurangan 2 digit', '48 + 37 = 85', 'angka',
    (r, c) => {
      const op = pilihJenis(r, c, ['+', '-']);
      let a = r.bulat(11, 99), b = r.bulat(11, 99);
      if (op === '-' && a <= b) { const t = a; a = b; b = t; if (a === b) a++; }
      return { op, a, b };
    },
    ({ op, a, b }) => {
      const pa = a - (a % 10), pb = b - (b % 10), sa = a % 10, sb = b % 10;
      const v = op === '+' ? (pa + pb) + (sa + sb) : (pa - pb) + (sa - sb);
      return S.angka(F(a) + ' ' + (op === '+' ? '+' : MIN) + ' ' + F(b) + ' = …', op === '+' ? a + b : a - b, { jenis: op === '+' ? 'tambah' : 'kurang', langkah: [
        st('Pisahkan puluhan dan satuan: ' + a + ' = ' + pa + ' + ' + sa + ' dan ' + b + ' = ' + pb + ' + ' + sb + '.'),
        st('Puluhan: ' + pa + (op === '+' ? ' + ' : ' − ') + pb + ' = ' + (op === '+' ? pa + pb : pa - pb) + '. Satuan: ' + sa + (op === '+' ? ' + ' : ' − ') + sb + ' = ' + (op === '+' ? sa + sb : sa - sb) + '.'),
        st('Gabungkan: ' + v + '.', v)] });
    });
  h1[1] = lv('Perkalian 1 digit × 2 digit', '7 × 46 = 322', 'angka',
    (r) => ({ a: r.bulat(2, 9), b: r.bulat(11, 99) }),
    ({ a, b }) => {
      const t = b - (b % 10), s = b % 10; const v = a * t + a * s;
      return S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'kali1', langkah: [
        st('Pecah ' + b + ' = ' + t + ' + ' + s + '.'),
        st(a + ' × ' + t + ' = ' + (a * t) + ' dan ' + a + ' × ' + s + ' = ' + (a * s) + '.'),
        st('Jumlahkan: ' + (a * t) + ' + ' + (a * s) + ' = ' + F(v) + '.', v)] });
    });
  h1[2] = lv('Operasi bilangan bulat negatif', '−47 + 25 = −22', 'angka',
    (r, c) => {
      const op = pilihJenis(r, c, ['+', '-']);
      let a, b; do { a = r.bulat(11, 99) * r.pilih([-1, 1]); b = r.bulat(11, 99) * r.pilih([-1, 1]); } while (a > 0 && b > 0 && op === '+');
      return { op, a, b };
    },
    ({ op, a, b }) => {
      const b2 = op === '+' ? b : -b;
      const j = CP.tambahJalur(a, b2);
      const langkah = [];
      if (op === '-') langkah.push(st('Mengurangi = menambah lawannya: ' + F(a) + ' − ' + O(b) + ' = ' + F(a) + ' + ' + O(b2) + '.'));
      langkah.push(st(j.t)); langkah.push(st('Hasilnya ' + F(j.v) + '.', j.v));
      return S.angka(F(a) + ' ' + (op === '+' ? '+' : MIN) + ' ' + O(b) + ' = …', op === '+' ? a + b : a - b, { jenis: op === '+' ? 'tambah' : 'kurang', izin: { minus: true }, langkah });
    });
  h1[3] = lv('Penjumlahan dan pengurangan 3 digit', '478 + 356 = 834', 'angka',
    (r, c) => {
      const op = pilihJenis(r, c, ['+', '-']);
      let a = r.bulat(101, 999), b = r.bulat(101, 999);
      if (op === '-' && a <= b) { const t = a; a = b; b = t; if (a === b) a++; }
      return { op, a, b };
    },
    ({ op, a, b }) => {
      const ra = a - (a % 100), rb = b - (b % 100), sa = a % 100, sb = b % 100;
      const v = op === '+' ? (ra + rb) + (sa + sb) : (ra - rb) + (sa - sb);
      return S.angka(F(a) + ' ' + (op === '+' ? '+' : MIN) + ' ' + F(b) + ' = …', op === '+' ? a + b : a - b, { jenis: op === '+' ? 'tambah' : 'kurang', langkah: [
        st('Pisahkan ratusan dan sisanya: ' + a + ' = ' + ra + ' + ' + sa + ' dan ' + b + ' = ' + rb + ' + ' + sb + '.'),
        st('Ratusan: ' + (op === '+' ? ra + rb : ra - rb) + '. Sisanya: ' + sa + (op === '+' ? ' + ' : ' − ') + sb + ' = ' + (op === '+' ? sa + sb : sa - sb) + '.'),
        st('Gabungkan: ' + F(v) + '.', v)] });
    });
  const RAMAH = [11, 12, 15, 20, 25, 30, 40, 50];
  h1[4] = lv('Perkalian 2 digit × 2 digit (bilangan ramah)', '25 × 16 = 400', 'angka',
    (r) => { const a = r.pilih(RAMAH); let b; do { b = r.bulat(12, 49); } while (b === a); return { a, b }; },
    ({ a, b }) => {
      let t, v, dibagi;
      if (a === 11) { t = b + ' × 10 = ' + (b * 10) + ', lalu + ' + b + ' = ' + (b * 10 + b) + '.'; v = b * 10 + b; }
      else if (a === 12) { t = b + ' × 10 = ' + (b * 10) + ' dan ' + b + ' × 2 = ' + (b * 2) + ', jumlah = ' + (b * 10 + b * 2) + '.'; v = b * 10 + b * 2; }
      else if (a === 15) { t = b + ' × 10 = ' + (b * 10) + ', setengahnya ' + (b * 5) + '; jumlah = ' + (b * 10 + b * 5) + '.'; v = b * 10 + (b * 10) / 2; dibagi = [{ a: b * 10, b: 2 }]; }
      else if (a === 20) { t = b + ' × 2 = ' + (b * 2) + ', lalu × 10 = ' + (b * 20) + '.'; v = b * 2 * 10; }
      else if (a === 25) { t = b + ' × 100 = ' + (b * 100) + ', lalu ÷ 4 = ' + (b * 25) + '.'; v = (b * 100) / 4; dibagi = [{ a: b * 100, b: 4 }]; }
      else if (a === 30) { t = b + ' × 3 = ' + (b * 3) + ', lalu × 10 = ' + (b * 30) + '.'; v = b * 3 * 10; }
      else if (a === 40) { t = b + ' × 4 = ' + (b * 4) + ', lalu × 10 = ' + (b * 40) + '.'; v = b * 4 * 10; }
      else { t = b + ' × 100 = ' + (b * 100) + ', lalu ÷ 2 = ' + (b * 50) + '.'; v = (b * 100) / 2; dibagi = [{ a: b * 100, b: 2 }]; }
      const s = S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'ramah' + a, langkah: [
        st('Bilangan ' + a + ' itu ramah: pecah menjadi langkah mudah.'), st(t), st('Hasilnya ' + F(v) + '.', v)] });
      if (dibagi) s.dibagi = dibagi;
      return s;
    });
  const SUBH1 = h1.slice(0, 5);
  h1[5] = lv('Campuran, termasuk pembagian habis', '144 ÷ 12 = 12', 'angka',
    (r, c) => {
      const k = c.jenis && /^L\d$/.test(c.jenis) ? parseInt(c.jenis.slice(1), 10) - 1 : r.bulat(0, 5);
      if (k === 5) { const d = r.bulat(2, 12), q = r.bulat(2, 30); return { k, a: q * d, d, q }; }
      return { k, p: SUBH1[k].acak(r, { jenis: undefined, konteks: c.konteks }) };
    },
    (p) => {
      if (p.k === 5) {
        const s = S.angka(F(p.a) + ' ÷ ' + p.d + ' = …', p.q, { jenis: 'L6', langkah: [
          st('Cari bilangan yang jika dikali ' + p.d + ' hasilnya ' + F(p.a) + '.'),
          st(p.d + ' × ' + p.q + ' = ' + F(p.a) + ', jadi hasilnya ' + p.q + '.', P(p.a, p.d))] });
        s.dibagi = [{ a: p.a, b: p.d }];
        return s;
      }
      const s = SUBH1[p.k].bangun(p.p, { konteks: 'umum' });
      s.jenis = 'L' + (p.k + 1);
      return s;
    });
  CP.aktifkan('H1', { level: h1 });

  /* ================= H2 HITUNG MENTAL ================= */
  const h2 = [];
  h2[0] = lv('Pembulatan lalu koreksi', '48 + 37 = 50 + 37 − 2 = 85', 'angka',
    (r) => ({ v: r.pilih(['tambah', 'kurang']), t: r.bulat(3, 9), e: r.bulat(1, 3), b: r.bulat(11, 79) }),
    ({ v, t, e, b }) => {
      const dekat = 10 * t - e;
      if (v === 'tambah') {
        const x = dekat, lingkar = x + e, v1 = lingkar + b, v2 = v1 - e;
        return S.angka(x + ' + ' + b + ' = …', x + b, { jenis: 'bulat+', langkah: [
          st('Bulatkan ' + x + ' menjadi ' + lingkar + ' (kelebihan ' + e + ').'),
          st(lingkar + ' + ' + b + ' = ' + v1 + '.'), st('Kurangi kelebihannya: ' + v1 + ' − ' + e + ' = ' + v2 + '.', v2)] });
      }
      const x = 10 * t + b + 10; const y = dekat; const lingkar = y + e;
      const v1 = x - lingkar, v2 = v1 + e;
      return S.angka(x + ' − ' + y + ' = …', x - y, { jenis: 'bulat-', langkah: [
        st('Bulatkan ' + y + ' menjadi ' + lingkar + ' (kelebihan ' + e + ').'),
        st(x + ' − ' + lingkar + ' = ' + v1 + '.'), st('Kurangi terlalu banyak, jadi tambahkan ' + e + ': ' + v1 + ' + ' + e + ' = ' + v2 + '.', v2)] });
    });
  h2[1] = lv('Pecah angka', '46 × 7 = 280 + 42 = 322', 'angka',
    (r) => { let a; do { a = r.bulat(12, 99); } while (a % 10 === 0); return { a, b: r.bulat(3, 9) }; },
    ({ a, b }) => {
      const t = a - (a % 10), s = a % 10, v = t * b + s * b;
      return S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'pecah', langkah: [
        st('Pecah ' + a + ' menjadi ' + t + ' + ' + s + '.'),
        st(t + ' × ' + b + ' = ' + (t * b) + ' dan ' + s + ' × ' + b + ' = ' + (s * b) + '.'),
        st('Jumlahkan: ' + (t * b) + ' + ' + (s * b) + ' = ' + v + '.', v)] });
    });
  h2[2] = lv('Gandakan dan bagi dua', '25 × 18 = 50 × 9 = 450', 'angka',
    (r) => ({ a: r.pilih([5, 15, 25, 35, 45]), b: 2 * r.bulat(4, 20) }),
    ({ a, b }) => {
      const v = (2 * a) * (b / 2);
      const s = S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'gandakan', langkah: [
        st('Gandakan ' + a + ' menjadi ' + (2 * a) + ' dan bagi dua ' + b + ' menjadi ' + (b / 2) + ' (hasil kali tidak berubah).'),
        st((2 * a) + ' × ' + (b / 2) + ' = ' + F(v) + '.', v)] });
      s.dibagi = [{ a: b, b: 2 }];
      return s;
    });
  h2[3] = lv('Persen cepat lewat 10% dan 5%', '15% dari 240 = 24 + 12 = 36', 'angka',
    (r) => ({ k: r.bulat(1, 8), N: 20 * r.bulat(2, 30) }),
    ({ k, N }) => {
      const p10 = N / 10, p5 = p10 / 2, v = k * p10 + p5;
      const s = S.angka((10 * k + 5) + '% dari ' + F(N) + ' = …', ((10 * k + 5) * N) / 100, { jenis: 'persen', langkah: [
        st('Pecah ' + (10 * k + 5) + '% = ' + (10 * k) + '% + 5%. Cari 10% dulu: ' + F(N) + ' ÷ 10 = ' + p10 + '.'),
        st(k > 1 ? (10 * k) + '% = ' + k + ' × ' + p10 + ' = ' + (k * p10) + '; 5% = setengah 10% = ' + p5 + '.' : '10% = ' + p10 + '; 5% = setengah 10% = ' + p5 + '.'),
        st('Jumlahkan: ' + (k * p10) + ' + ' + p5 + ' = ' + F(v) + '.', v)] });
      s.dibagi = [{ a: N, b: 10 }, { a: p10, b: 2 }];
      return s;
    });
  h2[4] = lv('Pola selisih kuadrat', '49 × 51 = 50² − 1 = 2.499', 'angka',
    (r) => ({ m: 5 * r.bulat(3, 19), d: r.bulat(1, 5) }),
    ({ m, d }) => {
      const v = m * m - d * d;
      return S.angka((m - d) + ' × ' + (m + d) + ' = …', (m - d) * (m + d), { jenis: 'selisih', langkah: [
        st('Kedua bilangan berjarak sama dari ' + m + ': ' + (m - d) + ' = ' + m + ' − ' + d + ' dan ' + (m + d) + ' = ' + m + ' + ' + d + '.'),
        st('Pola (m − d)(m + d) = m² − d² = ' + m + '² − ' + d + '² = ' + F(m * m) + ' − ' + (d * d) + '.'),
        st('Hasilnya ' + F(v) + '.', v)] });
    });
  const SUBH2 = h2.slice(0, 5);
  h2[5] = lv('Campuran semua trik', 'Semua trik di atas', 'angka',
    (r, c) => { const k = c.jenis && /^T\d$/.test(c.jenis) ? parseInt(c.jenis.slice(1), 10) - 1 : r.bulat(0, 4); return { k, p: SUBH2[k].acak(r, { konteks: c.konteks }) }; },
    (p) => { const s = SUBH2[p.k].bangun(p.p, { konteks: 'umum' }); s.jenis = 'T' + (p.k + 1); return s; });
  CP.aktifkan('H2', { level: h2 });

  /* ================= H4 VEDIC MATH ================= */
  const h4 = [];
  h4[0] = lv('Kuadrat bilangan berakhiran 5', '75² → 7×8 = 56 → 5.625', 'angka',
    (r) => ({ n: r.bulat(1, 9) }),
    ({ n }) => {
      const u = n * (n + 1), x = 10 * n + 5;
      return S.angka(x + '² = …', x * x, { jenis: 'kuadrat5', langkah: [
        st('Bilangan ' + x + ' berakhiran 5. Kalikan angka depannya (' + n + ') dengan angka berikutnya (' + (n + 1) + '): ' + n + ' × ' + (n + 1) + ' = ' + u + '.'),
        st('Tulis 25 di belakangnya: ' + u + '25.'), st('Hasilnya ' + F(u * 100 + 25) + '.', u * 100 + 25)] });
    });
  h4[1] = lv('Kali 11 untuk 2 digit', '48 × 11 = 4 | 12 | 8 = 528', 'angka',
    (r) => ({ x: r.bulat(1, 9), y: r.bulat(1, 9) }),
    ({ x, y }) => {
      const a = 10 * x + y, v = gabung([x, x + y, y]);
      return S.angka(a + ' × 11 = …', a * 11, { jenis: 'kali11', langkah: [
        st('Tulis angka depan ' + x + ', jumlah kedua angka ' + x + ' + ' + y + ' = ' + (x + y) + ', dan angka belakang ' + y + ': ' + x + ' | ' + (x + y) + ' | ' + y + '.'),
        st(x + y >= 10 ? 'Jumlah tengah dua angka (' + (x + y) + '): tulis ' + ((x + y) % 10) + ', simpan 1 ke kiri.' : 'Tidak ada simpanan.'),
        st('Hasilnya ' + F(v) + '.', v)] });
    });
  h4[2] = lv('Puluhan sama, satuan berjumlah 10', '43 × 47 = 20 | 21 = 2.021', 'angka',
    (r) => ({ t: r.bulat(1, 9), u: r.bulat(1, 9) }),
    ({ t, u }) => {
      const a = 10 * t + u, b = 10 * t + (10 - u), dep = t * (t + 1), bel = u * (10 - u), v = dep * 100 + bel;
      return S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'puluhanSama', langkah: [
        st('Puluhan sama (' + t + ') dan satuan berjumlah 10 (' + u + ' + ' + (10 - u) + '). Bagian depan: ' + t + ' × ' + (t + 1) + ' = ' + dep + '.'),
        st('Bagian belakang: ' + u + ' × ' + (10 - u) + ' = ' + bel + ' (tulis dua angka: ' + dua(bel) + ').'),
        st('Gabungkan: ' + dep + ' | ' + dua(bel) + ' = ' + F(v) + '.', v)] });
    });
  h4[3] = lv('Pengurangan dari 1000', '1000 − 673 = 327', 'angka',
    (r) => { let n; do { n = r.bulat(101, 999); } while (n % 10 === 0); return { n }; },
    ({ n }) => {
      const [h, t, u] = digit(n), v = (9 - h) * 100 + (9 - t) * 10 + (10 - u);
      return S.angka('1000 − ' + n + ' = …', 1000 - n, { jenis: 'dari1000', langkah: [
        st('Dua angka pertama dikurangkan dari 9, angka terakhir dari 10.'),
        st('9 − ' + h + ' = ' + (9 - h) + ', 9 − ' + t + ' = ' + (9 - t) + ', 10 − ' + u + ' = ' + (10 - u) + '.'),
        st('Hasilnya ' + F(v) + '.', v)] });
    });
  h4[4] = lv('Perkalian dekat basis 100', '97 × 94 = 91 | 18 = 9.118', 'angka',
    (r) => ({ x: r.bulat(1, 9), y: r.bulat(1, 9) }),
    ({ x, y }) => {
      const a = 100 - x, b = 100 - y, dep = a - y, bel = x * y, v = dep * 100 + bel;
      return S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'basis100', langkah: [
        st(a + ' kurang ' + x + ' dari 100, ' + b + ' kurang ' + y + ' dari 100.'),
        st('Bagian depan: silang ' + a + ' − ' + y + ' = ' + dep + '. Bagian belakang: ' + x + ' × ' + y + ' = ' + bel + ' (dua angka: ' + dua(bel) + ').'),
        st('Gabungkan: ' + dep + ' | ' + dua(bel) + ' = ' + F(v) + '.', v)] });
    });
  h4[5] = lv('Perkalian silang 2 digit × 2 digit', '48 × 42 = 2.016', 'angka',
    (r) => ({ a: r.bulat(11, 99), b: r.bulat(11, 99) }),
    ({ a, b }) => {
      const a1 = Math.floor(a / 10), a0 = a % 10, b1 = Math.floor(b / 10), b0 = b % 10;
      const u = a0 * b0, d0 = u % 10, c1 = Math.floor(u / 10);
      const m = a1 * b0 + a0 * b1 + c1, d1 = m % 10, c2 = Math.floor(m / 10);
      const h = a1 * b1 + c2, v = h * 100 + d1 * 10 + d0;
      return S.angka(a + ' × ' + b + ' = …', a * b, { jenis: 'silang', langkah: [
        st('Satuan: ' + a0 + ' × ' + b0 + ' = ' + u + ' → tulis ' + d0 + (c1 ? ', simpan ' + c1 : '') + '.'),
        st('Silang: ' + a1 + ' × ' + b0 + ' + ' + a0 + ' × ' + b1 + (c1 ? ' + ' + c1 : '') + ' = ' + m + ' → tulis ' + d1 + (c2 ? ', simpan ' + c2 : '') + '.'),
        st('Puluhan: ' + a1 + ' × ' + b1 + (c2 ? ' + ' + c2 : '') + ' = ' + h + '.'),
        st('Gabungkan: ' + h + ' | ' + d1 + ' | ' + d0 + ' = ' + F(v) + '.', v)] });
    });
  CP.aktifkan('H4', { level: h4 });

  /* ================= H5 TRACHTENBERG ================= */
  function acakDigit(r, n, tes) { let d; do { d = []; for (let i = 0; i < n; i++) d.push(r.bulat(i === 0 ? 1 : 0, 9)); } while (tes && !tes(d)); return d; }
  function langkah11(d) {
    const n = d.length, komp = [d[0]];
    for (let i = 0; i < n - 1; i++) komp.push(d[i] + d[i + 1]);
    komp.push(d[n - 1]);
    const bagian = [];
    bagian.push('satuan: ' + d[n - 1]);
    for (let i = n - 2; i >= 0; i--) bagian.push(d[i] + ' + ' + d[i + 1] + ' = ' + (d[i] + d[i + 1]));
    bagian.push('depan: ' + d[0]);
    return { komp, teks: 'Dari kanan, jumlahkan tiap angka dengan tetangga kanannya: ' + bagian.join('; ') + '.' };
  }
  function langkah12(d) {
    const n = d.length, komp = [];
    for (let i = 0; i <= n; i++) { const dd = i === 0 ? 0 : d[i - 1]; const nb = i === n ? 0 : d[i]; komp.push(2 * dd + nb); }
    const bagian = [];
    for (let i = n - 1; i >= 0; i--) bagian.push('2×' + d[i] + (i < n - 1 ? ' + ' + d[i + 1] : '') + ' = ' + (2 * d[i] + (i < n - 1 ? d[i + 1] : 0)));
    bagian.push('depan: ' + d[0]);
    return { komp, teks: 'Dari kanan, gandakan tiap angka lalu tambah tetangga kanannya: ' + bagian.join('; ') + '.' };
  }
  const bangun1112 = (d, k) => {
    const n = dariDigit(d), j = k === 11 ? langkah11(d) : langkah12(d);
    const v = gabung(j.komp);
    const adaSimpan = j.komp.some((x) => x > 9);
    return S.angka(F(n) + ' × ' + k + ' = …', n * k, { jenis: 'kali' + k, langkah: [
      st(j.teks), st(adaSimpan ? 'Jika hasil suatu posisi lebih dari 9, tulis satuannya dan simpan puluhannya ke kiri.' : 'Tidak ada simpanan.'),
      st('Hasilnya ' + F(v) + '.', v)] });
  };
  const h5 = [];
  h5[0] = lv('Kali 11 untuk 3 digit', '523 × 11 = 5.753', 'angka',
    (r) => ({ d: acakDigit(r, 3, (d) => d[0] + d[1] <= 9 && d[1] + d[2] <= 9) }),
    ({ d }) => bangun1112(d, 11));
  h5[1] = lv('Kali 12', '213 × 12 = 2.556', 'angka',
    (r) => ({ d: acakDigit(r, 3, (d) => 2 * d[0] + d[1] <= 9 && 2 * d[1] + d[2] <= 9 && 2 * d[2] <= 9) }),
    ({ d }) => bangun1112(d, 12));
  h5[2] = lv('Kali 5', '468 × 5 = 4.680 ÷ 2 = 2.340', 'angka',
    (r) => ({ n: r.bulat(101, 9999) }),
    ({ n }) => {
      const v = (n * 10) / 2;
      const s = S.angka(F(n) + ' × 5 = …', n * 5, { jenis: 'kali5', langkah: [
        st('Kali 5 sama dengan kali 10 lalu bagi 2: ' + F(n) + ' × 10 = ' + F(n * 10) + '.'),
        st(F(n * 10) + ' ÷ 2 = ' + F(v) + '.', v)] });
      s.dibagi = [{ a: n * 10, b: 2 }];
      return s;
    });
  h5[3] = lv('Kali 11 dan 12 untuk 4 digit', '4 digit dengan simpanan', 'angka',
    (r, c) => ({ k: c.jenis === 'kali12' ? 12 : c.jenis === 'kali11' ? 11 : r.pilih([11, 12]), d: acakDigit(r, 4) }),
    ({ d, k }) => bangun1112(d, k));
  CP.aktifkan('H5', { level: h5 });

  /* ================= H6 LATIHAN KECEPATAN ================= */
  const POOL = [
    { max4: 2, max5: 1 }, { max4: 3, max5: 2 }, { max4: 4, max5: 3 }, { max4: 5, max5: 3 }, { max4: 6, max5: 4 }, { max4: 6, max5: 4 }
  ];
  const h6 = POOL.map((pl, i) => lv('Campuran H4 + H5, batas waktu ketat', 'Level ' + (i + 1), 'angka',
    (r, c) => {
      const cap = (c.opsi && c.opsi.cap) || {};
      const m4 = Math.max(1, Math.min(pl.max4, cap.H4 || pl.max4)), m5 = Math.max(1, Math.min(pl.max5, cap.H5 || pl.max5));
      let src, lvl;
      const j = c.jenis && /^H[45]:\d$/.test(c.jenis) ? c.jenis : null;
      if (j) { src = j.slice(0, 2); lvl = parseInt(j.slice(3), 10); }
      else { const kand = []; for (let k = 1; k <= m4; k++) kand.push(['H4', k]); for (let k = 1; k <= m5; k++) kand.push(['H5', k]); [src, lvl] = r.pilih(kand); }
      const def = src === 'H4' ? h4[lvl - 1] : h5[lvl - 1];
      return { src, lvl, p: def.acak(r, { konteks: c.konteks, jenis: undefined }) };
    },
    (p) => {
      const def = p.src === 'H4' ? h4[p.lvl - 1] : h5[p.lvl - 1];
      const s = def.bangun(p.p, { konteks: 'umum' });
      s.jenis = p.src + ':' + p.lvl;
      return s;
    }));
  CP.aktifkan('H6', { level: h6, target: [25, 22, 19, 16, 14, 12], batasWaktu: [30, 27, 24, 21, 18, 15] });
})(typeof globalThis !== 'undefined' ? globalThis : this);
