if (location.protocol !== 'https:') location.protocol = 'https:';

window.g = {};

g.fatal = function(...messages) {
	while (document.body.lastElementChild) {
		document.body.removeChild(document.body.lastElementChild);
	}
	document.body.style.background_color = 'white';
	const e = document.createElement("h2");
	e.style.color = 'black';
	messages.forEach(m => {
		e.innerHTML += "<br>" + m;
	});
	document.body.appendChild(e);
};

// global error handlers for uncaught exceptions

window.addEventListener('error', function(e) {
	g.fatal(e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
	if (typeof(e.reason.stack) !== 'undefined') {
		g.fatal(e.reason, e.reason.message, e.reason.stack);
	} else {
		g.fatal(e.reason, e.reason.message);
	}
});

function register_service_worker() {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.register('/4500-2021-spring/sw.js')
		.then(registration => {
			registration.addEventListener('updatefound', e => {
				registration.installing.addEventListener('statechange', e => {
					if (e.target.state === 'activated') {
						window.location.reload();
					}
				});
			});
		})
	} else {
		return Promise.resolve();
	}
}

window.addEventListener('load', e => {
	if ('serviceWorker' in navigator) {
		register_service_worker().then(() => {
			if (g.start) g.start();
		}).catch(e => fatal(e));
	} else {
		if (g.start) g.start();
	}
});

// helper functions for other scripts

g.load_image = function(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(function(blob) {
			return new Promise((resolve, reject) => {
				const image = new Image();
				image.onload = e => {
					URL.revokeObjectURL(image.src);
					resolve(image);
				}
				image.onerror = e => {
					reject(e);
				}				
				image.src = URL.createObjectURL(blob);
				return image;
			})
		});
}

g.load_json = function(url) {
    return fetch(url).then(response => response.json());
}

g.remove = function(array, o) {
	const i = array.indexOf(o);
	if (i !== -1) array.splice(i, 1);
}

g.insert = function(ordered_array, o) {
	if (ordered_array.includes(o)) return;
	for (let i = ordered_array.length; i > 0; --i) {
		if (ordered_array[i - 1].order <= o.order) {
			ordered_array.splice(i, 0, o);
			return;
		}
	}
	ordered_array.unshift(o);
}

// NOTE: Current architecture does not allow dynamic loading of scripts,
//       which means all app scripts are loaded when the page is loaded.

// IDEA: On page load, add all assets (images, json, sound files) to app cache.

// export function load_script(src) {
// 	return new Promise(function(resolve, reject) {
// 		const script = document.createElement('script');
// 		script.type = "module";
// 		script.src = src;
// 		script.onload = () => {
// 			resolve(script);
// 		}
// 		script.onerror = () => {
// 			reject(`${src} failed to load`);
// 		}
// 		document.head.append(script);
// 	});
// }
