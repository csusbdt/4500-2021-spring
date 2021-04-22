export function c_loop(frames) {
	this.frames         = frames;
	this.frame_index    = 0;
	this.t              = 0;
}

c_loop.prototype.update = function(dt) {
	let frame = this.frames[this.frame_index];
	this.t += dt;
	if (this.t < frame.d) {
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
