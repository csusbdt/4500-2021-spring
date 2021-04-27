import { r } from "../g8/main.js";

export function c_room(name) {
	this.name         = name;
	this.load_state   = null;
	this.zones        = g.game.ordered_array();
	this.drawables    = g.game.ordered_array();
	this.updatables   = [];
	this.sounds       = [];
	this.spritesheets = [];
	this.mouse        = null;
}

let hover_zone = null;

// rect

function c_rect(top_left_x, top_left_y, bottom_right_x, bottom_right_y) {
	this.left   = top_left_x;
	this.right  = bottom_right_x;
	this.top    = top_left_y;
	this.bottom = bottom_right_y;
}

c_room.prototype.rect = function(left, top, right, bottom) {
	return new c_rect(left, top, right, bottom);
};

c_rect.prototype.inside = function(p) {
	return p.x >= this.left && p.x < this.right && p.y >= this.top && p.y < this.bottom;
};

// circle

function c_circle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

c_room.prototype.circle = function(x, y, r) {
	return new c_circle(x, y, r);
};

c_circle.prototype.inside = function(p) {
	return (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y) < this.r * this.r;
};

// zone

function c_zone(room, mouse, order) {
	this.room        = room;
	this.mouse       = mouse;
	this.order       = order;
	this.clear_zones = true;
	this.shapes      = [];
	this.start_set   = [];
	this.stop_set    = [];
}

c_room.prototype.zone = function(mouse, order = 10) {
	return new c_zone(this, mouse, order);
};

c_zone.prototype.start = function() {
	this.room.zones.insert(this);
};

c_zone.prototype.stop = function() {
	this.room.zones.remove(this);
};

c_zone.prototype.add = function(shape) {
	this.shapes.push(shape);
	return this;
};

c_zone.prototype.starts = function(o) {
	if (!o.start) throw new Error("missing start");
	this.start_set.push(o);
	return this;
};

c_zone.prototype.stops = function(o) {
	if (!o.stop) throw new Error("missing stop");
	this.stop_set.push(o);
	return this;
};

c_zone.prototype.contains = function(p) {
	for (let i = 0; i < this.shapes.length; ++i) {
		if (this.shapes[i].inside(p)) {
			return true;
		}
	}
	return false;
};

c_zone.prototype.consume = function(p) {
	if (this.contains(p)) {
		if (this.clear_zones) this.room.zones.clear();
		this.stop_set.forEach(o => o.stop());
		this.start_set.forEach(o => o.start());
		return true;
	}
	return false;
};

// loop

function c_loop(room, order, seq, offset_x, offset_y) {
	this.room       = room;
	this.order      = order;
	this.seq        = seq;
	this.offset_x   = offset_x;
	this.offset_y   = offset_y;
}

c_room.prototype.loop = function(ss, seq_name, order = 10, offset_x = 0, offset_y = 0) {
	return new c_loop(this, order, ss.seq(seq_name), offset_x, offset_y);
};

c_loop.prototype.start = function() {
	this.room.updatables.push(this);
	this.room.drawables.insert(this);
};

c_loop.prototype.stop = function() {
	const i = this.room.updatables.indexOf(this);
	if (i !== -1) this.room.updatables.splice(i, 1);
	this.room.drawables.remove(this);
};

c_loop.prototype.update = function(dt) {
	this.seq.update(dt);
};

c_loop.prototype.draw = function(ctx) {
	this.seq.draw(ctx, this.offset_x, this.offset_y);
};

// once

function once_on_end() {
	this.stop();
	this.stop_set.forEach(o => o.stop());
	this.start_set.forEach(o => o.start());
}

function c_once(room, order, seq) {
	this.room       = room;
	this.order      = order;
	this.seq        = seq;
	this.start_set  = [];
	this.stop_set   = [];
	this.seq.on_end = once_on_end.bind(this);
}

c_room.prototype.once = function(ss, seq_name, order = 10) {
	return new c_once(this, order, ss.seq(seq_name));
};

c_once.prototype.reverse = function() {
	this.seq.frames.reverse();
	return this;
};

c_once.prototype.starts = function(o) {
	if (!o.start) throw new Error("missing start");
	this.start_set.push(o);
	return this;
};

c_once.prototype.stops = function(o) {
	if (!o.stop) throw new Error("missing stop");
	this.stop_set.push(o);
	return this;
};

