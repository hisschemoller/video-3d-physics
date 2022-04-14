/* eslint-disable max-len */
import { ExtendedMesh, THREE } from 'enable3d';
import createTween, { Ease } from '@app/tween';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { createRectangle, createSVG } from './actor-mesh';
import {
  addImagePositionTween, addVideoFrameTween, createCanvas, ImagePositionTween, VideoFrameTween,
} from './actor-canvas';

/**
 * Actor API, returned by createActor().
 */
export interface Actor {
  addTween: (tweenData: TweenData) => void,
  getMesh: () => ExtendedMesh,
  setColor: (hexString: string) => void,
  setMirrored: (mirrored: boolean) => void,
  setStaticImage: (x: number, y: number) => void,
  setStaticPosition: (matrix4: THREE.Matrix4) => void,
}

/**
 * Actor config data, the third argument in createActor().
 */
interface ActorData {
  box?: { w: number, h: number, d: number, },
  imageRect: { w: number, h: number, },
  svg?: { url: string, scale: number, depth: number },
}

/**
 * Actor tween config data, passed as argument to addTween().
 */
interface TweenData {
  delay: number,
  duration: number,
  ease?: keyof typeof Ease,
  isMirrored?: boolean,
  videoStart?: number,
  fromMatrix4?: THREE.Matrix4,
  toMatrix4?: THREE.Matrix4,
  fromImagePosition?: THREE.Vector2,
  toImagePosition?: THREE.Vector2,
}

/**
 * Create an actor, an - optionally - animating 3d object.
 */
