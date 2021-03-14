import '/4500-2021-spring/scripts/canvas_main.js';
import { get_audio_context } from '/4500-2021-spring/scripts/audio.js';

let current_room = null;

function get_room(n) {
	if (current_room === null) {		
	}
}

g.room = {
	start: null

};

g.canvas.on_touch = ([x, y]) => {
};

g.canvas.update = dt => {
};

g.canvas.draw_bg = ctx => {
	g.core.clear_bg();
};

g.canvas.draw_fg = ctx => {
	ctx.fillStyle = document.body.style.backgroundColor;
	ctx.fillRect(0, 0, g.canvas.d_w, g.canvas.d_h);
};

g.canvas.start = () => {
//	document.body.style.backgroundColor = g.app.theme_color;
	if (g.room.start) g.room.start();
};
