# Haarlemmerplein

Haarlemmerplein 2022-05-01 0019<br>
1920 x 1080
1:37

```
# perspective correct 1920 x 1080
ffmpeg -hide_banner -i "Haarlemmerplein 2022-05-01 0019.mov" -lavfi "perspective=x0=34:y0=0:x1=1843:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" haarlemmerplein-19-perspective.mov
# extract frame 500 as an image
ffmpeg -i haarlemmerplein-19-perspective.mov -vf "select=eq(n\,449)" -vframes 1 haarlemmerplein-19-perspective_frame_500.png
# increase the brightness (no, on second thoughts not)
# ffmpeg -i haarlemmerplein-19-perspective.mov -vf eq=brightness=0.04:contrast=1.04:saturation=1.00 haarlemmerplein-19-brightness.mov
# convert to png sequence
ffmpeg -i haarlemmerplein-19-perspective.mov '/Volumes/Samsung_X5/haarlemmerplein-19/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i haarlemmerplein-19-perspective.mov -vf scale=480:270 haarlemmerplein-19_preview.mov
# convert preview to png sequence
ffmpeg -i haarlemmerplein-19_preview.mov '/Volumes/Samsung_X5/haarlemmerplein-19/frames_preview/frame_%05d.png'
```

Haarlemmerplein 2022-05-01 0020<br>
1920 x 1080
2:16

```
# perspective correct 1920 x 1080
ffmpeg -hide_banner -i "Haarlemmerplein 2022-05-01 0020.mov" -lavfi "perspective=x0=106:y0=0:x1=1888:y1=14:x2=19:y2=918:x3=1920:y3=1048:interpolation=linear" haarlemmerplein-20-perspective.mov
# extract frame 500 as an image
ffmpeg -i haarlemmerplein-20-perspective.mov -vf "select=eq(n\,449)" -vframes 1 haarlemmerplein-20-perspective_frame_500.png
# convert to png sequence
ffmpeg -i haarlemmerplein-20-perspective.mov '/Volumes/Samsung_X5/haarlemmerplein-20/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i haarlemmerplein-20-perspective.mov -vf scale=480:270 haarlemmerplein-20_preview.mov
# convert preview to png sequence
ffmpeg -i haarlemmerplein-20_preview.mov '/Volumes/Samsung_X5/haarlemmerplein-20/frames_preview/frame_%05d.png'
```