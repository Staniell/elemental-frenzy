/**
 * Game Constants - Pure TypeScript, no Phaser imports
 * Core configuration values for Elemental Frenzy
 */

// =============================================================================
// GAME SETTINGS
// =============================================================================

export const GAME_CONFIG = {
  /** Base game width for scaling calculations */
  BASE_WIDTH: 1024,
  /** Base game height for scaling calculations */
  BASE_HEIGHT: 768,
  /** Auto-runner scroll speed (pixels per second) */
  SCROLL_SPEED: 200,
} as const;

// =============================================================================
// INPUT SETTINGS
// =============================================================================

export const INPUT_CONFIG = {
  /** Jump input buffer window in milliseconds */
  JUMP_BUFFER_MS: 150,
  /** Block input buffer window in milliseconds */
  BLOCK_BUFFER_MS: 100,
  /** Attack input buffer window in milliseconds */
  ATTACK_BUFFER_MS: 100,
} as const;

// =============================================================================
// KEY BINDINGS
// =============================================================================

export const KEY_BINDINGS = {
  JUMP: ['SPACE', 'W'] as const,
  ATTACK: ['J'] as const,
  BLOCK: ['K'] as const,
} as const;

// =============================================================================
// SCENE KEYS
// =============================================================================

export const SCENES = {
  BOOT: 'Boot',
  PRELOADER: 'Preloader',
  MAIN_MENU: 'MainMenu',
  HELP: 'Help',
  GAME: 'Game',
  GAME_OVER: 'GameOver',
} as const;
