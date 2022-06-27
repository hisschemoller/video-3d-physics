# Hazumi Ryokuchi (葉積緑地)

From a video by Aguyoshi which is here on Youtube: https://www.youtube.com/watch?v=tDu7qY-66ho

On Aguyoshi's own website on this page: https://aguyoshi.net/moyayoshi/202112/2114/

> Kakio is a station in Asao Ward, Kawasaki City.<br>
> It is a destination like the royal road of "Moyayoshi" who knows its existence but does not know what it is.<br>
> ...<br>
> It is troublesome to return to Kakio Station from here, so I will aim for Satsukidai Station on the Odakyu Tama Line.<br>
> In the middle of the road, there was a park called Hazumi Ryokuchi.<br>

Video recorded in Hazumi Ryokuchi park (葉積緑地).

```
# extract frame 180 as an image
ffmpeg -i hazumiryokuchi.mp4 -vf "select=eq(n\,179)" -vframes 1 hazumiryokuchi_frame_180.png
# color correction
ffmpeg -i hazumiryokuchi.mp4 -vf eq=gamma_r=1.08:gamma_g=1.04:gamma_b=0.94:contrast=1.1 hazumiryokuchi-colored.mp4
# perspective filter 1920 x 1080
ffmpeg -hide_banner -i hazumiryokuchi-colored.mp4 -lavfi "perspective=x0=0:y0=0:x1=1920:y1=0:x2=79:y2=1054:x3=1824:y3=1035:interpolation=linear" hazumiryokuchi-perspective.mp4
# extract frame 180 as an image
ffmpeg -i hazumiryokuchi-perspective.mp4 -vf "select=eq(n\,179)" -vframes 1 hazumiryokuchi-perspective_frame_180.png
# convert to png sequence
ffmpeg -i hazumiryokuchi-perspective.mp4 '/Volumes/Samsung_X5/hazumiryokuchi/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i hazumiryokuchi-perspective.mp4 -vf scale=480:270 hazumiryokuchi_preview.mp4
# convert preview to png sequence
ffmpeg -i hazumiryokuchi_preview.mp4 '/Volumes/Samsung_X5/hazumiryokuchi/frames_preview/frame_%05d.png'

// png to mp4 (from index 1) met 30 FPS
ffmpeg -framerate 30 -start_number 1 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p hazumiryokuchi-video-x1.mp4
// repeat 16 times, 144 frames, video alleen
ffmpeg -i hazumiryokuchi-video-x1.mp4 -filter_complex "loop=loop=16:size=431:start=0" hazumiryokuchi-video-x16.mp4
```

frame 169 tot 600
169 / 30 = 5.633333333333334 sec. videoStart

Glazed terra cotta textures:<br>
https://www.pitoreska.sk/en/terracotta/glazed-terracotta/colours-and-textures
