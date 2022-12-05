import MainScene from '@app/mainscene';
import { Timeline } from '@app/timeline';

export interface ProjectSettings {
  height: number;
  height3d: number;
  scene3d: MainScene;
  scene: THREE.Scene;
  isPreview: boolean;
  measures: number;
  patternDuration: number;
  previewScale: number;
  stepDuration: number;
  timeline: Timeline;
  width: number;
  width3d: number;
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
