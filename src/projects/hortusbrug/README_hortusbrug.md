# Hortusbrug 2017

## FFMPEG

```
// remove first 17 seconds, remove audio
ffmpeg -ss 00:00:17.0 -i Hortusbrug_2017-08-27_MVI_0548.avi -t 00:10:00.0 -c copy -an hortusbrug.avi
// extract frame 180 as image
ffmpeg -i hortusbrug.avi -vf "select=eq(n\,179)" -vframes 1 hortusbrug_frame_180.png
// scale x 4 (2560 x 1920)
ffmpeg -i hortusbrug.avi -vf scale=2560:-1 hortusbrugx4.avi
// convert to mp4
ffmpeg -i hortusbrugx4.avi -f mp4 -vcodec libx264 -pix_fmt yuv420p hortusbrugx4.mp4
// perspective filter 2560 - 104 = 2456
ffmpeg -hide_banner -i hortusbrugx4.mp4 -lavfi "perspective=x0=192:y0=0:x1=2456:y1=0:x2=0:y2=1920:x3=2560:y3=1920:interpolation=linear" hortusbrugx4_perspective.mp4
// extract frame 180 as image
ffmpeg -i hortusbrugx4_perspective.mp4 -vf "select=eq(n\,179)" -vframes 1 hortusbrugx4_perspective_frame_180.png
// convert to png sequence
ffmpeg -i hortusbrugx4_perspective.mp4 '/Volumes/Samsung_X5/frames_hortusbrug/frames/frame_%05d.png'
// scale to 20%, 2560 * 0.2 = 512
ffmpeg -i hortusbrugx4_perspective.mp4 -vf scale=512:-1 hortusbrugx4_perspective_preview.mp4
// convert preview to png sequence
ffmpeg -i hortusbrugx4_perspective_preview.mp4 '/Volumes/Samsung_X5/frames_hortusbrug/frames_preview/frame_%05d.png'

// png to mp4
ffmpeg -framerate 30 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p hortusbrug.mp4
// add audio
ffmpeg -i hortusbrug.mp4 -i hortusbrug-x1.wav -vcodec copy hortusbrug-audio.mp4
// repeat 32 times, nee audio en video lopen niet synchroon
ffmpeg -stream_loop 32 -i hortusbrug-audio.mp4 -c copy hortusbrug-audio-x32.mp4
// repeat 32 times, nee loopt vast
ffmpeg -i hortusbrug-audio.mp4 -filter_complex "loop=loop=32:size=64:start=0" hortusbrug-audio-x32.mp4
// video en audio samenvoegen en gelijk herhalen. Nee, audio herhaalt niet mee.
ffmpeg -i hortusbrug.mp4 -i "hortusbrug-x1-125.5bpm.wav" -filter_complex "loop=loop=32:size=64:start=0" hortusbrug-audio-x32.mp4

// beter synchroon, als audio en video precies de juiste maat zijn.
// repeat 32 times, video alleen
ffmpeg -i hortusbrug.mp4 -filter_complex "loop=loop=32:size=64:start=0" hortusbrug-video-x32.mp4
// repeat 32, audio alleen
ffmpeg -stream_loop 32 -i "hortusbrug-x1-125.5bpm.wav" -c copy hortusbrug-audio-x32.wav
// video en audio samenvoegen
ffmpeg -i hortusbrug-video-x32.mp4 -i hortusbrug-audio-x32.wav -vcodec copy hortusbrug-x32.mp4
```

64 frames is de video lang, 
30 FPS is de video, 
64 / 30 = 2,133333333333333 seconden voor een maat, 
2,133333333333333 / 4 = 0,533333333333333 seconden voor een beat, 
60 / 0,533333333333333 = 112,50000000000007 BPM 

Audio bestand tijdsduur: 2.133333 seconden

Video bestand tijdsduur: te lang!

## SVG 
