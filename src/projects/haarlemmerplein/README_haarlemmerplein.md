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
1920 x 1080<br>
2:16<br>

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

haarlemmerplein-19-27-34 720p greenscreen.mp4<br>
1280 × 720<br>
0:07<br>
#00B140, daarna #00ff00

```
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'haarlemmerplein-19-27-34 720p 0x00ff00.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/haarlemmerplein-19-27-34_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/haarlemmerplein-19-27-34_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/haarlemmerplein-19-27-34_greenscreen/frames_preview/frame_%05d.png'
```

haarlemmerplein-19-100-117 720p greenscreen.mp4<br>
1280 × 720<br>
0:07<br>

```
# slice 17 seconds
ffmpeg -ss 00:01:00.0 -i 'haarlemmerplein-19-perspective.mov' -c copy -t 00:00:17.0 'haarlemmerplein-19-100-117.mov'
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'haarlemmerplein-19-100-117 720p 0x00ff00.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/haarlemmerplein-19-100-117_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/haarlemmerplein-19-100-117_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/haarlemmerplein-19-100-117_greenscreen/frames_preview/frame_%05d.png'
```

haarlemmerplein-20-34-54 720p greenscreen.mp4<br>
1280 × 720<br>
0:07<br>

```
# slice 20 seconds
ffmpeg -ss 00:00:34.0 -i 'haarlemmerplein-20-perspective.mov' -c copy -t 00:00:20.0 'haarlemmerplein-20-34-54.mov'
# chromakey greenscreen to transparent PNGs
ffmpeg -i 'haarlemmerplein-20-34-54 720p 0x00ff00.mp4' -vf "chromakey=0x00ff00:0.28:0.05" '/Volumes/Samsung_X5/haarlemmerplein-20-34-54_greenscreen/frames/frame_%05d.png'
# scale PNGs to 25%, 1280 * 0.25 = 320 (x 180) preview size
ffmpeg -start_number 1 -i '/Volumes/Samsung_X5/haarlemmerplein-20-34-54_greenscreen/frames/frame_%05d.png' -vf scale=320:180 '/Volumes/Samsung_X5/haarlemmerplein-20-34-54_greenscreen/frames_preview/frame_%05d.png'
```
