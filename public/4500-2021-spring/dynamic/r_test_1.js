import { rooms } from '/4500-2021-spring/static/c_room.js';

const r = rooms.get('test_1');

const ss    = r.spritesheet('test_1');
const click = r.sound('/4500-2021-spring/sfx/click.mp3', 1);

r.on_start = () => {
	r.set_bg(ss, 'bg');
	r.zone(click).rect(0, 0, 1920, 1080).starts('test_2').start();
};
