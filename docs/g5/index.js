import '/4500-2021-spring/scripts/room_main.js';
import { get_audio_context } from '/4500-2021-spring/scripts/audio.js';

const phi = 1.6180339887;

function start_audio() {
	const ctx = get_audio_context();

	const w = ctx.createGain();
	w.gain.setTargetAtTime(1, ctx.currentTime, 1);
	w.connect(ctx.destination);

	const o1 = ctx.createOscillator();
	const o2 = ctx.createOscillator();
	const o3 = ctx.createOscillator();
	o1.frequency.value = 60;
	o2.frequency.value = o1.frequency.value * phi;
	o3.frequency.value = o2.frequency.value * phi;

	const a1 = ctx.createOscillator();
	const a2 = ctx.createOscillator();
	const a3 = ctx.createOscillator();
	a1.frequency.value = 4;
	a2.frequency.value = a1.frequency.value * phi;
	a3.frequency.value = a2.frequency.value * phi;

	const g1 = ctx.createGain();
	const g2 = ctx.createGain();
	const g3 = ctx.createGain();

	o1.connect(g1);
	o2.connect(g2);
	o3.connect(g3);

	a1.connect(g1.gain);
	a2.connect(g2.gain);
	a3.connect(g3.gain);

	g1.connect(w);
	g2.connect(w);
	g3.connect(w);

	o1.start();
	o2.start();
	o3.start();
}

const r = {};

r.update = function(dt) {
	if (g.room.touch_dirty) {
		start_audio();
		g.canvas.bg_canvas.style.backgroundColor = 'black';
		r.update = null;
	}
};

g.room.start = () => {
	console.log("g5 started");
	document.body.style.backgroundColor = 'black';
	g.canvas.bg_canvas.style.backgroundColor = 'white';
	g.room.current_room = r;
};
