import { ExtendedMesh, THREE } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle, createSVG } from './actor-mesh';
import addImageCanvas from './actor-canvas';

export interface Actor {
  getMesh: () => ExtendedMesh;
}

interface ActorData {
  box: { x?: number, y?: number, w?: number, h?: number, d?: number, },
  matrix4: THREE.Matrix4,
  svg?: { url: string, scale: number, alignWithViewport?: boolean },
  video: { start: number, duration: number },
  tween: { position: number, duration: number, easeAmount?: number, matrixEnd?: THREE.Matrix4, },
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
    height: videoHeight,
    width: videoWidth,
  } = videoData;
  const {
    box: {
      x = 0, y = 0, w = 1, h = 1,
    },
    matrix4,
    svg,
    tween: {
      position = 0,
      duration = 0,
      easeAmount = 0,
      matrixEnd = matrix4,
    },
  } = actorData;
  const depth = 0.02;

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = x * (width3d / width);
  const y3d = y * (height3d / height);
  const w3d = (w / width) * width3d;
  const h3d = (h / height) * height3d;

  // translate the video size to 3D units
  const videoWidth3d = (videoWidth / width) * width3d;
  const videoHeight3d = (videoHeight / height) * height3d;

  // translate the image position and size in 3d units to texture offset and repeat
  const xOffset = x3d / width3d;
  const yOffset = svg ? y3d / height3d : 1 - ((y3d + h3d) / height3d);
  const wRepeat = svg ? (1 / videoWidth3d) * svg.scale : w3d / width3d;
  const hRepeat = svg ? (1 / videoHeight3d) * svg.scale : h3d / height3d;

  // IMAGE & CANVAS
  const { canvas, loadVideoFrame } = addImageCanvas(projectSettings, videoData, actorData);

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
  texture.flipY = !svg;

  // MESH
  const mesh = svg
    ? await createSVG(
      svg.url, svg.scale, 0, 0, texture, width3d, height3d, depth, svg.alignWithViewport,
    )
    : await createRectangle(w3d, h3d, texture, depth);
  mesh.applyMatrix4(matrix4);
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
    // const coords = {
    //   ...mesh.position.clone(),
    //   xOffset,
    //   yOffset,
    // };
    // const x3dEnd = (xPx + xDist) * (width3d / width);
    // const y3dEnd = (yPx + yDist) * (height3d / height);
    // const xVpEnd = x3dEnd + (w3d / 2) - (width3d / 2);
    // const yVpEnd = (y3dEnd + (h3d / 2) - (height3d / 2)) * -1;
    // const xOffsetEnd = (x3dEnd) / width3d;
    // const yOffsetEnd = 0; // svgUrl ? y3d / height3d : 1 - ((y3dEnd + h3d) / height3d);
    const tween = createTween({
      delay: position,
      duration,
      easeAmount,
      onStart: () => {
        mesh.visible = true;
      },
      onUpdate: async (progress: number) => {
        // mesh.position.set(
        //   coords.x + xAdd3d + ((xVpEnd - coords.x) * progress),
        //   coords.y + yAdd3d + ((yVpEnd - coords.y) * progress),
        //   coords.z,
        // );
        if (loadVideoFrame) {
          await loadVideoFrame(progress);
          texture.needsUpdate = true;
        }
        // if (materials[1].map) {
        //   materials[1].map.offset = new THREE.Vector2(
        //     coords.xOffset + ((xOffsetEnd - coords.xOffset) * progress),
        //     coords.yOffset + ((yOffsetEnd - coords.yOffset) * progress),
        //   );
        // }
      },
      onComplete: () => {
        mesh.visible = false;
      },
    });
    timeline.add(tween);
  }

  return { getMesh };
}
