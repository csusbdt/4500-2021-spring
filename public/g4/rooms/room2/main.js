import { c_spritesheet } from '/scripts/spritesheets.js';

const click = g.canvas.sound('/sfx/click.mp3', 1);
const thud  = g.canvas.sound('/sfx/thud.mp3', 1);
const ss    = new c_spritesheet('/g4/rooms/room2/test_2');

export const r = {};

let l_red = null;

function init() {
	l_red = r.loop(ss, 'red_region');
}

r.start = function() {
	Promise.all([ click.fetch(), thud.fetch(), ss.load() ]).then(() => {
		g.room.current_room = r;
		g.canvas.bg_dirty = true;
	});
};

r.update = function(dt) {
	if (g.room.touch_point) {
		click.fast_play();
		g.canvas.fg_dirty = true;
	}
};

r.draw_bg = function(ctx) {
	ss.draw(ctx, 'bg');
};

r.draw_fg = function(ctx) {
	ss.draw(ctx, 'apple_region');
};
