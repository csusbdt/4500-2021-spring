/* global g_messages_div */

export function fatal(...messages) {
	messages.forEach(m => console.log(m));
	messages.forEach(m => g_messages_div.innerHTML += "<h2>" + m + "</h2>");
}

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
