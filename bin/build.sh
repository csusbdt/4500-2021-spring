a=public/4500-2021-spring
b=docs/

rm -rf $b/*

mkdir -p $b/dynamic
mkdir -p $b/images
mkdir -p $b/music
mkdir -p $b/sfx
mkdir -p $b/sprites
mkdir -p $b/static

npx terser $a/dynamic/r_red_white_box.js  -m -c -o $b/dynamic/r_red_white_box.js
npx terser $a/dynamic/r_test_1.js         -m -c -o $b/dynamic/r_test_1.js
npx terser $a/dynamic/r_test_2.js         -m -c -o $b/dynamic/r_test_2.js

cp $a/images/*                            $b/images/
cp $a/music/*                             $b/music/
cp $a/sfx/*                               $b/sfx/
cp $a/sprites/*                           $b/sprites/

npx terser $a/static/c_loop.js            -m -c -o $b/static/c_loop.js
npx terser $a/static/c_once.js            -m -c -o $b/static/c_once.js
npx terser $a/static/c_sound.js           -m -c -o $b/static/c_sound.js
npx terser $a/static/core.js              -m -c -o $b/static/core.js
npx terser $a/static/goto.js              -m -c -o $b/static/goto.js
npx terser $a/static/index.js             -m -c -o $b/static/index.js
npx terser $a/static/mixins.js            -m -c -o $b/static/mixins.js
npx terser $a/static/rooms.js             -m -c -o $b/static/rooms.js
npx terser $a/static/spritesheets.js      -m -c -o $b/static/spritesheets.js
npx terser $a/static/utils.js             -m -c -o $b/static/utils.js
npx terser $a/static/zone.js              -m -c -o $b/static/zone.js

cp $a/index.html                          $b/
cp $a/manifest.webmanifest                $b/

npx terser $a/sw.js                       -m -c -o $b/sw.js
