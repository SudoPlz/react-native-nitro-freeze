/**
 * NitroModule specification for react-native-nitro-freeze.
 * 
 * This file defines the TypeScript interface for the native module.
 * The actual implementation is in:
 * - iOS: ios/RNNitroFreeze.mm
 * - Android: android/src/main/java/com/reactnativenitrofreeze/RNNitroFreezeModule.java
 * 
 * @see https://github.com/margelo/nitro for NitroModule documentation
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Set freeze state on a native view.
   * 
   * @param viewTag - React Native view tag (from findNodeHandle)
   * @param frozen - true to freeze, false to unfreeze
   */
  setViewFrozen(viewTag: number, frozen: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNitroFreeze');
