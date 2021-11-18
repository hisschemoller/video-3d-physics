import { THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix4 } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { BASE_COLOR } from './actor-mesh';

interface RotatingWheelArgs {
  scene: THREE.Scene;
  timeline: Timeline;
  xPx: number,
  yPx: number,
  z: number,
  duration: number,
  vp3dWidth: number;
  vp3dHeight: number;
  projectPxWidth: number;
  projectPxHeight: number;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function createBoxSegment(): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial[]> {
  const geometry = new THREE.BoxGeometry(3.1, 0.15, 0.02);
  geometry.groups.forEach((group, index) => {
    /* eslint-disable no-param-reassign */
    group.materialIndex = index === 4 ? 1 : 0;
  });
  const materials = [
    new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.FrontSide }),
    // new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide, }),
    new THREE.MeshPhongMaterial({ color: 0xaa9977, side: THREE.FrontSide }),
  ];
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createSvgSegment(svgUrl: string, svgWidth: number, svgHeight: number, svgScale: number) {
  return new Promise<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhongMaterial[]>>(
    (resolve, reject) => {
      new SVGLoader().load(
        svgUrl,
        (data) => {
          const { paths } = data;

          paths.forEach((path) => {
            const materials = [
              new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.BackSide }),
              new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.BackSide }),
            ];
            const shapes = SVGLoader.createShapes(path);
            if (shapes.length > 0) {
              const shape = shapes[0];
              const geometry = new THREE.ExtrudeGeometry(shape, {
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.2,
                depth: 0.02,
              });
              geometry.groups.forEach((group, index) => {
                group.materialIndex = index === 0 ? 1 : 0;
              });
              geometry.applyMatrix4(getMatrix4({
                x: 0,
                y: svgHeight * svgScale * -0.5,
                sx: svgScale * -1,
                sy: svgScale * 1,
              }));
              geometry.computeVertexNormals();
              const mesh = new THREE.Mesh(geometry, materials);
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              resolve(mesh);
            }
          });
        },
        () => {},
        () => {
          reject();
        },
      );
    },
  );
}

export default async function createRotatingWheel({
  scene, timeline, xPx, yPx, z, duration,
  vp3dWidth,
  vp3dHeight,
  projectPxWidth,
  projectPxHeight,
}: RotatingWheelArgs) {
  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (vp3dWidth / projectPxWidth);
  const y3d = yPx * (vp3dHeight / projectPxHeight);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (vp3dWidth / 2);
  const yVP = (y3d - (vp3dHeight / 2)) * -1;

  const group = new THREE.Group();
  group.applyMatrix4(getMatrix4({ x: xVP, y: yVP, z }));
  scene.add(group);

  for (let i = 0, n = 12; i < n; i += 1) {
    const rad = Math.PI * (i / n);
    // const mesh = createBoxSegment();
    // mesh.translateX(Math.sin(rad) * -1.55);
    // mesh.translateY(Math.cos(rad) * -1.55);

    /* eslint-disable no-await-in-loop */
    const mesh = await createSvgSegment(
      '../assets/projects/plantageparklaan/blad3.svg', 30, 5, 0.1,
    );
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
