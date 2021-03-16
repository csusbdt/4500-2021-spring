import { c_sound } from '/4500-2021-spring/scripts/audio.js';
import { start_room } from '/4500-2021-spring/g3/rooms/start.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud  = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);

const r = {};

export const end_room = r;

r.update = function(dt) {
	if (g.room.touch_dirty) {
		click.fast_play();
		g.room.current_room = start_room;
		g.canvas.fg_dirty = true;
	}
};

r.draw_fg = function(ctx) {
	g.canvas.clear_bg();
	g.canvas.clear_fg();
	ctx.fillStyle = '#0000FF';
	ctx.beginPath();
	ctx.fillRect(600, 600, 200, 200);
};
