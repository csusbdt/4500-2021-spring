import { starts, stops, run_stop_set, run_start_set } from '/4500-2021-spring/static/mixins.js';

export function c_once(room) {
	this.room           = room;
	this.starts         = starts;
	this.stops          = stops;
	this.run_stop_set   = run_stop_set;
	this.run_start_set  = run_start_set;
	this.block_goto     = true;
	this.order          = 10;
	this.frame_duration = .1;
	this.frames         = [];
	this.frame_index    = -1;
	this.t              = 0;
}

c_once.prototype.noblock = function() {
	this.block_goto = false;
	return this;
};

c_once.prototype.ord = function(order) {
	this.order = order;
	return this;
};

c_once.prototype.dur = function(frame_duration) {
	this.frame_duration = frame_duration;
	return this;
};

c_once.prototype.add = function(frame) {
	this.frames.push(frame);
	return this;
};

c_once.prototype.start = function() {
	if (this.frames.length === 0) throw new Error('no frames');
	this.frame_index = 0;
	this.t = 0;
	this.room.insert_updatable(this);
	this.room.insert_drawable(this);	
};

c_once.prototype.update = function(dt) {
	this.t += dt;
	if (this.t < this.frame_duration) {
		return;
	} else {
		this.t = 0;
		++this.frame_index;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0; // this fix a bug when clicking fast but don't understand
			this.room.remove_updatable(this);
			this.room.remove_drawable(this);
			this.run_stop_set();
			this.run_start_set();
		}
	}
};

c_once.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx);
};
