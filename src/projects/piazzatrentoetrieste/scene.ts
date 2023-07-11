/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { getMatrix4 } from '@app/utils';
import { createTweenGroup } from './actor';
import { createGround, createSky, createStreetlights } from './background';
import createWalls from './walls';
import createDrawings from './drawings';
import { createGreenscreen } from './greenscreen';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 100;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 12;
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
    this.clearColor = 0xa4c2d9; // 0xa4d9b0; // 0x76BEA3; // 0x539c81;
    this.shadowSize = 8;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 2, 0);
    this.pCamera.position.set(0, 0, 11.5);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    this.directionalLight.intensity = 0.2; // 1.15;
    this.directionalLight.position.set(20, 10 - 2, 10 - 18);
    this.directionalLight.target.position.set(0, 0 - 2, 0 - 18);
    this.scene.add(this.directionalLight.target);

    // // AMBIENT LIGHT
    this.ambientLight.intensity = 0.9; // 0.7;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // MEDIA
    const sq1024 = { height: 1024, width: 1024 };
    const media = {
      frame500: {
        imgSrc: '../assets/projects/piazzatrentoetrieste/piazzatrentoetrieste-perspective_frame_500.png',
        height: 1080,
        width: 1920,
      },
      schuttingRechts: {
        imgSrc: '../assets/projects/piazzatrentoetrieste/schutting-rechts.jpg',
        height: 183,
        width: 327,
      },
      achterKathedraal1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/achter-kathedraal-1024.jpg',
      },
      huisRechtsAchter1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/huis-rechts-achter-1024.jpg',
      },
      links1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/links-groot-1024.jpg',
      },
      kathedraalZijkant1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/katedraal-zijkant-1024.jpg',
      },
      kerkRechts1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/kerk-rechts-1024.jpg',
      },
      rechts1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/rechts-1024.jpg',
      },
      rechtsAchter1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/rechts-achter-1024-2.jpg',
      },
      sky1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/sky-1024.jpg',
      },
      straatTile1024: {
        ...sq1024, imgSrc: '../assets/projects/piazzatrentoetrieste/straat-tile-1024.jpg',
      },
      straatTile2048: {
        height: 2048, width: 2048, imgSrc: '../assets/projects/piazzatrentoetrieste/straat-tile-2048.jpg',
      },
      straatLinks2048: {
        height: 2048, width: 2048, imgSrc: '../assets/projects/piazzatrentoetrieste/straat-links-2048-7.jpg',
      },
      straatRechts2048: {
        height: 2048, width: 2048, imgSrc: '../assets/projects/piazzatrentoetrieste/straat-rechts-2048-4.jpg',
      },
      lantarenpaal: {
        height: 999, width: 258, imgSrc: '../assets/projects/piazzatrentoetrieste/lantarenpaal.png',
      },
      test: {
        ...sq1024, imgSrc: '../assets/projects/test/testimage3d.jpg',
      },
      video: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/piazzatrentoetrieste/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/piazzatrentoetrieste/frames/&img=frame_#FRAME#.png',
      },
      video_greenscreen: {
        fps: 30,
        height: 240,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/piazzatrentoetrieste/frames_preview_greenscreen/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/piazzatrentoetrieste_greenscreen/frames/&img=frame_#FRAME#.png',
      },
    };

    // PROJECT SETTINGS
    const projectSettings: ProjectSettings = {
      height: this.height,
      height3d: this.height3d,
      isPreview,
      measures: MEASURES,
      patternDuration: PATTERN_DURATION,
      previewScale: PROJECT_PREVIEW_SCALE,
      scene: this.scene,
      scene3d: this,
      stepDuration: STEP_DURATION,
      timeline: this.timeline,
      width: this.width,
      width3d: this.width3d,
    };

    // GROUP
    const scale = 1.315;
    const group = createTweenGroup(projectSettings);
    group.setStaticPosition(getMatrix4({ x: -10.51, y: 7.99, rx: 0.147, sx: scale, sy: scale }));
    // const axesHelper = new THREE.AxesHelper(25);
    // group.getGroup().add(axesHelper);

    // createBackground(projectSettings, media, group.getGroup());
    createGround(projectSettings, media);
    createSky(projectSettings, media);
    createStreetlights(projectSettings, media, group.getGroup());
    createWalls(projectSettings, media, group.getGroup());
    createDrawings(projectSettings, media, group.getGroup());
    createGreenscreen(projectSettings, media, group.getGroup());
    this.animateCamera();

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  animateCamera() {
    const group = new THREE.Group();
    group.add(this.pCamera);
    this.scene.add(group);

    const tween = createTween({
      delay: 0.2,
      duration: PATTERN_DURATION,
      onStart: () => {},
      onUpdate: (progress) => {
        group.rotation.y = Math.sin(progress * Math.PI * 2) * 0.6;
        group.position.z = -4 + (Math.cos(progress * Math.PI * 4) * 4);
      },
      onComplete: () => {},
    });
    this.timeline.add(tween);
  }
}
