import { rooms_to_load } from '/4500-2021-spring/static/c_room.js';

const r = rooms_to_load.get('test_1');

const s1 = r.sprites('test_1');
const click = r.sound('/4500-2021-spring/sfx/click.mp3', 1);

r.on_start = _ => {
	r.bg = s1.get_frame('bg');
	const z_big = r.zone(click).rect(0, 0, 1920, 1080).starts('test_2');
	z_big.start();
};
