let audio_context = null;

function get_audio_context() {
	if (audio_context === null) {
		audio_context = new (window.AudioContext || window.webkitAudioContext)();
		if (audio_context.state === 'suspended') {
			audio_context = null;
		}
	}
	return audio_context;
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
	this.fetching = false;
	this.decoding = false;
}

// fetch allowed before user interaction 
// use this function to prefetch audio before user interaction
c_sound.prototype.fetch = function() {
	if (this.array_buffer !== null) {
		return Promise.resolve(this.array_buffer);
	} else if (this.fetching) {
		return Promise.reject("fetching");
	} else {
		this.fetching = true;
		return fetch(this.file).then(response => {
			if (response.ok) {
				return response.arrayBuffer();
			} else {
				this.fetching = false;
				throw new Error(response.status);
			}
		})
		.then(array_buffer => {
			this.array_buffer = array_buffer;
			this.fetching = false;
			return this.array_buffer;
		})
	}
};

// decode requires an audioContext, which requires user interaction 
// can only decode array_buffer once!
c_sound.prototype.decode = function() {
	if (this.audio_buffer !== null) {
		return Promise.resolve(this.audio_buffer);
	} else if (this.decoding) {
		return Promise.reject("decoding");
	} else {
		this.decoding = true;
		return this.fetch()
		.then(array_buffer => {
			return new Promise((resolve, reject) => {
				if (get_audio_context() === null) {
					this.decoding = false;
					return reject("no audio context");
				}
				audio_context.decodeAudioData(
					array_buffer,
					audio_buffer => {
						this.audio_buffer = audio_buffer;
						this.decoding = false;
						resolve(audio_buffer);
					},
					e => {
						this.decoding = false;
						reject(e);
					}
				);
			});
		});
	}
};

c_sound.prototype.fast_play = function() {
	this.decode()
	.then(audio_buffer => {
		const buffer_source_node = audio_context.createBufferSource();
		buffer_source_node.buffer = audio_buffer;
		const gain_node = audio_context.createGain();
		buffer_source_node.connect(gain_node);
		gain_node.connect(audio_context.destination);
		gain_node.gain.setValueAtTime(this.volume, audio_context.currentTime);	
		buffer_source_node.start();
	})
	.catch(() => {});
};

c_sound.prototype.play = function() {
	this.decode()
	.then(audio_buffer => {
		// avoid race condition
		if (this.buffer_source_node === null) {
			this.buffer_source_node = audio_context.createBufferSource();
			this.buffer_source_node.buffer = audio_buffer;
			this.gain_node = audio_context.createGain();
			this.buffer_source_node.connect(this.gain_node);
			this.gain_node.connect(audio_context.destination);
			this.gain_node.gain.setValueAtTime(this.volume, audio_context.currentTime);
			this.buffer_source_node.addEventListener('ended', () => {
				this.buffer_source_node = null;
				this.gain_node = null;
			}, { once: true });
			this.buffer_source_node.start();
		}	
	})
	.catch(() => {});
};

c_sound.prototype.stop = function() {
	if (this.buffer_source_node !== null) {
		this.buffer_source_node.stop();
	}
};

c_sound.prototype.set_volume = function(volume) {
	if (this.gain_node !== null) {
		this.gain_node.gain.setValueAtTime(volume, audio_context.currentTime);
	}
};

c_sound.prototype.release_memory = function() {
	this.audio_buffer = null;
	this.array_buffer = null;	
	this.stop();
};
