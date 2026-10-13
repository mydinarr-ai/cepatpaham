/* CepatPaham - Tahap 3, Kelas VIII: VIII-1 Aljabar, VIII-2 SPLDV, VIII-3 Fungsi Linear, VIII-4 Bangun Geometri, VIII-5 Peluang */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, kpk, H } = CP;
  const F = CP.angka, RP = CP.rp, MIN = CP.MIN, sup = CP.sup;
  const { rend, kunciAlj } = CP.alj;
  const { eq, acakSPL, langkahSPL } = CP.spl;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const dec = (p) => CP.desimalStr(p);
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const pf = (p) => (p.d === 1 ? mn(p.n) : mn(p.n) + '/' + p.d);
  const DER = '°';
  const rad = (d) => (d * Math.PI) / 180;
  const opsiAlj = (m) => ({ t: rend(m), k: kunciAlj(m), v: rend(m) });
  const opsiTeks = (t, k) => ({ t, k: k || t, v: t });
  const fitPts = (pts, W, Hm, ox, oy) => {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min(W / Math.max(1e-9, x1 - x0), Hm / Math.max(1e-9, y1 - y0));
    return pts.map((p) => [ox + (p[0] - x0) * s, oy + (p[1] - y0) * s]);
  };

  /* ---------- gambar fungsi linear ---------- */
  function gbrGaris(f, x1, x2, o) {
    o = o || {};
    const X0 = 30, X1 = 304, Y0 = 12, Y1 = 134, titik = o.titik || [];
    const ys = [f(x1), f(x2), 0, ...titik.map((p) => p.y)];
    let lo = Math.min(...ys), hi = Math.max(...ys); if (hi - lo < 2) { hi += 1; lo -= 1; }
    const pad = (hi - lo) * 0.1; lo -= pad; hi += pad;
    const mx = (x) => X0 + ((x - x1) / (x2 - x1)) * (X1 - X0), my = (y) => Y1 - ((y - lo) / (hi - lo)) * (Y1 - Y0);
    const el = [];
    if (x1 <= 0 && x2 >= 0) el.push(H.l(mx(0), Y0, mx(0), Y1, 'tipis'));
    el.push(H.l(X0, my(0), X1, my(0), 'tipis'));
    const lx = Math.max(1, Math.ceil((x2 - x1) / 8)); for (let x = Math.ceil(x1); x <= x2; x += lx) if (x !== 0) el.push(H.t(mx(x), my(0) + 12, x, 'middle', 'kecil'));
    const ly = Math.max(1, Math.ceil((hi - lo) / 6)); for (let y = Math.ceil(lo); y <= hi; y += ly) if (y !== 0 && Math.abs(my(y) - my(0)) > 10) el.push(H.t(mx(Math.max(x1, Math.min(0, x2))) - 4, my(y) + 4, y, 'end', 'kecil'));
    el.push(H.l(mx(x1), my(f(x1)), mx(x2), my(f(x2)), 'garis'));
    titik.forEach((p) => { el.push(H.o(mx(p.x), my(p.y), 4, 'titik')); if (p.t) el.push(H.t(mx(p.x) + (p.dx === undefined ? 8 : p.dx), my(p.y) + (p.dy === undefined ? -8 : p.dy), p.t, p.a || 'start', 'tebal')); });
    return { tipe: 'gambar', alt: o.alt || 'Grafik garis lurus', tinggi: 150, el };
  }

  /* ========================= VIII-1 MENYEDERHANAKAN BENTUK ALJABAR ========================= */
  const mono = (c, px, py) => {
    const v = (px ? 'x' + (px > 1 ? sup(px) : '') : '') + (py ? 'y' + (py > 1 ? sup(py) : '') : '');
    if (!v) return String(c);
    return (c === 1 ? '' : c === -1 ? MIN : String(c)) + v;
  };
  const opsiMono = (c, px, py) => ({ t: mono(c, px, py), k: c + ',' + px + ',' + py, v: mono(c, px, py) });

  CP.aktifkan('VIII-1', {
    level: [
      lv('Menjumlah dan mengurang bentuk aljabar', '(3x + 2y − 5) + (x − 4y + 7)', 'pilihan',
        (r, c) => ({ op: pilihJenis(r, c, ['+', '-']), a1: nz(r, -6, 9), b1: nz(r, -6, 9), c1: nz(r, -9, 9), a2: nz(r, -6, 9), b2: nz(r, -6, 9), c2: nz(r, -9, 9), s: r.bulat(1, 99999) }),
        ({ op, a1, b1, c1, a2, b2, c2, s }) => {
          const pl = op === '+';
          const R = { x: pl ? a1 + a2 : a1 - a2, y: pl ? b1 + b2 : b1 - b2, '': pl ? c1 + c2 : c1 - c2 };
          const benar = opsiAlj(R);
          const salah = (pl
            ? [{ x: a1 + a2, y: b1 + b2, '': c1 - c2 }, { x: a1 - a2, y: b1 + b2, '': c1 + c2 }, { xy: a1 + a2 + b1 + b2, '': c1 + c2 }, { x: R.x + 1, y: R.y, '': R[''] }, { x: R.x, y: R.y - 1, '': R[''] }, { x: R.y, y: R.x, '': R[''] }]
            : [{ x: a1 + a2, y: b1 + b2, '': c1 + c2 }, { x: a1 - a2, y: b1 - b2, '': c1 + c2 }, { x: a1 - a2, y: b1 + b2, '': c1 - c2 }, { x: R.x + 1, y: R.y, '': R[''] }, { x: R.x, y: R.y, '': R[''] - 1 }, { x: R.y, y: R.x, '': R[''] }]).map(opsiAlj);
          const h = CP.rakitPilihan(CP.buatRng(s), benar, salah);
          return S.pilihan('Hasil dari (' + rend({ x: a1, y: b1, '': c1 }) + ') ' + (pl ? '+' : MIN) + ' (' + rend({ x: a2, y: b2, '': c2 }) + ') adalah …', h, { jenis: pl ? 'tambah' : 'kurang', langkah: [
            st(pl ? 'Hapus kurung (tanda tetap), lalu kelompokkan suku sejenis.' : 'Hapus kurung: tanda setiap suku di kurung kedua dibalik, lalu kelompokkan suku sejenis.'),
            st('Suku x: ' + mn(a1) + (pl ? ' + ' : ' − ') + '(' + mn(a2) + ') = ' + mn(R.x) + '. Suku y: ' + mn(b1) + (pl ? ' + ' : ' − ') + '(' + mn(b2) + ') = ' + mn(R.y) + '. Konstanta: ' + mn(c1) + (pl ? ' + ' : ' − ') + '(' + mn(c2) + ') = ' + mn(R['']) + '.'),
            st('Hasilnya ' + rend(R) + '.', rend(R))] });
        }),
      lv('Perkalian dua bentuk aljabar', '(2x + 3)(x − 4) = 2x² − 5x − 12', 'pilihan',
        (r) => ({ a: r.bulat(1, 4), b: nz(r, -6, 6), c: r.bulat(1, 4), d: nz(r, -6, 6), s: r.bulat(1, 99999) }),
        ({ a, b, c, d, s }) => {
          const x2 = a * c, x1 = a * d + b * c, k = b * d;
          const benar = opsiAlj({ 'x²': x2, x: x1, '': k });
          const salah = [{ 'x²': x2, '': k }, { 'x²': x2, x: a * d - b * c, '': k }, { 'x²': x2, x: x1, '': -k }, { 'x²': x2, x: a + c + b + d, '': k }, { 'x²': a + c, x: x1, '': k }, { 'x²': x2, x: x1 + 1, '': k }].map(opsiAlj);
          const h = CP.rakitPilihan(CP.buatRng(s), benar, salah);
          return S.pilihan('Hasil dari (' + rend({ x: a, '': b }) + ')(' + rend({ x: c, '': d }) + ') adalah …', h, { jenis: 'kali', langkah: [
            st('Kalikan tiap suku kurung pertama dengan tiap suku kurung kedua: ' + mn(a * c) + 'x², ' + mn(a * d) + 'x, ' + mn(b * c) + 'x, ' + mn(b * d) + '.'),
            st('Jumlahkan suku x: ' + mn(a * d) + ' + (' + mn(b * c) + ') = ' + mn(x1) + '.'),
            st('Hasilnya ' + rend({ 'x²': x2, x: x1, '': k }) + '.', rend({ 'x²': x2, x: x1, '': k }))] });
        }),
      lv('Pembagian suku aljabar', '12x³y² ÷ 4xy = 3x²y', 'pilihan',
        (r) => { const n = r.bulat(0, 4), m = r.bulat(1, 5); return { c: r.bulat(2, 6), b: r.bulat(2, 4), m, p: r.bulat(0, m), n, q: r.bulat(0, n), s: r.bulat(1, 99999) }; },
        ({ c, b, m, p, n, q, s }) => {
          const a = c * b, px = m - p, py = n - q;
          const benar = opsiMono(c, px, py);
          const kand = [[c, px + 1, py], [c, px, py + 1], [c + 1, px, py], [c, m + p, n + q], [a - b, px, py], [c, Math.max(0, px - 1), py], [b, px, py], [c + 2, px, py], [c, px, py + 2]].filter((t) => t[0] !== 0 && t[1] >= 0 && t[2] >= 0).map((t) => opsiMono(t[0], t[1], t[2]));
          const h = CP.rakitPilihan(CP.buatRng(s), benar, kand);
          const sm = S.pilihan('Bentuk paling sederhana dari (' + mono(a, m, n) + ') ÷ (' + mono(b, p, q) + ') adalah …', h, { jenis: 'bagi', langkah: [
            st('Bagi koefisien: ' + a + ' ÷ ' + b + ' = ' + c + '. Untuk variabel yang sama, kurangkan pangkat.'),
            st((m ? 'x: ' + m + ' − ' + p + ' = ' + px + '. ' : '') + (n ? 'y: ' + n + ' − ' + q + ' = ' + py + '.' : '')),
            st('Hasilnya ' + mono(c, px, py) + '.', mono(c, px, py))] });
          sm.dibagi = [{ a, b }]; return sm;
        }),
      lv('Faktorisasi bentuk aljabar', '6x + 9 = 3(2x + 3); x² + 7x + 10 = (x + 2)(x + 5)', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['persekutuan', 'kuadrat', 'selisih']);
          if (jenis === 'persekutuan') { let p, q; do { p = r.bulat(1, 5); q = nz(r, -5, 5); } while (gcd(p, Math.abs(q)) !== 1); return { jenis, g: r.bulat(2, 6), p, q, s: r.bulat(1, 99999) }; }
          if (jenis === 'kuadrat') { let p, q; do { p = nz(r, -8, 8); q = nz(r, -8, 8); } while (p === q || p + q === 0); return { jenis, p, q, s: r.bulat(1, 99999) }; }
          return { jenis, k: r.bulat(2, 9), s: r.bulat(1, 99999) };
        },
        (pr) => {
          const rng = CP.buatRng(pr.s);
          const fk = (p) => '(x ' + (p < 0 ? MIN : '+') + ' ' + Math.abs(p) + ')';
          const ftk = (p, q) => { const [u, v] = p <= q ? [p, q] : [q, p]; return { t: fk(u) + fk(v), k: u + ',' + v, v: fk(u) + fk(v) }; };
          if (pr.jenis === 'persekutuan') {
            const { g, p, q } = pr, ekspr = rend({ x: g * p, '': g * q });
            const f = (gg, xp, kk) => gg + '(' + rend({ x: xp, '': kk }) + ')';
            const benar = opsiTeks(f(g, p, q));
            const salah = [opsiTeks(f(g, p, g * q)), opsiTeks(f(g, p, -q)), opsiTeks(f(p, g, q)), opsiTeks((g * p) + '(x ' + (q < 0 ? MIN : '+') + ' ' + Math.abs(q) + ')'), opsiTeks(f(g + 1, p, q)), opsiTeks(f(g, p + 1, q))];
            const h = CP.rakitPilihan(rng, benar, salah);
            return S.pilihan('Bentuk faktor dari ' + ekspr + ' adalah …', h, { jenis: 'persekutuan', langkah: [
              st('Cari FPB koefisien: FPB(' + (g * p) + ', ' + (g * Math.abs(q)) + ') = ' + g + '.'),
              st('Keluarkan ' + g + ': ' + ekspr + ' = ' + g + '(' + (g * p) + 'x ÷ ' + g + ' ' + (q < 0 ? MIN : '+') + ' ' + (g * Math.abs(q)) + ' ÷ ' + g + ') = ' + benar.t + '.', benar.t)] });
          }
          if (pr.jenis === 'kuadrat') {
            const { p, q } = pr, ekspr = rend({ 'x²': 1, x: p + q, '': p * q });
            const benar = ftk(p, q);
            const salah = [ftk(-p, -q), ftk(p, -q), ftk(-p, q), ftk(p + 1, q), ftk(p, q + 1), ftk(p - 1, q)].filter((o) => o.k.split(',').every((z) => z !== '0'));
            const h = CP.rakitPilihan(rng, benar, salah);
            return S.pilihan('Bentuk faktor dari ' + ekspr + ' adalah …', h, { jenis: 'kuadrat', langkah: [
              st('Cari dua bilangan yang berjumlah ' + mn(p + q) + ' dan berhasil kali ' + mn(p * q) + ': ' + mn(Math.min(p, q)) + ' dan ' + mn(Math.max(p, q)) + '.'),
              st(ekspr + ' = ' + benar.t + '.', benar.t)] });
          }
          const k = pr.k, ekspr = 'x² − ' + (k * k);
          const benar = opsiTeks('(x − ' + k + ')(x + ' + k + ')');
          const salah = [opsiTeks('(x − ' + k + ')²'), opsiTeks('(x + ' + k + ')²'), opsiTeks('x(x − ' + (k * k) + ')'), opsiTeks('(x − ' + (k * k) + ')(x + 1)')];
          const h = CP.rakitPilihan(rng, benar, salah);
          return S.pilihan('Bentuk faktor dari ' + ekspr + ' adalah …', h, { jenis: 'selisih', langkah: [
            st('Ini selisih kuadrat: a² − b² = (a − b)(a + b), dengan a = x dan b = ' + k + ' (karena ' + k + '² = ' + (k * k) + ').'),
            st(ekspr + ' = ' + benar.t + '.', benar.t)] });
        }),
      lv('Nilai bentuk aljabar setelah dikali', '(2x + 3)(x − 1) untuk x = 4', 'angka',
        (r) => ({ a: r.bulat(1, 4), b: nz(r, -5, 6), c: r.bulat(1, 4), d: nz(r, -5, 6), t: r.bulat(1, 6) }),
        ({ a, b, c, d, t }) => {
          const A = a * c, B = a * d + b * c, C = b * d, v = (a * t + b) * (c * t + d);
          return S.angka('Jika x = ' + t + ', berapakah nilai (' + rend({ x: a, '': b }) + ')(' + rend({ x: c, '': d }) + ')?', v, { jenis: 'nilai', izin: { minus: true }, langkah: [
            st('Jabarkan: (' + rend({ x: a, '': b }) + ')(' + rend({ x: c, '': d }) + ') = ' + rend({ 'x²': A, x: B, '': C }) + '.'),
            st('Substitusi x = ' + t + ': ' + mn(A) + ' × ' + (t * t) + ' + (' + mn(B) + ') × ' + t + ' + (' + mn(C) + ') = ' + mn(A * t * t + B * t + C) + '.', A * t * t + B * t + C)] });
        }),
      lv('Soal cerita aljabar: keliling dan luas', 'Sisi berbentuk (x + a)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['keliling', 'luas']), a: r.bulat(1, 8), b: r.bulat(1, 6), x: r.bulat(2, 12), k: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx);
          const [obj, sat] = v === 'umum' ? [['kebun', 'lapangan'][p.k], 'm'] : [['lembar plat logam', 'banner toko'][p.k], 'cm'];
          if (p.jenis === 'keliling') {
            const K = 4 * p.x + 2 * p.a;
            const s = S.angka('Sebuah ' + obj + ' berbentuk persegi panjang dengan panjang (x + ' + p.a + ') ' + sat + ' dan lebar x ' + sat + '. Jika kelilingnya ' + K + ' ' + sat + ', berapa nilai x?', p.x, { jenis: 'keliling', satuan: sat, langkah: [
              st('Keliling = 2 × (panjang + lebar) = 2 × ((x + ' + p.a + ') + x) = 4x + ' + (2 * p.a) + '.'),
              st('4x + ' + (2 * p.a) + ' = ' + K + ' → 4x = ' + (K - 2 * p.a) + ' → x = ' + (K - 2 * p.a) + ' ÷ 4 = ' + p.x + '.', (K - 2 * p.a) / 4)] });
            s.dibagi = [{ a: K - 2 * p.a, b: 4 }]; return s;
          }
          const pj = 2 * p.x + p.a, lb = p.x + p.b, L = pj * lb;
          return S.angka('Sebuah ' + obj + ' berbentuk persegi panjang dengan panjang (2x + ' + p.a + ') ' + sat + ' dan lebar (x + ' + p.b + ') ' + sat + '. Jika x = ' + p.x + ', berapa luasnya?', L, { jenis: 'luas', satuan: sat + '²', langkah: [
            st('Panjang = 2 × ' + p.x + ' + ' + p.a + ' = ' + pj + ' ' + sat + ' dan lebar = ' + p.x + ' + ' + p.b + ' = ' + lb + ' ' + sat + '.'),
            st('Luas = ' + pj + ' × ' + lb + ' = ' + L + ' ' + sat + '².', (2 * p.x + p.a) * (p.x + p.b))] });
        })
    ]
  });

  /* ========================= VIII-2 SPLDV ========================= */
  CP.aktifkan('VIII-2', {
    level: [
      lv('Metode substitusi', 'y = 2x + 1 dan 3x + 2y = 16', 'angka',
        (r, c) => {
          for (;;) {
            const x = r.bulat(1, 7), a = r.bulat(1, 4), b = nz(r, -6, 6), y = a * x + b; if (y < 1) continue;
            const cc = r.bulat(1, 4), d = r.bulat(1, 3);
            return { x, a, b, y, cc, d, e: cc * x + d * y, tanya: pilihJenis(r, c, ['x', 'y']) };
          }
        },
        (p) => {
          const den = p.cc + p.d * p.a, num = p.e - p.d * p.b;
          const eq1 = 'y = ' + rend({ x: p.a, '': p.b });
          const langkah = [
            st('Substitusikan y = ' + rend({ x: p.a, '': p.b }) + ' ke ' + p.cc + 'x + ' + (p.d === 1 ? '' : p.d) + 'y = ' + p.e + ': ' + p.cc + 'x + ' + p.d + '(' + rend({ x: p.a, '': p.b }) + ') = ' + p.e + '.'),
            st('Sederhanakan: ' + den + 'x ' + (p.d * p.b < 0 ? MIN : '+') + ' ' + Math.abs(p.d * p.b) + ' = ' + p.e + ', sehingga ' + den + 'x = ' + num + '.'),
            st('x = ' + num + ' ÷ ' + den + ' = ' + p.x + '.', num / den)];
          if (p.tanya === 'y') langkah.push(st('y = ' + p.a + ' × ' + p.x + ' ' + (p.b < 0 ? MIN : '+') + ' ' + Math.abs(p.b) + ' = ' + p.y + '.', p.a * (num / den) + p.b));
          const s = S.angka('Diketahui ' + eq1 + ' dan ' + p.cc + 'x + ' + (p.d === 1 ? '' : p.d) + 'y = ' + p.e + '. Berapakah nilai ' + p.tanya + '?', p.tanya === 'x' ? p.x : p.y, { jenis: p.tanya, langkah });
          s.dibagi = [{ a: num, b: den }]; return s;
        }),
      lv('Eliminasi, lalu hitung kombinasi', 'x + y, x − y, atau x × y', 'angka',
        (r, c) => Object.assign(acakSPL(r, 1, 9), { tanya: pilihJenis(r, c, ['jumlah', 'selisih', 'kali']) }),
        (p) => {
          const { langkah, dibagi, c1, c2 } = langkahSPL(p, 'y');
          const yv = langkah[langkah.length - 1].v;
          const hi = Math.max(p.x, p.y), lo = Math.min(p.x, p.y);
          let ans, kata, v2;
          if (p.tanya === 'jumlah') { ans = p.x + p.y; kata = 'x + y'; v2 = p.x + yv; langkah.push(st('x + y = ' + p.x + ' + ' + p.y + ' = ' + ans + '.', v2)); }
          else if (p.tanya === 'selisih') { ans = hi - lo; kata = 'selisih x dan y (yang besar dikurangi yang kecil)'; v2 = Math.abs(p.x - yv); langkah.push(st('Selisih = ' + hi + ' − ' + lo + ' = ' + ans + '.', v2)); }
          else { ans = p.x * p.y; kata = 'x × y'; v2 = p.x * yv; langkah.push(st('x × y = ' + p.x + ' × ' + p.y + ' = ' + ans + '.', v2)); }
          const s = S.angka('Diketahui ' + eq(p.a1, p.b1, c1) + ' dan ' + eq(p.a2, p.b2, c2) + '. Berapakah nilai ' + kata + '?', ans, { jenis: p.tanya, langkah });
          s.dibagi = dibagi; return s;
        }),
      lv('Soal cerita SPLDV', 'Tarif parkir, umur, biaya bengkel', 'angka',
        (r) => { const p = acakSPL(r, 1, 9); return Object.assign(p, { k: r.bulat(0, 2), tanya: r.pilih(['x', 'y']), nama: r.pilih(CP.NAMA), um: [r.bulat(30, 45), r.bulat(8, 15)] }); },
        (p, ctx) => {
          const v = kons(ctx);
          if (v === 'umum' && p.k === 2) {
            const [a, b] = p.um, s1 = a + b, d1 = a - b, ans = p.tanya === 'x' ? a : b;
            const kata = p.tanya === 'x' ? 'Ayah' : p.nama;
            const s = S.angka('Jumlah umur Ayah dan ' + p.nama + ' adalah ' + s1 + ' tahun, sedangkan selisih umur mereka ' + d1 + ' tahun. Berapa umur ' + kata + '?', ans, { jenis: 'umur' + p.tanya, satuan: 'tahun', langkah: [
              st('Misalkan Ayah = x dan ' + p.nama + ' = y. x + y = ' + s1 + ' dan x − y = ' + d1 + '.'),
              st('Jumlahkan: 2x = ' + (s1 + d1) + ' → x = ' + (s1 + d1) / 2 + '. Kurangkan: 2y = ' + (s1 - d1) + ' → y = ' + (s1 - d1) / 2 + '.'),
              st('Umur ' + kata + ' = ' + ans + ' tahun.', p.tanya === 'x' ? (s1 + d1) / 2 : (s1 - d1) / 2)] });
            s.dibagi = [{ a: s1 + d1, b: 2 }, { a: s1 - d1, b: 2 }]; return s;
          }
          const { langkah, dibagi, c1, c2 } = langkahSPL(p, p.tanya);
          const sets = v === 'umum' ? [['mobil', 'motor'], ['tahu isi', 'tempe goreng'], ['mobil', 'motor']][p.k] : [['unit servis ringan', 'unit servis berat'], ['kemeja', 'celana'], ['paket A', 'paket B']][p.k];
          const [A, B] = sets; const it = (n, nm) => n + ' ' + nm;
          const teks = v === 'umum'
            ? (p.k === 0 || p.k === 2 ? 'Tarif parkir: ' + it(p.a1, A) + ' dan ' + it(p.b1, B) + ' membayar Rp' + c1 + '.000, sedangkan ' + it(p.a2, A) + ' dan ' + it(p.b2, B) + ' membayar Rp' + c2 + '.000. Berapa rupiah tarif parkir 1 ' + (p.tanya === 'x' ? A : B) + '?' : p.nama + ' membeli ' + it(p.a1, A) + ' dan ' + it(p.b1, B) + ' seharga Rp' + c1 + '.000. Ibunya membeli ' + it(p.a2, A) + ' dan ' + it(p.b2, B) + ' seharga Rp' + c2 + '.000. Berapa rupiah harga 1 ' + (p.tanya === 'x' ? A : B) + '?')
            : 'Sebuah bisnis kecil mencatat pendapatan: ' + it(p.a1, A) + ' dan ' + it(p.b1, B) + ' menghasilkan Rp' + c1 + '.000, sedangkan ' + it(p.a2, A) + ' dan ' + it(p.b2, B) + ' menghasilkan Rp' + c2 + '.000. Berapa rupiah pendapatan dari 1 ' + (p.tanya === 'x' ? A : B) + '?';
          const kal = langkah.slice(), last = kal[kal.length - 1];
          kal.push(st('Nilai 1 ' + (p.tanya === 'x' ? A : B) + ' = ' + (p.tanya === 'x' ? p.x : p.y) + ' ribu = ' + RP((p.tanya === 'x' ? p.x : p.y) * 1000) + '.', last.v * 1000));
          const s = S.angka(teks, (p.tanya === 'x' ? p.x : p.y) * 1000, { jenis: 'cerita' + p.k + p.tanya, awalan: 'Rp', langkah: p.tanya === 'x' ? kal.filter((l, i) => i < 3 || i === kal.length - 1) : kal });
          s.dibagi = dibagi; return s;
        }),
      lv('Memeriksa penyelesaian', 'Titik mana yang memenuhi kedua persamaan?', 'pilihan',
        (r) => Object.assign(acakSPL(r, 1, 8), { s: r.bulat(1, 99999) }),
        (p) => {
          const { x, y, a1, b1, a2, b2 } = p, c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, rng = CP.buatRng(p.s);
          const ok1 = (u, w) => a1 * u + b1 * w === c1, ok2 = (u, w) => a2 * u + b2 * w === c2;
          const cand = [];
          for (let u = 0; u <= 9; u++) for (let w = 0; w <= 9; w++) if (!(u === x && w === y)) cand.push([u, w]);
          const sebagian = rng.kocok(cand.filter((q) => ok1(q[0], q[1]) !== ok2(q[0], q[1]) && (ok1(q[0], q[1]) || ok2(q[0], q[1]))));
          const lain = rng.kocok(cand.filter((q) => !ok1(q[0], q[1]) && !ok2(q[0], q[1])));
          const it = (q) => ({ t: '(' + q[0] + ', ' + q[1] + ')', k: q[0] + ',' + q[1], v: '(' + q[0] + ', ' + q[1] + ')' });
          const salah = [...sebagian.slice(0, 2), ...(x !== y ? [[y, x]] : []), ...lain.slice(0, 4), ...sebagian.slice(2, 6)].map(it);
          const h = CP.rakitPilihan(rng, it([x, y]), salah);
          return S.pilihan('Pasangan (x, y) manakah yang merupakan penyelesaian dari ' + eq(a1, b1, c1) + ' dan ' + eq(a2, b2, c2) + '?', h, { jenis: 'periksa', langkah: [
            st('Substitusikan titik ke kedua persamaan. Penyelesaian harus memenuhi keduanya.'),
            st('(' + x + ', ' + y + '): ' + a1 + '×' + x + ' + ' + b1 + '×' + y + ' = ' + c1 + ' dan ' + a2 + '×' + x + ' + ' + b2 + '×' + y + ' = ' + c2 + ' (keduanya benar).', it([x, y]).t)] });
        }),
      lv('Banyak penyelesaian', 'Tunggal, tak ada, atau tak hingga', 'pilihan',
        (r, c) => { let a, b; do { a = r.bulat(1, 6); b = r.bulat(1, 6); } while (gcd(a, b) !== 1); return { jenis: pilihJenis(r, c, ['tunggal', 'tidak', 'tak hingga']), a, b, cc: r.bulat(3, 20), k: r.bulat(2, 3), s: r.bulat(1, 99999) }; },
        ({ jenis, a, b, cc, k, s }) => {
          let a2, b2, c2, e2;
          if (jenis === 'tunggal') { const rr = CP.buatRng(s + 3); do { a2 = rr.bulat(1, 6); b2 = rr.bulat(1, 6); } while (a2 * b === a * b2); c2 = rr.bulat(3, 20); e2 = [a2, b2, c2]; }
          else if (jenis === 'tidak') e2 = [k * a, k * b, k * cc + 1];
          else e2 = [k * a, k * b, k * cc];
          const [A2, B2, C2] = e2;
          const T = { tunggal: 'Tepat satu penyelesaian', tidak: 'Tidak ada penyelesaian', 'tak hingga': 'Tak hingga banyak penyelesaian' };
          const benar = opsiTeks(T[jenis]);
          const h = CP.rakitPilihan(CP.buatRng(s), benar, [...Object.keys(T).filter((x) => x !== jenis).map((x) => opsiTeks(T[x])), opsiTeks('Tepat dua penyelesaian')]);
          const rasio = (u, w) => u + '/' + w;
          return S.pilihan('Sistem ' + eq(a, b, cc) + ' dan ' + eq(A2, B2, C2) + ' memiliki …', h, { jenis, langkah: [
            st('Bandingkan koefisien: x: ' + a + ' dan ' + A2 + ', y: ' + b + ' dan ' + B2 + ', konstanta: ' + cc + ' dan ' + C2 + '.'),
            st(jenis === 'tunggal' ? 'Perbandingan koefisien x dan y berbeda (' + a + '×' + B2 + ' = ' + (a * B2) + ' ≠ ' + (A2 * b) + ' = ' + A2 + '×' + b + '), garis berpotongan di satu titik.' : jenis === 'tidak' ? 'Koefisien sebanding (dikali ' + k + ') tetapi konstanta tidak (' + (k * cc) + ' ≠ ' + C2 + '), garis sejajar.' : 'Semua sebanding (dikali ' + k + '), kedua persamaan sama, garis berimpit.'),
            st('Jadi sistem memiliki: ' + benar.t + '.', benar.t)] });
        }),
      lv('Titik impas dan perbandingan paket', 'Dua rumus biaya bertemu', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['impas', 'paket']), t: r.bulat(2, 12), v: r.bulat(2, 9), sel: r.bulat(2, 8), a: r.bulat(1, 6), k: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'impas') {
            const harga = p.v + p.sel, tetap = p.sel * p.t;
            const teks = v === 'vokasi' ? 'Sebuah usaha kue memiliki biaya tetap Rp' + tetap + '.000 dan biaya Rp' + p.v + '.000 per kotak. Setiap kotak dijual Rp' + harga + '.000. Berapa kotak yang harus terjual agar impas (pendapatan = biaya)?' : 'Sebuah toko memiliki biaya sewa tetap Rp' + tetap + '.000 dan biaya bahan Rp' + p.v + '.000 per barang. Barang dijual Rp' + harga + '.000 per buah. Berapa barang yang harus terjual agar untung dan rugi sama (impas)?';
            const s = S.angka(teks, p.t, { jenis: 'impas', satuan: v === 'vokasi' ? 'kotak' : 'barang', langkah: [
              st('Pendapatan = ' + harga + 'q dan biaya = ' + tetap + ' + ' + p.v + 'q. Impas jika keduanya sama.'),
              st(harga + 'q = ' + tetap + ' + ' + p.v + 'q → ' + (harga - p.v) + 'q = ' + tetap + ' → q = ' + tetap + ' ÷ ' + (harga - p.v) + ' = ' + p.t + '.', tetap / (harga - p.v))] });
            s.dibagi = [{ a: tetap, b: harga - p.v }]; return s;
          }
          const b = p.v + p.sel, d = p.v, a = p.a, cc = a + p.sel * p.t;
          const teks = v === 'umum' ? 'Rental sepeda A memungut Rp' + a + '.000 ditambah Rp' + b + '.000 per jam. Rental B memungut Rp' + cc + '.000 ditambah Rp' + d + '.000 per jam. Setelah berapa jam biaya kedua rental sama?' : 'Penyedia jasa pengiriman A menarik biaya tetap Rp' + a + '.000 ditambah Rp' + b + '.000 per kg. Penyedia B biaya tetap Rp' + cc + '.000 ditambah Rp' + d + '.000 per kg. Pada berat berapa kg biaya keduanya sama?';
          const s = S.angka(teks, p.t, { jenis: 'paket', satuan: v === 'umum' ? 'jam' : 'kg', langkah: [
            st('Samakan biaya: ' + a + ' + ' + b + 't = ' + cc + ' + ' + d + 't.'),
            st((b - d) + 't = ' + (cc - a) + ' → t = ' + (cc - a) + ' ÷ ' + (b - d) + ' = ' + p.t + '.', (cc - a) / (b - d))] });
          s.dibagi = [{ a: cc - a, b: b - d }]; return s;
        })
    ]
  });

  /* ========================= VIII-3 FUNGSI LINEAR ========================= */
  const fx = (m, n) => 'f(x) = ' + rend({ x: m, '': n });

  CP.aktifkan('VIII-3', {
    level: [
      lv('Nilai fungsi linear', 'f(x) = 2x + 3 → f(4) = 11', 'angka',
        (r) => ({ m: nz(r, -6, 6), n: nz(r, -9, 9), a: r.bulat(-5, 8) }),
        ({ m, n, a }) => S.angka('Jika ' + fx(m, n) + ', berapakah nilai f(' + mn(a) + ')?', m * a + n, { jenis: 'nilai', izin: { minus: true }, langkah: [
          st('Ganti x dengan ' + mn(a) + ': f(' + mn(a) + ') = ' + mn(m) + ' × (' + mn(a) + ') + (' + mn(n) + ').'),
          st(mn(m * a) + ' + (' + mn(n) + ') = ' + mn(m * a + n) + '.', m * a + n)] })),
      lv('Gradien dari dua titik', 'm = (y₂ − y₁)/(x₂ − x₁)', 'angka',
        (r) => { const m = nz(r, -4, 4), x1 = r.bulat(-4, 3), dx = r.bulat(1, 4), y1 = r.bulat(-5, 6); return { m, x1, y1, x2: x1 + dx, y2: y1 + m * dx }; },
        ({ m, x1, y1, x2, y2 }) => {
          const s = S.angka('Garis melalui titik A(' + mn(x1) + ', ' + mn(y1) + ') dan B(' + mn(x2) + ', ' + mn(y2) + '). Berapa gradien garis AB?', m, { jenis: 'gradien', izin: { minus: true }, gambar: gbrGaris((x) => y1 + m * (x - x1), Math.min(x1, x2) - 2, Math.max(x1, x2) + 2, { titik: [{ x: x1, y: y1, t: 'A', dx: -10, a: 'end' }, { x: x2, y: y2, t: 'B' }], alt: 'Garis melalui A dan B' }), langkah: [
            st('Gradien m = (y₂ − y₁) ÷ (x₂ − x₁) = (' + mn(y2) + ' − (' + mn(y1) + ')) ÷ (' + mn(x2) + ' − (' + mn(x1) + ')).'),
            st(mn(y2 - y1) + ' ÷ ' + mn(x2 - x1) + ' = ' + mn(m) + '.', (y2 - y1) / (x2 - x1))] });
          s.dibagi = [{ a: y2 - y1, b: x2 - x1 }]; return s;
        }),
      lv('Persamaan garis', 'Melalui dua titik atau satu titik dan gradien', 'pilihan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['dua titik', 'titik gradien']), m: nz(r, -4, 4), n: nz(r, -6, 6), x1: r.bulat(-3, 3), dx: r.bulat(1, 3), s: r.bulat(1, 99999) }),
        ({ jenis, m, n, x1, dx, s }) => {
          const y1 = m * x1 + n, x2 = x1 + dx, y2 = m * x2 + n;
          const op = (mm, nn) => ({ t: 'y = ' + rend({ x: mm, '': nn }), k: mm + ',' + nn, v: 'y = ' + rend({ x: mm, '': nn }) });
          const benar = op(m, n);
          const salah = [op(m, -n), op(-m, n), op(n, m), op(m + 1, n), op(m, n + 1), op(-m, -n), op(m, y1)].filter((o) => o.k !== benar.k);
          const h = CP.rakitPilihan(CP.buatRng(s), benar, salah);
          const g = gbrGaris((x) => m * x + n, Math.min(x1, x2) - 2, Math.max(x1, x2) + 2, { titik: [{ x: x1, y: y1, t: '(' + mn(x1) + ', ' + mn(y1) + ')', dx: -8, a: 'end' }, ...(jenis === 'dua titik' ? [{ x: x2, y: y2, t: '(' + mn(x2) + ', ' + mn(y2) + ')' }] : [])], alt: 'Garis lurus melalui titik yang diketahui' });
          const teks = jenis === 'dua titik' ? 'Garis melalui titik (' + mn(x1) + ', ' + mn(y1) + ') dan (' + mn(x2) + ', ' + mn(y2) + '). Persamaan garis tersebut adalah …' : 'Garis memiliki gradien ' + mn(m) + ' dan melalui titik (' + mn(x1) + ', ' + mn(y1) + '). Persamaan garis tersebut adalah …';
          return S.pilihan(teks, h, { jenis, gambar: g, langkah: [
            st(jenis === 'dua titik' ? 'Gradien m = (' + mn(y2) + ' − (' + mn(y1) + ')) ÷ (' + mn(x2) + ' − (' + mn(x1) + ')) = ' + mn(m) + '.' : 'Gradien m = ' + mn(m) + '.'),
            st('Rumus y − y₁ = m(x − x₁): y = ' + mn(m) + 'x + n, dengan n = ' + mn(y1) + ' − (' + mn(m) + ') × (' + mn(x1) + ') = ' + mn(n) + '.'),
            st('Persamaan garis: ' + benar.t + '.', benar.t)] });
        }),
      lv('Titik potong dengan sumbu', 'Sumbu x: y = 0; sumbu y: x = 0', 'angka',
        (r, c) => { const m = nz(r, -4, 4), x0 = nz(r, -6, 6); return { m, x0, n: -m * x0, jenis: pilihJenis(r, c, ['sumbu x', 'sumbu y']) }; },
        ({ m, x0, n, jenis }) => {
          const g = gbrGaris((x) => m * x + n, Math.min(x0, 0) - 2, Math.max(x0, 0) + 2, { titik: [{ x: x0, y: 0, t: '', dy: 0 }, { x: 0, y: n, t: '', dy: 0 }], alt: 'Grafik y = ' + rend({ x: m, '': n }) + ' dengan titik potong sumbu' });
          if (jenis === 'sumbu x') {
            const s = S.angka('Garis y = ' + rend({ x: m, '': n }) + ' memotong sumbu x di titik (a, 0). Berapa nilai a?', x0, { jenis, izin: { minus: true }, gambar: g, langkah: [
              st('Pada sumbu x, y = 0: 0 = ' + rend({ x: m, '': n }) + '.'),
              st(mn(m) + 'x = ' + mn(-n) + ' → x = ' + mn(-n) + ' ÷ ' + mn(m) + ' = ' + mn(x0) + '.', -n / m)] });
            s.dibagi = [{ a: -n, b: m }]; return s;
          }
          return S.angka('Garis y = ' + rend({ x: m, '': n }) + ' memotong sumbu y di titik (0, b). Berapa nilai b?', n, { jenis, izin: { minus: true }, gambar: g, langkah: [
            st('Pada sumbu y, x = 0: y = ' + mn(m) + ' × 0 + (' + mn(n) + ').'),
            st('y = ' + mn(n) + '.', m * 0 + n)] });
        }),
      lv('Garis sejajar dan tegak lurus', 'Sejajar: gradien sama; tegak lurus: m₁ × m₂ = −1', 'pecahan',
        (r, c) => { let a, b; do { a = nz(r, -7, 7); b = r.bulat(1, 7); } while (gcd(Math.abs(a), b) !== 1 || a === 1 && b === 1); return { jenis: pilihJenis(r, c, ['sejajar', 'tegak']), m: nz(r, -4, 4), n: nz(r, -6, 6), px: r.bulat(-3, 4), py: r.bulat(-5, 6), a, b }; },
        (p) => {
          if (p.jenis === 'sejajar') {
            const n2 = p.py - p.m * p.px;
            return S.angka('Garis g: y = ' + rend({ x: p.m, '': p.n }) + '. Garis h sejajar g dan melalui titik (' + mn(p.px) + ', ' + mn(p.py) + '), dengan persamaan y = ' + mn(p.m) + 'x + n. Berapa nilai n?', n2, { jenis: 'sejajar', izin: { minus: true }, langkah: [
              st('Sejajar berarti gradien sama, yaitu ' + mn(p.m) + '.'),
              st('Substitusi titik: ' + mn(p.py) + ' = ' + mn(p.m) + ' × (' + mn(p.px) + ') + n → n = ' + mn(p.py) + ' − (' + mn(p.m * p.px) + ') = ' + mn(n2) + '.', p.py - p.m * p.px)] });
          }
          const ans = P(-p.b, p.a);
          return S.pecahan('Gradien garis g adalah ' + pf(P(p.a, p.b)) + '. Berapa gradien garis yang tegak lurus g?', ans, { jenis: 'tegak', izin: { minus: true, garis: true, koma: false }, langkah: [
            st('Dua garis tegak lurus memenuhi m₁ × m₂ = −1, jadi m₂ = −1 ÷ m₁.'),
            st('m₂ = −1 ÷ (' + pf(P(p.a, p.b)) + ') = ' + pf(ans) + '.', ans)] });
        }),
      lv('Soal cerita fungsi linear', 'Tarif tetap + tarif per satuan', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['biaya', 'satuan']), tetap: r.bulat(2, 15), per: r.bulat(2, 9), k: r.bulat(2, 14), z: r.bulat(0, 2) }),
        (p, ctx) => {
          const v = kons(ctx), C = p.tetap + p.per * p.k;
          const sets = v === 'umum' ? [['taksi', 'km', 'Tarif taksi'], ['sewa sepeda', 'jam', 'Sewa sepeda'], ['paket internet', 'GB', 'Paket internet']][p.z] : [['jasa servis', 'jam', 'Biaya jasa servis'], ['jasa cetak', 'lembar', 'Biaya jasa cetak'], ['gaji sales', 'unit terjual', 'Gaji sales']][p.z];
          const [objek, sat, judul] = sets;
          if (p.jenis === 'biaya') {
            return S.angka(judul + ' dirumuskan B = ' + p.tetap + ' + ' + p.per + 'x (dalam ribu rupiah), dengan x banyaknya ' + sat + '. Berapa biaya untuk ' + p.k + ' ' + sat + '?', C, { jenis: 'biaya', satuan: 'ribu rupiah', gambar: gbrGaris((x) => p.tetap + p.per * x, 0, p.k + 2, { titik: [{ x: p.k, y: C, t: '?', dx: 6, dy: -8 }], alt: 'Grafik biaya terhadap banyaknya ' + sat }), langkah: [
              st('Substitusi x = ' + p.k + ': B = ' + p.tetap + ' + ' + p.per + ' × ' + p.k + '.'),
              st(p.tetap + ' + ' + (p.per * p.k) + ' = ' + C + ' ribu rupiah.', p.tetap + p.per * p.k)] });
          }
          const s = S.angka(judul + ' dirumuskan B = ' + p.tetap + ' + ' + p.per + 'x (dalam ribu rupiah), dengan x banyaknya ' + sat + '. Jika biayanya ' + C + ' ribu rupiah, berapa ' + sat + '?', p.k, { jenis: 'satuan', satuan: sat, langkah: [
            st(p.tetap + ' + ' + p.per + 'x = ' + C + ' → ' + p.per + 'x = ' + C + ' − ' + p.tetap + ' = ' + (C - p.tetap) + '.'),
            st('x = ' + (C - p.tetap) + ' ÷ ' + p.per + ' = ' + p.k + '.', (C - p.tetap) / p.per)] });
          s.dibagi = [{ a: C - p.tetap, b: p.per }]; return s;
        })
    ]
  });

  /* ========================= VIII-4 SIFAT BANGUN GEOMETRI ========================= */
  const kecilSud = (x, y, t) => H.t(x, y, t, 'middle', 'tebal');
  function gbrSudutGaris(jenis, th) {
    const O = [160, 100], L = 80, d = (a, rr) => [O[0] + rr * Math.cos(rad(a)), O[1] - rr * Math.sin(rad(a))];
    const el = [H.o(O[0], O[1], 3, 'titik')];
    if (jenis === 'pelurus') {
      el.push(H.l(20, O[1], 300, O[1], 'garis'), H.l(O[0], O[1], d(th, L)[0], d(th, L)[1], 'garis'), kecilSud(d(th / 2, 42)[0], d(th / 2, 42)[1] + 4, th + DER), kecilSud(d((th + 180) / 2, 42)[0], d((th + 180) / 2, 42)[1] + 4, '?'));
    } else if (jenis === 'penyiku') {
      el.push(H.l(O[0], O[1], O[0] + 110, O[1], 'garis'), H.l(O[0], O[1], O[0], O[1] - 90, 'garis'), H.l(O[0], O[1], d(th, L)[0], d(th, L)[1], 'garis'), H.r(O[0] + 2, O[1] - 14, 12, 12, 'kosong'), kecilSud(d(th / 2, 48)[0], d(th / 2, 48)[1] + 4, th + DER), kecilSud(d((th + 90) / 2, 50)[0], d((th + 90) / 2, 50)[1] + 4, '?'));
    } else {
      const e = d(th, 110), f = d(th + 180, 110);
      el.push(H.l(20, O[1], 300, O[1], 'garis'), H.l(f[0], f[1], e[0], e[1], 'garis'), kecilSud(d(th / 2, 40)[0], d(th / 2, 40)[1] + 4, th + DER),
        jenis === 'tolak' ? kecilSud(d(th / 2 + 180, 40)[0], d(th / 2 + 180, 40)[1] + 4, '?') : kecilSud(d((th + 180) / 2, 40)[0], d((th + 180) / 2, 40)[1] + 4, '?'));
    }
    return { tipe: 'gambar', alt: 'Dua garis dan sudut ' + th + DER, tinggi: 142, el };
  }
  function gbrSegitigaSudut(A, B, lab, luar) {
    const C = 180 - A - B, AC = Math.sin(rad(B)) / Math.sin(rad(C)); // AB = sin C / sin C... skala: AB = 1
    const pa = [0, 0], pb = [Math.sin(rad(C)) / Math.sin(rad(C)), 0], pc = [AC * Math.cos(rad(A)), -AC * Math.sin(rad(A))];
    const [a, b, c] = fitPts([pa, pb, pc], 210, 96, 30, 28);
    const el = [H.p([a, b, c], 'isi'), H.t(a[0] + 20, a[1] - 4, lab[0], 'start', 'tebal'), H.t(b[0] - 20, b[1] - 4, lab[1], 'end', 'tebal'), H.t(c[0], c[1] + 20, lab[2], 'middle', 'tebal'), H.t(a[0] - 6, a[1] + 14, 'A', 'end', 'kecil'), H.t(b[0] + 6, b[1] + 14, 'B', 'start', 'kecil'), H.t(c[0], c[1] - 6, 'C', 'middle', 'kecil')];
    if (luar) { el.push(H.l(b[0], b[1], b[0] + 44, b[1], 'garis'), H.t(b[0] + 30, b[1] - 10, lab[3], 'middle', 'tebal')); }
    return { tipe: 'gambar', alt: 'Segitiga ABC dengan sudut-sudutnya', tinggi: 152, el };
  }
  function gbrPoligon(n, label) {
    const cx = 160, cy = 74, R = 56, pts = []; for (let i = 0; i < n; i++) pts.push([cx + R * Math.cos(rad(-90 + (360 * i) / n)), cy + R * Math.sin(rad(-90 + (360 * i) / n))]);
    return { tipe: 'gambar', alt: 'Segi-' + n + ' beraturan', tinggi: 150, el: [H.p(pts, 'isi'), H.t(cx, cy + 5, label, 'middle', 'tebal')] };
  }
  function gbrJajar(a, t, la, lt) {
    const s = Math.min(190 / (a + t * 0.55), 96 / t), x0 = 40, y0 = 124, off = t * s * 0.55, w = a * s, h = t * s;
    return { tipe: 'gambar', alt: 'Jajargenjang alas ' + la + ' tinggi ' + lt, tinggi: 148, el: [H.p([[x0, y0], [x0 + w, y0], [x0 + w + off, y0 - h], [x0 + off, y0 - h]], 'isi'), H.l(x0 + off, y0 - h, x0 + off, y0, 'putus'), H.t(x0 + w / 2, y0 + 16, la, 'middle', 'tebal'), H.t(x0 + off + 6, y0 - h / 2 + 4, lt, 'start', 'tebal')] };
  }
  function gbrBelah(d1, d2, l1, l2) {
    const s = Math.min(230 / d1, 118 / d2), cx = 160, cy = 74, w = (d1 * s) / 2, h = (d2 * s) / 2;
    return { tipe: 'gambar', alt: 'Belah ketupat dengan diagonal ' + l1 + ' dan ' + l2, tinggi: 150, el: [H.p([[cx - w, cy], [cx, cy - h], [cx + w, cy], [cx, cy + h]], 'isi'), H.l(cx - w, cy, cx + w, cy, 'putus'), H.l(cx, cy - h, cx, cy + h, 'putus'), H.t(cx - w / 2, cy - 5, l1, 'middle', 'tebal'), H.t(cx + 6, cy - h / 2 + 4, l2, 'start', 'tebal')] };
  }
  function gbrLayang(d1, d2, l1, l2) {
    const s = Math.min(230 / d1, 118 / d2), cx = 160, y0 = 12, W = d1 * s, Hh = d2 * s, xt = 160 - W / 2 + W * 0.42, yc = y0 + Hh * 0.36;
    return { tipe: 'gambar', alt: 'Layang-layang dengan diagonal ' + l1 + ' dan ' + l2, tinggi: 150, el: [H.p([[cx - W / 2, yc], [xt, y0], [cx + W / 2, yc], [xt, y0 + Hh]], 'isi'), H.l(cx - W / 2, yc, cx + W / 2, yc, 'putus'), H.l(xt, y0, xt, y0 + Hh, 'putus'), H.t(cx - W / 2 + W * 0.2, yc - 5, l1, 'middle', 'tebal'), H.t(xt + 6, y0 + Hh * 0.78, l2, 'start', 'tebal')] };
  }
  function gbrTrapesium(a, b, t, la, lb, lt) {
    const s = Math.min(230 / Math.max(a, b), 98 / t), y0 = 124, cx = 160, wa = a * s, wb = b * s, h = t * s;
    return { tipe: 'gambar', alt: 'Trapesium sisi sejajar ' + la + ' dan ' + lb + ', tinggi ' + lt, tinggi: 148, el: [H.p([[cx - wa / 2, y0], [cx + wa / 2, y0], [cx + wb / 2, y0 - h], [cx - wb / 2, y0 - h]], 'isi'), H.l(cx + wb / 2, y0 - h, cx + wb / 2, y0, 'putus'), H.t(cx, y0 + 16, la, 'middle', 'tebal'), H.t(cx, y0 - h - 6, lb, 'middle', 'tebal'), H.t(cx + wb / 2 + 6, y0 - h / 2 + 4, lt, 'start', 'tebal')] };
  }
  function gbrPythag(p, q, lp, lq, lc, persegi) {
    const s = Math.min(200 / p, 100 / q), x0 = 40, y0 = 126, w = p * s, h = q * s;
    const el = persegi ? [H.r(x0, y0 - h, w, h, 'isi'), H.l(x0, y0, x0 + w, y0 - h, 'merah')] : [H.p([[x0, y0], [x0 + w, y0], [x0 + w, y0 - h]], 'isi'), H.p([[x0 + w - 12, y0], [x0 + w - 12, y0 - 12], [x0 + w, y0 - 12]], 'kosong')];
    el.push(H.t(x0 + w / 2, y0 + 16, lp, 'middle', 'tebal'), H.t(x0 + w + 8, y0 - h / 2 + 4, lq, 'start', 'tebal'), H.t(x0 + w / 2 - 8, y0 - h / 2 - 8, lc, 'end', 'tebal'));
    return { tipe: 'gambar', alt: 'Segitiga siku-siku dengan sisi ' + lp + ', ' + lq + ', ' + lc, tinggi: 148, el };
  }
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]];

  CP.aktifkan('VIII-4', {
    level: [
      lv('Sudut berpelurus, berpenyiku, dan bertolak belakang', '180° − 70° = 110°', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['pelurus', 'penyiku', 'tolak', 'sebelah']), th: r.bulat(2, 17) * 5 }),
        ({ jenis, th }) => {
          const th2 = jenis === 'penyiku' ? Math.min(th, 85) : th;
          const ans = jenis === 'pelurus' || jenis === 'sebelah' ? 180 - th2 : jenis === 'penyiku' ? 90 - th2 : th2;
          const teks = { pelurus: 'Dua sudut berpelurus: yang satu ' + th2 + DER + '. Berapa besar sudut yang lain?', penyiku: 'Dua sudut berpenyiku: yang satu ' + th2 + DER + '. Berapa besar sudut yang lain?', tolak: 'Dua garis lurus berpotongan. Salah satu sudutnya ' + th2 + DER + '. Berapa besar sudut yang bertolak belakang dengannya?', sebelah: 'Dua garis lurus berpotongan. Salah satu sudutnya ' + th2 + DER + '. Berapa besar sudut yang bersebelahan dengannya?' }[jenis];
          const lang = { pelurus: [st('Sudut berpelurus berjumlah 180°.'), st('180° − ' + th2 + '° = ' + ans + '°.', 180 - th2)], sebelah: [st('Sudut yang bersebelahan pada dua garis berpotongan berpelurus (berjumlah 180°).'), st('180° − ' + th2 + '° = ' + ans + '°.', 180 - th2)], penyiku: [st('Sudut berpenyiku berjumlah 90°.'), st('90° − ' + th2 + '° = ' + ans + '°.', 90 - th2)], tolak: [st('Sudut yang bertolak belakang selalu sama besar.'), st('Besarnya ' + ans + '°.', th2)] }[jenis];
          return S.angka(teks, ans, { jenis, satuan: DER, gambar: gbrSudutGaris(jenis, th2), langkah: lang });
        }),
      lv('Jumlah sudut segitiga dan sudut luar', 'Jumlah sudut dalam = 180°', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['dalam', 'luar']), A: r.bulat(3, 10) * 5, B: r.bulat(3, 10) * 5 }),
        ({ jenis, A, B }) => {
          const C = 180 - A - B;
          if (jenis === 'dalam') return S.angka('Pada segitiga ABC, sudut A = ' + A + DER + ' dan sudut B = ' + B + DER + '. Berapa besar sudut C?', C, { jenis, satuan: DER, gambar: gbrSegitigaSudut(A, B, [A + DER, B + DER, '?']), langkah: [st('Jumlah sudut dalam segitiga = 180°.'), st('C = 180° − ' + A + '° − ' + B + '° = ' + C + '°.', 180 - A - B)] });
          return S.angka('Pada segitiga ABC, sudut A = ' + A + DER + ' dan sudut C = ' + C + DER + '. Sisi AB diperpanjang melewati B. Berapa besar sudut luar di titik B?', A + C, { jenis, satuan: DER, gambar: gbrSegitigaSudut(A, B, [A + DER, '', C + DER, '?'], true), langkah: [st('Sudut luar segitiga sama dengan jumlah dua sudut dalam yang tidak bersebelahan dengannya.'), st('Sudut luar B = ' + A + '° + ' + C + '° = ' + (A + C) + '°.', A + C)] });
        }),
      lv('Sudut pada segi banyak', 'Jumlah = (n − 2) × 180°', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jumlah', 'beraturan', 'luar']), n: r.pilih(jenisN()), k: r.bulat(0, 1) }),
        ({ jenis, n }) => {
          const tot = (n - 2) * 180;
          if (jenis === 'jumlah') return S.angka('Berapa jumlah besar semua sudut dalam suatu segi-' + n + '?', tot, { jenis, satuan: DER, gambar: gbrPoligon(n, 'n = ' + n), langkah: [st('Jumlah sudut dalam segi-n = (n − 2) × 180°.'), st('(' + n + ' − 2) × 180° = ' + (n - 2) + ' × 180° = ' + tot + '°.', (n - 2) * 180)] });
          if (jenis === 'beraturan') { const s = S.angka('Berapa besar setiap sudut dalam suatu segi-' + n + ' beraturan?', tot / n, { jenis, satuan: DER, gambar: gbrPoligon(n, '? ' + DER), langkah: [st('Jumlah sudut dalam = (' + n + ' − 2) × 180° = ' + tot + '°.'), st('Tiap sudut = ' + tot + ' ÷ ' + n + ' = ' + tot / n + '°.', tot / n)] }); s.dibagi = [{ a: tot, b: n }]; return s; }
          const s = S.angka('Berapa besar setiap sudut luar suatu segi-' + n + ' beraturan?', 360 / n, { jenis, satuan: DER, gambar: gbrPoligon(n, 'n = ' + n), langkah: [st('Jumlah sudut luar segi-n beraturan selalu 360°, dan semua sudut luarnya sama besar.'), st('360° ÷ ' + n + ' = ' + 360 / n + '°.', 360 / n)] });
          s.dibagi = [{ a: 360, b: n }]; return s;
        }),
      lv('Luas segiempat', 'Jajargenjang, belah ketupat, layang-layang, trapesium', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jajargenjang', 'belah ketupat', 'layang-layang', 'trapesium']), a: r.bulat(4, 16), t: r.bulat(3, 12), b: r.bulat(2, 14), d1: 2 * r.bulat(2, 8), d2: r.bulat(3, 14) }),
        (p) => {
          if (p.jenis === 'jajargenjang') return S.angka('Sebuah jajargenjang memiliki alas ' + p.a + ' cm dan tinggi ' + p.t + ' cm. Berapa luasnya?', p.a * p.t, { jenis: p.jenis, satuan: 'cm²', gambar: gbrJajar(p.a, p.t, p.a, p.t), langkah: [st('Luas jajargenjang = alas × tinggi.'), st(p.a + ' × ' + p.t + ' = ' + (p.a * p.t) + ' cm².', p.a * p.t)] });
          if (p.jenis === 'trapesium') {
            const b = p.b + p.a, t = p.t * 2, L = ((p.a + b) * t) / 2;
            const s = S.angka('Sebuah trapesium memiliki sisi sejajar ' + p.a + ' cm dan ' + b + ' cm, dengan tinggi ' + t + ' cm. Berapa luasnya?', L, { jenis: p.jenis, satuan: 'cm²', gambar: gbrTrapesium(Math.max(p.a, b), Math.min(p.a, b), t, Math.max(p.a, b), Math.min(p.a, b), t), langkah: [st('Luas trapesium = ½ × (jumlah sisi sejajar) × tinggi.'), st('½ × (' + p.a + ' + ' + b + ') × ' + t + ' = ' + (p.a + b) + ' × ' + t + ' ÷ 2 = ' + L + ' cm².', ((p.a + b) * t) / 2)] });
            s.dibagi = [{ a: (p.a + b) * t, b: 2 }]; return s;
          }
          const nm = p.jenis === 'belah ketupat' ? 'belah ketupat' : 'layang-layang', L = (p.d1 * p.d2) / 2;
          const s = S.angka('Sebuah ' + nm + ' memiliki diagonal ' + p.d1 + ' cm dan ' + p.d2 + ' cm. Berapa luasnya?', L, { jenis: p.jenis, satuan: 'cm²', gambar: p.jenis === 'belah ketupat' ? gbrBelah(p.d1, p.d2, p.d1, p.d2) : gbrLayang(p.d1, p.d2, p.d1, p.d2), langkah: [st('Luas ' + nm + ' = ½ × diagonal 1 × diagonal 2.'), st('½ × ' + p.d1 + ' × ' + p.d2 + ' = ' + p.d1 + ' × ' + p.d2 + ' ÷ 2 = ' + L + ' cm².', (p.d1 * p.d2) / 2)] });
          s.dibagi = [{ a: p.d1 * p.d2, b: 2 }]; return s;
        }),
      lv('Teorema Pythagoras', 'a² + b² = c²', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['miring', 'sisi', 'diagonal']), t: r.pilih(TRIP), k: r.bulat(1, 4), pos: r.bulat(0, 1) }),
        ({ jenis, t, k, pos }) => {
          const [a, b, c] = t.map((x) => x * (t[2] > 13 ? 1 : k));
          if (jenis === 'miring') return S.angka('Segitiga siku-siku memiliki sisi tegak ' + a + ' cm dan sisi datar ' + b + ' cm. Berapa panjang sisi miringnya?', c, { jenis, satuan: 'cm', gambar: gbrPythag(b, a, b, a, '?'), langkah: [st('c² = a² + b² = ' + a + '² + ' + b + '² = ' + (a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b) + '.'), st('c = √' + (a * a + b * b) + ' = ' + c + ' cm.', Math.sqrt(a * a + b * b))] });
          if (jenis === 'sisi') return S.angka('Segitiga siku-siku memiliki sisi miring ' + c + ' cm dan salah satu sisi siku-sikunya ' + a + ' cm. Berapa panjang sisi siku-siku yang lain?', b, { jenis, satuan: 'cm', gambar: gbrPythag(b, a, '?', a, c), langkah: [st('b² = c² − a² = ' + c + '² − ' + a + '² = ' + (c * c) + ' − ' + (a * a) + ' = ' + (c * c - a * a) + '.'), st('b = √' + (c * c - a * a) + ' = ' + b + ' cm.', Math.sqrt(c * c - a * a))] });
          return S.angka('Sebuah persegi panjang memiliki panjang ' + b + ' cm dan lebar ' + a + ' cm. Berapa panjang diagonalnya?', c, { jenis, satuan: 'cm', gambar: gbrPythag(b, a, b, a, '?', true), langkah: [st('Diagonal membagi persegi panjang menjadi dua segitiga siku-siku, sehingga d² = p² + l² = ' + (b * b) + ' + ' + (a * a) + ' = ' + (a * a + b * b) + '.'), st('d = √' + (a * a + b * b) + ' = ' + c + ' cm.', Math.sqrt(a * a + b * b))] });
        }),
      lv('Soal cerita bangun geometri', 'Tangga, lantai, plat, rangka', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['tangga', 'taman', 'lantai', 'layang', 'rangka', 'plat']), t: r.pilih(TRIP), k: r.bulat(1, 4), a: r.bulat(4, 14), h: r.bulat(3, 10), d1: 2 * r.bulat(3, 8), d2: r.bulat(4, 12), b: r.bulat(2, 8) }),
        (p, ctx) => {
          const v = kons(ctx), [a0, b0, c0] = p.t.map((x) => x * (p.t[2] > 13 ? 1 : p.k));
          if (p.jenis === 'tangga' || p.jenis === 'rangka') {
            const rangka = p.jenis === 'rangka' && v === 'vokasi';
            const teks = rangka ? 'Sebuah rangka atap bengkel berbentuk persegi panjang dengan panjang ' + b0 + ' dm dan lebar ' + a0 + ' dm. Penguat diagonal dipasang dari sudut ke sudut. Berapa dm panjang penguat itu?' : 'Sebuah tangga bersandar pada dinding. Ujung atas tangga mencapai ketinggian ' + a0 + ' m dan kaki tangga berjarak ' + b0 + ' m dari dinding. Berapa panjang tangga?';
            return S.angka(teks, c0, { jenis: rangka ? 'rangka' : 'tangga', satuan: rangka ? 'dm' : 'm', gambar: gbrPythag(b0, a0, b0, a0, '?', rangka), langkah: [st('Gunakan Pythagoras: c² = ' + a0 + '² + ' + b0 + '² = ' + (a0 * a0 + b0 * b0) + '.'), st('c = √' + (a0 * a0 + b0 * b0) + ' = ' + c0 + '.', Math.sqrt(a0 * a0 + b0 * b0))] });
          }
          if (p.jenis === 'taman' || p.jenis === 'plat' && v === 'umum') return S.angka(v === 'umum' ? 'Sebuah taman berbentuk jajargenjang memiliki alas ' + p.a + ' m dan tinggi ' + p.h + ' m. Berapa luas taman itu?' : 'Sebuah lembar kain berbentuk jajargenjang memiliki alas ' + p.a + ' cm dan tinggi ' + p.h + ' cm. Berapa luas kain itu?', p.a * p.h, { jenis: 'taman', satuan: v === 'umum' ? 'm²' : 'cm²', gambar: gbrJajar(p.a, p.h, p.a, p.h), langkah: [st('Luas jajargenjang = alas × tinggi.'), st(p.a + ' × ' + p.h + ' = ' + (p.a * p.h) + '.', p.a * p.h)] });
          if (p.jenis === 'lantai' || p.jenis === 'plat') {
            const s1 = p.b, s2 = p.b + p.a, t = 2 * p.h, L = ((s1 + s2) * t) / 2;
            const s = S.angka(v === 'umum' ? 'Sebuah lantai berbentuk trapesium dengan sisi sejajar ' + s1 + ' m dan ' + s2 + ' m, serta tinggi ' + t + ' m. Berapa luas lantai itu?' : 'Sebuah plat logam berbentuk trapesium dengan sisi sejajar ' + s1 + ' cm dan ' + s2 + ' cm, serta tinggi ' + t + ' cm. Berapa luas plat itu?', L, { jenis: 'lantai', satuan: v === 'umum' ? 'm²' : 'cm²', gambar: gbrTrapesium(s2, s1, t, s2, s1, t), langkah: [st('Luas trapesium = ½ × (jumlah sisi sejajar) × tinggi.'), st('½ × (' + s1 + ' + ' + s2 + ') × ' + t + ' = ' + L + '.', ((s1 + s2) * t) / 2)] });
            s.dibagi = [{ a: (s1 + s2) * t, b: 2 }]; return s;
          }
          const L = (p.d1 * p.d2) / 2;
          const s = S.angka(v === 'umum' ? 'Sebuah layang-layang memiliki diagonal ' + p.d1 + ' cm dan ' + p.d2 + ' cm. Berapa luas kertas yang diperlukan?' : 'Sebuah etalase kaca berbentuk layang-layang dengan diagonal ' + p.d1 + ' cm dan ' + p.d2 + ' cm. Berapa luas kaca yang diperlukan?', L, { jenis: 'layang', satuan: 'cm²', gambar: gbrLayang(p.d1, p.d2, p.d1, p.d2), langkah: [st('Luas layang-layang = ½ × diagonal 1 × diagonal 2.'), st(p.d1 + ' × ' + p.d2 + ' ÷ 2 = ' + L + '.', (p.d1 * p.d2) / 2)] });
          s.dibagi = [{ a: p.d1 * p.d2, b: 2 }]; return s;
        })
    ]
  });
  function jenisN() { return [5, 6, 8, 10, 12]; }

  /* ========================= VIII-5 PELUANG ========================= */
  function gbrPohon(n) {
    const hasil = []; const gen = (pref, k) => { if (k === n) { hasil.push(pref); return; } gen(pref + 'A', k + 1); gen(pref + 'G', k + 1); }; gen('', 0);
    const Hh = Math.max(110, hasil.length * 17), top = 14, step = (Hh - 10) / hasil.length, el = [];
    const x = [24, 90, 156, 222], leafY = (i) => top + step * (i + 0.5);
    const pos = (pref) => { const idx = parseInt(pref.split('').map((c) => (c === 'A' ? 0 : 1)).join('') || '0', 2); const rem = n - pref.length; const span = Math.pow(2, rem); return top + step * (idx * span + span / 2); };
    el.push(H.o(x[0], pos(''), 3, 'titik'));
    const rec = (pref) => { if (pref.length === n) return; ['A', 'G'].forEach((c) => { const nx = pref + c; el.push(H.l(x[pref.length], pos(pref), x[pref.length + 1], pos(nx), 'garis'), H.t((x[pref.length] + x[pref.length + 1]) / 2, (pos(pref) + pos(nx)) / 2 - 3, c, 'middle', 'kecil'), H.o(x[pref.length + 1], pos(nx), 3, 'titik')); rec(nx); }); };
    rec('');
    hasil.forEach((h, i) => el.push(H.t(x[n] + 10, leafY(i) + 4, h, 'start', 'tebal')));
    return { tipe: 'gambar', alt: 'Diagram pohon pelemparan ' + n + ' koin: ' + hasil.join(', '), lebar: 320, tinggi: Hh + 8, el };
  }
  const DADU = []; for (let u = 1; u <= 6; u++) for (let w = 1; w <= 6; w++) DADU.push([u, w]);

  CP.aktifkan('VIII-5', {
    level: [
      lv('Ruang sampel', 'Dua koin: {AA, AG, GA, GG} → 4', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['koin', 'koindadu', 'duadadu', 'uji']), n: r.bulat(2, 4), u: r.bulat(2, 4) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'koin') return S.angka('Berapa banyak anggota ruang sampel pada pelemparan ' + p.n + ' koin sekaligus?', Math.pow(2, p.n), { jenis: 'koin', langkah: [st('Setiap koin punya 2 kemungkinan (angka atau gambar).'), st('2' + sup(p.n) + ' = ' + Array(p.n).fill(2).join(' × ') + ' = ' + Math.pow(2, p.n) + '.', Math.pow(2, p.n))] });
          if (p.jenis === 'koindadu') return S.angka('Sebuah koin dan sebuah dadu dilempar bersamaan. Berapa banyak anggota ruang sampelnya?', 12, { jenis: 'koindadu', langkah: [st('Koin: 2 kemungkinan, dadu: 6 kemungkinan. Kalikan.'), st('2 × 6 = 12.', 2 * 6)] });
          if (p.jenis === 'duadadu') return S.angka('Dua dadu dilempar bersamaan. Berapa banyak anggota ruang sampelnya?', 36, { jenis: 'duadadu', langkah: [st('Setiap dadu punya 6 kemungkinan.'), st('6 × 6 = 36.', 6 * 6)] });
          return S.angka(v === 'umum' ? 'Sebuah soal pilihan benar-salah diisi untuk ' + p.n + ' soal berurutan. Berapa banyak kemungkinan susunan jawaban?' : 'Setiap produk diperiksa pada ' + p.n + ' tahap uji, dan hasil tiap tahap hanya lulus atau gagal. Berapa banyak kemungkinan hasil pemeriksaan satu produk?', Math.pow(2, p.n), { jenis: 'uji', langkah: [st('Tiap tahap atau soal punya 2 kemungkinan, jadi dikalikan sebanyak ' + p.n + ' kali.'), st('2' + sup(p.n) + ' = ' + Math.pow(2, p.n) + '.', Math.pow(2, p.n))] });
        }),
      lv('Peluang teoretis', 'Kelereng, kartu bernomor', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['bola', 'kartu']), m: [r.bulat(2, 9), r.bulat(2, 9), r.bulat(2, 9)], k: r.bulat(0, 2), N: r.pilih([12, 15, 20, 24, 30]), z: r.bulat(0, 3) }),
        (p) => {
          if (p.jenis === 'bola') {
            const [mm, bb, hh] = p.m, N = mm + bb + hh, nm = ['merah', 'biru', 'hijau'], ct = p.m[p.k];
            return S.pecahan('Sebuah kantong berisi ' + mm + ' kelereng merah, ' + bb + ' kelereng biru, dan ' + hh + ' kelereng hijau. Satu kelereng diambil acak. Tentukan peluang terambil kelereng yang bukan ' + nm[p.k] + '.', P(N - ct, N), { jenis: 'bola', langkah: [st('Banyak seluruh kelereng = ' + N + '. Bukan ' + nm[p.k] + ' = ' + N + ' − ' + ct + ' = ' + (N - ct) + '.'), st('Peluang = ' + (N - ct) + '/' + N + ' = ' + pf(P(N - ct, N)) + '.', P(N - ct, N))] });
          }
          const sets = [['genap', (x) => x % 2 === 0], ['kelipatan 3', (x) => x % 3 === 0], ['bilangan prima', (x) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; }], ['kelipatan 4', (x) => x % 4 === 0]];
          const [nm, f] = sets[p.z]; let cnt = 0; for (let i = 1; i <= p.N; i++) if (f(i)) cnt++;
          return S.pecahan('Sebuah kotak berisi kartu bernomor 1 sampai ' + p.N + '. Satu kartu diambil acak. Tentukan peluang terambil kartu bernomor ' + nm + '.', P(cnt, p.N), { jenis: 'kartu', langkah: [st('Banyak kartu = ' + p.N + '. Kartu ' + nm + ' ada ' + cnt + '.'), st('Peluang = ' + cnt + '/' + p.N + ' = ' + pf(P(cnt, p.N)) + '.', P(cnt, p.N))] });
        }),
      lv('Frekuensi relatif dan harapan', 'Peluang empiris dari percobaan', 'pecahan',
        (r, c) => { const q = r.pilih([4, 5, 8, 10, 20, 25]); return { jenis: pilihJenis(r, c, ['relatif', 'prediksi']), n: r.pilih([20, 25, 40, 50, 80, 100]), k: 0, q, pp: r.bulat(1, q - 1), N: 0, mult: r.bulat(2, 12), z: r.bulat(0, 2), sk: r.bulat(0, 1) }; },
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'relatif') {
            let k = Math.max(1, Math.round(p.n * (p.pp / p.q)));
            const obj = v === 'umum' ? ['lemparan koin', 'angka'] : ['pesanan yang diperiksa', 'cacat'];
            return S.pecahan('Dari ' + p.n + ' ' + obj[0] + ', hasil "' + obj[1] + '" muncul ' + k + ' kali. Tentukan frekuensi relatif (peluang empiris) hasil tersebut.', P(k, p.n), { jenis: 'relatif', langkah: [st('Frekuensi relatif = banyak muncul ÷ banyak percobaan.'), st(k + '/' + p.n + ' = ' + pf(P(k, p.n)) + '.', P(k, p.n))] });
          }
          const pe = P(p.pp, p.q), N = pe.d * p.mult, ans = N * pe.n / pe.d;
          const teks = v === 'umum' ? 'Dari percobaan sebelumnya, peluang empiris sebuah bola basket masuk ring adalah ' + pf(pe) + '. Jika dilakukan ' + N + ' lemparan, berapa kali diperkirakan bola masuk?' : 'Dari survei, peluang empiris seorang pengunjung toko membeli adalah ' + pf(pe) + '. Jika ada ' + N + ' pengunjung, berapa pembeli yang diperkirakan?';
          const s = S.angka(teks, ans, { jenis: 'prediksi', langkah: [st('Perkiraan = banyak percobaan × peluang = ' + N + ' × ' + pf(pe) + '.'), st(N + ' ÷ ' + pe.d + ' × ' + pe.n + ' = ' + (N / pe.d) + ' × ' + pe.n + ' = ' + ans + '.', (N / pe.d) * pe.n)] });
          s.dibagi = [{ a: N, b: pe.d }]; return s;
        }),
      lv('Diagram pohon', 'Dua dan tiga koin', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['dua', 'tiga']), z: r.bulat(0, 2) }),
        (p) => {
          const n = p.jenis === 'dua' ? 2 : 3; const hasil = []; const gen = (pf2, k) => { if (k === n) { hasil.push(pf2); return; } gen(pf2 + 'A', k + 1); gen(pf2 + 'G', k + 1); }; gen('', 0);
          const sets = n === 2 ? [['tepat satu angka', (h) => (h.match(/A/g) || []).length === 1], ['dua-duanya angka', (h) => h === 'AA'], ['paling sedikit satu gambar', (h) => h.indexOf('G') >= 0]] : [['tepat dua angka', (h) => (h.match(/A/g) || []).length === 2], ['ketiganya sama', (h) => /^(AAA|GGG)$/.test(h)], ['paling sedikit satu angka', (h) => h.indexOf('A') >= 0]];
          const [nm, f] = sets[p.z]; const baik = hasil.filter(f);
          return S.pecahan('Perhatikan diagram pohon pelemparan ' + n + ' koin (A = angka, G = gambar). Tentukan peluang muncul ' + nm + '.', P(baik.length, hasil.length), { jenis: p.jenis + p.z, gambar: gbrPohon(n), langkah: [st('Dari diagram pohon, ruang sampel = { ' + hasil.join(', ') + ' }, jadi n(S) = ' + hasil.length + '.'), st('Kejadian "' + nm + '" = { ' + baik.join(', ') + ' }, n(A) = ' + baik.length + '.'), st('Peluang = ' + baik.length + '/' + hasil.length + ' = ' + pf(P(baik.length, hasil.length)) + '.', P(baik.length, hasil.length))] });
        }),
      lv('Peluang dua dadu', 'Jumlah, kembar, selisih', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jumlah', 'kembar', 'selisih', 'kali']), j: r.bulat(8, 11), d: r.bulat(1, 3) }),
        (p) => {
          let f, nm;
          if (p.jenis === 'jumlah') { f = (a, b) => a + b >= p.j; nm = 'jumlah kedua mata dadu paling sedikit ' + p.j; }
          else if (p.jenis === 'kembar') { f = (a, b) => a === b; nm = 'kedua mata dadu sama (kembar)'; }
          else if (p.jenis === 'selisih') { f = (a, b) => Math.abs(a - b) === p.d; nm = 'selisih kedua mata dadu sama dengan ' + p.d; }
          else { f = (a, b) => (a * b) % 2 === 0; nm = 'hasil kali kedua mata dadu genap'; }
          const baik = DADU.filter((q) => f(q[0], q[1])); const hasil = P(baik.length, 36);
          return S.pecahan('Dua dadu dilempar bersamaan. Tentukan peluang ' + nm + '.', hasil, { jenis: p.jenis, langkah: [st('Banyak seluruh pasangan = 36.'), st('Pasangan yang memenuhi ada ' + baik.length + (baik.length <= 12 ? ': ' + baik.map((q) => '(' + q[0] + ',' + q[1] + ')').join(', ') : '') + '.'), st('Peluang = ' + baik.length + '/36 = ' + pf(hasil) + '.', hasil)] });
        }),
      lv('Soal cerita peluang', 'Survei, uji produk, dua tahap', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['survei', 'bebas', 'komplemen']), n: r.pilih([40, 50, 80, 100, 120]), a: r.bulat(2, 9), b: r.bulat(2, 9), m: r.bulat(2, 10), sk: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'survei') {
            const k = Math.max(1, Math.round(p.n * (p.a / (p.a + 3)))); const pe = P(k, p.n);
            const N = pe.d * p.m, ans = (N * pe.n) / pe.d;
            const teks = v === 'umum' ? 'Dari survei terhadap ' + p.n + ' siswa, sebanyak ' + k + ' siswa suka olahraga renang. Jika disurvei ' + N + ' siswa lain dengan pola yang sama, berapa siswa yang diperkirakan suka renang?' : 'Dari survei terhadap ' + p.n + ' pelanggan toko online, sebanyak ' + k + ' pelanggan puas. Jika ada ' + N + ' pelanggan dengan pola yang sama, berapa pelanggan yang diperkirakan puas?';
            const s = S.angka(teks, ans, { jenis: 'survei', langkah: [st('Peluang empiris = ' + k + '/' + p.n + ' = ' + pf(pe) + '.'), st('Perkiraan = ' + N + ' × ' + pf(pe) + ' = ' + (N / pe.d) + ' × ' + pe.n + ' = ' + ans + '.', (N / pe.d) * pe.n)] });
            s.dibagi = [{ a: N, b: pe.d }]; return s;
          }
          if (p.jenis === 'bebas') {
            const q1 = p.a + 2, q2 = p.b + 2, p1 = P(q1 - 1, q1), p2 = P(q2 - 1, q2), hasil = CP.pKali(p1, p2);
            const teks = v === 'umum' ? 'Peluang Ali lulus ujian praktik ' + pf(p1) + ' dan peluang Ali lulus ujian teori ' + pf(p2) + '. Kedua ujian tidak saling memengaruhi. Tentukan peluang Ali lulus keduanya.' : 'Peluang sebuah produk lulus uji ukuran ' + pf(p1) + ' dan peluang lulus uji warna ' + pf(p2) + '. Kedua uji saling bebas. Tentukan peluang produk lulus kedua uji.';
            return S.pecahan(teks, hasil, { jenis: 'bebas', langkah: [st('Kejadian saling bebas: peluang keduanya = hasil kali peluang masing-masing.'), st(pf(p1) + ' × ' + pf(p2) + ' = ' + pf(hasil) + '.', hasil)] });
          }
          const tot = p.n, bad = Math.max(1, Math.round(tot * (p.a / 40))), good = tot - bad, hasil = P(good, tot);
          const teks = v === 'umum' ? 'Dalam sebuah undian terdapat ' + tot + ' kupon, ' + bad + ' di antaranya berhadiah. Satu kupon diambil acak. Tentukan peluang kupon yang terambil tidak berhadiah.' : 'Dari ' + tot + ' produk yang diperiksa, ' + bad + ' produk cacat. Satu produk diambil acak. Tentukan peluang produk yang terambil tidak cacat.';
          return S.pecahan(teks, hasil, { jenis: 'komplemen', langkah: [st('Yang diinginkan = ' + tot + ' − ' + bad + ' = ' + good + '.'), st('Peluang = ' + good + '/' + tot + ' = ' + pf(hasil) + '.', hasil)] });
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
