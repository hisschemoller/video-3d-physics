import { THREE } from 'enable3d';
import { renderBackground, setupBackground } from '@app/background';
import MainScene from '@app/mainscene';
import { getMatrix, MatrixConfig } from '@app/utils';

export default class Scene extends MainScene {
  constructor() {
    super();
  }

  async create() {
    const { orbitControls } = await this.warpSpeed('orbitControls');

    const cameraTarget = new THREE.Vector3(0, 2.75, 0);

    // RENDERER
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap
    this.renderer.setClearColor(0xbbddff);

    // CAMERA
    this.camera.aspect = this.width / this.height;
    this.camera.fov = 25;
    this.camera.position.set(0, 1.8, 10);
    this.camera.lookAt(cameraTarget);
    this.camera.updateProjectionMatrix();

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
    
    // GRID
    // const grid = new THREE.GridHelper(30, 10, 0xff0000, 0xffff00);
    // grid.position.set(0, 0, -19);
    // this.scene.add(grid);

    // const grid2 = new THREE.GridHelper(2, 2, 0x00ffff, 0x00ffff);
    // grid2.geometry.applyMatrix4( getMatrix({
    //   y: 1,
    //   z: -19,
    //   rx: Math.PI * 0.5,
    // }));
    // this.scene.add(grid2);
    
    // AXES
    const axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);
  
    // ORBIT CONTROLS
    orbitControls.target = cameraTarget;
    orbitControls.update();

    setupBackground('../assets/projects/brugphkade/brugphkade1.mp4');

    // gltf loader
    const gltf = await this.load.gltf('../assets/projects/brugphkade/brugphkade.glb');

    // const cube = gltf.scene.getObjectByName('Cube');
    // console.log(cube);
    // this.scene.add(cube);

    // const plane = gltf.scene.getObjectByName('Plane');
    // plane.geometry.applyMatrix4( getMatrix({
    //   z: -34,
    //   sx: 30/2, sy: 30/2, sz: 30/2,
    //   ry: Math.PI * -0.5,
    // }));
    // this.scene.add(plane);

    const ground = gltf.scene.getObjectByName('ground');
    ground.receiveShadow = true;
    ground.position.set(0, 0, 0);
    ground.geometry.applyMatrix4( getMatrix({
      x: -0.5, y: 0, z: -35,
      sx: 30/3.1, sy: 30/4.3, sz: 30/4.7,
      ry: Math.PI,
    }));
    const texture = new THREE.TextureLoader().load('../assets/projects/brugphkade/ground-flipx.png');
    ground.material.map = texture;
    console.log('ground', ground);
    this.scene.add(ground);

    super.create();
  }

  preRender() {
    renderBackground(this.renderer);
  }
};
