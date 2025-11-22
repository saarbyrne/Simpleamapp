// Service Worker for caching static assets
const CACHE_NAME = 'simpleam-v1.0'
const STATIC_CACHE = 'simpleam-static-v1.0'
const DYNAMIC_CACHE = 'simpleam-dynamic-v1.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  // Add critical CSS/JS files here when known
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return

  // Skip API calls and dynamic routes
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('/_next/static/') ||
      event.request.url.includes('chrome-extension://')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }

        // Otherwise fetch and cache
        return fetch(event.request)
          .then((fetchResponse) => {
            // Don't cache non-successful responses
            if (!fetchResponse.ok) {
              return fetchResponse
            }

            // Clone the response for caching
            const responseClone = fetchResponse.clone()

            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseClone)
              })

            return fetchResponse
          })
          .catch(() => {
            // Return offline fallback if available
            return caches.match('/offline.html')
          })
      })
  )
})
