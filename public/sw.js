// Required for PWA installability - Chrome needs a fetch handler present
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'New Ride Request', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'New Ride Request';
  const options = {
    body: data.body || 'A passenger needs a ride.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { url: data.url || '/dashboard' },
    requireInteraction: true,
    tag: 'ride-request',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
