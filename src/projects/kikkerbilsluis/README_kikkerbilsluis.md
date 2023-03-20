# Kikkerbilsluis

Amsterdam Brug PHKade 1 21-07-2021.mov<br>
1920 x 1080
1:18

```
# perspective correct 1920 x 1080
ffmpeg -hide_banner -i "Amsterdam Brug PHKade 1 21-07-2021.mov" -lavfi "perspective=x0=50:y0=0:x1=1857:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" kikkerbilsluis-1-perspective.mov
# extract frame 500 as an image
ffmpeg -i kikkerbilsluis-1-perspective.mov -vf "select=eq(n\,449)" -vframes 1 kikkerbilsluis-1-perspective_frame_500.png
# convert to png sequence
ffmpeg -i kikkerbilsluis-1-perspective.mov '/Volumes/Samsung_X5/kikkerbilsluis-1/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i kikkerbilsluis-1-perspective.mov -vf scale=480:270 kikkerbilsluis-1_preview.mov
# convert preview to png sequence
ffmpeg -i kikkerbilsluis-1_preview.mov '/Volumes/Samsung_X5/kikkerbilsluis-1/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 2 21-07-2021.mov<br>
1920 x 1080
1:19

```
# convert to png sequence
ffmpeg -i "Amsterdam Brug PHKade 2 21-07-2021.mov" '/Volumes/Samsung_X5/kikkerbilsluis-2/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i "Amsterdam Brug PHKade 2 21-07-2021.mov" -vf scale=480:270 kikkerbilsluis-2_preview.mov
# convert preview to png sequence
ffmpeg -i kikkerbilsluis-2_preview.mov '/Volumes/Samsung_X5/kikkerbilsluis-2/frames_preview/frame_%05d.png'
```

Amsterdam Brug PHKade 3 21-07-2021.mov<br>
1920 x 1080
2:07

```
# convert to png sequence
ffmpeg -i "Amsterdam Brug PHKade 3 21-07-2021.mov" '/Volumes/Samsung_X5/kikkerbilsluis-3/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i "Amsterdam Brug PHKade 3 21-07-2021.mov" -vf scale=480:270 kikkerbilsluis-3_preview.mov
# convert preview to png sequence
ffmpeg -i kikkerbilsluis-3_preview.mov '/Volumes/Samsung_X5/kikkerbilsluis-3/frames_preview/frame_%05d.png'
```
