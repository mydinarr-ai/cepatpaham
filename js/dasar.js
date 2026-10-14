/* CepatPaham - H0 Dasar Perkalian: tabel perkalian dari nol, kali 2 digit dengan cara dipecah, dan pangkat langkah demi langkah.
   Untuk siswa yang belum hafal tabel perkalian. Semua langkah ditulis sangat rinci. */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv } = CP;
  const F = CP.angka;
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const SUP = CP.sup;

  // x × a dipecah per tempat: 1.296 × 6 -> (1.000 × 6 = 6.000) + (200 × 6 = 1.200) + ...
  function caraKali(x, a) {
    const s = String(x), bag = [];
    for (let i = 0; i < s.length; i++) { const d = +s[i]; if (d === 0) continue; const nilai = d * Math.pow(10, s.length - 1 - i); bag.push({ nilai, hasil: nilai * a }); }
    if (bag.length === 1) return F(x) + ' × ' + a + ' = ' + F(x * a) + '.';
    return F(x) + ' × ' + a + ': ' + bag.map((b) => F(b.nilai) + ' × ' + a + ' = ' + F(b.hasil)).join('; ') + '. Jumlahkan: ' + bag.map((b) => F(b.hasil)).join(' + ') + ' = ' + F(x * a) + '.';
  }
  CP.caraKali = caraKali;
  // tangga pangkat: a^1, a^2, ... a^n, tiap langkah hanya "kali a"
  CP.tanggaPangkat = function (a, n) {
    const baris = []; let x = a;
    baris.push(a + SUP(1) + ' = ' + a + '.');
    for (let k = 2; k <= n; k++) { const y = x * a; baris.push(a + SUP(k) + ' = ' + a + SUP(k - 1) + ' × ' + a + ' = ' + F(x) + ' × ' + a + ' = ' + F(y) + '. (' + caraKali(x, a) + ')'); x = y; }
    return baris;
  };

  const jaw = (teks, v, o) => S.angka(teks, v, o);

  CP.aktifkan('H0', {
    level: [
      lv('Tabel ×2, ×5, dan ×10', '6 × 5 = 30', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['k2', 'k5', 'k10']), b: r.bulat(2, 12), balik: r.bulat(0, 1) }),
        ({ jenis, b, balik }) => {
          const a = jenis === 'k2' ? 2 : jenis === 'k5' ? 5 : 10, v = a * b, teks = balik ? b + ' × ' + a : a + ' × ' + b;
          const lk = jenis === 'k2' ? [st('Kali 2 artinya dua kali lipat: ' + b + ' + ' + b + '.'), st(b + ' + ' + b + ' = ' + v + '.', v)]
            : jenis === 'k5' ? [st('Kali 5 = setengah dari kali 10. ' + b + ' × 10 = ' + b * 10 + '.'), st('Setengahnya: ' + b * 10 + ' ÷ 2 = ' + v + '.', v)]
              : [st('Kali 10: tambahkan angka 0 di belakang ' + b + '.'), st(b + ' → ' + v + '.', v)];
          return jaw('Hitunglah ' + teks + '.', v, { jenis, langkah: lk });
        }),
      lv('Tabel ×3 dan ×4', '7 × 4 = 28', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['k3', 'k4']), b: r.bulat(3, 12), balik: r.bulat(0, 1) }),
        ({ jenis, b, balik }) => {
          const a = jenis === 'k3' ? 3 : 4, v = a * b, teks = balik ? b + ' × ' + a : a + ' × ' + b;
          const lk = jenis === 'k3' ? [st('Kali 3 = kali 2 lalu tambah satu kali lagi. ' + b + ' × 2 = ' + 2 * b + '.', undefined, CP.vKotak([{ v: 2 }, { v: 1 }], [{ v: b }])), st(2 * b + ' + ' + b + ' = ' + v + '.', v)]
            : [st('Kali 4 = dua kali lipat, lalu dua kali lipat lagi. ' + b + ' → ' + 2 * b + '.', undefined, CP.vKotak([{ v: 2 }, { v: 2 }], [{ v: b }])), st(2 * b + ' → ' + v + '.', v)];
          return jaw('Hitunglah ' + teks + '.', v, { jenis, langkah: lk });
        }),
      lv('Tabel ×9 dan ×11', '9 × 7 = 63; 11 × 7 = 77', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['k9', 'k11']), b: r.bulat(2, 12), balik: r.bulat(0, 1) }),
        ({ jenis, b, balik }) => {
          if (jenis === 'k9') { const v = 9 * b; return jaw('Hitunglah ' + (balik ? b + ' × 9' : '9 × ' + b) + '.', v, { jenis, langkah: [st('Kali 9 = kali 10 lalu kurangi sekali. ' + b + ' × 10 = ' + 10 * b + '.', undefined, CP.vKotak([{ v: 10 }, { v: -1 }], [{ v: b }])), st(10 * b + ' − ' + b + ' = ' + v + '.', v)] }); }
          const bb = Math.min(b, 9), v = 11 * bb;
          return jaw('Hitunglah ' + (balik ? bb + ' × 11' : '11 × ' + bb) + '.', v, { jenis, langkah: [st('Kali 11 untuk angka 1 sampai 9: tulis angkanya dua kali.'), st(bb + ' → ' + bb + bb + '.', v)] });
        }),
      lv('Tabel ×6, ×7, dan ×8', '7 × 8 = 56', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['k6', 'k7', 'k8']), b: r.bulat(3, 10), balik: r.bulat(0, 1) }),
        ({ jenis, b, balik }) => {
          const a = jenis === 'k6' ? 6 : jenis === 'k7' ? 7 : 8, v = a * b, teks = balik ? b + ' × ' + a : a + ' × ' + b;
          let lk;
          if (jenis === 'k6') lk = [st('Kali 6 = kali 5 lalu tambah sekali lagi. ' + b + ' × 5 = ' + 5 * b + ' (setengah dari ' + b + ' × 10 = ' + 10 * b + ').', undefined, CP.vKotak([{ v: 5 }, { v: 1 }], [{ v: b }])), st(5 * b + ' + ' + b + ' = ' + v + '.', v)];
          else if (jenis === 'k7') lk = [st('Kali 7 = kali 5 ditambah kali 2. ' + b + ' × 5 = ' + 5 * b + ' dan ' + b + ' × 2 = ' + 2 * b + '.', undefined, CP.vKotak([{ v: 5 }, { v: 2 }], [{ v: b }])), st(5 * b + ' + ' + 2 * b + ' = ' + v + '.', v)];
          else lk = [st('Kali 8 = kali 10 dikurangi kali 2. ' + b + ' × 10 = ' + 10 * b + ' dan ' + b + ' × 2 = ' + 2 * b + '.', undefined, CP.vKotak([{ v: 10 }, { v: -2 }], [{ v: b }])), st(10 * b + ' − ' + 2 * b + ' = ' + v + '.', v)];
          return jaw('Hitunglah ' + teks + '.', v, { jenis, langkah: lk });
        }),
      lv('Kali 2 digit dengan 1 digit (dipecah)', '47 × 6 = 240 + 42 = 282', 'angka',
        (r) => ({ n: r.bulat(12, 99), m: r.bulat(2, 9), balik: r.bulat(0, 1) }),
        ({ n, m, balik }) => {
          const nn = n % 10 === 0 ? n + 3 : n, p = Math.floor(nn / 10), s = nn % 10, v = nn * m;
          return jaw('Hitunglah ' + (balik ? m + ' × ' + nn : nn + ' × ' + m) + '.', v, { jenis: 'pecah', langkah: [
            st('Pecah ' + nn + ' menjadi ' + p * 10 + ' dan ' + s + '.', undefined, CP.vKotak([{ v: p * 10 }, { v: s }], [{ v: m }])),
            st('Kali masing-masing dengan ' + m + ': ' + p * 10 + ' × ' + m + ' = ' + p * 10 * m + ' (karena ' + p + ' × ' + m + ' = ' + p * m + ', tambah 0), dan ' + s + ' × ' + m + ' = ' + s * m + '.'),
            st('Jumlahkan: ' + p * 10 * m + ' + ' + s * m + ' = ' + v + '.', v)] });
        }),
      lv('Pangkat langkah demi langkah', '6⁴ = 6 × 6 × 6 × 6 = 1.296', 'angka',
        (r) => ({ a: r.bulat(2, 9), t: r.bulat(0, 99) }),
        ({ a, t }) => {
          let nmax = 2; while (Math.pow(a, nmax + 1) <= 20000000 && nmax < 9) nmax++;
          const n = 2 + (t % (nmax - 1)), v = Math.pow(a, n), tangga = CP.tanggaPangkat(a, n);
          return jaw('Hitunglah ' + a + SUP(n) + '.', v, { jenis: 'pangkat', langkah: [
            st('Pangkat berarti kali berulang. ' + a + SUP(n) + ' artinya ' + a + ' dikali sendiri ' + n + ' kali. Tidak perlu hafal; kerjakan satu per satu, tiap langkah hanya mengalikan dengan ' + a + '.'),
            ...tangga.slice(1).map((t, i) => st(t, undefined, i === 0 ? CP.vRantai(a, n) : undefined)),
            st(a + SUP(n) + ' = ' + F(v) + '.', v)] });
        })
    ]
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = CP;
})(typeof globalThis !== 'undefined' ? globalThis : this);
