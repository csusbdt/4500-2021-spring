export function message(...e){g_bg.style.display="none",g_fg.style.display="none",g_message_div.style.display="block",e.forEach((e=>{g_message_div.innerHTML+="<br>"+e}))}export function register_service_worker(){return"serviceWorker"in navigator?navigator.serviceWorker.register("/4500-2021-spring/sw.js").then((e=>{e.addEventListener("updatefound",(n=>{e.installing.addEventListener("statechange",(e=>{"activated"===e.target.state&&window.location.reload()}))}))})):Promise.resolve()}export function load_script(e){return new Promise((function(n,t){const r=document.createElement("script");r.type="module",r.src=e,r.onload=()=>{n(r)},r.onerror=()=>{t(`${e} failed to load`)},document.head.append(r)}))}export function load_image(e){return fetch(e).then((e=>e.blob())).then((function(e){return new Promise(((n,t)=>{const r=new Image;return r.onload=e=>{URL.revokeObjectURL(r.src),n(r)},r.onerror=e=>{t(e)},r.src=URL.createObjectURL(e),r}))}))}export function load_json(e){return fetch(e).then((e=>e.json()))}export function unload_image(e){}export function remove(e,n){const t=e.indexOf(n);e.splice(t,1)}export function insert(e,n){for(let t=e.length;t>0;--t)if(e[t-1].order<=n.order)return void e.splice(t,0,n);e.unshift(n)}