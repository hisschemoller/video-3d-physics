/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { AxesHelper } from 'three';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';

export default class Hanger {
  static DEPTH = 0.05;

  static ROPE_RADIUS = 0.03;

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
    color,
  }: {
    img: { x: number, y: number, w: number, h: number };
    mediaData: ImageData | VideoData;
    svgUrl: string;
    color?: number;
  }) {
    const { patternDuration, width, width3d } = this.projectSettings;
    const pxTo3d = width3d / width;

    const actor = await createActor(this.projectSettings, mediaData, {
      imageRect: { w: img.w, h: img.h },
      svg: { scale: pxTo3d * this.scale, url: svgUrl },
      depth: Hanger.DEPTH,
      color,
    });
    actor.setStaticPosition(getMatrix4({
      x: (img.w * pxTo3d * this.scale) / -2,
      y: (img.h * pxTo3d * this.scale) / 2,
      z: Hanger.DEPTH / -2,
    }));

    // video or image
    if ('imgSrcPath' in mediaData) {
      // if video add tween
      actor.addTween({
        delay: 1,
        duration: patternDuration,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(img.x, img.y),
        toImagePosition: new THREE.Vector2(img.x, img.y),
      });
    } else {
      // if image set position
      actor.setStaticImage(img.x, img.y);
    }

    return actor;
  }

  createHanger({
    actor,
    rotationY = 0,
  }: {
    actor: Actor,
    rotationY?: number;
  }) {
    const { scene3d } = this.projectSettings;

    this.hanger = new ExtendedObject3D();
    this.hanger.add(actor.getMesh());
    this.hanger.position.set(
      this.position.x + (this.boundingBox.x / 2),
      this.position.y - (this.boundingBox.y / 2),
      this.position.z,
    );
    this.hanger.rotation.y = rotationY;
    scene3d.add.existing(this.hanger);
    scene3d.physics.add.existing(this.hanger, {
      mass: 1,
      shape: 'concaveMesh', // https://enable3d.io/examples/compare-physics-body-shapes.html
    });
  }

  async createSVGExtrudeFloor({
    img,
    mediaData,
    svgScale,
    svgUrl,
    color = 0x000000,
  }: {
    img: { x: number, y: number, w: number, h: number };
    mediaData: ImageData | VideoData;
    svgScale: number;
    svgUrl: string;
    color?: number;
  }): Promise<void> {
    this.scale = svgScale;
    const { width, width3d } = this.projectSettings;
    const pxTo3d = width3d / width;

    const actor = await this.createActor({ img, mediaData, svgUrl, color });
    actor.setStaticPosition(getMatrix4({
      x: (img.w * pxTo3d * this.scale) / -2,
      y: Hanger.DEPTH / -2,
      z: (img.h * pxTo3d * this.scale) / -2,
      rx: Math.PI / -2,
    }));
    actor.getMesh().add(new AxesHelper(5));

    this.boundingBox = new THREE.Vector3(
      img.w * pxTo3d * this.scale,
      Hanger.DEPTH,
      img.h * pxTo3d * this.scale,
    );

    this.createHanger({ actor });
    this.hanger.add(new AxesHelper(10));
  }

  async createSVGExtrudeHanger({
    img,
    mediaData,
    rotationY = 0,
    svgScale,
    svgUrl,
    color = 0x000000,
  }: {
    img: { x: number, y: number, w: number, h: number };
    mediaData: ImageData | VideoData;
    rotationY?: number;
    svgScale: number;
    svgUrl: string;
    color?: number;
  }): Promise<void> {
    this.scale = svgScale;
    const { width, width3d } = this.projectSettings;
    const pxTo3d = width3d / width;

    const actor = await this.createActor({ img, mediaData, svgUrl, color });

    this.boundingBox = new THREE.Vector3(
      img.w * pxTo3d * this.scale,
      img.h * pxTo3d * this.scale,
      Hanger.DEPTH,
    );

    this.createHanger({ actor, rotationY });
  }

  createRopesFromFloorToFix({
    ropes,
    fix,
  }: {
    ropes: { pivot: THREE.Vector3, length: number }[];
    fix: ExtendedObject3D;
  }): void {
    const { scene3d } = this.projectSettings;

    ropes.forEach((ropeConfig) => {
      const rope = scene3d.physics.add.cylinder({
        height: ropeConfig.length,
        radiusBottom: Hanger.ROPE_RADIUS,
        radiusTop: Hanger.ROPE_RADIUS,
        x: this.position.x + (ropeConfig.pivot.x * this.scale),
        y: this.position.y + (ropeConfig.length / 2),
        z: this.position.z + (ropeConfig.pivot.z * this.scale) + (this.boundingBox.z / -2),
      }, {
        phong: {
          color: 0x444444,
        },
      });

      // ROPE TO HANGER
      scene3d.physics.add.constraints.pointToPoint(rope.body, this.hanger.body, {
        // the offset from the center of each object
        pivotA: { x: 0, y: ropeConfig.length / -2, z: 0 },
        pivotB: {
          x: (this.boundingBox.x / -2) + (ropeConfig.pivot.x * this.scale),
          y: (this.boundingBox.y / 2),
          z: (this.boundingBox.z / -2) + (ropeConfig.pivot.z * this.scale),
        },
      });

      // ROPE TO FIX
      scene3d.physics.add.constraints.pointToPoint(rope.body, fix.body, {
        // the offset from the center of each object
        pivotA: { x: 0, y: ropeConfig.length / 2, z: 0 },
        pivotB: {
          x: this.position.x + (ropeConfig.pivot.x * this.scale),
          y: this.position.y + ropeConfig.length,
          z: this.position.z + (ropeConfig.pivot.z * this.scale) + (this.boundingBox.z / -2),
        },
      });
    });
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
        color: 0x444444,
      },
    });
    console.log('rope', rope.position);

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
    console.log('hanger',
      this.hanger.position.x + 0,
      this.hanger.position.y + (this.boundingBox.y / 2),
      this.hanger.position.z + 0);

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
    console.log('other',
      (pivotOnOtherHanger.x * otherHanger.scale) - (otherHanger.boundingBox.x / 2),
      (pivotOnOtherHanger.y * -otherHanger.scale) + (otherHanger.boundingBox.y / 2),
      (pivotOnOtherHanger.z * otherHanger.scale) - (otherHanger.boundingBox.z / 2));
    console.log('this.position.z', this.position.z);
    console.log('pivotOnOtherHanger.z', pivotOnOtherHanger.z);
    console.log('this.scale', this.scale);
    console.log('this.boundingBox', this.boundingBox);
    console.log(' ');
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
          color: 0x777777,
        },
      });
      rope.castShadow = true;
      rope.receiveShadow = true;

      // ROPE TO HANGER
      scene3d.physics.add.constraints.pointToPoint(rope.body, this.hanger.body, {
        // the offset from the center of each object
        pivotA: { x: 0, y: ropeConfig.length / -2, z: 0 },
        pivotB: {
          x: (this.boundingBox.x / -2) + ropeConfig.pivot.x,
          y: (this.boundingBox.y / 2) + ropeConfig.pivot.y,
          z: 0,
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
    });
  }

  createSingleRopeFromAngledHangerToFix({
    length,
    fix,
  }: {
    length: number;
    fix: ExtendedObject3D;
  }): void {
    const { scene3d } = this.projectSettings;

    // ROPE
    const rope = scene3d.physics.add.cylinder({
      height: length,
      radiusBottom: Hanger.ROPE_RADIUS,
      radiusTop: Hanger.ROPE_RADIUS,
      x: this.hanger.position.x,
      y: this.hanger.position.y + (this.boundingBox.y / 2) + (length / 2),
      z: this.hanger.position.z,
    }, {
      phong: {
        color: 0x666666,
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

    // ROPE TO FIX
    scene3d.physics.add.constraints.pointToPoint(rope.body, fix.body, {
      // the offset from the center of each object
      pivotA: { x: 0, y: length / 2, z: 0 },
      pivotB: {
        x: this.hanger.position.x,
        y: this.hanger.position.y + (this.boundingBox.y / 2) + length,
        z: this.hanger.position.z,
      },
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
