/* eslint-env serviceworker */

const cache_name = "v1";

self.addEventListener('install', function(event) {
	console.log("install " + cache_name);
	event.waitUntil(caches.open(cache_name).then(cache => {
		cache.addAll([
			'/6_service_worker.html',
			'/5_sound.js',
			'/3_error.js',
			'/sfx/click.mp3',
			'/music/robins_and_roses.mp3'
		]);
	}));
});

self.addEventListener('activate', event => {
	console.log("activate " + cache_name);
	event.waitUntil(Promise.resolve().then(() => {
		console.log("delete old stuff");
	}));
});

function fetch_request(request) {
	return caches.match(request)
	.then(response => {
		if (response !== undefined) {
			return response;
		} else {
			return fetch(request).then(response => {
				if (response.status !== 200 || response.type !== 'basic') {
					throw new Error("bad request");
				}
				return caches.open(cache_name)
					.then(cache => {
						return cache.put(request, response.clone());
					})
					.then(() => {
						return response;
					});
			});
		}
	});
}

self.addEventListener('fetch', function(event) {
	if (event.request.method === 'GET') {
		event.respondWith(fetch_request(event.request));
	}
});
