import { ExtendedMesh, THREE } from 'enable3d';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle } from './actor-mesh';
import { addImageCanvas as addImageCanvas2, addVideoFrameCanvas as addVideoFrameCanvas2 } from './actor-canvas2';

/**
 * Actor API, returned by createActor().
 */
export interface Actor2 {
  addTween: (tweenData: TweenData) => void,
  getMesh: () => ExtendedMesh,
}

/**
 * Actor config data, the third argument in createActor().
 */
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
 * Actor tween config data, passed as argument to createActorTween().
 */
interface ActorTweenData {
  delay: number,
  duration: number,
  easeAmount?: number,
  timeline: Timeline,
  mesh: THREE.Mesh,
  texture: THREE.Texture,
  fromMatrix4: THREE.Matrix4,
  toMatrix4: THREE.Matrix4,
  imagePositionTween: (progress: number) => void,
  loadVideoFrame: (progress: number) => Promise<boolean>,
}

/**
 * Actor tween config data, passed as argument to addTween().
 */
interface TweenData {
  delay: number,
  duration: number,
  easeAmount?: number,
  fromMatrix4: THREE.Matrix4,
  toMatrix4: THREE.Matrix4,
}

/**
 * Creates a tween for an actor..
 */
function addActorTween({
  delay,
  duration,
  easeAmount = 0,
  mesh,
  texture,
  fromMatrix4,
  toMatrix4,
  timeline,
  imagePositionTween,
  loadVideoFrame,
}: ActorTweenData) {
  const startPosition = new THREE.Vector3().setFromMatrixPosition(fromMatrix4);
  const endPosition = new THREE.Vector3().setFromMatrixPosition(toMatrix4);
  const startQuaternion = new THREE.Quaternion().setFromRotationMatrix(fromMatrix4);
  const endQuaternion = new THREE.Quaternion().setFromRotationMatrix(toMatrix4);

  const tween = createTween({
    delay,
    duration,
    easeAmount,
    onStart: () => {
      // eslint-disable-next-line no-param-reassign
      mesh.visible = true;
    },
    onUpdate: async (progress: number) => {
      if (fromMatrix4 !== toMatrix4) {
        mesh.position.lerpVectors(startPosition, endPosition, progress);
        mesh.quaternion.slerpQuaternions(startQuaternion, endQuaternion, progress);
      }
      if (loadVideoFrame) {
        await loadVideoFrame(progress);
      }
      if (imagePositionTween) {
        imagePositionTween(progress);
      }
      // eslint-disable-next-line no-param-reassign
      texture.needsUpdate = true;
    },
    onComplete: () => {
      // eslint-disable-next-line no-param-reassign
      mesh.visible = false;
    },
  });
  timeline.add(tween);
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
    matrix4: fromMatrix4,
    tween: {
      delay = 0,
      duration = 0,
      easeAmount = 0,
      toMatrix4 = fromMatrix4,
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
  mesh.applyMatrix4(fromMatrix4);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = false;
  scene.add(mesh);
  const getMesh = () => mesh;

  // TWEEN
  const addTween = ({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    delay,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    duration,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    easeAmount = 0,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    fromMatrix4,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    toMatrix4,
  }: TweenData) => {
    addActorTween({
      delay,
      duration,
      easeAmount,
      mesh,
      texture,
      fromMatrix4,
      toMatrix4,
      timeline,
      imagePositionTween,
      loadVideoFrame,
    });
  };

  addTween({
    delay,
    duration,
    easeAmount,
    fromMatrix4,
    toMatrix4,
  });

  return { addTween, getMesh };
}
