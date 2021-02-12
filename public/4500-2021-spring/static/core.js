export const d_w = 1920;  // width  of drawable area
export const d_h = 1080;  // height of drawable area
export const v_w = 1920;  // width  of game play area
export const v_h = 1080;  // height of game play area

export function set_renderer(f) {
	f_render = f;
}

export function set_event_handler(f) {
	f_handle_event = f;
}

let f_render       = null;
let f_handle_event = null;
let scale          = 1;
let offset_x       = 0;
let offset_y       = 0;
let margin_left    = 0;
let margin_top     = 0;

function adjust_canvas() {
	// Get the window dimensions (viewport area)
	const screen_width  = window.innerWidth;
	const screen_height = window.innerHeight;

	// Determine the scale needed to render game play area.
	scale = Math.min(1, screen_width / v_w, screen_height / v_h);

	// Determine canvas size.
	g_canvas.width  = Math.min(screen_width , d_w * scale);
	g_canvas.height = Math.min(screen_height, d_h * scale);

	// Center the drawing area in the canvas.
	offset_x = (g_canvas.width  - d_w * scale) / 2;
	offset_y = (g_canvas.height - d_h * scale) / 2;

	// Center canvas in browser window.
	margin_left = (screen_width  - g_canvas.width ) / 2;
	margin_top  = (screen_height - g_canvas.height) / 2;
	g_canvas.style['margin-left'] = margin_left;
	g_canvas.style['margin-top' ] = margin_top ;
}

window.addEventListener('resize', adjust_canvas, true);
adjust_canvas();

const spf = 1/8  ;  // seconds per frame
const ctx = g_canvas.getContext('2d');

let previous_time = new Date().getTime() / 1000;

function animation_loop() {
	const current_time = new Date().getTime() / 1000;
	let dt = current_time - previous_time;
	previous_time = current_time;
	ctx.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	if (dt > spf) dt = spf;
	if (f_render !== null) {
		f_render(ctx, dt, current_time);
	}
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	requestAnimationFrame(animation_loop);
}

requestAnimationFrame(animation_loop);

// need to convert mouse event coords to game world coords

const room_coords = e => {
	return [
		(e.pageX - margin_left - offset_x) / scale,
		(e.pageY - margin_top  - offset_y) / scale
	];
};

const mousedown = e => {
	if (f_handle_event !== null) {
		e.preventDefault();
		f_handle_event(room_coords(e));
	}
};

const touchstart = e => {
	if (f_handle_event !== null) {
		e.preventDefault();
		f_handle_event(room_coords(e.changedTouches[0]));
	}
};

g_ui_div.addEventListener('mousedown' , mousedown, { capture: true, once: false });
g_ui_div.addEventListener('touchstart', touchstart, { capture: true, once: false });
