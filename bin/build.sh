rm -rf docs/*

mkdir -p docs/static
mkdir -p docs/dynamic
mkdir -p docs/images
mkdir -p docs/sfx
mkdir -p docs/music

npx terser public/dynamic/r_red_white_box.js  -m -c -o docs/dynamic/r_red_white_box.js

cp public/images/*                            docs/images/
cp public/music/*                             docs/music/
cp public/sfx/*                               docs/sfx/

npx terser public/static/c_sound.js           -m -c -o docs/static/c_sound.js
npx terser public/static/core.js              -m -c -o docs/static/core.js
npx terser public/static/index.js             -m -c -o docs/static/index.js
npx terser public/static/utils.js             -m -c -o docs/static/utils.js

cp public/index.html                          docs/
cp public/manifest.webmanifest                docs/

npx terser public/sw.js                       -m -c -o docs/sw.js
