import { Scene } from 'phaser';
import { SCENES, KEY_BINDINGS } from '../core/constants';

export class Help extends Scene {
  private helpText: Phaser.GameObjects.Text | null = null;
  private backButton: Phaser.GameObjects.Text | null = null;

  constructor() {
    super(SCENES.HELP);
  }

  init(): void {
    this.helpText = null;
    this.backButton = null;
  }

  create(): void {
    this.refreshLayout();
    this.scale.on('resize', () => this.refreshLayout());

    // ESC or click anywhere to go back
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start(SCENES.MAIN_MENU);
    });
  }

  private refreshLayout(): void {
    const { width, height } = this.scale;
    this.cameras.resize(width, height);

    const scaleFactor = Math.min(width / 1024, height / 768, 1);

    // Help content
    const helpContent = `
⚔️ ELEMENTAL FRENZY - CONTROLS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 CONTROLS

  JUMP      ${KEY_BINDINGS.JUMP.join(' or ')}
  ATTACK    ${KEY_BINDINGS.ATTACK.join(' or ')} / Left Click
  BLOCK     ${KEY_BINDINGS.BLOCK.join(' or ')} / Right Click

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 ELEMENT CYCLE

  Fire → Earth → Lightning → Water → Fire
        (strong against →)

  ⚔️ Strong hit = +200% damage
  ❌ Weak hit = 30% damage + stagger
  🛡️ Correct block = full protection
  💥 Wrong block = knockback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Press ESC or click BACK to return
    `.trim();

    if (!this.helpText) {
      this.helpText = this.add
        .text(0, 0, helpContent, {
          fontFamily: 'Courier New, monospace',
          fontSize: '18px',
          color: '#ffffff',
          align: 'left',
          lineSpacing: 6,
        })
        .setOrigin(0.5);
    }
    this.helpText.setPosition(width / 2, height * 0.45);
    this.helpText.setScale(scaleFactor);

    // Back button
    if (!this.backButton) {
      this.backButton = this.add
        .text(0, 0, '← BACK', {
          fontFamily: 'Arial Black',
          fontSize: '28px',
          color: '#ffd700',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.backButton?.setColor('#ffffff'))
        .on('pointerout', () => this.backButton?.setColor('#ffd700'))
        .on('pointerdown', () => this.scene.start(SCENES.MAIN_MENU));
    }
    this.backButton.setPosition(width / 2, height * 0.9);
    this.backButton.setScale(scaleFactor);
  }
}
