# Piazza Trento e trieste

Ferrara, Kathedraal, 2022-05-23.mov<br>
1920 x 1080<br>
2:10

```bash
# extract frame 500 as an image
ffmpeg -i 'Ferrara, Kathedraal, 2022-05-23.mov' -vf "select=eq(n\,449)" -vframes 1 piazzatrentoetrieste_frame_500.png
# perspective correct 1920 x 1080, remove audio
ffmpeg -hide_banner -i 'Ferrara, Kathedraal, 2022-05-23.mov' -lavfi "perspective=x0=60:y0=0:x1=1882:y1=32:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" -an piazzatrentoetrieste-perspective.mov
# extract frame 500 as an image
ffmpeg -i piazzatrentoetrieste-perspective.mov -vf "select=eq(n\,449)" -vframes 1 piazzatrentoetrieste-perspective_frame_500.png
# convert to png sequence
ffmpeg -i piazzatrentoetrieste-perspective.mov /Volumes/Samsung_X5/piazzatrentoetrieste/frames/frame_%05d.png
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i piazzatrentoetrieste-perspective.mov -vf scale=480:270 piazzatrentoetrieste_preview.mov
# convert preview to png sequence
ffmpeg -i piazzatrentoetrieste_preview.mov /Volumes/Samsung_X5/piazzatrentoetrieste/frames_preview/frame_%05d.png
```


piazzatrentoetrieste 720p greenscreen.mp4<br>
1280 × 720<br>
0:32

```bash
# slice 00:12 to 0:44 // 0:51 to 1:11
ffmpeg -ss 00:00:12.0 -i 'piazzatrentoetrieste-perspective.mov' -c copy -t 00:00:32.0 'piazzatrentoetrieste-1 greenscreen.mov'
# Runway
# ...
# Crop to only the bottom 240px
ffmpeg -i 'piazzatrentoetrieste-1 greenscreen-2 720p.mp4' -filter:v "crop=1280:240:0:480" 'piazzatrentoetrieste-greenscreen-cropped.mp4'
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'piazzatrentoetrieste-greenscreen-cropped.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 x 240 * 0.25 = 60 preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames/frame_%05d.png' -vf scale=320:60 '/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames_preview/frame_%05d.png'
```

## Render PNG sequence

```bash
# png to mp4 (from index 866 met 30 FPS
ffmpeg -framerate 30 -start_number 866 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p piazzatrentoetrieste-video-x1.mp4
# repeat 8 times, 863 frames, video only
ffmpeg -i piazzatrentoetrieste-video-x1.mp4 -filter_complex "loop=loop=8:size=863:start=0" piazzatrentoetrieste-video-x8.mp4
# repeat 8 times, audio
ffmpeg -stream_loop 8 -i piazzatrentoetrieste-audio-x1.wav -c copy piazzatrentoetrieste-audio-x8.wav
# video en audio samenvoegen
ffmpeg -i piazzatrentoetrieste-video-x8.mp4 -i piazzatrentoetrieste-audio-x8.wav -vcodec copy piazzatrentoetrieste-x8.mp4
# scale to 50%, 960 * 540
ffmpeg -i piazzatrentoetrieste-x8.mp4 -vf scale=960:540 piazzatrentoetrieste-x8_halfsize.mp4
```

## Muziek

Video duurt 863 frames.<br>
Video duurt 863 / 30 FPS = 28.766666666666666 seconden.<br>
Video duurt 12 maten van 4 beats = 48 beats.<br>
Een beat duurt 28.766666666666666 / 48 = 0.5993055555555555 seconden.<br>
Het tempo is 60 / 0.5993055555555555 = 100.11587485515643 BPM<br>


## Render PNG sequence of version 2

```bash
# png to mp4 (from index 866 met 30 FPS
ffmpeg -framerate 30 -start_number 866 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p piazzatrentoetrieste-2-video-x1.mp4
# repeat 8 times, 863 frames, video only
ffmpeg -i piazzatrentoetrieste-2-video-x1.mp4 -filter_complex "loop=loop=8:size=863:start=0" piazzatrentoetrieste-2-video-x8.mp4
# repeat 8 times, audio 
ffmpeg -stream_loop 8 -i piazzatrentoetrieste-2-audio-x1.wav -c copy piazzatrentoetrieste-2-audio-x8.wav
# video en audio samenvoegen
ffmpeg -i piazzatrentoetrieste-2-video-x8.mp4 -i piazzatrentoetrieste-2-audio-x8.wav -vcodec copy piazzatrentoetrieste-2-x8.mp4
# scale to 50%, 960 * 540
ffmpeg -i piazzatrentoetrieste-2-x8.mp4 -vf scale=960:540 piazzatrentoetrieste-2-x8_halfsize.mp4
```

Finished and branched.
