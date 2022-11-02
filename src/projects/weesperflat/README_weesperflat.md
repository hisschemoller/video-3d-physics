# Weesperflat

## FFMPEG

```
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "Amsterdam Weesperflat 21-07-2021.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat_frame_120.png
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i "Amsterdam Weesperflat 21-07-2021.mov" -lavfi "perspective=x0=0:y0=0:x1=1920:y1=24:x2=12:y2=1080:x3=1920:y3=1042:interpolation=linear" weesperflat-a.mov
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "weesperflat-a.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat-a_frame_120.png
// remove audio
ffmpeg -i weesperflat-a.mov -vcodec copy -an weesperflat-b.mov
// scale video
ffmpeg -i weesperflat-b.mov -vf scale=2134:1200 weesperflat-c.mov
// crop video, 20 links en 11 onder, 1900 x 1069
ffmpeg -i weesperflat-c.mov -filter:v "crop=1920:920:75:0" weesperflat-d.mov
// convert to mp4
ffmpeg -i weesperflat-d.mov -f mp4 -vcodec libx264 -pix_fmt yuv420p weesperflat-d.mp4
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "weesperflat-d.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat-d_frame_120.png

// convert to png sequence
ffmpeg -i weesperflat-d.mov '/Volumes/Samsung_X5/weesperflat/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i weesperflat-d.mov -vf scale=480:-1 weesperflat-d_preview.mov
// convert preview to png sequence
ffmpeg -i weesperflat-d_preview.mov '/Volumes/Samsung_X5/weesperflat/frames_preview/frame_%05d.png'


// TWEEDE VIDEO
// crop video tot 664 hoogte.
ffmpeg -i weesperflat-b.mov -filter:v "crop=1920:664:0:0" weesperflat-2a.mov
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "weesperflat-2a.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat-2a_frame_120.png

// convert to png sequence
ffmpeg -i weesperflat-2a.mov '/Volumes/Samsung_X5/weesperflat2/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i weesperflat-2a.mov -vf scale=480:-1 weesperflat-2a_preview.mov
// convert preview to png sequence
ffmpeg -i weesperflat-2a_preview.mov '/Volumes/Samsung_X5/weesperflat2/frames_preview/frame_%05d.png'

// png to mp4 (from index 225)
ffmpeg -framerate 30 -start_number 225 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p weesperflat-video-x1.mp4
// repeat 32 times, 56 frames, video alleen
ffmpeg -i weesperflat-video-x1.mp4 -filter_complex "loop=loop=32:size=56:start=0" weesperflat-video-x32.mp4
// repeat 32, audio alleen
ffmpeg -stream_loop 32 -i "weesperflat-audio-x1.wav" -c copy weesperflat-audio-x32.wav
// video en audio samenvoegen
ffmpeg -i weesperflat-video-x32.mp4 -i weesperflat-audio-x32.wav -vcodec copy weesperflat-x32.mp4
```

## Berekeningen

* Digitakt 12 als muziek gebruiken.
* Audio is 129 BPM.
* Audio is (60 / 129) * 4 = 1.8604651162790697 seconden lang.
* Video is 30 FPS.
* Video is 1.8604651162790697 * 30 = 55.81395348837209 frames lang.
* Video is 56 frames lang, afgerond.
* Video is 56 / 30 = 1.8666666666666667 seconden voor een maat.
