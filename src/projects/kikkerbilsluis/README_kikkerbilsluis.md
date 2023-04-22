# Kikkerbilsluis

Amsterdam Brug PHKade 1 21-07-2021.mov<br>
1920 x 1080<br>
1:18

```bash
# perspective correct 1920 x 1080
ffmpeg -hide_banner -i "Amsterdam Brug PHKade 1 21-07-2021.mov" -lavfi "perspective=x0=50:y0=0:x1=1857:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" kikkerbilsluis-1-perspective.mov
# extract frame 500 as an image
ffmpeg -i kikkerbilsluis-1-perspective.mov -vf "select=eq(n\,449)" -vframes 1 kikkerbilsluis-1-perspective_frame_500.png
# convert to png sequence
ffmpeg -i kikkerbilsluis-1-perspective.mov '/Volumes/Samsung_X5/kikkerbilsluis-1/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i kikkerbilsluis-1-perspective.mov -vf scale=480:270 kikkerbilsluis-1_preview.mov
# convert preview to png sequence
ffmpeg -i kikkerbilsluis-1_preview.mov '/Volumes/Samsung_X5/kikkerbilsluis-1/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 2 21-07-2021.mov<br>
1920 x 1080<br>
1:19

```bash
# convert to png sequence
ffmpeg -i "Amsterdam Brug PHKade 2 21-07-2021.mov" '/Volumes/Samsung_X5/kikkerbilsluis-2/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i "Amsterdam Brug PHKade 2 21-07-2021.mov" -vf scale=480:270 kikkerbilsluis-2_preview.mov
# convert preview to png sequence
ffmpeg -i kikkerbilsluis-2_preview.mov '/Volumes/Samsung_X5/kikkerbilsluis-2/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 3 21-07-2021.mov<br>
1920 x 1080<br>
2:07

```bash
# convert to png sequence
ffmpeg -i "Amsterdam Brug PHKade 3 21-07-2021.mov" '/Volumes/Samsung_X5/kikkerbilsluis-3/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i "Amsterdam Brug PHKade 3 21-07-2021.mov" -vf scale=480:270 kikkerbilsluis-3_preview.mov
# convert preview to png sequence
ffmpeg -i kikkerbilsluis-3_preview.mov '/Volumes/Samsung_X5/kikkerbilsluis-3/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 2 21-07-2021 720p greenscreen.mp4<br>
1280 × 720<br>
0:20

```bash
# slice 0:51 to 1:11
ffmpeg -ss 00:00:51.0 -i 'Amsterdam Brug PHKade 2 21-07-2021.mov' -c copy -t 00:00:20.0 'kikkerbilsluis-2 greenscreen.mov'
# Runway
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'kikkerbilsluis-2 greenscreen 720p.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/kikkerbilsluis-2_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/kikkerbilsluis-2_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/kikkerbilsluis-2_greenscreen/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 2a 21-07-2021 720p greenscreen.mp4<br>
1280 × 720<br>
0:14

```bash
# slice 0:51 to 1:11
ffmpeg -ss 00:00:38.0 -i 'Amsterdam Brug PHKade 2 21-07-2021.mov' -c copy -t 00:00:14.0 'kikkerbilsluis-2a greenscreen.mov'
# Runway
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'kikkerbilsluis-2a greenscreen 720p.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/kikkerbilsluis-2a_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/kikkerbilsluis-2a_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/kikkerbilsluis-2a_greenscreen/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 3a 21-07-2021 720p greenscreen.mp4<br>
1280 × 720<br>
0:25

```bash
# slice 1:10 to 1:35
ffmpeg -ss 00:01:10.0 -i 'Amsterdam Brug PHKade 3 21-07-2021.mov' -c copy -t 00:00:25.0 'kikkerbilsluis-3a greenscreen.mov'
# Runway
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'kikkerbilsluis-3a greenscreen 720p.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/kikkerbilsluis-3a_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/kikkerbilsluis-3a_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/kikkerbilsluis-3a_greenscreen/frames_preview/frame_%05d.png'
```

## Blender tutorials

* Extruding PROFILES ALONG PATHS in Blender!
  * https://www.youtube.com/watch?v=31rhH3FM9-c
* How to Extrude Along a Curve in Blender
  * https://www.youtube.com/watch?v=iKWz1mTQYpA
* Blender 3.0 Tutorial - How to Add An Image To An Object
  * https://www.youtube.com/watch?v=jLGWE335J28 


## Render PNG sequence

```bash
# png to mp4 (from index 1153 met 30 FPS
ffmpeg -framerate 30 -start_number 1153 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p kikkerbilsluis-video-x1.mp4
# repeat 8 times, 576 frames, video only
ffmpeg -i kikkerbilsluis-video-x1.mp4 -filter_complex "loop=loop=8:size=576:start=0" kikkerbilsluis-video-x8.mp4
# repeat 8 times, audio
ffmpeg -stream_loop 8 -i kikkerbilsluis-audio-x1.wav -c copy kikkerbilsluis-audio-x8.wav
# video en audio samenvoegen
ffmpeg -i kikkerbilsluis-video-x8.mp4 -i kikkerbilsluis-audio-x8.wav -vcodec copy kikkerbilsluis-x8.mp4
# scale to 50%, 960 * 720
ffmpeg -i kikkerbilsluis-x8.mp4 -vf scale=960:720 kikkerbilsluis-x8_halfsize.mp4
```

## Muziek

Video duurt 576 frames.<br>
Video duurt 576 / 30 FPS = 19.2 seconden.<br>
Video duurt 8 maten van 4 beats = 32 beats.<br>
Een beat duurt 19.2 / 32 = 0.6 seconden.<br>
Het tempo is 60 / 0.6 = 100 BPM<br>
