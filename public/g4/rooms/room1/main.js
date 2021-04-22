import { c_spritesheet } from '/scripts/spritesheets.js';
import { r as room2 } from '/g4/rooms/room2/main.js';

const click = g.canvas.sound('/sfx/click.mp3', 1);
const thud  = g.canvas.sound('/sfx/thud.mp3', 1);
const ss    = new c_spritesheet('/g4/rooms/room1/test_1');

export const r = {};

r.start = function() {
	Promise.all([ click.fetch(), thud.fetch(), ss.load() ]).then(() => {
		g.room.current_room = r;
		g.canvas.bg_dirty = true;
	});
};

r.update = function(dt) {
	if (g.room.touch_point) {
		click.fast_play();
		room2.start();
	}
};

r.draw_bg = function(ctx) {
	ss.draw(ctx, 'bg');
};
