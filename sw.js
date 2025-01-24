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
    if (url.href.includes('kuromoji.js@master/dict/') || url.pathname.startsWith('/dict/')) {
        event.respondWith(
            caches.match(event.request)
                .then(async response => {
                    if (response) {
                        return response;
                    }
                    try {
                        const fetchResponse = await fetch(event.request);
                        // 处理 301 跳转
                        if (fetchResponse.redirected) {
                            const finalResponse = await fetch(fetchResponse.url);
                            if (!finalResponse.ok) {
                                throw new Error(`HTTP error! status: ${finalResponse.status}`);
                            }
                            const responseToCache = finalResponse.clone();
                            const cache = await caches.open(DICTIONARY_CACHE);
                            // 同时缓存原始请求和重定向后的请求
                            await Promise.all([
                                cache.put(event.request, responseToCache.clone()),
                                cache.put(new Request(fetchResponse.url), responseToCache)
                            ]);
                            return finalResponse;
                        }
                        if (!fetchResponse.ok) {
                            throw new Error(`HTTP error! status: ${fetchResponse.status}`);
                        }
                        const responseToCache = fetchResponse.clone();
                        const cache = await caches.open(DICTIONARY_CACHE);
                        await cache.put(event.request, responseToCache);
                        return fetchResponse;
                    } catch (error) {
                        console.error('Fetching dictionary file failed:', error);
                        // 尝试从缓存中获取其他版本
                        const cache = await caches.open(DICTIONARY_CACHE);
                        const cachedFiles = await cache.keys();
                        // 同时检查原始路径和 CDN 路径
                        const matchingFile = cachedFiles.find(req => {
                            const reqUrl = new URL(req.url);
                            const fileName = url.pathname.split('/').pop();
                            return reqUrl.pathname.endsWith(fileName) || 
                                   req.url.includes(`kuromoji.js@master/dict/${fileName}`);
                        });
                        if (matchingFile) {
                            return cache.match(matchingFile);
                        }
                        throw error;
                    }
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