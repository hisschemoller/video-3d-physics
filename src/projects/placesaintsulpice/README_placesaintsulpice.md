

## FFMPEG

```
// VIDEO 1613

// extract frame from IMG_1613 op 0:10 = 10 * 30 = 300 as an image
ffmpeg -i IMG_1613.MOV -vf "select=eq(n\,299)" -vframes 1 img_1613_frame_299.png
// remove audio
ffmpeg -i IMG_1613.MOV -vcodec copy -an placestsulpice-1613-a.mov
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i placestsulpice-1613-a.mov -lavfi "perspective=x0=-20:y0=0:x1=1941:y1=5:x2=0:y2=1080:x3=1920:y3=1073:interpolation=linear" placestsulpice-1613-b.mov
// extract frame from IMG_1613 op 0:10 = 10 * 30 = 300 as an image
ffmpeg -i placestsulpice-1613-b.mov -vf "select=eq(n\,299)" -vframes 1 img_1613_frame_299-perspective.png
// crop to 1920 x 700
ffmpeg -i placestsulpice-1613-b.mov -filter:v "crop=1920:700:0:0" placestsulpice-1613-c.mov
// time slice 0:58 1:10 minuut
ffmpeg -ss 00:00:58.0 -i placestsulpice-1613-c.mov -c copy -t 00:01:10.0 placestsulpice-1613-d.mov

// convert to png sequence
ffmpeg -i placestsulpice-1613-d.mov '/Volumes/Samsung_X5/placesaintsulpice-1613/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 176)
ffmpeg -i placestsulpice-1613-d.mov -vf scale=480:176 placestsulpice-1613-d_preview.mov
// convert preview to png sequence
ffmpeg -i placestsulpice-1613-d_preview.mov '/Volumes/Samsung_X5/placesaintsulpice-1613/frames_preview/frame_%05d.png'


// VIDEO 1615

// extract frame from IMG_1615 op 0:10 = 10 * 30 = 300 as an image
ffmpeg -i IMG_1615.MOV -vf "select=eq(n\,299)" -vframes 1 img_1615_frame_299.png
// remove audio
ffmpeg -i IMG_1615.MOV -vcodec copy -an placestsulpice-1615-a.mov
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i placestsulpice-1615-a.mov -lavfi "perspective=x0=0:y0=0:x1=1922:y1=22:x2=-14:y2=1086:x3=1893:y3=1100:interpolation=linear" placestsulpice-1615-b.mov
// extract frame from IMG_1615 op 0:10 = 10 * 30 = 300 as an image
ffmpeg -i placestsulpice-1615-b.mov -vf "select=eq(n\,299)" -vframes 1 img_1615_frame_299-perspective.png
// crop to 1920 x 730
ffmpeg -i placestsulpice-1615-b.mov -filter:v "crop=1920:730:0:0" placestsulpice-1615-c.mov
// time slice 0:00 1:04 minuut
ffmpeg -ss 00:00:00.0 -i placestsulpice-1615-c.mov -c copy -t 00:01:04.0 placestsulpice-1615-d.mov

// convert to png sequence
ffmpeg -i placestsulpice-1615-d.mov '/Volumes/Samsung_X5/placesaintsulpice-1615/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 182)
ffmpeg -i placestsulpice-1615-d.mov -vf scale=480:182 placestsulpice-1615-d_preview.mov
// convert preview to png sequence
ffmpeg -i placestsulpice-1615-d_preview.mov '/Volumes/Samsung_X5/placesaintsulpice-1615/frames_preview/frame_%05d.png'
```

Video 1613: 1920 x 700 px, preview 480 x 176 px<br>

Video 1615: 1920 x 730 px, preview 480 x 182 px<br>
