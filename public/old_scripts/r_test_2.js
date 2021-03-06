import { rooms } from '/4500-2021-spring/static/rooms.js';
import { c_sound } from '/4500-2021-spring/static/c_sound.js';

const r     = rooms.get('test_2');
const ss    = r.spritesheet('test_2');
const thud  = r.sound('/4500-2021-spring/sfx/thud.mp3', 1);
const click = r.sound('/4500-2021-spring/sfx/click.mp3', 1);

r.on_loaded = () => {
	r.bg_frame    = ss.frame('bg');
	r.sayit       = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', 1);
	r.l_red       = r.loop(ss, 'red_region');
	
	const test_1  = r.goto('test_1');

	const o_apple = r.once(ss, 'apple_region').starts(r.sayit).starts(r.l_red);
	const o_big   = r.once(ss, 'big_region'  );
	const o_white = r.once(ss, 'white_region').starts(test_1);

	r.sayit.on_end = () => { r.l_red.stop(); };

	r.z_apple = r.zone(click).noclear().starts(o_apple);
	r.z_big   = r.zone(click).noclear().starts(o_big  );
	r.z_white = r.zone(click).noclear().starts(o_white);
	r.z_bg    = r.zone(thud).noclear().ord(11);

	r.z_apple
		.triangle(1448, 830, 1260, 852, 1360, 657)
		.triangle(1448, 830, 1588, 683, 1360, 657)
		.triangle(1490, 553, 1588, 683, 1360, 657)
		.triangle(1624, 577, 1588, 683, 1530, 603);
	r.z_big.rect(60, 133, 1060, 411);
	r.z_white.circle(223, 593, 100);
	r.z_bg.rect(0, 0, 1920, 1080);
};

r.on_start = () => {
	r.bg(r.bg_frame);

	if (r.sayit.is_playing()) {
		r.l_red.start();
	}

	r.z_apple.start();
	r.z_big.start();
	r.z_white.start();
	r.z_bg.start();
};

/*
	r.music = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', .5);

	if ((223 - x) * (223 - x) + (593 - y) * (593 - y) < 100 * 100) {
		if (r.music.is_playing()) r.music.stop(); else r.music.play();
	} else {
		r.test_1.start();
	}
*/

	// .polygon(
	// 	[1280, 840], 
	// 	[1340, 683],
	// 	[1484, 546],
	// 	[1534, 591],
	// 	[1607, 581],
	// 	[1593, 688],
	// 	[1448, 826]
	// )
