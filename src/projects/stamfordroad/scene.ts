import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 101;
// const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
// const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: Actor[] = [];

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1440;
    this.width3d = 16;
    this.height3d = 12;
    this.fps = 15;
    this.captureFps = 25;
    this.captureThrottle = 15;
    this.captureDuration = PATTERN_DURATION * 1;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.pCamera.position.set(0, 0, 12.8);

    // RENDERER
    this.renderer.setClearColor(0xeeeeee);

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videos = {
      main: {
        fps: 25,
        height: this.height,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/stamfordroad/stamfordroad-main_frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/stamfordroad/frames/&img=frame_#FRAME#.png',
      },
    };

    const projectSettings: ProjectSettings = {
      scene3d: this,
      scene: this.scene,
      timeline: this.timeline,
      width: this.width,
      height: this.height,
      width3d: this.width3d,
      height3d: this.height3d,
    };

    await this.createActors(projectSettings, videos);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time);
    super.updateAsync(time, delta);
  }

  async createActors(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);
    // const SVG_SCALE = this.width3d / this.width;

    actors.push(await createActor(projectSettings, videos.main, { // ACHTERGROND
      box: { w: this.width, h: this.height },
      matrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(0, false) }),
      video: { start: 59.2, duration: PATTERN_DURATION },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.main, { // HIDE CHILDREN
      box: { w: 570, h: 320 },
      matrix4: getMatrix4({ x: toVP3d(120), y: toVP3d(690, false), z: 0.001 }),
      video: { start: 54.5, duration: PATTERN_DURATION },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    const rotationMatrix4 = getMatrix4({ rx: (Math.PI * -0.5) + 0.2, ry: -0.011, rz: 0.05 });

    {
      const texture = new THREE.TextureLoader().load('../assets/projects/stamfordroad/stoep.jpg');
      const blockMaterial = this.add.material({ lambert: { map: texture } });
      const box = this.add.box({
        x: 0,
        y: toVP3d(960, false),
        z: 0.3,
        width: to3d(1920),
        height: to3d(200),
        depth: 0.1,
      }, { custom: blockMaterial });
      box.setRotationFromMatrix(rotationMatrix4);
      this.physics.add.existing(box, { collisionFlags: 2, mass: 0 });
    }
  }
}
