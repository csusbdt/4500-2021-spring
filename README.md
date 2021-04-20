This repo is my experimentation on creating a gamified website as a progressive web app (PWA).

This file is for my working notes.

Watched: https://www.youtube.com/watch?v=_kJMjJ1tm6o

Bubbling and capturing: https://javascript.info/bubbling-and-capturing GOOD!

To do:

* I might need to break music into segments if I want to play longer peices of music.
    * https://github.com/audiojs/web-audio-stream
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
* Develop caching strategy for images.  <s>Learn IndexedDB.</s>

* [127.0.0.1:8080/](https://127.0.0.1:8080/)

__test safari__

Safari ... Preferences ... Privacy ... Manage Website Data ... select and remove

__dev dependencies__

* github, vscode, node, eslint, babel, eslint-babel
* [http-server](https://www.npmjs.com/package/http-server)

__runtime dependences__

* none!

__save__

* <s>// watch https://www.youtube.com/playlist?list=PLNYkxOF6rcIB2xHBZ7opgc2Mv009X87Hh</s>


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

