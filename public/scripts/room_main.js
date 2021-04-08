import '/scripts/canvas_main.js';

g.room = {
	current_room: null,
	start: null,
	touch_point: [g.canvas.d_w / 2, g.canvas.d_h / 2],
	touch_dirty: false
};

g.canvas.on_touch = p => {
	g.room.touch_point = p;
	g.room.touch_dirty = true;
};

g.canvas.update = dt => {
	if (g.room.current_room && g.room.current_room.update) {
		g.room.current_room.update(dt);
	}
	g.room.touch_dirty = false;
};

g.canvas.draw_bg = ctx => {
	if (g.room.current_room && g.room.current_room.draw_bg) {
		g.room.current_room.draw_bg(ctx);
	} else {
		g.canvas.clear_bg();
	}
};

g.canvas.draw_fg = ctx => {
	g.canvas.clear_fg();
	if (g.room.current_room && g.room.current_room.draw_fg) {
		g.room.current_room.draw_fg(ctx);
	}
};

g.canvas.start = () => {
	if (g.room.start) g.room.start();
};
