import { ExtendedMesh, THREE } from 'enable3d';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle, createSVG } from './actor-mesh';
import addImageCanvas from './actor-canvas';

export interface Actor {
  getMesh: () => ExtendedMesh;
}

interface ActorData {
  xPx: number; // position of videoData fragment from left top
  yPx: number;
  wPx: number; // size of videoData fragment within the full videoData
  hPx: number;
  xAddPx?: number; // move actor without adjussting the video position
  yAddPx?: number;
  xDist?: number; // tween distance
  yDist?: number;
  vStart: number; // playback start within the videoData
  duration: number;
  position?: number; // time position within the pattern, so start delay in seconds
  easeAmount?: number; // mimics the simple -1 to 1 easing in Adobe Flash/Animate
  svgScale?: number;
  svgUrl?: string; // SVG file to load and extrude
  z: number; // mesh z position
}

/**
 * Create an actor, an optionally animating 3d object.
 */
export async function createActor(
  projectSettings: ProjectSettings,
  videoData: VideoData,
  actorData: ActorData,
): Promise<Actor> {
  const {
    scene,
    timeline,
    width,
    height,
    width3d,
    height3d,
  } = projectSettings;
  const {
    xPx = 0,
    yPx = 0,
    wPx = 100,
    hPx = 100,
    xAddPx = 0,
    yAddPx = 0,
    xDist = 0,
    yDist = 0,
    duration = 0,
    position = 0,
    easeAmount = 0,
    svgScale = 1,
    svgUrl = '',
    z = 0,
  } = actorData;

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (width3d / width);
  const y3d = yPx * (height3d / height);
  const w3d = (wPx / width) * width3d;
  const h3d = (hPx / height) * height3d;

  // translate position of SVG in pixels to 3d units
  const xAdd3d = xAddPx * (width3d / width);
  const yAdd3d = yAddPx * (height3d / height);

  // translate the image position and size in 3d units to texture offset and repeat
  const xOffset = x3d / width3d;
  const yOffset = svgUrl ? y3d / height3d : 1 - ((y3d + h3d) / height3d);
  const wRepeat = svgUrl ? 1 / w3d : w3d / width3d;
  const hRepeat = svgUrl ? 1 / height3d : h3d / height3d;

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d + (w3d / 2) - (width3d / 2);
  const yVP = (y3d + (h3d / 2) - (height3d / 2)) * -1;

  // IMAGE & CANVAS
  const { canvas, loadVideoFrame } = addImageCanvas(projectSettings, videoData, actorData);

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat * svgScale, hRepeat * svgScale);
  texture.flipY = !svgUrl;

  // MESH
  const mesh = svgUrl
    ? await createSVG(
      svgUrl, svgScale, xVP, yVP, texture, width3d, height3d,
    )
    : await createRectangle(w3d, h3d, texture);
  mesh.visible = false;
  mesh.applyMatrix4(getMatrix4({ x: xVP, y: yVP, z }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  const getMesh = () => mesh;

  // MATERIALS
  let materials: THREE.MeshPhongMaterial[] = [];
  if ((mesh.material as THREE.MeshPhongMaterial[]).length !== undefined) {
    materials = mesh.material as THREE.MeshPhongMaterial[];
  }

  // TWEEN
  if (duration > 0) {
    const coords = {
      ...mesh.position.clone(),
      xOffset,
      yOffset,
    };
    const x3dEnd = (xPx + xDist) * (width3d / width);
    const y3dEnd = (yPx + yDist) * (height3d / height);
    const xVpEnd = x3dEnd + (w3d / 2) - (width3d / 2);
    const yVpEnd = (y3dEnd + (h3d / 2) - (height3d / 2)) * -1;
    const xOffsetEnd = (x3dEnd) / width3d;
    const yOffsetEnd = svgUrl ? y3d / height3d : 1 - ((y3dEnd + h3d) / height3d);
    const tween = createTween({
      delay: position,
      duration,
      easeAmount,
      onStart: () => {
        mesh.visible = true;
      },
      onUpdate: async (progress: number) => {
        mesh.position.set(
          coords.x + xAdd3d + ((xVpEnd - coords.x) * progress),
          coords.y + yAdd3d + ((yVpEnd - coords.y) * progress),
          coords.z,
        );
        if (loadVideoFrame) {
          await loadVideoFrame(progress);
          texture.needsUpdate = true;
        }
        if (materials[1].map) {
          materials[1].map.offset = new THREE.Vector2(
            coords.xOffset + ((xOffsetEnd - coords.xOffset) * progress),
            coords.yOffset + ((yOffsetEnd - coords.yOffset) * progress),
          );
        }
      },
      onComplete: () => {
        mesh.visible = false;
      },
    });
    timeline.add(tween);
  }

  return { getMesh };
}
