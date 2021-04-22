export function c_frame_sequence(frames) {
	this.frames      = frames;
	this.frame_index = 0;
	this.t           = 0;
	this.on_end      = null;
}

c_frame_sequence.prototype.update = function(dt) {
	this.t += dt;
	if (this.t < this.frames[this.frame_index].d) {
		return;
	} else {
		g.canvas.fg_dirty = true;
		this.t = 0;
		++this.frame_index;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
			if (this.on_end !== null) {
				this.on_end();
			}
		}
	}
};

c_frame_sequence.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx);
};
