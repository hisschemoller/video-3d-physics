import { ExtendedObject3D } from 'enable3d';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { ProjectSettings, VideoData } from './interfaces';
import { Actor, createActor } from './actor';
import { Scenery, createScenery } from './scenery';
import createSphere from './sphere';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 119;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: (Actor | Scenery)[] = [];

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
    this.ambientLight.intensity = 0.5;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(15, 5, 10);
    this.directionalLight.intensity = 0.9;

    // PHYSICS
    this.physics.setGravity(0, 4, 0);

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
        ? '../assets/projects/weteringschans/frames_preview/frame_#FRAME#.png'
        : 'fs-img?dir=/Volumes/Samsung_X5/weteringschans/frames/&img=frame_#FRAME#.png',
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
    const to3d = (size: number, isWidth = true) => (isWidth
      ? (size / this.width) * this.width3d
      : (size / this.height) * this.height3d);

    const BG_SCALE = 1.097;

    { // ACHTERGROND
      const bg = await createScenery(projectSettings, videoData, {
        box: { w: this.width, h: this.height },
        matrix4: getMatrix4({
          x: 0, y: 0, z: -1, sx: BG_SCALE, sy: BG_SCALE, sz: BG_SCALE,
        }),
        video: { start: 23, duration: PATTERN_DURATION },
      });
      bg.getMesh().receiveShadow = false;
      actors.push(bg);
    }

    { // GEVEL
      const wall = await createScenery(projectSettings, videoData, {
        box: {
          x: 117, w: this.width, h: this.height, d: 0.2,
        },
        matrix4: getMatrix4({ x: to3d(117), y: 0 }),
        video: { start: 23, duration: PATTERN_DURATION },
        svg: {
          scale: this.width3d / this.width,
          url: '../assets/projects/weteringschans/wallwindows.svg',
          alignWithViewport: true,
        },
      });
      const mesh = wall.getMesh();
      this.physics.add.existing(mesh as unknown as ExtendedObject3D, { mass: 0 });
      /* eslint-disable new-cap */
      // mesh.body.ammo.setMassProps(0, new Ammo.btVector3(0, 0, 0));
      /* eslint-disable no-bitwise */
      // mesh.body.ammo.setCollisionFlags(mesh.body.ammo.getCollisionFlags() | 1); // 1 = STATIC
      // mesh.body.ammo.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
      // mesh.body.ammo.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
      // mesh.body.ammo.updateInertiaTensor();
      actors.push(wall);
    }

    actors.push(await createScenery(projectSettings, videoData, { // OVERKANT
      box: { y: 641, w: this.width, h: this.height },
      matrix4: getMatrix4({
        x: 0, y: ((-641 / this.height) * this.height3d), z: 0.3,
      }),
      video: { start: 23, duration: PATTERN_DURATION },
      svg: {
        scale: this.width3d / this.width,
        url: '../assets/projects/weteringschans/overkant.svg',
        alignWithViewport: true,
      },
    }));

    actors.push(await createScenery(projectSettings, videoData, { // STOEP
      box: { y: 124, w: this.width, h: this.height },
      matrix4: getMatrix4({
        x: 0,
        y: ((-124 / this.height) * this.height3d) + 0.05,
        z: 0.9,
        sx: 0.94,
        sy: 0.94,
        sz: 0.94,
      }),
      video: { start: 23, duration: PATTERN_DURATION },
      svg: {
        scale: this.width3d / this.width,
        url: '../assets/projects/weteringschans/stoep.svg',
        alignWithViewport: true,
      },
    }));

    const windows = {
      raam1a: { x: 312, y: 84, radius: 0.22 },
      raam1b: { x: 386, y: 81, radius: 0.20 },
      raam1c: { x: 272, y: 273, radius: 0.2 },
      raam1d: { x: 374, y: 272, radius: 0.3 },
      raam1e: { x: 292, y: 546, radius: 0.3 },
      raam1f: { x: 380, y: 550, radius: 0.2 },
      raam2a: { x: 516, y: 69, radius: 0.3 },
      raam2b: { x: 710, y: 75, radius: 0.3 },
      raam2c: { x: 516, y: 252, radius: 0.3 },
      raam2d: { x: 706, y: 260, radius: 0.3 },
      raam2e: { x: 518, y: 545, radius: 0.31 },
      raam2f: { x: 604, y: 532, radius: 0.35 },
      raam2g: { x: 701, y: 546, radius: 0.3 },
      raam3a: { x: 864, y: 80, radius: 0.4 },
      raam3b: { x: 866, y: 260, radius: 0.4 },
      raam3c: { x: 832, y: 560, radius: 0.15 },
      raam3d: { x: 890, y: 560, radius: 0.1 },
      raam4a: { x: 1030, y: 70, radius: 0.35 },
      raam4b: { x: 1160, y: 74, radius: 0.3 },
      raam4c: { x: 1030, y: 256, radius: 0.3 },
      raam4d: { x: 1156, y: 254, radius: 0.35 },
      raam4e: { x: 1025, y: 555, radius: 0.2 },
      raam4f: { x: 1155, y: 553, radius: 0.2 },
      raam5a: { x: 1368, y: 50, radius: 0.3 },
      raam5b: { x: 1312, y: 254, radius: 0.4 },
      raam5c: { x: 1420, y: 252, radius: 0.35 },
      raam5d: { x: 1282, y: 480, radius: 0.24 },
      raam5e: { x: 1352, y: 450, radius: 0.18 },
      raam5f: { x: 1426, y: 466, radius: 0.22 },
      raam6a: { x: 1570, y: 64, radius: 0.3 },
      raam6b: { x: 1705, y: 60, radius: 0.35 },
      raam6c: { x: 1568, y: 246, radius: 0.32 },
      raam6d: { x: 1703, y: 247, radius: 0.3 },
      raam7a: { x: 1858, y: 64, radius: 0.2 },
      raam7b: { x: 1856, y: 256, radius: 0.3 },
      raam7c: { x: 1832, y: 520, radius: 0.35 },
      raam7d: { x: 1908, y: 470, radius: 0.2 },
      raam7e: { x: 1904, y: 552, radius: 0.2 },
    };

    const spheres = [
      { w: windows.raam1a, p: 0 },
      { w: windows.raam3a, p: 0 },
      { w: windows.raam4d, p: 0 },
      { w: windows.raam5b, p: 0 },
      { w: windows.raam6c, p: 0 },
      { w: windows.raam1b, p: 2 },
      { w: windows.raam2c, p: 2 },
      { w: windows.raam4a, p: 2 },
      { w: windows.raam5e, p: 2 },
      { w: windows.raam7b, p: 2 },
      { w: windows.raam1c, p: 4 },
      { w: windows.raam2e, p: 4 },
      { w: windows.raam3b, p: 4 },
      { w: windows.raam4f, p: 4 },
      { w: windows.raam6a, p: 4 },
      { w: windows.raam7a, p: 6 },
      { w: windows.raam2a, p: 6 },
      { w: windows.raam4c, p: 6 },
      { w: windows.raam5c, p: 6 },
      { w: windows.raam6d, p: 6 },
      { w: windows.raam1e, p: 8 },
      { w: windows.raam2f, p: 8 },
      { w: windows.raam3c, p: 8 },
      { w: windows.raam5f, p: 8 },
      { w: windows.raam7c, p: 8 },
      { w: windows.raam1f, p: 10 },
      { w: windows.raam2b, p: 10 },
      { w: windows.raam4b, p: 10 },
      { w: windows.raam5a, p: 10 },
      { w: windows.raam7d, p: 12 },
      { w: windows.raam2g, p: 12 },
      { w: windows.raam3d, p: 12 },
      { w: windows.raam5d, p: 12 },
      { w: windows.raam7e, p: 14 },
      { w: windows.raam2d, p: 14 },
      { w: windows.raam4e, p: 14 },
      { w: windows.raam6b, p: 14 },
      { w: windows.raam1d, p: 14 },
    ];

    spheres.forEach((sphere) => {
      createSphere(projectSettings, {
        ...sphere.w, position: STEP_DURATION * sphere.p, duration: PATTERN_DURATION * 0.9,
      });
    });

    actors.push(await createActor(projectSettings, videoData, { // FIETSER BLAUWE JAS
      xPx: 150,
      yPx: 500,
      wPx: 300,
      hPx: 580,
      yAddPx: 20,
      z: 1,
      vStart: 39,
      xDist: -10,
      easeAmount: 0,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 8,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MAN MET KOPTELEFOON
      xPx: 880,
      yPx: 510,
      wPx: 230,
      hPx: 570,
      yAddPx: 20,
      z: 1,
      vStart: 2.5,
      xDist: 170,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 12,
    }));

    actors.push(await createActor(projectSettings, videoData, { // DRIETAL NAAR LINKS
      xPx: 470,
      yPx: 500,
      wPx: 440,
      hPx: 580,
      yAddPx: 20,
      z: 1.1,
      vStart: 10.2,
      xDist: -170,
      position: STEP_DURATION * 4,
      duration: STEP_DURATION * 8,
    }));

    actors.push(await createActor(projectSettings, videoData, { // MAN MET TELEFOON
      xPx: 1420,
      yPx: 500,
      wPx: 320,
      hPx: 580,
      yAddPx: 20,
      z: 1.2,
      vStart: 7.8,
      xDist: -200,
      easeAmount: 0,
      position: STEP_DURATION * 4,
      duration: STEP_DURATION * 12,
    }));

    actors.push(await createActor(projectSettings, videoData, { // FIETSER VAN LINKS
      xPx: 450,
      yPx: 520,
      wPx: 400,
      hPx: 580,
      yAddPx: 20,
      z: 0.6,
      vStart: 57.1,
      xDist: 600,
      easeAmount: 0,
      position: STEP_DURATION * 10,
      duration: STEP_DURATION * 6,
    }));

    actors.push(await createActor(projectSettings, videoData, { // VOETGANGER AAN OVERKANT
      xPx: 320,
      yPx: 500,
      wPx: 120,
      hPx: 580,
      z: 0.2,
      vStart: 87.8,
      xDist: 100,
      position: STEP_DURATION * 12,
      duration: STEP_DURATION * 4,
    }));

    // actors.push(await createActor(projectSettings, videoData, { // DONKERBLAUW BUSJE
    //   xPx: -200,
    //   yPx: 480,
    //   wPx: 380,
    //   hPx: 600,
    //   yAddPx: 20,
    //   z: 0.6,
    //   vStart: 63,
    //   xDist: 600,
    //   easeAmount: 0,
    //   position: STEP_DURATION * 0,
    //   duration: STEP_DURATION * 6,
    // }));

    // actors.push(await createActor(projectSettings, videoData, { // SCOOTER
    //   xPx: 350,
    //   yPx: 480,
    //   wPx: 320,
    //   hPx: 600,
    //   yAddPx: 20,
    //   z: 0.6,
    //   vStart: 87.15,
    //   xDist: 1500,
    //   position: STEP_DURATION * 0,
    //   duration: STEP_DURATION * 8,
    // }));

    // actors.push(await createActor(projectSettings, videoData, { // BAKFIETSJE
    //   xPx: 740,
    //   yPx: 510,
    //   wPx: 230,
    //   hPx: 570,
    //   yAddPx: 20,
    //   z: 0.5,
    //   vStart: 2.4,
    //   xDist: -350,
    //   position: STEP_DURATION * 0,
    //   duration: STEP_DURATION * 10,
    // }));

    // actors.push(await createActor(projectSettings, videoData, { // SWAPFIETS
    //   xPx: 1600,
    //   yPx: 490,
    //   wPx: 290,
    //   hPx: 590,
    //   yAddPx: 20,
    //   z: 0.6,
    //   vStart: 89.4,
    //   xDist: -400,
    //   position: STEP_DURATION * 0,
    //   duration: STEP_DURATION * 10,
    // }));
  }
}
