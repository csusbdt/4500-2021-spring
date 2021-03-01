import { load_image, unload_image, load_json, insert, remove } from '/4500-2021-spring/static/utils.js';

function c_frame(json_frame) {
	this.f        = json_frame;
	this.room     = null;
	this.order    = 10;
	this.t        = 0;    // elapsed seconds
	this.duration = .1;
	this.image    = null;
	this.next     = this; // make a loop
	this.start_set   = new Array();
	this.stop_set    = new Array();
}

c_frame.prototype.stops = function(o) {
	this.stop_set.push(o);
};

c_frame.prototype.starts = function(o) {
	if (typeof(o) === 'string') {
		this.start_set.push({ 
			start: () => this.room.goto(o) 
		});
	} else {
		this.start_set.push(o);
	}
	return this;
};

c_frame.prototype.start = function() {
	this.t = 0;
	insert(this.room.updatables, this);
	insert(this.room.drawables, this);
};

c_frame.prototype.update = function(dt) {
	this.t += dt;
	if (this.t < this.duration) {
		return;
	}
	remove(this.room.updatables, this);
	remove(this.room.drawables, this);
	if (this.next === null) return;
	if (typeof(this.next) === 'string') {
		this.room.goto(this.next);
	} else if (typeof(this.next) === 'function') {
		this.next();
	} else {
		insert(this.room.updatables, this.next);
		insert(this.room.drawables, this.next);
	}
};

c_frame.prototype.draw = function(ctx) {
	ctx.drawImage(
		this.image,
		this.f.sx,
		this.f.sy,
		this.f.w,
		this.f.h,
		this.f.dx,
		this.f.dy,
		this.f.w,
		this.f.h
	);
};

export function c_sprites(name) {
	this.room        = null;
	this.name        = name;
	this.image       = null;
	this.json_frames = null;
}

c_sprites.prototype.load = function() {
	return Promise.all([
		load_image(`/4500-2021-spring/sprites/${this.name}.png`),
		load_json(`/4500-2021-spring/sprites/${this.name}.json`)
	]).then(([image, json_frames]) => {
		this.image  = image;
		this.json_frames = json_frames;
	});
};

c_sprites.prototype.unload = function() {
	unload_image(this.image);
};

c_sprites.prototype.once = function(frame_name) {
	const frame = new c_frame(this.json_frames[frame_name])
	frame.room  = this.room;
	frame.image = this.image;
	frame.next  = null;
	return frame;
};

c_sprites.prototype.loop = function(frame_name) {
	const frame = new c_frame(this.json_frames[frame_name])
	frame.room  = this.room;
	frame.image = this.image;
	frame.next  = frame;
	return frame;
};

c_sprites.prototype.get_frame = function(frame_name) {
	const frame = new c_frame(this.json_frames[frame_name])
	frame.room  = this.room;
	frame.image = this.image;
	return frame;
};
