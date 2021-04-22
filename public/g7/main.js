import { c_sound } from '/scripts/audio.js';
import { c_spritesheet } from '/scripts/spritesheets.js';
//import { c_loop } from '/scripts/loops.js';

const click = new c_sound('/sfx/click.mp3', 1);
const thud  = new c_sound('/sfx/thud.mp3', 1);
const ss1   = new c_spritesheet('/g7/g7_1');
const ss2   = new c_spritesheet('/g7/g7_2');

export const r = {};

let l_right = null;
let l_left  = null;
let f_fg1   = null;
let f_fg2   = null;
let f_fg3   = null;

function init() {
	l_left  = ss1.loop(['left1', 'left2', 'left3']);
	l_right = ss1.loop(['right1', 'right2', 'right3']);
	f_fg1 = ss2.frame('fg1');
	f_fg2 = ss2.frame('fg2');
	f_fg3 = ss2.frame('fg3');
}

r.start = function() {
	Promise.all([ click.fetch(), thud.fetch(), ss1.load(), ss2.load() ]).then(() => {
		g.room.current_room = r;
		g.canvas.bg_dirty = true;
		init();
	});
};

r.update = function(dt) {
	l_left.update(dt);
	l_right.update(dt);
	if (g.room.touch_dirty) {
		click.fast_play();
//		g.canvas.fg_dirty = true;
	}
};

r.draw_bg = function(ctx) {
	ss1.draw(ctx, 'bg');
};

r.draw_fg = function(ctx) {
	l_left.draw(ctx);
	l_right.draw(ctx);
	f_fg1.draw(ctx);
	f_fg2.draw(ctx);
	f_fg3.draw(ctx);
};
