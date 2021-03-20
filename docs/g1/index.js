import '/4500-2021-spring/scripts/app_main.js';
import { get_audio_context, c_sound } from '/4500-2021-spring/scripts/audio.js';

const click  = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);
const thud   = new c_sound('/4500-2021-spring/sfx/thud.mp3', 1);
const song   = new c_sound('/4500-2021-spring/music/say_it_isnt_so.mp3', 1);
const button = document.createElement("p");

const on_resize = () => {
	button.style.marginTop = Math.floor(window.innerHeight / 2 - 50) + 'px';
};

const on_end = () => {
	button.innerHTML = '&#9210;'
};

const on_touch = () => {
	if (song.is_playing()) {
		thud.fast_play();
		song.stop();
		button.innerHTML = '&#9199;';
	} else {
		click.fast_play();
		song.start();
		button.innerHTML = '&#9209;';
	}
};

g.app.start = () => {
	document.body.style.background_color = 'white';
	button.style.fontSize = '100px';
	button.style.marginTop = Math.floor(window.innerHeight / 2 - 50) + 'px';
	button.style.textAlign = 'center';
	button.style.cursor = 'pointer';
	button.style.userSelect = 'none';
//	button.innerHTML = '&#128148;';
	button.innerHTML = '&#128149;';
	document.body.appendChild(button);
	on_resize();
	window.addEventListener('resize', on_resize);

	const start_player = () => {
		button.innerHTML = '&#9199;'
		setTimeout(() => {
			button.addEventListener('mousedown' , on_touch, { capture: true, once: false });
			button.addEventListener('touchstart', on_touch, { capture: true, once: false });	
		});
	};

	const options = { capture: true, once: true };
	let touch = null;
	const mouse = 
	button.addEventListener('mousedown' , () => {
		get_audio_context();
		button.removeEventListener(touch, options);
		start_player();
	}, options);
	button.addEventListener('touchstart', () => {
		get_audio_context();
		button.removeEventListener(mouse, options);
		start_player();
	}, options);
};
