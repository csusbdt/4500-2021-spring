import { c_sound } from '/scripts/audio.js';
import { c_spritesheet } from '/scripts/spritesheets.js';

const click = new c_sound('/sfx/click.mp3', 1);
const thud  = new c_sound('/sfx/thud.mp3', 1);
const ss1   = new c_spritesheet('/g7/g7_1');
const ss2   = new c_spritesheet('/g7/g7_2');

export const r = {};

let f_fg1   = null;
let f_fg2   = null;
let f_fg3   = null;
let l_right = null;
let l_left  = null;
let o_right_to_left = null;
let o_left_to_right = null;
let pc = null;

function make_names(prefix, end) {
	const names = [];
	for (let i = 1; i <= end; ++i) {
		if (i < 10) {
			names.push(prefix + '0' + i);
		} else if (i < 100) {
			names.push(prefix + i);
		} else {
			throw new Error();
		}
	}
	return names;
}

function init() {
	f_fg1 = ss2.frame('fg1');
	f_fg2 = ss2.frame('fg2');
	f_fg3 = ss2.frame('fg3');
	l_left  = ss1.seq(['left1', 'left2', 'left3']);
	l_right = ss1.seq(['right1', 'right2', 'right3']);
	o_right_to_left = ss1.seq(make_names('w', 24));
	o_right_to_left.on_end = () => {
		pc = l_left;
	};
	o_left_to_right = ss1.seq(make_names('w', 24).reverse());
	o_left_to_right.on_end = () => {
		pc = l_right;
	};
	pc = l_right;
}

r.start = function() {
	Promise.all([ click.fetch(), thud.fetch(), ss1.load(), ss2.load() ]).then(() => {
		g.room.current_room = r;
		g.canvas.bg_dirty = true;
		init();
	});
};

r.update = function(dt) {
	if (pc === l_right && g.room.touch_dirty) {
		click.fast_play();
		pc = o_right_to_left;
		g.canvas.fg_dirty = true;
	} else if (pc === l_left && g.room.touch_dirty) {
		click.fast_play();
		pc = o_left_to_right;
		g.canvas.fg_dirty = true;
	} else {
		pc.update(dt);
	}
};

r.draw_bg = function(ctx) {
	ss1.draw(ctx, 'bg');
};

r.draw_fg = function(ctx) {
	pc.draw(ctx);
	f_fg1.draw(ctx);
	f_fg2.draw(ctx);
	f_fg3.draw(ctx);
};
