/* CepatPaham - Matematika Tingkat Lanjut Kelas XII (SMA):
   XII-TL-1 Geometri Analitik, XII-TL-2 Limit, XII-TL-3 Turunan Fungsi, XII-TL-4 Integral, XII-TL-5 Analisis Data dan Peluang */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { S, st, lv, P, H } = CP;
  const MIN = CP.MIN;
  const sup = (n) => (/^\d+$/.test(String(n)) ? CP.sup(n) : '^(' + n + ')');
  const pilihJenis = (r, c, daftar) => (c.jenis && daftar.indexOf(c.jenis) >= 0 ? c.jenis : r.pilih(daftar));
  const kons = (c) => (c && c.konteks === 'vokasi' ? 'vokasi' : 'umum');
  const mn = (n) => (n < 0 ? MIN + Math.abs(n) : String(n));
  const nz = (r, lo, hi) => { let x; do { x = r.bulat(lo, hi); } while (x === 0); return x; };
  const opsi = (t, k) => ({ t, k: k || t, v: t });
  const tt = (x, y) => '(' + mn(x) + ', ' + mn(y) + ')';
  // suku banyak dari koefisien menurun
  const poli = (c, v) => { v = v || 'x'; const n = c.length - 1; let s = ''; c.forEach((k, i) => { const p = n - i; if (!k) return; const a = Math.abs(k); let t = (p === 0 || a !== 1) ? String(a) : ''; if (p >= 1) t += v + (p > 1 ? sup(p) : ''); s += s ? (k < 0 ? ' ' + MIN + ' ' : ' + ') + t : (k < 0 ? MIN : '') + t; }); return s || '0'; };
  const lin = (a, b, c) => (a === 1 ? '' : a) + 'x ' + (b < 0 ? MIN : '+') + ' ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y ' + (c < 0 ? MIN : '+') + ' ' + Math.abs(c) + ' = 0';
