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
```
