/* eslint-env serviceworker */

const version = "v1";

self.addEventListener('install', function(event) {
	console.log("install " + version);
	self.skipWaiting();
	event.waitUntil(caches.open(version).then(cache => {
		cache.addAll([
			'/4500-2021-spring/',
			'/4500-2021-spring/dynamic/r_red_white_box.js',
			'/4500-2021-spring/music/robins_and_roses.mp3',
			'/4500-2021-spring/sfx/click.mp3',
			'/4500-2021-spring/static/index.js',
			'/4500-2021-spring/static/core.js',
			'/4500-2021-spring/static/utils.js',
			'/4500-2021-spring/static/c_sound.js',
			'/4500-2021-spring/manifest.webmanifest'
		]);
	}));
});

self.addEventListener('activate', event => {
	console.log("activate " + version);
	event.waitUntil(clients.claim());
	event.waitUntil(caches.keys().then(cache_names => {
		return Promise.all(cache_names.map(cache_name => {
			if (cache_name !== version) {
				return caches.delete(cache_name);
			}
		}));
	}));
});

function fetch_request(request) {
	return caches.match(request)
	.then(response => {
		if (response !== undefined) {
			return response;
		} else {
			return fetch(request.clone()).then(response => {
				if (response.status !== 200 || response.type !== 'basic') {
					throw new Error("bad request");
				}
				return caches.open(version)
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
