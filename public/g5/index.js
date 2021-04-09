import '/scripts/room_main.js';
import { get_audio_context } from '/scripts/audio.js';

const phi = 1.6180339887;

let audio_context = null;
let w = null;
let timeout = null;

function pause_audio() {
	if (timeout) return;
	if (audio_context.state !== 'running') return;
	const time_constant = 0.3;
	w.gain.setTargetAtTime(0, audio_context.currentTime, time_constant);
	timeout = setTimeout(() => { 
		audio_context.suspend();
		timeout = null;
	}, 3 * time_constant);
}

function resume_audio() {
	if (timeout) return;
	if (audio_context.state === 'running') return;
	audio_context.resume();
	const time_constant = 0.3;
	w.gain.setTargetAtTime(1, audio_context.currentTime, time_constant);
}

function start_audio() {
	w = audio_context.createGain();
	w.gain.setTargetAtTime(1, audio_context.currentTime, 1);
	w.connect(audio_context.destination);

	const w1 = audio_context.createGain();
	const w2 = audio_context.createGain();
	const w3 = audio_context.createGain();
	const w4 = audio_context.createGain();

	w1.gain.value = 1;
	w2.gain.value = .8;
	w3.gain.value = .4;
	w4.gain.value = .1;

	w1.connect(w);
	w2.connect(w);
	w3.connect(w);
	w4.connect(w);

	const o1 = audio_context.createOscillator();
	const o2 = audio_context.createOscillator();
	const o3 = audio_context.createOscillator();
	const o4 = audio_context.createOscillator();
	o1.frequency.value = 80;
	o2.frequency.value = o1.frequency.value * phi;
	o3.frequency.value = o2.frequency.value * phi;
	o4.frequency.value = o3.frequency.value * phi;

	const a1 = audio_context.createOscillator();
	const a2 = audio_context.createOscillator();
	const a3 = audio_context.createOscillator();
	const a4 = audio_context.createOscillator();
	a1.frequency.value = 3;
	a2.frequency.value = 4;
	a3.frequency.value = 5;
	a4.frequency.value = 6;

	const p1 = audio_context.createOscillator();
	const p2 = audio_context.createOscillator();
	const p3 = audio_context.createOscillator();
	const p4 = audio_context.createOscillator();
	p4.frequency.value = 1 / 10;
	p3.frequency.value = p4.frequency.value / phi;
	p2.frequency.value = p3.frequency.value / phi;
	p1.frequency.value = p2.frequency.value / phi;

	const oa1 = audio_context.createGain();
	const oa2 = audio_context.createGain();
	const oa3 = audio_context.createGain();
	const oa4 = audio_context.createGain();

	const oap1 = audio_context.createGain();
	const oap2 = audio_context.createGain();
	const oap3 = audio_context.createGain();
	const oap4 = audio_context.createGain();

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

	oap1.connect(w1);
	oap2.connect(w2);
	oap3.connect(w3);
	oap4.connect(w4);

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
let started = false;

r.update = function(dt) {
	if (g.room.touch_dirty) {
		if (!started) {
			audio_context = get_audio_context();
			if (audio_context === null) return;
			start_audio();
			g.canvas.bg_canvas.style.backgroundColor = 'black';
			started = true;
		} else if (timeout) {
			clearTimeout(timeout);
			timeout = null;
			g.canvas.bg_canvas.style.backgroundColor = 'black';
		} else if (audio_context.state === 'running') {
			pause_audio();
			g.canvas.bg_canvas.style.backgroundColor = 'white';
		} else {
			resume_audio();
			g.canvas.bg_canvas.style.backgroundColor = 'black';
		}
	}
};

g.room.start = () => {
	console.log("g5 started");
	document.body.style.backgroundColor = 'black';
	g.canvas.bg_canvas.style.backgroundColor = 'white';
	g.room.current_room = r;
};
