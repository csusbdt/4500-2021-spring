import '/4500-2021-spring/scripts/room_main.js';
import { start_room } from '/4500-2021-spring/g3/rooms/start.js';

g.room.start = () => {
	console.log("g3 started");
	document.body.style.backgroundColor = '#FF0000';
	g.room.current_room = start_room;
};
