import { c_room } from '/scripts/rooms.js';

export const r = new c_room('main');

r.hit  = r.sound('/sfx/click.mp3');
r.miss = r.sound('/sfx/thud.mp3');
r.ss   = r.spritesheet('g8');

r.on_load = () => {
	// idle states (l_ === loop)
	r.l_left   = r.loop(r.ss, 'left');
	r.l_right  = r.loop(r.ss, 'right');
	r.l_middle = r.loop(r.ss, 'middle');

	// transitions (o_ === once)
	r.o_left_to_right   = r.once(r.ss, 'left_right');
	r.o_right_to_left   = r.once(r.ss, 'left_right').reverse();
	r.o_left_to_middle  = r.once(r.ss, 'left_middle');
	r.o_middle_to_left  = r.once(r.ss, 'left_middle').reverse();
	r.o_middle_to_right = r.once(r.ss, 'middle_right');
	r.o_right_to_middle = r.once(r.ss, 'middle_right').reverse();

	// touch areas (r_ === rectangle)
	const r_left   = r.rect(200, 200, 400, 400);
	const r_right  = r.rect(200, 200, 400, 400);
	const r_middle = r.rect(200, 200, 400, 400);

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

	r.z_left_to_right.starts(r.o_left_to_right);
	r.z_right_to_left.starts(r.o_right_to_left);
	r.z_left_to_middle.starts(r.o_left_to_middle);
	r.z_middle_to_left.starts(r.o_middle_to_left);
	r.z_right_to_middle.starts(r.o_right_to_middle);
	r.z_middle_to_right.starts(r.o_middle_to_right);
}

r.on_start = () => {
	r.l_left.start();
	r.z_left_to_right.start();
	r.z_left_to_middle.start();
}
