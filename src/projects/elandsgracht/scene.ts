import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { createMeshFromPoints, createSVG } from './actor-mesh';
import { createActor } from './actor';
import { getMatrix4 } from '@app/utils';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 110;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 4;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const PATTERN_DURATION = SECONDS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

// eslint-disable-next-line no-console
console.log('PATTERN_DURATION', PATTERN_DURATION);
// eslint-disable-next-line no-console
console.log('STEP_DURATION', STEP_DURATION);

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1080;
    this.width3d = 16;
    this.height3d = (this.height / this.width) * this.width3d;
    this.fps = 15;
    this.captureFps = 30;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
    this.clearColor = 0x8abaf4;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      main: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/elandsgracht/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/elandsgracht/frames/&img=frame_#FRAME#.png',
      },
    };

    // PROJECT SETTINGS
    const projectSettings: ProjectSettings = {
      height: this.height,
      height3d: this.height3d,
      isPreview,
      patternDuration: PATTERN_DURATION,
      previewScale: PROJECT_PREVIEW_SCALE,
      scene: this.scene,
      scene3d: this,
      stepDuration: STEP_DURATION,
      timeline: this.timeline,
      width: this.width,
      width3d: this.width3d,
    };

    await this.createThings(projectSettings, videos);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  // eslint-disable-next-line class-methods-use-this
  async createThings(
    projectSettings: ProjectSettings,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    videos: { [key: string]: VideoData },
  ) {
    const { scene, width, width3d } = projectSettings;
    const SVG_SCALE = width3d / width;

    {
      const mesh = await createSVG(
        '../assets/projects/elandsgracht/testrectangle.svg',
        SVG_SCALE,
        undefined,
        0.01,
        0xff0000,
      );
      scene.add(mesh);
    }

    {
      const mesh = createMeshFromPoints([[0, 0], [3, 0], [3, 2], [0, 2]]);
      mesh.position.set(-3, 2, 0);
      scene.add(mesh);
    }

    {
      const actor = await createActor(
        projectSettings,
        {
          imgSrc: '../assets/projects/test/testimage3d.jpg',
          height: 1024,
          width: 1024,
        },
        {
          points: [[0, 0], [3, 0], [3, 2], [0, 2]],
          imageRect: { w: 1024, h: 1024 },
        },
      );
      actor.setStaticPosition(getMatrix4({ x: 3, y: -2 }));
      actor.setStaticImage(0, 0);
    }

    { // LINKS BOVEN
      const actor = await createActor(
        projectSettings,
        videos.main,
        {
          points: [[0, 0], [4, 0], [4, 1], [2, 2], [0, 2]],
          imageRect: { w: 480, h: 240 },
        },
      );
      actor.setStaticPosition(getMatrix4({ x: -8, y: 4.5 }));
      actor.addTween({
        delay: 0.1,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
    }

    { // LINKS BOVEN 2
      const actor = await createActor(
        projectSettings,
        videos.main,
        {
          points: [[0, 0], [3, 0], [3, 2], [0, 2]],
          imageRect: { w: 360, h: 240 },
        },
      );
      actor.setStaticPosition(getMatrix4({ x: -4, y: 4.5 }));
      actor.addTween({
        delay: 0.1,
        duration: PATTERN_DURATION,
        videoStart: 100,
        fromImagePosition: new THREE.Vector2(480, 0),
      });
    }
  }
}
