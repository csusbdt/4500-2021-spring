import '/4500-2021-spring/scripts/app_main.js';
import { get_audio_context } from '/4500-2021-spring/scripts/audio.js';

g.canvas = {
	d_w: 1920,  // width  of drawable area
	d_h: 1080,  // height of drawable area
	v_w: 1920,  // width  of game play area
	v_h: 1080,  // height of game play area
	spf: 1/8,   // seconds per frame

	//bg_canvas:
	//fg_canvas:
	//bg_ctx:
	//fg_ctx:

	start: null,
	draw_bg: null,
	draw_fg: null,
	update: null,
	clear_bg: null,
	clear_fg: null,
	
	bg_dirty: true,
	fg_dirty: true	
};

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
	scale = Math.min(1, screen_width / g.canvas.v_w, screen_height / g.canvas.v_h);

	// Determine canvas size.
	const canvas_width  = Math.min(screen_width , g.canvas.d_w * scale);
	const canvas_height = Math.min(screen_height, g.canvas.d_h * scale);

	g.canvas.bg_canvas.width  = canvas_width;
	g.canvas.fg_canvas.width  = canvas_width;
	g.canvas.bg_canvas.height = canvas_height;
	g.canvas.fg_canvas.height = canvas_height;

	// Center the drawing area in the canvas.
	offset_x = (canvas_width  - g.canvas.d_w * scale) / 2;
	offset_y = (canvas_height - g.canvas.d_h * scale) / 2;

	// Center canvas in browser window.
	left = (screen_width  - canvas_width ) / 2;
	top  = (screen_height - canvas_height) / 2;
	g.canvas.fg_canvas.style['left'] = left;
	g.canvas.bg_canvas.style['left'] = left;
	g.canvas.fg_canvas.style['top' ] = top ;
	g.canvas.bg_canvas.style['top' ] = top ;

	g.canvas.bg_ctx.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	g.canvas.fg_ctx.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	g.canvas.bg_dirty = true;
	g.canvas.fg_dirty = true;
}

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
	e.stopPropagation();
	if (g.canvas.on_touch) {
		g.canvas.on_touch(room_coords(e));
	}
};

const touchstart = e => {
	get_audio_context();
	e.preventDefault();
	e.stopPropagation();
	if (g.canvas.on_touch) {
		g.canvas.on_touch(room_coords(e.changedTouches[0]));
	}
};

function animation_loop() {
	if (g.canvas.bg_dirty) {
		if (g.canvas.draw_bg) {
			g.canvas.draw_bg(g.canvas.bg_ctx);
		} else {
			// i don't know what to do here
			//g.canvas.bg_ctx.clearRect(0, 0, g.canvas.d_w, g.canvas.d_h);
		}
		g.canvas.bg_dirty = false;
	}
	if (g.canvas.fg_dirty) {
		if (g.canvas.draw_fg) {
			g.canvas.draw_fg(g.canvas.fg_ctx);
		}
		g.canvas.fg_dirty = false;
	}

	const current_time = new Date().getTime() / 1000;
	let dt = current_time - previous_time;
	previous_time = current_time;
	if (dt > g.canvas.spf) dt = g.canvas.spf;
	if (g.canvas.update) {
		g.canvas.update(dt);
	}
	requestAnimationFrame(animation_loop);
}

g.app.start = () => {
	document.body.style.overflow = 'hidden'; 
	document.body.style.margin   = 0; 
	document.body.style.padding  = 0;
	document.body.style.backgroundColor = g.app.theme_color;

	g.canvas.bg_canvas = document.createElement("canvas");
	g.canvas.bg_canvas.style.position = 'absolute';
	g.canvas.bg_canvas.style.zIndex = 1;
	g.canvas.bg_canvas.style.backgroundColor = g.app.theme_color;
	document.body.appendChild(g.canvas.bg_canvas);

	g.canvas.fg_canvas = document.createElement("canvas");
	g.canvas.fg_canvas.style.position = 'absolute';
	g.canvas.fg_canvas.style.zIndex = 2;
	document.body.appendChild(g.canvas.fg_canvas);

	g.canvas.bg_ctx = g.canvas.bg_canvas.getContext('2d', { alpha: true });
	g.canvas.fg_ctx = g.canvas.fg_canvas.getContext('2d', { alpha: true });
	
	window.addEventListener('resize', adjust_canvas, true);
	adjust_canvas();

	if (g.canvas.start) g.canvas.start();

	requestAnimationFrame(animation_loop);

	g.canvas.fg_canvas.addEventListener(
		'mousedown', 
		mousedown, 
		{ capture: true, once: false }
	);
	g.canvas.fg_canvas.addEventListener(
		'touchstart', 
		touchstart, 
		{ capture: true, once: false }
	);	
};

g.canvas.clear_bg = () => {
	g.canvas.bg_ctx.clearRect(0, 0, g.canvas.d_w, g.canvas.d_h);	
	g.canvas.bg_ctx.beginPath();
};

g.canvas.clear_fg = () => {
	g.canvas.fg_ctx.clearRect(0, 0, g.canvas.d_w, g.canvas.d_h);
	g.canvas.fg_ctx.beginPath();
};
