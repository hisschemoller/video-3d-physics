import { THREE } from 'enable3d';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { VIEWPORT_3D_HEIGHT, VIEWPORT_3D_WIDTH, PROJECT_HEIGHT, PROJECT_WIDTH } from './scene';
import { createRectangle, createSVG } from './actor-mesh';

export interface Actor {
  loadImage: Function;
};

interface ActorData {
  xPx: number; // position of videoData fragment from left top
  yPx: number;
  wPx: number; // size of videoData fragment within the full videoData
  hPx: number;
  xDist?: number; // tween distance
  yDist?: number;
  vStart: number; // playback start within the videoData
  duration: number;
  position?: number; // time position within the pattern, so start delay in seconds
  svgScale?: number;
  svgUrl?: string; // SVG file to load and extrude
  svgXPx?: number,
  svgYPx?: number,
  z: number; // mesh z position
};

export interface VideoData {
  fps: number;
  scale: number;
  width: number;
  height: number;
  imgSrcPrefix: string;
  imgSrcSuffix: string;
};

const BASE_COLOR = 0x6c645f;

/**
 * Create an actor, an optionally animating 3d object.
 *
 * @param {THREE.scene} scene
 * @param {Timeline} timeline
 * @param {VideoData} videoData
 * @param {ActorData} actorData
 * @returns {Actor}
 */
 export async function createActor(
  scene: THREE.Scene,
  timeline: Timeline,
  videoData: VideoData,
  {
    xPx = 0,
    yPx = 0,
    wPx = 100,
    hPx = 100,
    xDist = 0,
    yDist = 0,
    vStart = 0,
    duration = 0,
    position = 0,
    svgScale = 1,
    svgUrl = '',
    svgXPx = 0,
    svgYPx = 0,
    z = 0,
  }: ActorData): Promise<Actor> {

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (VIEWPORT_3D_WIDTH / PROJECT_WIDTH);
  const y3d = yPx * (VIEWPORT_3D_HEIGHT / PROJECT_HEIGHT);
  const w3d = (wPx / PROJECT_WIDTH) * VIEWPORT_3D_WIDTH;
  const h3d = (hPx / PROJECT_HEIGHT) * VIEWPORT_3D_HEIGHT;

  // translate position of SVG in pixels to 3d units
  const svgX3d = svgXPx * (VIEWPORT_3D_WIDTH / PROJECT_WIDTH);
  const svgY3d = svgYPx * (VIEWPORT_3D_HEIGHT / PROJECT_HEIGHT);

  // translate the image position and size in 3d units to texture offset and repeat
  const xOffset = x3d / VIEWPORT_3D_WIDTH;
  const yOffset = 1 - ((y3d - svgY3d + h3d) / VIEWPORT_3D_HEIGHT);
  const wRepeat = svgUrl ? 1 / w3d : w3d / VIEWPORT_3D_WIDTH;
  const hRepeat = svgUrl ? 1 / h3d : h3d / VIEWPORT_3D_HEIGHT;

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d + (w3d / 2) - (VIEWPORT_3D_WIDTH / 2);
  const yVP = (y3d + (h3d / 2) - (VIEWPORT_3D_HEIGHT / 2)) * -1;

  const IMG_NR_FIRST = vStart * videoData.fps;
  const IMG_NR_LAST = (vStart + duration) * videoData.fps;
  
  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;
  
  // CANVAS
  const canvasEl = document.createElement('canvas');
  canvasEl.width = PROJECT_WIDTH;
  canvasEl.height = PROJECT_HEIGHT;
  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, PROJECT_WIDTH, PROJECT_HEIGHT);
  }

  // IMAGE
  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, PROJECT_WIDTH, PROJECT_HEIGHT);
      texture.needsUpdate = true;
    }
  };
  const loadImage = (ignoreTweenActive = false) => {
    if (tweenActive || ignoreTweenActive) {
      imgNr = IMG_NR_FIRST + Math.round((IMG_NR_LAST - IMG_NR_FIRST) * tweenProgress);
      img.src = videoData.imgSrcPrefix
        + ((imgNr <= 99999) ? ('0000' + Math.round(imgNr)).slice(-5) : '99999')
        + videoData.imgSrcSuffix;
    }
  };
  loadImage(true);

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat * svgScale, hRepeat * svgScale);
  texture.flipY = svgUrl ? false : true;

  // MESH
  const mesh = svgUrl 
    ? await createSVG(svgUrl, svgScale, svgX3d, svgY3d, texture, VIEWPORT_3D_WIDTH, VIEWPORT_3D_HEIGHT) 
    : await createRectangle(w3d, h3d, texture);
  mesh.visible = false;
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // TWEEN
  if (duration > 0) {
    const coords = {
      ...mesh.position.clone(),
      xOffset,
      yOffset,
    };
    const x3dEnd = (xPx + xDist) * (VIEWPORT_3D_WIDTH / PROJECT_WIDTH);
    const xVpEnd = x3dEnd + (w3d / 2) - (VIEWPORT_3D_WIDTH / 2);
    const y3dEnd = (yPx + yDist) * (VIEWPORT_3D_HEIGHT / PROJECT_HEIGHT);
    const yVpEnd = (y3dEnd + (h3d / 2) - (VIEWPORT_3D_HEIGHT / 2)) * -1;
    const xOffsetEnd = x3dEnd / VIEWPORT_3D_WIDTH;
    const yOffsetEnd = 1 - ((y3dEnd - svgY3d + h3d) / VIEWPORT_3D_HEIGHT);
    const tween = createTween({
      delay: position,
      duration,
      onStart: () => {
        mesh.visible = true;
        tweenActive = true;
      },
      onUpdate: (progress: number) => {
        tweenProgress = progress;
        mesh.position.set(
          coords.x + ((xVpEnd - coords.x) * progress),
          coords.y + ((yVpEnd - coords.y) * progress),
          coords.z,
        );
        if (mesh.material[1].map) {
          mesh.material[1].map.offset = new THREE.Vector2(
            coords.xOffset + ((xOffsetEnd - coords.xOffset) * progress),
            coords.yOffset + ((yOffsetEnd - coords.yOffset) * progress),
          );
        }
      },
      onComplete: () => {
        imgNr = IMG_NR_FIRST;
        tweenProgress = 0;
        loadImage();
        mesh.visible = false;
        tweenActive = false;
      },
    });
    timeline.add(tween);
  }

  return { loadImage };
}
