import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';
import createPole from './pole';
// import createSphere from './sphere';
import { createSoftVolume, updateSoftVolumes } from './softbody';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 114;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: (Actor)[] = [];

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
    this.captureFps = 30;
    this.captureThrottle = 15;
    this.captureDuration = PATTERN_DURATION * 2;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // RENDERER
    this.renderer.setClearColor(0x749ecc);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.5;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(15, 5, 10);
    this.directionalLight.intensity = 0.9;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videos = {
      video1: {
        fps: 30,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        height: 920,
        width: this.width,
        x: 0,
        y: 160,
        imgSrcPath: isPreview
          ? '../assets/projects/weesperflat/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/weesperflat/frames/&img=frame_#FRAME#.png',
      },
      video2: {
        fps: 30,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        height: 664,
        width: this.width,
        x: 0,
        y: 231,
        imgSrcPath: isPreview
          ? '../assets/projects/weesperflat/frames2_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/weesperflat2/frames/&img=frame_#FRAME#.png',
      },
      wall: {
        fps: 0,
        height: 64,
        imgSrcPath: '../assets/projects/weesperflat/wall-color.jpg',
        scale: 0.1,
        width: 64,
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

  preRender() {
    super.preRender();
    updateSoftVolumes();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time);
    super.updateAsync(time, delta);
  }

  async createActors(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = (size: number, isWidth = true) => (isWidth
      ? (size / this.width) * this.width3d
      : (size / this.height) * this.height3d * -1);

    const toVP3d = (size: number, isWidth = true) => (
      to3d(size, isWidth) + (isWidth ? (this.width3d * -0.5) : (this.height3d * 0.5)));

    const SVG_SCALE = this.width3d / this.width;

    {
      const actor = await createActor(projectSettings, videos.video2, { // BOMEN ACHTER
        box: { d: 0.01 },
        video: {
          start: 25.7,
          duration: PATTERN_DURATION,
          alignWithViewport: false,
          x: 1236,
          y: 0,
        },
        svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/bomen.svg' },
        matrix4: getMatrix4({
          x: toVP3d(0) - 1.65,
          y: toVP3d(0, false) + 1,
          z: -2,
          sx: 1.2,
          sy: 1.2,
        }),
        tween: { position: 0, duration: PATTERN_DURATION },
      });
      const mesh = actor.getMesh();
      const material = (mesh.material as THREE.Material[])[1];
      material.transparent = true;
      material.opacity = 0.8;
      actors.push(actor);
    }

    actors.push(await createActor(projectSettings, videos.video2, { // NIEUWE KEIZERSGRACHT
      video: {
        start: 12.6,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: 1003,
        y: 0,
      },
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/nieuwekeizersgracht.svg' },
      matrix4: getMatrix4({
        x: toVP3d(1053),
        y: toVP3d(216, false),
        z: -1,
        sx: 1.1,
        sy: 1.1,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video2, { // NIEUWE KEIZERSGRACHT 2
      box: { w: 400, h: 350 },
      video: {
        start: 25.5,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: 1000,
        y: 0,
      },
      matrix4: getMatrix4({
        x: toVP3d(1048),
        y: toVP3d(710, false),
        z: -0.9,
        sx: 1.1,
        sy: 1.1 * (videos.video2.height / this.height),
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // DE FLAT
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/flat.svg' },
      video: { start: 25.7, duration: PATTERN_DURATION },
      matrix4: getMatrix4({
        x: toVP3d(0),
        y: toVP3d(205, false),
        z: 0,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // MUUR
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/muur.svg' },
      video: {
        start: 25.7,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: -1,
        y: 1,
      },
      matrix4: getMatrix4({
        x: toVP3d(105),
        y: toVP3d(205, false),
        z: 0,
        sx: 0.89,
        sy: 0.89,
      }),
      box: { d: 0.7 },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // RAMEN
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/ramen.svg' },
      video: {
        start: 25.7,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: -1,
        y: 1,
      },
      matrix4: getMatrix4({
        x: toVP3d(105),
        y: toVP3d(205, false),
        z: 0.7,
        sx: 0.89,
        sy: 0.89,
      }),
      box: { d: 0.3 },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // VOORGROND 1
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/voorgrond1.svg' },
      video: {
        start: 25.7,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: -1,
        y: 86,
      },
      matrix4: getMatrix4({
        x: toVP3d(155),
        y: toVP3d(298, false),
        z: 1.5,
        sx: 0.84,
        sy: 0.84,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // VOORGROND 2
      box: { d: 0.005 },
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/voorgrond2.svg' },
      video: {
        start: 25.7,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: -2,
        y: 180,
      },
      matrix4: getMatrix4({
        x: toVP3d(180),
        y: toVP3d(380, false),
        z: 1.8,
        sx: 0.81,
        sy: 0.81,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // IETS OP BALKON
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/balkonvorm.svg' },
      video: {
        start: 25.7,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: 1200,
        y: 180,
      },
      matrix4: getMatrix4({
        x: toVP3d(630),
        y: toVP3d(290, false),
        z: 0.8,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    this.physics.add.box({ // DAK
      x: -3.2, y: 2.63, z: -0.02, mass: 0, height: 0.3, width: 8, depth: 2,
    }, { phong: { color: 0x434b52 } });

    { // PUNTEN OP HET DAK
      const height = 0.3;
      const depth = 0.2;
      const width = 0.2;
      [0.7, 0.15, -1.7, -3.55, -5.4].forEach((x) => {
        [0.88, 0, -0.8].forEach((z) => {
          this.physics.add.box({
            x, y: 2.75 + (height / 2), z, mass: 0, height, width, depth,
          }, { phong: { color: 0xe7ddc7 } });
        });
      });
    }

    // createSphere(projectSettings, {
    //   x: -0.1,
    //   y: 4.5,
    //   z: 0,
    //   duration: STEP_DURATION * 15,
    // });

    // const volumeMass = 15;
    // const pressure = 400;
    // const sphereGeometry = new THREE.SphereGeometry(1, 40, 25);
    // sphereGeometry.translate(0.0, 4, 0.4);
    // const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
    // cylinderGeometry.rotateZ(Math.PI * 0.5);
    // cylinderGeometry.translate(0.0, 4, 0.4);
    // const boxGeometry = new THREE.BoxGeometry(1, 1, 6.5, 32, 32, 32);
    // boxGeometry.rotateY(Math.PI * 0.48);
    // boxGeometry.translate(-1.8, 3.8, -0.1);
    // createSoftVolume(boxGeometry, volumeMass, pressure, this.scene, this.physics.physicsWorld);

    const ground = this.physics.add.box({
      y: -2.5, width: 0.1, height: 0.1, depth: 0.1, mass: 0,
    });

    {
      const connLength = 1.3;
      const poleLength = 3;
      createPole(projectSettings, {
        ground,
        box: {
          x: toVP3d(1017),
          y: toVP3d(584, false) - 0.3,
          z: 0,
          w: to3d(76),
          h: to3d(94),
          d: 0.5,
        },
        connector: { radius: 0.05, height: connLength },
        pivotBlock: { x: to3d(76 / 2), y: 0, z: 0.15 },
        pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
        pole: { radius: 0.05, height: poleLength },
        pivotPoleToConnector: { x: 0, y: 0, z: 0 },
        pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
        pivotPoleToGround: { x: 0, y: -3 / 2, z: 0 },
        pivotGroundToPole: { x: toVP3d(1017) + 1.5, y: 0, z: 0 },
        hingePoleToGroundAxis: { x: 0, y: 0, z: 1 },
        tween: { axis: 'y', distance: -0.3 },
        position: 0,
        duration: PATTERN_DURATION,
      });
    }

    // {
    //   const actor = await createActor(projectSettings, videos.video1, { // BLOK 1
    //     box: { d: 0.5 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok1.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(979), y: toVP3d(534, false), z: -0.4 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 8, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 10, vec3: new THREE.Vector3(0, -0.75, 0) },
    //     { time: STEP_DURATION * 12, vec3: new THREE.Vector3(0.2, -0.75, 0) },
    //     { time: STEP_DURATION * 14, vec3: new THREE.Vector3(0, -0.75, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    // {
    //   const actor = await createActor(projectSettings, videos.video1, { // BLOK 2
    //     box: { d: 0.3 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok2.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(985), y: toVP3d(355, false), z: 0.7 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 4, vec3: new THREE.Vector3(0, 0.94, 0) },
    //     { time: STEP_DURATION * 8, vec3: new THREE.Vector3(0, 0.94, 0) },
    //     { time: STEP_DURATION * 12, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    // {
    //   const actor = await createActor(projectSettings, videos.wall, { // BLOK 3
    //     box: { d: 0.3 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok3.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(970), y: toVP3d(550, false), z: -0.5 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 2, vec3: new THREE.Vector3(0.45, 0, 0) },
    //     { time: STEP_DURATION * 13, vec3: new THREE.Vector3(0.45, 0, 0) },
    //     { time: STEP_DURATION * 14, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    // {
    //   const actor = await createActor(projectSettings, videos.video1, { // BLOK 4
    //     box: { d: 0.3 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok4.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(460), y: toVP3d(470, false), z: 0.0 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 2, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 14, vec3: new THREE.Vector3(1, 0, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    // {
    //   const actor = await createActor(projectSettings, videos.video1, { // BLOK 5
    //     box: { d: 0.3 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok5.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(625), y: toVP3d(710, false), z: 0.0 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 4, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 8, vec3: new THREE.Vector3(0, 0.6, 0) },
    //     { time: STEP_DURATION * 14, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    // {
    //   const actor = await createActor(projectSettings, videos.video1, { // BLOK 6
    //     box: { d: 0.3 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok6.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(600), y: toVP3d(470, false), z: 0.0 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 6, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 8, vec3: new THREE.Vector3(0, -0.6, 0) },
    //     { time: STEP_DURATION * 14, vec3: new THREE.Vector3(0, -0.6, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    // {
    //   const actor = await createActor(projectSettings, videos.video1, { // BLOK 7
    //     box: { d: 0.3 },
    //     svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/blok7.svg' },
    //     video: { start: 25.7, duration: 0 },
    //     matrix4: getMatrix4({ x: toVP3d(770), y: toVP3d(580, false), z: 0.3 }),
    //     tween: { position: 0, duration: 0 },
    //   });
    //   tweenBlock(this.timeline, PATTERN_DURATION, actor.getMesh(), [
    //     { time: STEP_DURATION * 0, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 1, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 3, vec3: new THREE.Vector3(-0.4, 0, 0) },
    //     { time: STEP_DURATION * 8, vec3: new THREE.Vector3(-0.4, 0, 0) },
    //     { time: STEP_DURATION * 10, vec3: new THREE.Vector3(0, 0, 0) },
    //     { time: STEP_DURATION * 16, vec3: new THREE.Vector3(0, 0, 0) },
    //   ]);
    //   actors.push(actor);
    // }

    actors.push(await createActor(projectSettings, videos.video1, { // WACHTENDE VROUW MET FIETS
      box: { w: 200, h: 400 },
      video: {
        start: 25.5,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: 702,
        y: 60,
      },
      matrix4: getMatrix4({
        x: toVP3d(740),
        y: toVP3d(655, false),
        z: 1,
        sx: 0.85,
        sy: 0.85,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // WACHTENDE MAN MET FIETS
      box: { w: 203, h: 400, d: 0.001 },
      video: {
        start: 25.5,
        duration: PATTERN_DURATION,
        alignWithViewport: false,
        x: 302,
        y: 120,
      },
      matrix4: getMatrix4({
        x: toVP3d(380),
        y: toVP3d(600, false),
        z: 1,
        sx: 0.85,
        sy: 0.85,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    // actors.push(await createActor(projectSettings, videos.video1, { // BOX TEST
    //   box: { w: 500, h: 270 },
    //   video: { start: 25.7, duration: STEP_DURATION * 14 },
    //   matrix4: getMatrix4({
    //     x: toVP3d(0),
    //     y: toVP3d(810, false), // 1080 - 270 = 810
    //     z: 0.2,
    //   }),
    //   tween: {
    //     position: 0,
    //     duration: STEP_DURATION * 15,
    //     matrix4End: getMatrix4({
    //       x: toVP3d(this.width - 500),
    //       y: toVP3d(videos.video1.y, false),
    //       z: 0.2,
    //     }),
    //   },
    // }));

    // actors.push(await createActor(projectSettings, videos.video1, { // SVG TEST
    //   svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/test7.svg' },
    //   video: { start: 25.7, duration: STEP_DURATION * 14 },
    //   matrix4: getMatrix4({
    //     x: toVP3d(videos.video1.x),
    //     y: toVP3d(videos.video1.y, false),
    //     z: 0.1,
    //   }),
    //   tween: {
    //     position: 0,
    //     duration: STEP_DURATION * 15,
    //     matrix4End: getMatrix4({
    //       x: toVP3d(this.width - 637),
    //       y: toVP3d(810, false),
    //       z: 0.1,
    //     }),
    //   },
    // }));
  }
}
