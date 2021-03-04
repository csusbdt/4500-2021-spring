//import { insert, remove } from '/4500-2021-spring/static/utils.js';
import { starts, stops, run_stop_set, run_start_set } from '/4500-2021-spring/static/mixins.js';


export function c_frame(sprites, name) {
	this.sprites       = sprites;
	this.name          = name;
	this.room          = sprites.room;
	this.f             = sprites.json_frames[name];
	this.starts        = starts;
	this.stops         = stops;
	this.run_stop_set  = run_stop_set;
	this.run_start_set = run_start_set;
	this.block_goto    = false;

	this.order         = 10;
	this.t             = 0;    // elapsed seconds
	this.duration      = .1;   // seconds
	this.loop          = false;
}

c_frame.prototype.start = function() {
	this.t = 0;
	this.sprites.room.insert_updatable(this);
	this.sprites.room.insert_drawable(this);	
};

c_frame.prototype.update = function(dt) {
	if (this.loop) return;
	this.t += dt;
	if (this.t < this.duration) {
		return;
	}
	this.sprites.room.remove_updatable(this);
	this.sprites.room.remove_drawable(this);	
//	remove(this.sprites.room.updatables, this);
//	remove(this.sprites.room.drawables, this);
	this.run_stop_set();
	this.run_start_set();
//	if (this.next !== null) return;
};

c_frame.prototype.draw = function(ctx) {
	ctx.drawImage(
		this.sprites.image,
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
