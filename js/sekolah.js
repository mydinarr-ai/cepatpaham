/* CepatPaham - modul Materi Sekolah (Tahap 1): VII-1, VII-2, VII-3, X-1, X-2 */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, gcd, kpk } = CP;
  const F = CP.angka, O = CP.op, RP = CP.rp, sup = CP.sup;
  const MIN = CP.MIN;
  const tanda = (n) => (n < 0 ? -1 : 1);
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const bs = (p) => CP.pecahanStr(p); // teks pecahan
  const dec = (p) => CP.desimalStr(p);
  const pangkat = (a, n) => { let x = 1; for (let i = 0; i < n; i++) x *= a; return x; };
  const faktorStr = (n) => {
    const f = CP.faktorPrima(n);
    return n + ' = ' + Object.keys(f).map(Number).sort((a, b) => a - b).map((p) => p + (f[p] > 1 ? sup(f[p]) : '')).join(' × ');
  };

  /* ========================= VII-1 BILANGAN BULAT ========================= */
  function tambahJalur(a, b) { // penjumlahan bilangan bulat lewat aturan tanda
    if (a * b > 0) return { t: 'Tanda sama: jumlahkan nilai mutlaknya (' + Math.abs(a) + ' + ' + Math.abs(b) + ' = ' + (Math.abs(a) + Math.abs(b)) + '), tanda tetap ' + (a < 0 ? 'negatif' : 'positif') + '.', v: tanda(a) * (Math.abs(a) + Math.abs(b)) };
    const besar = Math.abs(a) >= Math.abs(b) ? a : b;
    const selisih = Math.abs(Math.abs(a) - Math.abs(b));
    return { t: 'Tanda berbeda: kurangkan nilai mutlaknya (' + Math.max(Math.abs(a), Math.abs(b)) + ' − ' + Math.min(Math.abs(a), Math.abs(b)) + ' = ' + selisih + '), tanda ikut ' + F(besar) + ' (nilai mutlak lebih besar).', v: selisih === 0 ? 0 : tanda(besar) * selisih };
  }
  CP.tambahJalur = tambahJalur;
  const NEG = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };

  CP.aktifkan('VII-1', {
    negatif: true,
    level: [
      lv('Membandingkan bilangan bulat', 'Mana lebih kecil: −8 atau −3?', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['kecil', 'besar', 'terkecil', 'terbesar']);
          const n = jenis.indexOf('ter') === 0 ? 4 : 2;
          let x;
          do { const s = new Set(); while (s.size < n) s.add(r.bulat(-15, 15)); x = [...s]; } while (!x.some((v) => v < 0));
          return { jenis, x };
        },
        ({ jenis, x }) => {
          const kecil = jenis === 'kecil' || jenis === 'terkecil';
          const urut = [...x].sort((a, b) => a - b);
          const ans = kecil ? urut[0] : urut[urut.length - 1];
          const teks = x.length === 2 ? 'Mana yang lebih ' + (kecil ? 'kecil' : 'besar') + ': ' + F(x[0]) + ' atau ' + F(x[1]) + '?' : 'Bilangan manakah yang paling ' + (kecil ? 'kecil' : 'besar') + ': ' + x.map(F).join(', ') + '?';
          const v = kecil ? Math.min(...x) : Math.max(...x);
          return S.angka(teks, ans, { jenis, izin: { minus: true }, langkah: [
            st('Pada garis bilangan, makin ke kanan makin besar. Bilangan negatif selalu lebih kecil dari nol.'),
            st('Urutkan dari kecil ke besar: ' + urut.map(F).join(', ') + '.'),
            st('Jadi yang paling ' + (kecil ? 'kecil' : 'besar') + ' adalah ' + F(v) + '.', v)] });
        }),
      lv('Penjumlahan dan pengurangan', '−7 + 12 = 5; 15 − (−6) = 21', 'angka',
        (r, c) => {
          const op = pilihJenis(r, c, ['+', '-']);
          let a, b;
          do { a = NEG(r, -20, 20); b = NEG(r, -20, 20); } while (!(a < 0 || b < 0));
          return { a, b, op };
        },
        ({ a, b, op }) => {
          const ans = op === '+' ? a + b : a - b;
          const teks = 'Hitunglah ' + F(a) + ' ' + (op === '+' ? '+' : MIN) + ' ' + O(b) + '.';
          const langkah = [];
          let v;
          if (op === '+') { const j = tambahJalur(a, b); langkah.push(st(j.t)); v = j.v; }
          else {
            langkah.push(st('Mengurangi sama dengan menambah lawannya: ' + F(a) + ' − ' + O(b) + ' = ' + F(a) + ' + ' + O(-b) + '.'));
            const j = tambahJalur(a, -b); langkah.push(st(j.t)); v = j.v;
          }
          langkah.push(st('Hasilnya ' + F(v) + '.', v));
          return S.angka(teks, ans, { jenis: op === '+' ? 'tambah' : 'kurang', izin: { minus: true }, langkah });
        }),
      lv('Perkalian dan pembagian', '−3 × −4 = 12; −36 ÷ 9 = −4', 'angka',
        (r, c) => {
          const op = pilihJenis(r, c, ['*', '/']);
          let s1, s2;
          do { s1 = r.pilih([-1, 1]); s2 = r.pilih([-1, 1]); } while (s1 > 0 && s2 > 0);
          if (op === '*') return { op, a: s1 * r.bulat(2, 12), b: s2 * r.bulat(2, 12) };
          const B = r.bulat(2, 12), q = r.bulat(2, 12);
          return { op, a: s1 * q * B, b: s2 * B };
        },
        ({ a, b, op }) => {
          const sama = a * b > 0;
          const mag = op === '*' ? Math.abs(a) * Math.abs(b) : Math.abs(a) / Math.abs(b);
          const v = (sama ? 1 : -1) * mag;
          const s = S.angka('Hitunglah ' + F(a) + ' ' + (op === '*' ? '×' : '÷') + ' ' + O(b) + '.', op === '*' ? a * b : a / b, {
            jenis: op === '*' ? 'kali' : 'bagi', izin: { minus: true },
            langkah: [
              st('Aturan tanda: tanda sama → hasil positif; tanda berbeda → hasil negatif. Di sini tandanya ' + (sama ? 'sama' : 'berbeda') + ', jadi hasilnya ' + (sama ? 'positif' : 'negatif') + '.'),
              st('Hitung nilai mutlaknya: ' + Math.abs(a) + ' ' + (op === '*' ? '×' : '÷') + ' ' + Math.abs(b) + ' = ' + mag + '.'),
              st('Hasilnya ' + F(v) + '.', v)]
          });
          if (op === '/') s.dibagi = [{ a, b }];
          return s;
        }),
      lv('Operasi campuran', '−2 + 3 × (−4) = −14', 'angka',
        (r, c) => {
          const f = pilihJenis(r, c, ['tambahKali', 'kurangKali', 'kurungKali', 'tambahBagi']);
          let a, b, cc;
          do {
            a = NEG(r, -9, 9); cc = NEG(r, -9, 9);
            b = f === 'tambahBagi' ? cc * r.bulat(-9, 9) : NEG(r, -9, 9);
            if (f === 'tambahBagi' && b === 0) b = cc;
          } while (!(a < 0 || b < 0 || cc < 0));
          return { f, a, b, c: cc };
        },
        ({ f, a, b, c }) => {
          let teks, ans, langkah = [], dibagi;
          const urut = st('Urutan operasi: kerjakan kurung dulu, lalu × dan ÷, terakhir + dan −.');
          if (f === 'tambahKali') {
            const m = b * c; ans = a + b * c;
            teks = 'Hitunglah ' + F(a) + ' + ' + O(b) + ' × ' + O(c) + '.';
            langkah = [urut, st('Perkalian dulu: ' + O(b) + ' × ' + O(c) + ' = ' + F(m) + '.'), st(F(a) + ' + ' + O(m) + ' = ' + F(a + m) + '.', a + m)];
          } else if (f === 'kurangKali') {
            const m = b * c; ans = a - b * c;
            teks = 'Hitunglah ' + F(a) + ' ' + MIN + ' ' + O(b) + ' × ' + O(c) + '.';
            langkah = [urut, st('Perkalian dulu: ' + O(b) + ' × ' + O(c) + ' = ' + F(m) + '.'), st(F(a) + ' − ' + O(m) + ' = ' + F(a - m) + '.', a - m)];
          } else if (f === 'kurungKali') {
            const k = a + b; ans = (a + b) * c;
            teks = 'Hitunglah (' + F(a) + ' + ' + O(b) + ') × ' + O(c) + '.';
            langkah = [urut, st('Kurung dulu: ' + F(a) + ' + ' + O(b) + ' = ' + F(k) + '.'), st(F(k) + ' × ' + O(c) + ' = ' + F(k * c) + '.', k * c)];
          } else {
            const q = b / c; ans = a + b / c; dibagi = [{ a: b, b: c }];
            teks = 'Hitunglah ' + F(a) + ' + ' + O(b) + ' ÷ ' + O(c) + '.';
            langkah = [urut, st('Pembagian dulu: ' + O(b) + ' ÷ ' + O(c) + ' = ' + F(q) + '.'), st(F(a) + ' + ' + O(q) + ' = ' + F(a + q) + '.', a + q)];
          }
          const s = S.angka(teks, ans, { jenis: f, izin: { minus: true }, langkah });
          if (dibagi) s.dibagi = dibagi;
          return s;
        }),
      lv('Faktor, FPB, dan KPK', 'FPB(24, 36) = 12; KPK(4, 6) = 12', 'angka',
        (r, c) => {
          const tanya = pilihJenis(r, c, ['fpb', 'kpk']);
          let a, b;
          do { a = r.bulat(8, 72); b = r.bulat(8, 72); } while (a === b || gcd(a, b) < 2 || a % b === 0 || b % a === 0 || kpk(a, b) > 400);
          return { a, b, tanya };
        },
        ({ a, b, tanya }) => {
          const fa = CP.faktorPrima(a), fb = CP.faktorPrima(b);
          const prima = [...new Set([...Object.keys(fa), ...Object.keys(fb)])].map(Number).sort((x, y) => x - y);
          let v = 1; const bagian = [];
          prima.forEach((p) => {
            const ea = fa[p] || 0, eb = fb[p] || 0;
            if (tanya === 'fpb') { if (ea && eb) { const e = Math.min(ea, eb); v *= pangkat(p, e); bagian.push(p + (e > 1 ? sup(e) : '')); } }
            else { const e = Math.max(ea, eb); v *= pangkat(p, e); bagian.push(p + (e > 1 ? sup(e) : '')); }
          });
          const ans = tanya === 'fpb' ? gcd(a, b) : kpk(a, b);
          const nama = tanya === 'fpb' ? 'FPB' : 'KPK';
          return S.angka('Tentukan ' + nama + ' dari ' + a + ' dan ' + b + '.', ans, { jenis: tanya, langkah: [
            st('Uraikan ke faktor prima: ' + faktorStr(a) + '; ' + faktorStr(b) + '.'),
            st(nama + ': ambil ' + (tanya === 'fpb' ? 'faktor prima yang sama dengan pangkat terkecil' : 'semua faktor prima dengan pangkat terbesar') + ': ' + bagian.join(' × ') + '.'),
            st(nama + '(' + a + ', ' + b + ') = ' + v + '.', v)] });
        }),
      lv('Soal cerita bilangan bulat', 'Suhu −5 °C naik 12 °C → 7 °C', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['suhu', 'kas', 'tinggi']);
          if (jenis === 'suhu') return { jenis, awal: r.bulat(-12, 6), d: r.bulat(3, 15), arah: r.pilih(['naik', 'turun']), kota: r.pilih(['Dataran Tinggi Dieng', 'Lembang', 'Moskow', 'Seoul', 'Pegunungan Alpen']) };
          if (jenis === 'kas') { let a, b; do { a = 1000 * r.bulat(5, 30); b = 1000 * r.bulat(5, 40); } while (a === b); return { jenis, a, b, nama: r.pilih(CP.NAMA) }; }
          const t = r.pilih(['selam', 'drone']);
          let a, b; do { a = 5 * r.bulat(2, 30); b = 5 * r.bulat(2, 30); } while (a === b);
          return { jenis, t, a, b };
        },
        (p) => {
          if (p.jenis === 'suhu') {
            const d = p.arah === 'naik' ? p.d : -p.d;
            const v = tambahJalur(p.awal, d).v;
            return S.angka('Suhu di ' + p.kota + ' pagi ini ' + F(p.awal) + ' °C. Siang hari suhu ' + p.arah + ' ' + p.d + ' °C. Berapa suhu siang hari itu?', p.awal + d, { jenis: 'suhu', satuan: '°C', izin: { minus: true }, langkah: [
              st('Suhu ' + p.arah + ' berarti ' + (p.arah === 'naik' ? 'ditambah' : 'dikurangi') + ': ' + F(p.awal) + ' ' + (p.arah === 'naik' ? '+' : MIN) + ' ' + p.d + '.'),
              st(F(p.awal) + (p.arah === 'naik' ? ' + ' + p.d : ' − ' + p.d) + ' = ' + F(v) + ' °C.', v)] });
          }
          if (p.jenis === 'kas') {
            const v = p.a + (-p.b);
            return S.angka('Saldo kas kelas ' + p.nama + ' adalah ' + RP(p.a) + '. Setelah membayar iuran dan membeli perlengkapan sebesar ' + RP(p.b) + ', berapa saldo kas sekarang? (Tanda minus berarti kas kurang.)', p.a - p.b, { jenis: 'kas', awalan: 'Rp', izin: { minus: true }, langkah: [
              st('Pengeluaran mengurangi saldo: ' + RP(p.a) + ' − ' + RP(p.b) + '.'),
              st('Hasilnya ' + RP(v) + (v < 0 ? ' (kas kurang).' : '.'), v)] });
          }
          if (p.t === 'selam') {
            const v = -p.a + p.b;
            return S.angka('Seorang penyelam berada pada kedalaman ' + p.a + ' meter di bawah permukaan laut (posisi ' + F(-p.a) + ' m). Ia naik ' + p.b + ' meter. Berapa posisinya sekarang terhadap permukaan laut?', -p.a + p.b, { jenis: 'selam', satuan: 'm', izin: { minus: true }, langkah: [
              st('Naik berarti menambah: ' + F(-p.a) + ' + ' + p.b + '.'),
              st('Hasilnya ' + F(v) + ' m.', v)] });
          }
          const v = p.a - p.b;
          return S.angka('Sebuah drone terbang pada ketinggian ' + p.a + ' meter dari permukaan tanah, lalu turun ' + p.b + ' meter. Jika di bawah tanah dihitung negatif, berapa posisi drone sekarang?', p.a - p.b, { jenis: 'drone', satuan: 'm', izin: { minus: true }, langkah: [
            st('Turun berarti mengurangi: ' + p.a + ' − ' + p.b + '.'),
            st('Hasilnya ' + F(v) + ' m.', v)] });
        })
    ]
  });

  /* ========================= VII-2 BILANGAN RASIONAL ========================= */
  const sekutu = (r, lo, hi, mkL, mkH) => { let p, q; do { q = r.bulat(lo, hi); p = r.bulat(mkL(q), mkH(q)); } while (gcd(p, q) !== 1); return [p, q]; };
  const adaPecah = (r) => { let p, q; do { q = r.bulat(2, 12); p = r.bulat(1, q - 1); } while (gcd(p, q) !== 1); return [p, q]; };
  const pecahJalur = (n, d) => P(n, d);

  CP.aktifkan('VII-2', {
    level: [
      lv('Pecahan senilai dan menyederhanakan', '18/24 → 3/4', 'pecahan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['sederhana', 'senilai']);
          if (jenis === 'sederhana') {
            let p, q, k;
            do { [p, q] = sekutu(r, 2, 12, () => 1, (q2) => q2 + 4); k = r.bulat(2, 6); } while (k * p > 72 || k * q > 72);
            return { jenis, p, q, k };
          }
          const [p, q] = adaPecah(r);
          return { jenis, p, q, k: r.bulat(2, 9) };
        },
        ({ jenis, p, q, k }) => {
          if (jenis === 'sederhana') {
            const a = k * p, b = k * q, g = gcd(a, b);
            return S.pecahan('Sederhanakan ' + a + '/' + b + '.', P(p, q), { jenis, langkah: [
              st('Cari FPB pembilang dan penyebut: FPB(' + a + ', ' + b + ') = ' + g + '.'),
              st('Bagi pembilang dan penyebut dengan ' + g + ': ' + a + ' ÷ ' + g + ' = ' + (a / g) + ' dan ' + b + ' ÷ ' + g + ' = ' + (b / g) + '.'),
              st('Bentuk paling sederhananya ' + (a / g) + '/' + (b / g) + '.', pecahJalur(a / g, b / g))] });
          }
          return S.angka('Isi titik-titik agar senilai: ' + p + '/' + q + ' = …/' + (q * k), p * k, { jenis, langkah: [
            st('Penyebut berubah dari ' + q + ' menjadi ' + (q * k) + ', yaitu dikali ' + k + '.'),
            st('Pembilang harus dikali ' + k + ' juga: ' + p + ' × ' + k + ' = ' + (p * k) + '.', p * k)] });
        }),
      lv('Pecahan, desimal, dan persen', '0,75 = 3/4 = 75%', 'pecahan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['pd', 'dp', 'pp', 'ps', 'dpersen']);
          if (jenis === 'pd' || jenis === 'dp') { const q = r.pilih([2, 4, 5, 8, 10, 20, 25]); return { jenis, p: r.bulat(1, q - 1), q }; }
          if (jenis === 'pp') { const q = r.pilih([2, 4, 5, 10, 20, 25, 50]); return { jenis, p: r.bulat(1, q - 1), q }; }
          if (jenis === 'ps') return { jenis, x: r.pilih([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95]) };
          return { jenis, x: r.bulat(1, 99) };
        },
        (p) => {
          const { jenis } = p;
          if (jenis === 'pd') {
            const q = p.q; let e = 1; while ((Math.pow(10, e) % q) !== 0) e++;
            const f = Math.pow(10, e) / q, v = P(p.p * f, Math.pow(10, e));
            return S.angka('Ubah ' + p.p + '/' + q + ' menjadi bentuk desimal.', P(p.p, q), { jenis, izin: { koma: true, garis: true }, langkah: [
              st('Buat penyebut menjadi ' + Math.pow(10, e) + ': kalikan pembilang dan penyebut dengan ' + f + '.'),
              st(p.p + '/' + q + ' = ' + (p.p * f) + '/' + Math.pow(10, e) + ' = ' + dec(v) + '.', v)] });
          }
          if (jenis === 'dp') {
            const pr = P(p.p, p.q), ds = dec(pr); const e = ds.split(',')[1].length; const pn = Math.round(pr.n * Math.pow(10, e) / pr.d);
            const v = P(pn, Math.pow(10, e)); const g = gcd(pn, Math.pow(10, e));
            return S.pecahan('Ubah ' + ds + ' menjadi pecahan.', pr, { jenis, langkah: [
              st(ds + ' = ' + pn + '/' + Math.pow(10, e) + ' (tiap angka di belakang koma menambah satu nol pada penyebut).'),
              st('Sederhanakan dengan membagi ' + g + ': ' + pn + '/' + Math.pow(10, e) + ' = ' + (pn / g) + '/' + (Math.pow(10, e) / g) + '.', v)] });
          }
          if (jenis === 'pp') {
            const f = 100 / p.q, v = p.p * f;
            return S.angka('Ubah ' + p.p + '/' + p.q + ' menjadi persen.', v, { jenis, satuan: '%', langkah: [
              st('Buat penyebut 100: ' + p.p + '/' + p.q + ' = ' + (p.p * f) + '/100.'),
              st('Per seratus berarti persen: ' + v + '%.', v)] });
          }
          if (jenis === 'ps') {
            const g = gcd(p.x, 100), v = P(p.x, 100);
            return S.pecahan('Ubah ' + p.x + '% menjadi pecahan.', v, { jenis, langkah: [
              st(p.x + '% = ' + p.x + '/100.'),
              st('Sederhanakan dengan FPB ' + g + ': ' + (p.x / g) + '/' + (100 / g) + '.', P(p.x / g, 100 / g))] });
          }
          const pr = P(p.x, 100);
          return S.angka('Ubah ' + dec(pr) + ' menjadi persen.', p.x, { jenis: 'dpersen', satuan: '%', langkah: [
            st('Kalikan 100 (geser koma dua tempat): ' + dec(pr) + ' × 100 = ' + p.x + '.'),
            st('Jadi ' + p.x + '%.', p.x)] });
        }),
      lv('Membandingkan pecahan', '3/5 atau 5/8 → 5/8', 'pecahan',
        (r, c) => {
          const arah = pilihJenis(r, c, ['besar', 'kecil']);
          let a, b;
          do {
            const qa = r.bulat(2, 12), qb = r.bulat(2, 12);
            a = [r.bulat(1, qa - 1), qa]; b = [r.bulat(1, qb - 1), qb];
          } while (a[1] === b[1] || gcd(a[0], a[1]) !== 1 || gcd(b[0], b[1]) !== 1 || kpk(a[1], b[1]) > 60 || a[0] * b[1] === b[0] * a[1]);
          return { arah, a, b };
        },
        ({ arah, a, b }) => {
          const L = kpk(a[1], b[1]), na = a[0] * L / a[1], nb = b[0] * L / b[1];
          const pilih = (na > nb) === (arah === 'besar') ? a : b;
          const ans = P(pilih[0], pilih[1]);
          return S.pecahan('Mana yang lebih ' + arah + ': ' + a[0] + '/' + a[1] + ' atau ' + b[0] + '/' + b[1] + '?', ans, { jenis: arah, sederhana: false, langkah: [
            st('Samakan penyebut dengan KPK(' + a[1] + ', ' + b[1] + ') = ' + L + '.'),
            st(a[0] + '/' + a[1] + ' = ' + na + '/' + L + ' dan ' + b[0] + '/' + b[1] + ' = ' + nb + '/' + L + '.'),
            st('Karena ' + Math.max(na, nb) + ' > ' + Math.min(na, nb) + ', yang lebih ' + arah + ' adalah ' + pilih[0] + '/' + pilih[1] + '.', P(pilih[0], pilih[1]))] });
        }),
      lv('Penjumlahan dan pengurangan pecahan', '2/3 + 1/4 = 11/12', 'pecahan',
        (r, c) => {
          const op = pilihJenis(r, c, ['+', '-']);
          let a, b;
          do {
            const qa = r.bulat(2, 12), qb = r.peluang(0.15) ? qa : r.bulat(2, 12);
            a = [r.bulat(1, qa - 1), qa]; b = [r.bulat(1, qb - 1), qb];
            if (op === '-' && a[0] * b[1] <= b[0] * a[1]) { const t = a; a = b; b = t; }
          } while (a[0] * b[1] === b[0] * a[1] || (op === '-' && a[0] * b[1] <= b[0] * a[1]));
          return { op, a, b };
        },
        ({ op, a, b }) => {
          const L = kpk(a[1], b[1]), na = a[0] * L / a[1], nb = b[0] * L / b[1];
          const n = op === '+' ? na + nb : na - nb;
          const direct = op === '+' ? CP.pTambah(P(a[0], a[1]), P(b[0], b[1])) : CP.pKurang(P(a[0], a[1]), P(b[0], b[1]));
          return S.pecahan('Hitunglah ' + a[0] + '/' + a[1] + ' ' + (op === '+' ? '+' : MIN) + ' ' + b[0] + '/' + b[1] + '.', direct, { jenis: op === '+' ? 'tambah' : 'kurang', langkah: [
            st('Samakan penyebut: KPK(' + a[1] + ', ' + b[1] + ') = ' + L + '.'),
            st(a[0] + '/' + a[1] + ' = ' + na + '/' + L + ' dan ' + b[0] + '/' + b[1] + ' = ' + nb + '/' + L + '.'),
            st(na + '/' + L + ' ' + (op === '+' ? '+' : MIN) + ' ' + nb + '/' + L + ' = ' + n + '/' + L + ', disederhanakan menjadi ' + bs(P(n, L)) + '.', P(n, L))] });
        }),
      lv('Perkalian dan pembagian pecahan', '1/2 ÷ 1/4 = 2; 2/3 × 9/10 = 3/5', 'pecahan',
        (r, c) => {
          const op = pilihJenis(r, c, ['*', '/']);
          const mk = () => { let p, q; do { q = r.bulat(2, 10); p = r.bulat(1, q + 3); } while (gcd(p, q) !== 1); return [p, q]; };
          return { op, a: mk(), b: mk() };
        },
        ({ op, a, b }) => {
          const kali = op === '*';
          const [p1, q1] = a; let [p2, q2] = b;
          const langkah = [];
          if (!kali) { langkah.push(st('Pembagian pecahan = kali kebalikan: ' + p1 + '/' + q1 + ' × ' + q2 + '/' + p2 + '.')); const t = p2; p2 = q2; q2 = t; }
          const g1 = gcd(p1, q2), g2 = gcd(p2, q1);
          const n = (p1 / g1) * (p2 / g2), d = (q1 / g2) * (q2 / g1);
          langkah.push(st('Kalikan pembilang dengan pembilang dan penyebut dengan penyebut; sederhanakan lebih dulu bila bisa.'));
          langkah.push(st('Hasilnya ' + bs(P(n, d)) + '.', P(n, d)));
          const direct = kali ? CP.pKali(P(a[0], a[1]), P(b[0], b[1])) : CP.pBagi(P(a[0], a[1]), P(b[0], b[1]));
          return S.pecahan('Hitunglah ' + a[0] + '/' + a[1] + ' ' + (kali ? '×' : '÷') + ' ' + b[0] + '/' + b[1] + '.', direct, { jenis: kali ? 'kali' : 'bagi', langkah });
        }),
      lv('Soal cerita pecahan dan desimal', 'Pita 3/4 m dipotong 1/8 m → 6 bagian', 'pecahan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['potong', 'sisa', 'desKurang', 'desBagi', 'pecahanDari']);
          const nama = r.pilih(CP.NAMA);
          if (jenis === 'potong') { let p, q, m; do { [p, q] = adaPecah(r); m = r.bulat(2, 6); } while (q * m > 24); return { jenis, nama, p, q, m, benda: r.pilih(['pita', 'tali rafia', 'kawat']) }; }
          if (jenis === 'sisa') {
            let a, b, w;
            do { const qa = r.bulat(2, 8), qb = r.bulat(2, 8); a = [r.bulat(1, qa - 1), qa]; b = [r.bulat(1, qb - 1), qb]; w = r.bulat(1, 3); }
            while (a[1] === b[1] || P(a[0] * b[1] + b[0] * a[1], a[1] * b[1]).n >= w * P(a[0] * b[1] + b[0] * a[1], a[1] * b[1]).d);
            return { jenis, nama, a, b, w };
          }
          if (jenis === 'desKurang') { const x = r.bulat(150, 400); let y; do { y = r.bulat(10, 99); } while (y >= x); return { jenis, nama, x, y }; }
          if (jenis === 'desBagi') return { jenis, nama, k: r.bulat(2, 8), y: r.bulat(2, 9) };
          const [p, q] = adaPecah(r);
          return { jenis, nama, p, q, T: q * r.bulat(2, 8) };
        },
        (p) => {
          if (p.jenis === 'potong') {
            const rr = p.q * p.m, v = P(p.p * rr, p.q);
            return S.pecahan(p.nama + ' memiliki ' + p.benda + ' sepanjang ' + p.p + '/' + p.q + ' meter. ' + p.benda.charAt(0).toUpperCase() + p.benda.slice(1) + ' itu dipotong menjadi bagian-bagian sama panjang, masing-masing 1/' + rr + ' meter. Berapa banyak potongan yang didapat?', P(p.p * p.m, 1), { jenis: 'potong', sederhana: false, langkah: [
              st('Banyak potongan = panjang total ÷ panjang tiap potongan: ' + p.p + '/' + p.q + ' ÷ 1/' + rr + '.'),
              st('Kali kebalikan: ' + p.p + '/' + p.q + ' × ' + rr + '/1 = ' + (p.p * rr) + '/' + p.q + ' = ' + (p.p * p.m) + '.', v)] });
          }
          if (p.jenis === 'sisa') {
            const L = kpk(p.a[1], p.b[1]);
            const n = p.w * L - p.a[0] * L / p.a[1] - p.b[0] * L / p.b[1];
            const direct = CP.pKurang(CP.pKurang(P(p.w, 1), P(p.a[0], p.a[1])), P(p.b[0], p.b[1]));
            return S.pecahan('Ibu membeli ' + p.w + ' kg gula. Sebanyak ' + p.a[0] + '/' + p.a[1] + ' kg dipakai untuk membuat kue dan ' + p.b[0] + '/' + p.b[1] + ' kg untuk minuman. Berapa kilogram gula yang tersisa?', direct, { jenis: 'sisa', satuan: 'kg', langkah: [
              st('Sisa = ' + p.w + ' − ' + p.a[0] + '/' + p.a[1] + ' − ' + p.b[0] + '/' + p.b[1] + '. Samakan penyebut dengan ' + L + '.'),
              st((p.w * L) + '/' + L + ' − ' + (p.a[0] * L / p.a[1]) + '/' + L + ' − ' + (p.b[0] * L / p.b[1]) + '/' + L + ' = ' + n + '/' + L + ' = ' + bs(P(n, L)) + ' kg.', P(n, L))] });
          }
          if (p.jenis === 'desKurang') {
            const v = P(p.x - p.y, 100);
            return S.angka('Sebuah botol berisi ' + dec(P(p.x, 100)) + ' liter air. Sebanyak ' + dec(P(p.y, 100)) + ' liter dituang ke gelas. Berapa liter air yang tersisa?', P(p.x - p.y, 100), { jenis: 'desKurang', satuan: 'liter', izin: { koma: true }, langkah: [
              st('Kurangkan dengan menyejajarkan koma: ' + dec(P(p.x, 100)) + ' − ' + dec(P(p.y, 100)) + '.'),
              st('Sama dengan ' + p.x + ' − ' + p.y + ' = ' + (p.x - p.y) + ' per 100, yaitu ' + dec(v) + ' liter.', v)] });
          }
          if (p.jenis === 'desBagi') {
            const x = P(p.k * p.y, 10), v = P(p.k * p.y, 10 * p.k);
            return S.angka('Tali sepanjang ' + dec(x) + ' meter dipotong menjadi ' + p.k + ' bagian sama panjang. Berapa panjang tiap potongan (dalam meter)?', P(p.y, 10), { jenis: 'desBagi', satuan: 'meter', izin: { koma: true }, langkah: [
              st('Bagi panjang tali dengan banyak potongan: ' + dec(x) + ' ÷ ' + p.k + '.'),
              st((p.k * p.y) + ' per 10 dibagi ' + p.k + ' = ' + p.y + ' per 10 = ' + dec(v) + ' meter.', v)] });
          }
          const sat = p.T / p.q, v = p.p * sat;
          return S.angka('Dari ' + p.T + ' siswa kelas VII-C, ' + p.p + '/' + p.q + ' bagian membawa bekal dari rumah. Berapa siswa yang membawa bekal?', v, { jenis: 'pecahanDari', satuan: 'siswa', langkah: [
            st('Bagi ' + p.T + ' menjadi ' + p.q + ' bagian sama besar: ' + p.T + ' ÷ ' + p.q + ' = ' + sat + '.'),
            st('Ambil ' + p.p + ' bagian: ' + p.p + ' × ' + sat + ' = ' + v + '.', v)] });
        })
    ]
  });

  /* ========================= VII-3 RASIO ========================= */
  const rasioTeks = (a, b) => a + ' : ' + b;
  const kuncRas = (a, b) => { const g = gcd(a, b); return (a / g) + ':' + (b / g); };
  const kOpsi = (a, b) => ({ t: rasioTeks(a, b), k: kuncRas(a, b), v: rasioTeks(a, b) });
  const KEND = ['sepeda motor', 'mobil', 'bus', 'kereta api', 'sepeda'];

  CP.aktifkan('VII-3', {
    level: [
      lv('Menyederhanakan rasio', '12 : 18 = 2 : 3', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['biasa', 'satuan']);
          if (jenis === 'biasa') { let p, q; do { p = r.bulat(1, 9); q = r.bulat(1, 9); } while (gcd(p, q) !== 1 || p === q); return { jenis, p, q, k: r.bulat(2, 8) }; }
          return { jenis, a: r.pilih([10, 20, 25, 40, 50, 60, 75, 80]), b: r.bulat(1, 3) };
        },
        (p, ctx) => {
          const rng = CP.buatRng((p.p || p.a) * 131 + (p.q || p.b) * 17 + (p.k || 0));
          if (p.jenis === 'biasa') {
            const a = p.k * p.p, b = p.k * p.q;
            const benar = kOpsi(p.p, p.q);
            const salah = [kOpsi(p.q, p.p), kOpsi(p.p, b), kOpsi(a, p.q), kOpsi(p.p + 1, p.q), kOpsi(p.p, p.q + 1), kOpsi(a - p.k + 1, b)];
            const h = CP.rakitPilihan(rng, benar, salah);
            return S.pilihan('Bentuk paling sederhana dari rasio ' + a + ' : ' + b + ' adalah …', h, { jenis: 'biasa', langkah: [
              st('Cari FPB dari ' + a + ' dan ' + b + ': FPB = ' + p.k + '.'),
              st('Bagi kedua bilangan dengan ' + p.k + ': ' + a + ' ÷ ' + p.k + ' = ' + p.p + ' dan ' + b + ' ÷ ' + p.k + ' = ' + p.q + '.'),
              st('Jadi ' + a + ' : ' + b + ' = ' + p.p + ' : ' + p.q + '.', rasioTeks(p.p, p.q))] });
          }
          const b100 = p.b * 100, g = gcd(p.a, b100);
          const benar = kOpsi(p.a / g, b100 / g);
          const salah = [kOpsi(p.a, p.b), kOpsi(b100 / g, p.a / g), kOpsi(p.a, p.b * 10), kOpsi(p.a, p.b * 1000), kOpsi(p.a / g, p.b)];
          const h = CP.rakitPilihan(rng, benar, salah);
          return S.pilihan('Bentuk paling sederhana dari rasio ' + p.a + ' cm : ' + p.b + ' m adalah …', h, { jenis: 'satuan', langkah: [
            st('Samakan satuan dulu: ' + p.b + ' m = ' + b100 + ' cm.'),
            st('Rasio menjadi ' + p.a + ' : ' + b100 + '. Bagi dengan FPB ' + g + '.'),
            st('Hasilnya ' + (p.a / g) + ' : ' + (b100 / g) + '.', rasioTeks(p.a / g, b100 / g))] });
        }),
      lv('Membagi jumlah menurut rasio', 'Total 40, rasio 2 : 3 → 16 dan 24', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['kelereng', 'permen', 'stiker', 'uang']);
          let a, b; do { a = r.bulat(1, 7); b = r.bulat(1, 7); } while (a === b || gcd(a, b) !== 1);
          return { jenis, a, b, m: r.bulat(2, 12), tanya: r.pilih(['pertama', 'kedua']), nama: CP.dua(r) };
        },
        ({ jenis, a, b, m, tanya, nama }) => {
          const u = jenis === 'uang' ? 1000 : 1, sj = a + b, total = m * sj * u, satu = m * u;
          const bag = tanya === 'pertama' ? a : b, X = tanya === 'pertama' ? nama[0] : nama[1];
          const teks = jenis === 'uang'
            ? nama[0] + ' dan ' + nama[1] + ' membagi uang ' + RP(total) + ' dengan perbandingan ' + a + ' : ' + b + '. Berapa rupiah yang diterima ' + X + '?'
            : nama[0] + ' dan ' + nama[1] + ' memiliki ' + total + ' ' + jenis + ' dengan perbandingan ' + a + ' : ' + b + '. Berapa ' + jenis + ' milik ' + X + '?';
          const s = S.angka(teks, bag * satu, { jenis, awalan: jenis === 'uang' ? 'Rp' : undefined, langkah: [
            st('Jumlah bagian = ' + a + ' + ' + b + ' = ' + sj + '.'),
            st('Satu bagian = ' + (jenis === 'uang' ? RP(total) : total) + ' ÷ ' + sj + ' = ' + (jenis === 'uang' ? RP(satu) : satu) + '.'),
            st('Bagian ' + X + ' = ' + bag + ' × ' + (jenis === 'uang' ? RP(satu) : satu) + ' = ' + (jenis === 'uang' ? RP(bag * satu) : bag * satu) + '.', bag * satu)] });
          s.dibagi = [{ a: total, b: sj }];
          return s;
        }),
      lv('Skala peta', 'Skala 1 : 200.000, 3 cm → 6 km', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['petaKeReal', 'realKePeta']), S: r.pilih([100000, 200000, 250000, 500000, 1000000]), cm: r.bulat(1, 12) }),
        ({ jenis, S: sk, cm }) => {
          const km = P(cm * sk, 100000);
          if (jenis === 'petaKeReal') {
            return S.angka('Pada peta berskala 1 : ' + F(sk) + ', jarak dua kota adalah ' + cm + ' cm. Berapa jarak sebenarnya dalam km?', km, { jenis, satuan: 'km', izin: { koma: true }, langkah: [
              st('Jarak sebenarnya = jarak di peta × skala: ' + cm + ' × ' + F(sk) + ' = ' + F(cm * sk) + ' cm.'),
              st('Ubah ke km (bagi 100.000): ' + F(cm * sk) + ' cm = ' + dec(km) + ' km.', km)] });
          }
          return S.angka('Skala sebuah peta adalah 1 : ' + F(sk) + '. Jarak sebenarnya dua kota ' + dec(km) + ' km. Berapa jarak keduanya pada peta (dalam cm)?', cm, { jenis, satuan: 'cm', langkah: [
            st('Ubah ke cm: ' + dec(km) + ' km × 100.000 = ' + F(cm * sk) + ' cm.'),
            st('Jarak di peta = jarak sebenarnya ÷ skala = ' + F(cm * sk) + ' ÷ ' + F(sk) + ' = ' + cm + ' cm.', P(km.n * 100000, km.d * sk))] });
        }),
      lv('Laju dan harga per satuan', '120 km dalam 2 jam → 60 km/jam', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['kecepatan', 'jarak', 'waktu', 'harga']);
          const v = 5 * r.bulat(4, 18), t = r.bulat(2, 6);
          const item = r.pilih([['beras', 'kg'], ['minyak goreng', 'liter'], ['telur', 'kg'], ['gula pasir', 'kg'], ['jeruk', 'kg']]);
          return { jenis, v, t, kend: r.pilih(KEND), n: r.bulat(2, 12), u: 500 * r.bulat(2, 40), item };
        },
        (p) => {
          const s = p.v * p.t;
          if (p.jenis === 'kecepatan') return S.angka('Sebuah ' + p.kend + ' menempuh jarak ' + s + ' km dalam waktu ' + p.t + ' jam. Berapa kecepatan rata-ratanya?', p.v, { jenis: 'kecepatan', satuan: 'km/jam', langkah: [
            st('Kecepatan = jarak ÷ waktu.'), st(s + ' ÷ ' + p.t + ' = ' + p.v + ' km/jam.', P(s, p.t))], dibagi: [{ a: s, b: p.t }] });
          if (p.jenis === 'jarak') return S.angka('Sebuah ' + p.kend + ' melaju dengan kecepatan ' + p.v + ' km/jam selama ' + p.t + ' jam. Berapa jarak yang ditempuh?', s, { jenis: 'jarak', satuan: 'km', langkah: [
            st('Jarak = kecepatan × waktu.'), st(p.v + ' × ' + p.t + ' = ' + s + ' km.', p.v * p.t)] });
          if (p.jenis === 'waktu') return S.angka('Jarak ' + s + ' km ditempuh dengan kecepatan tetap ' + p.v + ' km/jam. Berapa lama perjalanannya?', p.t, { jenis: 'waktu', satuan: 'jam', langkah: [
            st('Waktu = jarak ÷ kecepatan.'), st(s + ' ÷ ' + p.v + ' = ' + p.t + ' jam.', P(s, p.v))], dibagi: [{ a: s, b: p.v }] });
          const total = p.n * p.u;
          return S.angka('Harga ' + p.n + ' ' + p.item[1] + ' ' + p.item[0] + ' adalah ' + RP(total) + '. Berapa harga per ' + p.item[1] + '?', p.u, { jenis: 'harga', awalan: 'Rp', langkah: [
            st('Harga per satuan = harga total ÷ banyak satuan.'), st(RP(total) + ' ÷ ' + p.n + ' = ' + RP(p.u) + '.', P(total, p.n))], dibagi: [{ a: total, b: p.n }] });
        }),
      lv('Perbandingan senilai', '3 buku Rp15.000 → 7 buku Rp35.000', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['harga', 'resep', 'bensin']);
          let a, b; do { a = r.bulat(2, 12); b = r.bulat(2, 12); } while (a === b);
          return { jenis, a, b, u: 500 * r.bulat(2, 24), cc: 10 * r.bulat(2, 10), benda: r.pilih(['buku tulis', 'pensil', 'penggaris', 'pulpen', 'permen cokelat']), kk: r.bulat(3, 5) * 10 };
        },
        (p) => {
          if (p.jenis === 'harga') return S.angka(p.a + ' ' + p.benda + ' harganya ' + RP(p.a * p.u) + '. Berapa harga ' + p.b + ' ' + p.benda + '?', p.b * p.u, { jenis: 'harga', awalan: 'Rp', langkah: [
            st('Cari harga satu: ' + RP(p.a * p.u) + ' ÷ ' + p.a + ' = ' + RP(p.u) + '.'),
            st('Harga ' + p.b + ' = ' + p.b + ' × ' + RP(p.u) + ' = ' + RP(p.b * p.u) + '.', p.b * P(p.a * p.u, p.a).n)], dibagi: [{ a: p.a * p.u, b: p.a }] });
          if (p.jenis === 'resep') return S.angka('Resep kue untuk ' + p.a + ' porsi memerlukan ' + (p.a * p.cc) + ' gram tepung. Berapa gram tepung untuk ' + p.b + ' porsi?', p.b * p.cc, { jenis: 'resep', satuan: 'gram', langkah: [
            st('Tepung per porsi: ' + (p.a * p.cc) + ' ÷ ' + p.a + ' = ' + p.cc + ' gram.'),
            st(p.b + ' × ' + p.cc + ' = ' + (p.b * p.cc) + ' gram.', p.b * ((p.a * p.cc) / p.a))], dibagi: [{ a: p.a * p.cc, b: p.a }] });
          return S.angka('Sepeda motor menghabiskan ' + p.a + ' liter bensin untuk menempuh ' + (p.a * p.kk) + ' km. Berapa km yang bisa ditempuh dengan ' + p.b + ' liter bensin?', p.b * p.kk, { jenis: 'bensin', satuan: 'km', langkah: [
            st('Jarak per liter: ' + (p.a * p.kk) + ' ÷ ' + p.a + ' = ' + p.kk + ' km.'),
            st(p.b + ' × ' + p.kk + ' = ' + (p.b * p.kk) + ' km.', p.b * ((p.a * p.kk) / p.a))], dibagi: [{ a: p.a * p.kk, b: p.a }] });
        }),
      lv('Perbandingan berbalik nilai', '6 pekerja 10 hari → 4 pekerja 15 hari', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['pekerja', 'kecepatan', 'ternak', 'keran']);
          let w1, d1, w2, tries = 0;
          for (;;) {
            w1 = r.bulat(2, 12); d1 = r.bulat(2, 20);
            const K = w1 * d1;
            const kand = []; for (let w = 2; w <= 24; w++) if (K % w === 0 && w !== w1) kand.push(w);
            if (kand.length) { w2 = r.pilih(kand); break; }
            if (++tries > 100) { w1 = 6; d1 = 10; w2 = 4; break; }
          }
          return { jenis, w1, d1, w2 };
        },
        ({ jenis, w1, d1, w2 }) => {
          const K = w1 * d1, ans = K / w2;
          let teks, satuan;
          if (jenis === 'pekerja') { teks = w1 + ' pekerja menyelesaikan suatu pekerjaan dalam ' + d1 + ' hari. Jika dikerjakan oleh ' + w2 + ' pekerja dengan kemampuan sama, berapa hari pekerjaan itu selesai?'; satuan = 'hari'; }
          else if (jenis === 'kecepatan') { teks = 'Dengan kecepatan ' + (10 * w1) + ' km/jam, suatu perjalanan ditempuh dalam ' + d1 + ' jam. Jika kecepatan menjadi ' + (10 * w2) + ' km/jam, berapa jam waktu tempuhnya?'; satuan = 'jam'; }
          else if (jenis === 'ternak') { teks = 'Persediaan pakan cukup untuk ' + w1 + ' ekor ayam selama ' + d1 + ' hari. Jika ayam menjadi ' + w2 + ' ekor, pakan itu cukup untuk berapa hari?'; satuan = 'hari'; }
          else { teks = w1 + ' keran sejenis mengisi sebuah bak sampai penuh dalam ' + d1 + ' jam. Jika dipakai ' + w2 + ' keran, berapa jam bak itu penuh?'; satuan = 'jam'; }
          const s = S.angka(teks, ans, { jenis, satuan, langkah: [
            st('Perbandingan berbalik nilai: hasil kali kedua besaran tetap.'),
            st('Hasil kali tetap = ' + (jenis === 'kecepatan' ? (10 * w1) : w1) + ' × ' + d1 + ' = ' + (jenis === 'kecepatan' ? 10 * K : K) + '.'),
            st((jenis === 'kecepatan' ? 10 * K : K) + ' ÷ ' + (jenis === 'kecepatan' ? 10 * w2 : w2) + ' = ' + ans + ' ' + satuan + '.', P(K, w2))] });
          s.dibagi = [{ a: K, b: w2 }];
          return s;
        })
    ]
  });

  /* ========================= X-1 EKSPONEN DAN BENTUK AKAR ========================= */
  // opsi bentuk akar: nilai = n * akar(r) / d
  const akar = (n, r, d) => { d = d || 1; const g = gcd(n, d); n /= g; d /= g; return { n, r, d }; };
  const akarTeks = (o) => {
    if (o.r === 1) return o.d === 1 ? String(o.n) : o.n + ' / ' + o.d;
    const koef = o.n === 1 ? '' : String(o.n);
    return koef + '√' + o.r + (o.d === 1 ? '' : ' / ' + o.d);
  };
  const akarNilai = (o) => (o.n * Math.sqrt(o.r)) / o.d;
  const akarOpsi = (o) => { const v = akarNilai(o); return { t: akarTeks(o), k: (Math.round(v * 1e8) / 1e8).toFixed(8), v }; };
  const akarLengkap = (benar, daftar) => {
    const out = daftar.filter((o) => o.n >= 1 && o.d >= 1 && o.r >= 1).map(akarOpsi);
    for (let i = 1; i < 12; i++) out.push(akarOpsi({ n: benar.n + i, r: benar.r, d: benar.d }));
    return out;
  };

  CP.aktifkan('X-1', {
    level: [
      lv('Definisi eksponen dan pangkat nol', '2⁵ = 32; 5⁰ = 1', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['pangkat', 'nol']);
          if (jenis === 'nol') return { jenis, a: r.bulat(2, 50) };
          const a = r.bulat(2, 9); const nMaks = a <= 3 ? 6 : a <= 5 ? 4 : 3;
          return { jenis, a, n: r.bulat(2, nMaks) };
        },
        (p) => {
          if (p.jenis === 'nol') return S.angka('Berapakah nilai ' + p.a + sup(0) + '?', 1, { jenis: 'nol', langkah: [
            st('Bilangan tak nol yang dipangkatkan 0 selalu bernilai 1.'), st(p.a + sup(0) + ' = 1.', 1)] });
          let v = 1; const fak = []; for (let i = 0; i < p.n; i++) { v *= p.a; fak.push(p.a); }
          return S.angka('Hitunglah ' + p.a + sup(p.n) + '.', Math.pow(p.a, p.n), { jenis: 'pangkat', langkah: [
            st('Pangkat berarti perkalian berulang: ' + p.a + sup(p.n) + ' = ' + fak.join(' × ') + '. Kerjakan satu per satu, tiap langkah hanya mengalikan dengan ' + p.a + '.')].concat(CP.tanggaPangkat(p.a, p.n).slice(1).map((t) => st(t)), [st('Hasilnya ' + F(v) + '.', v)]) });
        }),
      lv('Perkalian dan pembagian pangkat', '2³ × 2⁴ = 128; 3⁶ ÷ 3⁴ = 9', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['kali', 'bagi']);
          const a = r.bulat(2, 5);
          if (jenis === 'kali') { const tot = a === 5 ? 6 : 8; const m = r.bulat(1, tot - 1); return { jenis, a, m, n: r.bulat(1, tot - m) }; }
          const m = r.bulat(3, 8); return { jenis, a, m, n: r.bulat(1, m - 1) };
        },
        (p) => {
          if (p.jenis === 'kali') {
            const e = p.m + p.n; const v = pangkat(p.a, e);
            return S.angka('Hitunglah ' + p.a + sup(p.m) + ' × ' + p.a + sup(p.n) + '.', pangkat(p.a, p.m) * pangkat(p.a, p.n), { jenis: 'kali', langkah: [
              st('Bilangan pokok sama: pangkat dijumlahkan, ' + p.m + ' + ' + p.n + ' = ' + e + '.'),
              st(p.a + sup(e) + ' = ' + F(v) + '.', v)] });
          }
          const e = p.m - p.n; const v = pangkat(p.a, e);
          return S.angka('Hitunglah ' + p.a + sup(p.m) + ' ÷ ' + p.a + sup(p.n) + '.', pangkat(p.a, p.m) / pangkat(p.a, p.n), { jenis: 'bagi', langkah: [
            st('Bilangan pokok sama: pangkat dikurangkan, ' + p.m + ' − ' + p.n + ' = ' + e + '.'),
            st(p.a + sup(e) + ' = ' + F(v) + '.', v)] });
        }),
      lv('Pangkat dari pangkat dan pangkat negatif', '(3²)³ = 729; 2⁻³ = 1/8', 'pecahan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['pp', 'neg', 'bagiNeg']);
          if (jenis === 'pp') { const a = r.bulat(2, 4); const mn = a === 4 ? [[2, 2], [2, 3], [3, 2]] : [[2, 2], [2, 3], [3, 2], [3, 3]]; const [m, n] = r.pilih(mn); return { jenis, a, m, n }; }
          if (jenis === 'neg') return { jenis, a: r.bulat(2, 5), n: r.bulat(1, 4) };
          const a = r.bulat(2, 4), m = r.bulat(1, 3); return { jenis, a, m, n: m + r.bulat(1, 3) };
        },
        (p) => {
          if (p.jenis === 'pp') {
            const e = p.m * p.n, v = pangkat(p.a, e);
            return S.angka('Hitunglah (' + p.a + sup(p.m) + ')' + sup(p.n) + '.', pangkat(pangkat(p.a, p.m), p.n), { jenis: 'pp', langkah: [
              st('Pangkat dari pangkat: pangkatnya dikalikan, ' + p.m + ' × ' + p.n + ' = ' + e + '.'),
              st(p.a + sup(e) + ' = ' + F(v) + '.', v)] });
          }
          if (p.jenis === 'neg') {
            const d = pangkat(p.a, p.n);
            return S.pecahan('Tulis ' + p.a + sup('-' + p.n) + ' sebagai pecahan.', P(1, pangkat(p.a, p.n)), { jenis: 'neg', langkah: [
              st('Pangkat negatif: ' + p.a + sup('-' + p.n) + ' = 1/' + p.a + sup(p.n) + '.'),
              st(p.a + sup(p.n) + ' = ' + d + ', jadi hasilnya 1/' + d + '.', P(1, d))] });
          }
          const e = p.n - p.m, d = pangkat(p.a, e);
          return S.pecahan('Hitunglah ' + p.a + sup(p.m) + ' ÷ ' + p.a + sup(p.n) + '.', P(pangkat(p.a, p.m), pangkat(p.a, p.n)), { jenis: 'bagiNeg', langkah: [
            st('Kurangkan pangkat: ' + p.m + ' − ' + p.n + ' = ' + (p.m - p.n) + ', sehingga hasilnya ' + p.a + sup(p.m - p.n) + '.'),
            st(p.a + sup(p.m - p.n) + ' = 1/' + p.a + sup(e) + ' = 1/' + d + '.', P(1, d))] });
        }),
      lv('Menyederhanakan bentuk akar', '√72 = 6√2', 'pilihan',
        (r) => ({ k: r.bulat(2, 9), m: r.pilih([2, 3, 5, 6, 7, 10, 11]), s: r.bulat(1, 99999) }),
        ({ k, m, s }) => {
          const N = k * k * m; const rng = CP.buatRng(s + N);
          const benar = akarOpsi(akar(k, m, 1));
          const salah = akarLengkap(akar(k, m, 1), [akar(k * k, m, 1), akar(k + 1, m, 1), akar(k - 1, m, 1), akar(m, k, 1), akar(k, m + 1, 1)]);
          const h = CP.rakitPilihan(rng, benar, salah);
          return S.pilihan('Bentuk paling sederhana dari √' + N + ' adalah …', h, { jenis: 'sederhanakan', langkah: [
            st('Cari faktor bilangan kuadrat terbesar: ' + N + ' = ' + (k * k) + ' × ' + m + '.'),
            st('√' + N + ' = √' + (k * k) + ' × √' + m + ' = ' + k + '√' + m + '.', k * Math.sqrt(m))] });
        }),
      lv('Operasi bentuk akar', '√12 + √27 = 5√3', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['tambah', 'kurang', 'kali']);
          const s = r.bulat(1, 99999);
          if (jenis === 'kali') {
            const m = r.pilih([2, 3, 5, 6, 7]), k = r.bulat(2, 4), tot = k * k * m;
            const dv = []; for (let d = 2; d < tot; d++) if (tot % d === 0 && d !== tot / d && tot / d >= 2) dv.push(d);
            return { jenis, m, k, x: r.pilih(dv), s };
          }
          const m = r.pilih([2, 3, 5, 6, 7]); let k1 = r.bulat(1, 5), k2 = r.bulat(1, 5);
          if (jenis === 'kurang') { while (k1 === k2) k2 = r.bulat(1, 5); if (k1 < k2) { const t = k1; k1 = k2; k2 = t; } }
          if (k1 === 1 && k2 === 1 && jenis === 'tambah') k2 = 2;
          return { jenis, m, k1, k2, s };
        },
        (p) => {
          const rng = CP.buatRng(p.s + p.m * 7);
          if (p.jenis === 'kali') {
            const tot = p.k * p.k * p.m, y = tot / p.x;
            const benar = akarOpsi(akar(p.k, p.m, 1));
            const salah = akarLengkap(akar(p.k, p.m, 1), [akar(p.k, p.m + 1, 1), akar(1, p.x + y, 1), akar(p.k + 1, p.m, 1), akar(p.m, p.k, 1)]);
            const h = CP.rakitPilihan(rng, benar, salah);
            return S.pilihan('Hasil dari √' + p.x + ' × √' + y + ' dalam bentuk paling sederhana adalah …', h, { jenis: 'kali', langkah: [
              st('Kalikan bilangan di bawah akar: √' + p.x + ' × √' + y + ' = √' + (p.x * y) + '.'),
              st('Sederhanakan: ' + (p.x * y) + ' = ' + (p.k * p.k) + ' × ' + p.m + ', maka √' + (p.x * y) + ' = ' + p.k + '√' + p.m + '.', Math.sqrt(p.x) * Math.sqrt(y))] });
          }
          const tam = p.jenis === 'tambah';
          const a = p.k1 * p.k1 * p.m, b = p.k2 * p.k2 * p.m;
          const kf = tam ? p.k1 + p.k2 : p.k1 - p.k2;
          const benar = akarOpsi(akar(kf, p.m, 1));
          const salah = akarLengkap(akar(kf, p.m, 1), [akar(1, tam ? a + b : a - b, 1), akar(kf + 1, p.m, 1), akar(kf - 1, p.m, 1), akar(tam ? p.k1 * p.k2 : p.k1 + p.k2, p.m, 1), akar(kf, p.m * 2, 1)]);
          const h = CP.rakitPilihan(rng, benar, salah);
          return S.pilihan('Hasil dari √' + a + ' ' + (tam ? '+' : MIN) + ' √' + b + ' adalah …', h, { jenis: p.jenis, langkah: [
            st('Sederhanakan tiap akar: √' + a + ' = ' + p.k1 + '√' + p.m + ' dan √' + b + ' = ' + p.k2 + '√' + p.m + '.'),
            st('Akar sejenis: koefisiennya ' + (tam ? 'dijumlahkan' : 'dikurangkan') + ': ' + p.k1 + ' ' + (tam ? '+' : MIN) + ' ' + p.k2 + ' = ' + kf + '.'),
            st('Hasilnya ' + kf + '√' + p.m + '.', Math.sqrt(a) + (tam ? 1 : -1) * Math.sqrt(b))] });
        }),
      lv('Merasionalkan penyebut', '6/√3 = 2√3', 'pilihan',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['bulat', 'umum']);
          const m = r.pilih([2, 3, 5, 6, 7]); const b = r.pilih([1, 1, 2, 3]);
          let a;
          if (jenis === 'bulat') a = m * r.bulat(1, 6) * (b === 1 ? 1 : 1);
          else { do { a = r.bulat(1, 24); } while (a % m === 0); }
          return { jenis, m, b, a, s: r.bulat(1, 99999) };
        },
        ({ m, b, a, s }) => {
          const rng = CP.buatRng(s + a * 31 + m);
          const g = gcd(a, b * m);
          const o = akar(a, m, b * m);
          const benar = akarOpsi(o);
          const salah = akarLengkap(o, [akar(a, m, b), akar(a, 1, m), akar(a, m, 1), akar(a, m, b * m * m), akar(m, a, b), akar(a, m, b * m + m)]);
          const h = CP.rakitPilihan(rng, benar, salah);
          const asli = a + ' / ' + (b === 1 ? '' : b) + '√' + m;
          return S.pilihan('Rasionalkan penyebut: ' + asli + ' = …', h, { jenis: b === 1 && a % m === 0 ? 'bulat' : 'umum', langkah: [
            st('Kalikan pembilang dan penyebut dengan √' + m + ': ' + asli + ' × √' + m + ' / √' + m + '.'),
            st('Penyebut menjadi ' + (b === 1 ? '' : b + ' × ') + m + ' = ' + (b * m) + ', pembilang ' + a + '√' + m + '.'),
            st('Sederhanakan dengan FPB ' + g + ': ' + akarTeks(o) + '.', (a * Math.sqrt(m)) / (b * m))] });
        })
    ]
  });

  /* ========================= X-2 BARISAN, DERET, BUNGA ========================= */
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const sub = (n) => String(n).replace(/\d/g, (d) => SUBS[+d]);
  const bungaMajemuk = (M, p, t) => { let x = M; for (let i = 0; i < t; i++) x = x * (100 + p) / 100; return x; };

  CP.aktifkan('X-2', {
    level: [
      lv('Suku berikutnya dari pola', '3, 7, 11, 15, … → 19', 'angka',
        (r, c) => {
          const jenis = pilihJenis(r, c, ['arit', 'geom', 'tingkat']);
          if (jenis === 'arit') return { jenis, a: r.bulat(1, 20), b: r.bulat(2, 9) };
          if (jenis === 'geom') return { jenis, a: r.bulat(1, 5), q: r.bulat(2, 3) };
          return { jenis, a: r.bulat(1, 10), b: r.bulat(1, 4) };
        },
        (p) => {
          let t = [], ans, langkah;
          if (p.jenis === 'arit') {
            for (let i = 0; i < 4; i++) t.push(p.a + i * p.b); ans = p.a + 4 * p.b;
            langkah = [st('Selisih tiap suku tetap: ' + t[1] + ' − ' + t[0] + ' = ' + p.b + '. Ini barisan aritmetika.'), st('Suku berikutnya: ' + t[3] + ' + ' + p.b + ' = ' + (t[3] + p.b) + '.', t[3] + p.b)];
          } else if (p.jenis === 'geom') {
            for (let i = 0; i < 4; i++) t.push(p.a * pangkat(p.q, i)); ans = p.a * pangkat(p.q, 4);
            langkah = [st('Rasio tiap suku tetap: ' + t[1] + ' ÷ ' + t[0] + ' = ' + p.q + '. Ini barisan geometri.'), st('Suku berikutnya: ' + t[3] + ' × ' + p.q + ' = ' + (t[3] * p.q) + '.', t[3] * p.q)];
          } else {
            let x = p.a, d = p.b; t = [x];
            for (let i = 0; i < 3; i++) { x += d; d += 1; t.push(x); }
            ans = x + d;
            langkah = [st('Selisihnya ' + (t[1] - t[0]) + ', ' + (t[2] - t[1]) + ', ' + (t[3] - t[2]) + ': naik 1 tiap langkah.'), st('Selisih berikutnya ' + d + ', jadi ' + t[3] + ' + ' + d + ' = ' + (t[3] + d) + '.', t[3] + d)];
          }
          return S.angka('Tentukan suku berikutnya: ' + t.join(', ') + ', …', ans, { jenis: p.jenis, langkah });
        }),
      lv('Suku ke-n barisan aritmetika', '3, 7, 11, … U₁₀ = 39', 'angka',
        (r) => ({ a: r.bulat(1, 20), b: r.bulat(2, 8), n: r.bulat(8, 20) }),
        ({ a, b, n }) => {
          const ans = a + (n - 1) * b;
          return S.angka('Pada barisan ' + a + ', ' + (a + b) + ', ' + (a + 2 * b) + ', …, tentukan suku ke-' + n + ' (U' + sub(n) + ').', ans, { jenis: 'arit', langkah: [
            st('Suku pertama a = ' + a + ', beda b = ' + b + '. Rumus: U' + sub('n') + ' = a + (n − 1)b.'),
            st('U' + sub(n) + ' = ' + a + ' + ' + (n - 1) + ' × ' + b + ' = ' + a + ' + ' + ((n - 1) * b) + ' = ' + ans + '.', a + (n - 1) * b)] });
        }),
      lv('Suku ke-n barisan geometri', '2, 6, 18, … U₅ = 162', 'angka',
        (r) => { const q = r.bulat(2, 3); return { a: r.bulat(1, 5), q, n: r.bulat(4, q === 2 ? 8 : 6) }; },
        ({ a, q, n }) => {
          const ans = a * pangkat(q, n - 1);
          return S.angka('Pada barisan ' + a + ', ' + (a * q) + ', ' + (a * q * q) + ', …, tentukan suku ke-' + n + ' (U' + sub(n) + ').', ans, { jenis: 'geom', langkah: [
            st('Suku pertama a = ' + a + ', rasio r = ' + q + '. Rumus: U' + sub('n') + ' = a × r^(n − 1).'),
            st('U' + sub(n) + ' = ' + a + ' × ' + q + sup(n - 1) + ' = ' + a + ' × ' + F(pangkat(q, n - 1)) + ' = ' + F(ans) + '.', a * pangkat(q, n - 1))] });
        }),
      lv('Jumlah deret aritmetika', '3 + 7 + 11 + … (10 suku) = 210', 'angka',
        (r) => ({ a: r.bulat(1, 15), b: r.bulat(2, 8), n: r.bulat(8, 20) }),
        ({ a, b, n }) => {
          let ans = 0; for (let i = 0; i < n; i++) ans += a + i * b;
          const un = a + (n - 1) * b;
          return S.angka('Hitunglah jumlah ' + n + ' suku pertama deret ' + a + ' + ' + (a + b) + ' + ' + (a + 2 * b) + ' + …', ans, { jenis: 'deret', langkah: [
            st('Suku terakhir: U' + sub(n) + ' = ' + a + ' + ' + (n - 1) + ' × ' + b + ' = ' + un + '.'),
            st('Rumus S' + sub('n') + ' = n/2 × (a + U' + sub('n') + '): S' + sub(n) + ' = ' + n + '/2 × (' + a + ' + ' + un + ') = ' + F(n * (a + un) / 2) + '.', n * (a + un) / 2)] });
        }),
      lv('Bunga tunggal', 'Rp1.000.000, 5%/tahun, 3 tahun → Rp1.150.000', 'angka',
        (r, c) => ({ M: 500000 * r.bulat(1, 10), p: r.bulat(2, 12), t: r.bulat(1, 5), tanya: r.pilih(['total', 'bunga']), v: r.bulat(0, 1) }),
        ({ M, p, t, tanya, v }, ctx) => {
          const I = M * p * t / 100, ans = tanya === 'total' ? M + I : I;
          const voka = ctx.konteks === 'vokasi';
          let teks;
          if (voka) teks = v === 0
            ? 'Bengkel milik Pak Anto meminjam modal ' + RP(M) + ' untuk membeli alat produksi dengan bunga tunggal ' + p + '% per tahun. Berapa ' + (tanya === 'total' ? 'total yang harus dikembalikan' : 'besar bunga yang harus dibayar') + ' setelah ' + t + ' tahun?'
            : 'Sebuah toko online menabung modal usaha ' + RP(M) + ' di koperasi dengan bunga tunggal ' + p + '% per tahun. Berapa ' + (tanya === 'total' ? 'jumlah tabungan' : 'bunga yang diperoleh') + ' setelah ' + t + ' tahun?';
          else teks = v === 0
            ? 'Rina menabung ' + RP(M) + ' di bank dengan bunga tunggal ' + p + '% per tahun. Berapa ' + (tanya === 'total' ? 'jumlah tabungan' : 'besar bunga') + ' setelah ' + t + ' tahun?'
            : 'Pak Budi meminjam uang ' + RP(M) + ' dengan bunga tunggal ' + p + '% per tahun. Berapa ' + (tanya === 'total' ? 'total yang harus dikembalikan' : 'bunga yang harus dibayar') + ' setelah ' + t + ' tahun?';
          const langkah = [
            st('Bunga tunggal: bunga = modal × persen × waktu. Bunga per tahun = ' + RP(M) + ' × ' + p + '% = ' + RP(M * p / 100) + '.'),
            st('Bunga ' + t + ' tahun = ' + t + ' × ' + RP(M * p / 100) + ' = ' + RP(I) + '.', t * (M * p / 100))];
          if (tanya === 'total') langkah.push(st('Total = modal + bunga = ' + RP(M) + ' + ' + RP(I) + ' = ' + RP(M + I) + '.', M + t * (M * p / 100)));
          else langkah[1].v = t * (M * p / 100);
          return S.angka(teks, ans, { jenis: tanya, awalan: 'Rp', langkah });
        }),
      lv('Bunga majemuk', 'Rp1.000.000, 10%/tahun, 2 tahun → Rp1.210.000', 'angka',
        (r) => {
          for (let i = 0; i < 300; i++) {
            const p = r.pilih([4, 5, 8, 10, 12, 15, 20, 25]), t = r.bulat(2, 3), M = 1000000 * r.bulat(1, 10);
            if ((M * Math.pow(100 + p, t)) % Math.pow(100, t) === 0) return { M, p, t, v: r.bulat(0, 1) };
          }
          return { M: 1000000, p: 10, t: 2, v: 0 };
        },
        ({ M, p, t, v }, ctx) => {
          const ans = bungaMajemuk(M, p, t);
          const voka = ctx.konteks === 'vokasi';
          const teks = voka
            ? (v === 0 ? 'Koperasi sekolah meminjamkan ' + RP(M) + ' untuk modal toko dengan bunga majemuk ' + p + '% per tahun. Berapa jumlah yang harus dikembalikan setelah ' + t + ' tahun?'
              : 'Usaha jahit milik Bu Sari menyimpan modal ' + RP(M) + ' dengan bunga majemuk ' + p + '% per tahun. Berapa nilai modal setelah ' + t + ' tahun?')
            : (v === 0 ? 'Dina menabung ' + RP(M) + ' dengan bunga majemuk ' + p + '% per tahun. Berapa jumlah tabungan setelah ' + t + ' tahun?'
              : 'Uang ' + RP(M) + ' didepositokan dengan bunga majemuk ' + p + '% per tahun. Berapa nilai deposito setelah ' + t + ' tahun?');
          const langkah = [st('Bunga majemuk: bunga tahun berikutnya dihitung dari saldo tahun sebelumnya, jadi saldo dikali ' + (100 + p) + '/100 setiap tahun.')];
          let x = M;
          for (let i = 1; i <= t; i++) { const y = x * (100 + p) / 100; langkah.push(st('Akhir tahun ke-' + i + ': ' + RP(x) + ' × ' + (100 + p) + '/100 = ' + RP(y) + '.', y)); x = y; }
          return S.angka(teks, ans, { jenis: 'majemuk', awalan: 'Rp', langkah });
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
