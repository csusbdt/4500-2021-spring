This repo is my experimentation on creating a gamified website as a progressive web app (PWA).

This file is for my working notes.

Today's Plan:
Turn docs into the build directory to host a running instance of this PWA through github.

https://dmitripavlutin.com/javascript-modules-best-practices/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map


I might need to break music into segments if I want to play longer peices of music.
https://github.com/audiojs/web-audio-stream


* [site through github pages](https://csusbdt.github.io/4500-2021-spring/)
* [127.0.0.1:8080/](https://127.0.0.1:8080/)

__dev dependencies__

* github, vscode, node, eslint, babel, eslint-babel
* [http-server](https://www.npmjs.com/package/http-server)

__runtime dependences__

* none!



The following from https://stackoverflow.com/a/27322253
~~~
function logAllEvents(o) {
	for (let key in o) {
		if (key.search('on') === 0) {
			o.addEventListener(key.slice(2), () => {
				console.log(key.slice(2));
			});
		}
	}
}
~~~

