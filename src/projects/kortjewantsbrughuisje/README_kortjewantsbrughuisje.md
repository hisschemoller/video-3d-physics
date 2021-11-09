# Kortjewantsbrughuisje

Is it possible to render a shadow in three.js without it having to be cast from an object

https://stackoverflow.com/questions/50108147/is-it-possible-to-render-a-shadow-in-three-js-without-it-having-to-be-cast-from

## FFMPEG

```
// extract frame 2:06 * 30 = 3780 as an image
ffmpeg -i "Amsterdam Brugwachter 2 21-07-2021.mov" -vf "select=eq(n\,3779)" -vframes 1 kortjewantsbrughuisje_frame_3780.png
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i "Amsterdam Brugwachter 2 21-07-2021.mov" -lavfi "perspective=x0=55:y0=0:x1=1875:y1=53:x2=0:y2=1042:x3=1900:y3=1080:interpolation=linear" kortjewantsbrughuisje-a.mov
// extract frame 2:06 * 30 = 3780 as an image
ffmpeg -i "kortjewantsbrughuisje-a.mov" -vf "select=eq(n\,3779)" -vframes 1 kortjewantsbrughuisje_frame_3780_perspectief.png
// crop video, 20 links en 11 onder, 1900 x 1069
ffmpeg -i kortjewantsbrughuisje-a.mov -filter:v "crop=1900:1069:20:0" kortjewantsbrughuisje-b.mov
// scale video
ffmpeg -i kortjewantsbrughuisje-b.mov -vf scale=1920:1080 kortjewantsbrughuisje-c.mov
// remove audio
ffmpeg -i kortjewantsbrughuisje-c.mov -vcodec copy -an kortjewantsbrughuisje-d.mov
// convert to mp4
ffmpeg -i kortjewantsbrughuisje-d.mov -f mp4 -vcodec libx264 -pix_fmt yuv420p kortjewantsbrughuisje.mp4

// convert to png sequence
ffmpeg -i kortjewantsbrughuisje-d.mov '/Volumes/Samsung_X5/kortjewantsbrughuisje/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i kortjewantsbrughuisje-d.mov -vf scale=480:-1 kortjewantsbrughuisje-d_preview.mov
// convert preview to png sequence
ffmpeg -i kortjewantsbrughuisje-d_preview.mov '/Volumes/Samsung_X5/kortjewantsbrughuisje/frames_preview/frame_%05d.png'
```
