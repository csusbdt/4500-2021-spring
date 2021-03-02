import { load_image, unload_image, load_json, insert, remove } from '/4500-2021-spring/static/utils.js';
import { c_frame } from '/4500-2021-spring/static/c_frame.js';

export function c_sprites(name) {
	this.room        = null;
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

c_sprites.prototype.once = function(frame_name) {
	const frame = new c_frame(this, frame_name);
	return frame;
};

c_sprites.prototype.loop = function(frame_name) {
 	const frame = new c_frame(this, frame_name);
	frame.loop = true;
	//frame.starts(frame);
	return frame;
};
