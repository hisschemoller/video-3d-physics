# Stamford Road

John Smith - The Girl Chewing Gum (1976)<br>
https://en.wikipedia.org/wiki/The_Girl_Chewing_Gum

Dalston Odeon, Kingsland Road and Stamford Road, London, E8<br>
http://cinematreasures.org/theaters/14818

On Google Streetview:<br>
https://www.google.com/maps/@51.5448704,-0.0762395,3a,75y,149.02h,98.55t/data=!3m6!1e1!3m4!1sLF8NyhWDM1BSAlk3u37P_w!2e0!7i16384!8i8192<br>
Steele's is nu Scooterden, maar het gebouw is er nog, met een extra verdieping.

John Smith, The Girl Chewing Gum, 1976.mp4<br>
Overzicht scene: 6:00 - 7:20
stamfordroad1

## FFMPEG

```
// remove audio
ffmpeg -i "John Smith, The Girl Chewing Gum, 1976.mp4" -vcodec copy -an stamfordroad-a.mp4
// scale 4x, from 480×360 to 1920x1440
ffmpeg -i stamfordroad-a.mp4 -vf scale=1920:-1 stamfordroad-b.mp4
// extract main scene from 6:00 to 7:20, 
ffmpeg -ss 00:06:00.0 -i stamfordroad-b.mp4 -c copy -t 00:01:20.0 stamfordroad-main.mp4

// convert to png sequence
ffmpeg -i stamfordroad-main.mp4 '/Volumes/Samsung_X5/stamfordroad-main/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i stamfordroad-main.mp4 -vf scale=480:-1 stamfordroad-main_preview.mp4
// convert preview to png sequence
ffmpeg -i stamfordroad-main_preview.mp4 '/Volumes/Samsung_X5/stamfordroad-main/frames_preview/frame_%05d.png'
```
