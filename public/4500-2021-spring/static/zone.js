function c_rect(left, top, right, bottom) {
	this.left   = left;
	this.top    = top;
	this.right  = right;
	this.bottom = bottom;
}

c_rect.prototype.contains = function(x, y) {
	return (x >= this.left && x < this.right && y >= this.top && y < this.bottom);
};

function c_circle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

c_circle.prototype.contains = function(x, y) {
	return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) < this.r * this.r;
};

function c_triangle(ax, ay, bx, by, cx, cy) {
	this.ax = ax;
	this.ay = ay;
	this.bx = bx;
	this.by = by;
	this.cx = cx;
	this.cy = cy;
}

c_triangle.prototype.contains = function(x, y) {
	// use barycentric coordinates
	const x0 = this.cx - this.ax;
	const y0 = this.cy - this.ay;
	const x1 = this.bx - this.ax;
	const y1 = this.by - this.ay;
	const x2 = x - this.ax;
	const y2 = y - this.ay;
	const dot00 = x0 * x0 + y0 * y0;
	const dot01 = x0 * x1 + y0 * y1;
	const dot02 = x0 * x2 + y0 * y2;
	const dot11 = x1 * x1 + y1 * y1;
	const dot12 = x1 * x2 + y1 * y2;
	const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
	return u >= 0 && v >= 0 && u + v < 1;
};

export function c_zone(room) {
	this.room        = room;
	this.order       = 10;
	this.clear_zones = true;
	this.shapes      = new Array();
	this.start_set   = new Array();
	this.stop_set    = new Array();
	this.touch_sound = null;
}

c_zone.prototype.rect = function(left, top, right, bottom) {
	this.shapes.push(new c_rect(left, top, right, bottom));
	return this;
};

c_zone.prototype.circle = function(x, y, r) {
	this.shapes.push(new c_circle(x, y, r));
	return this;
};

c_zone.prototype.triangle = function(ax, ay, bx, by, cx, cy) {
	this.shapes.push(new c_triangle(ax, ay, bx, by, cx, cy));
	return this;
};

c_zone.prototype.contains = function(x, y) {
	return this.shapes.some(s => s.contains(x, y));
};

c_zone.prototype.sound = function(sound) {
	this.touch_sound = sound;
	return this;
};

c_zone.prototype.touch = function() {
	if (this.touch_sound !== null) {
		this.touch_sound.fast_play();
	}
	if (this.clear_zones) {
		this.room.zones.length = 0;
	}
	this.stop_set.forEach(o => o.stop());
	this.start_set.forEach(o => o.start());
};

c_zone.prototype.stops = function(o) {
	this.stop_set.push(o);
};

c_zone.prototype.starts = function(o) {
	if (typeof(o) === 'string') {
		this.start_set.push({ 
			start: () => this.room.goto(o) 
		});
	} else {
		this.start_set.push(o);
	}
	return this;
};

c_zone.prototype.start = function() {
	for (let i = this.room.zones.length; i > 0; --i) {
		if (this.room.zones[i - 1].order <= this.order) {
			this.room.zones.splice(i, 0, this);
			return;
		}
	}
	this.room.zones.unshift(this);
};