c_once.prototype.start = function() {
	this.room.updatables.push(this);
	this.room.drawables.insert(this);
};

c_once.prototype.stop = function() {
	const i = this.room.updatables.indexOf(this);
	if (i !== -1) this.room.updatables.splice(i, 1);
	this.room.drawables.remove(this);
};

c_once.prototype.update = function(dt) {
	this.seq.update(dt);
};

c_once.prototype.draw = function(ctx) {
	this.seq.draw(ctx);
};

// sound

c_room.prototype.sound = function(sound_file, volume = 1) {
	const s = g.game.sound(sound_file, volume);
	this.sounds.push(s);
	return s;
};

// sprite sheet

c_room.prototype.spritesheet = function(name) {
	const ss = g.game.spritesheet(name);
	this.spritesheets.push(ss);
	return ss;
};

c_room.prototype.bg = function(ss, seq_name) {
	g.game.set_bg(ss.frame(seq_name));
};

// load

c_room.prototype.load = function() {
	if (this.load_state === null) {
		this.load_state = 'loading';
		return Promise.all([
			...this.sounds.map(s => s.fetch()),
			...this.spritesheets.map(ss => ss.load())
		]).then(() => {
			this.load_state = 'loaded';
			if (this.on_load) {
				this.on_load();
			}
		});
	} else {
		return Promise.resolve();
	}
};

// next room

function c_next_room(room, next_room) {
	this.room = room;
	this.next_room = next_room;
}

c_room.prototype.next_room = function(next_room) {
	return new c_next_room(this, next_room);
};

c_room.prototype.stop = function() {
	this.updatables.length = 0;
	this.drawables.clear();
	this.zones.clear();
};

c_next_room.prototype.start = function() {
	if (this.next_room.load_status === null) {
		this.next_room.load();
	}
	this.room.updatables.push(this);
};

c_next_room.prototype.update = function(dt) {
	if (this.next_room.load_status === 'loaded') {
		this.room.stop();
		g.game.set_room(this.next_room);
		this.next_room.start();
	}
};

c_room.prototype.start = function() {
	if (this.load_state !== 'loaded') {
		throw new Error("start called on unloaded room");
	}
	if (this.on_start) {
		this.on_start();
	}
};

// update 

c_room.prototype.update = function(dt) {
	if (g.game.touch_point) {
		for (let i = this.zones.size() - 1; i >= 0; --i) {
			if (this.zones.get(i).consume(g.game.touch_point)) {
				if (this.hit) this.hit.fast_play();
				g.game.touch_point = null;
				break;
			}
		}
		if (g.game.touch_point !== null) {
			if (this.miss) this.miss.fast_play();
		}
	} else if (g.game.mousedown_point) {
		for (let i = this.zones.size() - 1; i >= 0; --i) {
			if (this.zones.get(i).consume(g.game.mousedown_point)) {
				if (this.hit) this.hit.fast_play();
				g.game.mousedown_point = null;
				break;
			}
		}
		if (g.game.mousedown_point !== null) {
			if (this.miss) this.miss.fast_play();
			g.game.mousedown_point = null;
		}
	}
	this.updatables.slice().forEach(o => o.update(dt));
	this.hover_zone = null;
	if (this.mouse && g.game.mousemove_point) {
		for (let i = this.zones.size() - 1; i >= 0; --i) {
			const zone = this.zones.get(i);
			if (zone.contains(g.game.mousemove_point)) {
				this.hover_zone = zone;
				if (this.hover_zone.mouse) {
					zone.mouse.offset_x = g.game.mousemove_point.x;
					zone.mouse.offset_y = g.game.mousemove_point.y;
					zone.mouse.update(dt);
				}
				break;
			}
		}
		if (this.hover_zone === null) {
			this.mouse.offset_x = g.game.mousemove_point.x;
			this.mouse.offset_y = g.game.mousemove_point.y;
		}
	}
};

c_room.prototype.draw = function(ctx) {
	for (let i = 0; i < this.drawables.size(); ++i) {
		this.drawables.get(i).draw(ctx);
	}
	if (this.mouse && g.game.mousemove_point) {
		if (this.hover_zone && this.hover_zone.mouse) {
			this.hover_zone.mouse.draw(ctx);
		} else {
			this.mouse.draw(ctx);
		}
	}
};
