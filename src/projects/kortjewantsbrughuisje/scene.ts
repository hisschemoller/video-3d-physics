import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { ProjectSettings, VideoData } from './interfaces';
import { Actor, createActor } from './actor';
import createSphere from './sphere';
import createTube, { createRoofTube } from './tube';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 105.5;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: Actor[] = [];

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1080;
    this.width3d = 16;
    this.height3d = 9;
    this.fps = 15;
    this.captureThrottle = 15;
    this.captureLastFrame = Math.floor(PATTERN_DURATION * this.fps) * 2; // 2 maten
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.pCamera.position.set(0, 0, 9.6);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.6;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(-20, 5, 10);
    this.directionalLight.intensity = 1;

    // PHYSICS
    this.physics.setGravity(0, -4, 0);

    // MESHES AND TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videoData: VideoData = {
      fps: 30,
      scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
      height: isPreview ? this.height * PROJECT_PREVIEW_SCALE : this.height,
      width: isPreview ? this.width * PROJECT_PREVIEW_SCALE : this.width,
      imgSrcPath: isPreview
        ? '../assets/projects/kortjewantsbrughuisje/frames_preview/frame_#FRAME#.png'
        : 'fs-img?dir=/Volumes/Samsung_X5/kortjewantsbrughuisje/frames/&img=frame_#FRAME#.png',
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

    this.createActors(projectSettings, videoData);

    this.postCreate();
  }

  update(time: number, delta: number) {
    this.timeline.update(time, delta);
    super.update(time, delta);
  }

  postRender() {
    actors.forEach((actor) => actor.loadImage());
    super.postRender();
  }

  async createActors(projectSettings: ProjectSettings, videoData: VideoData) {
    actors.push(await createActor(projectSettings, videoData, { // ACHTERGROND
      xPx: 0,
      yPx: 0,
      wPx: this.width,
      hPx: this.height,
      z: 0,
      vStart: 369,
      duration: STEP_DURATION * STEPS,
    }));

    this.physics.add.box({
      x: -2, y: 1.8, z: 0.4, mass: 0, height: 0.1, width: 2, depth: 0.6,
    }, { phong: { color: 0x434b52 } });

    createSphere(projectSettings, {
      x: -1.5,
      y: 2.1,
      z: 0.4,
      duration: STEP_DURATION * 15,
    });

    {
      const actor = await createActor(projectSettings, videoData, { // FRONT
        xPx: 0,
        yPx: 0,
        wPx: this.width,
        hPx: this.height,
        z: 0.82,
        vStart: 369,
        duration: PATTERN_DURATION,
        svgUrl: '../assets/projects/kortjewantsbrughuisje/frontwindow.svg',
        svgScale: 0.1,
      });
      actors.push(actor);
      const mesh = actor.getMesh();
      const scale = 0.915;
      mesh.applyMatrix4(getMatrix4({ sx: scale, sy: scale }));
    }

    {
      const svgHeight = 466;
      const actor = await createActor(projectSettings, videoData, { // FIETSPAD COULISSE
        xPx: 0,
        yPx: this.height - svgHeight,
        wPx: this.width,
        hPx: svgHeight,
        z: 0.88,
        yAddPx: 30,
        vStart: 369,
        duration: PATTERN_DURATION,
        svgUrl: '../assets/projects/kortjewantsbrughuisje/fietspad.svg',
        svgScale: 0.1,
      });
      actors.push(actor);
      const mesh = actor.getMesh();
      const scale = 0.91;
      mesh.applyMatrix4(getMatrix4({ sx: scale, sy: scale }));
    }

    {
      const svgHeight = 84;
      const actor = await createActor(projectSettings, videoData, { // VLUCHTHEUVEL COULISSE
        xPx: 0,
        yPx: this.height - svgHeight,
        wPx: this.width,
        hPx: svgHeight,
        z: 1.1,
        yAddPx: 60,
        vStart: 369,
        duration: PATTERN_DURATION,
        svgUrl: '../assets/projects/kortjewantsbrughuisje/vluchtheuvel.svg',
        svgScale: 0.1,
      });
      actors.push(actor);
      const mesh = actor.getMesh();
      const scale = 0.89;
      mesh.applyMatrix4(getMatrix4({ sx: scale, sy: scale }));
    }

    // TUBES
    createTube(projectSettings, {
      xPx: 1025,
      yPx: 410,
      z: 0.45,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [0.1, -0.1, 1], [0.3, -0.4, 1.2], [1.1, -0.4, 0.9]],
      angleY: -0.03,
      angleZ: 0.035,
      phase: 0.7,
    });

    createTube(projectSettings, {
      xPx: 1025,
      yPx: 445,
      z: 0.45,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [0.1, -0.1, 1], [1, -0.5, 0.5], [1.2, -0.5, 0.6], [1.5, -0.4, 0.6]],
      angleY: -0.02,
      angleZ: 0.05,
      phase: 0.4,
    });

    createTube(projectSettings, {
      xPx: 1025,
      yPx: 470,
      z: 0.45,
      duration: PATTERN_DURATION,
      curve: [[0, 0, 0], [0.1, -0.1, 1], [0.6, -0.1, 1.2], [0.9, -0.21, 0.9], [1.0, -0.65, 0.8]],
      angleY: -0.05,
      angleZ: 0.02,
    });

    createRoofTube(projectSettings, {
      duration: PATTERN_DURATION,
    });

    // ACTORS
    actors.push(await createActor(projectSettings, videoData, { // AGENT KOMT AAN
      xPx: 1340,
      yPx: 650,
      wPx: 400,
      hPx: 430,
      z: 1.05,
      vStart: 130,
      xDist: -250,
      easeAmount: 0.6,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 9,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MEISJE WITTE JURK
      xPx: 300,
      yPx: 640,
      wPx: 260,
      hPx: 430,
      z: 0.90,
      yAddPx: 10,
      vStart: 22.6,
      xDist: -40,
      easeAmount: 1,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 12,
    }));

    actors.push(await createActor(projectSettings, videoData, { // WITTE AUTO
      xPx: 1900,
      yPx: 750,
      wPx: 150,
      hPx: 330,
      z: 0.90,
      xAddPx: -90,
      vStart: 132.2,
      xDist: -120,
      easeAmount: 1,
      position: STEP_DURATION * 2,
      duration: STEP_DURATION * 10,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MAN MET HONDEN
      xPx: 750,
      yPx: 650,
      wPx: 200,
      hPx: 430,
      z: 0.85,
      vStart: 192.3,
      xDist: 100,
      easeAmount: 0,
      position: STEP_DURATION * 2,
      duration: STEP_DURATION * 5,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MEISJE VOOROP
      xPx: 1040,
      yPx: 650,
      wPx: 300,
      hPx: 430,
      z: 0.9,
      vStart: 253.25,
      xDist: -450,
      easeAmount: 0,
      position: STEP_DURATION * 7,
      duration: STEP_DURATION * 9,
    }));

    actors.push(await createActor(projectSettings, videoData, { // BOTEN
      xPx: 0,
      yPx: 700,
      wPx: 325,
      hPx: 430,
      z: 0.001,
      vStart: 284,
      xDist: 0,
      easeAmount: 0,
      position: STEP_DURATION * 7,
      duration: STEP_DURATION * 9,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MAN FIETST WEG
      xPx: 280,
      yPx: 650,
      wPx: 190,
      hPx: 420,
      z: 0.90,
      yAddPx: 10,
      vStart: 158.1,
      xDist: -30,
      easeAmount: -1,
      position: STEP_DURATION * 12,
      duration: STEP_DURATION * 4,
    }));

    actors.push(await createActor(projectSettings, videoData, { // WITTE AUTO EN AGENT
      xPx: 1700,
      yPx: 650,
      wPx: 200,
      hPx: 430,
      z: 0.9,
      xAddPx: -90,
      vStart: 145.2,
      xDist: 90,
      easeAmount: 0,
      position: STEP_DURATION * 12,
      duration: STEP_DURATION * 4,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MAN KORTE BROEK
      xPx: 1190,
      yPx: 660,
      wPx: 130,
      hPx: 420,
      z: 0.85,
      vStart: 58.8,
      xDist: 70.1,
      easeAmount: 0,
      position: STEP_DURATION * 12,
      duration: STEP_DURATION * 4,
    }));
  }
}
