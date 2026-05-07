async function generateCacheName() {
  const files = [
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
  ];

  let content = "";
  for (const file of files) {
    try {
      const response = await fetch(file + "?v=" + Date.now());
      const text = await response.text();
      content += text;
    } catch (e) {}
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return "cache-" + hashHex.substring(0, 12);
}

let CACHE_NAME = "cache-default";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      CACHE_NAME = await generateCacheName();
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
