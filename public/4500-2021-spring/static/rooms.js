import { get_spritesheet             } from '/4500-2021-spring/static/spritesheets.js';
import { load_script, insert, remove } from '/4500-2021-spring/static/utils.js';
import { set_room, set_bg            } from '/4500-2021-spring/static/core.js';
import { c_zone                      } from '/4500-2021-spring/static/zone.js';
import { c_sound                     } from '/4500-2021-spring/static/c_sound.js';
import { c_goto                      } from '/4500-2021-spring/static/c_goto.js';

export function c_room(name) {
	this.name          = name;
	this.bg            = null;
	this.on_start      = null; // set by dynamic script
	this.spritesheets  = new Array();
	this.sounds        = new Array();
	this.zones         = new Array();
	this.updatables    = new Array(); // not ordered
	this.drawables     = new Array();
	this.touched       = false;
	this.touch_x       = 0;
	this.touch_y       = 0;
}

export const rooms = new Map(); // accessed by dynamic scripts

// create a start room for app initialization
const start_room = new c_room('');
start_room.on_start = () => {};
rooms.set('', start_room);

export function get_room(name) {
	let room = rooms.get(name);
	if (room === undefined) {
		room = new c_room(name);
		rooms.set(name, room);
		return load_script(`/4500-2021-spring/dynamic/r_${name}.js`)
		.then(() => Promise.all(
			room.spritesheets.map(ss => ss.load()), 
			room.sounds.map(s => s.fetch())
		))
		.then(() => room);
	} else {
		return Promise.resolve(room);
	}
};

c_room.prototype.goto = function(next_room_name) {
	return new c_goto(this, next_room_name);
};

c_room.prototype.zone = function(sound) {
	return new c_zone(this, sound);
};

c_room.prototype.sound = function(url, volume) {
	const s = new c_sound(url, volume);
	this.sounds.push(s);
	return s;
};

c_room.prototype.spritesheet = function(name) {
	const ss = get_spritesheet(name);
	this.spritesheets.push(ss);
	return ss;
};

c_room.prototype.bg = function(spritesheet, frame_name) {
	set_bg(spritesheet.sub(frame_name));
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
	if (this.bg !== null) {
		set_bg(this.bg);
	}
};

c_room.prototype.stop = function() {
	set_bg(null);
	set_room(null);
	this.sounds.forEach(s => s.release_memory());
};

c_room.prototype.render = function(dt, ctx) {
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
};
