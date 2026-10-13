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
      nama: 'TKA SMP', durasi: 60, jumlah: 25, konteks: 'umum', pasti: false,
      elemen: [
        { id: 'bilangan', nama: 'Bilangan', bobot: 7, modul: ['VII-1', 'VII-2', 'VII-3', 'H1', 'H2', 'H3'] },
        { id: 'aljabar', nama: 'Aljabar', bobot: 7, modul: ['VII-4', 'VIII-1', 'VIII-2', 'VIII-3', 'IX-1'] },
        { id: 'geometri', nama: 'Geometri dan Pengukuran', bobot: 6, modul: ['VII-5', 'VIII-4', 'IX-2', 'IX-3'] },
        { id: 'data', nama: 'Data dan Peluang', bobot: 5, modul: ['VII-6', 'VIII-5', 'IX-4'] }
      ]
    },
    SMA: {
      nama: 'TKA SMA', durasi: 75, jumlah: 25, konteks: 'umum', pasti: true,
      elemen: [
        { id: 'bilangan', nama: 'Bilangan', bobot: 5, modul: ['X-1', 'X-2', 'H1', 'H2'] },
        { id: 'aljabar', nama: 'Aljabar dan Fungsi', bobot: 7, modul: ['X-4', 'X-5', 'XI-1', 'XII-1'] },
        { id: 'geometri', nama: 'Geometri dan Pengukuran', bobot: 4, modul: ['XI-2', 'XII-2'] },
        { id: 'trigonometri', nama: 'Trigonometri', bobot: 3, modul: ['X-3'] },
        { id: 'data', nama: 'Data dan Peluang', bobot: 6, modul: ['X-6', 'X-7', 'XI-3', 'XII-3'] }
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

  // ubah soal angka/pecahan menjadi pilihan ganda 4 opsi
  CP.jadikanPilihan = function (rng, soal) {
    if (soal.tipe === 'pilihan') return { pilihan: soal.pilihan.slice(), benar: soal.benar };
    const benar = teksNilai(soal, soal.jawab), pil = [{ t: benar, q: soal.jawab }], pakai = new Set([benar]);
    CP.pengecohNumerik(rng, soal).forEach((q) => { if (pil.length >= 4) return; const t = teksNilai(soal, q); if (!pakai.has(t)) { pakai.add(t); pil.push({ t, q }); } });
    if (pil.length < 4) throw new Error('pengecoh kurang: ' + soal.teks);
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
    const s = soalBiasa(cfg, el, rng, pakai);
    const o = CP.jadikanPilihan(rng, s);
    return { tipe: 'pg', elemen: el.id, modul: s.modul, level: s.level, teks: s.teks, gambar: s.gambar ? s.modulObj.gambar(s) : '', pilihan: o.pilihan, benar: o.benar, langkah: s.langkah, nilai: o.nilai, soal: { tipe: s.tipe, jawab: s.jawab } };
  }
  function pernyataan(cfg, el, rng, pakai, benar) {
    const s = soalBiasa(cfg, el, rng, pakai, pendek);
    let tampil = s.jawab, tertulis = true;
    if (!benar) { const pg = CP.pengecohNumerik(rng, s); tampil = pg[0]; tertulis = false; }
    return { teks: s.teks + ' Jawabannya ' + teksNilai(s, tampil) + '.', benar: tertulis, kunciNilai: teksNilai(s, s.jawab), modul: s.modul, level: s.level, langkah: s.langkah };
  }
  function buatKompleks(cfg, el, rng, pakai, jenis) {
    const n = jenis === 'mcma' ? 4 : 3;
    let t;
    do { t = []; for (let i = 0; i < n; i++) t.push(rng.peluang(0.5)); } while (!t.some((x) => x) || !t.some((x) => !x) || (jenis === 'mcma' && t.every((x) => !x)));
    const st = t.map((b) => pernyataan(cfg, el, rng, pakai, b));
    if (jenis === 'mcma') return { tipe: 'mcma', elemen: el.id, teks: 'Pilih SEMUA pernyataan yang benar.', pilihan: st.map((x) => x.teks), benar: st.map((x, i) => (x.benar ? i : -1)).filter((i) => i >= 0), langkah: st.map((x) => x.langkah), kunciNilai: st.map((x) => x.kunciNilai), modul: st.map((x) => x.modul) };
    return { tipe: 'kategori', elemen: el.id, teks: 'Tentukan apakah setiap pernyataan berikut benar atau salah.', pernyataan: st.map((x) => x.teks), kunci: st.map((x) => x.benar), langkah: st.map((x) => x.langkah), kunciNilai: st.map((x) => x.kunciNilai), modul: st.map((x) => x.modul) };
  }
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
