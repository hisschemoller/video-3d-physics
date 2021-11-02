import { THREE } from 'enable3d';
import MainScene, { FPS }  from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { Actor, createActor } from './actor';
import { createRotatingWheel } from './rotating-wheel';
import { createTube } from './tube';

export const PROJECT_WIDTH = 1920;
export const PROJECT_HEIGHT = 1080;
export const VIEWPORT_3D_WIDTH = 16;
export const VIEWPORT_3D_HEIGHT = 9;
const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 109;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: Actor[] = [];

export default class Scene extends MainScene {
  timeline: Timeline;

  constructor() {
    super();
  }

  async create() {
    this.captureLastFrame = Math.floor(PATTERN_DURATION * FPS);
    this.width = PROJECT_WIDTH;
    this.height = PROJECT_HEIGHT;

    const isPreview = true && !this.isCapture;

    const videoData = {
      fps: 30,
      scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
      height: isPreview ? PROJECT_HEIGHT * PROJECT_PREVIEW_SCALE : PROJECT_HEIGHT,
      width: isPreview ? PROJECT_WIDTH * PROJECT_PREVIEW_SCALE : PROJECT_WIDTH,
      imgSrcPrefix: isPreview
        ? '../assets/projects/plantageparklaan/frames_preview/frame_'
        : 'fs-img?dir=/Volumes/Samsung_X5/plantageparklaan/frames/&img=frame_',
      imgSrcSuffix: '.png',
    };

    // MESHES AND TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // ACTORS
    actors.push(await createActor(this.scene, this.timeline, videoData, { // ACHTERGROND
      xPx: 0, yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, z: 0,
      vStart: 43, duration: PATTERN_DURATION,
    }));
    // actors.push(await createActor(this.scene, this.timeline, videoData, { // huizen
    //   xPx: 7.013 * (PROJECT_WIDTH / VIEWPORT_3D_WIDTH), 
    //   yPx: 0, svgYPx: 2 * (PROJECT_HEIGHT / VIEWPORT_3D_HEIGHT), 
    //   wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, z: 0.3,
    //   vStart: 25.5, duration: PATTERN_DURATION,
    //   svgUrl: '../assets/projects/plantageparklaan/huizen.svg', svgScale: 0.1,
    // }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // DEUR
      xPx: 5.329 * (PROJECT_WIDTH / VIEWPORT_3D_WIDTH), yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, z: 0.3,
      vStart: 25.5, duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/plantageparklaan/deur.svg', svgScale: 0.1,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // TERRAS
      xPx: 0, yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, z: 0.6,
      vStart: 25, duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/plantageparklaan/terras.svg', svgScale: 0.1,
    }));

    createRotatingWheel({
      scene: this.scene, timeline: this.timeline, 
      xPx: 550, yPx: 450, z: 0.4, duration: PATTERN_DURATION, 
    });
    createTube({
      scene: this.scene, timeline: this.timeline, 
      xPx: 800, yPx: 700, z: 0.4, duration: PATTERN_DURATION, 
    });

    actors.push(await createActor(this.scene, this.timeline, videoData, { // VROUW OVERSTEKEND
      xPx: 270, yPx: 790, wPx: 140, hPx: 280, z: 0.8,
      vStart: 35, xDist: -130,
      position: STEP_DURATION * 2, duration: STEP_DURATION * 10,
    }));

    super.create();
  }

  update(time: number, delta: number) {
    this.timeline.update(time, delta);
    super.update(time, delta);
  }

  postRender() {
    actors.forEach((actor) => actor.loadImage());
    super.postRender();
  }
}
