# Frederiksplein

Wind simulation: https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5973

Rotoscope / separate / extract moving object from background.<br />
With FFMPEG: https://oioiiooixiii.blogspot.com/2016/09/ffmpeg-extract-foreground-moving.html<br />
Runway uses AI: https://runwayml.com/<br />
After Effects<br />
Premiere<br />

## Runway test

```
# Image at 50 sec. (48 * 30 = 1440)
ffmpeg -i "Frederiksplein 2022-05-01 0005.mov" -vf "select=eq(n\,1440)" -vframes 1 whitecar.png
# Time slice 45 - 52 sec.
ffmpeg -ss 00:00:45.0 -i "Frederiksplein 2022-05-01 0005.mov" -c copy -t 00:00:07.0 whitecar.mov
# Crop.
ffmpeg -i whitecar.mov -filter:v "crop=1264:563:0:518" whitecar-cropped.mov
```
