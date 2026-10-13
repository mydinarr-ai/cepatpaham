/* Server lokal sederhana untuk mencoba aplikasi: node serve.js (lalu buka http://localhost:5173) */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const TIPE = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.css': 'text/css' };
const port = process.env.PORT || 5173;
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(__dirname, p);
  if (!f.startsWith(__dirname) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('tidak ada'); }
  res.writeHead(200, { 'Content-Type': TIPE[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log('CepatPaham: http://localhost:' + port));
