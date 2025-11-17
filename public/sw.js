self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  self.registration.showNotification(data.title || 'Notificação Dogão', {
    body: data.body || '',
    icon: '/icon-192x192.png', // ajuste path/icone
    vibrate: [100, 50, 200],
    requireInteraction: true,
    data,
  });
});
