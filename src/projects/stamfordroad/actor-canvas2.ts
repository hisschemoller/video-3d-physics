import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';

function convertToPreview(
  previewScale: number,
  imageRect: { x: number, y: number, w: number, h: number },
  toImagePosition?: { x: number, y: number },
) {
  // eslint-disable-next-line no-param-reassign
  imageRect.x *= previewScale;
  // eslint-disable-next-line no-param-reassign
  imageRect.y *= previewScale;
  // eslint-disable-next-line no-param-reassign
  imageRect.w *= previewScale;
  // eslint-disable-next-line no-param-reassign
  imageRect.h *= previewScale;
  if (toImagePosition) {
    // eslint-disable-next-line no-param-reassign
    toImagePosition.x *= previewScale;
    // eslint-disable-next-line no-param-reassign
    toImagePosition.y *= previewScale;
  }
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, width, height);
  }
  return { canvas, canvasCtx };
}

function createPositionTween(
  img: HTMLImageElement,
  canvasCtx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): (progress: number) => void {
  const { width, height } = canvasCtx.canvas;
  const startPosition = new THREE.Vector2(startX, startY);
  const endPosition = new THREE.Vector2(endX, endY);
  const currentPosition = new THREE.Vector2();
  const tweenPosition = (progress: number) => {
    currentPosition.lerpVectors(startPosition, endPosition, progress);
    canvasCtx.drawImage(
      img, currentPosition.x, currentPosition.y, width, height, 0, 0, width, height,
    );
    // Remember: texture.needsUpdate = true;
  };
  return tweenPosition;
}

export interface ImageCanvas {
  canvas: HTMLCanvasElement;
  tween: ((progress: number) => void) | undefined;
}

export interface VideoFrameCanvas {
  canvas: HTMLCanvasElement;
  loadVideoFrame: (progress: number) => Promise<boolean>;
  tween: ((progress: number) => void) | undefined;
}

/**
 * Create canvas that shows a static image.
 */
export async function addImageCanvas(
  projectSettings: ProjectSettings,
  imageData: ImageData,
  imageRect: { x: number, y: number, w: number, h: number },
  toImagePosition?: { x: number, y: number },
): Promise<ImageCanvas> {
  return new Promise<ImageCanvas>((resolve, reject) => {
    const { imgSrc } = imageData;
    const {
      x, y, w, h,
    } = imageRect;
    const { canvas, canvasCtx } = createCanvas(w, h);
    const img = new Image();

    let tween: ((progress: number) => void) | undefined;
    if (toImagePosition) {
      tween = createPositionTween(img, canvasCtx, x, y, toImagePosition.x, toImagePosition.y);
    }

    img.onload = () => {
      canvasCtx.drawImage(img, x, y, w, h, 0, 0, w, h);
      // Remember: texture.needsUpdate = true;
      resolve({
        canvas,
        tween,
      });
    };
    img.onerror = reject;
    img.src = imgSrc;
  });
}

/**
 * Create canvas that shows a image frame sequence.
 */
export function addVideoFrameCanvas(
  { isPreview, previewScale }: ProjectSettings,
  { fps, imgSrcPath }: VideoData,
  video: { start: number, duration: number },
  imageRect: { x: number, y: number, w: number, h: number },
  toImagePosition?: { x: number, y: number },
): VideoFrameCanvas {
  if (isPreview) {
    convertToPreview(previewScale, imageRect, toImagePosition);
  }

  const {
    x, y, w, h,
  } = imageRect;
  const { canvas, canvasCtx } = createCanvas(w, h);

  // IMAGE
  const img = new Image();
  const imgNrFirst = video.start * fps;
  const imgNrLast = (video.start + video.duration) * fps;
  let imgNr = imgNrFirst;

  let tween: ((progress: number) => void) | undefined;
  if (toImagePosition) {
    tween = createPositionTween(img, canvasCtx, x, y, toImagePosition.x, toImagePosition.y);
  }

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
    canvas,
    loadVideoFrame,
    tween,
  };
}
