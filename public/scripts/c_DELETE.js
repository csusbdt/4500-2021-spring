export function c_once(frames) {
	this.frames         = frames;
	this.frame_index    = 0;
	this.t              = 0;
}

c_once.prototype.update = function(dt) {
	if (this.frame_index >= this.frames.length) {
		throw new Error('bad frame_index');
	}
	let frame = this.frames[this.frame_index];
	this.t += dt;
	if (this.t < frame.d) {
		return;
	} else {
		g.canvas.fg_dirty = true;
		this.t = 0;
		++this.frame_index;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
			if (this.on_end !== 'undefined') {
				this.on_end();
			}
		}
	}
};

c_once.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx);
};
