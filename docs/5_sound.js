let audio_context = null;

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
	if (this.audio_buffer !== null) {
		return Promise.resolve();
	}
	if (this.array_buffer !== null) {
		return Promise.reject("already fetched");
	}
	return fetch(this.file).then(response => {
		if (response.ok) {
			return response.arrayBuffer();
		} else {
			throw new Error(`c_sound.fetch<br>${this.file}<br>${response.status}`);
		}
	})
	.then(array_buffer => {
		this.array_buffer = array_buffer;
		return array_buffer;
	});
};

// decode requires an audioContext, which requires user interaction 
c_sound.prototype.decode = function() {
	return new Promise((resolve, reject) => {
		if (this.audio_buffer !== null) {
			return resolve();
		}
		if (this.array_buffer === null) {
			return resolve();
		}
		if (audio_context === null) {
			audio_context = new (window.AudioContext || window.webkitAudioContext)();
			if (audio_context.state === 'suspended') {
				return reject("audio_context suspended");
			}
		}
		audio_context.decodeAudioData(
			this.array_buffer,
			audio_buffer => {
				this.array_buffer = null; // can only decode array_buffer once
				this.audio_buffer = audio_buffer;
				resolve();
			},
			e => reject(e)
		);
	});	
};

// play will call fetch and decode if needed
c_sound.prototype.play = function(volume) {
	if (typeof(volume) !== 'undefined') {
		this.volume = volume;
	}
	return Promise.resolve()
		.then(() => this.fetch())
		.then(() => this.decode())
		.then(() => {
			if (this.buffer_source_node === null) {
				this.buffer_source_node = audio_context.createBufferSource();
				this.buffer_source_node.buffer = this.audio_buffer;
				this.gain_node = audio_context.createGain();
				this.buffer_source_node.connect(this.gain_node);
				this.gain_node.connect(audio_context.destination);
				this.gain_node.gain.setValueAtTime(this.volume, audio_context.currentTime);
				this.buffer_source_node.onended = this.stop;
				this.buffer_source_node.start();
			}
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
