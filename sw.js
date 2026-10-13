/* CepatPaham - service worker. Naikkan nomor versi CACHE setiap kali ada pembaruan aplikasi. */
const CACHE = 'cepatpaham-v1.0.0';
const ASET = [
  './', './index.html', './manifest.json',
  './ikon/ikon.svg', './ikon/ikon-192.png', './ikon/ikon-512.png', './ikon/ikon-maskable-512.png', './ikon/apple-touch-180.png',
  './js/inti.js', './js/peta.js', './js/materi.js', './js/sekolah.js', './js/hitung.js', './js/cerita.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => Promise.all(ASET.map((u) => fetch(new Request(u, { cache: 'reload' })).then((r) => { if (!r.ok) throw new Error(u); return c.put(u, r); }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k.indexOf('cepatpaham-') === 0 && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok) { const salin = res.clone(); caches.open(CACHE).then((c) => c.put(req, salin)); }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    })
  );
});

self.addEventListener('message', (e) => { if (e.data === 'lewati') self.skipWaiting(); });
