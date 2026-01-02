import { Scene } from 'phaser';
import { SCENES } from '../core/constants';

export class Boot extends Scene {
  constructor() {
    super(SCENES.BOOT);
  }

  preload(): void {
    // The Boot Scene is typically used to load in any assets you require for your Preloader
    // The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
    this.load.image('background', '../assets/bg.png');
  }

  create(): void {
    this.scene.start(SCENES.PRELOADER);
  }
}
