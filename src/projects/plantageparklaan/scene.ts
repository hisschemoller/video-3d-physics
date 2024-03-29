import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { Actor, createActor } from './actor';
import createRotatingWheel from './rotating-wheel';
import { createTube, createSkyTube } from './tube';

const PROJECT_WIDTH = 1920;
const PROJECT_HEIGHT = 1080;
const VIEWPORT_3D_WIDTH = 16;
const VIEWPORT_3D_HEIGHT = 9;
const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 107;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const PROJECT_SETTINGS = {
  vp3dWidth: VIEWPORT_3D_WIDTH,
  vp3dHeight: VIEWPORT_3D_HEIGHT,
  projectPxWidth: PROJECT_WIDTH,
  projectPxHeight: PROJECT_HEIGHT,
};
const actors: Actor[] = [];

export default class Scene extends MainScene {
  timeline: Timeline;

  constructor() {
    super();

    this.width = PROJECT_WIDTH;
    this.height = PROJECT_HEIGHT;
    this.fps = 15;
    this.captureThrottle = 15;
    this.captureLastFrame = Math.floor(PATTERN_DURATION * this.fps);
  }

  async create() {
    const isPreview = true && !this.scene.userData.isCapture;

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
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 0,
      wPx: PROJECT_WIDTH,
      hPx: PROJECT_HEIGHT,
      z: 0,
      vStart: 43,
      duration: PATTERN_DURATION,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // DEUR
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 0,
      wPx: PROJECT_WIDTH,
      hPx: PROJECT_HEIGHT,
      z: 0.3,
      vStart: 61.5,
      duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/plantageparklaan/deur.svg',
      svgScale: 0.1,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // TERRAS
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 0,
      wPx: PROJECT_WIDTH,
      hPx: PROJECT_HEIGHT,
      xAddPx: 10,
      z: 0.6,
      vStart: 25,
      duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/plantageparklaan/terras.svg',
      svgScale: 0.1,
    }));

    createRotatingWheel({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 550,
      yPx: 450,
      z: 0.22,
      duration: PATTERN_DURATION,
    });

    // TUBES IN THE DOOR
    createTube({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 800,
      yPx: 640,
      z: 0.45,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [4, 0.4, -0.3], [7, -0.1, 0.2], [7.2, -0.8, 1]],
      angleY: -0.03,
      angleZ: 0.02,
    });
    createTube({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 800,
      yPx: 670,
      z: 0.45,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [5, 0, 0.4], [5.5, 0.5, 0.5], [6.5, 0.9, 0.6]],
      angleY: 0.01,
      angleZ: 0.025,
      phase: 0.4,
    });
    createTube({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 800,
      yPx: 600,
      z: 0.45,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [3.5, 0.6, 0.4], [4, -1.1, -0.1]],
      angleY: 0.025,
      angleZ: 0.015,
      phase: 0.7,
    });

    // TUBES IN THE SKY
    createSkyTube({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 900,
      yPx: 200,
      z: 0.15,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [4, -0.2, 0.2], [6, -0.5, 0.5]],
      angleY: 0.02,
      angleZ: 0.01,
      phase: 0,
    });
    createSkyTube({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 900,
      yPx: 80,
      z: 0.2,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [3, -0.3, 0.2], [7, -0.9, 0.6]],
      angleY: 0.015,
      angleZ: 0.01,
      phase: 0.4,
    });
    createSkyTube({
      ...PROJECT_SETTINGS,
      scene: this.scene,
      timeline: this.timeline,
      xPx: 900,
      yPx: 110,
      z: 0.1,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [3, -0.1, 0.3], [9, -0.4, 0.3]],
      angleY: 0.01,
      angleZ: 0.015,
      phase: 0.7,
    });

    // ACTORS
    actors.push(await createActor(this.scene, this.timeline, videoData, { // MAN UIT CAFÉ
      ...PROJECT_SETTINGS,
      xPx: 830,
      yPx: 700,
      wPx: 200,
      hPx: 470,
      z: 0.01,
      vStart: 61.5,
      xDist: 10,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 16,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // FIETSER RECHTS
      ...PROJECT_SETTINGS,
      xPx: 1450,
      yPx: 750,
      wPx: 240,
      hPx: 290,
      z: 0.4,
      vStart: 50.8,
      xDist: 260,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 7.5,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // FIETSER FIETSSPAD
      ...PROJECT_SETTINGS,
      xPx: 1180,
      yPx: 790,
      wPx: 100,
      hPx: 260,
      z: 0.1,
      vStart: 31,
      xDist: 30,
      position: STEP_DURATION * 1.1,
      duration: STEP_DURATION * 6.4,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // VROUW OVERSTEKEND
      ...PROJECT_SETTINGS,
      xPx: 270,
      yPx: 790,
      wPx: 140,
      hPx: 280,
      z: 0.8,
      vStart: 35,
      xDist: -100,
      position: STEP_DURATION * 1.1,
      duration: STEP_DURATION * 7.4,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // FIETSER NAAR CAFÉ
      ...PROJECT_SETTINGS,
      xPx: 1170,
      yPx: 780,
      wPx: 170,
      hPx: 290,
      z: 0.02,
      vStart: 55.55,
      xDist: -120,
      position: STEP_DURATION * 7.5,
      duration: STEP_DURATION * 5.5,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // MOEDER EN KIND
      ...PROJECT_SETTINGS,
      xPx: 1710,
      yPx: 800,
      wPx: 120,
      hPx: 280,
      z: 0.05,
      vStart: 1,
      xDist: 125,
      position: STEP_DURATION * 6,
      duration: STEP_DURATION * 10,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // WIT BUSJE
      ...PROJECT_SETTINGS,
      xPx: 1500,
      yPx: 690,
      wPx: 160,
      hPx: 380,
      z: 0.1,
      vStart: 8.3,
      xDist: -100,
      position: STEP_DURATION * 7.5,
      duration: STEP_DURATION * 5.5,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // GELE FIETSER
      ...PROJECT_SETTINGS,
      xPx: 750,
      yPx: 770,
      wPx: 240,
      hPx: 280,
      z: 0.7,
      vStart: 17,
      xDist: -450,
      position: STEP_DURATION * 7.5,
      duration: STEP_DURATION * 10,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // DONKERE AUTO
      ...PROJECT_SETTINGS,
      xPx: 1650,
      yPx: 690,
      wPx: 160,
      hPx: 380,
      z: 0.05,
      vStart: 58.5,
      xDist: -100,
      position: STEP_DURATION * 8.5,
      duration: STEP_DURATION * 5.5,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // SCOOTER
      ...PROJECT_SETTINGS,
      xPx: 1220,
      yPx: 800,
      wPx: 200,
      hPx: 260,
      z: 0.7,
      vStart: 79.4,
      xDist: -200,
      position: STEP_DURATION * 13,
      duration: STEP_DURATION * 4,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // ZILVEREN AUTO
      ...PROJECT_SETTINGS,
      xPx: 1440,
      yPx: 800,
      wPx: 330,
      hPx: 260,
      z: 0.1,
      vStart: 29.3,
      xDist: -160,
      position: STEP_DURATION * 13,
      duration: STEP_DURATION * 4,
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
