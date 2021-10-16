import { THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import MainScene, { FPS }  from '@app/mainscene';
import { getMatrix } from '@app/utils';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';

const VIDEO_WIDTH = 2560;
const VIDEO_HEIGHT = 1920;
const VIDEO_FPS = 30;
const VIDEO_PREVIEW_SCALE = 0.2;
const PLANE_WIDTH = 4;
const PLANE_HEIGHT = 3;
const BPM = 112;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: Actor[] = [];

interface Actor {
  loadImage: Function;
};

interface VideoData {
  scale: number;
  height: number;
  width: number;
  imgSrcPrefix: string;
  imgSrcSuffix: string;
};

export default class Scene extends MainScene {
  pCamera: THREE.PerspectiveCamera;
  timeline: Timeline;

  constructor() {
    super();
  }

  async create() {
    this.captureLastFrame = Math.floor(PATTERN_DURATION * FPS);
    this.width = VIDEO_WIDTH;
    this.height = VIDEO_HEIGHT;

    const isPreview = true && !this.isCapture;
    const video = {
      scale: isPreview ? VIDEO_PREVIEW_SCALE : 1,
      height: isPreview ? VIDEO_HEIGHT * VIDEO_PREVIEW_SCALE : VIDEO_HEIGHT,
      width: isPreview ? VIDEO_WIDTH * VIDEO_PREVIEW_SCALE : VIDEO_WIDTH,
      imgSrcPrefix: isPreview
        ? '../assets/projects/hortusbrug/frames_preview/frame_'
        : '/Volumes/Samsung_X5/frames_hortusbrug/frames/frame_',
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
    this.pCamera.position.set(0, 0, 3.21);
    this.pCamera.lookAt(cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // HEMI LIGHT
    const hemiLight = new THREE.HemisphereLight();
    hemiLight.color.setHSL(0.55, 0.1, 0.3);
    hemiLight.groundColor.setHSL(0.1, 0.1, 0.3);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // DIRECTIONAL LIGHT
    const SHADOW_SIZE = 10;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 17.5, 10);
    directionalLight.position.multiplyScalar(100);
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
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

    // AUDIO
    // const audio = document.createElement('audio');
    // audio.src = AUDIO_SRC;
    // audio.addEventListener('ended', () => {
    //   audio.currentTime = 0;
    //   audio.play();
    // }, false);
    // audio.load();
    // if (!this.isCapture) {
    //   // audio.play();
    // }

    // MESHES AND TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    actors.push(createActor(this.scene, this.timeline, video, { // ACHTERGROND
      xPx: 0, yPx: 0, wPx: VIDEO_WIDTH, hPx: VIDEO_HEIGHT, vStart: 1,
      duration: PATTERN_DURATION,
    }));

    new SVGLoader().load(
      '../assets/projects/hortusbrug/path3.svg',
      (data) => {
        const paths = data.paths;
		    const group = new THREE.Group();
        
        paths.forEach((path) => {
          const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
    
          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ShapeGeometry(shape);
            geometry.applyMatrix4(getMatrix({
              x: PLANE_WIDTH * -0.5,
              y: PLANE_HEIGHT * 0.5,
              sy: -1, 
            }));
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          });
        });
    
        this.scene.add( group );
      },
    );
    
    super.create();
  }

  update(time: number, delta: number) {
    this.timeline.update(time, delta);
    super.update(time, delta);
  }

  postRender() {
    actors.map((actor) => actor.loadImage());
    super.postRender();
  }
}

/**
 * Create an actor, an optionally animating 3d object.
 *
 * @param {THREE.scene} scene
 * @param {Timeline} timeline
 * @param {VideoData} video
 * @param {*} {
 *     xPx = 0,
 *     yPx = 0,
 *     wPx = 100,
 *     hPx = 100,
 *     xDist = 0,
 *     yDist = 0,
 *     vStart = 0,
 *     duration = 0,
 *     position = 0,
 *   }
 * @returns {Actor}
 */
