# Rembrandtplein

Video's
* Rembrandtplein 2022-05-01 0008.mov
* Rembrandtplein 2022-05-01 0010.mov


## FFmpeg 0008

```
# remove first 10 seconds
ffmpeg -ss 00:00:10.0 -i 'Rembrandtplein 2022-05-01 0008.mov' -c copy -t 00:02:34.0 rembrandtplein-0008a.mov
# perspective filter 1920 x 1080 test on frame image
ffmpeg -hide_banner -i 'Rembrandtplein 2022-05-01 0008.png' -lavfi "perspective=x0=105:y0=68:x1=1810:y1=4:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" test.png
# perspective filter 1920 x 1080
ffmpeg -hide_banner -i rembrandtplein-0008a.mov -lavfi "perspective=x0=105:y0=68:x1=1810:y1=4:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" rembrandtplein-0008b.mov
# convert to png sequence
ffmpeg -i rembrandtplein-0008b.mov '/Volumes/Samsung_X5/rembrandtplein-0008/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i rembrandtplein-0008b.mov -vf scale=480:270 rembrandtplein-0008b_preview.mov
# convert preview to png sequence
ffmpeg -i rembrandtplein-0008b_preview.mov '/Volumes/Samsung_X5/rembrandtplein-0008/frames_preview/frame_%05d.png'
```


## FFmpeg 0010

```
# perspective filter 1920 x 1080 test on frame image
ffmpeg -hide_banner -i 'Rembrandtplein 2022-05-01 0010.png' -lavfi "perspective=x0=20:y0=64:x1=1916:y1=0:x2=5:y2=995:x3=1920:y3=1080:interpolation=linear" test.png
# perspective filter 1920 x 1080
ffmpeg -hide_banner -i 'Rembrandtplein 2022-05-01 0010.mov' -lavfi "perspective=x0=20:y0=64:x1=1916:y1=0:x2=5:y2=995:x3=1920:y3=1080:interpolation=linear" rembrandtplein-0010a.mov
# convert to png sequence
ffmpeg -i rembrandtplein-0010a.mov '/Volumes/Samsung_X5/rembrandtplein-0010/frames/frame_%05d.png'
# scale to 25%, 1920 * 0.25 = 480 (x 270)
ffmpeg -i rembrandtplein-0010a.mov -vf scale=480:270 rembrandtplein-0010a_preview.mov
# convert preview to png sequence
ffmpeg -i rembrandtplein-0010a_preview.mov '/Volumes/Samsung_X5/rembrandtplein-0010/frames_preview/frame_%05d.png'
```