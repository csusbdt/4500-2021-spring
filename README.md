This repo is my experimentation on creating a gamified website as a progressive web app (PWA).

This file is for my working notes.

https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement ???

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

//http://joesul.li/van/tale-of-no-clocks/

//https://github.com/audiojs/web-audio-stream



https://wesbos.com/arrow-functions

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


* [site through github pages](https://csusbdt.github.io/4500-2021-spring/)



__project dependencies__

* github, vscode, node, eslint
* [http-server](https://www.npmjs.com/package/http-server)
