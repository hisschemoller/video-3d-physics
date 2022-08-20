# Piazza Maggiore

Breedte tot aan muur: 1600px.

Constructive Solid Geometry for three.js, ES6 + BufferGeometry.<br>
https://github.com/looeee/threejs-csg

## FFmpeg

```
# extract frame 870 as an image
ffmpeg -i "Bologna, Piazza Maggiore, 2022-05-24.mov" -vf "select=eq(n\,869)" -vframes 1 piazzamaggiore_frame_870.png
# perspective filter 1920 x 1080
ffmpeg -hide_banner -i "Bologna, Piazza Maggiore, 2022-05-24.mov" -lavfi "perspective=x0=69:y0=0:x1=1859:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" piazzamaggiore_perspective.mov
# extract frame 870 as an image
ffmpeg -i "piazzamaggiore_perspective.mov" -vf "select=eq(n\,869)" -vframes 1 piazzamaggiore_perspective_frame_870.png
# convert to png sequence
ffmpeg -i piazzamaggiore_perspective.mov '/Volumes/Samsung_X5/piazzamaggiore/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i piazzamaggiore_perspective.mov -vf scale=480:270 piazzamaggiore_preview.mov
# convert preview to png sequence
ffmpeg -i piazzamaggiore_preview.mov '/Volumes/Samsung_X5/piazzamaggiore/frames_preview/frame_%05d.png'
```
