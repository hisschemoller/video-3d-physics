# Weteringschans

## FFMPEG

```
// extract frame 18 * 30 = 540 as an image
ffmpeg -i "Weteringschans Snackbar De Prins (lichter) 2021-11-05.mov" -vf "select=eq(n\,539)" -vframes 1 weteringschans_frame_540.png
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i "Weteringschans Snackbar De Prins (lichter) 2021-11-05.mov" -lavfi "perspective=x0=0:y0=0:x1=1920:y1=44:x2=23:y2=1080:x3=1920:y3=1006:interpolation=linear" weteringschans-a.mov
// extract frame 540 as an image
ffmpeg -i "weteringschans-a.mov" -vf "select=eq(n\,539)" -vframes 1 weteringschans_frame_540_perspectief.png
// remove audio
ffmpeg -i weteringschans-a.mov -vcodec copy -an weteringschans-b.mov
// convert to mp4
ffmpeg -i weteringschans-b.mov -f mp4 -vcodec libx264 -pix_fmt yuv420p weteringschans.mp4

// convert to png sequence
ffmpeg -i weteringschans-b.mov '/Volumes/Samsung_X5/weteringschans/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i weteringschans-b.mov -vf scale=480:-1 weteringschans-b_preview.mov
// convert preview to png sequence
ffmpeg -i weteringschans-b_preview.mov '/Volumes/Samsung_X5/weteringschans/frames_preview/frame_%05d.png'

// png to mp4 (from index 61)
ffmpeg -framerate 30 -start_number 61 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p weteringschans-video-x1.mp4
// repeat 32 times, 61 frames, video alleen
ffmpeg -i weteringschans-video-x1.mp4 -filter_complex "loop=loop=32:size=61:start=0" weteringschans-video-x32.mp4
// repeat 32, audio alleen
ffmpeg -stream_loop 32 -i "weteringschans-audio-x1.wav" -c copy weteringschans-audio-x32.wav
// video en audio samenvoegen
ffmpeg -i weteringschans-video-x32.mp4 -i weteringschans-audio-x32.wav -vcodec copy weteringschans-x32.mp4
```

## Berekeningen

* Digitakt 2 als muziek gebruiken.
* Audio is 118 BPM. 
* Audio is (60 / 118) * 4 = 2.0338983050847457 seconden lang.
* Video is 30 FPS.
* Video is 2.0338983050847457 * 30 = 61.01694915254237 frames lang.
* Video is 61 frames lang, afgerond.
* Video iis 61 / 30 = 2.033333333333333 seconden voor een maat.