const linX = (a, b, c) => (b < 0 ? MIN : '+') + ' ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y ' + (c < 0 ? MIN : '+') + ' ' + Math.abs(c) + ' = 0';
  const ev = (c, x) => c.reduce((a, k) => a * x + k, 0);

  /* ================= XII-TL-1 GEOMETRI ANALITIK ================= */
  const gb = (o) => CP.gbrBidang(o);
  const TRIPEL = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]];
  const NORMAL = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]];

  CP.aktifkan('XII-TL-1', {
    level: [
      lv('Jarak dua titik', 'd = √((x₂−x₁)² + (y₂−y₁)²)', 'angka',
        (r) => ({ t: r.pilih(TRIPEL), x1: r.bulat(-4, 3), y1: r.bulat(-4, 3), sx: r.pilih([-1, 1]), sy: r.pilih([-1, 1]), tuk: r.bulat(0, 1) }),
        ({ t, x1, y1, sx, sy, tuk }) => {
          const a = tuk ? t[1] : t[0], b = tuk ? t[0] : t[1], x2 = x1 + sx * a, y2 = y1 + sy * b;
          return S.angka('Tentukan jarak antara titik A' + tt(x1, y1) + ' dan B' + tt(x2, y2) + '.', t[2], { jenis: 'jarak', gambar: gb({ pts: [{ x: x1, y: y1, t: 'A' }, { x: x2, y: y2, t: 'B' }], seg: [{ x1, y1, x2, y2, c: 'merah' }], alt: 'Titik A dan B pada bidang koordinat' }), langkah: [
            st('Δx = ' + mn(x2 - x1) + ', Δy = ' + mn(y2 - y1) + '.'),
            st('d = √(' + a * a + ' + ' + b * b + ') = √' + t[2] * t[2] + ' = ' + t[2] + '.', t[2])] });
        }),
      lv('Titik pembagi ruas garis', 'P = (nA + mB) / (m + n)', 'angka',
        (r, c) => ({ m: r.bulat(1, 3), n: r.bulat(1, 3), x1: r.bulat(-5, 5), y1: r.bulat(-5, 5), tx: nz(r, -3, 3), ty: nz(r, -3, 3), tanya: pilihJenis(r, c, ['x', 'y']) }),
        ({ m, n, x1, y1, tx, ty, tanya }) => {
          const s = m + n, x2 = x1 + s * tx, y2 = y1 + s * ty, px = x1 + m * tx, py = y1 + m * ty;
          return S.angka('Titik P terletak pada ruas AB dengan A' + tt(x1, y1) + ' dan B' + tt(x2, y2) + ', dan AP : PB = ' + m + ' : ' + n + '. Berapa ' + (tanya === 'x' ? 'absis' : 'ordinat') + ' titik P?', tanya === 'x' ? px : py, { jenis: tanya, izin: { minus: true }, gambar: gb({ pts: [{ x: x1, y: y1, t: 'A' }, { x: x2, y: y2, t: 'B' }], seg: [{ x1, y1, x2, y2, c: 'merah' }], alt: 'Ruas garis AB' }), langkah: [
            st('P = (n·A + m·B) / (m + n) = (' + n + '·A + ' + m + '·B) / ' + s + '.'),
            st(tanya === 'x' ? 'x = (' + n + '·(' + mn(x1) + ') + ' + m + '·(' + mn(x2) + ')) / ' + s + ' = ' + mn(px) + '.' : 'y = (' + n + '·(' + mn(y1) + ') + ' + m + '·(' + mn(y2) + ')) / ' + s + ' = ' + mn(py) + '.', tanya === 'x' ? px : py)] });
        }),
      lv('Persamaan garis lurus', 'y = mx + c; sejajar: m sama; tegak lurus: m₁ × m₂ = −1', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['gradien', 'sejajar', 'tegakLurus']), m: nz(r, -4, 4), c0: r.bulat(-6, 6), x1: r.bulat(-4, 4), y1: r.bulat(-4, 4), dx: nz(r, -3, 3), k: r.pilih([2, 3, 4]), u: r.bulat(-3, 3) }),
        ({ jenis, m, c0, x1, y1, dx, k, u }) => {
          if (jenis === 'gradien') { const x2 = x1 + dx, y2 = y1 + m * dx; return S.angka('Tentukan gradien garis yang melalui titik A' + tt(x1, y1) + ' dan B' + tt(x2, y2) + '.', m, { jenis, izin: { minus: true }, langkah: [st('m = (y₂ − y₁) / (x₂ − xᵢ) = (' + mn(y2 - y1) + ') / (' + mn(dx) + ').'), st('m = ' + mn(m) + '.', m)] }); }
          if (jenis === 'sejajar') { const cc = y1 - m * x1; return S.angka('Garis g sejajar dengan garis y = ' + (m === 1 ? '' : m === -1 ? MIN : mn(m)) + 'x ' + (c0 < 0 ? MIN : '+') + ' ' + Math.abs(c0) + ' dan melalui titik ' + tt(x1, y1) + '. Jika g berbentuk y = mx + c, berapakah c?', cc, { jenis, izin: { minus: true }, langkah: [st('Sejajar berarti gradien sama: m = ' + mn(m) + '.'), st('c = y − mx = ' + mn(y1) + ' − (' + mn(m) + ')(' + mn(x1) + ') = ' + mn(cc) + '.', cc)] }); }
          const x0 = k * u, y0 = y1, cc = y0 + u; // gradien tegak lurus = −1/k; c = y0 + x0/k
          return S.angka('Garis h tegak lurus dengan garis y = ' + k + 'x ' + (c0 < 0 ? MIN : '+') + ' ' + Math.abs(c0) + ' dan melalui titik ' + tt(x0, y0) + '. Jika h berbentuk y = mx + c, berapakah c?', cc, { jenis, izin: { minus: true }, langkah: [st('Gradien garis awal ' + k + ', maka gradien h = −1/' + k + '.'), st('c = y − mx = ' + mn(y0) + ' + (1/' + k + ')(' + mn(x0) + ') = ' + mn(y0) + ' + ' + mn(u) + ' = ' + mn(cc) + '.', cc)] });
        }),
      lv('Jarak titik ke garis', 'd = |ax₀ + by₀ + c| / √(a² + b²)', 'angka',
        (r) => ({ nrm: r.pilih(NORMAL), x0: r.bulat(-5, 5), y0: r.bulat(-5, 5), k: r.bulat(1, 5), sg: r.pilih([-1, 1]) }),
        ({ nrm, x0, y0, k, sg }) => {
          const [a, b, h] = nrm, c0 = sg * k * h - a * x0 - b * y0;
          return S.angka('Tentukan jarak titik ' + tt(x0, y0) + ' ke garis ' + lin(a, b, c0) + '.', k, { jenis: 'jarakGaris', langkah: [
            st('|a·x₀ + b·y₀ + c| = |' + a + '(' + mn(x0) + ') + ' + b + '(' + mn(y0) + ') + (' + mn(c0) + ')| = ' + k * h + '.'),
            st('√(a² + b²) = √(' + a * a + ' + ' + b * b + ') = ' + h + '. Jarak = ' + k * h + ' ÷ ' + h + ' = ' + k + '.', k)] });
        }),
      lv('Parabola dan elips', 'y² = 4px: fokus (p, 0); elips: c² = a² − b²', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['parabola', 'elips']), p: r.bulat(1, 6), e: r.pilih([[5, 4, 3], [5, 3, 4], [13, 12, 5], [10, 8, 6], [13, 5, 12], [17, 15, 8], [10, 6, 8]]), tanya: r.bulat(0, 1) }),
        ({ jenis, p, e, tanya }) => {
          if (jenis === 'parabola') return S.angka('Parabola y' + CP.sup(2) + ' = ' + 4 * p + 'x. Berapakah absis titik fokusnya?', p, { jenis, langkah: [st('Bentuk y² = 4px memiliki fokus (p, 0). Di sini 4p = ' + 4 * p + '.'), st('p = ' + 4 * p + ' ÷ 4 = ' + p + '.', p)] });
          const [a, b, c] = e;
          if (tanya) return S.angka('Elips x' + CP.sup(2) + '/' + a * a + ' + y' + CP.sup(2) + '/' + b * b + ' = 1 memiliki dua fokus pada sumbu x. Berapa jarak antara kedua fokus?', 2 * c, { jenis: 'elips2c', langkah: [st('Untuk elips dengan a > b: c² = a² − b² = ' + a * a + ' − ' + b * b + ' = ' + c * c + ', maka c = ' + c + '.'), st('Jarak kedua fokus = 2c = ' + 2 * c + '.', 2 * c)] });
          return S.angka('Elips x' + CP.sup(2) + '/' + a * a + ' + y' + CP.sup(2) + '/' + b * b + ' = 1. Berapa panjang sumbu mayor (sumbu terpanjang)?', 2 * Math.max(a, b), { jenis: 'elipsMayor', langkah: [st('Penyebut terbesar adalah ' + Math.max(a, b) * Math.max(a, b) + ', sehingga setengah sumbu mayor = ' + Math.max(a, b) + '.'), st('Panjang sumbu mayor = 2 × ' + Math.max(a, b) + ' = ' + 2 * Math.max(a, b) + '.', 2 * Math.max(a, b))] });
        }),
      lv('Luas bangun dari koordinat', 'Luas segitiga = ½ × alas × tinggi', 'angka',
        (r) => ({ x1: r.bulat(-4, 1), y1: r.bulat(-4, 1), w: r.bulat(2, 6), h: 2 * r.bulat(1, 3), xc: r.bulat(0, 4), sh: r.pilih([-1, 1]) }),
        ({ x1, y1, w, h, xc, sh }, ctx) => {
          const A = [x1, y1], B = [x1 + w, y1], C = [x1 + (xc % (w + 1)), y1 + sh * h], luas = (w * h) / 2, v = kons(ctx);
          const s = S.angka((v === 'umum' ? 'Sebuah kebun berbentuk segitiga memiliki titik sudut ' : 'Sebuah pelat logam berbentuk segitiga memiliki titik sudut ') + 'A' + tt(A[0], A[1]) + ', B' + tt(B[0], B[1]) + ', dan C' + tt(C[0], C[1]) + ' (satuan meter). Berapa luasnya dalam m²?', luas, { jenis: 'luasKoord', gambar: gb({ poly: [{ pts: [A, B, C], c: 'isi' }], pts: [{ x: A[0], y: A[1], t: 'A', dx: -12 }, { x: B[0], y: B[1], t: 'B' }, { x: C[0], y: C[1], t: 'C' }], alt: 'Segitiga ABC pada bidang koordinat' }), satuan: 'm²', langkah: [
            st('Alas AB mendatar: panjang ' + w + '. Tinggi = selisih ordinat C dan AB = ' + h + '.'),
            st('Luas = ½ × ' + w + ' × ' + h + ' = ' + luas + '.', luas)] });
          s.dibagi = [{ a: w * h, b: 2 }]; return s;
        })
    ]
  });

  /* ================= XII-TL-2 LIMIT ================= */
  const lim = (a) => 'lim x → ' + mn(a);

  CP.aktifkan('XII-TL-2', {
    level: [
      lv('Limit dengan substitusi', 'Jika f(a) terdefinisi, lim f(x) = f(a)', 'angka',
        (r) => ({ c: [nz(r, -3, 3), nz(r, -5, 5), nz(r, -6, 6)], a: nz(r, -4, 4) }),
        ({ c, a }) => { const v = ev(c, a); return S.angka('Tentukan nilai ' + lim(a) + ' (' + poli(c) + ').', v, { jenis: 'substitusi', izin: { minus: true }, langkah: [st('Fungsinya polinomial, jadi cukup substitusi x = ' + mn(a) + '.'), st(poli(c).replace(/x/g, '(' + mn(a) + ')') + ' = ' + mn(v) + '.', v)] }); }),
      lv('Limit bentuk 0/0 dengan faktorisasi', '(x − a)(x + k) / (x − a) = x + k', 'angka',
        (r) => ({ a: nz(r, -4, 5), k: nz(r, -6, 7) }),
        ({ a, k }) => {
          const num = [1, k - a, -a * k];
          return S.angka('Tentukan nilai ' + lim(a) + ' (' + poli(num) + ') / (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ').', a + k, { jenis: 'faktor', izin: { minus: true }, langkah: [
            st('Substitusi langsung memberi 0/0. Faktorkan pembilang: ' + poli(num) + ' = (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ')(x ' + (k < 0 ? MIN : '+') + ' ' + Math.abs(k) + ').'),
            st('Coret (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + '), sisa x ' + (k < 0 ? MIN : '+') + ' ' + Math.abs(k) + '. Substitusi x = ' + mn(a) + ': ' + mn(a + k) + '.', a + k)] });
        }),
      lv('Limit tak hingga', 'Bandingkan pangkat tertinggi pembilang dan penyebut', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['sama', 'rendah']), s: r.bulat(1, 4), k: r.bulat(1, 5), q: nz(r, -5, 5), t: nz(r, -5, 5), r0: nz(r, -5, 5), u: nz(r, -5, 5) }),
        ({ jenis, s, k, q, t, r0, u }) => {
          if (jenis === 'sama') { const p = s * k, num = [p, q, r0], den = [s, t, u]; return S.angka('Tentukan nilai lim x → ∞ (' + poli(num) + ') / (' + poli(den) + ').', k, { jenis, langkah: [st('Pangkat tertinggi pembilang dan penyebut sama (x²), jadi hasilnya perbandingan koefisien terdepan.'), st(p + ' ÷ ' + s + ' = ' + k + '.', k)] }); }
          const num = [q, r0], den = [s, t, u]; return S.angka('Tentukan nilai lim x → ∞ (' + poli(num) + ') / (' + poli(den) + ').', 0, { jenis, langkah: [st('Pangkat pembilang (1) lebih kecil daripada pangkat penyebut (2).'), st('Penyebut tumbuh jauh lebih cepat, sehingga hasilnya 0.', 0)] });
        }),
      lv('Limit bentuk akar', 'Kalikan dengan sekawan', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['tak', 'sekawan']), p: 2 * r.bulat(1, 5), q: nz(r, -6, 6), s: r.bulat(2, 7) }),
        ({ jenis, p, q, s }) => {
          if (jenis === 'tak') return S.angka('Tentukan nilai lim x → ∞ (√(x² + ' + p + 'x ' + (q < 0 ? MIN : '+') + ' ' + Math.abs(q) + ') − x).', p / 2, { jenis, langkah: [st('Kalikan dengan sekawan (√(…) + x): hasilnya (' + p + 'x ' + (q < 0 ? MIN : '+') + ' ' + Math.abs(q) + ') / (√(…) + x).'), st('Untuk x besar, penyebut ≈ 2x, sehingga limit = ' + p + ' ÷ 2 = ' + p / 2 + '.', p / 2)] });
          return S.angka('Tentukan nilai lim x → ' + s * s + ' (x − ' + s * s + ') / (√x − ' + s + ').', 2 * s, { jenis, langkah: [st('Tulis x − ' + s * s + ' = (√x − ' + s + ')(√x + ' + s + ').'), st('Coret (√x − ' + s + '), sisa √x + ' + s + ' = ' + s + ' + ' + s + ' = ' + 2 * s + '.', 2 * s)] });
        }),
      lv('Limit trigonometri', 'lim sin(ax)/(bx) = a/b; lim (1 − cos ax)/x² = a²/2', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['sin', 'tan', 'cos']), b: r.bulat(2, 4), k: r.bulat(1, 4), a2: r.pilih([2, 4, 6]) }),
        ({ jenis, b, k, a2 }) => {
          if (jenis === 'cos') return S.angka('Tentukan nilai lim x → 0 (1 − cos ' + a2 + 'x) / x².', (a2 * a2) / 2, { jenis, langkah: [st('Gunakan lim (1 − cos ax)/x² = a²/2 dengan a = ' + a2 + '.'), st(a2 * a2 + ' ÷ 2 = ' + (a2 * a2) / 2 + '.', (a2 * a2) / 2)] });
          const a = k * b, f = jenis === 'sin' ? 'sin' : 'tan';
          return S.angka('Tentukan nilai lim x → 0 ' + f + ' ' + a + 'x / ' + b + 'x.', k, { jenis, langkah: [st('lim ' + f + ' ax / bx = a/b.'), st(a + ' ÷ ' + b + ' = ' + k + '.', k)] });
        }),
      lv('Kekontinuan', 'f kontinu di a jika lim f(x) = f(a)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['akar', 'sambung']), a: nz(r, -4, 5), p: nz(r, -3, 3), q: nz(r, -5, 5), r0: nz(r, -3, 3) }),
        ({ jenis, a, p, q, r0 }) => {
          if (jenis === 'akar') return S.angka('Fungsi f(x) = (x² − ' + a * a + ') / (x ' + (a < 0 ? '+' : MIN) + ' ' + Math.abs(a) + ') untuk x ≠ ' + mn(a) + ', dan f(' + mn(a) + ') = k. Agar f kontinu di x = ' + mn(a) + ', berapakah k?', 2 * a, { jenis, izin: { minus: true }, langkah: [st('Untuk x ≠ ' + mn(a) + ', f(x) = x ' + (a < 0 ? MIN : '+') + ' ' + Math.abs(a) + '. Limit saat x → ' + mn(a) + ': ' + mn(2 * a) + '.'), st('Kekontinuan: k = limit = ' + mn(2 * a) + '.', 2 * a)] });
          const s = p * a + q - r0 * a;
          return S.angka('Fungsi f(x) = ' + poli([p, q]) + ' untuk x ≤ ' + mn(a) + ', dan f(x) = ' + poli([r0, 0]).replace(/^0$/, '') + ' + s untuk x > ' + mn(a) + ' (s tetap). Agar f kontinu di x = ' + mn(a) + ', berapakah s?', s, { jenis, izin: { minus: true }, langkah: [st('Nilai kiri di x = ' + mn(a) + ': ' + mn(p * a + q) + '. Nilai kanan: ' + mn(r0 * a) + ' + s.'), st('Samakan: s = ' + mn(p * a + q) + ' − (' + mn(r0 * a) + ') = ' + mn(s) + '.', s)] });
        })
    ]
  });

  /* ================= XII-TL-3 TURUNAN ================= */
  CP.aktifkan('XII-TL-3', {
    level: [
      lv('Turunan di satu titik', 'f(x) = axⁿ → f′(x) = n·axⁿ⁻¹', 'angka',
        (r) => ({ c: [nz(r, -2, 3), nz(r, -4, 4), nz(r, -5, 6), nz(r, -6, 8)], x0: r.bulat(-3, 3) }),
        ({ c, x0 }) => {
          const d = [3 * c[0], 2 * c[1], c[2]], v = ev(d, x0);
          return S.angka('Jika f(x) = ' + poli(c) + ', tentukan f′(' + mn(x0) + ').', v, { jenis: 'turunan', izin: { minus: true }, langkah: [
            st('f′(x) = ' + poli(d) + '.'),
            st('f′(' + mn(x0) + ') = ' + mn(v) + '.', v)] });
        }),
      lv('Hasil kali dan hasil bagi', "(uv)′ = u′v + uv′; (u/v)′ = (u′v − uv′)/v²", 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['kali', 'bagi']), p: nz(r, -3, 4), q: nz(r, -4, 5), r0: nz(r, -3, 4), s: nz(r, -4, 5), x0: r.bulat(-2, 3), a: nz(r, -4, 5), d: r.bulat(-3, 3), k: nz(r, -3, 3) }),
        ({ jenis, p, q, r0, s, x0, a, d, k }) => {
          if (jenis === 'kali') { const v = p * (r0 * x0 + s) + r0 * (p * x0 + q); return S.angka('Jika f(x) = (' + poli([p, q]) + ')(' + poli([r0, s]) + '), tentukan f′(' + mn(x0) + ').', v, { jenis, izin: { minus: true }, langkah: [st('f′(x) = u′v + uv′ dengan u = ' + poli([p, q]) + ', v = ' + poli([r0, s]) + '.'), st('f′(' + mn(x0) + ') = ' + mn(p) + '(' + mn(r0 * x0 + s) + ') + ' + mn(r0) + '(' + mn(p * x0 + q) + ') = ' + mn(v) + '.', v)] }); }
          let dd = d; if (x0 + dd === 0) dd += 1;
          const t = x0 + dd, b = a * dd - k * t * t;
          return S.angka('Jika f(x) = (' + poli([a, b]) + ') / (' + poli([1, dd]) + '), tentukan f′(' + mn(x0) + ').', k, { jenis, izin: { minus: true }, langkah: [st('f′(x) = (u′v − uv′) / v² = (' + mn(a) + '(x + ' + mn(dd) + ') − (' + poli([a, b]) + ')) / (x + ' + mn(dd) + ')² = ' + mn(a * dd - b) + ' / (x + ' + mn(dd) + ')².'), st('Di x = ' + mn(x0) + ': ' + mn(a * dd - b) + ' / ' + t * t + ' = ' + mn(k) + '.', k)] });
        }),
      lv('Aturan rantai', 'f(x) = (px + q)ⁿ → f′(x) = n·p·(px + q)ⁿ⁻¹', 'angka',
        (r) => ({ n: r.bulat(2, 4), p: nz(r, -3, 3), x0: r.bulat(-2, 2), q: r.bulat(-3, 3) }),
        ({ n, p, x0, q }) => {
          const w = p * x0 + q, v = n * p * Math.pow(w, n - 1);
          return S.angka('Jika f(x) = (' + poli([p, q]) + ')' + sup(n) + ', tentukan f′(' + mn(x0) + ').', v, { jenis: 'rantai', izin: { minus: true }, langkah: [st('f′(x) = ' + n + ' × ' + mn(p) + ' × (' + poli([p, q]) + ')' + sup(n - 1) + '.'), st('Di x = ' + mn(x0) + ', (' + poli([p, q]) + ') = ' + mn(w) + '. Maka f′ = ' + n + ' × ' + mn(p) + ' × ' + mn(Math.pow(w, n - 1)) + ' = ' + mn(v) + '.', v)] });
        }),
      lv('Garis singgung', 'Gradien singgung = f′(x₀); y − y₀ = m(x − x₀)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['gradien', 'konstanta']), a: nz(r, -2, 3), b: nz(r, -5, 5), c0: r.bulat(-6, 6), x0: r.bulat(-3, 3) }),
        ({ jenis, a, b, c0, x0 }) => {
          const m = 2 * a * x0 + b, y0 = a * x0 * x0 + b * x0 + c0, cc = c0 - a * x0 * x0;
          const f = poli([a, b, c0]);
          if (jenis === 'gradien') return S.angka('Tentukan gradien garis singgung kurva y = ' + f + ' di titik dengan absis x = ' + mn(x0) + '.', m, { jenis, izin: { minus: true }, langkah: [st('y′ = ' + poli([2 * a, b]) + '.'), st('Gradien di x = ' + mn(x0) + ': ' + mn(m) + '.', m)] });
          return S.angka('Garis singgung kurva y = ' + f + ' di titik berabsis x = ' + mn(x0) + ' berbentuk y = mx + c. Berapakah c?', cc, { jenis, izin: { minus: true }, langkah: [st('m = y′(' + mn(x0) + ') = ' + mn(m) + '; y₀ = ' + mn(y0) + '.'), st('c = y₀ − m·x₀ = ' + mn(y0) + ' − (' + mn(m) + ')(' + mn(x0) + ') = ' + mn(cc) + '.', cc)] });
        }),
      lv('Titik stasioner dan nilai ekstrem', "f′(x) = 0; f″ < 0 maksimum, f″ > 0 minimum", 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['jumlah', 'maks', 'min']), p: r.bulat(-4, 1), g: r.pilih([2, 4, 6]), h: 0 }),
        ({ jenis, p, g }) => {
          const q = p + g, f = [1, -1.5 * (p + q), 3 * p * q, 0], F = (x) => ev(f, x);
          const koef = [1, (-3 * (p + q)) / 2, 3 * p * q];
          const ft = poli([1, koef[1], koef[2], 0]), d1 = poli([3, 2 * koef[1], koef[2]]);
          const dasar = [st('f′(x) = ' + d1 + ' = 3(x ' + (p < 0 ? '+' : MIN) + ' ' + Math.abs(p) + ')(x ' + (q < 0 ? '+' : MIN) + ' ' + Math.abs(q) + ') = 0, sehingga x = ' + mn(p) + ' atau x = ' + mn(q) + '.')];
          if (jenis === 'jumlah') return S.angka('Fungsi f(x) = ' + ft + ' memiliki dua titik stasioner. Berapa jumlah kedua nilai x stasioner itu?', p + q, { jenis, izin: { minus: true }, langkah: dasar.concat([st('Jumlah = ' + mn(p) + ' + ' + mn(q) + ' = ' + mn(p + q) + '.', p + q)]) });
          const x = jenis === 'maks' ? p : q, v = F(x);
          return S.angka('Tentukan nilai ' + (jenis === 'maks' ? 'maksimum lokal' : 'minimum lokal') + ' fungsi f(x) = ' + ft + '.', v, { jenis, izin: { minus: true }, langkah: dasar.concat([st('f″(x) = ' + poli([6, 2 * koef[1]]) + '. Di x = ' + mn(x) + ': ' + mn(6 * x + 2 * koef[1]) + ' (' + (jenis === 'maks' ? 'negatif, maksimum' : 'positif, minimum') + ').'), st('f(' + mn(x) + ') = ' + mn(v) + '.', v)]) });
        }),
      lv('Optimasi', 'Turunan = 0 pada nilai ekstrem', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['keliling', 'jumlah', 'kotak']), k: r.bulat(3, 12), m: r.bulat(1, 3) }),
        ({ jenis, k, m }, ctx) => {
          const v = kons(ctx);
          if (jenis === 'keliling') { const K = 4 * k; return S.angka((v === 'umum' ? 'Pak Tani memiliki pagar sepanjang ' + K + ' m untuk mengelilingi kandang berbentuk persegi panjang. ' : 'Sebuah bingkai logam sepanjang ' + K + ' cm dibentuk menjadi persegi panjang. ') + 'Berapa luas maksimum yang dapat dicapai (dalam ' + (v === 'umum' ? 'm' : 'cm') + '²)?', k * k, { jenis, satuan: v === 'umum' ? 'm²' : 'cm²', langkah: [st('Misal panjang x, lebar ' + 2 * k + ' − x. Luas L = x(' + 2 * k + ' − x), L′ = ' + 2 * k + ' − 2x = 0 → x = ' + k + '.'), st('Luas maksimum = ' + k + ' × ' + k + ' = ' + k * k + '.', k * k)] }); }
          if (jenis === 'jumlah') { const T = 2 * k; return S.angka('Dua bilangan positif jumlahnya ' + T + '. Berapa hasil kali terbesar yang mungkin?', k * k, { jenis, langkah: [st('Misal bilangan x dan ' + T + ' − x. Hasil kali H = x(' + T + ' − x), H′ = ' + T + ' − 2x = 0 → x = ' + k + '.'), st('H maksimum = ' + k + ' × ' + k + ' = ' + k * k + '.', k * k)] }); }
          const s = 6 * m, V = 16 * m * m * m;
          return S.angka((v === 'umum' ? 'Selembar karton persegi bersisi ' + s + ' cm dipotong persegi kecil di keempat pojoknya, lalu dilipat menjadi kotak tanpa tutup. ' : 'Selembar pelat persegi bersisi ' + s + ' cm dipotong persegi kecil di keempat pojoknya, lalu dilipat menjadi bak tanpa tutup. ') + 'Berapa volume maksimum (cm³)?', V, { jenis, satuan: 'cm³', langkah: [st('Potongan x: V = x(' + s + ' − 2x)². V′ = 0 menghasilkan x = ' + s + ' ÷ 6 = ' + m + ' cm.'), st('V = ' + m + ' × (' + s + ' − ' + 2 * m + ')² = ' + m + ' × ' + (4 * m) * (4 * m) + ' = ' + V + '.', V)] });
        })
    ]
  });

  /* ================= XII-TL-4 INTEGRAL ================= */
  const polI = (k, m, c) => { const s = poli([k, m, c, 0]); return s + ' + C'; };
  function gbrLuas(m, t) {
    const X0 = 30, X1 = 290, Y0 = 18, Y1 = 128, hmax = m * t * t, sx = (X1 - X0) / (2 * t + 1), sy = (Y1 - 14 - Y0) / hmax, cx = (X0 + X1) / 2;
    const px = (x) => cx + x * sx, py = (y) => Y1 - 14 - y * sy, pts = [];
    for (let i = 0; i <= 40; i++) { const x = -t + (2 * t * i) / 40; pts.push([px(x), py(m * (t * t - x * x))]); }
    const el = [H.p(pts, 'isi'), H.l(X0, py(0), X1, py(0), 'garis'), H.l(cx, Y0 - 6, cx, Y1 - 10, 'garis'), H.t(px(-t), py(0) + 14, mn(-t), 'middle', 'kecil'), H.t(px(t), py(0) + 14, String(t), 'middle', 'kecil'), H.t(cx + 6, py(hmax) + 4, String(hmax), 'start', 'kecil')];
    return { tipe: 'gambar', alt: 'Daerah di bawah parabola dan di atas sumbu x dari x = ' + (-t) + ' sampai ' + t, tinggi: 136, el };
  }

  CP.aktifkan('XII-TL-4', {
    level: [
      lv('Integral tak tentu', '∫ axⁿ dx = a/(n+1) · xⁿ⁺¹ + C', 'pilihan',
        (r) => ({ k: r.bulat(1, 4), m: nz(r, -3, 4), c0: nz(r, -6, 6), sd: r.bulat(1, 99999) }),
        ({ k, m, c0, sd }) => {
          const benar = opsi(polI(k, m, c0)), salah = [polI(3 * k, 2 * m, c0), polI(k, 2 * m, c0), polI(k, m, 0), polI(k + 1, m, c0), polI(k, m + 1, c0), polI(k, m, c0 + 1), polI(3 * k, m, c0)].map((t) => opsi(t));
          const h = CP.rakitPilihan(CP.buatRng(sd), benar, salah);
          return S.pilihan('Hasil dari ∫ (' + poli([3 * k, 2 * m, c0]) + ') dx adalah …', h, { jenis: 'tak tentu', langkah: [st('Naikkan pangkat tiap suku dan bagi dengan pangkat baru: 3k·x² → ' + k + 'x³; 2m·x → ' + mn(m) + 'x²; konstanta c → c·x.'), st('Hasilnya ' + benar.t + '.', benar.t)] });
        }),
      lv('Integral tentu', '∫ₐᵇ f(x) dx = F(b) − F(a)', 'angka',
        (r) => ({ k: r.bulat(1, 3), m: nz(r, -3, 3), c0: nz(r, -4, 5), a: r.bulat(-1, 1), w: r.bulat(1, 3) }),
        ({ k, m, c0, a, w }) => {
          const b = a + w, F = (x) => k * x * x * x + m * x * x + c0 * x, v = F(b) - F(a);
          return S.angka('Hitung ∫ dari ' + mn(a) + ' sampai ' + mn(b) + ' dari (' + poli([3 * k, 2 * m, c0]) + ') dx.', v, { jenis: 'tentu', izin: { minus: true }, langkah: [st('F(x) = ' + poli([k, m, c0, 0]) + '.'), st('F(' + mn(b) + ') − F(' + mn(a) + ') = ' + mn(F(b)) + ' − (' + mn(F(a)) + ') = ' + mn(v) + '.', v)] });
        }),
      lv('Integral fungsi (px + q)ⁿ', '∫ (px+q)ⁿ dx = (px+q)ⁿ⁺¹ / (p(n+1))', 'angka',
        (r) => ({ n: r.bulat(1, 3), p: r.bulat(1, 3), q: r.bulat(-2, 3), mm: r.bulat(1, 2), b: r.bulat(1, 2) }),
        ({ n, p, q, mm, b }) => {
          const N = p * (n + 1) * mm, upper = Math.pow(p * b + q, n + 1), lower = Math.pow(q, n + 1), v = mm * (upper - lower);
          return S.angka('Hitung ∫ dari 0 sampai ' + b + ' dari ' + N + '(' + poli([p, q]) + ')' + (n > 1 ? sup(n) : '') + ' dx.', v, { jenis: 'pangkatLinear', izin: { minus: true }, langkah: [st('Antiturunan: ' + N + ' × (' + poli([p, q]) + ')' + sup(n + 1) + ' / (' + p + '·' + (n + 1) + ') = ' + mm + '(' + poli([p, q]) + ')' + sup(n + 1) + '.'), st(mm + '[(' + mn(p * b + q) + ')' + sup(n + 1) + ' − (' + mn(q) + ')' + sup(n + 1) + '] = ' + mm + '(' + mn(upper) + ' − ' + mn(lower) + ') = ' + mn(v) + '.', v)] });
        }),
      lv('Luas daerah', 'Luas = ∫ f(x) dx', 'angka',
        (r) => ({ m: r.pilih([3, 6]), t: r.bulat(1, 3) }),
        ({ m, t }, ctx) => {
          const luas = (4 * m * t * t * t) / 3, v = kons(ctx);
          return S.angka((v === 'umum' ? 'Sebuah taman dibatasi kurva y = ' + m + '(' + t * t + ' − x²) dan sumbu x ' : 'Sebuah pelat logam dibatasi kurva y = ' + m + '(' + t * t + ' − x²) dan sumbu x ') + '(satuan dalam meter), seperti gambar. Berapa luasnya dalam m²?', luas, { jenis: 'luasKurva', gambar: gbrLuas(m, t), satuan: 'm²', langkah: [st('Kurva memotong sumbu x di x = ' + mn(-t) + ' dan x = ' + t + '. Luas = ∫ dari ' + mn(-t) + ' sampai ' + t + ' dari ' + m + '(' + t * t + ' − x²) dx.'), st('F(x) = ' + m * t * t + 'x − ' + m / 3 + 'x³. Luas = F(' + t + ') − F(' + mn(-t) + ') = 2(' + m * t * t * t + ' − ' + (m / 3) * t * t * t + ') = ' + luas + '.', luas)] });
        }),
      lv('Volume benda putar', 'V = π ∫ [f(x)]² dx (jawab sebagai kelipatan π)', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['kerucut', 'akar']), k: r.pilih([3, 6]), h: r.bulat(1, 3), hh: 2 * r.bulat(1, 4) }),
        ({ jenis, k, h, hh }) => {
          if (jenis === 'kerucut') { const v = (k * k * h * h * h) / 3; return S.angka('Daerah di bawah garis y = ' + k + 'x dari x = 0 sampai x = ' + h + ' diputar mengelilingi sumbu x. Tentukan volumenya, dalam satuan π (misalnya jawaban 5 berarti 5π).', v, { jenis, langkah: [st('V = π ∫ dari 0 sampai ' + h + ' dari (' + k + 'x)² dx = π ∫ ' + k * k + 'x² dx.'), st('= π × ' + k * k + 'x³/3 dari 0 sampai ' + h + ' = π × ' + k * k + ' × ' + h * h * h + ' / 3 = ' + v + 'π.', v)] }); }
          const v = (hh * hh) / 2; return S.angka('Daerah di bawah kurva y = √x dari x = 0 sampai x = ' + hh + ' diputar mengelilingi sumbu x. Tentukan volumenya, dalam satuan π (misalnya jawaban 5 berarti 5π).', v, { jenis, langkah: [st('V = π ∫ dari 0 sampai ' + hh + ' dari (√x)² dx = π ∫ x dx.'), st('= π × x²/2 dari 0 sampai ' + hh + ' = π × ' + hh * hh + '/2 = ' + v + 'π.', v)] });
        }),
      lv('Penerapan integral', 'Dari kecepatan ke jarak', 'angka',
        (r) => ({ a: r.bulat(1, 3), b: r.bulat(1, 6), T: r.bulat(2, 5) }),
        ({ a, b, T }, ctx) => {
          const jarak = a * T * T + b * T, v = kons(ctx);
          return S.angka((v === 'umum' ? 'Sebuah mobil mainan bergerak dengan kecepatan v(t) = ' : 'Sebuah mesin conveyor memindahkan barang dengan kecepatan v(t) = ') + (2 * a) + 't + ' + b + ' m/detik. Berapa meter jarak yang ditempuh dalam ' + T + ' detik pertama?', jarak, { jenis: 'jarak', satuan: 'm', langkah: [st('Jarak = ∫ dari 0 sampai ' + T + ' dari (' + 2 * a + 't + ' + b + ') dt = [' + a + 't² + ' + b + 't] dari 0 sampai ' + T + '.'), st(a + ' × ' + T * T + ' + ' + b + ' × ' + T + ' = ' + jarak + '.', jarak)] });
        })
    ]
  });

  /* ================= XII-TL-5 ANALISIS DATA DAN PELUANG ================= */
  const pecStr = (n, d) => CP.pecahanStr(P(n, d));

  CP.aktifkan('XII-TL-5', {
    level: [
      lv('Peluang gabungan dua kejadian', 'P(A∪B) = P(A) + P(B) − P(A∩B)', 'pecahan',
        (r) => ({ N: r.pilih([20, 24, 30, 36, 40, 50]), a: r.bulat(4, 12), b: r.bulat(4, 12), ab: r.bulat(1, 3) }),
        ({ N, a, b, ab }, ctx) => {
          const A = a + ab, B = b + ab, uni = a + b + ab, v = kons(ctx);
          const s = S.pecahan((v === 'umum' ? 'Dari ' + N + ' siswa, ' + A + ' siswa suka basket (A), ' + B + ' siswa suka voli (B), dan ' + ab + ' siswa suka keduanya. ' : 'Dari ' + N + ' produk, ' + A + ' produk cacat goresan (A), ' + B + ' produk cacat warna (B), dan ' + ab + ' produk mengalami keduanya. ') + 'Jika satu dipilih acak, berapa peluang terpilih yang ' + (v === 'umum' ? 'suka basket atau voli' : 'cacat goresan atau cacat warna') + '?', P(uni, N), { jenis: 'gabungan', langkah: [st('P(A∪B) = (' + A + ' + ' + B + ' − ' + ab + ') / ' + N + ' = ' + uni + '/' + N + '.'), st('Bentuk sederhana: ' + pecStr(uni, N) + '.', uni / N)] });
          return s;
        }),
      lv('Peluang bersyarat', 'P(A | B) = n(A∩B) / n(B)', 'pecahan',
        (r) => ({ nb: r.bulat(6, 20), ab: r.bulat(1, 5) }),
        ({ nb, ab }, ctx) => {
          const ab2 = Math.min(ab, nb - 1), v = kons(ctx);
          return S.pecahan((v === 'umum' ? 'Dalam suatu kelas, ' + nb + ' siswa membawa payung (B), dan ' + ab2 + ' di antaranya juga membawa jas hujan (A). ' : 'Dari semua mesin yang diperiksa, ' + nb + ' mesin sudah dipasang sensor (B), dan ' + ab2 + ' di antaranya juga lolos uji getar (A). ') + 'Jika satu dipilih dari yang ' + (v === 'umum' ? 'membawa payung' : 'bersensor') + ', berapa peluang ia ' + (v === 'umum' ? 'juga membawa jas hujan' : 'juga lolos uji getar') + '?', P(ab2, nb), { jenis: 'bersyarat', langkah: [st('P(A | B) = n(A∩B) / n(B) = ' + ab2 + ' / ' + nb + '.'), st('Bentuk sederhana: ' + pecStr(ab2, nb) + '.', ab2 / nb)] });
        }),
      lv('Distribusi binomial: harapan dan ragam', 'E(X) = np; Var(X) = npq', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['harapan', 'ragam']), n: 4 * r.bulat(2, 10), p: r.pilih([[1, 2], [1, 4], [3, 4]]), N16: r.pilih([16, 32, 48]) }),
        ({ jenis, n, p, N16 }) => {
          const nn = p[1] === 4 ? N16 : n, pr = p[0] / p[1], v = jenis === 'harapan' ? nn * pr : nn * pr * (1 - pr);
          return S.angka('Sebuah percobaan diulang ' + nn + ' kali secara independen, dengan peluang sukses ' + p[0] + '/' + p[1] + ' tiap kali. Tentukan ' + (jenis === 'harapan' ? 'nilai harapan (rata-rata banyak sukses)' : 'ragam (variansi) banyak sukses') + '.', v, { jenis, langkah: [st(jenis === 'harapan' ? 'E(X) = n × p = ' + nn + ' × ' + p[0] + '/' + p[1] + '.' : 'Var(X) = n × p × (1 − p) = ' + nn + ' × ' + p[0] + '/' + p[1] + ' × ' + (p[1] - p[0]) + '/' + p[1] + '.'), st('Hasilnya ' + v + '.', v)] });
        }),
      lv('Peluang binomial', 'P(X = k) = C(n, k) pᵏ qⁿ⁻ᵏ; p = ½', 'pecahan',
        (r) => ({ n: r.bulat(3, 6), k: r.bulat(0, 6) }),
        ({ n, k }, ctx) => {
          const kk = Math.min(k, n), C = (nn, r0) => { let x = 1; for (let i = 1; i <= r0; i++) x = (x * (nn - r0 + i)) / i; return Math.round(x); }, ways = C(n, kk), v = kons(ctx);
          return S.pecahan((v === 'umum' ? 'Sebuah koin seimbang dilempar ' + n + ' kali. ' : 'Sebuah mesin menghasilkan produk bagus atau cacat dengan peluang sama (½) tiap kali, dan diperiksa ' + n + ' produk. ') + 'Berapa peluang ' + (v === 'umum' ? 'muncul tepat ' + kk + ' kali sisi gambar' : 'tepat ' + kk + ' produk bagus') + '?', P(ways, Math.pow(2, n)), { jenis: 'binomial', langkah: [st('C(' + n + ', ' + kk + ') = ' + ways + ' dan peluang tiap urutan = (½)' + sup(n) + ' = 1/' + Math.pow(2, n) + '.'), st('P = ' + ways + '/' + Math.pow(2, n) + ' = ' + pecStr(ways, Math.pow(2, n)) + '.', ways / Math.pow(2, n))] });
        }),
      lv('Distribusi normal (aturan empiris)', '68% dalam ±1σ, 95% dalam ±2σ', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['persen', 'banyak']), mu: r.bulat(40, 80), sg: r.pilih([4, 5, 6, 8, 10]), z: r.pilih([1, 2]), N: r.bulat(1, 6) }),
        ({ jenis, mu, sg, z, N }) => {
          const pers = z === 1 ? 68 : 95, lo = mu - z * sg, hi = mu + z * sg;
          const dasar = 'Nilai ujian suatu angkatan berdistribusi normal dengan rata-rata ' + mu + ' dan simpangan baku ' + sg + '. ';
          if (jenis === 'persen') return S.angka(dasar + 'Berapa persen siswa yang nilainya antara ' + lo + ' dan ' + hi + '?', pers, { jenis, satuan: '%', langkah: [st('Rentang ' + lo + ' sampai ' + hi + ' adalah μ ± ' + z + 'σ (' + mu + ' ± ' + z + '×' + sg + ').'), st('Aturan empiris: ' + pers + '%.', pers)] });
          const n = (z === 1 ? 25 : 20) * N, v = (n * pers) / 100;
          return S.angka(dasar + 'Jika ada ' + n + ' siswa, berapa banyak siswa yang nilainya antara ' + lo + ' dan ' + hi + '?', v, { jenis: 'banyak', langkah: [st('Rentang ini adalah μ ± ' + z + 'σ, yaitu ' + pers + '% dari data.'), st(pers + '% × ' + n + ' = ' + v + '.', v)] });
        }),
      lv('Ukuran penyebaran data', 'Rata-rata, simpangan baku, jangkauan', 'angka',
        (r, c) => ({ jenis: pilihJenis(r, c, ['sd', 'ragam', 'jangkauan']), m: r.bulat(20, 60), k: r.bulat(1, 6), pasang: r.bulat(2, 4), sd: r.bulat(1, 99999) }),
        ({ jenis, m, k, pasang, sd }) => {
          const data = []; for (let i = 0; i < pasang; i++) data.push(m - k, m + k);
          const rr = CP.buatRng(sd), acak = rr.kocok(data);
          const teks = 'Data: ' + acak.join(', ') + '. ';
          if (jenis === 'sd') return S.angka(teks + 'Berapa simpangan baku data tersebut?', k, { jenis, langkah: [st('Rata-rata = ' + m + '. Setiap data menyimpang ' + k + ' dari rata-rata, jadi jumlah kuadrat simpangan = ' + data.length + ' × ' + k * k + '.'), st('Ragam = ' + k * k + ', simpangan baku = √' + k * k + ' = ' + k + '.', k)] });
          if (jenis === 'ragam') return S.angka(teks + 'Berapa ragam (variansi) data tersebut?', k * k, { jenis, langkah: [st('Rata-rata = ' + m + '. Simpangan tiap data = ±' + k + ', kuadratnya ' + k * k + '.'), st('Ragam = rata-rata kuadrat simpangan = ' + k * k + '.', k * k)] });
          return S.angka(teks + 'Berapa jangkauan data tersebut?', 2 * k, { jenis, langkah: [st('Jangkauan = data terbesar − data terkecil = ' + (m + k) + ' − ' + (m - k) + '.'), st('Hasilnya ' + 2 * k + '.', 2 * k)] });
        })
    ]
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
