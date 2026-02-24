/**
 * Unified Action Result Types
 *
 * All server actions MUST return ActionResult<T>.
 * This replaces the inconsistent { error }, { success: false, error },
 * and translation-mixed patterns across action files.
 */

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Helper to create a success result
 */
export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

/**
 * Helper to create an error result
 */
export function err(error: string): ActionResult<never> {
  return { success: false, error }
}
