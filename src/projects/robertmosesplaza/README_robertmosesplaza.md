# Robert Moses Plaza

## Calico Mingling (1973)
Babette Mangolte (b. 1941)<br>
Duration: 10 min. B&W<br>

https://www.ubu.com/film/mangolte_calico.html

Calico Mingling, a 1973 dance by Lucinda Childs that took place outdoors at Robert Moses Plaza in Fordham University, is recorded in a grainy ten-minute black and white film. Seen from a distance, and sometimes from above like chess pieces on a board, four dancers march backward and forward, raising and lowering their arms. In the photos, others performers are sometimes caught frozen in midair, while the slide show is a shifting succession of static photographic objects.

Structurally dissecting their movements, these artists replaced emotional expression with simple actions that people perform every day -- walking, sitting and running in ordinary clothes. Almost 40 years later, some of the performance sites have disappeared, and the people seen dancing are now on the verge of growing old. They strived to make dance quotidian, but time makes everything unique. The past can never be ordinary.

Babette Mangolte<br>
https://babettemangolte.org/<br>
https://en.wikipedia.org/wiki/Babette_Mangolte

Lucinda Childs<br>
https://www.lucindachilds.com/<br>
https://en.wikipedia.org/wiki/Lucinda_Childs

Close-up gedeelte: 3:13 - 4:04 (51 sec)<br>
Frame rate: 25<br>
Dimensions: 704 × 544

## FFMPEG

```
// m4v to mp4 and remove audio
ffmpeg -i "Babette Mangolte, Lucinda Childs - Calico Mingling, 1973.m4v" -vcodec copy -an robertmosesplaza-a.mp4
// extract 3:13 - 4:04
ffmpeg -ss 00:03:13.0 -i robertmosesplaza-a.mp4 -c copy -t 00:00:51.0 robertmosesplaza-b.mp4
// scale to 1920 * 1484
ffmpeg -i robertmosesplaza-b.mp4 -vf scale=1920:-1 robertmosesplaza-c.mp4

// convert to png sequence
ffmpeg -i robertmosesplaza-c.mp4 '/Volumes/Samsung_X5/robertmosesplaza/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 371, but should be divisible by 2, so 372)
ffmpeg -i robertmosesplaza-c.mp4 -vf scale=480:372 robertmosesplaza-c_preview.mp4
// convert preview to png sequence
ffmpeg -i robertmosesplaza-c_preview.mp4 '/Volumes/Samsung_X5/robertmosesplaza/frames_preview/frame_%05d.png'
```

## Top view

* 2:13 - 3:12
* 4:04 - 6:04
* 7:18 - 8:44

## FFMPEG Top view

```
// extract 2:13 - 3:12
ffmpeg -ss 00:02:13.0 -i robertmosesplaza-a.mp4 -c copy -t 00:00:59.0 robertmosesplaza-top-b.mp4
// scale to 960 * 742
ffmpeg -i robertmosesplaza-top-b.mp4 -vf scale=960:742 robertmosesplaza-top-c.mp4
// extract frame op 0:11 = 11 * 25 = 275 as an image
ffmpeg -i robertmosesplaza-top-c.mp4 -vf "select=eq(n\,274)" -vframes 1 robertmosesplaza-top-c_frame_275.png
// perspective correction filter
ffmpeg -hide_banner -i robertmosesplaza-top-c.mp4 -lavfi "perspective=x0=0:y0=21:x1=960:y1=0:x2=-70:y2=742:x3=1052:y3=728:interpolation=linear" robertmosesplaza-top-d.mp4
// extract frame op 0:11 = 11 * 25 = 275 as an image
ffmpeg -i robertmosesplaza-top-d.mp4 -vf "select=eq(n\,274)" -vframes 1 robertmosesplaza-top-d_frame_275.png

// convert to png sequence
ffmpeg -i robertmosesplaza-top-d.mp4 '/Volumes/Samsung_X5/robertmosesplaza-top/frames/frame_%05d.png'
// scale to 25%, 960 * 0.25 = 240 * 186 (hoogte afgerond)
ffmpeg -i robertmosesplaza-top-d.mp4 -vf scale=240:186 robertmosesplaza-top-d_preview.mp4
// convert preview to png sequence
ffmpeg -i robertmosesplaza-top-d_preview.mp4 '/Volumes/Samsung_X5/robertmosesplaza-top/frames_preview/frame_%05d.png'

// png to mp4 (from index 430) met 25 FPS
ffmpeg -framerate 25 -start_number 430 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p robertmosesplaza-video-x1.mp4
// repeat 32 times, 212 frames, video alleen
ffmpeg -i robertmosesplaza-video-x1.mp4 -filter_complex "loop=loop=32:size=212:start=0" robertmosesplaza-video-x32.mp4
// repeat 32, audio alleen
ffmpeg -stream_loop 32 -i "robertmosesplaza-audio-x1.wav" -c copy robertmosesplaza-audio-x32.wav
// video en audio samenvoegen
ffmpeg -i robertmosesplaza-video-x32.mp4 -i robertmosesplaza-audio-x32.wav -vcodec copy robertmosesplaza-x32.mp4


// extract audio
ffmpeg -i "Babette Mangolte, Lucinda Childs - Calico Mingling, 1973.m4v" -vn -acodec pcm_s16le -ar 44100 -ac 2 robertmosesplaza-sound.wav
```

Video duurt 212 frames.<br>
Video duurt 212 / 25 FPS = 8.48 seconden.<br>
Video duurt 4 maten van 4 beats = 16 beats.<br>
Een beat duurt 8.48 / 16 = 0.53 seconden.<br>
Het tempo is 60 / 0.53 = 113.20754716981132 BPM

Door per ongeluk de patroon lengte van 3 naar 4 maten (van 4 beats) te verhogen zonder de steps van
48 in 64 te veranderen, draait de animatie te langzaam terwijl de video op normale snelheid 
afspeelt. Daardoor kloppen de overgangen natuurlijk niet meer, maar toch is het geheel onbedoeld
beter. Dus ik laat het zo. Maar het tempo veranderd er door. 

Video duurt 48 steps.<br>
Video duurt 48 / 4 = 12 beats.<br>
Een beat duurt 8.48 / 12 = 0.706666666667 seconden.<br>
Het tempo is 60 / 0.706666666667 = 84.9056603773 BPM
