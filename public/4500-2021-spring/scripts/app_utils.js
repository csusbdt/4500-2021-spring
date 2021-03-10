// This module has no imports because it's meant to be
// imported by others. So you don't need to think about 
// circular dependencies when importing this module.

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

//export function unload_image(image) {
//	URL.revokeObjectURL(image.src);
//	image.src = null;
//}

export function remove(array, o) {
	const i = array.indexOf(o);
	if (i !== -1) array.splice(i, 1);
}

export function insert(ordered_array, o) {
	if (ordered_array.includes(o)) return;
	for (let i = ordered_array.length; i > 0; --i) {
		if (ordered_array[i - 1].order <= o.order) {
			ordered_array.splice(i, 0, o);
			return;
		}
	}
	ordered_array.unshift(o);
}
