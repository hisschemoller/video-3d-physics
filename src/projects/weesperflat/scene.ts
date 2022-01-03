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
const BPM = 129;
// const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
// const STEP_DURATION = PATTERN_DURATION / STEPS;
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
    this.captureDuration = PATTERN_DURATION * 5;
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
      isPreview,
      previewScale: PROJECT_PREVIEW_SCALE,
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
    await this.timeline.update(time, delta);
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

    // SOFTBODY
    const volumeMass = 15;
    const pressure = 400;
    const sphereGeometry = new THREE.SphereGeometry(1, 40, 25);
    sphereGeometry.translate(0.0, 4, 0.4);
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
    cylinderGeometry.rotateZ(Math.PI * 0.5);
    cylinderGeometry.translate(0.0, 4, 0.4);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 6.5, 32, 32, 32);
    boxGeometry.rotateY(Math.PI * 0.48);
    boxGeometry.translate(-1.8, 3.8, -0.1);
    createSoftVolume(boxGeometry, volumeMass, pressure, this.scene, this.physics.physicsWorld);

    const CONNECTOR_RADIUS = 0.04;

    const POLE_RADIUS = 0.05;

    const ground = this.physics.add.box({
      y: -2.5, width: 0.1, height: 0.1, depth: 0.1, mass: 0,
    });

    { // BLOK 1
      const blockX = toVP3d(1017);
      const blockZ = 0;
      const blockW = to3d(76);
      const connLength = 1.2;
      const poleLength = 5.5;
      createPole(projectSettings, {
        ground,
        block: {
          x: blockX,
          y: toVP3d(584, false) - 0.3,
          z: blockZ,
          w: blockW,
          h: to3d(94),
          d: 0.5,
        },
        blockTexture: 'assets/projects/weesperflat/texture-middark.jpg',
        connector: { radius: CONNECTOR_RADIUS, height: connLength },
        pivotBlockToConnector: { x: blockW / 2, y: 0, z: 0 },
        pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
        pole: { radius: POLE_RADIUS, height: poleLength },
        pivotPoleToConnector: { x: 0, y: -1.2, z: 0 },
        pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
        hingePoleToGroundAxis: { x: 0, y: 0, z: 1 },
        pivotPoleToGround: { x: 0, y: poleLength / -2, z: -0 },
        pivotGroundToPole: { x: blockX + (blockW / 2) + connLength, y: 0, z: blockZ },
        tween: { axis: 'y', distance: -0.3 },
        position: 0,
        duration: PATTERN_DURATION,
      });
    }

    { // BLOK 2
      const blockX = toVP3d(995) + 0.6;
      const blockW = to3d(93);
      const blockZ = -0.7;
      const connLength = 1.5;
      const poleLength = 5;
      createPole(projectSettings, {
        ground,
        block: {
          x: blockX,
          y: toVP3d(600, false),
          z: blockZ,
          w: blockW,
          h: to3d(62),
          d: 0.4,
        },
        connector: { radius: CONNECTOR_RADIUS, height: connLength },
        pivotBlockToConnector: { x: blockW / 2, y: 0, z: 0 },
        pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
        pole: { radius: POLE_RADIUS, height: poleLength },
        pivotPoleToConnector: { x: 0, y: -0.5, z: 0 },
        pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
        hingePoleToGroundAxis: { x: 0, y: 0, z: 1 },
        pivotPoleToGround: { x: 0, y: poleLength / -2, z: 0 },
        pivotGroundToPole: { x: blockX + (blockW / 2) + connLength, y: 0, z: blockZ },
        tween: { axis: 'x', distance: 0.25, phase: 0.3 },
        position: 0,
        duration: PATTERN_DURATION,
      });
    }

    { // BLOK 3
      const blockX = toVP3d(1018);
      const blockW = to3d(65);
      const blockZ = 0.85;
      const connLength = 3;
      const poleLength = 5;
      createPole(projectSettings, {
        ground,
        block: {
          x: blockX,
          y: toVP3d(315, false),
          z: blockZ,
          w: blockW,
          h: to3d(31),
          d: 0.3,
        },
        connector: { radius: CONNECTOR_RADIUS, height: connLength },
        pivotBlockToConnector: { x: blockW / 2, y: 0, z: 0 },
        pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
        pole: { radius: POLE_RADIUS, height: poleLength },
        pivotPoleToConnector: { x: 0, y: 1.5, z: 0 },
        pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
        hingePoleToGroundAxis: { x: 0, y: 0, z: 1 },
        pivotPoleToGround: { x: 0, y: poleLength / -2, z: 0 },
        pivotGroundToPole: { x: blockX + (blockW / 2) + connLength, y: 0, z: blockZ },
        tween: { axis: 'y', distance: 0.45, phase: 0.9 },
        position: 0,
        duration: PATTERN_DURATION,
      });
    }

    { // BLOK 4
      const blockX = toVP3d(665);
      const blockW = to3d(44);
      const blockZ = 0.2;
      const connLength = 1.3;
      const poleLength = 4.2;
      createPole(projectSettings, {
        ground,
        block: {
          x: blockX,
          y: toVP3d(500, false),
          z: blockZ,
          w: blockW,
          h: to3d(50),
          d: 0.5,
        },
        blockTexture: 'assets/projects/weesperflat/texture-brown.jpg',
        connector: { radius: CONNECTOR_RADIUS, height: connLength },
        pivotBlockToConnector: { x: 0, y: 0, z: 0.15 },
        pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
        pole: { radius: POLE_RADIUS, height: poleLength },
        pivotPoleToConnector: { x: 0, y: 0.8, z: 0 },
        pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
        hingePoleToGroundAxis: { x: 1, y: 0, z: 0 },
        pivotPoleToGround: { x: 0, y: poleLength / -2, z: 0 },
        pivotGroundToPole: { x: blockX, y: 0, z: blockZ + connLength + 0.15 },
        tween: { axis: 'z', distance: 0.3, phase: 0.6 },
        position: 0,
        duration: PATTERN_DURATION,
      });
    }

    { // BLOK 5
      const blockX = toVP3d(565);
      const blockW = to3d(44);
      const blockZ = 0.2;
      const connLength = 1.3;
      const poleLength = 4.2;
      createPole(projectSettings, {
        ground,
        block: {
          x: blockX,
          y: toVP3d(500, false),
          z: blockZ,
          w: blockW,
          h: to3d(50),
          d: 0.3,
        },
        blockTexture: 'assets/projects/weesperflat/texture-brown.jpg',
        connector: { radius: CONNECTOR_RADIUS, height: connLength },
        pivotBlockToConnector: { x: 0, y: 0, z: 0.15 },
        pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
        pole: { radius: POLE_RADIUS, height: poleLength },
        pivotPoleToConnector: { x: 0, y: 0.8, z: 0 },
        pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
        hingePoleToGroundAxis: { x: 1, y: 0, z: 0 },
        pivotPoleToGround: { x: 0, y: poleLength / -2, z: 0 },
        pivotGroundToPole: { x: blockX, y: 0, z: blockZ + connLength + 0.15 },
        tween: { axis: 'z', distance: 0.3, phase: 0.2 },
        position: 0,
        duration: PATTERN_DURATION,
      });
    }

    // { // BLOK 6
    //   const blockX = toVP3d(890);
    //   const blockW = to3d(44);
    //   const blockZ = 0.1;
    //   const connLength = 1.3;
    //   const poleLength = 2.7;
    //   createPole(projectSettings, {
    //     ground,
    //     block: {
    //       x: blockX,
    //       y: toVP3d(610, false),
    //       z: blockZ,
    //       w: blockW,
    //       h: to3d(50),
    //       d: 0.3,
    //     },
    //     connector: { radius: CONNECTOR_RADIUS, height: connLength },
    //     pivotBlockToConnector: { x: 0, y: 0, z: 0.15 },
    //     pivotConnectorToBlock: { x: 0, y: connLength / 2, z: 0 },
    //     pole: { radius: POLE_RADIUS, height: poleLength },
    //     pivotPoleToConnector: { x: 0, y: 0.7, z: 0 },
    //     pivotConnectorToPole: { x: 0, y: connLength / -2, z: 0 },
    //     hingePoleToGroundAxis: { x: 0, y: 0, z: 1 },
    //     pivotPoleToGround: { x: 0, y: poleLength / -2, z: 0 },
    //     pivotGroundToPole: { x: blockX, y: 0, z: blockZ + connLength + 0.15 },
    //     tween: { axis: 'x', distance: 0.1, phase: 0.8 },
    //     position: 0,
    //     duration: PATTERN_DURATION,
    //   });
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
