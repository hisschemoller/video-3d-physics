# Weesperstraat

Weesperstraat 2 2022-08-19.mov<br>
1920 x 1080<br>
0:55

```bash
# extract frame 595 as an image
ffmpeg -i 'Weesperstraat 2 2022-08-19.mov' -vf "select=eq(n\,599)" -vframes 1 'Weesperstraat 2 2022-08-19 frame 600.png'
# perspective correct 1920 x 1080
ffmpeg -hide_banner -i 'Weesperstraat 2 2022-08-19.mov' -lavfi "perspective=x0=88:y0=0:x1=1843:y1=0:x2=0:y2=1054:x3=1920:y3=1080:interpolation=linear" weesperstraat-2-perspective.mov
# extract frame 595 as an image
ffmpeg -i 'weesperstraat-2-perspective.mov' -vf "select=eq(n\,599)" -vframes 1 'weesperstraat-2-perspective_frame_500.png'
# convert to png sequence
ffmpeg -i weesperstraat-2-perspective.mov '/Volumes/Samsung_X5/weesperstraat-2/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i weesperstraat-2-perspective.mov -vf scale=480:270 weesperstraat-2_preview.mov
# convert preview to png sequence
ffmpeg -i weesperstraat-2_preview.mov '/Volumes/Samsung_X5/weesperstraat-2/frames_preview/frame_%05d.png'
```

Weesperstraat 3 2022-08-19.mov<br>
1920 x 1080<br>
2:42

```bash
# extract frame 600 as an image
ffmpeg -i 'Weesperstraat 3 2022-08-19.mov' -vf "select=eq(n\,594)" -vframes 1 'Weesperstraat 3 2022-08-19 frame 595.png'
# perspective correct 1920 x 1080
ffmpeg -hide_banner -i 'Weesperstraat 3 2022-08-19.mov' -lavfi "perspective=x0=128:y0=0:x1=1812:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" weesperstraat-3-perspective.mov
# extract frame 595 as an image
ffmpeg -i 'weesperstraat-3-perspective.mov' -vf "select=eq(n\,599)" -vframes 1 'weesperstraat-3-perspective_frame_595.png'
# convert to png sequence
ffmpeg -i weesperstraat-3-perspective.mov '/Volumes/Samsung_X5/weesperstraat-3/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i weesperstraat-3-perspective.mov -vf scale=480:270 weesperstraat-3_preview.mov
# convert preview to png sequence
ffmpeg -i weesperstraat-3_preview.mov '/Volumes/Samsung_X5/weesperstraat-3/frames_preview/frame_%05d.png'
```

* Enable3d raycast vehicle:
  * https://enable3d.io/examples/raycast-vehicle.html
  * https://github.com/enable3d/enable3d-website/blob/master/src/examples/raycast-vehicle.html
* Vehicle physics with Cannon.js
  * https://discourse.threejs.org/t/vehicle-physics-with-cannon-js/11769
  * https://jblaha.art/sketchbook/0.4/
  * https://github.com/swift502/Sketchbook
