import{set_renderer,set_event_handler,set_bg}from"/4500-2021-spring/static/core.js";import{c_sound}from"/4500-2021-spring/static/c_sound.js";import{load_image}from"/4500-2021-spring/static/utils.js";const click=new c_sound("/4500-2021-spring/sfx/click.mp3",1);set_event_handler((()=>{click.fast_play()}));const render=e=>{};set_renderer((()=>{load_image("bg/test_1.png").then((e=>{set_bg(e),set_renderer(render)})),set_renderer(null)}));