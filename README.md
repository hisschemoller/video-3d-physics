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
ffmpeg -i input.avi rendered/frame_%05d.png
```

### Convert PNG image sequence to MP4.

```
ffmpeg -framerate 30 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p output.mp4
```

### Grab single frame from a video
Get frame 180 as a png image:

```
ffmpeg -i input.mov -vf "select=eq(n\,179)" -vframes 1 output.png
```

### Repeat a video multiple times.
0 means no loop, -1 means infinite loop.

```
ffmpeg -stream_loop 3 -i input.mp4 -c copy output.mp4
```

### Remove audio from a video file.

```
ffmpeg -i input.mov -vcodec copy -an input.mov
```

### Add wav audio to mp4 video.

```
ffmpeg -i input_vid.mp4 -i input_audio.wav -vcodec copy output.mp4
ffmpeg -i input_vid.mp4 -i input_audio.wav -vcodec libx264 -acodec libmp3lame output.mp4
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

### Scale video to a specific size. -1 to keep aspect ratio.

```
ffmpeg -i input.avi -vf scale=320:240 output.avi
ffmpeg -i input.jpg -vf scale=320:-1 output_320.png
```
