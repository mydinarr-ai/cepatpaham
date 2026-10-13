/* CepatPaham - penggambar SVG umum (bangun datar, segitiga, diagram, grafik) dibuat dari data soal.
   Spesifikasi gambar: {tipe:'gambar', alt, lebar, tinggi, el:[...]}.
   Elemen: {k:'r',x,y,w,h,c} {k:'p',pts,c} {k:'l',x1,y1,x2,y2,c} {k:'t',x,y,t,a,c} {k:'o',x,y,r,c} {k:'d',d,c}
   c = isi | isi2 | isi3 | kosong | garis | tipis | putus | merah | titik | teks | kecil | tebal */
(function (G) {
  'use strict';
  const CP = G.CP;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const n1 = (x) => (Math.round(x * 10) / 10).toString();

  const lamaBar = CP.gambarSVG;
  CP.gambarSVG = function (g) {
    if (g && g.tipe === 'gambar') return CP.gambarUmum(g);
    return lamaBar ? lamaBar(g) : '';
  };
  CP.gambarUmum = function (g) {
    const o = g.el.map((e) => {
      const c = ' class="g-' + (e.c || 'garis') + '"';
      if (e.k === 'r') return '<rect x="' + n1(e.x) + '" y="' + n1(e.y) + '" width="' + n1(e.w) + '" height="' + n1(e.h) + '"' + c + '/>';
      if (e.k === 'p') return '<polygon points="' + e.pts.map((p) => n1(p[0]) + ',' + n1(p[1])).join(' ') + '"' + c + '/>';
      if (e.k === 'l') return '<line x1="' + n1(e.x1) + '" y1="' + n1(e.y1) + '" x2="' + n1(e.x2) + '" y2="' + n1(e.y2) + '"' + c + '/>';
      if (e.k === 'o') return '<circle cx="' + n1(e.x) + '" cy="' + n1(e.y) + '" r="' + n1(e.r) + '"' + c + '/>';
      if (e.k === 'd') return '<path d="' + e.d + '"' + c + '/>';
      return '<text x="' + n1(e.x) + '" y="' + n1(e.y) + '" text-anchor="' + (e.a || 'middle') + '"' + (e.c ? c : ' class="g-teks"') + '>' + esc(e.t) + '</text>';
    }).join('');
    return '<svg viewBox="0 0 ' + (g.lebar || 320) + ' ' + g.tinggi + '" class="gambar-bar" role="img" aria-label="' + esc(g.alt || 'Gambar soal') + '" xmlns="http://www.w3.org/2000/svg">' + o + '</svg>';
  };

  /* ---------- pembantu penyusun gambar ---------- */
  const H = {};
  H.t = (x, y, t, a, c) => ({ k: 't', x, y, t: String(t), a: a || 'middle', c });
  H.l = (x1, y1, x2, y2, c) => ({ k: 'l', x1, y1, x2, y2, c: c || 'garis' });
  H.p = (pts, c) => ({ k: 'p', pts, c: c || 'isi' });
  H.r = (x, y, w, h, c) => ({ k: 'r', x, y, w, h, c: c || 'isi' });
  H.o = (x, y, r, c) => ({ k: 'o', x, y, r, c: c || 'titik' });
  H.d = (d, c) => ({ k: 'd', d, c: c || 'garis' });

  // persegi panjang berlabel (lebar di atas, tinggi di kanan) dalam kotak maksimum
  H.persegiPanjang = function (x, y, maks, w, h, lw, lh, c) {
    const s = maks / Math.max(w, h), pw = w * s, ph = h * s;
    return [H.r(x, y, pw, ph, c || 'isi'), H.t(x + pw / 2, y - 6, lw, 'middle', 'tebal'), H.t(x + pw + 6, y + ph / 2 + 4, lh, 'start', 'tebal')];
  };
  // segitiga dari tiga sisi (a=BC, b=CA, c=AB), alas AB horizontal; kembalikan titik terskala
  H.titikSegitiga = function (a, b, c, x0, y0, maks) {
    const cx = (b * b + c * c - a * a) / (2 * c), cy = Math.sqrt(Math.max(0, b * b - cx * cx));
    const s = maks / Math.max(c, cy, Math.abs(cx), c - cx);
    const A = [x0, y0], B = [x0 + c * s, y0], C = [x0 + cx * s, y0 - cy * s];
    return { A, B, C, s };
  };
  H.segitigaBerlabel = function (a, b, c, x0, y0, maks, la, lb, lc, warna) {
    const { A, B, C } = H.titikSegitiga(a, b, c, x0, y0, maks);
    const mid = (P, Q, dx, dy) => [(P[0] + Q[0]) / 2 + dx, (P[1] + Q[1]) / 2 + dy];
    const ma = mid(B, C, 12, 0), mb = mid(A, C, -12, 0), mc = mid(A, B, 0, 16);
    return { el: [H.p([A, B, C], warna || 'isi'), H.t(ma[0], ma[1] + 4, la, 'start', 'tebal'), H.t(mb[0], mb[1] + 4, lb, 'end', 'tebal'), H.t(mc[0], mc[1], lc, 'middle', 'tebal')], A, B, C };
  };
  CP.H = H;
})(typeof globalThis !== 'undefined' ? globalThis : this);
