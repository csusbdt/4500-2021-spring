import{load_script}from"./utils.js";const rooms=new Map;export const rooms_to_load=new Map;function c_room(o){this.name=o,this.start=null}export const get_room=o=>{if(rooms.has(o))return Promise.resolve(rooms.get(o));if(rooms_to_load.has(o))return Promise.reject(`${o} under construction`);{const r=new c_room(o);return rooms_to_load.set(o,r),load_script(`/4500-2021-spring/dynamic/r_${o}.js`).then((t=>(rooms.set(o,r),r))).finally((r=>{rooms_to_load.delete(o)}))}};