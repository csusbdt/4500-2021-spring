import { c_sound } from '/4500-2021-spring/scripts/audio.js';
import { c_spritesheet } from '/4500-2021-spring/scripts/spritesheets.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud  = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);
const ss    = new c_spritesheet('/4500-2021-spring/g4/rooms/room2/test_2');

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
	if (g.room.touch_dirty) {
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
