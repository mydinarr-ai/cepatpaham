/* CepatPaham - Kelas IX: IX-1 SPLDV, IX-2 Bangun Ruang, IX-3 Transformasi Geometri, IX-4 Peluang dan Pengambilan Sampel */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, kpk, H } = CP;
  const F = CP.angka, RP = CP.rp, MIN = CP.MIN;
  const { rend } = CP.alj;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const pf = (p) => (p.d === 1 ? mn(p.n) : mn(p.n) + '/' + p.d);
  const opsiTeks = (t, k) => ({ t, k: k || t, v: t });
  const DER = '°', Q2 = '²', Q3 = '³', PI = 'π';
  const eqS = (a, b, c) => rend({ x: a, y: b }) + ' = ' + mn(c);

  /* ---------- gambar ---------- */
  function gbrDuaGaris(m1, n1, m2, n2, x0, y0, x1, x2) {
    const X0 = 30, X1 = 304, Y0 = 12, Y1 = 134;
    const ys = [m1 * x1 + n1, m1 * x2 + n1, m2 * x1 + n2, m2 * x2 + n2, 0, y0];
    let lo = Math.min(...ys), hi = Math.max(...ys); const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    const mx = (x) => X0 + ((x - x1) / (x2 - x1)) * (X1 - X0), my = (y) => Y1 - ((y - lo) / (hi - lo)) * (Y1 - Y0);
    const el = [];
    if (x1 <= 0 && x2 >= 0) el.push(H.l(mx(0), Y0, mx(0), Y1, 'tipis'));
    el.push(H.l(X0, my(0), X1, my(0), 'tipis'));
    for (let x = Math.ceil(x1); x <= x2; x += Math.max(1, Math.ceil((x2 - x1) / 8))) if (x !== 0) el.push(H.t(mx(x), Math.min(Y1 - 2, my(0) + 12), x, 'middle', 'kecil'));
    el.push(H.l(mx(x1), my(m1 * x1 + n1), mx(x2), my(m1 * x2 + n1), 'garis'), H.l(mx(x1), my(m2 * x1 + n2), mx(x2), my(m2 * x2 + n2), 'merah'), H.o(mx(x0), my(y0), 4, 'titik'));
    el.push(H.t(mx(x2) - 4, my(m1 * x2 + n1) - 6, 'g₁', 'end', 'tebal'), H.t(mx(x2) - 4, my(m2 * x2 + n2) - 6, 'g₂', 'end', 'tebal'));
    return { tipe: 'gambar', alt: 'Grafik dua garis yang berpotongan', tinggi: 150, el };
  }
  function gbrBalok(p, l, t, lp, ll, lt) {
    const s = Math.min(160 / (p + 0.5 * l), 82 / (t + 0.35 * l)), x0 = 36, y0 = 126, w = p * s, h = t * s, dx = l * s * 0.5, dy = l * s * 0.35;
    return { tipe: 'gambar', alt: 'Balok: panjang ' + lp + ', lebar ' + ll + ', tinggi ' + lt, tinggi: 148, el: [
      H.p([[x0, y0 - h], [x0 + w, y0 - h], [x0 + w + dx, y0 - h - dy], [x0 + dx, y0 - h - dy]], 'isi2'), H.p([[x0 + w, y0], [x0 + w + dx, y0 - dy], [x0 + w + dx, y0 - h - dy], [x0 + w, y0 - h]], 'isi3'), H.r(x0, y0 - h, w, h, 'isi'),
      H.t(x0 + w / 2, y0 + 15, lp, 'middle', 'tebal'), H.t(x0 - 6, y0 - h / 2 + 4, lt, 'end', 'tebal'), H.t(x0 + w + dx / 2 + 8, y0 - dy / 2 + 12, ll, 'start', 'tebal')] };
  }
  function gbrTabung(r, t, lr, lt) {
    const s = Math.min(60 / r, 88 / t), rx = r * s, ry = rx * 0.3, h = t * s, cx = 110, y1 = 24 + ry, y2 = y1 + h;
    const elips = (cy) => 'M' + (cx - rx) + ' ' + cy + ' A' + rx + ' ' + ry + ' 0 1 0 ' + (cx + rx) + ' ' + cy + ' A' + rx + ' ' + ry + ' 0 1 0 ' + (cx - rx) + ' ' + cy;
    return { tipe: 'gambar', alt: 'Tabung: jari-jari ' + lr + ', tinggi ' + lt, tinggi: Math.round(y2 + ry + 14), el: [
      H.d('M' + (cx - rx) + ' ' + y1 + ' L' + (cx - rx) + ' ' + y2 + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + y2 + ' L' + (cx + rx) + ' ' + y1 + ' Z', 'isi'), H.d(elips(y1), 'isi2'),
      H.l(cx, y1, cx + rx, y1, 'merah'), H.t(cx + rx / 2, y1 - 6, lr, 'middle', 'tebal'), H.t(cx + rx + 10, (y1 + y2) / 2 + 4, lt, 'start', 'tebal')] };
  }
  function gbrKerucut(r, t, lr, lt, ls) {
    const s = Math.min(60 / r, 90 / t), rx = r * s, ry = rx * 0.3, h = t * s, cx = 110, yb = 24 + h;
    return { tipe: 'gambar', alt: 'Kerucut: jari-jari ' + lr + ', tinggi ' + lt, tinggi: Math.round(yb + ry + 26), el: [
      H.d('M' + cx + ' 20 L' + (cx - rx) + ' ' + yb + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + yb + ' Z', 'isi'), H.l(cx, 20, cx, yb, 'putus'), H.l(cx, yb, cx + rx, yb, 'merah'),
      H.t(cx + rx / 2, yb + ry + 15, lr, 'middle', 'tebal'), H.t(cx - rx / 2 - 8, 20 + h / 2, lt, 'end', 'tebal'), ...(ls ? [H.t(cx + rx / 2 + 8, 20 + h / 2, ls, 'start', 'tebal')] : [])] };
  }
  function gbrBola(lr) {
    const R = 52, cx = 110, cy = 76;
    return { tipe: 'gambar', alt: 'Bola dengan jari-jari ' + lr, tinggi: 150, el: [H.o(cx, cy, R, 'isi'), H.d('M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + (R * 0.3) + ' 0 0 0 ' + (cx + R) + ' ' + cy, 'putus'), H.l(cx, cy, cx + R, cy, 'merah'), H.o(cx, cy, 3, 'titik'), H.t(cx + R / 2, cy - 6, lr, 'middle', 'tebal')] };
  }
  function gbrLimas(sd, t, ls, lt, lh) {
    const sc = Math.min(110 / sd, 84 / t), w = sd * sc, h = t * sc, x0 = 50, y0 = 124, dx = w * 0.55, dy = w * 0.32;
    const A = [x0, y0], B = [x0 + w, y0], C = [x0 + w + dx, y0 - dy], D = [x0 + dx, y0 - dy], T = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2 - h];
    return { tipe: 'gambar', alt: 'Limas persegi dengan sisi alas ' + ls + ' dan tinggi ' + lt, tinggi: 148, el: [H.p([A, B, T], 'isi'), H.p([B, C, T], 'isi3'), H.l(A[0], A[1], D[0], D[1], 'putus'), H.l(D[0], D[1], C[0], C[1], 'putus'), H.l(D[0], D[1], T[0], T[1], 'putus'), H.l(T[0], T[1], T[0], (A[1] + C[1]) / 2, 'merah'),
      H.t((A[0] + B[0]) / 2, y0 + 15, ls, 'middle', 'tebal'), H.t(T[0] + 6, T[1] + h * 0.55, lt, 'start', 'tebal'), ...(lh ? [H.t((A[0] + T[0]) / 2 - 6, (A[1] + T[1]) / 2, lh, 'end', 'tebal')] : [])] };
  }
  function gbrPrisma(a, b, t, la, lb, lt) {
    const sc = Math.min(120 / a, 70 / b, 70 / t), x0 = 40, y0 = 124, w = a * sc, h = b * sc, dx = t * sc * 0.55, dy = t * sc * 0.32;
    const A = [x0, y0], B = [x0 + w, y0], C = [x0 + w, y0 - h];
    return { tipe: 'gambar', alt: 'Prisma segitiga siku-siku', tinggi: 148, el: [H.p([A, C, [C[0] + dx, C[1] - dy], [A[0] + dx, A[1] - dy]], 'isi2'), H.p([B, [B[0] + dx, B[1] - dy], [C[0] + dx, C[1] - dy], C], 'isi3'), H.p([A, B, C], 'isi'),
      H.t((A[0] + B[0]) / 2, y0 + 15, la, 'middle', 'tebal'), H.t(B[0] - 6, (B[1] + C[1]) / 2 + 4, lb, 'end', 'tebal'), H.t(B[0] + dx / 2 + 8, B[1] - dy / 2 + 12, lt, 'start', 'tebal')] };
  }
  function gbrBidang(o) {
    const pts = o.pts || [], poly = o.poly || [], seg = o.seg || [];
    const xs = [0], ys = [0]; pts.forEach((p) => { xs.push(p.x); ys.push(p.y); }); poly.forEach((q) => q.pts.forEach((p) => { xs.push(p[0]); ys.push(p[1]); })); seg.forEach((g) => { xs.push(g.x1, g.x2); ys.push(g.y1, g.y2); });
    const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, y0 = Math.min(...ys) - 1, y1 = Math.max(...ys) + 1;
    const W = 270, Hh = 112, s = Math.min(W / (x1 - x0), Hh / (y1 - y0)), ox = 160 - ((x0 + x1) / 2) * s, oy = 72 + ((y0 + y1) / 2) * s;
    const mx = (x) => ox + x * s, my = (y) => oy - y * s, el = [];
    for (let x = Math.ceil(x0); x <= x1; x++) el.push(H.l(mx(x), my(y0), mx(x), my(y1), 'tipis'));
    for (let y = Math.ceil(y0); y <= y1; y++) el.push(H.l(mx(x0), my(y), mx(x1), my(y), 'tipis'));
    el.push(H.l(mx(x0), my(0), mx(x1), my(0), 'garis'), H.l(mx(0), my(y0), mx(0), my(y1), 'garis'));
    const step = Math.max(1, Math.ceil((x1 - x0) / 10));
    for (let x = Math.ceil(x0); x <= x1; x += step) if (x !== 0) el.push(H.t(mx(x), my(0) + 12, x, 'middle', 'kecil'));
    for (let y = Math.ceil(y0); y <= y1; y += step) if (y !== 0) el.push(H.t(mx(0) - 3, my(y) + 4, y, 'end', 'kecil'));
    poly.forEach((q) => el.push(H.p(q.pts.map((p) => [mx(p[0]), my(p[1])]), q.c || 'isi')));
    seg.forEach((g) => el.push(H.l(mx(g.x1), my(g.y1), mx(g.x2), my(g.y2), g.c || 'putus')));
    pts.forEach((p) => { el.push(H.o(mx(p.x), my(p.y), 4, p.c || 'titik')); if (p.t) el.push(H.t(mx(p.x) + (p.dx === undefined ? 8 : p.dx), my(p.y) + (p.dy === undefined ? -7 : p.dy), p.t, p.a || 'start', 'tebal')); });
    return { tipe: 'gambar', alt: o.alt || 'Bidang koordinat', tinggi: 150, el };
  }

  CP.gbrBidang = gbrBidang;

  /* ========================= IX-1 SPLDV ========================= */
  function acakSol(r, lo, hi) {
    for (;;) {
      const x = r.bulat(lo, hi), y = r.bulat(lo, hi), a1 = nz(r, -5, 5), b1 = nz(r, -5, 5), a2 = nz(r, -5, 5), b2 = nz(r, -5, 5);
      if (a1 * b2 - a2 * b1 !== 0 && x !== y && Math.abs(a1 * b2 - a2 * b1) <= 18 && !(a1 === a2 && b1 === b2)) return { x, y, a1, b1, a2, b2 };
    }
  }
  function langkahCramer(p, c1, c2, tanya) {
    const { a1, b1, a2, b2 } = p, D = a1 * b2 - a2 * b1, nx = c1 * b2 - c2 * b1, ny = a1 * c2 - a2 * c1;
    const langkah = [
      st('Persamaan 1: ' + eqS(a1, b1, c1) + '. Persamaan 2: ' + eqS(a2, b2, c2) + '.'),
      st('Eliminasi y: kalikan persamaan 1 dengan ' + mn(b2) + ' dan persamaan 2 dengan ' + mn(b1) + ', lalu kurangkan: ' + mn(D) + 'x = ' + mn(nx) + '.'),
      st('x = ' + mn(nx) + ' ÷ ' + mn(D) + ' = ' + mn(nx / D) + '.', nx / D)];
    if (tanya !== 'x') {
      langkah.push(st('Eliminasi x: kalikan persamaan 1 dengan ' + mn(a2) + ' dan persamaan 2 dengan ' + mn(a1) + ', lalu kurangkan: ' + mn(-D) + 'y = ' + mn(a2 * c1 - a1 * c2) + '.'));
      langkah.push(st('y = ' + mn(ny) + ' ÷ ' + mn(D) + ' = ' + mn(ny / D) + '.', ny / D));
      if (tanya === 'jumlah') langkah.push(st('x + y = ' + mn(nx / D) + ' + (' + mn(ny / D) + ') = ' + mn(nx / D + ny / D) + '.', nx / D + ny / D));
    }
    return { langkah, dibagi: [{ a: nx, b: D }, { a: ny, b: D }] };
  }

  CP.aktifkan('IX-1', {
    level: [
      lv('Titik potong dua garis (grafik)', 'Penyelesaian = titik potong', 'angka',
        (r, c) => {
          for (;;) { const m1 = nz(r, -4, 4), m2 = nz(r, -4, 4), x0 = r.bulat(-4, 5), y0 = r.bulat(-5, 6); if (m1 !== m2) return { m1, m2, x0, y0, tanya: pilihJenis(r, c, ['x', 'y', 'jumlah']) }; }
        },
        ({ m1, m2, x0, y0, tanya }) => {
          const n1 = y0 - m1 * x0, n2 = y0 - m2 * x0, ans = tanya === 'x' ? x0 : tanya === 'y' ? y0 : x0 + y0;
          const kata = tanya === 'jumlah' ? 'x + y' : tanya;
          const s = S.angka('Grafik y = ' + rend({ x: m1, '': n1 }) + ' dan y = ' + rend({ x: m2, '': n2 }) + ' berpotongan di titik (x, y). Berapakah nilai ' + kata + '?', ans, { jenis: tanya, izin: { minus: true }, gambar: gbrDuaGaris(m1, n1, m2, n2, x0, y0, Math.min(x0, 0) - 3, Math.max(x0, 0) + 3), langkah: [
            st('Di titik potong nilai y sama: ' + rend({ x: m1, '': n1 }) + ' = ' + rend({ x: m2, '': n2 }) + '.'),
            st(mn(m1 - m2) + 'x = ' + mn(n2 - n1) + ', maka x = ' + mn(n2 - n1) + ' ÷ ' + mn(m1 - m2) + ' = ' + mn((n2 - n1) / (m1 - m2)) + '.'),
            st(tanya === 'x' ? 'Jadi x = ' + mn(x0) + '.' : tanya === 'y' ? 'y = ' + mn(m1) + ' × (' + mn(x0) + ') + (' + mn(n1) + ') = ' + mn(y0) + '.' : 'y = ' + mn(y0) + ', sehingga x + y = ' + mn(x0 + y0) + '.', tanya === 'x' ? (n2 - n1) / (m1 - m2) : tanya === 'y' ? m1 * ((n2 - n1) / (m1 - m2)) + n1 : ((n2 - n1) / (m1 - m2)) + m1 * ((n2 - n1) / (m1 - m2)) + n1)] });
          s.dibagi = [{ a: n2 - n1, b: m1 - m2 }]; return s;
        }),
      lv('Substitusi dan eliminasi (koefisien bebas)', 'Koefisien dan penyelesaian boleh negatif', 'angka',
        (r, c) => Object.assign(acakSol(r, -6, 7), { tanya: pilihJenis(r, c, ['x', 'y']) }),
        (p) => {
          const c1 = p.a1 * p.x + p.b1 * p.y, c2 = p.a2 * p.x + p.b2 * p.y; const { langkah, dibagi } = langkahCramer(p, c1, c2, p.tanya);
          const s = S.angka('Selesaikan ' + eqS(p.a1, p.b1, c1) + ' dan ' + eqS(p.a2, p.b2, c2) + '. Berapakah nilai ' + p.tanya + '?', p.tanya === 'x' ? p.x : p.y, { jenis: p.tanya, izin: { minus: true }, langkah });
          s.dibagi = dibagi; return s;
        }),
      lv('SPLDV bentuk pecahan', 'x/2 + y/3 = 5', 'angka',
        (r, c) => {
          const a = r.bulat(2, 6), b = r.bulat(2, 6), d = r.bulat(2, 6), e = r.bulat(2, 6);
          return { a, b, d, e, x: kpk(a, d) * r.bulat(1, 3), y: kpk(b, e) * r.bulat(1, 3), tanya: pilihJenis(r, c, ['x', 'y', 'jumlah']) };
        },
        ({ a, b, d, e, x, y, tanya }) => {
          const c = x / a + y / b, f = x / d - y / e;
          const L1 = kpk(a, b), L2 = kpk(d, e);
          const A1 = L1 / a, B1 = L1 / b, C1 = c * L1, A2 = L2 / d, B2 = -L2 / e, C2 = f * L2;
          const D = A1 * B2 - A2 * B1, nx = C1 * B2 - C2 * B1, ny = A1 * C2 - A2 * C1;
          const ans = tanya === 'x' ? x : tanya === 'y' ? y : x + y;
          const s = S.angka('Selesaikan x/' + a + ' + y/' + b + ' = ' + mn(c) + ' dan x/' + d + ' − y/' + e + ' = ' + mn(f) + '. Berapakah nilai ' + (tanya === 'jumlah' ? 'x + y' : tanya) + '?', ans, { jenis: tanya, izin: { minus: true }, langkah: [
            st('Hilangkan penyebut: persamaan 1 dikali ' + L1 + ', persamaan 2 dikali ' + L2 + '.'),
            st(eqS(A1, B1, C1) + ' dan ' + eqS(A2, B2, C2) + '.'),
            st('Eliminasi: x = ' + mn(nx) + ' ÷ ' + mn(D) + ' = ' + mn(nx / D) + ' dan y = ' + mn(ny) + ' ÷ ' + mn(D) + ' = ' + mn(ny / D) + '.'),
            st(tanya === 'x' ? 'x = ' + mn(x) + '.' : tanya === 'y' ? 'y = ' + mn(y) + '.' : 'x + y = ' + mn(x) + ' + ' + mn(y) + ' = ' + mn(x + y) + '.', tanya === 'x' ? nx / D : tanya === 'y' ? ny / D : nx / D + ny / D)] });
          s.dibagi = [{ a: nx, b: D }, { a: ny, b: D }]; return s;
        }),
      lv('Soal cerita: harga dan total belanja baru', 'Cari harga satuan, lalu hitung belanja lain', 'angka',
        (r) => { const p = acakSol(r, 1, 9); for (;;) { const a3 = r.bulat(1, 6), b3 = r.bulat(1, 6); if (!(a3 === p.a1 && b3 === p.b1) && !(a3 === p.a2 && b3 === p.b2)) { Object.assign(p, { a3, b3 }); break; } } p.a1 = Math.abs(p.a1); p.b1 = Math.abs(p.b1); p.a2 = Math.abs(p.a2); p.b2 = Math.abs(p.b2); return Object.assign(p, { k: r.bulat(0, 1) }); },
        (p, ctx) => {
          if (p.a1 * p.b2 - p.a2 * p.b1 === 0) { p.b2 += 1; }
          const c1 = p.a1 * p.x + p.b1 * p.y, c2 = p.a2 * p.x + p.b2 * p.y; const { langkah, dibagi } = langkahCramer(p, c1, c2, 'y');
          const v = kons(ctx), tot = (p.a3 * p.x + p.b3 * p.y);
          const [A, B] = v === 'umum' ? [['tiket dewasa', 'tiket anak'], ['bakso', 'es teh']][p.k] : [['kg bahan A', 'kg bahan B'], ['jam mesin potong', 'jam mesin jahit']][p.k];
          const teks = (v === 'umum' ? (p.k === 0 ? 'Di sebuah wahana, ' : 'Di kantin, ') : 'Sebuah industri kecil mencatat biaya: ') + p.a1 + ' ' + A + ' dan ' + p.b1 + ' ' + B + ' berharga Rp' + c1 + '.000, sedangkan ' + p.a2 + ' ' + A + ' dan ' + p.b2 + ' ' + B + ' berharga Rp' + c2 + '.000. Berapa rupiah harga ' + p.a3 + ' ' + A + ' dan ' + p.b3 + ' ' + B + '?';
          const kal = langkah.slice(); const yv = kal[kal.length - 1].v;
          kal.push(st('Harga satuan: ' + A + ' = ' + p.x + ' ribu dan ' + B + ' = ' + p.y + ' ribu. Total = ' + p.a3 + ' × ' + p.x + ' + ' + p.b3 + ' × ' + p.y + ' = ' + tot + ' ribu = ' + RP(tot * 1000) + '.', (p.a3 * (langkah[2].v) + p.b3 * yv) * 1000));
          const s = S.angka(teks, tot * 1000, { jenis: 'cerita' + p.k, awalan: 'Rp', langkah: kal });
          s.dibagi = dibagi; return s;
        }),
      lv('Mencari konstanta dari penyelesaian', 'Penyelesaian diketahui, cari koefisien', 'angka',
        (r) => ({ a: nz(r, -5, 6), b1: r.bulat(2, 4), x0: r.bulat(1, 6), y0: r.bulat(-5, 8), m: r.bulat(2, 4) }),
        ({ a, b1, x0, y0, m }) => {
          const c1 = a * x0 + b1 * y0, c2 = m * x0 - y0;
          const s = S.angka('Sistem persamaan ax + ' + b1 + 'y = ' + mn(c1) + ' dan ' + m + 'x − y = ' + mn(c2) + ' memiliki penyelesaian x = ' + x0 + '. Berapakah nilai a?', a, { jenis: 'konstanta', izin: { minus: true }, langkah: [
            st('Dari persamaan kedua: y = ' + m + ' × ' + x0 + ' − (' + mn(c2) + ') = ' + mn(m * x0 - c2) + '.'),
            st('Substitusi ke persamaan pertama: a × ' + x0 + ' + ' + b1 + ' × (' + mn(m * x0 - c2) + ') = ' + mn(c1) + ', maka ' + x0 + 'a = ' + mn(c1 - b1 * (m * x0 - c2)) + '.'),
            st('a = ' + mn(c1 - b1 * (m * x0 - c2)) + ' ÷ ' + x0 + ' = ' + mn(a) + '.', (c1 - b1 * (m * x0 - c2)) / x0)] });
          s.dibagi = [{ a: c1 - b1 * (m * x0 - c2), b: x0 }]; return s;
        }),
      lv('Soal cerita: umur dan produksi', 'Dua persamaan dari dua kalimat', 'angka',
        (r) => { for (;;) { const a = r.bulat(1, 4), b = r.bulat(1, 4), c = r.bulat(1, 4), d = r.bulat(1, 4); if (a * d - b * c !== 0) return { B: r.bulat(8, 16), m: r.bulat(2, 5), t: r.bulat(5, 15), a, b, c, d, x: r.bulat(2, 9), y: r.bulat(2, 9), nama: r.pilih(CP.NAMA) }; } },
        (p, ctx) => {
          if (kons(ctx) === 'umum') {
            const jml = (p.m + 1) * p.B + 2 * p.t;
            const s = S.angka('Umur ayah ' + p.m + ' kali umur ' + p.nama + '. ' + p.t + ' tahun lagi, jumlah umur mereka berdua ' + jml + ' tahun. Berapa umur ' + p.nama + ' sekarang?', p.B, { jenis: 'umur', satuan: 'tahun', langkah: [
              st('Misalkan umur ' + p.nama + ' = x, umur ayah = ' + p.m + 'x. ' + p.t + ' tahun lagi: (' + p.m + 'x + ' + p.t + ') + (x + ' + p.t + ') = ' + jml + '.'),
              st((p.m + 1) + 'x + ' + (2 * p.t) + ' = ' + jml + ' → ' + (p.m + 1) + 'x = ' + (jml - 2 * p.t) + ' → x = ' + (jml - 2 * p.t) + ' ÷ ' + (p.m + 1) + ' = ' + p.B + '.', (jml - 2 * p.t) / (p.m + 1))] });
            s.dibagi = [{ a: jml - 2 * p.t, b: p.m + 1 }]; return s;
          }
          const J = p.a * p.x + p.c * p.y, M = p.b * p.x + p.d * p.y, D = p.a * p.d - p.b * p.c, nx = J * p.d - M * p.c;
          const s = S.angka('Satu kemeja memerlukan ' + p.a + ' jam jahit dan ' + p.b + ' meter kain; satu celana memerlukan ' + p.c + ' jam jahit dan ' + p.d + ' meter kain. Tersedia ' + J + ' jam jahit dan ' + M + ' meter kain, semuanya terpakai. Berapa kemeja yang dibuat?', p.x, { jenis: 'produksi', satuan: 'kemeja', langkah: [
            st('Misalkan kemeja = x dan celana = y: ' + p.a + 'x + ' + p.c + 'y = ' + J + ' dan ' + p.b + 'x + ' + p.d + 'y = ' + M + '.'),
            st('Eliminasi y: kalikan persamaan 1 dengan ' + p.d + ' dan persamaan 2 dengan ' + p.c + ', lalu kurangkan: ' + mn(D) + 'x = ' + mn(nx) + '.'),
            st('x = ' + mn(nx) + ' ÷ ' + mn(D) + ' = ' + p.x + '.', nx / D)] });
          s.dibagi = [{ a: nx, b: D }]; return s;
        })
    ]
  });

  /* ========================= IX-2 BANGUN RUANG ========================= */
  const piTeks = 'π = 22/7';
  const tp = (r) => 'Gunakan ' + piTeks + '.';
  const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13]];

  CP.aktifkan('IX-2', {
    level: [
      lv('Kubus dan balok', 'V = p × l × t; luas permukaan', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['volKubus', 'lpKubus', 'volBalok', 'lpBalok']), s: r.bulat(3, 12), p: r.bulat(4, 15), l: r.bulat(3, 10), t: r.bulat(2, 9) }),
        (p) => {
          if (p.jenis === 'volKubus') return S.angka('Sebuah kubus memiliki panjang rusuk ' + p.s + ' cm. Berapa volumenya?', p.s ** 3, { jenis: p.jenis, satuan: 'cm' + Q3, gambar: gbrBalok(p.s, p.s, p.s, p.s, p.s, p.s), langkah: [st('Volume kubus = s³.'), st(p.s + ' × ' + p.s + ' × ' + p.s + ' = ' + p.s ** 3 + ' cm³.', p.s * p.s * p.s)] });
          if (p.jenis === 'lpKubus') return S.angka('Sebuah kubus memiliki panjang rusuk ' + p.s + ' cm. Berapa luas permukaannya?', 6 * p.s * p.s, { jenis: p.jenis, satuan: 'cm' + Q2, gambar: gbrBalok(p.s, p.s, p.s, p.s, p.s, p.s), langkah: [st('Kubus memiliki 6 sisi berbentuk persegi. Luas permukaan = 6s².'), st('6 × ' + p.s + '² = 6 × ' + p.s * p.s + ' = ' + 6 * p.s * p.s + ' cm².', 6 * (p.s * p.s))] });
          if (p.jenis === 'volBalok') return S.angka('Sebuah balok berukuran ' + p.p + ' cm × ' + p.l + ' cm × ' + p.t + ' cm. Berapa volumenya?', p.p * p.l * p.t, { jenis: p.jenis, satuan: 'cm' + Q3, gambar: gbrBalok(p.p, p.l, p.t, p.p, p.l, p.t), langkah: [st('Volume balok = panjang × lebar × tinggi.'), st(p.p + ' × ' + p.l + ' × ' + p.t + ' = ' + p.p * p.l * p.t + ' cm³.', p.p * p.l * p.t)] });
          const lp = 2 * (p.p * p.l + p.p * p.t + p.l * p.t);
          return S.angka('Sebuah balok berukuran ' + p.p + ' cm × ' + p.l + ' cm × ' + p.t + ' cm. Berapa luas permukaannya?', lp, { jenis: p.jenis, satuan: 'cm' + Q2, gambar: gbrBalok(p.p, p.l, p.t, p.p, p.l, p.t), langkah: [st('Luas permukaan balok = 2(pl + pt + lt).'), st('2 × (' + p.p * p.l + ' + ' + p.p * p.t + ' + ' + p.l * p.t + ') = 2 × ' + (p.p * p.l + p.p * p.t + p.l * p.t) + ' = ' + lp + ' cm².', 2 * (p.p * p.l + p.p * p.t + p.l * p.t))] });
        }),
      lv('Prisma dan limas', 'V prisma = luas alas × tinggi; V limas = ⅓ × luas alas × tinggi', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['volPrisma', 'lpPrisma', 'volLimas', 'lpLimas']), t3: r.pilih(TRI), k: r.bulat(1, 3), tp: r.bulat(4, 14), s: r.bulat(3, 10), m: r.bulat(1, 4), hs: r.bulat(5, 12) }),
        (p) => {
          const [a, b, c] = p.t3.map((x) => x * p.k);
          if (p.jenis === 'volPrisma') { const V = (a * b * p.tp) / 2; const s = S.angka('Alas sebuah prisma berbentuk segitiga siku-siku dengan sisi tegak ' + b + ' cm dan sisi datar ' + a + ' cm. Tinggi prisma ' + p.tp + ' cm. Berapa volumenya?', V, { jenis: p.jenis, satuan: 'cm' + Q3, gambar: gbrPrisma(a, b, p.tp, a, b, p.tp), langkah: [st('Luas alas = ½ × ' + a + ' × ' + b + ' = ' + (a * b) / 2 + ' cm².'), st('Volume = luas alas × tinggi = ' + (a * b) / 2 + ' × ' + p.tp + ' = ' + V + ' cm³.', ((a * b) / 2) * p.tp)] }); s.dibagi = [{ a: a * b, b: 2 }]; return s; }
          if (p.jenis === 'lpPrisma') { const LP = a * b + (a + b + c) * p.tp; return S.angka('Alas sebuah prisma berbentuk segitiga siku-siku dengan sisi ' + a + ' cm, ' + b + ' cm, dan sisi miring ' + c + ' cm. Tinggi prisma ' + p.tp + ' cm. Berapa luas permukaannya?', LP, { jenis: p.jenis, satuan: 'cm' + Q2, gambar: gbrPrisma(a, b, p.tp, a, b, p.tp), langkah: [st('Luas permukaan = 2 × luas alas + keliling alas × tinggi.'), st('2 × (½ × ' + a + ' × ' + b + ') + (' + a + ' + ' + b + ' + ' + c + ') × ' + p.tp + ' = ' + a * b + ' + ' + (a + b + c) * p.tp + ' = ' + LP + ' cm².', a * b + (a + b + c) * p.tp)] }); }
          if (p.jenis === 'volLimas') { const t = 3 * p.m, V = (p.s * p.s * t) / 3; const s = S.angka('Sebuah limas memiliki alas persegi dengan sisi ' + p.s + ' cm dan tinggi ' + t + ' cm. Berapa volumenya?', V, { jenis: p.jenis, satuan: 'cm' + Q3, gambar: gbrLimas(p.s, t, p.s, t), langkah: [st('Volume limas = ⅓ × luas alas × tinggi.'), st('⅓ × ' + p.s * p.s + ' × ' + t + ' = ' + p.s * p.s * t + ' ÷ 3 = ' + V + ' cm³.', (p.s * p.s * t) / 3)] }); s.dibagi = [{ a: p.s * p.s * t, b: 3 }]; return s; }
          const LP = p.s * p.s + 2 * p.s * p.hs;
          return S.angka('Sebuah limas memiliki alas persegi dengan sisi ' + p.s + ' cm. Tinggi setiap sisi tegaknya (segitiga) ' + p.hs + ' cm. Berapa luas permukaan limas?', LP, { jenis: p.jenis, satuan: 'cm' + Q2, gambar: gbrLimas(p.s, p.hs, p.s, '', p.hs), langkah: [st('Luas permukaan = luas alas + 4 × luas segitiga sisi tegak.'), st(p.s + '² + 4 × (½ × ' + p.s + ' × ' + p.hs + ') = ' + p.s * p.s + ' + ' + 2 * p.s * p.hs + ' = ' + LP + ' cm².', p.s * p.s + 4 * ((p.s * p.hs) / 2))] });
        }),
      lv('Tabung', 'π = 22/7: V = πr²t', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['vol', 'selimut', 'lp']), k: r.bulat(1, 3), t: r.bulat(4, 15) }),
        (p) => {
          const r = 7 * p.k, g = gbrTabung(r, p.t, 'r = ' + r, 't = ' + p.t);
          if (p.jenis === 'vol') return S.angka('Sebuah tabung berjari-jari ' + r + ' cm dan tinggi ' + p.t + ' cm. Berapa volumenya? ' + tp(), 22 * 7 * p.k * p.k * p.t, { jenis: 'vol', satuan: 'cm' + Q3, gambar: g, langkah: [st('V = πr²t = 22/7 × ' + r + '² × ' + p.t + '.'), st('22/7 × ' + r * r + ' = ' + 22 * 7 * p.k * p.k + ', lalu × ' + p.t + ' = ' + 22 * 7 * p.k * p.k * p.t + ' cm³.', ((22 * r * r) / 7) * p.t)] });
          if (p.jenis === 'selimut') return S.angka('Sebuah tabung berjari-jari ' + r + ' cm dan tinggi ' + p.t + ' cm. Berapa luas selimutnya? ' + tp(), 44 * p.k * p.t, { jenis: 'selimut', satuan: 'cm' + Q2, gambar: g, langkah: [st('Luas selimut = 2πrt = 2 × 22/7 × ' + r + ' × ' + p.t + '.'), st('2 × 22/7 × ' + r + ' = ' + 44 * p.k + ', lalu × ' + p.t + ' = ' + 44 * p.k * p.t + ' cm².', ((2 * 22 * r) / 7) * p.t)] });
          return S.angka('Sebuah tabung berjari-jari ' + r + ' cm dan tinggi ' + p.t + ' cm. Berapa luas permukaannya (dengan tutup)? ' + tp(), 44 * p.k * (r + p.t), { jenis: 'lp', satuan: 'cm' + Q2, gambar: g, langkah: [st('Luas permukaan = 2πr(r + t) = 2 × 22/7 × ' + r + ' × (' + r + ' + ' + p.t + ').'), st(44 * p.k + ' × ' + (r + p.t) + ' = ' + 44 * p.k * (r + p.t) + ' cm².', ((2 * 22 * r) / 7) * (r + p.t))] });
        }),
      lv('Kerucut dan bola', 'V kerucut = ⅓πr²t; V bola = 4/3 πr³', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['volKerucut', 'selimutKerucut', 'volBola', 'lpBola']), k: r.bulat(1, 3), m: r.bulat(1, 6), tri: r.pilih([[7, 24, 25], [21, 20, 29]]), kb: r.pilih([1, 2]) }),
        (p) => {
          if (p.jenis === 'volKerucut') { const r = 7 * p.k, t = 3 * p.m, V = 154 * p.k * p.k * p.m; return S.angka('Sebuah kerucut berjari-jari ' + r + ' cm dan tinggi ' + t + ' cm. Berapa volumenya? ' + tp(), V, { jenis: p.jenis, satuan: 'cm' + Q3, gambar: gbrKerucut(r, t, 'r = ' + r, 't = ' + t), langkah: [st('V = ⅓πr²t = ⅓ × 22/7 × ' + r + '² × ' + t + '.'), st('22/7 × ' + r * r + ' = ' + 22 * 7 * p.k * p.k + '; × ' + t + ' ÷ 3 = ' + V + ' cm³.', ((22 * r * r) / 7 * t) / 3)] }); }
          if (p.jenis === 'selimutKerucut') { const [r, t, s] = p.tri, L = (22 * r * s) / 7; return S.angka('Sebuah kerucut berjari-jari ' + r + ' cm dan tinggi ' + t + ' cm, sehingga garis pelukisnya ' + s + ' cm. Berapa luas selimutnya? ' + tp(), L, { jenis: p.jenis, satuan: 'cm' + Q2, gambar: gbrKerucut(r, t, 'r = ' + r, 't = ' + t, 's = ' + s), langkah: [st('Luas selimut kerucut = πrs = 22/7 × ' + r + ' × ' + s + '.'), st('22 × ' + r / 7 + ' × ' + s + ' = ' + L + ' cm².', ((22 * r) / 7) * s)] }); }
          if (p.jenis === 'volBola') { const r = 21 * p.kb, V = (4 * 22 * r * r * r) / (3 * 7); return S.angka('Sebuah bola berjari-jari ' + r + ' cm. Berapa volumenya? ' + tp(), V, { jenis: p.jenis, satuan: 'cm' + Q3, gambar: gbrBola('r = ' + r), langkah: [st('V = 4/3 × π × r³ = 4/3 × 22/7 × ' + r + '³.'), st(r + '³ = ' + r ** 3 + '. V = ' + (4 * 22) + ' × ' + r ** 3 + ' ÷ 21 = ' + V + ' cm³.', (4 * 22 * r ** 3) / 21)] }); }
          const r = 7 * p.k, L = 616 * p.k * p.k; return S.angka('Sebuah bola berjari-jari ' + r + ' cm. Berapa luas permukaannya? ' + tp(), L, { jenis: p.jenis, satuan: 'cm' + Q2, gambar: gbrBola('r = ' + r), langkah: [st('Luas permukaan bola = 4πr² = 4 × 22/7 × ' + r + '².'), st('4 × 22 × ' + r * r + ' ÷ 7 = ' + L + ' cm².', (4 * 22 * r * r) / 7)] });
        }),
      lv('Penerapan: liter dan bangun gabungan', '1 liter = 1.000 cm³ = 1 dm³', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['liter', 'silo']), a: r.bulat(2, 9), b: r.bulat(2, 8), c: r.bulat(2, 7), k: r.bulat(1, 2), h: r.bulat(3, 10), m: r.bulat(1, 4) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'liter') {
            const pj = 10 * p.a, lb = 10 * p.b, tg = 10 * p.c, L = p.a * p.b * p.c;
            return S.angka((v === 'umum' ? 'Sebuah akuarium berbentuk balok berukuran ' : 'Sebuah bak penampung berbentuk balok berukuran ') + pj + ' cm × ' + lb + ' cm × ' + tg + ' cm. Berapa liter air yang dapat ditampung hingga penuh?', L, { jenis: 'liter', satuan: 'liter', gambar: gbrBalok(pj, lb, tg, pj, lb, tg), langkah: [st('Volume = ' + pj + ' × ' + lb + ' × ' + tg + ' = ' + pj * lb * tg + ' cm³.'), st('1 liter = 1.000 cm³, maka ' + pj * lb * tg + ' ÷ 1.000 = ' + L + ' liter.', (pj * lb * tg) / 1000)], dibagi: [{ a: pj * lb * tg, b: 1000 }] });
          }
          const r = 7 * p.k, tabungV = 22 * 7 * p.k * p.k * p.h, kerucutV = 154 * p.k * p.k * p.m, tk = 3 * p.m;
          return S.angka((v === 'umum' ? 'Sebuah wadah berbentuk tabung (jari-jari ' + r + ' cm, tinggi ' + p.h + ' cm) dengan tutup berbentuk kerucut setinggi ' + tk + ' cm. ' : 'Sebuah silo penyimpanan terdiri dari tabung (jari-jari ' + r + ' cm, tinggi ' + p.h + ' cm) dan atap kerucut setinggi ' + tk + ' cm. ') + 'Berapa volume seluruhnya? ' + tp(), tabungV + kerucutV, { jenis: 'silo', satuan: 'cm' + Q3, gambar: gbrTabung(r, p.h, 'r = ' + r, 't = ' + p.h), langkah: [st('V tabung = 22/7 × ' + r + '² × ' + p.h + ' = ' + tabungV + ' cm³.'), st('V kerucut = ⅓ × 22/7 × ' + r + '² × ' + tk + ' = ' + kerucutV + ' cm³.'), st('Jumlah = ' + tabungV + ' + ' + kerucutV + ' = ' + (tabungV + kerucutV) + ' cm³.', ((22 * r * r) / 7) * p.h + (((22 * r * r) / 7) * tk) / 3)] });
        }),
      lv('Soal cerita bangun ruang', 'Kaleng, kemasan, tenda, bak air', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['label', 'kardus', 'tenda', 'bak']), k: r.bulat(1, 3), t: r.bulat(8, 20), p: r.bulat(8, 20), l: r.bulat(5, 12), tt: r.bulat(4, 10), a: 2 * r.bulat(2, 4), b: r.bulat(2, 4), pn: r.bulat(3, 8), s: r.bulat(2, 6) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'label') { const r = 7 * p.k, L = 44 * p.k * p.t; return S.angka((v === 'umum' ? 'Sebuah kaleng susu berbentuk tabung berjari-jari ' + r + ' cm dan tinggi ' + p.t + ' cm. Label dipasang menutupi seluruh sisi lengkungnya. ' : 'Sebuah kaleng cat berbentuk tabung berjari-jari ' + r + ' cm dan tinggi ' + p.t + ' cm. Stiker merek menutupi seluruh sisi lengkungnya. ') + 'Berapa luas label/stiker itu? ' + tp(), L, { jenis: 'label', satuan: 'cm' + Q2, gambar: gbrTabung(r, p.t, 'r = ' + r, 't = ' + p.t), langkah: [st('Yang ditutup adalah selimut tabung: 2πrt = 2 × 22/7 × ' + r + ' × ' + p.t + '.'), st(44 * p.k + ' × ' + p.t + ' = ' + L + ' cm².', ((2 * 22 * r) / 7) * p.t)] }); }
          if (p.jenis === 'kardus') { const LP = 2 * (p.p * p.l + p.p * p.tt + p.l * p.tt); return S.angka((v === 'umum' ? 'Sebuah kotak kado berbentuk balok berukuran ' : 'Sebuah kardus kemasan produk berbentuk balok berukuran ') + p.p + ' cm × ' + p.l + ' cm × ' + p.tt + ' cm akan dibungkus kertas tanpa sambungan. Berapa luas kertas minimal yang diperlukan?', LP, { jenis: 'kardus', satuan: 'cm' + Q2, gambar: gbrBalok(p.p, p.l, p.tt, p.p, p.l, p.tt), langkah: [st('Kertas menutup seluruh permukaan: 2(pl + pt + lt).'), st('2 × (' + p.p * p.l + ' + ' + p.p * p.tt + ' + ' + p.l * p.tt + ') = ' + LP + ' cm².', 2 * (p.p * p.l + p.p * p.tt + p.l * p.tt))] }); }
          if (p.jenis === 'tenda') { const V = (p.a * p.b * p.pn) / 2; const s = S.angka('Sebuah tenda berbentuk prisma segitiga. Alas depannya berbentuk segitiga dengan alas ' + p.a + ' m dan tinggi ' + p.b + ' m, dan panjang tenda ' + p.pn + ' m. Berapa volume udara di dalam tenda?', V, { jenis: 'tenda', satuan: 'm' + Q3, gambar: gbrPrisma(p.a, p.b, p.pn, p.a, p.b, p.pn), langkah: [st('Volume prisma = luas alas segitiga × panjang = ½ × ' + p.a + ' × ' + p.b + ' × ' + p.pn + '.'), st((p.a * p.b) / 2 + ' × ' + p.pn + ' = ' + V + ' m³.', ((p.a * p.b) / 2) * p.pn)] }); s.dibagi = [{ a: p.a * p.b, b: 2 }]; return s; }
          return S.angka('Sebuah bak air berbentuk kubus memiliki panjang rusuk ' + p.s + ' dm. Berapa liter air yang dapat ditampung hingga penuh?', p.s ** 3, { jenis: 'bak', satuan: 'liter', gambar: gbrBalok(p.s, p.s, p.s, p.s, p.s, p.s), langkah: [st('Volume = ' + p.s + '³ = ' + p.s ** 3 + ' dm³.'), st('1 dm³ = 1 liter, jadi ' + p.s ** 3 + ' liter.', p.s * p.s * p.s)] });
        })
    ]
  });

  /* ========================= IX-3 TRANSFORMASI GEOMETRI ========================= */
  const tt = (x, y) => '(' + mn(x) + ', ' + mn(y) + ')';
  const opsiTitik = (q) => ({ t: tt(q[0], q[1]), k: q[0] + ',' + q[1], v: tt(q[0], q[1]) });
  const REFL = {
    'sumbu x': { teks: 'sumbu x', f: (x, y) => [x, -y] }, 'sumbu y': { teks: 'sumbu y', f: (x, y) => [-x, y] },
    'garis y = x': { teks: 'garis y = x', f: (x, y) => [y, x] }, 'garis y = −x': { teks: 'garis y = −x', f: (x, y) => [-y, -x] }
  };
  const ROT = { 90: (x, y) => [-y, x], 180: (x, y) => [-x, -y], 270: (x, y) => [y, -x] };

  CP.aktifkan('IX-3', {
    level: [
      lv('Translasi (pergeseran)', "A(x, y) ditranslasi T(a, b) → A'(x + a, y + b)", 'angka',
        (r, c) => ({ x: nz(r, -6, 6), y: nz(r, -6, 6), a: nz(r, -6, 6), b: nz(r, -6, 6), tanya: pilihJenis(r, c, ['absis', 'ordinat']) }),
        ({ x, y, a, b, tanya }) => {
          const x2 = x + a, y2 = y + b;
          return S.angka('Titik A' + tt(x, y) + " ditranslasikan oleh T(" + mn(a) + ', ' + mn(b) + "). Berapa " + (tanya === 'absis' ? 'absis (nilai x)' : 'ordinat (nilai y)') + " titik bayangan A'?", tanya === 'absis' ? x2 : y2, { jenis: tanya, izin: { minus: true }, gambar: gbrBidang({ pts: [{ x, y, t: 'A' }, { x: x2, y: y2, t: "A'", c: 'titik' }], seg: [{ x1: x, y1: y, x2: x2, y2: y2, c: 'merah' }], alt: 'Titik A dan bayangannya setelah translasi' }), langkah: [
            st("Translasi menambahkan komponen: A'(x + a, y + b)."),
            st(tanya === 'absis' ? 'Absis: ' + mn(x) + ' + (' + mn(a) + ') = ' + mn(x2) + '.' : 'Ordinat: ' + mn(y) + ' + (' + mn(b) + ') = ' + mn(y2) + '.', tanya === 'absis' ? x + a : y + b)] });
        }),
      lv('Refleksi (pencerminan)', 'Sumbu x, sumbu y, y = x, y = −x', 'pilihan',
        (r, c) => { let x, y; do { x = nz(r, -6, 6); y = nz(r, -6, 6); } while (x === y || x === -y); return { jenis: pilihJenis(r, c, Object.keys(REFL)), x, y, sd: r.bulat(1, 99999) }; },
        ({ jenis, x, y, sd }) => {
          const f = REFL[jenis].f, hasil = f(x, y); const benar = opsiTitik(hasil);
          const salah = Object.keys(REFL).filter((k) => k !== jenis).map((k) => opsiTitik(REFL[k].f(x, y))).concat([opsiTitik([x, y]), opsiTitik([-x, -y])]);
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan('Bayangan titik A' + tt(x, y) + ' oleh refleksi terhadap ' + REFL[jenis].teks + ' adalah …', h, { jenis, gambar: gbrBidang({ pts: [{ x, y, t: 'A' }, { x: hasil[0], y: hasil[1], t: "A'" }], seg: [{ x1: x, y1: y, x2: hasil[0], y2: hasil[1], c: 'putus' }], alt: 'Titik dan bayangannya setelah refleksi' }), langkah: [
            st(jenis === 'sumbu x' ? 'Refleksi terhadap sumbu x: (x, y) → (x, −y).' : jenis === 'sumbu y' ? 'Refleksi terhadap sumbu y: (x, y) → (−x, y).' : jenis === 'garis y = x' ? 'Refleksi terhadap y = x: (x, y) → (y, x).' : 'Refleksi terhadap y = −x: (x, y) → (−y, −x).'),
            st("A' = " + benar.t + '.', benar.t)] });
        }),
      lv('Rotasi (perputaran)', 'Searah putaran positif: berlawanan arah jarum jam', 'pilihan',
        (r, c) => { let x, y; do { x = nz(r, -6, 6); y = nz(r, -6, 6); } while (x === y || x === -y); return { sudut: r.pilih([90, 180, 270]), x, y, a: r.pilih([0, 0, nz(r, -3, 3)]), b: 0, sd: r.bulat(1, 99999) }; },
        ({ sudut, x, y, a, sd }) => {
          const pb = a !== 0 ? [a, 1] : [0, 0]; const [cx, cy] = pb;
          const rel = ROT[sudut](x - cx, y - cy), hasil = [rel[0] + cx, rel[1] + cy]; const benar = opsiTitik(hasil);
          const sal = [90, 180, 270].filter((s) => s !== sudut).map((s) => { const q = ROT[s](x - cx, y - cy); return opsiTitik([q[0] + cx, q[1] + cy]); }).concat([[y, x], [x, -y], [-x, y], [-y, -x], [x + 1, y], [x, y + 1]].map(opsiTitik));
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, sal);
          const pusat = a !== 0 ? 'titik P(' + mn(cx) + ', ' + mn(cy) + ')' : 'titik pusat O(0, 0)';
          return S.pilihan('Bayangan titik A' + tt(x, y) + ' oleh rotasi ' + sudut + DER + ' berlawanan arah jarum jam terhadap ' + pusat + ' adalah …', h, { jenis: 'rot' + sudut + (a !== 0 ? 'P' : 'O'), gambar: gbrBidang({ pts: [{ x, y, t: 'A' }, { x: hasil[0], y: hasil[1], t: "A'" }, { x: cx, y: cy, t: a !== 0 ? 'P' : 'O', c: 'titik', dx: 6, dy: 14 }], seg: [{ x1: cx, y1: cy, x2: x, y2: y, c: 'putus' }, { x1: cx, y1: cy, x2: hasil[0], y2: hasil[1], c: 'putus' }], alt: 'Titik dan bayangannya setelah rotasi' }), langkah: [
            st('Putar ' + sudut + DER + ' berlawanan arah jarum jam: ' + (sudut === 90 ? '(p, q) → (−q, p)' : sudut === 180 ? '(p, q) → (−p, −q)' : '(p, q) → (q, −p)') + (a !== 0 ? ', dengan (p, q) = titik − pusat = ' + tt(x - cx, y - cy) : ' (pusat O)') + '.'),
            st((a !== 0 ? 'Hasil relatif ' + tt(rel[0], rel[1]) + ', tambahkan pusat: ' : '') + "A' = " + benar.t + '.', benar.t)] });
        }),
      lv('Dilatasi (perbesaran/pengecilan)', "A'(k × x, k × y) untuk pusat O", 'angka',
        (r, c) => {
          const kk = r.pilih([[2, 1], [3, 1], [-1, 1], [-2, 1], [1, 2], [1, 3], [-1, 2]]); const q = kk[1];
          return { kn: kk[0], kd: q, a: r.pilih([0, 0, nz(r, -3, 3)]), b: nz(r, -3, 3), dx: q * nz(r, -4, 4), dy: q * nz(r, -4, 4), tanya: pilihJenis(r, c, ['absis', 'ordinat']) };
        },
        ({ kn, kd, a, b, dx, dy, tanya }) => {
          const px = a + dx, py = b + dy, ex = a + (kn * dx) / kd, ey = b + (kn * dy) / kd; const kt = kd === 1 ? mn(kn) : kn + '/' + kd;
          const pusat = a !== 0 ? 'P(' + mn(a) + ', ' + mn(b) + ')' : 'O(0, 0)';
          const s = S.angka('Titik A' + tt(px, py) + ' didilatasi dengan pusat ' + pusat + ' dan faktor skala ' + kt + ". Berapa " + (tanya === 'absis' ? 'absis' : 'ordinat') + " titik A'?", tanya === 'absis' ? ex : ey, { jenis: 'dilatasi' + (kd > 1 ? 'kecil' : kn < 0 ? 'neg' : 'besar'), izin: { minus: true }, gambar: gbrBidang({ pts: [{ x: px, y: py, t: 'A' }, { x: ex, y: ey, t: "A'" }, { x: a, y: b, t: a !== 0 ? 'P' : 'O', dx: 6, dy: 14 }], seg: [{ x1: a, y1: b, x2: px, y2: py, c: 'putus' }, { x1: a, y1: b, x2: ex, y2: ey, c: 'merah' }], alt: 'Titik dan bayangan dilatasi' }), langkah: [
            st("Dilatasi pusat " + pusat + " faktor k: A'(a + k(x − a), b + k(y − b))."),
            st(tanya === 'absis' ? 'Absis: ' + mn(a) + ' + ' + kt + ' × (' + mn(px) + ' − (' + mn(a) + ')) = ' + mn(ex) + '.' : 'Ordinat: ' + mn(b) + ' + ' + kt + ' × (' + mn(py) + ' − (' + mn(b) + ')) = ' + mn(ey) + '.', tanya === 'absis' ? a + (kn / kd) * (px - a) : b + (kn / kd) * (py - b))] });
          s.dibagi = [{ a: kn * (tanya === 'absis' ? dx : dy), b: kd }]; return s;
        }),
      lv('Komposisi transformasi', 'Dua transformasi berurutan', 'angka',
        (r, c) => ({ x: nz(r, -5, 5), y: nz(r, -5, 5), t1: r.bulat(0, 3), t2: r.bulat(0, 3), a: nz(r, -4, 4), b: nz(r, -4, 4), tanya: pilihJenis(r, c, ['absis', 'ordinat', 'jumlah']) }),
        ({ x, y, t1, t2, a, b, tanya }) => {
          const TR = [{ n: 'translasi T(' + mn(a) + ', ' + mn(b) + ')', f: (u, w) => [u + a, w + b] }, { n: 'refleksi terhadap sumbu x', f: (u, w) => [u, -w] }, { n: 'rotasi 90' + DER + ' berlawanan arah jarum jam terhadap O', f: (u, w) => [-w, u] }, { n: 'dilatasi pusat O faktor 2', f: (u, w) => [2 * u, 2 * w] }];
          const m1 = TR[t1], m2 = TR[(t1 + 1 + (t2 % 3)) % 4]; const q1 = m1.f(x, y), q2 = m2.f(q1[0], q1[1]);
          const ans = tanya === 'absis' ? q2[0] : tanya === 'ordinat' ? q2[1] : q2[0] + q2[1];
          return S.angka('Titik A' + tt(x, y) + ' ditransformasikan berurutan oleh ' + m1.n + ', kemudian ' + m2.n + '. Berapa ' + (tanya === 'jumlah' ? 'jumlah absis dan ordinat' : tanya) + ' bayangan akhirnya?', ans, { jenis: 'komposisi:' + t1 + (t1 + 1 + (t2 % 3)) % 4 + tanya, izin: { minus: true }, gambar: gbrBidang({ pts: [{ x, y, t: 'A' }, { x: q1[0], y: q1[1], t: "A'" }, { x: q2[0], y: q2[1], t: 'A"' }], seg: [{ x1: x, y1: y, x2: q1[0], y2: q1[1], c: 'putus' }, { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], c: 'merah' }], alt: 'Titik dan bayangannya setelah dua transformasi' }), langkah: [
            st('Langkah 1 (' + m1.n + '): ' + tt(x, y) + " → A'" + tt(q1[0], q1[1]) + '.'),
            st('Langkah 2 (' + m2.n + '): ' + tt(q1[0], q1[1]) + ' → A"' + tt(q2[0], q2[1]) + '.'),
            st(tanya === 'absis' ? 'Absis bayangan akhir = ' + mn(q2[0]) + '.' : tanya === 'ordinat' ? 'Ordinat bayangan akhir = ' + mn(q2[1]) + '.' : mn(q2[0]) + ' + (' + mn(q2[1]) + ') = ' + mn(q2[0] + q2[1]) + '.', ans)] });
        }),
      lv('Dilatasi bangun dan perbandingan luas', 'Luas bayangan = k² × luas awal', 'angka',
        (r) => ({ a: nz(r, -3, 3), b: nz(r, -3, 3), pp: r.bulat(2, 6), q: 2 * r.bulat(1, 3), k: r.bulat(2, 4), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx), A = [p.a, p.b], B = [p.a + p.pp, p.b], C = [p.a, p.b + p.q], luas = (p.pp * p.q) / 2, L2 = luas * p.k * p.k;
          const sc = (q) => [p.k * q[0], p.k * q[1]];
          const teks = v === 'umum' ? 'Segitiga ABC dengan A' + tt(A[0], A[1]) + ', B' + tt(B[0], B[1]) + ', C' + tt(C[0], C[1]) + ' pada denah taman didilatasi dengan pusat O dan faktor skala ' + p.k + '. Berapa luas bayangannya (satuan persegi)?' : 'Desain logo berbentuk segitiga ABC dengan A' + tt(A[0], A[1]) + ', B' + tt(B[0], B[1]) + ', C' + tt(C[0], C[1]) + ' pada gambar kerja diperbesar dengan pusat O dan faktor skala ' + p.k + '. Berapa luas hasil pembesarannya (satuan persegi)?';
          const s = S.angka(teks, L2, { jenis: 'luasDilatasi', gambar: gbrBidang({ poly: [{ pts: [A, B, C], c: 'isi' }, { pts: [sc(A), sc(B), sc(C)], c: 'isi2' }], pts: [{ x: A[0], y: A[1], t: 'A' }, { x: sc(A)[0], y: sc(A)[1], t: "A'" }], alt: 'Segitiga dan bayangannya setelah dilatasi' }), langkah: [
            st('Segitiga siku-siku di A: alas AB = ' + p.pp + ', tinggi AC = ' + p.q + '. Luas awal = ½ × ' + p.pp + ' × ' + p.q + ' = ' + luas + '.'),
            st('Dilatasi faktor ' + p.k + ' mengalikan luas dengan ' + p.k + '² = ' + p.k * p.k + '. Luas bayangan = ' + luas + ' × ' + p.k * p.k + ' = ' + L2 + '.', (((p.k * p.pp) * (p.k * p.q)) / 2))] });
          s.dibagi = [{ a: p.pp * p.q, b: 2 }]; return s;
        })
    ]
  });

  /* ========================= IX-4 PELUANG DAN PENGAMBILAN SAMPEL ========================= */
  CP.aktifkan('IX-4', {
    level: [
      lv('Populasi dan sampel', 'Seluruh objek vs sebagian yang diamati', 'pilihan',
        (r) => ({ N: r.pilih([120, 200, 300, 450, 500, 800]), n: r.pilih([20, 25, 30, 40, 50]), k: r.bulat(0, 2), sd: r.bulat(1, 99999) }),
        ({ N, n, k, sd }, ctx) => {
          const v = kons(ctx);
          const [unit, tujuan] = v === 'umum' ? [['siswa', 'rata-rata tinggi badan'], ['siswa', 'banyak yang menyukai olahraga'], ['siswa', 'nilai rata-rata ulangan']][k] : [['pelanggan', 'tingkat kepuasan'], ['produk', 'banyak produk cacat'], ['unit mesin', 'rata-rata umur pakai']][k];
          const benar = opsiTeks('Populasi: ' + N + ' ' + unit + '; sampel: ' + n + ' ' + unit);
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, [opsiTeks('Populasi: ' + n + ' ' + unit + '; sampel: ' + N + ' ' + unit), opsiTeks('Populasi: ' + (N - n) + ' ' + unit + '; sampel: ' + n + ' ' + unit), opsiTeks('Populasi: ' + N + ' ' + unit + '; sampel: ' + (N - n) + ' ' + unit), opsiTeks('Populasi dan sampel sama-sama ' + N + ' ' + unit)]);
          return S.pilihan('Untuk mengetahui ' + tujuan + ' dari seluruh ' + N + ' ' + unit + ', peneliti hanya mengamati ' + n + ' ' + unit + ' yang dipilih. Pernyataan yang benar adalah …', h, { jenis: 'populasi', langkah: [st('Populasi adalah seluruh objek yang diteliti, yaitu ' + N + ' ' + unit + '.'), st('Sampel adalah sebagian yang diamati, yaitu ' + n + ' ' + unit + '. Jadi: ' + benar.t + '.', benar.t)] });
        }),
      lv('Teknik pengambilan sampel', 'Sistematis dan acak berstrata', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['sistematis', 'strata']), j: r.bulat(3, 12), n: r.pilih([20, 25, 30, 40]), w: [r.bulat(1, 4), r.bulat(2, 5), r.bulat(2, 6)], m: r.bulat(5, 15), jj: r.bulat(1, 4), pos: r.bulat(0, 2) }),
        (p) => {
          if (p.jenis === 'sistematis') { const N = p.j * p.n; const s = S.angka('Dari ' + N + ' orang yang terdaftar akan dipilih ' + p.n + ' orang sebagai sampel secara sistematis (setiap orang ke-k). Berapa nilai k (interval pemilihan)?', p.j, { jenis: 'sistematis', langkah: [st('Interval = banyak populasi ÷ banyak sampel.'), st(N + ' ÷ ' + p.n + ' = ' + p.j + '.', N / p.n)] }); s.dibagi = [{ a: N, b: p.n }]; return s; }
          const sw = p.w[0] + p.w[1] + p.w[2], Ns = p.w.map((x) => x * p.m), N = Ns[0] + Ns[1] + Ns[2], n = p.jj * sw, kel = ['A', 'B', 'C'][p.pos], idx = p.pos;
          const s = S.angka('Sebuah sekolah memiliki tiga kelas: A (' + Ns[0] + ' siswa), B (' + Ns[1] + ' siswa), C (' + Ns[2] + ' siswa). Akan diambil sampel ' + n + ' siswa secara acak berstrata proporsional. Berapa siswa yang diambil dari kelas ' + kel + '?', p.jj * p.w[idx], { jenis: 'strata', satuan: 'siswa', langkah: [st('Sampel tiap strata = (anggota strata ÷ total) × sampel = ' + Ns[idx] + '/' + N + ' × ' + n + '.'), st(Ns[idx] + ' × ' + n + ' ÷ ' + N + ' = ' + p.jj * p.w[idx] + '.', (Ns[idx] * n) / N)] });
          s.dibagi = [{ a: Ns[idx] * n, b: N }]; return s;
        }),
      lv('Peluang dua pengambilan tanpa pengembalian', 'Kelereng dari kantong', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['sama', 'berbeda']), m: r.bulat(2, 7), b: r.bulat(2, 7), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const N = p.m + p.b, v = kons(ctx);
          const sama = CP.pKali(P(p.m, N), P(p.m - 1, N - 1)), beda = CP.pTambah(CP.pKali(P(p.m, N), P(p.b, N - 1)), CP.pKali(P(p.b, N), P(p.m, N - 1)));
          const kantong = v === 'umum' ? 'kelereng merah dan ' : 'komponen baik dan ';
          const kata = v === 'umum' ? ['merah', 'biru'] : ['baik', 'cacat'];
          if (p.jenis === 'sama') return S.pecahan('Sebuah kantong berisi ' + p.m + ' ' + kantong + p.b + ' ' + (v === 'umum' ? 'kelereng biru' : 'komponen cacat') + '. Dua benda diambil satu per satu tanpa pengembalian. Tentukan peluang keduanya ' + kata[0] + '.', sama, { jenis: 'sama', langkah: [st('Pengambilan pertama ' + kata[0] + ': ' + p.m + '/' + N + '. Pengambilan kedua ' + kata[0] + ' (sisa ' + (N - 1) + ' benda, ' + (p.m - 1) + ' ' + kata[0] + '): ' + (p.m - 1) + '/' + (N - 1) + '.'), st(p.m + '/' + N + ' × ' + (p.m - 1) + '/' + (N - 1) + ' = ' + pf(sama) + '.', sama)] });
          return S.pecahan('Sebuah kantong berisi ' + p.m + ' ' + kantong + p.b + ' ' + (v === 'umum' ? 'kelereng biru' : 'komponen cacat') + '. Dua benda diambil satu per satu tanpa pengembalian. Tentukan peluang terambil satu ' + kata[0] + ' dan satu ' + kata[1] + '.', beda, { jenis: 'berbeda', langkah: [st(kata[0] + ' lalu ' + kata[1] + ': ' + p.m + '/' + N + ' × ' + p.b + '/' + (N - 1) + '; ' + kata[1] + ' lalu ' + kata[0] + ': ' + p.b + '/' + N + ' × ' + p.m + '/' + (N - 1) + '.'), st('Jumlahkan kedua cara: ' + (2 * p.m * p.b) + '/' + (N * (N - 1)) + ' = ' + pf(beda) + '.', beda)] });
        }),
      lv('Memperkirakan populasi dari sampel', 'Proporsi sampel × banyak populasi', 'angka',
        (r) => ({ n: r.pilih([20, 25, 40, 50, 80]), q: r.bulat(2, 9), mult: r.bulat(2, 12), k: r.bulat(0, 1) }),
        (p, ctx) => {
          const q = Math.min(p.q, p.n - 1), pe = P(q, p.n), N = pe.d * p.mult, ans = (N * pe.n) / pe.d, v = kons(ctx);
          const teks = v === 'umum' ? 'Dari sampel acak ' + p.n + ' siswa, ' + q + ' siswa suka membaca di perpustakaan. Jika seluruh siswa sekolah berjumlah ' + N + ', berapa siswa yang diperkirakan suka membaca di perpustakaan?' : 'Dari sampel acak ' + p.n + ' produk dalam satu lot, ' + q + ' produk cacat. Jika lot terdiri dari ' + N + ' produk, berapa produk cacat yang diperkirakan?';
          const s = S.angka(teks, ans, { jenis: 'perkiraan', langkah: [st('Proporsi sampel = ' + q + '/' + p.n + ' = ' + pf(pe) + '.'), st('Perkiraan populasi = ' + N + ' × ' + pf(pe) + ' = ' + (N / pe.d) + ' × ' + pe.n + ' = ' + ans + '.', (N / pe.d) * pe.n)] });
          s.dibagi = [{ a: N, b: pe.d }]; return s;
        }),
      lv('Peluang paling sedikit satu', '1 − peluang tidak ada', 'pecahan',
        (r) => ({ m: r.bulat(2, 7), b: r.bulat(2, 7), z: r.bulat(0, 1) }),
        (p, ctx) => {
          const N = p.m + p.b, none = CP.pKali(P(p.b, N), P(p.b - 1, N - 1)), ans = CP.pKurang(P(1, 1), none), v = kons(ctx);
          const teks = v === 'umum' ? 'Sebuah kotak berisi ' + p.m + ' bola hijau dan ' + p.b + ' bola kuning. Dua bola diambil tanpa pengembalian. Tentukan peluang terambil paling sedikit satu bola hijau.' : 'Sebuah lot berisi ' + p.m + ' komponen baik dan ' + p.b + ' komponen cacat. Dua komponen diambil tanpa pengembalian untuk diuji. Tentukan peluang paling sedikit satu komponen yang baik.';
          return S.pecahan(teks, ans, { jenis: 'minimalSatu', langkah: [st('Peluang tidak ada yang diinginkan (keduanya ' + (v === 'umum' ? 'kuning' : 'cacat') + ') = ' + p.b + '/' + N + ' × ' + (p.b - 1) + '/' + (N - 1) + ' = ' + pf(none) + '.'), st('Peluang paling sedikit satu = 1 − ' + pf(none) + ' = ' + pf(ans) + '.', ans)] });
        }),
      lv('Soal cerita: pemeriksaan dan harapan', 'Pengambilan sampel mutu', 'pecahan',
        (r, c) => ({ jenis: pilihJenis(r, c, ['dua baik', 'harapan']), tot: r.pilih([20, 25, 30, 40, 50]), bad: r.bulat(2, 6), pr: r.pilih([2, 4, 5, 8, 10]), N: 100 * r.bulat(2, 20), k: r.bulat(0, 1) }),
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'dua baik') {
            const baik = p.tot - p.bad, ans = CP.pKali(P(baik, p.tot), P(baik - 1, p.tot - 1));
            return S.pecahan(v === 'umum' ? 'Dalam kotak terdapat ' + p.tot + ' lampu, ' + p.bad + ' di antaranya rusak. Dua lampu diambil berturut-turut tanpa pengembalian. Tentukan peluang keduanya tidak rusak.' : 'Dari ' + p.tot + ' komponen yang diterima, ' + p.bad + ' komponen cacat. Inspektur mengambil dua komponen berturut-turut tanpa pengembalian. Tentukan peluang keduanya baik.', ans, { jenis: 'duaBaik', langkah: [st('Pengambilan pertama baik: ' + baik + '/' + p.tot + '; kedua baik: ' + (baik - 1) + '/' + (p.tot - 1) + '.'), st(baik + '/' + p.tot + ' × ' + (baik - 1) + '/' + (p.tot - 1) + ' = ' + pf(ans) + '.', ans)] });
          }
          const fh = (p.N * p.pr) / 100;
          const s = S.angka(v === 'umum' ? 'Peluang seorang siswa terlambat ke sekolah adalah ' + p.pr + '%. Dari ' + p.N + ' siswa, berapa siswa yang diperkirakan terlambat?' : 'Peluang sebuah produk cacat adalah ' + p.pr + '%. Dari ' + p.N + ' produk yang dibuat, berapa produk yang diperkirakan cacat?', fh, { jenis: 'harapan', langkah: [st('Perkiraan = banyak × peluang = ' + p.N + ' × ' + p.pr + '/100.'), st(p.N / 100 + ' × ' + p.pr + ' = ' + fh + '.', (p.N / 100) * p.pr)] });
          s.dibagi = [{ a: p.N * p.pr, b: 100 }]; return s;
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
