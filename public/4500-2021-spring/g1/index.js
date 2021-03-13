import '/4500-2021-spring/scripts/core_main.js';

function random_color() {
	const n = Math.floor(Math.random() * Math.floor(0xFFFFFF));
	return "#" + n.toString(16).padStart(6, '0');
}

let time_remaining = 2;

g.core.on_touch = ([x, y]) => {
	g.core.fg_dirty = true;
};

g.core.update = dt => {
	time_remaining -= dt;
	if (time_remaining <= 0) {
		time_remaining = 2;
		document.body.style.backgroundColor = random_color();
	}
};

g.core.draw_bg = ctx => {
	g.core.clear_bg();
};

g.core.draw_fg = ctx => {
	ctx.fillStyle = document.body.style.backgroundColor;
	ctx.fillRect(0, 0, g.core.d_w, g.core.d_h);
};

g.core.start = () => {
	console.log("g1 started");
	document.body.style.backgroundColor = g.app.theme_color;
};
