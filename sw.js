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
    } catch (e) {
      console.error("Errore nel leggere:", file);
    }
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return "manutenzioni-auto-" + hashHex.substring(0, 12);
}

let CACHE_NAME = "manutenzioni-auto-default";

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
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          return response;
        })
      );
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
