const version="v3";function fetch_request(e){return caches.match(e).then((t=>void 0!==t?t:fetch(e.clone()).then((t=>{if(200!==t.status||"basic"!==t.type)throw new Error("bad request");return caches.open("v3").then((s=>s.put(e,t.clone()))).then((()=>t))}))))}self.addEventListener("install",(function(e){console.log("install v3"),self.skipWaiting(),e.waitUntil(caches.open("v3").then((e=>{e.addAll(["/4500-2021-spring/","/4500-2021-spring/dynamic/r_test_1.js","/4500-2021-spring/sfx/click.mp3","/4500-2021-spring/static/index.js","/4500-2021-spring/static/core.js","/4500-2021-spring/static/utils.js","/4500-2021-spring/static/c_sound.js","/4500-2021-spring/manifest.webmanifest"])})))})),self.addEventListener("activate",(e=>{console.log("activate v3"),e.waitUntil(clients.claim()),e.waitUntil(caches.keys().then((e=>Promise.all(e.map((e=>{if("v3"!==e)return caches.delete(e)}))))))})),self.addEventListener("fetch",(function(e){"GET"===e.request.method&&e.respondWith(fetch_request(e.request))}));