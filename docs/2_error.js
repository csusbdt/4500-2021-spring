let hide_div = null;
let error_div = null;

export function set_error_hide_div(div) {
	hide_div = div;
}

export function set_error_div(div) {
	error_div = div;
}

export function fatal(...messages) {
	hide_div.style.display  = 'none';
	error_div.style.display = 'block';
	messages.forEach(message => error_div.innerHTML += "<h2>" + message + "</h2>");
}

window.addEventListener('error', function(e) {
	// handler for uncaught exceptions 
	fatal(e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
	// handler for uncaught exceptions thrown in promises
	if (typeof(e.reason.stack) !== 'undefined') {
		fatal(e.reason, e.reason.message, e.reason.stack);
	} else {
		fatal(e.reason, e.reason.message);
	}
});
