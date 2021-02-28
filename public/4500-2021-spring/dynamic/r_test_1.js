import { c_sprites     } from '/4500-2021-spring/static/c_sprites.js';
import { rooms_to_load } from '/4500-2021-spring/static/c_room.js';

const r  = rooms_to_load.get('test_1');

r.sprites = new c_sprites('test_1');
r.loadables.push(r.sprites);

const click = r.s('/4500-2021-spring/sfx/click.mp3', 1);
const z_big = r.z().sound(click).rect(0, 0, 1920, 1080).starts('test_2');

r.on_start = _ => {
	z_big.start();
};
