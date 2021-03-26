import '/4500-2021-spring/scripts/room_main.js';
import { r as room1 } from '/4500-2021-spring/g4/rooms/room1/main.js';

g.room.start = () => {
	console.log("g4 started");
	room1.start();
};
