import { load_script } from '/4500-2021-spring/static/utils.js';
import { set_room, set_bg } from '/4500-2021-spring/static/core.js';

const rooms = new Map();
export const rooms_to_load = new Map(); // accessed by dynamic scripts

function c_room(name) {
	this.name      = name;
	this.bg        = null;
	this.on_start  = null;
	this.loadables = new Array();
	this.zones     = new Array();
	this.touched   = false;
	this.touch_x   = 0;
	this.touch_y   = 0;
}

export const get_room = name => {
	if (rooms.has(name)) {
		return Promise.resolve(rooms.get(name));
	} else if (rooms_to_load.has(name)) {
		return Promise.reject(`${name} under construction`);
	} else {
		const room = new c_room(name);
		rooms_to_load.set(name, room);
		return load_script(`/4500-2021-spring/dynamic/r_${name}.js`)
		.then(_ => {
			rooms.set(name, room);
			return room;
		})
		.finally(_ => {
			rooms_to_load.delete(name);
		});
	}
};

c_room.prototype.on_touch = function([x, y]) {
	this.touch_x = x;
	this.touch_y = y;
	this.touched = true;
};

c_room.prototype.render = function(dt) {
	if (this.touched) {
		for (zone in this.zones) {
			if (zone.contains(this.touch_x, this.touch_y)) {
				r.click.fast_play();
				console.log('touched');
				break;
			}
		}
		this.touched = false;
	}
};

c_room.prototype.start = function() {
	set_room(this);
	if (this.bg !== null) {
		set_bg(this.bg);
	}
	if (this.on_start !== null) {
		this.on_start();
	}
};

c_room.prototype.stop = function() {
	set_bg(null);
	set_room(null);
	return Promise.resolve(this);
};

c_room.prototype.goto = function(next_room_name) {
//	this.touched = false; // clear any unprocessed touch event
	let next_room = null;
	return get_room(next_room_name)
	.then(room => {
		next_room = room;
		return Promise.all(next_room.loadables.map(o => o.load()));
	})
	.then(_ => {
		return this.stop();
	})
	.then(_ => {
		return next_room.start();
	})
};
