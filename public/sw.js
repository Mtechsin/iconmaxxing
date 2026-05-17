// Bump this version string whenever you deploy — old caches are purged automatically.
const CACHE_VERSION = "v1";
const CACHE_NAME = `iconizer-${CACHE_VERSION}`;

// Assets to pre-cache on install (adjust paths to match your build output).
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/mocks/pixel10.png",
  "/mocks/iphone17.png",
];

// ── Install: pre-cache shell assets ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  // Skip waiting so the new SW activates immediately without a hard reload.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// ── Activate: delete stale caches from previous versions ─────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first for navigation + JS/CSS, cache-first for images ─────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests.
  if (url.origin !== self.location.origin || request.method !== "GET") return;

  // Network-first for HTML pages and Next.js JS/CSS chunks so updates are
  // always picked up without a hard reload.
  if (
    request.mode === "navigate" ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for everything else (icons, manifest, static assets).
  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}
