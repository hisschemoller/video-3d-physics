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
ffmpeg -i robertmosesplaza-c.mp4 'frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 371, but should be divisible by 2, so 372)
ffmpeg -i robertmosesplaza-c.mp4 -vf scale=480:372 robertmosesplaza-c_preview.mp4
// convert preview to png sequence
ffmpeg -i robertmosesplaza-c_preview.mp4 '/Volumes/Samsung_X5/robertmosesplaza/frames_preview/frame_%05d.png'
ffmpeg -i robertmosesplaza-c_preview.mp4 'frames_preview/frame_%05d.png'
```
