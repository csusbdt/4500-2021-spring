// this code relies on:
// https://github.com/odrick/free-tex-packer-core
//
// This program packs a folder of sprites into a single image (sprite sheet).
// Execution fails if not all images fit into a single 2048x2048 image.

/* eslint-env node */

if (process.argv.length != 4) {
	console.log("args: sprite_sheet_name dest_dir");
	process.exit(1);
}
const sprite_sheet_name = process.argv[2];
const dest_dir          = process.argv[3];
const image_file        = dest_dir + "/" + sprite_sheet_name + ".png";
const json_file         = dest_dir + "/" + sprite_sheet_name + ".json";

const assert         = require('assert').strict.ok    ;
const fs             = require("fs")                  ;
const texture_packer = require("free-tex-packer-core");

let frames = {};

// Delete any existing output files.
if (fs.existsSync(image_file)) {
	fs.unlinkSync(image_file);
}
if (fs.existsSync(json_file)) {
	fs.unlinkSync(json_file);
}

console.log("packing " + sprite_sheet_name);

const packer_data = [];
const frame_names  = fs.readdirSync("sprites/" + sprite_sheet_name);
frame_names.forEach(function(frame_name) {
	const frame_path    = "sprites/" + sprite_sheet_name + "/" + frame_name;
	const contents       = fs.readFileSync(frame_path);
	packer_data.push({ path: frame_path, contents: contents });
});

const packer_options = {
    width               : 2048       ,
    height              : 2048       ,
    fixedSize           : true       ,
    padding             : 2          , // important for quality
    allowRotation       : false      ,
    removeFileExtension : true       ,
    prependFolderName   : false      ,
    //scale             : 1 
    //scaleMethod       : BILINEAR, NEAREST_NEIGHBOR, BICUBIC, HERMITE, BEZIER
    exporter            : "JsonHash"
};

packer_options.textureName = sprite_sheet_name;

texture_packer(packer_data, packer_options, (items, error) => {
	if (error) {
		console.error('Packaging failed', error);
	} else {  
		if (items.length === 2) {
			process_good(items);
		} else {
//			console.log("Can not pack " + sprite_sheet_name);
			process_bad(items);
		}
	}
});

function process_good(items) {
	const json_item  = items[0];
	const image_item = items[1];
	fs.writeFileSync(image_file, image_item.buffer);
	const packer_result = JSON.parse(json_item.buffer);
	for (let frame_name in packer_result.frames) {
		const frame = {
			sx    : packer_result.frames[frame_name].frame.x            ,
			sy    : packer_result.frames[frame_name].frame.y            ,
			w     : packer_result.frames[frame_name].frame.w            ,
			h     : packer_result.frames[frame_name].frame.h            ,
			dx    : packer_result.frames[frame_name].spriteSourceSize.x ,
			dy    : packer_result.frames[frame_name].spriteSourceSize.y 
		};
		frames[frame_name] = frame;
	}
	fs.writeFileSync(json_file, JSON.stringify(frames));
}

function process_bad(items) {
	console.log("Can not pack " + sprite_sheet_name);

//	for (let i = 1; i < items.length; i += 2) {
//		const item = items[i];
//		console.log(item.name);
//		//fs.writeFileSync(item.name, item.buffer);
//    } 
}
