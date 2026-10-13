/* CepatPaham - Tahap 2, Kelas X: X-3 Trigonometri, X-4 SPL dan Pertidaksamaan, X-5 Kuadrat, X-6 Data, X-7 Peluang */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, kpk, H } = CP;
  const F = CP.angka, RP = CP.rp, MIN = CP.MIN, sup = CP.sup;
  const { rend, kunciAlj } = CP.alj;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const dec = (p) => CP.desimalStr(p);
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const pf = (p) => (p.d === 1 ? String(p.n) : p.n + '/' + p.d);
  const DER = '°';
  const Q2 = '²';

  /* ---------- gambar segitiga siku-siku dan parabola ---------- */
  // depan a (tegak), samping b (datar), miring c; sudut alfa di A (kiri bawah)
  function gbrSiku(a, b, c, la, lb, lc, sudut) {
    const s = Math.min(190 / b, 104 / a), x0 = 36, y0 = 128, w = b * s, h = a * s;
    const A = [x0, y0], C = [x0 + w, y0], B = [x0 + w, y0 - h];
    return { tipe: 'gambar', alt: 'Segitiga siku-siku: sisi depan ' + la + ', samping ' + lb + ', miring ' + lc, tinggi: 152, el: [
      H.p([A, B, C], 'isi'), H.p([[C[0] - 12, C[1]], [C[0] - 12, C[1] - 12], [C[0], C[1] - 12]], 'kosong'),
      H.t(C[0] + 8, (B[1] + C[1]) / 2 + 4, la, 'start', 'tebal'), H.t((A[0] + C[0]) / 2, C[1] + 16, lb, 'middle', 'tebal'), H.t((A[0] + B[0]) / 2 - 6, (A[1] + B[1]) / 2 - 8, lc, 'end', 'tebal'),
      H.t(A[0] + 26, A[1] - 5, sudut || 'α', 'start', 'tebal'), H.t(A[0] - 6, A[1] + 4, 'A', 'end', 'kecil'), H.t(C[0] + 6, C[1] + 14, 'C', 'start', 'kecil'), H.t(B[0] + 6, B[1] - 2, 'B', 'start', 'kecil')] };
  }
  function gbrParabola(a, b, c, x1, x2, o) {
    o = o || {};
    const X0 = 28, X1 = 300, Y0 = 12, Y1 = 134, n = 48, xs = [], ys = [];
    for (let i = 0; i <= n; i++) { const x = x1 + ((x2 - x1) * i) / n; xs.push(x); ys.push(a * x * x + b * x + c); }
    let lo = Math.min(...ys, 0), hi = Math.max(...ys, 0); if (hi - lo < 1) { hi += 1; lo -= 1; }
    const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    const mx = (x) => X0 + ((x - x1) / (x2 - x1)) * (X1 - X0), my = (y) => Y1 - ((y - lo) / (hi - lo)) * (Y1 - Y0);
    const el = [];
    if (x1 <= 0 && x2 >= 0) el.push(H.l(mx(0), Y0, mx(0), Y1, 'tipis'));
    el.push(H.l(X0, my(0), X1, my(0), 'tipis'));
    el.push(H.d('M' + xs.map((x, i) => mx(x).toFixed(1) + ' ' + my(ys[i]).toFixed(1)).join(' L'), 'garis'));
    (o.titik || []).forEach((p) => { el.push(H.o(mx(p.x), my(p.y), 4, 'titik')); if (p.t) el.push(H.t(mx(p.x) + (p.ax || 0), my(p.y) + (p.dy === undefined ? 16 : p.dy), p.t, p.a || 'middle', 'tebal')); });
    return { tipe: 'gambar', alt: o.alt || 'Grafik fungsi kuadrat', tinggi: 150, el };
  }
  const persKuad = (a, b, c) => rend({ 'x²': a, x: b, '': c }) + ' = 0';
  const fKuad = (a, b, c) => 'f(x) = ' + rend({ 'x²': a, x: b, '': c });

  /* ========================= X-3 PERBANDINGAN TRIGONOMETRI ========================= */
  const TRP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const NAMA_FN = { sin: 'sin', cos: 'cos', tan: 'tan' };
  const rasioSiku = (fn, a, b, c) => (fn === 'sin' ? P(a, c) : fn === 'cos' ? P(b, c) : P(a, b));
  const TABEL = {
    sin: { 30: [0.5, '1 / 2'], 45: [Math.SQRT2 / 2, '√2 / 2'], 60: [Math.sqrt(3) / 2, '√3 / 2'] },
    cos: { 30: [Math.sqrt(3) / 2, '√3 / 2'], 45: [Math.SQRT2 / 2, '√2 / 2'], 60: [0.5, '1 / 2'] },
    tan: { 30: [Math.sqrt(3) / 3, '√3 / 3'], 45: [1, '1'], 60: [Math.sqrt(3), '√3'] }
  };
  const POOL_TRIG = [[0, '0'], [0.5, '1 / 2'], [Math.SQRT2 / 2, '√2 / 2'], [Math.sqrt(3) / 2, '√3 / 2'], [1, '1'], [Math.sqrt(3) / 3, '√3 / 3'], [Math.sqrt(3), '√3']];
  const keyN = (v) => (Math.round(v * 1e8) / 1e8).toFixed(8);
  const RASIONAL = [
    { t: 'sin 30' + DER, v: P(1, 2) }, { t: 'cos 60' + DER, v: P(1, 2) }, { t: 'tan 45' + DER, v: P(1, 1) }, { t: 'sin 90' + DER, v: P(1, 1) }, { t: 'cos 0' + DER, v: P(1, 1) },
    { t: 'sin 0' + DER, v: P(0, 1) }, { t: 'cos 90' + DER, v: P(0, 1) }, { t: 'sin' + Q2 + ' 45' + DER, v: P(1, 2) }, { t: 'cos' + Q2 + ' 45' + DER, v: P(1, 2) },
    { t: 'sin' + Q2 + ' 30' + DER, v: P(1, 4) }, { t: 'cos' + Q2 + ' 60' + DER, v: P(1, 4) }, { t: 'cos' + Q2 + ' 30' + DER, v: P(3, 4) }, { t: 'sin' + Q2 + ' 60' + DER, v: P(3, 4) }, { t: 'tan' + Q2 + ' 60' + DER, v: P(3, 1) }
  ];

  CP.aktifkan('X-3', {
    level: [
      lv('Perbandingan sisi segitiga siku-siku', 'sin = depan/miring, cos = samping/miring, tan = depan/samping', 'pecahan',
        (r, c) => ({ t: r.pilih(TRP), m: r.bulat(1, 3), fn: pilihJenis(r, c, ['sin', 'cos', 'tan']) }),
        ({ t, m, fn }) => {
          const [a, b, c] = t.map((x) => x * m); const v = rasioSiku(fn, a, b, c);
          const rumus = fn === 'sin' ? 'depan / miring' : fn === 'cos' ? 'samping / miring' : 'depan / samping';
          const [pa, pb] = fn === 'sin' ? [a, c] : fn === 'cos' ? [b, c] : [a, b];
          return S.pecahan('Pada segitiga siku-siku ABC (siku-siku di C), BC = ' + a + ' cm, AC = ' + b + ' cm, dan AB = ' + c + ' cm. Tentukan ' + fn + ' A.', v, { jenis: fn, gambar: gbrSiku(a, b, c, a, b, c, 'A'), langkah: [
            st('Terhadap sudut A: sisi depan = BC = ' + a + ', samping = AC = ' + b + ', miring = AB = ' + c + '.'),
            st(fn + ' A = ' + rumus + ' = ' + pa + '/' + pb + ', disederhanakan menjadi ' + pf(P(pa, pb)) + '.', P(pa, pb))] });
        }),
      lv('Nilai sudut istimewa', 'sin 30° = 1/2, tan 45° = 1', 'pilihan',
        (r, c) => ({ fn: pilihJenis(r, c, ['sin', 'cos', 'tan']), sd: r.pilih([30, 45, 60]), s: r.bulat(1, 99999) }),
        ({ fn, sd, s }) => {
          const [nilai, teks] = TABEL[fn][sd];
          const benar = { t: teks, k: keyN(nilai), v: nilai };
          const komp = fn === 'sin' ? 'cos' : fn === 'cos' ? 'sin' : 'tan';
          const pr = [TABEL[komp][sd], ...CP.buatRng(s).kocok(POOL_TRIG)].map((x) => ({ t: x[1], k: keyN(x[0]), v: x[0] }));
          const h = CP.rakitPilihan(CP.buatRng(s + 1), benar, pr);
          return S.pilihan('Nilai ' + fn + ' ' + sd + DER + ' adalah …', h, { jenis: fn + sd, langkah: [
            st('Ingat tabel sudut istimewa: sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2; cos kebalikannya (cos 60° = 1/2); tan 45° = 1, tan 30° = √3/3, tan 60° = √3.'),
            st(fn + ' ' + sd + DER + ' = ' + teks + '.', fn === 'sin' ? Math.sin((sd * Math.PI) / 180) : fn === 'cos' ? Math.cos((sd * Math.PI) / 180) : Math.tan((sd * Math.PI) / 180))] });
        }),
      lv('Mencari sisi dengan perbandingan trigonometri', 'sin 30°: depan = miring ÷ 2', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['sin30', 'cos60', 'tan45', 'tan']);
          if (jenis === 'tan') { const [a, b] = r.pilih([[3, 4], [5, 12], [8, 15], [4, 3], [12, 5]]); return { jenis, a, b, k: r.bulat(2, 6) }; }
          return { jenis, c: 2 * r.bulat(3, 12), d: r.bulat(4, 25) };
        },
        (p) => {
          if (p.jenis === 'sin30') return S.angka('Pada segitiga siku-siku dengan sudut ' + 30 + DER + ', sisi miringnya ' + p.c + ' cm. Berapa panjang sisi di depan sudut ' + 30 + DER + '?', p.c / 2, { jenis: 'sin30', satuan: 'cm', gambar: gbrSiku(p.c / 2, p.c * Math.sqrt(3) / 2, p.c, '?', '', p.c, '30' + DER), dibagi: [{ a: p.c, b: 2 }], langkah: [
            st('sin 30° = depan / miring dan sin 30° = 1/2.'), st('depan = ' + p.c + ' × 1/2 = ' + (p.c / 2) + ' cm.', p.c * 0.5)] });
          if (p.jenis === 'cos60') return S.angka('Sebuah tangga bersandar pada dinding membentuk sudut ' + 60 + DER + ' dengan lantai. Panjang tangga ' + p.c + ' m. Berapa jarak kaki tangga ke dinding?', p.c / 2, { jenis: 'cos60', satuan: 'm', gambar: gbrSiku(p.c * Math.sqrt(3) / 2, p.c / 2, p.c, '', '?', p.c, '60' + DER), dibagi: [{ a: p.c, b: 2 }], langkah: [
            st('Jarak kaki tangga = sisi samping sudut ' + 60 + DER + ', jadi cos 60° = samping / miring dan cos 60° = 1/2.'), st('samping = ' + p.c + ' × 1/2 = ' + (p.c / 2) + ' m.', p.c * 0.5)] });
          if (p.jenis === 'tan45') return S.angka('Pada segitiga siku-siku dengan sudut ' + 45 + DER + ', sisi di samping sudut itu ' + p.d + ' cm. Berapa panjang sisi di depannya?', p.d, { jenis: 'tan45', satuan: 'cm', gambar: gbrSiku(p.d, p.d, p.d * Math.SQRT2, '?', p.d, '', '45' + DER), langkah: [
            st('tan 45° = depan / samping dan tan 45° = 1.'), st('depan = 1 × ' + p.d + ' = ' + p.d + ' cm.', 1 * p.d)] });
          const dep = p.a * p.k, sam = p.b * p.k;
          const s = S.angka('Pada segitiga siku-siku, tan α = ' + p.a + '/' + p.b + ' dan sisi samping sudut α adalah ' + sam + ' cm. Berapa panjang sisi depan sudut α?', dep, { jenis: 'tanRasio', satuan: 'cm', gambar: gbrSiku(p.a, p.b, Math.sqrt(p.a * p.a + p.b * p.b), '?', sam, '', 'α'), langkah: [
            st('tan α = depan / samping, sehingga depan = samping × tan α = ' + sam + ' × ' + p.a + '/' + p.b + '.'), st(sam + ' ÷ ' + p.b + ' × ' + p.a + ' = ' + p.k + ' × ' + p.a + ' = ' + dep + ' cm.', (sam / p.b) * p.a)] });
          s.dibagi = [{ a: sam, b: p.b }]; return s;
        }),
      lv('Perbandingan lain dari satu perbandingan', 'sin A = 5/13 → cos A = 12/13', 'pecahan',
        (r, c) => { const t = r.pilih(TRP); const [f1, f2] = r.pilih([['sin', 'cos'], ['sin', 'tan'], ['cos', 'sin'], ['cos', 'tan'], ['tan', 'sin'], ['tan', 'cos']]); return { t, f1, f2 }; },
        ({ t, f1, f2 }) => {
          const [a, b, c] = t; const v1 = rasioSiku(f1, a, b, c), ans = rasioSiku(f2, a, b, c);
          const sisiDikenal = f1 === 'sin' ? [a, '?', c] : f1 === 'cos' ? ['?', b, c] : [a, b, '?'];
          const labels = sisiDikenal.map((x, i) => (x === '?' ? '?' : [a, b, c][i]));
          const sembunyi = labels.map((x) => x); // sisi yang diketahui ditampilkan, yang dicari '?'
          const lengkap = f1 === 'sin' ? { x: 'b', n: b } : f1 === 'cos' ? { x: 'a', n: a } : { x: 'c', n: c };
          return S.pecahan('Pada segitiga siku-siku dengan sudut lancip α, ' + f1 + ' α = ' + pf(v1) + '. Tentukan ' + f2 + ' α.', ans, { jenis: f1 + '>' + f2, gambar: gbrSiku(a, b, c, labels[0], labels[1], labels[2], 'α'), langkah: [
            st('Dari ' + f1 + ' α = ' + pf(v1) + ', ambil sisi-sisinya: ' + (f1 === 'sin' ? 'depan = ' + a + ', miring = ' + c : f1 === 'cos' ? 'samping = ' + b + ', miring = ' + c : 'depan = ' + a + ', samping = ' + b) + '.'),
            st('Sisi ketiga dengan Pythagoras: ' + (lengkap.x === 'b' ? 'samping' : lengkap.x === 'a' ? 'depan' : 'miring') + ' = ' + lengkap.n + ' (tripel ' + a + ', ' + b + ', ' + c + ').'),
            st(f2 + ' α = ' + pf(ans) + '.', ans)] });
        }),
      lv('Sudut elevasi dan penerapan', 'Tangga, pohon, atap, menara', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['elevasi45', 'tangga30', 'tangga60', 'tan']), c: 2 * r.bulat(3, 14), d: r.bulat(5, 40), k: r.bulat(0, 1), u: r.bulat(2, 8), pair: r.pilih([[3, 4], [5, 12], [4, 3]]) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'elevasi45') {
            const teks = v === 'umum' ? 'Dari titik berjarak ' + p.d + ' m dari kaki sebuah pohon, sudut elevasi ke puncak pohon ' + 45 + DER + '. Berapa tinggi pohon (abaikan tinggi pengamat)?' : 'Dari titik berjarak ' + p.d + ' m dari kaki tower pemancar, sudut elevasi ke puncak tower ' + 45 + DER + '. Berapa tinggi tower (abaikan tinggi pengamat)?';
            return S.angka(teks, p.d, { jenis: 'elevasi45', satuan: 'm', gambar: gbrSiku(p.d, p.d, p.d * Math.SQRT2, '?', p.d, '', '45' + DER), langkah: [st('tan 45° = tinggi / jarak = 1.'), st('tinggi = 1 × ' + p.d + ' = ' + p.d + ' m.', 1 * p.d)] });
          }
          if (p.jenis === 'tangga30') {
            const teks = v === 'umum' ? 'Sebuah tangga ' + p.c + ' m disandarkan ke dinding sehingga membentuk sudut ' + 30 + DER + ' dengan lantai. Berapa tinggi ujung tangga dari lantai?' : 'Sebuah ramp (bidang miring) di gudang sepanjang ' + p.c + ' m membentuk sudut ' + 30 + DER + ' dengan lantai. Berapa tinggi ujung atas ramp dari lantai?';
            const s = S.angka(teks, p.c / 2, { jenis: 'tangga30', satuan: 'm', gambar: gbrSiku(p.c / 2, p.c * Math.sqrt(3) / 2, p.c, '?', '', p.c, '30' + DER), langkah: [st('tinggi = panjang × sin 30°, dan sin 30° = 1/2.'), st(p.c + ' × 1/2 = ' + (p.c / 2) + ' m.', p.c * 0.5)] });
            s.dibagi = [{ a: p.c, b: 2 }]; return s;
          }
          if (p.jenis === 'tangga60') {
            const teks = v === 'umum' ? 'Sebuah tangga ' + p.c + ' m bersandar pada dinding dan membentuk sudut ' + 60 + DER + ' dengan lantai. Berapa jarak kaki tangga ke dinding?' : 'Rangka atap sebuah bengkel memiliki balok miring ' + p.c + ' m yang membentuk sudut ' + 60 + DER + ' dengan balok datar. Berapa panjang balok datar yang menyangganya (proyeksi mendatar)?';
            const s = S.angka(teks, p.c / 2, { jenis: 'tangga60', satuan: 'm', gambar: gbrSiku(p.c * Math.sqrt(3) / 2, p.c / 2, p.c, '', '?', p.c, '60' + DER), langkah: [st('jarak = panjang × cos 60°, dan cos 60° = 1/2.'), st(p.c + ' × 1/2 = ' + (p.c / 2) + ' m.', p.c * 0.5)] });
            s.dibagi = [{ a: p.c, b: 2 }]; return s;
          }
          const [a, b] = p.pair, tinggi = a * p.u, jarak = b * p.u;
          const teks = v === 'umum' ? 'Seorang anak melihat puncak gedung dari jarak ' + jarak + ' m dengan sudut elevasi α yang tan α = ' + a + '/' + b + '. Berapa tinggi gedung (abaikan tinggi anak)?' : 'Seorang teknisi melihat ujung atas menara dari jarak ' + jarak + ' m dengan sudut elevasi α yang tan α = ' + a + '/' + b + '. Berapa tinggi menara (abaikan tinggi teknisi)?';
          const s = S.angka(teks, tinggi, { jenis: 'tanElevasi', satuan: 'm', gambar: gbrSiku(a, b, Math.sqrt(a * a + b * b), '?', jarak, '', 'α'), langkah: [st('tan α = tinggi / jarak, sehingga tinggi = jarak × ' + a + '/' + b + '.'), st(jarak + ' ÷ ' + b + ' × ' + a + ' = ' + p.u + ' × ' + a + ' = ' + tinggi + ' m.', (jarak / b) * a)] });
          s.dibagi = [{ a: jarak, b }]; return s;
        }),
      lv('Menghitung ekspresi trigonometri', 'sin 30° + cos 60° = 1', 'pecahan',
        (r) => { const i = r.bulat(0, RASIONAL.length - 1); let j = r.bulat(0, RASIONAL.length - 1); while (j === i) j = r.bulat(0, RASIONAL.length - 1); return { i, j, op: r.pilih(['+', '-', '*']) }; },
        ({ i, j, op }) => {
          let A = RASIONAL[i], B = RASIONAL[j];
          if (op === '-' && CP.pBanding(A.v, B.v) < 0) { const t = A; A = B; B = t; }
          const hasil = op === '+' ? CP.pTambah(A.v, B.v) : op === '-' ? CP.pKurang(A.v, B.v) : CP.pKali(A.v, B.v);
          const sim = op === '+' ? '+' : op === '-' ? MIN : '×';
          const nilaiSimbol = (x) => pf(x);
          return S.pecahan('Hitunglah ' + A.t + ' ' + sim + ' ' + B.t + '.', hasil, { jenis: 'ekspresi', langkah: [
            st('Nilai tiap suku: ' + A.t + ' = ' + nilaiSimbol(A.v) + ' dan ' + B.t + ' = ' + nilaiSimbol(B.v) + '.'),
            st(nilaiSimbol(A.v) + ' ' + sim + ' ' + nilaiSimbol(B.v) + ' = ' + nilaiSimbol(hasil) + '.', hasil)] });
        })
    ]
  });

  /* ========================= X-4 SPL DAN PERTIDAKSAMAAN LINEAR ========================= */
  const eq = (a, b, c) => (a === 1 ? '' : a) + 'x ' + (b < 0 ? MIN : '+') + ' ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y = ' + c;
  function acakSPL(r, lo, hi) {
    for (;;) {
      const x = r.bulat(lo, hi), y = r.bulat(lo, hi), a1 = r.bulat(1, 5), b1 = r.bulat(1, 5), a2 = r.bulat(1, 5), b2 = r.bulat(1, 5);
      if (a1 * b2 - a2 * b1 !== 0 && !(a1 === a2 && b1 === b2) && x !== y) return { x, y, a1, b1, a2, b2 };
    }
  }
  function langkahSPL(p, tanya) {
    const { a1, b1, a2, b2 } = p, c1 = a1 * p.x + b1 * p.y, c2 = a2 * p.x + b2 * p.y;
    const D = a1 * b2 - a2 * b1;
    const nx = c1 * b2 - c2 * b1, ny = a1 * c2 - a2 * c1;
    const dibagi = [{ a: nx, b: D }, { a: ny, b: D }];
    const langkah = [
      st('Persamaan 1: ' + eq(a1, b1, c1) + '. Persamaan 2: ' + eq(a2, b2, c2) + '.'),
      st('Eliminasi y: kalikan persamaan 1 dengan ' + b2 + ' dan persamaan 2 dengan ' + b1 + ', lalu kurangkan: ' + mn(D) + 'x = ' + mn(nx) + '.'),
      st('x = ' + mn(nx) + ' ÷ ' + mn(D) + ' = ' + p.x + '.', nx / D)];
    if (tanya !== 'x') {
      langkah.push(st('Substitusi x = ' + p.x + ' ke persamaan 1: ' + a1 + ' × ' + p.x + ' + ' + b1 + 'y = ' + c1 + ', sehingga ' + b1 + 'y = ' + (c1 - a1 * p.x) + '.'));
      langkah.push(st('y = ' + (c1 - a1 * p.x) + ' ÷ ' + b1 + ' = ' + p.y + '.', (c1 - a1 * p.x) / b1));
      if (tanya === 'jumlah') langkah.push(st('x + y = ' + p.x + ' + ' + p.y + ' = ' + (p.x + p.y) + '.', nx / D + (c1 - a1 * p.x) / b1));
      dibagi.push({ a: c1 - a1 * p.x, b: b1 });
    }
    return { langkah, dibagi, c1, c2 };
  }

  CP.aktifkan('X-4', {
    level: [
      lv('Jumlah dan selisih dua bilangan', 'x + y = 10, x − y = 4', 'angka',
        (r, c) => { let x, y; do { x = r.bulat(2, 20); y = r.bulat(1, 15); } while (y >= x); return { x, y, tanya: pilihJenis(r, c, ['x', 'y']) }; },
        ({ x, y, tanya }) => {
          const s = x + y, d = x - y, ans = tanya === 'x' ? x : y;
          const sol = tanya === 'x' ? (s + d) / 2 : (s - d) / 2;
          const sm = S.angka('Jika x + y = ' + s + ' dan x − y = ' + d + ', berapakah nilai ' + tanya + '?', ans, { jenis: tanya, langkah: [
            st('Jumlahkan kedua persamaan: 2x = ' + s + ' + ' + d + ' = ' + (s + d) + '. Kurangkan: 2y = ' + s + ' − ' + d + ' = ' + (s - d) + '.'),
            st(tanya === 'x' ? 'x = ' + (s + d) + ' ÷ 2 = ' + sol + '.' : 'y = ' + (s - d) + ' ÷ 2 = ' + sol + '.', sol)] });
          sm.dibagi = [{ a: tanya === 'x' ? s + d : s - d, b: 2 }]; return sm;
        }),
      lv('SPLDV dengan eliminasi dan substitusi', '2x + y = 7, x − y = 2', 'angka',
        (r, c) => Object.assign(acakSPL(r, 1, 9), { tanya: pilihJenis(r, c, ['x', 'y', 'jumlah']) }),
        (p) => {
          const { langkah, dibagi, c1, c2 } = langkahSPL(p, p.tanya);
          const ans = p.tanya === 'x' ? p.x : p.tanya === 'y' ? p.y : p.x + p.y;
          const teks = 'Diketahui ' + eq(p.a1, p.b1, c1) + ' dan ' + eq(p.a2, p.b2, c2) + '. Berapakah nilai ' + (p.tanya === 'jumlah' ? 'x + y' : p.tanya) + '?';
          if (p.tanya === 'x') { /* langkah berhenti di x */ }
          const s = S.angka(teks, ans, { jenis: p.tanya, langkah });
          s.dibagi = dibagi; return s;
        }),
      lv('Soal cerita SPLDV', 'Harga pensil dan buku', 'angka',
        (r) => { const p = acakSPL(r, 1, 9); return Object.assign(p, { k: r.bulat(0, 2), tanya: r.pilih(['x', 'y']), nama: r.pilih(CP.NAMA) }); },
        (p, ctx) => {
          const { langkah, dibagi, c1, c2 } = langkahSPL(p, p.tanya);
          const v = kons(ctx);
          const sets = v === 'umum'
            ? [['pensil', 'buku'], ['penghapus', 'penggaris'], ['donat', 'es teh']][p.k]
            : [['kg bahan A', 'kg bahan B'], ['jam kerja mesin', 'jam kerja manual'], ['kemeja', 'celana']][p.k];
          const [A, B] = sets;
          const item = (n, nm) => n + ' ' + nm;
          const teks = v === 'umum'
            ? p.nama + ' membeli ' + item(p.a1, A) + ' dan ' + item(p.b1, B) + ' seharga Rp' + c1 + '.000. Temannya membeli ' + item(p.a2, A) + ' dan ' + item(p.b2, B) + ' seharga Rp' + c2 + '.000. Berapa rupiah harga 1 ' + (p.tanya === 'x' ? A : B) + '?'
            : 'Biaya produksi untuk ' + item(p.a1, A) + ' dan ' + item(p.b1, B) + ' adalah Rp' + c1 + '.000. Untuk ' + item(p.a2, A) + ' dan ' + item(p.b2, B) + ' biayanya Rp' + c2 + '.000. Berapa rupiah biaya 1 ' + (p.tanya === 'x' ? A : B) + '?';
          const ans = (p.tanya === 'x' ? p.x : p.y) * 1000;
          const kal = langkah.slice();
          const lastV = kal[kal.length - 1];
          kal.push(st('Harga 1 ' + (p.tanya === 'x' ? A : B) + ' = ' + (p.tanya === 'x' ? p.x : p.y) + ' ribu = ' + RP(ans) + '.', (p.tanya === 'x' ? lastV.v : lastV.v) * 1000));
          const s = S.angka(teks, ans, { jenis: 'cerita' + p.k + p.tanya, awalan: 'Rp', langkah: p.tanya === 'x' ? kal.filter((l, i) => i < 3 || i === kal.length - 1) : kal });
          s.dibagi = dibagi; return s;
        }),
      lv('Titik penyelesaian pertidaksamaan', '2x + y ≤ 8 → titik (1, 2)', 'pilihan',
        (r, c) => {
          for (;;) {
            const a = r.bulat(1, 4), b = r.bulat(1, 4), cc = r.bulat(6, 20), rel = pilihJenis(r, c, ['≤', '≥', '<', '>']);
            let ya = 0, tidak = 0;
            for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) { const v = a * x + b * y; const ok = rel === '≤' ? v <= cc : rel === '≥' ? v >= cc : rel === '<' ? v < cc : v > cc; if (ok) ya++; else tidak++; }
            if (ya >= 1 && tidak >= 6) return { a, b, cc, rel, s: r.bulat(1, 99999) };
          }
        },
        ({ a, b, cc, rel, s }) => {
          const rng = CP.buatRng(s);
          const ok = (x, y) => { const v = a * x + b * y; return rel === '≤' ? v <= cc : rel === '≥' ? v >= cc : rel === '<' ? v < cc : v > cc; };
          const semua = []; for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) semua.push([x, y]);
          const benarList = rng.kocok(semua.filter((q) => ok(q[0], q[1]))), salahList = rng.kocok(semua.filter((q) => !ok(q[0], q[1])));
          const batas = semua.filter((q) => a * q[0] + b * q[1] === cc);
          const salah = (rel === '<' || rel === '>') && batas.length ? [batas[0], ...salahList] : salahList;
          const item = (q) => ({ t: '(' + q[0] + ', ' + q[1] + ')', k: q[0] + ',' + q[1], v: '(' + q[0] + ', ' + q[1] + ')' });
          const bn = benarList[0];
          const h = CP.rakitPilihan(rng, item(bn), salah.slice(0, 8).map(item));
          const hit = (q) => a * q[0] + b * q[1];
          return S.pilihan('Titik manakah yang memenuhi pertidaksamaan ' + (a === 1 ? '' : a) + 'x + ' + (b === 1 ? '' : b) + 'y ' + rel + ' ' + cc + '?', h, { jenis: rel, langkah: [
            st('Substitusikan tiap titik ke ' + (a === 1 ? '' : a) + 'x + ' + (b === 1 ? '' : b) + 'y lalu bandingkan dengan ' + cc + '.'),
            st('Titik ' + item(bn).t + ': ' + a + ' × ' + bn[0] + ' + ' + b + ' × ' + bn[1] + ' = ' + hit(bn) + ' ' + rel + ' ' + cc + ' (benar). Titik lain tidak memenuhi.', item(bn).t)] });
        }),
      lv('Sistem pertidaksamaan linear', 'x + y ≤ 8 dan x ≥ 2', 'pilihan',
        (r, c) => { for (;;) { const a = r.bulat(1, 3), b = r.bulat(1, 3), cc = r.bulat(6, 16), jenis = pilihJenis(r, c, ['x', 'y', 'xy']), t = r.bulat(1, 4); if (jenis === 'x' && a * t > cc - 4) continue; if (jenis === 'y' && b * t > cc - 4) continue; return { a, b, cc, jenis, t, s: r.bulat(1, 99999) }; } },
        ({ a, b, cc, jenis, t, s }) => {
          const rng = CP.buatRng(s);
          const sat1 = (x, y) => a * x + b * y <= cc;
          const sat2 = (x, y) => (jenis === 'x' ? x >= t : jenis === 'y' ? y >= t : a * x + b * y >= Math.max(1, cc - 6));
          const kedua = (x, y) => sat1(x, y) && sat2(x, y);
          const semua = []; for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) semua.push([x, y]);
          const benarList = rng.kocok(semua.filter((q) => kedua(q[0], q[1])));
          const salahSatu = rng.kocok(semua.filter((q) => (sat1(q[0], q[1]) !== sat2(q[0], q[1]))));
          const salahDua = rng.kocok(semua.filter((q) => !sat1(q[0], q[1]) && !sat2(q[0], q[1])));
          const item = (q) => ({ t: '(' + q[0] + ', ' + q[1] + ')', k: q[0] + ',' + q[1], v: '(' + q[0] + ', ' + q[1] + ')' });
          const bn = benarList[0];
          const h = CP.rakitPilihan(rng, item(bn), [...salahSatu.slice(0, 2), ...salahDua.slice(0, 2), ...salahSatu.slice(2, 6)].map(item));
          const p2 = jenis === 'x' ? 'x ≥ ' + t : jenis === 'y' ? 'y ≥ ' + t : (a === 1 ? '' : a) + 'x + ' + (b === 1 ? '' : b) + 'y ≥ ' + Math.max(1, cc - 6);
          const p1 = (a === 1 ? '' : a) + 'x + ' + (b === 1 ? '' : b) + 'y ≤ ' + cc;
          return S.pilihan('Titik manakah yang memenuhi kedua pertidaksamaan ' + p1 + ' dan ' + p2 + '?', h, { jenis: 'sistem:' + jenis, langkah: [
            st('Uji tiap titik pada kedua pertidaksamaan. Titik harus memenuhi keduanya sekaligus.'),
            st('Titik ' + item(bn).t + ' memenuhi ' + p1 + ' dan ' + p2 + '. Titik lain gagal pada paling sedikit satu pertidaksamaan.', item(bn).t)] });
        }),
      lv('Nilai maksimum bentuk objektif', 'Titik pojok daerah penyelesaian', 'angka',
        (r) => {
          const p = r.bulat(3, 8), q = r.bulat(2, 6), rr = r.bulat(2, 5), s = r.bulat(3, 8);
          return { V: [[0, 0], [p, 0], [q, rr], [0, s]], a: r.bulat(1, 9), b: r.bulat(1, 9), k: r.bulat(0, 1), nm: r.bulat(0, 2) };
        },
        (pr, ctx) => {
          const z = (q) => pr.a * q[0] + pr.b * q[1]; const v = kons(ctx);
          const nilai = pr.V.map(z), maks = Math.max(...nilai);
          const daftarV = pr.V.map((q) => '(' + q[0] + ', ' + q[1] + ')').join(', ');
          const nama = [['kursi', 'meja'], ['kemeja', 'celana'], ['kue kering', 'roti']][pr.nm];
          const teks = v === 'umum' ? 'Daerah penyelesaian suatu sistem pertidaksamaan memiliki titik pojok ' + daftarV + '. Tentukan nilai maksimum bentuk objektif z = ' + pr.a + 'x + ' + pr.b + 'y.' : 'Sebuah industri kecil membuat x ' + nama[0] + ' dan y ' + nama[1] + '. Titik pojok daerah produksi yang layak adalah ' + daftarV + '. Laba tiap ' + nama[0] + ' Rp' + pr.a + '.000 dan tiap ' + nama[1] + ' Rp' + pr.b + '.000. Berapa laba maksimum (dalam ribu rupiah)?';
          return S.angka(teks, maks, { jenis: 'objektif', langkah: [
            st('Nilai maksimum selalu terjadi di salah satu titik pojok. Hitung z = ' + pr.a + 'x + ' + pr.b + 'y di setiap titik.'),
            st(pr.V.map((q, i) => '(' + q[0] + ', ' + q[1] + '): ' + pr.a + '×' + q[0] + ' + ' + pr.b + '×' + q[1] + ' = ' + nilai[i]).join('; ') + '.'),
            st('Nilai terbesar adalah ' + maks + '.', [...nilai].sort((x, y) => y - x)[0])] });
        })
    ]
  });

  /* ========================= X-5 PERSAMAAN DAN FUNGSI KUADRAT ========================= */
  CP.aktifkan('X-5', {
    level: [
      lv('Akar persamaan kuadrat (a = 1)', 'x² − 7x + 12 = 0 → x = 3 atau 4', 'angka',
        (r, c) => { let p, q; do { p = r.bulat(1, 9); q = r.bulat(1, 9); } while (p === q); return { p, q, tanya: pilihJenis(r, c, ['besar', 'kecil', 'jumlah', 'kali']) }; },
        ({ p, q, tanya }) => {
          const S1 = p + q, P1 = p * q, bsr = Math.max(p, q), kcl = Math.min(p, q);
          const ans = tanya === 'besar' ? bsr : tanya === 'kecil' ? kcl : tanya === 'jumlah' ? S1 : P1;
          const nm = { besar: 'akar yang lebih besar', kecil: 'akar yang lebih kecil', jumlah: 'jumlah kedua akar', kali: 'hasil kali kedua akar' }[tanya];
          const fin = tanya === 'besar' ? bsr : tanya === 'kecil' ? kcl : tanya === 'jumlah' ? kcl + bsr : kcl * bsr;
          return S.angka('Tentukan ' + nm + ' dari persamaan ' + persKuad(1, -S1, P1) + '.', ans, { jenis: tanya, langkah: [
            st('Cari dua bilangan yang berjumlah ' + S1 + ' dan berhasil kali ' + P1 + ': ' + kcl + ' dan ' + bsr + '.'),
            st('Faktorisasi: (x − ' + kcl + ')(x − ' + bsr + ') = 0, sehingga x = ' + kcl + ' atau x = ' + bsr + '.'),
            st(nm + ' = ' + ans + '.', fin)] });
        }),
      lv('Akar persamaan kuadrat (a > 1)', '2x² − 10x + 12 = 0', 'angka',
        (r, c) => { let p, q; do { p = r.bulat(1, 7); q = r.bulat(1, 7); } while (p === q); return { a: r.bulat(2, 4), p, q, tanya: pilihJenis(r, c, ['besar', 'kecil']) }; },
        ({ a, p, q, tanya }) => {
          const b = -a * (p + q), cc = a * p * q, bsr = Math.max(p, q), kcl = Math.min(p, q), ans = tanya === 'besar' ? bsr : kcl;
          const s = S.angka('Tentukan ' + (tanya === 'besar' ? 'akar yang lebih besar' : 'akar yang lebih kecil') + ' dari persamaan ' + persKuad(a, b, cc) + '.', ans, { jenis: tanya, langkah: [
            st('Bagi seluruh persamaan dengan ' + a + ': ' + persKuad(1, b / a, cc / a) + '.'),
            st('Dua bilangan berjumlah ' + (p + q) + ' dan berhasil kali ' + (p * q) + ' adalah ' + kcl + ' dan ' + bsr + ', jadi (x − ' + kcl + ')(x − ' + bsr + ') = 0.'),
            st('Akar yang ' + (tanya === 'besar' ? 'lebih besar' : 'lebih kecil') + ' = ' + ans + '.', tanya === 'besar' ? Math.max(kcl, bsr) : Math.min(kcl, bsr))] });
          s.dibagi = [{ a: -b, b: a }, { a: cc, b: a }]; return s;
        }),
      lv('Diskriminan', 'D = b² − 4ac', 'angka',
        (r) => ({ a: r.bulat(1, 4), b: nz(r, -8, 8), cc: nz(r, -6, 8) }),
        ({ a, b, cc }) => {
          const D = b * b - 4 * a * cc;
          const info = D > 0 ? 'D > 0: dua akar real berbeda.' : D === 0 ? 'D = 0: satu akar real (kembar).' : 'D < 0: tidak ada akar real.';
          return S.angka('Tentukan nilai diskriminan dari persamaan ' + persKuad(a, b, cc) + '.', D, { jenis: D > 0 ? 'D+' : D === 0 ? 'D0' : 'D-', izin: { minus: true }, langkah: [
            st('Dari persamaan: a = ' + a + ', b = ' + mn(b) + ', c = ' + mn(cc) + '. Rumus D = b² − 4ac.'),
            st('D = (' + mn(b) + ')² − 4 × ' + a + ' × (' + mn(cc) + ') = ' + (b * b) + ' − (' + mn(4 * a * cc) + ') = ' + mn(D) + '. ' + info, (b * b) - (4 * a * cc))] });
        }),
      lv('Titik puncak dan sumbu simetri', 'f(x) = a(x − h)² + k', 'angka',
        (r, c) => ({ a: r.pilih([1, 1, 2, 3, -1, -2]), h: r.bulat(1, 6), k: r.bulat(-9, 9), jenis: pilihJenis(r, c, ['xp', 'yp', 'sumbu']) }),
        ({ a, h, k, jenis }) => {
          const b = -2 * a * h, cc = a * h * h + k;
          const yp = a * h * h + b * h + cc;
          const g = gbrParabola(a, b, cc, h - 4, h + 4, { titik: [{ x: h, y: yp, t: '', dy: 0 }], alt: 'Grafik ' + fKuad(a, b, cc) + ' dengan titik puncak' });
          const dasar = [st('Untuk f(x) = ax² + bx + c, sumbu simetri x = −b / (2a) = −(' + mn(b) + ') / (2 × ' + mn(a) + ') = ' + (-b) + ' / ' + (2 * a) + ' = ' + h + '.')];
          if (jenis === 'xp' || jenis === 'sumbu') {
            const s = S.angka(jenis === 'xp' ? 'Tentukan absis (nilai x) titik puncak grafik ' + fKuad(a, b, cc) + '.' : 'Sumbu simetri grafik ' + fKuad(a, b, cc) + ' adalah garis x = …', h, { jenis, gambar: g, langkah: [...dasar, st(jenis === 'xp' ? 'Absis titik puncak = ' + h + '.' : 'Persamaan sumbu simetri x = ' + h + '.', -b / (2 * a))] });
            s.dibagi = [{ a: -b, b: 2 * a }]; return s;
          }
          const s = S.angka('Tentukan ordinat (nilai y) titik puncak grafik ' + fKuad(a, b, cc) + '.', yp, { jenis: 'yp', gambar: g, izin: { minus: true }, langkah: [...dasar,
            st('Ordinat = f(' + h + ') = ' + mn(a) + ' × ' + h + '² + (' + mn(b) + ') × ' + h + ' + (' + mn(cc) + ') = ' + mn(a * h * h) + ' + ' + mn(b * h) + ' + ' + mn(cc) + ' = ' + mn(yp) + '.', a * h * h + b * h + cc)] });
          s.dibagi = [{ a: -b, b: 2 * a }]; return s;
        }),
      lv('Menentukan fungsi dari grafik', 'Grafik memotong sumbu x di p dan q', 'pilihan',
        (r) => { let p, q; do { p = r.bulat(-5, 6); q = r.bulat(-5, 6); } while (p === q || p * q === 0); return { p, q, s: r.bulat(1, 99999) }; },
        ({ p, q, s }) => {
          const S1 = p + q, P1 = p * q, bn = { 'x²': 1, x: -S1, '': P1 };
          const opsi = (m) => ({ t: 'f(x) = ' + rend(m), k: kunciAlj(m), v: 'f(x) = ' + rend(m) });
          const salah = [{ 'x²': 1, x: S1, '': P1 }, { 'x²': 1, x: -S1, '': -P1 }, { 'x²': 1, x: S1, '': -P1 }, { 'x²': 1, x: -P1, '': S1 }, { 'x²': 1, '': P1 }, { 'x²': 1, x: -S1 }].map(opsi);
          const h = CP.rakitPilihan(CP.buatRng(s), opsi(bn), salah);
          const xm = Math.min(p, q, 0) - 1.5, xM = Math.max(p, q, 0) + 1.5;
          const g = gbrParabola(1, -S1, P1, xm, xM, { titik: [{ x: Math.min(p, q), y: 0, t: 'x = ' + mn(Math.min(p, q)), dy: 16, a: 'end', ax: -4 }, { x: Math.max(p, q), y: 0, t: 'x = ' + mn(Math.max(p, q)), dy: 16, a: 'start', ax: 4 }], alt: 'Grafik fungsi kuadrat memotong sumbu x di ' + mn(p) + ' dan ' + mn(q) });
          return S.pilihan('Grafik fungsi kuadrat terbuka ke atas dan memotong sumbu x di x = ' + mn(p) + ' dan x = ' + mn(q) + '. Fungsi kuadrat yang sesuai adalah …', h, { jenis: 'dariAkar', gambar: g, langkah: [
            st('Bentuk faktor: f(x) = (x − (' + mn(p) + '))(x − (' + mn(q) + ')) = (x ' + (p < 0 ? '+' : MIN) + ' ' + Math.abs(p) + ')(x ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q) + ').'),
            st('Jumlah akar ' + mn(S1) + ' dan hasil kali ' + mn(P1) + ', jadi f(x) = x² − (' + mn(S1) + ')x + (' + mn(P1) + ').'),
            st(opsi(bn).t + '.', opsi(bn).t)] });
        }),
      lv('Penerapan nilai maksimum', 'Tinggi lemparan, luas pagar, laba produksi', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['bola', 'pagar', 'laba', 'bingkai']), A: r.bulat(2, 6), B: r.bulat(3, 12), K: 4 * r.bulat(5, 15), C: r.bulat(1, 9) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'bola') {
            const max = 5 * p.A * p.A, g = gbrParabola(-5, 10 * p.A, 0, -0.2, 2 * p.A + 0.2, { titik: [{ x: p.A, y: max, t: '', dy: 0 }], alt: 'Grafik tinggi benda terhadap waktu' });
            return S.angka((v === 'umum' ? 'Sebuah bola dilempar ke atas. Tinggi bola (meter) setelah t detik ' : 'Sebuah barang dilontarkan dari mesin pelontar. Tinggi barang (meter) setelah t detik ') + 'dirumuskan h(t) = −5t² + ' + (10 * p.A) + 't. Berapa tinggi maksimum yang dicapai?', max, { jenis: 'bola', satuan: 'm', gambar: g, langkah: [
              st('Tinggi maksimum di puncak parabola: t = −b/(2a) = −' + (10 * p.A) + ' / (2 × (−5)) = ' + p.A + ' detik.'),
              st('h(' + p.A + ') = −5 × ' + p.A + '² + ' + (10 * p.A) + ' × ' + p.A + ' = −' + (5 * p.A * p.A) + ' + ' + (10 * p.A * p.A) + ' = ' + max + ' m.', -5 * p.A * p.A + 10 * p.A * p.A)] });
          }
          if (p.jenis === 'pagar' || p.jenis === 'bingkai') {
            const sisi = p.K / 4, L = sisi * sisi;
            const teks = p.jenis === 'pagar' ? (v === 'umum' ? 'Pak Tani memiliki pagar kawat sepanjang ' + p.K + ' m untuk mengelilingi kebun berbentuk persegi panjang. Berapa luas kebun terbesar yang mungkin (m²)?' : 'Sebuah toko memiliki pita pembatas sepanjang ' + p.K + ' m untuk membatasi area pajang berbentuk persegi panjang. Berapa luas area pajang terbesar yang mungkin (m²)?') : 'Seorang pengrajin memiliki profil aluminium sepanjang ' + p.K + ' cm untuk membuat bingkai persegi panjang. Berapa luas bingkai terbesar yang mungkin (cm²)?';
            const s = S.angka(teks, L, { jenis: p.jenis, satuan: p.jenis === 'bingkai' ? 'cm²' : 'm²', langkah: [
              st('Keliling ' + p.K + ' berarti p + l = ' + (p.K / 2) + '. Luas = p × (' + (p.K / 2) + ' − p), parabola terbuka ke bawah dengan puncak di p = ' + (p.K / 4) + '.'),
              st('Luas maksimum = ' + (p.K / 4) + ' × ' + (p.K / 4) + ' = ' + L + '.', (p.K / 4) * (p.K / 4))] });
            s.dibagi = [{ a: p.K, b: 4 }]; return s;
          }
          const h = p.B, cc = h * h - p.C, max = h * h - p.C;
          const g = gbrParabola(-1, 2 * h, -cc + 0 * 0 - 0, 0, 2 * h, {});
          const gg = gbrParabola(-1, 2 * h, -(h * h - max + 0) + 0, 0, 2 * h, { titik: [{ x: h, y: max, t: '', dy: 0 }], alt: 'Grafik laba terhadap jumlah produksi' });
          const c0 = h * h - max;
          return S.angka('Laba harian sebuah usaha (dalam ribu rupiah) dari menjual x unit dirumuskan L(x) = −x² + ' + (2 * h) + 'x − ' + c0 + '. Berapa laba maksimum (dalam ribu rupiah)?', max, { jenis: 'laba', gambar: gg, langkah: [
            st('Laba maksimum di puncak: x = −b/(2a) = −' + (2 * h) + ' / (2 × (−1)) = ' + h + ' unit.'),
            st('L(' + h + ') = −' + (h * h) + ' + ' + (2 * h * h) + ' − ' + c0 + ' = ' + max + '.', -(h * h) + 2 * h * h - c0)] });
        })
    ]
  });

  /* ========================= X-6 REPRESENTASI DAN INTERPRETASI DATA ========================= */
  function kelasData(awal, k) { const out = []; for (let i = 0; i < k; i++) { const a = awal + i * 10; out.push({ lo: a, hi: a + 9, mid: a + 4.5, label: a + '-' + (a + 9) }); } return out; }
  const histGbr = (kls, f, judul) => CP.gbr.batangGbr(kls.map((x) => x.label), f, Math.max(...f) + 2 + ((Math.max(...f) + 2) % 2), judul);
  const sortAsc = (a) => a.slice().sort((x, y) => x - y);
  const medianList = (a) => { const n = a.length; return n % 2 ? P(a[(n - 1) / 2], 1) : P(a[n / 2 - 1] + a[n / 2], 2); };
  function kuartil(urut) {
    const n = urut.length, q2 = medianList(urut), bawah = urut.slice(0, Math.floor(n / 2)), atas = urut.slice(Math.ceil(n / 2));
    return { q1: medianList(bawah), q2, q3: medianList(atas), bawah, atas };
  }
  const boxGbr = (mi, q1, q2, q3, ma, judul) => {
    const X0 = 24, X1 = 296, sk = (X1 - X0) / (ma - mi || 1), xx = (v) => X0 + (v - mi) * sk, y = 52;
    const el = [H.l(xx(mi), y, xx(q1), y, 'garis'), H.l(xx(q3), y, xx(ma), y, 'garis'), H.r(xx(q1), y - 22, xx(q3) - xx(q1), 44, 'isi'), H.l(xx(q2), y - 22, xx(q2), y + 22, 'garis'),
      H.l(xx(mi), y - 12, xx(mi), y + 12, 'garis'), H.l(xx(ma), y - 12, xx(ma), y + 12, 'garis')];
    [[mi, 'min'], [q1, 'Q1'], [q2, 'Q2'], [q3, 'Q3'], [ma, 'maks']].forEach(([v, n], i) => el.push(H.t(xx(v), y + 38 + (i % 2) * 16, n + '=' + v, 'middle', 'kecil')));
    return { tipe: 'gambar', alt: judul + ': min ' + mi + ', Q1 ' + q1 + ', median ' + q2 + ', Q3 ' + q3 + ', maks ' + ma, tinggi: 118, el };
  };

  CP.aktifkan('X-6', {
    level: [
      lv('Membaca histogram', 'Frekuensi kelas, total, selisih', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['frek', 'total', 'selisih']), awal: r.pilih([41, 51, 61]), f: Array.from({ length: 5 }, () => r.bulat(2, 14)), i: r.bulat(0, 4) }),
        (p, ctx) => {
          const kls = kelasData(p.awal, 5), v = kons(ctx), g = histGbr(kls, p.f, 'Histogram frekuensi');
          const unit = v === 'umum' ? 'siswa' : 'pelanggan', ket = v === 'umum' ? 'nilai ulangan' : 'jumlah belanja (ribu rupiah)';
          if (p.jenis === 'frek') return S.angka('Histogram menunjukkan ' + ket + ' sekelompok ' + unit + '. Berapa banyak ' + unit + ' pada kelas ' + kls[p.i].label + '?', p.f[p.i], { jenis: 'frek', gambar: g, langkah: [st('Baca tinggi batang kelas ' + kls[p.i].label + '.'), st('Frekuensinya ' + p.f[p.i] + '.', p.f[p.i])] });
          if (p.jenis === 'total') return S.angka('Histogram menunjukkan ' + ket + ' sekelompok ' + unit + '. Berapa banyak ' + unit + ' seluruhnya?', p.f.reduce((a, b) => a + b, 0), { jenis: 'total', gambar: g, langkah: [st('Jumlahkan tinggi semua batang: ' + p.f.join(' + ') + '.'), st('Jumlahnya ' + p.f.reduce((a, b) => a + b, 0) + '.', p.f.reduce((a, b) => a + b, 0))] });
          const mx = Math.max(...p.f), mi = Math.min(...p.f);
          return S.angka('Histogram menunjukkan ' + ket + ' sekelompok ' + unit + '. Berapa selisih frekuensi kelas yang paling banyak dan paling sedikit?', mx - mi, { jenis: 'selisih', gambar: g, langkah: [st('Frekuensi terbesar ' + mx + ' dan terkecil ' + mi + '.'), st(mx + ' − ' + mi + ' = ' + (mx - mi) + '.', Math.max(...p.f) - Math.min(...p.f))] });
        }),
      lv('Rata-rata data berkelompok', 'Titik tengah × frekuensi', 'angka',
        (r) => {
          for (;;) {
            const k = r.bulat(4, 5), awal = r.pilih([41, 51, 61]), f = Array.from({ length: k }, () => r.bulat(2, 10));
            const kls = kelasData(awal, k), n = f.reduce((a, b) => a + b, 0), jml = f.reduce((a, x, i) => a + x * kls[i].mid, 0);
            if (Number.isInteger(jml / n) || (jml * 2) % n === 0) return { awal, f, k };
          }
        },
        ({ awal, f, k }, ctx) => {
          const kls = kelasData(awal, k), n = f.reduce((a, b) => a + b, 0), jml = f.reduce((a, x, i) => a + x * kls[i].mid, 0), v = kons(ctx);
          const rata = P(jml * 2, n * 2);
          const unit = v === 'umum' ? 'siswa' : 'pelanggan';
          const s = S.angka('Data nilai berikut dikelompokkan: ' + kls.map((x, i) => x.label + ' (' + f[i] + ' ' + unit + ')').join(', ') + '. Tentukan rata-rata data tersebut.', rata, { jenis: 'meanKel', izin: { koma: true }, gambar: histGbr(kls, f, 'Histogram data berkelompok'), langkah: [
            st('Titik tengah tiap kelas: ' + kls.map((x) => x.mid).join(', ') + '.'),
            st('Jumlah f × titik tengah = ' + kls.map((x, i) => f[i] + '×' + x.mid).join(' + ') + ' = ' + jml + '. Jumlah frekuensi = ' + n + '.'),
            st('Rata-rata = ' + jml + ' ÷ ' + n + ' = ' + dec(rata) + '.', jml / n)] });
          return s;
        }),
      lv('Modus data berkelompok', 'Mo = Tb + d1/(d1 + d2) × p', 'angka',
        (r) => {
          const [d1, d2] = r.pilih([[1, 1], [1, 4], [2, 3], [3, 2], [4, 1], [2, 8], [3, 7]]);
          const k = 5, m = r.bulat(1, 3), fm = Math.max(d1, d2) + r.bulat(3, 8); const f = [];
          for (let i = 0; i < k; i++) f.push(i === m ? fm : i === m - 1 ? fm - d1 : i === m + 1 ? fm - d2 : r.bulat(1, Math.max(1, fm - 1)));
          return { awal: r.pilih([41, 51, 61]), f, m, d1, d2 };
        },
        ({ awal, f, m, d1, d2 }, ctx) => {
          const kls = kelasData(awal, 5), tb = kls[m].lo - 0.5, mo = P(Math.round(tb * 2) * 5 + 10 * d1 * 0 + 0, 10);
          const tbP = P(Math.round(tb * 2), 2), tambah = P(10 * d1, d1 + d2), hasil = CP.pTambah(tbP, tambah);
          const unit = kons(ctx) === 'umum' ? 'siswa' : 'pelanggan';
          const s = S.angka('Data nilai dikelompokkan: ' + kls.map((x, i) => x.label + ' (' + f[i] + ' ' + unit + ')').join(', ') + '. Tentukan modus data tersebut.', hasil, { jenis: 'modusKel', izin: { koma: true }, gambar: histGbr(kls, f, 'Histogram data berkelompok'), langkah: [
            st('Kelas modus adalah kelas dengan frekuensi terbesar: ' + kls[m].label + ' (f = ' + f[m] + '). Tepi bawah Tb = ' + dec(tbP) + ', panjang kelas p = 10.'),
            st('d1 = ' + f[m] + ' − ' + f[m - 1] + ' = ' + d1 + ' dan d2 = ' + f[m] + ' − ' + f[m + 1] + ' = ' + d2 + '.'),
            st('Mo = ' + dec(tbP) + ' + ' + d1 + '/(' + d1 + ' + ' + d2 + ') × 10 = ' + dec(tbP) + ' + ' + dec(tambah) + ' = ' + dec(hasil) + '.', tb + (10 * d1) / (d1 + d2))] });
          s.dibagi = [{ a: 10 * d1, b: d1 + d2 }]; return s;
        }),
      lv('Kuartil data tunggal', 'Q1, Q2, Q3', 'angka',
        (r, c) => { const n = r.bulat(7, 11); return { jenis: pilihJenis(r, c, ['q1', 'q2', 'q3']), data: Array.from({ length: n }, () => r.bulat(10, 60)) }; },
        ({ jenis, data }, ctx) => {
          const urut = sortAsc(data), q = kuartil(urut), v = kons(ctx), n = urut.length;
          const ans = q[jenis];
          const nm = { q1: 'kuartil bawah (Q1)', q2: 'median (Q2)', q3: 'kuartil atas (Q3)' }[jenis];
          const lbl = v === 'umum' ? 'Data nilai ' + n + ' siswa: ' : 'Data penjualan harian ' + n + ' hari (paket): ';
          const bagianTeks = jenis === 'q1' ? 'Q1 = median setengah bawah: ' + q.bawah.join(', ') : jenis === 'q3' ? 'Q3 = median setengah atas: ' + q.atas.join(', ') : 'Q2 = nilai tengah seluruh data';
          return S.angka(lbl + data.join(', ') + '. Tentukan ' + nm + '.', ans, { jenis, izin: { koma: true }, langkah: [
            st('Urutkan data: ' + urut.join(', ') + '.'),
            st(bagianTeks + (n % 2 && jenis !== 'q2' ? ' (data tengah tidak ikut dihitung).' : '.')),
            st(nm + ' = ' + dec(ans) + '.', ans)] });
        }),
      lv('Diagram kotak garis', 'Jangkauan dan jangkauan antarkuartil', 'angka',
        (r, c) => {
          const mi = r.bulat(5, 30), q1 = mi + r.bulat(3, 12), q2 = q1 + r.bulat(2, 12), q3 = q2 + r.bulat(2, 12), ma = q3 + r.bulat(3, 15);
          return { mi, q1, q2, q3, ma, jenis: pilihJenis(r, c, ['iqr', 'jangkauan', 'setengah']) };
        },
        ({ mi, q1, q2, q3, ma, jenis }, ctx) => {
          const g = boxGbr(mi, q1, q2, q3, ma, 'Diagram kotak garis');
          const lab = kons(ctx) === 'umum' ? 'nilai ulangan' : 'penjualan harian (paket)';
          if (jenis === 'iqr') return S.angka('Diagram kotak garis menunjukkan ' + lab + '. Berapa jangkauan antarkuartil (Q3 − Q1)?', q3 - q1, { jenis, gambar: g, langkah: [st('Baca Q1 = ' + q1 + ' dan Q3 = ' + q3 + ' dari diagram.'), st('Jangkauan antarkuartil = ' + q3 + ' − ' + q1 + ' = ' + (q3 - q1) + '.', q3 - q1)] });
          if (jenis === 'jangkauan') return S.angka('Diagram kotak garis menunjukkan ' + lab + '. Berapa jangkauan data (maksimum − minimum)?', ma - mi, { jenis, gambar: g, langkah: [st('Baca maksimum = ' + ma + ' dan minimum = ' + mi + '.'), st('Jangkauan = ' + ma + ' − ' + mi + ' = ' + (ma - mi) + '.', ma - mi)] });
          const sk = P(q3 - q1, 2);
          return S.angka('Diagram kotak garis menunjukkan ' + lab + '. Berapa simpangan kuartil (setengah dari Q3 − Q1)?', sk, { jenis, izin: { koma: true }, gambar: g, langkah: [st('Simpangan kuartil = (Q3 − Q1) ÷ 2 = (' + q3 + ' − ' + q1 + ') ÷ 2.'), st((q3 - q1) + ' ÷ 2 = ' + dec(sk) + '.', (q3 - q1) / 2)] });
        }),
      lv('Ukuran penyebaran dan rata-rata gabungan', 'Ragam dan gabungan beberapa kelompok', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['ragam', 'gabung3']);
          if (jenis === 'ragam') {
            for (;;) {
              const n = r.bulat(4, 6), mu = r.bulat(10, 30), d = []; for (let i = 0; i < n - 1; i++) d.push(r.bulat(-5, 5));
              const last = -d.reduce((a, b) => a + b, 0); if (Math.abs(last) > 6) continue; d.push(last);
              const ss = d.reduce((a, b) => a + b * b, 0); if (ss % n === 0 && ss > 0) return { jenis, mu, data: r.kocok(d.map((x) => mu + x)) };
            }
          }
          for (;;) { const n = [r.bulat(8, 25), r.bulat(8, 25), r.bulat(8, 25)], m = [r.bulat(60, 90), r.bulat(60, 90), r.bulat(60, 90)]; const N = n[0] + n[1] + n[2], T = n[0] * m[0] + n[1] * m[1] + n[2] * m[2]; if (T % N === 0) return { jenis, n, m }; }
        },
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'ragam') {
            const n = p.data.length, dev = p.data.map((x) => x - p.mu), ss = dev.reduce((a, b) => a + b * b, 0), jml = p.data.reduce((a, b) => a + b, 0);
            const teks = (v === 'umum' ? 'Data tinggi tanaman (cm) dari ' + n + ' sampel: ' : 'Data berat ' + n + ' produk dari satu lini produksi (gram): ') + p.data.join(', ') + '. Tentukan ragam (varians) data tersebut.';
            const s = S.angka(teks, ss / n, { jenis: 'ragam', langkah: [
              st('Rata-rata = ' + jml + ' ÷ ' + n + ' = ' + p.mu + '.'),
              st('Selisih terhadap rata-rata: ' + dev.map(mn).join(', ') + '. Kuadratnya: ' + dev.map((d) => d * d).join(' + ') + ' = ' + ss + '.'),
              st('Ragam = ' + ss + ' ÷ ' + n + ' = ' + (ss / n) + '.', ss / n)] });
            s.dibagi = [{ a: jml, b: n }, { a: ss, b: n }]; return s;
          }
          const N = p.n[0] + p.n[1] + p.n[2], T = p.n[0] * p.m[0] + p.n[1] * p.m[1] + p.n[2] * p.m[2];
          const teks = v === 'umum' ? 'Tiga kelas masing-masing terdiri dari ' + p.n.join(', ') + ' siswa dengan rata-rata nilai ' + p.m.join(', ') + '. Berapa rata-rata nilai gabungan ketiga kelas?' : 'Tiga cabang toko melayani ' + p.n.join(', ') + ' pelanggan dengan rata-rata belanja (ribu rupiah) ' + p.m.join(', ') + '. Berapa rata-rata belanja gabungan (ribu rupiah)?';
          const s = S.angka(teks, T / N, { jenis: 'gabung3', langkah: [
            st('Jumlah tiap kelompok: ' + p.n.map((x, i) => x + '×' + p.m[i] + '=' + x * p.m[i]).join(', ') + '. Total = ' + T + '.'),
            st('Banyak seluruh data = ' + N + '. Rata-rata gabungan = ' + T + ' ÷ ' + N + ' = ' + (T / N) + '.', T / N)] });
          s.dibagi = [{ a: T, b: N }]; return s;
        })
    ]
  });

  /* ========================= X-7 PELUANG ========================= */
  CP.aktifkan('X-7', {
    level: [
      lv('Peluang kejadian sederhana', 'Dadu, kartu, bola', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['dadu', 'kartu', 'bola']), k: r.bulat(0, 3), m: [r.bulat(2, 9), r.bulat(2, 9), r.bulat(2, 9)] }),
        (p, ctx) => {
          const v = kons(ctx);
          if (v === 'vokasi' && p.jenis === 'bola') {
            const lulus = p.m[0] + p.m[1] + 3, gagal = p.m[2], N = lulus + gagal;
            return S.pecahan('Dari ' + N + ' produk hasil bengkel, ' + lulus + ' produk lulus uji mutu dan sisanya cacat. Satu produk dipilih acak. Tentukan peluang produk yang terpilih lulus uji mutu.', P(lulus, N), { jenis: 'qc', langkah: [
              st('Peluang = banyak kejadian yang diinginkan ÷ banyak semua kemungkinan.'), st('Produk lulus = ' + lulus + ', seluruh produk = ' + N + '. Peluang = ' + lulus + '/' + N + ' = ' + pf(P(lulus, N)) + '.', P(lulus, N))] });
          }
          if (p.jenis === 'dadu') {
            const sets = [['genap', [2, 4, 6]], ['ganjil', [1, 3, 5]], ['prima', [2, 3, 5]], ['lebih dari 4', [5, 6]]];
            const [nm, ev] = sets[p.k];
            return S.pecahan('Sebuah dadu bersisi enam dilempar satu kali. Tentukan peluang muncul mata dadu ' + nm + '.', P(ev.length, 6), { jenis: 'dadu', langkah: [
              st('Ruang sampel: {1, 2, 3, 4, 5, 6}, jadi n(S) = 6.'), st('Kejadian ' + nm + ' = {' + ev.join(', ') + '}, n(A) = ' + ev.length + '. Peluang = ' + ev.length + '/6 = ' + pf(P(ev.length, 6)) + '.', P(ev.length, 6))] });
          }
          if (p.jenis === 'kartu') {
            const sets = [['hati', 13], ['As', 4], ['bergambar (Raja, Ratu, Jack)', 12], ['merah', 26]];
            const [nm, ev] = sets[p.k];
            return S.pecahan('Sebuah kartu diambil acak dari satu set kartu bridge (52 kartu). Tentukan peluang terambil kartu ' + nm + '.', P(ev, 52), { jenis: 'kartu', langkah: [
              st('Jumlah semua kartu n(S) = 52. Banyak kartu ' + nm + ' = ' + ev + '.'), st('Peluang = ' + ev + '/52 = ' + pf(P(ev, 52)) + '.', P(ev, 52))] });
          }
          const [mm, bb, hh] = p.m, N = mm + bb + hh, warna = [['merah', mm], ['biru', bb], ['hijau', hh]][p.k % 3];
          return S.pecahan('Sebuah kantong berisi ' + mm + ' bola merah, ' + bb + ' bola biru, dan ' + hh + ' bola hijau. Satu bola diambil acak. Tentukan peluang terambil bola ' + warna[0] + '.', P(warna[1], N), { jenis: 'bola', langkah: [
            st('Banyak seluruh bola = ' + mm + ' + ' + bb + ' + ' + hh + ' = ' + N + '.'), st('Peluang bola ' + warna[0] + ' = ' + warna[1] + '/' + N + ' = ' + pf(P(warna[1], N)) + '.', P(warna[1], N))] });
        }),
      lv('Banyak kemungkinan (aturan perkalian)', 'Dadu, koin, kombinasi pilihan', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['dadu2', 'koin', 'baju', 'menu']), n: r.bulat(3, 6), a: r.bulat(2, 5), b: r.bulat(2, 5), cc: r.bulat(2, 4) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'dadu2') return S.angka('Dua buah dadu dilempar bersamaan. Berapa banyak pasangan hasil yang mungkin?', 36, { jenis: 'dadu2', langkah: [st('Dadu pertama punya 6 kemungkinan, dadu kedua juga 6. Kalikan.'), st('6 × 6 = 36.', 6 * 6)] });
          if (p.jenis === 'koin') return S.angka('Sebuah koin dilempar ' + p.n + ' kali. Berapa banyak urutan hasil yang mungkin?', Math.pow(2, p.n), { jenis: 'koin', langkah: [st('Setiap lemparan punya 2 kemungkinan (angka atau gambar).'), st('2 × ' + Array(p.n - 1).fill(2).join(' × ') + ' = 2' + sup(p.n) + ' = ' + Math.pow(2, p.n) + '.', Math.pow(2, p.n))] });
          if (p.jenis === 'baju') return S.angka(v === 'umum' ? 'Ani memiliki ' + p.a + ' baju, ' + p.b + ' celana, dan ' + p.cc + ' pasang sepatu. Berapa banyak cara berbeda ia berpakaian lengkap?' : 'Sebuah toko menyediakan ' + p.a + ' model kemeja, ' + p.b + ' pilihan warna, dan ' + p.cc + ' ukuran. Berapa banyak varian produk berbeda yang tersedia?', p.a * p.b * p.cc, { jenis: 'baju', langkah: [st('Pakai aturan perkalian: ' + p.a + ' × ' + p.b + ' × ' + p.cc + '.'), st(p.a + ' × ' + p.b + ' = ' + (p.a * p.b) + ', lalu × ' + p.cc + ' = ' + (p.a * p.b * p.cc) + '.', p.a * p.b * p.cc)] });
          return S.angka(v === 'umum' ? 'Sebuah kantin menyediakan ' + p.a + ' pilihan makanan, ' + p.b + ' pilihan minuman, dan ' + p.cc + ' pilihan camilan. Berapa banyak paket yang terdiri dari satu makanan, satu minuman, dan satu camilan?' : 'Sebuah toko online menawarkan ' + p.a + ' jenis produk, ' + p.b + ' jasa pengiriman, dan ' + p.cc + ' metode pembayaran. Berapa banyak kombinasi pesanan yang mungkin?', p.a * p.b * p.cc, { jenis: 'menu', langkah: [st('Pilihan saling bebas, jadi dikalikan: ' + p.a + ' × ' + p.b + ' × ' + p.cc + '.'), st('Hasilnya ' + (p.a * p.b * p.cc) + '.', p.a * p.b * p.cc)] });
        }),
      lv('Komplemen dan frekuensi harapan', 'P(A′) = 1 − P(A); F = n × P', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['komplemen', 'harapan']), q: r.pilih([4, 5, 8, 10, 12, 20]), pp: r.bulat(1, 3), n: 100 * r.bulat(1, 8), pr: r.pilih([5, 10, 20, 25, 30, 40]) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'komplemen') {
            const a = P(p.pp, p.q), k = CP.pKurang(P(1, 1), a);
            const teks = v === 'umum' ? 'Peluang hujan turun besok adalah ' + p.pp + '/' + p.q + '. Tentukan peluang besok tidak hujan.' : 'Peluang sebuah produk cacat adalah ' + p.pp + '/' + p.q + '. Tentukan peluang produk tidak cacat.';
            return S.pecahan(teks, k, { jenis: 'komplemen', langkah: [st('Peluang kejadian komplemen = 1 − peluang kejadian.'), st('1 − ' + p.pp + '/' + p.q + ' = ' + (p.q - p.pp) + '/' + p.q + ' = ' + pf(k) + '.', k)] });
          }
          const fh = (p.n * p.pr) / 100;
          const teks = v === 'umum' ? 'Peluang sebuah lampu menyala adalah ' + p.pr + '%. Jika ' + p.n + ' lampu diuji, berapa frekuensi harapan lampu menyala?' : 'Peluang seorang pengunjung toko membeli adalah ' + p.pr + '%. Jika hari ini ada ' + p.n + ' pengunjung, berapa frekuensi harapan pengunjung yang membeli?';
          const s = S.angka(teks, fh, { jenis: 'harapan', langkah: [st('Frekuensi harapan = banyak percobaan × peluang.'), st(p.n + ' × ' + p.pr + '/100 = ' + p.n / 100 + ' × ' + p.pr + ' = ' + fh + '.', (p.n / 100) * p.pr)] });
          s.dibagi = [{ a: p.n, b: 100 }]; return s;
        }),
      lv('Peluang gabungan dua kejadian', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', 'pecahan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['rumus', 'lepas', 'dadu']);
          if (jenis === 'dadu') return { jenis, k: r.bulat(0, 3) };
          const a = r.bulat(3, 9), b = r.bulat(3, 9), ab = r.bulat(1, Math.min(a, b) - 1);
          return { jenis, a, b, ab, N: 20 };
        },
        (p) => {
          if (p.jenis === 'dadu') {
            const sets = [['genap', [2, 4, 6], 'lebih dari 4', [5, 6]], ['ganjil', [1, 3, 5], 'prima', [2, 3, 5]], ['kurang dari 4', [1, 2, 3], 'genap', [2, 4, 6]], ['prima', [2, 3, 5], 'lebih dari 3', [4, 5, 6]]];
            const [n1, e1, n2, e2] = sets[p.k], uni = [...new Set([...e1, ...e2])].sort((x, y) => x - y);
            return S.pecahan('Sebuah dadu dilempar satu kali. Tentukan peluang muncul mata dadu ' + n1 + ' atau ' + n2 + '.', P(uni.length, 6), { jenis: 'dadu', langkah: [
              st('A = {' + e1.join(', ') + '}, B = {' + e2.join(', ') + '}. Gabungan A ∪ B = {' + uni.join(', ') + '} (anggota yang sama dihitung sekali).'),
              st('P(A atau B) = ' + uni.length + '/6 = ' + pf(P(uni.length, 6)) + '.', P(uni.length, 6))] });
          }
          if (p.jenis === 'lepas') {
            const hasil = P(p.a + p.b, p.N);
            return S.pecahan('Diketahui P(A) = ' + p.a + '/' + p.N + ' dan P(B) = ' + p.b + '/' + p.N + '. Jika A dan B saling lepas, tentukan P(A ∪ B).', hasil, { jenis: 'lepas', langkah: [st('Saling lepas berarti P(A ∩ B) = 0, sehingga P(A ∪ B) = P(A) + P(B).'), st(p.a + '/' + p.N + ' + ' + p.b + '/' + p.N + ' = ' + (p.a + p.b) + '/' + p.N + ' = ' + pf(hasil) + '.', hasil)] });
          }
          const hasil = P(p.a + p.b - p.ab, p.N);
          return S.pecahan('Diketahui P(A) = ' + p.a + '/' + p.N + ', P(B) = ' + p.b + '/' + p.N + ', dan P(A ∩ B) = ' + p.ab + '/' + p.N + '. Tentukan P(A ∪ B).', hasil, { jenis: 'rumus', langkah: [st('P(A ∪ B) = P(A) + P(B) − P(A ∩ B).'), st('(' + p.a + ' + ' + p.b + ' − ' + p.ab + ')/' + p.N + ' = ' + (p.a + p.b - p.ab) + '/' + p.N + ' = ' + pf(hasil) + '.', hasil)] });
        }),
      lv('Peluang dua pengambilan', 'Dengan dan tanpa pengembalian; dua dadu', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['kembali', 'tanpa', 'dua dadu']), m: r.bulat(2, 6), b: r.bulat(2, 6), h: r.bulat(1, 4), j: r.bulat(3, 11) }),
        (p) => {
          const N = p.m + p.b + p.h;
          if (p.jenis === 'kembali') {
            const hasil = CP.pKali(P(p.m, N), P(p.b, N));
            return S.pecahan('Sebuah kantong berisi ' + p.m + ' bola merah, ' + p.b + ' bola biru, dan ' + p.h + ' bola hijau. Dua bola diambil satu per satu dengan pengembalian. Tentukan peluang terambil merah pada pengambilan pertama dan biru pada pengambilan kedua.', hasil, { jenis: 'kembali', langkah: [
              st('Karena dikembalikan, kedua pengambilan saling bebas dan jumlah bola tetap ' + N + '.'),
              st(p.m + '/' + N + ' × ' + p.b + '/' + N + ' = ' + (p.m * p.b) + '/' + (N * N) + ' = ' + pf(hasil) + '.', hasil)] });
          }
          if (p.jenis === 'tanpa') {
            const hasil = CP.pKali(P(p.m, N), P(p.b, N - 1));
            return S.pecahan('Sebuah kantong berisi ' + p.m + ' bola merah, ' + p.b + ' bola biru, dan ' + p.h + ' bola hijau. Dua bola diambil satu per satu tanpa pengembalian. Tentukan peluang terambil merah pertama dan biru kedua.', hasil, { jenis: 'tanpa', langkah: [
              st('Tanpa pengembalian: pengambilan kedua dari ' + (N - 1) + ' bola.'),
              st(p.m + '/' + N + ' × ' + p.b + '/' + (N - 1) + ' = ' + (p.m * p.b) + '/' + (N * (N - 1)) + ' = ' + pf(hasil) + '.', hasil)] });
          }
          let cnt = 0; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (x + y === p.j) cnt++;
          const pasang = []; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (x + y === p.j) pasang.push('(' + x + ',' + y + ')');
          return S.pecahan('Dua dadu dilempar bersamaan. Tentukan peluang jumlah kedua mata dadu sama dengan ' + p.j + '.', P(cnt, 36), { jenis: 'duaDadu', langkah: [
            st('Banyak semua pasangan = 36. Pasangan berjumlah ' + p.j + ': ' + pasang.join(', ') + ' (' + cnt + ' pasang).'),
            st('Peluang = ' + cnt + '/36 = ' + pf(P(cnt, 36)) + '.', P(cnt, 36))] });
        }),
      lv('Soal cerita peluang', 'Kontrol kualitas, undian, pengunjung', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['satu', 'dua', 'harapan']), N: r.bulat(10, 30), cc: r.bulat(2, 6), pr: r.pilih([10, 20, 25, 30, 40]), n: 20 * r.bulat(5, 30), k: r.bulat(0, 2) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'satu') {
            const baik = p.N - p.cc, hasil = P(baik, p.N);
            const teks = v === 'umum' ? 'Dalam sebuah undian terdapat ' + p.N + ' kupon, ' + p.cc + ' di antaranya berhadiah. Satu kupon diambil acak. Tentukan peluang kupon yang terambil tidak berhadiah.' : 'Dari ' + p.N + ' produk di gudang, ' + p.cc + ' produk cacat. Satu produk diambil acak. Tentukan peluang produk yang terambil tidak cacat.';
            return S.pecahan(teks, hasil, { jenis: 'satu', langkah: [st('Banyak yang diinginkan = ' + p.N + ' − ' + p.cc + ' = ' + baik + '.'), st('Peluang = ' + baik + '/' + p.N + ' = ' + pf(hasil) + '.', hasil)] });
          }
          if (p.jenis === 'dua') {
            const baik = p.N - p.cc, hasil = CP.pKali(P(baik, p.N), P(baik - 1, p.N - 1));
            const teks = v === 'umum' ? 'Dalam sebuah kotak terdapat ' + p.N + ' lampu, ' + p.cc + ' di antaranya rusak. Dua lampu diambil satu per satu tanpa pengembalian. Tentukan peluang keduanya tidak rusak.' : 'Dari ' + p.N + ' komponen mesin, ' + p.cc + ' komponen cacat. Dua komponen diambil berurutan tanpa pengembalian untuk diperiksa. Tentukan peluang keduanya baik.';
            return S.pecahan(teks, hasil, { jenis: 'dua', langkah: [
              st('Pengambilan pertama baik: ' + baik + '/' + p.N + '. Pengambilan kedua baik (sisa ' + (p.N - 1) + ' dengan ' + (baik - 1) + ' baik): ' + (baik - 1) + '/' + (p.N - 1) + '.'),
              st(baik + '/' + p.N + ' × ' + (baik - 1) + '/' + (p.N - 1) + ' = ' + pf(hasil) + '.', hasil)] });
          }
          const fh = (p.n * p.pr) / 100;
          const teks = v === 'umum' ? 'Peluang sebuah panah mengenai sasaran adalah ' + p.pr + '%. Jika dilepaskan ' + p.n + ' kali, berapa kali diharapkan mengenai sasaran?' : 'Peluang seorang pelanggan toko online memakai voucher adalah ' + p.pr + '%. Jika ada ' + p.n + ' pelanggan hari ini, berapa pelanggan yang diharapkan memakai voucher?';
          const s = S.pecahan(teks, fh, { jenis: 'harapan', sederhana: false, langkah: [st('Frekuensi harapan = ' + p.n + ' × ' + p.pr + '/100.'), st(p.n / 100 + ' × ' + p.pr + ' = ' + fh + '.', (p.n / 100) * p.pr)] });
          s.dibagi = [{ a: p.n * p.pr, b: 100 }]; return s;
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
