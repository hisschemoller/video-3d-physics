import { THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { PLANE_HEIGHT, PLANE_WIDTH, PROJECT_FPS, PROJECT_HEIGHT, PROJECT_WIDTH } from './scene';
import { createRectangle, createSVG } from './actor-mesh';

export interface Actor {
  loadImage: Function;
};

interface ActorData {
  xPx: number; // position of video fragment from left top
  yPx: number;
  wPx: number; // size of video fragment within the full video
  hPx: number;
  xDist?: number; // tween distance
  yDist?: number;
  vStart: number; // playback start within the video
  duration: number;
  position?: number; // time position within the pattern, so start delay in seconds
  svgScale?: number;
  svgUrl?: string; // SVG file to load and extrude
  svgYPx?: number,
  z: number; // mesh z position
};

interface VideoData {
  scale: number;
  height: number;
  width: number;
  imgSrcPrefix: string;
  imgSrcSuffix: string;
};

const BASE_COLOR = 0x6c645f;

/**
 * Create an actor, an optionally animating 3d object.
 *
 * @param {THREE.scene} scene
 * @param {Timeline} timeline
 * @param {VideoData} video
 * @param {ActorData} actorData
 * @returns {Actor}
 */
 export async function createActor(
  scene: THREE.Scene,
  timeline: Timeline,
  video: VideoData,
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
    svgYPx = 0,
    z = 0,
  }: ActorData): Promise<Actor> {

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (PLANE_WIDTH / PROJECT_WIDTH);
  const y3d = yPx * (PLANE_HEIGHT / PROJECT_HEIGHT);
  const w3d = (wPx / PROJECT_WIDTH) * PLANE_WIDTH;
  const h3d = (hPx / PROJECT_HEIGHT) * PLANE_HEIGHT;

  const svgY3d = svgYPx * (PLANE_HEIGHT / PROJECT_HEIGHT);
  console.log(svgYPx, svgY3d);

  // translate the image position and size in 3d units to texture offset and repeat
  const xOffset = x3d / PLANE_WIDTH;
  const yOffset = 1 - ((y3d - svgY3d + h3d) / PLANE_HEIGHT);
  const wRepeat = svgUrl ? 1 / w3d : w3d / PLANE_WIDTH;
  const hRepeat = svgUrl ? 1 / h3d : h3d / PLANE_HEIGHT;

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d + (w3d / 2) - (PLANE_WIDTH / 2);
  const yVP = (y3d + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;

  const IMG_NR_FIRST = vStart * PROJECT_FPS;
  const IMG_NR_LAST = (vStart + duration) * PROJECT_FPS;
  
  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;
  
  // CANVAS
  const canvasEl = document.createElement('canvas');
  canvasEl.width = wPx;
  canvasEl.height = hPx;
  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, wPx, hPx);
  }

  // IMAGE
  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, wPx, hPx);
      texture.needsUpdate = true;
    }
  };
  const loadImage = (ignoreTweenActive = false) => {
    if (tweenActive || ignoreTweenActive) {
      imgNr = IMG_NR_FIRST + Math.round((IMG_NR_LAST - IMG_NR_FIRST) * tweenProgress);
      img.src = video.imgSrcPrefix
        + ((imgNr <= 99999) ? ('0000' + Math.round(imgNr)).slice(-5) : '99999')
        + video.imgSrcSuffix;
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
    ? await createSVG(svgUrl, svgScale, svgY3d, texture) 
    : await createPlane(w3d, h3d, texture);
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
    const x3dEnd = (xPx + xDist) * (PLANE_WIDTH / PROJECT_WIDTH);
    const xVpEnd = x3dEnd + (w3d / 2) - (PLANE_WIDTH / 2);
    const y3dEnd = (yPx + yDist) * (PLANE_HEIGHT / PROJECT_HEIGHT);
    const yVpEnd = (y3dEnd + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
    const xOffsetEnd = x3dEnd / PLANE_WIDTH;
    const yOffsetEnd = 1 - ((y3dEnd - svgY3d + h3d) / PLANE_HEIGHT);
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
