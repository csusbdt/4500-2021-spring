import { starts, stops, run_stop_set, run_start_set } from '/4500-2021-spring/static/mixins.js';

export function c_frame(room, sub) {
	this.sub           = sub;
	this.room          = room;
	this.starts        = starts;
	this.stops         = stops;
	this.run_stop_set  = run_stop_set;
	this.run_start_set = run_start_set;
	this.block_goto    = false;

	this.order         = 10;
	this.t             = 0;
	this.duration      = .1;
}

c_frame.prototype.start = function() {
	this.t = 0;
	this.room.insert_updatable(this);
	this.room.insert_drawable(this);	
};

c_frame.prototype.update = function(dt) {
	if (this.duration < 0) return;
	this.t += dt;
	if (this.t < this.duration) {
		return;
	}
	this.room.remove_updatable(this);
	this.room.remove_drawable(this);	
	this.run_stop_set();
	this.run_start_set();
};

c_frame.prototype.draw = function(ctx) {
	this.sub.draw(ctx);
};
