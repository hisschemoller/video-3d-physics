/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';
import addMainWheel, { addBead, addLine, addTweenOnLine, addWheel } from './wheel';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 117;
const MEASURES = 7;
const STEPS = 16 * MEASURES;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

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
    this.clearColor = 0x9ed3ff;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, -2.9 * 4, 0);
    this.pCamera.position.set(0, 0, 10.5 * 4);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    const lightZ = 30;
    this.directionalLight.position.set(10, 15, 10 + lightZ);
    // this.directionalLight.position.z += lightZ;
    this.directionalLight.intensity = 0.99;

    // const lightTarget = new THREE.Vector3(10, 0, 30);
    this.scene.add(this.directionalLight.target);
    // this.directionalLight.lookAt(new THREE.Vector3(0, 0, 20));
    this.directionalLight.target.position.set(0, 0, lightZ);
    // this.directionalLight.shadow.camera.position.set(0, 30, 0);
    console.log(this.directionalLight.shadow.camera);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.35;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // BLENDER GLTF
    const gltf = await this.load.gltf('../assets/projects/hazumiryokuchi/hazumiryokuchi.glb');

    // VIDEOS
    const videos = {
      main: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/hazumiryokuchi/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hazumiryokuchi/frames/&img=frame_#FRAME#.png',
      },
    };

    // PROJECT SETTINGS
    const projectSettings: ProjectSettings = {
      height: this.height,
      height3d: this.height3d,
      isPreview,
      previewScale: PROJECT_PREVIEW_SCALE,
      scene: this.scene,
      scene3d: this,
      timeline: this.timeline,
      width: this.width,
      width3d: this.width3d,
    };

    // GROUP
    const group = createTweenGroup(projectSettings);
    group.setStaticPosition(getMatrix4({
      x: -32,
      y: 7.1,
      rx: -0.11,
      sx: 4,
      sy: 4,
    }));
    const axesHelper = new THREE.AxesHelper(25);
    group.getMesh().add(axesHelper);

    await this.createActors(projectSettings, videos, group.getMesh());
    await this.createWheels(gltf);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createActors
   */
  async createActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    { // BACKGROUND
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.01 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.999,
        videoStart: 5.633333333333334,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND 2
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(436), h: to3d(164), d: 0.01 },
        imageRect: { w: 436, h: 164 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(730), y: to3d(-350), z: 0.01 }));
      actor.addTween({
        delay: STEP_DURATION * 16 * 4,
        duration: PATTERN_DURATION * 0.999,
        videoExtraTime: 1.6,
        videoStart: 4,
        fromImagePosition: new THREE.Vector2(730, 350),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }

  /**
   * createPhysics
   */
  async createWheels(gltf: GLTF) {
    const S = STEP_DURATION;
    const T = this.timeline;

    {
      const mainWheel = await addMainWheel(this, this.timeline, PATTERN_DURATION, 30);

      {
        const line = await addLine({
          parent: mainWheel,
          cylinderHeight: 4.5,
          distanceFromCenter: 3.3,
          rotation: Math.PI * 0,
        });

        const bead1 = await addBead({
          parent: line,
          bead: gltf.scene.getObjectByName('bead1') as THREE.Mesh,
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-green.jpg',
        });
        bead1.position.y = -1.1;
        addTweenOnLine(bead1, T, S, 8, 6, 1.1, 4.5);
        addTweenOnLine(bead1, T, S, 60, 12, 4.5, 1.1);

        const wheel1 = await addWheel({
          parent: line,
          radius: 1,
          timeline: T,
          patternDuration: PATTERN_DURATION,
          speed: 10,
        });
        wheel1.position.y = -0.2;
        addTweenOnLine(wheel1, T, S, 12, 10, 0.2, 3.8);
        addTweenOnLine(wheel1, T, S, 60, 12, 3.8, 0.2);
      }

      {
        const line = await addLine({
          parent: mainWheel,
          cylinderHeight: 4.5,
          distanceFromCenter: 3.3,
          rotation: Math.PI * 1,
        });

        const bead1 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('bead2') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-brown.jpg',
        });
        bead1.position.y = -1.1;
        // addTweenOnLine(bead1, T, S, 8, 6, 1.1, 3.5);
        // addTweenOnLine(bead1, T, S, 60, 12, 3.5, 1.1);

        const bead2 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('bead3') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-green.jpg',
        });
        bead2.position.y = -1.7;
        // addTweenOnLine(bead2, T, S, 8, 6, 1.7, 4.5);
        // addTweenOnLine(bead2, T, S, 60, 12, 4.5, 1.7);

        const bead3 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('bead4') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-grey.jpg',
        });
        bead3.position.y = -2.2;

        const bead4 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('bead5') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-blue.jpg',
        });
        bead4.position.y = -2.7;

        const bead5 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('bead2') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-gold.jpg',
        });
        bead5.position.y = -3.3;
      }

      {
        const line = await addLine({
          parent: mainWheel,
          cylinderHeight: 4.5,
          distanceFromCenter: 3.3,
          rotation: Math.PI * 0.5,
        });

        const bead1 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('cylinder1') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-brown.jpg',
        });
        bead1.position.y = -1.1;

        const bead2 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('cylinder2') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-green.jpg',
        });
        bead2.position.y = -1.5;

        const bead3 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('cylinder3') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-grey.jpg',
        });
        bead3.position.y = -1.85;

        const bead4 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('cylinder4') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-blue.jpg',
        });
        bead4.position.y = -2.25;

        const bead5 = await addBead({
          parent: line,
          bead: (gltf.scene.getObjectByName('cylinder5') as THREE.Mesh).clone(true),
          beadImagePath: '../assets/projects/hazumiryokuchi/texture-gold.jpg',
        });
        bead5.position.y = -2.65;
      }

      // const wheel1 = await addWheel({
      //   parent: line,
      // });

      // const bead1 = await addBead({
      //   parent: line,
      // });

      // const wheel1 = await addCylinderWheel({
      //   parent: mainWheel,
      //   timeline: this.timeline,
      //   patternDuration: PATTERN_DURATION,
      //   cylinderHeight: 4.0,
      //   distanceFromCenter: 3.3,
      //   rotation: Math.PI * 0,
      //   wheelRadius: 1,
      //   y: 0,
      // });
      // const wheel2 = await addCylinderWheel({
      //   parent: mainWheel,
      //   timeline: this.timeline,
      //   patternDuration: PATTERN_DURATION,
      //   cylinderHeight: 4.0,
      //   distanceFromCenter: 3,
      //   rotation: Math.PI * 1,
      //   wheelRadius: 1.2,
      //   y: 0,
      // });
    }

    {
      const mainWheel = await addMainWheel(this, this.timeline, PATTERN_DURATION, 19);

      // const wheel1 = await addCylinderWheel({
      //   parent: mainWheel,
      //   timeline: this.timeline,
      //   patternDuration: PATTERN_DURATION,
      //   cylinderHeight: 4.1 ,
      //   distanceFromCenter: 3.4,
      //   rotation: Math.PI * 0.5,
      //   wheelRadius: 1.3,
      //   y: 0,
      // });
      // const wheel2 = await addCylinderWheel({
      //   parent: mainWheel,
      //   timeline: this.timeline,
      //   patternDuration: PATTERN_DURATION,
      //   cylinderHeight: 4,
      //   distanceFromCenter: 3,
      //   rotation: Math.PI * -0.5,
      //   wheelRadius: 1,
      //   y: 0,
      // });
      // addNewspaper({
      //   scene3d: this,
      //   timeline: this.timeline,
      //   wheel: mainWheel,
      //   cylinderHeight: 3,
      //   distanceFromCenter: 3.5,
      //   rotation: Math.PI * -0.5,
      //   patternDuration: PATTERN_DURATION,
      // });
    }

    // addNewspaper({
    //   scene3d: this,
    //   timeline: this.timeline,
    //   wheel: wheel2,
    //   distanceFromCenter: 3.5,
    //   rotation: Math.PI * 0.5,
    //   patternDuration: PATTERN_DURATION,
    //   paperObject: gltf.scene.getObjectByName('paper1') as THREE.Mesh,
    //   paperImagePath: '../assets/projects/hazumiryokuchi/krant1.jpg',
    // });
  }
}
