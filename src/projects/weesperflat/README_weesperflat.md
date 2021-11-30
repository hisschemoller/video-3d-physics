# Weteringschans

## FFMPEG

```
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "Amsterdam Weesperflat 21-07-2021.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat_frame_120.png
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i "Amsterdam Weesperflat 21-07-2021.mov" -lavfi "perspective=x0=0:y0=0:x1=1920:y1=24:x2=12:y2=1080:x3=1920:y3=1042:interpolation=linear" weesperflat-a.mov
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "weesperflat-a.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat-a_frame_120.png
// remove audio
ffmpeg -i weesperflat-a.mov -vcodec copy -an weesperflat-b.mov
// scale video
ffmpeg -i weesperflat-b.mov -vf scale=2134:1200 weesperflat-c.mov
// crop video, 20 links en 11 onder, 1900 x 1069
ffmpeg -i weesperflat-c.mov -filter:v "crop=1920:920:75:0" weesperflat-d.mov
// convert to mp4
ffmpeg -i weesperflat-d.mov -f mp4 -vcodec libx264 -pix_fmt yuv420p weesperflat-d.mp4
// extract frame 4 * 30 = 120 as an image
ffmpeg -i "weesperflat-d.mov" -vf "select=eq(n\,119)" -vframes 1 weesperflat-d_frame_120.png

// convert to png sequence
ffmpeg -i weesperflat-d.mov '/Volumes/Samsung_X5/weesperflat/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i weesperflat-d.mov -vf scale=480:-1 weesperflat-d_preview.mov
``` 
