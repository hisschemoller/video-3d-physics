import { PhysicsLoader, Project } from 'enable3d';
import Scene from '@projects/test/scene';

PhysicsLoader('./lib', () => new Project(
  // @ts-ignore
  { scenes: [Scene], anisotropy: 4, antialias: true }
));
