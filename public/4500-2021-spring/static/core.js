export const d_w = 1920;  // width  of drawable area
export const d_h = 1080;  // height of drawable area
export const v_w = 1920;  // width  of game play area
export const v_h = 1080;  // height of game play area

const spf = 1/8;  // seconds per frame
const bg  = g_bg.getContext('2d', { alpha: false });
const fg  = g_fg.getContext('2d', { alpha: true  });

export function set_room(r) {
	room = r;
}

let room      = null;
let scale     = 1;
let offset_x  = 0;
let offset_y  = 0;
let left      = 0;
let top       = 0;

let bg_frame  = null;
let bg_dirty  = false;

function adjust_canvas() {
	// Get the window dimensions (viewport area)
	const screen_width  = window.innerWidth;
	const screen_height = window.innerHeight;

	// Determine the scale needed to render game play area.
	scale = Math.min(1, screen_width / v_w, screen_height / v_h);

	// Determine canvas size.
	const canvas_width  = Math.min(screen_width , d_w * scale);
	const canvas_height = Math.min(screen_height, d_h * scale);

	g_fg.width  = canvas_width;
	g_bg.width  = canvas_width;
	g_fg.height = canvas_height;
	g_bg.height = canvas_height;

	// Center the drawing area in the canvas.
	offset_x = (canvas_width  - d_w * scale) / 2;
	offset_y = (canvas_height - d_h * scale) / 2;

	// Center canvas in browser window.
	left = (screen_width  - canvas_width ) / 2;
	top  = (screen_height - canvas_height) / 2;
	g_fg.style['left'] = left;
	g_bg.style['left'] = left;
	g_fg.style['top' ] = top ;
	g_bg.style['top' ] = top ;

	bg.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	fg.setTransform(scale, 0, 0, scale, offset_x, offset_y);
	bg_dirty = true;
}

window.addEventListener('resize', adjust_canvas, true);
adjust_canvas();

export function set_bg_frame(frame) {
	bg_frame = frame;
	bg_dirty = true;
}

let previous_time = new Date().getTime() / 1000;

function animation_loop() {
	if (bg_dirty) {
		if (bg_frame === null) {
			bg.clearRect(0, 0, d_w, d_h);
		} else {
			bg_frame.draw(bg);
		}
		bg_dirty = false;
	}
	const current_time = new Date().getTime() / 1000;
	let dt = current_time - previous_time;
	previous_time = current_time;
	if (dt > spf) dt = spf;
	if (room !== null) {
		room.render(dt, fg);
	}
	requestAnimationFrame(animation_loop);
}

requestAnimationFrame(animation_loop);

// need to convert mouse event coords to game world coords

const room_coords = e => {
	return [
		(e.pageX - left - offset_x) / scale,
		(e.pageY - top  - offset_y) / scale
	];
};

const mousedown = e => {
	e.preventDefault();
	if (room !== null) {
		room.on_touch(room_coords(e));
	}
};

const touchstart = e => {
	e.preventDefault();
	if (room !== null) {
		room.on_touch(room_coords(e.changedTouches[0]));
	}
};

g_fg.addEventListener('mousedown' , mousedown, { capture: true, once: false });
g_fg.addEventListener('touchstart', touchstart, { capture: true, once: false });
