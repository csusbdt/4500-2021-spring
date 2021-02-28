import { load_image, unload_image, load_json } from '/4500-2021-spring/static/utils.js';

export function c_sprites(name) {
	this.name   = name;
	this.image  = null;
	this.frames = null;
}

c_sprites.prototype.load = function() {
	return Promise.all([
		load_image(`/4500-2021-spring/sprites/${this.name}.png`),
		load_json(`/4500-2021-spring/sprites/${this.name}.json`)
	]).then(([image, frames]) => {
		this.image  = image;
		this.frames = frames;
	});
};

c_sprites.prototype.unload = function() {
	unload_image(this.image);
};
