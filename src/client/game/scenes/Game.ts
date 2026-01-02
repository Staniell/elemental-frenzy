import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import { SCENES, KEY_BINDINGS } from '../core/constants';

/**
 * Main Game Scene - Phase 1 Skeleton
 * Currently shows placeholder UI and demonstrates keyboard input detection.
 * Combat logic, enemies, and elements will be added in later phases.
 */
export class Game extends Scene {
  private background: Phaser.GameObjects.Image | null = null;
  private statusText: Phaser.GameObjects.Text | null = null;
  private inputDisplay: Phaser.GameObjects.Text | null = null;
  private lastInput: string = 'None';

  // Keyboard keys
  private jumpKeys: Phaser.Input.Keyboard.Key[] = [];
  private attackKeys: Phaser.Input.Keyboard.Key[] = [];
  private blockKeys: Phaser.Input.Keyboard.Key[] = [];

  constructor() {
    super(SCENES.GAME);
  }

  init(): void {
    this.background = null;
    this.statusText = null;
    this.inputDisplay = null;
    this.lastInput = 'None';
    this.jumpKeys = [];
    this.attackKeys = [];
    this.blockKeys = [];
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.setupKeyboardInput();
    this.setupMouseInput();
    this.refreshLayout();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.updateLayout(gameSize.width, gameSize.height);
    });

    // ESC to return to menu (for testing)
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start(SCENES.MAIN_MENU);
    });
  }

  private setupKeyboardInput(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;

    // Map jump keys
    KEY_BINDINGS.JUMP.forEach((key) => {
      this.jumpKeys.push(keyboard.addKey(key));
    });

    // Map attack keys
    KEY_BINDINGS.ATTACK.forEach((key) => {
      this.attackKeys.push(keyboard.addKey(key));
    });

    // Map block keys
    KEY_BINDINGS.BLOCK.forEach((key) => {
      this.blockKeys.push(keyboard.addKey(key));
    });

    // Listen for key events
    this.jumpKeys.forEach((key) => {
      key.on('down', () => this.onJump());
    });

    this.attackKeys.forEach((key) => {
      key.on('down', () => this.onAttack());
    });

    this.blockKeys.forEach((key) => {
      key.on('down', () => this.onBlock());
    });
  }

  private setupMouseInput(): void {
    // Left click = Attack
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.onAttack();
      } else if (pointer.rightButtonDown()) {
        this.onBlock();
      }
    });

    // Disable context menu on right-click
    this.input.mouse?.disableContextMenu();
  }

  private onJump(): void {
    this.lastInput = '🦘 JUMP';
    this.updateInputDisplay();
    // Actual jump logic will be added in Phase 3
  }

  private onAttack(): void {
    this.lastInput = '⚔️ ATTACK';
    this.updateInputDisplay();
    // Actual attack logic will be added in Phase 3
  }

  private onBlock(): void {
    this.lastInput = '🛡️ BLOCK';
    this.updateInputDisplay();
    // Actual block logic will be added in Phase 3
  }

  private updateInputDisplay(): void {
    if (this.inputDisplay) {
      this.inputDisplay.setText(`Last Input: ${this.lastInput}`);
      
      // Flash effect
      this.inputDisplay.setColor('#00ff00');
      this.time.delayedCall(200, () => {
        this.inputDisplay?.setColor('#ffffff');
      });
    }
  }

  private refreshLayout(): void {
    this.updateLayout(this.scale.width, this.scale.height);
  }

  private updateLayout(width: number, height: number): void {
    this.cameras.resize(width, height);
    const scaleFactor = Math.min(width / 1024, height / 768, 1);

    // Background
    if (!this.background) {
      this.background = this.add.image(0, 0, 'background').setOrigin(0).setAlpha(0.2);
    }
    this.background.setDisplaySize(width, height);

    // Status text
    if (!this.statusText) {
      this.statusText = this.add
        .text(0, 0, '🎮 GAME SCENE - Phase 1 Skeleton\n\nPress ESC to return to menu', {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#888888',
          align: 'center',
        })
        .setOrigin(0.5);
    }
    this.statusText.setPosition(width / 2, height * 0.3);
    this.statusText.setScale(scaleFactor);

    // Input display
    if (!this.inputDisplay) {
      this.inputDisplay = this.add
        .text(0, 0, `Last Input: ${this.lastInput}`, {
          fontFamily: 'Arial Black',
          fontSize: '36px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5);
    }
    this.inputDisplay.setPosition(width / 2, height * 0.5);
    this.inputDisplay.setScale(scaleFactor);

    // Controls hint
    this.add
      .text(
        width / 2,
        height * 0.75,
        `JUMP: ${KEY_BINDINGS.JUMP.join('/')}  |  ATTACK: ${KEY_BINDINGS.ATTACK.join('/')}/LClick  |  BLOCK: ${KEY_BINDINGS.BLOCK.join('/')}/RClick`,
        {
          fontFamily: 'Courier New',
          fontSize: '16px',
          color: '#666666',
        }
      )
      .setOrigin(0.5)
      .setScale(scaleFactor);
  }
}
