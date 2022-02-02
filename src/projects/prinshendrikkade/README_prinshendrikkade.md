# Prins Hendrikkade

## Image texture on SVG (or rectangle box)

* Create a canvas with the same width / height ratio as the box (or svg) but in the desired pixel
resulution of course.
* The canvas should completely cover the front of the box or the SVG extrude.
  * In a box the default texture repeat of '1' will take care of that.
  * In an SVG extrude this has to be calculated.
* The correct part of the image must be drawn on the canvas with the context.drawImage parameters.


## FFMPEG

```
// remove audio
ffmpeg -i "Amsterdam PH Kade 2021-08-14 0015.mov" -vcodec copy -an prinshendrikkade-a.mov
// extract frame op 2:11 = 131 * 25 = 3275 as an image
ffmpeg -i "Amsterdam PH Kade 2021-08-14 0015.mov" -vf "select=eq(n\,3274)" -vframes 1 prinshendrikkade_frame_3275.png
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i prinshendrikkade-a.mov -lavfi "perspective=x0=39:y0=47:x1=1900:y1=0:x2=6:y2=1053:x3=1920:y3=1080:interpolation=linear" prinshendrikkade-b.mov
// extract frame op 2:11 = 131 * 25 = 3275 as an image
ffmpeg -i prinshendrikkade-b.mov -vf "select=eq(n\,3274)" -vframes 1 prinshendrikkade-b_frame_3275.png

// deinterlace and convert to image sequence and use 25 FPS
ffmpeg -i prinshendrikkade-b.mov -r 25 -vf yadif '/Volumes/Samsung_X5/prinshendrikkade/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i prinshendrikkade-b.mov -vf scale=480:-1 prinshendrikkade-b_preview.mov
// deinterlace and convert to image sequence and use 25 FPS
ffmpeg -i prinshendrikkade-b_preview.mov -r 25 -vf yadif '/Volumes/Samsung_X5/prinshendrikkade/frames_preview/frame_%05d.png'
```
