import { findNodeHandle, Platform } from 'react-native';
import type { Component } from 'react';

/**
 * Native module interface for freeze optimizations.
 * Implemented as a NitroModule for JSI performance.
 */
interface NitroFreezeModule {
  /**
   * Apply native-level freeze optimizations to a view.
   * 
   * @param viewTag - React Native view tag (from findNodeHandle)
   * @param frozen - Whether to freeze (true) or unfreeze (false)
   * 
   * iOS optimizations:
   * - setUserInteractionEnabled(false)
   * - layer.speed = 0 (pause animations)
   * - setHidden(true)
   * 
   * Android optimizations:
   * - setWillNotDraw(true)
   * - setVisibility(View.INVISIBLE)
   * - Disable gesture recognizers
   */
  setViewFrozen(viewTag: number, frozen: boolean): void;
}

/**
 * Lazy-loaded native module.
 * Returns null if native module is not available (graceful degradation).
 */
let nativeModule: NitroFreezeModule | null = null;

try {
  // Try to load the NitroModule
  // In a real NitroModule setup, this would be:
  // nativeModule = require('./NitroFreezeModule').default;
  // For now, we'll use a fallback that works without native code
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // Attempt to require the native module
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const NativeNitroFreeze = require('react-native').NativeModules.RNNitroFreeze;
    nativeModule = NativeNitroFreeze || null;
  }
} catch (e) {
  // Native module not available - will use JS-only implementation
  if (__DEV__) {
    console.warn(
      'react-native-nitro-freeze: Native module not available. ' +
      'Using JS-only implementation. For best performance, rebuild the app.'
    );
  }
}

/**
 * Apply native freeze optimizations to a React Native component.
 * 
 * @param ref - React component ref
 * @param frozen - Whether to freeze or unfreeze
 * 
 * @internal
 */
export function setNativeFreeze(
  ref: Component | null,
  frozen: boolean
): void {
  if (!ref || !nativeModule) {
    // Native module not available or ref is null
    return;
  }

  const viewTag = findNodeHandle(ref);
  if (viewTag != null) {
    try {
      nativeModule.setViewFrozen(viewTag, frozen);
    } catch (e) {
      if (__DEV__) {
        console.error('react-native-nitro-freeze: Failed to set native freeze:', e);
      }
    }
  }
}

/**
 * Check if native module is available.
 * Useful for conditional behavior or diagnostics.
 * 
 * @returns true if NitroModule is loaded
 */
export function isNativeModuleAvailable(): boolean {
  return nativeModule !== null;
}
