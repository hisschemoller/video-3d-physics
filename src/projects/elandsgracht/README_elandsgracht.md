# Elandsgracht

Video: Elandsgracht 2022-05-14 0005.mov

## FFmpeg

```
# extract frame 300 as an image
ffmpeg -i 'Elandsgracht 2022-05-14 0005.mov' -vf "select=eq(n\,300)" -vframes 1 elandsgracht_frame_300.png
# remove first 7 seconds
ffmpeg -ss 00:00:07.0 -i 'Elandsgracht 2022-05-14 0005.mov' -c copy -t 00:02:31.0 elandsgracht1.mov
# rotate -0.4 degrees
ffmpeg -i elandsgracht1.mov -vf "rotate=-0.4*PI/180" elandsgracht2.mov
# extract frame 300 as an image
ffmpeg -i elandsgracht2.mov -vf "select=eq(n\,300)" -vframes 1 elandsgracht2_frame_300.png
# convert to png sequence
ffmpeg -i elandsgracht2.mov '/Volumes/Samsung_X5/elandsgracht/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i elandsgracht2.mov -vf scale=480:270 elandsgracht2_preview.mov
# convert preview to png sequence
ffmpeg -i elandsgracht2_preview.mov '/Volumes/Samsung_X5/elandsgracht/frames_preview/frame_%05d.png'
```

## FFmpeg render at 110 BPM

```
# png to mp4 (from index 260 met 30 FPS
ffmpeg -framerate 30 -start_number 260 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p elandsgracht-video-x1.mp4
# repeat 16 times, 235 frames, video alleen
ffmpeg -i elandsgracht-video-x1.mp4 -filter_complex "loop=loop=16:size=235:start=0" elandsgracht-video-x16.mp4
```

## FFmpeg Nieuwmarkt

```
# convert to png sequence
ffmpeg -i 'Nieuwmarkt IMG_7942.mov' '/Volumes/Samsung_X5/nieuwmarkt/frames/frame_%05d.png'
# png to mp4 (from index 0 met 30 FPS
ffmpeg -framerate 30 -start_number 260 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p elandsgracht-video-x1.mp4
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i 'Nieuwmarkt IMG_7942.mov' -vf scale=480:270 'Nieuwmarkt IMG_7942_preview.mov'
# convert preview to png sequence
ffmpeg -i 'Nieuwmarkt IMG_7942_preview.mov' '/Volumes/Samsung_X5/nieuwmarkt/frames_preview/frame_%05d.png'
```

## FFmpeg Rokin

```
# convert to png sequence
ffmpeg -i 'Rokin 2019-08-24 IMG_0170.MOV' '/Volumes/Samsung_X5/rokin/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i 'Rokin 2019-08-24 IMG_0170.MOV' -vf scale=480:270 'rokin_preview.mov'
# convert preview to png sequence
ffmpeg -i 'rokin_preview.mov' '/Volumes/Samsung_X5/rokin/frames_preview/frame_%05d.png'
```

## FFmpeg render at 110 BPM (122.5)

```
# png to mp4 (from index 260 met 30 FPS
ffmpeg -framerate 30 -start_number 260 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p elandsgracht-video-x1.mp4
# repeat 16 times, 235 frames, video alleen
ffmpeg -i elandsgracht-video-x1.mp4 -filter_complex "loop=loop=16:size=235:start=0" elandsgracht-video-x16.mp4
```

## FFmpeg render at 103 BPM

```
# png to mp4 (from index 286 met 30 FPS
ffmpeg -framerate 30 -start_number 286 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p elandsgracht-video-x1.mp4
# repeat 16 times, 276 frames, video alleen
ffmpeg -i elandsgracht-video-x1.mp4 -filter_complex "loop=loop=16:size=276:start=0" elandsgracht-video-x16.mp4
# repeat 16 times, audio
ffmpeg -stream_loop 16 -i elandsgracht-audio-x1.wav -c copy elandsgracht-audio-x16.wav
# video en audio samenvoegen
ffmpeg -i elandsgracht-video-x16.mp4 -i elandsgracht-audio-x16.wav -vcodec copy elandsgracht-x16.mp4
# scale to 50%, 960 * 540
ffmpeg -i elandsgracht-x16.mp4 -vf scale=960:540 elandsgracht-x16_halfsize.mp4
```

### Muziek

Sampled Music album 3, 5 of 15.

Video duurt 235 frames.<br> 
Video duurt 235 / 30 FPS = 7.833333333333333 seconden.<br>
Video duurt 4 maten van 4 beats = 16 beats.<br>
Een beat duurt 7.833333333333333 / 16 = 0.4895833333333333 seconden.<br>
Het tempo is 60 / 0.4895833333333333 = 122.55319148936171 BPM<br>

Video duurt 276 frames.<br> 
Video duurt 276 / 30 FPS = 9.2 seconden.<br>
Video duurt 4 maten van 4 beats = 16 beats.<br>
Een beat duurt 9.2 / 16 = 0.575 seconden.<br>
Het tempo is 60 / 0.575 = 104.34782608695653 BPM<br>

