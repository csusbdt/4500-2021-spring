import '/4500-2021-spring/scripts/app_main.js';
//import { get_audio_context } from '/4500-2021-spring/scripts/audio.js';

g.core = {};

g.core.d_w = 1920;  // width  of drawable area
g.core.d_h = 1080;  // height of drawable area
g.core.v_w = 1920;  // width  of game play area
g.core.v_h = 1080;  // height of game play area
g.core.spf = 1/8;   // seconds per frame

g.core.bg_dirty  = true;

let scale     = 1;
let offset_x  = 0;
let offset_y  = 0;
let left      = 0;
let top       = 0;
let previous_time = new Date().getTime() / 1000;

function adjust_canvas() {
	// Get the window dimensions (viewport area)
	const screen_width  = window.innerWidth;
	const screen_height = window.innerHeight;

	// Determine the scale needed to render game play area.
	scale = Math.min(1, screen_width / g.core.v_w, screen_height / g.core.v_h);

	// Determine canvas size.
	const canvas_width  = Math.min(screen_width , g.core.d_w * scale);
	const canvas_height = Math.min(screen_height, g.core.d_h * scale);

	g.core.bg_canvas.width  = canvas_width;
	g.core.fg_canvas.width  = canvas_width;
	g.core.bg_canvas.height = canvas_height;
	g.core.fg_canvas.height = canvas_height;

	// Center the drawing area in the canvas.
	offset_x = (canvas_width  - g.core.d_w * scale) / 2;
	offset_y = (canvas_height - g.core.d_h * scale) / 2;

	// Center canvas in browser window.
	left = (screen_width  - canvas_width ) / 2;
	top  = (screen_height - canvas_height) / 2;
	g.core.fg_canvas.style['left'] = left;
	g.core.bg_canvas.style['left'] = left;
	g.core.fg_canvas.style['top' ] = top ;
	g.core.bg_canvas.style['top' ] = top ;

	g.core.bg_ctx.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	g.core.fg_ctx.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	g.core.bg_dirty = true;
}

function animation_loop() {
	if (g.core.bg_dirty) {
		if (g.core.draw_bg) {
			g.core.draw_bg(g.core.bg_ctx);
		} else {
			g.core.bg_ctx.clearRect(0, 0, g.core.d_w, g.core.d_h);
		}
		g.core.bg_dirty = false;
	}
	if (g.core.fg_draw) {
		g.core.fg_ctx.clearRect(0, 0, g.core.d_w, g.core.d_h);
		g.core.fg_draw(g.core.fg_ctx);
	}
	const current_time = new Date().getTime() / 1000;
	let dt = current_time - previous_time;
	previous_time = current_time;
	if (dt > g.core.spf) dt = g.core.spf;
	if (g.core.update) {
		g.core.update(dt);
	}
	requestAnimationFrame(animation_loop);
}

g.app.start = () => {
//	while (document.body.lastElementChild) {
//		document.body.removeChild(document.body.lastElementChild);
//	}
	document.body.style.overflow = 'hidden'; 
	document.body.style.margin   = 0; 
	document.body.style.padding  = 0;
	document.body.style.backgroundColor = g.app.theme_color;
//	document.body.style.width  = '100%';
//	document.body.style.height = '100%';

	g.core.bg_canvas = document.createElement("canvas");
	g.core.bg_canvas.style.position = 'absolute';
	g.core.bg_canvas.style.zIndex = 1;
	g.core.bg_canvas.style.backgroundColor = g.app.theme_color;
	document.body.appendChild(g.core.bg_canvas);

	g.core.fg_canvas = document.createElement("canvas");
	g.core.fg_canvas.style.position = 'absolute';
	g.core.fg_canvas.style.zIndex = 2;
	document.body.appendChild(g.core.fg_canvas);

	g.core.bg_ctx = g.core.bg_canvas.getContext('2d', { alpha: false });
	g.core.fg_ctx = g.core.fg_canvas.getContext('2d', { alpha: true  });
	
	window.addEventListener('resize', adjust_canvas, true);
	adjust_canvas();

	if (g.core.start) g.core.start();

	requestAnimationFrame(animation_loop);
};

/*

// need to convert mouse event coords to game world coords

const room_coords = e => {
	return [
		(e.pageX - left - offset_x) / scale,
		(e.pageY - top  - offset_y) / scale
	];
};

const mousedown = e => {
	get_audio_context();
	e.preventDefault();
	if (room !== null) {
		room.on_touch(room_coords(e));
	}
};

const touchstart = e => {
	get_audio_context();
	e.preventDefault();
	if (room !== null) {
		room.on_touch(room_coords(e.changedTouches[0]));
	}
};

g_fg.addEventListener('mousedown' , mousedown, { capture: true, once: false });
g_fg.addEventListener('touchstart', touchstart, { capture: true, once: false });

*/
