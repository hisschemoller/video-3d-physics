# Prins Hendrikkade

## FFMPEG

```
// remove audio
ffmpeg -i "Amsterdam PH Kade 2021-08-14 0015.mov" -vcodec copy -an prinshendrikkade-a.mov
// extract frame op 2:11 = 131 * 50 = 6550 as an image
ffmpeg -i "Amsterdam PH Kade 2021-08-14 0015.mov" -vf "select=eq(n\,6549)" -vframes 1 prinshendrikkade_frame_6550.png
```
