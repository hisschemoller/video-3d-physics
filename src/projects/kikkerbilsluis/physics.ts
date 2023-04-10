/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { GridHelper } from 'three';
import { ProjectSettings } from '@app/interfaces';
import createTween from '@app/tween';

// async function createSvgWheel(
//   projectSettings: ProjectSettings,
//   media: { [key: string]: VideoData | ImageData | undefined },
//   fix: ExtendedObject3D,
//   pxTo3d: number,
// ) {
//   const { scene3d } = projectSettings;

//   const svgMesh = await createSVG(
//     '../assets/projects/kikkerbilsluis/wheel2.svg',
//     pxTo3d,
//     undefined,
//     1,
//   );
//   const geometry = svgMesh.geometry.clone();
//   const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.castShadow = true;
//   mesh.receiveShadow = true;

//   const wheel = new ExtendedObject3D();
//   wheel.add(mesh);
//   wheel.position.set(-4, 4, 0);
//   scene3d.add.existing(wheel);
//   scene3d.physics.add.existing(wheel, {
//     mass: 1,
//     shape: 'mesh',
//   });
// }

export function createWheel(
  radius = 2,
  holeRadius = 1.5,
  depth = 1,
  curveSegments = 8,
  color = 0x000000,
  opacity = 1,
) {
  const extrudeSettings = {
    depth,
    steps: 1,
    bevelEnabled: false,
    curveSegments,
  };

  const materialParams = {
    color, opacity: 1, transparent: false,
  };
  if (opacity < 1) {
    materialParams.transparent = true;
    materialParams.opacity = opacity;
  }

  const arcShape = new THREE.Shape();
  arcShape.absarc(0, 0, radius, 0, Math.PI * 2, false);

  const holePath = new THREE.Path();
  holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  arcShape.holes.push(holePath);

  const geometry = new THREE.ExtrudeBufferGeometry(arcShape, extrudeSettings);
  // const material = new THREE.MeshBasicMaterial({ color, opacity: 0, transparent: true });
  // const mesh = new THREE.Mesh(geometry, material);
  // mesh.renderOrder = 1;
  // mesh.castShadow = true;
  // mesh.receiveShadow = true;
  geometry.translate(0, 0, -1); // somehow this has an offset as well :/

  const wireframeGeometry = new THREE.WireframeGeometry(geometry);
  const wireframeMaterial = new THREE.MeshPhongMaterial(materialParams);
  const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
  wireframe.renderOrder = 1;

  const wheel = new ExtendedObject3D();
  // wheel.add(mesh);
  wheel.add(wireframe);
  return wheel;
}

function createEnable3dExampleWheel(
  projectSettings: ProjectSettings,
) {
  const { patternDuration, scene3d, timeline } = projectSettings;
  const wheel = createWheel();
  wheel.position.y = 0;
  scene3d.scene.add(wheel);
  scene3d.physics.add.existing(wheel, { shape: 'mesh', collisionFlags: 2 }); // 'hacd'

  const tween = createTween({
    delay: 0,
    duration: patternDuration,
    onStart: () => {},
    onUpdate: (progress: number) => {
      wheel.position.x = -4 + (progress * 12);
      wheel.rotation.z = progress * Math.PI * -2;
      wheel.body.needUpdate = true;
    },
  });
  timeline.add(tween);
}

/**
 * Setupx
 */
// eslint-disable-next-line import/prefer-default-export
export async function setupPhysics(
  projectSettings: ProjectSettings,
) {
  const { scene3d } = projectSettings;

  if (scene3d.physics.debug) {
    // scene3d.physics.debug.enable();
  }

  // scene3d.physics.setGravity(0, 0, 0);

  // const fix = scene3d.physics.add.box({
  //   width: 0.1, height: 0.1, depth: 0.1, mass: 0, collisionFlags: 4, // 4 = GHOST
  // });

  // await createSvgWheel(projectSettings, media, fix, pxTo3d);
  createEnable3dExampleWheel(projectSettings);

  const grid = new GridHelper(30, 10, 0x333333, 0x333333);
  grid.position.set(0, -4, 0);
  scene3d.scene.add(grid);
}
