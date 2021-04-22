import { c_loop } from '/scripts/c_loop.js';

const images = new Map();
const frames = new Map();

export function c_spritesheet(name) {
	this.name   = name;
	this.image  = images.get(name);
	this.frames = frames.get(name);
}

c_spritesheet.prototype.load = function() {
	if (this.image && this.frames) {
		return Promise.resolve();
	}
	if (this.image || this.frames) {
		return Promise.reject('race condition');
	}
	return Promise.all([
		g.app.load_image(`${this.name}.png`),
		g.app.load_json(`${this.name}.json`)
	]).then(([image, _frames]) => {
		images.set(this.name, image);
		frames.set(this.name, _frames);
		this.image  = image;
		this.frames = _frames;
	});
};

c_spritesheet.prototype.draw = function(ctx, frame_name) {
	ctx.drawImage(
		this.image, 
		this.frames[frame_name].sx, 
		this.frames[frame_name].sy, 
		this.frames[frame_name].w , 
		this.frames[frame_name].h , 
		this.frames[frame_name].dx, 
		this.frames[frame_name].dy, 
		this.frames[frame_name].w , 
		this.frames[frame_name].h
	);
};

function c_frame(spritesheet, frame_name) {
	this.i = spritesheet.image;
	this.f = spritesheet.frames[frame_name];
}

c_frame.prototype.draw = function(ctx) {
	ctx.drawImage(
		this.i, 
		this.f.sx, this.f.sy, this.f.w, this.f.h, 
		this.f.dx, this.f.dy, this.f.w, this.f.h
	);
};

c_spritesheet.prototype.frame = function(frame_name) {
	return new c_frame(this, frame_name);
};

c_spritesheet.prototype.loop = function(frame_names) {
	return new c_loop(
		frame_names.map(frame_name => this.frame(frame_name))
	);
};

