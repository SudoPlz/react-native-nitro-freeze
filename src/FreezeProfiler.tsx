import * as React from 'react';
import { Freeze } from './Freeze';

/**
 * Performance data reported by FreezeProfiler
 */
export interface FreezeProfilerData {
  /** Current render's parent component render time (ms) */
  parentRenderTime: number;
  
  /** Current render's child component render time (ms) - 0 when frozen */
  childRenderTime: number;
  
  /** Whether freeze was effective this render (freeze=true AND childRenderTime=0) */
  freeze: boolean;
  
  /** Total number of parent renders completed since component mount */
  parentRenderCount: number;
  
  /** Total number of child renders completed since component mount */
  childRenderCount: number;
  
  /** Cumulative sum of all parent render times (ms) */
  totalParentRenderTime: number;
  
  /** Cumulative sum of all child render times (ms) */
  totalChildRenderTime: number;
  
  /** Average parent render time across all renders (ms) */
  averageParentRenderTime: number;
  
  /** Average child render time across all renders (ms) */
  averageChildRenderTime: number;
}

export interface FreezeProfilerProps {
  /** The children to wrap in Freeze + profiling */
  children: React.ReactNode;
  
  /** Whether to freeze the children */
  freeze: boolean;
  
  /** Name identifier for this profiler (used in React Profiler ID) */
  componentName: string;
  
  /** Callback invoked after each render with performance data */
  onReportedData?: (data: FreezeProfilerData) => void;
  
  /** 
   * Enable profiling. Defaults to __DEV__.
   * Set to false to disable profiling overhead in production.
   */
  enabled?: boolean;
}

/**
 * FreezeProfiler - Wraps Freeze component with React Profiler to measure performance.
 * 
 * Tracks render times and counts to verify freeze effectiveness.
 * When freeze=true and working correctly, childRenderTime should be 0.
 * 
 * @example
 * ```tsx
 * <FreezeProfiler
 *   freeze={isInactive}
 *   componentName="HomeScreen"
 *   onReportedData={(data) => {
 *     console.log('Freeze effective:', data.freeze);
 *     console.log('Child render time:', data.childRenderTime);
 *   }}
 * >
 *   <ExpensiveComponent />
 * </FreezeProfiler>
 * ```
 */
export function FreezeProfiler({
  children,
  freeze,
  componentName,
  onReportedData,
  enabled = __DEV__,
}: FreezeProfilerProps) {
  const renderId = React.useRef(0);
  const metrics = React.useRef<{
    [renderId: number]: {
      parentRenderTime: number;
      childRenderTime: number;
    };
  }>({});

  // Track cumulative metrics across all renders
  const cumulativeMetrics = React.useRef({
    parentRenderCount: 0,
    childRenderCount: 0,
    totalParentRenderTime: 0,
    totalChildRenderTime: 0,
  });

  const reportMetrics = React.useCallback(
    (currentRenderId: number) => {
      const currentMetrics = metrics.current[currentRenderId];

      // Check if we have parent data and either child data OR if child is frozen
      const hasParentData = currentMetrics && currentMetrics.parentRenderTime !== -1;
      const hasChildData = currentMetrics && currentMetrics.childRenderTime !== -1;
      const isChildFrozen = freeze && !hasChildData;

      if (hasParentData && (hasChildData || isChildFrozen)) {
        const { parentRenderTime } = currentMetrics;
        const childRenderTime = isChildFrozen ? 0 : (currentMetrics.childRenderTime || 0);
        const freezeEffective = freeze && childRenderTime === 0;

        // Update cumulative metrics
        cumulativeMetrics.current.totalParentRenderTime += parentRenderTime;
        cumulativeMetrics.current.totalChildRenderTime += childRenderTime;

        // Calculate averages
        const {
          parentRenderCount,
          childRenderCount,
          totalParentRenderTime,
          totalChildRenderTime,
        } = cumulativeMetrics.current;
        
        const averageParentRenderTime = totalParentRenderTime / parentRenderCount;
        const averageChildRenderTime = totalChildRenderTime / parentRenderCount;

        onReportedData?.({
          parentRenderTime,
          childRenderTime,
          freeze: freezeEffective,
          parentRenderCount,
          childRenderCount,
          totalParentRenderTime,
          totalChildRenderTime,
          averageParentRenderTime,
          averageChildRenderTime,
        });

        // Clean up old render data
        delete metrics.current[currentRenderId];
      }
    },
    [freeze, onReportedData]
  );

  // If profiling is disabled, just render Freeze without overhead
  if (!enabled) {
    return <Freeze freeze={freeze}>{children}</Freeze>;
  }

  return (
    <React.Profiler
      id={`FreezeParent-${componentName}`}
      onRender={(id, phase, actualDuration) => {
        const currentRenderId = renderId.current;

        // Increment parent render count
        cumulativeMetrics.current.parentRenderCount += 1;

        if (!metrics.current[currentRenderId]) {
          metrics.current[currentRenderId] = {
            parentRenderTime: -1,
            childRenderTime: -1,
          };
        }

        metrics.current[currentRenderId].parentRenderTime = actualDuration;
        
        // Report metrics (child will update if it renders)
        reportMetrics(currentRenderId);
        renderId.current += 1;
      }}
    >
      <Freeze freeze={freeze}>
        <React.Profiler
          id={`FreezeChild-${componentName}`}
          onRender={(id, phase, actualDuration) => {
            const currentRenderId = renderId.current;

            cumulativeMetrics.current.childRenderCount += 1;

            if (!metrics.current[currentRenderId]) {
              metrics.current[currentRenderId] = {
                parentRenderTime: -1,
                childRenderTime: -1,
              };
            }

            metrics.current[currentRenderId].childRenderTime = actualDuration;
            reportMetrics(currentRenderId);
          }}
        >
          {children}
        </React.Profiler>
      </Freeze>
    </React.Profiler>
  );
}