function createActor(
  scene: THREE.Scene,
  timeline: Timeline,
  video: VideoData,
  {
    xPx = 0,
    yPx = 0,
    wPx = 100,
    hPx = 100,
    xDist = 0,
    yDist = 0,
    vStart = 0,
    duration = 0,
    position = 0,
  }): Actor {
  const x3d = xPx * (PLANE_WIDTH / VIDEO_WIDTH);
  const y3d = yPx * (PLANE_HEIGHT / VIDEO_HEIGHT);
  const w3d = (wPx / VIDEO_WIDTH) * PLANE_WIDTH;
  const h3d = (hPx / VIDEO_HEIGHT) * PLANE_HEIGHT;
  const xOffset = x3d / PLANE_WIDTH;
  const yOffset = 1 - ((y3d + h3d) / PLANE_HEIGHT);
  const wRepeat = w3d / PLANE_WIDTH;
  const hRepeat = h3d / PLANE_HEIGHT;
  const xVP = x3d + (w3d / 2) - (PLANE_WIDTH / 2);
  const yVP = (y3d + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
  const IMG_NR_FIRST = vStart * VIDEO_FPS;
  const IMG_NR_LAST = (vStart + duration) * VIDEO_FPS;
  
  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;
  
  const canvasEl = document.createElement('canvas');
  canvasEl.width = video.width;
  canvasEl.height = video.height;

  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, video.width, video.height);
  }

  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, video.width, video.height);
      texture.needsUpdate = true;
    }
  };
  const loadImage = (ignoreTweenActive = false) => {
    if (tweenActive || ignoreTweenActive) {
      imgNr = IMG_NR_FIRST + Math.round((IMG_NR_LAST - IMG_NR_FIRST) * tweenProgress);
      img.src = video.imgSrcPrefix
        + ((imgNr <= 99999) ? ('0000' + Math.round(imgNr)).slice(-5) : '99999')
        + video.imgSrcSuffix;
    }
  };
  loadImage(true);

  const texture = new THREE.CanvasTexture(canvasEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const geometry = new THREE.PlaneGeometry(w3d, h3d);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, }));
  scene.add(mesh);

  if (duration > 0) {
    const coords = {
      ...mesh.position.clone(),
      xOffset,
      yOffset,
    };
    const x3dEnd = (xPx + xDist) * (PLANE_WIDTH / VIDEO_WIDTH);
    const xVpEnd = x3dEnd + (w3d / 2) - (PLANE_WIDTH / 2);
    const y3dEnd = (yPx + yDist) * (PLANE_HEIGHT / VIDEO_HEIGHT);
    const yVpEnd = (y3dEnd + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
    const xOffsetEnd = x3dEnd / PLANE_WIDTH;
    const yOffsetEnd = 1 - ((y3dEnd + h3d) / PLANE_HEIGHT);
    const tween = createTween({
      delay: position,
      duration,
      onStart: () => {
        mesh.visible = true;
        tweenActive = true;
      },
      onUpdate: (progress: number) => {
        tweenProgress = progress;
        mesh.position.set(
          coords.x + ((xVpEnd - coords.x) * progress),
          coords.y + ((yVpEnd - coords.y) * progress),
          coords.z,
        );
        if (mesh.material.map) {
          mesh.material.map.offset = new THREE.Vector2(
            coords.xOffset + ((xOffsetEnd - coords.xOffset) * progress),
            coords.yOffset + ((yOffsetEnd - coords.yOffset) * progress),
          );
        }
        // if (mesh.body) {
        //   mesh.body.needUpdate = true;
        // }
      },
      onComplete: () => {
        imgNr = IMG_NR_FIRST;
        tweenProgress = 0;
        loadImage();
        mesh.visible = false;
        tweenActive = false;
      },
    });
    timeline.add(tween);
  }

  return { loadImage };
}
