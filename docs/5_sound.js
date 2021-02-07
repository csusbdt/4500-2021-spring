/* global g_message */

let audio_context = null;

function create_audio_context() {
	audio_context = new (window.AudioContext || window.webkitAudioContext)();
}

export function c_sound(file) {
	this.file = file;
	this.volume = 1;
	this.array_buffer = null;
	this.audio_buffer = null;
	this.buffer_source_node = null;
	this.gain_node = null;
}

// fetch allowed before user interaction 
c_sound.prototype.fetch = function() {
	if (this.array_buffer !== null) {
		throw new Error("c_sound.pre_fetch<br>already prefetched");
	}
	return fetch(this.file).then(response => {
		if (response.ok) {
			return response.arrayBuffer();
		} else {
			throw new Error(`c_sound.fetch<br>${this.file}<br>${response.status}`);
		}
	}).then(array_buffer => {
		this.array_buffer = array_buffer;
	});
};

// decode requires audioContext, which requires user interaction 
c_sound.prototype.decode = function() {
	if (audio_context === null) {
		create_audio_context();
	}
	if (this.array_buffer === null) {
		throw new Error("c_sound.decode<br>array_buffer not fetched");
	}
	if (this.audio_buffer !== null) {
		throw new Error("c_sound.decode<br>already decoded");
	}
	return new Promise((resolve, reject) => {
		// promise-based decodeAudioData not supported in Safari
		audio_context.decodeAudioData(
			this.array_buffer, 
			audio_buffer => { 
				this.audio_buffer = audio_buffer; 
				g_message("c_sound.decode audio_buffer set");
				resolve();
			},
			e => reject(e)
		);	
	});
};

c_sound.prototype.play = function(volume) {
	if (typeof(volume) !== 'undefined') {
		this.volume = volume;
	}
	return new Promise((resolve, reject) => {
		if (this.array_buffer === null) {
			reject(new Error("c_sound.play array_buffer is null"));
		}
		if (this.audio_buffer === null) {
			return this.decode();
		} else {
			resolve();
		}
	}).then(() => {
		this.buffer_source_node = audio_context.createBufferSource();
		this.buffer_source_node.buffer = this.audio_buffer;
		this.gain_node = audio_context.createGain();
		this.buffer_source_node.connect(this.gain_node);
		this.gain_node.connect(audio_context.destination);
		this.gain_node.gain.setValueAtTime(this.volume, audio_context.currentTime);
		this.buffer_source_node.onended = () => {
			this.buffer_source_node.onended = null;
			this.buffer_source_node = null;
			this.gain_node = null;
		};
		this.buffer_source_node.start();
	});
};

c_sound.prototype.set_volume = function(volume) {
	this.volume = volume;
	if (this.gain_node !== null) {
		this.gain_node.gain.setValueAtTime(volume, audio_context.currentTime);
	}
};

c_sound.prototype.stop = function() {
	if (this.buffer_source_node !== null) {
		this.buffer_source_node.onended = null;
		this.buffer_source_node.stop();
		this.buffer_source_node = null;
		this.gain_node = null;
	}
};

c_sound.prototype.release_memory = function() {
	this.stop();
	this.audio_buffer = null;
	this.array_buffer = null;
};
