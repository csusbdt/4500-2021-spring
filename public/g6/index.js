import '/scripts/room_main.js';

const r = {};

r.update = function(dt) {
	if (g.room.touch_dirty) {
		g.canvas.bg_canvas.style.backgroundColor = 'black';
		r.update = null;
	}
};

g.room.start = () => {
	console.log("g6 started");
	document.body.style.backgroundColor = 'black';
	g.canvas.bg_canvas.style.backgroundColor = 'white';
	g.room.current_room = r;
};
