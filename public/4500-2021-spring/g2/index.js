import '/4500-2021-spring/scripts/core_main.js';

const white = '#FFFFFF';
const red   = '#FF0000';

let h         = 40;
let x         = -1.2 * 1.618 * h;
let box_color = red;
let bg_color  = white;

const toggle_colors = () => {
	if (box_color === red) {
		box_color = white;
		bg_color  = red;
	} else {
		box_color = red;
		bg_color  = white;
	}
};

g.core.update = dt => {
	x += dt * 1000;
	if (x > g.core.d_w || 1.618 * h > 1.2 * g.core.d_h && x + 1.618 * h > g.core.d_w) {
		h *= 1.618;
		if (h > 1.2 * g.core.d_h) {
			h = 40;
			toggle_colors();
		}
		x = -2 * h;
	}
	g.core.fg_dirty = true;
};

g.core.fg_draw = ctx => {
	if (1.618 * h > 1.2 * g.core.d_h) {
		ctx.fillStyle = box_color;
		ctx.fillRect(0, .5 * (g.core.d_h - h), x, h);
		ctx.fillStyle = bg_color;
		ctx.fillRect(x, .5 * (g.core.d_h - h), g.core.d_w, h);
	} else {
		ctx.fillStyle = bg_color;
		ctx.fillRect(0, 0, g.core.d_w, g.core.d_h);
	}
	ctx.fillStyle = box_color;
	ctx.fillRect(x, .5 * (g.core.d_h - h), 1.618 * h, h);
};

g.core.start = () => {
	console.log("g2 started");
};


/*
import { d_w, d_h, set_renderer, set_event_handler } from '/4500-2021-spring/static/core.js';
import { c_sound } from '/4500-2021-spring/static/c_sound.js';

const music = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', .5);
const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);


set_event_handler(() => {
	click.fast_play();
	toggle_colors();
	if (music.is_playing()) music.stop(); else music.play();
});

set_renderer((ctx, dt) => {
	render(ctx, dt);
	set_renderer(render);
});
*/
