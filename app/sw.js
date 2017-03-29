self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open('airhorner').then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/styles/main.css`,
        `/scripts/main.min.js`,
        `/sounds/airhorn.mp3`
      ])
      .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
