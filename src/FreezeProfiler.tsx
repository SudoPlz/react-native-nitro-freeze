import * as React from 'react';
import { Freeze } from './Freeze';

export interface FreezeProfilerProps {
  children: React.ReactNode;
  freeze: boolean;
  testId: string;
  onReportedData?: (data: ProfileData) => void;
}
export interface ProfileData {
  freeze: boolean;                // Was freeze effective this render?
  renderTime: number;             // Render time (ms) - 0 when frozen, full time when active
  renderCount: number;            // Total renders completed
}
/**
 * FreezeProfiler - Measures render performance
 *
 * Uses a single React.Profiler around OptimizationWrapper to measure total render time.
 * When frozen, children don't render, so actualDuration is just wrapper overhead (~0.2ms).
 * When active, actualDuration includes full component tree render time.
 */
export default function FreezeProfiler({
  children,
  freeze,
  testId,
  onReportedData,
  ...otherProps
}: FreezeProfilerProps) {
  const renderCount = React.useRef(0);

  return (
    <React.Profiler
      id={`Performance-${testId}`}
      onRender={(id, phase, actualDuration) => {
        renderCount.current += 1;

        const data: ProfileData = {
          freeze,
          renderTime: actualDuration,
          renderCount: renderCount.current,
        };

        onReportedData?.(data);
      }}
    >
      <Freeze freeze={freeze} {...otherProps}>
        {children}
      </Freeze>
    </React.Profiler>
  );
}
