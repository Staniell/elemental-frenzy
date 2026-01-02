/**
 * Combat System - Pure TypeScript, NO Phaser imports
 * Handles damage calculation and block resolution based on elemental matchups
 */

import { Element, ElementMatchup, resolveElementMatchup } from '../elements';

// =============================================================================
// COMBAT CONSTANTS
// =============================================================================

export const COMBAT_CONFIG = {
  /** Base damage for player attacks */
  BASE_DAMAGE: 100,
  /** Damage multiplier for strong elemental matchup */
  STRONG_MULTIPLIER: 3.0,  // +200% = 3x damage
  /** Damage multiplier for weak elemental matchup */
  WEAK_MULTIPLIER: 0.3,    // 30% damage
  /** Damage multiplier for neutral matchup */
  NEUTRAL_MULTIPLIER: 1.0,
  /** Chip damage percentage when partial block */
  CHIP_DAMAGE_PERCENT: 0.25,
} as const;

// =============================================================================
// ATTACK RESULT TYPES
// =============================================================================

export enum AttackResultType {
  /** Strong hit - bonus damage or instant break */
  CRITICAL = 'critical',
  /** Normal hit - standard damage */
  NORMAL = 'normal',
  /** Weak hit - reduced damage, attacker staggers */
  RESISTED = 'resisted',
}

export interface AttackResult {
  type: AttackResultType;
  damage: number;
  /** Whether the attacker should stagger (weak matchup) */
  attackerStagger: boolean;
  /** Whether the target's guard is broken (strong matchup) */
  guardBreak: boolean;
}

// =============================================================================
// BLOCK RESULT TYPES
// =============================================================================

export enum BlockResultType {
  /** Perfect block - no damage */
  PERFECT = 'perfect',
  /** Partial block - chip damage */
  PARTIAL = 'partial',
  /** Failed block - full damage + stagger */
  FAILED = 'failed',
}

export interface BlockResult {
  type: BlockResultType;
  damageTaken: number;
  /** Whether the blocker staggers */
  stagger: boolean;
  /** Whether the blocker is knocked back */
  knockback: boolean;
}

// =============================================================================
// COMBAT RESOLUTION FUNCTIONS
// =============================================================================

/**
 * Calculates the result of an attack based on elemental matchup
 * @param attackElement The element of the attack
 * @param defenseElement The element of the defender
 * @param baseDamage Optional base damage override
 */
export function resolveAttack(
  attackElement: Element,
  defenseElement: Element,
  baseDamage: number = COMBAT_CONFIG.BASE_DAMAGE
): AttackResult {
  const matchup = resolveElementMatchup(attackElement, defenseElement);

  switch (matchup) {
    case ElementMatchup.STRONG:
      return {
        type: AttackResultType.CRITICAL,
        damage: Math.floor(baseDamage * COMBAT_CONFIG.STRONG_MULTIPLIER),
        attackerStagger: false,
        guardBreak: true,
      };

    case ElementMatchup.WEAK:
      return {
        type: AttackResultType.RESISTED,
        damage: Math.floor(baseDamage * COMBAT_CONFIG.WEAK_MULTIPLIER),
        attackerStagger: true,
        guardBreak: false,
      };

    case ElementMatchup.NEUTRAL:
    default:
      return {
        type: AttackResultType.NORMAL,
        damage: baseDamage,
        attackerStagger: false,
        guardBreak: false,
      };
  }
}

/**
 * Calculates the result of a block based on elemental matchup
 * @param projectileElement The element of the incoming projectile
 * @param shieldElement The element of the shield/block
 * @param incomingDamage The damage of the projectile
 */
export function resolveBlock(
  projectileElement: Element,
  shieldElement: Element,
  incomingDamage: number
): BlockResult {
  const matchup = resolveElementMatchup(shieldElement, projectileElement);

  switch (matchup) {
    case ElementMatchup.STRONG:
      // Shield is strong against projectile = perfect block
      return {
        type: BlockResultType.PERFECT,
        damageTaken: 0,
        stagger: false,
        knockback: false,
      };

    case ElementMatchup.WEAK:
      // Shield is weak against projectile = failed block
      return {
        type: BlockResultType.FAILED,
        damageTaken: incomingDamage,
        stagger: true,
        knockback: true,
      };

    case ElementMatchup.NEUTRAL:
    default:
      // Neutral = partial block with chip damage
      return {
        type: BlockResultType.PARTIAL,
        damageTaken: Math.floor(incomingDamage * COMBAT_CONFIG.CHIP_DAMAGE_PERCENT),
        stagger: false,
        knockback: false,
      };
  }
}

/**
 * Quick check if a matchup would result in critical damage
 */
export function isCriticalMatchup(attackElement: Element, defenseElement: Element): boolean {
  return resolveElementMatchup(attackElement, defenseElement) === ElementMatchup.STRONG;
}

/**
 * Quick check if a matchup would result in resisted damage
 */
export function isResistedMatchup(attackElement: Element, defenseElement: Element): boolean {
  return resolveElementMatchup(attackElement, defenseElement) === ElementMatchup.WEAK;
}
