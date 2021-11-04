import { THREE } from 'enable3d';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { createRectangle, createSVG } from './actor-mesh';

export interface Actor {
  loadImage: Function;
}

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
  vp3dWidth: number;
  vp3dHeight: number;
  projectPxWidth: number;
  projectPxHeight: number;
}

export interface VideoData {
  fps: number;
  scale: number;
  width: number;
  height: number;
  imgSrcPrefix: string;
  imgSrcSuffix: string;
}

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
    vp3dWidth,
    vp3dHeight,
    projectPxWidth,
    projectPxHeight,
    z = 0,
  }: ActorData,
): Promise<Actor> {
  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (vp3dWidth / projectPxWidth);
  const y3d = yPx * (vp3dHeight / projectPxHeight);
  const w3d = (wPx / projectPxWidth) * vp3dWidth;
  const h3d = (hPx / projectPxHeight) * vp3dHeight;

  // translate position of SVG in pixels to 3d units
  const svgX3d = svgXPx * (vp3dWidth / projectPxWidth);
  const svgY3d = svgYPx * (vp3dHeight / projectPxHeight);

  // translate the image position and size in 3d units to texture offset and repeat
  const xOffset = x3d / vp3dWidth;
  const yOffset = 1 - ((y3d - svgY3d + h3d) / vp3dHeight);
  const wRepeat = svgUrl ? 1 / w3d : w3d / vp3dWidth;
  const hRepeat = svgUrl ? 1 / h3d : h3d / vp3dHeight;

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d + (w3d / 2) - (vp3dWidth / 2);
  const yVP = (y3d + (h3d / 2) - (vp3dHeight / 2)) * -1;

  const IMG_NR_FIRST = vStart * videoData.fps;
  const IMG_NR_LAST = (vStart + duration) * videoData.fps;

  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;

  // CANVAS
  const canvasEl = document.createElement('canvas');
  canvasEl.width = projectPxWidth;
  canvasEl.height = projectPxHeight;
  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, projectPxWidth, projectPxHeight);
  }

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat * svgScale, hRepeat * svgScale);
  texture.flipY = !svgUrl;

  // IMAGE
  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, projectPxWidth, projectPxHeight);
      texture.needsUpdate = true;
    }
  };
  const loadImage = (ignoreTweenActive = false) => {
    if (tweenActive || ignoreTweenActive) {
      imgNr = IMG_NR_FIRST + Math.round((IMG_NR_LAST - IMG_NR_FIRST) * tweenProgress);
      img.src = videoData.imgSrcPrefix
        + ((imgNr <= 99999) ? (`0000${Math.round(imgNr)}`).slice(-5) : '99999')
        + videoData.imgSrcSuffix;
    }
  };
  loadImage(true);

  // MESH
  const mesh = svgUrl
    ? await createSVG(
      svgUrl, svgScale, svgX3d, svgY3d, texture, vp3dWidth, vp3dHeight,
    )
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
    const x3dEnd = (xPx + xDist) * (vp3dWidth / projectPxWidth);
    const xVpEnd = x3dEnd + (w3d / 2) - (vp3dWidth / 2);
    const y3dEnd = (yPx + yDist) * (vp3dHeight / projectPxHeight);
    const yVpEnd = (y3dEnd + (h3d / 2) - (vp3dHeight / 2)) * -1;
    const xOffsetEnd = x3dEnd / vp3dWidth;
    const yOffsetEnd = 1 - ((y3dEnd - svgY3d + h3d) / vp3dHeight);
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
