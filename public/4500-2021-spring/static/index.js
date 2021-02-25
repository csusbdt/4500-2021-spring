import { message, register_service_worker, load_script } from '/4500-2021-spring/static/utils.js';

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
	.then(load)
	.catch(reason => message(reason));
}, { once: true });

const load = () => {
	load_script('/4500-2021-spring/dynamic/r_test_1.js').then(script => {
		script.id = script.src;
		//script.parentNode.removeChild(script);
	});
};
