import { set_renderer, 
		 get_renderer,
		 set_on_touch, 
		 set_bg         } from '/4500-2021-spring/static/core.js';
import { load_image,
		 unload_image   } from '/4500-2021-spring/static/utils.js';
import { c_sound        } from '/4500-2021-spring/static/c_sound.js';
import { rooms_to_load,
		 get_room       } from '/4500-2021-spring/static/c_room.js';

const r  = rooms_to_load.get('test_1');

r.bg     = null;
r.click  = null;
r.test_2 = null;

r.load = _ => {
	load_image('bg/test_1.png').then(image => {
		r.bg = image;
	});
	r.click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
	r.click.fetch();
	get_room('test_2')
		.then(room => r.test_2 = room)
		.catch(e => console.log(e));
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

r.start = _ => {
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

r.on_touch = _ => {
	r.click.fast_play();
	r.test_2.start();
};
