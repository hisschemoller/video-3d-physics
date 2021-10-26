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
ffmpeg -framerate 25 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p droogbak.mp4
// add audio
ffmpeg -i output.mp4 -i public/assets/projects/droogbak8/digitakt1-loop.wav -vcodec copy droogbak-audio.mp4
// repeat 16 times
ffmpeg -stream_loop 16 -i droogbak-audio.mp4 -c copy droogbak-audio-x16-25fps.mp4

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