import { c_sound } from '/4500-2021-spring/scripts/audio.js';
import { r as end_room } from '/4500-2021-spring/g3/rooms/end.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);

export const r = {};

r.update = function(dt) {
	if (g.room.touch_dirty) {
		click.fast_play();
		g.room.current_room = end_room;
		g.canvas.fg_dirty = true;
	}
};

r.draw_fg = function(ctx) {
	ctx.fillStyle = '#00FF00';
	ctx.fillRect(400, 400, 200, 200);
};
