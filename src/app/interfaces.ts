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

export interface MediaData {
  height: number,
  width: number,
}

export interface ImageData extends MediaData {
  imgSrc: string,
}

export interface VideoData extends MediaData {
  fps: number,
  imgSrcPath: string,
}
