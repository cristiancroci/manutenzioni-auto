self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => clients.claim());

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match("index.html")));
});