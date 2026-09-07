const CACHE_NAME = 'pwa-jknps-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// 1. INSTALL: Menyimpan fail asas ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Fail-fail asas PWA berjaya disimpan (cached)');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ACTIVATE: Membersihkan cache lama jika ada versi baharu
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Membuang cache PWA lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH: Menyediakan data dari cache (jika tiada rangkaian), atau tarik dari internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Pulangkan respons cache jika wujud, jika tidak teruskan permintaan rangkaian
        return response || fetch(event.request);
      })
  );
});
