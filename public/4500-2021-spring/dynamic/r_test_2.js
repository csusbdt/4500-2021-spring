import { c_sprites     } from '/4500-2021-spring/static/c_sprites.js';
import { rooms_to_load } from '/4500-2021-spring/static/c_room.js';

const r  = rooms_to_load.get('test_2');

r.sprites = new c_sprites('test_2');
r.loadables.push(r.sprites);

const thud = r.s('/4500-2021-spring/sfx/thud.mp3', 1);
const z_big = r.z().sound(thud).rect(0, 0, 1920, 1080).starts('test_1');

r.on_start = _ => {
	z_big.start();
};

/*
	r.music = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', .5);

	if ((223 - x) * (223 - x) + (593 - y) * (593 - y) < 100 * 100) {
		if (r.music.is_playing()) r.music.stop(); else r.music.play();
	} else {
		r.test_1.start();
	}

*/
