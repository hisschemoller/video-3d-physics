# Spui

Spui 2019-08-24 IMG_0164.MOV

* 1:20 - Lege straat.
* 1:53 - Lege straat.

```
// extract frame op 1:21 = 81 * 30 = 2430 as an image
ffmpeg -i 'Spui 2019-08-24 IMG_0164.MOV' -vf "select=eq(n\,2429)" -vframes 1 spui_frame_2430.png
// convert to png sequence
ffmpeg -i 'Spui 2019-08-24 IMG_0164.MOV' '/Volumes/Samsung_X5/spui-0164/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i 'Spui 2019-08-24 IMG_0164.MOV' -vf scale=480:270 spui-0164_preview.mov
// convert preview to png sequence
ffmpeg -i spui-0164_preview.mov '/Volumes/Samsung_X5/spui-0164/frames_preview/frame_%05d.png'
```

## Oud

Video's

* Spui 2019-08-24 IMG_0160.MOV
  * (kijkend recht in de NZVBW)
    * 1:01 - Tram komt aanrijden uit de NZVBW.
    * 1:21 - Kinderwagen stoeprand op.
    * 2:18 - Auto uitladen.
    * 3:39 - Nog een tram.
* Spui 2019-08-24 IMG_0161.MOV
  * (kijkend schuin in de NZVBW en naar athenaeum)
    * 0:57 - Tram rijdt Spui op.
* Spui 2019-08-24 IMG_0162.MOV
  * (achter hotdog wagen)
    * 0:55 - Veegwagentje komt aanrijden.
* Spui 2019-08-24 IMG_0164.MOV
  * (hoek Spui en NZVBW)
    * 0:00 - Mensen lopen voorbij.
    * 0:45 - Twee trams.
    * 1:04 - Mensen steken over, open auto.
* Spui 2019-08-24 IMG_0165.MOV
  * (kijkend schuin in de NZVBW en naar ABC)
    * 0:30 - Vrouw met blauwe jurk. Daarna twee vrouwen.
* Spui 2019-08-24 IMG_0166.MOV
    * 0:27 - Vrouw blauwe stippen jurk.
    * 1:20 - Vrouwen staan met telefoons.
    * 2:53 - Veel vrouwen met hoofddoekjes.
* Spui 2019-08-24 IMG_0167.MOV
  * 0:17 - Vrouw staat met telefoon.
* Spui 2019-08-24 IMG_0168.MOV 
  * (vanaf stoep voor Atheneum nieuwscentrum)
    * 0:40 - Trams.
    * 1:07 - Meisje met telefoon.

## IMG_0160

```
// extract frame from IMG_0160 op 1:01 = 61 * 30 = 1830 as an image
ffmpeg -i "Spui 2019-08-24 IMG_0160.MOV" -vf "select=eq(n\,1829)" -vframes 1 spui-0160_frame_1829.png
// time slice 20 sec vanaf 1:01 and remove audio
ffmpeg -ss 00:01:01.0 -i "Spui 2019-08-24 IMG_0160.MOV" -vcodec copy -an -t 00:00:20.0 spui-0160-a.mov
// convert to mp4
ffmpeg -i spui-0160-a.mov -f mp4 -vcodec libx264 -pix_fmt yuv420p spui-0160-a.mp4
// convert to png sequence
ffmpeg -i spui-0160-a.mov '/Volumes/Samsung_X5/spui-0160-a/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
// scale to 25%, 1280 * 0.25 = 320 (x 180 (720/4))
ffmpeg -i spui-0160-a.mp4 -vf scale=320:180 spui-0160-a_preview.mp4
// convert preview to png sequence
ffmpeg -i spui-0160-a_preview.mp4 '/Volumes/Samsung_X5/spui-0160-a/frames_preview/frame_%05d.png'
  ffmpeg -i spui-0160-a_preview.mp4 'frames_preview/frame_%05d.png'
```

## IMG_0161

```
// time slice 20 sec vanaf 1:01 and remove audio
ffmpeg -ss 00:01:01.0 -i "Spui 2019-08-24 IMG_0161.MOV" -vcodec copy -an -t 00:00:20.0 spui-0161-a.mov
// convert to png sequence
ffmpeg -i spui-0161-a.mov '/Volumes/Samsung_X5/spui-0161-a/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i spui-0161-a.mov -vf scale=480:270 spui-0161-a_preview.mov
// convert preview to png sequence
ffmpeg -i spui-0161-a_preview.mov '/Volumes/Samsung_X5/spui-0161-a/frames_preview/frame_%05d.png'
```

## IMG_0162

```
// time slice 20 sec vanaf 0:55 and remove audio
ffmpeg -ss 00:00:55.0 -i "Spui 2019-08-24 IMG_0162.MOV" -vcodec copy -an -t 00:00:20.0 spui-0162-a.mov
// convert to png sequence
ffmpeg -i spui-0162-a.mov '/Volumes/Samsung_X5/spui-0162-a/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i spui-0162-a.mov -vf scale=480:270 spui-0162-a_preview.mov
// convert preview to png sequence
ffmpeg -i spui-0162-a_preview.mov '/Volumes/Samsung_X5/spui-0162-a/frames_preview/frame_%05d.png'
```

## IMG_0164

```
// time slice 25 sec vanaf 0:00 and remove audio
ffmpeg -ss 00:00:00.0 -i "Spui 2019-08-24 IMG_0164.MOV" -vcodec copy -an -t 00:00:25.0 spui-0164-a.mov
// convert to png sequence
ffmpeg -i spui-0164-a.mov '/Volumes/Samsung_X5/spui-0164-a/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i spui-0164-a.mov -vf scale=480:270 spui-0164-a_preview.mov
// convert preview to png sequence
ffmpeg -i spui-0164-a_preview.mov '/Volumes/Samsung_X5/spui-0164-a/frames_preview/frame_%05d.png'
```

## IMG_0165

```
// time slice 25 sec vanaf 0:30 and remove audio
ffmpeg -ss 00:00:30.0 -i "Spui 2019-08-24 IMG_0165.MOV" -vcodec copy -an -t 00:00:25.0 spui-0165-a.mov
// convert to png sequence
ffmpeg -i spui-0165-a.mov '/Volumes/Samsung_X5/spui-0165-a/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i spui-0165-a.mov -vf scale=480:270 spui-0165-a_preview.mov
// convert preview to png sequence
ffmpeg -i spui-0165-a_preview.mov '/Volumes/Samsung_X5/spui-0165-a/frames_preview/frame_%05d.png'
```

## IMG_0166

```
// time slice 20 sec vanaf 1:20 and remove audio
ffmpeg -ss 00:01:20.0 -i "Spui 2019-08-24 IMG_0166.MOV" -vcodec copy -an -t 00:00:20.0 spui-0166-a.mov
// convert to png sequence
ffmpeg -i spui-0166-a.mov '/Volumes/Samsung_X5/spui-0166-a/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i spui-0166-a.mov -vf scale=480:270 spui-0166-a_preview.mov
// convert preview to png sequence
ffmpeg -i spui-0166-a_preview.mov '/Volumes/Samsung_X5/spui-0166-a/frames_preview/frame_%05d.png'
```
