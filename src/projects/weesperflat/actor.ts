import { ExtendedMesh, THREE } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle, createSVG } from './actor-mesh';
import addImageCanvas from './actor-canvas';

export interface Actor {
  getMesh: () => ExtendedMesh;
}

interface ActorData {
  alignVideoWithViewport?: boolean,
  box?: { w?: number, h?: number, d?: number, },
  matrix4: THREE.Matrix4,
  svg?: { url: string, scale: number },
  video: { start: number, duration: number },
  tween: { position: number, duration: number, easeAmount?: number, matrix4End?: THREE.Matrix4, },
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
    x: videoX = 0,
    y: videoY = 0,
    height: videoHeight,
    width: videoWidth,
  } = videoData;
  const {
    alignVideoWithViewport = true,
    box = {
      w: 1, h: 1, d: 0.02,
    },
    matrix4,
    svg,
    tween: {
      position = 0,
      duration = 0,
      easeAmount = 0,
      matrix4End = matrix4,
    },
  } = actorData;

  const to3d = (size: number, isWidth = true) => (isWidth
    ? (size / width) * width3d
    : (size / height) * height3d * -1);

  const toVp3d = (size: number, isWidth = true) => (
    to3d(size, isWidth) + (isWidth ? (width3d * -0.5) : (height3d * 0.5)));
  const startPosition = new THREE.Vector3().setFromMatrixPosition(matrix4);

  // translate the video size to 3D units
  const videoXVp3d = toVp3d(videoX);
  const videoYVp3d = toVp3d(videoY, false);
  const videoWidth3d = to3d(videoWidth);
  const videoHeight3d = to3d(videoHeight, false);

  // BOX
  const { w = 1, h = 1, d: depth } = box;
  const w3d = to3d(w);
  const h3d = to3d(h);

  const xOffset = (startPosition.x + (width3d / 2)) / width3d;
  const yOffset = svg ? 1 - ((startPosition.y - videoYVp3d) / videoHeight3d) : 0;
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
  // texture.flipY = !svg;

  // MESH
  const mesh = svg
    ? await createSVG(svg.url, svg.scale, texture)
    : await createRectangle(w3d, h3d, texture, depth);
  mesh.applyMatrix4(matrix4);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  const getMesh = () => mesh;

  // MATERIALS
  let imageTexture: THREE.Texture | null;
  let materials: THREE.MeshPhongMaterial[] = [];
  if ((mesh.material as THREE.MeshPhongMaterial[]).length !== undefined) {
    materials = mesh.material as THREE.MeshPhongMaterial[];
    imageTexture = materials[1].map;
  }

  // TWEEN
  if (duration > 0) {
    const endPosition = new THREE.Vector3().setFromMatrixPosition(matrix4End);
    const xOffsetEnd = (endPosition.x + (width3d / 2)) / width3d;

    const yPositionVp3dEnd = endPosition.y + (h3d * -1); // 4.5 -> -4.5
    const vp3dEndZeroBased = yPositionVp3dEnd + (height3d / 2); // 9.0 -> 0.0
    const yOffsetAtEnd = vp3dEndZeroBased / height3d; // // 1.0 -> 0.0

    const yOffsetEnd = svg
      ? 1 - ((endPosition.y - videoYVp3d) / videoHeight3d)
      : yOffsetAtEnd;

    const startOffset = texture.offset.clone();
    const endOffset = new THREE.Vector2(xOffsetEnd, yOffsetEnd);
    const tween = createTween({
      delay: position,
      duration,
      easeAmount,
      onStart: () => {
        mesh.visible = true;
        mesh.position.lerp(startPosition, 1);
        if (imageTexture) {
          imageTexture.offset.lerp(startOffset, 1);
        }
      },
      onUpdate: async (progress: number) => {
        mesh.position.lerp(endPosition, progress);
        if (loadVideoFrame) {
          await loadVideoFrame(progress);
          texture.needsUpdate = true;
        }
        if (imageTexture) {
          imageTexture.offset.lerp(endOffset, progress);
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
