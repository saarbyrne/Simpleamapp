// Service Worker for caching static assets.
// Important: never use cache-first for HTML documents, otherwise old pages can
// reference deleted Next.js chunk names (ChunkLoadError).
const STATIC_CACHE = 'simpleam-static-v1.1'
const DYNAMIC_CACHE = 'simpleam-dynamic-v1.1'

const STATIC_ASSETS = ['/', '/favicon.ico']
const isLocalhost = ['localhost', '127.0.0.1'].includes(self.location.hostname)

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      if (isLocalhost) {
        await self.skipWaiting()
        return
      }

      const cache = await caches.open(STATIC_CACHE)
      await Promise.allSettled(
        STATIC_ASSETS.map((url) => cache.add(url))
      )
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))

      if (isLocalhost) {
        await self.registration.unregister()
        return
      }

      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('/_next/static/') ||
    event.request.url.includes('chrome-extension://')
  ) {
    return
  }

  // Always go network-first for document requests to avoid stale HTML/chunk manifests.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response

      return fetch(event.request).then((fetchResponse) => {
        if (!fetchResponse.ok) return fetchResponse
        const responseClone = fetchResponse.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return fetchResponse
      })
    })
  )
})
