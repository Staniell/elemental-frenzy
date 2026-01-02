/**
 * Player State Machine - Pure TypeScript, NO Phaser imports
 * Manages player states and valid transitions
 */

// =============================================================================
// PLAYER STATES
// =============================================================================

export enum PlayerState {
  /** Running on ground (default auto-runner state) */
  RUNNING = 'running',
  /** In the air (jumping or falling) */
  AIRBORNE = 'airborne',
  /** Performing sword attack */
  ATTACKING = 'attacking',
  /** Holding shield up */
  BLOCKING = 'blocking',
  /** Recoiling from bad block or weak attack */
  STAGGERED = 'staggered',
  /** Recovering from knockback */
  RECOVERING = 'recovering',
  /** Player is dead */
  DEAD = 'dead',
}

// =============================================================================
// STATE DURATIONS (in milliseconds)
// =============================================================================

export const STATE_DURATIONS = {
  [PlayerState.ATTACKING]: 300,
  [PlayerState.BLOCKING]: 400,
  [PlayerState.STAGGERED]: 500,
  [PlayerState.RECOVERING]: 600,
} as const;

// =============================================================================
// VALID TRANSITIONS
// =============================================================================

/** Map of valid state transitions */
const VALID_TRANSITIONS: Record<PlayerState, PlayerState[]> = {
  [PlayerState.RUNNING]: [
    PlayerState.AIRBORNE,
    PlayerState.ATTACKING,
    PlayerState.BLOCKING,
    PlayerState.STAGGERED,
    PlayerState.DEAD,
  ],
  [PlayerState.AIRBORNE]: [
    PlayerState.RUNNING,
    PlayerState.ATTACKING,
    PlayerState.STAGGERED,
    PlayerState.DEAD,
  ],
  [PlayerState.ATTACKING]: [
    PlayerState.RUNNING,
    PlayerState.AIRBORNE,
    PlayerState.STAGGERED,
    PlayerState.DEAD,
  ],
  [PlayerState.BLOCKING]: [
    PlayerState.RUNNING,
    PlayerState.STAGGERED,
    PlayerState.DEAD,
  ],
  [PlayerState.STAGGERED]: [
    PlayerState.RECOVERING,
    PlayerState.DEAD,
  ],
  [PlayerState.RECOVERING]: [
    PlayerState.RUNNING,
    PlayerState.DEAD,
  ],
  [PlayerState.DEAD]: [],  // No transitions from dead
};

// =============================================================================
// STATE MACHINE CLASS
// =============================================================================

export interface StateChangeEvent {
  from: PlayerState;
  to: PlayerState;
  timestamp: number;
}

export type StateChangeCallback = (event: StateChangeEvent) => void;

/**
 * Player state machine with transition validation
 */
export class PlayerStateMachine {
  private currentState: PlayerState = PlayerState.RUNNING;
  private stateTimestamp: number = 0;
  private listeners: StateChangeCallback[] = [];

  constructor(initialState: PlayerState = PlayerState.RUNNING) {
    this.currentState = initialState;
    this.stateTimestamp = Date.now();
  }

  /**
   * Gets the current player state
   */
  get state(): PlayerState {
    return this.currentState;
  }

  /**
   * Gets how long the player has been in current state (ms)
   */
  getStateTime(currentTime: number = Date.now()): number {
    return currentTime - this.stateTimestamp;
  }

  /**
   * Attempts to transition to a new state
   * @returns true if transition succeeded, false if invalid
   */
  transition(newState: PlayerState, timestamp: number = Date.now()): boolean {
    if (!this.canTransition(newState)) {
      return false;
    }

    const event: StateChangeEvent = {
      from: this.currentState,
      to: newState,
      timestamp,
    };

    this.currentState = newState;
    this.stateTimestamp = timestamp;

    // Notify listeners
    this.listeners.forEach((callback) => callback(event));

    return true;
  }

  /**
   * Checks if a transition to the given state is valid
   */
  canTransition(newState: PlayerState): boolean {
    return VALID_TRANSITIONS[this.currentState].includes(newState);
  }

  /**
   * Force sets state (bypasses validation) - use sparingly
   */
  forceState(newState: PlayerState, timestamp: number = Date.now()): void {
    const event: StateChangeEvent = {
      from: this.currentState,
      to: newState,
      timestamp,
    };

    this.currentState = newState;
    this.stateTimestamp = timestamp;

    this.listeners.forEach((callback) => callback(event));
  }

  /**
   * Resets to initial running state
   */
  reset(): void {
    this.forceState(PlayerState.RUNNING);
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: StateChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Checks if player can perform actions (not staggered/recovering/dead)
   */
  canAct(): boolean {
    return ![
      PlayerState.STAGGERED,
      PlayerState.RECOVERING,
      PlayerState.DEAD,
    ].includes(this.currentState);
  }

  /**
   * Checks if player is grounded
   */
  isGrounded(): boolean {
    return this.currentState !== PlayerState.AIRBORNE;
  }

  /**
   * Checks if player is in an action state (attacking/blocking)
   */
  isActing(): boolean {
    return [PlayerState.ATTACKING, PlayerState.BLOCKING].includes(this.currentState);
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/** Global player state machine instance */
export const playerState = new PlayerStateMachine();
