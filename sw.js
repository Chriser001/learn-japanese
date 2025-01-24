const CACHE_NAME = 'japanese-learning-cache-v1';
const DICTIONARY_CACHE = 'dictionary-cache-v1';

// 词典文件列表
const dictionaryFiles = [
    'base.dat.gz',
    'cc.dat.gz',
    'check.dat.gz',
    'tid.dat.gz',
    'tid_map.dat.gz',
    'tid_pos.dat.gz',
    'unk.dat.gz',
    'unk_char.dat.gz',
    'unk_compat.dat.gz',
    'unk_invoke.dat.gz',
    'unk_map.dat.gz',
    'unk_pos.dat.gz'
];

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

    // 处理 chrome-extension 请求
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // 处理词典文件请求
    if (url.href.includes('kuromoji.js@master/dict/')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request)
                        .then(response => {
                            // 处理 301 跳转
                            if (response.redirected) {
                                return fetch(response.url).then(finalResponse => {
                                    const responseToCache = finalResponse.clone();
                                    caches.open(DICTIONARY_CACHE)
                                        .then(cache => {
                                            cache.put(event.request, responseToCache);
                                        });
                                    return finalResponse;
                                });
                            }
                            const responseToCache = response.clone();
                            caches.open(DICTIONARY_CACHE)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        });
                })
        );
        return;
    }

    // 处理其他资源请求
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