/*const CACHE_NAME = 'staticCache-v2';
const urlsToCache = [
    // Add more static assets to cache here
];

//  self.addEventListener('install', event => {
//     self.skipWaiting();  // Activate the service worker immediately after install
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(cache => {
//                 console.log('Opened cache');
//                 return Promise.all(
//                     urlsToCache.map(url => {
//                         return cache.add(url).catch(error => {
//                             console.error('Failed to cache:', url, error);
//                         });
//                     })
//                 );
//             })
//     );
// });

self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.delete(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())  // Take control of all clients immediately
    );
});*/
