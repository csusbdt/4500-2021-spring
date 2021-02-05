This repo is my experimentation on creating a gamified website as a progressive web app (PWA).

This file is for my working notes.

https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement 

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

Play on first click code:

~~~
/*
	function g_mousedown_once(e) {
        audio_context.resume(); 
        document.body.removeEventListener('touchstart', g_touchstart_once, false);
    }

    function g_touchstart_once(e) {
        audio_context.resume(); 
        document.body.removeEventListener('mousedown', g_mousedown_once, false);
    }

    document.body.addEventListener('mousedown' , g_mousedown_once , { capture: false, once: true });
    document.body.addEventListener('touchstart', g_touchstart_once, { capture: false, once: true });
*/
~~~


* [site through github pages](https://csusbdt.github.io/4500-2021-spring/)

__dev dependencies__

* github, vscode, node, eslint
* [http-server](https://www.npmjs.com/package/http-server)

__runtime dependences__

* none!
