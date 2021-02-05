/* global g_messages_div */

let audio_context = null;

export function create_audio_context() {
	audio_context = new (window.AudioContext || window.webkitAudioContext)();
}

export function fetch_audio_buffer(file) {
	g_messages_div.innerHTML += "<br>fetch_audio_buffer start";
	return fetch(file).then(response => {
		if (response.ok) {
			g_messages_div.innerHTML += "<br>fetch_audio_buffer got response";
			return response.arrayBuffer();
		} else {
			throw new Error(`prefetch_music<br>${file}<br>${response.status}`);
		}
	}).then(array_buffer => {
		g_messages_div.innerHTML += "<br>fetch_audio_buffer got arrayBuffer";
		return audio_context.decodeAudioData(array_buffer);
	});
}

export function play_audio_buffer(buffer, volume) {
	g_messages_div.innerHTML += "<br>play_audio_buffer starting";
	if (typeof(volume) === 'undefined') {
		volume = 1;
	}
	let buffer_source_node = audio_context.createBufferSource();
	buffer_source_node.buffer = buffer;
	let gain_node = audio_context.createGain();
	buffer_source_node.connect(gain_node);
	gain_node.connect(audio_context.destination);
	gain_node.gain.setValueAtTime(volume, audio_context.currentTime);
	buffer_source_node.onended = () => {
		g_messages_div.innerHTML += "<br>play_audio_buffer ended";
	};
	buffer_source_node.start();
}
