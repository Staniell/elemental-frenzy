import { Scene, GameObjects } from 'phaser';
import { SCENES } from '../core/constants';

export class MainMenu extends Scene {
  private background: GameObjects.Image | null = null;
  private logo: GameObjects.Image | null = null;
  private title: GameObjects.Text | null = null;
  private startButton: GameObjects.Text | null = null;
  private helpButton: GameObjects.Text | null = null;

  constructor() {
    super(SCENES.MAIN_MENU);
  }

  init(): void {
    this.background = null;
    this.logo = null;
    this.title = null;
    this.startButton = null;
    this.helpButton = null;
  }

  create(): void {
    this.refreshLayout();
    this.scale.on('resize', () => this.refreshLayout());
  }

  private refreshLayout(): void {
    const { width, height } = this.scale;
    this.cameras.resize(width, height);

    // Background
    if (!this.background) {
      this.background = this.add.image(0, 0, 'background').setOrigin(0);
    }
    this.background.setDisplaySize(width, height);

    const scaleFactor = Math.min(width / 1024, height / 768, 1);

    // Logo
    if (!this.logo) {
      this.logo = this.add.image(0, 0, 'logo');
    }
    this.logo.setPosition(width / 2, height * 0.3).setScale(scaleFactor * 0.8);

    // Title
    if (!this.title) {
      this.title = this.add
        .text(0, 0, '⚔️ ELEMENTAL FRENZY', {
          fontFamily: 'Arial Black',
          fontSize: '42px',
          color: '#ffd700',
          stroke: '#000000',
          strokeThickness: 8,
          align: 'center',
        })
        .setOrigin(0.5);
    }
    this.title.setPosition(width / 2, height * 0.52);
    this.title.setScale(scaleFactor);

    // Start Button
    if (!this.startButton) {
      this.startButton = this.createButton('▶ START', '#00ff00', () => {
        this.scene.start(SCENES.GAME);
      });
    }
    this.startButton.setPosition(width / 2, height * 0.68);
    this.startButton.setScale(scaleFactor);

    // Help Button
    if (!this.helpButton) {
      this.helpButton = this.createButton('❓ HELP', '#00bfff', () => {
        this.scene.start(SCENES.HELP);
      });
    }
    this.helpButton.setPosition(width / 2, height * 0.78);
    this.helpButton.setScale(scaleFactor);
  }

  private createButton(
    label: string,
    color: string,
    onClick: () => void
  ): GameObjects.Text {
    return this.add
      .text(0, 0, label, {
        fontFamily: 'Arial Black',
        fontSize: '32px',
        color: color,
        stroke: '#000000',
        strokeThickness: 6,
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', function (this: GameObjects.Text) {
        this.setScale(1.1);
      })
      .on('pointerout', function (this: GameObjects.Text) {
        this.setScale(1);
      })
      .on('pointerdown', onClick);
  }
}
