import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { FreezeProfiler } from 'react-zombie-freeze';
import { ExpensiveList } from './ExpensiveList';
import { sharedStyles } from './sharedStyles';

/**
 * Demo with performance profiling
 */
export function ProfiledFreezeDemo() {
  const [freeze, setFreeze] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [totalMetrics, setTotalMetrics] = useState({
    frozenRenderTime: 0,
    unfrozenRenderTime: 0,
    frozenCount: 0,
    unfrozenCount: 0,
  });

  // Wrap setMetrics in useCallback to stabilize the reference
  // This prevents infinite loops when FreezeProfiler re-renders
  const handleReportedData = React.useCallback((data: any) => {
    setMetrics(data);

    // Accumulate metrics
    setTotalMetrics((prev) => ({
      frozenRenderTime:
        data.freeze ? prev.frozenRenderTime + data.renderTime : prev.frozenRenderTime,
      unfrozenRenderTime:
        !data.freeze ? prev.unfrozenRenderTime + data.renderTime : prev.unfrozenRenderTime,
      frozenCount: data.freeze ? prev.frozenCount + 1 : prev.frozenCount,
      unfrozenCount: !data.freeze ? prev.unfrozenCount + 1 : prev.unfrozenCount,
    }));
  }, []);

  const avgFrozenTime = totalMetrics.frozenCount > 0 
    ? totalMetrics.frozenRenderTime / totalMetrics.frozenCount 
    : 0;
  const avgUnfrozenTime = totalMetrics.unfrozenCount > 0 
    ? totalMetrics.unfrozenRenderTime / totalMetrics.unfrozenCount 
    : 0;
  const improvement = avgUnfrozenTime > 0 
    ? ((avgUnfrozenTime - avgFrozenTime) / avgUnfrozenTime) * 100 
    : 0;

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionTitle}>Performance Profiling Demo</Text>
      <Text style={sharedStyles.description}>
        Watch render times drop to nearly 0ms when frozen! This measures React re-render performance.
      </Text>

      <TouchableOpacity
        style={[sharedStyles.button, freeze && sharedStyles.buttonActive]}
        onPress={() => setFreeze(!freeze)}
      >
        <Text style={sharedStyles.buttonText}>
          {freeze ? '❄️ FROZEN' : '🔥 ACTIVE'}
        </Text>
      </TouchableOpacity>

      {metrics && (
        <View style={sharedStyles.metricsContainer}>
          <Text style={sharedStyles.metricsTitle}>Current Render Metrics:</Text>
          <View style={sharedStyles.metricsRow}>
            <Text style={sharedStyles.metricsLabel}>Render Time:</Text>
            <Text
              style={[
                sharedStyles.metricsValue,
                { color: metrics.renderTime < 1 ? '#10b981' : '#f59e0b' },
              ]}
            >
              {metrics.renderTime.toFixed(2)}ms
            </Text>
          </View>
          <View style={sharedStyles.metricsRow}>
            <Text style={sharedStyles.metricsLabel}>Total Renders:</Text>
            <Text style={sharedStyles.metricsValue}>{metrics.renderCount}</Text>
          </View>
          <View style={sharedStyles.metricsRow}>
            <Text style={sharedStyles.metricsLabel}>Freeze Effective:</Text>
            <Text
              style={[
                sharedStyles.metricsValue,
                { color: metrics.freeze ? '#10b981' : '#ef4444' },
              ]}
            >
              {metrics.freeze ? '✅ YES' : '❌ NO'}
            </Text>
          </View>
        </View>
      )}

      {totalMetrics.frozenCount > 0 && totalMetrics.unfrozenCount > 0 && (
        <View
          style={[
            sharedStyles.metricsContainer,
            { backgroundColor: '#f0fdf4', borderLeftWidth: 4, borderLeftColor: '#10b981' },
          ]}
        >
          <Text style={[sharedStyles.metricsTitle, { color: '#059669' }]}>
            📊 Performance Improvement:
          </Text>
          <View style={sharedStyles.metricsRow}>
            <Text style={sharedStyles.metricsLabel}>🔥 Avg Unfrozen:</Text>
            <Text style={sharedStyles.metricsValue}>
              {avgUnfrozenTime.toFixed(2)}ms ({totalMetrics.unfrozenCount} renders)
            </Text>
          </View>
          <View style={sharedStyles.metricsRow}>
            <Text style={sharedStyles.metricsLabel}>❄️ Avg Frozen:</Text>
            <Text style={sharedStyles.metricsValue}>
              {avgFrozenTime.toFixed(2)}ms ({totalMetrics.frozenCount} renders)
            </Text>
          </View>
          <View style={sharedStyles.metricsRow}>
            <Text style={[sharedStyles.metricsLabel, { fontWeight: '700' }]}>⚡ Improvement:</Text>
            <Text
              style={[
                sharedStyles.metricsValue,
                {
                  color: '#10b981',
                  fontWeight: '700',
                  fontSize: 14,
                },
              ]}
            >
              {improvement.toFixed(1)}% faster
            </Text>
          </View>
        </View>
      )}

      <FreezeProfiler
        freeze={freeze}
        testId="ProfiledList"
        onReportedData={handleReportedData}
      >
        <ExpensiveList title="Profiled Component" color="#F0F0FF" />
      </FreezeProfiler>
    </View>
  );
}
