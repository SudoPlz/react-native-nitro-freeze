/**
 * react-native-nitro-freeze
 * 
 * A React Native library that replicates react-freeze without Suspense.
 * Fabric-safe, NitroModule-powered performance optimizations.
 * 
 * @packageDocumentation
 */

// Main exports - compatible with react-freeze API
export { Freeze } from './Freeze';
export type { FreezeProps } from './Freeze';

// Performance profiling
export { FreezeProfiler } from './FreezeProfiler';
export type { FreezeProfilerProps, FreezeProfilerData } from './FreezeProfiler';

// Optional: Advanced hooks (not part of react-freeze API)
export {
  useFreezeState,
  useFreezeEffect,
  useFreezeMemo,
  useFreezeCallback,
} from './hooks';

// Optional: Native module utilities
export { isNativeModuleAvailable } from './native';

// Internal context (may be useful for advanced use cases)
export { useIsFrozen } from './context';
