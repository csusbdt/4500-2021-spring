import '/4500-2021-spring/scripts/room_main.js';
import { r as start_room } from '/4500-2021-spring/g3/rooms/start.js';

g.room.start = () => {
	console.log("g3 started");
	g.room.current_room = start_room;
};
