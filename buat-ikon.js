/* Membuat ikon PNG aplikasi (192, 512, maskable, apple-touch) dari desain logo yang sama dengan ikon.svg.
   Jalankan: node buat-ikon.js */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const NAVY = [16, 27, 60], EMAS = [245, 179, 1], HIJAU = [34, 197, 94], PUTIH = [255, 255, 255];
const BOLT = [[40, 4], [16, 36], [30, 36], [24, 60], [50, 26], [35, 26]];
const CEK = [[42, 46], [47, 51], [55, 41]];

function dalamPoligon(x, y, p) {
  let d = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if ((p[i][1] > y) !== (p[j][1] > y) && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) d = !d;
  }
  return d;
}
function jarakSegmen(x, y, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  let t = ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy));
}
function dalamRoundRect(x, y, r) {
  if (x < 0 || y < 0 || x > 64 || y > 64) return false;
  const cx = Math.min(Math.max(x, r), 64 - r), cy = Math.min(Math.max(y, r), 64 - r);
  return Math.hypot(x - cx, y - cy) <= r;
}
// warna di titik (x,y) dalam koordinat 64x64; skala = pengecilan isi (untuk maskable)
function warna(x, y, penuh, skala) {
  if (penuh) { /* latar penuh */ } else if (!dalamRoundRect(x, y, 14)) return null;
  let c = NAVY;
  const u = (x - 32) / skala + 32, v = (y - 32) / skala + 32;
  if (dalamPoligon(u, v, BOLT)) c = EMAS;
  if (Math.hypot(u - 48, v - 46) <= 11) c = HIJAU;
  if (Math.hypot(u - 48, v - 46) <= 11 && (jarakSegmen(u, v, CEK[0], CEK[1]) <= 1.9 || jarakSegmen(u, v, CEK[1], CEK[2]) <= 1.9)) c = PUTIH;
  return c;
}
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function potong(tipe, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(tipe), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(ukuran, penuh, skala) {
  const SS = 4; const raw = Buffer.alloc((ukuran * 4 + 1) * ukuran);
  for (let py = 0; py < ukuran; py++) {
    raw[py * (ukuran * 4 + 1)] = 0;
    for (let px = 0; px < ukuran; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const x = ((px + (sx + 0.5) / SS) / ukuran) * 64, y = ((py + (sy + 0.5) / SS) / ukuran) * 64;
        const c = warna(x, y, penuh, skala);
        if (c) { r += c[0]; g += c[1]; b += c[2]; a += 255; }
      }
      const n = SS * SS, o = py * (ukuran * 4 + 1) + 1 + px * 4;
      const cnt = a / 255;
      raw[o] = cnt ? Math.round(r / cnt) : 0; raw[o + 1] = cnt ? Math.round(g / cnt) : 0; raw[o + 2] = cnt ? Math.round(b / cnt) : 0; raw[o + 3] = Math.round(a / n);
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(ukuran, 0); ihdr.writeUInt32BE(ukuran, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), potong('IHDR', ihdr), potong('IDAT', zlib.deflateSync(raw, { level: 9 })), potong('IEND', Buffer.alloc(0))]);
}
const out = path.join(__dirname, 'ikon');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'ikon-192.png'), png(192, false, 1));
fs.writeFileSync(path.join(out, 'ikon-512.png'), png(512, false, 1));
fs.writeFileSync(path.join(out, 'ikon-maskable-512.png'), png(512, true, 0.74));
fs.writeFileSync(path.join(out, 'apple-touch-180.png'), png(180, true, 0.86));
console.log('Ikon dibuat di ' + out);
