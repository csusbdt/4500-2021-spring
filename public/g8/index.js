import '/scripts/game_main.js';
import { r } from '/g8/main.js';

g.game.start = () => {
	r.load().then(() => {
		g.game.set_room(r);
		r.start();
	});
};
