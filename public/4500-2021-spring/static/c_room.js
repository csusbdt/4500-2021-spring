import { load_script } from "./utils.js";

const rooms = new Map();
export const rooms_to_load = new Map();

function c_room(name) {
	this.name  = name;
	this.start = null;
}

export const get_room = name => {
	if (rooms.has(name)) {
		return Promise.resolve(rooms.get(name));
	} else if (rooms_to_load.has(name)) {
		return Promise.reject(`${name} under construction`);
	} else {
		const room = new c_room(name);
		rooms_to_load.set(name, room);
		return load_script(`/4500-2021-spring/dynamic/r_${name}.js`)
		.then(_ => {
			rooms.set(name, room);
			return room;
		})
		.finally(_ => {
			rooms_to_load.delete(name);
		});
	}
};
