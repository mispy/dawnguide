

const initialize = (self: ServiceWorkerGlobalScope): void => {
    self.addEventListener('fetch', event => {
        console.log(event)
        if (event.request.mode !== 'navigate') {
            // Not a page navigation, bail.
            return;
        }
        event.respondWith(
            fetch(event.request)
            // .catch(() => {
            //     return caches.open(CACHE_NAME)
            //         .then((cache) => {
            //             return cache.match('offline.html');
            //         });
            // })
        );
    })
}

initialize(self as any)