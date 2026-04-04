importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
const CACHE="maruti-v4";
const OLD_CACHES=["maruti-v1","maruti-v2","maruti-v3"];
self.addEventListener("message",(e)=>{if(e.data&&e.data.type==="SKIP_WAITING")self.skipWaiting();});
self.addEventListener('install',async(e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.add('index.html')));
  self.skipWaiting();
});
self.addEventListener('activate',(e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>OLD_CACHES.includes(k)).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});
if(workbox.navigationPreload.isSupported())workbox.navigationPreload.enable();
self.addEventListener('fetch',(e)=>{
  if(e.request.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        // Always try network first for navigation — ensures latest version
        const resp=await fetch(e.request);
        const cache=await caches.open(CACHE);
        cache.put(e.request,resp.clone());
        return resp;
      }catch(err){
        const c=await caches.open(CACHE);
        return await c.match('index.html');
      }
    })());
  }
});
