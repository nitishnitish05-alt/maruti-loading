importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
const CACHE="maruti-v1";
self.addEventListener("message",(e)=>{if(e.data&&e.data.type==="SKIP_WAITING")self.skipWaiting();});
self.addEventListener('install',async(e)=>{e.waitUntil(caches.open(CACHE).then(c=>c.add('index.html')));});
if(workbox.navigationPreload.isSupported())workbox.navigationPreload.enable();
self.addEventListener('fetch',(e)=>{if(e.request.mode==='navigate'){e.respondWith((async()=>{try{const p=await e.preloadResponse;if(p)return p;return await fetch(e.request);}catch(err){const c=await caches.open(CACHE);return await c.match('index.html');}})());}});
