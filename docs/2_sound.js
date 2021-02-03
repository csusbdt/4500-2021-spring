import { fatal } from './2_error.js';

let audio_context = null;
let music_file = null;
let music_audio = null;
let music_gain_node = null;
let music_source_node = null;

export function create_audio_context() {
	audio_context = new (window.AudioContext || window.webkitAudioContext)();
}

function is_music_playing() {
	if (music_audio === null) {
		return false;
	} else if (music_audio.ended) {
		music_audio = null;
		music_gain_node = null;
		music_source_node = null;
		return false;
	} else {
		return true;
	}
}

export function stop_music() {
	if (is_music_playing()) {
		music_audio.pause();
		music_audio.currentTime = 0;
		music_gain_node.disconnect();
		music_source_node.disconnect();
		music_file = null;
		music_audio = null;
		music_gain_node = null;
		music_source_node = null;
	}
}

export function play_music(file) {
	stop_music();
	music_file = file;
	music_audio = new Audio(music_file);
	music_audio.addEventListener('error', e => {
		fatal("play_music", music_file);
		console.log(e);
	});
	music_audio.autoplay = true;
	music_gain_node = audio_context.createGain();
	music_gain_node.gain.setValueAtTime(.3, audio_context.currentTime);
	music_gain_node.connect(audio_context.destination);		
	music_source_node = audio_context.createMediaElementSource(music_audio);
	music_source_node.connect(music_gain_node);
	music_gain_node.connect(audio_context.destination);
}

export function set_music_volume(file, volume) {
	if (is_music_playing() && music_file === file) {
		music_gain_node.gain.linearRampToValueAtTime(volume, audio_context.currentTime + 1.0);
	}
}
