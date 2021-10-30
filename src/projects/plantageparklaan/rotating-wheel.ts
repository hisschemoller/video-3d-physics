import { THREE } from 'enable3d';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { VIEWPORT_3D_HEIGHT, VIEWPORT_3D_WIDTH, PROJECT_HEIGHT, PROJECT_WIDTH } from './scene';
import { BASE_COLOR } from './actor-mesh';

interface RotatingWheelArgs {
  scene: THREE.Scene;
  timeline: Timeline;
  xPx: number,
  yPx: number,
  z: number,
  duration: number,
};

export function createRotatingWheel({scene, timeline, xPx, yPx, z, duration}: RotatingWheelArgs) {

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (VIEWPORT_3D_WIDTH / PROJECT_WIDTH);
  const y3d = yPx * (VIEWPORT_3D_HEIGHT / PROJECT_HEIGHT);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (VIEWPORT_3D_WIDTH / 2);
  const yVP = (y3d - (VIEWPORT_3D_HEIGHT / 2)) * -1;

  const group = new THREE.Group();
  group.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));
  scene.add(group);

  for (let i = 0, n = 12; i < n; i++) {
    const mesh = createSegment();
    const rad = Math.PI * (i / n);
    mesh.translateX(Math.sin(rad) * -1.55);
    mesh.translateY(Math.cos(rad) * -1.55);
    mesh.rotation.z = (Math.PI * 0.5) - rad;
    group.add(mesh);
  }

  const tween = createTween({
    duration,
    onUpdate: (progress: number) => {
      const angle = progress * -0.265;
      group.rotation.z = angle;
    },
  });
  timeline.add(tween);
}

function createSegment(): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial[]> {
  const geometry = new THREE.BoxGeometry(3.1, 0.15, 0.02);
    geometry.groups.forEach((group, index) => {
      group.materialIndex = index === 4 ? 1 : 0;
    });
    const materials = [
      new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.FrontSide, }),
      // new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide, }),
      new THREE.MeshPhongMaterial({ color: 0xaa9977, side: THREE.FrontSide, }),
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}
