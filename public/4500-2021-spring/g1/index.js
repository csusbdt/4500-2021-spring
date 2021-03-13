import '/4500-2021-spring/scripts/core_main.js';

function random_color() {
	const n = Math.floor(Math.random() * Math.floor(0xFFFFFF));
	return "#" + n.toString(16).padStart(6, '0');
}

let time_remaining = 2;

g.core.update = dt => {
	time_remaining -= dt;
	if (time_remaining <= 0) {
		time_remaining = 2;
		document.body.style.backgroundColor = random_color();
	}
};

//let fg_color = '#ffffff';

g.core.fg_draw = ctx => {
};

g.core.start = () => {
	console.log("g1 started");
	document.body.style.backgroundColor = g.app.theme_color;
};
