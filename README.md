# Video 3D Physics

Video textures on 3D objects in a physics world that can be rendered as an image sequence.

## Background

Use background.ts to create a background video that exactly covers the viewport, but is in it's own 
scene.

## SVG

### Create an SVG with Sketch

* Add an Artboard in the size of the scene's plane width and height.
  * Or a multiple of the size because a small size can't zoom in enough in Sketch.
* Add an image to the Artboard to serve as a reference while drawing.
* Draw a vector shape.
  * Menu Insert > Vector.
  * Set Border width to 0 in the Inspector.
  * Draw with the pen tool.
  * Check Fill in the Inspector.
  * Correct node position with the pen tool while holding Command.
  * Name the drawn path in the Layer List.
  * Click 'Make exportable' and select SVG in the Inspector.

### Load with SVGLoader

* Use SVGLoader as in the documentation.
* Flip Y because the geometry will be upside down.
* Move half a plane left and up because the geometry's pivot is left top.

## FFMPEG

### Convert another video format to MP4.

```bash
ffmpeg -i input.avi -f mp4 -vcodec libx264 -pix_fmt yuv420p output.mp4
```

### Convert video to PNG image sequence.
'%05d' generates a zero padded five digit integer.

Second line to also deinterlace the video.<br>
https://superuser.com/questions/1274282/how-to-extract-images-from-video-files-using-ffmpeg-without-blur


```
ffmpeg -i input.avi frames/frame_%05d.png
ffmpeg -i input.avi -vf yadif frames/frame_%05d.png
```

### Convert PNG image sequence to MP4.

```
ffmpeg -framerate 30 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p output.mp4
```

### Batch convert files
On Mac and Linux only apparently.

```
for i in *.avi; do ffmpeg -i "$i" "${i%.*}.mp4"; done
```

### Optimised MP4 and Webm files 

```
# H265
ffmpeg -i input.mp4 -c:v libx265 -crf 23 -tag:v hvc1 -pix_fmt yuv420p -color_primaries 1 -color_trc 1 -colorspace 1 -movflags +faststart -an output.mp4

# VP9
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -speed 3 -pix_fmt yuv420p -color_primaries 1 -color_trc 1 -colorspace 1 -movflags +faststart -an output.webm
```

ffmpeg -i wouter_hisschemoller_-_place_saint_sulpice_-_2022_halfsize.mp4 -c:v libx265 -crf 23 -tag:v hvc1 -pix_fmt yuv420p -color_primaries 1 -color_trc 1 -colorspace 1 -movflags +faststart -an wouter_hisschemoller_-_place_saint_sulpice_-_2022_halfsize_optimised.mp4

ffmpeg -i wouter_hisschemoller_-_place_saint_sulpice_-_2022_halfsize.mp4 -c:v libvpx-vp9 -crf 30 -speed 3 -pix_fmt yuv420p -color_primaries 1 -color_trc 1 -colorspace 1 -movflags +faststart -an wouter_hisschemoller_-_place_saint_sulpice_-_2022_halfsize_optimised.webm

### Grab a single frame from a video
Get frame 180 as a png image:

```
ffmpeg -i input.mov -vf "select=eq(n\,179)" -vframes 1 output.png
```

### Repeat a video multiple times.
0 means no loop, -1 means infinite loop.

```
ffmpeg -stream_loop 3 -i input.mp4 -c copy output.mp4
```

### Repeat a video every number of frames.

Loop 3 times, each loop is 75 frames, skip the first 25 frames of the input.

```
ffmpeg -i input.mp4 -filter_complex "loop=loop=3:size=75:start=25" output.mp4
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

### Extract sound from video to wav.

```
ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav
```

### Extract a time slice of an original video.
-ss is the start time,<br>
-t is the slice duration.<br>
Timestamps are in HH:MM:SS.xxx format or in seconds (s.msec).

```
ffmpeg -ss 00:00:30.0 -i input.avi -c copy -t 00:00:10.0 output.avi
ffmpeg -ss 30 -i input.avi -c copy -t 10 output.avi

