/* CepatPaham - gambar bantu untuk langkah penyelesaian (untuk siswa visual).
   Tiap fungsi mengembalikan spesifikasi gambar {tipe:'gambar', ...} yang dipasang pada langkah: st(teks, nilai, gambar).
   Dipakai oleh js/hitung.js, js/dasar.js, dan bab lain. */
(function (G) {
  'use strict';
  const CP = G.CP;
  const H = CP.H, F = CP.angka;
  const W = 320;
  const WARNA = ['isi', 'isi2', 'isi3'];
  const v = (n) => (n < 0 ? CP.MIN + F(-n) : F(n));

  /* ---- kotak perkalian (model luas): kolom x baris, tiap sel menampilkan hasil kali ---- */
  CP.vKotak = function (kolom, baris) {
    const X0 = 44, Y0 = 34, RH = 46, LEBAR = 262, el = [];
    const total = kolom.reduce((a, c) => a + Math.abs(c.v), 0);
    let lw = kolom.map((c) => Math.max(66, (LEBAR * Math.abs(c.v)) / total));
    const t = lw.reduce((a, b) => a + b, 0); lw = lw.map((x) => (x * LEBAR) / t);
    const sel = []; let x = X0;
    kolom.forEach((c, i) => {
      el.push(H.t(x + lw[i] / 2, Y0 - 10, c.t || v(c.v), 'middle', 'tebal'));
      baris.forEach((b, j) => {
        const p = c.v * b.v;
        el.push(H.r(x, Y0 + j * RH, lw[i], RH, p < 0 ? 'minus' : WARNA[(i + j) % 3]));
        el.push(H.t(x + lw[i] / 2, Y0 + j * RH + 19, v(c.v) + ' × ' + v(b.v), 'middle', 'kecil'));
        el.push(H.t(x + lw[i] / 2, Y0 + j * RH + 38, '= ' + v(p), 'middle', 'tebal'));
        sel.push(p);
      });
      x += lw[i];
    });
    baris.forEach((b, j) => el.push(H.t(X0 - 8, Y0 + j * RH + RH / 2 + 5, b.t || v(b.v), 'end', 'tebal')));
    let teks = v(sel[0]); for (let i = 1; i < sel.length; i++) teks += sel[i] < 0 ? ' − ' + F(-sel[i]) : ' + ' + v(sel[i]);
    const jml = sel.reduce((a, b) => a + b, 0);
    el.push(H.t(W / 2, Y0 + baris.length * RH + 26, teks + ' = ' + v(jml), 'middle', 'besar'));
    return { tipe: 'gambar', alt: 'Model kotak perkalian: ' + teks + ' = ' + v(jml), lebar: W, tinggi: Y0 + baris.length * RH + 40, el };
  };

  /* ---- rantai pangkat: a, a x a, ... tiap panah "x a" ---- */
  CP.vRantai = function (a, n) {
    const BW = 84, GAP = 24, RH = 58, X0 = 8, PER = 3, el = []; let x = 1;
    for (let k = 1; k <= n; k++) {
      const nilai = Math.pow(a, k), r = Math.floor((k - 1) / PER), c = (k - 1) % PER, bx = X0 + c * (BW + GAP), by = 10 + r * RH;
      el.push(H.r(bx, by, BW, 34, k === n ? 'isi2' : 'isi'));
      el.push(H.t(bx + BW / 2, by + 15, a + CP.sup(k), 'middle', 'kecil'));
      el.push(H.t(bx + BW / 2, by + 29, F(nilai), 'middle', 'tebal'));
      if (c > 0) { el.push(H.l(bx - GAP + 2, by + 17, bx - 2, by + 17, 'garis')); el.push(H.p([[bx - 2, by + 17], [bx - 8, by + 13], [bx - 8, by + 21]], 'kosong')); el.push(H.t(bx - GAP / 2, by + 10, '×' + a, 'middle', 'kecil')); }
      else if (r > 0) { el.push(H.d('M' + (X0 + (PER - 1) * (BW + GAP) + BW / 2) + ' ' + (by - RH + 34) + ' L' + (X0 + (PER - 1) * (BW + GAP) + BW / 2) + ' ' + (by - 12) + ' L' + (bx + BW / 2) + ' ' + (by - 12) + ' L' + (bx + BW / 2) + ' ' + by, 'putus')); el.push(H.t(bx + BW / 2 + 6, by - 15, '×' + a, 'start', 'kecil')); }
    }
    const baris = Math.ceil(n / PER);
    return { tipe: 'gambar', alt: 'Rantai pangkat: ' + a + ' dikali ' + a + ' berulang sampai pangkat ' + n, lebar: W, tinggi: 10 + baris * RH, el };
  };

  /* ---- kolom penjumlahan tetangga (kali 11 dan kali 12): angka -> jumlah -> hasil dengan simpanan ---- */
  CP.vTetangga = function (d, komp, label) {
    const n = d.length, STEP = 46, X0 = 14 + STEP, BW = 40, el = [];
    const cx = (i) => X0 + i * STEP;
    // simpanan dari kanan
    const akhir = new Array(n + 1), simpan = new Array(n + 1).fill(0); let c = 0;
    for (let i = n; i >= 0; i--) { const val = komp[i] + c; akhir[i] = val % 10; c = Math.floor(val / 10); if (i > 0) simpan[i - 1] = c; }
    const depan = c;
    el.push(H.t(2, 24, 'angka', 'start', 'kecil'));
    d.forEach((x, k) => {
      const px = X0 + (k + 0.5) * STEP - BW / 2;
      el.push(H.l(px + BW / 2, 38, cx(k) + BW / 2, 86, 'tipis'), H.l(px + BW / 2, 38, cx(k + 1) + BW / 2, 86, 'tipis'));
      el.push(H.r(px, 8, BW, 30, 'isi'), H.t(px + BW / 2, 29, x, 'middle', 'tebal'));
    });
    el.push(H.t(2, 104, 'jumlah', 'start', 'kecil'));
    for (let i = 0; i <= n; i++) {
      el.push(H.r(cx(i), 86, BW, 30, komp[i] > 9 ? 'isi3' : 'isi2'), H.t(cx(i) + BW / 2, 107, komp[i], 'middle', 'tebal'));
      if (label && label[i]) el.push(H.t(cx(i) + BW / 2, 130, label[i], 'middle', 'kecil'));
    }
    el.push(H.t(2, 174, 'hasil', 'start', 'kecil'));
    for (let i = 0; i <= n; i++) {
      el.push(H.r(cx(i), 156, BW, 30, 'kosong'), H.t(cx(i) + BW / 2, 177, akhir[i], 'middle', 'tebal'));
      if (simpan[i] > 0) el.push(H.t(cx(i) + BW / 2 + 2, 150, '+' + simpan[i], 'middle', 'merahteks'));
      if (i > 0 && komp[i] > 9) { el.push(H.d('M' + (cx(i) + 6) + ' 118 Q' + (cx(i) - 4) + ' 138 ' + (cx(i - 1) + BW - 6) + ' 152', 'merah')); }
    }
    if (depan > 0) { el.push(H.r(X0 - STEP, 156, BW, 30, 'isi3'), H.t(X0 - STEP + BW / 2, 177, depan, 'middle', 'tebal')); }
    return { tipe: 'gambar', alt: 'Penjumlahan angka bertetangga dengan simpanan', lebar: W, tinggi: 196, el };
  };

  /* ---- gabungkan beberapa bagian menjadi hasil ---- */
  CP.vGabung = function (bagian, hasil) {
    const n = bagian.length, bw = Math.min(92, Math.floor(280 / n) - 8), tot = n * bw + (n - 1) * 8, x0 = (W - tot) / 2, el = [];
    bagian.forEach((b, i) => {
      const x = x0 + i * (bw + 8);
      el.push(H.t(x + bw / 2, 14, b.t, 'middle', 'kecil'));
      el.push(H.r(x, 22, bw, 36, WARNA[i % 3]), H.t(x + bw / 2, 46, b.v, 'middle', 'tebal'));
      el.push(H.l(x + bw / 2, 58, W / 2, 86, 'tipis'));
    });
    el.push(H.r(W / 2 - 62, 86, 124, 38, 'kosong'), H.t(W / 2, 112, hasil, 'middle', 'besar'));
    return { tipe: 'gambar', alt: 'Bagian-bagian digabung menjadi ' + hasil, lebar: W, tinggi: 134, el };
  };

  /* ---- garis bilangan dengan lompatan ---- */
  CP.vGaris = function (titik, lompat) {
    const n = titik.length, X0 = 26, X1 = W - 26, el = [], px = (i) => X0 + (i * (X1 - X0)) / (n - 1), Y = 70;
    el.push(H.l(X0 - 10, Y, X1 + 10, Y, 'garis'));
    titik.forEach((t, i) => { el.push(H.l(px(i), Y - 5, px(i), Y + 5, 'garis'), H.t(px(i), Y + 22, F(t), 'middle', 'tebal')); });
    lompat.forEach((l, i) => {
      const a = px(i), b = px(i + 1), m = (a + b) / 2;
      el.push(H.d('M' + a + ' ' + (Y - 4) + ' Q' + m + ' ' + (Y - 46) + ' ' + b + ' ' + (Y - 4), 'merah'));
      el.push(H.t(m, Y - 40, l, 'middle', 'merahteks'));
    });
    return { tipe: 'gambar', alt: 'Garis bilangan: ' + titik.map(F).join(' lalu ') + ' dengan lompatan ' + lompat.join(', '), lebar: W, tinggi: 100, el };
  };

  /* ---- alur: kotak -> kotak -> kotak, tiap panah diberi nama operasinya ---- */
  CP.vAlur = function (langkah) {
    const n = langkah.length, GAP = 36, BW = Math.min(88, Math.floor((W - 20 - (n - 1) * GAP) / n)), tot = n * BW + (n - 1) * GAP, x0 = (W - tot) / 2, el = [];
    langkah.forEach((l, i) => {
      const x = x0 + i * (BW + GAP);
      el.push(H.r(x, 28, BW, 38, i === n - 1 ? 'isi2' : 'isi'), H.t(x + BW / 2, 52, l.v, 'middle', 'tebal'));
      if (i > 0) {
        const ax = x - GAP;
        el.push(H.l(ax + 3, 47, x - 3, 47, 'garis'), H.p([[x - 3, 47], [x - 10, 42], [x - 10, 52]], 'kosong'));
        if (l.op) el.push(H.t(ax + GAP / 2, 20, l.op, 'middle', 'merahteks'));
      }
    });
    return { tipe: 'gambar', alt: 'Alur langkah: ' + langkah.map((l) => (l.op ? l.op + ' → ' : '') + l.v).join(' '), lebar: W, tinggi: 78, el };
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
