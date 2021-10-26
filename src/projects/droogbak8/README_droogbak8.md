# Droogbak video 8

Afmeting 1920 x 1080 px.

## Render

In mainscene.ts

```
isCapture = true;
```

Then:

```
// deinterlace and convert to image sequence
ffmpeg -i Amsterdam_Droogbak_2021-08-14_0008.mov -vf yadif frames/frame_%05d.png

// deinterlace and convert to image sequence and use 25 FPS
ffmpeg -i Amsterdam_Droogbak_2021-08-14_0008.mov -r 25 -vf yadif frames/frame_%05d.png

// png to mp4
ffmpeg -framerate 25 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p output.mp4
// add audio
ffmpeg -i output.mp4 -i public/assets/projects/droogbak8/digitakt1-loop.wav -vcodec copy output-audio.mp4
// repeat 16 times
ffmpeg -stream_loop 16 -i output-audio.mp4 -c copy output-audio-x16-25fps.mp4

// extract audio
ffmpeg -i output-audio-x16-30fps.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output-audio-x16-30fps.wav
ffmpeg -i output-audio-x16-30fps.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output-audio-x16-30fps.wav
ffmpeg -i output-audio.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output-audio.wav
```

## Test

112 BPM is het tempo van de muziek, 
0,535714285714286 seconden voor een beat, 
2,142857142857143 seconden voor een maat, 
30 FPS is de video, 
2,142857142857143 * 30 = 64,285714285714286 frames in een maat. 

25 FPS is de video, 
2,142857142857143 * 25 = 53,571428571428575 frames in een maat.

## Render

53 frames is de video lang, 
25 FPS is de video, 
53 / 25 = 2.12 seconden voor een maat, 
2.12 / 4 = 0.53 seconden voor een beat, 
60 / 0.53 = 113.20754716981132 BPM 

```
// png to mp4
ffmpeg -framerate 25 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p droogbak.mp4

// beter synchroon, als audio en video precies de juiste maat zijn.
// repeat 32 times, video alleen
ffmpeg -i droogbak.mp4 -filter_complex "loop=loop=32:size=64:start=0" droogbak-video-x32.mp4
// repeat 32, audio alleen
ffmpeg -stream_loop 32 -i "droogbak-x1-2.160s.wav" -c copy droogbak-audio-x32.wav
// video en audio samenvoegen
ffmpeg -i hortusbrug-video-x32.mp4 -i hortusbrug-audio-x32.wav -vcodec copy hortusbrug-x32.mp4
```


