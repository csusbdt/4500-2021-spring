/*
import { load_image, unload_image } from '/4500-2021-spring/static/utils.js';
import { c_sound } from '/4500-2021-spring/static/c_sound.js';
import { rooms_to_load, get_room } from '/4500-2021-spring/static/c_room.js';
import { load_sprite_sheet } from '/4500-2021-spring/static/c_sprite_sheet.js';
import { z } from '/4500-2021-spring/static/zone.js';

const r   = rooms_to_load.get('test_2');

const z_sayit = z().circle(223, 593, 100);

r.bg      = null;
r.image   = null;
r.sprite_sheet = null;
r.click   = null;
r.music   = null;
r.test_1  = null;

r.load = _ => {
	load_image('bg/test_2.png').then(image => {
		r.bg = image;
	});
	load_sprite_sheet('test_2').then(sprite_sheet => {
		r.sprite_sheet = sprite_sheet;
	});
	r.click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
	r.click.fetch();
	r.music = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', .5);
	get_room('test_1').then(room => r.test_1 = room).catch(e => console.log(e));
};

r.unload = _ => {
	unload_image(r.bg);
	r.bg = null;
	r.click.release_memory();
	r.click = null;
	r.test_2 = null;
};

r.render = dt => {
};

r.on_start = _ => {
	if (r.bg === null) {
		r.load();
	}
	const current_renderer = get_renderer();
	set_renderer(dt => {
		if (r.bg !== null) {
			set_bg(r.bg);
			set_renderer(r.render);
			r.render(dt);
			set_on_touch(r.on_touch);
		} else {
			if (typeof(current_renderer) === 'function') {
				current_renderer(dt);
			}
		}
	});
	set_on_touch(null);
};

r.stop = _ => {
	set_bg(null);
	set_on_touch(null);
	set_renderer(null);
};

r.on_touch = ([x, y]) => {
	r.click.fast_play();
	if ((223 - x) * (223 - x) + (593 - y) * (593 - y) < 100 * 100) {
		if (r.music.is_playing()) r.music.stop(); else r.music.play();
	} else {
		r.test_1.start();
	}
};
*/