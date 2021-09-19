import { Scene3D } from 'enable3d';
import { setup } from '@app/app';
// import TestScene from '@projects/test/scene';
import BrugPHKadeScene from '@projects/brugphkade/scene';

setup(BrugPHKadeScene as unknown as Scene3D);
