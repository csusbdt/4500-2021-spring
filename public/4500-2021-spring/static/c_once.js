//import { get_spritesheet             } from '/4500-2021-spring/static/spritesheets.js';

import { c_frame } from "./c_frame";

export function c_once(room, sub) {
	this.frame = new c_frame(room, sub);
}

c_once.prototype.start = function() {
	this.frame.start();
};
