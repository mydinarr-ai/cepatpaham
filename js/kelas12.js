/* CepatPaham - Kelas XII Matematika Umum: XII-1 Transformasi Fungsi, XII-2 Busur dan Juring Lingkaran, XII-3 Kombinatorik */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, H } = CP;
  const MIN = CP.MIN, F = CP.angka;
  const { rend } = CP.alj;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const pf = (p) => (p.d === 1 ? mn(p.n) : mn(p.n) + '/' + p.d);
  const opsiTeks = (t, k) => ({ t, k: k || t, v: t });
  const DER = '°', Q2 = '²';
  const fq = (a, b, c) => rend({ 'x²': a, x: b, '': c });

  /* ---------- gambar fungsi ---------- */
  function gbrFungsi(seri, x1, x2, o) {
    o = o || {};
    const X0 = 30, X1 = 306, Y0 = 14, Y1 = 132, n = 56, titik = o.titik || [];
    const nilai = seri.map((s) => { const a = []; for (let i = 0; i <= n; i++) a.push(s.f(x1 + ((x2 - x1) * i) / n)); return a; });
    const semua = [0, ...titik.map((p) => p.y)]; nilai.forEach((a) => a.forEach((v) => semua.push(v)));
    let lo = Math.min(...semua), hi = Math.max(...semua); if (hi - lo < 2) { hi += 1; lo -= 1; } const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    const mx = (x) => X0 + ((x - x1) / (x2 - x1)) * (X1 - X0), my = (y) => Y1 - ((y - lo) / (hi - lo)) * (Y1 - Y0);
    const el = [];
    if (x1 <= 0 && x2 >= 0) el.push(H.l(mx(0), Y0, mx(0), Y1, 'tipis'));
    el.push(H.l(X0, my(0), X1, my(0), 'tipis'));
    const lx = Math.max(1, Math.ceil((x2 - x1) / 8)); for (let x = Math.ceil(x1); x <= x2; x += lx) if (x !== 0) el.push(H.t(mx(x), Math.min(Y1 + 8, my(0) + 12), x, 'middle', 'kecil'));
    seri.forEach((s, k) => el.push(H.d('M' + nilai[k].map((v, i) => mx(x1 + ((x2 - x1) * i) / n).toFixed(1) + ' ' + my(v).toFixed(1)).join(' L'), s.c || 'garis')));
    titik.forEach((p) => { el.push(H.o(mx(p.x), my(p.y), 4, 'titik')); if (p.t) { const kanan = mx(p.x) > 235, atas = my(p.y) < Y0 + 16; el.push(H.t(mx(p.x) + (kanan ? -8 : (p.dx === undefined ? 8 : p.dx)), my(p.y) + (atas ? 16 : (p.dy === undefined ? -7 : p.dy)), p.t, kanan ? 'end' : (p.a || 'start'), 'tebal')); } });
    (o.label || []).forEach((l) => el.push(H.t(l.x, l.y, l.t, l.a || 'start', 'kecil')));
    return { tipe: 'gambar', alt: o.alt || 'Grafik fungsi', tinggi: 152, el };
  }
  function gbrJuring(r, th, lr, lth, o) {
    o = o || {};
    const cx = 110, cy = 84, R = 56, a1 = (th * Math.PI) / 180, px = (a) => cx + R * Math.cos(a), py = (a) => cy - R * Math.sin(a);
    const el = [H.d('M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 1 0 ' + (cx + R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 1 0 ' + (cx - R) + ' ' + cy, 'kosong'),
      H.d('M' + cx + ' ' + cy + ' L' + px(0).toFixed(1) + ' ' + py(0).toFixed(1) + ' A' + R + ' ' + R + ' 0 ' + (th > 180 ? 1 : 0) + ' 0 ' + px(a1).toFixed(1) + ' ' + py(a1).toFixed(1) + ' Z', o.tembereng ? 'isi' : 'isi2')];
    if (o.tembereng) el.push(H.p([[cx, cy], [px(0), py(0)], [px(a1), py(a1)]], 'kosong'));
    el.push(H.o(cx, cy, 3, 'titik'), H.t(cx + R * 0.5, cy + 16, lr, 'middle', 'tebal'), H.t(cx + 30 * Math.cos(a1 / 2) + 6, cy - 30 * Math.sin(a1 / 2) + 4, lth, 'start', 'tebal'));
    if (o.busur) el.push(H.t(px(a1 / 2) + 10 * Math.cos(a1 / 2) + 6, py(a1 / 2) - 8 * Math.sin(a1 / 2), o.busur, 'start', 'tebal'));
    return { tipe: 'gambar', alt: 'Lingkaran dengan juring bersudut pusat ' + lth, tinggi: 158, el };
  }

  /* ========================= XII-1 TRANSFORMASI FUNGSI ========================= */
  const tt = (x, y) => '(' + mn(x) + ', ' + mn(y) + ')';
  const bentukGeser = (a, b) => 'y = (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ')' + Q2 + ' ' + (b < 0 ? MIN : '+') + ' ' + Math.abs(b);

  CP.aktifkan('XII-1', {
    level: [
      lv('Translasi grafik fungsi', 'y = f(x − a) + b menggeser a ke kanan, b ke atas', 'angka',
        (r, c) => ({ px: nz(r, -5, 6), py: nz(r, -6, 8), a: nz(r, -5, 6), b: nz(r, -5, 6), tanya: pilihJenis(r, c, ['absis', 'ordinat']) }),
        ({ px, py, a, b, tanya }) => {
          const qx = px + a, qy = py + b;
          return S.angka('Titik ' + tt(px, py) + ' terletak pada grafik y = f(x). Grafik digeser ' + Math.abs(a) + ' satuan ke ' + (a >= 0 ? 'kanan' : 'kiri') + ' dan ' + Math.abs(b) + ' satuan ke ' + (b >= 0 ? 'atas' : 'bawah') + '. Berapa ' + (tanya === 'absis' ? 'absis' : 'ordinat') + ' titik bayangannya?', tanya === 'absis' ? qx : qy, { jenis: tanya, izin: { minus: true }, gambar: CP.gbrBidang({ pts: [{ x: px, y: py, t: 'A' }, { x: qx, y: qy, t: "A'" }], seg: [{ x1: px, y1: py, x2: qx, y2: qy, c: 'merah' }], alt: 'Titik pada grafik dan bayangannya setelah translasi' }), langkah: [
            st('Menggeser ke kanan menambah absis; ke atas menambah ordinat. Pergeseran: (' + mn(a) + ', ' + mn(b) + ').'),
            st(tanya === 'absis' ? 'Absis baru = ' + mn(px) + ' + (' + mn(a) + ') = ' + mn(qx) + '.' : 'Ordinat baru = ' + mn(py) + ' + (' + mn(b) + ') = ' + mn(qy) + '.', tanya === 'absis' ? px + a : py + b)] });
        }),
      lv('Rumus hasil translasi', 'y = x² digeser (a, b)', 'pilihan',
        (r) => ({ a: nz(r, -5, 5), b: nz(r, -6, 6), sd: r.bulat(1, 99999) }),
        ({ a, b, sd }) => {
          const benar = opsiTeks(bentukGeser(a, b));
          const salah = [opsiTeks(bentukGeser(-a, b)), opsiTeks(bentukGeser(a, -b)), opsiTeks(bentukGeser(b, a)), opsiTeks(bentukGeser(-a, -b)), opsiTeks('y = x' + Q2 + ' ' + (a + b < 0 ? MIN : '+') + ' ' + Math.abs(a + b))];
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          const g = gbrFungsi([{ f: (x) => x * x }, { f: (x) => (x - a) * (x - a) + b, c: 'merah' }], Math.min(-3, a - 3), Math.max(3, a + 3), { titik: [{ x: 0, y: 0, t: '', dy: 0 }, { x: a, y: b, t: '', dy: 0 }], alt: 'Parabola y = x kuadrat dan hasil pergeserannya' });
          return S.pilihan('Grafik y = x' + Q2 + ' digeser ' + Math.abs(a) + ' satuan ke ' + (a >= 0 ? 'kanan' : 'kiri') + ' dan ' + Math.abs(b) + ' satuan ke ' + (b >= 0 ? 'atas' : 'bawah') + '. Persamaan grafik hasil adalah …', h, { jenis: 'rumusGeser', gambar: g, langkah: [
            st('Geser ke kanan a: ganti x dengan (x − a). Geser ke atas b: tambahkan b di luar.'),
            st('x → (x − (' + mn(a) + ')), lalu + (' + mn(b) + '): ' + benar.t + '.', benar.t)] });
        }),
      lv('Refleksi grafik fungsi', 'y = −f(x) (sumbu x) dan y = f(−x) (sumbu y)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['sumbu x', 'sumbu y']), a: nz(r, -3, 3), b: r.bulat(-5, 5), cc: r.bulat(-6, 6), x0: nz(r, -4, 4) }),
        ({ jenis, a, b, cc, x0 }) => {
          const f = (x) => a * x * x + b * x + cc, g = jenis === 'sumbu x' ? (x) => -f(x) : (x) => f(-x), v = g(x0);
          return S.angka('Diketahui f(x) = ' + fq(a, b, cc) + '. Grafik y = f(x) dicerminkan terhadap ' + jenis + ' menjadi y = g(x). Berapa nilai g(' + mn(x0) + ')?', v, { jenis, izin: { minus: true }, gambar: gbrFungsi([{ f }, { f: g, c: 'merah' }], -4, 4, { titik: [{ x: x0, y: v, t: 'g(' + mn(x0) + ')', dy: -8 }], alt: 'Grafik f dan hasil refleksinya' }), langkah: [
            st(jenis === 'sumbu x' ? 'Refleksi terhadap sumbu x: g(x) = −f(x).' : 'Refleksi terhadap sumbu y: g(x) = f(−x).'),
            st(jenis === 'sumbu x' ? 'f(' + mn(x0) + ') = ' + mn(f(x0)) + ', maka g(' + mn(x0) + ') = ' + mn(-f(x0)) + '.' : 'g(' + mn(x0) + ') = f(' + mn(-x0) + ') = ' + mn(a) + ' × ' + (x0 * x0) + ' + (' + mn(b) + ')(' + mn(-x0) + ') + (' + mn(cc) + ') = ' + mn(f(-x0)) + '.', jenis === 'sumbu x' ? -(a * x0 * x0 + b * x0 + cc) : a * x0 * x0 + b * -x0 + cc)] });
        }),
      lv('Dilatasi grafik fungsi', 'y = k·f(x) dan y = f(x/k)', 'angka',
        (r, c) => { const k = r.bulat(2, 3); return { jenis: pilihJenis(r, c, ['vertikal', 'horizontal']), k, m: nz(r, -3, 4), n: r.bulat(-5, 6), x0: k * nz(r, -3, 4) }; },
        ({ jenis, k, m, n, x0 }) => {
          const f = (x) => m * x * x + n, g = jenis === 'vertikal' ? (x) => k * f(x) : (x) => f(x / k);
          const xe = jenis === 'vertikal' ? x0 / k : x0, v = g(xe);
          const s = S.angka('Diketahui f(x) = ' + rend({ 'x²': m, '': n }) + '. Grafik y = f(x) didilatasi ' + (jenis === 'vertikal' ? 'secara vertikal (searah sumbu y)' : 'secara horizontal (searah sumbu x)') + ' dengan faktor ' + k + ', menghasilkan ' + (jenis === 'vertikal' ? 'g(x) = ' + k + '·f(x)' : 'g(x) = f(x/' + k + ')') + '. Berapa nilai g(' + mn(xe) + ')?', v, { jenis, izin: { minus: true }, gambar: gbrFungsi([{ f }, { f: g, c: 'merah' }], Math.min(-6, xe - 2), Math.max(6, xe + 2), { titik: [{ x: xe, y: v, t: 'g(' + mn(xe) + ')', dy: -8 }], alt: 'Grafik f dan hasil dilatasinya' }), langkah: jenis === 'vertikal' ? [
            st('Dilatasi vertikal faktor ' + k + ': g(x) = ' + k + ' × f(x).'), st('f(' + mn(xe) + ') = ' + mn(f(xe)) + ', maka g = ' + k + ' × ' + mn(f(xe)) + ' = ' + mn(v) + '.', k * (m * xe * xe + n))] : [
            st('Dilatasi horizontal faktor ' + k + ': g(x) = f(x/' + k + ').'), st('g(' + mn(xe) + ') = f(' + mn(xe) + '/' + k + ') = f(' + mn(xe / k) + ') = ' + mn(v) + '.', m * (xe / k) * (xe / k) + n)] });
          s.dibagi = [{ a: x0, b: k }]; return s;
        }),
      lv('Komposisi transformasi grafik', 'y = A(x − h)² + K', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['nilai', 'puncak']), A: nz(r, -3, 3), h: nz(r, -4, 5), K: nz(r, -6, 7), x0: r.bulat(-3, 6) }),
        ({ jenis, A, h, K, x0 }) => {
          const g = (x) => A * (x - h) * (x - h) + K;
          const g1 = gbrFungsi([{ f: (x) => x * x }, { f: g, c: 'merah' }], Math.min(-3, h - 3), Math.max(3, h + 3), { titik: [{ x: h, y: K, t: '', dy: 0 }], alt: 'Parabola dasar dan hasil transformasi' });
          const desc = 'Grafik y = x' + Q2 + ' ditranslasi ' + Math.abs(h) + ' satuan ke ' + (h >= 0 ? 'kanan' : 'kiri') + ', didilatasi vertikal dengan faktor ' + mn(A) + ' (negatif berarti dicerminkan terhadap sumbu x), lalu digeser ' + Math.abs(K) + ' satuan ke ' + (K >= 0 ? 'atas' : 'bawah') + '. ';
          if (jenis === 'nilai') return S.angka(desc + 'Berapa nilai fungsi hasil di x = ' + mn(x0) + '?', g(x0), { jenis, izin: { minus: true }, gambar: g1, langkah: [st('Fungsi hasil: y = ' + mn(A) + '(x − (' + mn(h) + '))' + Q2 + ' + (' + mn(K) + ').'), st('x = ' + mn(x0) + ': ' + mn(A) + ' × (' + mn(x0 - h) + ')' + Q2 + ' + (' + mn(K) + ') = ' + mn(g(x0)) + '.', A * (x0 - h) * (x0 - h) + K)] });
          return S.angka(desc + 'Berapa jumlah absis dan ordinat titik puncak grafik hasil?', h + K, { jenis, izin: { minus: true }, gambar: g1, langkah: [st('Titik puncak y = x² di (0, 0). Setelah translasi dan penggeseran puncaknya pindah ke (h, K) = (' + mn(h) + ', ' + mn(K) + '). Dilatasi vertikal di sekitar sumbu x tidak mengubah absis puncak.'), st('Jumlah = ' + mn(h) + ' + (' + mn(K) + ') = ' + mn(h + K) + '.', h + K)] });
        }),
      lv('Soal cerita: transformasi fungsi', 'Biaya, lintasan, skala', 'angka',
        (r, c) => ({ m: r.bulat(2, 6), n: r.bulat(3, 15), a: r.bulat(2, 9), b: r.bulat(1, 4), k: r.bulat(2, 3), x0: r.bulat(5, 12), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx), f = (x) => p.m * x + p.n, g = (x) => p.k * f(x - p.b) + p.a, val = g(p.x0);
          const teks = v === 'umum' ? 'Biaya sewa sebuah alat (ribu rupiah) untuk x hari dirumuskan f(x) = ' + rend({ x: p.m, '': p.n }) + '. Karena ada penundaan ' + p.b + ' hari, hitungan dimulai ' + p.b + ' hari lebih lambat (x diganti x − ' + p.b + '). Setelah itu biaya dikali ' + p.k + ' (paket grup) dan ditambah ' + p.a + ' (asuransi). Berapa biaya g(' + p.x0 + ') dalam ribu rupiah?' : 'Biaya produksi (ribu rupiah) untuk x unit dirumuskan f(x) = ' + rend({ x: p.m, '': p.n }) + '. Produksi baru dimulai ' + p.b + ' unit setelah awal (x diganti x − ' + p.b + '), lalu biaya dikali ' + p.k + ' karena pesanan ganda, dan ditambah ' + p.a + ' untuk perawatan mesin. Berapa biaya g(' + p.x0 + ') dalam ribu rupiah?';
          return S.angka(teks, val, { jenis: 'cerita', satuan: 'ribu rupiah', gambar: gbrFungsi([{ f }, { f: g, c: 'merah' }], 0, p.x0 + 2, { titik: [{ x: p.x0, y: val, t: '?', dy: -8 }], alt: 'Grafik biaya awal dan setelah transformasi' }), langkah: [
            st('Fungsi hasil: g(x) = ' + p.k + ' × f(x − ' + p.b + ') + ' + p.a + '.'),
            st('f(' + p.x0 + ' − ' + p.b + ') = f(' + (p.x0 - p.b) + ') = ' + p.m + ' × ' + (p.x0 - p.b) + ' + ' + p.n + ' = ' + f(p.x0 - p.b) + '.'),
            st('g(' + p.x0 + ') = ' + p.k + ' × ' + f(p.x0 - p.b) + ' + ' + p.a + ' = ' + val + '.', p.k * (p.m * (p.x0 - p.b) + p.n) + p.a)] });
        })
    ]
  });

  /* ========================= XII-2 BUSUR DAN JURING LINGKARAN ========================= */
  const SUDUT = [30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330];
  const PIT = 'π = 22/7';
  const bulat = (p) => p.d === 1;
  function acakJur(r, c, perlu) {
    for (let t = 0; t < 400; t++) {
      const th = r.pilih(SUDUT), k = r.bulat(1, 4), rr = 7 * k;
      const busur = CP.pKali(P(th, 360), P(44 * k, 1)), juring = CP.pKali(P(th, 360), P(22 * 7 * k * k, 1));
      if ((perlu === 'busur' && bulat(busur)) || (perlu === 'juring' && bulat(juring)) || (perlu === 'dua' && bulat(busur) && bulat(juring))) return { th, k, rr };
    }
    return { th: 90, k: 2, rr: 14 };
  }
  const busurP = (th, k) => CP.pKali(P(th, 360), P(44 * k, 1)), juringP = (th, k) => CP.pKali(P(th, 360), P(22 * 7 * k * k, 1));

  CP.aktifkan('XII-2', {
    level: [
      lv('Panjang busur', 'Busur = θ/360 × 2πr', 'angka',
        (r) => acakJur(r, {}, 'busur'),
        ({ th, k, rr }) => {
          const bs = busurP(th, k);
          return S.angka('Sebuah juring lingkaran berjari-jari ' + rr + ' cm dengan sudut pusat ' + th + DER + '. Berapa panjang busurnya? Gunakan ' + PIT + '.', bs, { jenis: 'busur', satuan: 'cm', gambar: gbrJuring(rr, th, 'r = ' + rr, th + DER, { busur: '?' }), langkah: [
            st('Keliling lingkaran = 2πr = 2 × 22/7 × ' + rr + ' = ' + 44 * k + ' cm.'),
            st('Busur = ' + th + '/360 × ' + 44 * k + ' = ' + pf(bs) + ' cm.', (th / 360) * (2 * 22 * rr / 7))] });
        }),
      lv('Luas juring', 'Juring = θ/360 × πr²', 'angka',
        (r) => acakJur(r, {}, 'juring'),
        ({ th, k, rr }) => {
          const L = juringP(th, k);
          return S.angka('Sebuah juring lingkaran berjari-jari ' + rr + ' cm dengan sudut pusat ' + th + DER + '. Berapa luas juringnya? Gunakan ' + PIT + '.', L, { jenis: 'juring', satuan: 'cm' + Q2, gambar: gbrJuring(rr, th, 'r = ' + rr, th + DER), langkah: [
            st('Luas lingkaran = πr² = 22/7 × ' + rr + '² = ' + 154 * k * k + ' cm².'),
            st('Juring = ' + th + '/360 × ' + 154 * k * k + ' = ' + pf(L) + ' cm².', (th / 360) * ((22 * rr * rr) / 7))] });
        }),
      lv('Mencari sudut pusat', 'Dari panjang busur atau luas juring', 'angka',
        (r, c) => { const o = acakJur(r, c, 'dua'); return Object.assign(o, { jenis: pilihJenis(r, c, ['dariBusur', 'dariJuring']) }); },
        ({ jenis, th, k, rr }) => {
          const bs = busurP(th, k), L = juringP(th, k);
          if (jenis === 'dariBusur') return S.angka('Sebuah juring berjari-jari ' + rr + ' cm memiliki panjang busur ' + pf(bs) + ' cm. Berapa sudut pusatnya? Gunakan ' + PIT + '.', th, { jenis, satuan: DER, gambar: gbrJuring(rr, th, 'r = ' + rr, '?', { busur: pf(bs) }), langkah: [st('Keliling lingkaran = ' + 44 * k + ' cm. Sudut = busur ÷ keliling × 360°.'), st(pf(bs) + ' ÷ ' + 44 * k + ' × 360° = ' + th + '°.', (bs.n / bs.d / (44 * k)) * 360)] });
          return S.angka('Sebuah juring berjari-jari ' + rr + ' cm memiliki luas ' + pf(L) + ' cm². Berapa sudut pusatnya? Gunakan ' + PIT + '.', th, { jenis, satuan: DER, gambar: gbrJuring(rr, th, 'r = ' + rr, '?'), langkah: [st('Luas lingkaran = ' + 154 * k * k + ' cm². Sudut = luas juring ÷ luas lingkaran × 360°.'), st(pf(L) + ' ÷ ' + 154 * k * k + ' × 360° = ' + th + '°.', (L.n / L.d / (154 * k * k)) * 360)] });
        }),
      lv('Sudut pusat dan sudut keliling', 'Sudut keliling = ½ sudut pusat', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['keliling', 'pusat', 'banding']), a: r.bulat(2, 17) * 5, t1: r.pilih([30, 45, 60]), t2: r.pilih([90, 120, 135]), b1: r.bulat(1, 6) }),
        (p) => {
          if (p.jenis === 'keliling') return S.angka('Pada sebuah lingkaran, sudut pusat AOB = ' + 2 * p.a + DER + '. Berapa besar sudut keliling ACB yang menghadap busur AB yang sama?', p.a, { jenis: 'keliling', satuan: DER, gambar: gbrJuring(7, 2 * p.a, '', 2 * p.a + DER), langkah: [st('Sudut keliling = ½ × sudut pusat yang menghadap busur sama.'), st('½ × ' + 2 * p.a + '° = ' + p.a + '°.', (2 * p.a) / 2)] });
          if (p.jenis === 'pusat') return S.angka('Pada sebuah lingkaran, sudut keliling ACB = ' + p.a + DER + '. Berapa besar sudut pusat AOB yang menghadap busur AB yang sama?', 2 * p.a, { jenis: 'pusat', satuan: DER, gambar: gbrJuring(7, Math.min(2 * p.a, 350), '', '?'), langkah: [st('Sudut pusat = 2 × sudut keliling.'), st('2 × ' + p.a + '° = ' + 2 * p.a + '°.', 2 * p.a)] });
          const ab = p.b1 * p.t1 / 15, ans = (ab * p.t2) / p.t1;
          const s = S.angka('Pada sebuah lingkaran, sudut pusat ' + p.t1 + DER + ' menghadap busur sepanjang ' + ab + ' cm. Berapa panjang busur yang dihadapi sudut pusat ' + p.t2 + DER + '?', ans, { jenis: 'banding', satuan: 'cm', gambar: gbrJuring(7, p.t2, '', p.t2 + DER, { busur: '?' }), langkah: [st('Panjang busur sebanding dengan sudut pusatnya: busur₂ = busur₁ × θ₂ ÷ θ₁.'), st(ab + ' × ' + p.t2 + ' ÷ ' + p.t1 + ' = ' + ans + ' cm.', (ab * p.t2) / p.t1)] });
          s.dibagi = [{ a: ab * p.t2, b: p.t1 }]; return s;
        }),
      lv('Keliling juring dan luas tembereng', 'Keliling juring = 2r + busur', 'angka',
        (r, c) => { const o = acakJur(r, c, 'busur'); return Object.assign(o, { jenis: pilihJenis(r, c, ['kelilingJuring', 'tembereng']), m: r.bulat(1, 4) }); },
        ({ jenis, th, k, rr, m }) => {
          if (jenis === 'kelilingJuring') { const bs = busurP(th, k), K = CP.pTambah(bs, P(2 * rr, 1)); return S.angka('Sebuah juring berjari-jari ' + rr + ' cm dan sudut pusat ' + th + DER + '. Berapa keliling juring (dua jari-jari ditambah busur)? Gunakan ' + PIT + '.', K, { jenis, satuan: 'cm', gambar: gbrJuring(rr, th, 'r = ' + rr, th + DER, { busur: '?' }), langkah: [st('Busur = ' + th + '/360 × ' + 44 * k + ' = ' + pf(bs) + ' cm.'), st('Keliling = 2 × ' + rr + ' + ' + pf(bs) + ' = ' + pf(K) + ' cm.', (th / 360) * ((2 * 22 * rr) / 7) + 2 * rr)] }); }
          const r2 = 14 * m, juring = 154 * m * m, segitiga = 98 * m * m;
          return S.angka('Sebuah juring berjari-jari ' + r2 + ' cm memiliki sudut pusat 90°. Tembereng adalah daerah juring di luar segitiga yang dibentuk dua jari-jari dan tali busur. Berapa luas tembereng? Gunakan ' + PIT + '.', juring - segitiga, { jenis: 'tembereng', satuan: 'cm' + Q2, gambar: gbrJuring(r2, 90, 'r = ' + r2, '90°', { tembereng: true }), langkah: [st('Luas juring 90° = ¼ × 22/7 × ' + r2 + '² = ' + juring + ' cm².'), st('Luas segitiga siku-siku = ½ × ' + r2 + ' × ' + r2 + ' = ' + segitiga + ' cm². Tembereng = ' + juring + ' − ' + segitiga + ' = ' + (juring - segitiga) + ' cm².', ((22 * r2 * r2) / 7) / 4 - (r2 * r2) / 2)] });
        }),
      lv('Soal cerita busur dan juring', 'Jarum jam, wiper, lampu sorot, pizza', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jarum', 'sapuan', 'pizza']), mnt: r.pilih([15, 20, 30, 45]), k: r.pilih([2, 3]), th: r.pilih([90, 180, 270, 120, 60]), kk: r.bulat(1, 3), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'jarum') {
            const rr = 7 * p.k, th = p.mnt * 6, bs = busurP(th, p.k); if (!bulat(bs)) { p.k = 3; }
            const k = bulat(busurP(th, p.k)) ? p.k : 6, r2 = 7 * k, b2 = busurP(th, k);
            return S.angka(v === 'umum' ? 'Jarum menit sebuah jam dinding sepanjang ' + r2 + ' cm. Berapa panjang lintasan ujung jarum dalam ' + p.mnt + ' menit? Gunakan ' + PIT + '.' : 'Sebuah lengan robot sepanjang ' + r2 + ' cm berputar dengan kecepatan sudut tetap: 6° setiap detik. Berapa panjang lintasan ujung lengan dalam ' + p.mnt + ' detik? Gunakan ' + PIT + '.', b2, { jenis: 'jarum', satuan: 'cm', gambar: gbrJuring(r2, th, 'r = ' + r2, th + DER, { busur: '?' }), langkah: [st('Dalam ' + p.mnt + ' (menit atau detik) sudut yang disapu = ' + p.mnt + ' × 6° = ' + th + '°.'), st('Busur = ' + th + '/360 × 2 × 22/7 × ' + r2 + ' = ' + pf(b2) + ' cm.', (th / 360) * ((2 * 22 * r2) / 7))] });
          }
          if (p.jenis === 'sapuan') {
            const th = [90, 180, 270][p.kk - 1], k = th === 180 ? 2 : 2, r2 = 7 * k, L = juringP(th, k);
            return S.angka(v === 'umum' ? 'Sebuah wiper kaca mobil sepanjang ' + r2 + ' cm menyapu sudut ' + th + DER + '. Berapa luas kaca yang tersapu? Gunakan ' + PIT + '.' : 'Sebuah sprinkler di gudang pembibitan menyiram sejauh ' + r2 + ' m dengan sudut putar ' + th + DER + '. Berapa luas area yang tersiram? Gunakan ' + PIT + '.', L, { jenis: 'sapuan', satuan: v === 'umum' ? 'cm' + Q2 : 'm' + Q2, gambar: gbrJuring(r2, th, 'r = ' + r2, th + DER), langkah: [st('Daerah sapuan adalah juring dengan jari-jari ' + r2 + ' dan sudut ' + th + '°.'), st('Luas = ' + th + '/360 × 22/7 × ' + r2 + '² = ' + pf(L) + '.', (th / 360) * ((22 * r2 * r2) / 7))] });
          }
          const th = 120 + 0 * p.kk, k = 3, r2 = 21, L = juringP(th, k), bagi = 360 / th;
          return S.angka(v === 'umum' ? 'Sebuah pizza berbentuk lingkaran berjari-jari ' + r2 + ' cm dipotong menjadi ' + bagi + ' bagian sama besar. Berapa luas satu potong? Gunakan ' + PIT + '.' : 'Sebuah lembar kain berbentuk lingkaran berjari-jari ' + r2 + ' cm dipotong menjadi ' + bagi + ' juring sama besar untuk membuat penutup. Berapa luas satu juring? Gunakan ' + PIT + '.', L, { jenis: 'pizza', satuan: 'cm' + Q2, gambar: gbrJuring(r2, th, 'r = ' + r2, th + DER), langkah: [st('Sudut tiap potong = 360° ÷ ' + bagi + ' = ' + th + '°.'), st('Luas potong = ' + th + '/360 × 22/7 × ' + r2 + '² = ' + pf(L) + ' cm².', (th / 360) * ((22 * r2 * r2) / 7))] });
        })
    ]
  });

  /* ========================= XII-3 KOMBINATORIK ========================= */
  const fakt = (n) => { let x = 1; for (let i = 2; i <= n; i++) x *= i; return x; };
  const perm = (n, r) => fakt(n) / fakt(n - r), komb = (n, r) => fakt(n) / (fakt(r) * fakt(n - r));
  const katak = [['KATAK', [2, 2, 1]], ['BANANA', [3, 2, 1]], ['MALAM', [2, 2, 1]], ['KAKAK', [3, 2]], ['APAKAH', [3, 1, 1, 1]], ['SALAMAT', [3, 1, 1, 1, 1]], ['MATEMATIKA', [3, 2, 2, 1, 1, 1]]];

  CP.aktifkan('XII-3', {
    level: [
      lv('Aturan pengisian tempat', 'Kalikan banyak pilihan tiap tempat', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['berbeda', 'sama', 'genap', 'menu']), m: r.bulat(5, 9), k: r.bulat(3, 4), a: r.bulat(2, 5), b: r.bulat(2, 5), cc: r.bulat(2, 4) }),
        (p, ctx) => {
          const v = kons(ctx), obj = v === 'umum' ? 'bilangan' : 'kode produk';
          if (p.jenis === 'berbeda') { const d = [...Array(p.k)].map((_, i) => p.m - i); return S.angka('Dari angka 1 sampai ' + p.m + ' akan disusun ' + obj + ' ' + p.k + ' angka dengan angka-angka berbeda. Berapa banyak ' + obj + ' yang dapat dibuat?', d.reduce((x, y) => x * y, 1), { jenis: 'berbeda', langkah: [st('Tempat pertama ' + d[0] + ' pilihan, kedua ' + d[1] + ', dst. (tidak boleh berulang).'), st(d.join(' × ') + ' = ' + d.reduce((x, y) => x * y, 1) + '.', d.reduce((x, y) => x * y, 1))] }); }
          if (p.jenis === 'sama') return S.angka('Dari angka 1 sampai ' + p.m + ' akan disusun ' + obj + ' ' + p.k + ' angka, angka boleh berulang. Berapa banyak ' + obj + ' yang dapat dibuat?', Math.pow(p.m, p.k), { jenis: 'sama', langkah: [st('Setiap tempat memiliki ' + p.m + ' pilihan.'), st(Array(p.k).fill(p.m).join(' × ') + ' = ' + Math.pow(p.m, p.k) + '.', Math.pow(p.m, p.k))] });
          if (p.jenis === 'genap') { const e = Math.floor(p.m / 2), sisa = [p.m - 1, p.m - 2]; const tot = e * sisa[0] * sisa[1]; return S.angka('Dari angka 1 sampai ' + p.m + ' akan disusun bilangan genap 3 angka dengan angka berbeda. Berapa banyak bilangan yang dapat dibuat?', tot, { jenis: 'genap', langkah: [st('Tempat satuan harus genap: ' + e + ' pilihan (angka genap dari 1 sampai ' + p.m + ').'), st('Ratusan: ' + sisa[0] + ' pilihan, puluhan: ' + sisa[1] + ' pilihan. Total = ' + e + ' × ' + sisa[0] + ' × ' + sisa[1] + ' = ' + tot + '.', e * sisa[0] * sisa[1])] }); }
          const tot = p.a * p.b * p.cc;
          return S.angka(v === 'umum' ? 'Sebuah restoran menyediakan ' + p.a + ' makanan utama, ' + p.b + ' minuman, dan ' + p.cc + ' pencuci mulut. Berapa banyak paket yang terdiri atas satu makanan, satu minuman, dan satu pencuci mulut?' : 'Sebuah toko menawarkan ' + p.a + ' model produk, ' + p.b + ' warna, dan ' + p.cc + ' ukuran. Berapa banyak varian produk yang berbeda?', tot, { jenis: 'menu', langkah: [st('Aturan perkalian: ' + p.a + ' × ' + p.b + ' × ' + p.cc + '.'), st('Hasilnya ' + tot + '.', tot)] });
        }),
      lv('Faktorial dan permutasi', 'P(n, r) = n! / (n − r)!', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['faktorial', 'permutasi', 'susunan']), n: r.bulat(6, 12), r: r.bulat(2, 4), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'faktorial') { const n = p.n, m = n - p.r; return S.angka('Hitunglah ' + n + '! ÷ ' + m + '!.', perm(n, p.r), { jenis: 'faktorial', langkah: [st(n + '! ÷ ' + m + '! = ' + [...Array(p.r)].map((_, i) => n - i).join(' × ') + ' (suku yang sama dicoret).'), st('Hasilnya ' + perm(n, p.r) + '.', perm(n, p.r))] }); }
          if (p.jenis === 'permutasi') return S.angka('Hitunglah nilai P(' + p.n + ', ' + p.r + ') (permutasi ' + p.r + ' unsur dari ' + p.n + ' unsur).', perm(p.n, p.r), { jenis: 'permutasi', langkah: [st('P(n, r) = n! ÷ (n − r)!.'), st('P(' + p.n + ', ' + p.r + ') = ' + [...Array(p.r)].map((_, i) => p.n - i).join(' × ') + ' = ' + perm(p.n, p.r) + '.', perm(p.n, p.r))] });
          return S.angka(v === 'umum' ? 'Dari ' + p.n + ' siswa akan dipilih ketua, wakil, dan bendahara' + (p.r === 2 ? '' : '') + ' (jabatan berbeda, satu orang satu jabatan). Berapa banyak susunan pengurus yang mungkin?' : 'Dari ' + p.n + ' karyawan akan dipilih kepala shift, wakil, dan pengawas mutu (jabatan berbeda). Berapa banyak susunan yang mungkin?', perm(p.n, 3), { jenis: 'susunan', langkah: [st('Urutan berpengaruh, jadi permutasi: P(' + p.n + ', 3).'), st(p.n + ' × ' + (p.n - 1) + ' × ' + (p.n - 2) + ' = ' + perm(p.n, 3) + '.', perm(p.n, 3))] });
        }),
      lv('Kombinasi', 'C(n, r) = n! / (r!(n − r)!)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['nilai', 'cerita']), n: r.bulat(6, 12), r: r.bulat(2, 4), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx), h = komb(p.n, p.r);
          if (p.jenis === 'nilai') return S.angka('Hitunglah nilai C(' + p.n + ', ' + p.r + ').', h, { jenis: 'nilai', langkah: [st('C(n, r) = n! ÷ (r! × (n − r)!).'), st('C(' + p.n + ', ' + p.r + ') = ' + [...Array(p.r)].map((_, i) => p.n - i).join(' × ') + ' ÷ ' + fakt(p.r) + ' = ' + h + '.', h)] });
          return S.angka(v === 'umum' ? 'Dari ' + p.n + ' siswa akan dipilih ' + p.r + ' orang untuk mewakili sekolah dalam lomba (urutan tidak penting). Berapa banyak cara memilihnya?' : 'Dari ' + p.n + ' produk baru akan dipilih ' + p.r + ' produk untuk dipamerkan (urutan tidak penting). Berapa banyak cara memilihnya?', h, { jenis: 'cerita', langkah: [st('Urutan tidak penting, jadi kombinasi C(' + p.n + ', ' + p.r + ').'), st([...Array(p.r)].map((_, i) => p.n - i).join(' × ') + ' ÷ ' + fakt(p.r) + ' = ' + h + '.', h)] });
        }),
      lv('Permutasi unsur sama dan siklis', 'n! / (n1! n2! …); permutasi siklis (n − 1)!', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['unsurSama', 'siklis']), w: r.bulat(0, katak.length - 1), n: r.bulat(4, 8) }),
        (p) => {
          if (p.jenis === 'siklis') return S.angka('Sebanyak ' + p.n + ' orang duduk mengelilingi sebuah meja bundar. Berapa banyak susunan duduk yang berbeda?', fakt(p.n - 1), { jenis: 'siklis', langkah: [st('Permutasi siklis: (n − 1)! karena satu orang dijadikan patokan.'), st('(' + p.n + ' − 1)! = ' + (p.n - 1) + '! = ' + fakt(p.n - 1) + '.', fakt(p.n - 1))] });
          const [kata, cnt] = katak[p.w], n = cnt.reduce((a, b) => a + b, 0), hasil = fakt(n) / cnt.reduce((a, b) => a * fakt(b), 1);
          return S.angka('Berapa banyak susunan huruf berbeda yang dapat dibentuk dari semua huruf pada kata ' + kata + '?', hasil, { jenis: 'unsurSama', langkah: [st('Banyak huruf n = ' + n + ', dengan huruf berulang sebanyak ' + cnt.filter((x) => x > 1).join(', ') + ' kali.'), st(n + '! ÷ (' + cnt.filter((x) => x > 1).map((x) => x + '!').join(' × ') + ') = ' + hasil + '.', hasil)] });
        }),
      lv('Kombinasi dengan syarat', 'Gabungkan beberapa kelompok', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['kelompok', 'paling sedikit']), a: r.bulat(4, 8), b: r.bulat(3, 7), x: r.bulat(1, 3), y: r.bulat(1, 3), tot: r.bulat(3, 4) }),
        (p, ctx) => {
          const v = kons(ctx), [A, B] = v === 'umum' ? ['putra', 'putri'] : ['teknisi', 'asisten'];
          if (p.jenis === 'kelompok') { const hasil = komb(p.a, p.x) * komb(p.b, p.y); return S.angka('Dari ' + p.a + ' ' + A + ' dan ' + p.b + ' ' + B + ' akan dibentuk tim yang terdiri atas ' + p.x + ' ' + A + ' dan ' + p.y + ' ' + B + '. Berapa banyak tim yang dapat dibentuk?', hasil, { jenis: 'kelompok', langkah: [st('Pilih ' + A + ': C(' + p.a + ', ' + p.x + ') = ' + komb(p.a, p.x) + '. Pilih ' + B + ': C(' + p.b + ', ' + p.y + ') = ' + komb(p.b, p.y) + '.'), st('Kalikan: ' + komb(p.a, p.x) + ' × ' + komb(p.b, p.y) + ' = ' + hasil + '.', komb(p.a, p.x) * komb(p.b, p.y))] }); }
          const n = p.a + p.b, hasil = komb(n, p.tot) - komb(p.b, p.tot);
          return S.angka('Dari ' + p.a + ' ' + A + ' dan ' + p.b + ' ' + B + ' akan dipilih ' + p.tot + ' orang. Berapa banyak cara memilih jika paling sedikit satu di antaranya ' + A + '?', hasil, { jenis: 'paling sedikit', langkah: [st('Semua cara: C(' + n + ', ' + p.tot + ') = ' + komb(n, p.tot) + '. Tanpa satu pun ' + A + ' (semua ' + B + '): C(' + p.b + ', ' + p.tot + ') = ' + komb(p.b, p.tot) + '.'), st('Paling sedikit satu ' + A + ' = ' + komb(n, p.tot) + ' − ' + komb(p.b, p.tot) + ' = ' + hasil + '.', komb(n, p.tot) - komb(p.b, p.tot))] });
        }),
      lv('Peluang dengan kombinatorik', 'Peluang = cara yang diinginkan / semua cara', 'pecahan',
        (r, c) => ({ a: r.bulat(3, 7), b: r.bulat(3, 7), x: r.bulat(1, 2), y: r.bulat(1, 2), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx), n = p.a + p.b, rr = p.x + p.y, baik = komb(p.a, p.x) * komb(p.b, p.y), semua = komb(n, rr), ans = P(baik, semua);
          const [A, B] = v === 'umum' ? ['bola merah', 'bola biru'] : ['komponen baik', 'komponen cacat'];
          return S.pecahan('Sebuah kotak berisi ' + p.a + ' ' + A + ' dan ' + p.b + ' ' + B + '. Dari kotak diambil ' + rr + ' benda sekaligus secara acak. Tentukan peluang terambil ' + p.x + ' ' + A + ' dan ' + p.y + ' ' + B + '.', ans, { jenis: 'peluangKomb', langkah: [
            st('Semua cara mengambil ' + rr + ' dari ' + n + ': C(' + n + ', ' + rr + ') = ' + semua + '.'),
            st('Cara yang diinginkan: C(' + p.a + ', ' + p.x + ') × C(' + p.b + ', ' + p.y + ') = ' + komb(p.a, p.x) + ' × ' + komb(p.b, p.y) + ' = ' + baik + '.'),
            st('Peluang = ' + baik + '/' + semua + ' = ' + pf(ans) + '.', ans)] });
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
