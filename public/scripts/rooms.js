export function c_room(name) {
	this.name       = name;
	this.loaded     = false;
	this.zones      = g.game.ordered_array();
	this.drawables  = g.game.ordered_array();
	this.updatables = [];
}

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
	return p.x >= left && p.x < right && p.y >= top && p.y < bottom;
};

// zone

function c_zone(room, order) {
	this.room        = room;
	this.order       = order;
	this.clear_zones = true;
	this.shapes      = [];
	this.start_set   = [];
	this.stop_set    = [];
}

c_room.prototype.zone = function(order = 10) {
	return new c_zone(this, order);
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

c_zone.prototype.consume_touch = function(p) {
	for (let i = 0; i < this.shapes; ++i) {
		if (this.shapes[i].inside(p)) {
			if (this.clear_zones) this.room.zones.clear();
			this.stop_set.forEach(o => o.stop());
			this.start_set.forEach(o => o.start());
			return true;
		}
	}
	return false;
};

c_room.prototype.start = function() {
	throw new Error("start not implemented");
};

c_room.prototype.update = function(dt) {
	this.updatables.slice().forEach(o => o.update(dt));
	if (g.game.touch_point) {
		let found = false;
		for (let i = this.zones.length - 1; i >= 0; --i) {
			if (this.zones[i].consume_touch(g.game.touch_point)) {
				if (this.hit) this.hit.fast_play();
				found = true;
				break;
			}
		}
		if (!found) {
			if (this.miss) this.miss.fast_play();
		}
	}
};

c_room.prototype.draw = function(ctx) {
	for (let i = 0; i < this.drawables.length; ++i) {
		this.drawables[i].draw(ctx);
	}
};

