/* eslint-env serviceworker */

const apps = new Map();

apps.set('g0' ,'g0_100');
apps.set('g1', 'g1_100');
apps.set('g2', 'g2_100');
apps.set('g3', 'g3_100');
apps.set('g4', 'g4_100');
apps.set('g5', 'g5_100');
apps.set('g6', 'g6_100');
apps.set('g7', 'g7_100');
apps.set('g8', 'g8_100');

self.skipWaiting(); // activate immediately after install

self.addEventListener('install', event => {
	event.waitUntil(Promise.all([
		caches.open(apps.get('g0')).then(cache => cache.addAll([
			'/',
			'/images/apple-touch-icon-192x192.png',
			'/images/icon-192x192.png',
			'/images/icon-512x512.png',
			'/scripts/app_main.js',
			'/scripts/audio.js',
			'/scripts/canvas_main.js',
			'/scripts/game_main.js',
			'/scripts/rooms.js',
			'/scripts/spritesheets.js',
			'/manifest.webmanifest'
		])),
		caches.open(apps.get('g1')).then(cache => cache.addAll([])),
		caches.open(apps.get('g2')).then(cache => cache.addAll([])),
		caches.open(apps.get('g3')).then(cache => cache.addAll([])),
		caches.open(apps.get('g4')).then(cache => cache.addAll([])),
		caches.open(apps.get('g5')).then(cache => cache.addAll([
			'/g5/',
			'/g5/index.js'
		]))
	]));
});

self.addEventListener('activate', event => {
	event.waitUntil(clients.claim());
	event.waitUntil(caches.keys().then(cache_names => {
		return Promise.all(
			Array.from(cache_names).filter(cache_name => {
				return !Array.from(apps.values()).includes(cache_name);
			}).map(cache_name => {
				return caches.delete(cache_name);
			})
		);
	}));
});

function get_cache_name(request) {
	const app_name = request.url.split('/')[4];
	if (apps.has(app_name)) {
		return apps.get(app_name);
	} else {
		return apps.get('g0');
	}
}

self.addEventListener('fetch', function(event) {
	if (event.request.method !== 'GET') return;
	const cache_name = get_cache_name(event.request);
	event.respondWith(
		caches.open(cache_name).then(function(cache) {
			return cache.match(event.request.clone()).then(function (cache_response) {
				if (cache_response) {
					return cache_response;
				} else {
					return fetch(event.request).then(function (network_response) {
						cache.put(event.request, network_response.clone());
						return network_response;
					})
					.catch(e => { 
						console.log(`error requesting: ${event.request.url}`);
						console.log(e); 
					});
				}
			});
		})
	);
});

//	console.log(`fetching: ${event.request.url}`);
/*
https://blog.bitsrc.io/5-service-worker-caching-strategies-for-your-next-pwa-app-58539f156f52


		caches.match(event.request).then(function(response) {
			if (response !== undefined) {
				console.log(`returning: ${response.status} from cache`);
				return response;
			}
			var request_to_fetch = event.request.clone();
			return fetch(request_to_fetch).then(response => { 
				if (!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}
				const response_to_cache = response.clone();
				return caches.open(get_cache_name(event.request))
				.then(cache => {
					console.log(`putting ${event.request.url}`);
					return cache.put(event.request, response_to_cache);
				})
				.then(() => {
					console.log(`returning response: ${event.request.url}`);
					return response; 
				});
			})
		})
		.catch(e => { console.log(`BAD!!! ${e}`); throw e; })
	);
});
*/
