/* CepatPaham - inti: konfigurasi, angka, pemeriksa jawaban, mesin adaptif, penyimpanan, laporan, cadangan */
(function (G) {
  'use strict';
  const CP = (G.CP = G.CP || {});

  /* ===================== 1. KONFIGURASI ===================== */
  CP.KONFIG = {
    nama: 'CepatPaham',
    tagline: 'Hitung cepat. Paham konsep.',
    versiApp: '1.10.0',
    versiData: 1,
    kunciSimpan: 'cepatpaham:data',
    soalPerSesi: 10,
    persenUlangan: 0.2,
    levelMaks: 6,
    hariGrafik: 14,
    // target waktu rata-rata (detik) per level 1..6; bisa ditimpa per modul lewat modul.target
    targetDetik: {
      sekolah: [30, 42, 54, 66, 78, 90],
      hitungCepat: [10, 14, 18, 22, 26, 30]
    },
    jenjang: {
      SMP: { nama: 'SMP', kelas: ['VII', 'VIII', 'IX'] },
      SMA: { nama: 'SMA', kelas: ['X', 'XI', 'XII'] },
      SMK: { nama: 'SMK', kelas: ['X', 'XI', 'XII'] }
    },
    urutKelas: ['VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
    disarankan: { SMP: ['H1', 'H2', 'H3'], SMA: ['H4', 'H5', 'H6'], SMK: ['H4', 'H5', 'H6'] }
  };

  /* ===================== 2. ACAK BER-SEED ===================== */
  CP.buatRng = function (seed) {
    let s = (seed === undefined ? Math.floor(Math.random() * 4294967296) : seed) >>> 0;
    function next() {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      acak: next,
      bulat(a, b) { return a + Math.floor(next() * (b - a + 1)); },
      pilih(arr) { return arr[Math.floor(next() * arr.length)]; },
      peluang(p) { return next() < p; },
      kocok(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          const t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
      }
    };
  };
  CP.rngUmum = CP.buatRng();

  /* ===================== 3. MATEMATIKA DASAR ===================== */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  const kpk = (a, b) => Math.abs(a * b) / gcd(a, b);
  CP.gcd = gcd; CP.kpk = kpk;

  CP.faktorPrima = function (n) {
    const f = {};
    let x = n;
    for (let p = 2; p * p <= x; p++) { while (x % p === 0) { f[p] = (f[p] || 0) + 1; x /= p; } }
    if (x > 1) f[x] = (f[x] || 0) + 1;
    return f;
  };

  // pecahan {n,d}, d > 0, tereduksi
  const P = (n, d) => {
    if (d === undefined) d = 1;
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  };
  CP.P = P;
  CP.pTambah = (a, b) => P(a.n * b.d + b.n * a.d, a.d * b.d);
  CP.pKurang = (a, b) => P(a.n * b.d - b.n * a.d, a.d * b.d);
  CP.pKali = (a, b) => P(a.n * b.n, a.d * b.d);
  CP.pBagi = (a, b) => P(a.n * b.d, a.d * b.n);
  CP.pSama = (a, b) => a.n * b.d === b.n * a.d;
  CP.pNilai = (a) => a.n / a.d;
  CP.pBanding = (a, b) => a.n * b.d - b.n * a.d;
  CP.naPecahan = (x) => (typeof x === 'number' ? P(x, 1) : P(x.n, x.d));

  /* ===================== 4. FORMAT ANGKA (gaya Indonesia) ===================== */
  const MIN = '−';
  CP.MIN = MIN;
  const kelompok = (s) => (s.length > 3 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s);
  CP.angka = (n) => (n < 0 ? MIN : '') + kelompok(String(Math.abs(Math.round(n))));
  CP.rp = (n) => (n < 0 ? MIN : '') + 'Rp' + kelompok(String(Math.abs(Math.round(n))));
  // operan dalam ekspresi: negatif dibungkus kurung kecuali di posisi pertama
  CP.op = (n, pertama) => (n < 0 && !pertama ? '(' + CP.angka(n) + ')' : CP.angka(n));
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  CP.sup = (n) => String(n).replace(/./g, (c) => (c === '−' ? SUP['-'] : SUP[c]));
  // desimal bergaya Indonesia atau null jika tak berhenti
  CP.desimalStr = function (p) {
    let d = p.d, k = 0, l = 0;
    while (d % 2 === 0) { d /= 2; k++; }
    while (d % 5 === 0) { d /= 5; l++; }
    if (d !== 1) return null;
    const e = Math.max(k, l);
    const val = Math.abs(p.n) * (Math.pow(10, e) / p.d);
    let s = String(Math.round(val));
    let bulat = s, pecah = '';
    if (e > 0) { while (s.length <= e) s = '0' + s; bulat = s.slice(0, -e); pecah = s.slice(-e); }
    return (p.n < 0 ? MIN : '') + kelompok(bulat) + (pecah ? ',' + pecah : '');
  };
  CP.pecahanStr = (p) => (p.d === 1 ? CP.angka(p.n) : (p.n < 0 ? MIN : '') + Math.abs(p.n) + '/' + p.d);
  // tampil jawaban benar
  CP.tampilJawab = function (soal) {
    if (soal.tipe === 'pilihan') return soal.pilihan[soal.benar];
    const p = soal.jawab;
    let s = soal.tipe === 'pecahan' || p.d !== 1 && !CP.desimalStr(p) ? CP.pecahanStr(p) : (CP.desimalStr(p) || CP.pecahanStr(p));
    if (soal.sederhana && p.d !== 1) s = CP.pecahanStr(p);
    return (soal.awalan ? (p.n < 0 ? MIN : '') + soal.awalan + s.replace(MIN, '') : s) + (soal.satuan ? ' ' + soal.satuan : '');
  };

  /* ===================== 5. PEMERIKSA JAWABAN ===================== */
  CP.parseJawaban = function (str) {
    let s = String(str == null ? '' : str).trim().replace(/−/g, '-').replace(/\s+/g, '');
    if (!s) return null;
    let m = /^(-?)(\d+)\/(\d+)$/.exec(s);
    if (m) {
      const d = parseInt(m[3], 10);
      if (!d) return null;
      const n = parseInt(m[2], 10) * (m[1] ? -1 : 1);
      return { p: P(n, d), bentuk: 'pecahan', tereduksi: gcd(n, d) === 1 };
    }
    m = /^(-?)(\d{1,3}(?:\.\d{3})+)$/.exec(s); // 1.250.000 = ribuan
    if (m) { const n = parseInt(m[2].replace(/\./g, ''), 10) * (m[1] ? -1 : 1); return { p: P(n, 1), bentuk: 'bulat', tereduksi: true }; }
    m = /^(-?)(\d+)(?:[.,](\d+))?$/.exec(s);
    if (m) {
      const frac = m[3] || '';
      if (frac.length > 9) return null;
      const d = Math.pow(10, frac.length);
      const n = (parseInt(m[2] + frac, 10)) * (m[1] ? -1 : 1);
      return { p: P(n, d), bentuk: frac ? 'desimal' : 'bulat', tereduksi: true };
    }
    return null;
  };
  // input: teks (angka/pecahan) atau indeks (pilihan)
  CP.periksaJawaban = function (soal, input) {
    if (soal.tipe === 'pilihan') return Number(input) === soal.benar;
    const r = CP.parseJawaban(input);
    if (!r) return false;
    if (!CP.pSama(r.p, soal.jawab)) return false;
    if (soal.sederhana && soal.jawab.d !== 1) return r.bentuk === 'pecahan' && r.tereduksi;
    return true;
  };

  /* ===================== 6. PEMBANGUN SOAL ===================== */
  CP.S = {
    angka(teks, jawab, o) {
      o = o || {};
      return Object.assign({ tipe: 'angka', teks, jawab: CP.naPecahan(jawab), izin: { minus: false, koma: false, garis: false }, langkah: [] }, o);
    },
    pecahan(teks, jawab, o) {
      o = o || {};
      const s = Object.assign({ tipe: 'pecahan', teks, jawab: CP.naPecahan(jawab), izin: { minus: false, koma: true, garis: true }, langkah: [], sederhana: true }, o);
      if (s.sederhana && s.jawab.d !== 1) s.teks += ' Tulis dalam bentuk paling sederhana.';
      return s;
    },
    pilihan(teks, hasil, o) { // hasil = keluaran rakitPilihan
      return Object.assign({ tipe: 'pilihan', teks, pilihan: hasil.pilihan, benar: hasil.benar, kunci: hasil.kunci, nilai: hasil.nilai, langkah: [], izin: {} }, o || {});
    }
  };
  CP.st = (t, v) => (v === undefined ? { t } : { t, v });
  // item: {t, k, v}. benar + 3 salah berkunci beda
  CP.rakitPilihan = function (rng, benar, kandidatSalah) {
    const pakai = [benar];
    const kunci = new Set([benar.k]);
    for (const c of kandidatSalah) {
      if (pakai.length >= 4) break;
      if (kunci.has(c.k)) continue;
      kunci.add(c.k); pakai.push(c);
    }
    if (pakai.length < 4) throw new Error('opsi kurang dari 4');
    const urut = rng.kocok(pakai);
    return { pilihan: urut.map((x) => x.t), kunci: urut.map((x) => x.k), nilai: urut.map((x) => x.v), benar: urut.indexOf(benar) };
  };
  CP.NAMA = ['Ani', 'Budi', 'Citra', 'Dimas', 'Eka', 'Fajar', 'Gita', 'Hana', 'Indra', 'Joko', 'Kiki', 'Lala', 'Rina', 'Tono', 'Wulan', 'Yusuf', 'Sari', 'Bagas'];
  CP.dua = function (rng) {
    const a = rng.pilih(CP.NAMA);
    let b = rng.pilih(CP.NAMA);
    while (b === a) b = rng.pilih(CP.NAMA);
    return [a, b];
  };

  /* ===================== 7. REGISTRI MODUL ===================== */
  CP.REG = [];
  CP.peta = {};
  CP.daftar = function (m) {
    m.status = m.status || 'segera';
    CP.REG.push(m); CP.peta[m.id] = m;
    return m;
  };
  CP.aktifkan = function (id, def) {
    const m = CP.peta[id];
    if (!m) throw new Error('modul belum terdaftar: ' + id);
    Object.assign(m, def, { status: 'aktif' });
    if (!m.materiBelajar) m.materiBelajar = (CP.MATERI && CP.MATERI[id]) || null;
    const bangun = (level, p, konteks, jenisNama) => {
      const L = m.level[level - 1];
      const s = L.bangun(p, { konteks: konteks || 'umum', level });
      s.modul = id; s.level = level; s.konteks = konteks || 'umum'; s.param = p;
      if (!s.jenis) s.jenis = jenisNama || 'umum';
      if (!s.izin) s.izin = {};
      return s;
    };
    m.bangun = bangun;
    m.generator = function (level, konteks, rng, jenis, opsi) {
      if (m.status !== 'aktif') throw new Error('modul belum aktif: ' + id);
      level = Math.max(1, Math.min(m.level.length, level || 1));
      rng = rng || CP.rngUmum;
      const L = m.level[level - 1];
      let s;
      // jika diminta jenis tertentu (soal ulangan), coba sampai jenisnya cocok
      for (let i = 0; i < (jenis ? 80 : 1); i++) {
        const p = L.acak(rng, { konteks: konteks || 'umum', jenis, opsi: opsi || {}, level });
        s = bangun(level, p, konteks);
        if (!jenis || s.jenis === jenis) break;
      }
      return s;
    };
    m.langkahPenyelesaian = (s) => s.langkah || [];
    m.gambar = (s) => (s.gambar && CP.gambarSVG ? CP.gambarSVG(s.gambar) : '');
    const tipe = new Set(m.level.map((l) => l.tipe).filter(Boolean));
    m.jenisJawaban = tipe.size === 1 ? [...tipe][0] : 'campur';
    return m;
  };
  CP.lv = (judul, isi, tipe, acak, bangun) => ({ judul, isi, tipe, acak, bangun });
  CP.targetModul = function (m, level) {
    const t = m.target || CP.KONFIG.targetDetik[m.kategori === 'hitungCepat' ? 'hitungCepat' : 'sekolah'];
    return t[Math.max(0, Math.min(t.length - 1, level - 1))];
  };
  CP.modulUntukProfil = function (profil) {
    const sekolah = CP.REG.filter((m) => m.kategori !== 'hitungCepat' && m.kelas === profil.kelas && m.jenjang.indexOf(profil.jenjang) >= 0 && (m.kategori === 'umum' || (m.kategori === 'lanjut' && profil.tl)));
    return { sekolah, hitung: CP.REG.filter((m) => m.kategori === 'hitungCepat') };
  };

  /* ===================== 8. MESIN ADAPTIF ===================== */
  CP.catatBaru = () => ({ level: 1, riwayat: [], n: 0, b: 0, detik: 0, harian: {}, salah: [] });
  CP.evaluasiLevel = function (riwayat, level, target) {
    const l5 = riwayat.slice(-5);
    if (l5.length < 5) return { aksi: 'tetap', level };
    const benar = l5.filter((x) => x.b).length;
    const rata = l5.reduce((a, x) => a + x.w, 0) / 5;
    if (benar >= 4 && rata < target) return level < CP.KONFIG.levelMaks ? { aksi: 'naik', level: level + 1 } : { aksi: 'tetap', level };
    if (benar <= 2) return level > 1 ? { aksi: 'turun', level: level - 1 } : { aksi: 'tetap', level };
    return { aksi: 'tetap', level };
  };
  CP.tglLokal = function (d) {
    d = d || new Date();
    const p = (x) => (x < 10 ? '0' : '') + x;
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  const utcHari = (t) => { const [y, m, d] = t.split('-').map(Number); return Date.UTC(y, m - 1, d) / 86400000; };
  CP.selisihHari = (a, b) => Math.round(utcHari(b) - utcHari(a));
  CP.geserHari = function (t, n) {
    const d = new Date(utcHari(t) * 86400000 + n * 86400000);
    const p = (x) => (x < 10 ? '0' : '') + x;
    return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate());
  };
  // hari berturut-turut yang punya minimal 1 sesi selesai
  CP.hitungStreak = function (hariSesi, hariIni) {
    let t = hariIni;
    if (!hariSesi[t]) t = CP.geserHari(t, -1);
    let n = 0;
    while (hariSesi[t]) { n++; t = CP.geserHari(t, -1); }
    return n;
  };
  CP.catatJawaban = function (rec, hasil, tgl) {
    rec.riwayat.push({ b: !!hasil.benar, w: hasil.detik, j: hasil.jenis || '' });
    if (rec.riwayat.length > 10) rec.riwayat.shift();
    rec.n++; if (hasil.benar) rec.b++;
    rec.detik += hasil.detik;
    const h = rec.harian[tgl] || (rec.harian[tgl] = { n: 0, b: 0 });
    h.n++; if (hasil.benar) h.b++;
    const buang = Object.keys(rec.harian).filter((k) => CP.selisihHari(k, tgl) > 30);
    buang.forEach((k) => delete rec.harian[k]);
    const idx = rec.salah.findIndex((x) => x.jenis === hasil.jenis && x.level === hasil.level);
    if (!hasil.benar) {
      if (idx < 0) rec.salah.unshift({ jenis: hasil.jenis, level: hasil.level });
      if (rec.salah.length > 8) rec.salah.pop();
    } else if (hasil.ulangan && idx >= 0) rec.salah.splice(idx, 1);
  };
  CP.susunSesi = function (m, rec, rng, konteks, n, opsi) {
    n = n || CP.KONFIG.soalPerSesi;
    const nUlang = rec.salah.length ? Math.round(n * CP.KONFIG.persenUlangan) : 0;
    const daftar = [];
    const dipakai = new Set();
    const buat = (jenis, ulang) => {
      let s;
      for (let i = 0; i < 25; i++) {
        s = m.generator(rec.level, konteks, rng, jenis, opsi);
        if (!dipakai.has(s.teks)) break;
      }
      dipakai.add(s.teks); s.ulangan = !!ulang;
      return s;
    };
    for (let i = 0; i < nUlang; i++) daftar.push(buat(rec.salah[i % rec.salah.length].jenis, true));
    while (daftar.length < n) daftar.push(buat(undefined, false));
    return rng.kocok(daftar);
  };

  /* ===================== 9. PROFIL ===================== */
  CP.dataBaru = () => ({ versi: CP.KONFIG.versiData, aktif: null, profil: {}, ortu: { pin: null, laporan: {} } });
  CP.migrasi = function (d) {
    if (!d || typeof d !== 'object') return CP.dataBaru();
    if (!d.versi) d.versi = 1;
    d.profil = d.profil || {};
    d.ortu = d.ortu || { pin: null, laporan: {} };
    d.ortu.laporan = d.ortu.laporan || {};
    // versi berikutnya: tambahkan langkah migrasi di sini (if (d.versi < 2) {...; d.versi = 2;})
    return d;
  };
  CP.validasiUsername = (u) => /^[A-Za-z0-9_]{3,15}$/.test(u || '');
  CP.pilihanKelas = (jenjang) => CP.KONFIG.jenjang[jenjang].kelas;
  CP.bisaTL = (jenjang, kelas) => jenjang === 'SMA' && (kelas === 'XI' || kelas === 'XII');
  CP.buatProfil = function (data, o) {
    if (!CP.validasiUsername(o.username)) throw new Error('Username 3-15 karakter: huruf, angka, garis bawah.');
    if (data.profil[o.username]) throw new Error('Username sudah dipakai di HP ini.');
    if (!CP.KONFIG.jenjang[o.jenjang] || CP.KONFIG.jenjang[o.jenjang].kelas.indexOf(o.kelas) < 0) throw new Error('Jenjang dan kelas tidak cocok.');
    const pr = {
      username: o.username, jenjang: o.jenjang, kelas: o.kelas, tl: !!o.tl && CP.bisaTL(o.jenjang, o.kelas),
      dibuat: new Date().toISOString(), riwayatKelas: [], topik: {}, harian: {}, hariSesi: {}, sesi: [], terakhir: null
    };
    data.profil[o.username] = pr; data.aktif = o.username;
    return pr;
  };
  CP.kelasBerikut = function (pr) {
    if (pr.jenjang === 'SMP') { const i = ['VII', 'VIII', 'IX'].indexOf(pr.kelas); return i < 2 ? { jenjang: 'SMP', kelas: ['VIII', 'IX'][i] } : { pilihJenjang: ['SMA', 'SMK'], kelas: 'X' }; }
    const i = ['X', 'XI', 'XII'].indexOf(pr.kelas);
    return i < 2 ? { jenjang: pr.jenjang, kelas: ['XI', 'XII'][i] } : null;
  };
  CP.naikKelas = function (pr, jenjangBaru, tl) {
    const nx = CP.kelasBerikut(pr);
    if (!nx) throw new Error('Sudah di kelas tertinggi.');
    const jenjang = nx.jenjang || jenjangBaru;
    if (!jenjang) throw new Error('Pilih SMA atau SMK.');
    pr.riwayatKelas.push({ jenjang: pr.jenjang, kelas: pr.kelas, tl: pr.tl, sampai: CP.tglLokal() });
    pr.jenjang = jenjang; pr.kelas = nx.kelas; pr.tl = !!tl && CP.bisaTL(jenjang, nx.kelas);
    return pr; // pr.topik dipertahankan utuh
  };
  CP.konteksProfil = (pr) => (pr.jenjang === 'SMK' ? 'vokasi' : 'umum');
  CP.rekam = function (pr, m, rec) { pr.topik[m.id] = rec; };
  CP.catatSesi = function (pr, info, tgl) {
    pr.sesi.unshift(Object.assign({ tgl }, info));
    if (pr.sesi.length > 20) pr.sesi.pop();
    pr.hariSesi[tgl] = (pr.hariSesi[tgl] || 0) + 1;
    const h = pr.harian[tgl] || (pr.harian[tgl] = { n: 0, b: 0 });
    h.n += info.n; h.b += info.b;
    Object.keys(pr.harian).filter((k) => CP.selisihHari(k, tgl) > 60).forEach((k) => delete pr.harian[k]);
    Object.keys(pr.hariSesi).filter((k) => CP.selisihHari(k, tgl) > 400).forEach((k) => delete pr.hariSesi[k]);
    pr.terakhir = info.modul;
  };
  CP.akurasiTujuhHari = function (rec, hariIni) {
    let n = 0, b = 0;
    for (let i = 0; i < 7; i++) { const h = rec.harian[CP.geserHari(hariIni, -i)]; if (h) { n += h.n; b += h.b; } }
    return n ? { n, b, persen: Math.round((100 * b) / n) } : null;
  };
  CP.topikTerlemah = function (pr) {
    return Object.keys(pr.topik).map((id) => ({ id, rec: pr.topik[id] }))
      .filter((x) => x.rec.n >= 10)
      .map((x) => ({ id: x.id, n: x.rec.n, persen: Math.round((100 * x.rec.b) / x.rec.n) }))
      .sort((a, b) => a.persen - b.persen);
  };
  CP.grafikHarian = function (pr, hariIni, jumlah) {
    const out = [];
    for (let i = (jumlah || CP.KONFIG.hariGrafik) - 1; i >= 0; i--) {
      const t = CP.geserHari(hariIni, -i); const h = pr.harian[t] || { n: 0, b: 0 };
      out.push({ tgl: t, n: h.n, b: h.b, persen: h.n ? Math.round((100 * h.b) / h.n) : null });
    }
    return out;
  };

  /* ===================== 10. PENYIMPANAN ===================== */
  CP.Simpan = function (store) { this.store = store; this.mem = null; this.bermasalah = false; };
  CP.Simpan.prototype.muat = function () {
    try {
      const t = this.store && this.store.getItem(CP.KONFIG.kunciSimpan);
      if (t) { this.mem = CP.migrasi(JSON.parse(t)); return this.mem; }
    } catch (e) { this.bermasalah = true; }
    if (!this.mem) this.mem = CP.dataBaru();
    return this.mem;
  };
  CP.Simpan.prototype.simpan = function () {
    try { this.store.setItem(CP.KONFIG.kunciSimpan, JSON.stringify(this.mem)); this.bermasalah = false; } catch (e) { this.bermasalah = true; }
    return !this.bermasalah;
  };

  /* ===================== 11. LAPORAN ORANG TUA, CADANGAN ===================== */
  const bytes = (s) => encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  CP.b64e = (s) => G.btoa(bytes(s));
  CP.b64d = (b) => {
    const bin = G.atob(b);
    let o = '';
    for (let i = 0; i < bin.length; i++) o += '%' + ('0' + bin.charCodeAt(i).toString(16)).slice(-2);
    return decodeURIComponent(o);
  };
  CP.hashPin = function (pin) {
    let h = 2166136261;
    const s = 'cp:' + pin;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h.toString(16);
  };
  CP.buatLaporan = function (pr, hariIni) {
    let nW = 0, bW = 0;
    for (let i = 0; i < 7; i++) { const h = pr.harian[CP.geserHari(hariIni, -i)]; if (h) { nW += h.n; bW += h.b; } }
    let nA = 0, bA = 0;
    const tp = [];
    Object.keys(pr.topik).forEach((id) => {
      const r = pr.topik[id]; if (!r.n) return;
      nA += r.n; bA += r.b;
      tp.push([id, r.n, r.b, Math.round((r.detik / r.n) * 10) / 10, r.level]);
    });
    const akurasi = nW ? Math.round((100 * bW) / nW) : (nA ? Math.round((100 * bA) / nA) : 0);
    const lemah = CP.topikTerlemah(pr).filter((x) => x.persen < 80).slice(0, 3).map((x) => x.id);
    const ulang = CP.topikTerlemah(pr).filter((x) => x.persen < 70).map((x) => x.id);
    return { v: 1, u: pr.username, j: pr.jenjang, k: pr.kelas, tl: pr.tl ? 1 : 0, t: hariIni, s: CP.hitungStreak(pr.hariSesi, hariIni), m: nW, a: akurasi, tp, lm: lemah, ul: ulang };
  };
  CP.judulModul = (id) => (CP.peta[id] ? CP.peta[id].judul : id);
  CP.teksLaporan = function (lap) {
    const sk = lap.j + ' kelas ' + lap.k + (lap.tl ? ' (+ Tingkat Lanjut)' : '');
    const tlh = lap.lm.length ? lap.lm.map((id) => CP.judulModul(id)).join(', ') : 'belum ada (data belum cukup)';
    return [
      'Laporan ' + CP.KONFIG.nama + ': ' + lap.u,
      sk + ' | tanggal ' + lap.t,
      'Streak: ' + lap.s + ' hari',
      'Soal 7 hari terakhir: ' + lap.m,
      'Akurasi: ' + lap.a + '%',
      'Topik terlemah: ' + tlh,
      '',
      'Kode laporan (tempel di Mode Orang Tua):',
      'CP1:' + CP.b64e(JSON.stringify(lap))
    ].join('\n');
  };
  CP.bacaLaporan = function (teks) {
    const m = /CP1:([A-Za-z0-9+\/]+={0,2})/.exec(String(teks || ''));
    if (!m) return { galat: 'Kode laporan CP1: tidak ditemukan di teks yang ditempel.' };
    try {
      const o = JSON.parse(CP.b64d(m[1]));
      if (!o || o.v !== 1 || typeof o.u !== 'string' || !Array.isArray(o.tp)) return { galat: 'Kode laporan tidak valid.' };
      return { lap: o };
    } catch (e) { return { galat: 'Kode laporan rusak atau terpotong. Salin ulang seluruh pesan.' }; }
  };
  CP.terimaLaporan = function (data, lap, tglIni) {
    const lama = data.ortu.laporan[lap.u];
    data.ortu.laporan[lap.u] = { terbaru: lap, sebelumnya: lama ? lama.terbaru : null, diterima: tglIni };
    return data.ortu.laporan[lap.u];
  };
  CP.bandingLaporan = function (rec) {
    if (!rec.sebelumnya) return null;
    return { akurasi: rec.terbaru.a - rec.sebelumnya.a, soal: rec.terbaru.m - rec.sebelumnya.m, streak: rec.terbaru.s - rec.sebelumnya.s };
  };
  CP.setPin = (data, pin) => { if (!/^\d{4}$/.test(pin)) throw new Error('PIN harus 4 angka.'); data.ortu.pin = CP.hashPin(pin); };
  CP.cekPin = (data, pin) => !!data.ortu.pin && data.ortu.pin === CP.hashPin(pin);
  CP.buatCadangan = (data) => 'CPB1:' + CP.b64e(JSON.stringify(data));
  CP.pulihkan = function (teks) {
    const m = /CPB1:([A-Za-z0-9+\/]+={0,2})/.exec(String(teks || ''));
    if (!m) return { galat: 'Kode cadangan CPB1: tidak ditemukan.' };
    try {
      const o = JSON.parse(CP.b64d(m[1]));
      if (!o || typeof o !== 'object' || typeof o.profil !== 'object') return { galat: 'Kode cadangan tidak valid.' };
      return { data: CP.migrasi(o) };
    } catch (e) { return { galat: 'Kode cadangan rusak atau terpotong.' }; }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = CP;
})(typeof globalThis !== 'undefined' ? globalThis : this);
