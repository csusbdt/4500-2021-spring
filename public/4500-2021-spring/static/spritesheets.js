import { load_image, load_json } from '/4500-2021-spring/static/utils.js';
//import { c_frame } from '/4500-2021-spring/static/c_frame.js';

export function c_spritesheet(name) {
	this.name   = name;
	this.image  = null;
	this.frames = null;
	this.loaded = false;
}

const spritesheets = new Map();

export const get_spritesheet = name => {
	let spritesheet = spritesheets.get(name);
	if (spritesheet === undefined) {
		spritesheet = new c_spritesheet(name);
		spritesheets.set(name, spritesheet);
		spritesheet.load();
		return spritesheet;
	} else if (spritesheet.image === null || spritesheet.frames === null) {
		return Promise.reject('spritesheet loading not finished');
	} else {
		return Promise.resolve(spritesheet);
	}
}

c_spritesheet.prototype.load = function() {
	return Promise.all([
		load_image(`/4500-2021-spring/sprites/${this.name}.png`),
		load_json(`/4500-2021-spring/sprites/${this.name}.json`)
	]).then(([image, frames]) => {
		this.image  = image;
		this.frames = frames;
		this.loaded = true;
		return this;
	});
};

// c_spritesheet.prototype.once = function(frame_name) {
// 	const frame = new c_frame(this, frame_name);
// 	return frame;
// };

// c_spritesheet.prototype.loop = function(frame_name) {
//  	const frame = new c_frame(this, frame_name);
// 	frame.loop = true;
// 	//frame.starts(frame);
// 	return frame;
// };
