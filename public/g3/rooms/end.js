const click = g.canvas.sound('/sfx/click.mp3', 1);

export const r = {};

let pos_x = 0;
let pos_y = 0;

r.update = function(dt) {
	if (g.room.touch_point) {
		click.fast_play();
		pos_x = Math.floor(Math.random() * 800);
		pos_y = Math.floor(Math.random() * 500);
		g.canvas.fg_dirty = true;
	}
};

r.draw_fg = function(ctx) {
	ctx.fillStyle = '#0000FF';
	ctx.fillRect(600, 600, 200, 100);
	ctx.fillRect(pos_x, pos_y, 300, 180);
};
