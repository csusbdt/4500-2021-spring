export function c_loop(frames) {
	this.frames         = frames;
	this.frame_index    = 0;
	this.t              = 0;
//	this.room           = room;
//	this.block_goto     = false;
	this.order          = 10;
	this.frame_duration = .1;
}

c_loop.prototype.ord = function(order) {
	this.order = order;
	return this;
};

c_loop.prototype.dur = function(frame_duration) {
	this.frame_duration = frame_duration;
	return this;
};

c_loop.prototype.add = function(frame) {
	this.frames.push(frame);
	return this;
};

// c_loop.prototype.stop = function() {
// 	this.frame_index = 0;
// 	this.t = 0;
// 	this.room.remove_updatable(this);
// 	this.room.remove_drawable(this);	
// };

// c_loop.prototype.start = function() {
// 	if (this.frames.length === 0) throw new Error('no frames');
// 	this.frame_index = 0;
// 	this.t = 0;
// 	this.room.insert_updatable(this);
// 	this.room.insert_drawable(this);
// };

c_loop.prototype.update = function(dt) {
	this.t += dt;
	if (this.t < this.frame_duration) {
		return;
	} else {
		this.t = 0;
		++this.frame_index;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
		}
		g.canvas.fg_dirty = true;
	}
};

c_loop.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx);
};
