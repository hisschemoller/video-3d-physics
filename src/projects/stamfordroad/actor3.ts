import { ExtendedMesh, THREE } from 'enable3d';
import createTween from '@app/tween';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle } from './actor-mesh';
import {
  addImagePositionTween, addVideoFrameTween, createCanvas, ImagePositionTween, VideoFrameTween,
} from './actor-canvas3';

/**
 * Actor API, returned by createActor().
 */
export interface Actor3 {
  addTween: (tweenData: TweenData) => void,
  getMesh: () => ExtendedMesh,
  setStaticPosition: (matrix4: THREE.Matrix4) => void,
}

/**
 * Actor config data, the third argument in createActor().
 */
interface ActorData3 {
  box: { w: number, h: number, d: number, },
  imageRect: { w: number, h: number, },
}

/**
 * Actor tween config data, passed as argument to addTween().
 */
interface TweenData {
  delay: number,
  duration: number,
  easeAmount?: number,
  videoStart: number,
  fromMatrix4: THREE.Matrix4,
  toMatrix4: THREE.Matrix4,
  fromImagePosition: THREE.Vector2,
  toImagePosition: THREE.Vector2,
}

/**
 * Create an actor, an - optionally - animating 3d object.
 */
export async function createActor3(
  projectSettings: ProjectSettings,
  mediaData: ImageData | VideoData,
  actorData: ActorData3,
): Promise<Actor3> {
  const { scene, timeline } = projectSettings;
  const { box, imageRect } = actorData;

  if (projectSettings.isPreview) {
    imageRect.w *= projectSettings.previewScale;
    imageRect.h *= projectSettings.previewScale;
  }

  // CANVAS
  const canvas = createCanvas(imageRect.w, imageRect.h);
  const context = canvas.getContext();

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvas.getCanvas());

  // MESH
  const mesh = await createRectangle(box.w, box.h, texture, box.d);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = false;
  scene.add(mesh);

  // TWEEN
  const addTween = ({
    delay,
    duration,
    easeAmount = 0,
    videoStart,
    fromMatrix4,
    toMatrix4,
    fromImagePosition,
    toImagePosition: toImagePositionBeforeClone,
  }: TweenData) => {
    const startPosition = new THREE.Vector3().setFromMatrixPosition(fromMatrix4);
    const endPosition = new THREE.Vector3().setFromMatrixPosition(toMatrix4);
    const startQuaternion = new THREE.Quaternion().setFromRotationMatrix(fromMatrix4);
    const endQuaternion = new THREE.Quaternion().setFromRotationMatrix(toMatrix4);

    const toImagePosition = toImagePositionBeforeClone.clone();
    if (projectSettings.isPreview) {
      fromImagePosition.multiplyScalar(projectSettings.previewScale);
      toImagePosition.multiplyScalar(projectSettings.previewScale);
    }

    let videoFrameTween: VideoFrameTween;
    let imagePositionTween: ImagePositionTween;
    if ('imgSrc' in mediaData) {
      // TODO
    } else {
      videoFrameTween = addVideoFrameTween(
        mediaData,
        videoStart,
        duration,
      );
      if (context !== null) {
        imagePositionTween = addImagePositionTween(
          fromImagePosition,
          toImagePosition,
          context,
          imageRect.w,
          imageRect.h,
          videoFrameTween.getImage(),
        );
      }
    }

    const tween = createTween({
      delay,
      duration,
      easeAmount,
      onStart: () => {
        mesh.visible = true;
      },
      onUpdate: async (progress: number) => {
        if (fromMatrix4 !== toMatrix4) {
          mesh.position.lerpVectors(startPosition, endPosition, progress);
          mesh.quaternion.slerpQuaternions(startQuaternion, endQuaternion, progress);
        }
        if (videoFrameTween) {
          await videoFrameTween.loadVideoFrame(progress);
        }
        if (imagePositionTween) {
          imagePositionTween.tweenPosition(progress);
        }
        texture.needsUpdate = true;
      },
      onComplete: () => {
        mesh.visible = false;
      },
    });
    timeline.add(tween);
  };

  const setStaticPosition = (matrix4: THREE.Matrix4) => {
    mesh.position.setFromMatrixPosition(matrix4);
  };

  return {
    addTween,
    getMesh: () => mesh,
    setStaticPosition,
  };
}

export function createTweenGroup(
  { scene, timeline }: ProjectSettings,
) {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);

  // TWEEN
  const addTween = ({
    delay,
    duration,
    easeAmount = 0,
    fromMatrix4,
    toMatrix4,
  }: {
    delay: number,
    duration: number,
    easeAmount?: number,
    fromMatrix4: THREE.Matrix4,
    toMatrix4: THREE.Matrix4,
  }) => {
    const startPosition = new THREE.Vector3().setFromMatrixPosition(fromMatrix4);
    const endPosition = new THREE.Vector3().setFromMatrixPosition(toMatrix4);
    const startQuaternion = new THREE.Quaternion().setFromRotationMatrix(fromMatrix4);
    const endQuaternion = new THREE.Quaternion().setFromRotationMatrix(toMatrix4);

    const tween = createTween({
      delay,
      duration,
      easeAmount,
      onStart: () => {
        group.visible = true;
      },
      onUpdate: async (progress: number) => {
        if (fromMatrix4 !== toMatrix4) {
          group.position.lerpVectors(startPosition, endPosition, progress);
          group.quaternion.slerpQuaternions(startQuaternion, endQuaternion, progress);
        }
      },
      onComplete: () => {
        group.visible = false;
      },
    });
    timeline.add(tween);
  };

  return {
    addTween,
    getMesh: () => group,
  };
}
