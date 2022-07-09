import { THREE } from 'enable3d';
import { VideoData } from '@app/interfaces';

export interface Canvas {
  getCanvas: () => HTMLCanvasElement,
  getContext: () => CanvasRenderingContext2D | null,
}

export interface ImagePositionTween {
  tweenPosition: ((progress: number) => void),
}

export interface VideoFrameTween {
  getImage: () => HTMLImageElement,
  loadVideoFrame: (progress: number) => Promise<boolean>,
}

export function createCanvas(width: number, height: number): Canvas {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const canvasCtx = canvas.getContext('2d');
  if (canvasCtx) {
    // remove for transparent canvas
    // canvasCtx.fillStyle = '#6c645f';
    // canvasCtx.fillRect(0, 0, width, height);
  }

  return {
    getCanvas: () => canvas,
    getContext: () => canvasCtx,
  };
}

export function addImagePositionTween(
  fromImagePosition: THREE.Vector2,
  toImagePosition: THREE.Vector2,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  img: HTMLImageElement,
  isMirrored: boolean,
): ImagePositionTween {
  const dx = isMirrored ? -width : 0;
  const currentPosition = new THREE.Vector2();
  const tweenPosition = async (progress: number) => {
    currentPosition.lerpVectors(fromImagePosition, toImagePosition, progress);
    context.drawImage(
      img, currentPosition.x, currentPosition.y, width, height, dx, 0, width, height,
    );
    // Remember: texture.needsUpdate = true;
  };
  return { tweenPosition };
}

/**
 * Loads images in sequence.
 */
export function addVideoFrameTween(
  { fps, imgSrcPath }: VideoData,
  videoExtraTime: number,
  videoStart: number,
  duration: number,
): VideoFrameTween {
  const img = new Image();
  const imgNrFirst = videoStart * fps;
  const imgNrLast = (videoStart + duration + videoExtraTime) * fps;
  let imgNr = imgNrFirst;

  const loadVideoFrame = async (progress: number) => (
    new Promise<boolean>((resolve, reject) => {
      imgNr = imgNrFirst + Math.round((imgNrLast - imgNrFirst) * progress);
      img.onload = () => resolve(true);
      img.onerror = reject;
      img.src = imgSrcPath
        .split('#FRAME#')
        .join((imgNr <= 99999) ? (`0000${Math.round(imgNr)}`).slice(-5) : '99999');
    })
  );

  return {
    getImage: () => img,
    loadVideoFrame,
  };
}
