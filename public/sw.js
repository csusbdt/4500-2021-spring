/* eslint-env serviceworker */

const version = "v1";

self.addEventListener('install', function(event) {
	console.log("install " + version);
	self.skipWaiting();
	event.waitUntil(caches.open(version).then(cache => {
		cache.addAll([
			'/',
			'/dynamic/r_red_white_box.js',
			'/music/robins_and_roses.mp3',
			'/sfx/click.mp3',
			'/static/index.js',
			'/static/core.js',
			'/static/utils.js',
			'/static/c_sound.js',
			'/manifest.webmanifest'
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
