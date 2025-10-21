import { useState, useEffect, useCallback, useContext, DependencyList } from 'react';
import { FreezeContext } from './context';

/**
 * Internal hook wrappers that respect freeze state.
 * These are optional helpers - they're not required for the main Freeze component to work,
 * but can be used by advanced users who want their hooks to also respect frozen state.
 * 
 * @internal - May be exposed as public API in the future
 */

/**
 * A version of useState that doesn't update when frozen.
 * The setter will no-op if the component is within a frozen subtree.
 * 
 * @internal
 */
export function useFreezeState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState(initialValue);
  const { isFrozen } = useContext(FreezeContext);
  
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
 * A version of useEffect that doesn't run when frozen.
 * The effect will only execute when the component is not in a frozen subtree.
 * 
 * @internal
 */
export function useFreezeEffect(
  effect: () => void | (() => void),
  deps: DependencyList
): void {
  const { isFrozen } = useContext(FreezeContext);
  
  useEffect(() => {
    if (isFrozen) {
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFrozen, ...deps]);
}

/**
 * A version of useCallback that's aware of freeze state.
 * The callback will check if frozen before executing.
 * 
 * @internal
 */
export function useFreezeCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  const { isFrozen } = useContext(FreezeContext);
  
  return useCallback(
    ((...args: any[]) => {
      if (isFrozen) {
        return;
      }
      return callback(...args);
    }) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFrozen, ...deps]
  );
}

