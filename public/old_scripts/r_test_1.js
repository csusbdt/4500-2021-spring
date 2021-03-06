import { rooms } from '/4500-2021-spring/static/rooms.js';

const r     = rooms.get('test_1');
const ss    = r.spritesheet('test_1');
const click = r.sound('/4500-2021-spring/sfx/click.mp3', 1);

r.on_loaded = () => {
	r.bg_frame = ss.frame('bg');
	const test_2 = r.goto('test_2');
	r.z_goto = r.zone(click).rect(0, 0, 1920, 1080).starts(test_2);
};

r.on_start = () => {
	r.bg(r.bg_frame);
	r.z_goto.start();
};
