
function c_frame(sx, sy, w, h, dx, dy) {
	this.sx       = sx;
	this.sy       = sy;
	this.w        = w;
	this.h        = h;
	this.dx       = dx;
	this.dy       = dy;
	this.duration = .1;
	this.next     = null;
	this.on_end   = null;
}
