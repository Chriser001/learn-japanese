const CACHE_NAME = 'japanese-learning-cache-v1';
const DICTIONARY_CACHE = 'dictionary-cache-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/phonetic.html',
    '/dictation.html',
    '/uaw.html',
    '/css/phonetic.css',
    '/css/dictation.css',
    '/css/uaw.css',
    '/js/phonetic.js',
    '/js/dictation.js',
    '/js/uaw.js',
    '/js/kuromoji.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // 处理词典文件请求
    if (url.pathname.includes('/dict/')) {
        event.respondWith(
            caches.open(DICTIONARY_CACHE)
                .then(cache => cache.match(event.request))
                .then(response => {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request)
                        .then(response => {
                            if (response.ok) {
                                const clonedResponse = response.clone();
                                caches.open(DICTIONARY_CACHE)
                                    .then(cache => cache.put(event.request, clonedResponse));
                                return response;
                            }
                            
                            // 如果本地请求失败，尝试从 CDN 获取
                            const cdnUrl = event.request.url.replace(
                                /\/dict\//,
                                'https://cdn.jsdelivr.net/gh/takuyaa/kuromoji.js@master/dict/'
                            );
                            return fetch(cdnUrl)
                                .then(cdnResponse => {
                                    if (cdnResponse.ok) {
                                        const clonedResponse = cdnResponse.clone();
                                        caches.open(DICTIONARY_CACHE)
                                            .then(cache => cache.put(event.request, clonedResponse));
                                        return cdnResponse;
                                    }
                                    throw new Error('Failed to fetch dictionary');
                                });
                        });
                })
        );
        return;
    }

    // 处理其他资源请求
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== DICTIONARY_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});