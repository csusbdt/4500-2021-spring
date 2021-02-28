import { load_image, unload_image, load_json } from '/4500-2021-spring/static/utils.js';

function c_frame(json_frame) {
	this.f        = json_frame;
	this.order    = 10;
	this.t        = 0;    // elapsed seconds
	this.duration = .1;
	this.image    = null;
	this.next     = this; // make a loop
}

c_frame.prototype.draw = function(ctx) {
	ctx.drawImage(
		this.image,
		this.f.sx,
		this.f.sy,
		this.f.w,
		this.f.h,
		this.f.dx,
		this.f.dy,
		this.f.w,
		this.f.h
	);
};

export function c_sprites(name) {
	this.name        = name;
	this.image       = null;
	this.json_frames = null;
}

c_sprites.prototype.load = function() {
	return Promise.all([
		load_image(`/4500-2021-spring/sprites/${this.name}.png`),
		load_json(`/4500-2021-spring/sprites/${this.name}.json`)
	]).then(([image, json_frames]) => {
		this.image  = image;
		this.json_frames = json_frames;
	});
};

c_sprites.prototype.unload = function() {
	unload_image(this.image);
};

c_sprites.prototype.get_frame = function(frame_name) {
	const frame = new c_frame(this.json_frames[frame_name])
	frame.image = this.image;
	return frame;
};
