import { rooms_to_load } from '/4500-2021-spring/static/c_room.js';

const r  = rooms_to_load.get('test_2');

const s1 = r.sprites('test_2');

const thud  = r.sound('/4500-2021-spring/sfx/thud.mp3', 1);
const click = r.sound('/4500-2021-spring/sfx/click.mp3', 1);
//const z_big = r.zone(thud).rect(0, 0, 1920, 1080).starts('test_1');


r.on_start = _ => {
	r.bg = s1.get_frame('bg');

	const o_apple = s1.get_frame('apple_region');
	o_apple.next  = null;
	r.z_apple = r.zone().sound(click).rect(0, 0, 1920, 1080).starts(o_apple);
	r.z_apple.clear_zones = false;
	r.z_apple.start();
};

/*
	.triangle(1448, 830, 1260, 852, 1360, 657)
	.triangle(1448, 830, 1588, 683, 1360, 657)
	.triangle(1490, 553, 1588, 683, 1360, 657)
	.triangle(1624, 577, 1588, 683, 1530, 603)

	r.music = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', .5);

	if ((223 - x) * (223 - x) + (593 - y) * (593 - y) < 100 * 100) {
		if (r.music.is_playing()) r.music.stop(); else r.music.play();
	} else {
		r.test_1.start();
	}

*/
