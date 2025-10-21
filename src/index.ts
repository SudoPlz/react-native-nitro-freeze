/**
 * react-native-nitro-freeze
 * 
 * A drop-in replacement for react-freeze that works without Suspense.
 * Compatible with React Native Fabric and bridgeless mode.
 * 
 * @example
 * ```tsx
 * import { Freeze } from 'react-native-nitro-freeze';
 * 
 * function App() {
 *   const [isInactive, setIsInactive] = useState(false);
 *   
 *   return (
 *     <Freeze freeze={isInactive}>
 *       <ExpensiveComponent />
 *     </Freeze>
 *   );
 * }
 * ```
 */

export { Freeze } from './Freeze';
export type { FreezeProps } from './Freeze';

// FreezeProfiler is exported for performance measurement
export { default as FreezeProfiler } from './FreezeProfiler';

// Context and hooks are internal but we export useIsFrozen for advanced use cases
export { useIsFrozen } from './context';

// Native module utilities (mostly for internal use and testing)
export { isNativeModuleAvailable } from './native';

