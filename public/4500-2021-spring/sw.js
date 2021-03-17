/* eslint-env serviceworker */

const apps = new Map();

apps.set('g0' ,'g0_102');
apps.set('g1', 'g1_102');
apps.set('g2', 'g2_102');

self.skipWaiting(); // activate immediately after install

self.addEventListener('install', event => {
	event.waitUntil(Promise.all([
		caches.open(apps.get('g0')).then(cache => cache.addAll([
			'/4500-2021-spring/',
			'/4500-2021-spring/images/apple-touch-icon-192x192.png',
			'/4500-2021-spring/images/icon-192x192.png',
			'/4500-2021-spring/images/icon-512x512.png',
			'/4500-2021-spring/scripts/app_main.js',
			'/4500-2021-spring/scripts/canvas_main.js',
			'/4500-2021-spring/manifest.webmanifest'
		])),
		caches.open(apps.get('g1')).then(cache => cache.addAll([
		])),
		caches.open(apps.get('g2')).then(cache => cache.addAll([]))
	]));
});

self.addEventListener('activate', event => {
	event.waitUntil(clients.claim());
	event.waitUntil(caches.keys().then(cache_names => {
		return Promise.all(
			Array.from(cache_names).filter(cache_name => {
				return !Array.from(apps.values()).includes(cache_name);
			}).map(cache_name => {
//				console.log(`deleting ${cache_name}`);
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
//	console.log(`fetching: ${event.request.url}`);
	const cache_name = get_cache_name(event.request);
//	console.log(`cache_name: ${cache_name}`);
	event.respondWith(
		caches.open(cache_name).then(function(cache) {
//			console.log(`${cache_name} opened`);
//			console.log(`fetching: ${event.request.url}`);
			return cache.match(event.request.clone()).then(function (cache_response) {
				if (cache_response) {
//					console.log(`fetching ${event.request.url} from cache`);
					return cache_response;
				} else {
//					console.log(`fetching ${event.request.url} from metwork`);
					return fetch(event.request).then(function (network_response) {
						cache.put(event.request, network_response.clone());
//						console.log(`returning response for ${event.request.url}`);
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
