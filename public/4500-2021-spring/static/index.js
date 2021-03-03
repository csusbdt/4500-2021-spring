import { message, register_service_worker } from '/4500-2021-spring/static/utils.js';
import { get_room                         } from '/4500-2021-spring/static/c_room.js';
import { set_room, start_animation_loop   } from '/4500-2021-spring/static/core.js';

// global error handlers for uncaught exceptions

window.addEventListener('error', function(e) {
	message(e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
	if (typeof(e.reason.stack) !== 'undefined') {
		message(e.reason, e.reason.message, e.reason.stack);
	} else {
		message(e.reason, e.reason.message);
	}
});

window.addEventListener('load', e => {
	register_service_worker()
	.then(() => get_room(''))
	.then(r => { 
		set_room(r);
		start_animation_loop();
		return r; 
	})
	.then(r => {
		return r.goto('test_1');
	})
	.catch(e => message(`load event handler failed with ${e}`));
}, { once: true });
