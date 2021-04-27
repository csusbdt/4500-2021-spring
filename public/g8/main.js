import { c_room } from '/scripts/rooms.js';

export const r = new c_room('main');

r.hit  = r.sound('/sfx/click.mp3');
r.miss = r.sound('/sfx/thud.mp3');
r.ss   = r.spritesheet('g8');

r.on_load = () => {
	r.bg(r.ss, 'bg');

	r.mouse = r.loop(r.ss, 'mouse1');

	r.l_clouds = r.loop(r.ss, 'clouds', 11);

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

	// touch areas (c_ === circle)
	const c_left   = r.circle( 270, 190, 150);
	const c_right  = r.circle(1700, 180, 150);
	const c_middle = r.circle(1080, 660, 150);
	const r_exit   = r.rect(56, 960, 130, 1043);

	// interactables (z_ === zone)
	const hover_mouse = r.loop(r.ss, 'mouse');
	r.z_left_to_right   = r.zone(hover_mouse).add(c_right);
	r.z_right_to_left   = r.zone(hover_mouse).add(c_left);
	r.z_left_to_middle  = r.zone(hover_mouse).add(c_middle);
	r.z_middle_to_left  = r.zone(hover_mouse).add(c_left);
	r.z_right_to_middle = r.zone(hover_mouse).add(c_middle);
	r.z_middle_to_right = r.zone(hover_mouse).add(c_right);
	const exit_mouse    = r.loop(r.ss, 'exit_mouse').adjust(-100, -50);
	r.z_exit            = r.zone(exit_mouse).add(r_exit);

	r.o_left_to_right.starts(r.l_right).starts(r.z_right_to_left).starts(r.z_right_to_middle);
	r.o_right_to_left.starts(r.l_left).starts(r.z_left_to_right).starts(r.z_left_to_middle);
	r.o_left_to_middle.starts(r.l_middle).starts(r.z_middle_to_left).starts(r.z_middle_to_right);
	r.o_middle_to_left.starts(r.l_left).starts(r.z_left_to_right).starts(r.z_left_to_middle);
	r.o_right_to_middle.starts(r.l_middle).starts(r.z_middle_to_left).starts(r.z_middle_to_right);
	r.o_middle_to_right.starts(r.l_right).starts(r.z_right_to_left).starts(r.z_right_to_middle);

	r.z_left_to_right.stops(r.l_left).starts(r.z_exit).starts(r.o_left_to_right);
	r.z_right_to_left.stops(r.l_right).starts(r.z_exit).starts(r.o_right_to_left);
	r.z_left_to_middle.stops(r.l_left).starts(r.z_exit).starts(r.o_left_to_middle);
	r.z_middle_to_left.stops(r.l_middle).starts(r.z_exit).starts(r.o_middle_to_left);
	r.z_right_to_middle.stops(r.l_right).starts(r.z_exit).starts(r.o_right_to_middle);
	r.z_middle_to_right.stops(r.l_middle).starts(r.z_exit).starts(r.o_middle_to_right);
	r.z_exit.starts(function() { window.location.href = '/'; });
};

r.on_start = () => {
	r.l_clouds.start();
	r.l_left.start();
	r.z_left_to_right.start();
	r.z_left_to_middle.start();
	r.z_exit.start();
};
