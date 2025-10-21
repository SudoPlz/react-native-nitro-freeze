import { Platform, findNodeHandle, NativeModules } from 'react-native';
import type { Component } from 'react';

/**
 * Native module interface for freeze optimizations.
 * This is implemented as a NitroModule for maximum performance.
 */
interface RNNitroFreezeModule {
  /**
   * Set the frozen state of a native view.
   * 
   * @param viewTag - The native view tag from findNodeHandle
   * @param frozen - Whether the view should be frozen
   */
  setViewFrozen(viewTag: number, frozen: boolean): void;
}

// Try to load the native module
let nativeModule: RNNitroFreezeModule | null = null;

try {
  // Try to load from NativeModules (standard bridge)
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const { RNNitroFreeze } = NativeModules;
    if (RNNitroFreeze) {
      nativeModule = RNNitroFreeze;
    }
  }
} catch (e) {
  // Native module not available - will fall back to JS-only implementation
  if (__DEV__) {
    console.log('RNNitroFreezeModule not available, using JS-only freeze implementation');
  }
}

/**
 * Set the frozen state of a view at the native level.
 * This applies platform-specific optimizations:
 * 
 * iOS:
 * - Disables user interaction
 * - Pauses layer animations (layer.speed = 0)
 * - Hides the view
 * 
 * Android:
 * - Sets view to INVISIBLE
 * - Disables drawing (willNotDraw)
 * - Disables touch events
 * 
 * @param ref - React ref to the view component
 * @param frozen - Whether to freeze or unfreeze the view
 */
export function setViewFrozen(ref: Component<any> | null, frozen: boolean): void {
  if (!ref) {
    return;
  }
  
  const viewTag = findNodeHandle(ref);
  if (viewTag == null) {
    return;
  }
  
  if (nativeModule) {
    try {
      nativeModule.setViewFrozen(viewTag, frozen);
    } catch (e) {
      if (__DEV__) {
        console.error('Failed to set native view frozen state:', e);
      }
    }
  }
  // If native module not available, the JS-only implementation
  // (opacity + pointerEvents) in Freeze.tsx still works
}

/**
 * Check if the native module is available.
 * Useful for testing or conditional behavior.
 */
export function isNativeModuleAvailable(): boolean {
  return nativeModule !== null;
}

