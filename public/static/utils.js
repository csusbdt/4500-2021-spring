// This module has no imports because it's meant to be
// imported by others. So you don't need to think about 
// circular dependencies when importing this module. 

export function message(...messages) {
	g_canvas.style.display = 'none';
	g_message_div.style.display = 'block';
	g_message_div.onclick = e => {
		e.preventDefault();
		g_message_div.innerHTML = "";
		g_canvas.style.display = 'block';
		g_message_div.style.display = 'none';
	};
	messages.forEach(m => {
		g_message_div.innerHTML += "<br>" + m;
	});
};

export function register_service_worker() {
	if ('serviceWorker' in navigator) {	
		return navigator.serviceWorker.register('sw.js')
		.then(registration => {
			registration.addEventListener('updatefound', e => {
				registration.installing.addEventListener('statechange', e => {
					if (e.target.state === 'activated') {
						window.location.reload();
					}
				});
			}, { once: true });
		})
		.then(navigator.serviceWorker.ready);
	} else {
		return Promise.resolve();
	}
}

export function load_script(src) {
	return new Promise(function(resolve, reject) {
		const script = document.createElement('script');
		script.type = "module";
		script.src = src;
		script.onload = () => {
			resolve(script);
		}
		script.onerror = () => {
			reject(src);
		}
		document.head.append(script);
	});
}
