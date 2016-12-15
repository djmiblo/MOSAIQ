var cacheName = 'mosaiq-0.1';
var filesToCache = [
  '/static/media/Loading.54def7c4.gif',
  '/static/media/CancelIcon.5826d099.png',
  '/static/media/glyphicons-halflings-regular.448c34a5.woff2',
  '/static/media/glyphicons-halflings-regular.89889688.svg',
  '/static/media/glyphicons-halflings-regular.e18bbf61.ttf',
  '/static/media/glyphicons-halflings-regular.f4769f9b.eot',
  '/static/media/glyphicons-halflings-regular.fa2777232.woff',
  '/static/media/NewFont.594aafb4.gif',
  '/static/media/texture.22e22a1e.jpg',
]

self.addEventListener('install', function(e) {
  console.log('[SeviceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  )
})
