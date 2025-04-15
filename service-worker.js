const CACHE_NAME = "my-app-cache-v3"; // Versionsnummer erhöht für Aktualisierung
const OFFLINE_URL = "/ekbuebe/index.html"; // Offline-Seite angepasst

const FILES_TO_CACHE = [
    "/ekbuebe/",                // Root-Verzeichnis der App
    "/ekbuebe/index.html",      // Startseite
    "/ekbuebe/manifest.json",   // Manifest für PWA
    "/ekbuebe/script.js",       // Deine JavaScript-Datei
    "/ekbuebe/styles.css",      // Deine CSS-Datei
    "/ekbuebe/icons/icon-192x192.png", // Icon für Android/Chrome
    "/ekbuebe/icons/icon-512x512.png", // Größeres Icon
    "/ekbuebe/icons/apple-icon-120.png", // iOS-spezifisches Icon
    "/ekbuebe/icons/apple-icon-152.png", // iOS-spezifisches Icon
    "/ekbuebe/icons/apple-icon-180.png"  // iOS-spezifisches Icon
];

// Installations-Ereignis: Cache initial befüllen
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Fetch-Ereignis: Dateien aus dem Cache abrufen, wenn offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match(OFFLINE_URL));
        })
    );
});

// Aktivierungs-Ereignis: Alte Caches löschen
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});