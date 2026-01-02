import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import { SCENES } from '../core/constants';

export class GameOver extends Scene {
  private background: Phaser.GameObjects.Image | null = null;
  private gameoverText: Phaser.GameObjects.Text | null = null;
  private restartHint: Phaser.GameObjects.Text | null = null;

  constructor() {
    super(SCENES.GAME_OVER);
  }

  init(): void {
    this.background = null;
    this.gameoverText = null;
    this.restartHint = null;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x1a0000);
    this.refreshLayout();
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.updateLayout(gameSize.width, gameSize.height);
    });

    // Return to Main Menu on tap/click or SPACE
    this.input.once('pointerdown', () => {
      this.scene.start(SCENES.MAIN_MENU);
    });
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start(SCENES.MAIN_MENU);
    });
  }

  private refreshLayout(): void {
    this.updateLayout(this.scale.width, this.scale.height);
  }

  private updateLayout(width: number, height: number): void {
    this.cameras.resize(width, height);
    const scaleFactor = Math.min(width / 1024, height / 768, 1);

    // Background
    if (!this.background) {
      this.background = this.add.image(0, 0, 'background').setOrigin(0).setAlpha(0.3);
    }
    this.background.setDisplaySize(width, height);

    // Game Over text
    if (!this.gameoverText) {
      this.gameoverText = this.add
        .text(0, 0, '💀 GAME OVER', {
          fontFamily: 'Arial Black',
          fontSize: '64px',
          color: '#ff4444',
          stroke: '#000000',
          strokeThickness: 8,
          align: 'center',
        })
        .setOrigin(0.5);
    }
    this.gameoverText.setPosition(width / 2, height * 0.4);
    this.gameoverText.setScale(scaleFactor);

    // Restart hint
    if (!this.restartHint) {
      this.restartHint = this.add
        .text(0, 0, 'Click or press SPACE to continue', {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#aaaaaa',
        })
        .setOrigin(0.5);
    }
    this.restartHint.setPosition(width / 2, height * 0.6);
    this.restartHint.setScale(scaleFactor);
  }
}
