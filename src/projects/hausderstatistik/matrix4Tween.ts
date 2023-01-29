/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import createTween, { EaseFunction } from '@app/tween';

/**
 * Actor tween config data, passed as argument to addTween().
 */
interface TweenData {
  delay: number,
  duration: number,
  ease?: keyof typeof EaseFunction,
  fromMatrix4?: THREE.Matrix4,
  toMatrix4?: THREE.Matrix4,
}

export default function addMatrix4Tween(
  projectSettings: ProjectSettings,
  object3d: THREE.Mesh | THREE.Group,
  {
    delay,
    duration,
    ease,
    fromMatrix4,
    toMatrix4,
  }: TweenData,
) {
  const startPosition = fromMatrix4 ? new THREE.Vector3().setFromMatrixPosition(fromMatrix4) : undefined;
  const endPosition = toMatrix4 ? new THREE.Vector3().setFromMatrixPosition(toMatrix4) : undefined;
  const startQuaternion = fromMatrix4 ? new THREE.Quaternion().setFromRotationMatrix(fromMatrix4) : undefined;
  const endQuaternion = toMatrix4 ? new THREE.Quaternion().setFromRotationMatrix(toMatrix4) : undefined;
  const startScale = fromMatrix4 ? new THREE.Vector3().setFromMatrixScale(fromMatrix4) : undefined;
  const endScale = toMatrix4 ? new THREE.Vector3().setFromMatrixScale(toMatrix4) : undefined;

  if (fromMatrix4) {
    object3d.position.setFromMatrixPosition(fromMatrix4);
    object3d.quaternion.setFromRotationMatrix(fromMatrix4);
    object3d.scale.setFromMatrixScale(fromMatrix4);
  }

  const tween = createTween({
    delay,
    duration,
    ease,
    onStart: () => {
      object3d.visible = true;
    },
    onUpdate: async (progress: number) => {
      if (startPosition && endPosition && startQuaternion && endQuaternion && startScale && endScale) {
        object3d.position.lerpVectors(startPosition, endPosition, progress);
        object3d.quaternion.slerpQuaternions(startQuaternion, endQuaternion, progress);
        object3d.scale.lerpVectors(startScale, endScale, progress);
      }
    },
    onComplete: () => {
      // FIXME: removed for Prins Hendrikkade
      // mesh.visible = false;
    },
  });
  projectSettings.timeline.add(tween);
}
