a=public/4500-2021-spring
b=docs/

rm -rf $b/*

mkdir -p $b/static
mkdir -p $b/dynamic
mkdir -p $b/images
mkdir -p $b/sfx
mkdir -p $b/music

npx terser $a/dynamic/r_red_white_box.js  -m -c -o $b/dynamic/r_red_white_box.js

cp $a/images/*                            $b/images/
cp $a/music/*                             $b/music/
cp $a/sfx/*                               $b/sfx/

npx terser $a/static/c_sound.js           -m -c -o $b/static/c_sound.js
npx terser $a/static/core.js              -m -c -o $b/static/core.js
npx terser $a/static/index.js             -m -c -o $b/static/index.js
npx terser $a/static/utils.js             -m -c -o $b/static/utils.js

cp $a/index.html                          $b/
cp $a/manifest.webmanifest                $b/

npx terser $a/sw.js                       -m -c -o $b/sw.js
