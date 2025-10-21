import { useState, useEffect, useCallback, useMemo, DependencyList } from 'react';
import { useIsFrozen } from './context';

/**
 * A freeze-aware version of useState.
 * When frozen, state updates are ignored (no-op).
 * 
 * @internal - Optional helper for advanced use cases
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useFreezeState(0);
 * // setCount(1) will be ignored if component is frozen
 * ```
 */
export function useFreezeState<T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState(initialState);
  const isFrozen = useIsFrozen();

  const setValueIfNotFrozen = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      if (!isFrozen) {
        setValue(newValue);
      }
    },
    [isFrozen]
  );

  return [value, setValueIfNotFrozen];
}

/**
 * A freeze-aware version of useEffect.
 * Effect is skipped when component is frozen.
 * 
 * @internal - Optional helper for advanced use cases
 * 
 * @example
 * ```tsx
 * useFreezeEffect(() => {
 *   // This won't run when frozen
 *   fetchData();
 * }, [deps]);
 * ```
 */
export function useFreezeEffect(
  effect: () => void | (() => void),
  deps: DependencyList
): void {
  const isFrozen = useIsFrozen();

  useEffect(() => {
    if (isFrozen) {
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFrozen, ...deps]);
}

/**
 * A freeze-aware version of useMemo.
 * Computation is skipped when frozen (returns cached value).
 * 
 * @internal - Optional helper for advanced use cases
 */
export function useFreezeMemo<T>(
  factory: () => T,
  deps: DependencyList
): T {
  const isFrozen = useIsFrozen();

  return useMemo(
    factory,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFrozen, ...deps]
  );
}

/**
 * A freeze-aware version of useCallback.
 * Callback is stable when frozen.
 * 
 * @internal - Optional helper for advanced use cases
 */
export function useFreezeCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  const isFrozen = useIsFrozen();

  return useCallback(
    callback,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFrozen, ...deps]
  );
}
