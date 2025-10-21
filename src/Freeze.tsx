import React, { memo, useMemo, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { FreezeContext } from './context';
import { setViewFrozen } from './native';

export interface FreezeProps {
  /**
   * When true, the children are "frozen" - they won't re-render,
   * effects won't run, and events are disabled.
   */
  freeze: boolean;
  /**
   * The content to freeze/unfreeze
   */
  children: React.ReactNode;
  /**
   * Optional key for React reconciliation
   */
  key?: string | number;
}

/**
 * Freeze component - prevents re-renders and updates when freeze={true}
 * 
 * This is a drop-in replacement for react-freeze that works without Suspense.
 * It uses React.memo with a custom comparator to prevent updates when frozen,
 * and propagates frozen state via context to enable proper nesting behavior.
 * 
 * Nesting behavior:
 * - If a parent Freeze has freeze={true}, all descendant Freeze components are frozen
 * - If a child Freeze has freeze={true} but parent is unfrozen, only that subtree is frozen
 * - This allows fine-grained control over what parts of the tree are frozen
 * 
 * @example
 * ```tsx
 * <Freeze freeze={isInactive}>
 *   <ExpensiveComponent />
 * </Freeze>
 * ```
 */
const FreezeInner: React.FC<FreezeProps> = ({ freeze, children }) => {
  const parentContext = useContext(FreezeContext);
  const viewRef = useRef<View>(null);
  
  // If any ancestor is frozen, this subtree must be frozen too
  // This ensures proper nesting: parent freeze propagates down
  const effectiveFreeze = parentContext.isFrozen || freeze;
  
  // Create context value for descendants
  const contextValue = useMemo(
    () => ({ isFrozen: effectiveFreeze }),
    [effectiveFreeze]
  );

  // Apply native freeze optimizations when freeze state changes
  useEffect(() => {
    if (viewRef.current) {
      setViewFrozen(viewRef.current, effectiveFreeze);
    }
  }, [effectiveFreeze]);

  // When frozen, hide the view and disable interactions
  // Don't unmount - just make it invisible and non-interactive
  const containerStyle = effectiveFreeze
    ? styles.frozen
    : undefined;

  return (
    <FreezeContext.Provider value={contextValue}>
      <View ref={viewRef} style={containerStyle} pointerEvents={effectiveFreeze ? 'none' : 'auto'}>
        {children}
      </View>
    </FreezeContext.Provider>
  );
};

/**
 * Custom comparison function for React.memo
 * 
 * This is the key to preventing re-renders:
 * - If both prev and next are frozen, always return true (no update needed)
 * - Otherwise, only update if freeze state changed
 * 
 * This means when freeze={true}, the component becomes "locked" and won't
 * process any prop changes until freeze becomes false again.
 */
const areEqual = (prev: FreezeProps, next: FreezeProps): boolean => {
  // Both frozen? Skip update entirely - this is the freeze optimization
  if (prev.freeze && next.freeze) {
    return true;
  }
  
  // Freeze state changed? Must update
  if (prev.freeze !== next.freeze) {
    return false;
  }
  
  // Both unfrozen - allow normal React reconciliation
  // (children are compared by reference)
  return prev.children === next.children;
};

/**
 * Export the memoized Freeze component
 * This is the main public API, matching react-freeze's interface
 */
export const Freeze = memo(FreezeInner, areEqual);

const styles = StyleSheet.create({
  frozen: {
    opacity: 0,
  },
});

