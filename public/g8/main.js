const click = g.canvas.sound('/sfx/click.mp3', 1);
const thud  = g.canvas.sound('/sfx/thud.mp3', 1);
const ss    = g.canvas.spritesheet('/g8/g8');

export const r = {};

// idle states (l_ === loop)
let l_top_left        = null;
let l_top_right       = null;
let l_bottom_middle   = null;

// transitions (o_ === once)
let o_left_to_right   = null;
let o_right_to_left   = null;
let o_left_to_middle  = null;
let o_middle_to_left  = null;
let o_right_to_middle = null;
let o_middle_to_right = null;

// state (set to a loop or a once)
let anim = null;

// touch areas (r_ === rectangle)
let r_top_left        = g.room.rect(200, 200, 400, 400);
let r_top_right       = g.room.rect(200, 200, 400, 400);
let r_bottom_middle   = g.room.rect(200, 200, 400, 400);

// interactables (z_ === zone)
let z_left_to_right   = null;
let z_right_to_left   = null;
let z_left_to_middle  = null;
let z_middle_to_left  = null;
let z_right_to_middle = null;
let z_middle_to_right = null;

function init() {
	l_left  = ss1.seq('left');
	l_right = ss1.seq('right');
	o_right_to_left = ss1.seq('w');
	o_right_to_left.on_end = () => {
		pc = l_left;
	};
	o_left_to_right = ss1.seq('w');
	o_left_to_right.reverse();
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
