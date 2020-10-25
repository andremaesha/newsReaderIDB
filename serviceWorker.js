let CACHE_NAME = "FirstPWA-6";
const urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/pages/home.html",
    "/pages/contact.html",
    "/pages/about.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/registerServiceWorker.js",
    "/icon.png",
    "/Photo/andre.jpg",
    "/js/api.js",
    "/article.html",
    "/manifest.json"
];

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            return cache.addAll(urlsToCache);
        })
    )
});
self.addEventListener("activate", function(event){
    event.waitUntil(
        caches.keys()
        .then(function(cacheName){
            return Promise.all(
                cacheName.map(function(cacheName){
                    if (cacheName !== CACHE_NAME){
                        console.log(`ServiceWorker: Cache ${cacheName} delete`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener("fetch", function(event){
    let base_url = "https://aqueous-woodland-96253.herokuapp.com/";
    const online = self.navigator.onLine

    if (event.request.url.indexOf(base_url) > -1 && online){
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    cache.put(event.request.url, response.clone());
                    
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {ignoreSearch: true}).then(response => {
                return response || fetch(event.request);
            })
        )
    }
});