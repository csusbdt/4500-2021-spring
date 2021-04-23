import { c_room } from '/scripts/rooms.js';

export const r = new c_room('main');

function init() {
	r.hit  = g.canvas.sound('/sfx/click.mp3', 1);
	r.miss = g.canvas.sound('/sfx/thud.mp3', 1);
	r.ss   = g.canvas.spritesheet('g8');

		// idle states (l_ === loop)
	r.l_left   = r.ss.seq('top_left');
	r.l_right  = r.ss.seq('top_right');
	r.l_middle = r.ss.seq('bottom_middle');

	// transitions (o_ === once)
	r.o_left_to_right   = r.ss.seq('left_to_right');
	r.o_right_to_left   = r.ss.reverse_seq('left_to_right');
	r.o_left_to_middle  = r.ss.seq('left_to_middle');
	r.o_middle_to_left  = r.ss.reverse_seq('left_to_middle');
	r.o_right_to_middle = r.ss.seq('right_to_middle');
	r.o_middle_to_right = r.ss.reverse_seq('right_to_middle');

	// interactables (z_ === zone)
	r.z_left_to_right   = r.zone().add(r_right);
	r.z_right_to_left   = r.zone().add(r_left);
	r.z_left_to_middle  = r.zone().add(r_middle);
	r.z_middle_to_left  = r.zone().add(r_left);
	r.z_right_to_middle = r.zone().add(r_middle);
	r.z_middle_to_right = r.zone().add(r_right);

	r.o_left_to_right.starts(r.l_right).starts(r.z_right_to_left).starts(r.z_right_to_middle);
	r.o_right_to_left.starts(r.l_left).starts(r.z_left_to_right).starts(r.z_left_to_middle);
	r.o_left_to_middle.starts(r.l_middle).starts(r.z_middle_to_left).starts(r.z_middle_to_right);
	r.o_middle_to_left.starts(r.l_left).starts(r.z_left_to_right).starts(r.z_left_to_middle);
	r.o_right_to_middle.starts(r.l_middle).starts(r.z_middle_to_left).starts(r.z_middle_to_right);
	r.o_middle_to_right.starts(r.l_right).starts(r.z_right_to_left).starts(r.z_right_to_middle);

	// touch areas (r_ === rectangle)
	const r_left   = r.rect(200, 200, 400, 400);
	const r_right  = r.rect(200, 200, 400, 400);
	const r_middle = r.rect(200, 200, 400, 400);

	r.z_left_to_right.starts(r.o_left_to_right);
	r.z_right_to_left.starts(r.o_right_to_left);
	r.z_left_to_middle.starts(r.o_left_to_middle);
	r.z_middle_to_left.starts(r.o_middle_to_left);
	r.z_right_to_middle.starts(r.o_right_to_middle);
	r.z_middle_to_right.starts(r.o_middle_to_right);
}

function start() {
	r.l_left.start();
	r.z_left_to_right.start();
	r.z_left_to_middle.start();
	g.room.set_room(r);
}

r.start = function() {
	if (r.loaded) {
		start();
	} else {
		Promise.all([
			click.fetch(), 
			thud.fetch(), 
			ss1.load(), 
			ss2.load()
		]).then(() => {
			r.loaded = true;
			init();
			start();
		});
	}
};
