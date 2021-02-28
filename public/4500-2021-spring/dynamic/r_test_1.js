import { c_sound       } from '/4500-2021-spring/static/c_sound.js';
import { c_sprites     } from '/4500-2021-spring/static/c_sprites.js';
import { rooms_to_load } from '/4500-2021-spring/static/c_room.js';

const r  = rooms_to_load.get('test_1');

//r.test_2 = null;
r.click   = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
r.sprites = new c_sprites('test_1');
r.loadables.push(r.click);
r.loadables.push(r.sprites);

const z_big = r.z().sound(r.click).rect(0, 0, 1920, 1080);

r.on_start = _ => {
	z_big.start();
};
