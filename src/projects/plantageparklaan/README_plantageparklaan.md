# Plantage Parklaan

## FFMPEG

```
// extract frame 180 as an image
ffmpeg -i "Amsterdam Plantage Parklaan 21-07-2021.mov" -vf "select=eq(n\,179)" -vframes 1 plantageparklaan_frame_180.png
// perspective filter 1920 x 1080
ffmpeg -hide_banner -i "Amsterdam Plantage Parklaan 21-07-2021.mov" -lavfi "perspective=x0=31:y0=31:x1=1896:y1=0:x2=0:y2=1080:x3=1920:y3=1080:interpolation=linear" plantageparklaan-a.mov
// extract frame 180 as an image
ffmpeg -i plantageparklaan-a.mov -vf "select=eq(n\,239)" -vframes 1 plantageparklaan-a_frame_240.png
// crop video
ffmpeg -i plantageparklaan-a.mov -filter:v "crop=1560:878:360:0" plantageparklaan-b.mov
// crop video
ffmpeg -i plantageparklaan-a.mov -filter:v "crop=1560:878:360:0" plantageparklaan-b.mov
// scale video
ffmpeg -i plantageparklaan-b.mov -vf scale=1920:1080 plantageparklaan-c.mov
// remove audio
ffmpeg -i plantageparklaan-c.mov -vcodec copy -an plantageparklaan-d.mov
// convert to mp4
ffmpeg -i plantageparklaan-d.mov -f mp4 -vcodec libx264 -pix_fmt yuv420p plantageparklaan.mp4
// extract frame 2 as an image
ffmpeg -i plantageparklaan.mp4 -vf "select=eq(n\,1)" -vframes 1 plantageparklaan_frame_2.png

// convert to png sequence
ffmpeg -i plantageparklaan-d.mov '/Volumes/Samsung_X5/plantageparklaan/frames/frame_%05d.png'
// scale to 25%, 1920 * 0.25 = 480
ffmpeg -i plantageparklaan-d.mov -vf scale=480:-1 plantageparklaan-d_preview.mov
// convert preview to png sequence
ffmpeg -i plantageparklaan-d_preview.mov '/Volumes/Samsung_X5/plantageparklaan/frames_preview/frame_%05d.png'

// png to mp4
ffmpeg -framerate 30 -i rendered/frame_%05d.png -f mp4 -vcodec libx264 -pix_fmt yuv420p plantageparklaan-video-x1.mp4
// repeat 32 times, 66 frames, video alleen
ffmpeg -i plantageparklaan-video-x1.mp4 -filter_complex "loop=loop=32:size=66:start=0" plantageparklaan-video-x32.mp4
// repeat 32, audio alleen
ffmpeg -stream_loop 32 -i "plantageparklaan-audio-x1.wav" -c copy plantageparklaan-audio-x32.wav
// video en audio samenvoegen
ffmpeg -i plantageparklaan-video-x32.mp4 -i plantageparklaan-audio-x32.wav -vcodec copy plantageparklaan-x32.mp4
```

65 frames is de video lang, 
30 FPS is de video, 
65 / 30 = 2,166666666666667 seconden voor een maat, 
2,166666666666667 / 4 = 0,541666666666667 seconden voor een beat, 
60 / 0,541666666666667 = 110,769230769230701 BPM 

Audio bestand tijdsduur: 2.20183 seconden

Video bestand tijdsduur: 2,166666666666667 seconden

Dan proberen met video op 108 BPM: Nog steeds 65 frames.

Dan proberen met video op 107 BPM: 

66 frames is de video lang, 
66 / 30 = 2,2 seconden voor een maat,   
2,2 / 4 = 0,55 seconden voor een beat, 
60 / 0,55 = 109,090909090909091 BPM 