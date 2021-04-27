const ss_images = new Map();
const ss_frames = new Map();

export function c_spritesheet(ss_name) {
	this.name   = ss_name;
	this.image  = ss_images.get(ss_name);
	this.frames = ss_frames.get(ss_name);
}

c_spritesheet.prototype.load = function() {
	if (this.image && this.frames) {
		return Promise.resolve();
	}
	if (this.image || this.frames) {
		return Promise.reject('race condition');
	}
	return Promise.all([
		g.app.load_image(`/sprites/${this.name}.png`),
		g.app.load_json(`/sprites/${this.name}.json`)
	]).then(([image, frames]) => {
		ss_images.set(this.name, image);
		ss_frames.set(this.name, frames);
		this.image  = image;
		this.frames = frames;
	});
};

c_spritesheet.prototype.draw = function(ctx, frame_name, offset_x = 0, offset_y = 0) {
	ctx.drawImage(
		this.image, 
		this.frames[frame_name].sx, 
		this.frames[frame_name].sy, 
		this.frames[frame_name].w, 
		this.frames[frame_name].h, 
		this.frames[frame_name].dx + offset_x,
		this.frames[frame_name].dy + offset_y,
		this.frames[frame_name].w, 
		this.frames[frame_name].h
	);
};

const default_duration = .125;

function c_frame(ss, frame_name, duration = default_duration) {
	this.ss         = ss;
	this.frame_name = frame_name;
	this.d          = duration;
}

c_frame.prototype.draw = function(ctx, offset_x = 0, offset_y = 0) {
	this.ss.draw(ctx, this.frame_name, offset_x, offset_y);
};

c_spritesheet.prototype.frame = function(frame_name, duration = default_duration) {
	return new c_frame(this, frame_name, duration);
};

function c_frame_sequence(frames) {
	this.frames      = frames;
	this.frame_index = 0;
	this.t           = 0;
	this.on_end      = null;
}

c_frame_sequence.prototype.update = function(dt) {
	this.t += dt;
	if (this.t < this.frames[this.frame_index].d) {
		return;
	} else {
		g.canvas.fg_dirty = true;
		this.t = 0;
		++this.frame_index;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
			if (this.on_end !== null) {
				this.on_end();
			}
		}
	}
};

c_frame_sequence.prototype.draw = function(ctx, offset_x = 0, offset_y = 0) {
	this.frames[this.frame_index].draw(ctx, offset_x, offset_y);
};

c_spritesheet.prototype.seq = function(seq_name) {
	const frames = [];
	if (seq_name in this.frames) {
		frames.push(this.frame(seq_name));
	}
	let i = 1;
	let frame_name = seq_name + i;
	while (frame_name in this.frames) {
		frames.push(this.frame(frame_name));
		++i;
		frame_name = seq_name + i;
	}
	i = 1;
	frame_name = seq_name + '0' + i;
	while (frame_name in this.frames) {
		frames.push(this.frame(frame_name));
		++i;
		if (i < 10) {
			frame_name = seq_name + '0' + i;
		} else {
			frame_name = seq_name + i;
		}
	}
	if (frames.length === 0) {
		throw new Error(seq_name + "  not found in " + this.name);
	}
	return new c_frame_sequence(frames);
};
