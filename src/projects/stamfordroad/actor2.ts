import { ExtendedMesh, THREE } from 'enable3d';
import createTween from '@app/tween';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle } from './actor-mesh';
import { addImageCanvas as addImageCanvas2, addVideoFrameCanvas as addVideoFrameCanvas2 } from './actor-canvas2';

export interface Actor2 {
  getMesh: () => ExtendedMesh;
}

interface ActorData2 {
  box: { w?: number, h?: number, d?: number, },
  imageRect: { x: number, y: number, w: number, h: number },
  matrix4: THREE.Matrix4,
  tween: {
    delay: number,
    duration: number,
    easeAmount?: number,
    toMatrix4?: THREE.Matrix4,
    toImagePosition?: { x: number, y: number },
  },
  video?: { start: number, duration: number },
}

/**
 * Create an actor, an - optionally - animating 3d object.
 */
export async function createActor2(
  projectSettings: ProjectSettings,
  mediaData: ImageData | VideoData,
  actorData: ActorData2,
): Promise<Actor2> {
  const { scene, timeline } = projectSettings;
  const {
    box: { w: boxWidth = 1, h: boxHeight = 1, d: boxDepth = 0.02 },
    matrix4,
    tween: {
      delay = 0,
      duration = 0,
      easeAmount = 0,
      toMatrix4 = matrix4,
    },
    video = { start: 0, duration: 0 },
  } = actorData;

  // IMAGE & CANVAS
  let loadVideoFrame: (progress: number) => Promise<boolean>;
  let canvas: HTMLCanvasElement;
  let imagePositionTween: (progress: number) => void;
  if ('imgSrc' in mediaData) {
    const imageCanvas = await addImageCanvas2(
      projectSettings,
      mediaData,
      actorData.imageRect,
      actorData.tween.toImagePosition,
    );
    canvas = imageCanvas.canvas;
    if (imageCanvas.tween) {
      imagePositionTween = imageCanvas.tween;
    }
  } else {
    const videoFrameCanvas = addVideoFrameCanvas2(
      projectSettings,
      mediaData as VideoData,
      video,
      actorData.imageRect,
      actorData.tween.toImagePosition,
    );
    canvas = videoFrameCanvas.canvas;
    loadVideoFrame = videoFrameCanvas.loadVideoFrame;
    if (videoFrameCanvas.tween) {
      imagePositionTween = videoFrameCanvas.tween;
    }
  }

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // MESH
  const mesh = await createRectangle(boxWidth, boxHeight || 1, texture, boxDepth);
  mesh.applyMatrix4(matrix4);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = false;
  scene.add(mesh);
  const getMesh = () => mesh;

  // TWEEN
  const startPosition = new THREE.Vector3().setFromMatrixPosition(matrix4);
  const endPosition = new THREE.Vector3().setFromMatrixPosition(toMatrix4);

  const tween = createTween({
    delay,
    duration,
    easeAmount,
    onStart: () => {
      mesh.visible = true;
    },
    onUpdate: async (progress: number) => {
      if (endPosition !== startPosition) {
        mesh.position.lerpVectors(startPosition, endPosition, progress);
      }
      if (loadVideoFrame) {
        await loadVideoFrame(progress);
      }
      if (imagePositionTween) {
        imagePositionTween(progress);
      }
      texture.needsUpdate = true;
    },
    onComplete: () => {
      mesh.visible = false;
    },
  });
  timeline.add(tween);

  return { getMesh };
}
