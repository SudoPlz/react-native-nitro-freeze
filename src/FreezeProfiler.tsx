import React from 'react';
import { Freeze } from './Freeze';

interface FreezeProfilerProps {
  children: React.ReactNode;
  freeze: boolean;
  componentName: string;
  onReportedData?: (data: {
    parentRenderTime: number; // Current render's parent component render time (ms)
    childRenderTime: number; // Current render's child component render time (ms) - 0 when frozen
    freeze: boolean; // Whether freeze was effective this render (freeze=true AND childRenderTime=0)
    parentRenderCount: number; // Total number of parent renders completed since component mount
    childRenderCount: number; // Total number of child renders completed since component mount
    totalParentRenderTime: number; // Cumulative sum of all parent render times (ms)
    totalChildRenderTime: number; // Cumulative sum of all child render times (ms)
    averageParentRenderTime: number; // Average parent render time across all renders (ms)
    averageChildRenderTime: number; // Average child render time across all renders (ms)
  }) => void;
}

export default function FreezeProfiler({
  children,
  freeze,
  componentName,
  onReportedData,
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

  const reportMetrics = React.useCallback((currentRenderId: number) => {
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

      // Calculate averages (using parentRenderCount for all calculations)
      const { parentRenderCount, childRenderCount, totalParentRenderTime, totalChildRenderTime } = cumulativeMetrics.current;
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
  }, [freeze, onReportedData]);

  return (
    <React.Profiler
      id={`FreezeParent-${componentName}`}
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
        // Increment render ID for each new render cycle (parent runs first)

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
        reportMetrics(currentRenderId);
        renderId.current += 1;
      }}
    >
      <Freeze freeze={freeze}>
        <React.Profiler
          id={`FreezeChild-${componentName}`}
          onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
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

