/* CepatPaham - Matematika Tingkat Lanjut Kelas XI (SMA):
   XI-TL-1 Bilangan Kompleks, XI-TL-2 Polinomial, XI-TL-3 Matriks, XI-TL-4 Transformasi Geometri, XI-TL-5 Fungsi dan Pemodelannya */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, H } = CP;
  const MIN = CP.MIN, F = CP.angka;
  const sup = (n) => (/^\d+$/.test(String(n)) ? CP.sup(n) : '^(' + n + ')');
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const opsi = (t, k) => ({ t, k: k || t, v: t });
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const sub = (n) => String(n).replace(/\d/g, (d) => SUBS[+d]);

  /* ---------- bilangan kompleks ---------- */
  const ck = (a, b) => {
    if (b === 0) return mn(a);
    const im = (Math.abs(b) === 1 ? '' : String(Math.abs(b))) + 'i';
    if (a === 0) return (b < 0 ? MIN : '') + im;
    return mn(a) + (b < 0 ? ' ' + MIN + ' ' : ' + ') + im;
  };
  const ckO = (a, b) => opsi(ck(a, b));

  CP.aktifkan('XI-TL-1', {
    level: [
      lv('Pangkat dari i', 'i² = −1; pola berulang tiap 4', 'pilihan',
        (r) => ({ n: r.bulat(5, 120), sd: r.bulat(1, 99999) }),
        ({ n, sd }) => {
          const D = ['1', 'i', MIN + '1', MIN + 'i'], hasil = D[n % 4];
          const h = CP.rakitPilihan(CP.buatRng(sd), opsi(hasil), D.filter((x) => x !== hasil).map((x) => opsi(x)));
          return S.pilihan('Nilai dari i' + sup(n) + ' adalah …', h, { jenis: 'pangkatI', langkah: [
            st('Pangkat i berulang tiap 4: i¹ = i, i² = −1, i³ = −i, i⁴ = 1.'),
            st(n + ' ÷ 4 bersisa ' + (n % 4) + ', sehingga i' + sup(n) + ' = i' + sup(n % 4) + (n % 4 === 0 ? ' = 1' : '') + ' = ' + hasil + '.', hasil)] });
        }),
      lv('Penjumlahan dan pengurangan', '(a + bi) ± (c + di)', 'pilihan',
        (r, c) => ({ op: pilihJenis(r, c, ['+', '-']), a: nz(r, -6, 8), b: nz(r, -6, 8), cc: nz(r, -6, 8), d: nz(r, -6, 8), sd: r.bulat(1, 99999) }),
        ({ op, a, b, cc, d, sd }) => {
          const pl = op === '+', R = pl ? [a + cc, b + d] : [a - cc, b - d];
          const salah = (pl ? [[a + cc, b - d], [a - cc, b + d], [a + cc, b + d + 1], [a + b + cc + d, 0]] : [[a + cc, b + d], [a - cc, b + d], [a - cc, d - b], [a - cc + 1, b - d]]).concat([[R[0] + 1, R[1]], [R[0], R[1] + 1], [R[1], R[0]]]).map((x) => ckO(x[0], x[1]));
          const h = CP.rakitPilihan(CP.buatRng(sd), ckO(R[0], R[1]), salah);
          return S.pilihan('Hasil dari (' + ck(a, b) + ') ' + (pl ? '+' : MIN) + ' (' + ck(cc, d) + ') adalah …', h, { jenis: pl ? 'tambah' : 'kurang', langkah: [
            st('Jumlahkan atau kurangkan bagian real dengan real, dan bagian imajiner dengan imajiner.'),
            st('Real: ' + mn(a) + (pl ? ' + ' : ' − ') + '(' + mn(cc) + ') = ' + mn(R[0]) + '. Imajiner: ' + mn(b) + (pl ? ' + ' : ' − ') + '(' + mn(d) + ') = ' + mn(R[1]) + '.'),
            st('Hasilnya ' + ck(R[0], R[1]) + '.', ck(R[0], R[1]))] });
        }),
      lv('Perkalian', '(a + bi)(c + di) = (ac − bd) + (ad + bc)i', 'pilihan',
        (r) => ({ a: nz(r, -5, 6), b: nz(r, -5, 6), cc: nz(r, -5, 6), d: nz(r, -5, 6), sd: r.bulat(1, 99999) }),
        ({ a, b, cc, d, sd }) => {
          const re = a * cc - b * d, im = a * d + b * cc;
          const salah = [[a * cc + b * d, im], [re, a * d - b * cc], [a * cc + b * d, a * d - b * cc], [re, im + 1], [re + 1, im], [im, re], [-re, im]].map((x) => ckO(x[0], x[1]));
          const h = CP.rakitPilihan(CP.buatRng(sd), ckO(re, im), salah);
          return S.pilihan('Hasil dari (' + ck(a, b) + ')(' + ck(cc, d) + ') adalah …', h, { jenis: 'kali', langkah: [
            st('Kalikan tiap suku: ' + mn(a * cc) + ' + (' + mn(a * d) + ')i + (' + mn(b * cc) + ')i + (' + mn(b * d) + ')i², dengan i² = −1.'),
            st('Real: ' + mn(a * cc) + ' − (' + mn(b * d) + ') = ' + mn(re) + '. Imajiner: ' + mn(a * d) + ' + ' + mn(b * cc) + ' = ' + mn(im) + '.'),
            st('Hasilnya ' + ck(re, im) + '.', ck(re, im))] });
        }),
      lv('Modulus dan sekawan', '|a + bi| = √(a² + b²); z · z̄ = a² + b²', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['modulus', 'sekawan']), t: r.pilih([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]]), sa: r.pilih([-1, 1]), sb: r.pilih([-1, 1]), a: nz(r, -9, 9), b: nz(r, -9, 9) }),
        (p) => {
          if (p.jenis === 'modulus') { const a = p.sa * p.t[0], b = p.sb * p.t[1]; return S.angka('Tentukan modulus bilangan kompleks z = ' + ck(a, b) + '.', p.t[2], { jenis: 'modulus', langkah: [st('|z| = √(a² + b²) = √(' + a * a + ' + ' + b * b + ') = √' + (a * a + b * b) + '.'), st('√' + (a * a + b * b) + ' = ' + p.t[2] + '.', Math.sqrt(a * a + b * b))] }); }
          return S.angka('Jika z = ' + ck(p.a, p.b) + ' dan z̄ adalah sekawannya, tentukan nilai z × z̄.', p.a * p.a + p.b * p.b, { jenis: 'sekawan', langkah: [st('Sekawan z̄ = ' + ck(p.a, -p.b) + '. (a + bi)(a − bi) = a² + b² (karena i² = −1).'), st(p.a * p.a + ' + ' + p.b * p.b + ' = ' + (p.a * p.a + p.b * p.b) + '.', p.a * p.a + p.b * p.b)] });
        }),
      lv('Pembagian', 'Kalikan penyebut dengan sekawannya', 'pilihan',
        (r) => ({ p: nz(r, -4, 5), q: nz(r, -4, 5), cc: nz(r, -3, 3), d: nz(r, -3, 3), sd: r.bulat(1, 99999) }),
        ({ p, q, cc, d, sd }) => {
          const re = p * cc - q * d, im = p * d + q * cc, den = cc * cc + d * d;
          const hit = [(re * cc + im * d) / den, (im * cc - re * d) / den];
          const salah = [[p, -q], [q, p], [p + 1, q], [p, q + 1], [-p, q], [p, -q + 1], [q, -p]].map((x) => ckO(x[0], x[1]));
          const h = CP.rakitPilihan(CP.buatRng(sd), ckO(p, q), salah);
          const s = S.pilihan('Hasil dari (' + ck(re, im) + ') ÷ (' + ck(cc, d) + ') adalah …', h, { jenis: 'bagi', langkah: [
            st('Kalikan pembilang dan penyebut dengan sekawan penyebut, ' + ck(cc, -d) + '. Penyebut menjadi ' + cc + '² + ' + d + '² = ' + den + '.'),
            st('Pembilang: (' + ck(re, im) + ')(' + ck(cc, -d) + ') = ' + ck(re * cc + im * d, im * cc - re * d) + '. Bagi ' + den + ': ' + ck(hit[0], hit[1]) + '.', ck(hit[0], hit[1]))] });
          s.dibagi = [{ a: re * cc + im * d, b: den }, { a: im * cc - re * d, b: den }]; return s;
        }),
      lv('Akar kompleks dan penerapan', 'D < 0 menghasilkan akar kompleks sekawan', 'pilihan',
        (r, c) => ({ p: nz(r, -4, 4), q: r.bulat(1, 4), a: nz(r, -4, 5), b: nz(r, -4, 5), cc: nz(r, -3, 4), d: nz(r, -3, 4), sd: r.bulat(1, 99999) }),
        (p, ctx) => {
          if (kons(ctx) === 'umum') {
            const b2 = -2 * p.p, c2 = p.p * p.p + p.q * p.q, fmt = (u, w) => 'x = ' + ck(u, w) + ' atau x = ' + ck(u, -w);
            const benar = opsi(fmt(p.p, p.q)), salah = [opsi(fmt(-p.p, p.q)), opsi('x = ' + mn(p.p + p.q) + ' atau x = ' + mn(p.p - p.q)),opsi(fmt(p.q, p.p)), opsi(fmt(p.p, p.q + 1)), opsi(fmt(p.p + 1, p.q)), opsi(fmt(-p.p, -p.q + 1))];
            const h = CP.rakitPilihan(CP.buatRng(p.sd), benar, salah);
            const pers = 'x² ' + (b2 < 0 ? MIN : '+') + ' ' + (Math.abs(b2) === 1 ? '' : Math.abs(b2) + '') + 'x + ' + c2 + ' = 0';
            return S.pilihan('Akar-akar persamaan kuadrat ' + pers + ' adalah …', h, { jenis: 'akar', langkah: [
              st('Diskriminan D = ' + b2 + '² − 4 × ' + c2 + ' = ' + (b2 * b2 - 4 * c2) + ' (negatif), jadi akarnya kompleks.'),
              st('x = (' + mn(-b2) + ' ± √(' + (b2 * b2 - 4 * c2) + ')) / 2 = ' + mn(p.p) + ' ± ' + p.q + 'i.'),
              st('Jadi ' + benar.t + '.', benar.t)] });
          }
          const re = p.a * p.cc - p.b * p.d, im = p.a * p.d + p.b * p.cc;
          const salah = [[p.a * p.cc + p.b * p.d, im], [re, p.a * p.d - p.b * p.cc], [re, im + 1], [im, re], [-re, im], [re + 1, im]].map((x) => ckO(x[0], x[1]));
          const h = CP.rakitPilihan(CP.buatRng(p.sd), ckO(re, im), salah);
          return S.pilihan('Dalam rangkaian listrik arus bolak-balik, tegangan V = I × Z. Jika arus I = (' + ck(p.a, p.b) + ') ampere dan impedansi Z = (' + ck(p.cc, p.d) + ') ohm (satuan imajiner dituliskan i), tegangan V (volt) adalah …', h, { jenis: 'impedansi', langkah: [
            st('V = I × Z = (' + ck(p.a, p.b) + ')(' + ck(p.cc, p.d) + ').'),
            st('Real: ' + mn(p.a * p.cc) + ' − (' + mn(p.b * p.d) + ') = ' + mn(re) + '. Imajiner: ' + mn(p.a * p.d) + ' + ' + mn(p.b * p.cc) + ' = ' + mn(im) + '.'),
            st('V = ' + ck(re, im) + ' volt.', ck(re, im))] });
        })
    ]
  });

  /* ---------- polinomial ---------- */
  const poli = (c) => { const n = c.length - 1; let s = ''; c.forEach((k, i) => { const p = n - i; if (!k) return; const a = Math.abs(k); let t = (p === 0 || a !== 1) ? String(a) : ''; if (p >= 1) t += 'x' + (p > 1 ? sup(p) : ''); s += s ? (k < 0 ? ' ' + MIN + ' ' : ' + ') + t : (k < 0 ? MIN : '') + t; }); return s || '0'; };
  const hornerNilai = (c, x) => c.reduce((a, k) => a * x + k, 0);
  const bagiHorner = (c, a) => { const q = [c[0]]; for (let i = 1; i < c.length - 1; i++) q.push(c[i] + a * q[i - 1]); return { q, sisa: c[c.length - 1] + a * q[q.length - 1] }; };
  const kaliLinear = (q, a) => { const p = []; for (let i = 0; i <= q.length; i++) p.push((i < q.length ? q[i] : 0) - a * (i > 0 ? q[i - 1] : 0)); return p; };

  CP.aktifkan('XI-TL-2', {
    level: [
      lv('Nilai suku banyak', 'P(a) dengan metode substitusi atau Horner', 'angka',
        (r) => ({ c: [nz(r, -2, 3), nz(r, -4, 5), nz(r, -5, 6), nz(r, -6, 9)].concat(r.peluang(0.3) ? [nz(r, -5, 7)] : []), a: nz(r, -3, 4) }),
        ({ c, a }) => {
          const v = hornerNilai(c, a), baris = []; let acc = c[0]; baris.push(acc);
          for (let i = 1; i < c.length; i++) { acc = acc * a + c[i]; baris.push(acc); }
          return S.angka('Jika P(x) = ' + poli(c) + ', tentukan nilai P(' + mn(a) + ').', v, { jenis: 'nilaiP', izin: { minus: true }, langkah: [
            st('Metode Horner dengan x = ' + mn(a) + ': ulangi "kalikan ' + mn(a) + ' lalu tambah koefisien berikutnya".'),
            st('Koefisien: ' + c.map(mn).join(', ') + '. Hasil bertahap: ' + baris.map(mn).join(', ') + '.'),
            st('P(' + mn(a) + ') = ' + mn(v) + '.', v)] });
        }),
      lv('Teorema sisa', 'Sisa pembagian P(x) oleh (x − a) adalah P(a)', 'angka',
        (r) => ({ c: [nz(r, -2, 3), nz(r, -4, 5), nz(r, -5, 6), nz(r, -6, 9)], a: nz(r, -3, 4) }),
        ({ c, a }) => {
          const v = hornerNilai(c, a);
          return S.angka('Tentukan sisa pembagian P(x) = ' + poli(c) + ' oleh (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ').', v, { jenis: 'sisa', izin: { minus: true }, langkah: [
            st('Teorema sisa: sisa pembagian P(x) oleh (x − a) sama dengan P(a). Pembagi (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ') berarti a = ' + mn(a) + '.'),
            st('P(' + mn(a) + ') = ' + mn(v) + '.', v)] });
        }),
      lv('Hasil bagi', 'P(x) = (x − a) · Q(x)', 'pilihan',
        (r) => ({ a: nz(r, -3, 4), q: [nz(r, -2, 3), nz(r, -4, 5), nz(r, -5, 6)], sd: r.bulat(1, 99999) }),
        ({ a, q, sd }) => {
          const Pp = kaliLinear(q, a), hb = bagiHorner(Pp, a);
          const benar = opsi(poli(hb.q)), salah = [[q[0], q[1], -q[2]], [q[0], q[1] + 1, q[2]], [q[0], -q[1], q[2]], [q[0] + 1, q[1], q[2]], [q[0], q[1], q[2] + 2], [q[0], q[1] + 2 * a * q[0], q[2]], [q[0], Pp[1], Pp[2]]].map((x) => opsi(poli(x)));
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan('Suku banyak P(x) = ' + poli(Pp) + ' habis dibagi (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + '). Hasil baginya adalah …', h, { jenis: 'hasilBagi', langkah: [
            st('Gunakan Horner dengan a = ' + mn(a) + ': koefisien ' + Pp.map(mn).join(', ') + '.'),
            st('Hasil bertahap (sisa terakhir ' + mn(hb.sisa) + ' = 0): ' + hb.q.map(mn).join(', ') + '.'),
            st('Hasil bagi = ' + benar.t + '.', benar.t)] });
        }),
      lv('Teorema faktor', 'Jika (x − a) faktor maka P(a) = 0', 'angka',
        (r) => ({ a: nz(r, -3, 4), p: nz(r, -3, 3), k: nz(r, -6, 7) }),
        ({ a, p, k }) => {
          const c0 = -(a * a * a + p * a * a + k * a);
          const pT = 'x' + sup(3) + ' ' + (p < 0 ? MIN : '+') + ' ' + (Math.abs(p) === 1 ? '' : Math.abs(p)) + 'x' + sup(2) + ' + kx ' + (c0 < 0 ? MIN : '+') + ' ' + Math.abs(c0);
          const s = S.angka('Jika (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ') adalah faktor dari P(x) = ' + pT + ', tentukan nilai k.', k, { jenis: 'faktor', izin: { minus: true }, langkah: [
            st('Faktor (x − (' + mn(a) + ')) berarti P(' + mn(a) + ') = 0: ' + mn(a * a * a) + ' + (' + mn(p * a * a) + ') + ' + mn(a) + 'k + (' + mn(c0) + ') = 0.'),
            st(mn(a) + 'k = ' + mn(-(a * a * a + p * a * a + c0)) + ', maka k = ' + mn(-(a * a * a + p * a * a + c0)) + ' ÷ ' + mn(a) + ' = ' + mn(k) + '.', -(a * a * a + p * a * a + c0) / a)] });
          s.dibagi = [{ a: -(a * a * a + p * a * a + c0), b: a }]; return s;
        }),
      lv('Akar-akar suku banyak', 'Jumlah akar = −b/a; hasil kali akar = −d/a', 'angka',
        (r, c) => ({ r: [nz(r, -4, 5), nz(r, -4, 5), nz(r, -4, 5)], A: r.pilih([1, 2]), jenis: pilihJenis(r, c, ['jumlah', 'kali', 'ketiga']) }),
        ({ r, A, jenis }) => {
          const [p, q, w] = r; let Pp = kaliLinear(kaliLinear([1], p).slice(0, 2), q); Pp = kaliLinear(Pp, w); Pp = Pp.map((x) => x * A);
          const tj = Pp[1] !== 0 ? -Pp[1] / Pp[0] : 0, tk = -Pp[3] / Pp[0];
          if (jenis === 'jumlah') return S.angka('Tentukan jumlah akar-akar persamaan ' + poli(Pp) + ' = 0.', p + q + w, { jenis, izin: { minus: true }, langkah: [st('Untuk ax³ + bx² + cx + d = 0: jumlah akar = −b/a.'), st('−(' + mn(Pp[1]) + ') ÷ ' + mn(Pp[0]) + ' = ' + mn(tj) + '.', -Pp[1] / Pp[0])] });
          if (jenis === 'kali') return S.angka('Tentukan hasil kali akar-akar persamaan ' + poli(Pp) + ' = 0.', p * q * w, { jenis, izin: { minus: true }, langkah: [st('Untuk ax³ + bx² + cx + d = 0: hasil kali akar = −d/a.'), st('−(' + mn(Pp[3]) + ') ÷ ' + mn(Pp[0]) + ' = ' + mn(tk) + '.', -Pp[3] / Pp[0])] });
          return S.angka('Dua akar persamaan ' + poli(Pp) + ' = 0 adalah ' + mn(p) + ' dan ' + mn(q) + '. Tentukan akar yang ketiga.', w, { jenis, izin: { minus: true }, langkah: [st('Jumlah akar = −b/a = ' + mn(-Pp[1] / Pp[0]) + '.'), st('Akar ketiga = ' + mn(-Pp[1] / Pp[0]) + ' − (' + mn(p) + ') − (' + mn(q) + ') = ' + mn(w) + '.', -Pp[1] / Pp[0] - p - q)] });
        }),
      lv('Penerapan: volume', 'V(x) = x(x + a)(x + b)', 'angka',
        (r, c) => ({ x0: r.bulat(2, 8), a: r.bulat(1, 4), b: r.bulat(2, 6), k: r.bulat(0, 1) }),
        ({ x0, a, b, k }, ctx) => {
          const V = x0 * (x0 + a) * (x0 + b), v = kons(ctx);
          let x = 1; while (x * (x + a) * (x + b) < V && x < 100) x++;
          const teks = (v === 'umum' ? 'Sebuah kotak tanpa tutup berbentuk balok memiliki tinggi x cm, panjang (x + ' + a + ') cm, dan lebar (x + ' + b + ') cm. ' : 'Sebuah cetakan logam berbentuk balok memiliki tinggi x cm, panjang (x + ' + a + ') cm, dan lebar (x + ' + b + ') cm. ') + 'Jika volumenya ' + V + ' cm³, tentukan nilai x.';
          return S.angka(teks, x0, { jenis: 'volume', satuan: 'cm', langkah: [
            st('Volume: x(x + ' + a + ')(x + ' + b + ') = ' + V + '. Coba bilangan bulat positif, mulai dari x = 1.'),
            st(Array.from({ length: Math.min(x, 6) }, (_, i) => 'x = ' + (x - Math.min(x, 6) + 1 + i) + ': ' + ((x - Math.min(x, 6) + 1 + i) * ((x - Math.min(x, 6) + 1 + i) + a) * ((x - Math.min(x, 6) + 1 + i) + b))).join('; ') + '.'),
            st('Volume ' + V + ' tercapai saat x = ' + x + '.', x)] });
        })
    ]
  });

  /* ---------- matriks ---------- */
  function gbrMatriks(items) {
    const cw = 32, rh = 24, el = []; let x = 8, maks = 1;
    items.forEach((it) => { if (it.m) maks = Math.max(maks, it.m.length); });
    const tinggi = 20 + maks * rh + 14;
    items.forEach((it) => {
      if (it.op) { el.push(H.t(x + 10, 20 + (maks * rh) / 2 + 6, it.op, 'middle', 'tebal')); x += 28; return; }
      const R = it.m.length, C = it.m[0].length, w = C * cw, h = R * rh, y0 = 20 + ((maks - R) * rh) / 2;
      el.push(H.d('M' + (x + 7) + ' ' + y0 + ' Q' + (x - 1) + ' ' + (y0 + h / 2) + ' ' + (x + 7) + ' ' + (y0 + h), 'garis'), H.d('M' + (x + w + 9) + ' ' + y0 + ' Q' + (x + w + 17) + ' ' + (y0 + h / 2) + ' ' + (x + w + 9) + ' ' + (y0 + h), 'garis'));
      it.m.forEach((row, i) => row.forEach((v, j) => el.push(H.t(x + 8 + j * cw + cw / 2, y0 + i * rh + 17, mn(v), 'middle', 'tebal'))));
      if (it.n) el.push(H.t(x + w / 2 + 8, 14, it.n, 'middle', 'kecil'));
      x += w + 24;
    });
    return { tipe: 'gambar', alt: 'Matriks: ' + items.map((i) => (i.m ? (i.n || '') + ' = ' + i.m.map((rw) => rw.join(' ')).join(' / ') : i.op)).join(' '), lebar: Math.max(320, x + 6), tinggi, el };
  }
  const mm = (A, B) => A.map((row) => B[0].map((_, j) => row.reduce((s2, v, k) => s2 + v * B[k][j], 0)));
  const det2 = (M) => M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const det3 = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const acakM = (r, lo, hi, n) => Array.from({ length: n || 2 }, () => Array.from({ length: n || 2 }, () => r.bulat(lo, hi)));
  const baris = (i) => 'baris ke-' + i;
  const posisi = (i, j) => 'baris ke-' + i + ' kolom ke-' + j;
  const matTeks = (m) => '(' + m.map((rw) => rw.map(mn).join(' ')).join(' ; ') + ')';

  CP.aktifkan('XI-TL-3', {
    level: [
      lv('Penjumlahan dan pengurangan matriks', 'Operasikan elemen yang seletak', 'angka',
        (r, c) => ({ op: pilihJenis(r, c, ['+', '-']), A: acakM(r, -5, 8), B: acakM(r, -5, 8), i: r.bulat(1, 2), j: r.bulat(1, 2) }),
        ({ op, A, B, i, j }) => {
          const v = op === '+' ? A[i - 1][j - 1] + B[i - 1][j - 1] : A[i - 1][j - 1] - B[i - 1][j - 1];
          return S.angka('Diketahui matriks A dan B pada gambar. Berapa elemen ' + posisi(i, j) + ' dari A ' + (op === '+' ? '+' : MIN) + ' B?', v, { jenis: op === '+' ? 'tambah' : 'kurang', izin: { minus: true }, gambar: gbrMatriks([{ m: A, n: 'A' }, { op: op === '+' ? '+' : MIN }, { m: B, n: 'B' }]), langkah: [
            st('Elemen ' + posisi(i, j) + ': A = ' + mn(A[i - 1][j - 1]) + ' dan B = ' + mn(B[i - 1][j - 1]) + '.'),
            st(mn(A[i - 1][j - 1]) + (op === '+' ? ' + ' : ' − ') + '(' + mn(B[i - 1][j - 1]) + ') = ' + mn(v) + '.', v)] });
        }),
      lv('Perkalian skalar dan perkalian matriks', 'Baris × kolom', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['skalar', 'kali']), A: acakM(r, -3, 5), B: acakM(r, -3, 5), k: nz(r, -3, 4), i: r.bulat(1, 2), j: r.bulat(1, 2) }),
        ({ jenis, A, B, k, i, j }) => {
          if (jenis === 'skalar') { const v = k * A[i - 1][j - 1]; return S.angka('Diketahui matriks A. Berapa elemen ' + posisi(i, j) + ' dari ' + mn(k) + 'A?', v, { jenis, izin: { minus: true }, gambar: gbrMatriks([{ m: A, n: 'A' }]), langkah: [st('Kalikan setiap elemen dengan ' + mn(k) + '.'), st(mn(k) + ' × (' + mn(A[i - 1][j - 1]) + ') = ' + mn(v) + '.', k * A[i - 1][j - 1])] }); }
          const AB = mm(A, B), v = AB[i - 1][j - 1];
          return S.angka('Diketahui matriks A dan B pada gambar. Berapa elemen ' + posisi(i, j) + ' dari A × B?', v, { jenis, izin: { minus: true }, gambar: gbrMatriks([{ m: A, n: 'A' }, { op: '×' }, { m: B, n: 'B' }]), langkah: [
            st('Elemen ' + posisi(i, j) + ' = ' + baris(i) + ' dari A dikali kolom ke-' + j + ' dari B.'),
            st('(' + mn(A[i - 1][0]) + ')(' + mn(B[0][j - 1]) + ') + (' + mn(A[i - 1][1]) + ')(' + mn(B[1][j - 1]) + ') = ' + mn(v) + '.', A[i - 1][0] * B[0][j - 1] + A[i - 1][1] * B[1][j - 1])] });
        }),
      lv('Determinan', 'ad − bc untuk 2×2; aturan Sarrus untuk 3×3', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['2x2', '3x3']), M2: acakM(r, -6, 9), M3: acakM(r, -3, 5, 3) }),
        ({ jenis, M2, M3 }) => {
          if (jenis === '2x2') { const d = det2(M2); return S.angka('Tentukan determinan matriks M pada gambar.', d, { jenis, izin: { minus: true }, gambar: gbrMatriks([{ m: M2, n: 'M' }]), langkah: [st('det = ad − bc = (' + mn(M2[0][0]) + ')(' + mn(M2[1][1]) + ') − (' + mn(M2[0][1]) + ')(' + mn(M2[1][0]) + ').'), st(mn(M2[0][0] * M2[1][1]) + ' − (' + mn(M2[0][1] * M2[1][0]) + ') = ' + mn(d) + '.', M2[0][0] * M2[1][1] - M2[0][1] * M2[1][0])] }); }
          const d = det3(M3), m = M3;
          const plus = m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[1][0] * m[2][1], minus = m[0][2] * m[1][1] * m[2][0] + m[0][0] * m[1][2] * m[2][1] + m[0][1] * m[1][0] * m[2][2];
          return S.angka('Tentukan determinan matriks M pada gambar dengan aturan Sarrus.', d, { jenis, izin: { minus: true }, gambar: gbrMatriks([{ m: M3, n: 'M' }]), langkah: [st('Sarrus: jumlahkan hasil kali tiga diagonal utama, kurangi hasil kali tiga diagonal lawan.'), st('Diagonal utama: ' + mn(plus) + '. Diagonal lawan: ' + mn(minus) + '.'), st('det = ' + mn(plus) + ' − (' + mn(minus) + ') = ' + mn(d) + '.', plus - minus)] });
        }),
      lv('Matriks singular', 'Determinan = 0', 'angka',
        (r) => { for (;;) { const a = nz(r, -4, 6), b = nz(r, -4, 6), cc = nz(r, -4, 6); if ((a * b) % cc === 0) return { a, b, cc, pos: r.bulat(0, 1) }; } },
        ({ a, b, cc, pos }) => {
          const x = (a * b) / cc, M = [[0, a], [b, cc]];
          const s = S.angka('Matriks M = (x ' + mn(a) + ' ; ' + mn(b) + ' ' + mn(cc) + ') (baris dipisah titik koma) adalah matriks singular. Tentukan nilai x.', x, { jenis: 'singular', izin: { minus: true }, langkah: [
            st('Matriks singular memiliki determinan 0: x × ' + cc + ' − ' + a + ' × ' + b + ' = 0.'),
            st(mn(cc) + 'x = ' + mn(a * b) + ', maka x = ' + mn(a * b) + ' ÷ ' + mn(cc) + ' = ' + mn(x) + '.', (a * b) / cc)] });
          s.dibagi = [{ a: a * b, b: cc }]; return s;
        }),
      lv('Persamaan matriks AX = B', 'X = A⁻¹B', 'angka',
        (r) => { for (;;) { const A = acakM(r, -3, 4); if (Math.abs(det2(A)) === 1) return { A, X: acakM(r, -4, 5), i: r.bulat(1, 2), j: r.bulat(1, 2) }; } },
        ({ A, X, i, j }) => {
          const B = mm(A, X), d = det2(A), inv = [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]], Xh = mm(inv, B);
          return S.angka('Diketahui AX = B dengan A dan B pada gambar. Berapa elemen ' + posisi(i, j) + ' dari matriks X?', X[i - 1][j - 1], { jenis: 'persMat', izin: { minus: true }, gambar: gbrMatriks([{ m: A, n: 'A' }, { op: '× X =' }, { m: B, n: 'B' }]), langkah: [
            st('det A = ' + mn(d) + ', sehingga A⁻¹ = (1/' + mn(d) + ') × (' + mn(A[1][1]) + ' ' + mn(-A[0][1]) + ' ; ' + mn(-A[1][0]) + ' ' + mn(A[0][0]) + ') = ' + matTeks(inv) + '.'),
            st('X = A⁻¹B = ' + matTeks(Xh) + '. Elemen ' + posisi(i, j) + ' = ' + mn(Xh[i - 1][j - 1]) + '.', Xh[i - 1][j - 1])] });
        }),
      lv('Sistem persamaan dengan matriks', 'x = Dₓ/D, y = Dᵧ/D', 'angka',
        (r, c) => { for (;;) { const x = r.bulat(1, 9), y = r.bulat(1, 9), a1 = nz(r, -4, 5), b1 = nz(r, -4, 5), a2 = nz(r, -4, 5), b2 = nz(r, -4, 5); if (a1 * b2 - a2 * b1 !== 0 && Math.abs(a1 * b2 - a2 * b1) <= 14) return { x, y, a1, b1, a2, b2, tanya: pilihJenis(r, c, ['x', 'y']), k: r.bulat(0, 1) }; } },
        (p, ctx) => {
          const c1 = p.a1 * p.x + p.b1 * p.y, c2 = p.a2 * p.x + p.b2 * p.y, D = p.a1 * p.b2 - p.a2 * p.b1, Dx = c1 * p.b2 - c2 * p.b1, Dy = p.a1 * c2 - p.a2 * c1, v = kons(ctx);
          const eq = (a, b, c) => (a === 1 ? '' : a === -1 ? MIN : a) + 'x ' + (b < 0 ? MIN : '+') + ' ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y = ' + mn(c);
          const nm = v === 'umum' ? [['pensil', 'buku'], ['pulpen', 'penggaris']][p.k] : [['unit servis ringan', 'unit servis berat'], ['bahan A', 'bahan B']][p.k];
          const teks = 'Sistem persamaan ' + eq(p.a1, p.b1, c1) + ' dan ' + eq(p.a2, p.b2, c2) + ' (x = ' + nm[0] + ', y = ' + nm[1] + ' dalam satuan yang sama) diselesaikan dengan matriks. Berapakah nilai ' + p.tanya + '?';
          const s = S.angka(teks, p.tanya === 'x' ? p.x : p.y, { jenis: p.tanya, izin: { minus: true }, langkah: [
            st('D = det A = (' + mn(p.a1) + ')(' + mn(p.b2) + ') − (' + mn(p.b1) + ')(' + mn(p.a2) + ') = ' + mn(D) + '.'),
            st(p.tanya === 'x' ? 'Dₓ = (' + mn(c1) + ')(' + mn(p.b2) + ') − (' + mn(p.b1) + ')(' + mn(c2) + ') = ' + mn(Dx) + ', maka x = ' + mn(Dx) + ' ÷ ' + mn(D) + ' = ' + mn(p.x) + '.' : 'Dᵧ = (' + mn(p.a1) + ')(' + mn(c2) + ') − (' + mn(c1) + ')(' + mn(p.a2) + ') = ' + mn(Dy) + ', maka y = ' + mn(Dy) + ' ÷ ' + mn(D) + ' = ' + mn(p.y) + '.', p.tanya === 'x' ? Dx / D : Dy / D)] });
          s.dibagi = [{ a: p.tanya === 'x' ? Dx : Dy, b: D }]; return s;
        })
    ]
  });

  /* ---------- transformasi geometri dengan matriks ---------- */
  const MT = { rot90: ['Rotasi 90° berlawanan arah jarum jam (pusat O)', [[0, -1], [1, 0]]], rot180: ['Rotasi 180° (pusat O)', [[-1, 0], [0, -1]]], rot270: ['Rotasi 270° berlawanan arah jarum jam (pusat O)', [[0, 1], [-1, 0]]], refx: ['Refleksi terhadap sumbu x', [[1, 0], [0, -1]]], refy: ['Refleksi terhadap sumbu y', [[-1, 0], [0, 1]]], refyx: ['Refleksi terhadap garis y = x', [[0, 1], [1, 0]]], refymx: ['Refleksi terhadap garis y = −x', [[0, -1], [-1, 0]]], dil2: ['Dilatasi pusat O faktor 2', [[2, 0], [0, 2]]], dil3: ['Dilatasi pusat O faktor 3', [[3, 0], [0, 3]]] };
  const KUNCI_MT = Object.keys(MT);
  const gbrBidang = (o) => CP.gbrBidang(o);

  CP.aktifkan('XI-TL-4', {
    level: [
      lv('Matriks transformasi', 'Rotasi, refleksi, dan dilatasi', 'pilihan',
        (r) => ({ k: r.pilih(KUNCI_MT), sd: r.bulat(1, 99999) }),
        ({ k, sd }) => {
          const benar = opsi(matTeks(MT[k][1])), salah = KUNCI_MT.filter((x) => x !== k).map((x) => opsi(matTeks(MT[x][1])));
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan(MT[k][0] + ' memiliki matriks transformasi … (baris dipisah titik koma).', h, { jenis: k, langkah: [
            st('Matriks transformasi memetakan vektor satuan (1, 0) dan (0, 1). Kolom pertama = bayangan (1, 0), kolom kedua = bayangan (0, 1).'),
            st('Untuk ' + MT[k][0].toLowerCase() + ', matriksnya ' + benar.t + '.', benar.t)] });
        }),
      lv('Bayangan titik oleh matriks', "(x', y') = M (x, y)", 'angka',
        (r, c) => ({ M: acakM(r, -3, 4), x: nz(r, -5, 6), y: nz(r, -5, 6), tanya: pilihJenis(r, c, ['x', 'y']) }),
        ({ M, x, y, tanya }) => {
          const xp = M[0][0] * x + M[0][1] * y, yp = M[1][0] * x + M[1][1] * y;
          return S.angka('Titik A(' + mn(x) + ', ' + mn(y) + ') ditransformasikan oleh matriks M pada gambar. Berapa ' + (tanya === 'x' ? 'absis' : 'ordinat') + " bayangan A'?", tanya === 'x' ? xp : yp, { jenis: tanya, izin: { minus: true }, gambar: gbrMatriks([{ m: M, n: 'M' }]), langkah: [
            st("(x', y') = M(x, y): x' = (" + mn(M[0][0]) + ')(' + mn(x) + ') + (' + mn(M[0][1]) + ')(' + mn(y) + '), y\' = (' + mn(M[1][0]) + ')(' + mn(x) + ') + (' + mn(M[1][1]) + ')(' + mn(y) + ').'),
            st(tanya === 'x' ? "x' = " + mn(xp) + '.' : "y' = " + mn(yp) + '.', tanya === 'x' ? xp : yp)] });
        }),
      lv('Komposisi transformasi', 'T₂ ∘ T₁ = M₂ × M₁', 'angka',
        (r) => { const a = r.pilih(KUNCI_MT); let b; do { b = r.pilih(KUNCI_MT); } while (b === a); return { a, b, i: r.bulat(1, 2), j: r.bulat(1, 2) }; },
        ({ a, b, i, j }) => {
          const M = mm(MT[b][1], MT[a][1]);
          return S.angka('Titik ditransformasikan oleh T₁ = ' + MT[a][0].toLowerCase() + ', kemudian T₂ = ' + MT[b][0].toLowerCase() + '. Matriks komposisinya M = M₂ × M₁. Berapa elemen ' + posisi(i, j) + ' dari M?', M[i - 1][j - 1], { jenis: 'komposisi:' + a + ',' + b, izin: { minus: true }, gambar: gbrMatriks([{ m: MT[b][1], n: 'M₂' }, { op: '×' }, { m: MT[a][1], n: 'M₁' }]), langkah: [
            st('Urutan: T₁ dahulu, lalu T₂, jadi M = M₂ × M₁ (matriks T₂ di kiri).'),
            st('M = ' + matTeks(M) + '. Elemen ' + posisi(i, j) + ' = ' + mn(M[i - 1][j - 1]) + '.', M[i - 1][j - 1])] });
        }),
      lv('Mencari titik asal', 'Gunakan invers matriks', 'angka',
        (r, c) => { for (;;) { const M = acakM(r, -3, 4); if (Math.abs(det2(M)) === 1) return { M, x: nz(r, -5, 6), y: nz(r, -5, 6), tanya: pilihJenis(r, c, ['x', 'y']) }; } },
        ({ M, x, y, tanya }) => {
          const xp = M[0][0] * x + M[0][1] * y, yp = M[1][0] * x + M[1][1] * y, d = det2(M), inv = [[M[1][1] / d, -M[0][1] / d], [-M[1][0] / d, M[0][0] / d]];
          return S.angka("Bayangan titik A oleh matriks M pada gambar adalah A'(" + mn(xp) + ', ' + mn(yp) + '). Berapa ' + (tanya === 'x' ? 'absis' : 'ordinat') + ' titik asal A?', tanya === 'x' ? x : y, { jenis: tanya, izin: { minus: true }, gambar: gbrMatriks([{ m: M, n: 'M' }]), langkah: [
            st('det M = ' + mn(d) + ', maka M⁻¹ = ' + matTeks(inv) + '.'),
            st('(x, y) = M⁻¹ (' + mn(xp) + ', ' + mn(yp) + ') = (' + mn(inv[0][0] * xp + inv[0][1] * yp) + ', ' + mn(inv[1][0] * xp + inv[1][1] * yp) + ').', tanya === 'x' ? inv[0][0] * xp + inv[0][1] * yp : inv[1][0] * xp + inv[1][1] * yp)] });
        }),
      lv('Luas bayangan', 'Luas bayangan = |det M| × luas awal', 'angka',
        (r) => ({ M: [[r.pilih([1, 2, 3, -1, -2]), r.pilih([0, 0, 1, -1])], [r.pilih([0, 0, 1, -1]), r.pilih([1, 2, 3, 2])]], p: r.bulat(2, 6), q: 2 * r.bulat(1, 3), a: nz(r, -2, 2), b: nz(r, -2, 2) }),
        ({ M, p, q, a, b }) => {
          const d = det2(M); if (d === 0) M[1][1] = 1;
          const dd = det2(M), luas = (p * q) / 2, T = [[a, b], [a + p, b], [a, b + q]], img = T.map((t) => [M[0][0] * t[0] + M[0][1] * t[1], M[1][0] * t[0] + M[1][1] * t[1]]);
          const s = S.angka('Segitiga ABC dengan A' + '(' + mn(a) + ', ' + mn(b) + '), B(' + mn(a + p) + ', ' + mn(b) + '), dan C(' + mn(a) + ', ' + mn(b + q) + ') ditransformasikan oleh matriks M pada gambar. Berapa luas bayangannya?', Math.abs(dd) * luas, { jenis: 'luasBayangan', gambar: gbrBidang({ poly: [{ pts: T, c: 'isi' }, { pts: img, c: 'isi2' }], alt: 'Segitiga dan bayangannya setelah transformasi matriks' }), langkah: [
            st('Luas segitiga ABC = ½ × ' + p + ' × ' + q + ' = ' + luas + '. det M = ' + mn(dd) + '.'),
            st('Luas bayangan = |' + mn(dd) + '| × ' + luas + ' = ' + Math.abs(dd) * luas + '.', Math.abs(dd) * ((p * q) / 2))] });
          s.dibagi = [{ a: p * q, b: 2 }]; return s;
        }),
      lv('Transformasi dengan translasi', "(x', y') = M(x, y) + (t₁, t₂)", 'angka',
        (r, c) => ({ M: acakM(r, -2, 3), x: nz(r, -4, 5), y: nz(r, -4, 5), tx: nz(r, -4, 5), ty: nz(r, -4, 5), tanya: pilihJenis(r, c, ['x', 'y']), k: r.bulat(0, 1) }),
        (p, ctx) => {
          const xp = p.M[0][0] * p.x + p.M[0][1] * p.y + p.tx, yp = p.M[1][0] * p.x + p.M[1][1] * p.y + p.ty, v = kons(ctx);
          const teks = (v === 'umum' ? 'Sebuah titik pada denah taman A' : 'Sebuah titik acuan pada gambar kerja A') + '(' + mn(p.x) + ', ' + mn(p.y) + ') ditransformasikan oleh matriks M pada gambar, kemudian digeser oleh translasi T(' + mn(p.tx) + ', ' + mn(p.ty) + '). Berapa ' + (p.tanya === 'x' ? 'absis' : 'ordinat') + " titik hasil akhir A'?";
          return S.angka(teks, p.tanya === 'x' ? xp : yp, { jenis: 'matriksTranslasi', izin: { minus: true }, gambar: gbrMatriks([{ m: p.M, n: 'M' }]), langkah: [
            st('Transformasi matriks dulu: (' + mn(p.M[0][0] * p.x + p.M[0][1] * p.y) + ', ' + mn(p.M[1][0] * p.x + p.M[1][1] * p.y) + ').'),
            st('Lalu tambahkan translasi (' + mn(p.tx) + ', ' + mn(p.ty) + '): ' + (p.tanya === 'x' ? 'absis = ' + mn(xp) : 'ordinat = ' + mn(yp)) + '.', p.tanya === 'x' ? xp : yp)] });
        })
    ]
  });

  /* ---------- fungsi dan pemodelannya ---------- */
  const lg = (b, n) => 'log' + sub(b) + ' ' + n;
  const TRIG = {
    sin: { 0: ['0', 0], 30: ['1 / 2', 0.5], 45: ['√2 / 2', Math.SQRT2 / 2], 60: ['√3 / 2', Math.sqrt(3) / 2], 90: ['1', 1] },
    cos: { 0: ['1', 1], 30: ['√3 / 2', Math.sqrt(3) / 2], 45: ['√2 / 2', Math.SQRT2 / 2], 60: ['1 / 2', 0.5], 90: ['0', 0] }
  };
  const trigNilai = (fn, sdt) => {
    const t = ((sdt % 360) + 360) % 360, ref = t <= 90 ? t : t <= 180 ? 180 - t : t <= 270 ? t - 180 : 360 - t;
    const kuad = t <= 90 ? 1 : t <= 180 ? 2 : t <= 270 ? 3 : 4;
    const tanda = fn === 'sin' ? (kuad <= 2 ? 1 : -1) : (kuad === 1 || kuad === 4 ? 1 : -1);
    const [teks, num] = TRIG[fn][ref];
    return { teks: (num === 0 ? '' : tanda < 0 ? MIN : '') + teks, num: tanda * num, ref, kuad, tanda };
  };
  function gbrSinus(a, b, c) {
    const X0 = 36, X1 = 304, Y0 = 14, Y1 = 128, n = 90, vals = []; for (let i = 0; i <= n; i++) { const x = (360 * i) / n; vals.push(a * Math.sin((b * x * Math.PI) / 180) + c); }
    let lo = Math.min(...vals, 0) - 0.6, hi = Math.max(...vals, 0) + 0.6;
    const mx = (x) => X0 + (x / 360) * (X1 - X0), my = (y) => Y1 - ((y - lo) / (hi - lo)) * (Y1 - Y0);
    const el = [H.l(X0, my(0), X1, my(0), 'tipis'), H.l(X0, Y0, X0, Y1, 'garis')];
    [0, 90, 180, 270, 360].forEach((x) => el.push(H.t(mx(x), Y1 + 14, x + '°', 'middle', 'kecil')));
    for (let y = Math.ceil(lo); y <= Math.floor(hi); y++) { el.push(H.l(X0, my(y), X1, my(y), 'tipis')); el.push(H.t(X0 - 4, my(y) + 4, mn(y), 'end', 'kecil')); }
    el.push(H.d('M' + vals.map((v, i) => mx((360 * i) / n).toFixed(1) + ' ' + my(v).toFixed(1)).join(' L'), 'garis'));
    return { tipe: 'gambar', alt: 'Grafik y = ' + a + ' sin(' + b + 'x) + ' + c + ' pada 0 sampai 360 derajat', tinggi: 148, el };
  }

  CP.aktifkan('XI-TL-5', {
    level: [
      lv('Nilai logaritma', 'ᵃlog b = n artinya aⁿ = b', 'angka',
        (r) => ({ a: r.pilih([2, 3, 4, 5, 10]), n: r.bulat(1, 5), z: r.bulat(0, 1) }),
        ({ a, n }) => {
          const b = Math.pow(a, n);
          return S.angka('Tentukan nilai ' + lg(a, b) + '.', n, { jenis: 'nilaiLog', langkah: [
            st(lg(a, b) + ' = n artinya ' + a + sup('n') + ' = ' + b + '.'),
            st(a + sup(n) + ' = ' + b + ', jadi n = ' + n + '.', n)] });
        }),
      lv('Sifat logaritma', 'log(pq) = log p + log q; log(p/q) = log p − log q', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jumlah', 'selisih', 'pangkat']), a: r.pilih([2, 3, 5]), m: r.bulat(1, 4), n: r.bulat(1, 4), k: r.bulat(2, 4) }),
        ({ jenis, a, m, n, k }) => {
          if (jenis === 'jumlah') return S.angka('Tentukan nilai ' + lg(a, Math.pow(a, m)) + ' + ' + lg(a, Math.pow(a, n)) + '.', m + n, { jenis, langkah: [st('logₐ p + logₐ q = logₐ (p × q): ' + lg(a, Math.pow(a, m) * Math.pow(a, n)) + '.'), st(a + sup(m + n) + ' = ' + Math.pow(a, m + n) + ', jadi hasilnya ' + (m + n) + '.', m + n)] });
          if (jenis === 'selisih') { const hi = Math.max(m, n) + 1, lo = Math.min(m, n); return S.angka('Tentukan nilai ' + lg(a, Math.pow(a, hi)) + ' − ' + lg(a, Math.pow(a, lo)) + '.', hi - lo, { jenis, langkah: [st('logₐ p − logₐ q = logₐ (p ÷ q) = ' + lg(a, Math.pow(a, hi - lo)) + '.'), st('Hasilnya ' + (hi - lo) + '.', hi - lo)] }); }
          return S.angka('Jika ' + lg(a, Math.pow(a, m)) + ' = ' + m + ', berapakah nilai ' + lg(a, '(' + Math.pow(a, m) + ')' + sup(k)) + '?', m * k, { jenis, langkah: [st('logₐ pⁿ = n × logₐ p.'), st(k + ' × ' + m + ' = ' + m * k + '.', m * k)] });
        }),
      lv('Persamaan eksponen dan logaritma', 'Samakan basis', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['eksponen', 'logaritma']), a: r.pilih([2, 3, 4, 5]), n: r.bulat(3, 5), p: 0, x: 0 }),
        ({ jenis, a, n, p, x }) => {
          p = 1 + (n + a) % (n - 1);
          if (jenis === 'eksponen') { const sol = n - p, b = Math.pow(a, n); return S.angka('Tentukan nilai x yang memenuhi ' + a + sup('x + ' + p) + ' = ' + b + '. (Petunjuk: ' + b + ' = ' + a + sup(n) + ')', sol, { jenis, langkah: [st('Samakan basis: ' + a + sup('x + ' + p) + ' = ' + a + sup(n) + '.'), st('x + ' + p + ' = ' + n + ', maka x = ' + sol + '.', n - p)] }); }
          return S.angka('Tentukan nilai x yang memenuhi ' + lg(a, '(x + ' + p + ')') + ' = ' + n + '.', Math.pow(a, n) - p, { jenis, langkah: [st(lg(a, '(x + ' + p + ')') + ' = ' + n + ' artinya x + ' + p + ' = ' + a + sup(n) + ' = ' + Math.pow(a, n) + '.'), st('x = ' + Math.pow(a, n) + ' − ' + p + ' = ' + (Math.pow(a, n) - p) + '.', Math.pow(a, n) - p)] });
        }),
      lv('Nilai trigonometri di berbagai kuadran', 'sin 150°, cos 210°, …', 'pilihan',
        (r, c) => ({ fn: pilihJenis(r, c, ['sin', 'cos']), sdt: r.pilih([120, 135, 150, 210, 225, 240, 300, 315, 330, 30, 45, 60]), sd: r.bulat(1, 99999) }),
        ({ fn, sdt, sd }) => {
          const hasil = trigNilai(fn, sdt), semua = ['0', '1 / 2', '√2 / 2', '√3 / 2', '1'].flatMap((t) => [t, t === '0' ? null : MIN + t]).filter(Boolean);
          const benar = opsi(hasil.teks), salah = semua.filter((t) => t !== hasil.teks).map((t) => opsi(t));
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          const KN = ['', 'I', 'II', 'III', 'IV'];
          return S.pilihan('Nilai ' + fn + ' ' + sdt + '° adalah …', h, { jenis: fn + sdt, langkah: [
            st(sdt + '° berada di kuadran ' + KN[hasil.kuad] + '; sudut acuannya ' + hasil.ref + '°. ' + (fn === 'sin' ? 'Sinus positif di kuadran I dan II.' : 'Kosinus positif di kuadran I dan IV.')),
            st(fn + ' ' + hasil.ref + '° = ' + TRIG[fn][hasil.ref][0] + (hasil.tanda < 0 ? ', bertanda negatif, jadi ' : ', jadi ') + fn + ' ' + sdt + '° = ' + hasil.teks + '.', hasil.teks)] });
        }),
      lv('Grafik fungsi trigonometri', 'y = a sin(bx) + c: amplitudo, periode, nilai maksimum', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['maksimum', 'periode', 'minimum']), a: r.bulat(1, 5), b: r.pilih([1, 2, 3, 4, 6]), cc: r.bulat(-3, 4) }),
        ({ jenis, a, b, cc }) => {
          const g = gbrSinus(a, b, cc), fm = 'y = ' + (a === 1 ? '' : a) + ' sin ' + (b === 1 ? '' : b) + 'x ' + (cc < 0 ? MIN : '+') + ' ' + Math.abs(cc);
          const s0 = { izin: { minus: true }, gambar: g };
          if (jenis === 'maksimum') return S.angka('Tentukan nilai maksimum fungsi ' + fm + '.', a + cc, Object.assign({ jenis }, s0, { langkah: [st('Nilai sin berkisar −1 sampai 1, jadi nilai maksimum = amplitudo + c = ' + a + ' + (' + mn(cc) + ').'), st('Maksimum = ' + mn(a + cc) + '.', a + cc)] }));
          if (jenis === 'minimum') return S.angka('Tentukan nilai minimum fungsi ' + fm + '.', -a + cc, Object.assign({ jenis }, s0, { langkah: [st('Minimum = −amplitudo + c = −' + a + ' + (' + mn(cc) + ').'), st('Minimum = ' + mn(-a + cc) + '.', -a + cc)] }));
          const s = S.angka('Tentukan periode (dalam derajat) fungsi ' + fm + '.', 360 / b, Object.assign({ jenis, satuan: '°' }, { gambar: g, langkah: [st('Periode = 360° ÷ b = 360° ÷ ' + b + '.'), st('Periode = ' + 360 / b + '°.', 360 / b)] }));
          s.dibagi = [{ a: 360, b }]; return s;
        }),
      lv('Pemodelan pertumbuhan', 'N(t) = N₀ × 2^(t/d)', 'angka',
        (r) => ({ n0: r.pilih([10, 20, 50, 100, 250]), d: r.bulat(2, 6), k: r.bulat(2, 6), z: r.bulat(0, 1) }),
        ({ n0, d, k, z }, ctx) => {
          const v = kons(ctx), N = n0 * Math.pow(2, k), t = d * k;
          const teks = v === 'umum' ? 'Jumlah bakteri dalam suatu biakan awalnya ' + n0 + ' dan menjadi dua kali lipat setiap ' + d + ' jam, sehingga N(t) = ' + n0 + ' × 2^(t/' + d + '). Setelah berapa jam jumlah bakteri mencapai ' + CP.angka(N) + '?' : 'Jumlah pengikut akun sebuah toko online awalnya ' + n0 + ' dan menjadi dua kali lipat setiap ' + d + ' hari, sehingga N(t) = ' + n0 + ' × 2^(t/' + d + '). Setelah berapa hari pengikut mencapai ' + CP.angka(N) + '?';
          const s = S.angka(teks, t, { jenis: 'pertumbuhan', satuan: v === 'umum' ? 'jam' : 'hari', langkah: [
            st(n0 + ' × 2^(t/' + d + ') = ' + N + ' → 2^(t/' + d + ') = ' + N + ' ÷ ' + n0 + ' = ' + Math.pow(2, k) + ' = 2' + sup(k) + '.'),
            st('Maka t/' + d + ' = ' + k + ', dan t = ' + d + ' × ' + k + ' = ' + t + '.', d * Math.log2(N / n0))] });
          return s;
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
