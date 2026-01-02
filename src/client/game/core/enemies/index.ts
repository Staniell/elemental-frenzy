/**
 * Enemy Archetype System - Pure TypeScript, NO Phaser imports
 * Defines enemy types with their elemental properties
 */

import { Element } from '../elements';

// =============================================================================
// ENEMY TYPES
// =============================================================================

export enum EnemyArchetype {
  /** Basic melee enemy - single defense element */
  GRUNT = 'grunt',
  /** Ranged enemy - single attack element */
  SHOOTER = 'shooter',
  /** Elite enemy - both defense and attack elements */
  ELITE = 'elite',
}

// =============================================================================
// ENEMY CONFIG INTERFACE
// =============================================================================

export interface EnemyConfig {
  archetype: EnemyArchetype;
  /** Element that resists player attacks (body color) */
  defenseElement: Element | null;
  /** Element of projectile attacks (projectile color) */
  attackElement: Element | null;
  /** Base HP */
  health: number;
  /** Movement speed multiplier (1.0 = normal) */
  speedMultiplier: number;
  /** Damage dealt to player */
  damage: number;
}

// =============================================================================
// ARCHETYPE FACTORIES
// =============================================================================

/**
 * Creates a grunt enemy (melee, single defense element)
 */
export function createGrunt(defenseElement: Element): EnemyConfig {
  return {
    archetype: EnemyArchetype.GRUNT,
    defenseElement,
    attackElement: null,
    health: 100,
    speedMultiplier: 1.0,
    damage: 20,
  };
}

/**
 * Creates a shooter enemy (ranged, single attack element)
 */
export function createShooter(attackElement: Element): EnemyConfig {
  return {
    archetype: EnemyArchetype.SHOOTER,
    defenseElement: null,
    attackElement,
    health: 60,
    speedMultiplier: 0.8,
    damage: 15,
  };
}

/**
 * Creates an elite enemy (both defense and attack elements)
 * Note: Per rules, max 2 elements allowed
 */
export function createElite(defenseElement: Element, attackElement: Element): EnemyConfig {
  return {
    archetype: EnemyArchetype.ELITE,
    defenseElement,
    attackElement,
    health: 200,
    speedMultiplier: 0.7,
    damage: 30,
  };
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validates enemy config follows the rules (max 2 elements)
 */
export function validateEnemyConfig(config: EnemyConfig): boolean {
  let elementCount = 0;
  if (config.defenseElement != null) elementCount++;
  if (config.attackElement != null) elementCount++;
  
  // Rule: max 2 elements per enemy
  return elementCount <= 2;
}

/**
 * Gets the number of elements an enemy has
 */
export function getEnemyElementCount(config: EnemyConfig): number {
  let count = 0;
  if (config.defenseElement != null) count++;
  if (config.attackElement != null) count++;
  return count;
}
