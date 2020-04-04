

// const CACHE_NAME = 'static-cache-v3';

// const FILES_TO_CACHE = [
//     '/',
//     '/favicon.ico',
//     '/manifest.webmanifest',
//     '/site.css',
//     '/dawnguide-background.jpg',
//     '/app.css',
//     '/app.js'
// ]

// const initialize = (self: ServiceWorkerGlobalScope): void => {
//     self.addEventListener('install', event => {
//         console.log('[ServiceWorker] Install');
//         event.waitUntil(
//             caches.open(CACHE_NAME).then((cache) => {
//                 console.log('[ServiceWorker] Pre-caching offline page');
//                 return cache.addAll(FILES_TO_CACHE);
//             })
//         )
//     });

//     self.addEventListener('activate', (evt) => {
//         console.log('[ServiceWorker] Activate');
//         // CODELAB: Remove previous cached data from disk.
//         caches.keys().then((keyList) => {
//             return Promise.all(keyList.map((key) => {
//                 if (key !== CACHE_NAME) {
//                     console.log('[ServiceWorker] Removing old cache', key);
//                     return caches.delete(key);
//                 }
//             }));
//         })

//         self.clients.claim();
//     });

//     async function eventResponse(event: FetchEvent) {
//         const cache = await caches.open(CACHE_NAME)
//         const cachedRes = await cache.match(event.request)
//         if (cachedRes)
//             return cachedRes
//         else
//             return fetch(event.request)
//     }

//     self.addEventListener('fetch', event => {
//         // if (event.request.mode !== 'navigate') {
//         //     // Not a page navigation, bail.
//         //     return;
//         // }

//         event.respondWith(eventResponse(event))
//     })
// }

// initialize(self as any)