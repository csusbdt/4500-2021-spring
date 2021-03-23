const version = 'v1';

export let state = null;

export function load_state() {
	const stored_version = localStorage.getItem('version');
	if (stored_version === version) {
		state = JSON.parse(localStorage.getItem('state'));
	} else {
		localStorage.clear();
		localStorage.setItem('version', version);
		state = {
			current_room: 'waking',
			previous_room: null
		};
		save_state();
	}
}

export function save_state() {
	localStorage.setItem('state', JSON.stringify(state));
}
