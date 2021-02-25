import { load_image } from "./utils";

const rooms = new Map();

function c_room(name) {
	this.name      = name;
	this.load      = null;
	this.start     = null;
}

export const get_room = name => {
	if (rooms.has(name)) {
		return rooms.get(name);
	} else {
		const r = new c_room(name);
		rooms.set(name, r);
		return r;
	}
};

c_room.prototype.create = function() {
	return load_script('/4500-2021-spring/dynamic/r_' + next_room_name + '.js');
};


// c_room.prototype.goto = function(next_room_name) {
// 	const next_room = get_room(next_room_name);
// 	return next_room.create()
// 	.then(_ => next_room.load())
// 	.then(_ => this.stop())
// 	.then(_ => next_room.start())
// 	.then(() => {
// 		next_room.status = 'started';
// 		return next_room;
// 	})
// 	.then(_ => this.unload())
// };
