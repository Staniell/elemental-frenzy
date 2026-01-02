/**
 * Input Buffering System - Pure TypeScript, NO Phaser imports
 * Provides input forgiveness for responsive controls
 */

import { INPUT_CONFIG } from '../constants';

// =============================================================================
// INPUT TYPES
// =============================================================================

export enum InputAction {
  JUMP = 'jump',
  ATTACK = 'attack',
  BLOCK = 'block',
}

export interface BufferedInput {
  action: InputAction;
  timestamp: number;
}

// =============================================================================
// INPUT BUFFER CLASS
// =============================================================================

/**
 * Manages input buffering for responsive game feel
 * Allows inputs to be "remembered" for a short window
 */
export class InputBuffer {
  private buffer: BufferedInput[] = [];
  private bufferWindows: Record<InputAction, number>;

  constructor() {
    this.bufferWindows = {
      [InputAction.JUMP]: INPUT_CONFIG.JUMP_BUFFER_MS,
      [InputAction.ATTACK]: INPUT_CONFIG.ATTACK_BUFFER_MS,
      [InputAction.BLOCK]: INPUT_CONFIG.BLOCK_BUFFER_MS,
    };
  }

  /**
   * Records an input action with current timestamp
   */
  push(action: InputAction, timestamp: number = Date.now()): void {
    this.buffer.push({ action, timestamp });
  }

  /**
   * Checks if an action was buffered within its window
   * @param action The action to check for
   * @param currentTime Current time (defaults to Date.now())
   * @returns true if the action is buffered and still valid
   */
  has(action: InputAction, currentTime: number = Date.now()): boolean {
    const window = this.bufferWindows[action];
    return this.buffer.some(
      (input) => input.action === action && currentTime - input.timestamp <= window
    );
  }

  /**
   * Consumes a buffered action (removes it from buffer)
   * @returns true if the action was consumed, false if not buffered
   */
  consume(action: InputAction, currentTime: number = Date.now()): boolean {
    const window = this.bufferWindows[action];
    const index = this.buffer.findIndex(
      (input) => input.action === action && currentTime - input.timestamp <= window
    );

    if (index !== -1) {
      this.buffer.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clears all buffered inputs
   */
  clear(): void {
    this.buffer = [];
  }

  /**
   * Removes expired inputs from buffer
   */
  prune(currentTime: number = Date.now()): void {
    const maxWindow = Math.max(...Object.values(this.bufferWindows));
    this.buffer = this.buffer.filter(
      (input) => currentTime - input.timestamp <= maxWindow
    );
  }

  /**
   * Gets the oldest buffered action (FIFO)
   */
  peek(): BufferedInput | undefined {
    return this.buffer[0];
  }

  /**
   * Gets the count of buffered inputs
   */
  get size(): number {
    return this.buffer.length;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/** Global input buffer instance */
export const inputBuffer = new InputBuffer();
