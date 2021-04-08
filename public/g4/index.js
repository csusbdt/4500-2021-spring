import '/scripts/room_main.js';
import { r as room1 } from '/g4/rooms/room1/main.js';

g.room.start = () => {
	console.log("g4 started");
	room1.start();
};
