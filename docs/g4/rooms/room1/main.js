import { c_sound } from '/4500-2021-spring/scripts/audio.js';
import { c_spritesheet } from '/4500-2021-spring/scripts/spritesheets.js';
import { r as room2 } from '/4500-2021-spring/g4/rooms/room2/main.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud  = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);
const ss    = new c_spritesheet('/4500-2021-spring/g4/rooms/room1/test_1');

export const r = {};

r.start = function() {
	Promise.all([ click.fetch(), thud.fetch(), ss.load() ]).then(() => {
		g.room.current_room = r;
		g.canvas.bg_dirty = true;
	});
};

r.update = function(dt) {
	if (g.room.touch_dirty) {
		click.fast_play();
		room2.start();
	}
};

r.draw_bg = function(ctx) {
	ss.draw(ctx, 'bg');
};


// r.on_loaded = () => {
// 	r.bg_frame = ss.frame('bg');
// 	const test_2 = r.goto('test_2');
// 	r.z_goto = r.zone(click).rect(0, 0, 1920, 1080).starts(test_2);
// };

// r.on_start = () => {
// 	r.bg(r.bg_frame);
// 	r.z_goto.start();
// };
