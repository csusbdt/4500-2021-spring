import { message,
		 register_service_worker } from '/4500-2021-spring/static/utils.js';
import { get_room                } from '/4500-2021-spring/static/c_room.js';

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
	.then(_ => { return get_room('test_1'); })
	.then(r => {
		r.goto(r.name);
	})
	.catch(e => message(`load event handler failed with ${e}`));
}, { once: true });
