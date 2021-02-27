

// function c_once(frames) {
// 	this.frames = frames;
// }


function c_once(image, frames) {
	this.image  = image;
	this.frames = frames;
	this.seconds_per_frame = 8 / 60;
	this.index  = 0;
	this.t      = 0;
}

c_once.prototype.update = function(dt) {
	this.t += dt;
	if (this.t > this.seconds_per_frame) {
		this.t = 0;
		++this.index;
		if (this.index === this.frames.length) {
			// remove from loop and do end of life activity
		}
	}
};

c_once.prototype.draw = function(ctx) {
	const f = this.frames[this.index];
	ctx.drawImage(
		this.image,
		f.tx_x,
		f.tx_y,
		f.tx_w,
		f.tx_h,
		f.rm_x + this.offset_x,
		f.rm_y + this.offset_y,
		f.tx_w,
		f.tx_h
	);
};
