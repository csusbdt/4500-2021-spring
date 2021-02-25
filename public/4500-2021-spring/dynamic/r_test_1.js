import { set_renderer, set_event_handler, set_bg } from '/4500-2021-spring/static/core.js';
import { c_sound                         } from '/4500-2021-spring/static/c_sound.js';
import { load_image                      } from '/4500-2021-spring/static/utils.js';

const click = new c_sound('/4500-2021-spring/sfx/click.mp3', 1);

set_event_handler(() => {
	click.fast_play();
});

const render = dt => {
};

set_renderer(() => {
	load_image('bg/test_1.png').then(image => {
		set_bg(image);
		set_renderer(render);
	});
	set_renderer(null);
});



/*
c_loop.prototype.draw = function(ctx) {
    const f = this.texture.get_frames(this.anim_name)[this.index];
    const save_alpha = ctx.globalAlpha;
    if (ctx.globalAlpha !== this.alpha) {
        ctx.globalAlpha = this.alpha;
    }
    ctx.drawImage(
        this.texture.image,
        f.tx_x,
        f.tx_y,
        f.tx_w,
        f.tx_h,
        f.rm_x + this.offset_x,
        f.rm_y + this.offset_y,
        f.tx_w,
        f.tx_h
    );
    if (ctx.globalAlpha !== save_alpha) {
        ctx.globalAlpha = save_alpha;
    }
    this.dirty = false;
};
*/