# Drop everything except the second minute of input:
ffmpeg -i input.mp4 -vf trim=60:120 output.mp4
# Keep only the first second:
ffmpeg -i input.mp4 -vf trim=duration=1 output.mp4
# Drop everything until second 13:
ffmpeg -i input.mp4 -vf trim=start=13 output.mp4
```

### Perspective correction filter
* Documentation: https://ffmpeg.org/ffmpeg-filters.html#perspective
* Example: https://stackoverflow.com/questions/61028674/perspective-correction-example

Coordinates are top left, top right, bottom left, bottom right.<br>
`x0=50` moves left top 50 pixels to the left, so outside the frame.<br>
But on the right side `x1=590` (width of 640 - 50) moves top right 50 px to the right, so outside the frame.<br>
Settings for a 640x480px video to have no correction applied:

```
ffmpeg -hide_banner -i input.mp4 -lavfi "perspective=x0=0:y0=0:x1=640:y1=0:x2=-0:y2=480:x3=640:y3=480:interpolation=linear" output.mp4
```

### Color adjustment filter

Set brightness, contrast, saturation and approximate gamma adjustment.<br>
https://ffmpeg.org/ffmpeg-filters.html#eq<br>

```
ffmpeg -i input.mp4 -vf eq=gamma_r=1.2:gamma_g=1.2:contrast=1.1 output.mp4
```

### Scale video to a specific size. 
-1 to keep aspect ratio.

```
ffmpeg -i input.avi -vf scale=320:240 output.avi
ffmpeg -i input.jpg -vf scale=320:-1 output_320.png
```

Scale by multiplication or division

```
ffmpeg -i input.mp4 -vf "scale=iw*.5:ih*.5" input_-_halfsize.mp4
ffmpeg -i input.mp4 -vf "scale=iw/2:ih/2" input_-_halfsize.mp4
```

## Crop video with the crop filter.
out_w and out_h are width and height of the output rectangle.
out_x and out_y are the left top corner of the output rectangle.

```
ffmpeg -i input.avi -filter:v "crop=out_w:out_h:out_x:out_y" output.avi
```

## Chromakey, replace greenscreen with transparency in PNG's.
chromakey=color:similarity:blend

```
ffmpeg -i input.mp4 -vf "chromakey=0x00ff00:0.3:0.2" frame_%05d.png
```

## FFPlay

Preview an edit.

```
ffplay -vf eq=brightness=0.01:saturation=1.1 input.mp4
```


## FFProbe

### Number of frames in a video

```
ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 input.mp4
```

### Information per frame

```
// show keyframe timestamps
ffprobe -v error -skip_frame nokey -show_entries frame=pkt_pts_time -select_streams v -of csv=p=0 input.mp4
// show all frames timestamps
ffprobe -v error -show_entries frame=pkt_pts_time -select_streams v -of csv=p=0 input.mp4
// show all frames timestamps and type
ffprobe -v error -show_entries frame=pkt_pts_time,pict_type -select_streams v -of csv=p=0 input.mp4
```

ffprobe -show_streams -count_frames droogbak.mp4
ffprobe -loglevel panic -select\_streams v -show\_entries "frames" -read\_intervals %+#1 droogbak.mp4
ffprobe -v error -show_entries frame=pkt_pts_time,pict_type,frame_index -select_streams v -of csv=p=0 droogbak.mp4

## FFmpeg module for Node
  
FFmpeg module for Node. This library provides a set of functions and utilities to abstract commands-line usage of ffmpeg. To use this library requires that ffmpeg is already installed.

https://www.npmjs.com/package/ffmpeg

* Can you "stream" images to ffmpeg to construct a video, instead of saving them to disk?
  * https://stackoverflow.com/questions/1329  4919/can-you-stream-images-to-ffmpeg-to-construct-a-video-instead-of-saving-them-t
* FFMPEG waiting for images in image2pipe mode
  * https://stackoverflow.com/questions/24026729/ffmpeg-waiting-for-images-in-image2pipe-mode

## FFmpeg.wasm

FFmpeg.wasm, a pure WebAssembly / JavaScript port of FFmpeg<br />
https://jeromewu.github.io/ffmpeg-wasm-a-pure-webassembly-javascript-port-of-ffmpeg/

# Enable3d Physics

## Constraints

### Fixed

Don't understand yet. Doesn't work like lock.

```typescript
fixed: (
  bodyA: PhysicsBody,
  bodyB: PhysicsBody,
  disableCollisionsBetweenLinkedBodies?: boolean | undefined,
) => Ammo.btFixedConstraint;
```

### Hinge

_pivotA_: Hinge point in bodyA's local coordinates.<br>
_axisA_: Hinge ...<br>

```typescript
hinge: (bodyA: PhysicsBody, bodyB: PhysicsBody, config: {
  pivotA?: Types.XYZ | undefined;
  pivotB?: Types.XYZ | undefined;
  axisA?: Types.XYZ | undefined;
  axisB?: Types.XYZ | undefined;
}, disableCollisionsBetweenLinkedBodies?: boolean | undefined) => Ammo.btHingeConstraint;
```

### Lock

Lock bodies in their current positions together. So important to first place them in the right
positions.

```typescript
lock: (
  bodyA: PhysicsBody,
  bodyB: PhysicsBody,
  disableCollisionsBetweenLinkedBodies?: boolean | undefined
) => Ammo.btGeneric6DofConstraint;
```

### Slider

```typescript
slider: (bodyA: PhysicsBody, bodyB: PhysicsBody, config?: {
  frameA?: Types.XYZ | undefined;
  frameB?: Types.XYZ | undefined;
  linearLowerLimit?: number | undefined;
  linearUpperLimit?: number | undefined;
  angularLowerLimit?: number | undefined;
  angularUpperLimit?: number | undefined;
}, disableCollisionsBetweenLinkedBodies?: boolean | undefined) => Ammo.btSliderConstraint;
```

### Spring

```typescript
spring: (bodyA: PhysicsBody, bodyB: PhysicsBody, config?: {
    stiffness?: number | undefined;
    damping?: number | undefined;
    angularLock?: boolean | undefined;
    linearLowerLimit?: Types.XYZ | undefined;
    linearUpperLimit?: Types.XYZ | undefined;
    angularLowerLimit?: Types.XYZ | undefined;
    angularUpperLimit?: Types.XYZ | undefined;
    center?: boolean | undefined;
    offset?: Types.XYZ | undefined;
    enableSpring?: boolean | undefined;
}, disableCollisionsBetweenLinkedBodies?: boolean | undefined) => Ammo.btGeneric6DofSpringConstraint;
```
