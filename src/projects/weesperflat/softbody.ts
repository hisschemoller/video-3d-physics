import { THREE } from 'enable3d';
// import * as EXP from 'three/examples/jsm/utils/BufferGeometryUtils';
// import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import BufferGeometryUtils from './BufferGeometryUtils';

interface AmmoBufferGeometry extends THREE.BufferGeometry {
  idxVertices: ArrayLike<number>,
  ammoIndices: ArrayLike<number>,
  ammoIndexAssociation: number[][],
  ammoVertices: ArrayLike<number>,
}

const MARGIN = 0.05;
const softBodies: THREE.Mesh[] = [];
let softBodyHelpers: Ammo.btSoftBodyHelpers;

function isEqual(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
  const delta = 0.000001;
  return Math.abs(x2 - x1) < delta
      && Math.abs(y2 - y1) < delta
      && Math.abs(z2 - z1) < delta;
}

function mapIndices(bufGeometry: AmmoBufferGeometry, indexedBufferGeom: THREE.BufferGeometry) {
  // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry

  const vertices = bufGeometry.attributes.position.array;
  const idxVertices = indexedBufferGeom.attributes.position.array;
  if (!indexedBufferGeom.index) {
    return;
  }

  const indices = indexedBufferGeom.index.array;

  const numIdxVertices = idxVertices.length / 3;
  const numVertices = vertices.length / 3;

  // eslint-disable-next-line no-param-reassign
  bufGeometry.ammoVertices = idxVertices;
  // eslint-disable-next-line no-param-reassign
  bufGeometry.ammoIndices = indices;
  // eslint-disable-next-line no-param-reassign
  bufGeometry.ammoIndexAssociation = [];

  for (let i = 0; i < numIdxVertices; i += 1) {
    const association: number[] = [];
    bufGeometry.ammoIndexAssociation.push(association);

    const i3 = i * 3;

    for (let j = 0; j < numVertices; j += 1) {
      const j3 = j * 3;
      if (isEqual(idxVertices[i3], idxVertices[i3 + 1], idxVertices[i3 + 2],
        vertices[j3], vertices[j3 + 1], vertices[j3 + 2])) {
        association.push(j3);
      }
    }
  }
}

function processGeometry(bufGeometry: AmmoBufferGeometry) {
  // Ony consider the position values when merging the vertices
  const posOnlyBufGeometry = new THREE.BufferGeometry();
  posOnlyBufGeometry.setAttribute('position', bufGeometry.getAttribute('position'));
  posOnlyBufGeometry.setIndex(bufGeometry.getIndex());

  // Merge the vertices so the triangle soup is converted to indexed triangles
  console.log('BufferGeometryUtils', BufferGeometryUtils);
  const indexedBufferGeom = BufferGeometryUtils.mergeVertices(posOnlyBufGeometry);

  // Create index arrays mapping the indexed vertices to bufGeometry vertices
  mapIndices(bufGeometry, indexedBufferGeom);
}

export function createSoftVolume(
  bufferGeomery: THREE.BufferGeometry,
  mass: number,
  pressure: number,
  scene: THREE.Scene,
  physicsWorld: Ammo.btSoftRigidDynamicsWorld,
) {
  if (!softBodyHelpers) {
    // eslint-disable-next-line new-cap
    softBodyHelpers = new Ammo.btSoftBodyHelpers();
  }

  const bufferGeom = bufferGeomery as AmmoBufferGeometry;
  processGeometry(bufferGeom);

  const volume = new THREE.Mesh(bufferGeom, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
  volume.castShadow = true;
  volume.receiveShadow = true;
  volume.frustumCulled = false;
  scene.add(volume);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('textures/colors.png', (texture: THREE.Texture) => {
    volume.material.map = texture;
    volume.material.needsUpdate = true;
  });

  // Volume physic object

  const volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
    physicsWorld.getWorldInfo(),
    bufferGeom.ammoVertices as number[],
    bufferGeom.ammoIndices as number[],
    bufferGeom.ammoIndices.length / 3,
    true,
  );

  const sbConfig = volumeSoftBody.get_m_cfg();
  sbConfig.set_viterations(40);
  sbConfig.set_piterations(40);

  // Soft-soft and soft-rigid collisions
  sbConfig.set_collisions(0x11);

  // Friction
  sbConfig.set_kDF(0.1);
  // Damping
  sbConfig.set_kDP(0.01);
  // Pressure
  sbConfig.set_kPR(pressure);
  // Stiffness
  volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9);
  volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9);

  volumeSoftBody.setTotalMass(mass, false);
  // Ammo.castObject(volumeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(MARGIN);
  (volumeSoftBody as Ammo.btCollisionObject).getCollisionShape().setMargin(MARGIN);
  physicsWorld.addSoftBody(volumeSoftBody, 1, -1);
  volume.userData.physicsBody = volumeSoftBody;
  // Disable deactivation
  volumeSoftBody.setActivationState(4);

  softBodies.push(volume);
}

// function createObjects(scene: THREE.Scene, physicsWorld: Ammo.btSoftRigidDynamicsWorld) {
//   // create soft volumes

//   const volumeMass = 15;

//   const sphereGeometry = new THREE.SphereGeometry(1.5, 40, 25);
//   sphereGeometry.translate(5, 5, 0);
//   createSoftVolume(sphereGeometry, volumeMass, 250, scene, physicsWorld);

//   const boxGeometry = new THREE.BoxGeometry(1, 1, 5, 4, 4, 20);
//   boxGeometry.translate(-2, 5, 0);
//   createSoftVolume(boxGeometry, volumeMass, 120, scene, physicsWorld);
// }

export function updateSoftVolumes() {
  for (let i = 0, il = softBodies.length; i < il; i += 1) {
    const volume = softBodies[i];
    const { geometry: geom } = volume;
    const geometry = geom as AmmoBufferGeometry;
    const softBody = volume.userData.physicsBody;
    const volumePositions = geometry.attributes.position.array as number[];
    const volumeNormals = geometry.attributes.normal.array as number[];
    const association = geometry.ammoIndexAssociation;
    const numVerts = association.length;
    const nodes = softBody.get_m_nodes();
    for (let j = 0; j < numVerts; j += 1) {
      const node = nodes.at(j);
      const nodePos = node.get_m_x();
      const x = nodePos.x();
      const y = nodePos.y();
      const z = nodePos.z();
      const nodeNormal = node.get_m_n();
      const nx = nodeNormal.x();
      const ny = nodeNormal.y();
      const nz = nodeNormal.z();

      const assocVertex = association[j];

      for (let k = 0, kl = assocVertex.length; k < kl; k += 1) {
        let indexVertex = assocVertex[k];
        volumePositions[indexVertex] = x;
        volumeNormals[indexVertex] = nx;
        indexVertex += 1;
        volumePositions[indexVertex] = y;
        volumeNormals[indexVertex] = ny;
        indexVertex += 1;
        volumePositions[indexVertex] = z;
        volumeNormals[indexVertex] = nz;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
  }
}
