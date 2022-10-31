# Piazza Maggiore

Bologna, Piazza Maggiore, 2022-05-24.mov

Constructive Solid Geometry for three.js, ES6 + BufferGeometry.<br>
https://github.com/looeee/threejs-csg<br>
https://github.com/samalexander/three-csg-ts<br>
https://www.npmjs.com/package/three-csg-ts?activeTab=readme<br>

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

## Voorbereiding Runway greenscreen

```
# Breedte tot aan muur: 1600px. Dus 900px hoog.
ffmpeg -i piazzamaggiore_perspective.mov -filter:v "crop=1600:900:0:320" piazzamaggiore_b.mov
# Schalen naar 1280 x 720 px.
ffmpeg -i piazzamaggiore_b.mov -vf scale=1280:720 piazzamaggiore_c.mov
# Alleen de gebruikte tijd.
ffmpeg -ss 00:01:24.0 -i piazzamaggiore_c.mov -c copy -t 00:00:19.0 piazzamaggiore_d.mov

# Runway Green screen: #00ff00

# chromakey greenscreen to transparent PNGs
ffmpeg -i piazzamaggiore_greenscreen.mp4 -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/piazzamaggiore_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/piazzamaggiore_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/piazzamaggiore_greenscreen/frames_preview/frame_%05d.png'
```

Learning 3D Graphics With Three.js | Dynamic Geometry<br>
https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-dynamic-geometry

## FFmpeg render

```
# png to mp4 (from index 533 met 30 FPS
ffmpeg -framerate 30 -start_number 533 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p piazzamaggiore-video-x1.mp4
# repeat 16 times, 531 frames, video alleen
ffmpeg -i piazzamaggiore-video-x1.mp4 -filter_complex "loop=loop=16:size=531:start=0" piazzamaggiore-video-x16.mp4

# slice audio from 17.7 to 35.4
# (loop was played twice to record tails into start)
ffmpeg -ss 00:00:17.7 -i piazzamaggiore-audio-loop-x2.wav -c copy -t 00:00:17.7 piazzamaggiore-audio-x1.wav
# repeat 16 times, audio
ffmpeg -stream_loop 16 -i piazzamaggiore-audio-x1.wav -c copy piazzamaggiore-audio-x16.wav
# video en audio samenvoegen
ffmpeg -i piazzamaggiore-video-x16.mp4 -i piazzamaggiore-audio-x16.wav -vcodec copy piazzamaggiore-x16.mp4
# scale to 50%, 960 * 540
ffmpeg -i piazzamaggiore-x16.mp4 -vf scale=960:540 piazzamaggiore-x16_halfsize.mp4
```

Video duurt 531 frames.<br> 
Video duurt 531 / 30 FPS = 17.7 seconden.<br>
Video duurt 8 maten van 4 beats = 32 beats.<br>
Een beat duurt 17.7 / 32 = 0,553125 seconden.<br>
Het tempo is 60 / 0,553125 = 108,474576271186441 BPM<br>

Muziek Sampled Music album nummer 9 (Digitakt project nummer 10).
