import { ExtendedObject3D, THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

export default class Hanger {
  static DEPTH = 0.05;

  static ROPE_RADIUS = 0.05;

  boundingBox = new THREE.Vector3();

  hanger: ExtendedObject3D;

  position: THREE.Vector3;

  projectSettings: ProjectSettings;

  scale: number;

  constructor({
    projectSettings,
    position,
  }: {
    projectSettings: ProjectSettings;
    position: THREE.Vector3; // indicates object's left top
  }) {
    this.position = position;
    this.projectSettings = projectSettings;
    const { width, width3d } = projectSettings;
    this.scale = width3d / width;
  }

  async createSVGExtrudeHanger({
    img,
    mediaData,
    svgScale,
    svgUrl,
  }: {
    img: { x: number, y: number, w: number, h: number },
    mediaData: ImageData | VideoData,
    svgScale: number,
    svgUrl: string,
  }): Promise<void> {
    const { patternDuration, scene3d } = this.projectSettings;

    this.boundingBox = new THREE.Vector3(
      img.w * this.scale * svgScale, img.h * this.scale * svgScale, Hanger.DEPTH,
    );
    const actor = await createActor(this.projectSettings, mediaData as VideoData, {
      imageRect: { w: img.w, h: img.h },
      svg: { scale: this.scale * svgScale, url: svgUrl },
      depth: Hanger.DEPTH,
    });
    actor.setStaticPosition(getMatrix4({
      x: this.boundingBox.x / -2,
      y: this.boundingBox.y / 2,
      z: this.boundingBox.z / -2,
    }));
    actor.addTween({
      delay: 0.1,
      duration: patternDuration,
      videoStart: 50,
      fromImagePosition: new THREE.Vector2(img.x, img.y),
      toImagePosition: new THREE.Vector2(img.x, img.y),
    });

    // HANGER
    this.hanger = new ExtendedObject3D();
    this.hanger.add(actor.getMesh());
    this.hanger.position.set(
      this.position.x + (this.boundingBox.x / 2),
      this.position.y - (this.boundingBox.y / 2),
      this.position.z,
    );
    scene3d.add.existing(this.hanger);
    scene3d.physics.add.existing(this.hanger, {
      mass: 1,
      shape: 'mesh',
    });
  }

  addRopesToFix({
    ropes,
    fix,
  }: {
    ropes: { pivot: THREE.Vector3, length: number }[];
    fix: ExtendedObject3D;
  }): void {
    const { scene3d } = this.projectSettings;

    ropes.forEach((ropeConfig) => {
      // ROPE
      const rope = scene3d.physics.add.cylinder({
        height: ropeConfig.length,
        radiusBottom: Hanger.ROPE_RADIUS,
        radiusTop: Hanger.ROPE_RADIUS,
        x: this.position.x + ropeConfig.pivot.x,
        y: this.position.y + ropeConfig.pivot.y + (ropeConfig.length / 2),
        z: this.position.z,
      }, {
        phong: {
          color: 0x222222,
        },
      });

      // ROPE TO FIX
      scene3d.physics.add.constraints.pointToPoint(rope.body, fix.body, {
        // the offset from the center of each object
        pivotA: { x: 0, y: ropeConfig.length / 2, z: 0 },
        pivotB: {
          x: this.position.x + ropeConfig.pivot.x,
          y: this.position.y + ropeConfig.length,
          z: this.position.z,
        },
      });

      // ROPE TO HANGER
      scene3d.physics.add.constraints.pointToPoint(rope.body, this.hanger.body, {
        // the offset from the center of each object
        pivotA: { x: 0, y: ropeConfig.length / -2, z: 0 },
        pivotB: {
          x: (this.boundingBox.x / -2) + ropeConfig.pivot.x,
          y: (this.boundingBox.y / 2),
          z: 0,
        },
      });
    });
  }
}
