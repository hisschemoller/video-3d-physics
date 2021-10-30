import { THREE } from 'enable3d';
import MainScene, { FPS }  from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { Actor, createActor } from './actor';

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
  pCamera: THREE.PerspectiveCamera;
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

    const { orbitControls } = await this.warpSpeed('orbitControls');

    const cameraTarget = new THREE.Vector3(0, 0, 0);

    // RENDERER
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap
    this.renderer.setClearColor(0xbbddff);

    // CAMERA
    this.pCamera = this.camera as THREE.PerspectiveCamera;
    this.pCamera.aspect = this.width / this.height;
    this.pCamera.position.set(0, 0, 9.6);
    this.pCamera.lookAt(cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // AMBIENT
    const ambient = new THREE.AmbientLight(0xffffff, 0.35); // color = 0xffffff, intensity = 1
    this.scene.add(ambient);

    // DIRECTIONAL LIGHT
    const SHADOW_MAP_SIZE = 2048;
    const SHADOW_SIZE = 4;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    directionalLight.position.set(20, 5, 10);
    directionalLight.position.multiplyScalar(100);
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE;
    directionalLight.shadow.camera.left = -SHADOW_SIZE;
    directionalLight.shadow.camera.right = SHADOW_SIZE;
    directionalLight.shadow.camera.top = SHADOW_SIZE;
    directionalLight.shadow.camera.bottom = -SHADOW_SIZE;
    directionalLight.shadow.camera.far = SHADOW_FAR;
    this.scene.add(directionalLight);
  
    // ORBIT CONTROLS
    if (orbitControls) {
      orbitControls.target = cameraTarget;
      orbitControls.update();
    }

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
    actors.push(await createActor(this.scene, this.timeline, videoData, { // deur
      xPx: 5.329 * (PROJECT_WIDTH / VIEWPORT_3D_WIDTH), yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, z: 0.3,
      vStart: 25.5, duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/plantageparklaan/deur.svg', svgScale: 0.1,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // TERRAS
      xPx: 0, yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, z: 0.6,
      vStart: 25, duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/plantageparklaan/terras.svg', svgScale: 0.1,
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
