import { THREE } from 'enable3d';
import { getMatrix4 } from '@app/utils';
import { createScenery, Scenery } from './scenery';
import { ProjectSettings, VideoData } from './interfaces';

export interface Walls {
  loadImage: Function;
}

export async function createWalls(
  projectSettings: ProjectSettings,
  videoData: VideoData,
  { duration, start }: { duration: number, start: number, },
): Promise<Scenery[]> {
  const {
    scene,
    height,
    width,
    height3d,
    width3d,
  } = projectSettings;

  const wallData: { width: number }[] = [
    { width: 120 },
    { width: 316 },
    { width: 235 },
    { width: 302 },
    { width: 151 },
    { width: 192 },
    { width: 168 },
    { width: 313 },
  ];

  const wallPromises: Promise<Scenery>[] = [];

  const promise: Promise<Scenery[]> = new Promise((resolve) => {
    let wallX = width;

    for (let i = 0, n = wallData.length; i < n; i += 1) {
      wallX -= wallData[i].width;

      const wallPromise = createScenery(projectSettings, videoData, {
        box: {
          x: wallX, y: 0, w: width, h: height, d: 0.01,
        },
        matrix4: getMatrix4({ x: 0, y: 0, z: 0 }),
        video: { start, duration },
        svg: {
          scale: (width3d / width) * 1.2,
          url: `../assets/projects/weteringschans/wall${i}.svg`,
          alignWithViewport: false,
        },
      });
      wallPromises.push(wallPromise);
    }

    Promise.all(wallPromises).then((walls) => {
      const angle = Math.PI * 0.4;

      const group = new THREE.Group();
      group.rotation.y = Math.PI + (angle * 0.37);
      group.position.set((width3d * 0.5) - 0.8, (height3d * 0.5) - 0.3, 1);
      scene.add(group);

      // group.add(new THREE.Mesh(
      //   new THREE.BoxGeometry(0.2, 0.2, 0.2),
      //   new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      // ));

      // add each wall to the previous wall
      let previousGroup: THREE.Group = group;
      let positionX = 0;
      for (let i = 0, n = walls.length; i < n; i += 1) {
        const mesh = walls[i].getMesh();
        mesh.position.x = (wallData[i].width / width) * width3d;
        mesh.rotation.y = Math.PI;

        const wallGroup = new THREE.Group();
        wallGroup.position.x = positionX;
        wallGroup.rotation.y = (i % 2 === 0 ? -angle : angle);
        wallGroup.add(mesh);
        positionX = (wallData[i].width / width) * width3d;

        // wallGroup.add(new THREE.Mesh(
        //   new THREE.BoxGeometry(0.2, 0.2, 0.2),
        //   new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        // ));

        previousGroup.add(wallGroup);
        previousGroup = wallGroup;
      }

      resolve(walls);
    });
  });

  return promise;
}
