/* CepatPaham - Tahap 2, Kelas VII: VII-4 Bentuk Aljabar, VII-5 Kesebangunan, VII-6 Data dan Diagram */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, kpk, H } = CP;
  const F = CP.angka, RP = CP.rp, MIN = CP.MIN;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const dec = (p) => CP.desimalStr(p);
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));

  /* ========================= VII-4 BENTUK ALJABAR ========================= */
  const ORDER = ['x²', 'xy', 'y²', 'x', 'y', ''];
  const suku = (c, v) => (Math.abs(c) === 1 && v !== '' ? '' : String(Math.abs(c))) + v;
  const rend = (m) => {
    let s = '';
    ORDER.forEach((v) => { const c = m[v] || 0; if (!c) return; const t = suku(c, v); s += s ? (c < 0 ? ' − ' : ' + ') + t : (c < 0 ? MIN : '') + t; });
    return s || '0';
  };
  const kunciAlj = (m) => ORDER.map((v) => m[v] || 0).join(',');
  const opsiAlj = (m) => ({ t: rend(m), k: kunciAlj(m), v: rend(m) });
  const rendSuku = (list) => list.map((u, i) => { const t = suku(u.c, u.v); return i === 0 ? (u.c < 0 ? MIN : '') + t : (u.c < 0 ? ' − ' : ' + ') + t; }).join('');
  const faktorAlj = (p) => '(x ' + (p < 0 ? MIN : '+') + ' ' + Math.abs(p) + ')';
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };

  CP.aktifkan('VII-4', {
    level: [
      lv('Nilai bentuk aljabar', 'x = 3 → 4x + 5 = 17', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['tambah', 'kurang', 'dua']);
          if (jenis === 'dua') return { jenis, a: r.bulat(2, 9), b: r.bulat(2, 9), x: r.bulat(1, 8), y: r.bulat(1, 8) };
          const a = r.bulat(2, 9), x = r.bulat(2, 9);
          return { jenis, a, x, b: jenis === 'kurang' ? r.bulat(1, a * x) : r.bulat(1, 20) };
        },
        (p) => {
          if (p.jenis === 'dua') {
            const v = p.a * p.x + p.b * p.y;
            return S.angka('Jika x = ' + p.x + ' dan y = ' + p.y + ', berapakah nilai ' + p.a + 'x + ' + p.b + 'y?', v, { jenis: 'dua', langkah: [
              st('Ganti x dengan ' + p.x + ' dan y dengan ' + p.y + ': ' + p.a + ' × ' + p.x + ' + ' + p.b + ' × ' + p.y + '.'),
              st(p.a * p.x + ' + ' + p.b * p.y + ' = ' + v + '.', (p.a * p.x) + (p.b * p.y))] });
          }
          const tam = p.jenis === 'tambah', v = tam ? p.a * p.x + p.b : p.a * p.x - p.b;
          return S.angka('Jika x = ' + p.x + ', berapakah nilai ' + p.a + 'x ' + (tam ? '+' : MIN) + ' ' + p.b + '?', v, { jenis: p.jenis, langkah: [
            st('Ganti x dengan ' + p.x + ': ' + p.a + ' × ' + p.x + (tam ? ' + ' : ' − ') + p.b + '.'),
            st(p.a * p.x + (tam ? ' + ' : ' − ') + p.b + ' = ' + v + '.', tam ? (p.a * p.x) + p.b : (p.a * p.x) - p.b)] });
        }),
      lv('Menyederhanakan suku sejenis', '3x + 5y − x + 2y = 2x + 7y', 'pilihan',
        (r) => {
          let t, sx, sy;
          for (;;) {
            t = r.kocok([{ c: nz(r, -5, 8), v: 'x' }, { c: nz(r, -5, 8), v: 'x' }, { c: nz(r, -5, 8), v: 'y' }, { c: nz(r, -5, 8), v: 'y' }]);
            sx = t.filter((u) => u.v === 'x').reduce((a, u) => a + u.c, 0); sy = t.filter((u) => u.v === 'y').reduce((a, u) => a + u.c, 0);
            if (t[0].c > 0 && sx !== 0 && sy !== 0) break;
          }
          return { t, s: r.bulat(1, 99999) };
        },
        ({ t, s }) => {
          const sx = t.filter((u) => u.v === 'x').reduce((a, u) => a + u.c, 0), sy = t.filter((u) => u.v === 'y').reduce((a, u) => a + u.c, 0);
          const absx = t.filter((u) => u.v === 'x').reduce((a, u) => a + Math.abs(u.c), 0), absy = t.filter((u) => u.v === 'y').reduce((a, u) => a + Math.abs(u.c), 0);
          const benar = opsiAlj({ x: sx, y: sy });
          const salah = [{ xy: sx + sy }, { x: absx, y: absy }, { x: sy, y: sx }, { x: sx + 1, y: sy }, { x: sx, y: sy - 1 }, { x: sx - 1, y: sy + 1 }, { x: sx + 2, y: sy }, { x: sx, y: sy + 2 }].map(opsiAlj);
          const h = CP.rakitPilihan(CP.buatRng(s), benar, salah);
          const xs = t.filter((u) => u.v === 'x').map((u) => u.c), ys = t.filter((u) => u.v === 'y').map((u) => u.c);
          return S.pilihan('Bentuk paling sederhana dari ' + rendSuku(t) + ' adalah …', h, { jenis: 'sejenis', langkah: [
            st('Kelompokkan suku sejenis: suku x dengan suku x, suku y dengan suku y.'),
            st('Suku x: ' + xs.map(mn).join(' + ') + ' = ' + mn(sx) + '. Suku y: ' + ys.map(mn).join(' + ') + ' = ' + mn(sy) + '.'),
            st('Hasilnya ' + rend({ x: sx, y: sy }) + '.', rend({ x: sx, y: sy }))] });
        }),
      lv('Perkalian bentuk aljabar', '3(2x − 4) = 6x − 12', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['dist', 'kuadrat']);
          if (jenis === 'dist') return { jenis, a: r.bulat(2, 9), b: r.bulat(1, 6), cc: nz(r, -9, 9), s: r.bulat(1, 99999) };
          let p, q; do { p = nz(r, -6, 6); q = nz(r, -6, 6); } while (p + q === 0);
          return { jenis, p, q, s: r.bulat(1, 99999) };
        },
        (pr) => {
          if (pr.jenis === 'dist') {
            const { a, b, cc } = pr, ab = a * b, ac = a * cc;
            const benar = opsiAlj({ x: ab, '': ac });
            const salah = [{ x: ab, '': cc }, { x: ab, '': -ac }, { x: a + b, '': ac }, { x: ab, '': a + cc }, { x: b, '': ac }, { x: ab + 1, '': ac }].map(opsiAlj);
            const h = CP.rakitPilihan(CP.buatRng(pr.s), benar, salah);
            return S.pilihan('Hasil dari ' + a + '(' + rend({ x: b, '': cc }) + ') adalah …', h, { jenis: 'dist', langkah: [
              st('Kalikan ' + a + ' dengan setiap suku di dalam kurung.'),
              st(a + ' × ' + b + 'x = ' + ab + 'x dan ' + a + ' × ' + mn(cc) + ' = ' + mn(ac) + '.'),
              st('Hasilnya ' + rend({ x: ab, '': ac }) + '.', rend({ x: ab, '': ac }))] });
          }
          const { p, q } = pr, mid = p + q, k = p * q;
          const benar = opsiAlj({ 'x²': 1, x: mid, '': k });
          const salah = [{ 'x²': 1, '': k }, { 'x²': 1, x: mid, '': -k }, { 'x²': 1, x: k, '': mid }, { 'x²': 1, x: mid, '': mid }, { 'x²': 2, x: mid, '': k }, { 'x²': 1, x: -mid, '': k }].map(opsiAlj);
          const h = CP.rakitPilihan(CP.buatRng(pr.s), benar, salah);
          return S.pilihan('Hasil dari ' + faktorAlj(p) + faktorAlj(q) + ' adalah …', h, { jenis: 'kuadrat', langkah: [
            st('Kalikan tiap suku: x·x + x·(' + mn(q) + ') + (' + mn(p) + ')·x + (' + mn(p) + ')(' + mn(q) + ').'),
            st('Jumlahkan suku x: ' + mn(q) + ' + ' + mn(p) + ' = ' + mn(mid) + ', dan suku tetap ' + mn(p) + ' × ' + mn(q) + ' = ' + mn(k) + '.'),
            st('Hasilnya ' + rend({ 'x²': 1, x: mid, '': k }) + '.', rend({ 'x²': 1, x: mid, '': k }))] });
        }),
      lv('Persamaan linear satu variabel', '3x + 5 = 20 → x = 5', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['dasar', 'kurang', 'duaSisi', 'bagi']);
          const x = r.bulat(1, 15);
          if (jenis === 'dasar') { const a = r.bulat(2, 9), b = r.bulat(1, 20); return { jenis, a, b, x }; }
          if (jenis === 'kurang') { const a = r.bulat(2, 9); return { jenis, a, b: r.bulat(1, a * x), x }; }
          if (jenis === 'bagi') return { jenis, a: r.bulat(2, 6), b: r.bulat(1, 12), x };
          const cc = r.bulat(1, 5), a = cc + r.bulat(1, 5), b = r.bulat(1, 15); return { jenis, a, b, cc, x };
        },
        (p) => {
          if (p.jenis === 'dasar') {
            const c = p.a * p.x + p.b;
            const s = S.angka('Tentukan nilai x jika ' + p.a + 'x + ' + p.b + ' = ' + c + '.', p.x, { jenis: 'dasar', langkah: [
              st('Pindahkan ' + p.b + ' ke kanan: ' + p.a + 'x = ' + c + ' − ' + p.b + ' = ' + (c - p.b) + '.'),
              st('Bagi dengan ' + p.a + ': x = ' + (c - p.b) + ' ÷ ' + p.a + ' = ' + p.x + '.', (c - p.b) / p.a)] });
            s.dibagi = [{ a: c - p.b, b: p.a }]; return s;
          }
          if (p.jenis === 'kurang') {
            const c = p.a * p.x - p.b;
            const s = S.angka('Tentukan nilai x jika ' + p.a + 'x − ' + p.b + ' = ' + c + '.', p.x, { jenis: 'kurang', langkah: [
              st('Pindahkan ' + p.b + ' ke kanan (jadi tambah): ' + p.a + 'x = ' + c + ' + ' + p.b + ' = ' + (c + p.b) + '.'),
              st('Bagi dengan ' + p.a + ': x = ' + (c + p.b) + ' ÷ ' + p.a + ' = ' + p.x + '.', (c + p.b) / p.a)] });
            s.dibagi = [{ a: c + p.b, b: p.a }]; return s;
          }
          if (p.jenis === 'bagi') {
            const c = p.x / p.a + p.b; // x kelipatan a? pastikan
            const x = p.a * p.x, cc = p.x + p.b;
            const s = S.angka('Tentukan nilai x jika x/' + p.a + ' + ' + p.b + ' = ' + cc + '.', x, { jenis: 'bagi', langkah: [
              st('Pindahkan ' + p.b + ' ke kanan: x/' + p.a + ' = ' + cc + ' − ' + p.b + ' = ' + (cc - p.b) + '.'),
              st('Kalikan dengan ' + p.a + ': x = ' + (cc - p.b) + ' × ' + p.a + ' = ' + x + '.', (cc - p.b) * p.a)] });
            return s;
          }
          const d = (p.a - p.cc) * p.x + p.b;
          const s = S.angka('Tentukan nilai x jika ' + p.a + 'x + ' + p.b + ' = ' + p.cc + 'x + ' + d + '.', p.x, { jenis: 'duaSisi', langkah: [
            st('Kumpulkan suku x di kiri: ' + p.a + 'x − ' + p.cc + 'x = ' + d + ' − ' + p.b + ', yaitu ' + (p.a - p.cc) + 'x = ' + (d - p.b) + '.'),
            st('Bagi dengan ' + (p.a - p.cc) + ': x = ' + (d - p.b) + ' ÷ ' + (p.a - p.cc) + ' = ' + p.x + '.', (d - p.b) / (p.a - p.cc))] });
          s.dibagi = [{ a: d - p.b, b: p.a - p.cc }]; return s;
        }),
      lv('Pertidaksamaan linear satu variabel', '3x − 5 > 10 → x > 5', 'pilihan',
        (r) => ({ a: nz(r, -6, 6), b: nz(r, -12, 12), t: r.bulat(-8, 12), rel: r.pilih(['>', '<', '≥', '≤']), s: r.bulat(1, 99999) }),
        ({ a, b, t, rel, s }) => {
          const c = a * t + b, balik = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
          const akhirRel = a < 0 ? balik[rel] : rel;
          const op = (x, y) => ({ t: 'x ' + x + ' ' + F(y), k: x + y, v: 'x ' + x + ' ' + F(y) });
          const benar = op(akhirRel, t);
          const salah = [a < 0 ? op(rel, t) : op(balik[rel], t), op(balik[akhirRel], t), op(akhirRel, Math.trunc(c / a) === t ? t + 1 : Math.round(c / a)), op(akhirRel, t + 1), op(akhirRel, t - 1), op(akhirRel, -t)];
          const h = CP.rakitPilihan(CP.buatRng(s), benar, salah);
          const ruas = (a < 0 ? MIN : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x ' + (b < 0 ? MIN : '+') + ' ' + Math.abs(b);
          return S.pilihan('Himpunan penyelesaian dari ' + ruas + ' ' + rel + ' ' + F(c) + ' adalah …', h, { jenis: a < 0 ? 'balik' : 'biasa', langkah: [
            st('Pindahkan ' + mn(b) + (b < 0 ? ' (tambah ' + Math.abs(b) + ')' : ' (kurangi ' + b + ')') + ' ke kanan: ' + (a < 0 ? MIN : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x ' + rel + ' ' + F(c - b) + '.'),
            st('Bagi dengan ' + mn(a) + (a < 0 ? '. Dibagi bilangan negatif, tanda pertidaksamaan dibalik.' : '.') ),
            st('Penyelesaian: x ' + akhirRel + ' ' + F(t) + '.', 'x ' + akhirRel + ' ' + F(t))] });
        }),
      lv('Soal cerita aljabar', 'Tabungan + tambahan per minggu', 'angka',
        (r, c) => ({ k: r.bulat(0, 2), a: r.bulat(2, 9), b: r.bulat(1, 15), x: r.bulat(2, 14), nama: r.pilih(CP.NAMA) }),
        ({ k, a, b, x, nama }, ctx) => {
          const c = a * x + b; const v = kons(ctx);
          let teks, satuan;
          if (v === 'umum') {
            if (k === 0) { teks = nama + ' sudah memiliki tabungan Rp' + b + '.000. Setiap minggu ia menabung Rp' + a + '.000. Tabungannya menjadi Rp' + c + '.000 setelah berapa minggu?'; satuan = 'minggu'; }
            else if (k === 1) { teks = 'Umur ayah ' + b + ' tahun lebih tua dari ' + a + ' kali umur ' + nama + '. Jika umur ayah ' + c + ' tahun, berapa umur ' + nama + '?'; satuan = 'tahun'; }
            else { teks = nama + ' membeli beberapa buku seharga Rp' + a + '.000 per buku, ditambah ongkos kirim Rp' + b + '.000. Total yang dibayar Rp' + c + '.000. Berapa buku yang dibeli?'; satuan = 'buku'; }
          } else {
            if (k === 0) { teks = 'Biaya tetap produksi sebuah bengkel Rp' + b + '.000. Setiap unit pesanan menambah biaya Rp' + a + '.000. Jika total biaya Rp' + c + '.000, berapa unit pesanan yang dikerjakan?'; satuan = 'unit'; }
            else if (k === 1) { teks = 'Toko online ' + nama + ' memberi gaji tetap Rp' + b + '.000 ditambah komisi Rp' + a + '.000 per paket terjual. Jika gaji bulan ini Rp' + c + '.000, berapa paket yang terjual?'; satuan = 'paket'; }
            else { teks = 'Kain sepanjang ' + c + ' meter dipakai membuat seragam. Tiap seragam memerlukan ' + a + ' meter dan tersisa ' + b + ' meter. Berapa seragam yang dibuat?'; satuan = 'seragam'; }
          }
          const s = S.angka(teks, x, { jenis: 'cerita' + k, satuan, langkah: [
            st('Buat persamaan: ' + a + ' × (banyaknya) + ' + b + ' = ' + c + ', yaitu ' + a + 'x + ' + b + ' = ' + c + '.'),
            st(a + 'x = ' + c + ' − ' + b + ' = ' + (c - b) + ', maka x = ' + (c - b) + ' ÷ ' + a + ' = ' + x + '.', (c - b) / a)] });
          s.dibagi = [{ a: c - b, b: a }];
          return s;
        })
    ]
  });

  CP.alj = { rend, kunciAlj, opsiAlj };

  /* ========================= VII-5 KESEBANGUNAN ========================= */
  const RAS = [[2, 1], [3, 1], [3, 2], [5, 2], [4, 3], [5, 3]];
  const gbrPP = (w1, h1, w2, h2, l) => {
    const s = Math.min(230 / (w1 + w2), 100 / Math.max(h1, h2)), x1 = 14, y = 34, x2 = 14 + w1 * s + 46;
    return { tipe: 'gambar', alt: 'Dua persegi panjang sebangun: ' + l.join(', '), tinggi: Math.max(h1, h2) * s + 56, el: [
      H.r(x1, y, w1 * s, h1 * s, 'isi'), H.t(x1 + w1 * s / 2, y - 7, l[0], 'middle', 'tebal'), H.t(x1 + w1 * s + 5, y + h1 * s / 2 + 4, l[1], 'start', 'tebal'),
      H.r(x2, y, w2 * s, h2 * s, 'isi2'), H.t(x2 + w2 * s / 2, y - 7, l[2], 'middle', 'tebal'), H.t(x2 + w2 * s + 5, y + h2 * s / 2 + 4, l[3], 'start', 'tebal')] };
  };
  function paramPP(r, c) {
    const [p, q] = r.pilih(RAS); let m1, m2; do { m1 = r.bulat(2, 6); m2 = r.bulat(2, 6); } while (m1 === m2);
    return { p, q, m1, m2, arah: pilihJenis(r, c, ['besar', 'kecil']) };
  }
  function soalPP(pr, teksFn, jenis) {
    const { p, q, m1, m2, arah } = pr;
    const kecil = [q * m1, q * m2], besar = [p * m1, p * m2];
    const dari = arah === 'besar' ? kecil : besar, ke = arah === 'besar' ? besar : kecil;
    const ans = (dari[1] * ke[0]) / dari[0];
    const lab = arah === 'besar' ? [dari[0], dari[1], ke[0], '?'] : [ke[0], '?', dari[0], dari[1]]; // kiri = kecil, kanan = besar
    const s = S.angka(teksFn(dari, ke), ans, { jenis: jenis + ':' + arah, satuan: 'cm', langkah: [
      st('Sisi-sisi yang bersesuaian pada bangun sebangun memiliki perbandingan sama: ' + ke[0] + '/' + dari[0] + ' = ? / ' + dari[1] + '.'),
      st('? = ' + dari[1] + ' × ' + ke[0] + ' ÷ ' + dari[0] + ' = ' + (dari[1] * ke[0]) + ' ÷ ' + dari[0] + ' = ' + ans + ' cm.', (dari[1] * ke[0]) / dari[0])] });
    s.dibagi = [{ a: dari[1] * ke[0], b: dari[0] }];
    s.gambar = arah === 'besar' ? gbrPP(kecil[0], kecil[1], besar[0], besar[1], [kecil[0], kecil[1], besar[0], '?']) : gbrPP(kecil[0], kecil[1], besar[0], besar[1], [kecil[0], '?', besar[0], besar[1]]);
    return s;
  }
  const TRI = [[4, 5, 6], [5, 6, 7], [6, 7, 8], [5, 7, 8], [6, 8, 9], [7, 8, 9], [3, 4, 5], [4, 6, 7], [5, 8, 9]];
  const ROTASI = ['a', 'b', 'c'];

  CP.aktifkan('VII-5', {
    level: [
      lv('Sisi bersesuaian pada persegi panjang sebangun', '4 × 6 sebangun dengan 6 × ?', 'angka',
        (r, c) => paramPP(r, c),
        (pr) => soalPP(pr, (dari, ke) => 'Dua persegi panjang sebangun. Persegi panjang ' + (dari[0] < ke[0] ? 'pertama' : 'kedua') + ' berukuran ' + dari[0] + ' cm × ' + dari[1] + ' cm. Persegi panjang ' + (dari[0] < ke[0] ? 'kedua' : 'pertama') + ' memiliki panjang ' + ke[0] + ' cm. Berapa lebarnya?', 'pp')),
      lv('Segitiga sebangun', 'Sisi 4, 5, 6 sebangun dengan sisi terpanjang 12', 'angka',
        (r) => ({ t: r.pilih(TRI), k: r.bulat(2, 4), tanya: r.bulat(0, 2), arah: 'besar' }),
        ({ t, k, tanya, arah }) => {
          const kecil = t.slice(), besar = t.map((x) => x * k), nama = ['BC', 'CA', 'AB'], nama2 = ['QR', 'RP', 'PQ'];
          const dikenal = (tanya + 1) % 3; // sisi besar yang diketahui
          const ans = arah === 'besar' ? besar[tanya] : kecil[tanya];
          const ketA = arah === 'besar' ? kecil : besar, ketB = arah === 'besar' ? besar : kecil;
          const lab1 = arah === 'besar' ? kecil.map(String) : [tanya === 0 ? '?' : String(kecil[0]), tanya === 1 ? '?' : String(kecil[1]), tanya === 2 ? '?' : String(kecil[2])];
          const lab2 = arah === 'besar' ? [tanya === 0 ? '?' : String(besar[0]), tanya === 1 ? '?' : String(besar[1]), tanya === 2 ? '?' : String(besar[2])] : besar.map(String);
          const maksK = Math.min(90, 250 / (1 + k)), maksB = maksK * k;
          const g1 = H.segitigaBerlabel(kecil[0], kecil[1], kecil[2], 14, 150, maksK, lab1[0], lab1[1], lab1[2], 'isi');
          const g2 = H.segitigaBerlabel(besar[0], besar[1], besar[2], 14 + maksK + 50, 150, maksB, lab2[0], lab2[1], lab2[2], 'isi2');
          const s = S.angka('Segitiga ABC sebangun dengan segitiga PQR. Sisi-sisi ABC adalah BC = ' + kecil[0] + ' cm, CA = ' + kecil[1] + ' cm, AB = ' + kecil[2] + ' cm. Pada PQR, ' + nama2[dikenal] + ' = ' + besar[dikenal] + ' cm (bersesuaian dengan ' + nama[dikenal] + '). Berapa panjang ' + (arah === 'besar' ? nama2[tanya] : nama[tanya]) + '?', ans, { jenis: 'tri:' + arah, satuan: 'cm', langkah: [
            st('Faktor skala = ' + besar[dikenal] + ' ÷ ' + kecil[dikenal] + ' = ' + k + '.'),
            st(arah === 'besar' ? nama2[tanya] + ' = ' + kecil[tanya] + ' × ' + k + ' = ' + ans + ' cm.' : nama[tanya] + ' = ' + besar[tanya] + ' ÷ ' + k + ' = ' + ans + ' cm.', arah === 'besar' ? kecil[tanya] * k : besar[tanya] / k)] });
          s.dibagi = [{ a: besar[dikenal], b: kecil[dikenal] }];
          if (arah === 'kecil') s.dibagi.push({ a: besar[tanya], b: k });
          s.gambar = { tipe: 'gambar', alt: 'Dua segitiga sebangun, segitiga kedua ' + k + ' kali lebih besar', tinggi: 172, el: [...g1.el, ...g2.el, H.t(14, 14, 'ABC', 'start', 'kecil'), H.t(14 + maksK + 50, 14, 'PQR', 'start', 'kecil')] };
          return s;
        }),
      lv('Tinggi dan bayangan', 'Tiang 2 m, bayangan 3 m', 'angka',
        (r, c) => { const [i, j] = r.pilih([[2, 3], [3, 4], [4, 5], [3, 2], [5, 4], [2, 1], [3, 1]]); return { i, j, m: r.bulat(1, 4), n: r.bulat(2, 6), tanya: r.pilih(['tinggi', 'bayangan']), k: r.bulat(0, 3) }; },
        ({ i, j, m, n, tanya, k }, ctx) => {
          const t1 = i * m, s1 = j * m, t2 = i * n, s2 = j * n;
          const v = kons(ctx);
          const benda = v === 'umum' ? [['tiang bendera', 'pohon mangga'], ['tongkat', 'tiang listrik'], ['anak', 'pohon beringin'], ['tiang pagar', 'gedung sekolah']][k] : [['tiang spanduk', 'papan reklame toko'], ['galah ukur', 'menara pemancar'], ['pilar kecil', 'tiang tower'], ['tiang penyangga', 'cerobong pabrik']][k];
          const teks = tanya === 'tinggi'
            ? 'Pada waktu yang sama, ' + benda[0] + ' setinggi ' + t1 + ' m memiliki bayangan ' + s1 + ' m. Jika bayangan ' + benda[1] + ' ' + s2 + ' m, berapa tinggi ' + benda[1] + '?'
            : 'Pada waktu yang sama, ' + benda[0] + ' setinggi ' + t1 + ' m memiliki bayangan ' + s1 + ' m. Jika ' + benda[1] + ' setinggi ' + t2 + ' m, berapa panjang bayangannya?';
          const ans = tanya === 'tinggi' ? t2 : s2;
          const sk = Math.min(250 / (s1 + s2 + 1.5), 90 / Math.max(t1, t2)), gy = 118, x1 = 20, x2 = 20 + s1 * sk + 36;
          const el = [H.l(8, gy, 312, gy, 'tipis'),
            H.l(x1, gy, x1, gy - t1 * sk, 'garis'), H.l(x1, gy, x1 + s1 * sk, gy, 'merah'), H.l(x1, gy - t1 * sk, x1 + s1 * sk, gy, 'putus'),
            H.t(x1 - 5, gy - t1 * sk / 2 + 4, t1, 'end', 'tebal'), H.t(x1 + s1 * sk / 2, gy + 16, s1, 'middle', 'tebal'),
            H.l(x2, gy, x2, gy - t2 * sk, 'garis'), H.l(x2, gy, x2 + s2 * sk, gy, 'merah'), H.l(x2, gy - t2 * sk, x2 + s2 * sk, gy, 'putus'),
            H.t(x2 - 5, gy - t2 * sk / 2 + 4, tanya === 'tinggi' ? '?' : t2, 'end', 'tebal'), H.t(x2 + s2 * sk / 2, gy + 16, tanya === 'tinggi' ? s2 : '?', 'middle', 'tebal')];
          const s = S.angka(teks, ans, { jenis: 'bayang:' + tanya, satuan: 'm', langkah: [
            st('Segitiga yang dibentuk benda dan bayangannya sebangun, jadi tinggi : bayangan sama.'),
            st(tanya === 'tinggi' ? t1 + '/' + s1 + ' = ? / ' + s2 + ', maka ? = ' + t1 + ' × ' + s2 + ' ÷ ' + s1 + ' = ' + ans + ' m.' : t1 + '/' + s1 + ' = ' + t2 + ' / ?, maka ? = ' + s1 + ' × ' + t2 + ' ÷ ' + t1 + ' = ' + ans + ' m.', tanya === 'tinggi' ? (t1 * s2) / s1 : (s1 * t2) / t1)] });
          s.dibagi = tanya === 'tinggi' ? [{ a: t1 * s2, b: s1 }] : [{ a: s1 * t2, b: t1 }];
          s.gambar = { tipe: 'gambar', alt: 'Dua benda tegak dengan bayangannya di tanah', tinggi: 146, el };
          return s;
        }),
      lv('Garis sejajar pada segitiga', 'DE // BC → AD/AB = DE/BC', 'angka',
        (r, c) => ({ a: r.bulat(2, 6), b: r.bulat(1, 6), n: r.bulat(1, 4), jenis: pilihJenis(r, c, ['de', 'bc']) }),
        ({ a, b, n, jenis }) => {
          const BC = (a + b) * n, DE = a * n;
          const rr = a / (a + b), A = [160, 26], B = [40, 128], C = [280, 128], D = [A[0] + rr * (B[0] - A[0]), A[1] + rr * (B[1] - A[1])], E = [A[0] + rr * (C[0] - A[0]), A[1] + rr * (C[1] - A[1])];
          const el = [H.p([A, B, C], 'kosong'), H.l(D[0], D[1], E[0], E[1], 'merah'), H.t(A[0], A[1] - 4, 'A', 'middle', 'tebal'), H.t(B[0] - 8, B[1] + 14, 'B', 'middle', 'tebal'), H.t(C[0] + 8, C[1] + 14, 'C', 'middle', 'tebal'), H.t(D[0] - 8, D[1] + 4, 'D', 'end', 'tebal'), H.t(E[0] + 8, E[1] + 4, 'E', 'start', 'tebal'),
            H.t((A[0] + D[0]) / 2 - 12, (A[1] + D[1]) / 2, 'AD=' + a, 'end', 'kecil'), H.t((D[0] + B[0]) / 2 - 12, (D[1] + B[1]) / 2, 'DB=' + b, 'end', 'kecil'),
            H.t(160, 144, jenis === 'bc' ? 'BC = ?' : 'BC = ' + BC, 'middle', 'tebal'), H.t((D[0] + E[0]) / 2, D[1] - 6, jenis === 'bc' ? 'DE = ' + DE : 'DE = ?', 'middle', 'tebal')];
          const ans = jenis === 'de' ? DE : BC;
          const s = S.angka('Pada segitiga ABC, titik D di AB dan E di AC sehingga DE sejajar BC. AD = ' + a + ' cm, DB = ' + b + ' cm, dan ' + (jenis === 'de' ? 'BC = ' + BC + ' cm. Berapa panjang DE?' : 'DE = ' + DE + ' cm. Berapa panjang BC?'), ans, { jenis: 'sejajar:' + jenis, satuan: 'cm', langkah: [
            st('Segitiga ADE sebangun dengan ABC, sehingga AD/AB = DE/BC dengan AB = ' + a + ' + ' + b + ' = ' + (a + b) + '.'),
            st(jenis === 'de' ? 'DE = ' + BC + ' × ' + a + ' ÷ ' + (a + b) + ' = ' + DE + ' cm.' : 'BC = ' + DE + ' × ' + (a + b) + ' ÷ ' + a + ' = ' + BC + ' cm.', jenis === 'de' ? (BC * a) / (a + b) : (DE * (a + b)) / a)] });
          s.dibagi = jenis === 'de' ? [{ a: BC * a, b: a + b }] : [{ a: DE * (a + b), b: a }];
          s.gambar = { tipe: 'gambar', alt: 'Segitiga ABC dengan garis DE sejajar BC', tinggi: 152, el };
          return s;
        }),
      lv('Perbandingan keliling dan luas', 'Sisi 2 : 3, luas kecil 40 → luas besar 90', 'angka',
        (r, c) => { const [p, q] = r.pilih(RAS); return { p, q, m: r.bulat(1, 6), jenis: pilihJenis(r, c, ['luas', 'keliling', 'luasKecil']) }; },
        ({ p, q, m, jenis }) => {
          let teks, ans, langkah, lab = ['', ''], satuan;
          if (jenis === 'luas') { const Lk = q * q * m; ans = p * p * m; satuan = 'cm²'; teks = 'Dua persegi panjang sebangun memiliki perbandingan panjang sisi ' + q + ' : ' + p + '. Luas persegi panjang yang kecil ' + Lk + ' cm². Berapa luas yang besar?'; langkah = [st('Perbandingan luas = kuadrat perbandingan sisi = ' + q + '² : ' + p + '² = ' + (q * q) + ' : ' + (p * p) + '.'), st('Luas besar = ' + Lk + ' ÷ ' + (q * q) + ' × ' + (p * p) + ' = ' + (Lk / (q * q)) + ' × ' + (p * p) + ' = ' + ans + ' cm².', (Lk / (q * q)) * (p * p))]; lab = ['L = ' + Lk, 'L = ?']; }
          else if (jenis === 'luasKecil') { const Lb = p * p * m; ans = q * q * m; satuan = 'cm²'; teks = 'Dua persegi panjang sebangun memiliki perbandingan panjang sisi ' + q + ' : ' + p + '. Luas persegi panjang yang besar ' + Lb + ' cm². Berapa luas yang kecil?'; langkah = [st('Perbandingan luas = ' + q + '² : ' + p + '² = ' + (q * q) + ' : ' + (p * p) + '.'), st('Luas kecil = ' + Lb + ' ÷ ' + (p * p) + ' × ' + (q * q) + ' = ' + (Lb / (p * p)) + ' × ' + (q * q) + ' = ' + ans + ' cm².', (Lb / (p * p)) * (q * q))]; lab = ['L = ?', 'L = ' + Lb]; }
          else { const Kk = q * m * 2; ans = p * m * 2; satuan = 'cm'; teks = 'Dua persegi panjang sebangun memiliki perbandingan panjang sisi ' + q + ' : ' + p + '. Keliling persegi panjang yang kecil ' + Kk + ' cm. Berapa keliling yang besar?'; langkah = [st('Perbandingan keliling sama dengan perbandingan sisi, yaitu ' + q + ' : ' + p + '.'), st('Keliling besar = ' + Kk + ' ÷ ' + q + ' × ' + p + ' = ' + (Kk / q) + ' × ' + p + ' = ' + ans + ' cm.', (Kk / q) * p)]; lab = ['K = ' + Kk, 'K = ?']; }
          const s = S.angka(teks, ans, { jenis: 'rasio:' + jenis, satuan, langkah });
          s.dibagi = jenis === 'luas' ? [{ a: q * q * m, b: q * q }] : jenis === 'luasKecil' ? [{ a: p * p * m, b: p * p }] : [{ a: q * m * 2, b: q }];
          const g = gbrPP(q * 3, q * 2, p * 3, p * 2, [q, '', p, '']);
          g.el = g.el.filter((e) => e.k !== 't');
          const sc = Math.min(230 / (q * 3 + p * 3), 100 / (Math.max(q, p) * 2));
          g.el.push(H.t(14 + q * 1.5 * sc, 26, lab[0], 'middle', 'tebal'), H.t(14 + q * 3 * sc + 46 + p * 1.5 * sc, 26, lab[1], 'middle', 'tebal'));
          g.alt = 'Dua persegi panjang sebangun, rasio sisi ' + q + ' : ' + p;
          s.gambar = g;
          return s;
        }),
      lv('Soal cerita kesebangunan', 'Foto diperbesar, gambar kerja, spanduk', 'angka',
        (r, c) => Object.assign(paramPP(r, c), { k: r.bulat(0, 3) }),
        (pr, ctx) => {
          const v = kons(ctx), k = pr.k;
          const kata = v === 'umum'
            ? [['foto', 'Sebuah foto'], ['lukisan', 'Sebuah poster'], ['maket', 'Sebuah maket lapangan'], ['peta', 'Sebuah denah kelas']][k]
            : [['spanduk', 'Desain spanduk toko'], ['gambar kerja', 'Gambar kerja komponen mesin'], ['pola', 'Pola potongan seragam'], ['banner', 'Desain banner toko online']][k];
          const s = soalPP(pr, (dari, ke) => kata[1] + ' berukuran ' + dari[0] + ' cm × ' + dari[1] + ' cm dibuat ' + (pr.arah === 'besar' ? 'versi yang diperbesar' : 'versi yang diperkecil') + ' dengan bentuk sebangun. Panjang pada ukuran baru ' + ke[0] + ' cm. Berapa lebar pada ukuran baru?', 'cerita' + k);
          return s;
        })
    ]
  });

  /* ========================= VII-6 DATA DAN DIAGRAM ========================= */
  const batangGbr = (kat, vals, maks, judul) => {
    const X0 = 36, X1 = 312, Y0 = 20, Y1 = 130, lebarSlot = (X1 - X0) / kat.length;
    const el = [H.l(X0, Y0, X0, Y1, 'garis'), H.l(X0, Y1, X1, Y1, 'garis')];
    [0, 0.5, 1].forEach((f) => { const y = Y1 - (Y1 - Y0 - 10) * f; el.push(H.l(X0, y, X1, y, 'tipis'), H.t(X0 - 4, y + 4, Math.round(maks * f), 'end', 'kecil')); });
    kat.forEach((k, i) => {
      const h = (Y1 - Y0 - 10) * (vals[i] / maks), x = X0 + i * lebarSlot + lebarSlot * 0.18;
      el.push(H.r(x, Y1 - h, lebarSlot * 0.64, h, ['isi', 'isi2', 'isi3', 'isi'][i % 4]), H.t(x + lebarSlot * 0.32, Y1 - h - 4, vals[i], 'middle', 'tebal'), H.t(x + lebarSlot * 0.32, Y1 + 15, k, 'middle', 'kecil'));
    });
    return { tipe: 'gambar', alt: judul + ': ' + kat.map((k, i) => k + ' ' + vals[i]).join(', '), tinggi: 150, el };
  };
  const pieGbr = (nama, sudut, label, judul) => {
    const cx = 160, cy = 82, R = 52; const el = []; let a0 = -90;
    sudut.forEach((s, i) => {
      const a1 = a0 + s, r0 = (a0 * Math.PI) / 180, r1 = (a1 * Math.PI) / 180;
      const d = 'M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(r0)).toFixed(1) + ' ' + (cy + R * Math.sin(r0)).toFixed(1) + ' A' + R + ' ' + R + ' 0 ' + (s > 180 ? 1 : 0) + ' 1 ' + (cx + R * Math.cos(r1)).toFixed(1) + ' ' + (cy + R * Math.sin(r1)).toFixed(1) + ' Z';
      el.push(H.d(d, ['isi', 'isi2', 'isi3', 'kosong'][i % 4]));
      const rm = (((a0 + a1) / 2) * Math.PI) / 180, lx = cx + (R + 8) * Math.cos(rm), ly = cy + (R + 8) * Math.sin(rm);
      el.push(H.t(lx, ly + (Math.sin(rm) > 0.3 ? 12 : 3), nama[i] + ' ' + label[i], Math.cos(rm) > 0.2 ? 'start' : Math.cos(rm) < -0.2 ? 'end' : 'middle', 'tebal'));
      a0 = a1;
    });
    return { tipe: 'gambar', alt: judul, tinggi: 164, el };
  };
  const bagi4 = (r, N) => { for (;;) { const c1 = r.bulat(Math.ceil(N / 10), Math.floor(N / 2)), c2 = r.bulat(Math.ceil(N / 10), Math.floor(N / 2)), c3 = r.bulat(Math.ceil(N / 10), Math.floor(N / 2)), c4 = N - c1 - c2 - c3; if (c4 >= Math.ceil(N / 10) && c4 <= N / 2) return [c1, c2, c3, c4]; } };
  CP.gbr = { batangGbr, pieGbr };
  const daftar = (a) => a.join(', ');
  const rataStr = (list) => { const p = P(list.reduce((x, y) => x + y, 0), list.length); return p; };

  CP.aktifkan('VII-6', {
    level: [
      lv('Membaca diagram batang', 'Nilai, selisih, dan jumlah dari diagram', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['nilai', 'selisih', 'jumlah']);
          const vals = []; while (vals.length < 4) { const v = 5 * r.bulat(2, 12); if (vals.indexOf(v) < 0) vals.push(v); }
          const idx = r.kocok([0, 1, 2, 3]);
          return { jenis, vals, i: idx[0], j: idx[1], sk: r.bulat(0, 1) };
        },
        (pr, ctx) => {
          const v = kons(ctx);
          const sets = v === 'umum' ? [['Bola', 'Voli', 'Renang', 'Basket'], ['Apel', 'Jeruk', 'Mangga', 'Pisang']] : [['Kaus', 'Topi', 'Tas', 'Jaket'], ['Roti', 'Kue', 'Donat', 'Pie']];
          const kat = sets[pr.sk], judul = v === 'umum' ? (pr.sk === 0 ? 'Siswa peserta ekstrakurikuler' : 'Buah favorit siswa (orang)') : (pr.sk === 0 ? 'Produk terjual per minggu (buah)' : 'Produksi harian bagian roti (buah)');
          const vals = pr.vals, i = pr.i, j = pr.j; const maks = Math.max(...vals) + 10;
          const skala = Math.ceil(maks / 10) * 10;
          let teks, ans, langkah;
          const g = batangGbr(kat, vals, skala, 'Diagram batang ' + judul);
          if (pr.jenis === 'nilai') { teks = 'Perhatikan diagram batang tentang ' + judul.toLowerCase() + '. Berapa nilai untuk ' + kat[i] + '?'; ans = vals[i]; langkah = [st('Baca tinggi batang ' + kat[i] + ' pada sumbu tegak.'), st(kat[i] + ' = ' + vals[i] + '.', vals[i])]; }
          else if (pr.jenis === 'selisih') { const [a, b] = vals[i] > vals[j] ? [i, j] : [j, i]; teks = 'Perhatikan diagram batang tentang ' + judul.toLowerCase() + '. Berapa selisih nilai ' + kat[a] + ' dan ' + kat[b] + '?'; ans = vals[a] - vals[b]; langkah = [st('Baca ' + kat[a] + ' = ' + vals[a] + ' dan ' + kat[b] + ' = ' + vals[b] + '.'), st(vals[a] + ' − ' + vals[b] + ' = ' + ans + '.', vals[a] - vals[b])]; }
          else { teks = 'Perhatikan diagram batang tentang ' + judul.toLowerCase() + '. Berapa jumlah seluruh nilai pada diagram?'; ans = vals.reduce((a, b) => a + b, 0); langkah = [st('Baca semua batang: ' + vals.join(', ') + '.'), st(vals.join(' + ') + ' = ' + ans + '.', vals.reduce((a, b) => a + b, 0))]; }
          return S.angka(teks, ans, { jenis: pr.jenis, langkah, gambar: g });
        }),
      lv('Rata-rata (mean) data tunggal', '70, 80, 90 → 80', 'angka',
        (r) => {
          const n = r.bulat(5, 8), mu = r.bulat(60, 92); let d;
          for (;;) { d = []; for (let i = 0; i < n - 1; i++) d.push(r.bulat(-14, 14)); const last = -d.reduce((a, b) => a + b, 0); if (Math.abs(last) <= 14) { d.push(last); break; } }
          return { mu, data: r.kocok(d.map((x) => mu + x)), k: r.bulat(0, 1) };
        },
        ({ mu, data, k }, ctx) => {
          const v = kons(ctx), jml = data.reduce((a, b) => a + b, 0);
          const teks = v === 'umum' ? 'Nilai ulangan matematika ' + data.length + ' siswa: ' + daftar(data) + '. Berapa rata-rata nilainya?' : 'Penjualan harian sebuah toko online selama ' + data.length + ' hari (dalam paket): ' + daftar(data) + '. Berapa rata-rata penjualan per hari?';
          const s = S.angka(teks, mu, { jenis: 'mean', langkah: [
            st('Rata-rata = jumlah data ÷ banyak data.'),
            st('Jumlah = ' + data.join(' + ') + ' = ' + jml + '. Banyak data = ' + data.length + '.'),
            st(jml + ' ÷ ' + data.length + ' = ' + mu + '.', jml / data.length)] });
          s.dibagi = [{ a: jml, b: data.length }];
          return s;
        }),
      lv('Median dan modus', 'Data diurutkan lalu ambil nilai tengah', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['median', 'modus']);
          const n = r.bulat(6, 10);
          for (;;) {
            const data = []; for (let i = 0; i < n; i++) data.push(r.bulat(4, 10));
            const cnt = {}; data.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; });
            const mx = Math.max(...Object.values(cnt)); const mods = Object.keys(cnt).filter((x) => cnt[x] === mx);
            if (jenis === 'modus' && !(mods.length === 1 && mx >= 2)) continue;
            return { jenis, data, k: r.bulat(0, 1) };
          }
        },
        ({ jenis, data }, ctx) => {
          const v = kons(ctx), urut = data.slice().sort((a, b) => a - b), n = urut.length;
          const sat = v === 'umum' ? 'nilai ujian' : 'jumlah pesanan per hari';
          if (jenis === 'median') {
            const med = n % 2 ? P(urut[(n - 1) / 2], 1) : P(urut[n / 2 - 1] + urut[n / 2], 2);
            const tgh = n % 2 ? 'Nilai tengah adalah data ke-' + ((n + 1) / 2) + ' = ' + urut[(n - 1) / 2] + '.' : 'Dua nilai tengah: ' + urut[n / 2 - 1] + ' dan ' + urut[n / 2] + '. Rata-ratanya (' + urut[n / 2 - 1] + ' + ' + urut[n / 2] + ') ÷ 2.';
            return S.angka('Data ' + sat + ': ' + daftar(data) + '. Tentukan median data tersebut.', med, { jenis: 'median', izin: { koma: true }, langkah: [
              st('Urutkan data dari kecil ke besar: ' + daftar(urut) + '.'), st(tgh), st('Median = ' + dec(med) + '.', med)] });
          }
          const cnt = {}; data.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; });
          const mx = Math.max(...Object.values(cnt)), mod = +Object.keys(cnt).find((x) => cnt[x] === mx);
          return S.angka('Data ' + sat + ': ' + daftar(data) + '. Tentukan modus data tersebut.', mod, { jenis: 'modus', langkah: [
            st('Hitung kemunculan tiap nilai: ' + Object.keys(cnt).map((x) => x + ' muncul ' + cnt[x] + 'x').join('; ') + '.'),
            st('Modus adalah nilai yang paling sering muncul, yaitu ' + mod + '.', mod)] });
        }),
      lv('Diagram lingkaran', 'Sudut juring dan banyak data', 'angka',
        (r, c) => {
          const N = r.pilih([40, 60, 72, 90, 120, 180, 360]);
          return { jenis: pilihJenis(r, c, ['banyak', 'sudut']), N, cnt: bagi4(r, N), i: r.bulat(0, 3), sk: r.bulat(0, 1) };
        },
        (pr, ctx) => {
          const v = kons(ctx), { N, cnt, i } = pr, u = 360 / N, ang = cnt.map((x) => x * u);
          const nama = v === 'umum' ? [['Bola', 'Voli', 'Renang', 'Basket'], ['Merah', 'Biru', 'Hijau', 'Kuning']][pr.sk] : [['Kaus', 'Topi', 'Tas', 'Jaket'], ['Roti', 'Kue', 'Donat', 'Pie']][pr.sk];
          const objek = v === 'umum' ? (pr.sk === 0 ? 'siswa' : 'siswa') : 'pelanggan';
          const sub = v === 'umum' ? (pr.sk === 0 ? 'olahraga favorit' : 'warna favorit') : (pr.sk === 0 ? 'produk yang dibeli' : 'produk bagian roti yang dibeli');
          if (pr.jenis === 'banyak') {
            const g = pieGbr(nama, ang, ang.map((a) => a + '°'), 'Diagram lingkaran ' + sub + ' dari ' + N + ' ' + objek);
            const s = S.angka('Diagram lingkaran menunjukkan ' + sub + ' dari ' + N + ' ' + objek + '. Berapa banyak ' + objek + ' pada juring ' + nama[i] + '?', cnt[i], { jenis: 'pieBanyak', satuan: objek, gambar: g, langkah: [
              st('Banyak data = (sudut ÷ 360) × total = ' + ang[i] + '/360 × ' + N + '.'),
              st(ang[i] + ' × ' + N + ' ÷ 360 = ' + cnt[i] + '.', (ang[i] * N) / 360)] });
            s.dibagi = [{ a: ang[i] * N, b: 360 }]; return s;
          }
          const lab = ang.map((a, j) => (j === i ? '?' : a + '°'));
          const g = pieGbr(nama, ang, lab, 'Diagram lingkaran ' + sub + ' dari ' + N + ' ' + objek);
          const s = S.angka('Dari ' + N + ' ' + objek + ', terdapat ' + cnt[i] + ' ' + objek + ' pada kategori ' + nama[i] + '. Berapa besar sudut juring ' + nama[i] + ' pada diagram lingkaran?', ang[i], { jenis: 'pieSudut', satuan: '°', gambar: g, langkah: [
            st('Sudut = (banyak data ÷ total) × 360° = ' + cnt[i] + '/' + N + ' × 360°.'),
            st(cnt[i] + ' × 360 ÷ ' + N + ' = ' + ang[i] + '°.', (cnt[i] * 360) / N)] });
          s.dibagi = [{ a: cnt[i] * 360, b: N }]; return s;
        }),
      lv('Tabel frekuensi dan rata-rata', 'Rata-rata = jumlah (nilai × frekuensi) ÷ jumlah frekuensi', 'angka',
        (r) => {
          const awal = r.bulat(4, 7), k = r.bulat(3, 5);
          for (;;) { const f = []; for (let i = 0; i < k; i++) f.push(r.bulat(1, 8)); const n = f.reduce((a, b) => a + b, 0); const jml = f.reduce((a, x, i) => a + x * (awal + i), 0); if (jml % n === 0) return { awal, f, sk: r.bulat(0, 1) }; }
        },
        ({ awal, f, sk }, ctx) => {
          const v = kons(ctx), k = f.length, vals = f.map((_, i) => awal + i), n = f.reduce((a, b) => a + b, 0), jml = f.reduce((a, x, i) => a + x * vals[i], 0);
          const g = batangGbr(vals.map(String), f, Math.max(...f) + 2 + ((Math.max(...f) + 2) % 2), 'Frekuensi tiap nilai');
          const teks = (v === 'umum' ? 'Tabel di bawah menunjukkan nilai tes dan banyak siswa: ' : 'Tabel di bawah menunjukkan jumlah barang per pesanan dan banyak pesanan: ') + vals.map((x, i) => x + ' (' + f[i] + (v === 'umum' ? ' siswa' : ' pesanan') + ')').join(', ') + '. Berapa rata-ratanya?';
          const s = S.angka(teks, jml / n, { jenis: 'frek', gambar: g, langkah: [
            st('Kalikan tiap nilai dengan frekuensinya: ' + vals.map((x, i) => x + '×' + f[i] + '=' + (x * f[i])).join(', ') + '.'),
            st('Jumlah = ' + jml + ' dan jumlah frekuensi = ' + n + '.'),
            st(jml + ' ÷ ' + n + ' = ' + (jml / n) + '.', jml / n)] });
          s.dibagi = [{ a: jml, b: n }]; return s;
        }),
      lv('Soal cerita rata-rata', 'Menambah data atau menggabung kelompok', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['baru', 'gabung']);
          if (jenis === 'baru') return { jenis, n: r.bulat(4, 9), m: r.bulat(60, 85), d: r.bulat(1, 4), sk: r.bulat(0, 1) };
          for (;;) { const n1 = r.bulat(10, 30), n2 = r.bulat(10, 30), m1 = r.bulat(60, 90), m2 = r.bulat(60, 90); if ((n1 * m1 + n2 * m2) % (n1 + n2) === 0 && m1 !== m2) return { jenis, n1, n2, m1, m2, sk: r.bulat(0, 1) }; }
        },
        (p, ctx) => {
          const v = kons(ctx);
          if (p.jenis === 'baru') {
            const x = p.m + (p.n + 1) * p.d;
            const teks = v === 'umum' ? 'Rata-rata nilai ' + p.n + ' ulangan ' + (p.sk ? 'IPA' : 'Matematika') + ' adalah ' + p.m + '. Berapa nilai ulangan berikutnya agar rata-rata menjadi ' + (p.m + p.d) + '?' : 'Rata-rata penjualan ' + p.n + ' hari pertama adalah ' + p.m + ' paket. Berapa paket yang harus terjual pada hari berikutnya agar rata-rata menjadi ' + (p.m + p.d) + ' paket?';
            return S.angka(teks, x, { jenis: 'baru', langkah: [
              st('Jumlah awal = ' + p.n + ' × ' + p.m + ' = ' + (p.n * p.m) + '. Jumlah yang diinginkan = ' + (p.n + 1) + ' × ' + (p.m + p.d) + ' = ' + ((p.n + 1) * (p.m + p.d)) + '.'),
              st('Nilai berikutnya = ' + ((p.n + 1) * (p.m + p.d)) + ' − ' + (p.n * p.m) + ' = ' + x + '.', (p.n + 1) * (p.m + p.d) - p.n * p.m)] });
          }
          const rata = (p.n1 * p.m1 + p.n2 * p.m2) / (p.n1 + p.n2);
          const teks = v === 'umum' ? 'Kelas A terdiri dari ' + p.n1 + ' siswa dengan rata-rata nilai ' + p.m1 + '. Kelas B terdiri dari ' + p.n2 + ' siswa dengan rata-rata ' + p.m2 + '. Berapa rata-rata nilai gabungan kedua kelas?' : 'Cabang toko A melayani ' + p.n1 + ' pelanggan dengan rata-rata belanja Rp' + p.m1 + '.000. Cabang B melayani ' + p.n2 + ' pelanggan dengan rata-rata Rp' + p.m2 + '.000. Berapa rata-rata belanja gabungan (dalam ribu rupiah)?';
          const s = S.angka(teks, rata, { jenis: 'gabung', langkah: [
            st('Jumlah A = ' + p.n1 + ' × ' + p.m1 + ' = ' + (p.n1 * p.m1) + ' dan jumlah B = ' + p.n2 + ' × ' + p.m2 + ' = ' + (p.n2 * p.m2) + '.'),
            st('Rata-rata gabungan = ' + (p.n1 * p.m1 + p.n2 * p.m2) + ' ÷ ' + (p.n1 + p.n2) + ' = ' + rata + '.', (p.n1 * p.m1 + p.n2 * p.m2) / (p.n1 + p.n2))] });
          s.dibagi = [{ a: p.n1 * p.m1 + p.n2 * p.m2, b: p.n1 + p.n2 }];
          return s;
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
