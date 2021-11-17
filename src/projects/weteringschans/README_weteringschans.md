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
```
