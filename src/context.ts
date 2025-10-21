import { createContext, useContext } from 'react';

/**
 * Internal context to track frozen state across the component tree.
 * Supports nesting: if any ancestor is frozen, descendants are frozen.
 * @internal
 */
export interface FreezeContextValue {
  /**
   * Whether this subtree is frozen.
   * True if any ancestor Freeze component has freeze={true}
   */
  isFrozen: boolean;
}

/**
 * Internal context for freeze state propagation.
 * Not exported from the public API.
 * @internal
 */
export const FreezeContext = createContext<FreezeContextValue>({
  isFrozen: false,
});

/**
 * Hook to check if the current component is within a frozen subtree.
 * @internal - May be exposed as public API in the future
 */
export function useIsFrozen(): boolean {
  const context = useContext(FreezeContext);
  return context.isFrozen;
}
