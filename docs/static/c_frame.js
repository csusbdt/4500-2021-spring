import{starts,stops,run_stop_set,run_start_set}from"/4500-2021-spring/static/mixins.js";export function c_frame(t,s){this.sprites=t,this.name=s,this.room=t.room,this.f=t.json_frames[s],this.starts=starts,this.stops=stops,this.run_stop_set=run_stop_set,this.run_start_set=run_start_set,this.order=10,this.t=0,this.duration=.1,this.loop=!1}c_frame.prototype.start=function(){this.t=0,this.sprites.room.insert_updatable(this),this.sprites.room.insert_drawable(this)},c_frame.prototype.update=function(t){this.loop||(this.t+=t,this.t<this.duration||(this.sprites.room.remove_updatable(this),this.sprites.room.remove_drawable(this),this.run_stop_set(),this.run_start_set()))},c_frame.prototype.draw=function(t){t.drawImage(this.sprites.image,this.f.sx,this.f.sy,this.f.w,this.f.h,this.f.dx,this.f.dy,this.f.w,this.f.h)};