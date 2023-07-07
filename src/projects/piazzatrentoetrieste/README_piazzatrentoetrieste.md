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
ffmpeg -i 'piazzatrentoetrieste-1 greenscreen 720p.mp4' -filter:v "crop=1280:240:0:480" 'piazzatrentoetrieste-greenscreen-cropped.mp4'
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'piazzatrentoetrieste-greenscreen-cropped.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 x 240 * 0.25 = 60 preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames/frame_%05d.png' -vf scale=320:60 '/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames_preview/frame_%05d.png'
```
