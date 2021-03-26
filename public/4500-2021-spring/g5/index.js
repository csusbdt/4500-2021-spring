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
	const o4 = ctx.createOscillator();
	o1.frequency.value = 60;
	o2.frequency.value = o1.frequency.value * phi;
	o3.frequency.value = o2.frequency.value * phi;
	o4.frequency.value = o3.frequency.value * phi;

	const a1 = ctx.createOscillator();
	const a2 = ctx.createOscillator();
	const a3 = ctx.createOscillator();
	const a4 = ctx.createOscillator();
	a1.frequency.value = 2;
	a2.frequency.value = a1.frequency.value * phi;
	a3.frequency.value = a2.frequency.value * phi;
	a4.frequency.value = a3.frequency.value * phi;

	const p1 = ctx.createOscillator();
	const p2 = ctx.createOscillator();
	const p3 = ctx.createOscillator();
	const p4 = ctx.createOscillator();
	p1.frequency.value = 1 / 10;
	p2.frequency.value = p1.frequency.value / phi;
	p3.frequency.value = p2.frequency.value / phi;
	p4.frequency.value = p3.frequency.value / phi;

	const oa1 = ctx.createGain();
	const oa2 = ctx.createGain();
	const oa3 = ctx.createGain();
	const oa4 = ctx.createGain();

	const oap1 = ctx.createGain();
	const oap2 = ctx.createGain();
	const oap3 = ctx.createGain();
	const oap4 = ctx.createGain();

	o1.connect(oa1);
	o2.connect(oa2);
	o3.connect(oa3);
	o4.connect(oa4);

	a1.connect(oa1.gain);
	a2.connect(oa2.gain);
	a3.connect(oa3.gain);
	a4.connect(oa4.gain);

	oa1.connect(oap1);
	oa2.connect(oap2);
	oa3.connect(oap3);
	oa4.connect(oap4);

	p1.connect(oap1.gain);
	p2.connect(oap2.gain);
	p3.connect(oap3.gain);
	p4.connect(oap4.gain);

	oap1.connect(w);
	oap2.connect(w);
	oap3.connect(w);
	oap4.connect(w);

	o1.start();
	o2.start();
	o3.start();
	o4.start();
	a1.start();
	a2.start();
	a3.start();
	a4.start();
	p1.start();
	p2.start();
	p3.start();
	p4.start();
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
