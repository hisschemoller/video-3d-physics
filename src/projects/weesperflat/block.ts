import { ExtendedMesh, THREE } from 'enable3d';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';

export default function tweenBlock(
  timeline: Timeline,
  duration: number,
  mesh: ExtendedMesh,
  points: { time: number, vec3: THREE.Vector3 }[],
): void {
  points.forEach((point) => point.vec3.add(mesh.position));
  const tween = createTween({
    duration,
    onStart: () => {},
    onUpdate: (progress: number) => {
      const lastPointIndex = points.findIndex((point, index) => (
        index > 0 && (point.time / duration) >= progress));
      const startPoint = points[lastPointIndex - 1];
      const endPoint = points[lastPointIndex];
      const localPosition = (progress * duration) - startPoint.time;
      const localDuration = endPoint.time - startPoint.time;
      const localProgress = localPosition / localDuration;
      mesh.position.lerpVectors(startPoint.vec3, endPoint.vec3, localProgress);
    },
    onComplete: () => {},
  });

  timeline.add(tween);
}
