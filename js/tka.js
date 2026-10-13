/* CepatPaham - Simulasi TKA (Tes Kemampuan Akademik) untuk SMP, SMA, dan SMK.
   Soal dibuat dari generator yang sudah ada, lalu diubah ke bentuk soal TKA:
   pilihan ganda sederhana, pilihan ganda kompleks (pilih semua yang benar), dan pilihan ganda kompleks kategori (benar/salah per pernyataan).
   Pengaturan jumlah soal dan durasi ada di CP.TKA di bawah ini. Cek pengumuman resmi Pusmendik/Kemendikdasmen sebelum dipakai sebagai acuan. */
(function (G) {
  'use strict';
  const CP = G.CP;
  const { P } = CP;

  /* ===================== KONFIGURASI ===================== */
  CP.TKA = {
    sumber: 'Kerangka asesmen TKA SMA/MA/SMK: Peraturan Kepala BSKAP No. 045/H/AN/2025. Matematika wajib SMA/SMK 2026: 25 soal, 75 menit. Jumlah soal SMP belum dipastikan; nilai di bawah adalah perkiraan.',
    SMP: {
      nama: 'TKA SMP', durasi: 60, jumlah: 25, opsi: 4, konteks: 'umum', pasti: false,
      elemen: [
        { id: 'bilangan', nama: 'Bilangan', bobot: 7, modul: ['VII-1', 'VII-2', 'VII-3', 'H1', 'H2', 'H3'], khas: [] },
        { id: 'aljabar', nama: 'Aljabar', bobot: 7, modul: ['VII-4', 'VIII-1', 'VIII-2', 'VIII-3', 'IX-1'] },
        { id: 'geometri', nama: 'Geometri dan Pengukuran', bobot: 6, modul: ['VII-5', 'VIII-4', 'IX-2', 'IX-3'], khas: ['ruang', 'pemuatan'] },
        { id: 'data', nama: 'Data dan Peluang', bobot: 5, modul: ['VII-6', 'VIII-5', 'IX-4'], khas: ['grafikGaris'] }
      ]
    },
    SMA: {
      nama: 'TKA SMA', durasi: 75, jumlah: 25, opsi: 5, konteks: 'umum', pasti: true,
      elemen: [
        { id: 'bilangan', nama: 'Bilangan', bobot: 5, modul: ['X-1', 'X-2', 'H1', 'H2'], khas: ['himpunan', 'biner'] },
        { id: 'aljabar', nama: 'Aljabar dan Fungsi', bobot: 7, modul: ['X-4', 'X-5', 'XI-1', 'XII-1'], khas: ['peluruhan', 'cukup', 'daerah', 'buket'] },
        { id: 'geometri', nama: 'Geometri dan Pengukuran', bobot: 4, modul: ['XI-2', 'XII-2'], khas: ['ruang', 'cukup', 'pemuatan'] },
        { id: 'trigonometri', nama: 'Trigonometri', bobot: 3, modul: ['X-3'] },
        { id: 'data', nama: 'Data dan Peluang', bobot: 6, modul: ['X-6', 'X-7', 'XI-3', 'XII-3'], khas: ['grafikGaris', 'tabelDistribusi'] }
      ]
    }
  };
  CP.TKA.SMK = Object.assign({}, CP.TKA.SMA, { nama: 'TKA SMK', konteks: 'vokasi' });
  // bobot tingkat kesulitan: pemahaman (L1-2), aplikasi (L3-4), penalaran (L5-6)
  const BOBOT_LEVEL = [1, 1, 1.5, 1.5, 1, 1];

  /* ===================== PEMBANTU ===================== */
  const pilihBerbobot = (rng, bobot) => { const t = bobot.reduce((a, b) => a + b, 0); let x = rng.acak() * t; for (let i = 0; i < bobot.length; i++) { x -= bobot[i]; if (x <= 0) return i; } return bobot.length - 1; };
  const teksNilai = (soal, q) => CP.tampilJawab(Object.assign({}, soal, { jawab: q }));
  const modulAktif = (ids) => ids.map((id) => CP.peta[id]).filter((m) => m && m.status === 'aktif');

  // pengecoh numerik dari kesalahan umum: salah hitung kecil, tanda terbalik, kali/bagi dua, kebalikan
  CP.pengecohNumerik = function (rng, soal) {
    const p = soal.jawab, boleh = !!(soal.izin && soal.izin.minus);
    const c = [];
    const tambah = (q) => { if (!q || !isFinite(q.n) || !isFinite(q.d) || q.d === 0) return; const r = P(q.n, q.d); if (r.n === p.n && r.d === p.d) return; if (r.n < 0 && !boleh) return; c.push(r); };
    if (p.d === 1) {
      const n = p.n, a = Math.abs(n);
      [1, -1, 2, -2].forEach((d) => tambah(P(n + d, 1)));
      if (a >= 20) { tambah(P(n + 10, 1)); tambah(P(n - 10, 1)); }
      if (a >= 100) { tambah(P(n + 100, 1)); tambah(P(n - 100, 1)); }
      tambah(P(-n, 1)); tambah(P(n * 2, 1)); if (n % 2 === 0) tambah(P(n / 2, 1)); if (a >= 10 && a < 100) { const s = String(a); tambah(P(parseInt(s[1] + s[0], 10) * (n < 0 ? -1 : 1), 1)); }
    } else {
      tambah(P(p.n + 1, p.d)); tambah(P(p.n - 1, p.d)); tambah(P(p.n, p.d + 1)); if (p.d > 1) tambah(P(p.n, p.d - 1)); tambah(P(p.d, p.n)); tambah(P(p.n * 2, p.d)); tambah(P(-p.n, p.d)); tambah(P(p.n + p.d, p.d));
    }
    const unik = []; c.forEach((q) => { if (!unik.some((u) => u.n === q.n && u.d === q.d)) unik.push(q); });
    let hasil = rng.kocok(unik);
    for (let i = 1; hasil.length < 5 && i < 30; i++) { const q = p.d === 1 ? P(p.n + 3 * i, 1) : P(p.n + 2 * i, p.d); if (!hasil.some((u) => u.n === q.n && u.d === q.d) && !(q.n === p.n && q.d === p.d) && (q.n >= 0 || boleh)) hasil.push(q); }
    return hasil;
  };

  // pilihan ganda bawaan hanya 4 opsi: tambahkan pengecoh sampai jumlah yang diminta
  // buat pengecoh dari opsi salah yang ada dengan mengubah satu angka (selisih kecil)
  function variasiAngka(pil, benar, i) {
    const sumber = pil.filter((_, k) => k !== benar);
    for (const t of sumber) {
      const m = [...t.matchAll(/\d+/g)]; if (!m.length) continue;
      const pilihM = m[(i - 1) % m.length], v = parseInt(pilihM[0], 10), v2 = v + ((i % 2) ? 1 : -1) * (1 + Math.floor((i - 1) / 2));
      if (v2 < 0) continue;
      return t.slice(0, pilihM.index) + v2 + t.slice(pilihM.index + pilihM[0].length);
    }
    return null;
  }
  function tambahOpsiPilihan(rng, soal, nOpsi) {
    const pil = soal.pilihan.slice(), pakai = new Set(pil);
    const dasar = pil[soal.benar];
    const angka = /^[−-]?d+$/.test(String(dasar).replace(/./g, ''));
    for (let i = 1; pil.length < nOpsi && i < 60; i++) {
      let t;
      if (angka) { const v = parseInt(String(dasar).replace(/./g, '').replace('−', '-'), 10); t = CP.angka(v + (i % 2 ? i : -i) * Math.max(1, Math.round(Math.abs(v) / 10))); }
      else t = variasiAngka(pil, soal.benar, i);
      if (t && !pakai.has(t)) { pakai.add(t); pil.push(t); }
    }
    if (pil.length < nOpsi) throw new Error('opsi tambahan kurang');
    const urut = rng.kocok(pil.map((t, i) => ({ t, benar: i === soal.benar })));
    return { pilihan: urut.map((x) => x.t), benar: urut.findIndex((x) => x.benar) };
  }
  // ubah soal angka/pecahan menjadi pilihan ganda (4 atau 5 opsi)
  CP.jadikanPilihan = function (rng, soal, nOpsi) {
    nOpsi = nOpsi || 4;
    if (soal.tipe === 'pilihan') return soal.pilihan.length >= nOpsi ? { pilihan: soal.pilihan.slice(), benar: soal.benar } : tambahOpsiPilihan(rng, soal, nOpsi);
    const benar = teksNilai(soal, soal.jawab), pil = [{ t: benar, q: soal.jawab }], pakai = new Set([benar]);
    CP.pengecohNumerik(rng, soal).forEach((q) => { if (pil.length >= nOpsi) return; const t = teksNilai(soal, q); if (!pakai.has(t)) { pakai.add(t); pil.push({ t, q }); } });
    if (pil.length < nOpsi) throw new Error('pengecoh kurang: ' + soal.teks);
    const urut = rng.kocok(pil);
    return { pilihan: urut.map((x) => x.t), benar: urut.findIndex((x) => x.q === soal.jawab), nilai: urut.map((x) => x.q) };
  };

  /* ===================== PEMBUATAN SOAL ===================== */
  function levelAcak(rng, m) { const maks = m.level.length; return Math.min(maks, 1 + pilihBerbobot(rng, BOBOT_LEVEL.slice(0, maks))); }
  function soalBiasa(cfg, el, rng, pakai, syarat) {
    const mods = modulAktif(el.modul);
    for (let t = 0; t < 80; t++) {
      const m = rng.pilih(mods), level = levelAcak(rng, m);
      const s = m.generator(level, cfg.konteks, rng, undefined, { cap: { H4: 3, H5: 2 } });
      if (pakai.has(s.teks)) continue;
      if (syarat && !syarat(s)) continue;
      pakai.add(s.teks); s.modulObj = m;
      return s;
    }
    throw new Error('soal TKA gagal dibuat untuk elemen ' + el.id);
  }
  const pendek = (s) => (s.tipe === 'angka' || s.tipe === 'pecahan') && !s.gambar && s.teks.length <= 105;
  function buatPG(cfg, el, rng, pakai) {
    const s = soalBiasa(cfg, el, rng, pakai, (x) => x.tipe !== 'pilihan' || x.pilihan.length >= cfg.opsi || x.pilihan.some((t) => /\d/.test(t)));
    const o = CP.jadikanPilihan(rng, s, cfg.opsi);
    return { tipe: 'pg', elemen: el.id, modul: s.modul, level: s.level, teks: s.teks, gambar: s.gambar ? s.modulObj.gambar(s) : '', pilihan: o.pilihan, benar: o.benar, langkah: s.langkah, nilai: o.nilai, soal: { tipe: s.tipe, jawab: s.jawab } };
  }
  function pernyataan(cfg, el, rng, pakai, benar) {
    const s = soalBiasa(cfg, el, rng, pakai, pendek);
    let tampil = s.jawab, tertulis = true;
    if (!benar) { const pg = CP.pengecohNumerik(rng, s); tampil = pg[0]; tertulis = false; }
    return { teks: s.teks + ' Jawabannya ' + teksNilai(s, tampil) + '.', benar: tertulis, kunciNilai: teksNilai(s, s.jawab), modul: s.modul, level: s.level, langkah: s.langkah };
  }
  function buatKompleks(cfg, el, rng, pakai, jenis) {
    const n = jenis === 'mcma' ? cfg.opsi : 3;
    let t;
    do { t = []; for (let i = 0; i < n; i++) t.push(rng.peluang(0.5)); } while (!t.some((x) => x) || !t.some((x) => !x) || (jenis === 'mcma' && t.every((x) => !x)));
    const st = t.map((b) => pernyataan(cfg, el, rng, pakai, b));
    if (jenis === 'mcma') return { tipe: 'mcma', elemen: el.id, teks: 'Pilih SEMUA pernyataan yang benar.', pilihan: st.map((x) => x.teks), benar: st.map((x, i) => (x.benar ? i : -1)).filter((i) => i >= 0), langkah: st.map((x) => x.langkah), kunciNilai: st.map((x) => x.kunciNilai), modul: st.map((x) => x.modul) };
    return { tipe: 'kategori', elemen: el.id, teks: 'Tentukan apakah setiap pernyataan berikut benar atau salah.', pernyataan: st.map((x) => x.teks), kunci: st.map((x) => x.benar), langkah: st.map((x) => x.langkah), kunciNilai: st.map((x) => x.kunciNilai), modul: st.map((x) => x.modul) };
  }
  /* ===================== KELUARGA SOAL KHAS TKA =====================
     Meniru jenis soal pada contoh resmi: himpunan, operasi biner, peluruhan persen, kedudukan rusuk kubus,
     kecukupan data, dan grafik garis. Semua dibuat dari angka acak; tidak ada soal yang disalin. */
  const KHAS = {};
  const sf = (n) => { n = Math.round(n * 100) / 100; return String(n).replace('.', ','); };
  const hurufOpsi = 'ABCDE';
  const laluPrima = (x) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; };
  const buatPilihanKhas = (rng, benar, salahKandidat, n) => {
    const pil = [benar], pakai = new Set([benar]);
    rng.kocok(salahKandidat).forEach((t) => { if (pil.length < n && !pakai.has(t)) { pakai.add(t); pil.push(t); } });
    if (pil.length < n) throw new Error('opsi khas kurang');
    const urut = rng.kocok(pil);
    return { pilihan: urut, benar: urut.indexOf(benar) };
  };

  /* --- himpunan --- */
  const strHimp = (a) => '{' + (a.length ? a.join(', ') : '') + '}';
  KHAS.himpunan = function (cfg, el, rng) {
    const a = rng.bulat(5, 9), c = rng.pilih([8, 10, 12, 13]);
    const B = rng.pilih([['bilangan genap', (x) => x % 2 === 0], ['bilangan ganjil', (x) => x % 2 === 1], ['kelipatan 3', (x) => x % 3 === 0]]);
    const U = [...Array(61).keys()];
    const A = U.filter((x) => x >= 1 && x < a), Bs = U.filter(B[1]), C = U.filter((x) => x <= c && laluPrima(x));
    const dalam = (x, l) => l.indexOf(x) >= 0;
    const bentuk = [
      ['(A ∩ B) ∪ C', () => U.filter((x) => (dalam(x, A) && dalam(x, Bs)) || dalam(x, C))],
      ['A ∩ (B ∪ C)', () => U.filter((x) => dalam(x, A) && (dalam(x, Bs) || dalam(x, C)))],
      ['(A ∪ C) ∩ B', () => U.filter((x) => (dalam(x, A) || dalam(x, C)) && dalam(x, Bs))],
      ['(A ∩ C) ∪ (B ∩ C)', () => U.filter((x) => (dalam(x, A) && dalam(x, C)) || (dalam(x, Bs) && dalam(x, C)))]
    ];
    const k = rng.bulat(0, bentuk.length - 1), hasil = bentuk[k][1]();
    const salah = new Set(); const benar = strHimp(hasil);
    bentuk.forEach((b, i) => { if (i !== k) salah.add(strHimp(b[1]())); });
    [...hasil].forEach((x) => salah.add(strHimp(hasil.filter((y) => y !== x))));
    [0, 1, hasil.length ? hasil[hasil.length - 1] + 1 : 2, 11, 6].forEach((x) => { if (!dalam(x, hasil)) salah.add(strHimp(U.filter((y) => dalam(y, hasil) || y === x))); });
    const o = buatPilihanKhas(rng, benar, [...salah].filter((t) => t !== benar), cfg.opsi);
    return { tipe: 'pg', khas: 'himpunan', elemen: el.id, teks: 'Diberikan tiga himpunan bilangan berikut.\nA = {x | x < ' + a + ', x ∈ bilangan asli}\nB = {x | x ' + B[0] + ', x ∈ bilangan cacah}\nC = {x | x ≤ ' + c + ', x ∈ bilangan prima}\nHasil dari ' + bentuk[k][0] + ' adalah …', gambar: '', pilihan: o.pilihan, benar: o.benar, langkah: [
      CP.st('A = ' + strHimp(A) + '. C = ' + strHimp(C) + '. B = himpunan ' + B[0] + ' (' + strHimp(Bs.slice(0, 5)) + ', …).'),
      CP.st('Kerjakan ' + bentuk[k][0] + ' sesuai urutan kurung.'),
      CP.st('Hasilnya ' + benar + '.', benar)], param: { a, c, tipeB: B[0], k, hasil } };
  };

  /* --- operasi biner (benar/salah) --- */
  KHAS.biner = function (cfg, el, rng) {
    for (let t = 0; t < 200; t++) {
      const p = rng.bulat(2, 4), q = rng.bulat(1, 3), r0 = rng.bulat(-3, 4), a0 = rng.bulat(2, 13), k = rng.bulat(1, 4), m = rng.bulat(2, 6);
      const op = (a, b) => p * a + q * b + r0, R = op(a0, k);
      const wA = [a0 % m === 0, laluPrima(a0)], V = op(a0, 0), tampilV = rng.peluang(0.5) ? V : V + rng.pilih([-2, -1, 1, 2, 3]);
      const kunci = [wA[0], wA[1], tampilV === V];
      if (!kunci.some((x) => x) || !kunci.some((x) => !x) || R < 0 || V < 0 || tampilV < 0) continue;
      const rumus = (p === 1 ? '' : p) + 'a + ' + (q === 1 ? '' : q) + 'b ' + (r0 < 0 ? CP.MIN + ' ' + Math.abs(r0) : '+ ' + r0);
      return { tipe: 'kategori', khas: 'biner', elemen: el.id, teks: 'Operasi ⊙ didefinisikan sebagai a ⊙ b = ' + rumus + ' untuk setiap bilangan bulat tak negatif a dan b. Jika a ⊙ ' + k + ' = ' + R + ', tentukan benar atau salah pada setiap pernyataan berikut.', pernyataan: ['a merupakan kelipatan dari ' + m + '.', 'a merupakan bilangan prima.', 'a ⊙ 0 = ' + tampilV + '.'], kunci,
        langkah: [[CP.st('Dari a ⊙ ' + k + ' = ' + R + ': ' + p + 'a + ' + (q * k) + ' ' + (r0 < 0 ? CP.MIN + ' ' + Math.abs(r0) : '+ ' + r0) + ' = ' + R + ', maka a = ' + a0 + '.')], [CP.st('a = ' + a0 + (laluPrima(a0) ? ' adalah bilangan prima.' : ' bukan bilangan prima.'))], [CP.st('a ⊙ 0 = ' + p + ' × ' + a0 + ' + ' + r0 + ' = ' + V + '.')]],
        kunciNilai: ['a = ' + a0 + (kunci[0] ? ', kelipatan ' + m : ', bukan kelipatan ' + m), 'a = ' + a0 + (kunci[1] ? ', prima' : ', bukan prima'), 'a ⊙ 0 = ' + V], param: { p, q, r0, a0, k, m, R, V, tampilV } };
    }
    throw new Error('biner gagal');
  };

  /* --- peluruhan persen (pilih semua yang benar) --- */
  KHAS.peluruhan = function (cfg, el, rng, konteks) {
    for (let t = 0; t < 300; t++) {
      const K0 = rng.bulat(10, 20), pr = rng.pilih([20, 25, 30]), f = 1 - pr / 100, nilai = [K0]; for (let i = 1; i < 8; i++) nilai.push(nilai[i - 1] * f);
      const d1 = rng.bulat(2, 3), d2 = d1 + rng.bulat(1, 3);
      const T1 = Math.ceil(nilai[d1 - 1] + 0.05), T2 = Math.ceil(nilai[d2 - 1] + 0.05);
      if (!(T1 <= nilai[d1 - 2] - 0.05) || !(T2 <= nilai[d2 - 2] - 0.05) || !(T2 < T1)) continue;
      const ok = [2, 3, 4, 5, 6].map((h) => nilai[h - 1] < T1 && nilai[h - 1] >= T2);
      const dekat = [2, 3, 4, 5, 6].some((h) => Math.abs(nilai[h - 1] - T1) < 0.03 || Math.abs(nilai[h - 1] - T2) < 0.03);
      if (dekat || !ok.some((x) => x) || ok.every((x) => x)) continue;
      const vok = konteks === 'vokasi';
      const teks = (vok ? 'Sebuah bak penampung limbah memiliki kadar zat pencemar ' + K0 + ' mg/L pada hari pertama. Setelah penyaringan, kadar turun ' + pr + '% setiap hari secara konsisten. ' : 'Seorang pasien memiliki kadar asam urat ' + K0 + ' mg/dL pada hari pertama. Obat menurunkan kadar sebesar ' + pr + '% setiap hari secara konsisten. ') + 'Kondisi ' + (vok ? 'dianggap aman' : 'pasien terasa nyaman') + ' jika kadar di bawah ' + T1 + ' mg' + (vok ? '/L' : '/dL') + ', dan ' + (vok ? 'dianggap bersih' : 'pasien dianggap sembuh') + ' jika kadar kurang dari ' + T2 + '. Pada hari keberapa ' + (vok ? 'kondisi aman tetapi belum bersih' : 'pasien nyaman tetapi belum dianggap sembuh') + '? Pilih semua jawaban yang benar.';
      return { tipe: 'mcma', khas: 'peluruhan', elemen: el.id, teks, pilihan: [2, 3, 4, 5, 6].map((h) => 'Hari ke-' + h), benar: ok.map((x, i) => (x ? i : -1)).filter((i) => i >= 0),
        langkah: [2, 3, 4, 5, 6].map((h) => [CP.st('Kadar hari ke-' + h + ' = ' + K0 + ' × ' + (f).toString().replace('.', ',') + '^' + (h - 1) + ' = ' + sf(nilai[h - 1]) + (ok[h - 2] ? ' (antara ' + T2 + ' dan ' + T1 + ')' : ' (di luar rentang)') + '.')]),
        kunciNilai: [2, 3, 4, 5, 6].map((h) => 'kadar ' + sf(nilai[h - 1])), param: { K0, pr, T1, T2, nilai } };
    }
    throw new Error('peluruhan gagal');
  };

  /* --- kedudukan rusuk pada kubus --- */
  const KUBUS = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
  const RUSUK = []; Object.keys(KUBUS).forEach((u) => Object.keys(KUBUS).forEach((v) => { if (u < v) { const d = KUBUS[u].map((x, i) => Math.abs(x - KUBUS[v][i])); if (d[0] + d[1] + d[2] === 1) RUSUK.push([u, v, d.indexOf(1)]); } }));
  CP.KUBUS_RUSUK = RUSUK;
  KHAS.ruang = function (cfg, el, rng) {
    const e = rng.pilih(RUSUK), nama = e[0] + e[1], sejajar = RUSUK.filter((r) => r !== e && r[2] === e[2]).length;
    const berpotongan = RUSUK.filter((r) => r !== e && r[2] !== e[2] && (r[0] === e[0] || r[0] === e[1] || r[1] === e[0] || r[1] === e[1])).length;
    const bersilangan = RUSUK.filter((r) => r[2] !== e[2] && !(r[0] === e[0] || r[0] === e[1] || r[1] === e[0] || r[1] === e[1])).length;
    const pilih = rng.bulat(0, 5);
    const Q = [
      ['Pada kubus ABCD.EFGH, berapa banyak rusuk yang sejajar dengan rusuk ' + nama + ' (selain ' + nama + ' sendiri)?', sejajar, 'Rusuk sejajar memiliki arah yang sama: ada 4 rusuk pada tiap arah, jadi 4 − 1 = ' + sejajar + '.'],
      ['Pada kubus ABCD.EFGH, berapa banyak rusuk yang bersilangan dengan rusuk ' + nama + '?', bersilangan, 'Rusuk bersilangan: tidak sejajar dan tidak berpotongan. Dari 8 rusuk berarah lain, 4 berpotongan di titik ' + e[0] + ' atau ' + e[1] + ', sisanya ' + bersilangan + ' bersilangan.'],
      ['Pada kubus ABCD.EFGH, berapa banyak rusuk yang berpotongan dengan rusuk ' + nama + '?', berpotongan, 'Di setiap titik sudut bertemu 3 rusuk. Selain ' + nama + ', ada 2 rusuk di ' + e[0] + ' dan 2 rusuk di ' + e[1] + ': total ' + berpotongan + '.'],
      ['Berapa banyak diagonal ruang pada kubus ABCD.EFGH?', 4, 'Diagonal ruang menghubungkan titik sudut yang berseberangan lewat bagian dalam kubus: 8 titik ÷ 2 = 4.'],
      ['Berapa banyak diagonal bidang (diagonal sisi) pada kubus ABCD.EFGH?', 12, 'Tiap sisi memiliki 2 diagonal dan ada 6 sisi: 6 × 2 = 12.'],
      ['Berapa banyak bidang diagonal pada kubus ABCD.EFGH?', 6, 'Bidang diagonal melalui dua rusuk yang sejajar dan berseberangan: ada 6 bidang.']
    ][pilih];
    const salah = []; for (let d = -3; d <= 8; d++) if (d !== 0 && Q[1] + d >= 0) salah.push(String(Q[1] + d));
    const o = buatPilihanKhas(rng, String(Q[1]), salah.sort((x, y) => Math.abs(x - Q[1]) - Math.abs(y - Q[1])).slice(0, 7), cfg.opsi);
    return { tipe: 'pg', khas: 'ruang', elemen: el.id, teks: Q[0], gambar: '', pilihan: o.pilihan, benar: o.benar, langkah: [CP.st(Q[2]), CP.st('Jawabannya ' + Q[1] + '.', Q[1])], param: { rusuk: nama, pilih, jawab: Q[1] } };
  };

  /* --- kecukupan data --- */
  const OPSI_DS = ['Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup.', 'Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup.', 'Dua pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.', 'Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA juga cukup untuk menjawab pertanyaan.', 'Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan.'];
  KHAS.cukup = function (cfg, el, rng) {
    const jenis = rng.bulat(0, 4), x = rng.bulat(3, 9), y = rng.bulat(4, 12), u = 1000 * rng.bulat(2, 9), n1 = rng.bulat(2, 4), n2 = n1 + rng.bulat(1, 3);
    let teks, s1, s2, why;
    if (jenis === 2) { // C: dua informasi berbeda
      const k = rng.bulat(0, 1); teks = k ? 'Berapakah luas sebuah persegi panjang?' : 'Berapakah volume sebuah balok dengan alas persegi panjang yang tingginya sudah diketahui 5 cm?'; s1 = k ? 'Panjang persegi panjang itu ' + x + ' cm.' : 'Panjang alas ' + x + ' cm.'; s2 = k ? 'Lebar persegi panjang itu ' + y + ' cm.' : 'Lebar alas ' + y + ' cm.'; why = 'Luas (atau volume) memerlukan panjang dan lebar sekaligus. Masing-masing pernyataan hanya memberi satu ukuran, jadi keduanya harus digabung.';
    } else if (jenis === 0 || jenis === 1) { // A atau B: satu pernyataan cukup
      teks = 'Berapakah harga satu buku tulis?'; const cuk = n1 + ' buku tulis harganya Rp' + CP.angka(n1 * u) + ',00.', tak = 'Harga satu buku tulis lebih mahal dari harga satu pensil.';
      s1 = jenis === 0 ? cuk : tak; s2 = jenis === 0 ? tak : cuk; why = 'Harga satu buku = total ÷ jumlah buku = ' + CP.rp(u) + ' hanya dari pernyataan yang menyebut total harga. Pernyataan lain hanya membandingkan harga, tanpa angka.';
    } else if (jenis === 3) { // D: dua-duanya cukup
      teks = 'Berapakah harga satu pensil?'; s1 = n1 + ' pensil harganya Rp' + CP.angka(n1 * u) + ',00.'; s2 = n2 + ' pensil harganya Rp' + CP.angka(n2 * u) + ',00.'; why = 'Pernyataan (1) memberi harga satuan ' + CP.rp(u) + ' (total ÷ ' + n1 + '), dan pernyataan (2) juga ' + CP.rp(u) + ' (total ÷ ' + n2 + '). Masing-masing sudah cukup.';
    } else { // E: tidak cukup
      const k = rng.bulat(0, 1); teks = k ? 'Berapakah umur Dina sekarang?' : 'Berapakah jumlah siswa laki-laki di sebuah kelas?'; s1 = k ? 'Dina lebih muda dari Eka.' : 'Jumlah siswa di kelas itu ' + (x + y + 20) + ' orang.'; s2 = k ? 'Jumlah umur Dina dan Eka ' + (x + y + 20) + ' tahun.' : 'Siswa perempuan di kelas itu lebih banyak dari siswa laki-laki.'; why = 'Kedua pernyataan hanya memberi perbandingan dan jumlah. Dengan dua tak-diketahui, tetap tidak bisa ditentukan satu nilai pasti, bahkan jika keduanya digabung.';
    }
    const benar = jenis; // A,B,C,D,E berurutan
    return { tipe: 'pg', khas: 'cukup', elemen: el.id, teks: teks + '\nPutuskan apakah pernyataan (1) dan pernyataan (2) berikut cukup untuk menjawab pertanyaan.\n(1) ' + s1 + '\n(2) ' + s2, gambar: '', pilihan: OPSI_DS.slice(), benar, langkah: [CP.st(why), CP.st('Jadi jawabannya: ' + hurufOpsi[benar] + '.', OPSI_DS[benar])], param: { jenis, why } };
  };

  /* --- grafik garis (pilih semua yang benar) --- */
  function gbrGarisData(tahun, seri) {
    const X0 = 40, X1 = 250, Y0 = 18, Y1 = 118, semua = [].concat(...seri.map((s) => s.v)), lo = Math.min(...semua) - 5, hi = Math.max(...semua) + 5;
    const mx = (i) => X0 + (i * (X1 - X0)) / (tahun.length - 1), my = (v) => Y1 - ((v - lo) / (hi - lo)) * (Y1 - Y0);
    const el = [CP.H.l(X0, Y0, X0, Y1, 'garis'), CP.H.l(X0, Y1, X1, Y1, 'garis')];
    tahun.forEach((t, i) => el.push(CP.H.t(mx(i), Y1 + 14, t, 'middle', 'kecil')));
    [lo, (lo + hi) / 2, hi].forEach((v) => { el.push(CP.H.l(X0, my(v), X1, my(v), 'tipis'), CP.H.t(X0 - 4, my(v) + 4, Math.round(v), 'end', 'kecil')); });
    const kelas = ['garis', 'merah', 'putus'], ujung = [];
    seri.forEach((s, k) => { el.push(CP.H.d('M' + s.v.map((v, i) => mx(i).toFixed(1) + ' ' + my(v).toFixed(1)).join(' L'), kelas[k % 3])); s.v.forEach((v, i) => el.push(CP.H.o(mx(i), my(v), 3, 'titik'))); ujung.push({ y: my(s.v[s.v.length - 1]), t: s.nama, k }); });
    ujung.sort((a, b) => a.y - b.y); for (let i = 1; i < ujung.length; i++) if (ujung[i].y - ujung[i - 1].y < 13) ujung[i].y = ujung[i - 1].y + 13;
    ujung.forEach((u) => el.push(CP.H.t(X1 + 8, u.y + 4, u.t, 'start', 'tebal')));
    return { tipe: 'gambar', alt: 'Grafik garis: ' + seri.map((s) => s.nama + ' ' + s.v.join(', ')).join('; '), lebar: 320, tinggi: 140, el };
  }
  KHAS.grafikGaris = function (cfg, el, rng, konteks) {
    const nama = konteks === 'vokasi' ? ['Cabang A', 'Cabang B', 'Cabang C'] : ['SMA 1', 'SMA 2', 'SMK 3'];
    for (let t = 0; t < 400; t++) {
      const th = [2019, 2020, 2021, 2022, 2023], seri = nama.map((nm) => { let v = rng.bulat(20, 60); const arr = [v]; for (let i = 1; i < 5; i++) { v += rng.pilih([-8, -4, 0, 0, 4, 8, 12]); arr.push(Math.max(5, v)); } return { nama: nm, v: arr }; });
      const naik = (s, a, b) => { for (let i = a; i < b; i++) if (!(s.v[i + 1] > s.v[i])) return false; return true; };
      const turun23 = (s) => s.v[4] < s.v[3];
      const tetap = (s) => s.v[2] === s.v[3] && s.v[3] === s.v[4];
      const mulai = rng.bulat(1, 2), s1 = rng.bulat(0, 2), s2 = (s1 + 1) % 3;
      const P = [
        [nama[s1] + ' bertambah setiap tahun mulai ' + th[mulai] + '.', naik(seri[s1], mulai, 4)],
        ['Pada tahun ' + th[1] + '–' + th[3] + ', banyaknya ketiganya selalu bertambah.', seri.every((s) => naik(s, 1, 3))],
        [nama[s2] + ' konsisten naik selama lima tahun terakhir.', naik(seri[s2], 0, 4)],
        [nama[(s1 + 2) % 3] + ' tidak berubah selama tiga tahun terakhir.', tetap(seri[(s1 + 2) % 3])],
        ['Pada tahun ' + th[4] + ', ketiganya menurun dibandingkan tahun sebelumnya.', seri.every(turun23)]
      ];
      const ok = P.map((x) => x[1]); if (!ok.some((x) => x) || ok.filter((x) => x).length > 3) continue;
      const vok = konteks === 'vokasi';
      return { tipe: 'mcma', khas: 'grafikGaris', elemen: el.id, teks: (vok ? 'Grafik berikut menunjukkan jumlah pesanan per tahun di tiga cabang toko.' : 'Grafik berikut menunjukkan banyak lulusan per tahun di tiga sekolah milik sebuah yayasan.') + ' Pernyataan mana saja yang tepat menggambarkan data pada grafik? Pilih semua jawaban yang benar.', gambar: CP.gambarSVG(gbrGarisData(th, seri)), pilihan: P.map((x) => x[0]), benar: ok.map((x, i) => (x ? i : -1)).filter((i) => i >= 0),
        langkah: P.map((x) => [CP.st('Periksa nilai pada grafik: ' + seri.map((s) => s.nama + ' ' + s.v.join(', ')).join('; ') + '.')]), kunciNilai: P.map((x) => (x[1] ? 'benar' : 'salah')), param: { th, seri, mulai, s1, s2 } };
    }
    throw new Error('grafik gagal');
  };
  /* --- daerah penyelesaian pertidaksamaan (dari gambar) --- */
  function potongSetengah(poli, a, b, c, atas) { // pertahankan titik dengan a x + b y (>=|<=) c
    const out = [], n = poli.length, nilai = (p) => a * p[0] + b * p[1] - c, dalam = (p) => (atas ? nilai(p) >= -1e-9 : nilai(p) <= 1e-9);
    for (let i = 0; i < n; i++) {
      const p = poli[i], q = poli[(i + 1) % n];
      if (dalam(p)) out.push(p);
      if (dalam(p) !== dalam(q)) { const t = nilai(p) / (nilai(p) - nilai(q)); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
    }
    return out;
  }
  function gbrDaerah(m, u, v, L2) {
    const maks = Math.max(m, u, v) + 1.5, X0 = 40, Y1 = 124, sk = 92 / maks, mx = (x) => X0 + x * sk * 1.6, my = (y) => Y1 - y * sk * 1.15;
    let poli = [[0, 0], [maks, 0], [maks, maks], [0, maks]];
    poli = potongSetengah(poli, 1, 1, m, false); poli = potongSetengah(poli, L2.a, L2.b, L2.c, true);
    const el = [CP.H.p(poli.map((p) => [mx(p[0]), my(p[1])]), 'isi2'), CP.H.l(X0, Y1, mx(maks), Y1, 'garis'), CP.H.l(X0, Y1, X0, my(maks), 'garis')];
    el.push(CP.H.l(mx(m), my(0), mx(0), my(m), 'garis'), CP.H.l(mx(v), my(0), mx(0), my(u), 'merah'));
    [[m, 0], [v, 0]].forEach((p) => el.push(CP.H.t(mx(p[0]), Y1 + 14, p[0], 'middle', 'tebal')));
    [[0, m], [0, u]].forEach((p) => el.push(CP.H.t(X0 - 6, my(p[1]) + 4, p[1], 'end', 'tebal')));
    el.push(CP.H.t(mx(maks) - 4, Y1 - 6, 'x', 'end', 'kecil'), CP.H.t(X0 + 8, my(maks) + 10, 'y', 'start', 'kecil'));
    return { tipe: 'gambar', alt: 'Daerah arsiran dibatasi sumbu koordinat dan dua garis yang memotong sumbu di (' + m + ', 0), (0, ' + m + '), (' + v + ', 0), dan (0, ' + u + ')', tinggi: 144, el };
  }
  const gcd2 = CP.gcd;
  KHAS.daerah = function (cfg, el, rng) {
    for (let t = 0; t < 200; t++) {
      const m = rng.bulat(6, 9), u = rng.bulat(2, 5), v = rng.bulat(2, 5), g = gcd2(u, v);
      if (u === v) continue;
      const L2 = { a: u / g, b: v / g, c: (u * v) / g };
      const sis = (opsi) => [{ a: 1, b: 1, c: m, r: opsi.r1 }, { a: opsi.a, b: opsi.b, c: opsi.c, r: opsi.r2 }, ...(opsi.tanpaX ? [] : [{ a: 1, b: 0, c: 0, r: '≥' }]), { a: 0, b: 1, c: 0, r: '≥' }];
      const bnr = sis({ r1: '≤', a: L2.a, b: L2.b, c: L2.c, r2: '≥' });
      const varian = [
        sis({ r1: '≤', a: L2.a, b: L2.b, c: L2.c, r2: '≤' }),
        sis({ r1: '≥', a: L2.a, b: L2.b, c: L2.c, r2: '≥' }),
        sis({ r1: '≤', a: L2.b, b: L2.a, c: L2.c, r2: '≥' }),
        sis({ r1: '≤', a: L2.a, b: L2.b, c: L2.c, r2: '≥', tanpaX: true }),
        sis({ r1: '≤', a: L2.a, b: L2.b, c: L2.c + gcd2(L2.a, L2.b) * 0 + 1, r2: '≥' }),
        sis({ r1: '≤', a: L2.a, b: -L2.b, c: -L2.c, r2: '≥' })
      ];
      const teksSis = (s) => s.map((c) => rend0(c.a, c.b) + ' ' + c.r + ' ' + F0(c.c)).join('; ');
      const dalamS = (sis, x, y) => sis.every((c) => { const w = c.a * x + c.b * y; return c.r === '≤' ? w <= c.c : w >= c.c; });
      const beda = (sis) => { for (let x = -4; x <= 14; x++) for (let y = -4; y <= 14; y++) if (dalamS(sis, x, y) !== dalamS(bnr, x, y)) return true; return false; };
      const benar = teksSis(bnr), salah = varian.filter(beda).map(teksSis).filter((x) => x !== benar);
      if (new Set([benar, ...salah]).size < cfg.opsi) continue;
      const o = buatPilihanKhas(rng, benar, salah, cfg.opsi);
      return { tipe: 'pg', khas: 'daerah', elemen: el.id, teks: 'Perhatikan gambar berikut. Daerah yang diarsir merupakan himpunan penyelesaian dari sistem pertidaksamaan …', gambar: CP.gambarSVG(gbrDaerah(m, u, v, L2)), pilihan: o.pilihan, benar: o.benar,
        langkah: [CP.st('Garis hitam memotong sumbu di (' + m + ', 0) dan (0, ' + m + '): persamaannya x + y = ' + m + '. Daerah arsiran ada di bawah/dalam garis (titik O(0, 0) memenuhi), jadi x + y ≤ ' + m + '.'), CP.st('Garis merah memotong sumbu di (' + v + ', 0) dan (0, ' + u + '): persamaannya ' + rend0(L2.a, L2.b) + ' = ' + L2.c + '. Titik O(0, 0) berada di luar daerah arsiran (0 < ' + L2.c + '), jadi tandanya ≥.'), CP.st('Daerah juga di kuadran pertama: x ≥ 0 dan y ≥ 0. Sistemnya: ' + benar + '.', benar)],
        param: { m, u, v, L2 }, opsiData: [bnr, ...varian.filter(beda)] };
    }
    throw new Error('daerah gagal');
  };
  const rend0 = (a, b) => (a === 0 ? '' : (a === 1 ? '' : a === -1 ? CP.MIN : a) + 'x') + (a !== 0 && b > 0 ? ' + ' : a !== 0 && b < 0 ? ' ' + CP.MIN + ' ' : b < 0 ? CP.MIN : '') + (b === 0 ? '' : (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y');
  const F0 = (c) => (c < 0 ? CP.MIN + Math.abs(c) : String(c));

  /* --- memuat kardus ke bak truk --- */
  KHAS.pemuatan = function (cfg, el, rng, konteks) {
    for (let t = 0; t < 300; t++) {
      const a = 5 * rng.bulat(3, 7), b = 5 * rng.bulat(3, 7), c = 5 * rng.bulat(3, 7);
      const P = a * rng.bulat(3, 7) + rng.pilih([0, 5, 10]), L = b * rng.bulat(2, 5) + rng.pilih([0, 5, 15]), T = c * rng.bulat(2, 4) + rng.pilih([0, 5]);
      if (a === b) continue;
      const n1 = Math.floor(P / a) * Math.floor(L / b), n2 = Math.floor(P / b) * Math.floor(L / a), lap = Math.floor(T / c), maks = Math.max(n1, n2) * lap;
      if (n1 === n2 || maks < 20) continue;
      const vol = Math.floor((P * L * T) / (a * b * c));
      const salah = [Math.min(n1, n2) * lap, n1 * lap + n2 * lap, vol, maks - lap, maks + lap, Math.max(n1, n2) * (lap - 1), Math.max(n1, n2) * (lap + 1), maks + Math.floor(maks / 10)].filter((x) => x !== maks && x > 0).map(String);
      if (new Set(salah).size < cfg.opsi - 1) continue;
      const o = buatPilihanKhas(rng, String(maks), salah, cfg.opsi);
      const barang = konteks === 'vokasi' ? 'kardus kemasan produk' : 'kardus helm';
      return { tipe: 'pg', khas: 'pemuatan', elemen: el.id, teks: 'Sebuah bak truk berbentuk balok berukuran panjang ' + P + ' cm, lebar ' + L + ' cm, dan tinggi ' + T + ' cm. Truk itu akan memuat ' + barang + ' berbentuk balok berukuran ' + a + ' cm × ' + b + ' cm × ' + c + ' cm (tinggi ' + c + ' cm harus tegak dan kardus tidak boleh dibalik). Kardus boleh diputar 90° pada alasnya, tetapi semua kardus disusun dengan arah yang sama. Berapa paling banyak kardus yang dapat dimuat?', gambar: '', pilihan: o.pilihan, benar: o.benar,
        langkah: [CP.st('Arah 1 (' + a + ' sejajar panjang bak): ' + Math.floor(P / a) + ' × ' + Math.floor(L / b) + ' = ' + n1 + ' kardus per lapis. Arah 2 (diputar 90°): ' + Math.floor(P / b) + ' × ' + Math.floor(L / a) + ' = ' + n2 + ' kardus per lapis.'), CP.st('Banyak lapis = ' + T + ' ÷ ' + c + ' dibulatkan ke bawah = ' + lap + '.'), CP.st('Maksimum = ' + Math.max(n1, n2) + ' × ' + lap + ' = ' + maks + '.', maks)], param: { P, L, T, a, b, c, maks } };
    }
    throw new Error('pemuatan gagal');
  };

  /* --- tabel data dengan syarat (benar/salah, pasti atau mungkin) --- */
  KHAS.tabelDistribusi = function (cfg, el, rng, konteks) {
    const hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    for (let t = 0; t < 600; t++) {
      const lo = rng.bulat(1, 3), hi = rng.bulat(9, 12), val = hari.map(() => rng.bulat(lo, hi));
      const mean = Math.round(val.reduce((a, b) => a + b, 0) / 5), tot = mean * 5;
      const urut = (x) => x.slice().sort((p, q) => p - q);
      const med = urut(val)[2];
      const idx = rng.kocok([0, 1, 2, 3, 4]), tak = [idx[0], idx[1]], tahu = [idx[2], idx[3], idx[4]];
      const sol = [];
      for (let p = lo; p <= hi; p++) for (let q = lo; q <= hi; q++) { const w = val.slice(); w[tak[0]] = p; w[tak[1]] = q; if (w.reduce((a, b) => a + b, 0) === tot && urut(w)[2] === med) sol.push(w); }
      if (sol.length < 3 || sol.length > 12) continue;
      const nm = (i) => hari[i], A = tak[0], B = tak[1];
      const batas = rng.bulat(lo, hi - 1);
      const P = [
        ['Banyak pengunjung hari ' + nm(A) + ' pasti lebih dari ' + batas + ' orang.', sol.every((w) => w[A] > batas)],
        ['Banyak pengunjung hari ' + nm(B) + ' pasti paling banyak ' + (batas + 1) + ' orang.', sol.every((w) => w[B] <= batas + 1)],
        ['Banyak pengunjung hari ' + nm(A) + ' dan hari ' + nm(B) + ' mungkin saja sama.', sol.some((w) => w[A] === w[B])]
      ];
      const ok = P.map((x) => x[1]); if (!ok.some((x) => x) || !ok.some((x) => !x)) continue;
      const vok = konteks === 'vokasi';
      const tabel = hari.map((h, i) => '• ' + h + ': ' + (tak.indexOf(i) >= 0 ? '?' : val[i])).join('\n');
      return { tipe: 'kategori', khas: 'tabelDistribusi', elemen: el.id, teks: (vok ? 'Tabel berikut menunjukkan banyak pesanan yang diterima sebuah toko pada hari buka Senin sampai Jumat. Dua hari datanya hilang (?).' : 'Tabel berikut menunjukkan banyak pengunjung perpustakaan desa pada hari buka Senin sampai Jumat. Dua hari datanya hilang (?).') + '\n' + tabel + '\nDiketahui: rata-rata per hari ' + mean + ', banyak per hari paling sedikit ' + lo + ' dan paling banyak ' + hi + ', serta median data ' + med + '. Tentukan benar atau salah setiap pernyataan.', pernyataan: P.map((x) => x[0]), kunci: ok,
        langkah: P.map(() => [CP.st('Jumlah seluruh = ' + mean + ' × 5 = ' + tot + '. Jumlah hari yang diketahui = ' + tahu.reduce((a, i) => a + val[i], 0) + ', sehingga dua hari hilang berjumlah ' + (tot - tahu.reduce((a, i) => a + val[i], 0)) + '. Semua pasangan yang memenuhi jumlah, batas, dan median ada ' + sol.length + ' kemungkinan.')]), kunciNilai: P.map((x) => (x[1] ? 'benar untuk semua kemungkinan / ada kemungkinan' : 'tidak berlaku')), param: { lo, hi, val, tak, mean, med, batas, sol } };
    }
    throw new Error('tabel gagal');
  };

  /* --- SPLTV dari tabel (buket) --- */
  function gbrTabel(kolom, baris, lebarKol) {
    const x0 = 10, y0 = 8, tg = 24, el = []; const lk = lebarKol || kolom.map(() => Math.floor(300 / kolom.length));
    const semua = [kolom, ...baris]; let y = y0;
    semua.forEach((r, ri) => { let x = x0; r.forEach((c, ci) => { el.push(CP.H.r(x, y, lk[ci], tg, ri === 0 ? 'isi' : 'kosong'), CP.H.t(x + lk[ci] / 2, y + 16, c, 'middle', ri === 0 ? 'tebal' : 'teks')); x += lk[ci]; }); y += tg; });
    return { tipe: 'gambar', alt: 'Tabel: ' + semua.map((r) => r.join(' | ')).join('; '), lebar: 320, tinggi: y + 6, el };
  }
  KHAS.buket = function (cfg, el, rng, konteks) {
    for (let t = 0; t < 400; t++) {
      const x = rng.bulat(3, 12), y = rng.bulat(3, 12), z = rng.bulat(3, 12), M = [0, 1, 2].map(() => [rng.bulat(1, 4), rng.bulat(0, 4), rng.bulat(0, 4)]);
      const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
      if (det === 0 || new Set([x, y, z]).size < 3) continue;
      const harga = M.map((r) => r[0] * x + r[1] * y + r[2] * z), tambah = [rng.bulat(0, 3), rng.bulat(1, 3), rng.bulat(1, 3)], K = 2;
      const tot = harga[K] + tambah[1] * y + tambah[2] * z + tambah[0] * x;
      const salah = [tot + 1, tot - 1, tot + 2, tot - 2, tot + 5, tot - 5, tot + 10, tot - 10, harga[K] + tambah[1] * x + tambah[2] * y].map((q) => q).filter((q) => q !== tot && q > 0).map((q) => 'Rp' + CP.angka(q * 1000) + ',00');
      if (new Set(salah).size < cfg.opsi - 1) continue;
      const o = buatPilihanKhas(rng, 'Rp' + CP.angka(tot * 1000) + ',00', salah, cfg.opsi);
      const vok = konteks === 'vokasi', nm = vok ? ['Bahan A', 'Bahan B', 'Bahan C'] : ['Mawar', 'Lili', 'Anyelir'], tipe = vok ? ['Paket 1', 'Paket 2', 'Paket 3'] : ['Tipe A', 'Tipe B', 'Tipe C'];
      const tabel = gbrTabel([vok ? 'Paket' : 'Buket', nm[0], nm[1], nm[2], 'Harga'], M.map((r, i) => [tipe[i], r[0], r[1], r[2], 'Rp' + CP.angka(harga[i] * 1000)]), [62, 50, 50, 56, 82]);
      const tamb = [tambah[0] ? tambah[0] + ' ' + nm[0].toLowerCase() : '', tambah[1] + ' ' + nm[1].toLowerCase(), tambah[2] + ' ' + nm[2].toLowerCase()].filter(Boolean).join(', ');
      return { tipe: 'pg', khas: 'buket', elemen: el.id, teks: (vok ? 'Sebuah bengkel menyediakan tiga paket suku cadang yang terdiri dari tiga jenis bahan. Komposisi dan harga tiap paket diberikan pada tabel. ' : 'Bu Silma merangkai tiga tipe buket dari bunga mawar, lili, dan anyelir. Komposisi dan harga tiap buket diberikan pada tabel. ') + 'Seorang pembeli memilih ' + (vok ? tipe[K].toLowerCase() : 'buket ' + tipe[K]) + ' dan menambah ' + tamb + ' dengan harga satuan. Berapa total yang harus dibayar?', gambar: CP.gambarSVG(tabel), pilihan: o.pilihan, benar: o.benar,
        langkah: [CP.st('Misalkan harga satuan ' + nm.join(', ').toLowerCase() + ' adalah x, y, z (ribu rupiah). Dari tiga baris tabel: ' + M.map((r, i) => r[0] + 'x + ' + r[1] + 'y + ' + r[2] + 'z = ' + harga[i]).join('; ') + '.'), CP.st('Penyelesaian sistem: x = ' + x + ', y = ' + y + ', z = ' + z + ' (ribu rupiah).'), CP.st('Total = ' + harga[K] + ' + ' + tambah[0] + '×' + x + ' + ' + tambah[1] + '×' + y + ' + ' + tambah[2] + '×' + z + ' = ' + tot + ' ribu = Rp' + CP.angka(tot * 1000) + ',00.', 'Rp' + CP.angka(tot * 1000) + ',00')], param: { x, y, z, M, harga, tambah, K, tot } };
    }
    throw new Error('buket gagal');
  };

  CP.TKA_KHAS = KHAS;

  // alokasi proporsional (sisa terbesar)
  CP.alokasiTKA = function (elemen, n) {
    const tot = elemen.reduce((a, e) => a + e.bobot, 0), dasar = elemen.map((e) => Math.floor((e.bobot * n) / tot));
    let sisa = n - dasar.reduce((a, b) => a + b, 0);
    elemen.map((e, i) => ({ i, f: (e.bobot * n) / tot - dasar[i] })).sort((a, b) => b.f - a.f).forEach((x) => { if (sisa > 0) { dasar[x.i]++; sisa--; } });
    return dasar;
  };
  // o: {jumlah, elemen (id), bentuk:'campur'|'pg'}
  CP.susunTKA = function (jenjang, rng, o) {
    o = o || {}; const cfg = CP.TKA[jenjang]; if (!cfg) throw new Error('jenjang TKA tidak dikenal: ' + jenjang);
    rng = rng || CP.rngUmum;
    const n = o.jumlah || cfg.jumlah, el = o.elemen ? cfg.elemen.filter((e) => e.id === o.elemen) : cfg.elemen;
    const alok = o.elemen ? [n] : CP.alokasiTKA(el, n), pakai = new Set(), items = [];
    el.forEach((e, k) => {
      for (let i = 0; i < alok[k]; i++) {
        const r = rng.acak();
        const jenis = o.bentuk === 'pg' ? 'pg' : r < 0.68 ? 'pg' : r < 0.84 ? 'mcma' : 'kategori';
        if (!o.tanpaKhas && e.khas && e.khas.length && rng.peluang(0.34)) {
          const fam = rng.pilih(e.khas);
          try { const it = KHAS[fam](cfg, e, rng, cfg.konteks); const kunciTeks = it.teks; if (!pakai.has(kunciTeks)) { pakai.add(kunciTeks); items.push(it); continue; } } catch (x) { /* jatuh ke soal biasa */ }
        }
        try { items.push(jenis === 'pg' ? buatPG(cfg, e, rng, pakai) : buatKompleks(cfg, e, rng, pakai, jenis)); }
        catch (x) { items.push(buatPG(cfg, e, rng, pakai)); }
      }
    });
    return rng.kocok(items).map((it, i) => Object.assign(it, { no: i + 1 }));
  };

  /* ===================== PENILAIAN ===================== */
  CP.itemBenar = function (it, j) {
    if (j === null || j === undefined) return false;
    if (it.tipe === 'pg') return Number(j) === it.benar;
    if (it.tipe === 'mcma') { const a = (j || []).slice().sort((x, y) => x - y), b = it.benar.slice().sort((x, y) => x - y); return a.length === b.length && a.every((x, i) => x === b[i]); }
    return Array.isArray(j) && j.length === it.kunci.length && it.kunci.every((k, i) => j[i] === k);
  };
  CP.itemTerjawab = function (it, j) {
    if (j === null || j === undefined) return false;
    if (it.tipe === 'pg') return true;
    if (it.tipe === 'mcma') return Array.isArray(j) && j.length > 0;
    return Array.isArray(j) && j.length === it.kunci.length && j.every((x) => x === true || x === false);
  };
  CP.nilaiTKA = function (items, jaw) {
    const per = {}; let benar = 0, kosong = 0;
    items.forEach((it, i) => {
      const e = per[it.elemen] || (per[it.elemen] = { n: 0, b: 0 }); e.n++;
      if (!CP.itemTerjawab(it, jaw[i])) kosong++;
      if (CP.itemBenar(it, jaw[i])) { benar++; e.b++; }
    });
    const n = items.length;
    return { n, benar, kosong, persen: n ? Math.round((1000 * benar) / n) / 10 : 0, skor: n ? Math.round((100 * benar) / n) : 0, perElemen: per };
  };
  CP.catatTKA = function (pr, hasil, info) {
    pr.tka = pr.tka || [];
    pr.tka.unshift({ tgl: info.tgl, jenjang: info.jenjang, mode: info.mode, elemen: info.elemen || '', n: hasil.n, b: hasil.benar, skor: hasil.skor, detik: Math.round(info.detik), per: hasil.perElemen });
    if (pr.tka.length > 20) pr.tka.pop();
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = CP;
})(typeof globalThis !== 'undefined' ? globalThis : this);
