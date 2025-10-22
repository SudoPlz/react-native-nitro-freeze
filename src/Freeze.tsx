import React, { useContext, useMemo, Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { FreezeContext } from './context';

export interface FreezeProps {
  freeze: boolean;
  children: React.ReactNode;
  hideContent?: boolean;
}

/**
 * FreezeGuard - Class component that registers/unregisters frozen fiber with FiberRoot
 * This allows the React Native patch to block state updates for frozen subtrees
 */
class FreezeGuard extends Component<{ frozen: boolean; children: React.ReactNode }> {
  componentDidMount() {
    if (this.props.frozen) {
      this.registerWithFiberRoot();
    }
  }
  
  componentWillUnmount() {
    this.unregisterFromFiberRoot();
  }
  
  componentDidUpdate(prevProps: { frozen: boolean }) {
    if (this.props.frozen !== prevProps.frozen) {
      if (this.props.frozen) {
        this.registerWithFiberRoot();
      } else {
        this.unregisterFromFiberRoot();
      }
    }
  }
  
  render() {
    // Register during render for immediate effect
    if (this.props.frozen) {
      this.registerWithFiberRoot();
    }
    
    return <>{this.props.children}</>;
  }
  
  private registerWithFiberRoot() {
    try {
      const fiber = (this as any)._reactInternals;
      if (!fiber) return;
      
      // Traverse up to find the FiberRoot
      let node = fiber;
      while (node.return) {
        node = node.return;
      }
      
      const fiberRoot = node.stateNode;
      if (fiberRoot) {
        // Register this fiber as frozen
        // The React Native patch checks these properties to block state updates
        (fiberRoot as any).__frozenFiber = fiber;
        (fiberRoot as any).__isFrozen = () => this.props.frozen;
      }
    } catch (e) {
      if (__DEV__) {
        console.error('[Freeze] Error registering frozen fiber:', e);
      }
    }
  }
  
  private unregisterFromFiberRoot() {
    try {
      const fiber = (this as any)._reactInternals;
      if (!fiber) return;
      
      let node = fiber;
      while (node.return) {
        node = node.return;
      }
      
      const fiberRoot = node.stateNode;
      if (fiberRoot) {
        delete (fiberRoot as any).__frozenFiber;
        delete (fiberRoot as any).__isFrozen;
      }
    } catch (e) {
      if (__DEV__) {
        console.error('[Freeze] Error unregistering frozen fiber:', e);
      }
    }
  }
}

/**
 * Freeze component - Prevents re-renders and state updates for frozen subtrees
 * 
 * Requires a patched React Native renderer that blocks setState/useReducer
 * for components within a frozen subtree.
 * 
 * @param freeze - Whether to freeze the component tree
 * @param children - The component tree to freeze
 * @param hideContent - Whether to hide content when frozen (default: false)
 */
export function Freeze({ freeze, children, hideContent = false }: FreezeProps) {
  const parentContext = useContext(FreezeContext);
  
  // Inherit frozen state from parent
  const effectiveFreeze = parentContext.isFrozen || freeze;
  
  const contextValue = useMemo(
    () => ({ isFrozen: effectiveFreeze }),
    [effectiveFreeze]
  );

  const containerStyle = effectiveFreeze && hideContent
    ? styles.frozen
    : undefined;

  return (
    <FreezeContext.Provider value={contextValue}>
      <View 
        style={containerStyle} 
        pointerEvents={effectiveFreeze ? 'none' : 'auto'}
      >
        <FreezeGuard frozen={effectiveFreeze}>
          {children}
        </FreezeGuard>
      </View>
    </FreezeContext.Provider>
  );
}

const styles = StyleSheet.create({
  frozen: {
    opacity: 0,
  },
});
