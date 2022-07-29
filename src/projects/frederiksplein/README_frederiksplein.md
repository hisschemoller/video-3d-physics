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
ffmpeg -i "frederiksplein-1-720p_preview.mp4" -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-chromatest/frames_preview/frame_%05d.png'
```

## Runway

Green screen: #aaff00 // #828075 // #7c9058 #00ff00

```
# crop left  bottom to 720p.
ffmpeg -i frederiksplein.mov -filter:v "crop=1280:720:0:360" frederiksplein-720p.mov

# auto1
# time slice 1 - 10 sec (tijdsduur 9 sec)
ffmpeg -ss 00:00:01.0 -i frederiksplein-720p.mov -c copy -t 00:00:09.0 frederiksplein-720p-auto1.mov
# runway...
# chromakey greenscreen to transparency
ffmpeg -i auto1-720p.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-auto1/frames/frame_%05d.png'
# scale to 25%, 1280 * 0.25 = 320 (x 180)
ffmpeg -i auto1-720p.mp4 -vf scale=320:180 auto1-720p_preview.mp4
# chromakey greenscreen to transparency preview
ffmpeg -i auto1-720p_preview.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-auto1/frames_preview/frame_%05d.png'

# bikes1 (2 fietsers)
# time slice 3 - 14 sec (tijdsduur 11 sec)
ffmpeg -ss 00:00:03.10 -i frederiksplein-720p.mov -c copy -t 00:00:14.0 frederiksplein-720p-bikes1.mov

# bike1b (1 fietser)
# time slice 5 - 16 sec (tijdsduur 11 sec)
ffmpeg -ss 00:00:05.10 -i frederiksplein-720p.mov -c copy -t 00:00:11.0 frederiksplein-720p-bike1b.mov
# runway...
# chromakey greenscreen to transparency
ffmpeg -i bike1b-720p.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-bike1b/frames/frame_%05d.png'
# scale to 25%, 1280 * 0.25 = 320 (x 180)
ffmpeg -i bike1b-720p.mp4 -vf scale=320:180 bike1b-720p_preview.mp4
# chromakey greenscreen to transparency preview
ffmpeg -i bike1b-720p_preview.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-bike1b/frames_preview/frame_%05d.png'


# motor
# time slice 23 - 33 sec (tijdsduur 10 sec)
ffmpeg -ss 00:00:23.00 -i frederiksplein-720p.mov -c copy -t 00:00:10.0 frederiksplein-720p-motor.mov


# scooter
# time slice 43 - 52 sec (tijdsduur 9 sec)
ffmpeg -ss 00:00:42.70 -i frederiksplein-720p.mov -c copy -t 00:00:09.0 frederiksplein-720p-scooter.mov
# runway...
# chromakey greenscreen to transparency
ffmpeg -i scooter-720p.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-scooter/frames/frame_%05d.png'
# scale to 25%, 1280 * 0.25 = 320 (x 180)
ffmpeg -i scooter-720p.mp4 -vf scale=320:180 scooter-720p_preview.mp4
# chromakey greenscreen to transparency preview
ffmpeg -i scooter-720p_preview.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-scooter/frames_preview/frame_%05d.png'


# auto2
# time slice 38 - 50 sec (tijdsduur 12 sec)
ffmpeg -ss 00:00:37.60 -i frederiksplein-720p.mov -c copy -t 00:00:12.0 frederiksplein-720p-auto2.mov
# runway...
# chromakey greenscreen to transparency
ffmpeg -i auto2-720p.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-auto2/frames/frame_%05d.png'
# scale to 25%, 1280 * 0.25 = 320 (x 180)
ffmpeg -i auto2-720p.mp4 -vf scale=320:180 auto2-720p_preview.mp4
# chromakey greenscreen to transparency preview
ffmpeg -i auto2-720p_preview.mp4 -vf "chromakey=0xaaff00:0.3:0" '/Volumes/Samsung_X5/frederiksplein-auto2/frames_preview/frame_%05d.png'


# bikes2 (2 fietsers)
# time slice 45 - 58 sec (tijdsduur 13 sec)
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

Pattern duration: 16.695652173913043 sec.
Step duration: 0.13043478260869565 sec.