export async function createActor(
  projectSettings: ProjectSettings,
  mediaData: ImageData | VideoData | undefined,
  actorData: ActorData,
): Promise<Actor> {
  const { scene, timeline } = projectSettings;
  const { box, imageRect, svg } = actorData;

  // if video then use preview size
  if (projectSettings.isPreview && mediaData && 'imgSrcPath' in mediaData) {
    imageRect.w *= projectSettings.previewScale;
    imageRect.h *= projectSettings.previewScale;
  }

  // CANVAS
  const canvas = createCanvas(imageRect.w, imageRect.h);
  const context = canvas.getContext();

  // TEXTURE
  const texture = new THREE.CanvasTexture(canvas.getCanvas());
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // MESH
  let mesh: ExtendedMesh;
  if (box) {
    mesh = await createRectangle(box.w, box.h, texture, box.d);
  } else if (svg) {
    mesh = await createSVG(svg.url, svg.scale, texture, svg.depth);

    // the canvas should exactly cover the SVG extrude front
    const sizeVector = new THREE.Vector3();
    mesh.geometry.computeBoundingBox();
    mesh.geometry.boundingBox?.getSize(sizeVector);
    const wRepeat = (1 / sizeVector.x) * svg.scale;
    const hRepeat = (1 / sizeVector.y) * svg.scale * -1;
    texture.offset = new THREE.Vector2(0, 1);
    texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
  } else {
    mesh = await createRectangle(1, 1, texture, 1);
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = false;
  scene.add(mesh);

  // TWEEN
  const addTween = ({
    delay,
    duration,
    ease,
    isMirrored = false,
    videoStart = 0,
    fromMatrix4,
    toMatrix4,
    fromImagePosition,
    toImagePosition: toImagePositionBeforeClone,
  }: TweenData) => {
    const startPosition = fromMatrix4 ? new THREE.Vector3().setFromMatrixPosition(fromMatrix4) : undefined;
    const endPosition = toMatrix4 ? new THREE.Vector3().setFromMatrixPosition(toMatrix4) : undefined;
    const startQuaternion = fromMatrix4 ? new THREE.Quaternion().setFromRotationMatrix(fromMatrix4) : undefined;
    const endQuaternion = toMatrix4 ? new THREE.Quaternion().setFromRotationMatrix(toMatrix4) : undefined;
    const startScale = fromMatrix4 ? new THREE.Vector3().setFromMatrixScale(fromMatrix4) : undefined;
    const endScale = toMatrix4 ? new THREE.Vector3().setFromMatrixScale(toMatrix4) : undefined;

    if (fromMatrix4) {
      mesh.position.setFromMatrixPosition(fromMatrix4);
      mesh.quaternion.setFromRotationMatrix(fromMatrix4);
      mesh.scale.setFromMatrixScale(fromMatrix4);
    }

    let toImagePosition: THREE.Vector2 | undefined;
    if (fromImagePosition) {
      if (!toImagePositionBeforeClone) {
        toImagePosition = fromImagePosition.clone();
      } else {
        toImagePosition = toImagePositionBeforeClone.clone();
      }
      if (projectSettings.isPreview) {
        fromImagePosition.multiplyScalar(projectSettings.previewScale);
        toImagePosition.multiplyScalar(projectSettings.previewScale);
      }
    }

    let videoFrameTween: VideoFrameTween;
    let imagePositionTween: ImagePositionTween;
    if (mediaData && 'imgSrcPath' in mediaData) {
      videoFrameTween = addVideoFrameTween(
        mediaData,
        videoStart,
        duration,
      );
      if (context !== null && fromImagePosition && toImagePosition) {
        imagePositionTween = addImagePositionTween(
          fromImagePosition,
          toImagePosition,
          context,
          imageRect.w,
          imageRect.h,
          videoFrameTween.getImage(),
          isMirrored,
        );
      }
    }

    const tween = createTween({
      delay,
      duration,
      ease,
      onStart: () => {
        mesh.visible = true;
      },
      onUpdate: async (progress: number, percentage: number) => {
        if (startPosition && endPosition && startQuaternion && endQuaternion && startScale && endScale) {
          mesh.position.lerpVectors(startPosition, endPosition, progress);
          mesh.quaternion.slerpQuaternions(startQuaternion, endQuaternion, progress);
          mesh.scale.lerpVectors(startScale, endScale, progress);
        }
        if (videoFrameTween) {
          await videoFrameTween.loadVideoFrame(percentage);
        }
        if (imagePositionTween) {
          imagePositionTween.tweenPosition(progress);
        }
        texture.needsUpdate = true;
      },
      onComplete: () => {
        // FIXME: removed for Prins Hendrikkade
        // mesh.visible = false;
      },
    });
    timeline.add(tween);
  };

  const setMirrored = (mirrored: boolean) => {
    if (context) {
      context.scale(mirrored ? -1 : 1, 1);
    }
  };

  const setColor = (hexString: string) => {
    if (context) {
      context.fillStyle = hexString;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      texture.needsUpdate = true;
    }
  };

  /**
   * Loads and shows one single image.
   */
  const setStaticImage = (x: number, y: number) => {
    if (context && mediaData && 'imgSrc' in mediaData) {
      const img = new Image();
      img.src = mediaData.imgSrc;
      img.onload = () => {
        const { width, height } = canvas.getCanvas();
        context.drawImage(img, x, y, width, height, 0, 0, width, height);
        texture.needsUpdate = true;
      };
    }
  };

  const setStaticPosition = (matrix4: THREE.Matrix4) => {
    mesh.visible = true;
    mesh.position.setFromMatrixPosition(matrix4);
    mesh.quaternion.setFromRotationMatrix(matrix4);
    mesh.scale.setFromMatrixScale(matrix4);
  };

  return {
    addTween,
    getMesh: () => mesh,
    setColor,
    setMirrored,
    setStaticImage,
    setStaticPosition,
  };
}

/**
 * Create tweening THREE.Group object to add actors to for combined tweens.
 */
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
    ease,
    fromMatrix4,
    toMatrix4,
  }: {
    delay: number,
    duration: number,
    ease?: keyof typeof Ease,
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
      ease,
      onStart: () => {
        group.visible = true;
      },
      onUpdate: async (progress: number) => {
        group.visible = true;
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

  const setStaticPosition = (matrix4: THREE.Matrix4) => {
    group.visible = true;
    group.position.setFromMatrixPosition(matrix4);
    group.quaternion.setFromRotationMatrix(matrix4);
    group.scale.setFromMatrixScale(matrix4);
  };

  return {
    addTween,
    getMesh: () => group,
    setStaticPosition,
  };
}
