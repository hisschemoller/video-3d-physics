# Brug Prins Hendrikkade

Video size 1920 x 1080 px.

Correct perspective, remove audio and convert to MP4.<br>
Move left top 50px to the left, right top 70px to the right.

```
ffmpeg -hide_banner -i brugphkade1.mov -lavfi "perspective=x0=50:y0=0:x1=1850:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" -f mp4 -vcodec libx264 -pix_fmt yuv420p -an output.mp4
```
