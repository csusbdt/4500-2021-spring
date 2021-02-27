import { load_image } from '/static/utils.js';

function c_sprite_sheet(image, frames) {
	this.image  = image;
	this.frames = frames;
}

export function load_sprite_sheet(name) {
	return Promise.all([
		load_image(`sprite_sheets/${name}.png`).then(image => {
			r.image = image;
		}),
		load_json(`sprite_sheets/${name}.json`).then(frames => {
			r.frames = frames;
		})
	]).then(results => {
		return new c_sprite_sheet(...results);
	});
};

//c_sprite_sheet.prototype.