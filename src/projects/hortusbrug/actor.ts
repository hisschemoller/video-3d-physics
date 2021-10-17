import { THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { PLANE_HEIGHT, PLANE_WIDTH, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from './scene';

export interface Actor {
  loadImage: Function;
};

interface VideoData {
  scale: number;
  height: number;
  width: number;
  imgSrcPrefix: string;
  imgSrcSuffix: string;
};

/**
 * Create an actor, an optionally animating 3d object.
 *
 * @param {THREE.scene} scene
 * @param {Timeline} timeline
 * @param {VideoData} video
 * @param {*} {
 *     xPx = 0,
 *     yPx = 0,
 *     wPx = 100,
 *     hPx = 100,
 *     xDist = 0,
 *     yDist = 0,
 *     vStart = 0,
 *     duration = 0,
 *     position = 0,
 *     svgPath = '',
 *   }
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
    svgPath = '',
    z = 0,
  }): Promise<Actor> {
  const x3d = xPx * (PLANE_WIDTH / VIDEO_WIDTH);
  const y3d = yPx * (PLANE_HEIGHT / VIDEO_HEIGHT);
  const w3d = (wPx / VIDEO_WIDTH) * PLANE_WIDTH;
  const h3d = (hPx / VIDEO_HEIGHT) * PLANE_HEIGHT;
  const xOffset = x3d / PLANE_WIDTH;
  const yOffset = 1 - ((y3d + h3d) / PLANE_HEIGHT);
  const wRepeat = w3d / PLANE_WIDTH;
  const hRepeat = h3d / PLANE_HEIGHT;
  const xVP = x3d + (w3d / 2) - (PLANE_WIDTH / 2);
  const yVP = (y3d + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
  const IMG_NR_FIRST = vStart * VIDEO_FPS;
  const IMG_NR_LAST = (vStart + duration) * VIDEO_FPS;
  
  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;
  
  const canvasEl = document.createElement('canvas');
  canvasEl.width = video.width;
  canvasEl.height = video.height;

  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, video.width, video.height);
  }

  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, video.width, video.height);
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

  const texture = new THREE.CanvasTexture(canvasEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const mesh = svgPath ? await createSVG(svgPath, texture) : await createPlane(w3d, h3d, texture);
  mesh.visible = false;
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  if (duration > 0) {
    const coords = {
      ...mesh.position.clone(),
      xOffset,
      yOffset,
    };
    const x3dEnd = (xPx + xDist) * (PLANE_WIDTH / VIDEO_WIDTH);
    const xVpEnd = x3dEnd + (w3d / 2) - (PLANE_WIDTH / 2);
    const y3dEnd = (yPx + yDist) * (PLANE_HEIGHT / VIDEO_HEIGHT);
    const yVpEnd = (y3dEnd + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
    const xOffsetEnd = x3dEnd / PLANE_WIDTH;
    const yOffsetEnd = 1 - ((y3dEnd + h3d) / PLANE_HEIGHT);
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
        if (mesh.material.map) {
          mesh.material.map.offset = new THREE.Vector2(
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

function createPlane(width: number, height: number, texture : THREE.Texture) {
  return new Promise<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>>((resolve) => {
    const geometry = new THREE.BoxGeometry(width, height, 0.02);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    resolve(new THREE.Mesh(geometry, material));
  });
}

function createSVG(svgPath: string, texture : THREE.Texture) {
  return new Promise<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhongMaterial>>((resolve, reject) => {
    new SVGLoader().load(
      svgPath,
      (data) => {
        const { paths } = data;

        paths.forEach((path) => {
          const material = new THREE.MeshPhongMaterial({
            side: THREE.BackSide,
            map: texture, 
          });
    
          const shapes = SVGLoader.createShapes(path);
          if (shapes.length > 0) {
            const shape = shapes[0];
            // const geometry = new THREE.ShapeGeometry(shape);
            const geometry = new THREE.ExtrudeGeometry(shape, {
              bevelEnabled: false,
              depth: 0.02,
            });
            geometry.applyMatrix4(getMatrix({
              x: PLANE_WIDTH * -0.5,
              y: PLANE_HEIGHT * 0.5,
              sy: -1, 
            }));
            const mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
          }
        });
      },
      () => {},
      () => {
        reject();
      },
    );
  });
}
