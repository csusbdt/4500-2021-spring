// This module has no imports because it's meant to be
// imported by others. So you don't need to think about 
// circular dependencies when importing this module. 

export function message(...messages) {
	g_bg.style.display = 'none';
	g_fg.style.display = 'none';
	g_message_div.style.display = 'block';
	g_message_div.onclick = e => {
		e.preventDefault();
		g_message_div.innerHTML = "";
		g_bg.style.display = 'block';
		g_fg.style.display = 'block';
		g_message_div.style.display = 'none';
	};
	messages.forEach(m => {
		g_message_div.innerHTML += "<br>" + m;
	});
};

export function register_service_worker() {
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
//		.then(navigator.serviceWorker.ready);
	} else {
		return Promise.resolve();
	}
}

export function load_script(src) {
	for (let i = 0; i < document.scripts.length; ++i) {
		if (document.scripts[i].src === src) {
			return Promise.resolve(document.scripts[i]);
		}
	}
	return new Promise(function(resolve, reject) {
		const script = document.createElement('script');
		script.type = "module";
		script.src = src;
		script.onload = () => {
			resolve(script);
		}
		script.onerror = () => {
			reject(`${src} failed to load`);
		}
		document.head.append(script);
	});
}

export function load_image(url) {
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

export function load_json(url) {
    return fetch(url).then(response => response.json());
}

export function unload_image(image) {
//	URL.revokeObjectURL(image.src);
//	image.src = null;
}

export function remove(array, o) {
	const i = array.indexOf(o);
	array.splice(i, 1);
}

export function insert(ordered_array, o) {
	for (let i = ordered_array.length; i > 0; --i) {
		if (ordered_array[i - 1].order <= o.order) {
			ordered_array.splice(i, 0, o);
			return;
		}
	}
	ordered_array.unshift(o);
}
