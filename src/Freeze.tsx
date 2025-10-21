import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { FreezeContext, useIsFrozen } from './context';
import { setNativeFreeze } from './native';

/**
 * Props for the Freeze component.
 * Compatible with react-freeze API.
 */
export interface FreezeProps {
  /**
   * When true, the children subtree will be frozen:
   * - No re-renders
   * - No effect executions
   * - No event handling
   * - Hidden from view (opacity: 0, pointerEvents: 'none')
   * - Native optimizations applied (if available)
   */
  freeze: boolean;

  /**
   * The React subtree to freeze/unfreeze
   */
  children: React.ReactNode;
}

/**
 * Internal component that handles the actual freeze logic.
 * Separated to allow the outer Freeze to use React.memo effectively.
 */
function FreezeInner({ freeze, children }: FreezeProps) {
  const parentIsFrozen = useIsFrozen();
  const viewRef = React.useRef<View>(null);

  // This subtree is frozen if:
  // 1. The parent is frozen (nesting: frozen parent → frozen children), OR
  // 2. This component's freeze prop is true
  const isFrozen = parentIsFrozen || freeze;

  // Apply native freeze optimizations when frozen state changes
  React.useEffect(() => {
    if (viewRef.current) {
      setNativeFreeze(viewRef.current, isFrozen);
    }
  }, [isFrozen]);

  // Provide frozen state to descendants via context
  const contextValue = React.useMemo(
    () => ({ isFrozen }),
    [isFrozen]
  );

  return (
    <FreezeContext.Provider value={contextValue}>
      <View
        ref={viewRef}
        style={isFrozen ? styles.frozen : styles.active}
        pointerEvents={isFrozen ? 'none' : 'auto'}
      >
        {children}
      </View>
    </FreezeContext.Provider>
  );
}

/**
 * Custom comparison function for React.memo.
 * Prevents re-renders when:
 * 1. Both prev and next are frozen (freeze === true)
 * 2. Freeze state hasn't changed
 */
function areEqual(prev: FreezeProps, next: FreezeProps): boolean {
  // If both are frozen, prevent re-render (children won't change while frozen)
  if (prev.freeze && next.freeze) {
    return true;
  }
  
  // Otherwise, only re-render if freeze prop actually changed
  // (children changes are ignored - this is the key optimization)
  return prev.freeze === next.freeze;
}

/**
 * Freeze component - prevents re-renders and effects in the children subtree.
 * 
 * Drop-in replacement for react-freeze:
 * ```tsx
 * import { Freeze } from 'react-native-nitro-freeze';
 * 
 * <Freeze freeze={isInactive}>
 *   <ExpensiveComponent />
 * </Freeze>
 * ```
 * 
 * Features:
 * - No Suspense usage (Fabric-safe)
 * - Maintains component state when frozen
 * - Instant resume when unfrozen
 * - Native optimizations via NitroModule
 * - Supports nesting (frozen parent → all children frozen)
 * 
 * @example
 * ```tsx
 * // Screen navigation - freeze inactive screens
 * <Freeze freeze={!isActive} key={screenId}>
 *   <ScreenComponent />
 * </Freeze>
 * ```
 * 
 * @example
 * ```tsx
 * // Nested freezing
 * <Freeze freeze={parentInactive}>
 *   <ParentComponent />
 *   <Freeze freeze={childInactive}>
 *     <ChildComponent /> {/* Frozen if parent OR child is inactive */}
 *   </Freeze>
 * </Freeze>
 * ```
 */
export const Freeze = React.memo(FreezeInner, areEqual);

const styles = StyleSheet.create({
  active: {
    flex: 1,
  },
  frozen: {
    flex: 1,
    opacity: 0,
  },
});
