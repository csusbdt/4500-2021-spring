import '/scripts/canvas_main.js';

let room = null;
let bg   = null;

g.game = {
	touch_point: null,
	mouse_point: null,
	start: null
};

g.game.get_room = () => room;

g.game.set_room = _room => {
	room = _room;
	g.canvas.bg_dirty = true;
	g.canvas.fg_dirty = true;
};

g.game.set_bg = _bg => {
	bg = _bg;
	g.canvas.bg_dirty = true;
	g.canvas.fg_dirty = true;
};

g.canvas.on_mousemove = p => {
	g.game.mouse_point = p;
};

g.canvas.on_mousedown = p => {
	g.game.touch_point = p;
};

g.canvas.on_touch = p => {
	g.game.mouse_point = null;
	g.game.touch_point = p;
};

g.canvas.update = dt => {
	if (room && room.update) {
		room.update(dt);
	}
	g.game.touch_point = null;
};

g.canvas.draw_bg = ctx => {
	if (bg) {
		bg.draw(ctx);
	} else {
		g.canvas.clear_bg();
	}
};

g.canvas.draw_fg = ctx => {
	g.canvas.clear_fg();
	if (room && room.draw) {
		room.draw(ctx);
	}
};

g.canvas.start = () => {
	if (g.game.start) {
		g.game.start();
	} else {
		console.log("nothing to start");
	}
};

function c_ordered_array() {
	this.objects = [];
}

g.game.ordered_array = function() {
	return new c_ordered_array();
}

c_ordered_array.prototype.insert = function(o) {
	if (!o.order) throw new Error("order missing");
	if (this.objects.includes(o)) return;
	for (let i = this.objects.length; i > 0; --i) {
		if (this.objects[i - 1].order <= o.order) {
			this.objects.splice(i, 0, o);
			return this;
		}
	}
	this.objects.unshift(o);
	return this;
}

c_ordered_array.prototype.size = function() {
	return this.objects.length;
};

c_ordered_array.prototype.get = function(i) {
	return this.objects[i];
};

c_ordered_array.prototype.remove = function(o) {
	const i = this.objects.indexOf(o);
	if (i !== -1) this.objects.splice(i, 1);
	return this;
};

c_ordered_array.prototype.clear = function() {
	this.objects.length = 0;
	return this;
};

// sound

g.game.sound = function(sound_file, volume = 1) {
	return g.canvas.sound(sound_file, volume);
};

// sprite sheet

g.game.spritesheet = function(name) {
	return g.canvas.spritesheet(name);
};
