# Frederiksplein

Wind simulation: https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5973

Shadow material:

* Shadow Catcher in three.js / shadow on transparent material
  * https://stackoverflow.com/questions/35710130/shadow-catcher-in-three-js-shadow-on-transparent-material
* ShadowMaterial
  * https://threejs.org/docs/index.html?q=ShadowMaterial#api/en/materials/ShadowMaterial

Rotoscope / separate / extract moving object from background.<br />
With FFMPEG: https://oioiiooixiii.blogspot.com/2016/09/ffmpeg-extract-foreground-moving.html<br />
Runway uses AI: https://runwayml.com/<br />
After Effects<br />
Premiere<br />

## Runway test

```
# image at 50 sec. (48 * 30 = 1440)
ffmpeg -i "Frederiksplein 2022-05-01 0005.mov" -vf "select=eq(n\,1440)" -vframes 1 whitecar.png
# time slice 45 - 52 sec.
ffmpeg -ss 00:00:45.0 -i "Frederiksplein 2022-05-01 0005.mov" -c copy -t 00:00:07.0 whitecar.mov
# crop.
ffmpeg -i whitecar.mov -filter:v "crop=1264:563:0:518" whitecar-cropped.mov
# chromakey greenscreen to transparency
ffmpeg -i "frederiksplein-1-720p.mp4" -vf "chromakey=0x00ff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-chromatest/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i frederiksplein-1-720p.mp4 -vf scale=480:270 frederiksplein-1-720p_preview.mp4
# chromakey greenscreen to transparency preview
ffmpeg -i "frederiksplein-1-720p_preview.mp4" -vf "chromakey=0x00ff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-chromatest/frames_preview/frame_%05d.png'
```

## Runway real

```
# crop left  bottom to 720p.
ffmpeg -i frederiksplein.mov -filter:v "crop=1280:720:0:360" frederiksplein-720p.mov

# auto1
# time slice 1 - 10 sec.
ffmpeg -ss 00:00:01.0 -i frederiksplein-720p.mov -c copy -t 00:00:09.0 frederiksplein-720p-auto1.mov
# chromakey greenscreen to transparency
ffmpeg -i auto1-720p.mp4 -vf "chromakey=0x00ff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-auto1/frames/frame_%05d.png'
# scale to 25%, 1280 * 0.25 = 320 (x 180)
ffmpeg -i auto1-720p.mp4 -vf scale=320:180 auto1-720p_preview.mp4
# chromakey greenscreen to transparency preview
ffmpeg -i auto1-720p_preview.mp4 -vf "chromakey=0x00ff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-auto1/frames_preview/frame_%05d.png'
```

## FFmpeg

```
# slice from second 8
ffmpeg -i "Frederiksplein 2022-05-01 0005.mov" -vf trim=start=8 frederiksplein1.mov
ffmpeg -ss 00:00:08.0 -i "Frederiksplein 2022-05-01 0005.mov" -c copy -t 00:10:00.0 frederiksplein.mov
# convert to png sequence
ffmpeg -i frederiksplein.mov '/Volumes/Samsung_X5/frederiksplein/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i frederiksplein.mov -vf scale=480:270 frederiksplein_preview.mov
# convert preview to png sequence
ffmpeg -i frederiksplein_preview.mov '/Volumes/Samsung_X5/frederiksplein/frames_preview/frame_%05d.png'
```
