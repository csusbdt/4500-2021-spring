/* eslint-env serviceworker */

const apps = new Map();

apps.set(''  , 'g0_000');
apps.set('g1', 'g1_000');
apps.set('g2', 'g2_000');

self.skipWaiting(); // activate immediately after install

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

self.addEventListener('fetch', function(event) {
	if (event.request.method === 'GET') {
		const app_name = event.request.url.split('/')[4];
		let cache_name = null;
		if (app_name && apps.has(app_name)) {
			cache_name = apps.get(app_name);
		} else {
			cache_name = '';
		}
		caches.open(cache_name).then(function(cache) {
			return cache.match(event.request)
			.then(response => {
				if (response === undefined) {
					return fetch(event.request.clone()).then(response => {
						if (response.status !== 200 || response.type !== 'basic') {
							throw new Error("bad request");
						}
						return caches.open(cache_name)
						.then(cache => {
							return cache.put(event.request, response.clone());
						})
						.then(() => {
							return response;
						});
					});
				} else {
					return response;
				}
			});
		});
	}
});
