const CACHE_NAME = 'davao-weather-v1';
const RUNTIME_CACHE = 'davao-weather-runtime';

// Files to cache on install
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For API requests (Supabase, Google Maps), use network first
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('openstreetmap.org')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, you could return cached data or error page
          return new Response('Offline - API unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // For app shell and assets, use cache first, fall back to network
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME_CACHE).then((cache) => {
          return fetch(event.request).then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
      .catch(() => {
        // If both cache and network fail, return offline page
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
