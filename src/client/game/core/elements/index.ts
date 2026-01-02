/**
 * Element System - Pure TypeScript, NO Phaser imports
 * Defines the elemental rock-paper-scissors cycle
 * 
 * Cycle: Fire → Earth → Lightning → Water → Fire
 *        (strong against →)
 */

// =============================================================================
// ELEMENT TYPES
// =============================================================================

export enum Element {
  FIRE = 'fire',
  EARTH = 'earth',
  LIGHTNING = 'lightning',
  WATER = 'water',
}

// =============================================================================
// ELEMENT RELATIONSHIPS
// =============================================================================

/** Element that this element is strong against */
const STRONG_AGAINST: Record<Element, Element> = {
  [Element.FIRE]: Element.EARTH,
  [Element.EARTH]: Element.LIGHTNING,
  [Element.LIGHTNING]: Element.WATER,
  [Element.WATER]: Element.FIRE,
};

/** Element that this element is weak against */
const WEAK_AGAINST: Record<Element, Element> = {
  [Element.FIRE]: Element.WATER,
  [Element.EARTH]: Element.FIRE,
  [Element.LIGHTNING]: Element.EARTH,
  [Element.WATER]: Element.LIGHTNING,
};

// =============================================================================
// MATCHUP RESULTS
// =============================================================================

export enum ElementMatchup {
  STRONG = 'strong',    // Attacker has advantage
  NEUTRAL = 'neutral',  // No advantage
  WEAK = 'weak',        // Defender has advantage
}

// =============================================================================
// RESOLUTION FUNCTIONS
// =============================================================================

/**
 * Resolves the elemental matchup between attacker and defender
 * @param attackerElement The element of the attacking entity
 * @param defenderElement The element of the defending entity
 * @returns The matchup result from the attacker's perspective
 */
export function resolveElementMatchup(
  attackerElement: Element,
  defenderElement: Element
): ElementMatchup {
  if (attackerElement === defenderElement) {
    return ElementMatchup.NEUTRAL;
  }

  if (STRONG_AGAINST[attackerElement] === defenderElement) {
    return ElementMatchup.STRONG;
  }

  if (WEAK_AGAINST[attackerElement] === defenderElement) {
    return ElementMatchup.WEAK;
  }

  // Should never happen in a 4-element cycle, but default to neutral
  return ElementMatchup.NEUTRAL;
}

/**
 * Gets the element this element is strong against
 */
export function getStrongAgainst(element: Element): Element {
  return STRONG_AGAINST[element];
}

/**
 * Gets the element this element is weak against
 */
export function getWeakAgainst(element: Element): Element {
  return WEAK_AGAINST[element];
}

/**
 * Returns all elements in cycle order
 */
export function getAllElements(): Element[] {
  return [Element.FIRE, Element.EARTH, Element.LIGHTNING, Element.WATER];
}

/**
 * Get the next element in the cycle
 */
export function getNextElement(element: Element): Element {
  return STRONG_AGAINST[element];
}

/**
 * Get the previous element in the cycle
 */
export function getPreviousElement(element: Element): Element {
  return WEAK_AGAINST[element];
}
