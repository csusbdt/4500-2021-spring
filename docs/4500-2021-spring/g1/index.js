import '/4500-2021-spring/scripts/app_main.js';
import { c_sound } from '/4500-2021-spring/scripts/audio.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud  = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);
const song  = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', 1);
const e     = document.createElement("p");

const on_resize = () => {
	e.style.marginTop = Math.floor(window.innerHeight / 2 - 50) + 'px';
};

const on_end = () => {
	e.innerHTML = '&#9210;'
};

const on_touch = () => {
	if (song.is_playing()) {
		thud.fast_play();
		song.stop();
		e.innerHTML = '&#9199;';
	} else {
		click.fast_play();
		song.start();
		e.innerHTML = '&#9209;';
	}
};

g.app.start = () => {
	document.body.style.background_color = 'white';
	e.style.fontSize = '100px';
	e.style.marginTop = Math.floor(window.innerHeight / 2 - 50) + 'px';
	e.style.textAlign = 'center';
	e.style.cursor = 'pointer';
	e.innerHTML = '&#9199;'
	document.body.appendChild(e);
	on_resize();
	window.addEventListener('resize', on_resize);
	e.addEventListener('mousedown' , on_touch, { capture: true, once: false });
	e.addEventListener('touchstart', on_touch, { capture: true, once: false });	
};
