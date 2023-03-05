/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';

export default class Hanger {
  static DEPTH = 0.05;

  static ROPE_RADIUS = 0.05;

  boundingBox = new THREE.Vector3();

  hanger: ExtendedObject3D;

  position: THREE.Vector3;

  projectSettings: ProjectSettings;

  scale: number = 1;

  constructor({
    projectSettings,
    position,
  }: {
    projectSettings: ProjectSettings;
    position: THREE.Vector3; // indicates object's left top
  }) {
    this.position = position;
    this.projectSettings = projectSettings;
  }

  async createActor({
    img,
    mediaData,
    svgUrl,
  }: {
    img: { x: number, y: number, w: number, h: number },
    mediaData: ImageData | VideoData,
    svgUrl: string,
  }) {
    const { patternDuration, width, width3d } = this.projectSettings;
    const pxTo3d = width3d / width;

    const actor = await createActor(this.projectSettings, mediaData as VideoData, {
      imageRect: { w: img.w, h: img.h },
      svg: { scale: pxTo3d * this.scale, url: svgUrl },
      depth: Hanger.DEPTH,
    });
    actor.setStaticPosition(getMatrix4({
      x: (img.w * pxTo3d * this.scale) / -2,
      y: (img.h * pxTo3d * this.scale) / 2,
      z: Hanger.DEPTH / -2,
    }));
    actor.addTween({
      delay: 0.1,
      duration: patternDuration,
      videoStart: 50,
      fromImagePosition: new THREE.Vector2(img.x, img.y),
      toImagePosition: new THREE.Vector2(img.x, img.y),
    });

    return actor;
  }

  createHanger({
    actor,
  }: {
    actor: Actor,
  }) {
    const { scene3d } = this.projectSettings;

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

  async createSVGExtrudeFloor({
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
    this.scale = svgScale;
    const { width, width3d } = this.projectSettings;
    const pxTo3d = width3d / width;

    const actor = await this.createActor({ img, mediaData, svgUrl });
    actor.getMesh().quaternion.setFromRotationMatrix(getMatrix4({ rx: Math.PI / 2 }));

    this.boundingBox = new THREE.Vector3(
      img.w * pxTo3d * this.scale,
      Hanger.DEPTH,
      img.h * pxTo3d * this.scale,
    );

    this.createHanger({ actor });
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
    this.scale = svgScale;
    const { width, width3d } = this.projectSettings;
    const pxTo3d = width3d / width;

    const actor = await this.createActor({ img, mediaData, svgUrl });

    this.boundingBox = new THREE.Vector3(
      img.w * pxTo3d * this.scale,
      img.h * pxTo3d * this.scale,
      Hanger.DEPTH,
    );

    this.createHanger({ actor });
  }

  /**
   * The hanger must be positioned below the other hanger.
   * A rope is at the bottom connected to this hanger.
   * At the top to the other hanger.
   */
  createRopeToOtherHanger({
    length,
    otherHanger,
    pivotOnOtherHanger,
  }: {
    length: number;
    otherHanger: Hanger;
    pivotOnOtherHanger: THREE.Vector3;
  }) {
    const { scene3d } = this.projectSettings;

    const rope = scene3d.physics.add.cylinder({
      height: length,
      radiusBottom: Hanger.ROPE_RADIUS,
      radiusTop: Hanger.ROPE_RADIUS,
      x: this.position.x,
      y: this.position.y - (length / 2),
      z: this.position.z,
    }, {
      phong: {
        color: 0x222222,
      },
    });

    // ROPE TO OTHER HANGER
    scene3d.physics.add.constraints.pointToPoint(rope.body, otherHanger.hanger.body, {
      // the offset from the center of each object
      pivotA: { x: 0, y: length / 2, z: 0 },
      pivotB: {
        x: (pivotOnOtherHanger.x * otherHanger.scale) - (otherHanger.boundingBox.x / 2),
        y: (pivotOnOtherHanger.y * -otherHanger.scale) + (otherHanger.boundingBox.y / 2),
        z: (pivotOnOtherHanger.z * otherHanger.scale) - (otherHanger.boundingBox.z / 2),
      },
    });

    // ROPE TO HANGER
    scene3d.physics.add.constraints.pointToPoint(rope.body, this.hanger.body, {
      // the offset from the center of each object
      pivotA: { x: 0, y: length / -2, z: 0 },
      pivotB: {
        x: 0,
        y: (this.boundingBox.y / 2),
        z: 0,
      },
    });
  }

  createRopesToFix({
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

  /**
   * Local is measured from bounding box left top, so subtract half for center of mass.
   */
  getLocalToGlobalPoint(local: THREE.Vector3) {
    return new THREE.Vector3(
      this.hanger.position.x + (local.x * this.scale) - (this.boundingBox.x / 2),
      this.hanger.position.y - (local.y * this.scale) + (this.boundingBox.y / 2),
      this.hanger.position.z + (local.z * this.scale) - (this.boundingBox.z / 2),
    );
  }
}
