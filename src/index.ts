/**
 * react-zombie-freeze
 * 
 * Freeze React components without Suspense.
 * Keep content visible, block interactions, prevent re-renders.
 * 
 * @example
 * ```tsx
 * import { Freeze } from 'react-zombie-freeze';
 * 
 * function App() {
 *   const [frozen, setFrozen] = useState(false);
 *   
 *   return (
 *     <Freeze freeze={frozen}>
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

// Context hook for checking if component is frozen
export { useIsFrozen } from './context';


