import { load_script, insert, remove } from '/4500-2021-spring/static/utils.js';
import { set_room       } from '/4500-2021-spring/static/core.js';
import { c_zone         } from '/4500-2021-spring/static/zone.js';
import { c_sound        } from '/4500-2021-spring/static/c_sound.js';
import { c_sprites      } from '/4500-2021-spring/static/c_sprites.js';

export const rooms_to_load = new Map(); // accessed by dynamic scripts

export function c_room(name) {
	this.name       = name;
	this.bg         = null;
	this.on_start   = null; // set by dynamic script
	this.loadables  = new Array();
	this.zones      = new Array();
	this.updatables = new Array(); // not ordered
	this.drawables  = new Array();
	this.touched    = false;
	this.touch_x    = 0;
	this.touch_y    = 0;
	this.next_room  = null;
}

const rooms = new Map();
rooms.set('', new c_room('')); // used during app initialization

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
			rooms_to_load.delete(name);
			rooms.set(name, room);
			return room;
		})
		.catch(e => {
			rooms_to_load.delete(name);
		});
	}
};

c_room.prototype.zone = function(sound) {
	return new c_zone(this, sound);
};

c_room.prototype.sound = function(url, volume) {
	const sound = new c_sound(url, volume);
	this.loadables.push(sound);
	return sound;
};

c_room.prototype.sprites = function(name) {
	const s = new c_sprites(this, name);
	this.loadables.push(s);
	return s;
};

c_room.prototype.insert_updatable = function(o) {
	this.updatables.push(o);
};

c_room.prototype.insert_drawable = function(o) {
	insert(this.drawables, o);
};

c_room.prototype.remove_updatable = function(o) {
	remove(this.updatables, o);
};

c_room.prototype.remove_drawable = function(o) {
	remove(this.drawables, o);
};

c_room.prototype.on_touch = function([x, y]) {
	this.touch_x = x;
	this.touch_y = y;
	this.touched = true;
};

c_room.prototype.start = function() {
	set_room(this);
	if (this.on_start !== null) {
		this.on_start();
	}
};

c_room.prototype.stop = function() {
	set_room(null);
	this.loadables.forEach(o => o.unload());
};

c_room.prototype.goto = function(next_room_name) {
	let next_room = null;
	return get_room(next_room_name)
	.then(room => {
		next_room = room;
		return Promise.all(next_room.loadables.map(o => o.load()));
	})
	.then(() => {
		this.next_room = next_room;
	})
};

c_room.prototype.render = function(dt, ctx) {
	if (this.next_room === null || this.updatables.some(o => o.wait_on_goto)) {
		for (let o of this.drawables) o.draw(ctx);
		if (this.touched) {
			for (let zone of this.zones) {
				if (zone.contains(this.touch_x, this.touch_y)) {
					zone.touch();
					break;
				}
			}
			this.touched = false;
		}
		let updatables = Array.from(this.updatables);
		for (let o of updatables) o.update(dt);
		updatables = null;
	} else {
		this.stop();
		this.next_room.start();
	}
};
