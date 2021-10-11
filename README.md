# Video 3D Physics

Video textures on 3D objects in a physics world that can be rendered as an image sequence.

## Background

## FFMPEG

### Convert another video format to MP4.

```bash
ffmpeg -i input.avi -f mp4 -vcodec libx264 -pix_fmt yuv420p output.mp4
```

### Convert video to PNG image sequence.
'%05d' generates a zero padded five digit integer.

```
ffmpeg -i input.avi output_%05d.png
```

### Convert PNG image sequence to MP4.

```
ffmpeg -framerate 30 -i tmp/frame_%05d.png -c:v libx264 -crf 19 -preset slow -c:a aac -b:a 192k -ac 2 output.mp4
```

### Grab single frame from a video

Get frame 180 as a png image:

```
ffmpeg -i input.mov -vf "select=eq(n\,179)" -vframes 1 output.png
```

### Remove audio from a video file.

```
ffmpeg -i input.mov -vcodec copy -an input.mov
```

### Perspective correction filter
* Documentation: https://ffmpeg.org/ffmpeg-filters.html#perspective
* Example: https://stackoverflow.com/questions/61028674/perspective-correction-example

Coordinates are top left, top right, bottom left, bottom right.<br>
`x0=50` moves left top 50 pixels to the left, so outside the frame.<br>
Settings for a 640x480px video to have no correction applied:

```
ffmpeg -hide_banner -i input.mp4 -lavfi "perspective=x0=0:y0=0:x1=640:y1=0:x2=-0:y2=480:x3=640:y3=480:interpolation=linear"  output.mp4
```

## Resources

* https://moduscreate.com/blog/lint-style-typescript/
* https://dev.to/saurabhggc/add-eslint-prettier-and-airbnb-to-your-project-3mo8
* https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/
* https://robertcooper.me/post/using-eslint-and-prettier-in-a-typescript-project
