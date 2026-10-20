/* AVIA ProfessorZão — cache exclusivo do PWA. */
const VERSION='profess-orzao-pwa-20261020-a';
const ROOT=self.registration.scope;
const shell=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'].map(path=>new URL(path,ROOT).href);
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(shell)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('profess-orzao-pwa-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;
 const u=new URL(req.url);
 if(u.origin!==self.location.origin||!u.href.startsWith(ROOT))return;
 if(req.mode==='navigate'){
   e.respondWith(fetch(req).then(resp=>{if(resp.ok){const clone=resp.clone();e.waitUntil(caches.open(VERSION).then(c=>c.put(new URL('./index.html',ROOT).href,clone)));}return resp;}).catch(async()=>await caches.match(new URL('./index.html',ROOT).href)||await caches.match(new URL('./',ROOT).href)||Response.error()));
 }else if(/\.(png|webmanifest)$/.test(u.pathname)){
   e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(resp=>{if(resp.ok){const clone=resp.clone();e.waitUntil(caches.open(VERSION).then(c=>c.put(req,clone)));}return resp;})));
 }
});
