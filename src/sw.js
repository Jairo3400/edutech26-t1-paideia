const CACHE_NAME = "paideIA-v2";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./apiMock.js"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});