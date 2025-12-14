
const CACHE_NAME = "gokuls-world-v8"; // ⬅️ bumped version

const CORE_ASSETS = [
    "/",
    "/manifest.json",
    "/_offline",
];

// ✅ INSTALL
self.addEventListener("install", (event) => {
    console.log("[SW] Install");

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(
                CORE_ASSETS.map((url) =>
                    cache.add(url).catch(() => { })
                )
            )
        )
    );
});

// ✅ ACTIVATE
self.addEventListener("activate", (event) => {
    console.log("[SW] Activate");

    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => key !== CACHE_NAME && caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

// ✅ FETCH
self.addEventListener("fetch", (event) => {
    const request = event.request;

    /* --------------------------------------------------
       🚨 ABSOLUTE BYPASS FOR ACCEPT-INVITE (EMAIL CLICKS)
       IMPORTANT: do NOTHING, let browser handle it
    -------------------------------------------------- */
    if (
        request.mode === "navigate" &&
        request.url.includes("/accept-invite")
    ) {
        return;
    }

    // ✅ Always allow Next.js static assets
    if (
        request.url.includes("/_next/static/") ||
        request.url.includes("/icons/") ||
        request.url.endsWith(".css") ||
        request.url.endsWith(".js") ||
        request.url.endsWith(".png") ||
        request.url.endsWith(".jpg") ||
        request.url.endsWith(".jpeg") ||
        request.url.endsWith(".svg") ||
        request.url.endsWith(".webp")
    ) {
        event.respondWith(fetch(request));
        return;
    }

    // ✅ PAGE NAVIGATION (dashboard, register, etc.)
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match("/_offline").then((res) => {
                    return res || new Response("Offline", { status: 200 });
                });
            })
        );
        return;
    }

    // ✅ DEFAULT FALLBACK
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request).then((res) => {
                return res || new Response("Offline", { status: 200 });
            });
        })
    );
});
