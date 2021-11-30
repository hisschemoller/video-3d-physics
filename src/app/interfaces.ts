import MainScene from '@app/mainscene';
import { Timeline } from '@app/timeline';

export interface ProjectSettings {
  scene3d: MainScene,
  scene: THREE.Scene,
  timeline: Timeline,
  width: number,
  height: number,
  width3d: number,
  height3d: number,
}

export interface VideoData {
  fps: number,
  scale: number,
  height: number,
  width: number,
  imgSrcPath: string,
}
