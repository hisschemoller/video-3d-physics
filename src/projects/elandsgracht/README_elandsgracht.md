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
