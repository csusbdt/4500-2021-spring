import { set_renderer, 
		 set_on_touch, 
		 set_bg         } from '/4500-2021-spring/static/core.js';
import { load_image,
		 unload_image,
		 message        } from '/4500-2021-spring/static/utils.js';
import { c_sound        } from '/4500-2021-spring/static/c_sound.js';
import { get_room       } from '/4500-2021-spring/static/c_room.js';

const r  = get_room('test_1');

r.click  = null;
r.bg     = null;
r.test_2 = get_room('test_2');

r.load = _ => {
	r.click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
	return Promise.all([
		r.click.fetch(),
		load_image('bg/test_1.png').then(image => {
			r.bg = image;
		})
	])
};

r.unload = _ => {
	r.click.release_memory();
	r.click = null;
	unload_image(r.bg);
	r.bg = null;
};

r.start = _ => {
	set_bg(r.bg);
	set_renderer(r.render);
	set_on_touch(r.on_touch);
};

r.on_touch = _ => {
	set_on_touch(null);
	r.click.fast_play();
	get_room('test_2')
	.create()
	.load()
	.start()
	.then(r.unload)
	.catch(reason => {
		set_on_touch(r.on_touch);
		message(reason);
	});
};

r.render = dt => {
};
