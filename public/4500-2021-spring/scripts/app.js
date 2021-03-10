import { fatal, register_service_worker } from '/4500-2021-spring/scripts/app_utils.js';
//import { get_room                         } from '/4500-2021-spring/static/rooms.js';
//import { set_room, start_animation_loop   } from '/4500-2021-spring/static/core.js';

if (location.protocol !== 'https:') location.protocol = 'https:';

// global error handlers for uncaught exceptions

window.addEventListener('error', function(e) {
	fatal(e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
	if (typeof(e.reason.stack) !== 'undefined') {
		fatal(e.reason, e.reason.message, e.reason.stack);
	} else {
		fatal(e.reason, e.reason.message);
	}
});

window.g = {
	fatal: fatal
};

window.addEventListener('load', e => {
	if ('serviceWorker' in navigator) {
		register_service_worker().then(() => {
//			console.log("service worker started");
			if (g.start) g.start();
		}).catch(e => fatal(e));
	} else {
		if (g.start) g.start();
	}
});



// window.addEventListener('load', e => {
// 	register_service_worker()
// 	.then(() => get_room(''))
// 	.then(r => { 
// 		set_room(r);
// 		start_animation_loop();
// 		return r.goto('test_1').start();
// 		//return r; 
// 	})
// 	.catch(e => message(`load event handler failed with ${e}`));
// }, { once: true });
