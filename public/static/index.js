import { message, register_service_worker, load_script } from '/static/utils.js';

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
	.catch(reason => message(reason))
	.then(load);
}, { once: true });

const load = () => {
	load_script('/dynamic/r_red_white_box.js').then(script => {
		script.parentNode.removeChild(script);
	});
};
