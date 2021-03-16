import { c_sound } from '/4500-2021-spring/scripts/audio.js';
import { end_room } from '/4500-2021-spring/g3/rooms/end.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud  = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);

const r = {};

export const start_room = r;

r.update = function(dt) {
	if (g.room.touch_dirty) {
		click.fast_play();
		g.room.current_room = end_room;
		g.canvas.fg_dirty = true;
	}
};

r.draw_fg = function(ctx) {
	g.canvas.clear_fg();
	ctx.fillStyle = '#00FF00';
	ctx.beginPath();
	ctx.fillRect(400, 400, 200, 200);
};
