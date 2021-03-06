const click = g.canvas.sound('/sfx/click.mp3', 1);
const thud  = g.canvas.sound('/sfx/thud.mp3', 1);
const ss1   = g.canvas.spritesheet('/g7/g7_1');
const ss2   = g.canvas.spritesheet('/g7/g7_2');

export const r = {};

let f_fg1   = null;
let f_fg2   = null;
let f_fg3   = null;
let l_right = null;
let l_left  = null;
let o_right_to_left = null;
let o_left_to_right = null;
let pc = null;

function init() {
	f_fg1 = ss2.frame('fg1');
	f_fg2 = ss2.frame('fg2');
	f_fg3 = ss2.frame('fg3');
	l_left  = ss1.seq('left');
	l_right = ss1.seq('right');
	o_right_to_left = ss1.seq('w');
	o_right_to_left.on_end = () => {
		pc = l_left;
	};
	o_left_to_right = ss1.seq('w');
	o_left_to_right.frames.reverse();
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
	if (pc === l_right && g.room.touch_point) {
		click.fast_play();
		pc = o_right_to_left;
		g.canvas.fg_dirty = true;
	} else if (pc === l_left && g.room.touch_point) {
		click.fast_play();
		pc = o_left_to_right;
		g.canvas.fg_dirty = true;
	} else {
		if (g.room.touch_point) {
			thud.fast_play();
		}
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
