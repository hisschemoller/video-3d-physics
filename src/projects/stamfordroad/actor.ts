import { ExtendedMesh, THREE } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle, createSVG } from './actor-mesh';
import addImageCanvas from './actor-canvas';

export interface Actor {
  getMesh: () => ExtendedMesh;
}

interface ActorData {
  box?: { w?: number, h?: number, d?: number, },
  matrix4: THREE.Matrix4,
  svg?: { url: string, scale: number },
  video: { start: number, duration: number, alignWithViewport?: boolean, x?: number, y?: number, },
  tween: { position: number, duration: number, easeAmount?: number, matrix4End?: THREE.Matrix4, },
}

function getBoxOffsetY(yPosition: number, boxHeight: number, vpHeight: number): number {
  const yPositionVp3d = yPosition - boxHeight; //
  const vp3dZeroBased = yPositionVp3d + (vpHeight / 2); //
  const yOffset = vp3dZeroBased / vpHeight; //
  // console.log('yPosition', yPosition);
  // console.log('yPositionVp3d', yPositionVp3d);
  // console.log('vp3dStartZeroBased', vp3dZeroBased);
  // console.log('yOffsetAtStart', yOffset);
  return yOffset;
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
  const videoX = 0;
  const videoY = 0;
  const {
    height: videoHeight,
    width: videoWidth,
  } = videoData;
  const {
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
    video: {
      alignWithViewport = true,
      duration: videoDuration = 0,
      x: videoNotAlignedX = 0,
      y: videoNotAlignedY = 0,
    },
  } = actorData;

  const to3d = (size: number, isWidth = true) => (isWidth
    ? (size / width) * width3d
    : (size / height) * height3d * -1);

  const toVp3d = (size: number, isWidth = true) => (
    to3d(size, isWidth) + (isWidth ? (width3d * -0.5) : (height3d * 0.5)));

  const startPosition = new THREE.Vector3().setFromMatrixPosition(matrix4);

  // video aligned with viewport composition or separate - to be rethought, refactored
  const vidX = alignWithViewport ? videoX : videoNotAlignedX;
  const vidY = alignWithViewport ? videoY : videoNotAlignedY;

  // translate the video size to 3D units
  const videoXVp3d = toVp3d(vidX);
  const videoYVp3d = toVp3d(vidY, false);
  const videoWidth3d = to3d(videoWidth);
  const videoHeight3d = to3d(videoHeight, false);

  // BOX
  const { w = 1, h = 1, d: depth } = box;
  const w3d = to3d(w);
  const h3d = to3d(h);

  // const xOffset = (startPosition.x + (width3d / 2)) / width3d;
  const xOffset = !alignWithViewport
    ? videoNotAlignedX / videoWidth
    : (startPosition.x - videoXVp3d) / videoWidth3d;
  // eslint-disable-next-line no-nested-ternary
  const yOffset = svg
    ? !alignWithViewport
      ? 1 - (videoNotAlignedY / videoHeight)
      : 1 - ((startPosition.y - videoYVp3d) / videoHeight3d)
    : !alignWithViewport
      ? videoNotAlignedY / videoHeight
      : getBoxOffsetY(startPosition.y, h3d, height3d);
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
    ? await createSVG(svg.url, svg.scale, texture, depth)
    : await createRectangle(w3d, h3d, texture, depth);
  mesh.applyMatrix4(matrix4);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = false;
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
    // const xOffsetEnd = (endPosition.x + (width3d / 2)) / width3d;
    const xOffsetEnd = !alignWithViewport
      ? (videoNotAlignedX / videoWidth)
      : (endPosition.x - videoXVp3d) / videoWidth3d;
    // const xOffsetEnd = (endPosition.x - videoXVp3d) / videoWidth3d;
    // eslint-disable-next-line no-nested-ternary
    const yOffsetEnd = svg
      ? !alignWithViewport
        ? 1 - (videoNotAlignedY / videoHeight)
        : 1 - ((endPosition.y - videoYVp3d) / videoHeight3d)
      : !alignWithViewport
        ? videoNotAlignedY / videoHeight
        : getBoxOffsetY(endPosition.y, h3d, height3d);

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
        if (endPosition !== startPosition) {
          mesh.position.lerpVectors(startPosition, endPosition, progress);
        }
        if (loadVideoFrame && videoDuration > 0) {
          await loadVideoFrame(progress);
          texture.needsUpdate = true;
        }
        if (imageTexture && endPosition !== startPosition) {
          imageTexture.offset.lerpVectors(startOffset, endOffset, progress);
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
