/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { GridHelper } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';

export async function createBridge(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  gltf: GLTF,
) {
  const { scene3d } = projectSettings;
  const brugdek = gltf.scene.getObjectByName('brugdek');
  brugdek?.position.set(0, -3, 0);
  scene3d.add.existing(brugdek);
}
