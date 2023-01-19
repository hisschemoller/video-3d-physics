# Haus der Statistik

## Video slices

* 1266.avi, 4:06, overzicht met reclamebord.
  * 1:42 fietsen
  * 2:08 fietser komt naderbij
  * 2:20 mensen lopen voorbij
  * 3:10 meer mensen lopen voorbij
  * 3:27 man maakt foto
  * 3:40 meer mensen lopen naderbij
* 1267.avi, 3:36, overzicht verder weg.
  * 0:00 vrouw met fiets vlak bij
  * 2:15 vrouw maakt foto
* 1268.avi, 3:25, reclamezuil.
  * 0:35 man draait zich even om
  * 3:02 man en kinderen komen aanlopen

## Background sequence order

1. 1267 overzicht vanaf grootste afstand
2. 1271 focus op rode gebouw
3. 1268 focus op reclamezuil
4. 1273 karl marx allee

## Video

```
# 1267
# get 10 seconds from 00:00:43
ffmpeg -ss 00:00:43.0 -i 'Berlijn 2019 Haus der Statistik 1267.avi' -c copy -t 00:00:10.0 hausderstatistik-1267.avi
# convert to png sequence
ffmpeg -i hausderstatistik-1267.avi '/Volumes/Samsung_X5/hausderstatistik-1267/frames/frame_%05d.png'
# scale to 50%, 640 * 480 >  320 x 240
ffmpeg -i hausderstatistik-1267.avi -vf scale=320:240 hausderstatistik-1267_preview.avi
# convert preview to png sequence
ffmpeg -i hausderstatistik-1267_preview.avi '/Volumes/Samsung_X5/hausderstatistik-1267/frames_preview/frame_%05d.png'
```

```
# 1268
# get 16 seconds from 00:01:52
ffmpeg -ss 00:01:52.0 -i 'Berlijn 2019 Haus der Statistik 1268.avi' -c copy -t 00:00:16.0 hausderstatistik-1268.avi
# convert to png sequence
ffmpeg -i hausderstatistik-1268.avi '/Volumes/Samsung_X5/hausderstatistik-1268/frames/frame_%05d.png'
# scale to 50%, 640 * 480 >  320 x 240
ffmpeg -i hausderstatistik-1268.avi -vf scale=320:240 hausderstatistik-1268_preview.avi
# convert preview to png sequence
ffmpeg -i hausderstatistik-1268_preview.avi '/Volumes/Samsung_X5/hausderstatistik-1268/frames_preview/frame_%05d.png'
```

```
# 1271
# get 16 seconds from 00:01:26
ffmpeg -ss 00:01:26.0 -i 'Berlijn 2019 Haus der Statistik 1271.avi' -c copy -t 00:00:16.0 hausderstatistik-1271.avi
# convert to png sequence
ffmpeg -i hausderstatistik-1271.avi '/Volumes/Samsung_X5/hausderstatistik-1271/frames/frame_%05d.png'
# scale to 50%, 640 * 480 >  320 x 240
ffmpeg -i hausderstatistik-1271.avi -vf scale=320:240 hausderstatistik-1271_preview.avi
# convert preview to png sequence
ffmpeg -i hausderstatistik-1271_preview.avi '/Volumes/Samsung_X5/hausderstatistik-1271/frames_preview/frame_%05d.png'
```

```
# 1273
# get 16 seconds from 00:00:51
ffmpeg -ss 00:00:51.0 -i 'Berlijn 2019 Haus der Statistik 1273.avi' -c copy -t 00:00:16.0 hausderstatistik-1273.avi
# convert to png sequence
ffmpeg -i hausderstatistik-1273.avi '/Volumes/Samsung_X5/hausderstatistik-1273/frames/frame_%05d.png'
# scale to 50%, 640 * 480 >  320 x 240
ffmpeg -i hausderstatistik-1273.avi -vf scale=320:240 hausderstatistik-1273_preview.avi
# convert preview to png sequence
ffmpeg -i hausderstatistik-1273_preview.avi '/Volumes/Samsung_X5/hausderstatistik-1273/frames_preview/frame_%05d.png'
```
