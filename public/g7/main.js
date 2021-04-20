import { c_sound } from '/scripts/audio.js';
import { c_spritesheet } from '/scripts/spritesheets.js';

const click = new c_sound('/sfx/click.mp3', 1);
const thud  = new c_sound('/sfx/thud.mp3', 1);
const ss1   = new c_spritesheet('/g7/g7_1');
const ss2   = new c_spritesheet('/g7/g7_2');

export const r = {};

//let l_red = null;

function init() {
//	l_red = r.loop(ss, 'red_region');
}

r.start = function() {
	Promise.all([ click.fetch(), thud.fetch(), ss1.load(), ss2.load() ]).then(() => {
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
	ss1.draw(ctx, 'bg');
};

r.draw_fg = function(ctx) {
//	ss.draw(ctx, 'apple_region');
};
