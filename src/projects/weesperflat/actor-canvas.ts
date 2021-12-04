import { ProjectSettings, VideoData } from '@app/interfaces';

export interface ImageCanvas {
  canvas: HTMLCanvasElement;
  loadImage?: () => Promise<boolean>;
  loadVideoFrame?: (progress: number) => Promise<boolean>;
}

export default function addImageCanvas(
  projectSettings: ProjectSettings,
  {
    fps,
    height,
    imgSrcPath,
    width,
  }: VideoData,
  {
    video: {
      start = 0,
      duration = 0,
    },
  },
): ImageCanvas {
  // CANVAS
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const canvasCtx = canvas.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, width, height);
  }

  // IMAGE
  const img = new Image();
  const imgNrFirst = start * fps;
  const imgNrLast = (start + duration) * fps;
  let imgNr = imgNrFirst;

  const loadVideoFrame = async (progress: number) => (
    new Promise<boolean>((resolve, reject) => {
      imgNr = imgNrFirst + Math.round((imgNrLast - imgNrFirst) * progress);
      img.onload = () => {
        if (canvasCtx) {
          canvasCtx.drawImage(img, 0, 0, width, height);
          // texture.needsUpdate = true;
        }
        resolve(true);
      };
      img.onerror = reject;
      img.src = imgSrcPath
        .split('#FRAME#')
        .join((imgNr <= 99999) ? (`0000${Math.round(imgNr)}`).slice(-5) : '99999');
    })
  );

  return {
    canvas,
    loadVideoFrame,
  };
}
