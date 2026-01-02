import { Scene } from 'phaser';
import { SCENES } from '../core/constants';

export class Preloader extends Scene {
  constructor() {
    super(SCENES.PRELOADER);
  }

  init(): void {
    // Background loaded in Boot scene
    this.add.image(512, 384, 'background');

    // Progress bar outline
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    // Progress bar fill
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload(): void {
    this.load.setPath('../assets');
    this.load.image('logo', 'logo.png');
  }

  create(): void {
    this.scene.start(SCENES.MAIN_MENU);
  }
}
