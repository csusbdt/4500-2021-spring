import { load_script } from '/4500-2021-spring/static/utils.js';
import { set_room, set_bg_frame } from '/4500-2021-spring/static/core.js';
import { c_zone    } from '/4500-2021-spring/static/zone.js';
import { c_sound   } from '/4500-2021-spring/static/c_sound.js';
import { c_sprites } from '/4500-2021-spring/static/c_sprites.js';

const rooms = new Map();
export const rooms_to_load = new Map(); // accessed by dynamic scripts

export function c_room(name) {
	this.name       = name;
	this.bg         = null;
	this.on_start   = null;
	this.loadables  = new Array();
	this.zones      = new Array();
	this.updatables = new Array();
	this.drawables  = new Array();
	this.touched    = false;
	this.touch_x    = 0;
	this.touch_y    = 0;
}

rooms.set('', new c_room(''));

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

c_room.prototype.render = function(dt, ctx) {
	for (let o of this.drawables) {
		o.draw(ctx);
	}
	if (this.touched) {
		for (let zone of this.zones) {
			if (zone.contains(this.touch_x, this.touch_y)) {
				zone.touch();
				break;
			}
		}
		this.touched = false;
	}
	let clone = Array.from(this.updatables);
	for (let o of clone) {
		o.update(dt);
	}
	clone = null;
};

c_room.prototype.start = function() {
	set_room(this);
	if (this.on_start !== null) {
		this.on_start();
	}
	if (this.bg !== null) {
		set_bg_frame(this.bg);
	}
};

c_room.prototype.stop = function() {
	set_bg_frame(null);
	set_room(null);
	this.loadables.forEach(o => o.unload());
	return Promise.resolve(this);
};

c_room.prototype.goto = function(next_room_name) {
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

c_room.prototype.zone = function(sound) {
	const z = new c_zone(this);
	z.touch_sound = sound;
	return z;
};

c_room.prototype.sound = function(url, volume) {
	const sound = new c_sound(url, volume);
	this.loadables.push(sound);
	return sound;
};

c_room.prototype.sprites = function(name) {
	const s = new c_sprites(name);
	s.room = this;
	this.loadables.push(s);
	return s;
};

c_room.prototype.add_drawable = function(o) {
	for (let i = this.drawables.length; i > 0; --i) {
		if (this.drawables[i - 1].order <= this.order) {
			this.drawables.splice(i, 0, this);
			return;
		}
	}
	this.drawables.unshift(o);
};
