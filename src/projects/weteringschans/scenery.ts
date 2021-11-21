import { ExtendedMesh, THREE } from 'enable3d';
import createTween from '@app/tween';
import { createRectangle, createSVG } from './actor-mesh';
import { ProjectSettings, VideoData } from './interfaces';

export interface Scenery {
  getMesh: () => ExtendedMesh;
  loadImage: () => void;
}

export interface SceneryData {
  box: { x?: number, y?: number, w?: number, h?: number, d?: number },
  matrix4: THREE.Matrix4,
  svg?: { url: string, scale: number, alignWithViewport?: boolean },
  video: { start: number, duration: number },
}

/**
 * Create an actor, an optionally animating 3d object.
 */
export async function createScenery(
  {
    scene,
    timeline,
    width,
    height,
    width3d,
    height3d,
  }: ProjectSettings,
  {
    fps: videoFps,
    imgSrcPath,
  }: VideoData,
  {
    box: {
      x = 0, y = 0, w = 1, h = 1, d = 0.02,
    },
    matrix4,
    svg,
    video,
  }: SceneryData,
): Promise<Scenery> {
  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = x * (width3d / width);
  const y3d = y * (height3d / height);
  const w3d = (w / width) * width3d;
  const h3d = (h / height) * height3d;

  // translate the image position and size in 3d units to texture offset and repeat
  const xOffset = x3d / width3d;
  const yOffset = svg ? y3d / height3d : 1 - ((y3d + h3d) / height3d);
  const wRepeat = svg ? (1 / w3d) * svg.scale : w3d / width3d;
  const hRepeat = svg ? (1 / height3d) * svg.scale : h3d / height3d;

  const IMG_NR_FIRST = video.start * videoFps;
  const IMG_NR_LAST = (video.start + video.duration) * videoFps;

  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;

  // CANVAS
  const canvasEl = document.createElement('canvas');
  canvasEl.width = width;
  canvasEl.height = height;
  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, width, height);
  }

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
  texture.flipY = !svg;

  // IMAGE
  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, width, height);
      texture.needsUpdate = true;
    }
  };
  const loadImage = (ignoreTweenActive = false) => {
    if (tweenActive || ignoreTweenActive) {
      imgNr = IMG_NR_FIRST + Math.round((IMG_NR_LAST - IMG_NR_FIRST) * tweenProgress);
      img.src = imgSrcPath
        .split('#FRAME#')
        .join((imgNr <= 99999) ? (`0000${Math.round(imgNr)}`).slice(-5) : '99999');
    }
  };
  loadImage(true);

  // MESH
  const mesh = svg
    ? await createSVG(
      svg.url, svg.scale, 0, 0, texture, width3d, height3d, d, svg.alignWithViewport,
    )
    : await createRectangle(w3d, h3d, texture, d);
  mesh.applyMatrix4(matrix4);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  const getMesh = () => mesh;

  // TWEEN
  if (video.duration > 0) {
    const tween = createTween({
      duration: video.duration,
      onStart: () => {
        tweenActive = true;
      },
      onUpdate: (progress: number) => {
        tweenProgress = progress;
      },
      onComplete: () => {
        imgNr = IMG_NR_FIRST;
        tweenProgress = 0;
        loadImage();
        tweenActive = false;
      },
    });
    timeline.add(tween);
  }

  return { getMesh, loadImage };
}
