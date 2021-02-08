let audio_context = null;

function prepare_audio_context() {
	if (audio_context === null) {
		audio_context = new (window.AudioContext || window.webkitAudioContext)();
	}
	if (audio_context.state === 'suspended') {
		audio_context.resume();
		if (audio_context.state === 'suspended') {
			throw new Error('suspended');
		}
	}
}

export function c_sound(file, volume) {
	this.file = file;
	if (typeof(volume) === 'undefined') {
		this.volume = 1;
	} else {
		this.volume = volume;
	}
	this.array_buffer = null;  // can only decode once
	this.audio_buffer = null;
	this.buffer_source_node = null;  // can only play once
	this.gain_node = null;
}

function fetch_array_buffer(file) {
	return fetch(file).then(response => {
		if (response.ok) {
			return response.arrayBuffer();
		} else {
			throw new Error(response.status);
		}
	});
}

// fetch allowed before user interaction 
// use this function to prefetch audio before user interaction
c_sound.prototype.fetch = function() {
	return fetch_array_buffer(this.file)
	.then(array_buffer => {
		this.array_buffer = array_buffer;
	});
};

function decode_array_buffer(array_buffer) {
	return new Promise((resolve, reject) => {
		prepare_audio_context();  // throws error
		audio_context.decodeAudioData(
			array_buffer,
			audio_buffer => {
				resolve(audio_buffer);
			},
			e => reject(e)
		);
	});
}

// decode requires an audioContext, which requires user interaction 
// can only decode array_buffer once!
c_sound.prototype.decode = function() {
	if (this.array_buffer === null) {
		return fetch_array_buffer(this.file)
		.then(decode_array_buffer)
		.then(audio_buffer => {
			this.audio_buffer = audio_buffer;
		});
	} else if (this.audio_buffer !== null) {
		return Promise.resolve();
	} else {
		return decode_array_buffer(this.array_buffer)
		.this(audio_buffer => {
			this.audio_buffer = audio_buffer;
		});
	}
};

c_sound.prototype.fast_play = function() {
	function fast_connect(audio_buffer, volume) {
		const buffer_source_node = audio_context.createBufferSource();
		buffer_source_node.buffer = audio_buffer;
		const gain_node = audio_context.createGain();
		buffer_source_node.connect(gain_node);
		gain_node.connect(audio_context.destination);
		gain_node.gain.setValueAtTime(volume, audio_context.currentTime);	
		buffer_source_node.start();
	}
	if (this.audio_buffer === null) {
		this.decode().then(() => {
			fast_connect(this.audio_buffer, this.volume);
		});
	} else {
		fast_connect(this.audio_buffer, this.volume);
	}
};

c_sound.prototype.connect_nodes = function() {
	// keep references to the audio nodes for stop and set_volume
	this.buffer_source_node = audio_context.createBufferSource();
	this.buffer_source_node.buffer = this.audio_buffer;
	this.gain_node = audio_context.createGain();
	this.buffer_source_node.connect(this.gain_node);
	this.gain_node.connect(audio_context.destination);
	this.gain_node.gain.setValueAtTime(this.volume, audio_context.currentTime);
	this.buffer_source_node.onended = () => { this.stop(); }
	this.buffer_source_node.start();
};

c_sound.prototype.play = function() {
	if (this.audio_buffer === null) {
		return this.decode().then(() => this.connect_nodes());
	} else {
		this.connect_nodes();
	}
};

c_sound.prototype.stop = function() {
	if (this.buffer_source_node !== null) {
		this.buffer_source_node.onended = null;
		this.buffer_source_node.stop();
		this.buffer_source_node.buffer = null;
		this.buffer_source_node = null;
		this.gain_node = null;
	}
};

c_sound.prototype.set_volume = function(volume) {
	if (this.gain_node !== null) {
		this.gain_node.gain.setValueAtTime(volume, audio_context.currentTime);
	}
};

c_sound.prototype.release_memory = function() {
	this.stop();
	this.audio_buffer = null;
	this.array_buffer = null;
};
