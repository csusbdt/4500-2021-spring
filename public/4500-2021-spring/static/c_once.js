import { c_frame } from '/4500-2021-spring/static/c_frame.js';

export function c_once(room, sub) {
	this.frame = new c_frame(room, sub);
}

c_once.prototype.start = function() {
	this.frame.start();
};
