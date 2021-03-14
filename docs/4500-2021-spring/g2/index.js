import '/4500-2021-spring/scripts/canvas_main.js';
import { c_sound } from '/4500-2021-spring/scripts/audio.js';

function random_color() {
	const n = Math.floor(Math.random() * Math.floor(0xFFFFFF));
	return "#" + n.toString(16).padStart(6, '0');
}

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud  = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);

let time_remaining = 2;

g.canvas.on_touch = ([x, y]) => {
	click.fast_play();
	g.canvas.fg_dirty = true;
};

g.canvas.update = dt => {
	time_remaining -= dt;
	if (time_remaining <= 0) {
		time_remaining = 2;
		document.body.style.backgroundColor = random_color();
	}
};

g.canvas.draw_bg = ctx => {
	g.canvas.clear_bg();
};

g.canvas.draw_fg = ctx => {
	ctx.fillStyle = document.body.style.backgroundColor;
	ctx.fillRect(0, 0, g.canvas.d_w, g.canvas.d_h);
};

g.canvas.start = () => {
	console.log("g2 started");
	document.body.addEventListener(
		'mousedown', 
		e => {
			e.preventDefault();
			e.stopPropagation();
			thud.fast_play();
		}, 
		{ capture: false, once: false }
	);
	document.body.addEventListener(
		'touchstart', 
		e => {
			e.preventDefault();
			e.stopPropagation();
			thud.fast_play();
		}, 
		{ capture: false, once: false }
	);
};
