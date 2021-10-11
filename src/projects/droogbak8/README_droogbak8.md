# Droogbak video 8

Afmeting 1920 x 1080 px.

```
// png to mp4
ffmpeg -framerate 30 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p output.mp4
// add audio
ffmpeg -i output.mp4 -i public/assets/projects/droogbak8/digitakt1-loop.wav -vcodec copy output-audio.mp4
// repeat x times
ffmpeg -stream_loop 16 -i output-audio.mp4 -c copy output-audio-x16.mp4
```
