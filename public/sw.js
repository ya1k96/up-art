const CACHE_NAME = 'v1_cache_yamArt',
urlCache = [
    '/',
    '/css/bootstrap.min.css',
    '/css/style.css',
    '/css/dataTables.min.css',
    '/css/animate.min.css',
    '/css/style.css',
    '/js/jquery.js',
    '/js/todo-list.js',
    '/js/ejs.js',
    '/js/bootstrap.min.js',
    '/js/dataTables.min.js',
    '/js/fontawesome.js',
    '/js/moment.js',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlCache)
            .then(() => self.skipWaiting())
            .catch(err => console.log(err))
        })
    )
});

self.addEventListener('activate', e => {
    const cacheWhiteList = [CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            cacheNames.map(cacheName => {
                if(cacheWhiteList.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            })
        })
        .then(() => self.clients.claim())
    )
    
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then( res => {
            if(res) {
                return res;
            }
            var misCabeceras = new Headers();
            const conf = { method: 'GET',
            headers: misCabeceras,
            mode: 'cors',
            cache: 'default' };

            return fetch(e.request, conf);
        })
    )
});