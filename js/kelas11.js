/* CepatPaham - Tahap 4, Kelas XI Matematika Umum: XI-1 Komposisi dan Invers Fungsi, XI-2 Lingkaran, XI-3 Statistika */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, H } = CP;
  const MIN = CP.MIN;
  const { rend, kunciAlj } = CP.alj;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const Q2 = '²', DER = '°', OO = '∘';
  const opsiAlj = (m) => ({ t: rend(m), k: kunciAlj(m), v: rend(m) });
  const opsiTeks = (t, k) => ({ t, k: k || t, v: t });
  const fx = (p, q) => rend({ x: p, '': q });

  /* ========================= XI-1 KOMPOSISI FUNGSI DAN FUNGSI INVERS ========================= */
  const invTeks = (p, q) => '(x ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q) + ') / ' + p;

  CP.aktifkan('XI-1', {
    level: [
      lv('Nilai fungsi komposisi', '(f ∘ g)(a) = f(g(a))', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['fog', 'gof']), p: nz(r, -4, 4), q: nz(r, -6, 6), r: nz(r, -3, 4), s: nz(r, -6, 6), a: r.bulat(-4, 6) }),
        ({ jenis, p, q, r, s, a }) => {
          const fog = jenis === 'fog';
          const [u, v, uq, vs] = fog ? [r, s, p, q] : [p, q, r, s]; // dalam: u*a+v ; luar: uq*.+vs
          const dalam = u * a + v, luar = uq * dalam + vs;
          const nama = fog ? '(f' + OO + 'g)' : '(g' + OO + 'f)';
          return S.angka('Diketahui f(x) = ' + fx(p, q) + ' dan g(x) = ' + fx(r, s) + '. Tentukan nilai ' + nama + '(' + mn(a) + ').', luar, { jenis, izin: { minus: true }, langkah: [
            st('Kerjakan fungsi dalam dulu: ' + (fog ? 'g' : 'f') + '(' + mn(a) + ') = ' + mn(u) + ' × (' + mn(a) + ') + (' + mn(v) + ') = ' + mn(dalam) + '.'),
            st('Lalu fungsi luar: ' + (fog ? 'f' : 'g') + '(' + mn(dalam) + ') = ' + mn(uq) + ' × (' + mn(dalam) + ') + (' + mn(vs) + ') = ' + mn(luar) + '.', uq * dalam + vs)] });
        }),
      lv('Rumus fungsi komposisi', '(f ∘ g)(x) = f(g(x))', 'pilihan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['fog', 'gof']), p: nz(r, -3, 4), q: nz(r, -6, 6), r: nz(r, -3, 4), s: nz(r, -6, 6), sd: r.bulat(1, 99999) }),
        ({ jenis, p, q, r, s, sd }) => {
          const fog = jenis === 'fog';
          const [a1, b1, a2, b2] = fog ? [p, q, r, s] : [r, s, p, q]; // luar = a1 x + b1, dalam = a2 x + b2
          const m = a1 * a2, k = a1 * b2 + b1;
          const benar = opsiAlj({ x: m, '': k });
          const luar2 = fog ? [r, s, p, q] : [p, q, r, s];
          const balik = [luar2[0], luar2[1], luar2[2], luar2[3]];
          const salah = [{ x: m, '': balik[0] * balik[3] + balik[1] }, { x: a1 + a2, '': k }, { x: m, '': b1 + b2 }, { x: m, '': a1 * b2 - b1 }, { x: m + 1, '': k }, { x: m, '': a2 * b1 + b2 }, { x: m, '': k + 1 }, { x: m, '': k - 1 }, { x: -m, '': k }, { x: m + 2, '': k }].map(opsiAlj);
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan('Diketahui f(x) = ' + fx(p, q) + ' dan g(x) = ' + fx(r, s) + '. Rumus (' + (fog ? 'f' + OO + 'g' : 'g' + OO + 'f') + ')(x) adalah …', h, { jenis, langkah: [
            st((fog ? 'f' : 'g') + '(' + (fog ? 'g' : 'f') + '(x)) = ' + (fog ? fx(p, q).replace('x', '(' + fx(r, s) + ')') : fx(r, s).replace('x', '(' + fx(p, q) + ')')) + '.'),
            st('Kalikan lalu jumlahkan: x: ' + mn(a1) + ' × ' + mn(a2) + ' = ' + mn(m) + '; konstanta: ' + mn(a1) + ' × (' + mn(b2) + ') + (' + mn(b1) + ') = ' + mn(k) + '.'),
            st('Hasilnya ' + rend({ x: m, '': k }) + '.', rend({ x: m, '': k }))] });
        }),
      lv('Nilai fungsi invers', 'f⁻¹(k): cari x sehingga f(x) = k', 'angka',
        (r) => ({ p: nz(r, -4, 4), q: nz(r, -8, 8), t: r.bulat(-5, 8) }),
        ({ p, q, t }) => {
          const k = p * t + q;
          const s = S.angka('Diketahui f(x) = ' + fx(p, q) + '. Tentukan nilai f⁻¹(' + mn(k) + ').', t, { jenis: 'nilaiInvers', izin: { minus: true }, langkah: [
            st('f⁻¹(' + mn(k) + ') adalah x yang membuat f(x) = ' + mn(k) + ': ' + fx(p, q) + ' = ' + mn(k) + '.'),
            st(mn(p) + 'x = ' + mn(k) + ' − (' + mn(q) + ') = ' + mn(k - q) + ', maka x = ' + mn(k - q) + ' ÷ (' + mn(p) + ') = ' + mn(t) + '.', (k - q) / p)] });
          s.dibagi = [{ a: k - q, b: p }]; return s;
        }),
      lv('Rumus fungsi invers', 'f(x) = px + q → f⁻¹(x) = (x − q) / p', 'pilihan',
        (r) => ({ p: r.bulat(2, 5), q: nz(r, -8, 8), sd: r.bulat(1, 99999) }),
        ({ p, q, sd }) => {
          const benar = opsiTeks(invTeks(p, q));
          const salah = [opsiTeks(invTeks(p, -q)), opsiTeks(p + '(x ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q) + ')'), opsiTeks('x / ' + p + ' ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q)), opsiTeks(invTeks(p + 1, q)), opsiTeks('(x ' + (q < 0 ? MIN : '+') + ' ' + Math.abs(q) + ') × ' + p)];
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan('Jika f(x) = ' + fx(p, q) + ', maka f⁻¹(x) = …', h, { jenis: 'rumusInvers', langkah: [
            st('Tulis y = ' + fx(p, q) + ', lalu cari x: ' + p + 'x = y ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q) + '.'),
            st('x = (y ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q) + ') / ' + p + '. Ganti y dengan x: f⁻¹(x) = ' + benar.t + '.', benar.t)] });
        }),
      lv('Invers fungsi pecahan', 'f(x) = (ax + b) / (x + d)', 'angka',
        (r) => {
          for (;;) {
            const a = r.bulat(1, 4), d = nz(r, -4, 4), x0 = r.bulat(-5, 8), y0 = r.bulat(-5, 6);
            if (x0 + d === 0 || y0 === a) continue;
            return { a, d, x0, y0, b: y0 * (x0 + d) - a * x0 };
          }
        },
        ({ a, d, x0, y0, b }) => {
          const num = b - d * y0, den = y0 - a;
          const f = '(' + fx(a, b) + ') / (x ' + (d < 0 ? MIN : '+') + ' ' + Math.abs(d) + ')';
          const s = S.angka('Diketahui f(x) = ' + f + '. Tentukan nilai f⁻¹(' + mn(y0) + ').', x0, { jenis: 'invPecahan', izin: { minus: true }, langkah: [
            st('Dari y = (ax + b)/(x + d): y(x + d) = ax + b, sehingga x = (b − dy) / (y − a).'),
            st('Substitusi y = ' + mn(y0) + ': x = (' + mn(b) + ' − (' + mn(d) + ')(' + mn(y0) + ')) / (' + mn(y0) + ' − ' + a + ') = ' + mn(num) + ' / ' + mn(den) + ' = ' + mn(x0) + '.', num / den)] });
          s.dibagi = [{ a: num, b: den }]; return s;
        }),
      lv('Invers komposisi dan soal cerita', '(f ∘ g)⁻¹(k)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['inv', 'cerita']), p: nz(r, -3, 4), q: nz(r, -6, 6), r: nz(r, -3, 4), s: nz(r, -6, 6), x0: r.bulat(-4, 8), a: r.bulat(2, 9), b: r.bulat(2, 6), x: r.bulat(8, 40) }),
        (pr, ctx) => {
          const v = kons(ctx);
          if (pr.jenis === 'inv') {
            const { p, q, r, s, x0 } = pr; const m = p * r, k0 = p * s + q, K = m * x0 + k0;
            const sm = S.angka('Diketahui f(x) = ' + fx(p, q) + ' dan g(x) = ' + fx(r, s) + '. Tentukan nilai (f' + OO + 'g)⁻¹(' + mn(K) + ').', x0, { jenis: 'invKomposisi', izin: { minus: true }, langkah: [
              st('(f' + OO + 'g)(x) = ' + rend({ x: m, '': k0 }) + '. Cari x yang membuat nilainya ' + mn(K) + '.'),
              st(mn(m) + 'x = ' + mn(K) + ' − (' + mn(k0) + ') = ' + mn(K - k0) + ', maka x = ' + mn(K - k0) + ' ÷ (' + mn(m) + ') = ' + mn(x0) + '.', (K - k0) / m)] });
            sm.dibagi = [{ a: K - k0, b: m }]; return sm;
          }
          const awal = pr.x + pr.a, F = pr.b * pr.x;
          const teks = v === 'umum' ? 'Dalam sebuah permainan, skor awal dikurangi penalti ' + pr.a + ' poin, lalu hasilnya dikalikan bonus ' + pr.b + '. Skor akhir seorang pemain ' + F + '. Berapa skor awal pemain itu?' : 'Sebuah konveksi mengambil ' + pr.a + ' meter dari gulungan kain untuk sampel. Sisa kain menghasilkan ' + pr.b + ' potong per meter, dan total potongan ' + F + '. Berapa meter panjang gulungan kain awalnya?';
          const sm = S.angka(teks, awal, { jenis: 'cerita', satuan: v === 'umum' ? 'poin' : 'meter', langkah: [
            st('Fungsi: f(x) = x − ' + pr.a + ' lalu g(y) = ' + pr.b + 'y, sehingga hasil akhir = ' + pr.b + '(x − ' + pr.a + ').'),
            st('Balik langkahnya: ' + F + ' ÷ ' + pr.b + ' = ' + pr.x + ', lalu + ' + pr.a + ' = ' + awal + '.', F / pr.b + pr.a)] });
          sm.dibagi = [{ a: F, b: pr.b }]; return sm;
        })
    ]
  });

  /* ========================= XI-2 LINGKARAN ========================= */
  function gbrLingkaran(a, b, r, o) {
    o = o || {}; const pts = o.titik || [];
    const xs = [a - r, a + r, ...pts.map((p) => p.x)], ys = [b - r, b + r, ...pts.map((p) => p.y)];
    const x0 = Math.min(...xs) - 0.3, x1 = Math.max(...xs) + 0.3, y0 = Math.min(...ys) - 0.3, y1 = Math.max(...ys) + 0.3;
    const W = 205, Hh = 92, s = Math.min(W / (x1 - x0), Hh / (y1 - y0)), ox = 160 - ((x0 + x1) / 2) * s, oy = 70 + ((y0 + y1) / 2) * s;
    const mx = (x) => ox + x * s, my = (y) => oy - y * s, el = [];
    if (x0 <= 0 && x1 >= 0) el.push(H.l(mx(0), my(y0), mx(0), my(y1), 'tipis'));
    if (y0 <= 0 && y1 >= 0) el.push(H.l(mx(x0), my(0), mx(x1), my(0), 'tipis'));
    const R = r * s;
    el.push(H.d('M' + (mx(a) - R).toFixed(1) + ' ' + my(b).toFixed(1) + ' A' + R.toFixed(1) + ' ' + R.toFixed(1) + ' 0 1 0 ' + (mx(a) + R).toFixed(1) + ' ' + my(b).toFixed(1) + ' A' + R.toFixed(1) + ' ' + R.toFixed(1) + ' 0 1 0 ' + (mx(a) - R).toFixed(1) + ' ' + my(b).toFixed(1), 'garis'));
    (o.garis || []).forEach((g) => el.push(H.l(mx(g.x1), my(g.y1), mx(g.x2), my(g.y2), g.c || 'putus')));
    el.push(H.o(mx(a), my(b), 3, 'titik'));
    if (o.pusat) el.push(H.t(mx(a) + 6, my(b) + 14, o.pusat, 'start', 'kecil'));
    if (o.radius) el.push(H.t(mx(a) + R * 0.35, my(b) - 4, o.radius, 'middle', 'tebal'));
    pts.forEach((p) => { el.push(H.o(mx(p.x), my(p.y), 4, 'titik')); if (p.t) el.push(H.t(mx(p.x) + (p.dx === undefined ? 8 : p.dx), my(p.y) + (p.dy === undefined ? -7 : p.dy), p.t, p.a || 'start', 'tebal')); });
    return { tipe: 'gambar', alt: o.alt || 'Lingkaran', tinggi: 144, el };
  }
  function gbrSinggung(r, d) {
    const sc = Math.min(8, 200 / d, 58 / r), cx = 56, cy = 74, R = r * sc, px = cx + d * sc;
    const tx = cx + ((r * r) / d) * sc, ty = cy - ((r * Math.sqrt(d * d - r * r)) / d) * sc;
    return { tipe: 'gambar', alt: 'Garis singgung dari titik luar ke lingkaran', tinggi: 150, el: [
      H.d('M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 1 0 ' + (cx + R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 1 0 ' + (cx - R) + ' ' + cy, 'garis'),
      H.l(cx, cy, px, cy, 'putus'), H.l(cx, cy, tx, ty, 'putus'), H.l(tx, ty, px, cy, 'merah'), H.o(cx, cy, 3, 'titik'), H.o(tx, ty, 3.5, 'titik'), H.o(px, cy, 3.5, 'titik'),
      H.t((cx + px) / 2, cy + 16, 'd = ' + d, 'middle', 'tebal'), H.t(cx + (tx - cx) / 2 - 4, ty + (cy - ty) / 2 - 6, 'r = ' + r, 'end', 'tebal'), H.t((tx + px) / 2 + 8, (ty + cy) / 2 - 6, '?', 'start', 'tebal'), H.t(px, cy + 16, 'P', 'middle', 'kecil')] };
  }
  const persLing = (a, b, rr) => '(x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ')' + Q2 + ' + (y ' + (b < 0 ? '+' : MIN) + ' ' + Math.abs(b) + ')' + Q2 + ' = ' + rr;
  const TRP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
  const titikPada = (r, kemungkinan) => { const out = [[r, 0], [-r, 0], [0, r], [0, -r]]; TRP.forEach((t) => { if (t[2] === r) [[t[0], t[1]], [t[1], t[0]]].forEach(([u, w]) => [[u, w], [-u, w], [u, -w], [-u, -w]].forEach((q) => out.push(q))); }); return out; };

  CP.aktifkan('XI-2', {
    level: [
      lv('Persamaan lingkaran berpusat di O', 'x² + y² = r²', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jarijari', 'persamaan']), r: r.bulat(2, 13), sd: r.bulat(1, 99999) }),
        (p) => {
          const gb = gbrLingkaran(0, 0, p.r, { radius: p.jenis === 'jarijari' ? 'r = ?' : 'r = ' + p.r, pusat: 'O', alt: 'Lingkaran berpusat di titik asal' });
          if (p.jenis === 'jarijari') return S.angka('Lingkaran memiliki persamaan x' + Q2 + ' + y' + Q2 + ' = ' + (p.r * p.r) + '. Berapa jari-jarinya?', p.r, { jenis: 'jarijari', gambar: gb, langkah: [st('Bentuk x² + y² = r² memiliki pusat O(0, 0).'), st('r² = ' + (p.r * p.r) + ', maka r = √' + (p.r * p.r) + ' = ' + p.r + '.', Math.sqrt(p.r * p.r))] });
          const pe = (n) => opsiTeks('x' + Q2 + ' + y' + Q2 + ' = ' + n);
          const benar = pe(p.r * p.r), salah = [pe(p.r), pe(2 * p.r), pe(p.r * p.r * 2), pe(p.r + 1), pe(p.r * p.r + 1)];
          const h = CP.rakitPilihan(CP.buatRng(p.sd), benar, salah);
          return S.pilihan('Persamaan lingkaran yang berpusat di O(0, 0) dengan jari-jari ' + p.r + ' adalah …', h, { jenis: 'persamaanO', gambar: gb, langkah: [st('Rumus: x² + y² = r².'), st('r = ' + p.r + ', jadi r² = ' + (p.r * p.r) + ': ' + benar.t + '.', benar.t)] });
        }),
      lv('Persamaan lingkaran berpusat di (a, b)', '(x − a)² + (y − b)² = r²', 'pilihan',
        (r) => ({ a: nz(r, -6, 6), b: nz(r, -6, 6), r: r.bulat(2, 9), sd: r.bulat(1, 99999) }),
        ({ a, b, r, sd }) => {
          const benar = opsiTeks(persLing(a, b, r * r));
          const salah = [opsiTeks(persLing(-a, b, r * r)), opsiTeks(persLing(a, -b, r * r)), opsiTeks(persLing(a, b, r)), opsiTeks(persLing(b, a, r * r)), opsiTeks(persLing(-a, -b, r * r))];
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan('Persamaan lingkaran yang berpusat di (' + mn(a) + ', ' + mn(b) + ') dengan jari-jari ' + r + ' adalah …', h, { jenis: 'pusatAB', gambar: gbrLingkaran(a, b, r, { pusat: '(' + mn(a) + ', ' + mn(b) + ')', radius: 'r = ' + r, alt: 'Lingkaran berpusat di (' + mn(a) + ', ' + mn(b) + ')' }), langkah: [
            st('Rumus: (x − a)² + (y − b)² = r² dengan a = ' + mn(a) + ', b = ' + mn(b) + ', r = ' + r + '.'),
            st('x − (' + mn(a) + ') = x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ', y − (' + mn(b) + ') = y ' + (b < 0 ? '+' : MIN) + ' ' + Math.abs(b) + ', r² = ' + (r * r) + '.'),
            st(benar.t + '.', benar.t)] });
        }),
      lv('Posisi titik terhadap lingkaran', 'Bandingkan jarak kuadrat dengan r²', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['dalam', 'pada', 'luar']);
          const [a, b] = r.pilih([[0, 0], [nz(r, -4, 4), nz(r, -4, 4)]]); const rr = r.pilih([5, 10, 13, 17, 25]);
          let dx, dy;
          if (jenis === 'pada') { [dx, dy] = r.pilih(titikPada(rr)); }
          else { for (;;) { dx = r.bulat(-rr - 3, rr + 3); dy = r.bulat(-rr - 3, rr + 3); const d2 = dx * dx + dy * dy; if (jenis === 'dalam' ? d2 < rr * rr - 3 : d2 > rr * rr + 3) break; } }
          return { jenis, a, b, rr, dx, dy, sd: r.bulat(1, 99999) };
        },
        ({ jenis, a, b, rr, dx, dy, sd }) => {
          const x = a + dx, y = b + dy, d2 = dx * dx + dy * dy, r2 = rr * rr;
          const T = { dalam: 'Di dalam lingkaran', pada: 'Pada lingkaran', luar: 'Di luar lingkaran' };
          const nyata = d2 < r2 ? 'dalam' : d2 === r2 ? 'pada' : 'luar';
          const benar = opsiTeks(T[nyata]);
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, [...Object.keys(T).filter((k) => k !== nyata).map((k) => opsiTeks(T[k])), opsiTeks('Di pusat lingkaran')]);
          const pers = a === 0 && b === 0 ? 'x' + Q2 + ' + y' + Q2 + ' = ' + r2 : persLing(a, b, r2);
          return S.pilihan('Titik P(' + mn(x) + ', ' + mn(y) + ') terhadap lingkaran ' + pers + ' terletak …', h, { jenis: nyata, gambar: gbrLingkaran(a, b, rr, { titik: [{ x, y, t: 'P' }], pusat: a === 0 && b === 0 ? 'O' : '', alt: 'Titik P dan lingkaran' }), langkah: [
            st('Hitung jarak kuadrat titik ke pusat: (' + mn(x) + ' − (' + mn(a) + '))² + (' + mn(y) + ' − (' + mn(b) + '))² = ' + (dx * dx) + ' + ' + (dy * dy) + ' = ' + d2 + '.'),
            st('Bandingkan dengan r² = ' + r2 + ': ' + d2 + (d2 < r2 ? ' < ' : d2 === r2 ? ' = ' : ' > ') + r2 + '.'),
            st('Jadi titik P ' + benar.t.toLowerCase().replace('di ', 'di ') + '.', benar.t)] });
        }),
      lv('Pusat dan jari-jari dari bentuk umum', 'x² + y² + Ax + By + C = 0', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jarijari', 'pusat']), a: nz(r, -6, 6), b: nz(r, -6, 6), r: r.bulat(2, 9) }),
        ({ jenis, a, b, r }) => {
          const A = -2 * a, B = -2 * b, C = a * a + b * b - r * r;
          const pers = rend({ 'x²': 1, 'y²': 1, x: A, y: B, '': C }) + ' = 0';
          const langkah = [st('Pusat = (−A/2, −B/2) = (−(' + mn(A) + ')/2, −(' + mn(B) + ')/2) = (' + mn(a) + ', ' + mn(b) + ').'), st('r² = (A/2)² + (B/2)² − C = ' + (a * a) + ' + ' + (b * b) + ' − (' + mn(C) + ') = ' + (r * r) + '.')];
          const gb = gbrLingkaran(a, b, r, { pusat: 'P', alt: 'Lingkaran dari bentuk umum' });
          if (jenis === 'jarijari') return S.angka('Lingkaran memiliki persamaan ' + pers + '. Berapa jari-jarinya?', r, { jenis, gambar: gb, langkah: [...langkah, st('r = √' + (r * r) + ' = ' + r + '.', Math.sqrt(a * a + b * b - C))] });
          return S.angka('Lingkaran memiliki persamaan ' + pers + '. Berapa jumlah koordinat pusatnya (absis + ordinat)?', a + b, { jenis, izin: { minus: true }, gambar: gb, langkah: [...langkah, st('Jumlah koordinat pusat = ' + mn(a) + ' + (' + mn(b) + ') = ' + mn(a + b) + '.', -A / 2 + -B / 2)] });
        }),
      lv('Persamaan garis singgung', 'x₁x + y₁y = r²', 'pilihan',
        (r) => { const t = r.pilih([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]); const [u, w] = r.pilih([[t[0], t[1]], [t[1], t[0]]]); return { x1: u * r.pilih([-1, 1]), y1: w * r.pilih([-1, 1]), rr: t[2], sd: r.bulat(1, 99999) }; },
        ({ x1, y1, rr, sd }) => {
          const r2 = rr * rr, pe = (m, c) => opsiTeks(rend(m) + ' = ' + c);
          const benar = pe({ x: x1, y: y1 }, r2);
          const salah = [pe({ x: x1, y: y1 }, rr), pe({ x: x1, y: -y1 }, r2), pe({ x: y1, y: x1 }, r2), pe({ x: x1, y: y1 }, 2 * r2), pe({ x: -x1, y: y1 }, r2)];
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          const gr = (x) => (r2 - x1 * x) / y1; const xa = x1 - 7, xb = x1 + 7;
          const gb = gbrLingkaran(0, 0, rr, { titik: [{ x: x1, y: y1, t: 'P(' + mn(x1) + ', ' + mn(y1) + ')', dx: x1 < 0 ? -8 : 8, a: x1 < 0 ? 'end' : 'start' }], garis: y1 === 0 ? [] : [{ x1: xa, y1: gr(xa), x2: xb, y2: gr(xb), c: 'merah' }], pusat: 'O', alt: 'Lingkaran dengan garis singgung di titik P' });
          return S.pilihan('Persamaan garis singgung pada lingkaran x' + Q2 + ' + y' + Q2 + ' = ' + r2 + ' di titik (' + mn(x1) + ', ' + mn(y1) + ') adalah …', h, { jenis: 'singgung', gambar: gb, langkah: [
            st('Cek titik pada lingkaran: (' + mn(x1) + ')² + (' + mn(y1) + ')² = ' + (x1 * x1) + ' + ' + (y1 * y1) + ' = ' + r2 + '.'),
            st('Garis singgung di (x₁, y₁): x₁x + y₁y = r², yaitu ' + benar.t + '.', benar.t)] });
        }),
      lv('Soal cerita: jarak dan garis singgung', 'Jangkauan sinyal, sensor, lampu sorot', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jarak', 'singgung']), t: r.pilih(TRP), k: r.bulat(0, 2), a: r.bulat(-3, 3), b: r.bulat(-3, 3), sg: [r.pilih([-1, 1]), r.pilih([-1, 1])] }),
        (p, ctx) => {
          const v = kons(ctx), [dx0, dy0, d0] = p.t;
          if (p.jenis === 'jarak') {
            const dx = dx0 * p.sg[0], dy = dy0 * p.sg[1], x = p.a + dx, y = p.b + dy;
            const teks = v === 'umum' ? 'Sebuah menara pemancar berada di titik (' + mn(p.a) + ', ' + mn(p.b) + ') pada peta (satuan km). Sebuah desa berada di titik (' + mn(x) + ', ' + mn(y) + '). Berapa jarak desa dari menara?' : 'Sebuah lampu sorot di gudang berada di titik (' + mn(p.a) + ', ' + mn(p.b) + ') pada denah (satuan m). Sebuah rak berada di titik (' + mn(x) + ', ' + mn(y) + '). Berapa jarak rak dari lampu?';
            return S.angka(teks, d0, { jenis: 'jarak', satuan: v === 'umum' ? 'km' : 'm', gambar: gbrLingkaran(p.a, p.b, d0, { titik: [{ x, y, t: '?', dy: -9 }], garis: [{ x1: p.a, y1: p.b, x2: x, y2: y, c: 'merah' }], alt: 'Jarak dua titik' }), langkah: [
              st('Jarak = √((x₂ − x₁)² + (y₂ − y₁)²) = √(' + (dx * dx) + ' + ' + (dy * dy) + ') = √' + (dx * dx + dy * dy) + '.'),
              st('√' + (dx * dx + dy * dy) + ' = ' + d0 + '.', Math.sqrt(dx * dx + dy * dy))] });
          }
          const r = dx0, d = d0, L = dy0;
          const teks = v === 'umum' ? 'Sebuah lapangan berbentuk lingkaran berjari-jari ' + r + ' m. Dari titik P yang berjarak ' + d + ' m dari pusat lapangan, ditarik tali lurus menyinggung tepi lapangan. Berapa panjang tali itu?' : 'Sebuah roda gerinda berjari-jari ' + r + ' cm. Sebuah batang pengukur menyinggung tepi roda dan ujungnya berjarak ' + d + ' cm dari pusat roda. Berapa panjang batang dari ujung sampai titik singgung?';
          return S.angka(teks, L, { jenis: 'singgungPanjang', satuan: v === 'umum' ? 'm' : 'cm', gambar: gbrSinggung(r, d), langkah: [
            st('Garis singgung tegak lurus jari-jari di titik singgung, sehingga membentuk segitiga siku-siku dengan sisi miring ' + d + '.'),
            st('Panjang singgung = √(' + d + '² − ' + r + '²) = √(' + (d * d) + ' − ' + (r * r) + ') = √' + (d * d - r * r) + ' = ' + L + '.', Math.sqrt(d * d - r * r))] });
        })
    ]
  });

  /* ========================= XI-3 STATISTIKA (pencar, regresi, korelasi) ========================= */
  function gbrPencar(pts, o) {
    o = o || {};
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1; let y0 = Math.min(...ys), y1 = Math.max(...ys); const py = (y1 - y0) * 0.12 + 1; y0 -= py; y1 += py;
    const X0 = 40, X1 = 306, Y0 = 12, Y1 = 118, mx = (x) => X0 + ((x - x0) / (x1 - x0)) * (X1 - X0), my = (y) => Y1 - ((y - y0) / (y1 - y0)) * (Y1 - Y0);
    const el = [H.l(X0, Y0, X0, Y1, 'garis'), H.l(X0, Y1, X1, Y1, 'garis')];
    [Math.ceil(x0), Math.floor(x1)].forEach((x) => el.push(H.t(mx(x), Y1 + 14, x, 'middle', 'kecil')));
    [Math.ceil(y0), Math.floor(y1)].forEach((y) => el.push(H.t(X0 - 4, my(y) + 4, y, 'end', 'kecil')));
    if (o.garis) { const f = (x) => o.garis.a + o.garis.b * x; el.push(H.l(mx(x0), my(Math.max(y0, Math.min(y1, f(x0)))), mx(x1), my(Math.max(y0, Math.min(y1, f(x1)))), 'merah')); }
    pts.forEach((p) => el.push(H.o(mx(p[0]), my(p[1]), 3.5, 'titik')));
    if (o.sx) el.push(H.t(X1, Y1 + 14, o.sx, 'end', 'kecil'));
    if (o.sy) el.push(H.t(X0 + 4, Y0 + 8, o.sy, 'start', 'kecil'));
    return { tipe: 'gambar', alt: o.alt || 'Diagram pencar', tinggi: 140, el };
  }
  const korelasi = (pts) => { const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n; let sxy = 0, sxx = 0, syy = 0; pts.forEach((p) => { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) ** 2; syy += (p[1] - my) ** 2; }); return sxy / Math.sqrt(sxx * syy); };
  const POLA = [[1, -1, 0, -1, 1], [-1, 1, 0, 1, -1], [2, -1, -2, -1, 2]];
  const titikReg = (a, b, e, kk) => [1, 2, 3, 4, 5].map((x, i) => [x, a + b * x + kk * e[i]]);
  const regSums = (pts) => { const n = pts.length; const sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0), sxx = pts.reduce((s, p) => s + p[0] * p[0], 0); return { n, sx, sy, sxy, sxx, b: (n * sxy - sx * sy) / (n * sxx - sx * sx), num: n * sxy - sx * sy, den: n * sxx - sx * sx }; };
  const kontStat = (v, k) => (v === 'umum' ? [['lama belajar (jam)', 'nilai ujian'], ['tinggi badan (cm)', 'berat badan (kg)'], ['jumlah latihan', 'skor lomba']][k % 3] : [['biaya iklan (juta rupiah)', 'penjualan (unit)'], ['jam operasi mesin', 'jumlah produk jadi'], ['jumlah pelanggan', 'omzet (juta rupiah)']][k % 3]);

  CP.aktifkan('XI-3', {
    level: [
      lv('Membaca diagram pencar', 'Korelasi positif, negatif, atau tidak ada', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['positif', 'negatif', 'nol']);
          for (let t = 0; t < 200; t++) {
            const n = 10, pts = []; const sl = r.bulat(2, 4) * (jenis === 'negatif' ? -1 : 1), base = r.bulat(20, 40);
            for (let i = 1; i <= n; i++) pts.push([i, jenis === 'nol' ? r.bulat(5, 40) : base + sl * i + r.bulat(-2, 2) * 2 + (jenis === 'negatif' ? 40 : 0)]);
            const rr = korelasi(pts);
            if ((jenis === 'positif' && rr > 0.85) || (jenis === 'negatif' && rr < -0.85) || (jenis === 'nol' && Math.abs(rr) < 0.25)) return { jenis, pts, sd: r.bulat(1, 99999), k: r.bulat(0, 2) };
          }
          return { jenis: 'positif', pts: [[1, 2], [2, 4], [3, 5], [4, 8], [5, 9], [6, 12], [7, 13], [8, 16]], sd: 1, k: 0 };
        },
        ({ jenis, pts, sd, k }, ctx) => {
          const rr = korelasi(pts); const nyata = rr > 0.5 ? 'positif' : rr < -0.5 ? 'negatif' : 'nol';
          const T = { positif: 'Korelasi positif', negatif: 'Korelasi negatif', nol: 'Hampir tidak ada korelasi' };
          const benar = opsiTeks(T[nyata]);
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, [...Object.keys(T).filter((x) => x !== nyata).map((x) => opsiTeks(T[x])), opsiTeks('Semua titik tepat pada satu garis lurus')]);
          const [sx, sy] = kontStat(kons(ctx), k);
          return S.pilihan('Diagram pencar berikut menunjukkan hubungan antara ' + sx + ' (sumbu x) dan ' + sy + ' (sumbu y). Pola hubungan kedua data adalah …', h, { jenis: nyata, gambar: gbrPencar(pts, { alt: 'Diagram pencar dengan ' + pts.length + ' titik' }), langkah: [
            st('Perhatikan arah sebaran titik: ' + (nyata === 'positif' ? 'titik naik dari kiri ke kanan (x naik, y ikut naik).' : nyata === 'negatif' ? 'titik turun dari kiri ke kanan (x naik, y turun).' : 'titik tersebar acak tanpa arah yang jelas.')),
            st('Jadi hubungannya: ' + benar.t + '.', benar.t)] });
        }),
      lv('Rata-rata pasangan data', 'x̄ dan ȳ', 'angka',
        (r, c) => {
          for (;;) { const n = r.bulat(4, 7), pts = []; for (let i = 0; i < n; i++) pts.push([r.bulat(2, 20), r.bulat(10, 60)]); const sx = pts.reduce((a, p) => a + p[0], 0), sy = pts.reduce((a, p) => a + p[1], 0); if (sx % n === 0 && sy % n === 0) return { pts, tanya: pilihJenis(r, c, ['x', 'y']), k: r.bulat(0, 2) }; }
        },
        ({ pts, tanya, k }, ctx) => {
          const n = pts.length, i = tanya === 'x' ? 0 : 1, jml = pts.reduce((a, p) => a + p[i], 0), [sx, sy] = kontStat(kons(ctx), k);
          const s = S.angka('Data berpasangan (' + sx + ', ' + sy + '): ' + pts.map((p) => '(' + p[0] + ', ' + p[1] + ')').join(', ') + '. Berapa rata-rata ' + (tanya === 'x' ? sx : sy) + '?', jml / n, { jenis: 'mean' + tanya, gambar: gbrPencar(pts, { alt: 'Diagram pencar data berpasangan' }), langkah: [
            st('Ambil ' + (tanya === 'x' ? 'nilai pertama' : 'nilai kedua') + ' dari setiap pasangan: ' + pts.map((p) => p[i]).join(', ') + '.'),
            st('Rata-rata = ' + jml + ' ÷ ' + n + ' = ' + jml / n + '.', jml / n)] });
          s.dibagi = [{ a: jml, b: n }]; return s;
        }),
      lv('Gradien garis regresi', 'b = (nΣxy − ΣxΣy) / (nΣx² − (Σx)²)', 'angka',
        (r, c) => ({ a: r.bulat(2, 30), b: nz(r, -5, 6), e: r.pilih(POLA), kk: r.bulat(1, 2), tanya: pilihJenis(r, c, ['b', 'a']), k: r.bulat(0, 2) }),
        ({ a, b, e, kk, tanya, k }, ctx) => {
          const pts = titikReg(a, b, e, kk), R = regSums(pts), [sx, sy] = kontStat(kons(ctx), k);
          const bb = R.num / R.den, aa = R.sy / R.n - bb * (R.sx / R.n);
          const langkah = [
            st('n = ' + R.n + ', Σx = ' + R.sx + ', Σy = ' + R.sy + ', Σxy = ' + R.sxy + ', Σx² = ' + R.sxx + '.'),
            st('b = (' + R.n + ' × ' + R.sxy + ' − ' + R.sx + ' × ' + R.sy + ') / (' + R.n + ' × ' + R.sxx + ' − ' + R.sx + '²) = ' + mn(R.num) + ' / ' + R.den + ' = ' + mn(bb) + '.', bb)];
          if (tanya === 'a') langkah.push(st('a = ȳ − b·x̄ = ' + R.sy / R.n + ' − (' + mn(bb) + ') × ' + R.sx / R.n + ' = ' + mn(aa) + '.', R.sy / R.n - bb * (R.sx / R.n)));
          const s = S.angka('Data (' + sx + ', ' + sy + '): ' + pts.map((p) => '(' + p[0] + ', ' + p[1] + ')').join(', ') + '. Garis regresi linear y = a + bx. Berapa nilai ' + (tanya === 'b' ? 'gradien b' : 'konstanta a') + '?', tanya === 'b' ? b : a, { jenis: 'reg' + tanya, izin: { minus: true }, gambar: gbrPencar(pts, { alt: 'Diagram pencar data regresi' }), langkah });
          s.dibagi = [{ a: R.num, b: R.den }]; return s;
        }),
      lv('Persamaan garis regresi', 'y = a + bx', 'pilihan',
        (r) => ({ a: r.bulat(2, 30), b: nz(r, -5, 6), e: r.pilih(POLA), kk: r.bulat(1, 2), sd: r.bulat(1, 99999), k: r.bulat(0, 2) }),
        ({ a, b, e, kk, sd, k }, ctx) => {
          const pts = titikReg(a, b, e, kk), R = regSums(pts), bb = R.num / R.den, aa = R.sy / R.n - bb * (R.sx / R.n);
          const op = (m) => ({ t: 'y = ' + rend({ x: m.b, '': m.a }), k: m.a + ',' + m.b, v: 'y = ' + rend({ x: m.b, '': m.a }) });
          const benar = op({ a: aa, b: bb });
          const salah = [op({ a: bb, b: aa }), op({ a: -aa, b: bb }), op({ a: aa, b: -bb }), op({ a: aa + 1, b: bb }), op({ a: aa, b: bb + 1 })].filter((o) => o.k !== benar.k);
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          const [sx, sy] = kontStat(kons(ctx), k);
          return S.pilihan('Data (' + sx + ', ' + sy + '): ' + pts.map((p) => '(' + p[0] + ', ' + p[1] + ')').join(', ') + '. Persamaan garis regresi linearnya adalah …', h, { jenis: 'persamaanReg', gambar: gbrPencar(pts, { garis: { a: aa, b: bb }, alt: 'Diagram pencar dengan garis regresi' }), langkah: [
            st('Σx = ' + R.sx + ', Σy = ' + R.sy + ', Σxy = ' + R.sxy + ', Σx² = ' + R.sxx + ', n = ' + R.n + '.'),
            st('b = ' + mn(R.num) + ' / ' + R.den + ' = ' + mn(bb) + '; a = ' + R.sy / R.n + ' − (' + mn(bb) + ') × ' + R.sx / R.n + ' = ' + mn(aa) + '.'),
            st('Persamaan: ' + benar.t + '.', benar.t)] });
        }),
      lv('Prediksi dengan garis regresi', 'Masukkan nilai x ke y = a + bx', 'angka',
        (r) => ({ a: r.bulat(2, 30), b: nz(r, -5, 6), e: r.pilih(POLA), kk: r.bulat(1, 2), x0: r.bulat(6, 9), k: r.bulat(0, 2) }),
        ({ a, b, e, kk, x0, k }, ctx) => {
          const pts = titikReg(a, b, e, kk), R = regSums(pts), bb = R.num / R.den, aa = R.sy / R.n - bb * (R.sx / R.n), v = kons(ctx);
          const [sx, sy] = kontStat(v, k);
          return S.angka('Dari data (' + sx + ', ' + sy + '): ' + pts.map((p) => '(' + p[0] + ', ' + p[1] + ')').join(', ') + ', diperoleh garis regresi linear. Gunakan garis itu untuk memperkirakan ' + sy + ' jika ' + sx + ' = ' + x0 + '.', a + b * x0, { jenis: 'prediksi', izin: { minus: true }, gambar: gbrPencar(pts, { garis: { a: aa, b: bb }, alt: 'Diagram pencar dengan garis regresi' }), langkah: [
            st('Garis regresi: y = ' + rend({ x: bb, '': aa }) + ' (dari Σx = ' + R.sx + ', Σy = ' + R.sy + ', Σxy = ' + R.sxy + ', Σx² = ' + R.sxx + ').'),
            st('Untuk x = ' + x0 + ': y = ' + mn(aa) + ' + (' + mn(bb) + ') × ' + x0 + ' = ' + mn(aa + bb * x0) + '.', aa + bb * x0)] });
        }),
      lv('Menafsirkan koefisien korelasi', 'r mendekati 1, −1, atau 0', 'pilihan',
        (r, c) => ({ mag: r.pilih([5, 10, 15, 20, 25, 75, 80, 85, 90, 95]), tanda: r.pilih([-1, 1]), k: r.bulat(0, 2), sd: r.bulat(1, 99999) }),
        ({ mag, tanda, k, sd }, ctx) => {
          const kuat = mag >= 70, pos = tanda > 0, rv = tanda * mag / 100;
          const T = (p, kt) => 'Korelasi ' + (p ? 'positif' : 'negatif') + ' ' + (kt ? 'kuat' : 'lemah');
          const benar = opsiTeks(T(pos, kuat));
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, [opsiTeks(T(!pos, kuat)), opsiTeks(T(pos, !kuat)), opsiTeks(T(!pos, !kuat))]);
          const [sx, sy] = kontStat(kons(ctx), k);
          const rt = (rv < 0 ? MIN : '') + '0,' + (Math.abs(mag) < 10 ? '0' + Math.abs(mag) : String(Math.abs(mag)));
          return S.pilihan('Koefisien korelasi antara ' + sx + ' dan ' + sy + ' adalah r = ' + rt + '. Tafsirannya adalah …', h, { jenis: 'tafsir', langkah: [
            st('Tanda r menunjukkan arah (' + (pos ? 'positif: naik bersama' : 'negatif: berlawanan arah') + '). Besar |r| = ' + (mag / 100).toString().replace('.', ',') + ' menunjukkan kekuatan hubungan (' + (kuat ? 'mendekati 1: kuat' : 'mendekati 0: lemah') + ').'),
            st('Jadi: ' + benar.t + '.', benar.t)] });
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
